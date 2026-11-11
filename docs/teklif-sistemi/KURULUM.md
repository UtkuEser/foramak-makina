# Teklif Talep Sistemi — Kurulum ve İşletim Rehberi

Bu belge `teklif-al.html` formunun Supabase + Resend + Cloudflare Turnstile altyapısını anlatır.
Belge ve `supabase/` klasörü `.vercelignore` ile yayından hariç tutulur.

> **Durum (2026-11-11):** Altyapı production'da kurulu (3 Edge Function, bakım görevi). Supabase
> `QUOTE_SUBMISSIONS_ENABLED` açık; `js/quote-config.js` → `production` bölümünde Supabase URL'si,
> publishable key ve gerçek Turnstile site key dolu, `submissionsEnabled: true`. Form canlıda gönderim
> kabul eder. **Açık risk:** onaylı KVKK aydınlatma metni yayında değil; `privacyNoticeUrl` boş ve
> formdaki bağlantı `href="#"`. Sahte başarı mesajı yoktur.

---

## 1. Mimari

```
Tarayıcı (teklif-al.html + js/quote-form.js)
  │ 1. istemci doğrulaması
  │ 2. Turnstile token (form ilk kullanıldığında yüklenir, "interaction-only")
  ├─► quote-init (Edge Function)  — Origin + doğrulama + hız sınırı + Turnstile Siteverify
  │      └─ pending kayıt + yalnızca bu talebe ait rastgele yollar için signed upload URL
  ├─► Supabase Storage (private bucket)  — dosyalar DOĞRUDAN yüklenir (Vercel'den geçmez)
  └─► quote-finalize (Edge Function)
         ├─ dosyalar gerçekten var mı, boyut/tür sınırı, ilk baytlar uzantıyla uyumlu mu
         ├─ talep atomik olarak received + FOR-YYYY-NNNN referansı
         └─ kayıt güvendeyken Resend ile e-posta (başarısızsa failed, sonra tekrar denenir)

pg_cron (15 dk) ─► quote-maintenance — bucket eşitleme, eski pending talepleri ve sahipsiz
                                        dosyaları silme, başarısız e-postaları tekrar deneme
```

### Dosyalar

| Dosya | Görev |
|---|---|
| `supabase/migrations/20261102120000_quote_requests.sql` | Tablolar, RLS, private bucket, yardımcı SQL fonksiyonları |
| `supabase/migrations/20261102150000_quote_cad_formats.sql` | CAD formatları: bucket içerik türleri + `storage_path` uzantı kısıtı (ileriye dönük, veri silmez) |
| `supabase/functions/_shared/quote-config.ts` | **Tek yapılandırma:** dosya limitleri, türler, hız sınırları, temizlik süreleri, hizmet/malzeme listeleri |
| `supabase/functions/quote-init/` | Doğrulama, Turnstile, pending kayıt, signed upload URL; GET → frontend limitleri |
| `supabase/functions/quote-finalize/` | Yükleme doğrulama, tamamlama, e-posta |
| `supabase/functions/quote-maintenance/` | Zamanlanmış bakım (gizli başlıkla) |
| `supabase/functions/_shared/*.ts` | Ortak modüller (http, doğrulama, dosya imzası, Turnstile, e-posta, güvenlik) |
| `supabase/functions/tests/*.test.ts` | Birim testleri (`deno test --allow-env --allow-read supabase/functions/tests/`) |
| `supabase/functions/.env.example` | Ortam değişkeni örneği (gerçek değer yok) |
| `supabase/config.toml` | Fonksiyonların JWT ayarı, yerel bucket |
| `supabase/manual/schedule-quote-maintenance.sql` | pg_cron zamanlaması (elle çalıştırılır) |
| `js/quote-config.js` | Frontend **public** yapılandırma (URL, publishable key, Turnstile site key) |
| `js/quote-form.js` | Form gönderimi |
| `css/quote-form.css` | Hata / durum mesajı stilleri (yalnızca teklif sayfası) |

### Desteklenen dosya formatları

En fazla 3 dosya, dosya başına 20 MB, toplam 40 MB. Uzantılar büyük/küçük harf duyarsızdır.
Tarayıcının bildirdiği MIME türü **kullanılmaz** (DWG, DXF ve SolidWorks için tarayıcılar farklı
veya boş değer gönderir): içerik türü uzantıdan sunucuda belirlenir, dosyanın kendisi
`quote-finalize`'da imza / yapı kontrolünden geçer. Uyuşmayan dosya Storage'dan silinir.

