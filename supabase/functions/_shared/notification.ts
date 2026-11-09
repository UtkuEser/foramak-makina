/*
 * Resend ile ekibe bildirim e-postası.
 *
 * Kurallar:
 * - Talep veritabanına kaydedildikten SONRA çağrılır; e-posta başarısız olsa
 *   da kayıt korunur, notification_status = failed olur ve quote-maintenance
 *   tekrar dener (aynı talep için yeni kayıt oluşmaz).
 * - quote_claim_notification kilidi aynı talep için eşzamanlı ikinci gönderimi
 *   engeller. Her deneme kendi Idempotency-Key'ini kullanır.
 * - "sent" = Resend API e-postayı kabul etti; gelen kutusuna teslim garantisi
 *   değildir.
 * - Müşterinin yazdığı her değer HTML olarak kaçışlanır; dosyalar herkese açık
 *   bağlantıyla gönderilmez.
 */
import type { SupabaseClient } from 'npm:@supabase/supabase-js@2.117.3';
import { QUOTE_CONFIG } from './quote-config.ts';
import { env } from './http.ts';

export interface QuoteRecord {
    id: string;
    reference_no: string | null;
    company_name: string;
    contact_name: string;
    phone: string;
    email: string;
    service_type: string;
    material_type: string | null;
    dimensions: string | null;
    quantity: string | null;
    expected_deadline: string | null;
    project_description: string | null;
    received_at: string | null;
    created_at: string;
    notification_attempts: number;
}

export interface AttachmentRecord {
    original_filename: string;
    file_size: number;
}

export interface NotificationEnv {
    apiKey: string;
    from: string;
    to: string;
    apiUrl: string;
}

export type NotificationOutcome = 'sent' | 'failed' | 'pending';

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function formatBytes(bytes: number): string {
    const nf = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 1 });
    if (bytes >= 1024 * 1024) return `${nf.format(bytes / (1024 * 1024))} MB`;
    if (bytes >= 1024) return `${nf.format(bytes / 1024)} KB`;
    return `${bytes} B`;
}

export function formatDate(iso: string): string {
    return new Intl.DateTimeFormat('tr-TR', {
        dateStyle: 'long',
        timeStyle: 'short',
        timeZone: 'Europe/Istanbul',
    }).format(new Date(iso));
}

/** İçeriği tam doğrulanamayan formatlar için e-postadaki uyarı (uzantıdan belirlenir). */
export function verificationNote(filename: string): string | null {
    const ext = filename.slice(filename.lastIndexOf('.') + 1).toLowerCase();
    if (!QUOTE_CONFIG.files.partiallyVerified.includes(ext)) return null;
    return ext === 'zip'
        ? 'arşiv yapısı kontrol edildi, içindeki dosyalar açılmadı'
        : 'yapı kontrolü yapıldı, resmî imza olmadığından içerik tam doğrulanamadı';
}

function headerSafe(value: string, max: number): string {
    const cleaned = value.replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    return cleaned.length > max ? `${cleaned.slice(0, max - 1)}…` : cleaned;
}

