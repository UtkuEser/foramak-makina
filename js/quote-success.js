/* ============================================================
   FORAMAK — Teklif talebi başarı sayfası (/teklif-alindi)
   ------------------------------------------------------------
   Başarı içeriği yalnızca teklif formu bu sekmede bir talebi
   sunucuda tamamladıysa gösterilir (js/quote-form.js referansı
   sessionStorage'a yazar). Doğrudan girişte, süresi geçmiş ya da
   bozuk kayıtta sayfa nötr içerikte kalır; sahte başarı gösterilmez.
   URL'de kişisel veri, referans veya belirteç taşınmaz.
   ============================================================ */

(function () {
    'use strict';

    var RESULT_KEY = 'foramak.quoteResult';
    var MAX_AGE_MS = 30 * 60 * 1000;
    var card = document.getElementById('quote-done');
    if (!card) return;

    function readResult() {
        try {
            var raw = window.sessionStorage.getItem(RESULT_KEY);
            if (!raw) return null;
            var data = JSON.parse(raw);
            var fresh = typeof data.at === 'number' && Date.now() - data.at >= 0 && Date.now() - data.at < MAX_AGE_MS;
            if (fresh && /^FOR-\d{4}-\d{4,}$/.test(data.reference || '')) return data;
            window.sessionStorage.removeItem(RESULT_KEY);
        } catch (e) {
            /* depolama kapalı ya da kayıt bozuk → nötr içerik */
        }
        return null;
    }

    var result = readResult();
    if (!result) return;

    document.getElementById('quote-done-title').textContent = 'Teklif Talebiniz Alındı';
    document.getElementById('quote-done-text').textContent =
        'Teklif talebiniz başarıyla kaydedilmiştir. Teknik ekibimiz başvurunuzu değerlendirecek ve en kısa sürede sizinle iletişime geçecektir.';
    document.getElementById('quote-done-ref').textContent = result.reference;
    document.getElementById('quote-done-ref-box').hidden = false;
    document.getElementById('quote-done-contact').hidden = true;
    if (result.notification !== 'sent') document.getElementById('quote-done-note').hidden = false;
    card.setAttribute('data-state', 'success');
    document.title = 'Teklif Talebiniz Alındı | Foramak Makine';

    // Yeni teklif oluşturulurken eski referans temizlenir
    var again = document.getElementById('quote-done-new');
    if (again) {
        again.addEventListener('click', function () {
            try { window.sessionStorage.removeItem(RESULT_KEY); } catch (e) { /* yok say */ }
        });
    }
})();
