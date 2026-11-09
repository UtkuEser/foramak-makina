/*
 * CAD dosya desteği testleri. Örnekler format spesifikasyonlarına göre
 * SENTETİK üretilmiştir; gerçek CAD programı çıktılarıyla ayrıca
 * doğrulanmalıdır (bkz. docs/teklif-sistemi/KURULUM.md).
 * Çalıştırma: deno test --allow-env supabase/functions/tests/
 */
import { assert, assertEquals, assertFalse, assertStringIncludes, assertThrows } from 'jsr:@std/assert@1.0.13';
import { validateQuoteInit } from '../_shared/validation.ts';
import { HttpError } from '../_shared/http.ts';
import { QUOTE_CONFIG, allowedMimeTypes } from '../_shared/quote-config.ts';
import {
    inspectStoredFile,
    inspectZip,
    matchesFileSignature,
    validateZipEntries,
    type ZipEntry,
} from '../_shared/file-signature.ts';
import { renderQuoteEmail, verificationNote, type QuoteRecord } from '../_shared/notification.ts';

const enc = new TextEncoder();
const MB = 1024 * 1024;

function concat(...parts: Uint8Array[]): Uint8Array {
    const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
    let o = 0;
    for (const p of parts) { out.set(p, o); o += p.length; }
    return out;
}

/* ---------------- yapılandırma ve sunucu doğrulaması ---------------- */

const ALL = ['pdf', 'dwg', 'dxf', 'sldprt', 'sldasm', 'slddrw', 'step', 'stp', 'iges', 'igs', 'x_t', 'x_b', 'stl', 'jpg', 'jpeg', 'png', 'zip'];

Deno.test('yapılandırma: 17 uzantı, bucket türleri ve migration listesi aynı', async () => {
    assertEquals(Object.keys(QUOTE_CONFIG.files.types).sort(), [...ALL].sort());
    const migration = await Deno.readTextFile(new URL('../../migrations/20261102150000_quote_cad_formats.sql', import.meta.url));
    for (const mime of allowedMimeTypes()) assertStringIncludes(migration, `'${mime}'`);
    for (const ext of ALL) assert(migration.includes(`|${ext}|`) || migration.includes(`(${ext}|`) || migration.includes(`|${ext})`), `${ext} migration kısıtında yok`);
    assertEquals(QUOTE_CONFIG.files.maxFiles, 3);
    assertEquals(QUOTE_CONFIG.files.maxFileBytes, 20 * MB);
    assertEquals(QUOTE_CONFIG.files.maxTotalBytes, 40 * MB);
});

function body(files: unknown[]) {
    return {
        submission_id: '3f2b8c1e-8d4a-4b6f-9c2d-1a2b3c4d5e6f', turnstile_token: 't', company_name: 'Örnek Firma',
        contact_name: 'Test Kişi', phone: '0555 000 00 00', email: 'test@example.com', service_type: 'sac-lazer',
        kvkk_acknowledged: true, website: '', files,
    };
}

Deno.test('sunucu: büyük/küçük harfli tüm CAD uzantıları kabul edilir, tür uzantıdan belirlenir', () => {
    const names = ['PARCA.SLDPRT', 'Montaj.SldAsm', 'teknik resim.SLDDRW', 'flanş.STEP', 'mil.stp', 'GOVDE.IGES', 'kapak.igs',
        'Parça.X_T', 'parca.x_b', 'model.STL', 'çizim.DWG', 'kesim.Dxf', 'proje.ZIP'];
    for (let i = 0; i < names.length; i += 3) {
        const files = names.slice(i, i + 3).map((name) => ({ name, size: 1000, type: 'application/x-yanlis-tur' }));
        const input = validateQuoteInit(body(files));
        for (const f of input.files) {
            assertEquals(f.extension, f.originalFilename.slice(f.originalFilename.lastIndexOf('.') + 1).toLowerCase());
            assertEquals(f.contentType, QUOTE_CONFIG.files.types[f.extension], `${f.originalFilename} türü`);
        }
    }
});

Deno.test('sunucu: desteklenmeyen ve sahte uzantılar reddedilir', () => {
    for (const name of ['arsiv.rar', 'paket.7z', 'kurulum.exe', 'cizim.step.exe', 'parca.sldprt.lnk', 'resim.svg', 'makro.docm', 'uzantisiz', 'model.3dm', 'x.xt']) {
        const err = assertThrows(() => validateQuoteInit(body([{ name, size: 100 }]))) as HttpError;
        assertStringIncludes((err.details!.fields as Record<string, string>).files, 'desteklenmeyen', name);
    }
});

