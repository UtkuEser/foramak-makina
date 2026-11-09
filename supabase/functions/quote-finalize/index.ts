/*
 * quote-finalize
 *
 * POST { quote_id, finalize_token }
 * 1. Belirteç kontrolü (yalnızca quote-init yanıtını alan tarayıcı tamamlayabilir)
 * 2. Beklenen dosyalar Storage'da var mı, boyut / tür sınırları aşılmış mı?
 * 3. İçerik uzantısıyla uyuşuyor mu? (imza / yapı; ZIP açılmadan merkezî dizini denetlenir)
 * 4. Talep atomik olarak received yapılır, referans numarası verilir
 * 5. Kayıt güvendeyken e-posta bildirimi denenir (başarısızlık kaydı etkilemez)
 *
 * Tekrar çağrılırsa talep ikinci kez tamamlanmaz; mevcut sonuç döner.
 */
import { QUOTE_CONFIG } from '../_shared/quote-config.ts';
import {
    clientIp,
    corsHeaders,
    errorResponse,
    HttpError,
    isAllowedOrigin,
    json,
    loadPublicEndpointEnv,
    type PublicEndpointEnv,
    readJsonBody,
} from '../_shared/http.ts';
import { hashIp, sha256Hex, timingSafeEqual } from '../_shared/security.ts';
import { fileExtension, isUuid } from '../_shared/validation.ts';
import { type InspectionResult, inspectStoredFile } from '../_shared/file-signature.ts';
import { notifyQuote } from '../_shared/notification.ts';
import { createAdminClient } from '../_shared/supabase-admin.ts';

interface AttachmentObject {
    attachment_id: string;
    storage_path: string;
    original_filename: string;
    content_type: string;
    declared_size: number;
    object_size: number | null;
    object_mimetype: string | null;
}

interface FinalizeRpcResult {
    result: 'received' | 'already_received' | 'not_found' | 'closed' | 'upload_incomplete' | 'invalid_file' | 'too_large';
    reference_no?: string;
    notification_status?: string;
}

const NOT_FOUND_MESSAGE = 'Talebin süresi doldu veya bulunamadı. Lütfen formu tekrar gönderin.';

/** Kayıt tamamlandıktan sonra bildirim; hata talebi etkilemez, failed olarak kalır ve tekrar denenir. */
async function safeNotify(db: ReturnType<typeof createAdminClient>, quoteId: string): Promise<string> {
    try {
        return await notifyQuote(db, quoteId);
    } catch (err) {
        console.error(`[quote-finalize] bildirim hatası (${quoteId}):`, err instanceof Error ? err.message : err);
        return 'failed';
    }
}

