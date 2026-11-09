const encoder = new TextEncoder();

/** URL-güvenli rastgele belirteç (varsayılan 32 bayt). */
export function randomToken(bytes = 32): string {
    const buf = crypto.getRandomValues(new Uint8Array(bytes));
    let bin = '';
    for (const b of buf) bin += String.fromCharCode(b);
    return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function sha256Hex(value: string): Promise<string> {
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value));
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Sabit süreli karşılaştırma (gizli değer / özet kontrolleri için). */
export function timingSafeEqual(a: string, b: string): boolean {
    const ab = encoder.encode(a);
    const bb = encoder.encode(b);
    let diff = ab.length ^ bb.length;
    const len = Math.max(ab.length, bb.length);
    for (let i = 0; i < len; i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
    return diff === 0;
}

/** Hız sınırı anahtarı: ham IP saklanmaz, tuzlu özet kullanılır. */
export async function hashIp(ip: string, salt: string): Promise<string> {
    return (await sha256Hex(`${salt}:${ip}`)).slice(0, 32);
}
