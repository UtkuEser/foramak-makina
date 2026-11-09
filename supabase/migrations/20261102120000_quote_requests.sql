-- ================================================================
-- Foramak Makine — Teklif talep altyapısı
--
-- quote_requests / quote_attachments tabloları, private Storage bucket'ı
-- ve yalnızca Edge Function'ların (service_role) çağırdığı yardımcı
-- fonksiyonlar. anon / authenticated rollerinin bu tablolara ve
-- fonksiyonlara hiçbir erişimi yoktur.
-- ================================================================


-- ----------------------------------------------------------------
-- Tablolar
-- ----------------------------------------------------------------
create table public.quote_requests (
    id                          uuid primary key default gen_random_uuid(),
    reference_no                text unique,
    client_submission_id        uuid not null unique,

    company_name                text not null check (char_length(company_name) between 2 and 200),
    contact_name                text not null check (char_length(contact_name) between 2 and 120),
    phone                       text not null check (char_length(phone) between 7 and 30),
    email                       text not null check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
    service_type                text not null check (char_length(service_type) <= 60),
    material_type               text check (char_length(material_type) <= 60),
    dimensions                  text check (char_length(dimensions) <= 300),
    quantity                    text check (char_length(quantity) <= 120),
    expected_deadline           text check (char_length(expected_deadline) <= 120),
    project_description         text check (char_length(project_description) <= 5000),
    kvkk_acknowledged_at        timestamptz not null,

    status                      text not null default 'pending'
                                check (status in ('pending', 'received', 'cancelled')),
    notification_status         text not null default 'pending'
                                check (notification_status in ('pending', 'sent', 'failed')),
    notification_attempts       integer not null default 0,
    notification_locked_until   timestamptz,
    notification_sent_at        timestamptz,
    notification_provider_id    text,
    notification_last_error     text,

    finalize_token_hash         text not null check (finalize_token_hash ~ '^[0-9a-f]{64}$'),
    received_at                 timestamptz,
    created_at                  timestamptz not null default now(),
    updated_at                  timestamptz not null default now(),

    constraint quote_requests_received_has_reference
        check (status <> 'received' or (reference_no is not null and received_at is not null))
);

comment on table public.quote_requests is
    'Teklif Al formundan gelen talepler. pending = form gönderildi, dosyalar bekleniyor; received = talep tamamlandı; cancelled = elle iptal.';
comment on column public.quote_requests.notification_status is
    'sent = Resend API e-postayı kabul etti. Gelen kutusuna teslim garantisi değildir; teslim durumu Resend panelinden izlenir.';
comment on column public.quote_requests.client_submission_id is
    'Tarayıcının form başına ürettiği UUID. Aynı formun tekrar gönderimi ikinci kayıt oluşturmaz.';

create index quote_requests_status_updated_idx on public.quote_requests (status, updated_at);
create index quote_requests_notification_due_idx on public.quote_requests (received_at)
    where status = 'received' and notification_status <> 'sent';


create table public.quote_attachments (
    id                  uuid primary key default gen_random_uuid(),
    quote_request_id    uuid not null references public.quote_requests (id) on delete cascade,
    storage_path        text not null unique
                        check (storage_path ~ '^requests/[0-9a-f-]{36}/[0-9a-f-]{36}\.(pdf|dxf|dwg|jpg|jpeg|png)$'),
    original_filename   text not null check (char_length(original_filename) between 1 and 255),
    file_size           bigint not null check (file_size > 0),
    content_type        text not null,
    uploaded_at         timestamptz,
    created_at          timestamptz not null default now()
);

comment on table public.quote_attachments is
    'Teklif dosyaları. Dosyanın kendisi private quote-attachments bucket''ında storage_path altında durur; orijinal ad yalnızca burada saklanır.';

create index quote_attachments_quote_request_id_idx on public.quote_attachments (quote_request_id);


