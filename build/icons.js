'use strict';

/**
 * Ortak teknik ikon kütüphanesi — hizmet sayfası v2 componentleri için.
 * Her girişin path verisi sitede zaten kullanılan (index.html / material-cell /
 * sector-block) doğrulanmış SVG path'lerinden alınmıştır; tutarlı görsel dil
 * için tekrar kullanılır.
 */
const ICONS = {
    target: { vb: 24, inner: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>' },
    blueprint: { vb: 24, inner: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
    layers: { vb: 24, inner: '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>' },
    filedoc: { vb: 24, inner: '<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
    materialA: { vb: 24, inner: '<rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="12" cy="12" r="4"/>' },
    materialB: { vb: 24, inner: '<rect x="3" y="3" width="18" height="18" rx="1"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/>' },
    pipe: { vb: 24, inner: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>' },
    profile: { vb: 24, inner: '<rect x="4" y="4" width="16" height="16" rx="1"/><rect x="8" y="8" width="8" height="8" rx="1"/>' },
    sheet: { vb: 24, inner: '<polyline points="4,4 20,4 20,14 12,20 4,14 4,4"/>' },
    hexagon: { vb: 24, inner: '<polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/>' },
    check: { vb: 24, inner: '<circle cx="12" cy="12" r="9"/><polyline points="8,12.5 11,15.5 16,9"/>' },
    ruler: { vb: 24, inner: '<rect x="3" y="10" width="18" height="4" rx="1"/><line x1="7" y1="10" x2="7" y2="12.5"/><line x1="11" y1="10" x2="11" y2="12.5"/><line x1="15" y1="10" x2="15" y2="12.5"/><line x1="19" y1="10" x2="19" y2="12.5"/>' },
    water: { vb: 32, inner: '<line x1="4" y1="16" x2="10" y2="16"/><line x1="22" y1="16" x2="28" y2="16"/><rect x="10" y="10" width="12" height="12" rx="2"/><line x1="13" y1="13" x2="13" y2="19"/><line x1="16" y1="13" x2="16" y2="19"/><line x1="19" y1="13" x2="19" y2="19"/>' },
    food: { vb: 32, inner: '<ellipse cx="16" cy="9" rx="8" ry="3"/><path d="M8 9v14a2 2 0 002 2h12a2 2 0 002-2V9"/><line x1="20" y1="25" x2="24" y2="28"/><line x1="22" y1="28" x2="26" y2="28"/><line x1="11" y1="15" x2="21" y2="15" stroke-dasharray="2 2"/>' },
    bolt: { vb: 32, inner: '<path d="M18 4L8 18h8l-2 10 10-14h-8l2-10z"/>' },
    ibeam: { vb: 32, inner: '<line x1="16" y1="4" x2="16" y2="28"/><line x1="10" y1="4" x2="22" y2="4"/><line x1="10" y1="28" x2="22" y2="28"/><line x1="11" y1="14" x2="21" y2="14"/><line x1="6" y1="9" x2="11" y2="14"/><line x1="6" y1="23" x2="11" y2="18"/><line x1="26" y1="9" x2="21" y2="14"/><line x1="26" y1="23" x2="21" y2="18"/>' },
    gear: { vb: 32, inner: '<circle cx="16" cy="16" r="5.5"/><circle cx="16" cy="16" r="2" fill="currentColor" opacity="0.35"/><line x1="16" y1="4" x2="16" y2="7"/><line x1="16" y1="25" x2="16" y2="28"/><line x1="4" y1="16" x2="7" y2="16"/><line x1="25" y1="16" x2="28" y2="16"/><line x1="7.8" y1="7.8" x2="9.9" y2="9.9"/><line x1="22.1" y1="22.1" x2="24.2" y2="24.2"/><line x1="22.1" y1="9.9" x2="24.2" y2="7.8"/><line x1="7.8" y1="24.2" x2="9.9" y2="22.1"/>' },
    factory: { vb: 32, inner: '<rect x="4" y="14" width="24" height="14"/><rect x="7" y="8" width="5" height="6"/><rect x="20" y="8" width="5" height="6"/><line x1="9.5" y1="4" x2="9.5" y2="8"/><line x1="22.5" y1="4" x2="22.5" y2="8"/><rect x="7" y="19" width="4" height="4"/><rect x="14" y="19" width="4" height="4"/><rect x="21" y="19" width="4" height="4"/>' }
};

/**
 * @param {string} key   ICONS içinde tanımlı ikon anahtarı
 * @param {object} [attrs] ek svg özellik/nitelikleri (class vb.)
 */
function icon(key, attrs) {
    const def = ICONS[key] || ICONS.target;
    const extra = attrs && attrs.class ? ` class="${attrs.class}"` : '';
    return `<svg${extra} viewBox="0 0 ${def.vb} ${def.vb}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${def.inner}</svg>`;
}

module.exports = { ICONS, icon };
