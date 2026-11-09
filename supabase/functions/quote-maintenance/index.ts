/*
 * quote-maintenance — pg_cron ile periyodik çağrılır (supabase/manual/
 * schedule-quote-maintenance.sql). Tarayıcıdan çağrılmaz; MAINTENANCE_SECRET
 * başlığı olmadan hiçbir şey yapmaz.
 *
 * 1. Bucket'ı quote-config.ts'e eşitler (private, dosya limiti, izinli türler)
 * 2. Süresi dolan tamamlanmamış talepleri siler
 * 3. Hiçbir talebe bağlı olmayan dosyaları Storage API ile siler
 * 4. Gönderilemeyen e-posta bildirimlerini tekrar dener (yeni kayıt oluşturmaz)
 */
import { allowedMimeTypes, QUOTE_CONFIG } from '../_shared/quote-config.ts';
import { env, errorResponse, HttpError, json } from '../_shared/http.ts';
import { timingSafeEqual } from '../_shared/security.ts';
import { notifyQuote } from '../_shared/notification.ts';
import { createAdminClient } from '../_shared/supabase-admin.ts';

type Db = ReturnType<typeof createAdminClient>;

/** setof text/uuid dönen RPC'ler: düz dizi veya satır nesnesi olarak gelebilir */
function scalarList(data: unknown): string[] {
    if (!Array.isArray(data)) return [];
    return data
        .map((item) => (item && typeof item === 'object' ? Object.values(item as Record<string, unknown>)[0] : item))
        .filter((v): v is string => typeof v === 'string');
}

async function syncBucket(db: Db): Promise<string> {
    const { files, bucket } = QUOTE_CONFIG;
    const wanted = { public: false, fileSizeLimit: files.maxFileBytes, allowedMimeTypes: allowedMimeTypes() };
    const { data, error } = await db.storage.getBucket(bucket);
    if (error || !data) {
        const { error: createError } = await db.storage.createBucket(bucket, wanted);
        if (createError) throw new Error(`bucket oluşturulamadı: ${createError.message}`);
        return 'created';
    }
    const same = data.public === false
        && Number(data.file_size_limit) === wanted.fileSizeLimit
        && JSON.stringify([...(data.allowed_mime_types ?? [])].sort()) === JSON.stringify([...wanted.allowedMimeTypes].sort());
    if (same) return 'ok';
    const { error: updateError } = await db.storage.updateBucket(bucket, wanted);
    if (updateError) throw new Error(`bucket güncellenemedi: ${updateError.message}`);
    return 'updated';
}

async function cleanup(db: Db) {
    const { pendingTtlHours, orphanMinAgeHours, orphanBatchSize } = QUOTE_CONFIG.cleanup;

    const { data: expired, error: expiredError } = await db.rpc('quote_delete_expired_pending', {
        p_max_age_hours: pendingTtlHours,
    });
    if (expiredError) throw new Error(`süresi dolan talepler silinemedi: ${expiredError.message}`);

    const { data: orphans, error: orphanError } = await db.rpc('quote_orphan_objects', {
        p_min_age_hours: orphanMinAgeHours,
        p_limit: orphanBatchSize,
    });
    if (orphanError) throw new Error(`sahipsiz dosyalar listelenemedi: ${orphanError.message}`);

    const names = scalarList(orphans);
    let removed = 0;
    for (let i = 0; i < names.length; i += 100) {
        const batch = names.slice(i, i + 100);
        const { error } = await db.storage.from(QUOTE_CONFIG.bucket).remove(batch);
        if (error) {
            console.error(`[quote-maintenance] dosyalar silinemedi: ${error.message}`);
            break;
        }
        removed += batch.length;
    }
    return { expiredPendingDeleted: expired as number, orphanFilesRemoved: removed };
}

async function retryNotifications(db: Db) {
    const { maxAttempts, retryBatchSize } = QUOTE_CONFIG.notification;
    const { data, error } = await db.rpc('quote_notifications_due', {
        p_max_attempts: maxAttempts,
        p_limit: retryBatchSize,
    });
    if (error) throw new Error(`bekleyen bildirimler okunamadı: ${error.message}`);

    const summary = { sent: 0, failed: 0, pending: 0 };
    for (const quoteId of scalarList(data)) {
        try {
            summary[await notifyQuote(db, quoteId)]++;
        } catch (err) {
            console.error(`[quote-maintenance] bildirim hatası (${quoteId}):`, err instanceof Error ? err.message : err);
            summary.failed++;
        }
    }
    return summary;
}

Deno.serve(async (req) => {
    try {
        const secret = env('MAINTENANCE_SECRET');
        if (secret.length < 32) {
            console.error('[quote-maintenance] MAINTENANCE_SECRET eksik veya çok kısa');
            throw new HttpError(500, 'server_misconfigured', 'Bakım görevi yapılandırılmadı.');
        }
        if (req.method !== 'POST') throw new HttpError(405, 'method_not_allowed', 'Desteklenmeyen istek.');
        if (!timingSafeEqual(req.headers.get('x-maintenance-secret') ?? '', secret)) {
            throw new HttpError(401, 'unauthorized', 'Yetkisiz.');
        }

        const db = createAdminClient();
        const result: Record<string, unknown> = {};
        const errors: string[] = [];

        // Görevler birbirinden bağımsız; biri hata verse de diğerleri çalışır
        for (const [name, task] of [
            ['bucket', () => syncBucket(db)],
            ['cleanup', () => cleanup(db)],
            ['notifications', () => retryNotifications(db)],
        ] as const) {
            try {
                result[name] = await task();
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                console.error(`[quote-maintenance] ${name}: ${message}`);
                errors.push(`${name}: ${message}`);
            }
        }

        return json(errors.length ? 207 : 200, { ok: errors.length === 0, ...result, errors });
    } catch (err) {
        return errorResponse(err, {});
    }
});