Deno.serve(async (req) => {
    const origin = req.headers.get('origin');
    let cfg: PublicEndpointEnv | null = null;

    try {
        cfg = loadPublicEndpointEnv();
        const headers = corsHeaders(origin, cfg);

        if (!isAllowedOrigin(origin, cfg)) {
            throw new HttpError(403, 'origin_not_allowed', 'Bu adresten istek kabul edilmiyor.');
        }
        if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });
        if (req.method !== 'POST') throw new HttpError(405, 'method_not_allowed', 'Desteklenmeyen istek.');
        if (!cfg.submissionsEnabled) {
            throw new HttpError(503, 'submissions_disabled', 'Online teklif formu henüz kullanıma açılmadı.');
        }

        const body = await readJsonBody(req, 4096);
        const quoteId = body.quote_id;
        const token = typeof body.finalize_token === 'string' ? body.finalize_token : '';
        if (!isUuid(quoteId) || token.length < 32 || token.length > 128) {
            throw new HttpError(400, 'bad_request', 'Geçersiz istek.');
        }

        const db = createAdminClient();

        const rule = QUOTE_CONFIG.rateLimits.finalizePerIp;
        const ipHash = await hashIp(clientIp(req), cfg.ipHashSalt);
        const { data: allowed, error: rateError } = await db.rpc('quote_rate_limit_hit', {
            p_key: `finalize:ip:${ipHash}`,
            p_limit: rule.limit,
            p_window_seconds: rule.windowSeconds,
        });
        if (rateError) throw new Error(`hız sınırı kontrol edilemedi: ${rateError.message}`);
        if (allowed !== true) {
            throw new HttpError(429, 'rate_limited', 'Kısa sürede çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin.');
        }

        const tokenHash = await sha256Hex(token);
        const { data: quote, error: quoteError } = await db
            .from('quote_requests')
            .select('id, status, finalize_token_hash, reference_no, notification_status')
            .eq('id', quoteId)
            .maybeSingle();
        if (quoteError) throw new Error(`talep okunamadı: ${quoteError.message}`);
        if (!quote || !timingSafeEqual(quote.finalize_token_hash, tokenHash)) {
            throw new HttpError(404, 'not_found', NOT_FOUND_MESSAGE);
        }

        if (quote.status === 'received') {
            // Tekrar çağrı: kayıt tamam; bildirim eksikse (kilit izin verirse) yeniden dene
            const notification = quote.notification_status === 'sent' ? 'sent' : await safeNotify(db, quoteId);
            return json(200, { ok: true, status: 'received', reference_no: quote.reference_no, notification_status: notification }, headers);
        }
        if (quote.status !== 'pending') throw new HttpError(410, 'closed', NOT_FOUND_MESSAGE);

        const { data: objects, error: objectsError } = await db.rpc('quote_attachment_objects', { p_quote_id: quoteId });
        if (objectsError) throw new Error(`dosyalar okunamadı: ${objectsError.message}`);
        const attachments = (objects ?? []) as AttachmentObject[];

        const missing = attachments.filter((a) => a.object_size === null);
        if (missing.length) {
            throw new HttpError(409, 'upload_incomplete', 'Dosyaların bir kısmı yüklenemedi. Lütfen formu tekrar gönderin.', {
                files: missing.map((a) => a.original_filename),
            });
        }

        const storage = db.storage.from(QUOTE_CONFIG.bucket);
        let total = 0;
        for (const a of attachments) {
            total += a.object_size!;
            const extension = fileExtension(a.storage_path);
            let inspection: InspectionResult = a.object_size! > 0
                    && a.object_size! <= QUOTE_CONFIG.files.maxFileBytes
                    && a.object_mimetype === a.content_type
                ? { ok: true }
                : { ok: false, reason: 'Dosya boyutu veya türü sınırlara uymuyor.' };

            if (inspection.ok) {
                const { data: signed, error: signError } = await storage.createSignedUrl(a.storage_path, 60);
                if (signError || !signed) throw new Error(`dosya imzalanamadı: ${signError?.message}`);
                inspection = await inspectStoredFile(signed.signedUrl, extension, a.object_size!);
            }

            if (!inspection.ok) {
                // Uyuşmayan dosya saklanmaz; talep pending kalır, kullanıcı yeniden gönderir
                await storage.remove([a.storage_path]);
                throw new HttpError(422, 'invalid_file', `"${a.original_filename}" kabul edilmedi: ${inspection.reason} Lütfen dosyayı kontrol edip formu tekrar gönderin.`, {
                    files: [a.original_filename],
                });
            }
        }
        if (total > QUOTE_CONFIG.files.maxTotalBytes) {
            throw new HttpError(422, 'too_large', 'Dosyaların toplam boyutu sınırı aşıyor. Lütfen formu tekrar gönderin.');
        }

        const { data, error } = await db.rpc('quote_finalize_request', {
            p_quote_id: quoteId,
            p_token_hash: tokenHash,
            p_max_file_bytes: QUOTE_CONFIG.files.maxFileBytes,
            p_max_total_bytes: QUOTE_CONFIG.files.maxTotalBytes,
        });
        if (error) throw new Error(`talep tamamlanamadı: ${error.message}`);
        const result = data as FinalizeRpcResult;

        switch (result.result) {
            case 'received':
            case 'already_received':
                break;
            case 'upload_incomplete':
                throw new HttpError(409, 'upload_incomplete', 'Dosyaların bir kısmı yüklenemedi. Lütfen formu tekrar gönderin.');
            case 'invalid_file':
            case 'too_large':
                throw new HttpError(422, result.result, 'Yüklenen dosyalar sınırlara uymuyor. Lütfen formu tekrar gönderin.');
            default:
                throw new HttpError(404, 'not_found', NOT_FOUND_MESSAGE);
        }

        const notification = await safeNotify(db, quoteId);
        return json(200, { ok: true, status: 'received', reference_no: result.reference_no, notification_status: notification }, headers);
    } catch (err) {
        return errorResponse(err, corsHeaders(origin, cfg));
    }
});
