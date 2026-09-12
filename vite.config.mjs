import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

/*
 * Vercel'de "cleanUrls: true" ile /paslanmaz-imalat gibi uzantısız adresler
 * otomatik olarak paslanmaz-imalat.html dosyasını sunuyor. Vite dev server
 * bunu varsayılan olarak yapmadığı için, local geliştirmede aynı davranışı
 * taklit eden bir middleware ekliyoruz: uzantısız bir istek gelirse ve
 * kökte aynı isimde bir .html dosyası varsa, isteği o dosyaya yönlendiriyoruz
 * (query string korunur). Bu sadece dev sunucusu için geçerlidir; production
 * build'e veya asset yollarına (css/js/assets) dokunmaz.
 */
function cleanUrlsDevPlugin() {
    return {
        name: 'clean-urls-dev',
        configureServer(server) {
            server.middlewares.use((req, res, next) => {
                if (!req.url) return next();

                const queryIndex = req.url.indexOf('?');
                const urlPath = queryIndex === -1 ? req.url : req.url.slice(0, queryIndex);
                const suffix = queryIndex === -1 ? '' : req.url.slice(queryIndex);

                const isInternal = urlPath.startsWith('/@') || urlPath.startsWith('/node_modules');
                const hasExtension = path.extname(urlPath) !== '';

                if (isInternal || hasExtension || urlPath === '/') {
                    return next();
                }

                const candidate = path.join(process.cwd(), `${urlPath}.html`);
                if (fs.existsSync(candidate)) {
                    req.url = `${urlPath}.html${suffix}`;
                }

                next();
            });
        },
    };
}

export default defineConfig({
    plugins: [cleanUrlsDevPlugin()],
});