export function renderQuoteEmail(quote: QuoteRecord, files: AttachmentRecord[]) {
    const reference = quote.reference_no ?? quote.id;
    const service = QUOTE_CONFIG.serviceTypes[quote.service_type] ?? quote.service_type;
    const material = quote.material_type ? (QUOTE_CONFIG.materialTypes[quote.material_type] ?? quote.material_type) : null;
    const date = formatDate(quote.received_at ?? quote.created_at);
    const subject = `Yeni Teklif Talebi — ${reference} — ${headerSafe(quote.company_name, 80)}`;
    const storageFolder = `${QUOTE_CONFIG.bucket}/requests/${quote.id}/`;

    const rows: [string, string | null][] = [
        ['Referans No', reference],
        ['Başvuru Tarihi', date],
        ['Firma', quote.company_name],
        ['Yetkili', quote.contact_name],
        ['Telefon', quote.phone],
        ['E-posta', quote.email],
        ['Hizmet', service],
        ['Malzeme', material],
        ['Kalınlık / Çap / Ölçü', quote.dimensions],
        ['Adet / Miktar', quote.quantity],
        ['Termin', quote.expected_deadline],
    ];

    const telHref = quote.phone.replace(/[^\d+]/g, '');
    const valueHtml = (label: string, value: string) => {
        const safe = escapeHtml(value);
        if (label === 'E-posta') return `<a href="mailto:${safe}" style="color:#07144A;">${safe}</a>`;
        if (label === 'Telefon' && telHref) return `<a href="tel:${escapeHtml(telHref)}" style="color:#07144A;">${safe}</a>`;
        return safe;
    };

    const rowsHtml = rows.map(([label, value]) => `
            <tr>
                <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;width:38%;font-size:13px;color:#5B6475;vertical-align:top;">${escapeHtml(label)}</td>
                <td style="padding:8px 0;border-bottom:1px solid #E5E7EB;font-size:14px;color:#07111F;vertical-align:top;">${value ? valueHtml(label, value) : '<span style="color:#9CA3AF;">Belirtilmedi</span>'}</td>
            </tr>`).join('');

    const descriptionHtml = quote.project_description
        ? escapeHtml(quote.project_description).replace(/\n/g, '<br>')
        : '<span style="color:#9CA3AF;">Açıklama yazılmadı.</span>';

    const filesHtml = files.length
        ? `<ul style="margin:0;padding-left:18px;">${files.map((f) =>
            `<li style="margin:0 0 4px;font-size:14px;color:#07111F;">${escapeHtml(f.original_filename)} <span style="color:#5B6475;">(${escapeHtml(formatBytes(f.file_size))})</span>${verificationNote(f.original_filename) ? ` <span style="color:#92400E;">— ${escapeHtml(verificationNote(f.original_filename)!)}</span>` : ''}</li>`).join('')}</ul>
           <p style="margin:10px 0 0;font-size:12px;color:#5B6475;">Dosyalar güvenlik nedeniyle e-postaya eklenmez. Supabase Dashboard → Storage → <strong>${escapeHtml(storageFolder)}</strong> klasöründen indirilebilir. Açmadan önce antivirüs taramasından geçirin.</p>`
        : '<p style="margin:0;font-size:14px;color:#9CA3AF;">Dosya yüklenmedi.</p>';

    const html = `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#EEF2F6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F6;padding:24px 12px;">
    <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#FFFFFF;border:1px solid #E5E7EB;border-radius:8px;">
            <tr><td style="background:#07144A;padding:20px 24px;border-radius:8px 8px 0 0;">
                <div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#F2C94C;font-weight:bold;">Foramak Makine · Yeni Teklif Talebi</div>
                <div style="font-size:20px;color:#FFFFFF;font-weight:bold;margin-top:6px;">${escapeHtml(reference)}</div>
            </td></tr>
            <tr><td style="padding:20px 24px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}
                </table>
            </td></tr>
            <tr><td style="padding:16px 24px 0;">
                <div style="font-size:13px;color:#5B6475;margin-bottom:6px;">Proje Açıklaması</div>
                <div style="font-size:14px;line-height:1.6;color:#07111F;background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:12px 14px;">${descriptionHtml}</div>
            </td></tr>
            <tr><td style="padding:16px 24px 24px;">
                <div style="font-size:13px;color:#5B6475;margin-bottom:6px;">Yüklenen Dosyalar</div>
                ${filesHtml}
            </td></tr>
        </table>
        <p style="max-width:640px;margin:12px auto 0;font-size:11px;color:#9CA3AF;">Bu e-posta foramak.com teklif formundan otomatik gönderildi. Yanıtla dediğinizde müşterinin e-posta adresine yazarsınız.</p>
    </td></tr>
</table>
</body>
</html>`;

    const text = [
        `Yeni Teklif Talebi — ${reference}`,
        '',
        ...rows.map(([label, value]) => `${label}: ${value ?? 'Belirtilmedi'}`),
        '',
        'Proje Açıklaması:',
        quote.project_description ?? 'Açıklama yazılmadı.',
        '',
        'Yüklenen Dosyalar:',
        ...(files.length
            ? [
                ...files.map((f) => `- ${f.original_filename} (${formatBytes(f.file_size)})${verificationNote(f.original_filename) ? ` — ${verificationNote(f.original_filename)}` : ''}`),
                `Konum: Supabase Dashboard → Storage → ${storageFolder}`,
            ]
            : ['Dosya yüklenmedi.']),
    ].join('\n');

    return { subject, html, text };
}

