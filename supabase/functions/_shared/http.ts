/*
 * Ortak HTTP yardımcıları: ortam değişkenleri, Origin/CORS, JSON yanıtlar.
 *
 * Güvenlik değişmezi: QUOTE_ENVIRONMENT=production iken yalnızca https
 * production origin'leri kabul edilir ve Cloudflare test anahtarı reddedilir;
 * development iken yalnızca localhost / 127.0.0.1 origin'leri kabul edilir.
 * Böylece test anahtarı hiçbir zaman canlı site trafiğiyle birlikte çalışmaz.
 */

export class HttpError extends Error {
    constructor(
        public status: number,
        public code: string,
        message: string,
        public details?: Record<string, unknown>,
    ) {
        super(message);
    }
}

export type QuoteEnvironment = 'production' | 'development';

export interface PublicEndpointEnv {
    environment: QuoteEnvironment;
    allowedOrigins: string[];
    submissionsEnabled: boolean;
    turnstileSecret: string;
    ipHashSalt: string;
}

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
const TURNSTILE_TEST_SECRET = /^[123]x0+AA$/;

export function env(name: string): string {
    return (Deno.env.get(name) ?? '').trim();
}

function misconfigured(reason: string): never {
    // Değer değil yalnızca değişken adı / neden loglanır
    console.error(`[quote] yapılandırma hatası: ${reason}`);
    throw new HttpError(500, 'server_misconfigured', 'Teklif sistemi şu anda yapılandırılıyor. Lütfen bizi telefonla arayın.');
}

export function loadPublicEndpointEnv(): PublicEndpointEnv {
    const rawEnvironment = env('QUOTE_ENVIRONMENT') || 'production';
    if (rawEnvironment !== 'production' && rawEnvironment !== 'development') {
        misconfigured('QUOTE_ENVIRONMENT production veya development olmalı');
    }
    const environment = rawEnvironment as QuoteEnvironment;

    const allowedOrigins = env('QUOTE_ALLOWED_ORIGINS').split(',').map((o) => o.trim()).filter(Boolean);
    if (allowedOrigins.length === 0) misconfigured('QUOTE_ALLOWED_ORIGINS boş');

    for (const origin of allowedOrigins) {
        let url: URL;
        try {
            url = new URL(origin);
        } catch {
            misconfigured(`QUOTE_ALLOWED_ORIGINS geçersiz: ${origin}`);
        }
        if (url.origin !== origin) misconfigured(`QUOTE_ALLOWED_ORIGINS yalnızca origin içermeli: ${origin}`);
        const isLocal = LOCAL_HOSTS.has(url.hostname);
        if (environment === 'production' && (isLocal || url.protocol !== 'https:')) {
            misconfigured(`production ortamında yerel / http origin kullanılamaz: ${origin}`);
        }
        if (environment === 'development' && !isLocal) {
            misconfigured(`development ortamında yalnızca localhost origin kullanılabilir: ${origin}`);
        }
    }

    const turnstileSecret = env('TURNSTILE_SECRET_KEY');
    if (!turnstileSecret) misconfigured('TURNSTILE_SECRET_KEY eksik');
    if (environment === 'production' && TURNSTILE_TEST_SECRET.test(turnstileSecret)) {
        misconfigured('production ortamında Turnstile test anahtarı kullanılamaz');
    }

    const ipHashSalt = env('QUOTE_IP_HASH_SALT');
    if (ipHashSalt.length < 16) misconfigured('QUOTE_IP_HASH_SALT eksik veya çok kısa');

    // production'da açıkça açılmadıkça başvuru kabul edilmez (KVKK değerlendirmesi)
    const submissionsEnabled = environment === 'development' || env('QUOTE_SUBMISSIONS_ENABLED') === 'true';

    return { environment, allowedOrigins, submissionsEnabled, turnstileSecret, ipHashSalt };
}

export function isAllowedOrigin(origin: string | null, cfg: PublicEndpointEnv): origin is string {
    return !!origin && cfg.allowedOrigins.includes(origin);
}

export function corsHeaders(origin: string | null, cfg: PublicEndpointEnv | null): Record<string, string> {
    if (!cfg || !isAllowedOrigin(origin, cfg)) return { Vary: 'Origin' };
    return {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
        'Access-Control-Max-Age': '600',
        Vary: 'Origin',
    };
}

export function json(status: number, body: unknown, headers: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
            'X-Content-Type-Options': 'nosniff',
            ...headers,
        },
    });
}

export function errorResponse(err: unknown, headers: Record<string, string>): Response {
    if (err instanceof HttpError) {
        return json(err.status, { ok: false, code: err.code, message: err.message, ...(err.details ?? {}) }, headers);
    }
    console.error('[quote] beklenmeyen hata:', err instanceof Error ? err.message : String(err));
    return json(500, {
        ok: false,
        code: 'server_error',
        message: 'Talebiniz şu anda işlenemedi. Lütfen tekrar deneyin; sorun devam ederse bizi telefonla arayın.',
    }, headers);
}

/** Gövdeyi boyut sınırıyla okuyup JSON olarak çözer. */
export async function readJsonBody(req: Request, maxBytes: number): Promise<Record<string, unknown>> {
    const declared = Number(req.headers.get('content-length') ?? '0');
    if (declared > maxBytes) throw new HttpError(413, 'payload_too_large', 'Gönderilen veri çok büyük.');

    const raw = await req.text();
    if (new TextEncoder().encode(raw).length > maxBytes) {
        throw new HttpError(413, 'payload_too_large', 'Gönderilen veri çok büyük.');
    }
    try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed as Record<string, unknown>;
    } catch {
        // aşağıda ortak hata
    }
    throw new HttpError(400, 'bad_request', 'Geçersiz istek.');
}

/** En iyi çaba istemci IP'si (yalnızca hız sınırı için, özetlenerek kullanılır). */
export function clientIp(req: Request): string {
    const direct = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-real-ip');
    if (direct) return direct.trim();
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();
    return 'unknown';
}
