import { QUOTE_CONFIG } from './quote-config.ts';
import { HttpError } from './http.ts';

export interface QuoteFields {
    company_name: string;
    contact_name: string;
    phone: string;
    email: string;
    service_type: string;
    material_type: string | null;
    dimensions: string | null;
    quantity: string | null;
    expected_deadline: string | null;
    project_description: string | null;
}

export interface DeclaredFile {
    clientIndex: number;
    originalFilename: string;
    extension: string;
    size: number;
    contentType: string;
}

export interface QuoteInitInput {
    submissionId: string;
    turnstileToken: string;
    fields: QuoteFields;
    files: DeclaredFile[];
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/;
const PHONE_CHARS_RE = /^[0-9+()\-.\s]+$/;
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

export function isUuid(value: unknown): value is string {
    return typeof value === 'string' && UUID_RE.test(value);
}

/** Tek satırlık metin: NFC, kontrol karakterleri ve satır sonları temizlenir. */
export function cleanLine(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.normalize('NFC').replace(CONTROL_CHARS_RE, '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
}

/** Çok satırlı metin: satır sonları korunur, kontrol karakterleri temizlenir. */
export function cleanMultiline(value: unknown): string {
    if (typeof value !== 'string') return '';
    return value.normalize('NFC').replace(/\r\n?/g, '\n').replace(CONTROL_CHARS_RE, '').replace(/\n{4,}/g, '\n\n\n').trim();
}

/**
 * Dosya adını güvenli hale getirir: yol bileşenleri, kontrol karakterleri
 * atılır; Türkçe / Unicode karakterler korunur. Storage'da bu ad KULLANILMAZ,
 * yalnızca veritabanında ve e-postada gösterilir.
 */
export function cleanFilename(value: unknown, extension: string): string {
    const max = QUOTE_CONFIG.fields.original_filename.max;
    let name = typeof value === 'string' ? value : '';
    name = name.split(/[\\/]/).pop() ?? '';
    name = name.normalize('NFC').replace(CONTROL_CHARS_RE, '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
    if (!name || name === '.' || name === '..') name = `dosya.${extension}`;
    if (name.length > max) {
        const suffix = `.${extension}`;
        name = name.slice(0, max - suffix.length) + suffix;
    }
    return name;
}

export function fileExtension(filename: string): string {
    const dot = filename.lastIndexOf('.');
    return dot === -1 ? '' : filename.slice(dot + 1).toLowerCase();
}

function optionalLine(value: unknown, max: number, field: string, errors: Record<string, string>): string | null {
    const cleaned = cleanLine(value);
    if (cleaned.length > max) errors[field] = `En fazla ${max} karakter yazabilirsiniz.`;
    return cleaned || null;
}

export function validateQuoteInit(body: Record<string, unknown>): QuoteInitInput {
    // Honeypot: insanlar bu gizli alanı görmez; doluysa otomatik gönderimdir
    if (cleanLine(body.website) !== '') {
        throw new HttpError(400, 'rejected', 'Talebiniz doğrulanamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
    }

    if (!isUuid(body.submission_id)) throw new HttpError(400, 'bad_request', 'Geçersiz istek.');
    const turnstileToken = typeof body.turnstile_token === 'string' ? body.turnstile_token : '';
    if (!turnstileToken || turnstileToken.length > 2048) {
        throw new HttpError(403, 'turnstile_failed', 'Güvenlik doğrulaması tamamlanamadı. Lütfen tekrar deneyin.');
    }

    const f = QUOTE_CONFIG.fields;
    const errors: Record<string, string> = {};

    const company_name = cleanLine(body.company_name);
    if (company_name.length < f.company_name.min || company_name.length > f.company_name.max) {
        errors.company_name = 'Firma adını yazın.';
    }

    const contact_name = cleanLine(body.contact_name);
    if (contact_name.length < f.contact_name.min || contact_name.length > f.contact_name.max) {
        errors.contact_name = 'Yetkili kişinin adını yazın.';
    }

    const phone = cleanLine(body.phone);
    const phoneDigits = phone.replace(/\D/g, '').length;
    if (phone.length < f.phone.min || phone.length > f.phone.max || !PHONE_CHARS_RE.test(phone) || phoneDigits < 10 || phoneDigits > 15) {
        errors.phone = 'Geçerli bir telefon numarası yazın.';
    }

    const email = cleanLine(body.email);
    if (email.length > f.email.max || !EMAIL_RE.test(email)) {
        errors.email = 'Geçerli bir e-posta adresi yazın.';
    }

    const service_type = cleanLine(body.service_type);
    if (!Object.hasOwn(QUOTE_CONFIG.serviceTypes, service_type)) {
        errors.service_type = 'Hizmet türünü seçin.';
    }

    const materialRaw = cleanLine(body.material_type);
    if (materialRaw && !Object.hasOwn(QUOTE_CONFIG.materialTypes, materialRaw)) {
        errors.material_type = 'Listeden bir malzeme seçin.';
    }

    const dimensions = optionalLine(body.dimensions, f.dimensions.max, 'dimensions', errors);
    const quantity = optionalLine(body.quantity, f.quantity.max, 'quantity', errors);
    const expected_deadline = optionalLine(body.expected_deadline, f.expected_deadline.max, 'expected_deadline', errors);

    const description = cleanMultiline(body.project_description);
    if (description.length > f.project_description.max) {
        errors.project_description = `Açıklama en fazla ${f.project_description.max} karakter olabilir.`;
    }

    if (body.kvkk_acknowledged !== true) {
        errors.kvkk = 'Formu gönderebilmek için bu kutuyu işaretleyin.';
    }

    const files = validateDeclaredFiles(body.files, errors);

    if (Object.keys(errors).length > 0) {
        throw new HttpError(422, 'validation_failed', 'Lütfen işaretli alanları kontrol edin.', { fields: errors });
    }

    return {
        submissionId: (body.submission_id as string).toLowerCase(),
        turnstileToken,
        fields: {
            company_name,
            contact_name,
            phone,
            email,
            service_type,
            material_type: materialRaw || null,
            dimensions,
            quantity,
            expected_deadline,
            project_description: description || null,
        },
        files,
    };
}

function validateDeclaredFiles(value: unknown, errors: Record<string, string>): DeclaredFile[] {
    if (value === undefined || value === null) return [];
    if (!Array.isArray(value)) {
        errors.files = 'Dosya bilgisi okunamadı.';
        return [];
    }

    const { maxFiles, maxFileBytes, maxTotalBytes, types } = QUOTE_CONFIG.files;
    if (value.length > maxFiles) {
        errors.files = `En fazla ${maxFiles} dosya yükleyebilirsiniz.`;
        return [];
    }

    const files: DeclaredFile[] = [];
    let total = 0;
    value.forEach((item, clientIndex) => {
        const raw = item && typeof item === 'object' ? item as Record<string, unknown> : {};
        const rawName = typeof raw.name === 'string' ? raw.name : '';
        const extension = fileExtension(rawName);
        const size = typeof raw.size === 'number' && Number.isInteger(raw.size) ? raw.size : -1;
        const display = cleanFilename(rawName, extension || 'dosya');

        if (!Object.hasOwn(types, extension)) {
            errors.files = `"${display}" desteklenmeyen bir dosya türü. PDF, DWG, DXF, STEP, IGES, STL, SolidWorks, Parasolid, JPG, PNG veya ZIP yükleyin.`;
            return;
        }
        if (size <= 0) {
            errors.files = `"${display}" boş görünüyor.`;
            return;
        }
        if (size > maxFileBytes) {
            errors.files = `"${display}" dosya başına ${formatMb(maxFileBytes)} sınırını aşıyor.`;
            return;
        }
        total += size;
        files.push({
            clientIndex,
            originalFilename: cleanFilename(rawName, extension),
            extension,
            size,
            contentType: types[extension],
        });
    });

    if (!errors.files && total > maxTotalBytes) {
        errors.files = `Dosyaların toplam boyutu ${formatMb(maxTotalBytes)} sınırını aşıyor.`;
    }
    return files;
}

export function formatMb(bytes: number): string {
    return `${Math.round(bytes / (1024 * 1024))} MB`;
}
