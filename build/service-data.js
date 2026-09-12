'use strict';

/**
 * Hizmet detay sayfaları — v2 component sistemi için içerik/config verisi.
 * Şema: { slug, metaDescription, serviceNumber, breadcrumbLabel, title,
 *         heroDesc, heroImage, heroSpecs[], overviewImage, overviewParagraphs[],
 *         overviewCaption[2], tags[], technicalSpecs[], materialsLabel,
 *         materialsTitle, materials[4], industriesDesc, industries[4],
 *         ctaTitle, ctaDescription }
 *
 * Bu dosyayı düzenleyip `npm run build:services` çalıştırarak tüm hizmet
 * sayfalarını yeniden üretebilirsiniz — içerik burada, görünüm
 * build/service-template.js + css/style.css içindeki v2 componentlerinde.
 */

const SERVICES = [
    {
        slug: 'sac-lazer-kesim',
        metaDescription: 'Foramak Makine; sac metal gruplarında DXF/DWG teknik çizime göre hassas lazer kesim hizmeti sunar. Çelik, paslanmaz ve alüminyum sac kesiminde İvedik OSB merkezli üretim.',
        serviceNumber: '01',
        breadcrumbLabel: 'Sac Lazer Kesim',
        title: 'Sac Lazer Kesim',
        heroDesc: 'DXF, DWG ve PDF teknik çizime dayalı olarak farklı kalınlık ve malzeme gruplarında hassas sac kesimi. Kesim sonrası büküm ve kaynak süreçlerine hazır teslim.',
        heroImage: 'assets/images/hizmetlerimiz/sac_kesim.png',
        heroSpecs: [
            { icon: 'layers', label: 'Malzeme Grupları', value: 'Çelik · Paslanmaz · Alüminyum' },
            { icon: 'ruler', label: 'Sac Kalınlığı', value: '0,5 – 20 mm' },
            { icon: 'blueprint', label: 'Çizim Formatı', value: 'DXF · DWG · PDF' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Endüstriyel İmalat' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/sac_kesim.png',
        overviewParagraphs: [
            'Sac lazer kesim; DXF, DWG ve PDF formatında teknik çizime dayalı olarak farklı kalınlık ve malzeme gruplarında hassas parça üretimini kapsar. Foramak Makine; kesim sonrası malzemeyi büküm ve kaynak süreçlerine hazır hale getirerek entegre üretim sürecini destekler.',
            'Farklı sac kalınlıklarında (0,5 mm — 20 mm arası çelik, paslanmaz ve alüminyum gruplarda) teknik toleranslarda kesim yapılmaktadır. Kesim planlaması (nesting) proje ihtiyacına göre malzeme verimliliği esas alınarak yapılır.'
        ],
        overviewCaption: ['HASSAS KESİM,', 'GÜVENİLİR ÜRETİM.'],
        tags: ['DXF / DWG Uyumlu', 'Hassas Kesim', 'Farklı Kalınlıklar', 'Nesting Planlama'],
        technicalSpecs: [
            { icon: 'materialA', label: 'Çelik Sac', value: '0,5 – 20 mm' },
            { icon: 'materialB', label: 'Paslanmaz Sac', value: '0,5 – 12 mm' },
            { icon: 'hexagon', label: 'Alüminyum Sac', value: '0,5 – 10 mm' },
            { icon: 'blueprint', label: 'Teknik Çizim Formatı', value: 'DXF · DWG · PDF' }
        ],
        materialsLabel: '03 — MALZEME GRUPLARI',
        materialsTitle: 'Kesim Yapılan Malzemeler',
        materials: [
            { icon: 'sheet', bgWord: 'DKP', title: 'DKP Sac', desc: 'Soğuk haddelenmiş düşük karbonlu çelik sac.' },
            { icon: 'materialA', bgWord: 'ZN', title: 'Galvanizli Sac', desc: 'Korozyon dirençli çinko kaplı çelik sac.' },
            { icon: 'materialB', bgWord: '304', title: 'Paslanmaz Sac', desc: 'AISI 304 / 316 paslanmaz çelik sac grubu.' },
            { icon: 'hexagon', bgWord: 'ALU', title: 'Alüminyum Sac', desc: 'Hafif yapı uygulamaları için alüminyum sac.' }
        ],
        industriesDesc: 'Lazer kesim çözümlerimiz farklı sektörlerin teknik üretim ihtiyaçlarına uygun şekilde planlanır.',
        industries: [
            { icon: 'gear', title: 'Makine İmalatı', desc: 'Makine gövdesi, muhafaza ve taşıyıcı elemanları için hassas ölçülerde sac parça üretimi.' },
            { icon: 'ibeam', title: 'Metal Konstrüksiyon', desc: 'Çelik konstrüksiyon projelerinde birleşim plakası, bağlantı elemanı ve yapısal parça kesimi.' },
            { icon: 'factory', title: 'Endüstriyel Tesisat', desc: 'Tesisat sistemleri için flanş, plaka ve bağlantı elemanı üretimi.' },
            { icon: 'target', title: 'Özel Parça', desc: 'Prototip ve küçük seri özel parça üretiminde teknik çizim bazlı kesim.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'boru-profil-lazer-kesim',
        metaDescription: 'Foramak Makine; 3 kW boru lazer kesim altyapısıyla boru ve profil gruplarında ölçülü kesim, delik, kanal ve form uygulamaları için teknik üretim desteği sunar.',
        serviceNumber: '02',
        breadcrumbLabel: 'Boru / Profil Lazer Kesim',
        title: 'Boru / Profil Lazer Kesim',
        heroTitleLines: ['Boru / Profil', 'Lazer Kesim'],
        heroDesc: 'Yuvarlak boru, kare ve dikdörtgen profil gruplarında 3 kW lazer altyapısıyla ölçülü kesim, delik ve kanal uygulamaları.',
        heroImage: 'assets/images/hizmetlerimiz/Boru  Profil Lazer Kesim.png',
        heroSpecs: [
            { icon: 'pipe', label: 'Malzeme Grupları', value: 'Çelik · Paslanmaz · Alüminyum' },
            { icon: 'ruler', label: 'Lazer Gücü', value: '3 kW' },
            { icon: 'profile', label: 'Kesit Türleri', value: 'Yuvarlak · Kare · Dikdörtgen' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Tesisat ve Konstrüksiyon' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/Boru  Profil Lazer Kesim.png',
        overviewParagraphs: [
            'Boru ve profil lazer kesim; yuvarlak kesitli borular, kare ve dikdörtgen profiller ile özel profil gruplarında boyuna kesim, delik açma, kanal formu ve açılı kesim uygulamalarını kapsar. 3 kW boru lazer kesim altyapısı farklı kesit boyutlarında teknik uygulamalara imkân tanır.',
            'Tesisat boru bağlantıları, çelik yapı profilleri, makine çerçeve elemanları ve endüstriyel konstrüksiyon projeleri başlıca uygulama alanlarıdır. Teknik çizim (DXF/DWG) ile entegre üretim süreci takibi yapılmaktadır.'
        ],
        overviewCaption: ['DOĞRU KESİT,', 'DOĞRU ÜRETİM.'],
        tags: ['3 kW Boru Lazer', 'Açılı Kesim', 'Delik / Kanal', 'DXF Uyumlu'],
        technicalSpecs: [
            { icon: 'ruler', label: 'Lazer Gücü', value: '3 kW' },
            { icon: 'pipe', label: 'Yuvarlak Boru', value: 'Ø 20 – 220 mm' },
            { icon: 'profile', label: 'Kare / Dikdörtgen', value: '20×20 – 150×150 mm' },
            { icon: 'blueprint', label: 'Çalışma Uzunluğu', value: "6.000 mm'ye kadar" }
        ],
        materialsLabel: '03 — İŞLENEN GRUPLAR',
        materialsTitle: 'İşlenen Boru ve Profil Grupları',
        materials: [
            { icon: 'pipe', bgWord: 'BORU', title: 'Çelik Boru', desc: 'Siyah çelik ve galvanizli yuvarlak boru.' },
            { icon: 'profile', bgWord: 'PROFİL', title: 'Kare / Dikdörtgen Profil', desc: 'Çelik ve paslanmaz kutu profil.' },
            { icon: 'materialB', bgWord: '304', title: 'Paslanmaz Boru', desc: 'AISI 304 / 316 paslanmaz boru kesimi.' },
            { icon: 'hexagon', bgWord: 'ALU', title: 'Alüminyum Profil', desc: 'Hafif yapı için alüminyum profil kesimi.' }
        ],
        industriesDesc: 'Boru ve profil kesim çözümlerimiz farklı sektörlerin tesisat ve konstrüksiyon ihtiyaçlarına uygun planlanır.',
        industries: [
            { icon: 'factory', title: 'Endüstriyel Tesisat', desc: 'Boru hattı bileşenleri, flanş ağzı açma ve tesisat için bağlantı elemanı üretimi.' },
            { icon: 'ibeam', title: 'Çelik Yapı', desc: 'Konstrüksiyon projelerinde profil kesimi, delik formu ve birleşim hazırlığı.' },
            { icon: 'gear', title: 'Makine Çerçevesi', desc: 'Makine kasası ve çerçeve elemanlarında profil kesim ve birleşim hazırlığı.' },
            { icon: 'water', title: 'Arıtma Sistemleri', desc: 'Arıtma tesis boru bağlantıları için teknik boru kesim ve form uygulamaları.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'sac-bukum',
        metaDescription: 'Foramak Makine; teknik ölçülere göre sac malzemelerin büküm işlemleri, proje ihtiyacına uygun form ve açı çalışmaları. Lazer kesim entegrasyonu ile entegre üretim.',
        serviceNumber: '03',
        breadcrumbLabel: 'Sac Büküm',
        title: 'Sac Büküm',
        heroDesc: 'Teknik çizime bağlı olarak farklı sac kalınlıklarında form, açı ve kenar büküm uygulamaları; CNC pres fren ile boyutsal tutarlılık.',
        heroImage: 'assets/images/hizmetlerimiz/Sac Büküm.png',
        heroSpecs: [
            { icon: 'layers', label: 'Malzeme Grupları', value: 'Çelik · Paslanmaz · Alüminyum' },
            { icon: 'ruler', label: 'Sac Kalınlığı', value: '0,5 – 12 mm' },
            { icon: 'gear', label: 'Yöntem', value: 'CNC Pres Fren' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Entegre Kesim + Büküm' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/Sac Büküm.png',
        overviewParagraphs: [
            'Sac büküm; teknik çizime veya proje ihtiyacına bağlı olarak farklı sac kalınlıklarında ve malzeme gruplarında form, açı ve kenar büküm uygulamalarını kapsar. Büküm işlemi CNC pres fren ekipmanıyla gerçekleştirilir; tekrar üretimde boyutsal tutarlılık sağlanır.',
            'Lazer kesim ile birlikte entegre üretim sürecinde (kesim → büküm) parça yönetimi Foramak Makine tarafından yürütülür. Sac parçaların tek tedarikçiden kesim ve büküm hizmetiyle alınması proje takibini kolaylaştırır.'
        ],
        overviewCaption: ['DOĞRU FORM,', 'DOĞRU ÜRETİM.'],
        tags: ['CNC Pres Fren', 'Teknik Ölçü', 'Kesim + Büküm Entegre', 'Farklı Malzeme'],
        technicalSpecs: [
            { icon: 'materialA', label: 'Çelik Sac Büküm', value: '0,5 – 12 mm' },
            { icon: 'materialB', label: 'Paslanmaz Büküm', value: '0,5 – 6 mm' },
            { icon: 'hexagon', label: 'Alüminyum Büküm', value: '0,5 – 8 mm' },
            { icon: 'check', label: 'Üretim Tipi', value: 'Tekil · Seri' }
        ],
        materialsLabel: '03 — MALZEME GRUPLARI',
        materialsTitle: 'Büküm Yapılan Malzemeler',
        materials: [
            { icon: 'sheet', bgWord: 'ST37', title: 'DKP / St37 Sac', desc: 'Genel imalat uygulamaları için çelik sac büküm.' },
            { icon: 'materialA', bgWord: 'ZN', title: 'Galvanizli Sac', desc: 'Korozyon dirençli, dış ortam uygulamaları için.' },
            { icon: 'materialB', bgWord: '304', title: 'Paslanmaz Sac', desc: 'Hijyenik ve korozyon dayanımlı uygulamalar.' },
            { icon: 'hexagon', bgWord: 'ALU', title: 'Alüminyum Sac', desc: 'Hafif yapı ve özel form uygulamaları.' }
        ],
        industriesDesc: 'Büküm çözümlerimiz farklı sektörlerin form ve montaj ihtiyaçlarına uygun şekilde planlanır.',
        industries: [
            { icon: 'gear', title: 'Muhafaza ve Gövde', desc: 'Makine ve ekipman muhafazaları, elektrik pano gövdeleri ve kanal kapak üretimi.' },
            { icon: 'ibeam', title: 'Konstrüksiyon Elemanı', desc: 'Çelik yapı ve endüstriyel konstrüksiyonlarda köşe ve birleşim elemanı üretimi.' },
            { icon: 'factory', title: 'Tesisat Elemanı', desc: 'Tesisat sistemleri için flanş, saplama tabanı ve kanal formu büküm uygulamaları.' },
            { icon: 'target', title: 'Özel Sac Parça', desc: 'Teknik çizim bazlı özel form büküm; prototipten küçük seriye üretim.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'kaynakli-imalat',
        metaDescription: 'Foramak Makine; paslanmaz, çelik ve alüminyum gruplarında MIG/TIG kaynaklı imalat ve montaj süreçlerinde teknik üretim desteği sunar. Ankara İvedik OSB.',
        serviceNumber: '04',
        breadcrumbLabel: 'Kaynaklı İmalat',
        title: 'Kaynaklı İmalat',
        heroDesc: 'Çelik, paslanmaz ve alüminyum malzeme gruplarında MIG/TIG kaynak teknolojileriyle birleştirme, konstrüksiyon ve montaj hazırlığı.',
        heroImage: 'assets/images/hizmetlerimiz/kaynaklı imalat.png',
        heroSpecs: [
            { icon: 'layers', label: 'Malzeme Grupları', value: 'Çelik · Paslanmaz · Alüminyum' },
            { icon: 'gear', label: 'Kaynak Yöntemi', value: 'MIG · TIG' },
            { icon: 'profile', label: 'Uygulama', value: 'Flanş ve Konstrüksiyon' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Endüstriyel Montaj' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/kaynaklı imalat.png',
        overviewParagraphs: [
            'Kaynaklı imalat; çelik, paslanmaz çelik ve alüminyum malzeme gruplarında MIG ve TIG kaynak teknolojileriyle parça birleştirme, konstrüksiyon ve montaj hazırlığı süreçlerini kapsar. Boru bağlantıları, flanş montajları, kaynaklı konstrüksiyon ve özel yapı elemanları üretiminde teknik destek sağlanmaktadır.',
            'Lazer kesim ve büküm süreçleriyle entegre olarak (kesim → büküm → kaynak) tek tedarikçiden tam parça teslimi mümkündür. Kaynak ağzı hazırlığı ve montaj kontrolü proje ihtiyacına göre yönetilir.'
        ],
        overviewCaption: ['SAĞLAM BİRLEŞİM,', 'GÜVENİLİR YAPI.'],
        tags: ['MIG Kaynak', 'TIG Kaynak', 'Flanş Montajı', 'Entegre Üretim'],
        technicalSpecs: [
            { icon: 'materialA', label: 'Çelik Kaynak', value: 'MIG / MAG' },
            { icon: 'materialB', label: 'Paslanmaz Kaynak', value: 'TIG / MIG' },
            { icon: 'hexagon', label: 'Alüminyum Kaynak', value: 'TIG' },
            { icon: 'check', label: 'Üretim Tipi', value: 'Tekil · Seri · Prototip' }
        ],
        materialsLabel: '03 — MALZEME GRUPLARI',
        materialsTitle: 'Kaynak Yapılan Malzeme Grupları',
        materials: [
            { icon: 'materialA', bgWord: 'ST52', title: 'Çelik / St37–St52', desc: 'Genel yapısal imalat için karbon çelik kaynak.' },
            { icon: 'materialB', bgWord: '304', title: 'Paslanmaz Çelik', desc: 'AISI 304 / 316 paslanmaz sac, boru ve profil kaynağı.' },
            { icon: 'hexagon', bgWord: 'ALU', title: 'Alüminyum', desc: 'TIG kaynak ile alüminyum sac ve profil birleştirme.' },
            { icon: 'layers', bgWord: 'MIX', title: 'Karma Malzeme', desc: 'Farklı malzeme gruplarının entegre kaynaklı birleştirmesi.' }
        ],
        industriesDesc: 'Kaynaklı imalat çözümlerimiz farklı sektörlerin montaj ve konstrüksiyon ihtiyaçlarına uygun planlanır.',
        industries: [
            { icon: 'pipe', title: 'Tesisat Boru Bağlantısı', desc: 'Endüstriyel ve arıtma sistemleri için boru kavşağı, flanş kaynağı ve kollektör imalatı.' },
            { icon: 'ibeam', title: 'Kaynaklı Konstrüksiyon', desc: 'Çelik taşıyıcı sistem, ekipman tabanı ve kaynaklı çerçeve imalatı.' },
            { icon: 'gear', title: 'Makine Parçası', desc: 'Makine gövde, muhafaza ve birleşim elemanlarında kaynaklı üretim ve montaj hazırlığı.' },
            { icon: 'target', title: 'Özel Yapı Elemanı', desc: 'Teknik çizim bazlı özel konstrüksiyon ve montaj elemanı kaynağı.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'paslanmaz-imalat',
        metaDescription: 'Foramak Makine; AISI 304, AISI 316 paslanmaz çelik sac, boru ve profil gruplarında kesim, büküm ve kaynaklı imalat. Gıda, kimya, arıtma ve endüstriyel tesis uygulamaları.',
        serviceNumber: '05',
        breadcrumbLabel: 'Paslanmaz İmalat',
        title: 'Paslanmaz İmalat',
        heroDesc: 'AISI 304, AISI 316 ve türevleri paslanmaz çelik gruplarında hijyenik, dayanıklı ve korozyon dirençli üretim desteği.',
        heroImage: 'assets/images/hizmetlerimiz/paslanmaz imalat.png',
        heroTechPanel: false,
        heroSpecs: [
            { icon: 'materialB', label: 'Malzeme Grupları', value: 'AISI 304 · AISI 316 / 316L' },
            { icon: 'ruler', label: 'Sac Kalınlığı', value: '0,5 – 12 mm' },
            { icon: 'gear', label: 'Kaynak Yöntemi', value: 'TIG / MIG' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Endüstriyel İmalat' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/paslanmaz imalat.png',
        overviewParagraphs: [
            'Paslanmaz çelik imalat; AISI 304, AISI 316, 316L ve türevleri malzeme gruplarında lazer kesim, CNC büküm ve TIG/MIG kaynak süreçlerini entegre biçimde kapsar. Gıda, kimya, ilaç, arıtma ve endüstriyel tesis uygulamalarına uygun hijyenik üretim koşullarında çalışılmaktadır.',
            'Paslanmaz sac, boru, profil ve özel kesit gruplarında projeye özgü parça üretimi yapılmaktadır; su deposu, tank, reaktör, eşanjör, kollektör ve tesisat gibi ürün grupları da aynı üretim akışı içinde değerlendirilebilir. Yüzey kalitesi (2B, BA, fırçalı) ve boyutsal tolerans proje ihtiyacına göre belirlenir.'
        ],
        overviewCaption: ['PASLANMAZ ÇÖZÜMLER,', 'DAHA TEMİZ BİR YARIN İÇİN.'],
        tags: ['AISI 304', 'AISI 316 / 316L', 'TIG Kaynak', 'Hijyenik Üretim'],
        technicalSpecs: [
            { icon: 'ruler', label: 'Sac Kalınlığı', value: '0,5 – 12 mm' },
            { icon: 'pipe', label: 'Boru Çapı', value: 'Ø 21,3 – 219,1 mm' },
            { icon: 'check', label: 'Yüzey Kalitesi', value: '2B · BA · Fırçalı' },
            { icon: 'gear', label: 'Kaynak Yöntemi', value: 'TIG · MIG' }
        ],
        materialsLabel: '03 — MALZEME GRUPLARI',
        materialsTitle: 'İşlenen Paslanmaz Çelik Grupları',
        materials: [
            { icon: 'materialA', bgWord: '304', title: 'AISI 304', desc: 'Genel paslanmaz uygulamaları için en yaygın grup.' },
            { icon: 'materialB', bgWord: '316', title: 'AISI 316 / 316L', desc: 'Yüksek korozyon direnci; kimya ve denizcilik uygulamaları.' },
            { icon: 'pipe', bgWord: 'BORU', title: 'Paslanmaz Boru', desc: 'Tesisat ve proses hatları için paslanmaz boru.' },
            { icon: 'profile', bgWord: 'PROFİL', title: 'Paslanmaz Profil', desc: 'Kare ve dikdörtgen kesitli paslanmaz kutu profil.' }
        ],
        productGroups: {
            label: 'ÜRÜN VE ÇÖZÜM GRUPLARI',
            title: 'Paslanmaz İmalat Ürün Grupları',
            items: [
                { icon: 'water', title: 'Paslanmaz Su Deposu', desc: 'İçme ve proses suyu depolama ihtiyaçları için hijyenik paslanmaz su deposu imalatı.' },
                { icon: 'food', title: 'Paslanmaz Gıda Tankları', desc: 'Gıda üretiminde hijyen şartlarına uygun paslanmaz tank ve depolama ekipmanı üretimi.' },
                { icon: 'gear', title: 'Paslanmaz Reaktör', desc: 'Kimya ve proses hatlarında kullanılan paslanmaz reaktör gövdesi ve ekipman imalatı.' },
                { icon: 'pipe', title: 'Paslanmaz Borulu Eşanjör', desc: 'Isı transferi uygulamaları için paslanmaz borulu eşanjör imalatı ve montaja hazır üretim.' },
                { icon: 'profile', title: 'Paslanmaz Kollektör', desc: 'Tesisat hatlarında dağıtım ve toplama işlevi gören paslanmaz kollektör üretimi.' },
                { icon: 'materialB', title: 'Paslanmaz Tesisat', desc: 'Boru, flanş ve bağlantı elemanlarıyla proje bazlı paslanmaz tesisat hattı imalatı.' },
                { icon: 'target', title: 'Özel Üretim Makineler', desc: 'Teknik çizime dayalı, proje ihtiyacına özel paslanmaz makine ve ekipman parçası üretimi.' },
                { icon: 'check', title: 'Paslanmaz Tortu Tutucu', desc: 'Proses hatlarında partikül ve tortu ayrıştırma amaçlı paslanmaz ekipman imalatı.' },
                { icon: 'factory', title: 'Paslanmaz Endüstriyel Tesisler', desc: 'Endüstriyel tesis içi paslanmaz konstrüksiyon, ekipman ve montaj parçası üretimi.' }
            ]
        },
        industriesDesc: 'Paslanmaz imalat çözümlerimiz, yüksek hijyen ve dayanıklılık gerektiren birçok sektörde güvenle tercih edilmektedir.',
        industries: [
            { icon: 'water', title: 'Arıtma Sistemleri', desc: 'Su arıtma, gaz arıtma ve proses sistemleri için paslanmaz tesisat ve ekipman üretimi.' },
            { icon: 'food', title: 'Gıda ve İlaç', desc: 'Hijyenik üretim gerektiren gıda ve ilaç tesisleri için paslanmaz parça ve ekipman.' },
            { icon: 'food', title: 'Kimya Endüstrisi', desc: 'Korozyona dayanımlı ekipman ve tesisat için AISI 316/316L malzeme grubu üretimi.' },
            { icon: 'factory', title: 'Endüstriyel Tesis', desc: 'Genel endüstriyel tesislerde paslanmaz konstrüksiyon ve ekipman parçası üretimi.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'aluminyum-imalat',
        metaDescription: 'Foramak Makine; alüminyum sac, profil ve boru gruplarında lazer kesim, büküm ve kaynaklı imalat. Hafif yapı uygulamaları ve proje bazlı özel parça üretimi.',
        serviceNumber: '06',
        breadcrumbLabel: 'Alüminyum İmalat',
        title: 'Alüminyum İmalat',
        heroDesc: 'Alüminyum sac, profil ve boru gruplarında lazer kesim, CNC büküm ve TIG kaynak süreçleriyle hafif ve dayanıklı üretim.',
        heroImage: 'assets/images/hizmetlerimiz/alüminyum imalat.png',
        heroSpecs: [
            { icon: 'hexagon', label: 'Malzeme Grupları', value: '1050 · 5052 · 6061' },
            { icon: 'ruler', label: 'Sac Kalınlığı', value: '0,5 – 10 mm' },
            { icon: 'gear', label: 'Kaynak Yöntemi', value: 'TIG' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Hafif Konstrüksiyon' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/alüminyum imalat.png',
        overviewParagraphs: [
            'Alüminyum imalat; alüminyum sac, profil ve boru gruplarında lazer kesim, CNC büküm ve TIG kaynak süreçlerini kapsar. Düşük ağırlık gereksinimine sahip mühendislik projeleri, taşıt aksamları, endüstriyel ekipman ve özel konstrüksiyon uygulamaları başlıca kullanım alanlarıdır.',
            'Alüminyum, çelik ve paslanmaz imalatla entegre biçimde aynı üretim sürecinde yönetilebilir; karma malzeme projelerde tek tedarikçi avantajı sağlanır.'
        ],
        overviewCaption: ['HAFİF YAPI,', 'GÜÇLÜ ÇÖZÜM.'],
        tags: ['Alüminyum Sac', 'Alüminyum Profil', 'TIG Kaynak', 'Hafif Konstrüksiyon'],
        technicalSpecs: [
            { icon: 'ruler', label: 'Sac Kalınlığı', value: '0,5 – 10 mm' },
            { icon: 'profile', label: 'Profil Kesiti', value: 'Kare · Dikdörtgen · L' },
            { icon: 'gear', label: 'Kaynak Yöntemi', value: 'TIG' },
            { icon: 'check', label: 'Üretim Tipi', value: 'Tekil · Seri · Prototip' }
        ],
        materialsLabel: '03 — MALZEME GRUPLARI',
        materialsTitle: 'İşlenen Alüminyum Grupları',
        materials: [
            { icon: 'sheet', bgWord: '1050', title: 'Alüminyum Sac', desc: '1050, 5052, 6061 serisi alüminyum sac.' },
            { icon: 'profile', bgWord: 'PROFİL', title: 'Alüminyum Kutu Profil', desc: 'Kare ve dikdörtgen kesitli alüminyum profil.' },
            { icon: 'pipe', bgWord: 'BORU', title: 'Alüminyum Boru', desc: 'Yuvarlak kesitli alüminyum boru kesim.' },
            { icon: 'hexagon', bgWord: 'ÖZEL', title: 'Özel Alüminyum Kesit', desc: 'Proje bazlı özel alüminyum ekstrüzyon ve kesit.' }
        ],
        industriesDesc: 'Alüminyum imalat çözümlerimiz hafif yapı gerektiren birçok sektörün ihtiyacına uygun şekilde planlanır.',
        industries: [
            { icon: 'ibeam', title: 'Hafif Konstrüksiyon', desc: 'Ağırlık kısıtı olan taşıma sistemleri ve platform yapıları için alüminyum konstrüksiyon.' },
            { icon: 'gear', title: 'Makine Aksamı', desc: 'Endüstriyel makine kapağı, muhafaza ve gövde elemanlarında alüminyum parça üretimi.' },
            { icon: 'target', title: 'Özel Panel', desc: 'Teknik çizim bazlı alüminyum panel, çerçeve ve özel form parça üretimi.' },
            { icon: 'check', title: 'Prototip Üretim', desc: 'Mühendislik projeleri için alüminyum prototip parça ve küçük seri üretim desteği.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'metal-isleme',
        metaDescription: 'Foramak Makine; farklı metal gruplarında kesim, delme, form verme ve yüzey hazırlama süreçlerine yönelik teknik işleme çözümleri. Proje gereksinimlerine göre işlem adımları planlanır.',
        serviceNumber: '07',
        breadcrumbLabel: 'Metal İşleme',
        title: 'Metal İşleme',
        heroDesc: 'Çelik, paslanmaz ve alüminyum gruplarında kesim, delme, form verme ve yüzey hazırlama süreçlerini kapsayan genel teknik işleme desteği.',
        heroImage: 'assets/images/hizmetlerimiz/metal işleme.png',
        heroSpecs: [
            { icon: 'layers', label: 'Malzeme Grupları', value: 'Çelik · Paslanmaz · Alüminyum' },
            { icon: 'blueprint', label: 'Çizim / Numune', value: 'DXF · DWG · PDF' },
            { icon: 'gear', label: 'İşlem Adımları', value: 'Kesim · Delme · Form' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Genel Endüstriyel İşleme' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/metal işleme.png',
        overviewParagraphs: [
            'Metal işleme; çelik, paslanmaz çelik ve alüminyum malzeme gruplarında lazer kesim, delme, form verme ve yüzey hazırlama süreçlerini kapsayan genel teknik üretim desteğidir. Proje gereksinimlerine göre işlem adımları belirlenir ve üretim süreci planlanır.',
            'Teknik çizim veya numune bazlı çalışma kabul edilmektedir. Lazer kesim altyapısı ve büküm ekipmanları ile entegre işleme süreci yönetilmektedir.'
        ],
        overviewCaption: ['HER METALDE,', 'TEKNİK ÇÖZÜM.'],
        tags: ['Çelik İşleme', 'Paslanmaz İşleme', 'Alüminyum İşleme', 'Proje Bazlı'],
        technicalSpecs: [
            { icon: 'sheet', label: 'Lazer Kesim', value: 'Sac ve Boru/Profil' },
            { icon: 'ruler', label: 'Delme / Kanal', value: 'Lazer ve Mekanik' },
            { icon: 'gear', label: 'Form Verme', value: 'CNC Büküm' },
            { icon: 'check', label: 'Kaynak', value: 'MIG · TIG' }
        ],
        materialsLabel: '03 — İŞLENEN MALZEMELER',
        materialsTitle: 'Metal Grupları',
        materials: [
            { icon: 'materialA', bgWord: 'ST37', title: 'Karbon Çelik', desc: 'DKP, St37, St52 sac, boru ve profil grubu.' },
            { icon: 'materialB', bgWord: '304', title: 'Paslanmaz Çelik', desc: 'AISI 304 / 316 sac, boru ve profil işleme.' },
            { icon: 'hexagon', bgWord: 'ALU', title: 'Alüminyum', desc: 'Alüminyum sac, profil ve boru işleme.' },
            { icon: 'sheet', bgWord: 'ZN', title: 'Galvanizli Sac', desc: 'Korozyon korumalı çelik sac işleme.' }
        ],
        industriesDesc: 'Metal işleme çözümlerimiz farklı sektörlerin genel üretim ve bakım ihtiyaçlarına uygun şekilde planlanır.',
        industries: [
            { icon: 'factory', title: 'Sanayi Ekipmanı', desc: 'Genel sanayi ekipman parçaları, makine aksamı ve yedek parça üretimi.' },
            { icon: 'ibeam', title: 'Konstrüksiyon Parçası', desc: 'Çelik konstrüksiyon için birleşim plakası, takviye elemanı ve köşe bağlantısı üretimi.' },
            { icon: 'pipe', title: 'Tesisat Bileşeni', desc: 'Boru ve tesisat sistemleri için flanş, destek ve bağlantı elemanı işleme.' },
            { icon: 'check', title: 'Yedek Parça', desc: 'Hasar gören veya ömrünü tamamlamış metal parça için numune bazlı yeniden üretim.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'ozel-proje-imalati',
        metaDescription: 'Foramak Makine; DXF/DWG teknik çizime dayalı proje bazlı özel parça ve konstrüksiyon üretimi. Malzeme ve yöntem projeye göre planlanır; prototipten küçük seriye üretim.',
        serviceNumber: '08',
        breadcrumbLabel: 'Özel Proje İmalatı',
        title: 'Özel Proje İmalatı',
        heroDesc: 'Teknik çizime veya numuneye dayalı olarak proje bazında özel parça, konstrüksiyon elemanı ve prototip üretimi.',
        heroImage: 'assets/images/hizmetlerimiz/özel proje imalat.png',
        heroSpecs: [
            { icon: 'blueprint', label: 'Teknik Çizim', value: 'DXF · DWG · PDF' },
            { icon: 'layers', label: 'Malzeme Grupları', value: 'Çelik · Paslanmaz · Alüminyum' },
            { icon: 'gear', label: 'Üretim Yöntemi', value: 'Kesim · Büküm · Kaynak' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Prototip ve Küçük Seri' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/özel proje imalat.png',
        overviewParagraphs: [
            'Özel proje imalatı; DXF, DWG veya PDF formatında teknik çizime dayalı olarak proje bazında özel parça, konstrüksiyon elemanı ve entegre montaj parçası üretimini kapsar. Malzeme grubu (çelik, paslanmaz, alüminyum), kalınlık ve üretim yöntemi (kesim, büküm, kaynak) projeye göre belirlenir.',
            'Teknik çizim olmayan durumlarda numune veya sözlü teknik tanım bazlı çalışma değerlendirilebilir. Prototip, küçük seri ve tek parça üretimde teknik danışmanlık dahilinde üretim süreci yönetilir.'
        ],
        overviewCaption: ['PROJENİZE ÖZEL,', 'MÜHENDİSLİK ÇÖZÜMÜ.'],
        tags: ['DXF / DWG / PDF', 'Prototip', 'Küçük Seri', 'Teknik Danışmanlık'],
        technicalSpecs: [
            { icon: 'blueprint', label: 'Teknik Çizim', value: 'DXF · DWG · PDF' },
            { icon: 'check', label: 'Üretim Tipi', value: 'Tekil · Prototip · Küçük Seri' },
            { icon: 'layers', label: 'Malzeme', value: 'Çelik · Paslanmaz · Alüminyum' },
            { icon: 'gear', label: 'Süreç', value: 'Kesim · Büküm · Kaynak' }
        ],
        materialsLabel: '03 — MALZEME GRUPLARI',
        materialsTitle: 'Değerlendirilen Malzeme Grupları',
        materials: [
            { icon: 'materialA', bgWord: 'ÇELİK', title: 'Çelik', desc: 'Genel proje ve konstrüksiyon uygulamaları için karbon çelik.' },
            { icon: 'materialB', bgWord: '304', title: 'Paslanmaz Çelik', desc: 'Hijyen ve korozyon direnci gereken özel parçalar için.' },
            { icon: 'hexagon', bgWord: 'ALU', title: 'Alüminyum', desc: 'Hafif yapı gerektiren özel proje ve prototip parçaları.' },
            { icon: 'layers', bgWord: 'MIX', title: 'Karma Malzeme', desc: 'Proje kapsamında birden fazla malzeme grubunun bir aradalığı.' }
        ],
        industriesDesc: 'Özel proje imalatı çözümlerimiz standart dışı ihtiyaçlar için mühendislik desteğiyle planlanır.',
        industries: [
            { icon: 'gear', title: 'Makine Parçası', desc: 'Standart dışı boyut ve forma sahip makine parçaları için teknik çizim bazlı üretim.' },
            { icon: 'ibeam', title: 'Konstrüksiyon Elemanı', desc: 'Özel boyut ve bağlantı gereksinimi olan yapısal metal elemanlar için proje bazlı imalat.' },
            { icon: 'factory', title: 'Ekipman Aksamı', desc: 'Endüstriyel ekipman parçası, yedek parça ve ısmarlama bileşen üretimi.' },
            { icon: 'target', title: 'Prototip', desc: 'Mühendislik geliştirme süreçleri için metal prototip ve doğrulama parçası üretimi.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'moduler-tesisat-sistemleri',
        metaDescription: 'Foramak Makine; paslanmaz, karbon çelik ve çift cidarlı tesisat gruplarında, su arıtma, gaz arıtma, toz ve baca arıtma sistemleri için teknik üretim desteği sağlar.',
        serviceNumber: '09',
        breadcrumbLabel: 'Modüler Tesisat Sistemleri',
        title: 'Modüler Tesisat Sistemleri',
        heroDesc: 'Paslanmaz, karbon çelik ve çift cidarlı tesisat gruplarında teknik çizime bağlı, montaja hazır ölçülü üretim.',
        heroImage: 'assets/images/hizmetlerimiz/modüler tesisat sistemleri.png',
        heroSpecs: [
            { icon: 'materialB', label: 'Malzeme Grupları', value: 'Paslanmaz · Karbon Çelik' },
            { icon: 'pipe', label: 'Tesisat Türü', value: 'Çift Cidarlı · Standart' },
            { icon: 'blueprint', label: 'Üretim', value: 'Teknik Çizime Göre' },
            { icon: 'target', label: 'Sevkiyat', value: 'Türkiye Geneli' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/modüler tesisat sistemleri.png',
        overviewParagraphs: [
            'Modüler tesisat sistemleri; paslanmaz, karbon çelik ve çift cidarlı tesisat gruplarında teknik çizime ve proje ihtiyacına bağlı ölçülü üretim çözümlerini kapsar. Boru hattı, bağlantı parçası ve montaja hazır tesisat elemanı üretimi tek noktadan yürütülür.',
            'Gıda, ilaç, kimya, proses ve enerji tesislerinin farklı malzeme ve basınç gereksinimlerine uygun tesisat çözümleri planlanır; üretim sonrası ürünler Türkiye genelinde projenin bulunduğu bölgeye sevke hazır hale getirilir.'
        ],
        overviewCaption: ['MODÜLER TESİSAT,', 'TÜRKİYE GENELİNDE.'],
        tags: ['Paslanmaz Tesisat', 'Karbon Çelik', 'Çift Cidarlı', 'Türkiye Geneli Sevkiyat'],
        technicalSpecs: [
            { icon: 'materialB', label: 'Paslanmaz Grubu', value: 'AISI 304 · AISI 316' },
            { icon: 'materialA', label: 'Karbon Çelik', value: 'St 37 · St 52' },
            { icon: 'layers', label: 'Çift Cidarlı', value: 'Isı Yalıtımlı' },
            { icon: 'check', label: 'Bağlantı', value: 'Flanşlı · Kaynaklı' }
        ],
        materialsLabel: '03 — TESİSAT GRUPLARI',
        materialsTitle: 'Tesisat Grupları',
        materials: [
            { icon: 'materialB', bgWord: '304', title: 'Paslanmaz Tesisat', desc: 'AISI 304/316 flanşlı, kaynaklı ve vidalı bağlantı elemanları.' },
            { icon: 'materialA', bgWord: 'ST52', title: 'Karbon Çelik Tesisat', desc: 'St 37/St 52 boru hatları ve konstrüksiyon üretimi.' },
            { icon: 'layers', bgWord: 'ÇİFT', title: 'Çift Cidarlı Tesisat', desc: 'Isı yalıtımı ve basınç güvenliği gerektiren proses hatları.' },
            { icon: 'profile', bgWord: 'BAĞLANTI', title: 'Bağlantı ve Montaj Parçaları', desc: 'Flanş, saplama ve montaj uyumlu bağlantı elemanı üretimi.' }
        ],
        industriesDesc: 'Modüler tesisat çözümlerimiz farklı sektörlerin proje ve montaj ihtiyaçlarına uygun şekilde planlanır.',
        industries: [
            { icon: 'food', title: 'Gıda ve İlaç Tesisi', desc: 'Hijyen gerektiren üretim hatlarında paslanmaz tesisat ve bağlantı elemanı üretimi.' },
            { icon: 'factory', title: 'Proses Endüstrisi', desc: 'Basınçlı ve proses hatlarında karbon çelik ve çift cidarlı tesisat çözümleri.' },
            { icon: 'water', title: 'Arıtma Sistemleri', desc: 'Su, gaz, toz ve baca arıtma sistemleri için tesisat ve bağlantı üretimi.' },
            { icon: 'bolt', title: 'Enerji ve Altyapı', desc: 'Enerji tesisi ve altyapı projelerinde tesisat hattı ve montaj elemanı üretimi.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    },

    {
        slug: 'aritma-sistemleri',
        metaDescription: 'Su, gaz, toz ve baca arıtma sistemleri için filtre, proses ekipmanı ve endüstriyel parça üretim desteği.',
        serviceNumber: '10',
        breadcrumbLabel: 'Arıtma Sistemleri',
        title: 'Arıtma Sistemleri',
        heroDesc: 'Su, gaz, toz ve baca arıtma sistemlerinde kullanılan filtre, ekipman ve proses parçaları için teknik üretim desteği.',
        heroImage: 'assets/images/hizmetlerimiz/arıtma sistemleri.png',
        heroSpecs: [
            { icon: 'water', label: 'Sistem Türleri', value: 'Su · Gaz · Toz · Baca' },
            { icon: 'layers', label: 'Malzeme Grupları', value: 'Paslanmaz · Karbon Çelik' },
            { icon: 'gear', label: 'Üretim', value: 'Kesim · Büküm · Kaynak' },
            { icon: 'target', label: 'Uygulama Alanı', value: 'Proses ve Filtrasyon' }
        ],
        overviewImage: 'assets/images/hizmetlerimiz/arıtma sistemleri.png',
        overviewParagraphs: [
            'Arıtma sistemleri; su, gaz, toz ve baca arıtma hatlarında kullanılan filtre, ekipman ve proses parçaları için teknik üretim desteğini kapsar. Sistem türü ve kapasite gereksinimine göre malzeme grubu ve üretim yöntemi belirlenir.',
            'Pres filtre ve basınçlı filtre sistemleri dahil olmak üzere proses ekipmanları, paslanmaz ve karbon çelik malzeme gruplarında teknik çizime uygun şekilde üretilir; kaynaklı ve flanşlı bağlantı detayları projeye göre planlanır.'
        ],
        overviewCaption: ['DAHA TEMİZ SÜREÇLER,', 'GÜVENİLİR ARITMA.'],
        tags: ['Su Arıtma', 'Gaz / Toz / Baca Arıtma', 'Proses Ekipmanı', 'Filtre Sistemleri'],
        technicalSpecs: [
            { icon: 'water', label: 'Su Arıtma', value: 'Tank · Kollektör' },
            { icon: 'gear', label: 'Gaz Arıtma', value: 'Proses Ekipmanı' },
            { icon: 'factory', label: 'Toz Arıtma', value: 'Filtre Gövdesi' },
            { icon: 'check', label: 'Baca Arıtma', value: 'Kanal · Konstrüksiyon' }
        ],
        materialsLabel: '03 — SİSTEM GRUPLARI',
        materialsTitle: 'Arıtma Sistemi Grupları',
        materials: [
            { icon: 'water', bgWord: 'SU', title: 'Su Arıtma Sistemleri', desc: 'Tank, filtre gövdesi, kollektör ve paslanmaz ekipman üretimi.' },
            { icon: 'gear', bgWord: 'GAZ', title: 'Gaz Arıtma Sistemleri', desc: 'Proses gazı yönetim sistemleri için metal parça ve konstrüksiyon.' },
            { icon: 'factory', bgWord: 'TOZ', title: 'Toz Arıtma Sistemleri', desc: 'Filtre gövdesi, kanal ve bağlantı flanşı üretimi.' },
            { icon: 'ibeam', bgWord: 'BACA', title: 'Baca Arıtma Sistemleri', desc: 'Yüksek sıcaklık ve korozif ortama uygun kanal ve konstrüksiyon.' }
        ],
        industriesDesc: 'Arıtma sistemi çözümlerimiz farklı sektörlerin proses ve çevre uyum ihtiyaçlarına uygun şekilde planlanır.',
        industries: [
            { icon: 'water', title: 'Su ve Atıksu Tesisleri', desc: 'İçme suyu ve atıksu arıtma tesislerinde ekipman ve tesisat üretimi.' },
            { icon: 'factory', title: 'Endüstriyel Proses', desc: 'Proses gazı, toz ve emisyon kontrolü gereken tesislerde ekipman üretimi.' },
            { icon: 'food', title: 'Gıda ve İçecek', desc: 'Hijyen ve arıtma gerektiren gıda/içecek üretim tesislerinde paslanmaz ekipman.' },
            { icon: 'bolt', title: 'Enerji ve Altyapı', desc: 'Enerji tesisleri ve altyapı projelerinde baca ve emisyon arıtma ekipmanı üretimi.' }
        ],
        ctaTitle: 'Projeniz için teknik değerlendirme yapılmasını ister misiniz?',
        ctaDescription: 'Teknik çiziminizi, malzeme ve adet bilgilerinizi paylaşın; üretim kapsamını birlikte değerlendirelim.'
    }
];

module.exports = { SERVICES };
