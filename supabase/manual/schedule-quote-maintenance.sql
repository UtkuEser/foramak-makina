-- ================================================================
-- quote-maintenance zamanlanmış görevi (ELLE çalıştırılır, migration değildir)
--
-- Supabase Dashboard → SQL Editor'da çalıştırın. Gizli değerler bu dosyaya
-- yazılmaz; 1. adımdaki iki satırı SQL Editor'da kendi değerlerinizle
-- çalıştırın (Vault'ta şifreli saklanır).
-- ================================================================

-- 1) Sırları Vault'a ekleyin (yalnızca bir kez, SQL Editor'da):
--    select vault.create_secret('https://<project-ref>.supabase.co', 'quote_project_url');
--    select vault.create_secret('<Edge Function MAINTENANCE_SECRET ile aynı değer>', 'quote_maintenance_secret');

-- 2) Eklentiler
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 3) Her 15 dakikada bir: bucket eşitleme, temizlik, e-posta tekrar denemesi
select cron.schedule(
    'quote-maintenance',
    '*/15 * * * *',
    $$
    select net.http_post(
        url     := (select decrypted_secret from vault.decrypted_secrets where name = 'quote_project_url') || '/functions/v1/quote-maintenance',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-maintenance-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'quote_maintenance_secret')
        ),
        body    := '{}'::jsonb,
        timeout_milliseconds := 30000
    );
    $$
);

-- Kontrol:   select * from cron.job where jobname = 'quote-maintenance';
-- Son yanıtlar: select status_code, content, created from net._http_response order by created desc limit 5;
-- Kaldırmak: select cron.unschedule('quote-maintenance');
