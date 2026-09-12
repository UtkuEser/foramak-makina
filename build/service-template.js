'use strict';

const { icon } = require('./icons');

/* ================================================================
   Sabit, tüm hizmet sayfalarında birebir aynı kalan bloklar
   (header, mobil menü, footer, WhatsApp float). Mevcut tasarımdan
   birebir alınmıştır — içerik burada değişmez, sadece bu dosyadan
   tek noktadan üretilir.
   ================================================================ */

const HEAD_FONTS = `    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css?v=25">
    <link rel="stylesheet" href="css/responsive.css?v=17">`;

/* ----------------------------------------------------------------
   Blueprint dekoratif çizimler — rulman / dişli / ölçü çizgisi.
   Salt dekoratif (aria-hidden), CTA ve footer arka planında düşük
   opaklıkla kullanılır; mobilde CSS ile tamamen gizlenir.
   ---------------------------------------------------------------- */
/* CLUSTER_TL — dişli + rulman + eksen çizgileri + ölçü hattı + Ø işaret çizgisi */
const CLUSTER_TL = `<div class="svc2-blueprint-deco svc2-blueprint-deco--cluster-tl" aria-hidden="true"><svg viewBox="0 0 440 440" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><g class="deco-axis" stroke-dasharray="1 6 10 6"><line x1="0" y1="150" x2="440" y2="150"/><line x1="150" y1="0" x2="150" y2="440"/></g><g><circle cx="150" cy="150" r="118" stroke-dasharray="2 5"/><rect x="142.5" y="34" width="15" height="20"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(25.71 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(51.43 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(77.14 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(102.86 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(128.57 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(154.29 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(180 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(205.71 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(231.43 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(257.14 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(282.86 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(308.57 150 150)"/><rect x="142.5" y="34" width="15" height="20" transform="rotate(334.29 150 150)"/><circle cx="150" cy="150" r="96"/><circle cx="150" cy="150" r="60"/><circle cx="194" cy="150" r="5"/><circle cx="172" cy="188.11" r="5"/><circle cx="128" cy="188.11" r="5"/><circle cx="106" cy="150" r="5"/><circle cx="128" cy="111.89" r="5"/><circle cx="172" cy="111.89" r="5"/><circle cx="150" cy="150" r="20"/><circle cx="150" cy="150" r="4" fill="currentColor" stroke="none"/></g><g class="deco-soft"><circle cx="332" cy="300" r="70"/><circle cx="332" cy="300" r="42"/><circle cx="388" cy="300" r="7"/><circle cx="371.6" cy="339.6" r="7"/><circle cx="332" cy="356" r="7"/><circle cx="292.4" cy="339.6" r="7"/><circle cx="276" cy="300" r="7"/><circle cx="292.4" cy="260.4" r="7"/><circle cx="332" cy="244" r="7"/><circle cx="371.6" cy="260.4" r="7"/><line x1="240" y1="300" x2="424" y2="300" stroke-dasharray="1 5 8 5"/><line x1="332" y1="208" x2="332" y2="392" stroke-dasharray="1 5 8 5"/></g><g class="deco-dim"><line x1="32" y1="408" x2="268" y2="408"/><line x1="32" y1="398" x2="32" y2="418"/><line x1="268" y1="398" x2="268" y2="418"/><line x1="32" y1="408" x2="40" y2="404"/><line x1="32" y1="408" x2="40" y2="412"/><line x1="268" y1="408" x2="260" y2="404"/><line x1="268" y1="408" x2="260" y2="412"/><line x1="246.66" y1="82.32" x2="292.66" y2="42.32"/><line x1="292.66" y1="42.32" x2="318.66" y2="42.32"/><circle cx="326.66" cy="42.32" r="5"/></g></svg></div>`;

