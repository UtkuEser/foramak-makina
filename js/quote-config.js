/* ============================================================
   FORAMAK — Teklif formu PUBLIC yapılandırması
   ------------------------------------------------------------
   Bu dosya tarayıcıya gider; yalnızca herkese açık değerler yazılır:
     - Supabase proje adresi
     - Supabase publishable key (sb_publishable_…, tarayıcı için tasarlanmıştır)
     - Cloudflare Turnstile site key
     - KVKK aydınlatma metninin site içi adresi
   Secret / service_role key, Turnstile secret key, Resend API key
   ASLA bu dosyaya yazılmaz; onlar yalnızca Supabase Edge Function
   secrets içinde durur.

   Site statik yayınlandığı için (build adımı yok) değerler doğrudan
   buradan okunur; ortam sayfanın hostname'ine göre seçilir.
   ============================================================ */

window.FORAMAK_QUOTE_CONFIG = {
    environments: [
        {
            name: 'production',
            hosts: ['www.foramak.com', 'foramak.com'],
            supabaseUrl: 'https://crvefalzcibxwfbyscyz.supabase.co',
            supabasePublishableKey: 'sb_publishable_b4mXePcZXCZOF5Yatp9BPA_g7hIyv0x',
            // Cloudflare → Turnstile → widget "Site Key" (hostname: www.foramak.com, foramak.com)
            turnstileSiteKey: '0x4AAAAAAFwfCwKkB7vWGMmi',
            // Hukuken onaylanmış KVKK aydınlatma metninin adresi (ör. '/kvkk-aydinlatma-metni').
            // Doluysa formdaki KVKK bağlantısı bu adrese gider. AÇIK RİSK: onaylı metin henüz
            // yayında değil; boş olduğu sürece bağlantı href="#" kalır.
            privacyNoticeUrl: '',
            submissionsEnabled: true
        },
        {
            name: 'development',
            hosts: ['localhost', '127.0.0.1'],
            supabaseUrl: 'https://crvefalzcibxwfbyscyz.supabase.co',
            supabasePublishableKey: 'sb_publishable_b4mXePcZXCZOF5Yatp9BPA_g7hIyv0x',
            // Cloudflare resmi test site key'i — yalnızca localhost
            turnstileSiteKey: '1x00000000000000000000AA',
            privacyNoticeUrl: '',
            submissionsEnabled: true
        }
    ]
};