Deno.test('sunucu: CAD dosyalarında da 20 MB / 40 MB / 3 dosya sınırı', () => {
    const cases: [unknown[], string][] = [
        [[{ name: 'buyuk.SLDASM', size: 21 * MB }], 'sınırını aşıyor'],
        [[{ name: 'a.step', size: 15 * MB }, { name: 'b.zip', size: 15 * MB }, { name: 'c.stl', size: 15 * MB }], 'toplam'],
        [[{ name: 'a.x_t', size: 1 }, { name: 'b.x_t', size: 1 }, { name: 'c.x_t', size: 1 }, { name: 'd.x_t', size: 1 }], 'En fazla 3'],
    ];
    for (const [files, expected] of cases) {
        const err = assertThrows(() => validateQuoteInit(body(files))) as HttpError;
        assertStringIncludes((err.details!.fields as Record<string, string>).files, expected);
    }
});

/* ---------------- imza / yapı kontrolleri (sentetik örnekler) ---------------- */

const igesLine = (text: string, section: string, seq: number) => `${text.padEnd(72)}${section}${String(seq).padStart(7)}`;

Deno.test('STEP / STP', () => {
    const step = enc.encode("ISO-10303-21;\nHEADER;\nFILE_DESCRIPTION(('SolidWorks'),'2;1');\nENDSEC;\nDATA;\n");
    assert(matchesFileSignature(step, 'step'));
    assert(matchesFileSignature(step, 'stp'));
    assert(matchesFileSignature(concat(new Uint8Array([0xef, 0xbb, 0xbf]), step), 'step'), 'UTF-8 BOM');
    assertFalse(matchesFileSignature(enc.encode('HEADER;\nISO-10303-21;'), 'step'), 'başlık ilk satırda değil');
    assertFalse(matchesFileSignature(enc.encode('%PDF-1.7 ISO-10303-21;'), 'stp'));
    assertFalse(matchesFileSignature(concat(enc.encode('ISO-10303-21;'), new Uint8Array([0, 0, 0])), 'step'), 'NUL içeren "metin"');
});

Deno.test('IGES / IGS', () => {
    const iges = [igesLine('SolidWorks IGES file', 'S', 1), igesLine('1H,,1H;,', 'G', 1), igesLine('', 'T', 1)].join('\r\n');
    assert(matchesFileSignature(enc.encode(iges), 'iges'));
    assert(matchesFileSignature(enc.encode(`${'x'.repeat(72)}S0000001\n`), 'igs'), 'sıfırla doldurulmuş sıra no');
    assertFalse(matchesFileSignature(enc.encode(igesLine('baslik', 'G', 1)), 'iges'), 'ilk satır Start değil');
    assertFalse(matchesFileSignature(enc.encode(igesLine('baslik', 'S', 2)), 'iges'), 'sıra no 1 değil');
    assertFalse(matchesFileSignature(enc.encode('S      1\nkısa satır'), 'igs'), '80 sütun yapısı yok');
});

Deno.test('STL: binary boyut formülü ve ASCII yapı', () => {
    const binary = (triangles: number, headerText = 'binary STL', extra = 0) => {
        const b = new Uint8Array(84 + triangles * 50 + extra);
        b.set(enc.encode(headerText));
        new DataView(b.buffer).setUint32(80, triangles, true);
        return b;
    };
    assert(matchesFileSignature(binary(2), 'stl'));
    assert(matchesFileSignature(binary(3, 'solid SolidWorks binary header'), 'stl'), 'başlığı "solid" ile başlayan binary');
    assertFalse(matchesFileSignature(binary(2, 'x', 7), 'stl'), 'boyut formülü tutmuyor');
    assertFalse(matchesFileSignature(binary(0), 'stl'), 'sıfır üçgen');
    // Yalnızca ilk 64 KB okunsa da toplam boyut formülü kullanılır
    const big = binary(5000);
    assert(matchesFileSignature(big.subarray(0, 65536), 'stl', big.length));

    const ascii = 'solid parca\n facet normal 0 0 1\n  outer loop\n   vertex 0 0 0\n  endloop\n endfacet\nendsolid parca\n';
    assert(matchesFileSignature(enc.encode(ascii), 'stl'));
    assert(matchesFileSignature(enc.encode(ascii.toUpperCase()), 'stl'));
    assertFalse(matchesFileSignature(enc.encode('solid ama devamı yok'), 'stl'));
    assertFalse(matchesFileSignature(enc.encode('<html>facet</html>'), 'stl'));
});

