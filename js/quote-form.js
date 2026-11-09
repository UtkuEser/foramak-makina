/* ============================================================
   FORAMAK — Teklif talep formu gönderimi
   ------------------------------------------------------------
   Akış: istemci doğrulaması → Turnstile → quote-init (pending kayıt +
   signed upload URL) → dosyalar doğrudan private Supabase Storage'a →
   quote-finalize (doğrulama + kayıt tamamlanır + e-posta denenir).

   Sistem yapılandırılmamış / açılmamışsa sahte başarı gösterilmez;
   kullanıcı e-posta ve telefona yönlendirilir.
   ============================================================ */

(function () {
    'use strict';

    var form = document.getElementById('teklif-formu');
    if (!form) return;

    var CONTACT_EMAIL = 'foramak@foramaklazer.com';
    var CONTACT_PHONE_HREF = 'tel:+905422381819';
    var CONTACT_PHONE_TEXT = '0542 238 18 19';
    var TURNSTILE_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=foramakTurnstileReady';
    var TURNSTILE_TEST_SITEKEY = /^[0-9]x0{20}[A-F]{2}$/i;

    /* Sunucu yetkilidir; bu değerler yalnızca GET /quote-init yanıtı gelene kadar kullanılır */
    var limits = {
        maxFiles: 3,
        maxFileBytes: 20 * 1024 * 1024,
        maxTotalBytes: 40 * 1024 * 1024,
        extensions: ['pdf', 'dwg', 'dxf', 'sldprt', 'sldasm', 'slddrw', 'step', 'stp', 'iges', 'igs', 'x_t', 'x_b', 'stl', 'jpg', 'jpeg', 'png', 'zip'],
        descriptionMaxLength: 5000
    };

    /* sunucu alan adı → form elemanı id'si */
    var FIELD_IDS = {
        company_name: 'firma',
        contact_name: 'yetkili',
        phone: 'telefon',
        email: 'eposta',
        service_type: 'hizmet',
        material_type: 'malzeme',
        dimensions: 'kalinlik',
        quantity: 'adet',
        expected_deadline: 'termin',
        project_description: 'aciklama',
        kvkk: 'kvkk',
        files: 'dosya'
    };

    var submitButton = form.querySelector('.form-submit');
    var submitLabel = submitButton ? submitButton.textContent.trim() : '';
    var statusBox = document.getElementById('teklif-form-status');
    var turnstileBox = document.getElementById('teklif-turnstile');
    var fileInput = document.getElementById('dosya');
    var fileHint = document.getElementById('dosya-formats');

    var env = resolveEnvironment(window.FORAMAK_QUOTE_CONFIG);
    var ready = isEnvironmentReady(env);
    var functionsUrl = ready ? env.supabaseUrl.replace(/\/+$/, '') + '/functions/v1' : '';

    var busy = false;
    var redirecting = false;
    var SUCCESS_URL = '/teklif-alindi';
    var RESULT_KEY = 'foramak.quoteResult';
    var submissionId = newSubmissionId();
    var warmedUp = false;
    var ts = { loader: null, widgetId: null, pending: null };


    /* === YAPILANDIRMA === */
    function resolveEnvironment(config) {
        var host = window.location.hostname;
        var list = (config && config.environments) || [];
        for (var i = 0; i < list.length; i++) {
            if ((list[i].hosts || []).indexOf(host) !== -1) return list[i];
        }
        return null;
    }

    function isEnvironmentReady(e) {
        if (!e || e.submissionsEnabled !== true) return false;
        if (!e.supabaseUrl || !e.supabasePublishableKey || !e.turnstileSiteKey) return false;
        if (e.name === 'production') {
            if (!/^https:\/\//.test(e.supabaseUrl)) return false;
            if (TURNSTILE_TEST_SITEKEY.test(e.turnstileSiteKey)) return false;
        }
        return true;
    }

    function newSubmissionId() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
        var b = window.crypto.getRandomValues(new Uint8Array(16));
        b[6] = (b[6] & 0x0f) | 0x40;
        b[8] = (b[8] & 0x3f) | 0x80;
        var h = Array.prototype.map.call(b, function (x) { return (x + 256).toString(16).slice(1); }).join('');
        return h.slice(0, 8) + '-' + h.slice(8, 12) + '-' + h.slice(12, 16) + '-' + h.slice(16, 20) + '-' + h.slice(20);
    }


    /* === YARDIMCILAR === */
    function QuoteError(code, message, details) {
        this.code = code;
        this.message = message || '';
        this.details = details || {};
    }

    function el(id) { return document.getElementById(id); }
    function value(id) { var e = el(id); return e ? e.value.trim() : ''; }

    function formatMb(bytes) { return Math.round(bytes / (1024 * 1024)) + ' MB'; }

    function fileExtension(name) {
        var dot = name.lastIndexOf('.');
        return dot === -1 ? '' : name.slice(dot + 1).toLowerCase();
    }

    function textNode(t) { return document.createTextNode(t); }

    function link(href, text) {
        var a = document.createElement('a');
        a.href = href;
        a.textContent = text;
        return a;
    }

    /* "… Talebinizi e-posta ile ya da telefondan iletebilirsiniz." */
    function contactSentence(prefix) {
        var frag = document.createDocumentFragment();
        if (prefix) frag.appendChild(textNode(prefix + ' '));
        frag.appendChild(textNode('Talebinizi '));
        frag.appendChild(link('mailto:' + CONTACT_EMAIL, CONTACT_EMAIL));
        frag.appendChild(textNode(' adresine e-posta ile ya da '));
        frag.appendChild(link(CONTACT_PHONE_HREF, CONTACT_PHONE_TEXT));
        frag.appendChild(textNode(' numaralı telefondan iletebilirsiniz.'));
        return frag;
    }


    /* === DURUM MESAJI === */
    function setStatus(type, content) {
        if (!statusBox) return;
        statusBox.className = 'form-status form-status--' + type;
        statusBox.textContent = '';
        if (typeof content === 'string') statusBox.textContent = content;
        else statusBox.appendChild(content);
        statusBox.hidden = false;
    }

    function revealStatus() {
        if (!statusBox) return;
        statusBox.focus({ preventScroll: true });
        statusBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setBusy(state) {
        busy = state;
        if (!submitButton) return;
        submitButton.disabled = state;
        submitButton.setAttribute('aria-busy', state ? 'true' : 'false');
        submitButton.textContent = state ? 'Gönderiliyor…' : submitLabel;
    }

    window.addEventListener('beforeunload', function (e) {
        if (!busy) return;
        e.preventDefault();
        e.returnValue = '';
    });


    /* === ALAN HATALARI === */
    function errorAnchor(input) {
        if (input.type === 'checkbox') return input.closest('.form-kvkk') || input;
        if (input.type === 'file') return input.closest('.file-upload-area') || input;
        return input;
    }

    function setFieldError(field, message) {
        var input = el(FIELD_IDS[field]);
        if (!input) return;
        var errorId = input.id + '-error';
        var p = el(errorId);
        if (!p) {
            p = document.createElement('p');
            p.className = 'form-error';
            p.id = errorId;
            var anchor = errorAnchor(input);
            anchor.parentNode.insertBefore(p, anchor.nextSibling);
        }
        p.textContent = message;
        input.setAttribute('aria-invalid', 'true');
        var described = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (described.indexOf(errorId) === -1) described.push(errorId);
        input.setAttribute('aria-describedby', described.join(' '));
    }

    function clearFieldError(input) {
        var errorId = input.id + '-error';
        var p = el(errorId);
        if (p) p.parentNode.removeChild(p);
        input.removeAttribute('aria-invalid');
        var described = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(function (id) {
            return id && id !== errorId;
        });
        if (described.length) input.setAttribute('aria-describedby', described.join(' '));
        else input.removeAttribute('aria-describedby');
    }

    function clearAllErrors() {
        Object.keys(FIELD_IDS).forEach(function (field) {
            var input = el(FIELD_IDS[field]);
            if (input) clearFieldError(input);
        });
    }

    function showFieldErrors(errors) {
        var first = null;
        Object.keys(errors).forEach(function (field) {
            setFieldError(field, errors[field]);
            if (!first) first = el(FIELD_IDS[field]);
        });
        if (first) first.focus();
    }

    form.addEventListener('input', function (e) {
        if (e.target && e.target.getAttribute('aria-invalid') === 'true') clearFieldError(e.target);
    });
    form.addEventListener('change', function (e) {
        if (e.target && e.target.getAttribute('aria-invalid') === 'true' && e.target !== fileInput) clearFieldError(e.target);
    });


    /* === İSTEMCİ DOĞRULAMASI (sunucu aynı kuralları tekrar uygular) === */
    function selectedFiles() {
        return fileInput && fileInput.files ? Array.prototype.slice.call(fileInput.files) : [];
    }

    function validateFiles(files) {
        if (files.length > limits.maxFiles) return 'En fazla ' + limits.maxFiles + ' dosya yükleyebilirsiniz.';
        var total = 0;
        for (var i = 0; i < files.length; i++) {
            var f = files[i];
            if (limits.extensions.indexOf(fileExtension(f.name)) === -1) {
                return '"' + f.name + '" desteklenmeyen bir dosya türü. PDF, DWG, DXF, STEP, IGES, STL, SolidWorks, Parasolid, JPG, PNG veya ZIP yükleyin.';
            }
            if (f.size === 0) return '"' + f.name + '" boş görünüyor.';
            if (f.size > limits.maxFileBytes) return '"' + f.name + '" dosya başına ' + formatMb(limits.maxFileBytes) + ' sınırını aşıyor.';
            total += f.size;
        }
        if (total > limits.maxTotalBytes) return 'Dosyaların toplam boyutu ' + formatMb(limits.maxTotalBytes) + ' sınırını aşıyor.';
        return '';
    }

    function collect() {
        return {
            company_name: value('firma'),
            contact_name: value('yetkili'),
            phone: value('telefon'),
            email: value('eposta'),
            service_type: value('hizmet'),
            material_type: value('malzeme'),
            dimensions: value('kalinlik'),
            quantity: value('adet'),
            expected_deadline: value('termin'),
            project_description: value('aciklama'),
            kvkk_acknowledged: !!(el('kvkk') && el('kvkk').checked),
            website: value('web_sitesi'),
            files: selectedFiles()
        };
    }

    function validate(d) {
        var errors = {};
        if (d.company_name.length < 2) errors.company_name = 'Firma adını yazın.';
        if (d.contact_name.length < 2) errors.contact_name = 'Yetkili kişinin adını yazın.';
        var digits = d.phone.replace(/\D/g, '').length;
        if (!/^[0-9+()\-.\s]+$/.test(d.phone) || digits < 10 || digits > 15) errors.phone = 'Geçerli bir telefon numarası yazın.';
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(d.email)) errors.email = 'Geçerli bir e-posta adresi yazın.';
        if (!d.service_type) errors.service_type = 'Hizmet türünü seçin.';
        if (d.project_description.length > limits.descriptionMaxLength) {
            errors.project_description = 'Açıklama en fazla ' + limits.descriptionMaxLength + ' karakter olabilir.';
        }
        var fileError = validateFiles(d.files);
        if (fileError) errors.files = fileError;
        if (!d.kvkk_acknowledged) errors.kvkk = 'Formu gönderebilmek için bu kutuyu işaretleyin.';
        return errors;
    }

    if (fileInput) {
        fileInput.addEventListener('change', function () {
            clearFieldError(fileInput);
            var error = validateFiles(selectedFiles());
            if (error) setFieldError('files', error);
        });
    }


    /* === SUNUCU İSTEKLERİ === */
    function request(method, name, body) {
        var controller = typeof AbortController === 'function' ? new AbortController() : null;
        var timer = controller ? setTimeout(function () { controller.abort(); }, 30000) : null;
        var headers = { apikey: env.supabasePublishableKey };
        if (body) headers['Content-Type'] = 'application/json';

        return fetch(functionsUrl + '/' + name, {
            method: method,
            headers: headers,
            body: body ? JSON.stringify(body) : undefined,
            signal: controller ? controller.signal : undefined
        }).then(function (res) {
            return res.json().catch(function () { return {}; }).then(function (data) {
                if (!res.ok || data.ok === false) {
                    throw new QuoteError(data.code || 'http_' + res.status, data.message, data);
                }
                return data;
            });
        }, function () {
            throw new QuoteError('network');
        }).finally(function () {
            if (timer) clearTimeout(timer);
        });
    }

    function loadLimits() {
        return request('GET', 'quote-init').then(function (data) {
            if (data.limits) {
                limits = data.limits;
                if (fileHint) {
                    fileHint.textContent = 'PDF, DWG, DXF, STEP, SolidWorks ve diğer CAD dosyaları kabul edilir. En fazla ' +
                        limits.maxFiles + ' dosya, dosya başına ' + formatMb(limits.maxFileBytes) + '.';
                }
            }
        }).catch(function () { /* varsayılan limitler kullanılır */ });
    }

    function isRetryable(err) {
        return err.code === 'network' || err.code === 'server_error' || /^http_5/.test(err.code);
    }

    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    function finalize(quoteId, token, attempt) {
        attempt = attempt || 1;
        return request('POST', 'quote-finalize', { quote_id: quoteId, finalize_token: token }).catch(function (err) {
            // finalize tekrar çağrılabilir; ikinci kez tamamlanmaz
            if (attempt < 3 && isRetryable(err)) {
                return wait(1500 * attempt).then(function () { return finalize(quoteId, token, attempt + 1); });
            }
            throw err;
        });
    }


    /* === DOSYA YÜKLEME (doğrudan private Supabase Storage) === */
    function uploadOnce(upload, file, onProgress) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', upload.signed_url);
            xhr.setRequestHeader('Content-Type', upload.content_type);
            xhr.setRequestHeader('x-upsert', 'false');
            xhr.setRequestHeader('apikey', env.supabasePublishableKey);
            xhr.timeout = 10 * 60 * 1000;
            xhr.upload.onprogress = function (e) { if (e.lengthComputable) onProgress(e.loaded / e.total); };
            xhr.onload = function () {
                // Önceki deneme dosyayı yüklemiş olabilir ("already exists") → finalize içeriği doğrular
                var duplicate = xhr.status === 409 || (xhr.status === 400 && /Duplicate|already exists/i.test(xhr.responseText));
                if ((xhr.status >= 200 && xhr.status < 300) || duplicate) resolve();
                else reject(new QuoteError(xhr.status >= 500 ? 'upload_retryable' : 'upload_failed'));
            };
            xhr.onerror = function () { reject(new QuoteError('upload_retryable')); };
            xhr.ontimeout = function () { reject(new QuoteError('upload_retryable')); };
            xhr.send(file);
        });
    }

    function uploadAll(uploads, files) {
        var index = 0;
        function next() {
            if (index >= uploads.length) return Promise.resolve();
            var upload = uploads[index];
            var file = files[upload.client_index];
            var label = 'Dosyalar yükleniyor (' + (index + 1) + '/' + uploads.length + ')';
            var progress = function (ratio) { setStatus('progress', label + ' — %' + Math.round(ratio * 100)); };
            progress(0);
            return uploadOnce(upload, file, progress).catch(function (err) {
                if (err.code !== 'upload_retryable') throw err;
                return wait(1500).then(function () { return uploadOnce(upload, file, progress); });
            }).catch(function () {
                throw new QuoteError('upload_failed', '', { file: file.name });
            }).then(function () {
                index++;
                return next();
            });
        }
        return next();
    }


    /* === TURNSTILE (form ilk kullanıldığında yüklenir) === */
    function loadTurnstile() {
        if (window.turnstile) return Promise.resolve(window.turnstile);
        if (ts.loader) return ts.loader;
        ts.loader = new Promise(function (resolve, reject) {
            window.foramakTurnstileReady = function () { resolve(window.turnstile); };
            var script = document.createElement('script');
            script.src = TURNSTILE_SRC;
            script.async = true;
            script.defer = true;
            script.onerror = function () {
                ts.loader = null;
                reject(new QuoteError('turnstile_unavailable'));
            };
            document.head.appendChild(script);
        });
        return ts.loader;
    }

    function settleTurnstile(err, token) {
        var pending = ts.pending;
        ts.pending = null;
        if (!pending) return;
        clearTimeout(pending.timer);
        if (err) pending.reject(err);
        else pending.resolve(token);
    }

    function ensureWidget(api) {
        if (ts.widgetId !== null || !turnstileBox) return;
        ts.widgetId = api.render(turnstileBox, {
            sitekey: env.turnstileSiteKey,
            action: 'teklif_talebi',
            execution: 'execute',
            appearance: 'interaction-only',
            size: 'flexible',
            language: 'tr',
            callback: function (token) { settleTurnstile(null, token); },
            'error-callback': function () {
                settleTurnstile(new QuoteError('turnstile_client'));
                return true;
            },
            'expired-callback': function () { settleTurnstile(new QuoteError('turnstile_client')); },
            'timeout-callback': function () { settleTurnstile(new QuoteError('turnstile_client')); }
        });
    }

    function getTurnstileToken() {
        return loadTurnstile().then(function (api) {
            ensureWidget(api);
            return new Promise(function (resolve, reject) {
                ts.pending = {
                    resolve: resolve,
                    reject: reject,
                    timer: setTimeout(function () { settleTurnstile(new QuoteError('turnstile_client')); }, 120000)
                };
                api.execute(turnstileBox);
            });
        });
    }

    function resetTurnstile() {
        if (window.turnstile && ts.widgetId !== null) window.turnstile.reset(ts.widgetId);
    }

    function warmUp() {
        if (warmedUp || !ready) return;
        warmedUp = true;
        loadLimits();
        loadTurnstile().then(ensureWidget).catch(function () { /* gönderimde tekrar denenir */ });
    }
    form.addEventListener('focusin', warmUp);


    /* === SONUÇLAR === */

    /* Kayıt tamamlandıysa başarı sayfasına geç. Referans URL'ye yazılmaz;
       yalnızca bu sekmenin sessionStorage'ında kısa süre tutulur. */
    function goToSuccessPage(result) {
        if (result.status !== 'received' || !/^FOR-\d{4}-\d{4,}$/.test(result.reference_no || '')) return false;
        try {
            window.sessionStorage.setItem(RESULT_KEY, JSON.stringify({
                reference: result.reference_no,
                notification: result.notification_status === 'sent' ? 'sent' : 'pending',
                at: Date.now()
            }));
        } catch (e) {
            return false;   // depolama kapalıysa sonuç bu sayfada gösterilir
        }
        redirecting = true;
        setStatus('progress', 'Talebiniz kaydedildi, yönlendiriliyorsunuz…');
        form.reset();
        window.location.assign(SUCCESS_URL);
        return true;
    }

    function showResult(result) {
        if (goToSuccessPage(result)) return;

        var frag = document.createDocumentFragment();
        var strong = document.createElement('strong');
        strong.textContent = result.reference_no || '';

        if (result.notification_status === 'sent') {
            frag.appendChild(textNode(result.already_received ? 'Bu talep daha önce alınmıştı. Referans numaranız: ' : 'Talebiniz alındı. Referans numaranız: '));
            frag.appendChild(strong);
            frag.appendChild(textNode('. Ekibimiz talebinizi inceleyip sizinle iletişime geçecek.'));
            setStatus('success', frag);
        } else {
            // Kayıt güvende ama ekibe bildirim henüz gitmedi → "iletildi" denmez
            frag.appendChild(textNode('Talebiniz kaydedildi. Referans numaranız: '));
            frag.appendChild(strong);
            frag.appendChild(textNode('. Ekibimize otomatik bildirim gönderilirken gecikme oluştu; talebiniz kayıtlı olduğu için tekrar göndermeniz gerekmez. Acil durumlar için '));
            frag.appendChild(link(CONTACT_PHONE_HREF, CONTACT_PHONE_TEXT));
            frag.appendChild(textNode(' numarasından bize ulaşabilirsiniz.'));
            setStatus('warning', frag);
        }

        form.reset();
        if (fileInput) fileInput.dispatchEvent(new Event('change', { bubbles: true }));
        submissionId = newSubmissionId();
    }

    var SERVER_MESSAGE_CODES = [
        'turnstile_failed', 'rate_limited', 'upload_capacity', 'upload_incomplete',
        'invalid_file', 'too_large', 'not_found', 'closed', 'rejected', 'payload_too_large'
    ];

    function showError(err) {
        if (err.code === 'validation_failed' && err.details.fields) {
            showFieldErrors(err.details.fields);
            setStatus('error', 'Lütfen işaretli alanları kontrol edin.');
            return;
        }
        if (err.code === 'submission_closed') {
            submissionId = newSubmissionId();
            setStatus('error', 'Lütfen formu tekrar gönderin.');
            return;
        }
        if (err.code === 'submissions_disabled' || err.code === 'server_misconfigured') {
            setStatus('info', contactSentence('Online teklif sistemi henüz kullanıma açılmadı.'));
            return;
        }
        if (err.code === 'upload_failed') {
            setStatus('error', '"' + (err.details.file || 'Dosya') + '" yüklenemedi. Bağlantınızı kontrol edip formu tekrar gönderin.');
            return;
        }
        if (err.code === 'turnstile_client' || err.code === 'turnstile_unavailable') {
            setStatus('error', contactSentence('Güvenlik doğrulaması tamamlanamadı. Sayfayı yenileyip tekrar deneyin.'));
            return;
        }
        if (err.code === 'network') {
            setStatus('error', contactSentence('Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.'));
            return;
        }
        if (SERVER_MESSAGE_CODES.indexOf(err.code) !== -1 && err.message) {
            setStatus('error', err.message);
            return;
        }
        setStatus('error', contactSentence('Talebiniz gönderilemedi. Lütfen tekrar deneyin.'));
    }


    /* === GÖNDERİM === */
    function submit() {
        clearAllErrors();

        if (!ready) {
            setStatus('info', contactSentence('Online teklif sistemi henüz kullanıma açılmadı.'));
            revealStatus();
            return;
        }

        var data = collect();
        var errors = validate(data);
        if (Object.keys(errors).length) {
            showFieldErrors(errors);
            setStatus('error', 'Lütfen işaretli alanları kontrol edin.');
            return;
        }

        setBusy(true);
        setStatus('progress', 'Güvenlik doğrulaması yapılıyor…');

        getTurnstileToken().then(function (token) {
            setStatus('progress', 'Talebiniz kaydediliyor…');
            return request('POST', 'quote-init', {
                submission_id: submissionId,
                turnstile_token: token,
                company_name: data.company_name,
                contact_name: data.contact_name,
                phone: data.phone,
                email: data.email,
                service_type: data.service_type,
                material_type: data.material_type,
                dimensions: data.dimensions,
                quantity: data.quantity,
                expected_deadline: data.expected_deadline,
                project_description: data.project_description,
                kvkk_acknowledged: data.kvkk_acknowledged,
                website: data.website,
                files: data.files.map(function (f) { return { name: f.name, size: f.size, type: f.type }; })
            });
        }).then(function (init) {
            if (init.status === 'received') return init;
            return uploadAll(init.uploads || [], data.files).then(function () {
                setStatus('progress', 'Talebiniz tamamlanıyor…');
                return finalize(init.quote_id, init.finalize_token);
            });
        }).then(showResult).catch(showError).then(function () {
            if (redirecting) return;   // başarı sayfasına geçilirken buton kilitli kalır
            setBusy(false);
            resetTurnstile();
            revealStatus();
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!busy) submit();
    });

})();
