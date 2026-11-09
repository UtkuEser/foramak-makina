/*
 * Teklif sistemi ortak modül testleri (gerçek servis çağrısı yok).
 * Çalıştırma: deno test --allow-env supabase/functions/tests/
 */
import { assert, assertEquals, assertFalse, assertStringIncludes, assertThrows } from 'jsr:@std/assert@1.0.13';
import { cleanFilename, fileExtension, validateQuoteInit } from '../_shared/validation.ts';
import { HttpError, loadPublicEndpointEnv } from '../_shared/http.ts';
import { matchesFileSignature, readRemotePrefix } from '../_shared/file-signature.ts';
import { escapeHtml, notifyQuote, type QuoteRecord, renderQuoteEmail, sendEmail } from '../_shared/notification.ts';
import { verifyTurnstile } from '../_shared/turnstile.ts';
import { randomToken, sha256Hex, timingSafeEqual } from '../_shared/security.ts';
import { QUOTE_CONFIG } from '../_shared/quote-config.ts';

const MB = 1024 * 1024;
const enc = new TextEncoder();

function body(overrides: Record<string, unknown> = {}): Record<string, unknown> {
    return {
        submission_id: '3f2b8c1e-8d4a-4b6f-9c2d-1a2b3c4d5e6f',
        turnstile_token: 'XXXX.DUMMY.TOKEN.XXXX',
        company_name: 'Örnek Makine Ltd. Şti.',
        contact_name: 'Test Kişi',
        phone: '0555 000 00 00',
        email: 'test@example.com',
        service_type: 'sac-lazer',
        material_type: 'paslanmaz-304',
        dimensions: '3 mm sac',
        quantity: '50 adet',
        expected_deadline: '2 hafta',
        project_description: 'Satır 1\r\nSatır 2',
        kvkk_acknowledged: true,
        website: '',
        files: [],
        ...overrides,
    };
}

function httpError(fn: () => unknown): HttpError {
    const err = assertThrows(fn) as HttpError;
    assert(err instanceof HttpError, 'HttpError bekleniyordu');
    return err;
}

/* ---------------- validation ---------------- */

Deno.test('geçerli form kabul edilir ve normalize edilir', () => {
    const input = validateQuoteInit(body({ company_name: '  Örnek\tMakine  ' }));
    assertEquals(input.fields.company_name, 'Örnek Makine');
    assertEquals(input.fields.project_description, 'Satır 1\nSatır 2');
    assertEquals(input.fields.material_type, 'paslanmaz-304');
    assertEquals(input.files, []);
});

Deno.test('zorunlu alanlar ve hatalı e-posta reddedilir', () => {
    const err = httpError(() => validateQuoteInit(body({
        company_name: '', phone: '12', email: 'gecersiz@', service_type: '', kvkk_acknowledged: false,
    })));
    assertEquals(err.status, 422);
    const fields = err.details!.fields as Record<string, string>;
    for (const f of ['company_name', 'phone', 'email', 'service_type', 'kvkk']) assert(fields[f], `${f} hatası yok`);
});

Deno.test('listede olmayan hizmet / malzeme reddedilir', () => {
    const err = httpError(() => validateQuoteInit(body({ service_type: '<script>', material_type: 'altin' })));
    const fields = err.details!.fields as Record<string, string>;
    assert(fields.service_type && fields.material_type);
});

Deno.test('teklif-al.html hizmet ve malzeme seçenekleri sunucuyla birebir aynı, hepsi doğrulamadan geçer', async () => {
    const html = await Deno.readTextFile(new URL('../../../teklif-al.html', import.meta.url));
    const options = (id: string) => {
        const select = html.split(`id="${id}"`)[1].split('</select>')[0];
        return [...select.matchAll(/<option value="([^"]+)">([^<]+)<\/option>/g)].map((m) => [m[1], m[2].trim()]);
    };
    const services = options('hizmet');
    const materials = options('malzeme');
    assertEquals(Object.fromEntries(services), QUOTE_CONFIG.serviceTypes);
    assertEquals(Object.fromEntries(materials), QUOTE_CONFIG.materialTypes);
    assertEquals(services.length, 11);
    for (const label of ['Metal İşleme', 'Modüler Tesisat Sistemleri', 'Arıtma Sistemleri']) {
        assert(services.some(([, l]) => l === label), `${label} formda yok`);
    }
    for (const [value] of services) assertEquals(validateQuoteInit(body({ service_type: value })).fields.service_type, value);
    for (const [value] of materials) assertEquals(validateQuoteInit(body({ material_type: value })).fields.material_type, value);
});