/* CLUSTER_BR — flanş + cıvata dizilimi + boru kesiti (tarama) + eksen + ölçü hattı */
const CLUSTER_BR = `<div class="svc2-blueprint-deco svc2-blueprint-deco--cluster-br" aria-hidden="true"><svg viewBox="0 0 440 440" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><g class="deco-axis" stroke-dasharray="1 6 10 6"><line x1="0" y1="300" x2="440" y2="300"/><line x1="300" y1="0" x2="300" y2="440"/></g><g><line x1="0" y1="268" x2="182" y2="268"/><line x1="0" y1="332" x2="182" y2="332"/><g class="deco-soft"><line x1="-50" y1="332" x2="14" y2="268"/><line x1="-36" y1="332" x2="28" y2="268"/><line x1="-22" y1="332" x2="42" y2="268"/><line x1="-8" y1="332" x2="56" y2="268"/><line x1="6" y1="332" x2="70" y2="268"/><line x1="20" y1="332" x2="84" y2="268"/><line x1="34" y1="332" x2="98" y2="268"/><line x1="48" y1="332" x2="112" y2="268"/><line x1="62" y1="332" x2="126" y2="268"/><line x1="76" y1="332" x2="140" y2="268"/><line x1="90" y1="332" x2="154" y2="268"/><line x1="104" y1="332" x2="168" y2="268"/><line x1="118" y1="332" x2="182" y2="268"/><line x1="132" y1="332" x2="196" y2="268"/><line x1="146" y1="332" x2="210" y2="268"/><line x1="160" y1="332" x2="224" y2="268"/><line x1="174" y1="332" x2="238" y2="268"/></g></g><g><circle cx="300" cy="300" r="122"/><circle cx="300" cy="300" r="50"/><circle cx="300" cy="300" r="4" fill="currentColor" stroke="none"/><circle cx="396" cy="300" r="8"/><circle cx="367.88" cy="367.88" r="8"/><circle cx="300" cy="396" r="8"/><circle cx="232.12" cy="367.88" r="8"/><circle cx="204" cy="300" r="8"/><circle cx="232.12" cy="232.12" r="8"/><circle cx="300" cy="204" r="8"/><circle cx="367.88" cy="232.12" r="8"/></g><g class="deco-soft"><circle cx="300" cy="300" r="96"/><polygon points="300,195 307.79,199.5 307.79,208.5 300,213 292.21,208.5 292.21,199.5"/><polygon points="367.88,358.88 375.67,363.38 375.67,372.38 367.88,376.88 360.09,372.38 360.09,363.38"/></g><g class="deco-dim"><line x1="178" y1="408" x2="422" y2="408"/><line x1="178" y1="398" x2="178" y2="418"/><line x1="422" y1="398" x2="422" y2="418"/><line x1="178" y1="408" x2="186" y2="404"/><line x1="178" y1="408" x2="186" y2="412"/><line x1="422" y1="408" x2="414" y2="404"/><line x1="422" y1="408" x2="414" y2="412"/></g></svg></div>`;

/* CLUSTER_SCHEME — dairesel ölçü şeması (protractor) + eksen — iki ana küme arasını doldurur */
const CLUSTER_SCHEME = `<div class="svc2-blueprint-deco svc2-blueprint-deco--scheme" aria-hidden="true"><svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"><circle cx="100" cy="100" r="84"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="30"/><line x1="160" y1="100" x2="184" y2="100"/><line x1="157.96" y1="115.53" x2="181.14" y2="121.74"/><line x1="151.96" y1="130" x2="172.75" y2="142"/><line x1="142.43" y1="142.43" x2="159.4" y2="159.4"/><line x1="130" y1="151.96" x2="142" y2="172.75"/><line x1="115.53" y1="157.96" x2="121.74" y2="181.14"/><line x1="100" y1="160" x2="100" y2="184"/><line x1="84.47" y1="157.96" x2="78.26" y2="181.14"/><line x1="70" y1="151.96" x2="58" y2="172.75"/><line x1="57.57" y1="142.43" x2="40.6" y2="159.4"/><line x1="48.04" y1="130" x2="27.25" y2="142"/><line x1="42.04" y1="115.53" x2="18.86" y2="121.74"/><line x1="40" y1="100" x2="16" y2="100"/><line x1="42.04" y1="84.47" x2="18.86" y2="78.26"/><line x1="48.04" y1="70" x2="27.25" y2="58"/><line x1="57.57" y1="57.57" x2="40.6" y2="40.6"/><line x1="70" y1="48.04" x2="58" y2="27.25"/><line x1="84.47" y1="42.04" x2="78.26" y2="18.86"/><line x1="100" y1="40" x2="100" y2="16"/><line x1="115.53" y1="42.04" x2="121.74" y2="18.86"/><line x1="130" y1="48.04" x2="142" y2="27.25"/><line x1="142.43" y1="57.57" x2="159.4" y2="40.6"/><line x1="151.96" y1="70" x2="172.75" y2="58"/><line x1="157.96" y1="84.47" x2="181.14" y2="78.26"/><g class="deco-axis" stroke-dasharray="1 5 8 5"><line x1="8" y1="100" x2="192" y2="100"/><line x1="100" y1="8" x2="100" y2="192"/></g></svg></div>`;

