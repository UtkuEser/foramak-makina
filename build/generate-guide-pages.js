'use strict';

/* ================================================================
   Teknik rehber sayfaları + sitemap.xml + robots.txt + statik
   sayfaların <head> SEO etiketleri.
   Çalıştırma: npm run build:seo
   (Hizmet sayfalarının footer rehber bölümü build:services ile üretilir.)
   ================================================================ */

const fs = require('fs');
const path = require('path');
const { GUIDES } = require('./guide-data');
const { SERVICES } = require('./service-data');
const { renderGuidePage, PUBLISHED } = require('./guide-template');
const { SITE, BUSINESS, STATIC_PAGES, seoHead, jsonLd, breadcrumbLd, pageUrl } = require('./seo');

const ROOT = path.join(__dirname, '..');


/* ---------- doğrulama ---------- */
function validate() {
    const slugs = new Set();
    for (const g of GUIDES) {
        if (slugs.has(g.slug)) throw new Error(`Yinelenen rehber slug: ${g.slug}`);
        slugs.add(g.slug);
        if (!SERVICES.some((s) => s.slug === g.service)) throw new Error(`Bilinmeyen hizmet: ${g.service}`);
    }
    const known = new Set(['/', '/teklif-al', ...STATIC_PAGES.map((p) => p.path), ...SERVICES.map((s) => `/${s.slug}`), ...GUIDES.map((g) => `/rehber/${g.slug}`)]);
    for (const g of GUIDES) {
        const text = JSON.stringify(g.sections) + g.lead;
        for (const m of text.matchAll(/\]\((\/[^)\s]*)\)/g)) {
            if (!known.has(m[1])) throw new Error(`Kırık iç bağlantı ${m[1]} (${g.slug})`);
            if (m[1] === `/rehber/${g.slug}`) throw new Error(`Sayfa kendine bağlantı veriyor (${g.slug})`);
        }
    }
    for (const s of SERVICES) {
        if (!GUIDES.some((g) => g.service === s.slug)) throw new Error(`Rehberi olmayan hizmet: ${s.slug}`);
    }
}

/* ---------- statik sayfalar: <head> SEO bloğu ---------- */
const SEO_START = '    <!-- SEO -->';
const SEO_END = '    <!-- /SEO -->';

function applyStaticSeo(page) {
    const file = path.join(ROOT, page.file);
    let html = fs.readFileSync(file, 'utf8');
    const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
    const description = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
    if (!title || !description) throw new Error(`${page.file}: title/description bulunamadı`);
    const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

    const ld = [];
    if (page.ld === 'home') {
        ld.push(jsonLd({ '@type': 'WebSite', '@id': `${SITE}/#website`, name: 'Foramak Makine', url: `${SITE}/`, inLanguage: 'tr-TR', publisher: { '@id': BUSINESS['@id'] } }));
        ld.push(jsonLd(BUSINESS));
    }
    if (page.ld === 'business') ld.push(jsonLd(BUSINESS));
    if (page.crumb) ld.push(breadcrumbLd([['Ana Sayfa', '/'], [page.crumb, page.path]]));

    const block = `${SEO_START}\n${seoHead({ title: decode(title), description: decode(description), path: page.path, image: page.image, ld })}\n${SEO_END}`;

    if (html.includes(SEO_START)) {
        html = html.replace(new RegExp(`${SEO_START}[\\s\\S]*?${SEO_END}`), block);
    } else {
        html = html.replace(/(<title>[^<]*<\/title>\n)/, `$1${block}\n`);
    }
    if (!html.includes(SEO_START)) throw new Error(`${page.file}: SEO bloğu eklenemedi`);
    fs.writeFileSync(file, html, 'utf8');
}

/* ---------- sitemap.xml / robots.txt ---------- */
function writeSitemap() {
    const urls = [
        ...STATIC_PAGES.map((p) => p.path),
        ...SERVICES.map((s) => `/${s.slug}`),
        ...GUIDES.map((g) => `/rehber/${g.slug}`),
    ];
    const body = urls.map((u) => `  <url>\n    <loc>${pageUrl(u)}</loc>\n    <lastmod>${PUBLISHED}</lastmod>\n  </url>`).join('\n');
    fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, 'utf8');
    return urls.length;
}

function writeRobots() {
    fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8');
}

/* ---------- çalıştır ---------- */
validate();

fs.mkdirSync(path.join(ROOT, 'rehber'), { recursive: true });
for (const g of GUIDES) {
    fs.writeFileSync(path.join(ROOT, 'rehber', `${g.slug}.html`), renderGuidePage(g, { guides: GUIDES, services: SERVICES }), 'utf8');
}
console.log(`✓ ${GUIDES.length} rehber sayfası (rehber/)`);

STATIC_PAGES.forEach(applyStaticSeo);
console.log(`✓ ${STATIC_PAGES.length} statik sayfanın <head> SEO bloğu`);

console.log(`✓ sitemap.xml (${writeSitemap()} URL)`);
writeRobots();
console.log('✓ robots.txt');
