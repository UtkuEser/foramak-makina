/*
 * quote-init
 *
 * GET  → frontend için dosya limitleri (tek yapılandırma: _shared/quote-config.ts)
 * POST → form doğrulama → hız sınırı → Turnstile → pending talep kaydı →
 *        yalnızca bu talebe ait rastgele yollar için signed upload URL'leri.
 *
 * Aynı client_submission_id ile tekrar gelen istek ikinci kayıt oluşturmaz:
 * tamamlanmış talep için mevcut referans döner, tamamlanmamış talep yeniden
 * başlatılır.
 */
import { QUOTE_CONFIG, publicLimits } from '../_shared/quote-config.ts';
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
import { hashIp, randomToken, sha256Hex } from '../_shared/security.ts';
import { validateQuoteInit } from '../_shared/validation.ts';
import { verifyTurnstile } from '../_shared/turnstile.ts';
import { createAdminClient } from '../_shared/supabase-admin.ts';
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.117.3';

interface InitRpcResult {
    result: 'created' | 'restarted' | 'already_received' | 'closed' | 'capacity';
    quote_id?: string;
    reference_no?: string;
    notification_status?: string;
    attachments?: { id: string; storage_path: string }[];
    old_paths?: string[];
}

async function enforceRateLimits(db: SupabaseClient, ipHash: string) {
    const { initPerIp, initPerIpDaily, initGlobalHourly } = QUOTE_CONFIG.rateLimits;
    const checks: [string, { limit: number; windowSeconds: number }][] = [
        [`init:ip:${ipHash}`, initPerIp],
        [`init:ip-day:${ipHash}`, initPerIpDaily],
        ['init:global', initGlobalHourly],
    ];
    for (const [key, rule] of checks) {
        const { data, error } = await db.rpc('quote_rate_limit_hit', {
            p_key: key,
            p_limit: rule.limit,
            p_window_seconds: rule.windowSeconds,
        });
        if (error) throw new Error(`hız sınırı kontrol edilemedi: ${error.message}`);
        if (data !== true) {
            throw new HttpError(429, 'rate_limited', 'Kısa sürede çok fazla deneme yapıldı. Lütfen birkaç dakika sonra tekrar deneyin veya bizi telefonla arayın.');
        }
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
        if (req.method === 'GET') {
            return json(200, { ok: true, submissionsEnabled: cfg.submissionsEnabled, limits: publicLimits() }, headers);
        }
        if (req.method !== 'POST') throw new HttpError(405, 'method_not_allowed', 'Desteklenmeyen istek.');

        if (!cfg.submissionsEnabled) {
            throw new HttpError(503, 'submissions_disabled', 'Online teklif formu henüz kullanıma açılmadı.');
        }

        const input = validateQuoteInit(await readJsonBody(req, QUOTE_CONFIG.maxBodyBytes));
        const db = createAdminClient();

        await enforceRateLimits(db, await hashIp(clientIp(req), cfg.ipHashSalt));

        const turnstile = await verifyTurnstile(input.turnstileToken, {
            secret: cfg.turnstileSecret,
            expectedAction: QUOTE_CONFIG.turnstileAction,
            // Test anahtarları sabit bir hostname döndürür; kontrol yalnızca production'da
            expectedHostnames: cfg.environment === 'production'
                ? cfg.allowedOrigins.map((o) => new URL(o).hostname)
                : null,
            allowTestingKey: cfg.environment === 'development',
        });
        if (!turnstile.ok) {
            console.warn(`[quote-init] Turnstile reddedildi: ${turnstile.errorCodes.join(',')}`);
            throw new HttpError(403, 'turnstile_failed', 'Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar deneyin.');
        }

        const finalizeToken = randomToken();
        const files = input.files.map((f) => ({ ...f, id: crypto.randomUUID() }));

        const { data, error } = await db.rpc('quote_init_request', {
            p_submission_id: input.submissionId,
            p_fields: input.fields,
            p_token_hash: await sha256Hex(finalizeToken),
            p_files: files.map((f) => ({
                id: f.id,
                extension: f.extension,
                original_filename: f.originalFilename,
                file_size: f.size,
                content_type: f.contentType,
            })),
            p_max_pending_attachments: QUOTE_CONFIG.maxPendingAttachments24h,
        });
        if (error) throw new Error(`talep kaydedilemedi: ${error.message}`);
        const result = data as InitRpcResult;

        if (result.result === 'already_received') {
            return json(200, {
                ok: true,
                status: 'received',
                already_received: true,
                reference_no: result.reference_no,
                notification_status: result.notification_status,
            }, headers);
        }
        if (result.result === 'closed') {
            throw new HttpError(409, 'submission_closed', 'Bu form gönderimi kapatılmış. Lütfen sayfayı yenileyip tekrar gönderin.');
        }
        if (result.result === 'capacity') {
            throw new HttpError(503, 'upload_capacity', 'Dosya yükleme kapasitesi geçici olarak dolu. Talebinizi dosyasız gönderebilir, dosyaları e-posta ile iletebilirsiniz.');
        }

        const quoteId = result.quote_id!;
        const storage = db.storage.from(QUOTE_CONFIG.bucket);

        // Yeniden başlatılan talebin eski dosyaları (en iyi çaba; kalanları bakım temizler)
        if (result.old_paths?.length) {
            const { error: removeError } = await storage.remove(result.old_paths);
            if (removeError) console.warn(`[quote-init] eski dosyalar silinemedi (${quoteId}): ${removeError.message}`);
        }

        const pathById = new Map((result.attachments ?? []).map((a) => [a.id, a.storage_path]));
        const uploads = [];
        for (const file of files) {
            const path = pathById.get(file.id);
            if (!path) throw new Error('dosya yolu oluşturulamadı');
            const { data: signed, error: signError } = await storage.createSignedUploadUrl(path);
            if (signError || !signed) throw new Error(`yükleme bağlantısı oluşturulamadı: ${signError?.message}`);
            uploads.push({
                client_index: file.clientIndex,
                attachment_id: file.id,
                signed_url: signed.signedUrl,
                content_type: file.contentType,
            });
        }

        return json(200, {
            ok: true,
            status: 'pending',
            quote_id: quoteId,
            finalize_token: finalizeToken,
            uploads,
        }, headers);
    } catch (err) {
        return errorResponse(err, corsHeaders(origin, cfg));
    }
});