/* DECO_RULER — footer üst kenarında ince ölçü/cetvel şeridi */
const DECO_RULER = `<div class="svc2-blueprint-deco svc2-blueprint-deco--ruler" aria-hidden="true"><svg viewBox="0 0 1000 40" preserveAspectRatio="none" fill="none" stroke="currentColor" stroke-width="1"><line x1="0" y1="20" x2="1000" y2="20"/><line x1="0" y1="9" x2="0" y2="31"/><line x1="1000" y1="9" x2="1000" y2="31"/><line x1="100" y1="14" x2="100" y2="26"/><line x1="200" y1="14" x2="200" y2="26"/><line x1="300" y1="14" x2="300" y2="26"/><line x1="400" y1="14" x2="400" y2="26"/><line x1="500" y1="14" x2="500" y2="26"/><line x1="600" y1="14" x2="600" y2="26"/><line x1="700" y1="14" x2="700" y2="26"/><line x1="800" y1="14" x2="800" y2="26"/><line x1="900" y1="14" x2="900" y2="26"/></svg></div>`;

const HEADER = `<!-- ===== HEADER ===== -->
<header class="header" role="banner">
    <div class="container header-inner">
        <a href="/" class="logo" aria-label="Foramak Makine Ana Sayfa">
            <img src="assets/images/foramak_makina_logo.svg" alt="Foramak Makine Mühendislik" class="logo-img" height="62">
        </a>
        <nav class="nav" aria-label="Ana menü">
            <ul class="nav-list" role="list">
                <li><a href="/" class="nav-link">Ana Sayfa</a></li>
                <li><a href="/hakkimizda" class="nav-link">Hakkımızda</a></li>
                <li class="nav-item nav-item--mega">
                    <a href="/hizmetler" class="nav-link">Hizmetler <svg class="nav-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="1,1 5,5 9,1"/></svg></a>
                    <div class="mega-menu" role="region" aria-label="Hizmet kategorileri">
                        <div class="mega-inner">
                            <div class="mega-grid">
                                <a href="/sac-lazer-kesim" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Sac Lazer Kesim</strong><span class="mega-card-desc">Sac metal gruplarında hassas kesim</span></a>
                                <a href="/boru-profil-lazer-kesim" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Boru / Profil Lazer Kesim</strong><span class="mega-card-desc">Boru ve profil gruplarında teknik kesim</span></a>
                                <a href="/sac-bukum" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Sac Büküm</strong><span class="mega-card-desc">Ölçüye göre form ve açı çalışmaları</span></a>
                                <a href="/kaynakli-imalat" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Kaynaklı İmalat</strong><span class="mega-card-desc">Kaynak ve montaj süreçleri</span></a>
                                <a href="/paslanmaz-imalat" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Paslanmaz İmalat</strong><span class="mega-card-desc">Paslanmaz çelik üretim desteği</span></a>
                                <a href="/aluminyum-imalat" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Alüminyum İmalat</strong><span class="mega-card-desc">Hafif yapı ve özel parça üretimi</span></a>
                                <a href="/metal-isleme" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Metal İşleme</strong><span class="mega-card-desc">Delme, form ve yüzey hazırlama</span></a>
                                <a href="/ozel-proje-imalati" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Özel Proje İmalatı</strong><span class="mega-card-desc">Proje bazlı özel üretim</span></a>
                                <a href="/moduler-tesisat-sistemleri" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Modüler Tesisat</strong><span class="mega-card-desc">Paslanmaz ve çelik tesisat çözümleri</span></a>
                                <a href="/aritma-sistemleri" class="mega-card"><span class="mega-card-accent" aria-hidden="true"></span><strong class="mega-card-title">Arıtma Sistemleri</strong><span class="mega-card-desc">Su, gaz, toz, baca arıtma ve filtreler</span></a>
                            </div>
                            <div class="mega-footer">
                                <a href="/hizmetler" class="mega-footer-link">Tüm Hizmetleri İncele <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
                            </div>
                        </div>
                    </div>
                </li>
                <li><a href="/projeler" class="nav-link">Projeler</a></li>
                <li><a href="/iletisim" class="nav-link">İletişim</a></li>
            </ul>
            <a href="/teklif-al" class="btn btn-primary nav-cta">Teklif Al</a>
        </nav>
        <button class="hamburger" aria-label="Menüyü aç/kapat" aria-expanded="false">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
        </button>
    </div>
</header>
<nav class="mobile-menu" aria-label="Mobil menü">
    <a href="/" class="mobile-nav-link">Ana Sayfa</a>
    <a href="/hakkimizda" class="mobile-nav-link">Hakkımızda</a>
    <div class="mobile-nav-group">
        <div class="mobile-nav-row">
            <a href="/hizmetler" class="mobile-nav-link">Hizmetler</a>
            <button class="mobile-submenu-toggle" type="button" aria-expanded="false" aria-controls="mobile-services-submenu" aria-label="Hizmetler alt menüsünü aç">
                <span class="mobile-submenu-arrow">⌄</span>
            </button>
        </div>
        <div class="mobile-submenu" id="mobile-services-submenu" hidden>
            <a href="/sac-lazer-kesim">Sac Lazer Kesim</a>
            <a href="/boru-profil-lazer-kesim">Boru / Profil Lazer Kesim</a>
            <a href="/sac-bukum">Sac Büküm</a>
            <a href="/kaynakli-imalat">Kaynaklı İmalat</a>
            <a href="/paslanmaz-imalat">Paslanmaz İmalat</a>
            <a href="/aluminyum-imalat">Alüminyum İmalat</a>
            <a href="/metal-isleme">Metal İşleme</a>
            <a href="/ozel-proje-imalati">Özel Proje İmalatı</a>
            <a href="/moduler-tesisat-sistemleri">Modüler Tesisat Sistemleri</a>
            <a href="/aritma-sistemleri">Arıtma Sistemleri</a>
        </div>
    </div>
    <a href="/projeler" class="mobile-nav-link">Projeler</a>
    <a href="/iletisim" class="mobile-nav-link">İletişim</a>
    <a href="/teklif-al" class="btn btn-primary mobile-nav-cta">Teklif Al</a>
</nav>`;

