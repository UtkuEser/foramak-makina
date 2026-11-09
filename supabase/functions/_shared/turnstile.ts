/*
 * Cloudflare Turnstile — sunucu tarafı Siteverify doğrulaması.
 * Token tek kullanımlıktır ve 300 saniye geçerlidir; Cloudflare süresi dolmuş
 * veya daha önce kullanılmış token için "timeout-or-duplicate" döner.
 */

const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileOptions {
    secret: string;
    expectedAction: string;
    /** null = hostname kontrolü yapma (test anahtarları sabit hostname döner) */
    expectedHostnames: string[] | null;
    /** Cloudflare test anahtarı sonucunu kabul et (yalnızca development) */
    allowTestingKey?: boolean;
    fetchImpl?: typeof fetch;
}

export interface TurnstileResult {
    ok: boolean;
    errorCodes: string[];
}

export async function verifyTurnstile(token: string, opts: TurnstileOptions): Promise<TurnstileResult> {
    const fetchImpl = opts.fetchImpl ?? fetch;
    const body = new URLSearchParams({
        secret: opts.secret,
        response: token,
        // Ağ hatasında aynı anahtarla tekrar denemek "duplicate" hatası doğurmaz
        idempotency_key: crypto.randomUUID(),
    });

    let data: Record<string, unknown> | null = null;
    for (let attempt = 0; attempt < 2 && !data; attempt++) {
        try {
            const res = await fetchImpl(SITEVERIFY_URL, {
                method: 'POST',
                body,
                signal: AbortSignal.timeout(8000),
            });
            if (res.ok) data = await res.json();
        } catch {
            // bir kez daha dene
        }
    }
    if (!data) return { ok: false, errorCodes: ['siteverify-unreachable'] };

    const errorCodes = Array.isArray(data['error-codes']) ? (data['error-codes'] as string[]) : [];
    if (data.success !== true) return { ok: false, errorCodes };

    // Test anahtarı yanıtında action ve gerçek hostname bulunmaz (metadata.result_with_testing_key)
    const metadata = data.metadata as { result_with_testing_key?: unknown } | undefined;
    if (metadata?.result_with_testing_key === true) {
        return opts.allowTestingKey ? { ok: true, errorCodes: [] } : { ok: false, errorCodes: ['testing-key-not-allowed'] };
    }

    if (data.action !== opts.expectedAction) return { ok: false, errorCodes: ['action-mismatch'] };
    if (opts.expectedHostnames && !opts.expectedHostnames.includes(String(data.hostname))) {
        return { ok: false, errorCodes: ['hostname-mismatch'] };
    }
    return { ok: true, errorCodes: [] };
}
