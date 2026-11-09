'use strict';

/* ================================================================
   Open Graph görselleri: 1200×630 JPEG kopyalar (assets/images/og/).
   Kaynak görseller değişmez. sharp proje bağımlılığı değildir;
   görsel eklendiğinde bir kez çalıştırılır:
     NODE_PATH=<sharp kurulu node_modules> node build/generate-og-images.js
   Gereken görseller sayfa verisinden (statik sayfalar ve hizmetler)
   okunur; rehber sayfaları görsel kullanmaz.
   ================================================================ */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { OG_DIR, STATIC_PAGES, ogFileName } = require('./seo');
const { SERVICES } = require('./service-data');

const ROOT = path.join(__dirname, '..');

const sources = new Set([
    ...STATIC_PAGES.map((p) => p.image),
    ...SERVICES.map((s) => s.heroImage),
]);

fs.mkdirSync(path.join(ROOT, OG_DIR), { recursive: true });
(async () => {
    for (const src of sources) {
        const out = path.join(ROOT, OG_DIR, ogFileName(src));
        const info = await sharp(path.join(ROOT, src))
            .resize(1200, 630, { fit: 'cover', position: 'attention' })
            .jpeg({ quality: 82, mozjpeg: true, progressive: true })
            .toFile(out);
        console.log(`✓ ${path.relative(ROOT, out)}  ${Math.round(info.size / 1024)} KB  ←  ${src}`);
    }
})();