| Format | Uzantı | Storage içerik türü | Sunucu kontrolü | Dayanak |
|---|---|---|---|---|
| PDF | pdf | application/pdf | `%PDF-` başlığı | PDF spesifikasyonu |
| AutoCAD | dwg | image/vnd.dwg | `AC10xx` sürüm başlığı | yaygın format bilgisi |
| AutoCAD | dxf | image/vnd.dxf | ASCII grup kodu + `SECTION` / binary DXF başlığı | yaygın format bilgisi |
| STEP | step, stp | model/step | `ISO-10303-21;` başlığı | ISO 10303-21 |
| IGES | iges, igs | model/iges | 80 sütun, ilk satır 73. sütunda `S`, sıra no 1 | IGES dosya yapısı |
| STL | stl | model/stl | binary: `84 + 50 × üçgen = dosya boyutu`; ASCII: `solid … facet` | STL yapısı |
| Parasolid | x_t | application/octet-stream | `**ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz` + `**PARASOLID` başlığı | Parasolid XT Format Reference |
| Parasolid | x_b | application/octet-stream | ortak metin başlığı veya nötr binary bayrağı `PS\0\0` | Parasolid XT Format Reference |
| SolidWorks | sldprt, sldasm, slddrw | application/octet-stream | OLE2 imzası veya `14 00 06 00 08 00` blok işareti; ZIP başlıklı dosya reddedilir | **resmî spesifikasyon yok** (tersine mühendislik belgeleri) |
| Görsel | jpg, jpeg, png | image/jpeg, image/png | dosya imzası | standart |
| Arşiv | zip | application/zip | merkezî dizin denetimi (aşağıda); **içerik açılmaz** | ZIP yapısı |

Tüm formatlarda dosya çalıştırılabilir başlıkla (MZ/EXE, ELF, Mach-O, `#!` betik) başlıyorsa reddedilir.

**Kısmi doğrulama:** SolidWorks dosyaları için yayımlanmış bir format tanımı yoktur; kontrol iki
bilinen kapsayıcı yapıyı arar ve sahte uzantıları (yeniden adlandırılmış ZIP/DOCX, EXE, metin)
ayıklar ama içeriği tam doğrulamaz. ZIP'in içindeki dosyalar hiç açılmaz. Bu iki tür e-postada
"içerik tam doğrulanmadı / içindeki dosyalar açılmadı" notuyla gösterilir; açmadan önce antivirüs
taramasından geçirilmelidir.

**ZIP kuralları** (yalnızca çok parçalı CAD projeleri, ör. montaj + parça dosyaları). Arşiv sunucuda
açılmaz; yalnızca dosya sonundaki merkezî dizin okunur:

- Arşiv `PK` yerel başlığıyla başlamalı (kendiliğinden açılan EXE reddedilir); ZIP64, çok parçalı ve şifreli arşiv yok
- En fazla 200 dosya; içerideki her dosya yukarıdaki CAD/doküman uzantılarından biri olmalı
  (iç içe arşiv, EXE, BAT, JS, LNK, HTML, Office makro dosyası vb. reddedilir; `.DS_Store`,
  `Thumbs.db` ve `__MACOSX/._*` sistem dosyalarına izin verilir)