const FOOTER = `<footer class="footer" role="contentinfo">
    ${DECO_RULER}
    ${CLUSTER_BR}
    <div class="container">
        <div class="footer-grid">
            <div>
                <a href="/" class="logo footer-logo" aria-label="Foramak Makine Ana Sayfa">
                    <img src="assets/images/foramak_makina_logo.svg" alt="Foramak Makine Mühendislik" class="logo-img" height="62">
                </a>
                <p class="footer-desc">Foramak Makine; lazer kesim, büküm, kaynaklı imalat ve özel metal üretim süreçlerinde teknik çözümler sunar.</p>
            </div>
            <div>
                <p class="footer-col-title">Hizmetler</p>
                <ul class="footer-links">
                    <li><a href="/sac-lazer-kesim" class="footer-link">Sac Lazer Kesim</a></li>
                    <li><a href="/boru-profil-lazer-kesim" class="footer-link">Boru/Profil Lazer Kesim</a></li>
                    <li><a href="/kaynakli-imalat" class="footer-link">Kaynaklı İmalat</a></li>
                    <li><a href="/moduler-tesisat-sistemleri" class="footer-link">Modüler Tesisat</a></li>
                    <li><a href="/aritma-sistemleri" class="footer-link">Arıtma Sistemleri</a></li>
                    <li><a href="/hizmetler" class="footer-link">Tüm Hizmetler</a></li>
                </ul>
            </div>
            <div>
                <p class="footer-col-title">Kurumsal</p>
                <ul class="footer-links">
                    <li><a href="/hakkimizda" class="footer-link">Hakkımızda</a></li>
                    <li><a href="/projeler" class="footer-link">Projeler</a></li>
                    <li><a href="/sektorler" class="footer-link">Sektörler</a></li>
                    <li><a href="/teklif-al" class="footer-link">Teklif Al</a></li>
                    <li><a href="/iletisim" class="footer-link">İletişim</a></li>
                </ul>
            </div>
            <div>
                <p class="footer-col-title">İletişim</p>
                <div class="footer-contact-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
                    <a href="tel:+905422381819">0542 238 18 19</a>
                </div>
                <div class="footer-contact-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    <a href="mailto:foramak@foramaklazer.com">foramak@foramaklazer.com</a>
                </div>
                <div class="footer-contact-item">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>İvedik OSB, 1401. Sk. 43/A,<br>06170 Yenimahalle / Ankara</span>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p class="footer-copy">© <span class="js-year"></span> Foramak Makine Mühendislik. Tüm hakları saklıdır.</p>
            <a href="https://www.eek-media.com/by-eek" class="footer-credit-link" target="_blank" rel="noopener noreferrer" aria-label="EEK tarafından tasarlandı">by EEK</a>
        </div>
    </div>
</footer>

<script src="js/main.js?v=9"></script>

<!-- WhatsApp Float Button -->
<a
  href="https://wa.me/905422381819"
  class="whatsapp-float"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="WhatsApp ile iletişime geç"
>
  <span class="whatsapp-float__icon">
    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M24 4C12.95 4 4 12.95 4 24c0 3.55.93 6.88 2.56 9.77L4 44l10.47-2.5A19.9 19.9 0 0024 44c11.05 0 20-8.95 20-20S35.05 4 24 4z" fill="#ffffff"/>
      <path d="M35.17 29.93c-.47-.24-2.8-1.38-3.23-1.54-.44-.16-.76-.24-1.08.24-.32.47-1.24 1.54-1.52 1.86-.28.32-.56.36-1.03.12-.47-.24-1.99-.73-3.79-2.34-1.4-1.25-2.35-2.79-2.62-3.26-.28-.47-.03-.72.21-.96.22-.21.47-.56.71-.84.24-.28.32-.47.47-.79.16-.32.08-.6-.04-.84-.12-.24-1.08-2.6-1.48-3.56-.39-.93-.78-.8-1.08-.82-.28-.01-.6-.02-.92-.02s-.84.12-1.28.6c-.44.47-1.68 1.64-1.68 4s1.72 4.64 1.96 4.96c.24.32 3.38 5.16 8.2 7.24 1.14.49 2.04.79 2.73 1.01 1.15.36 2.19.31 3.02.19.92-.14 2.8-1.15 3.2-2.25.4-1.11.4-2.06.28-2.25-.12-.2-.44-.32-.92-.56z" fill="#25D366"/>
    </svg>
  </span>
</a>`;