const PARASOLID_HEADER = '**ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz**************************\n'
    + '**PARASOLID !"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~0123456789**************************\n';

Deno.test('Parasolid X_T (metin) ve X_B (binary)', () => {
    const xt = enc.encode(`${PARASOLID_HEADER}**PART1;MC=x86;APPL=solidworks;FORMAT=text;GUISE=transmit;\n**END_OF_HEADER*****\nT51 : TRANSMIT FILE`);
    assert(matchesFileSignature(xt, 'x_t'));
    assertFalse(matchesFileSignature(enc.encode('**ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz\nbaşka içerik'), 'x_t'), '**PARASOLID satırı yok');
    assertFalse(matchesFileSignature(enc.encode('Parasolid gibi görünen metin'), 'x_t'));

    const xbHeader = concat(enc.encode(`${PARASOLID_HEADER}**PART1;FORMAT=binary;\n**END_OF_HEADER***\n`), new Uint8Array([0x50, 0x53, 0, 0, 0, 9]));
    assert(matchesFileSignature(xbHeader, 'x_b'), 'ortak metin başlığı + binary');
    assert(matchesFileSignature(new Uint8Array([0x50, 0x53, 0x00, 0x00, 0x00, 0x09, 0x31]), 'x_b'), 'nötr binary bayrağı PS\\0\\0');
    assertFalse(matchesFileSignature(new Uint8Array([0x42, 0x00, 0x09]), 'x_b'), 'tek başına "B" (bare binary) güvenilir imza değil');
    assertFalse(matchesFileSignature(enc.encode('PS-Adobe-3.0'), 'x_b'));
});

Deno.test('SolidWorks: bilinen iki kapsayıcı yapı kabul, diğerleri red', () => {
    const ole2 = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1, 0, 0, 0, 0]);
    const block = concat(new Uint8Array([0x12, 0x34, 0x56, 0x78, 0, 0, 0, 4]), new Uint8Array([0xaa, 0xbb, 0xcc, 0xdd]), new Uint8Array([0x14, 0, 6, 0, 8, 0]), new Uint8Array(64));
    for (const ext of ['sldprt', 'sldasm', 'slddrw']) {
        assert(matchesFileSignature(ole2, ext), `${ext} OLE2`);
        assert(matchesFileSignature(block, ext), `${ext} blok yapısı`);
    }
    const renamedZip = concat(new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0, 6, 0, 8, 0]), new Uint8Array(32));
    assertFalse(matchesFileSignature(renamedZip, 'sldprt'), 'yeniden adlandırılmış ZIP/DOCX');
    assertFalse(matchesFileSignature(crypto.getRandomValues(new Uint8Array(4096)).map((b) => (b === 0x14 ? 0x15 : b)), 'sldasm'), 'rastgele veri');
    assertFalse(matchesFileSignature(concat(enc.encode('MZ'), block), 'slddrw'), 'çalıştırılabilir başlık');
    assertFalse(matchesFileSignature(enc.encode('düz metin dosyası'), 'sldprt'));
});

Deno.test('çalıştırılabilir başlık her formatta reddedilir (çok biçimli dosya dahil)', () => {
    const peWithPdf = concat(enc.encode('MZ\x90\x00'), enc.encode(' '.repeat(60)), enc.encode('%PDF-1.7'));
    assertFalse(matchesFileSignature(peWithPdf, 'pdf'), 'MZ + %PDF- polyglot');
    for (const [sig, ext] of [['\x7fELF', 'stl'], ['#!/bin/sh\nISO-10303-21;', 'step'], ['\xca\xfe\xba\xbe', 'x_b']] as const) {
        assertFalse(matchesFileSignature(Uint8Array.from(sig, (c) => c.charCodeAt(0)), ext));
    }
});

/* ---------------- ZIP ---------------- */

interface TestEntry {
    name: string;
    data?: Uint8Array;
    method?: number;
    flags?: number;
    versionMadeBy?: number;
    externalAttr?: number;
    compressedSize?: number;
    uncompressedSize?: number;
    offset?: number;
}