Deno.test('honeypot doluysa reddedilir', () => {
    assertEquals(httpError(() => validateQuoteInit(body({ website: 'http://spam' }))).code, 'rejected');
});

Deno.test('geçersiz submission_id ve eksik Turnstile token reddedilir', () => {
    assertEquals(httpError(() => validateQuoteInit(body({ submission_id: '123' }))).status, 400);
    assertEquals(httpError(() => validateQuoteInit(body({ turnstile_token: '' }))).code, 'turnstile_failed');
});

Deno.test('dosya limitleri: sayı, tür, boyut, toplam, boş dosya', () => {
    const cases: [unknown[], string][] = [
        [[1, 2, 3, 4].map((i) => ({ name: `a${i}.pdf`, size: 10 })), 'En fazla 3'],
        [[{ name: 'kurulum.exe', size: 10 }], 'desteklenmeyen'],
        [[{ name: 'cizim.pdf.exe', size: 10 }], 'desteklenmeyen'],
        [[{ name: 'buyuk.pdf', size: 21 * MB }], 'sınırını aşıyor'],
        [[{ name: 'a.pdf', size: 15 * MB }, { name: 'b.dwg', size: 15 * MB }, { name: 'c.dxf', size: 15 * MB }], 'toplam'],
        [[{ name: 'bos.png', size: 0 }], 'boş'],
    ];
    for (const [files, expected] of cases) {
        const err = httpError(() => validateQuoteInit(body({ files })));
        assertStringIncludes((err.details!.fields as Record<string, string>).files, expected);
    }
});

Deno.test('geçerli dosyalar kanonik içerik türü alır', () => {
    const input = validateQuoteInit(body({
        files: [
            { name: 'Çizim Şartnamesi.PDF', size: 2 * MB },
            { name: 'flanş ölçü.dwg', size: 5 * MB },
            { name: 'kesim.DXF', size: 1 * MB },
        ],
    }));
    assertEquals(input.files.map((f) => f.contentType), ['application/pdf', 'image/vnd.dwg', 'image/vnd.dxf']);
    assertEquals(input.files[0].originalFilename, 'Çizim Şartnamesi.PDF');
    assertEquals(input.files[0].extension, 'pdf');
});

Deno.test('dosya adı: yol, kontrol karakteri, Unicode, uzunluk', () => {
    assertEquals(cleanFilename('../../etc/passwd.pdf', 'pdf'), 'passwd.pdf');
    assertEquals(cleanFilename('C:\\Users\\x\\Çizim Ğüşİ ölçü.dwg', 'dwg'), 'Çizim Ğüşİ ölçü.dwg');
    assertEquals(cleanFilename('a\u0000b\nc.png', 'png'), 'ab c.png');
    assertEquals(cleanFilename('C\u0327izim.pdf', 'pdf'), 'Çizim.pdf'); // NFD → NFC
    assertEquals(cleanFilename('..', 'pdf'), 'dosya.pdf');
    const long = cleanFilename(`${'ş'.repeat(300)}.pdf`, 'pdf');
    assertEquals(long.length, 200);
    assert(long.endsWith('.pdf'));
    assertEquals(fileExtension('arşiv.tar.GZ'), 'gz');
});

/* ---------------- file signature ---------------- */

