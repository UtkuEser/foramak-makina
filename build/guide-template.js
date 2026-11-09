'use strict';

/* ================================================================
   Teknik rehber (makale) sayfası şablonu.
   Header / footer hizmet sayfalarıyla aynıdır; sayfalar /rehber/
   altında yayınlandığı için varlık yolları mutlak yola çevrilir.
   ================================================================ */

const { HEADER, footer, HEAD_FONTS } = require('./service-template');
const { escAttr: esc, seoHead, jsonLd, breadcrumbLd, footerGuides, BUSINESS, pageUrl } = require('./seo');

const PUBLISHED = '2026-11-07';

/* [metin](/yol) → iç bağlantı; geri kalan her şey kaçışlanır */
function inline(text) {
    const parts = [];
    let last = 0;
    const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
    let m;
    while ((m = re.exec(text))) {
        parts.push(esc(text.slice(last, m.index)));
        parts.push(`<a href="${esc(m[2])}">${esc(m[1])}</a>`);
        last = m.index + m[0].length;
    }
    parts.push(esc(text.slice(last)));
    return parts.join('');
}

function block(item, indent = '                ') {
    if (typeof item === 'string') return `${indent}<p>${inline(item)}</p>`;
    if (item.ul) return `${indent}<ul>\n${item.ul.map((li) => `${indent}    <li>${inline(li)}</li>`).join('\n')}\n${indent}</ul>`;
    if (item.h3) return `${indent}<h3>${esc(item.h3)}</h3>\n${item.body.map((b) => block(b, indent)).join('\n')}`;
    throw new Error('Bilinmeyen içerik bloğu');
}

function pageTitle(g) {
    const withBrand = `${g.seoTitle} | Foramak`;
    return withBrand.length <= 70 ? withBrand : g.seoTitle;
}

function renderGuidePage(g, { guides, services }) {
    const service = services.find((s) => s.slug === g.service);
    if (!service) throw new Error(`Hizmet bulunamadı: ${g.service}`);
    const related = g.related.map((slug) => {
        const r = guides.find((x) => x.slug === slug);
        if (!r) throw new Error(`İlgili rehber bulunamadı: ${slug} (${g.slug})`);
        return r;
    });
    const path = `/rehber/${g.slug}`;
    const title = pageTitle(g);

    const head = seoHead({
        title,
        description: g.metaDescription,
        path,
        type: 'article',
        ld: [
            breadcrumbLd([['Ana Sayfa', '/'], ['Hizmetler', '/hizmetler'], [service.breadcrumbLabel, `/${service.slug}`], [g.linkText, path]]),
            jsonLd({
                '@type': 'Article',
                headline: g.h1,
                description: g.metaDescription,
                inLanguage: 'tr-TR',
                mainEntityOfPage: pageUrl(path),
                datePublished: PUBLISHED,
                dateModified: PUBLISHED,
                author: { '@type': 'Organization', name: BUSINESS.name, url: BUSINESS.url },
                publisher: { '@type': 'Organization', name: BUSINESS.name, logo: { '@type': 'ImageObject', url: BUSINESS.logo } },
                about: { '@type': 'Service', name: service.title, url: pageUrl(`/${service.slug}`) },
            }),
        ],
    });

    const sections = g.sections.map((s) => `            <section class="guide-block">
                <h2>${esc(s.h2)}</h2>
${s.body.map((b) => block(b)).join('\n')}
            </section>`).join('\n\n');

    const relatedHtml = related.map((r) => `                        <li><a href="/rehber/${r.slug}">${esc(r.linkText)}</a></li>`).join('\n');

    const html = `<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${esc(g.metaDescription)}">
    <title>${esc(title)}</title>
${head}
${HEAD_FONTS}
</head>
<body>

${HEADER}

<main>

    <section class="page-hero" aria-label="Sayfa başlığı">
        <div class="container">
            <div class="page-hero-inner">
                <div class="page-hero-left guide-hero-text">
                <nav class="breadcrumb" aria-label="Sayfa yolu">
                    <a href="/">Ana Sayfa</a>
                    <span class="breadcrumb-sep" aria-hidden="true">›</span>
                    <a href="/hizmetler">Hizmetler</a>
                    <span class="breadcrumb-sep" aria-hidden="true">›</span>
                    <a href="/${service.slug}">${esc(service.breadcrumbLabel)}</a>
                    <span class="breadcrumb-sep" aria-hidden="true">›</span>
                    <span aria-current="page">Teknik Rehber</span>
                </nav>
                <p class="guide-kicker">Teknik Rehber · ${esc(service.title)}</p>
                <h1 class="page-hero-title">${esc(g.h1)}</h1>
                </div>
            </div>
        </div>
    </section>

    <section class="section section--light guide-section">
        <div class="container guide-layout">
            <article class="guide-article">
            <p class="guide-lead">${inline(g.lead)}</p>

${sections}

            <div class="guide-cta">
                <p class="guide-cta-title">Projeniz için teklif alın</p>
                <p>Teknik çiziminizi, malzeme ve adet bilgisiyle birlikte gönderin; üretim yöntemini ve teklifi çiziminiz üzerinden hazırlayalım.</p>
                <div class="guide-cta-actions">
                    <a href="/teklif-al" class="btn btn-primary">Teklif Al</a>
                    <a href="tel:+905422381819" class="guide-cta-phone">0542 238 18 19</a>
                </div>
            </div>
            </article>

            <aside class="guide-aside" aria-label="İlgili bağlantılar">
                <div class="guide-aside-card">
                    <p class="guide-aside-title">İlgili hizmet</p>
                    <a href="/${service.slug}" class="guide-aside-service">${esc(service.title)}</a>
                    <p>${esc(service.heroDesc)}</p>
                </div>
                <div class="guide-aside-card">
                    <p class="guide-aside-title">İlgili rehberler</p>
                    <ul>
${relatedHtml}
                    </ul>
                </div>
            </aside>
        </div>
    </section>

</main>

${footer(footerGuides(service.slug, guides))}
</body>
</html>
`;

    // /rehber/ altında göreli varlık yolları çalışmaz: assets/, css/, js/ → /assets/, /css/, /js/
    return html.replace(/(src|href)="(assets|css|js)\//g, '$1="/$2/');
}

module.exports = { renderGuidePage, PUBLISHED };
