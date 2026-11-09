/*
 * Yüklenen dosyanın içeriğinin uzantısıyla uyuşup uyuşmadığını kontrol eder.
 * Dosyalar sunucuda hiçbir zaman açılmaz / çalıştırılmaz; yalnızca baştaki
 * baytlar (ZIP için ayrıca sondaki merkezî dizin) okunur.
 *
 * Doğrulama düzeyleri:
 *   PDF, PNG, JPG, DWG, DXF, STEP, IGES, STL, X_T, X_B → yayımlanmış format yapısı
 *   SLDPRT / SLDASM / SLDDRW → resmî spesifikasyon yok; bilinen iki kapsayıcı
 *       yapısı (OLE2 ve 14 00 06 00 08 00 blok işareti) aranır. Gerçek dosyalarla
 *       doğrulanmalıdır.
 *   ZIP → arşiv yapısı ve içerik adları/boyutları; içerideki dosyalar açılmaz.
 */
import { QUOTE_CONFIG } from './quote-config.ts';

export const SIGNATURE_SAMPLE_BYTES = 64 * 1024;
const TEXT_SAMPLE_BYTES = 4096;

export interface InspectionResult {
    ok: boolean;
    reason?: string;
}

const ascii = (bytes: Uint8Array, start: number, length: number) =>
    String.fromCharCode(...bytes.subarray(start, Math.min(bytes.length, start + length)));

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
    return bytes.length >= offset + signature.length && signature.every((b, i) => bytes[offset + i] === b);
}

function indexOfSequence(bytes: Uint8Array, seq: number[], limit = bytes.length): number {
    const end = Math.min(bytes.length, limit) - seq.length;
    outer: for (let i = 0; i <= end; i++) {
        for (let j = 0; j < seq.length; j++) if (bytes[i + j] !== seq[j]) continue outer;
        return i;
    }
    return -1;
}

/** Metin formatları: baştaki örnekte NUL olmamalı; BOM ve baştaki boşluk atılır. */
function textSample(bytes: Uint8Array, length = TEXT_SAMPLE_BYTES): string | null {
    const sample = bytes.subarray(0, length);
    if (sample.includes(0)) return null;
    return new TextDecoder('latin1').decode(sample).replace(/^﻿/, '').replace(/^ï»¿/, '');
}

/* Çalıştırılabilir dosya başlıkları: hangi uzantıyla gelirse gelsin reddedilir */
const EXECUTABLE_SIGNATURES: number[][] = [
    [0x4d, 0x5a],                   // MZ — Windows PE / DOS
    [0x7f, 0x45, 0x4c, 0x46],       // ELF
    [0xfe, 0xed, 0xfa, 0xce], [0xfe, 0xed, 0xfa, 0xcf], // Mach-O
    [0xce, 0xfa, 0xed, 0xfe], [0xcf, 0xfa, 0xed, 0xfe],
    [0xca, 0xfe, 0xba, 0xbe],       // Mach-O fat / Java class
    [0x23, 0x21],                   // #! betik
];

export function looksExecutable(bytes: Uint8Array): boolean {
    return EXECUTABLE_SIGNATURES.some((sig) => startsWith(bytes, sig));
}

const OLE2 = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1];
const ZIP_LOCAL = [0x50, 0x4b, 0x03, 0x04];
const SOLIDWORKS_BLOCK_MARKER = [0x14, 0x00, 0x06, 0x00, 0x08, 0x00];
const PARASOLID_HEADER = '**ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function isPdf(bytes: Uint8Array): boolean {
    // PDF başlığı ilk 1024 bayt içinde olabilir (spesifikasyon toleransı)
    return ascii(bytes, 0, 1024).includes('%PDF-');
}

function isDwg(bytes: Uint8Array): boolean {
    // AC1015, AC1018, AC1024, AC1027, AC1032 … ya da eski sürümler (AC1.40, AC2.10)
    return /^AC(\d{4}|[12]\.\d{2})/.test(ascii(bytes, 0, 6));
}

