/* ============================================================
   FORAMAK — Teklif formu PUBLIC yapılandırması
   ------------------------------------------------------------
   Bu dosya tarayıcıya gider; yalnızca herkese açık değerler yazılır:
     - Supabase proje adresi
     - Supabase publishable key (sb_publishable_…, tarayıcı için tasarlanmıştır)
     - Cloudflare Turnstile site key
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
            supabaseUrl: '',             // https://<project-ref>.supabase.co
            supabasePublishableKey: '',  // sb_publishable_…
            turnstileSiteKey: '',        // Cloudflare panelindeki gerçek site key
            // KVKK ve yurt dışı aktarım değerlendirmesi tamamlanmadan true yapılmaz
            submissionsEnabled: false
        },
        {
            name: 'development',
            hosts: ['localhost', '127.0.0.1'],
            supabaseUrl: 'https://crvefalzcibxwfbyscyz.supabase.co',
            supabasePublishableKey: 'sb_publishable_b4mXePcZXCZOF5Yatp9BPA_g7hIyv0x',
            // Cloudflare resmi test site key'i — yalnızca localhost
            turnstileSiteKey: '1x00000000000000000000AA',
            submissionsEnabled: true
        }
    ]
};
