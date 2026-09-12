'use strict';

const fs = require('fs');
const path = require('path');
const { renderServicePage } = require('./service-template');
const { SERVICES } = require('./service-data');

const ROOT = path.join(__dirname, '..');

let count = 0;
for (const cfg of SERVICES) {
    const html = renderServicePage(cfg);
    const outPath = path.join(ROOT, `${cfg.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf8');
    console.log(`✓ ${cfg.slug}.html`);
    count++;
}

console.log(`\n${count} hizmet sayfası üretildi.`);