Deno.test('dosya imzaları uzantıyla eşleşir', () => {
    assert(matchesFileSignature(enc.encode('%PDF-1.7\n...'), 'pdf'));
    assert(matchesFileSignature(enc.encode(`${' '.repeat(100)}%PDF-1.4`), 'pdf'));
    assert(matchesFileSignature(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]), 'png'));
    assert(matchesFileSignature(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]), 'jpg'));
    assert(matchesFileSignature(enc.encode('AC1032\0\0\0'), 'dwg'));
    assert(matchesFileSignature(enc.encode('  0\r\nSECTION\r\n  2\r\nHEADER\r\n'), 'dxf'));
    assert(matchesFileSignature(enc.encode('999\nyorum\n0\nSECTION\n'), 'dxf'));
    assert(matchesFileSignature(enc.encode('AutoCAD Binary DXF\r\n\x1a\0'), 'dxf'));
});

Deno.test('yeniden adlandırılmış / yanlış dosyalar reddedilir', () => {
    assertFalse(matchesFileSignature(enc.encode('MZ\x90\0\x03'), 'pdf'));          // Windows exe
    assertFalse(matchesFileSignature(enc.encode('\x7fELF\x02\x01'), 'dwg'));       // Linux binary
    assertFalse(matchesFileSignature(enc.encode('PK\x03\x04'), 'dwg'));            // zip
    assertFalse(matchesFileSignature(enc.encode('<html><script>'), 'png'));
    assertFalse(matchesFileSignature(enc.encode('#!/bin/sh\necho'), 'dxf'));
    assertFalse(matchesFileSignature(enc.encode('0\nSECTION\0binary'), 'dxf'));     // NUL içeren "metin"
    assertFalse(matchesFileSignature(enc.encode('%PDF-1.7'), 'exe'));
});

Deno.test('uzak dosyanın yalnızca ilk baytları okunur', async () => {
    let rangeHeader = '';
    const big = new Uint8Array(100_000).fill(65);
    const fakeFetch = ((_url: string, init?: RequestInit) => {
        rangeHeader = new Headers(init?.headers).get('range') ?? '';
        return Promise.resolve(new Response(big)); // Range yok sayılsa bile akış kesilir
    }) as typeof fetch;
    const prefix = await readRemotePrefix('https://example.test/f', 4096, fakeFetch);
    assertEquals(prefix.length, 4096);
    assertEquals(rangeHeader, 'bytes=0-4095');
});

/* ---------------- e-posta ---------------- */

function quote(overrides: Partial<QuoteRecord> = {}): QuoteRecord {
    return {
        id: '11111111-2222-4333-8444-555555555555',
        reference_no: 'FOR-2026-0001',
        company_name: 'Örnek Firma',
        contact_name: 'Test Kişi',
        phone: '0555 000 00 00',
        email: 'test@example.com',
        service_type: 'sac-lazer',
        material_type: 'paslanmaz-316',
        dimensions: '3 mm',
        quantity: '10 adet',
        expected_deadline: null,
        project_description: 'İlk satır\nİkinci satır',
        received_at: '2026-11-02T09:30:00Z',
        created_at: '2026-11-02T09:29:00Z',
        notification_attempts: 1,
        ...overrides,
    };
}

