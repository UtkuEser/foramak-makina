/*
 * Teklif formu için TEK yapılandırma noktası.
 *
 * - Dosya limitleri ve izinli türler: quote-init / quote-finalize bu değerlerle
 *   doğrular, frontend limitleri GET /quote-init yanıtından okur,
 *   quote-maintenance her çalıştığında Storage bucket limitini buna eşitler.
 * - Hizmet / malzeme listeleri teklif-al.html'deki <option value> değerleriyle
 *   birebir aynı olmalıdır (e-postada etiket olarak gösterilir).
 */

export const QUOTE_CONFIG = {
    bucket: 'quote-attachments',

    files: {
        maxFiles: 3,
        maxFileBytes: 20 * 1024 * 1024,
        maxTotalBytes: 40 * 1024 * 1024,
        // uzantı → Storage'a yazılacak içerik türü. Tarayıcının bildirdiği MIME
        // kullanılmaz (DWG/DXF/SolidWorks için tarayıcılar farklı veya boş
        // değer gönderir); tür uzantıdan belirlenir, içerik imzayla doğrulanır.
        // Kayıtlı MIME türü olmayan formatlar application/octet-stream olur.
        types: {
            pdf: 'application/pdf',
            dwg: 'image/vnd.dwg',
            dxf: 'image/vnd.dxf',
            sldprt: 'application/octet-stream',
            sldasm: 'application/octet-stream',
            slddrw: 'application/octet-stream',
            step: 'model/step',
            stp: 'model/step',
            iges: 'model/iges',
            igs: 'model/iges',
            x_t: 'application/octet-stream',
            x_b: 'application/octet-stream',
            stl: 'model/stl',
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            zip: 'application/zip',
        } as Record<string, string>,
        // Resmî imzası olmayan veya içeriği açılmadan incelenen formatlar
        // (e-postada "içerik tam doğrulanmadı" notuyla gösterilir)
        partiallyVerified: ['sldprt', 'sldasm', 'slddrw', 'zip'] as string[],
    },

    // ZIP yalnızca çok parçalı CAD projeleri içindir. Arşiv sunucuda AÇILMAZ;
    // yalnızca merkezî dizini okunur ve bu sınırlarla denetlenir.
    zip: {
        maxEntries: 200,
        maxEntryUncompressedBytes: 250 * 1024 * 1024,
        maxTotalUncompressedBytes: 500 * 1024 * 1024,
        maxCompressionRatio: 100,
        maxCentralDirectoryBytes: 1024 * 1024,
        // arşiv içinde izin verilen uzantılar (iç içe arşiv yok)
        allowedExtensions: ['pdf', 'dwg', 'dxf', 'sldprt', 'sldasm', 'slddrw', 'step', 'stp', 'iges', 'igs', 'x_t', 'x_b', 'stl', 'jpg', 'jpeg', 'png'] as string[],
        // macOS / Windows'un arşive eklediği zararsız sistem dosyaları
        ignoredNames: ['.ds_store', 'thumbs.db'] as string[],
    },

    maxBodyBytes: 64 * 1024,
    turnstileAction: 'teklif_talebi',

    rateLimits: {
        initPerIp: { limit: 5, windowSeconds: 10 * 60 },
        initPerIpDaily: { limit: 20, windowSeconds: 24 * 60 * 60 },
        initGlobalHourly: { limit: 120, windowSeconds: 60 * 60 },
        finalizePerIp: { limit: 30, windowSeconds: 10 * 60 },
    },

    // Tamamlanmamış taleplerin son 24 saatte tutabileceği en fazla dosya sayısı
    maxPendingAttachments24h: 30,

    cleanup: {
        pendingTtlHours: 24,
        orphanMinAgeHours: 3,
        orphanBatchSize: 200,
    },

    notification: {
        maxAttempts: 8,
        lockSeconds: 120,
        timeoutMs: 15_000,
        retryBatchSize: 10,
    },

    fields: {
        company_name: { min: 2, max: 200 },
        contact_name: { min: 2, max: 120 },
        phone: { min: 7, max: 30 },
        email: { max: 254 },
        dimensions: { max: 300 },
        quantity: { max: 120 },
        expected_deadline: { max: 120 },
        project_description: { max: 5000 },
        original_filename: { max: 200 },
    },

    serviceTypes: {
        'sac-lazer': 'Sac Lazer Kesim',
        'boru-lazer': 'Boru / Profil Lazer Kesim',
        'sac-bukum': 'Sac Büküm',
        'kaynak': 'Kaynaklı İmalat',
        'paslanmaz': 'Paslanmaz İmalat',
        'aluminyum': 'Alüminyum İmalat',
        'metal-isleme': 'Metal İşleme',
        'ozel': 'Özel Proje İmalatı',
        'moduler-tesisat': 'Modüler Tesisat Sistemleri',
        'aritma': 'Arıtma Sistemleri',
        'birden-fazla': 'Birden Fazla Hizmet',
    } as Record<string, string>,

    materialTypes: {
        'celik': 'Çelik / St 37',
        'paslanmaz-304': 'Paslanmaz AISI 304',
        'paslanmaz-316': 'Paslanmaz AISI 316',
        'aluminyum': 'Alüminyum',
        'galvaniz': 'Galvanizli Çelik',
        'belirsiz': 'Henüz belirlenmedi',
    } as Record<string, string>,
} as const;

/** Bucket'ın izin verdiği içerik türleri (tekrarsız). */
export function allowedMimeTypes(): string[] {
    return [...new Set(Object.values(QUOTE_CONFIG.files.types))];
}

/** Frontend'e açılabilecek limitler (GET /quote-init). */
export function publicLimits() {
    return {
        maxFiles: QUOTE_CONFIG.files.maxFiles,
        maxFileBytes: QUOTE_CONFIG.files.maxFileBytes,
        maxTotalBytes: QUOTE_CONFIG.files.maxTotalBytes,
        extensions: Object.keys(QUOTE_CONFIG.files.types),
        descriptionMaxLength: QUOTE_CONFIG.fields.project_description.max,
    };
}