function isDxf(bytes: Uint8Array): boolean {
    if (ascii(bytes, 0, 18) === 'AutoCAD Binary DXF') return true;
    const text = textSample(bytes);
    // ASCII DXF: grup kodu 0 (veya 999 yorum) ile başlar ve SECTION içerir
    return text !== null && /^\s*(0|999)\s*\r?\n/.test(text) && /\bSECTION\b/.test(text);
}

function isStep(bytes: Uint8Array): boolean {
    // ISO 10303-21: dosya "ISO-10303-21;" satırıyla başlar
    const text = textSample(bytes, 256);
    return text !== null && /^\s*ISO-10303-21\s*;/.test(text);
}

function isIges(bytes: Uint8Array): boolean {
    // 80 sütunlu ASCII; ilk satır Start bölümü: 73. sütunda "S", 74–80 sıra no 1
    const text = textSample(bytes);
    if (text === null) return false;
    const firstLine = text.split(/\r?\n/, 1)[0];
    return firstLine.length >= 73 && firstLine.length <= 82
        && firstLine[72] === 'S'
        && /^[ 0]*1\s*$/.test(firstLine.slice(73));
}

function isStl(bytes: Uint8Array, totalSize: number): boolean {
    // Binary STL: 80 bayt başlık + uint32 üçgen sayısı + üçgen başına 50 bayt.
    // Başlık "solid" ile başlayabildiği için önce boyut formülü denenir.
    if (totalSize >= 84 && bytes.length >= 84) {
        const triangles = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(80, true);
        if (triangles > 0 && 84 + triangles * 50 === totalSize) return true;
    }
    const text = textSample(bytes);
    return text !== null && /^\s*solid\b/i.test(text) && /\b(facet|endsolid)\b/i.test(new TextDecoder('latin1').decode(bytes));
}

function isParasolidText(bytes: Uint8Array): boolean {
    const text = textSample(bytes);
    return text !== null && text.trimStart().startsWith(PARASOLID_HEADER) && text.includes('**PARASOLID');
}

function isParasolidBinary(bytes: Uint8Array): boolean {
    // Ortak metin başlığı (FORMAT=binary) veya doğrudan nötr binary bayrağı 'P' 'S' '\0' '\0'
    if (ascii(bytes, 0, PARASOLID_HEADER.length) === PARASOLID_HEADER) return ascii(bytes, 0, 1024).includes('**PARASOLID');
    return startsWith(bytes, [0x50, 0x53, 0x00, 0x00]);
}

function isSolidWorks(bytes: Uint8Array): boolean {
    // Eski SolidWorks: OLE2 bileşik belge. Yeni SolidWorks: 8 baytlık başlık +
    // "14 00 06 00 08 00" işaretli sıkıştırılmış bloklar (gerçek ZIP değildir).
    if (startsWith(bytes, OLE2)) return true;
    if (startsWith(bytes, ZIP_LOCAL)) return false;   // yeniden adlandırılmış ZIP/DOCX/JAR
    return indexOfSequence(bytes, SOLIDWORKS_BLOCK_MARKER) !== -1;
}