-- Basit sabit pencereli hız sınırı sayaçları (anahtarlar IP'nin tuzlu özetidir, ham IP saklanmaz)
create table public.quote_rate_limits (
    bucket_key      text not null,
    window_start    timestamptz not null,
    hits            integer not null default 0,
    primary key (bucket_key, window_start)
);

-- FOR-YYYY-NNNN referans numaraları için yıllık sayaç
create table public.quote_reference_counters (
    year            integer primary key,
    last_number     integer not null default 0
);


-- ----------------------------------------------------------------
-- updated_at
-- ----------------------------------------------------------------
create function public.quote_set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

create trigger quote_requests_set_updated_at
    before update on public.quote_requests
    for each row execute function public.quote_set_updated_at();


-- ----------------------------------------------------------------
-- Row Level Security: politika yok → anon / authenticated hiçbir satırı
-- göremez veya değiştiremez. service_role RLS'i atlar (yalnızca Edge Function).
-- ----------------------------------------------------------------
alter table public.quote_requests           enable row level security;
alter table public.quote_attachments        enable row level security;
alter table public.quote_rate_limits        enable row level security;
alter table public.quote_reference_counters enable row level security;

revoke all on table public.quote_requests           from public, anon, authenticated;
revoke all on table public.quote_attachments        from public, anon, authenticated;
revoke all on table public.quote_rate_limits        from public, anon, authenticated;
revoke all on table public.quote_reference_counters from public, anon, authenticated;

grant select, insert, update, delete on table public.quote_requests           to service_role;
grant select, insert, update, delete on table public.quote_attachments        to service_role;
grant select, insert, update, delete on table public.quote_rate_limits        to service_role;
grant select, insert, update, delete on table public.quote_reference_counters to service_role;


-- ----------------------------------------------------------------
-- Private Storage bucket
-- Limitler supabase/functions/_shared/quote-config.ts ile aynıdır;
-- quote-maintenance her çalıştığında bucket'ı o dosyaya eşitler.
-- storage.objects üzerinde bu bucket için politika YOKTUR: okuma/yazma
-- yalnızca service_role ve sunucunun ürettiği signed upload URL'leri ile.
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'quote-attachments',
    'quote-attachments',
    false,
    20971520,
    array['application/pdf', 'image/vnd.dxf', 'image/vnd.dwg', 'image/jpeg', 'image/png']
)
on conflict (id) do update
    set public             = false,
        file_size_limit    = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;


-- ----------------------------------------------------------------
-- Hız sınırı: true = izin ver, false = sınır aşıldı
-- ----------------------------------------------------------------
create function public.quote_rate_limit_hit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
set search_path = ''
as $$
declare
    v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
    v_hits   integer;
begin
    insert into public.quote_rate_limits as r (bucket_key, window_start, hits)
    values (p_key, v_window, 1)
    on conflict (bucket_key, window_start) do update set hits = r.hits + 1
    returning hits into v_hits;

    return v_hits <= p_limit;
end;
$$;


-- ----------------------------------------------------------------
-- quote-init: talebi pending olarak oluşturur veya aynı client_submission_id
-- ile tekrar gelen pending talebi yeniden başlatır (tek kayıt korunur).
-- p_files: [{ "id": uuid, "extension": "pdf", "original_filename": "...",
--             "file_size": 123, "content_type": "application/pdf" }]
-- ----------------------------------------------------------------
create function public.quote_init_request(
    p_submission_id             uuid,
    p_fields                    jsonb,
    p_token_hash                text,
    p_files                     jsonb,
    p_max_pending_attachments   integer
)
returns jsonb
language plpgsql
set search_path = ''
as $$
declare
    v_existing      public.quote_requests;
    v_quote_id      uuid;
    v_old_paths     text[] := '{}';
    v_attachments   jsonb;
    v_new_count     integer := coalesce(jsonb_array_length(p_files), 0);
    v_pending_count integer;
