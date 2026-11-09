import { createClient, type SupabaseClient } from 'npm:@supabase/supabase-js@2.117.3';
import { env } from './http.ts';

/*
 * Sunucu tarafı Supabase istemcisi (RLS'i atlar). Yalnızca Edge Function
 * içinde kullanılır; anahtar Supabase tarafından otomatik sağlanır:
 *   SUPABASE_SECRET_KEYS  → yeni sb_secret_ anahtarları (JSON, "default")
 *   SUPABASE_SERVICE_ROLE_KEY → eski anahtar (geçiş dönemi yedeği)
 */
export function createAdminClient(): SupabaseClient {
    const url = env('SUPABASE_URL');
    const key = resolveSecretKey();
    if (!url || !key) throw new Error('SUPABASE_URL veya sunucu anahtarı bulunamadı');

    return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
}

function resolveSecretKey(): string {
    const keyName = env('QUOTE_SECRET_KEY_NAME') || 'default';
    const secretKeys = env('SUPABASE_SECRET_KEYS');
    if (secretKeys) {
        try {
            const parsed = JSON.parse(secretKeys) as Record<string, string>;
            if (parsed[keyName]) return parsed[keyName];
        } catch {
            console.error('[quote] SUPABASE_SECRET_KEYS okunamadı');
        }
    }
    return env('SUPABASE_SERVICE_ROLE_KEY');
}