/** Testler için gerçek ZIP baytları üretir (stored). Boyut/ofset alanları kötü niyetli senaryolar için ezilebilir. */
function buildZip(entries: TestEntry[], opts: { prefix?: Uint8Array; comment?: string; trailing?: Uint8Array; zip64Count?: boolean } = {}): Uint8Array {
    const locals: Uint8Array[] = [];
    const central: Uint8Array[] = [];
    const prefix = opts.prefix ?? new Uint8Array();
    let offset = prefix.length;
    for (const e of entries) {
        const name = enc.encode(e.name);
        const data = e.data ?? new Uint8Array();
        const utf8 = /[^\x00-\x7f]/.test(e.name) ? 0x0800 : 0;
        const flags = (e.flags ?? 0) | utf8;
        const lh = new Uint8Array(30 + name.length);
        const lv = new DataView(lh.buffer);
        lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(6, flags, true); lv.setUint16(8, e.method ?? 0, true);
        lv.setUint32(18, data.length, true); lv.setUint32(22, data.length, true); lv.setUint16(26, name.length, true);
        lh.set(name, 30);
        const cd = new Uint8Array(46 + name.length);
        const cv = new DataView(cd.buffer);
        cv.setUint32(0, 0x02014b50, true); cv.setUint16(4, e.versionMadeBy ?? 20, true); cv.setUint16(6, 20, true);
        cv.setUint16(8, flags, true); cv.setUint16(10, e.method ?? 0, true);
        cv.setUint32(20, e.compressedSize ?? data.length, true); cv.setUint32(24, e.uncompressedSize ?? data.length, true);
        cv.setUint16(28, name.length, true); cv.setUint32(38, e.externalAttr ?? 0, true); cv.setUint32(42, e.offset ?? offset, true);
        cd.set(name, 46);
        locals.push(lh, data);
        central.push(cd);
        offset += lh.length + data.length;
    }
    const cdBytes = concat(...central);
    const comment = enc.encode(opts.comment ?? '');
    const eocd = new Uint8Array(22 + comment.length);
    const ev = new DataView(eocd.buffer);
    ev.setUint32(0, 0x06054b50, true);
    ev.setUint16(8, opts.zip64Count ? 0xffff : entries.length, true); ev.setUint16(10, opts.zip64Count ? 0xffff : entries.length, true);
    ev.setUint32(12, cdBytes.length, true); ev.setUint32(16, offset, true); ev.setUint16(20, comment.length, true);
    eocd.set(comment, 22);
    return concat(prefix, ...locals, cdBytes, eocd, opts.trailing ?? new Uint8Array());
}

function rangeReader(bytes: Uint8Array) {
    return (s: number, e: number) => Promise.resolve(bytes.slice(s, e + 1));
}

async function zipResult(bytes: Uint8Array) {
    return inspectZip(bytes.subarray(0, 65536), bytes.length, rangeReader(bytes));
}

const step = enc.encode('ISO-10303-21;\nHEADER;\nENDSEC;\n');

Deno.test('ZIP: geçerli CAD projesi (Türkçe adlar, klasörler, büyük harfli uzantılar, macOS dosyaları)', async () => {
    const zip = buildZip([
        { name: 'Konveyör Projesi/' },
        { name: 'Konveyör Projesi/MONTAJ.SLDASM', data: new Uint8Array(500) },
        { name: 'Konveyör Projesi/parçalar/şase.SLDPRT', data: new Uint8Array(300) },
        { name: 'Konveyör Projesi/parçalar/mil.x_t', data: new Uint8Array(100) },
        { name: 'Konveyör Projesi/teknik resim.SLDDRW', data: new Uint8Array(200) },
        { name: 'Konveyör Projesi/flanş.step', data: step },
        { name: 'Konveyör Projesi/çizim.pdf', data: enc.encode('%PDF-1.7') },
        { name: '__MACOSX/Konveyör Projesi/._MONTAJ.SLDASM', data: new Uint8Array(20) },
        { name: 'Konveyör Projesi/.DS_Store', data: new Uint8Array(10) },
    ]);
    assertEquals(await zipResult(zip), { ok: true });
});