const WHATSAPP_URL = 'https://wa.me/905422381819';

/* ================================================================
   Yardımcılar
   ================================================================ */

function esc(str) {
    return String(str == null ? '' : str);
}

function specRows(specs, opts) {
    const rowClass = opts.wrap === 'tech' ? 'svc2-tech-panel-list' : 'svc2-data-panel-list';
    const labelClass = opts.wrap === 'tech' ? 'svc2-tech-row-label' : 'svc2-data-row-label';
    const valueClass = opts.wrap === 'tech' ? 'svc2-tech-row-value' : 'svc2-data-row-value';
    return `<ul class="${rowClass}">
${specs.map(s => `                        <li>${icon(s.icon)}<div><span class="${labelClass}">${esc(s.label)}</span><span class="${valueClass}">${esc(s.value)}</span></div></li>`).join('\n')}
                    </ul>`;
}

function tagPills(tags) {
    return tags.map(t => `<span class="stag">${esc(t)}</span>`).join('\n                        ');
}

function heroTitleHtml(cfg) {
    if (Array.isArray(cfg.heroTitleLines) && cfg.heroTitleLines.length) {
        return cfg.heroTitleLines.map(esc).join('<br>');
    }
    return esc(cfg.title);
}

/* ================================================================
   ServiceHero
   ================================================================ */
