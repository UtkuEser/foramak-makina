'use strict';

/* ================================================================
   Teklif talebi başarı sayfası: /teklif-alindi
   Sayfa varsayılan olarak NÖTR içerikle üretilir; başarı içeriğini
   yalnızca js/quote-success.js, tamamlanmış bir gönderim kaydı
   bulduğunda gösterir. noindex, sitemap dışı.
   Çalıştırma: npm run build:quote
   ================================================================ */

const fs = require('fs');
const path = require('path');
const { HEADER, footer, HEAD_FONTS } = require('./service-template');

const ROOT = path.join(__dirname, '..');

const CHECK_ICON = '<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Foramak Makine teklif talebi durumu.">
    <meta name="robots" content="noindex, nofollow">
    <title>Teklif Talebi | Foramak Makine</title>
${HEAD_FONTS}
    <link rel="stylesheet" href="css/quote-form.css?v=3">
</head>
<body>

${HEADER}

<main>

    <section class="page-hero quote-done-hero" aria-label="Sayfa yolu">
        <div class="container">
            <nav class="breadcrumb" aria-label="Sayfa yolu">
                <a href="/">Ana Sayfa</a>
                <span class="breadcrumb-sep" aria-hidden="true">›</span>
                <a href="/teklif-al">Teklif Al</a>
                <span class="breadcrumb-sep" aria-hidden="true">›</span>
                <span aria-current="page">Talep Durumu</span>
            </nav>
        </div>
    </section>

    <section class="section section--light quote-done-section">
        <div class="container">
            <div class="quote-done-card" id="quote-done" data-state="empty">
                <span class="quote-done-icon">${CHECK_ICON}</span>
                <h1 class="quote-done-title" id="quote-done-title">Görüntülenecek Teklif Talebi Bulunamadı</h1>
                <p class="quote-done-text" id="quote-done-text">Bu sayfa yalnızca teklif formu gönderildikten sonra talep bilgilerinizi gösterir. Yeni bir teklif talebi oluşturabilir ya da bize doğrudan ulaşabilirsiniz.</p>

                <div class="quote-done-ref" id="quote-done-ref-box" hidden>
                    <span class="quote-done-ref-label">Referans numaranız</span>
                    <strong class="quote-done-ref-value" id="quote-done-ref"></strong>
                    <span class="quote-done-ref-hint">Bizimle iletişime geçtiğinizde bu numarayı belirtebilirsiniz.</span>
                </div>

                <p class="quote-done-note" id="quote-done-note" hidden>Ekibimize bildirim iletilirken gecikme olabilir; talebiniz kayıtlıdır ve tekrar göndermeniz gerekmez. Acil durumlar için <a href="tel:+905422381819">0542 238 18 19</a>.</p>

                <p class="quote-done-contact" id="quote-done-contact"><a href="tel:+905422381819">0542 238 18 19</a> · <a href="mailto:foramak@foramaklazer.com">foramak@foramaklazer.com</a></p>

                <div class="quote-done-actions">
                    <a href="/" class="btn btn-outline-dark">Ana Sayfaya Dön</a>
                    <a href="/teklif-al" class="btn btn-primary" id="quote-done-new">Yeni Teklif Oluştur</a>
                </div>
            </div>
        </div>
    </section>

</main>

${footer()}
<script src="js/quote-success.js?v=1"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(ROOT, 'teklif-alindi.html'), html, 'utf8');
console.log('✓ teklif-alindi.html (noindex, sitemap dışı)');