Deno.test('ZIP: path traversal ve mutlak yollar reddedilir', async () => {
    for (const name of ['../evil.dwg', 'proje/../../evil.step', '/etc/parca.step', 'C:/Windows/parca.stl', 'C:\\parca.stl', '..\\..\\evil.x_t', 'proje\\..\\..\\evil.dwg']) {
        const r = await zipResult(buildZip([{ name, data: step }]));
        assertFalse(r.ok, name);
        assertStringIncludes(r.reason!, 'güvenli olmayan dosya yolu', name);
    }
});

Deno.test('ZIP: çalıştırılabilir, betik, iç içe arşiv ve izin dışı dosyalar reddedilir', async () => {
    for (const name of ['kurulum.exe', 'proje/run.bat', 'macro.vbs', 'script.ps1', 'kisayol.lnk', 'ic.zip', 'arsiv.rar', 'sayfa.html', 'resim.svg', 'makro.docm', 'uzantisiz', '__MACOSX/gizli.exe']) {
        const r = await zipResult(buildZip([{ name: 'parca.step', data: step }, { name, data: new Uint8Array(10) }]));
        assertFalse(r.ok, name);
        assertStringIncludes(r.reason!, 'izin verilmeyen', name);
    }
});

Deno.test('ZIP: şifreli, desteklenmeyen sıkıştırma ve sembolik bağlantı reddedilir', async () => {
    assertStringIncludes((await zipResult(buildZip([{ name: 'a.step', data: step, flags: 0x0001 }]))).reason!, 'Şifreli');
    assertStringIncludes((await zipResult(buildZip([{ name: 'a.step', data: step, method: 99 }]))).reason!, 'sıkıştırma yöntemi');
    assertStringIncludes((await zipResult(buildZip([{ name: 'a.step', data: step, method: 12 }]))).reason!, 'sıkıştırma yöntemi');
    const symlink = buildZip([{ name: 'link.step', data: enc.encode('/etc/passwd'), versionMadeBy: (3 << 8) | 20, externalAttr: (0o120777 << 16) >>> 0 }]);
    assertStringIncludes((await zipResult(symlink)).reason!, 'sembolik bağlantı');
});

Deno.test('ZIP: yapı saldırıları (SFX exe, ZIP64, sonda ek veri, boş arşiv, örtüşen kayıtlar, aynı ad)', async () => {
    const sfx = buildZip([{ name: 'a.step', data: step }], { prefix: concat(enc.encode('MZ'), new Uint8Array(100)) });
    assertFalse((await zipResult(sfx)).ok, 'kendiliğinden açılan exe');
    assertFalse((await inspectStoredFile('mem://sfx', 'zip', sfx.length, fakeFetch(sfx, true))).ok);

    assertStringIncludes((await zipResult(buildZip([{ name: 'a.step', data: step }], { zip64Count: true }))).reason!, 'ZIP64');
    assertFalse((await zipResult(buildZip([{ name: 'a.step', data: step }], { trailing: enc.encode('ek veri') }))).ok, 'EOCD sonrası veri');
    assert((await zipResult(buildZip([{ name: 'a.step', data: step }], { comment: 'Foramak projesi' }))).ok, 'yorumlu arşiv');

    const empty = buildZip([]);
    assertFalse((await inspectZip(empty, empty.length, rangeReader(empty))).ok, 'boş arşiv');

    const overlap = buildZip([{ name: 'a.step', data: new Uint8Array(1000) }, { name: 'b.step', data: new Uint8Array(10), offset: 0, compressedSize: 1000 }]);
    assertStringIncludes((await zipResult(overlap)).reason!, 'üst üste binen');

    assertStringIncludes((await zipResult(buildZip([{ name: 'Parca.STEP', data: step }, { name: 'parca.step', data: step }]))).reason!, 'aynı adlı');
});

function entry(name: string, offset: number, compressed: number, uncompressed: number): ZipEntry {
    return { name, flags: 0, method: 8, compressedSize: compressed, uncompressedSize: uncompressed, localHeaderOffset: offset, versionMadeBy: 20, externalAttributes: 0 };
}