begin
    select * into v_existing
      from public.quote_requests
     where client_submission_id = p_submission_id
       for update;

    if v_existing.id is not null then
        if v_existing.status = 'received' then
            return jsonb_build_object(
                'result', 'already_received',
                'quote_id', v_existing.id,
                'reference_no', v_existing.reference_no,
                'notification_status', v_existing.notification_status
            );
        elsif v_existing.status <> 'pending' then
            return jsonb_build_object('result', 'closed');
        end if;
    end if;

    -- Tamamlanmamış taleplerin tutabileceği toplam dosya sayısı sınırı
    -- (anonim kullanıcıların depolamayı doldurmasını engeller)
    if v_new_count > 0 then
        select count(*) into v_pending_count
          from public.quote_attachments a
          join public.quote_requests q on q.id = a.quote_request_id
         where q.status = 'pending'
           and q.updated_at > now() - interval '24 hours'
           and q.client_submission_id <> p_submission_id;

        if v_pending_count + v_new_count > p_max_pending_attachments then
            return jsonb_build_object('result', 'capacity');
        end if;
    end if;

    if v_existing.id is not null then
        with removed as (
            delete from public.quote_attachments
             where quote_request_id = v_existing.id
         returning storage_path
        )
        select coalesce(array_agg(storage_path), '{}') into v_old_paths from removed;

        update public.quote_requests
           set company_name         = p_fields->>'company_name',
               contact_name         = p_fields->>'contact_name',
               phone                = p_fields->>'phone',
               email                = p_fields->>'email',
               service_type         = p_fields->>'service_type',
               material_type        = p_fields->>'material_type',
               dimensions           = p_fields->>'dimensions',
               quantity             = p_fields->>'quantity',
               expected_deadline    = p_fields->>'expected_deadline',
               project_description  = p_fields->>'project_description',
               kvkk_acknowledged_at = now(),
               finalize_token_hash  = p_token_hash
         where id = v_existing.id;

        v_quote_id := v_existing.id;
    else
        insert into public.quote_requests (
            client_submission_id, company_name, contact_name, phone, email,
            service_type, material_type, dimensions, quantity, expected_deadline,
            project_description, kvkk_acknowledged_at, finalize_token_hash
        ) values (
            p_submission_id,
            p_fields->>'company_name',
            p_fields->>'contact_name',
            p_fields->>'phone',
            p_fields->>'email',
            p_fields->>'service_type',
            p_fields->>'material_type',
            p_fields->>'dimensions',
            p_fields->>'quantity',
            p_fields->>'expected_deadline',
            p_fields->>'project_description',
            now(),
            p_token_hash
        )
        returning id into v_quote_id;
    end if;

    with inserted as (
        insert into public.quote_attachments (id, quote_request_id, storage_path, original_filename, file_size, content_type)
        select (f->>'id')::uuid,
               v_quote_id,
               'requests/' || v_quote_id || '/' || (f->>'id') || '.' || (f->>'extension'),
               f->>'original_filename',
               (f->>'file_size')::bigint,
               f->>'content_type'
          from jsonb_array_elements(coalesce(p_files, '[]'::jsonb)) as f
     returning id, storage_path
    )
    select coalesce(jsonb_agg(jsonb_build_object('id', id, 'storage_path', storage_path)), '[]'::jsonb)
      into v_attachments
      from inserted;

    return jsonb_build_object(
        'result', case when v_existing.id is not null then 'restarted' else 'created' end,
        'quote_id', v_quote_id,
        'attachments', v_attachments,
        'old_paths', to_jsonb(v_old_paths)
    );
end;
$$;


-- ----------------------------------------------------------------
-- Talebin dosyaları ve Storage'daki gerçek nesne bilgileri
-- (object_size null ise dosya henüz yüklenmemiştir)
-- ----------------------------------------------------------------
create function public.quote_attachment_objects(p_quote_id uuid)
returns table (
    attachment_id       uuid,
    storage_path        text,
    original_filename   text,
    content_type        text,
    declared_size       bigint,
    object_size         bigint,
    object_mimetype     text
)
language sql
stable
security definer
set search_path = ''
as $$
    select a.id,
           a.storage_path,
           a.original_filename,
           a.content_type,
           a.file_size,
           (o.metadata->>'size')::bigint,
           o.metadata->>'mimetype'
      from public.quote_attachments a
      left join storage.objects o
             on o.bucket_id = 'quote-attachments'
            and o.name = a.storage_path
     where a.quote_request_id = p_quote_id
     order by a.created_at, a.id;
$$;


