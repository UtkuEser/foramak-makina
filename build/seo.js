'use strict';

/* ================================================================
   Ortak SEO yardımcıları: canonical, Open Graph, JSON-LD ve hizmet
   footer'ındaki "Teknik Bilgiler ve Rehberler" bölümü.
   İşletme verisi yalnızca sitede yayımlanan bilgilerden oluşur.
   ================================================================ */

const fs = require('fs');
const path = require('path');

const SITE = 'https://www.foramak.com';
const OG_DIR = 'assets/images/og';

/* Görünen metinlerine dokunulmayan statik sayfalar (yalnızca <head> SEO bloğu) */
const STATIC_PAGES = [
    { file: 'index.html', path: '/', image: 'assets/images/hakkımızda.png', ld: 'home' },
    { file: 'hakkimizda.html', path: '/hakkimizda', image: 'assets/images/hakkımızda2.png', crumb: 'Hakkımızda' },
    { file: 'hizmetler.html', path: '/hizmetler', image: 'assets/images/hizmetlerimiz/sac_kesim.png', crumb: 'Hizmetler' },
    { file: 'projeler.html', path: '/projeler', image: 'assets/images/projeler/kaynaklı metal konstrüksiyon.png', crumb: 'Projeler' },
    { file: 'sektorler.html', path: '/sektorler', image: 'assets/images/projeler/su arıtma.png', crumb: 'Sektörler' },
    { file: 'iletisim.html', path: '/iletisim', image: 'assets/images/hakkımızda.png', crumb: 'İletişim', ld: 'business' },
    { file: 'teklif-al.html', path: '/teklif-al', image: 'assets/images/projeler/paslanmaz lazer kesim.png', crumb: 'Teklif Al' },
];

/** Kaynak görsel → 1200×630 OG kopyasının dosya adı (ASCII) */
function ogFileName(src) {
    const map = { ç: 'c', ğ: 'g', ı: 'i', İ: 'i', ö: 'o', ş: 's', ü: 'u' };
    const base = path.basename(src).replace(/\.[a-z0-9]+$/i, '');
    return base.toLocaleLowerCase('tr').replace(/[çğıİöşü]/g, (c) => map[c]).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '.jpg';
}

function ogImagePath(src) {
    const rel = `${OG_DIR}/${ogFileName(src)}`;
    if (!fs.existsSync(path.join(__dirname, '..', rel))) {
        throw new Error(`OG görseli yok: ${rel} — build/generate-og-images.js ile üretin (kaynak: ${src})`);
    }
    return rel;
}

const BUSINESS = {
    '@type': 'LocalBusiness',
    '@id': `${SITE}/#isletme`,
    name: 'Foramak Makine Mühendislik',
    url: `${SITE}/`,
    logo: `${SITE}/assets/images/foramak_makina_logo.svg`,
    image: `${SITE}/${encodeURI('assets/images/hakkımızda.png')}`,
    telephone: '+90 542 238 18 19',
    email: 'foramak@foramaklazer.com',
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'İvedik OSB, 1401. Sk. No: 43/A',
        addressLocality: 'Yenimahalle',
        addressRegion: 'Ankara',
        postalCode: '06170',
        addressCountry: 'TR',
    },
    areaServed: { '@type': 'City', name: 'Ankara' },
};

function escAttr(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** Göreli varlık yolunu (Türkçe karakter / boşluk içerebilir) mutlak URL'ye çevirir */
function absoluteAsset(relPath) {
    return `${SITE}/${encodeURI(relPath.replace(/^\//, ''))}`;
}

function pageUrl(path) {
    return path === '/' ? `${SITE}/` : `${SITE}${path}`;
}

function jsonLd(data) {
    const json = JSON.stringify({ '@context': 'https://schema.org', ...data }, null, 0).replace(/</g, '\\u003c');
    return `    <script type="application/ld+json">${json}</script>`;
}

function breadcrumbLd(items) {
    return jsonLd({
        '@type': 'BreadcrumbList',
        itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: pageUrl(path) })),
    });
}

/**
 * <head> içine eklenecek görünmez SEO etiketleri.
 * title/description sayfanın mevcut değerleridir; burada değiştirilmez.
 */
function seoHead({ title, description, path, image, type = 'website', ld = [] }) {
    const url = pageUrl(path);
    const lines = [
        `    <link rel="canonical" href="${url}">`,
        '    <meta property="og:locale" content="tr_TR">',
        '    <meta property="og:site_name" content="Foramak Makine">',
        `    <meta property="og:type" content="${type}">`,
        `    <meta property="og:title" content="${escAttr(title)}">`,
        `    <meta property="og:description" content="${escAttr(description)}">`,
        `    <meta property="og:url" content="${url}">`,
    ];
    if (image) {
        lines.push(`    <meta property="og:image" content="${absoluteAsset(ogImagePath(image))}">`);
        lines.push('    <meta property="og:image:width" content="1200">');
        lines.push('    <meta property="og:image:height" content="630">');
    }
    lines.push(`    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">`);
    return [...lines, ...ld].join('\n');
}

/** Hizmet sayfası footer'ındaki rehber bağlantıları (yalnızca o hizmetin yayındaki makaleleri) */
function footerGuides(serviceSlug, guides) {
    const items = guides.filter((g) => g.service === serviceSlug);
    if (!items.length) return '';
    const links = items.map((g) => `                <li><a href="/rehber/${g.slug}" class="footer-link">${escAttr(g.linkText)}</a></li>`).join('\n');
    return `        <nav class="footer-guides" aria-labelledby="footer-guides-title">
            <p class="footer-col-title" id="footer-guides-title">Teknik Bilgiler ve Rehberler</p>
            <ul class="footer-guides-list">
${links}
            </ul>
        </nav>
`;
}

module.exports = { SITE, OG_DIR, STATIC_PAGES, ogFileName, BUSINESS, escAttr, absoluteAsset, pageUrl, jsonLd, breadcrumbLd, seoHead, footerGuides };