Deno.test('e-posta: konu, etiketler, dosyalar, tarih', () => {
    const { subject, html, text } = renderQuoteEmail(quote(), [{ original_filename: 'Çizim ölçü.pdf', file_size: 2.5 * MB }]);
    assertEquals(subject, 'Yeni Teklif Talebi — FOR-2026-0001 — Örnek Firma');
    assertStringIncludes(html, 'Sac Lazer Kesim');
    assertStringIncludes(html, 'Paslanmaz AISI 316');
    assertStringIncludes(html, 'Çizim ölçü.pdf');
    assertStringIncludes(html, '2,5 MB');
    assertStringIncludes(html, 'İlk satır<br>İkinci satır');
    assertStringIncludes(html, 'Belirtilmedi'); // boş termin
    assertStringIncludes(html, '2 Kasım 2026');
    assertStringIncludes(html, '12:30'); // Europe/Istanbul (UTC+3)
    assertStringIncludes(text, '- Çizim ölçü.pdf (2,5 MB)');
    assertStringIncludes(html, 'quote-attachments/requests/11111111-2222-4333-8444-555555555555/');
    assertFalse(/https?:\/\/[^"]*supabase/.test(html), 'dosya bağlantısı olmamalı');
});

Deno.test('e-posta: kullanıcı HTML / script içeriği kaçışlanır, konu tek satır', () => {
    const xss = '<script>alert(1)</script><img src=x onerror=alert(2)>';
    const { subject, html } = renderQuoteEmail(
        quote({ company_name: `Firma\r\nBcc: kotu@example.com ${xss}`, project_description: xss, contact_name: '"><a href="javascript:alert(3)">' }),
        [{ original_filename: `${xss}.pdf`, file_size: 100 }],
    );
    assertFalse(html.includes('<script'));
    assertFalse(html.includes('<img'));
    assertFalse(html.includes('href="javascript'));
    assertStringIncludes(html, '&lt;script&gt;alert(1)&lt;/script&gt;');
    assertFalse(/[\r\n]/.test(subject));
    assert(subject.length <= 'Yeni Teklif Talebi — FOR-2026-0001 — '.length + 80);
    assertEquals(escapeHtml(`<>&"'`), '&lt;&gt;&amp;&quot;&#39;');
});

Deno.test('Resend: istek gövdesi ve hata sonuçları', async () => {
    const cfg = { apiKey: 're_test', from: 'Foramak <teklif@notify.example.com>', to: 'foramak@foramaklazer.com', apiUrl: 'https://resend.test/emails' };
    const msg = { subject: 'K', html: '<p>h</p>', text: 't', replyTo: 'musteri@example.com' };

    let sent: { headers: Headers; body: Record<string, unknown> } | null = null;
    const ok = await sendEmail(msg, cfg, 'quote-x-attempt-1', ((_u: string, init?: RequestInit) => {
        sent = { headers: new Headers(init?.headers), body: JSON.parse(String(init?.body)) };
        return Promise.resolve(Response.json({ id: 'email_123' }));
    }) as typeof fetch);
    assertEquals(ok, { ok: true, id: 'email_123' });
    assertEquals(sent!.headers.get('idempotency-key'), 'quote-x-attempt-1');
    assertEquals(sent!.body.reply_to, 'musteri@example.com');
    assertEquals(sent!.body.to, ['foramak@foramaklazer.com']);

    const failed = await sendEmail(msg, cfg, 'k', (() => Promise.resolve(Response.json({ message: 'domain not verified' }, { status: 403 }))) as typeof fetch);
    assertEquals(failed.ok, false);
    assertStringIncludes((failed as { error: string }).error, '403');

    const network = await sendEmail(msg, cfg, 'k', (() => Promise.reject(new Error('ECONNRESET'))) as typeof fetch);
    assertEquals(network.ok, false);
});

/* ---------------- notifyQuote (sahte veritabanı) ---------------- */

function fakeDb(opts: { claim: QuoteRecord[]; status?: string }) {
    const calls: { name: string; args: Record<string, unknown> }[] = [];
    const chain = (result: unknown) => {
        const c: Record<string, unknown> = {};
        for (const m of ['select', 'eq', 'order']) c[m] = () => c;
        c.maybeSingle = () => Promise.resolve({ data: { notification_status: opts.status ?? 'pending' }, error: null });
        c.then = (resolve: (v: unknown) => void) => resolve({ data: result, error: null });
        return c;
    };
    const db = {
        rpc(name: string, args: Record<string, unknown>) {
            calls.push({ name, args });
            if (name === 'quote_claim_notification') return Promise.resolve({ data: opts.claim, error: null });
            return Promise.resolve({ data: null, error: null });
        },
        from(_table: string) {
            return chain([{ original_filename: 'a.pdf', file_size: 1000 }]);
        },
    };
    // deno-lint-ignore no-explicit-any
    return { db: db as any, calls };
}

function setResendEnv(on: boolean) {
    for (const [k, v] of Object.entries({ RESEND_API_KEY: 're_test', FORM_SENDER_EMAIL: 'F <t@notify.example.com>', FORM_NOTIFICATION_EMAIL: 'foramak@foramaklazer.com', RESEND_API_URL: 'https://resend.test/emails' })) {
        if (on) Deno.env.set(k, v);
        else Deno.env.delete(k);
    }
}

Deno.test('bildirim: kilit alınamazsa göndermez, mevcut durumu döner', async () => {
    setResendEnv(true);
    let fetched = false;
    const { db } = fakeDb({ claim: [], status: 'sent' });
    const outcome = await notifyQuote(db, 'id', (() => { fetched = true; return Promise.resolve(new Response()); }) as typeof fetch);
    assertEquals(outcome, 'sent');
    assertFalse(fetched);
});

Deno.test('bildirim: Resend hatası kaydı korur, failed işaretler', async () => {
    setResendEnv(true);
    const { db, calls } = fakeDb({ claim: [quote({ notification_attempts: 2 })] });
    const outcome = await notifyQuote(db, 'id', (() => Promise.resolve(Response.json({ message: 'rate limit' }, { status: 429 }))) as typeof fetch);
    assertEquals(outcome, 'failed');
    const record = calls.find((c) => c.name === 'quote_record_notification')!;
    assertEquals(record.args.p_sent, false);
    assertStringIncludes(String(record.args.p_error), '429');
    assertFalse(calls.some((c) => c.name.includes('insert') || c.name === 'quote_init_request'), 'yeni kayıt oluşmamalı');
});

Deno.test('bildirim: başarılı gönderim sent ve deneme numaralı idempotency key', async () => {
    setResendEnv(true);
    let key = '';
    const { db, calls } = fakeDb({ claim: [quote({ notification_attempts: 3 })] });
    const outcome = await notifyQuote(db, 'q1', ((_u: string, init?: RequestInit) => {
        key = new Headers(init?.headers).get('idempotency-key') ?? '';
        return Promise.resolve(Response.json({ id: 'email_9' }));
    }) as typeof fetch);
    assertEquals(outcome, 'sent');
    assertEquals(key, 'quote-q1-attempt-3');
    const record = calls.find((c) => c.name === 'quote_record_notification')!;
    assertEquals(record.args.p_sent, true);
    assertEquals(record.args.p_provider_id, 'email_9');
});

Deno.test('bildirim: Resend yapılandırması eksikse failed (kayıt korunur)', async () => {
    setResendEnv(false);
    const { db, calls } = fakeDb({ claim: [quote()] });
    assertEquals(await notifyQuote(db, 'id'), 'failed');
    assertEquals(calls.find((c) => c.name === 'quote_record_notification')!.args.p_error, 'E-posta yapılandırması eksik');
});

/* ---------------- Turnstile ---------------- */

function siteverify(responses: (Record<string, unknown> | 'network')[]) {
    const keys: string[] = [];
    const impl = ((_u: string, init?: RequestInit) => {
        keys.push(new URLSearchParams(String(init?.body)).get('idempotency_key') ?? '');
        const next = responses.shift();
        return next === 'network' ? Promise.reject(new Error('net')) : Promise.resolve(Response.json(next));
    }) as typeof fetch;
    return { impl, keys };
}

Deno.test('Turnstile: başarı, action / hostname uyuşmazlığı, tekrar kullanılan token', async () => {
    const base = { secret: 's', expectedAction: 'teklif_talebi', expectedHostnames: ['www.foramak.com'] };
    const ok = siteverify([{ success: true, action: 'teklif_talebi', hostname: 'www.foramak.com' }]);
    assertEquals((await verifyTurnstile('t', { ...base, fetchImpl: ok.impl })).ok, true);

    const action = siteverify([{ success: true, action: 'baska', hostname: 'www.foramak.com' }]);
    assertEquals((await verifyTurnstile('t', { ...base, fetchImpl: action.impl })).errorCodes, ['action-mismatch']);

    const host = siteverify([{ success: true, action: 'teklif_talebi', hostname: 'kotu.example' }]);
    assertEquals((await verifyTurnstile('t', { ...base, fetchImpl: host.impl })).errorCodes, ['hostname-mismatch']);

    const dup = siteverify([{ success: false, 'error-codes': ['timeout-or-duplicate'] }]);
    const dupResult = await verifyTurnstile('t', { ...base, fetchImpl: dup.impl });
    assertEquals(dupResult, { ok: false, errorCodes: ['timeout-or-duplicate'] });
});

Deno.test('Turnstile: test anahtarı sonucu yalnızca development\'ta kabul edilir', async () => {
    // Cloudflare'in 1x…AA test secret'ına verdiği gerçek yanıt biçimi (action alanı yok)
    const testingResponse = () => ({ success: true, 'error-codes': [], hostname: 'example.com', challenge_ts: '2026-11-03T08:39:55Z', metadata: { result_with_testing_key: true } });
    const base = { secret: 's', expectedAction: 'teklif_talebi', expectedHostnames: null };

    const dev = siteverify([testingResponse()]);
    assertEquals(await verifyTurnstile('t', { ...base, allowTestingKey: true, fetchImpl: dev.impl }), { ok: true, errorCodes: [] });

    const prod = siteverify([testingResponse()]);
    assertEquals(await verifyTurnstile('t', { ...base, expectedHostnames: ['www.foramak.com'], allowTestingKey: false, fetchImpl: prod.impl }), { ok: false, errorCodes: ['testing-key-not-allowed'] });

    const unset = siteverify([testingResponse()]);
    assertEquals((await verifyTurnstile('t', { ...base, fetchImpl: unset.impl })).errorCodes, ['testing-key-not-allowed'], 'varsayılan: kabul edilmez');

    // Gerçek anahtar yanıtında action yoksa yine reddedilir (development'ta da)
    const noAction = siteverify([{ success: true, hostname: 'localhost' }]);
    assertEquals((await verifyTurnstile('t', { ...base, allowTestingKey: true, fetchImpl: noAction.impl })).errorCodes, ['action-mismatch']);
});

Deno.test('Turnstile: ağ hatasında aynı idempotency_key ile bir kez tekrar dener', async () => {
    const base = { secret: 's', expectedAction: 'teklif_talebi', expectedHostnames: null };
    const retry = siteverify(['network', { success: true, action: 'teklif_talebi', hostname: 'example.com' }]);
    assertEquals((await verifyTurnstile('t', { ...base, fetchImpl: retry.impl })).ok, true);
    assertEquals(retry.keys.length, 2);
    assertEquals(retry.keys[0], retry.keys[1]);

    const down = siteverify(['network', 'network']);
    assertEquals((await verifyTurnstile('t', { ...base, fetchImpl: down.impl })).errorCodes, ['siteverify-unreachable']);
});

/* ---------------- ortam değişmezleri ---------------- */

function withEnv(vars: Record<string, string>, fn: () => void) {
    const keys = ['QUOTE_ENVIRONMENT', 'QUOTE_ALLOWED_ORIGINS', 'QUOTE_SUBMISSIONS_ENABLED', 'TURNSTILE_SECRET_KEY', 'QUOTE_IP_HASH_SALT'];
    keys.forEach((k) => Deno.env.delete(k));
    Object.entries(vars).forEach(([k, v]) => Deno.env.set(k, v));
    const origError = console.error;
    console.error = () => {};
    try {
        fn();
    } finally {
        console.error = origError;
        keys.forEach((k) => Deno.env.delete(k));
    }
}

const SALT = 'a'.repeat(32);
const PROD = 'https://www.foramak.com,https://foramak.com';

Deno.test('production: test anahtarı, localhost ve http origin reddedilir', () => {
    withEnv({ QUOTE_ENVIRONMENT: 'production', QUOTE_ALLOWED_ORIGINS: PROD, TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA', QUOTE_IP_HASH_SALT: SALT }, () => {
        assertEquals(httpError(() => loadPublicEndpointEnv()).code, 'server_misconfigured');
    });
    withEnv({ QUOTE_ENVIRONMENT: 'production', QUOTE_ALLOWED_ORIGINS: `${PROD},http://localhost:5500`, TURNSTILE_SECRET_KEY: '0x4AAAAAAA-gercek', QUOTE_IP_HASH_SALT: SALT }, () => {
        assertEquals(httpError(() => loadPublicEndpointEnv()).code, 'server_misconfigured');
    });
    withEnv({ QUOTE_ENVIRONMENT: 'production', QUOTE_ALLOWED_ORIGINS: 'http://www.foramak.com', TURNSTILE_SECRET_KEY: '0x4AAAAAAA-gercek', QUOTE_IP_HASH_SALT: SALT }, () => {
        assertEquals(httpError(() => loadPublicEndpointEnv()).code, 'server_misconfigured');
    });
});

Deno.test('production: başvuru kabulü yalnızca QUOTE_SUBMISSIONS_ENABLED=true ile açılır', () => {
    withEnv({ QUOTE_ALLOWED_ORIGINS: PROD, TURNSTILE_SECRET_KEY: '0x4AAAAAAA-gercek', QUOTE_IP_HASH_SALT: SALT }, () => {
        const cfg = loadPublicEndpointEnv(); // QUOTE_ENVIRONMENT yoksa production varsayılır
        assertEquals(cfg.environment, 'production');
        assertEquals(cfg.submissionsEnabled, false);
    });
    withEnv({ QUOTE_ALLOWED_ORIGINS: PROD, TURNSTILE_SECRET_KEY: '0x4AAAAAAA-gercek', QUOTE_IP_HASH_SALT: SALT, QUOTE_SUBMISSIONS_ENABLED: 'true' }, () => {
        assertEquals(loadPublicEndpointEnv().submissionsEnabled, true);
    });
});

Deno.test('development: canlı site origin\'i reddedilir, localhost kabul edilir', () => {
    withEnv({ QUOTE_ENVIRONMENT: 'development', QUOTE_ALLOWED_ORIGINS: 'http://localhost:5500,https://www.foramak.com', TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA', QUOTE_IP_HASH_SALT: SALT }, () => {
        assertEquals(httpError(() => loadPublicEndpointEnv()).code, 'server_misconfigured');
    });
    withEnv({ QUOTE_ENVIRONMENT: 'development', QUOTE_ALLOWED_ORIGINS: 'http://localhost:5500,http://127.0.0.1:5500', TURNSTILE_SECRET_KEY: '1x0000000000000000000000000000000AA', QUOTE_IP_HASH_SALT: SALT }, () => {
        const cfg = loadPublicEndpointEnv();
        assertEquals(cfg.submissionsEnabled, true);
        assertEquals(cfg.allowedOrigins.length, 2);
    });
    withEnv({ QUOTE_ENVIRONMENT: 'development', QUOTE_ALLOWED_ORIGINS: 'http://localhost:5500', TURNSTILE_SECRET_KEY: 'x', QUOTE_IP_HASH_SALT: 'kisa' }, () => {
        assertEquals(httpError(() => loadPublicEndpointEnv()).code, 'server_misconfigured');
    });
});

/* ---------------- güvenlik yardımcıları ---------------- */

Deno.test('güvenlik yardımcıları', async () => {
    assertEquals(await sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
    assert(timingSafeEqual('abc', 'abc'));
    assertFalse(timingSafeEqual('abc', 'abd'));
    assertFalse(timingSafeEqual('abc', 'abcd'));
    const token = randomToken();
    assert(/^[A-Za-z0-9_-]{43}$/.test(token));
    assert(token !== randomToken());
});