function ServiceHero(cfg) {
    return `    <!-- ===== SERVICE HERO (v2) ===== -->
    <section class="svc2-hero service-hero" aria-label="Sayfa başlığı">
        <div class="container">
            <nav class="breadcrumb" aria-label="Sayfa yolu">
                <a href="/">Ana Sayfa</a>
                <span class="breadcrumb-sep" aria-hidden="true">›</span>
                <a href="/hizmetler">Hizmetler</a>
                <span class="breadcrumb-sep" aria-hidden="true">›</span>
                <span aria-current="page">${esc(cfg.breadcrumbLabel)}</span>
            </nav>

            <div class="svc2-hero-inner">
                <div class="svc2-hero-left">
                    <div class="svc2-num-label svc2-num-label--on-dark">
                        <span class="svc2-num-line" aria-hidden="true"></span>
                        <span class="section-label">HİZMET ${esc(cfg.serviceNumber)}</span>
                    </div>
                    <h1 class="svc2-hero-title">${heroTitleHtml(cfg)}</h1>
                    <p class="svc2-hero-desc">${esc(cfg.heroDesc)}</p>
                    <div class="svc2-hero-actions">
                        <a href="/teklif-al" class="btn btn-primary">Teklif Al</a>
                        <a href="/hizmetler" class="btn btn-outline-white">Tüm Hizmetler</a>
                    </div>
                    <div class="svc2-trust-row">
                        <div class="svc2-trust-item">${icon('check')}<span>Yüksek Kalite ve Güvenilirlik</span></div>
                        <div class="svc2-trust-item">${icon('gear')}<span>Endüstriyel Tecrübe</span></div>
                        <div class="svc2-trust-item">${icon('target')}<span>Projeye Özel Çözüm</span></div>
                    </div>
                </div>

                <div class="svc2-hero-right">
                    <div class="svc2-hero-visual">
                        <img src="${esc(cfg.heroImage)}" alt="${esc(cfg.title)}" loading="eager">
                        <span class="svc2-hero-corner svc2-hero-corner--tl" aria-hidden="true"></span>
                        <span class="svc2-hero-corner svc2-hero-corner--br" aria-hidden="true"></span>
                    </div>${cfg.heroTechPanel === false ? '' : `
                    <div class="svc2-tech-panel service-tech-card">
                        <div class="svc2-tech-panel-title">TEKNİK ÖZET</div>
                        ${specRows(cfg.heroSpecs, { wrap: 'tech' })}
                    </div>`}
                </div>
            </div>
        </div>
    </section>`;
}

/* ================================================================
   ServiceOverview (+ TechnicalSummary/TechnicalData panel)
   ================================================================ */
function ServiceOverview(cfg) {
    return `    <!-- ===== SERVICE OVERVIEW (v2) ===== -->
    <section class="svc2-overview service-overview" id="kapsam" aria-labelledby="overview-title">
        <div class="container">
            <div class="svc2-overview-grid">
                <div class="svc2-overview-left reveal">
                    <div class="svc2-num-label">
                        <span class="svc2-num-line" aria-hidden="true"></span>
                        <span class="section-label">02 — HİZMET DETAYI</span>
                    </div>
                    <h2 class="svc2-overview-title" id="overview-title">${esc(cfg.title)}</h2>
                    ${cfg.overviewParagraphs.map(p => `<p>${esc(p)}</p>`).join('\n                    ')}
                    <div class="svc2-tags">
                        ${tagPills(cfg.tags)}
                    </div>
                </div>

                <div class="svc2-overview-right reveal reveal-d2">
                    <div class="svc2-data-card service-tech-card">
                        <div class="svc2-data-card-title">TEKNİK VERİLER</div>
                        <p class="svc2-data-card-sub">Bu hizmet için hızlı teknik değerlendirme bilgileri.</p>
                        ${specRows(cfg.technicalSpecs, { wrap: 'data' })}
                    </div>
                </div>
            </div>
        </div>
    </section>`;
}

/* ================================================================
   MaterialGrid
   ================================================================ */
function materialCard(m) {
    return `                <div class="svc2-material-card service-material-card">
                    <span class="svc2-material-icon">${icon(m.icon)}</span>
                    <h3 class="svc2-material-card-title">${esc(m.title)}</h3>
                    <p class="svc2-material-card-desc">${esc(m.desc)}</p>
                </div>`;
}

function MaterialGrid(cfg) {
    const cards = cfg.materials.map(materialCard).join('\n');

    return `    <!-- ===== MATERIAL GRID (v2) ===== -->
    <section class="svc2-materials" aria-labelledby="materials-title">
        <div class="container">
            <div class="svc2-num-label">
                <span class="svc2-num-line" aria-hidden="true"></span>
                <span class="section-label">${esc(cfg.materialsLabel)}</span>
            </div>
            <h2 class="section-title" id="materials-title" style="margin-bottom: var(--sp-lg);">${esc(cfg.materialsTitle)}</h2>
            <div class="svc2-material-grid reveal">
${cards}
            </div>
        </div>
    </section>`;
}

/* ================================================================
   ProductGroups — bazı hizmetlerde (örn. Paslanmaz İmalat) MaterialGrid'in
   hemen ardından gelen, daha detaylı ürün/çözüm grubu kartları. Aynı kart
   componentini (materialCard) auto-fit grid ile kullanır; cfg.productGroups
   tanımlı değilse hiçbir şey render etmez.
   ================================================================ */