Deno.test('ZIP bomb sınırları: oran, dosya başına ve toplam açılmış boyut, dosya sayısı', () => {
    // oran 200:1
    assertStringIncludes(validateZipEntries([entry('a.stl', 0, 10_000, 2_000_000)], 20_000).reason!, 'sıkıştırma oranı');
    // sıkıştırılmış boyut 0, açılmış > 0
    assertStringIncludes(validateZipEntries([entry('a.stl', 0, 0, 1000)], 1000).reason!, 'sıkıştırma oranı');
    // tek dosya 260 MB (oran 50)
    assertStringIncludes(validateZipEntries([entry('a.stl', 0, 5.2 * MB, 260 * MB)], 6 * MB).reason!, 'çok büyük');
    // toplam 3 × 200 MB = 600 MB (her biri oran 50)
    const three = [0, 1, 2].map((i) => entry(`p${i}.step`, i * 5 * MB, 4 * MB, 200 * MB));
    assertStringIncludes(validateZipEntries(three, 15 * MB).reason!, 'toplam boyut');
    // sınırlar içinde
    assert(validateZipEntries([entry('a.step', 0, 4 * MB, 40 * MB)], 5 * MB).ok);
    // 201 dosya
    const many = Array.from({ length: 201 }, (_, i) => entry(`p${i}.step`, i * 100, 10, 10));
    assertStringIncludes(validateZipEntries(many, 201 * 100).reason!, 'en fazla 200');
});

/* ---------------- uzak dosya denetimi (Range destekli / desteksiz) ---------------- */

function fakeFetch(bytes: Uint8Array, honorRange: boolean): typeof fetch {
    return ((_url: string, init?: RequestInit) => {
        const range = new Headers(init?.headers).get('range');
        const m = range && /bytes=(\d+)-(\d+)/.exec(range);
        if (honorRange && m) return Promise.resolve(new Response(bytes.slice(Number(m[1]), Number(m[2]) + 1), { status: 206 }));
        return Promise.resolve(new Response(bytes.slice(), { status: 200 }));
    }) as typeof fetch;
}

Deno.test('inspectStoredFile: ZIP ve STL, sunucu Range desteklese de desteklemese de aynı sonuç', async () => {
    const goodZip = buildZip([{ name: 'MONTAJ.SLDASM', data: new Uint8Array(70_000) }, { name: 'parca.SLDPRT', data: new Uint8Array(5000) }]);
    const badZip = buildZip([{ name: 'parca.step', data: new Uint8Array(70_000) }, { name: '../../evil.dwg', data: step }]);
    const stl = new Uint8Array(84 + 2000 * 50);
    new DataView(stl.buffer).setUint32(80, 2000, true);
    for (const honor of [true, false]) {
        assertEquals(await inspectStoredFile('mem://z', 'zip', goodZip.length, fakeFetch(goodZip, honor)), { ok: true });
        assertFalse((await inspectStoredFile('mem://z', 'zip', badZip.length, fakeFetch(badZip, honor))).ok);
        assertEquals(await inspectStoredFile('mem://s', 'stl', stl.length, fakeFetch(stl, honor)), { ok: true });
        assertFalse((await inspectStoredFile('mem://s', 'step', stl.length, fakeFetch(stl, honor))).ok, 'STL içeriği .step adıyla');
    }
});

/* ---------------- e-posta notu ---------------- */

Deno.test('e-posta: SolidWorks ve ZIP için "tam doğrulanmadı" notu, diğerlerinde yok', () => {
    assert(verificationNote('MONTAJ.SLDASM')!.includes('tam doğrulanamadı'));
    assert(verificationNote('proje.ZIP')!.includes('açılmadı'));
    assertEquals(verificationNote('flanş.step'), null);
    assertEquals(verificationNote('mil.x_t'), null);
    const q = {
        id: '11111111-2222-4333-8444-555555555555', reference_no: 'FOR-2026-0003', company_name: 'Örnek', contact_name: 'Test',
        phone: '0555 000 00 00', email: 'test@example.com', service_type: 'paslanmaz', material_type: null, dimensions: null,
        quantity: null, expected_deadline: null, project_description: null, received_at: '2026-11-02T10:00:00Z',
        created_at: '2026-11-02T10:00:00Z', notification_attempts: 1,
    } as QuoteRecord;
    const { html, text } = renderQuoteEmail(q, [{ original_filename: 'proje.zip', file_size: 1000 }, { original_filename: 'flanş.STEP', file_size: 2000 }]);
    assertStringIncludes(html, 'içindeki dosyalar açılmadı');
    assertStringIncludes(text, 'proje.zip (1000 B) — arşiv yapısı kontrol edildi');
    assertStringIncludes(html, 'antivirüs');
});