/** Arşiv dışındaki formatlar için içerik kontrolü (ZIP için inspectZip). */
export function matchesFileSignature(bytes: Uint8Array, extension: string, totalSize = bytes.length): boolean {
    if (looksExecutable(bytes)) return false;
    switch (extension) {
        case 'pdf':
            return isPdf(bytes);
        case 'png':
            return startsWith(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
        case 'jpg':
        case 'jpeg':
            return startsWith(bytes, [0xff, 0xd8, 0xff]);
        case 'dwg':
            return isDwg(bytes);
        case 'dxf':
            return isDxf(bytes);
        case 'step':
        case 'stp':
            return isStep(bytes);
        case 'iges':
        case 'igs':
            return isIges(bytes);
        case 'stl':
            return isStl(bytes, totalSize);
        case 'x_t':
            return isParasolidText(bytes);
        case 'x_b':
            return isParasolidBinary(bytes);
        case 'sldprt':
        case 'sldasm':
        case 'slddrw':
            return isSolidWorks(bytes);
        default:
            return false;
    }
}


/* ================================================================
   ZIP — sunucuda açılmadan merkezî dizin denetimi
   ================================================================ */

export interface ZipEntry {
    name: string;
    flags: number;
    method: number;
    compressedSize: number;
    uncompressedSize: number;
    localHeaderOffset: number;
    versionMadeBy: number;
    externalAttributes: number;
}

const u16 = (b: Uint8Array, o: number) => b[o] | (b[o + 1] << 8);
const u32 = (b: Uint8Array, o: number) => (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;

interface EndOfCentralDirectory {
    entries: number;
    cdSize: number;
    cdOffset: number;
}

/** Dosya sonundaki End of Central Directory kaydını bulur (tail = dosyanın son baytları). */
export function findEndOfCentralDirectory(tail: Uint8Array, fileSize: number): EndOfCentralDirectory | string {
    for (let i = tail.length - 22; i >= Math.max(0, tail.length - 22 - 0xffff); i--) {
        if (tail[i] !== 0x50 || tail[i + 1] !== 0x4b || tail[i + 2] !== 0x05 || tail[i + 3] !== 0x06) continue;
        const commentLength = u16(tail, i + 20);
        if (i + 22 + commentLength !== tail.length) continue;   // yorum dosya sonunda bitmeli

        const disk = u16(tail, i + 4), cdDisk = u16(tail, i + 6);
        const entriesOnDisk = u16(tail, i + 8), entries = u16(tail, i + 10);
        const cdSize = u32(tail, i + 12), cdOffset = u32(tail, i + 16);
        if (entries === 0xffff || cdSize === 0xffffffff || cdOffset === 0xffffffff) return 'ZIP64 arşivleri desteklenmiyor.';
        if (disk !== 0 || cdDisk !== 0 || entriesOnDisk !== entries) return 'Çok parçalı arşivler desteklenmiyor.';

        const eocdOffset = fileSize - tail.length + i;
        if (cdOffset + cdSize !== eocdOffset) return 'Arşiv yapısı geçersiz.';
        return { entries, cdSize, cdOffset };
    }
    return 'Geçerli bir ZIP arşivi değil.';
}

export function parseCentralDirectory(cd: Uint8Array, expectedEntries: number): ZipEntry[] | string {
    const entries: ZipEntry[] = [];
    let p = 0;
    for (let n = 0; n < expectedEntries; n++) {
        if (p + 46 > cd.length || u32(cd, p) !== 0x02014b50) return 'Arşiv dizini okunamadı.';
        const flags = u16(cd, p + 8);
        const nameLength = u16(cd, p + 28), extraLength = u16(cd, p + 30), commentLength = u16(cd, p + 32);
        if (p + 46 + nameLength > cd.length) return 'Arşiv dizini okunamadı.';
        const nameBytes = cd.subarray(p + 46, p + 46 + nameLength);
        entries.push({
            name: new TextDecoder((flags & 0x0800) ? 'utf-8' : 'latin1').decode(nameBytes),
            flags,
            method: u16(cd, p + 10),
            compressedSize: u32(cd, p + 20),
            uncompressedSize: u32(cd, p + 24),
            localHeaderOffset: u32(cd, p + 42),
            versionMadeBy: u16(cd, p + 4),
            externalAttributes: u32(cd, p + 38),
        });
        p += 46 + nameLength + extraLength + commentLength;
    }
    if (p !== cd.length) return 'Arşiv dizini beklenen boyutta değil.';
    return entries;
}

function extensionOf(name: string): string {
    const base = name.slice(name.lastIndexOf('/') + 1);
    const dot = base.lastIndexOf('.');
    return dot <= 0 ? '' : base.slice(dot + 1).toLowerCase();
}

/** Arşiv içi güvenlik kuralları: yol, tür, şifreleme, bağlantı, boyut ve ZIP bomb sınırları. */
export function validateZipEntries(entries: ZipEntry[], cdOffset: number): InspectionResult {
    const limits = QUOTE_CONFIG.zip;
    if (entries.length === 0) return { ok: false, reason: 'Arşiv boş.' };
    if (entries.length > limits.maxEntries) return { ok: false, reason: `Arşivde en fazla ${limits.maxEntries} dosya olabilir.` };

    const seen = new Set<string>();
    let totalUncompressed = 0;
    const short = (s: string) => (s.length > 80 ? `${s.slice(0, 77)}…` : s);

    for (const e of entries) {
        if (e.compressedSize === 0xffffffff || e.uncompressedSize === 0xffffffff || e.localHeaderOffset === 0xffffffff) {
            return { ok: false, reason: 'ZIP64 arşivleri desteklenmiyor.' };
        }
        // deno-lint-ignore no-control-regex
        if (!e.name || e.name.length > 255 || /[\u0000-\u001f]/.test(e.name)) return { ok: false, reason: 'Arşivde geçersiz dosya adı var.' };

        const normalized = e.name.replace(/\\/g, '/');
        if (normalized.startsWith('/') || /^[a-zA-Z]:/.test(normalized) || normalized.split('/').includes('..')) {
            return { ok: false, reason: `Arşivde güvenli olmayan dosya yolu var: ${short(e.name)}` };
        }
        const key = normalized.toLowerCase();
        if (seen.has(key)) return { ok: false, reason: `Arşivde aynı adlı birden fazla dosya var: ${short(e.name)}` };
        seen.add(key);

        if (e.flags & 0x0001 || e.flags & 0x0040) return { ok: false, reason: 'Şifreli arşivler kabul edilmiyor.' };
        if (e.method !== 0 && e.method !== 8) return { ok: false, reason: 'Arşiv desteklenmeyen bir sıkıştırma yöntemi kullanıyor.' };

        const isUnix = (e.versionMadeBy >> 8) === 3;
        if (isUnix && ((e.externalAttributes >>> 16) & 0o170000) === 0o120000) {
            return { ok: false, reason: 'Arşivde sembolik bağlantı var.' };
        }

        const isDirectory = normalized.endsWith('/');
        if (isDirectory) {
            if (e.uncompressedSize !== 0) return { ok: false, reason: 'Arşiv yapısı geçersiz.' };
            continue;
        }

        const base = normalized.slice(normalized.lastIndexOf('/') + 1).toLowerCase();
        const appleDouble = normalized.startsWith('__MACOSX/') && base.startsWith('._');
        if (!appleDouble && !limits.ignoredNames.includes(base) && !limits.allowedExtensions.includes(extensionOf(normalized))) {
            return { ok: false, reason: `Arşivde izin verilmeyen dosya var: ${short(e.name)}` };
        }

        if (e.uncompressedSize > limits.maxEntryUncompressedBytes) {
            return { ok: false, reason: `Arşivdeki bir dosya açıldığında çok büyük: ${short(e.name)}` };
        }
        if (e.uncompressedSize > 0) {
            if (e.compressedSize === 0 || e.uncompressedSize / e.compressedSize > limits.maxCompressionRatio) {
                return { ok: false, reason: 'Arşivin sıkıştırma oranı güvenlik sınırını aşıyor.' };
            }
        }
        totalUncompressed += e.uncompressedSize;
    }

    if (totalUncompressed > limits.maxTotalUncompressedBytes) {
        return { ok: false, reason: 'Arşiv açıldığında toplam boyut güvenlik sınırını aşıyor.' };
    }

    // Üst üste binen yerel kayıtlar (örtüşmeli ZIP bomb tekniği) ve dizin dışı ofsetler
    const ordered = [...entries].sort((a, b) => a.localHeaderOffset - b.localHeaderOffset);
    for (let i = 0; i < ordered.length; i++) {
        const e = ordered[i];
        const minEnd = e.localHeaderOffset + 30 + new TextEncoder().encode(e.name).length + e.compressedSize;
        const next = i + 1 < ordered.length ? ordered[i + 1].localHeaderOffset : cdOffset;
        if (minEnd > next) return { ok: false, reason: 'Arşiv yapısı geçersiz (üst üste binen kayıtlar).' };
    }
    return { ok: true };
}

export type RangeReader = (start: number, endInclusive: number) => Promise<Uint8Array>;

/** ZIP'i açmadan denetler: yalnızca son ~64 KB ve merkezî dizin okunur. */
export async function inspectZip(prefix: Uint8Array, fileSize: number, readRange: RangeReader): Promise<InspectionResult> {
    if (!startsWith(prefix, ZIP_LOCAL)) return { ok: false, reason: 'Geçerli bir ZIP arşivi değil.' };

    const tailLength = Math.min(fileSize, 22 + 0xffff);
    const tail = await readRange(fileSize - tailLength, fileSize - 1);
    const eocd = findEndOfCentralDirectory(tail, fileSize);
    if (typeof eocd === 'string') return { ok: false, reason: eocd };
    if (eocd.cdSize > QUOTE_CONFIG.zip.maxCentralDirectoryBytes) return { ok: false, reason: 'Arşiv dizini çok büyük.' };

    const tailStart = fileSize - tail.length;
    const cd = eocd.cdOffset >= tailStart
        ? tail.subarray(eocd.cdOffset - tailStart, eocd.cdOffset - tailStart + eocd.cdSize)
        : await readRange(eocd.cdOffset, eocd.cdOffset + eocd.cdSize - 1);

    const entries = parseCentralDirectory(cd, eocd.entries);
    if (typeof entries === 'string') return { ok: false, reason: entries };
    return validateZipEntries(entries, eocd.cdOffset);
}


/* ================================================================
   Uzak dosya okuma (signed URL + Range) ve tek giriş noktası
   ================================================================ */

/** Uzak dosyanın [start, end] aralığını okur; sunucu Range'i yok sayarsa akışı atlayarak okur. */
export async function readRemoteRange(url: string, start: number, endInclusive: number, fetchImpl: typeof fetch = fetch): Promise<Uint8Array> {
    const length = endInclusive - start + 1;
    const res = await fetchImpl(url, { headers: { Range: `bytes=${start}-${endInclusive}` } });
    if (!res.ok || !res.body) throw new Error(`dosya okunamadı (${res.status})`);

    const skip = res.status === 206 ? 0 : start;
    const out = new Uint8Array(length);
    const reader = res.body.getReader();
    let consumed = 0;
    let filled = 0;
    while (filled < length) {
        const { done, value } = await reader.read();
        if (done || !value) break;
        const from = Math.max(0, skip - consumed);
        consumed += value.length;
        if (from >= value.length) continue;
        const take = Math.min(value.length - from, length - filled);
        out.set(value.subarray(from, from + take), filled);
        filled += take;
    }
    await reader.cancel().catch(() => {});
    return out.subarray(0, filled);
}

/** Uzak bir dosyanın yalnızca ilk baytlarını okur. */
export function readRemotePrefix(url: string, maxBytes = SIGNATURE_SAMPLE_BYTES, fetchImpl: typeof fetch = fetch): Promise<Uint8Array> {
    return readRemoteRange(url, 0, maxBytes - 1, fetchImpl);
}

/** quote-finalize için: Storage'daki dosyanın içeriğini uzantısına göre denetler. */
export async function inspectStoredFile(url: string, extension: string, fileSize: number, fetchImpl: typeof fetch = fetch): Promise<InspectionResult> {
    const prefix = await readRemotePrefix(url, Math.min(SIGNATURE_SAMPLE_BYTES, fileSize), fetchImpl);
    if (looksExecutable(prefix)) return { ok: false, reason: 'Çalıştırılabilir dosya kabul edilmiyor.' };
    if (extension === 'zip') {
        return inspectZip(prefix, fileSize, (s, e) => readRemoteRange(url, s, e, fetchImpl));
    }
    return matchesFileSignature(prefix, extension, fileSize)
        ? { ok: true }
        : { ok: false, reason: 'Dosyanın içeriği türüyle uyuşmuyor.' };
}