-- ----------------------------------------------------------------
-- quote-finalize: dosyaları Storage üzerinden doğrular, referans numarası
-- verir ve talebi received yapar. Aynı talep için tekrar çağrılırsa ikinci
-- kez tamamlamaz; mevcut sonucu döner.
-- ----------------------------------------------------------------
create function public.quote_finalize_request(
    p_quote_id          uuid,
    p_token_hash        text,
    p_max_file_bytes    bigint,
    p_max_total_bytes   bigint
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
    v_quote     public.quote_requests;
    v_missing   integer;
    v_invalid   integer;
    v_total     bigint;
    v_year      integer;
    v_number    integer;
    v_reference text;
begin
    select * into v_quote from public.quote_requests where id = p_quote_id for update;

    if v_quote.id is null or v_quote.finalize_token_hash <> p_token_hash then
        return jsonb_build_object('result', 'not_found');
    end if;

    if v_quote.status = 'received' then
        return jsonb_build_object(
            'result', 'already_received',
            'reference_no', v_quote.reference_no,
            'notification_status', v_quote.notification_status
        );
    elsif v_quote.status <> 'pending' then
        return jsonb_build_object('result', 'closed');
    end if;

    select count(*) filter (where o.id is null),
           count(*) filter (where o.id is not null and (
                coalesce((o.metadata->>'size')::bigint, 0) <= 0
                or (o.metadata->>'size')::bigint > p_max_file_bytes
                or (o.metadata->>'mimetype') is distinct from a.content_type)),
           coalesce(sum((o.metadata->>'size')::bigint), 0)
      into v_missing, v_invalid, v_total
      from public.quote_attachments a
      left join storage.objects o
             on o.bucket_id = 'quote-attachments'
            and o.name = a.storage_path
     where a.quote_request_id = p_quote_id;

    if v_missing > 0 then
        return jsonb_build_object('result', 'upload_incomplete', 'missing', v_missing);
    elsif v_invalid > 0 then
        return jsonb_build_object('result', 'invalid_file');
    elsif v_total > p_max_total_bytes then
        return jsonb_build_object('result', 'too_large');
    end if;

    update public.quote_attachments a
       set file_size   = (o.metadata->>'size')::bigint,
           uploaded_at = now()
      from storage.objects o
     where a.quote_request_id = p_quote_id
       and o.bucket_id = 'quote-attachments'
       and o.name = a.storage_path;

    v_year := extract(year from (now() at time zone 'Europe/Istanbul'))::integer;

    insert into public.quote_reference_counters as c (year, last_number)
    values (v_year, 1)
    on conflict (year) do update set last_number = c.last_number + 1
    returning last_number into v_number;

    v_reference := 'FOR-' || v_year || '-' || lpad(v_number::text, greatest(4, char_length(v_number::text)), '0');

    update public.quote_requests
       set status       = 'received',
           received_at  = now(),
           reference_no = v_reference
     where id = p_quote_id;

    return jsonb_build_object(
        'result', 'received',
        'reference_no', v_reference,
        'notification_status', v_quote.notification_status
    );
end;
$$;


-- ----------------------------------------------------------------
-- E-posta bildirimi: aynı anda tek gönderim (kilit) + deneme sayacı
-- ----------------------------------------------------------------
create function public.quote_claim_notification(p_quote_id uuid, p_lock_seconds integer, p_max_attempts integer)
returns setof public.quote_requests
language sql
set search_path = ''
as $$
    update public.quote_requests
       set notification_attempts     = notification_attempts + 1,
           notification_locked_until = now() + make_interval(secs => p_lock_seconds)
     where id = p_quote_id
       and status = 'received'
       and notification_status <> 'sent'
       and notification_attempts < p_max_attempts
       and (notification_locked_until is null or notification_locked_until < now())
 returning *;
$$;

create function public.quote_record_notification(
    p_quote_id      uuid,
    p_sent          boolean,
    p_provider_id   text,
    p_error         text
)
returns void
language sql
set search_path = ''
as $$
    update public.quote_requests
       set notification_status       = case when p_sent then 'sent' else 'failed' end,
           notification_sent_at      = case when p_sent then now() else notification_sent_at end,
           notification_provider_id  = coalesce(p_provider_id, notification_provider_id),
           notification_last_error   = case when p_sent then null else left(p_error, 500) end,
           notification_locked_until = null
     where id = p_quote_id
       and notification_status <> 'sent';
$$;

create function public.quote_notifications_due(p_max_attempts integer, p_limit integer)
returns setof uuid
language sql
stable
set search_path = ''
as $$
    select id
      from public.quote_requests
     where status = 'received'
       and notification_status <> 'sent'
       and notification_attempts < p_max_attempts
       and (notification_locked_until is null or notification_locked_until < now())
       and received_at < now() - interval '1 minute'
     order by received_at
     limit p_limit;
$$;


-- ----------------------------------------------------------------
-- Temizlik (quote-maintenance)
-- ----------------------------------------------------------------
create function public.quote_delete_expired_pending(p_max_age_hours integer)
returns integer
language plpgsql
set search_path = ''
as $$
declare
    v_deleted integer;
begin
    with deleted as (
        delete from public.quote_requests
         where status = 'pending'
           and updated_at < now() - make_interval(hours => p_max_age_hours)
     returning 1
    )
    select count(*) into v_deleted from deleted;

    delete from public.quote_rate_limits where window_start < now() - interval '2 days';

    return v_deleted;
end;
$$;

-- Hiçbir quote_attachments satırına bağlı olmayan, yeterince eski nesneler.
-- Nesneler SQL ile değil Storage API ile silinir (fiziksel dosya da silinsin diye).
create function public.quote_orphan_objects(p_min_age_hours integer, p_limit integer)
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
    select o.name
      from storage.objects o
     where o.bucket_id = 'quote-attachments'
       and o.created_at < now() - make_interval(hours => p_min_age_hours)
       and not exists (
            select 1 from public.quote_attachments a where a.storage_path = o.name
       )
     order by o.created_at
     limit p_limit;
$$;


-- ----------------------------------------------------------------
-- Fonksiyon yetkileri: yalnızca service_role
-- storage.objects okuyan üç fonksiyon security definer'dır (service_role'ün
-- storage şeması yetkilerine bağlı kalmamak için); search_path boş, yürütme
-- yetkisi yalnızca service_role'de.
-- ----------------------------------------------------------------
revoke all on function public.quote_set_updated_at()                                        from public, anon, authenticated;
revoke all on function public.quote_rate_limit_hit(text, integer, integer)                  from public, anon, authenticated;
revoke all on function public.quote_init_request(uuid, jsonb, text, jsonb, integer)         from public, anon, authenticated;
revoke all on function public.quote_attachment_objects(uuid)                                from public, anon, authenticated;
revoke all on function public.quote_finalize_request(uuid, text, bigint, bigint)            from public, anon, authenticated;
revoke all on function public.quote_claim_notification(uuid, integer, integer)              from public, anon, authenticated;
revoke all on function public.quote_record_notification(uuid, boolean, text, text)          from public, anon, authenticated;
revoke all on function public.quote_notifications_due(integer, integer)                     from public, anon, authenticated;
revoke all on function public.quote_delete_expired_pending(integer)                         from public, anon, authenticated;
revoke all on function public.quote_orphan_objects(integer, integer)                        from public, anon, authenticated;

grant execute on function public.quote_rate_limit_hit(text, integer, integer)               to service_role;
grant execute on function public.quote_init_request(uuid, jsonb, text, jsonb, integer)      to service_role;
grant execute on function public.quote_attachment_objects(uuid)                             to service_role;
grant execute on function public.quote_finalize_request(uuid, text, bigint, bigint)         to service_role;
grant execute on function public.quote_claim_notification(uuid, integer, integer)           to service_role;
grant execute on function public.quote_record_notification(uuid, boolean, text, text)       to service_role;
grant execute on function public.quote_notifications_due(integer, integer)                  to service_role;
grant execute on function public.quote_delete_expired_pending(integer)                      to service_role;
grant execute on function public.quote_orphan_objects(integer, integer)                     to service_role;
