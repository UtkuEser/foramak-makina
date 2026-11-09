-- ================================================================
-- Foramak Makine — CAD dosya desteği (ileriye dönük migration)
--
-- 20261102120000_quote_requests.sql uygulanmış projede çalışır.
-- Tablo silmez / yeniden oluşturmaz, veri silmez. İki kez çalıştırılırsa
-- aynı sonucu verir.
--
-- 1. quote-attachments bucket'ının izinli içerik türleri genişler
--    (supabase/functions/_shared/quote-config.ts ile aynı liste)
-- 2. quote_attachments.storage_path uzantı kısıtı yeni formatları kabul eder
-- ================================================================


-- 1) Bucket: private kalır, dosya başına 20 MB, yeni içerik türleri
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'quote-attachments',
    'quote-attachments',
    false,
    20971520,
    array[
        'application/pdf',
        'image/vnd.dwg',
        'image/vnd.dxf',
        'model/step',
        'model/iges',
        'model/stl',
        'image/jpeg',
        'image/png',
        'application/zip',
        'application/octet-stream'      -- SolidWorks (SLDPRT/SLDASM/SLDDRW), Parasolid (X_T/X_B)
    ]
)
on conflict (id) do update
    set public             = false,
        file_size_limit    = excluded.file_size_limit,
        allowed_mime_types = excluded.allowed_mime_types;


-- 2) storage_path uzantı kısıtı: storage_path'e ait mevcut CHECK kısıtı
--    (adı ne olursa olsun) kaldırılır ve genişletilmiş haliyle eklenir.
--    Mevcut satırlar eski desene uyduğu için yeni kısıtı da sağlar.
do $$
declare
    c record;
begin
    for c in
        select con.conname
          from pg_constraint con
          join pg_attribute att
            on att.attrelid = con.conrelid
           and att.attnum = any (con.conkey)
         where con.conrelid = 'public.quote_attachments'::regclass
           and con.contype = 'c'
           and att.attname = 'storage_path'
    loop
        execute format('alter table public.quote_attachments drop constraint %I', c.conname);
    end loop;
end;
$$;

alter table public.quote_attachments
    add constraint quote_attachments_storage_path_check
    check (storage_path ~ '^requests/[0-9a-f-]{36}/[0-9a-f-]{36}\.(pdf|dwg|dxf|sldprt|sldasm|slddrw|step|stp|iges|igs|x_t|x_b|stl|jpg|jpeg|png|zip)$');