function ProductGroups(cfg) {
    if (!cfg.productGroups) return '';
    const g = cfg.productGroups;
    const cards = g.items.map(materialCard).join('\n');

    return `

    <!-- ===== PRODUCT GROUPS (v2) ===== -->
    <section class="svc2-materials" style="background: var(--color-bg-section);" aria-labelledby="product-groups-title">
        <div class="container">
            <div class="svc2-num-label">
                <span class="svc2-num-line" aria-hidden="true"></span>
                <span class="section-label">${esc(g.label)}</span>
            </div>
            <h2 class="section-title" id="product-groups-title" style="margin-bottom: var(--sp-lg);">${esc(g.title)}</h2>
            <div class="svc2-material-grid svc2-material-grid--auto reveal">
${cards}
            </div>
        </div>
    </section>`;
}

/* ================================================================
   IndustryGrid
   ================================================================ */
function IndustryGrid(cfg) {
    const cards = cfg.industries.map((s, i) => {
        const num = String(i + 1).padStart(2, '0');
        const featured = i === 0 ? ' svc2-industry-card--featured' : '';
        return `                <div class="svc2-industry-card service-use-card${featured}">
                    <div class="svc2-industry-media">${icon(s.icon)}</div>
                    <div class="svc2-industry-body">
                        <span class="svc2-industry-num">${num}</span>
                        <h3 class="svc2-industry-title">${esc(s.title)}</h3>
                        <p class="svc2-industry-desc">${esc(s.desc)}</p>
                        <span class="svc2-industry-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="19" x2="19" y2="5"/><polyline points="8 5 19 5 19 16"/></svg></span>
                    </div>
                </div>`;
    }).join('\n');

    return `    <!-- ===== INDUSTRY GRID (v2) ===== -->
    <section class="svc2-industries" aria-labelledby="industries-title">
        <div class="container">
            <div class="svc2-industry-head">
                <div class="svc2-num-label">
                    <span class="svc2-num-line" aria-hidden="true"></span>
                    <span class="section-label">04 — KULLANIM ALANLARI</span>
                </div>
                <h2 class="section-title" id="industries-title" style="margin-bottom:0;">Hangi Sektörlerde Kullanılır?</h2>
                <p class="svc2-industry-head-desc">${esc(cfg.industriesDesc)}</p>
            </div>
            <div class="svc2-industry-grid reveal">
${cards}
            </div>
        </div>
    </section>`;
}

/* ================================================================
   ServiceCTA
   ================================================================ */
const WHATSAPP_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

function ServiceCTA(cfg) {
    return `    <!-- ===== SERVICE CTA (v2) ===== -->
    <section class="svc2-cta service-cta" aria-labelledby="cta-title">
        ${CLUSTER_TL}
        ${CLUSTER_BR}
        ${CLUSTER_SCHEME}
        <div class="container svc2-cta-inner">
            <div class="svc2-cta-left">
                <div class="svc2-num-label svc2-num-label--on-dark">
                    <span class="svc2-num-line" aria-hidden="true"></span>
                    <span class="section-label">05 — PROJENİZE DEĞER KATALIM</span>
                </div>
                <h2 class="svc2-cta-title" id="cta-title">${esc(cfg.ctaTitle)}</h2>
                <p class="svc2-cta-desc">${esc(cfg.ctaDescription)}</p>
            </div>
            <div class="svc2-cta-right">
                <div class="svc2-cta-actions">
                    <a href="/teklif-al" class="btn btn-primary">Teklif Al</a>
                    <a href="${WHATSAPP_URL}" class="btn btn-outline-white" target="_blank" rel="noopener noreferrer">${WHATSAPP_ICON}WhatsApp ile Dosya Gönder</a>
                </div>
            </div>
        </div>
    </section>`;
}

/* ================================================================
   Tam sayfa render
   ================================================================ */
function renderServicePage(cfg) {
    const sections = [
        ServiceHero(cfg),
        ServiceOverview(cfg),
        MaterialGrid(cfg) + ProductGroups(cfg),
        IndustryGrid(cfg),
        ServiceCTA(cfg)
    ].join('\n\n');

    return `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${esc(cfg.metaDescription)}">
    <title>${esc(cfg.title)} | Foramak Makine</title>
${HEAD_FONTS}
</head>
<body>

${HEADER}

<main>

${sections}

</main>

${FOOTER}
</body>
</html>
`;
}

module.exports = { renderServicePage };