- Path traversal (`../`, `..\`), mutlak yol (`/`, `C:`), sembolik bağlantı ve aynı adlı dosya yok
- Yalnızca stored / deflate sıkıştırma
- ZIP bomb sınırları: dosya başına açılmış boyut ≤ 250 MB, toplam ≤ 500 MB, sıkıştırma oranı ≤ 100:1,
  üst üste binen kayıt yok

Sınırlar `quote-config.ts` → `zip` bölümündedir.

---

## 2. Ortam değişkenleri

### Edge Function secrets (Supabase Dashboard → Edge Functions → Secrets)

| Değişken | Örnek / açıklama |
|---|---|
| `QUOTE_ENVIRONMENT` | `production` veya `development` (boşsa production) |
| `QUOTE_ALLOWED_ORIGINS` | production: `https://www.foramak.com,https://foramak.com` · development: `http://localhost:5500,http://127.0.0.1:5500` |
| `QUOTE_SUBMISSIONS_ENABLED` | production'da `true` olmadan başvuru kabul edilmez. **KVKK değerlendirmesi bitmeden açmayın.** |
| `TURNSTILE_SECRET_KEY` | Cloudflare secret key. Test anahtarı production'da kod tarafından reddedilir. |
| `QUOTE_IP_HASH_SALT` | `openssl rand -hex 32` çıktısı |
| `RESEND_API_KEY` | Resend → API Keys (yalnızca gönderim yetkili, tek domaine sınırlı) |
| `FORM_NOTIFICATION_EMAIL` | `foramak@foramaklazer.com` |
| `FORM_SENDER_EMAIL` | `Foramak Teklif Formu <teklif@notify.foramak.com>` |
| `MAINTENANCE_SECRET` | `openssl rand -hex 32` çıktısı (Vault'taki değerle aynı) |

`SUPABASE_URL` ve sunucu anahtarı (`SUPABASE_SECRET_KEYS` / `SUPABASE_SERVICE_ROLE_KEY`)
Supabase tarafından fonksiyonlara **otomatik** verilir; elle eklenmez, tarayıcıya hiç çıkmaz.

**Güvenlik değişmezi:** `production` modunda localhost/http origin ve Turnstile test anahtarı;
`development` modunda canlı site origin'i kabul edilmez. Yanlış kombinasyonda fonksiyon
çalışmaz (500 `server_misconfigured`). Böylece test anahtarı canlı trafikle asla birlikte çalışmaz.

### Frontend (`js/quote-config.js`)

Site build adımı olmadan statik yayınlandığı için değerler doğrudan bu dosyadadır
(Vite ortam değişkenine güvenilmez). Yalnızca public değerler:

- `supabaseUrl` — `https://<project-ref>.supabase.co`
- `supabasePublishableKey` — `sb_publishable_…` (tarayıcı için tasarlanmıştır; RLS sayesinde hiçbir tabloya erişim vermez)
- `turnstileSiteKey` — production'da gerçek site key (test anahtarı yazılırsa form devre dışı kalır)
- `privacyNoticeUrl` — hukuken onaylanmış KVKK aydınlatma metninin adresi (ör. `/kvkk-aydinlatma-metni`).
  Formdaki "KVKK Aydınlatma Metni" bağlantısı bu adrese gider; boşsa `href="#"` kalır (gönderimi
  engellemez — canlıya geçiş riski olarak takip edilir). Yalnızca `/…` site içi yol veya `https://…` kabul edilir.
- `submissionsEnabled`

**Asla yazılmayacaklar:** `sb_secret_…` / `service_role` anahtarı, Turnstile secret, Resend API key.

---

## 3. Aşama 2 — Sizin yapmanız gerekenler

Gizli anahtarları sohbete veya bir dosyaya yapıştırmayın; doğrudan ilgili panele girin.

### 3.1 Supabase

1. Supabase'de **Foramak için ayrı** bir organization (önerilir) veya en azından ayrı bir proje
   oluşturun. Başka projelerinizi kullanmayın.
   - Proje adı: `foramak-teklif`
   - Bölge: **Frankfurt (eu-central-1)** — Türkiye'ye en yakın AB bölgesi
   - Veritabanı şifresi: güçlü, parola yöneticisinde saklayın
2. Hesapta **iki adımlı doğrulamayı** açın.
3. **Project Settings → API Keys:** Project URL ve **publishable key**'i `js/quote-config.js`'e
   yazın (önce `development` bölümüne — bkz. Aşama 3).
4. **Migration'ları sırayla, her birini bir kez uygulayın** (SQL Editor → içeriği yapıştır → Run):
   1. `supabase/migrations/20261102120000_quote_requests.sql` (✓ uygulandı — tekrar çalıştırmayın)
   2. `supabase/migrations/20261102150000_quote_cad_formats.sql` (CAD formatları; tekrar çalıştırılırsa zararsızdır)

   Migration'lar SQL Editor'dan uygulandığı için Supabase CLI kayıt tutmadı. İleride `npx supabase db push`
   kullanılacaksa önce `npx supabase migration repair --status applied 20261102120000 20261102150000`
   ile uygulandıkları işaretlenmelidir; aksi halde CLI ilk migration'ı tekrar denemeye çalışır.
5. **Fonksiyonları yükleyin:**
   ```bash
   npx supabase functions deploy quote-init quote-finalize quote-maintenance --project-ref <ref>
   ```
   (`supabase/config.toml` JWT kontrolünü kapatır; gerekirse `--no-verify-jwt` ekleyin.
   CLI Docker isterse `--use-api` ekleyin.)
6. **Secrets:** Dashboard → Edge Functions → Secrets → bölüm 2'deki değişkenleri ekleyin.
7. **Bakım görevini zamanlayın:** SQL Editor'da önce iki Vault satırını kendi değerlerinizle
   çalıştırın, sonra `supabase/manual/schedule-quote-maintenance.sql`'i çalıştırın.
8. Kontrol: Storage'da `quote-attachments` bucket'ı **Private** görünmeli.

### 3.2 Cloudflare Turnstile

DNS'i Cloudflare'e taşımak **gerekmez**.

1. Cloudflare hesabı (ücretsiz) → **Turnstile → Add widget**
   - Ad: `Foramak Teklif Formu`
   - Hostnames: `www.foramak.com`, `foramak.com`
   - Widget mode: **Managed**
2. **Site key** → `js/quote-config.js` → `production.turnstileSiteKey`
3. **Secret key** → Supabase secret `TURNSTILE_SECRET_KEY` (production'a geçerken)

### 3.3 Resend ve gönderici alan adı

`foramak.com` DNS'i GoDaddy'de (ns59/ns60.domaincontrol.com). Hedef posta kutusu
`foramaklazer.com` (Hostinger MX) — **bu alan adına hiçbir kayıt eklenmez.**

1. Resend hesabı → iki adımlı doğrulama.
2. **Domains → Add Domain → `notify.foramak.com`** (bölge seçimi varsa AB / eu-west-1).
3. Resend'in gösterdiği kayıtları GoDaddy DNS'e **birebir kopyalayın**. Tipik olarak:

   | Tür | Ad (GoDaddy "Host") | Değer |
   |---|---|---|
   | TXT | `resend._domainkey.notify` | Resend'in verdiği DKIM anahtarı |
   | MX | `send.notify` | `feedback-smtp.<bölge>.amazonses.com` (öncelik 10) |
   | TXT | `send.notify` | `v=spf1 include:amazonses.com ~all` |

   Değerleri bu tablodan değil, **Resend panelinden** alın.
4. Bu kayıtların tamamı `notify` alt alanındadır:
   - `foramak.com` kök kayıtları (A, `www` CNAME → Vercel, google-site-verification) değişmez.
   - `foramaklazer.com` MX / SPF kayıtlarına dokunulmaz; mevcut posta kutusu etkilenmez.
5. `foramak.com` üzerinde `p=quarantine` DMARC kaydı var; alt alan bunu devralır. DKIM doğrulanmadan
   gönderim yapılırsa e-postalar karantinaya düşebilir → **Verify** yeşil olmadan teste başlamayın.
6. **API Keys → Create:** izin *Sending access*, domain `notify.foramak.com` → Supabase secret `RESEND_API_KEY`.
7. Hostinger webmail'de `teklif@notify.foramak.com` adresini güvenilir göndericilere ekleyin;
   ilk testlerde spam klasörünü kontrol edin.

---

## 4. Aşama 3 — Test

Bu bilgisayarda Docker olmadığı için yerel Supabase yığını (`supabase start`) çalıştırılamaz.
Önerilen yol: canlı Supabase projesini **kısa bir süre development modunda** test etmek.

1. Secrets: `QUOTE_ENVIRONMENT=development`,
   `QUOTE_ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500`,
   `TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA` (Cloudflare resmi test anahtarı)
2. `js/quote-config.js` → `development` bölümüne Supabase URL ve publishable key
3. `npm run dev` → `http://localhost:5500/teklif-al`
4. Testler bitince: test kayıtlarını silin, secrets'ı production değerlerine çevirin
   (`QUOTE_ENVIRONMENT=production`, production origin'leri, gerçek Turnstile secret,
   `QUOTE_SUBMISSIONS_ENABLED=false`). Development modunu açık bırakmayın.

**Sadece sahte veri kullanın:** ör. *Deneme Makine Ltd.*, *Test Kişi*, `0555 000 00 00`,
gerçek olmayan bir e-posta (ör. kendi adresinize `+test` eki).

| Senaryo | Nasıl | Beklenen |
|---|---|---|
| Zorunlu alanlar | Boş gönder | 6 alan hatası, istek yok |
| Hatalı e-posta | `test@ornek` | Alan hatası |
| Dosyasız teklif | Dosya seçmeden gönder | `FOR-2026-0001`, e-posta gelir |
| PDF | 1 PDF | Storage'da `requests/<id>/<uuid>.pdf`, e-postada dosya adı/boyutu |
| DWG / DXF | Gerçek çizim dosyası | Kabul edilir |
| SolidWorks | Gerçek SLDPRT, SLDASM, SLDDRW (2015 öncesi ve sonrası sürümlerden) | Kabul edilir; e-postada "tam doğrulanamadı" notu. **Reddedilirse imza kontrolü gerçek dosyaya göre düzeltilmeli** |
| STEP / IGES / Parasolid / STL | SolidWorks ve başka bir CAD programından dışa aktarılmış gerçek dosyalar (binary ve ASCII STL ayrı ayrı) | Kabul edilir |
| ZIP | Windows Gezgini, macOS Finder ve 7-Zip ile oluşturulmuş, Türkçe adlı montaj + parça arşivi | Kabul edilir; `.exe` eklenmiş arşiv reddedilir |
| Sahte uzantı | `.exe` → `.sldprt`, `.zip` → `.step` | finalize "içeriği türüyle uyuşmuyor" |
| iPhone / Android dosya seçici | Telefonda CAD dosyası seçmeyi dene | Dosya seçilebiliyor (iOS bazı CAD uzantılarını tanımayabilir) |
| Birden fazla dosya | 3 dosya | Kabul; 4. dosya istemcide reddedilir |
| Boyut limiti | 21 MB dosya | İstemcide ve sunucuda reddedilir |
| Yeniden adlandırılmış dosya | `.txt` → `.pdf` | finalize "içeriği türüyle uyuşmuyor" |
| Turnstile başarısızlığı | Secret'ı geçici `2x0000000000000000000000000000000AA` yap | "Güvenlik doğrulaması tamamlanamadı" |
| Tekrar gönderim | Başarıdan sonra tarayıcıda geri / ağ kesintisi | Aynı talep için ikinci kayıt yok |
| Resend başarısızlığı | `RESEND_API_KEY`'i geçici bozuk değer yap | Kullanıcı "kaydedildi" uyarısı görür; kayıt `notification_status=failed`; anahtar düzeltilince bakım görevi gönderir |
| Yetkisiz dosya erişimi | Storage nesnesinin public URL'sini dene; publishable key ile `quote_requests` sorgula | 400/404 ve boş/izin yok |
| Veritabanı kaydı | Table Editor → `quote_requests`, `quote_attachments` | Alanlar ve orijinal dosya adları doğru |
| Hedef posta kutusu | `foramak@foramaklazer.com` | E-posta gelen kutusuna ulaşır (spam değil) |

Yetkisiz erişim kontrolü için örnek (publishable key ile, tarayıcı konsolu):
```js
fetch('https://<ref>.supabase.co/rest/v1/quote_requests?select=*', { headers: { apikey: 'sb_publishable_…' } }).then(r => r.status)
// beklenen: 401/403 veya boş dizi — kayıt dönmemeli
```

---

## 5. Günlük işletim

### Kayıt ve bildirim durumunu ayrı ayrı kontrol etme

Supabase Dashboard → SQL Editor'da aşağıdaki salt okunur sorgular kullanılabilir. Talebin kaydı
(`status`) ile e-posta bildirimi (`notification_status`) birbirinden bağımsızdır: bildirim
başarısız olsa da kayıt `received` kalır ve kullanıcı başarı sayfasına yönlendirilir.

```sql
-- Son talepler: kayıt durumu ve bildirim durumu yan yana
select reference_no, status, notification_status, notification_attempts,
       received_at, company_name
  from public.quote_requests
 order by created_at desc
 limit 20;

-- Kayıt tamam ama e-posta gitmemiş talepler (bakım görevi 15 dakikada bir tekrar dener)
select reference_no, notification_status, notification_attempts, notification_last_error
  from public.quote_requests
 where status = 'received' and notification_status <> 'sent';

-- Bir talebin dosyaları: veritabanı kaydı ile Storage'daki gerçek dosya karşılaştırması
select a.original_filename, a.file_size, a.content_type,
       (o.id is not null) as storage_da_var, (o.metadata->>'size')::bigint as storage_boyutu
  from public.quote_attachments a
  join public.quote_requests q on q.id = a.quote_request_id
  left join storage.objects o on o.bucket_id = 'quote-attachments' and o.name = a.storage_path
 where q.reference_no = 'FOR-2026-0001';
```

- Dosyaların kendisi: Storage → `quote-attachments` → `requests/<talep id>/`.
- E-postanın Resend tarafından kabulü `notification_status = 'sent'` ve `notification_provider_id` ile;
  gelen kutusuna teslimi Resend → Emails ekranından doğrulanır.
- Başarı sayfası (`/teklif-alindi`) referansı yalnızca ziyaretçinin kendi sekmesinde, 30 dakika
  süreyle `sessionStorage`'da tutar; kişisel veri saklamaz ve sunucuya sorgu yapmaz.

- **Talepler:** Table Editor → `quote_requests` (status = `received`).
- **Dosyalar:** Storage → `quote-attachments` → `requests/<talep id>/`. Dosya adları UUID'dir;
  orijinal adlar `quote_attachments.original_filename`'dadır. Dosyaları güncel bir görüntüleyiciyle açın;
  sunucu dosyaları hiçbir zaman çalıştırmaz ama içerikleri yine de güvenilmez kabul edilmelidir.
- **E-posta durumu:** `sent` = Resend kabul etti (gelen kutusu garantisi değil — Resend → Emails
  ekranından teslim durumu izlenir). İlk haftalarda tabloyu da kontrol edin.
- **Gönderilemeyen bildirimler:**
  ```sql
  select reference_no, company_name, notification_status, notification_attempts, notification_last_error
    from public.quote_requests
   where status = 'received' and notification_status <> 'sent';
  ```
  Bakım görevi 8 denemeye kadar otomatik dener. Elle yeniden başlatmak için:
  ```sql
  update public.quote_requests set notification_status = 'pending', notification_attempts = 0
   where reference_no = 'FOR-2026-0001';
  ```
- **İptal:** `update public.quote_requests set status = 'cancelled' where reference_no = '…';`
- **Limit / format değiştirme:** `supabase/functions/_shared/quote-config.ts` → fonksiyonları yeniden deploy edin.
  Yeni bir uzantı eklenirse `quote_attachments.storage_path` kısıtı da yeni bir migration ile genişletilmeli
  ve `teklif-al.html`'deki `accept` listesine eklenmelidir.
  Frontend limitleri GET `/quote-init`'ten okur; bucket bir sonraki bakım çalışmasında eşitlenir.
  (`teklif-al.html`'deki ipucu metni JS yüklenene kadar görünen varsayılandır.)
- **Hizmet listesi:** Forma yeni `<option>` eklenirse aynı değeri `quote-config.ts` → `serviceTypes`'a ekleyin.
  Formda şu an 8 seçenek var; sitedeki 10 hizmetten Modüler Tesisat, Arıtma Sistemleri ve
  Metal İşleme ayrı seçenek olarak yok.

---

## 6. KVKK ve veri aktarımı — hukuki değerlendirme gereken konular

Bu bölüm hukuki metin değildir; avukat / KVKK danışmanına sorulacak noktaları listeler.

- **Aydınlatma metni yayında değil:** Taslak metin yerel proje klasöründe hazır, ancak şirket unvanı,
  saklama süreleri, yurt dışı aktarım mekanizmaları ve elektronik başvuru yöntemleri kesinleşmediği için
  yayımlanmadı. Formdaki bağlantı `href="#"`; onaylı metin yayımlanınca `privacyNoticeUrl` ile bağlanır.
- **Onay kutusu ifadesi:** Zorunlu kutu "Kişisel verilerimin … işlenmesini kabul ediyorum … Aydınlatma
  Metni'ni okudum ve onaylıyorum" diyor; aydınlatma (bilgilendirme) ile açık rızayı tek, zorunlu kutuda
  birleştiriyor. Taslak aydınlatma metni ise işlemeyi KVKK m.5/2 hukuki sebeplerine dayandırıyor.
  Avukat kararı gereken iki seçenek:
  1. Açık rıza gerekmiyorsa: kutu yalnızca aydınlatmanın okunduğunu belirtir (ifadeyi avukat belirler).
  2. Belirli bir işlem (ör. m.9 kapsamında rızaya dayalı aktarım) için açık rıza gerekiyorsa: aydınlatma
     bilgisinden **ayrı**, işaretsiz gelen ayrı bir kutu ve ayrı kayıt alanı gerekir.
  Mevcut veritabanı yalnızca `kvkk_acknowledged_at` (aydınlatma onay zamanı) tutar; açık rıza alanı
  yoktur. Seçenek 1 veritabanını etkilemez. Seçenek 2 için yeni, boş bırakılabilir bir sütun
  (ör. `explicit_consent_at`) ve metin sürümü alanı eklenmeli; mevcut kayıtlar etkilenmez.
- **Yurt dışına aktarım:** Veriler Türkiye dışındaki hizmet sağlayıcılarda işlenir:
  - Supabase (veritabanı + teknik çizimler; seçilen bölge, ör. Frankfurt)
  - Resend (bildirim e-postası içeriği: ad, telefon, e-posta, proje bilgisi)
  - Cloudflare Turnstile (ziyaretçi IP / tarayıcı sinyalleri)
  KVKK m.9 kapsamında hangi aktarım mekanizmasının (yeterlilik, standart sözleşme ve Kurul'a
  bildirim, vb.) kullanılacağı ve sağlayıcıların sözleşme/DPA metinleri değerlendirilmeli.
- **Saklama süresi:** Tamamlanmış talepler ve çizimler şu an süresiz saklanır (yalnızca tamamlanmamış
  talepler 24 saatte silinir). Saklama/imha süresi belirlenince otomatik silme eklenebilir.
- **VERBİS** kayıt yükümlülüğü ve veri sorumlusu bilgileri kontrol edilmeli.
- **Ticari sır:** Müşteri çizimleri gizli olabilir; panel erişimi olan kişiler sınırlı tutulmalı,
  tüm hesaplarda iki adımlı doğrulama açık olmalı.
- **Ham IP saklanmaz:** Hız sınırı için yalnızca tuzlu özet tutulur ve 2 gün içinde silinir.

Bu değerlendirme tamamlanmadan `QUOTE_SUBMISSIONS_ENABLED` ve `submissionsEnabled` açılmamalıdır.

---

## 7. Ücretsiz plan riskleri

- **Supabase Free projeleri** düşük etkinlikte yaklaşık 7 gün sonra **duraklatılır**
  (Supabase SSS). Duraklatılmış projede form gönderimi hata verir; kullanıcı telefon/e-postaya
  yönlendirilir ama talep kaydedilmez. Zamanlanmış bakım görevi duraklatmayı **garanti olarak
  engellemez**. Kesintisiz çalışma gerekiyorsa Pro plan değerlendirilmeli (ücretli planlar
  hareketsizlik nedeniyle duraklatılmaz).
- **Depolama:** Free planın dosya depolama kotası sınırlıdır (güncel değer için supabase.com/pricing).
  Talep başına en fazla 40 MB; saklama süresi belirlenmezse kota dolabilir.
- **Yedekleme:** Free plandaki yedekleme seçeneklerini fiyat sayfasından doğrulayın; önemli
  talepler için periyodik dışa aktarma düşünülebilir.
- **Resend Free:** aylık / günlük gönderim limitleri vardır (güncel değerleri Resend panelinden kontrol edin).
- **Vercel:** Hobby planı ticari olmayan kullanım içindir; sitenin barındığı planı kontrol edin.

---

## 8. Production'a geçiş kontrol listesi

- [ ] KVKK aydınlatma metni ve yurt dışı aktarım değerlendirmesi tamamlandı, bağlantı gerçek sayfaya gidiyor
- [ ] Aşama 3 testlerinin tamamı geçti, test kayıtları silindi
- [ ] Secrets production değerlerinde (`QUOTE_ENVIRONMENT=production`, gerçek Turnstile secret)
- [ ] `QUOTE_SUBMISSIONS_ENABLED=true`
- [ ] Onaylı KVKK aydınlatma metni sitede yayında; onay kutusu ifadesi avukat tarafından onaylandı
- [ ] Cloudflare Turnstile widget hostname listesinde `www.foramak.com` ve `foramak.com` var
- [ ] `js/quote-config.js` → `production`: `turnstileSiteKey` (gerçek site key), `privacyNoticeUrl`
      (onaylı metnin adresi) dolu, `submissionsEnabled: true`
- [ ] Site deploy edildi; `https://www.foramak.com/supabase/config.toml` **404** dönüyor (`.vercelignore` çalışıyor)
- [ ] Canlıda sahte veriyle bir uçtan uca deneme, e-posta hedef kutuya ulaştı