export function loadNotificationEnv(): NotificationEnv | null {
    const apiKey = env('RESEND_API_KEY');
    const from = env('FORM_SENDER_EMAIL');
    const to = env('FORM_NOTIFICATION_EMAIL');
    if (!apiKey || !from || !to) return null;
    return { apiKey, from, to, apiUrl: env('RESEND_API_URL') || 'https://api.resend.com/emails' };
}

export async function sendEmail(
    message: { subject: string; html: string; text: string; replyTo: string },
    cfg: NotificationEnv,
    idempotencyKey: string,
    fetchImpl: typeof fetch = fetch,
): Promise<{ ok: true; id: string | null } | { ok: false; error: string }> {
    try {
        const res = await fetchImpl(cfg.apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${cfg.apiKey}`,
                'Content-Type': 'application/json',
                'Idempotency-Key': idempotencyKey,
            },
            body: JSON.stringify({
                from: cfg.from,
                to: [cfg.to],
                subject: message.subject,
                html: message.html,
                text: message.text,
                reply_to: message.replyTo,
                tags: [{ name: 'category', value: 'quote_request' }],
            }),
            signal: AbortSignal.timeout(QUOTE_CONFIG.notification.timeoutMs),
        });
        const payload = await res.json().catch(() => ({})) as Record<string, unknown>;
        if (res.ok) return { ok: true, id: typeof payload.id === 'string' ? payload.id : null };
        const detail = typeof payload.message === 'string' ? payload.message : res.statusText;
        return { ok: false, error: `Resend ${res.status}: ${detail}` };
    } catch (err) {
        return { ok: false, error: `Resend isteği başarısız: ${err instanceof Error ? err.message : String(err)}` };
    }
}

/**
 * Talep için bildirim gönderir (gerekiyorsa). Başka bir istek aynı anda
 * gönderiyorsa veya zaten gönderildiyse tekrar göndermez, mevcut durumu döner.
 */
export async function notifyQuote(db: SupabaseClient, quoteId: string, fetchImpl: typeof fetch = fetch): Promise<NotificationOutcome> {
    const { maxAttempts, lockSeconds } = QUOTE_CONFIG.notification;
    const { data: claimed, error: claimError } = await db.rpc('quote_claim_notification', {
        p_quote_id: quoteId,
        p_lock_seconds: lockSeconds,
        p_max_attempts: maxAttempts,
    });
    if (claimError) throw new Error(`bildirim kilidi alınamadı: ${claimError.message}`);

    const quote = (claimed as QuoteRecord[] | null)?.[0];
    if (!quote) {
        const { data } = await db.from('quote_requests').select('notification_status').eq('id', quoteId).maybeSingle();
        return (data?.notification_status as NotificationOutcome | undefined) ?? 'pending';
    }

    const record = async (sent: boolean, providerId: string | null, error: string | null) => {
        const { error: recordError } = await db.rpc('quote_record_notification', {
            p_quote_id: quoteId,
            p_sent: sent,
            p_provider_id: providerId,
            p_error: error,
        });
        if (recordError) console.error(`[quote] bildirim durumu yazılamadı (${quoteId}): ${recordError.message}`);
    };

    const cfg = loadNotificationEnv();
    if (!cfg) {
        console.error('[quote] RESEND_API_KEY / FORM_SENDER_EMAIL / FORM_NOTIFICATION_EMAIL eksik');
        await record(false, null, 'E-posta yapılandırması eksik');
        return 'failed';
    }

    const { data: files, error: filesError } = await db
        .from('quote_attachments')
        .select('original_filename, file_size')
        .eq('quote_request_id', quoteId)
        .order('created_at');
    if (filesError) {
        await record(false, null, `Dosya listesi okunamadı: ${filesError.message}`);
        return 'failed';
    }

    const message = renderQuoteEmail(quote, (files ?? []) as AttachmentRecord[]);
    const result = await sendEmail(
        { ...message, replyTo: quote.email },
        cfg,
        `quote-${quoteId}-attempt-${quote.notification_attempts}`,
        fetchImpl,
    );

    if (result.ok) {
        await record(true, result.id, null);
        return 'sent';
    }
    console.error(`[quote] bildirim gönderilemedi (${quoteId}): ${result.error}`);
    await record(false, null, result.error);
    return 'failed';
}
