/* ================================================================
   Teknik Bilgiler ve Rehberler — makale verisi
   ----------------------------------------------------------------
   Her makale tek bir hizmete bağlıdır (service = hizmet slug'ı) ve o
   hizmetin footer'ındaki "Teknik Bilgiler ve Rehberler" bölümünde
   linkText ile listelenir. İçerikteki kapasite ve ürün bilgileri
   build/service-data.js'teki doğrulanmış değerlerle sınırlıdır.

   Gövde biçimi:
     'metin'                       → paragraf ([bağlantı](/yol) desteklenir)
     { ul: ['…', '…'] }            → madde listesi
     { h3: 'Başlık', body: [...] } → alt başlık
   ================================================================ */

const GUIDES = [
    /* ---------------- 1. SAC LAZER KESİM ---------------- */
    {
        slug: 'ankara-ivedik-sac-lazer-kesim',
        service: 'sac-lazer-kesim',
        linkText: 'Ankara İvedik Sac Lazer Kesim Hizmeti',
        h1: 'Ankara İvedik Sac Lazer Kesim Hizmeti',
        seoTitle: 'İvedik OSB Sac Lazer Kesim: Kapasite ve Çalışma Düzeni',
        metaDescription: 'İvedik OSB\'de çelik, paslanmaz ve alüminyum sac lazer kesim: kalınlık aralıkları, kabul edilen dosyalar, kesim sonrası büküm ve kaynak, teklif için gereken bilgiler.',
        keywords: ['Ankara lazer kesim', 'İvedik OSB lazer kesim', 'İvedik sac lazer kesim'],
        lead: 'Ankara\'da sac parça kestirecek bir imalatçının ilk sorduğu üç şey bellidir: hangi malzeme ve kalınlık kesilebiliyor, dosya hangi formatta gönderilmeli ve parça kesimden sonra başka bir atölyeye taşınmak zorunda kalacak mı? Bu yazı İvedik OSB\'deki çalışma düzenimizi bu üç soru üzerinden anlatıyor.',
        sections: [
            { h2: 'Atölye nerede, kimler için kesim yapıyoruz?', body: [
                'Üretim yerimiz Yenimahalle\'deki İvedik OSB\'de, 1401. Sokak\'ta. Makine gövdesi, muhafaza, konstrüksiyon bağlantı plakası ya da tesisat flanşı gibi sac parçalara ihtiyaç duyan imalatçılar, montaj firmaları ve proje ekipleri için teknik çizime göre kesim yapıyoruz. İvedik ve çevresindeki OSTİM gibi sanayi bölgelerinde çalışan firmalar için atölyeye ulaşmak kısa bir yol; numuneyi getirip ölçüyü birlikte konuşmak da mümkün.',
            ] },
            { h2: 'Kesilebilen malzemeler ve kalınlık aralıkları', body: [
                'Sac lazer kesimde çalıştığımız malzeme grupları ve kalınlıklar şöyle:',
                { ul: [
                    'Çelik sac (DKP ve galvanizli dahil): 0,5 – 20 mm',
                    'Paslanmaz sac (AISI 304 / 316): 0,5 – 12 mm',
                    'Alüminyum sac: 0,5 – 10 mm',
                ] },
                'Aralığın üst sınırına yaklaşan kalınlıklarda kesim süresi uzar ve kenar görünümüyle ilgili beklenti parçanın kullanım yerine göre değişir. Görünür yüzeyde kalacak kalın parçalarda bu beklentiyi teklif aşamasında yazmanız, sürprizleri önler.',
            ] },
            { h2: 'Kesimden sonra parça başka atölyeye gitmiyor', body: [
                'Kesilen parçaların önemli bir kısmı bükülecek ya da kaynakla birleştirilecek. Aynı çatı altında [CNC sac büküm](/sac-bukum) ve [MIG/TIG kaynaklı imalat](/kaynakli-imalat) yapıldığı için açınımı hazırlayan, büken ve kaynatan ekip aynı ölçü zincirini takip ediyor. Parçanın atölyeler arasında taşınması, ölçü sorumluluğunun bölünmesi ve "kesim doğru, büküm hatalı" tartışması bu şekilde ortadan kalkıyor.',
            ] },
            { h2: 'Teklif için hangi bilgileri göndermelisiniz?', body: [
                { ul: [
                    'DXF veya DWG çizim; yoksa ölçülendirilmiş PDF',
                    'Malzeme cinsi ve kalınlık',
                    'Parça başına adet',
                    'Büküm, kaynak veya montaj gerekip gerekmediği',
                    'İstenen termin',
                ] },
                'Dosyanın kesime nasıl hazırlanacağını [DXF ve DWG ile lazer kesim hazırlığı](/rehber/dxf-dwg-lazer-kesim-hazirligi) yazısında adım adım anlattık. Fiyatın neye göre oluştuğunu merak ediyorsanız [sac lazer kesim fiyatını etkileyen faktörler](/rehber/sac-lazer-kesim-fiyat-faktorleri) yazısına bakabilirsiniz.',
            ] },
            { h2: 'Tek parçadan seriye', body: [
                'Prototip için tek parça da, tekrar eden seri siparişler de kesiyoruz. Seri işlerde parçaların plakaya yerleşimi (nesting) malzeme verimini belirlediği için, adet bilgisini baştan net vermek hem fireyi hem de fiyatı doğrudan etkiler.',
            ] },
        ],
        related: ['dxf-dwg-lazer-kesim-hazirligi', 'sac-lazer-kesim-fiyat-faktorleri', 'ankara-ivedik-sac-bukum'],
    },
    {
        slug: 'sac-lazer-kesim-fiyat-faktorleri',
        service: 'sac-lazer-kesim',
        linkText: 'Sac Lazer Kesim Fiyatını Etkileyen Faktörler',
        h1: 'Sac Lazer Kesim Fiyatını Etkileyen Faktörler',
        seoTitle: 'Sac Lazer Kesim Fiyatı Neye Göre Belirlenir? 6 Etken',
        metaDescription: 'Lazer kesim fiyatı kiloyla değil, makine süresi ve plaka veriminden oluşur. Malzeme, kalınlık, kesim uzunluğu, delik sayısı, nesting, adet ve ek işlemlerin etkisi.',
        keywords: ['sac lazer kesim fiyatı', 'lazer kesim fiyatları neye göre', 'lazer kesim maliyeti'],
        lead: 'Lazer kesimde fiyat çoğu zaman kilo ya da adet üzerinden sorulur. Oysa aynı ağırlıktaki iki parça çok farklı maliyet çıkarabilir. Fiyatı asıl belirleyen, makinenin o parça için harcadığı süre ve plakadan ne kadar verim alındığıdır. Aşağıdaki altı etken, gelen tekliflerin neden birbirinden farklı olduğunu anlamanıza yardımcı olur.',
        sections: [
            { h2: '1. Malzeme cinsi ve kalınlık', body: [
                'Paslanmaz ve alüminyum sacın birim fiyatı DKP\'den yüksektir; teklifin önemli bir bölümü doğrudan malzeme bedelidir. Kalınlık arttıkça kesim hızı düşer, yani aynı kontur daha uzun sürede kesilir. Bu nedenle 2 mm ile 10 mm sacdan aynı şekli kestirmek arasındaki fark yalnızca malzeme ağırlığı değildir.',
            ] },
            { h2: '2. Toplam kesim uzunluğu ve delik sayısı', body: [
                'Makine süresi, parçanın çevresi ve içindeki tüm konturların toplam uzunluğuyla orantılıdır. Her iç kontur ayrıca bir delme (piercing) noktası demektir. Çok sayıda küçük delik içeren bir flanş veya perfore bir panel, dış ölçüsü aynı düz bir plakadan çok daha uzun sürer.',
            ] },
            { h2: '3. Plaka yerleşimi ve fire', body: [
                'Parçalar standart ölçülü plakalara dizilerek kesilir. Şekli plakaya iyi oturan ya da farklı parçalarla birlikte dizilebilen işlerde fire azalır. Tek bir büyük ve düzensiz parça ise plakanın önemli bir bölümünü kullanılamaz hale getirebilir; bu kayıp da fiyata yansır.',
            ] },
            { h2: '4. Adet ve tekrar', body: [
                'Her işin bir hazırlık bölümü vardır: çizimin kontrolü, kesim programının hazırlanması, malzemenin yüklenmesi. Bu süre adet ne olursa olsun harcanır. Tek parçalık bir prototipte birim fiyatın yüksek, yüzlerce adetlik bir seride düşük çıkmasının nedeni budur. Aynı parçanın tekrar siparişinde hazır program kullanılabildiğinde hazırlık yükü de azalır.',
            ] },
            { h2: '5. Kesim sonrası işlemler', body: [
                'Çapak alma, [CNC büküm](/sac-bukum), [kaynak](/kaynakli-imalat) ya da montaj gerekiyorsa bunlar ayrı kalemler olarak fiyata eklenir. Bu işlemlerin kesimle aynı yerde yapılması toplamı düşürmez; ama taşıma, bekleme ve atölyeler arası ölçü uyuşmazlığı riskini ortadan kaldırır.',
            ] },
            { h2: '6. Dosyanın durumu ve termin', body: [
                'Açık konturlu, üst üste binen çizgiler içeren ya da yalnızca elle çizilmiş eskiz olarak gelen işler kesime girmeden önce yeniden çizilir; bu da süre demektir. Olağan iş sırasının önüne alınması gereken acil terminler de planlamayı etkiler. Dosyanızı kesime hazır göndermek için [DXF ve DWG hazırlık rehberine](/rehber/dxf-dwg-lazer-kesim-hazirligi) göz atabilirsiniz.',
            ] },
            { h2: 'Karşılaştırılabilir teklif almak için', body: [
                'Farklı tedarikçilerden gelen teklifleri karşılaştırırken hepsine aynı bilgiyi verdiğinizden emin olun: malzeme cinsi ve kalınlığı, adet, malzemenin kimden sağlanacağı ve kesim sonrası istenen işlemler. Bu bilgilerle birlikte [teklif talebinizi](/teklif-al) ilettiğinizde fiyat tahmine değil, gerçek iş tanımına dayanır.',
            ] },
        ],
        related: ['dxf-dwg-lazer-kesim-hazirligi', 'ankara-ivedik-sac-lazer-kesim'],
    },
    {
        slug: 'dxf-dwg-lazer-kesim-hazirligi',
        service: 'sac-lazer-kesim',
        linkText: 'DXF ve DWG ile Lazer Kesim Hazırlığı',
        h1: 'DXF ve DWG ile Lazer Kesim Hazırlığı',
        seoTitle: 'Lazer Kesim İçin DXF ve DWG Dosyası Nasıl Hazırlanır?',
        metaDescription: 'Lazer kesime gönderilecek DXF/DWG dosyasında ölçek, kapalı kontur, çift çizgi, katman ve açınım kontrolü. Dosyayı kesime hazır göndermek için pratik kontrol listesi.',
        keywords: ['lazer kesim dxf hazırlama', 'dwg lazer kesim', 'lazer kesim için çizim'],
        lead: 'Lazer kesim makinesi çizimdeki çizgiyi takip eder; çizgi yanlışsa parça da yanlış kesilir. Dosyayı kesime uygun hazırlamak hem teklif süresini kısaltır hem de üretimde geri dönüşü azaltır. Aşağıdaki kontroller çoğu CAD programında birkaç dakikada yapılabilir.',
        sections: [
            { h2: 'DXF mi, DWG mi, PDF mi?', body: [
                'DXF ve DWG dosyalarını doğrudan kesim programına aktarabiliyoruz. DXF, farklı CAD programları arasında en sorunsuz taşınan formattır; DWG gönderiyorsanız çok yeni bir sürümde kaydedilmiş dosyalar için eski bir sürümde de kaydetmek işinizi kolaylaştırır. Ölçülendirilmiş PDF de kabul edilir, ancak PDF\'ten kesim yapılamaz: parça önce yeniden çizilir ve bu iş teklife ek süre olarak yansır.',
            ] },
            { h2: 'Çizimde olması gerekenler', body: [
                { ul: [
                    'Gerçek ölçekte (1:1) ve milimetre biriminde çizim',
                    'Tamamen kapalı konturlar; birleşmemiş uç ya da küçük boşluk bırakılmamalı',
                    'Üst üste binen çift çizgi olmamalı; aynı kenar iki kez kesilir ve iz bırakır',
                    'Ölçü çizgileri, yazılar ve antet kesim konturlarından ayrı bir katmanda olmalı ya da silinmeli',
                    'Her parça ayrı dosyada ya da adı ve adedi belirtilmiş ayrı bloklarda',
                ] },
            ] },
            { h2: 'Delik, kanal ve ince köprüler', body: [
                'Sac kalınlığına göre çok küçük kalan delikler ve iki kesim arasında kalan dar köprüler kesim sırasında ısınıp şekil değiştirebilir. Bu tür detayları çizimde işaretlemeniz yeterli; uygulanabilirliğini teklif aşamasında birlikte değerlendiriyoruz. Somun, cıvata ya da pim geçecek deliklerde kritik çapları ayrıca not etmek montajda sorun çıkmasını önler.',
            ] },
            { h2: 'Bükülecek parçalarda açınım', body: [
                'Parça kesimden sonra bükülecekse iki yol vardır: açınımı (düz hali) DXF olarak göndermek ya da bükülmüş haldeki ölçüleri veren çizimi paylaşmak. Açınım hesabı malzemeye ve kalınlığa göre değiştiği için, ikinci yolda açınımın nasıl çıkarılacağını birlikte netleştiriyoruz. Bu konunun ayrıntıları [CNC sac bükümde ölçü ve açı planlaması](/rehber/cnc-sac-bukum-olcu-aci-planlamasi) yazısında.',
            ] },
            { h2: 'Dosyayla birlikte gönderilecek bilgiler', body: [
                'Çizim tek başına yeterli değildir. Malzeme cinsini (DKP, galvanizli, AISI 304/316, alüminyum), kalınlığı, adedi ve varsa yüzey beklentisini dosya adına ya da mesajınıza ekleyin. Dosyalarınızı [Teklif Al](/teklif-al) sayfasındaki bilgilerle birlikte ya da e-postayla iletebilirsiniz.',
            ] },
        ],
        related: ['sac-lazer-kesim-fiyat-faktorleri', 'cnc-sac-bukum-olcu-aci-planlamasi', 'teknik-cizime-gore-metal-parca-imalati'],
    },

    /* ---------------- 2. BORU / PROFİL LAZER KESİM ---------------- */
    {
        slug: 'ankara-boru-profil-lazer-kesim',
        service: 'boru-profil-lazer-kesim',
        linkText: 'Ankara Boru ve Profil Lazer Kesim',
        h1: 'Ankara Boru ve Profil Lazer Kesim',
        seoTitle: 'Ankara Boru ve Profil Lazer Kesim: Kesitler ve Ölçüler',
        metaDescription: 'İvedik OSB\'de 3 kW boru lazerle Ø20–220 mm yuvarlak boru ve 20×20–150×150 mm profil kesimi; 6 metreye kadar boy, delik, kanal ve açılı kesim uygulamaları.',
        keywords: ['Ankara boru lazer kesim', 'profil lazer kesim Ankara', 'boru lazer kesim İvedik'],
        lead: 'Boru ve profil işlerinde boy kesimi testerede, delikler matkapta, kanallar taşlamayla yapıldığında her adımda yeni bir ölçü hatası ihtimali doğar. Boru lazer bu işlemleri tek bağlamada yapar. Bu yazıda İvedik OSB\'deki boru lazer altyapımızda hangi kesitlerle, hangi ölçülerde çalıştığımızı özetliyoruz.',
        sections: [
            { h2: 'Kesit ve ölçü aralığı', body: [
                { ul: [
                    'Lazer gücü: 3 kW',
                    'Yuvarlak boru: Ø 20 – 220 mm',
                    'Kare ve dikdörtgen profil: 20×20 – 150×150 mm',
                    'Çalışma uzunluğu: 6.000 mm\'ye kadar',
                ] },
                'Siyah çelik ve galvanizli boru, çelik ve paslanmaz kutu profil, AISI 304/316 paslanmaz boru ve alüminyum profil bu altyapıda kesilebiliyor.',
            ] },
            { h2: 'Tek bağlamada boy kesimi, delik ve kanal', body: [
                'Boru tezgaha bir kez bağlandıktan sonra boy kesimi, çevresel delikler, uzun kanallar ve açılı uçlar aynı programda kesilir. Parçanın her yeni işlem için yeniden ölçülüp markalanması gerekmediği için, özellikle aynı parçadan çok sayıda üretilecek işlerde parçalar birbirinin aynısı çıkar. Kaynakla birleşecek boruların açılı uçları da kesim aşamasında hazırlanabilir.',
            ] },
            { h2: 'Ankara\'daki projelerde tipik işler', body: [
                'Gelen işlerin çoğu dört başlıkta toplanıyor: tesisat boru bağlantıları ve flanş ağzı açma, çelik yapı ve platform profilleri, makine çerçevesi ve kasa elemanları, arıtma tesislerindeki boru bağlantıları. Kullanım alanlarını örneklerle anlattığımız [profil lazer kesimin endüstriyel kullanım alanları](/rehber/profil-lazer-kesim-kullanim-alanlari) yazısı hangi işte lazerin gerçekten fark yarattığını gösteriyor.',
            ] },
            { h2: 'Sipariş öncesi', body: [
                'Boru ve profil çiziminde sac parçalardan farklı olarak delik ve kanalların boru üzerindeki konumunun da tanımlanması gerekir. Neleri ölçülendirmeniz gerektiğini [boru lazer kesimde teknik çizim ve ölçülendirme](/rehber/boru-lazer-kesim-teknik-cizim-olculendirme) yazısında topladık. Hazır olduğunuzda çiziminizi [Teklif Al](/teklif-al) sayfası üzerinden iletebilirsiniz.',
            ] },
        ],
        related: ['boru-lazer-kesim-teknik-cizim-olculendirme', 'profil-lazer-kesim-kullanim-alanlari', 'ankara-kaynakli-metal-imalat'],
    },
    {
        slug: 'boru-lazer-kesim-teknik-cizim-olculendirme',
        service: 'boru-profil-lazer-kesim',
        linkText: 'Boru Lazer Kesimde Teknik Çizim ve Ölçülendirme',
        h1: 'Boru Lazer Kesimde Teknik Çizim ve Ölçülendirme',
        seoTitle: 'Boru Lazer Kesim İçin Teknik Çizim ve Ölçülendirme',
        metaDescription: 'Boru ve profil lazer kesim çiziminde dış çap, et kalınlığı, referans uç, delik konumu, açısal yerleşim ve açılı kesim nasıl tanımlanır? Kontrol listesiyle anlatım.',
        keywords: ['boru lazer kesim çizimi', 'boru lazer ölçülendirme', 'profil kesim teknik çizim'],
        lead: 'Sac bir parçanın çizimi iki boyutludur; boru ve profilde ise delik ve kanalların gövde üzerindeki konumunu da tarif etmek gerekir. Eksik tanımlanan bir açısal konum, doğru ölçüde ama yanlış yüzeyde açılmış bir deliğe dönüşebilir.',
        sections: [
            { h2: 'Hangi dosyayı göndermeli?', body: [
                'Delik ve kanallı boru parçalarında en az hata, parçanın 3B modeliyle olur; STEP gibi yaygın 3B formatlar ve SolidWorks dosyaları da değerlendirilebilir. 2B çalışıyorsanız boru yüzeyinin açınımını DXF/DWG olarak ya da delik konumlarını tüm görünüşlerde gösteren ölçülü bir çizimi paylaşabilirsiniz.',
            ] },
            { h2: 'Ölçülendirmede dikkat edilecekler', body: [
                { h3: 'Kesitin tanımı', body: [
                    'Yuvarlak boruda dış çap ve et kalınlığı, profilde dış ölçüler (ör. 60×40) ve et kalınlığı yazılmalıdır. "2 inç boru" gibi ticari adlandırmalar farklı standartlarda farklı dış çaplara karşılık gelebileceği için milimetre değeri her zaman daha güvenlidir.',
                ] },
                { h3: 'Referans uç ve toplam boy', body: [
                    'Bütün delik ve kanal konumlarını tek bir referans uca göre ölçülendirmek, ara ölçülerin toplanmasıyla oluşan hata birikimini önler. Toplam boyu ayrıca belirtin.',
                ] },
                { h3: 'Açısal konum', body: [
                    'Borunun çevresinde birden fazla delik dizisi varsa, bir dizinin konumunu 0° kabul edip diğerlerini bu referansa göre açıyla tanımlayın. Profillerde hangi yüzeyden bahsedildiğini görünüşlerle netleştirin.',
                ] },
                { h3: 'Açılı kesimler', body: [
                    'Açılı uçlarda açının hangi düzlemde ve hangi yüzeye göre ölçüldüğünü belirtin; birbirine kaynayacak iki parçada açıların toplamının birleşim açısını vermesi gerekir.',
                ] },
            ] },
            { h2: 'Malzemenin kendisinden gelen sapmalar', body: [
                'Ticari boru ve profillerde küçük ovallik, eğrilik ve et kalınlığı farkları bulunabilir. Montajda kritik olan ölçüleri ve toleransları çizimde ayrıca işaretlerseniz, malzeme seçimi ve kesim sırası buna göre planlanır.',
            ] },
            { h2: 'Gönderim öncesi kısa kontrol listesi', body: [
                { ul: [
                    'Dış çap / dış ölçü ve et kalınlığı yazıldı mı?',
                    'Tüm konumlar tek referans uca göre mi?',
                    'Delik dizilerinin açısal konumu tanımlı mı?',
                    'Açılı uçlarda düzlem ve açı net mi?',
                    'Malzeme (çelik, galvaniz, paslanmaz, alüminyum) ve adet belirtildi mi?',
                ] },
                'Kesilen parçalar kaynakla birleşecekse [kaynaklı imalat](/kaynakli-imalat) aşaması için kaynak ağzı beklentisini de ekleyin.',
            ] },
        ],
        related: ['ankara-boru-profil-lazer-kesim', 'profil-lazer-kesim-kullanim-alanlari', 'teknik-cizime-gore-metal-parca-imalati'],
    },
    {
        slug: 'profil-lazer-kesim-kullanim-alanlari',
        service: 'boru-profil-lazer-kesim',
        linkText: 'Profil Lazer Kesimin Endüstriyel Kullanım Alanları',
        h1: 'Profil Lazer Kesimin Endüstriyel Kullanım Alanları',
        seoTitle: 'Profil Lazer Kesim Nerelerde Kullanılır? Endüstriyel Örnekler',
        metaDescription: 'Makine şaseleri, çelik platformlar, tesisat taşıyıcıları, arıtma ekipmanı iskeletleri ve alüminyum hafif yapılarda profil lazer kesimin sağladığı avantajlar.',
        keywords: ['profil lazer kesim kullanım alanları', 'kutu profil lazer kesim', 'profil kesim makine şasesi'],
        lead: 'Profil lazer kesim her işte gerekli değildir; düz boy kesimi için testere çoğu zaman yeterlidir. Lazerin farkı, parçada delik, kanal, açılı uç ya da birbirine geçecek detaylar olduğunda ortaya çıkar. Aşağıdaki örnekler bu farkın en çok hissedildiği alanlar.',
        sections: [
            { h2: 'Makine şaseleri ve kasaları', body: [
                'Makine çerçevelerinde çok sayıda bağlantı deliği, motor ve rulman yuvası ile kablo geçişi bulunur. Bu detaylar profil üzerinde lazerle kesildiğinde, kaynak öncesi montajda parçalar çizimdeki yerlerine oturur ve şasenin gönyesi korunur.',
            ] },
            { h2: 'Çelik yapı ve platformlar', body: [
                'Platform ve taşıyıcı konstrüksiyonlarda profil uçlarının açılı kesimi ve birleşim delikleri lazerde hazırlanır. Sahada markalayıp delmek yerine kesimden hazır gelen parçalar, montaj süresini kısaltır.',
            ] },
            { h2: 'Tesisat taşıyıcıları ve boru bağlantıları', body: [
                'Tesisat hatlarında boru üzerine branşman ağzı açma ve flanş ağzı hazırlığı boru lazerin en sık kullanıldığı işlerdendir. Taşıyıcı konsol ve askı profilleri de aynı tezgahta seri olarak kesilebilir. Atölyede ölçülü üretilen tesisat parçaları hakkında daha fazlası için [modüler tesisat sistemleri](/moduler-tesisat-sistemleri) sayfamıza bakabilirsiniz.',
            ] },
            { h2: 'Arıtma ve proses ekipmanı iskeletleri', body: [
                'Filtre gövdesi taşıyıcıları, tank ayakları ve platform iskeletleri gibi arıtma ekipmanı parçalarında karbon çelik ve paslanmaz profiller birlikte kullanılabilir. Bu parçaların kesimi, [arıtma sistemleri](/aritma-sistemleri) için yaptığımız kaynaklı imalatın ilk adımıdır.',
            ] },
            { h2: 'Alüminyum hafif konstrüksiyonlar', body: [
                'Ağırlığın sınırlı olduğu taşıma sistemleri, makine kapakları ve çerçeveli panellerde alüminyum profil kullanılır. Alüminyum profil kesimi de boru lazerde yapılabiliyor; kaynak ve büküm tarafı için [alüminyum sac ve profil işleme yöntemleri](/rehber/aluminyum-sac-profil-isleme-yontemleri) yazısına göz atabilirsiniz.',
            ] },
            { h2: 'Hangi işte lazer, hangi işte testere?', body: [
                'Yalnızca düz boy kesimi gereken, delik ve açı içermeyen basit işlerde testere daha ekonomik olabilir. Parçada işleme detayı arttıkça ve adet büyüdükçe lazerin tek bağlamada sağladığı tekrarlanabilirlik öne çıkar. Hangisinin sizin işinize uygun olduğunu çiziminiz üzerinden söyleyebiliriz.',
            ] },
        ],
        related: ['ankara-boru-profil-lazer-kesim', 'boru-lazer-kesim-teknik-cizim-olculendirme'],
    },

    /* ---------------- 3. SAC BÜKÜM ---------------- */
    {
        slug: 'ankara-ivedik-sac-bukum',
        service: 'sac-bukum',
        linkText: 'Ankara İvedik Sac Büküm Hizmeti',
        h1: 'Ankara İvedik Sac Büküm Hizmeti',
        seoTitle: 'İvedik OSB Sac Büküm: CNC Pres Fren ve Kalınlık Aralıkları',
        metaDescription: 'İvedik OSB\'de CNC pres frenle çelik (0,5–12 mm), paslanmaz (0,5–6 mm) ve alüminyum (0,5–8 mm) sac büküm; kesim ve bükümün aynı yerde yapılmasının avantajı.',
        keywords: ['Ankara sac büküm', 'İvedik sac büküm', 'CNC abkant Ankara'],
        lead: 'Sac bükümde sorun genellikle bükümün kendisinde değil, kesimle büküm arasındaki ölçü zincirinde çıkar. İvedik OSB\'deki atölyemizde kesim ve büküm aynı ekip tarafından planlandığı için bu zincir tek yerde yönetiliyor.',
        sections: [
            { h2: 'CNC pres frenle büküm', body: [
                'Büküm işlemlerini CNC pres frenle yapıyoruz. Açı ve büküm sırası programla yönetildiği için aynı parçanın tekrar üretiminde boyutsal tutarlılık sağlanır. Hem tekil parçalar hem de seri işler bu düzende çalışıyor.',
            ] },
            { h2: 'Malzemeye göre büküm kalınlıkları', body: [
                { ul: [
                    'Çelik sac (DKP / St37, galvanizli): 0,5 – 12 mm',
                    'Paslanmaz sac: 0,5 – 6 mm',
                    'Alüminyum sac: 0,5 – 8 mm',
                ] },
                'Paslanmazın daha dar bir aralıkta bükülebilmesi, aynı kalınlıkta çeliğe göre daha yüksek bükme kuvveti gerektirmesinden kaynaklanır. Kalın paslanmaz parçalarda tasarımı bu sınıra göre yapmak gerekir.',
            ] },
            { h2: 'Kesim ve büküm aynı yerde', body: [
                'Bükülecek parçanın açınımı [sac lazer kesim](/sac-lazer-kesim) aşamasında, büküm payı hesaba katılarak kesilir. Açınımı hazırlayan ile büken aynı ekip olduğunda, büküm sonrası ölçü tutmazsa nedenin kesimde mi bükümde mi olduğu tartışması yaşanmaz. Kaynak gerektiren parçalar için [kaynaklı imalat](/kaynakli-imalat) da aynı akışın devamıdır.',
            ] },
            { h2: 'En sık büktüğümüz parçalar', body: [
                { ul: [
                    'Makine ve ekipman muhafazaları, elektrik pano gövdeleri',
                    'Kanal kapakları ve kanal formları',
                    'Konstrüksiyonlar için köşe ve birleşim elemanları',
                    'Tesisat sistemleri için flanş ve saplama tabanları',
                    'Teknik çizime göre prototipten küçük seriye özel form parçalar',
                ] },
            ] },
            { h2: 'Doğru teklif için', body: [
                'Bükümlü parçalarda ölçünün içten mi dıştan mı verildiği, kritik açılar ve büküm çizgisine yakın delikler fiyatı ve uygulanabilirliği doğrudan etkiler. Bu noktaları [CNC sac bükümde ölçü ve açı planlaması](/rehber/cnc-sac-bukum-olcu-aci-planlamasi) yazısında anlattık.',
            ] },
        ],
        related: ['cnc-sac-bukum-olcu-aci-planlamasi', 'ankara-ivedik-sac-lazer-kesim'],
    },
    {
        slug: 'cnc-sac-bukum-olcu-aci-planlamasi',
        service: 'sac-bukum',
        linkText: 'CNC Sac Bükümde Ölçü ve Açı Planlaması',
        h1: 'CNC Sac Bükümde Ölçü ve Açı Planlaması',
        seoTitle: 'CNC Sac Büküm: Ölçü, Büküm Payı ve Açı Nasıl Planlanır?',
        metaDescription: 'Sac büküm çiziminde iç-dış ölçü, büküm payı, açınım, minimum kenar boyu, büküme yakın delikler, geri yaylanma ve büküm sırası: tasarım aşaması rehberi.',
        keywords: ['CNC sac büküm ölçü', 'sac büküm payı', 'abkant büküm açınım'],
        lead: 'Bükümlü bir sac parçada çizimdeki bir ölçünün içten mi dıştan mı alındığı bile birkaç milimetrelik fark yaratır. Tasarım aşamasında birkaç kuralı gözetmek, parçanın ilk denemede doğru çıkmasını sağlar.',
        sections: [
            { h2: 'İç ölçü mü, dış ölçü mü?', body: [
                'Bükümlü parçada her kenar ölçüsünün hangi yüzeyden alındığını belirtin. Bir kutunun içine başka bir parça girecekse iç ölçü, dışından başka bir yere oturacaksa dış ölçü kritiktir. Karışık ölçülendirmede montajda boşluk ya da sıkışma oluşur.',
            ] },
            { h2: 'Büküm payı ve açınım', body: [
                'Sac bükülürken dış yüzey uzar, iç yüzey sıkışır. Bu nedenle düz kesilecek açınımın uzunluğu, bükülmüş haldeki kenar ölçülerinin toplamına eşit değildir. Aradaki fark malzemeye, kalınlığa ve büküm yarıçapına göre değişir. Açınım çiziminiz yoksa bükülmüş haldeki ölçüleri verin; açınımın nasıl çıkarılacağını teklif aşamasında netleştiriyoruz.',
            ] },
            { h2: 'Kısa kenarlar ve büküme yakın delikler', body: [
                { h3: 'Minimum kenar boyu', body: [
                    'Çok kısa bir kenar kalıba yeterince oturmadığı için bükülemez ya da düzgün bükülmez. Kalınlığa göre değişen bu sınırı, kısa kenarlı tasarımlarda önceden sormanız işi hızlandırır.',
                ] },
                { h3: 'Büküm çizgisine yakın delikler', body: [
                    'Büküm çizgisine çok yakın açılan delik ve kanallar büküm sırasında ovalleşebilir. Mümkünse bu detayları büküm çizgisinden uzaklaştırın; mümkün değilse çizimde işaretleyin.',
                ] },
            ] },
            { h2: 'Açı toleransı ve geri yaylanma', body: [
                'Bükülen sac kalıptan çıktığında bir miktar geri açılır. Bu geri yaylanma paslanmaz ve alüminyumda çelikten farklıdır ve programda telafi edilir. Montaj için gerçekten kritik olan açıları çizimde belirtirseniz kontrol bu noktalara odaklanır.',
            ] },
            { h2: 'Büküm sırası', body: [
                'Kapalı kutu formları ve çok bükümlü parçalarda bazı bükümler, önceki bükümlerden sonra takımın parçaya çarpması nedeniyle yapılamayabilir. Karmaşık formlarda tasarımı kesinleştirmeden önce büküm sırasını konuşmak, sonradan parçayı ikiye bölüp kaynatma zorunluluğunu önler.',
            ] },
            { h2: 'Çizimi göndermeden önce', body: [
                { ul: [
                    'Ölçülerin iç ya da dış olduğu belirtildi mi?',
                    'Malzeme ve kalınlık yazıldı mı?',
                    'Kritik açılar ve toleranslar işaretlendi mi?',
                    'Büküm çizgisine yakın delik var mı?',
                    'Açınım dosyası ekli mi, yoksa bükülmüş ölçüler mi veriliyor?',
                ] },
                'Kesim tarafı için [DXF ve DWG ile lazer kesim hazırlığı](/rehber/dxf-dwg-lazer-kesim-hazirligi) yazısı bu listeyi tamamlar.',
            ] },
        ],
        related: ['ankara-ivedik-sac-bukum', 'dxf-dwg-lazer-kesim-hazirligi'],
    },

    /* ---------------- 4. KAYNAKLI İMALAT ---------------- */
    {
        slug: 'ankara-kaynakli-metal-imalat',
        service: 'kaynakli-imalat',
        linkText: 'Ankara Kaynaklı Metal İmalat',
        h1: 'Ankara Kaynaklı Metal İmalat',
        seoTitle: 'Ankara Kaynaklı Metal İmalat: Yöntemler ve İş Akışı',
        metaDescription: 'Çelikte MIG/MAG, paslanmazda TIG/MIG, alüminyumda TIG kaynak. İvedik OSB\'de kesim, büküm ve kaynağın tek akışta yapıldığı kaynaklı konstrüksiyon ve montaj parçaları.',
        keywords: ['Ankara kaynaklı imalat', 'kaynaklı metal imalat Ankara', 'İvedik kaynak atölyesi'],
        lead: 'Kaynaklı bir parçanın kalitesi kaynak dikişinden önce, birleşecek parçaların ne kadar doğru kesilip hazırlandığıyla başlar. İvedik OSB\'de kesim, büküm ve kaynağı aynı akışta yürütmemizin nedeni bu.',
        sections: [
            { h2: 'Malzemeye göre kaynak yöntemi', body: [
                { ul: [
                    'Karbon çelik (St37 – St52): MIG / MAG',
                    'Paslanmaz çelik (AISI 304 / 316): TIG / MIG',
                    'Alüminyum: TIG',
                ] },
                'Aynı projede birden fazla malzeme grubu bulunabiliyor; örneğin karbon çelik bir taşıyıcı üzerinde paslanmaz bir hazne. Bu tür karma malzeme işlerde her bölüm kendi malzemesine uygun yöntemle kaynatılır.',
            ] },
            { h2: 'Kesimden montaja tek akış', body: [
                'Parçalar [sac lazer kesim](/sac-lazer-kesim) ve [boru/profil lazer kesim](/boru-profil-lazer-kesim) ile hazırlanır, gerekiyorsa bükülür, ardından kaynak ağzı hazırlanarak birleştirilir. Kesimden gelen parçalar birbirine çizimdeki toleransla oturduğu için kaynak sırasında boşluk doldurmak ya da parçayı zorla yerine getirmek gerekmez; bu da çarpılmayı azaltır.',
            ] },
            { h2: 'Ne tür işler yapıyoruz?', body: [
                { ul: [
                    'Çelik taşıyıcı sistemler, ekipman tabanları ve kaynaklı çerçeveler',
                    'Makine gövdesi, muhafaza ve birleşim elemanları',
                    'Endüstriyel ve arıtma tesisatı için boru kavşakları, flanş kaynağı ve kollektörler',
                    'Teknik çizime göre özel konstrüksiyon ve montaj elemanları',
                ] },
                'Tekil parçalar, prototipler ve seri üretim aynı düzende yürütülüyor.',
            ] },
            { h2: 'Teklif öncesi', body: [
                'Çiziminizde kaynak sembolleri varsa bunları koruyun; yoksa hangi birleşimin sızdırmaz olması gerektiğini, hangi dikişin görünür yüzeyde kalacağını ve kaynak sonrası yüzeyden beklentinizi yazın. Paslanmaz işlerde dikkat edilmesi gerekenleri [paslanmaz çelik kaynaklı imalat süreçleri](/rehber/paslanmaz-celik-kaynakli-imalat-surecleri) yazısında ayrıca ele aldık.',
            ] },
            { h2: 'Kaynak çarpılmasını tasarımda azaltmak', body: [
                'Kaynak ısısı metali genleştirir; soğurken çeken dikiş parçayı kendine doğru çeker. Uzun ve ince parçalarda bu çarpılma ölçüyü bozabilir. Tasarım aşamasında alınabilecek birkaç önlem, kaynak sonrası düzeltme ihtiyacını azaltır:',
                { ul: [
                    'Dikişleri mümkün olduğunca simetrik yerleştirmek',
                    'Dikiş boyunu ve kalınlığını yükün gerektirdiğinden fazla tutmamak; sürekli dikiş yerine aralıklı dikiş yeterliyse belirtmek',
                    'Birleşecek parçaları kesim aşamasında birbirine geçecek şekilde tasarlamak; parçalar kaynak öncesi yerine oturur',
                    'Hassas ölçü gereken yüzeyleri kaynak bölgesinden uzak tutmak',
                ] },
            ] },
        ],
        related: ['paslanmaz-celik-kaynakli-imalat-surecleri', 'ankara-boru-profil-lazer-kesim', 'flansli-kaynakli-tesisat-baglanti-parcalari'],
    },
    {
        slug: 'paslanmaz-celik-kaynakli-imalat-surecleri',
        service: 'kaynakli-imalat',
        linkText: 'Paslanmaz Çelik Kaynaklı İmalat Süreçleri',
        h1: 'Paslanmaz Çelik Kaynaklı İmalat Süreçleri',
        seoTitle: 'Paslanmaz Çelik Kaynaklı İmalat: Malzeme, Yöntem, Yüzey',
        metaDescription: 'Paslanmaz kaynaklı imalatta 304 ile 316L seçimi, TIG ve MIG kullanımı, kaynak öncesi temizlik, kaynak sonrası renk değişimi ve yüzey beklentisi.',
        keywords: ['paslanmaz kaynaklı imalat', 'paslanmaz TIG kaynak', '316L kaynak'],
        lead: 'Paslanmaz çelikte kaynak, karbon çeliğe göre daha fazla özen ister. Malzemenin korozyon direncini koruyan şey yüzeyidir; kaynak sırasında ya da öncesinde bu yüzeye zarar veren her şey, parçanın ileride paslanma riskini artırır. Bu yazı, paslanmaz kaynaklı bir iş sipariş etmeden önce bilinmesi faydalı noktaları topluyor.',
        sections: [
            { h2: '304 mü, 316L mi?', body: [
                'AISI 304 genel paslanmaz uygulamalarında en yaygın kullanılan gruptur. AISI 316 ve 316L ise içerdiği molibden sayesinde klorür içeren ortamlarda daha dayanıklıdır; kimya tesisleri ve denizcilik uygulamalarında tercih edilir. "L" harfi düşük karbonu ifade eder; kaynak bölgesinde korozyon direncinin korunmasına yardımcı olduğu için kaynaklı imalatta sık seçilir.',
            ] },
            { h2: 'TIG ve MIG nerede kullanılır?', body: [
                'TIG kaynak ince saclarda ve görünür dikişlerde daha kontrollü ve temiz bir sonuç verir; tank, kollektör ve gıda ekipmanı gibi işlerde öne çıkar. MIG kaynak daha kalın kesitlerde ve uzun dikişlerde üretimi hızlandırır. Hangi birleşimde hangisinin kullanılacağı parçanın kalınlığına, dikişin görünürlüğüne ve kullanım ortamına göre belirlenir.',
            ] },
            { h2: 'Kaynak öncesi: temizlik ve ayrı çalışma', body: [
                'Paslanmaz yüzeyine yağ, boya kalıntısı ya da karbon çelik tozu bulaşması, kaynaktan sonra lekelenme ve pas noktaları olarak geri döner. Bu nedenle paslanmaz parçaların karbon çelikle temas etmeden işlenmesi ve birleşim bölgelerinin kaynak öncesi temizlenmesi önemlidir.',
            ] },
            { h2: 'Kaynak sonrası: renk değişimi ve yüzey', body: [
                'Kaynak bölgesinde oluşan sarıdan maviye uzanan renk değişimi, yüzeydeki koruyucu tabakanın ısıdan etkilendiğini gösterir. Gıda, ilaç ve hijyenik uygulamalarda bu bölgelerin nasıl bir yüzeyle teslim edileceği baştan konuşulmalıdır. Asitleme, pasivasyon ya da belirli bir yüzey pürüzlülüğü gibi şartlarınız varsa bunları teklif talebinizde açıkça belirtin.',
            ] },
            { h2: 'Hangi ürünlerde karşımıza çıkıyor?', body: [
                'Su depoları, gıda tankları, kollektörler, proses tesisatı ve paslanmaz konstrüksiyonlar paslanmaz kaynaklı imalatın en sık görüldüğü işler. Ürün grupları için [paslanmaz imalat](/paslanmaz-imalat) sayfamıza, tasarım aşaması için [paslanmaz kollektör imalatı](/rehber/paslanmaz-kollektor-imalati) ve [paslanmaz su deposu ve tank imalatı](/rehber/paslanmaz-su-deposu-tank-imalati) yazılarına göz atabilirsiniz.',
            ] },
        ],
        related: ['ankara-kaynakli-metal-imalat', 'paslanmaz-kollektor-imalati', 'ankara-ivedik-paslanmaz-celik-imalati'],
    },

    /* ---------------- 5. PASLANMAZ İMALAT ---------------- */
    {
        slug: 'ankara-ivedik-paslanmaz-celik-imalati',
        service: 'paslanmaz-imalat',
        linkText: 'Ankara İvedik Paslanmaz Çelik İmalatı',
        h1: 'Ankara İvedik Paslanmaz Çelik İmalatı',
        seoTitle: 'Ankara İvedik Paslanmaz Çelik İmalatı: Ürünler ve Ölçüler',
        metaDescription: 'İvedik OSB\'de AISI 304, 316 ve 316L paslanmaz sac, boru ve profil imalatı: su deposu, gıda tankı, kollektör, eşanjör ve tesisat; 2B, BA ve fırçalı yüzey seçenekleri.',
        keywords: ['Ankara paslanmaz imalat', 'İvedik paslanmaz çelik imalatı', 'paslanmaz imalat atölyesi Ankara'],
        lead: 'Paslanmaz bir ürün sipariş ederken üç şeyi baştan netleştirmek gerekir: hangi malzeme grubu, hangi yüzey ve parçanın nerede kullanılacağı. İvedik OSB\'deki atölyemizde paslanmaz işleri bu üç bilgi üzerinden planlıyoruz.',
        sections: [
            { h2: 'Malzeme, ölçü ve yüzey', body: [
                { ul: [
                    'Malzeme grupları: AISI 304, AISI 316 / 316L ve türevleri',
                    'Sac kalınlığı: 0,5 – 12 mm',
                    'Boru çapı: Ø 21,3 – 219,1 mm',
                    'Yüzey: 2B, BA, fırçalı',
                    'Kaynak: TIG / MIG',
                ] },
                'Paslanmaz sac, boru, profil ve özel kesitler aynı atölyede kesilip bükülerek kaynaklanıyor.',
            ] },
            { h2: 'Ürettiğimiz paslanmaz ürün grupları', body: [
                { ul: [
                    'İçme ve proses suyu için paslanmaz su depoları',
                    'Hijyen şartlarına uygun gıda tankları ve depolama ekipmanı',
                    'Kimya ve proses hatları için reaktör gövdeleri',
                    'Isı transferi uygulamaları için borulu eşanjörler',
                    'Dağıtım ve toplama işlevi gören kollektörler',
                    'Proje bazlı paslanmaz tesisat hatları',
                    'Partikül ve tortu ayrıştırma ekipmanları',
                    'Teknik çizime göre paslanmaz makine ve ekipman parçaları',
                ] },
                'Tank ve kollektör tasarımında dikkat edilecek noktaları [paslanmaz su deposu ve tank imalatı](/rehber/paslanmaz-su-deposu-tank-imalati) ile [paslanmaz kollektör imalatı](/rehber/paslanmaz-kollektor-imalati) yazılarında ayrıntılandırdık.',
            ] },
            { h2: 'Hangi sektörlere çalışıyoruz?', body: [
                'Su, gaz ve proses arıtma sistemleri; hijyenik üretim gerektiren gıda ve ilaç tesisleri; korozyon direnci nedeniyle 316/316L kullanılan kimya tesisleri ve genel endüstriyel tesisler paslanmaz işlerimizin büyük kısmını oluşturuyor.',
            ] },
            { h2: 'Teklif talebinde yüzey ve kalite beklentisi', body: [
                'Paslanmazda fiyatı ve süreci en çok etkileyen bilgi, görünür yüzeylerin ve kaynak bölgelerinin nasıl teslim edileceğidir. Yüzey sınıfı, kaynak sonrası temizlik ve varsa test ya da belge gereksinimlerinizi [teklif talebinizde](/teklif-al) belirtin. Kaynakla ilgili ayrıntılar için [paslanmaz çelik kaynaklı imalat süreçleri](/rehber/paslanmaz-celik-kaynakli-imalat-surecleri) yazısına bakabilirsiniz.',
            ] },
        ],
        related: ['paslanmaz-kollektor-imalati', 'paslanmaz-su-deposu-tank-imalati', 'paslanmaz-celik-kaynakli-imalat-surecleri'],
    },
    {
        slug: 'paslanmaz-kollektor-imalati',
        service: 'paslanmaz-imalat',
        linkText: 'Paslanmaz Kollektör İmalatı ve Kullanım Alanları',
        h1: 'Paslanmaz Kollektör İmalatı ve Kullanım Alanları',
        seoTitle: 'Paslanmaz Kollektör İmalatı: Tasarım ve Kullanım Alanları',
        metaDescription: 'Paslanmaz kollektör nedir, nerede kullanılır? Gövde çapı, çıkış sayısı, bağlantı tipi, malzeme ve yüzeyle siparişte tanımlanması gereken bilgiler.',
        keywords: ['paslanmaz kollektör imalatı', 'paslanmaz kolektör', 'kollektör imalatı Ankara'],
        lead: 'Kollektör, akışkanı tek bir ana borudan birden fazla hatta dağıtan ya da birden fazla hattan gelen akışkanı tek boruda toplayan tesisat elemanıdır. Basit bir parça gibi görünse de çıkışların konumu, bağlantı tipi ve malzemesi tüm tesisatın montajını etkiler.',
        sections: [
            { h2: 'Kollektör ne işe yarar?', body: [
                'Birden fazla tüketiciye ya da hatta aynı kaynaktan akışkan dağıtmak gereken her yerde kollektör kullanılır. Hatları tek noktada topladığı için vana, ölçüm ve bakım noktalarını da bir araya getirir; tesisatın okunmasını ve işletilmesini kolaylaştırır.',
            ] },
            { h2: 'Siparişte tanımlanması gerekenler', body: [
                { ul: [
                    'Ana gövde çapı, et kalınlığı ve boyu',
                    'Çıkış sayısı, her çıkışın çapı ve çıkışlar arası mesafe',
                    'Çıkışların yönü (aynı hat üzerinde, karşılıklı ya da farklı açılarda)',
                    'Bağlantı tipi: flanşlı, kaynaklı ya da vidalı',
                    'Malzeme: AISI 304 ya da 316/316L',
                    'Ayak, konsol ya da taşıyıcı ihtiyacı',
                    'Yüzey beklentisi ve varsa sızdırmazlık veya basınç testi gerekliliği',
                ] },
                'Kollektörün bağlanacağı ekipmanın ölçüleri biliniyorsa çizime eklemek, sahada uyumsuzluk riskini azaltır.',
            ] },
            { h2: 'Kullanım alanları', body: [
                { h3: 'Su arıtma sistemleri', body: [
                    'Arıtma ünitelerinde filtreler ve tanklar arasındaki dağıtım ve toplama hatlarında paslanmaz kollektörler kullanılır. Bu sistemlerdeki diğer ekipmanlar için [arıtma sistemleri](/aritma-sistemleri) sayfamıza bakabilirsiniz.',
                ] },
                { h3: 'Gıda, ilaç ve proses hatları', body: [
                    'Hijyenik üretim hatlarında temizlenebilir yüzey ve doğru malzeme seçimi kollektör tasarımının parçasıdır.',
                ] },
                { h3: 'Isıtma ve soğutma tesisatı', body: [
                    'Chiller ve benzeri endüstriyel soğutma tesisatlarında gidiş ve dönüş hatlarını dağıtan kollektörler, borulama ve bağlantı sistemlerinin merkezinde yer alır.',
                ] },
            ] },
            { h2: 'Üretim nasıl ilerliyor?', body: [
                'Ana gövde ve çıkış boruları [boru lazer kesimle](/boru-profil-lazer-kesim) ölçüsünde kesilir, branşman ağızları gövde üzerinde aynı tezgahta açılır. Ardından çıkışlar ve flanşlar TIG kaynakla birleştirilir. Kollektörü atölyede montaja hazır, ölçülü tesisat parçalarıyla birlikte üretmek istiyorsanız [endüstriyel paslanmaz boru ve kollektör üretimi](/rehber/endustriyel-paslanmaz-boru-kollektor-uretimi) yazısı modüler yaklaşımı anlatıyor.',
            ] },
        ],
        related: ['endustriyel-paslanmaz-boru-kollektor-uretimi', 'paslanmaz-celik-kaynakli-imalat-surecleri', 'ankara-ivedik-paslanmaz-celik-imalati'],
    },
    {
        slug: 'paslanmaz-su-deposu-tank-imalati',
        service: 'paslanmaz-imalat',
        linkText: 'Paslanmaz Su Deposu ve Tank İmalatı',
        h1: 'Paslanmaz Su Deposu ve Tank İmalatı',
        seoTitle: 'Paslanmaz Su Deposu ve Gıda Tankı İmalatı: Tasarım Rehberi',
        metaDescription: 'Paslanmaz su deposu ve gıda tankı siparişinde hacim, yerleşim, bağlantı ağızları, menhol, malzeme ve iç yüzey seçimi için kontrol listesi.',
        keywords: ['paslanmaz su deposu imalatı', 'paslanmaz tank imalatı', 'paslanmaz gıda tankı'],
        lead: 'Paslanmaz tank siparişinde en sık yapılan hata, yalnızca hacmi söyleyip gerisini üreticiye bırakmaktır. Oysa aynı hacimdeki iki tank; yerleşim, bağlantı ağızları ve iç yüzey beklentisine göre birbirinden çok farklı olabilir.',
        sections: [
            { h2: 'Hangi amaçla depolanacak?', body: [
                'İçme suyu, proses suyu ve gıda ürünleri farklı hijyen beklentileri doğurur. Depolanacak akışkanı ve tankın temizlenme şeklini baştan belirtmek, malzeme ve yüzey seçimini doğrudan belirler.',
            ] },
            { h2: 'Malzeme: 304 mü, 316L mi?', body: [
                'Genel su depolama ve çoğu gıda uygulamasında AISI 304 yeterlidir. Klorür içeriği yüksek su, tuzlu ürünler ya da agresif temizlik kimyasalları söz konusuysa AISI 316/316L tercih edilir. Kararsız kaldığınızda kullanım koşullarını paylaşmanız, doğru seçimi birlikte yapmamızı sağlar.',
            ] },
            { h2: 'Tasarımda konuşulacak başlıklar', body: [
                { ul: [
                    'Hacim ve yerleşim alanı: dik mi yatay mı, tavan yüksekliği ve kapı genişliği',
                    'Bağlantı ağızları: giriş, çıkış, taşma, boşaltma ve havalık',
                    'Menhol ve kapak: bakım ve temizlik erişimi',
                    'Ayak, kaide ya da taşıyıcı konstrüksiyon',
                    'Seviye göstergesi ve sensör bağlantıları',
                    'İç ve dış yüzey: 2B, BA ya da fırçalı',
                ] },
                'Tankın binaya nasıl gireceği çoğu zaman göz ardı edilir. Kapıdan ya da merdivenden geçmeyecek bir tank, sahada parçalı montaj gerektirebilir; bu durumu baştan bilmek tasarımı değiştirir.',
            ] },
            { h2: 'Hijyenik tanklarda dikkat edilenler', body: [
                'Gıda tanklarında iç köşelerin ve kaynak dikişlerinin temizlenebilir olması, ürünün birikebileceği ölü bölgelerin olmaması beklenir. İç yüzey ve kaynak bölgesi yüzeyi için özel bir şartınız varsa teklif talebinde belirtin; kaynak tarafını [paslanmaz çelik kaynaklı imalat süreçleri](/rehber/paslanmaz-celik-kaynakli-imalat-surecleri) yazısında anlattık.',
            ] },
            { h2: 'Arıtma tanklarıyla farkı', body: [
                'Bu yazı depolama tanklarını konu alıyor. Filtre gövdesi ve arıtma prosesindeki tanklar farklı tasarım girdileri ister; onlar için [su arıtma sistemleri için tank ve filtre gövdesi üretimi](/rehber/su-aritma-tank-filtre-govdesi-uretimi) yazısına bakabilirsiniz.',
            ] },
        ],
        related: ['paslanmaz-kollektor-imalati', 'su-aritma-tank-filtre-govdesi-uretimi', 'ankara-ivedik-paslanmaz-celik-imalati'],
    },

    /* ---------------- 6. ALÜMİNYUM İMALAT ---------------- */
    {
        slug: 'ankara-aluminyum-imalat',
        service: 'aluminyum-imalat',
        linkText: 'Ankara Alüminyum İmalat Hizmetleri',
        h1: 'Ankara Alüminyum İmalat Hizmetleri',
        seoTitle: 'Ankara Alüminyum İmalat: Kesim, Büküm ve TIG Kaynak',
        metaDescription: 'İvedik OSB\'de 1050, 5052 ve 6061 alüminyum sac, profil ve boru imalatı: 0,5–10 mm lazer kesim, CNC büküm, TIG kaynak; hafif konstrüksiyon, panel ve prototip üretimi.',
        keywords: ['Ankara alüminyum imalat', 'alüminyum kaynak Ankara', 'alüminyum sac imalatı'],
        lead: 'Alüminyum genellikle ağırlığın önemli olduğu yerlerde seçilir; ama kesimi, bükümü ve kaynağı çelikten farklı davranır. Alüminyum işlerini çelik ve paslanmaz imalatla aynı atölyede yürütmemiz, karma malzeme projelerde tek muhatap olmanızı sağlıyor.',
        sections: [
            { h2: 'Malzeme ve ölçüler', body: [
                { ul: [
                    'Alaşımlar: 1050, 5052, 6061',
                    'Sac kalınlığı: 0,5 – 10 mm (lazer kesim)',
                    'Büküm: 0,5 – 8 mm',
                    'Profil: kare, dikdörtgen ve L kesit; yuvarlak boru',
                    'Kaynak: TIG',
                ] },
            ] },
            { h2: 'Hangi işlerde kullanılıyor?', body: [
                { ul: [
                    'Ağırlık kısıtı olan taşıma sistemleri ve platformlar',
                    'Endüstriyel makine kapakları, muhafazalar ve gövde elemanları',
                    'Teknik çizime göre panel, çerçeve ve özel form parçalar',
                    'Mühendislik projeleri için prototip ve küçük seri parçalar',
                ] },
            ] },
            { h2: 'Karma malzeme projelerde tek tedarikçi', body: [
                'Çelik bir şase üzerine alüminyum kapaklar ya da paslanmaz bir hazneyle birlikte alüminyum paneller gibi işlerde, her malzeme kendi yöntemiyle işlenir ama proje tek akışta ilerler. Parçalar ayrı atölyelerden gelmediği için montajda ölçü uyumsuzluğu yaşanmaz.',
            ] },
            { h2: 'Alaşım seçimi önemli', body: [
                'Bükülecek bir parçada alaşım seçimi, çatlama riskini ve dolayısıyla tasarımı doğrudan etkiler. Hangi alaşımın kesim, büküm ve kaynakta nasıl davrandığını [alüminyum sac ve profil işleme yöntemleri](/rehber/aluminyum-sac-profil-isleme-yontemleri) yazısında karşılaştırdık. Çiziminizle birlikte alaşım bilgisini [teklif talebinize](/teklif-al) eklemeyi unutmayın.',
            ] },
            { h2: 'Alüminyum siparişinde belirtilmesi gerekenler', body: [
                { ul: [
                    'Alaşım ve sertlik durumu (ör. 5052-H32, 6061-T6); yalnızca "alüminyum" yazmak yetmez',
                    'Görünür yüzeylerde çizik kabul edilip edilmediği; gerekiyorsa koruyucu folyolu sac talebi',
                    'Kaynak dikişlerinin görünür yüzeyde kalıp kalmayacağı',
                    'Parçanın çelik ya da paslanmaz parçalarla temas edeceği noktalar',
                ] },
                'Son madde sık atlanır: alüminyum, nemli ortamda çelikle doğrudan temas ettiğinde temas bölgesinde korozyon görülebilir. Karma malzeme montajlarında bu noktalarda ayırıcı bir ara eleman kullanmak tasarım aşamasında düşünülmelidir.',
            ] },
        ],
        related: ['aluminyum-sac-profil-isleme-yontemleri', 'profil-lazer-kesim-kullanim-alanlari'],
    },
    {
        slug: 'aluminyum-sac-profil-isleme-yontemleri',
        service: 'aluminyum-imalat',
        linkText: 'Alüminyum Sac ve Profil İşleme Yöntemleri',
        h1: 'Alüminyum Sac ve Profil İşleme Yöntemleri',
        seoTitle: 'Alüminyum Sac ve Profil İşleme: Kesim, Büküm, Kaynak',
        metaDescription: 'Alüminyumun lazer kesimde, CNC bükümde ve TIG kaynakta çelikten farklı davranışı; 1050, 5052 ve 6061 alaşımlarının hangi işleme daha uygun olduğu.',
        keywords: ['alüminyum sac işleme', 'alüminyum büküm', 'alüminyum profil işleme'],
        lead: 'Alüminyum hafif ve kolay işlenen bir malzeme olarak bilinir, ama her alaşım her işleme aynı ölçüde uygun değildir. Kesim, büküm ve kaynak aşamalarında alüminyumu çelikten ayıran noktaları bilmek, tasarımı daha ilk çizimde doğru kurmayı sağlar.',
        sections: [
            { h2: 'Lazer kesim', body: [
                'Alüminyum ışığı güçlü yansıtır ve ısıyı hızla dağıtır; bu yüzden aynı kalınlıktaki çelikten farklı kesim ayarları gerektirir. Sac lazerde 0,5 – 10 mm aralığındaki alüminyum sacları kesiyoruz. Kalınlık arttıkça kesim kenarının görünümü konusundaki beklentiyi baştan konuşmak faydalı olur.',
            ] },
            { h2: 'Büküm', body: [
                'Alüminyumun bükülebilirliği alaşıma ve sertlik durumuna göre belirgin şekilde değişir. 1050 gibi yumuşak alaşımlar kolay bükülür. 5052, şekillendirilebilirlik ile mukavemeti dengelediği için bükümlü parçalarda sık tercih edilir. 6061 gibi ısıl işlemle sertleştirilmiş alaşımlarda dar yarıçaplı büküm çatlamaya yol açabilir; bu alaşımla bükümlü bir parça tasarlıyorsanız büküm yarıçapını önceden konuşmak gerekir. Büküm aralığımız 0,5 – 8 mm.',
            ] },
            { h2: 'TIG kaynak', body: [
                'Alüminyumun yüzeyindeki oksit tabakası kaynağı zorlaştırır; bu nedenle alüminyum kaynağını TIG yöntemiyle yapıyoruz. Isıl işlemli alaşımlarda kaynak bölgesi çevresinde mukavemet düşebileceği için, taşıyıcı alüminyum konstrüksiyonlarda kaynak yerleri tasarımda dikkate alınmalıdır.',
            ] },
            { h2: 'Profil ve boru işleme', body: [
                'Kare, dikdörtgen ve L kesitli profiller ile yuvarlak alüminyum borular [boru/profil lazer kesimle](/boru-profil-lazer-kesim) boyuna kesilip delinebilir. Çerçeveli panel ve hafif şase işlerinde profil kesimi ile sac parçalar aynı projede birleşir.',
            ] },
            { h2: 'Kısa alaşım karşılaştırması', body: [
                { ul: [
                    '1050: yumuşak, kolay şekillenir; düşük mukavemet gerektiren kaplama ve panel işleri',
                    '5052: büküm ve kaynağa uygun, korozyon direnci iyi; muhafaza, kapak ve gövde parçaları',
                    '6061: mukavemeti yüksek; dar yarıçaplı bükümde dikkat ister, yapısal parçalar',
                ] },
                'Alüminyum imalat kapsamımızın genel çerçevesi için [Ankara alüminyum imalat hizmetleri](/rehber/ankara-aluminyum-imalat) yazısına göz atabilirsiniz.',
            ] },
        ],
        related: ['ankara-aluminyum-imalat', 'cnc-sac-bukum-olcu-aci-planlamasi'],
    },

    /* ---------------- 7. METAL İŞLEME ---------------- */
    {
        slug: 'ivedik-osb-metal-isleme-ozel-parca',
        service: 'metal-isleme',
        linkText: 'İvedik OSB Metal İşleme ve Özel Parça Üretimi',
        h1: 'İvedik OSB Metal İşleme ve Özel Parça Üretimi',
        seoTitle: 'İvedik OSB Metal İşleme: Özel Parça ve Yedek Parça Üretimi',
        metaDescription: 'İvedik OSB\'de çelik, paslanmaz, alüminyum ve galvanizli malzemede kesim, delme, CNC büküm ve kaynak; numuneden yedek parça üretimi ve sanayi ekipmanı parçaları.',
        keywords: ['İvedik metal imalat', 'İvedik OSB metal işleme', 'Ankara özel parça imalatı'],
        lead: 'Bir makinenin kırılan bağlantı parçası, standart katalogda bulunmayan bir konsol ya da üç farklı işlemden geçmesi gereken küçük bir seri… Bu tür işler genellikle birden fazla atölye dolaştırılır. İvedik OSB\'deki atölyemizde kesimden kaynağa kadar olan adımlar tek yerde yapılıyor.',
        sections: [
            { h2: 'Metal işleme kapsamımız', body: [
                { ul: [
                    'Lazer kesim: sac ile boru ve profil',
                    'Delme ve kanal açma: lazerle ve mekanik olarak',
                    'Form verme: CNC büküm',
                    'Birleştirme: MIG ve TIG kaynak',
                ] },
                'Karbon çelik (DKP, St37, St52), paslanmaz (AISI 304/316), alüminyum ve galvanizli malzemelerle çalışıyoruz.',
            ] },
            { h2: 'Numuneden yeniden üretim', body: [
                'Hasar gören ya da ömrünü tamamlayan bir metal parçanın çizimi her zaman bulunmaz. Bu durumda parçanın kendisi numune olarak kullanılabilir. Numuneyle birlikte parçanın nerede ve hangi yük altında çalıştığını, bilinen malzeme bilgisini ve kaç adet gerektiğini paylaşmanız, doğru ölçü ve malzemeyle yeniden üretimi mümkün kılar.',
            ] },
            { h2: 'Kimler için çalışıyoruz?', body: [
                'Sanayi ekipmanı ve makine aksamı kullanan işletmeler, çelik konstrüksiyon için birleşim plakası ve takviye elemanı arayan montaj ekipleri, boru ve tesisat sistemleri için flanş, destek ve bağlantı elemanı ihtiyacı olan tesisatçılar en sık çalıştığımız gruplar. Yenimahalle\'de, İvedik OSB ile OSTİM\'in bulunduğu sanayi aksında faaliyet gösteren firmalar için numuneyi getirip ölçüyü yerinde konuşmak çoğu zaman en hızlı yoldur.',
            ] },
            { h2: 'Çizimle çalışmak isterseniz', body: [
                'Elinizde teknik çizim varsa süreç daha hızlı ilerler. Çiziminizin üretime hazır olup olmadığını [teknik çizime göre metal parça imalatı](/rehber/teknik-cizime-gore-metal-parca-imalati) yazısındaki kontrollerle değerlendirebilir, ardından [teklif talebi](/teklif-al) oluşturabilirsiniz.',
            ] },
            { h2: 'Kısa seri işlerde süreyi kısaltan bilgiler', body: [
                'Birkaç adetlik işlerde üretimin kendisinden çok hazırlık süresi belirleyicidir. Şu bilgileri baştan vermeniz, işin sıraya hızlı girmesini sağlar:',
                { ul: [
                    'Kesin adet ve aynı parçanın ileride tekrar sipariş edilip edilmeyeceği',
                    'Malzemenin kimden sağlanacağı',
                    'Parçanın hangi işlemlerden geçeceği: yalnızca kesim mi, büküm ve kaynak da mı',
                    'Takılacağı yerdeki karşı parçanın ölçüleri ya da fotoğrafı',
                ] },
            ] },
        ],
        related: ['teknik-cizime-gore-metal-parca-imalati', 'ankara-ozel-makine-metal-parca-imalati'],
    },
    {
        slug: 'teknik-cizime-gore-metal-parca-imalati',
        service: 'metal-isleme',
        linkText: 'Teknik Çizime Göre Metal Parça İmalatı',
        h1: 'Teknik Çizime Göre Metal Parça İmalatı',
        seoTitle: 'Teknik Çizime Göre Metal Parça İmalatı: Çiziminiz Hazır mı?',
        metaDescription: 'Üretime hazır bir teknik çizimde bulunması gerekenler: ölçü, tolerans, malzeme notu, yüzey, revizyon, adet ve dosya formatı. Kısa kontrol listesi.',
        keywords: ['teknik çizime göre metal parça', 'teknik resimden imalat', 'metal parça imalatı çizim'],
        lead: 'Teknik çizim, üreticiyle aranızdaki sözleşmedir: çizimde yazmayan bir şey üretimde tahmin edilir. Bu yazı, metal parça siparişi vermeden önce çiziminizin üretime hazır olup olmadığını kontrol etmeniz için hazırlandı.',
        sections: [
            { h2: 'Çizimde mutlaka olması gerekenler', body: [
                { h3: 'Ölçüler ve toleranslar', body: [
                    'Her ölçünün bir referanstan verilmesi ve montajda kritik olan ölçülere tolerans yazılması gerekir. Tolerans yazılmayan ölçüler genel imalat toleransıyla üretilir; bir milin geçeceği delik ya da başka bir parçaya oturacak yüzey için bu yeterli olmayabilir.',
                ] },
                { h3: 'Malzeme notu', body: [
                    '"Çelik" yazmak yeterli değildir. DKP, St37, St52, galvanizli, AISI 304, AISI 316 ya da alüminyum alaşımı ve kalınlık bilgisi çizimde ya da antette yer almalıdır.',
                ] },
                { h3: 'Yüzey ve son işlem', body: [
                    'Parçanın kaynak sonrası nasıl teslim edileceği, görünür yüzeylerde çizik ya da iz kabul edilip edilmediği gibi beklentiler yazılmalıdır.',
                ] },
                { h3: 'Revizyon ve adet', body: [
                    'Aynı parçanın birden fazla sürümü dolaşıyorsa hangi revizyonun üretileceği açık olmalıdır. Adet bilgisi de yöntem seçimini etkiler.',
                ] },
            ] },
            { h2: 'Hangi dosya formatı?', body: [
                'Kesim için DXF veya DWG, ölçü ve tolerans için PDF teknik resim en yaygın kombinasyondur. Karmaşık parçalarda STEP gibi 3B formatlar veya SolidWorks dosyaları, delik ve kanal konumlarının yanlış okunma ihtimalini azaltır.',
            ] },
            { h2: 'Üretilebilirlik: çizim doğru ama yapılabilir mi?', body: [
                'Bazı tasarımlar çizimde doğru görünür ama üretimde sorun çıkarır: büküm çizgisine çok yakın delikler, kalınlığa göre çok küçük delikler ya da kaynak torcunun ulaşamayacağı birleşimler gibi. Bu tür noktaları teklif aşamasında size bildiriyoruz; büküm tarafındaki örnekler için [CNC sac bükümde ölçü ve açı planlaması](/rehber/cnc-sac-bukum-olcu-aci-planlamasi) yazısına bakabilirsiniz.',
            ] },
            { h2: 'Kontrol listesi', body: [
                { ul: [
                    'Ölçüler tek referanstan ve kritik olanlar toleranslı mı?',
                    'Malzeme ve kalınlık yazılı mı?',
                    'Yüzey ve son işlem beklentisi belirtildi mi?',
                    'Geçerli revizyon ve adet açık mı?',
                    'Kesim için DXF/DWG, ölçü için PDF ya da 3B model ekli mi?',
                ] },
                'Çiziminiz henüz yoksa ya da yalnızca bir fikir aşamasındaysanız [teknik çizimden üretime özel imalat süreci](/rehber/teknik-cizimden-uretime-ozel-imalat-sureci) yazısı sürecin nasıl başladığını anlatıyor.',
            ] },
        ],
        related: ['ivedik-osb-metal-isleme-ozel-parca', 'dxf-dwg-lazer-kesim-hazirligi', 'teknik-cizimden-uretime-ozel-imalat-sureci'],
    },

    /* ---------------- 8. ÖZEL PROJE İMALATI ---------------- */
    {
        slug: 'ankara-ozel-makine-metal-parca-imalati',
        service: 'ozel-proje-imalati',
        linkText: 'Ankara Özel Makine ve Metal Parça İmalatı',
        h1: 'Ankara Özel Makine ve Metal Parça İmalatı',
        seoTitle: 'Ankara Özel Makine Parçası ve Metal Ekipman İmalatı',
        metaDescription: 'Standart dışı makine gövdesi, şase, muhafaza ve ekipman parçalarının teknik çizim ya da numuneye göre imalatı; prototip, tek parça ve küçük seri üretim, İvedik OSB.',
        keywords: ['Ankara özel makine imalatı', 'özel makine parçası imalatı', 'Ankara metal parça imalatı'],
        lead: 'Özel bir makine geliştiren bir ekibin en çok zaman kaybettiği yer, metal aksamın üretimidir: şase bir yerde, muhafaza başka bir yerde, bağlantı parçaları üçüncü bir atölyede yapılır. Bu yazıda makinenin metal gövde ve parçalarını teknik çizime göre nasıl tek elden üretebildiğimizi anlatıyoruz.',
        sections: [
            { h2: 'Hangi parçaları üretiyoruz?', body: [
                { ul: [
                    'Makine şaseleri, gövdeler ve taşıyıcı çerçeveler',
                    'Muhafazalar, kapaklar ve koruma panelleri',
                    'Standart dışı boyut ve forma sahip makine parçaları',
                    'Endüstriyel ekipman aksamı, yedek parça ve ısmarlama bileşenler',
                    'Teknik çizime göre paslanmaz makine ve ekipman parçaları',
                ] },
                'Çelik, paslanmaz ve alüminyum parçalar kesim, büküm ve kaynak adımlarıyla aynı atölyede üretiliyor.',
            ] },
            { h2: 'Prototip, tek parça ve küçük seri', body: [
                'Makine geliştirme süreçlerinde önce bir prototip, ardından düzeltilmiş bir ikinci sürüm ve sonra küçük bir seri gelir. Her aşamadaki çizim değişikliğini üretim bilgilerine işliyoruz; böylece prototipten seriye geçerken parçalar baştan tanımlanmak zorunda kalmıyor.',
            ] },
            { h2: 'Tasarım ekibiyle çalışma şekli', body: [
                'Makinenin mekanik tasarımı genellikle sizin ekibinizdedir; biz metal parçaların üretilebilirliği açısından geri bildirim veririz: bir büküm yarıçapının değiştirilmesi, bir kaynak birleşiminin kesim aşamasında geçmeli hazırlanması ya da bir parçanın iki parçaya bölünmesi gibi. Bu geri bildirim, üretim maliyetini ve montaj süresini çoğu zaman tasarım değişikliğinden fazla etkiler.',
            ] },
            { h2: 'Ankara\'dan ve çevre sanayi bölgelerinden', body: [
                'Atölyemiz Yenimahalle\'de, İvedik OSB\'de. Ankara\'daki makine imalatçıları ve proje ekipleri için prototip parçayı birlikte değerlendirmek kolay. Çiziminiz hazır değilse süreç nasıl başlar sorusunun cevabı [teknik çizimden üretime özel imalat süreci](/rehber/teknik-cizimden-uretime-ozel-imalat-sureci) yazısında; hazırsa [teklif talebinizi](/teklif-al) iletebilirsiniz.',
            ] },
        ],
        related: ['teknik-cizimden-uretime-ozel-imalat-sureci', 'ankara-kaynakli-metal-imalat', 'ivedik-osb-metal-isleme-ozel-parca'],
    },
    {
        slug: 'teknik-cizimden-uretime-ozel-imalat-sureci',
        service: 'ozel-proje-imalati',
        linkText: 'Teknik Çizimden Üretime Özel İmalat Süreci',
        h1: 'Teknik Çizimden Üretime Özel İmalat Süreci',
        seoTitle: 'Özel İmalat Süreci: Fikirden ve Çizimden Üretime Adımlar',
        metaDescription: 'Özel proje imalatı nasıl ilerler? İhtiyacın tanımlanması, çizim ya da numuneyle başlama, ön değerlendirme, prototip, onay ve küçük seriye geçiş adımları.',
        keywords: ['özel imalat süreci', 'teknik çizimden üretime', 'özel proje imalatı'],
        lead: 'Özel bir parça ya da konstrüksiyon için teklif istemek, katalogdan ürün sipariş etmeye benzemez. İş bir ihtiyaçla başlar, çizimle ya da numuneyle somutlaşır ve onaylanan bir prototiple seriye geçer. Bu yazı o yolun adımlarını anlatıyor.',
        sections: [
            { h2: '1. İhtiyacın tanımlanması', body: [
                'Parçanın ne işe yarayacağı, hangi ortamda ve hangi yük altında çalışacağı, nereye monte edileceği ve kaç adet gerektiği ilk konuşulan konulardır. Bu bilgiler malzeme grubunu (çelik, paslanmaz, alüminyum) ve üretim yöntemini belirler.',
            ] },
            { h2: '2. Çizim, numune ya da sözlü tanım', body: [
                'En hızlı başlangıç DXF, DWG ya da PDF formatında bir teknik çizimdir. Çizim yoksa elinizdeki numune ya da ölçüleri içeren sözlü bir teknik tanım da başlangıç olabilir. Bu durumda üretime geçmeden önce ölçülerin birlikte netleştirilmesi gerekir.',
            ] },
            { h2: '3. Ön değerlendirme ve teklif', body: [
                'Çizim ya da tanım üzerinden üretilebilirlik değerlendirilir: hangi kısımlar lazerle kesilecek, hangileri bükülecek, birleşimler nasıl kaynatılacak. Gerekirse tasarımda küçük değişiklikler önerilir. Teklif, bu değerlendirmeden sonra netleşen iş tanımına göre hazırlanır.',
            ] },
            { h2: '4. Prototip ve onay', body: [
                'Yeni bir parçada önce tek bir prototip üretmek, montajda ve kullanımda ortaya çıkabilecek sorunları seriden önce yakalamanın en ucuz yoludur. Prototip üzerinde yapılan düzeltmeler çizime işlenir.',
            ] },
            { h2: '5. Küçük seri ve tekrar siparişler', body: [
                'Onaylanan çizimle küçük seri üretime geçilir. Onaylanan çizim esas alındığı için aynı parçanın tekrar siparişinde ilk üretimdeki ölçülere bağlı kalınır.',
            ] },
            { h2: 'Süreci hızlandırmak için', body: [
                'Çiziminizi göndermeden önce [teknik çizime göre metal parça imalatı](/rehber/teknik-cizime-gore-metal-parca-imalati) yazısındaki kontrol listesini gözden geçirmeniz, ön değerlendirme aşamasını kısaltır. Özel proje kapsamımızın genel çerçevesi için [özel proje imalatı](/ozel-proje-imalati) sayfasına bakabilirsiniz.',
            ] },
        ],
        related: ['ankara-ozel-makine-metal-parca-imalati', 'teknik-cizime-gore-metal-parca-imalati'],
    },

    /* ---------------- 9. MODÜLER TESİSAT SİSTEMLERİ ---------------- */
    {
        slug: 'ankara-moduler-tesisat-sistemleri-imalati',
        service: 'moduler-tesisat-sistemleri',
        linkText: 'Ankara Modüler Tesisat Sistemleri İmalatı',
        h1: 'Ankara Modüler Tesisat Sistemleri İmalatı',
        seoTitle: 'Ankara Modüler Tesisat İmalatı: Paslanmaz ve Karbon Çelik',
        metaDescription: 'Atölyede ölçülü üretilip montaja hazır gelen modüler tesisat: AISI 304/316 paslanmaz, St37/St52 karbon çelik ve çift cidarlı hatlar, flanşlı bağlantılar.',
        keywords: ['Ankara modüler tesisat sistemleri', 'modüler tesisat imalatı', 'prefabrik tesisat imalatı'],
        lead: 'Geleneksel tesisatta borular sahada ölçülüp sahada kesilir ve kaynatılır. Modüler yaklaşımda ise tesisatın parçaları atölyede, teknik çizime göre ölçülü üretilir ve sahaya montaja hazır gelir. İvedik OSB\'deki atölyemizde ürettiğimiz modüler tesisatın kapsamını bu yazıda özetliyoruz.',
        sections: [
            { h2: 'Modüler tesisatın sahaya kattığı', body: [
                'Kaynak ve kesimin büyük bölümü atölyede yapıldığında sahadaki iş, büyük ölçüde parçaları birbirine bağlamaktan ibaret kalır. Tesisin çalışmaya devam ettiği alanlarda sıcak işin azalması, montaj süresinin kısalması ve kaynakların kontrollü ortamda yapılması bu yaklaşımın başlıca kazanımlarıdır.',
            ] },
            { h2: 'Malzeme ve tesisat türleri', body: [
                { ul: [
                    'Paslanmaz tesisat: AISI 304 / 316',
                    'Karbon çelik tesisat: St 37 / St 52',
                    'Çift cidarlı tesisat: ısı yalıtımı ve basınç güvenliği gerektiren proses hatları',
                ] },
            ] },
            { h2: 'Bağlantı tipleri', body: [
                'Tesisat elemanları flanşlı, kaynaklı ya da vidalı bağlantılarla üretilebiliyor. Hangi noktada hangi bağlantının kullanılacağı bakım ihtiyacına ve hattın çalışma koşullarına göre belirleniyor; ayrıntılar [flanşlı ve kaynaklı tesisat bağlantı parçaları](/rehber/flansli-kaynakli-tesisat-baglanti-parcalari) yazısında.',
            ] },
            { h2: 'Hangi tesislere üretiyoruz?', body: [
                { ul: [
                    'Gıda ve ilaç tesisleri: hijyen gerektiren hatlarda paslanmaz tesisat',
                    'Proses endüstrisi: basınçlı hatlarda karbon çelik ve çift cidarlı tesisat',
                    'Arıtma sistemleri: su, gaz, toz ve baca arıtma hatları',
                    'Enerji ve altyapı projeleri',
                ] },
            ] },
            { h2: 'Ankara\'da üretim, Türkiye geneline sevkiyat', body: [
                'Tesisat elemanlarını Ankara İvedik OSB\'de üretiyor, Türkiye genelinde projenin bulunduğu bölgeye sevke hazır hale getiriyoruz. Paslanmaz boru ve kollektörlerin montaja hazır modüller halinde nasıl üretildiğini [endüstriyel paslanmaz boru ve kollektör üretimi](/rehber/endustriyel-paslanmaz-boru-kollektor-uretimi) yazısında anlattık.',
            ] },
            { h2: 'Teklif için gereken girdiler', body: [
                'Modüler tesisatta teklifin doğruluğu, hattın ne kadar iyi tanımlandığına bağlıdır. Aşağıdaki bilgilerin hazır olması süreci hızlandırır:',
                { ul: [
                    'Hattı gösteren izometrik çizim ya da proses şeması',
                    'Hat çapları, et kalınlıkları ve malzeme grubu',
                    'Akışkan, çalışma basıncı ve sıcaklığı',
                    'Bağlantı noktalarında flanş standardı veya kaynak tercihi',
                    'Varsa saha ölçüleri, montaj sırası ve teslim adresi',
                ] },
                'Saha ölçüsü henüz alınmamışsa, ölçü belirsizliği olan bağlantı noktalarında sahada ayar payı bırakılması planlanabilir.',
            ] },
        ],
        related: ['endustriyel-paslanmaz-boru-kollektor-uretimi', 'flansli-kaynakli-tesisat-baglanti-parcalari', 'paslanmaz-kollektor-imalati'],
    },
    {
        slug: 'endustriyel-paslanmaz-boru-kollektor-uretimi',
        service: 'moduler-tesisat-sistemleri',
        linkText: 'Endüstriyel Paslanmaz Boru ve Kollektör Üretimi',
        h1: 'Endüstriyel Paslanmaz Boru ve Kollektör Üretimi',
        seoTitle: 'Montaja Hazır Paslanmaz Boru ve Kollektör Modülleri',
        metaDescription: 'Endüstriyel tesislerde paslanmaz boru hattı ve kollektörlerin atölyede montaja hazır modüller halinde üretimi: izometrik çizim, parça numaralandırma ve saha uyumu.',
        keywords: ['endüstriyel paslanmaz boru imalatı', 'paslanmaz kollektör üretimi', 'prefabrik paslanmaz boru'],
        lead: 'Bir proses hattında onlarca boru parçası, dirsek ve kollektör bulunur. Bunların sahada tek tek kesilip kaynatılması hem uzun sürer hem de çalışan tesis için risk oluşturur. Bu yazı, paslanmaz boru ve kollektörlerin atölyede montaja hazır modüller halinde nasıl üretildiğini anlatıyor.',
        sections: [
            { h2: 'Çizimden modüle', body: [
                'Modüler üretimin temeli, hattın parçalara ayrıldığı izometrik çizimlerdir. Her modül sahaya taşınabilecek ve yerinde kolayca bağlanabilecek şekilde ayrılır; modüller arasındaki birleşimler genellikle flanşla çözülür. Saha ölçüsü alınmışsa çizime işlenmesi, modüllerin yerine sorunsuz oturmasının ön koşuludur.',
            ] },
            { h2: 'Atölyede yapılan işler', body: [
                { ul: [
                    'Boruların [boru lazer kesimle](/boru-profil-lazer-kesim) ölçüsünde kesilmesi ve branşman ağızlarının açılması',
                    'Kollektör gövdesinin ve çıkışlarının hazırlanması',
                    'Paslanmaz birleşimlerin TIG kaynakla yapılması',
                    'Flanş, saplama ve taşıyıcı elemanların modüle eklenmesi',
                ] },
                'Kollektörün kendisinin tasarımında tanımlanması gereken bilgiler için [paslanmaz kollektör imalatı ve kullanım alanları](/rehber/paslanmaz-kollektor-imalati) yazısına bakabilirsiniz.',
            ] },
            { h2: 'Numaralandırma ve montaj sırası', body: [
                'Her modülün çizimdeki konumuyla eşleşen bir numarası olması, sahadaki montaj ekibinin doğru parçayı doğru yere taşımasını kolaylaştırır. Büyük hatlarda montaj sırasını üretim planına yansıtmak, sevkiyatın da bu sırayla yapılmasını sağlar.',
            ] },
            { h2: 'Malzeme seçimi', body: [
                'Gıda, ilaç ve genel proses hatlarında AISI 304, klorür içeren ya da agresif kimyasal ortamlarda AISI 316/316L kullanılır. Isı yalıtımı ve basınç güvenliği gerektiren hatlarda çift cidarlı yapı tercih edilir. Hattın akışkanını ve çalışma koşullarını paylaşmanız, malzeme ve bağlantı seçiminin doğru yapılmasını sağlar.',
            ] },
            { h2: 'Sahaya hazır teslim', body: [
                'Atölyede tamamlanan modüller Türkiye genelinde projenin bulunduğu bölgeye sevke hazır hale getiriliyor. Modüler tesisat kapsamımız için [modüler tesisat sistemleri](/moduler-tesisat-sistemleri) sayfamıza bakabilirsiniz.',
            ] },
        ],
        related: ['paslanmaz-kollektor-imalati', 'ankara-moduler-tesisat-sistemleri-imalati', 'flansli-kaynakli-tesisat-baglanti-parcalari'],
    },
    {
        slug: 'flansli-kaynakli-tesisat-baglanti-parcalari',
        service: 'moduler-tesisat-sistemleri',
        linkText: 'Flanşlı ve Kaynaklı Tesisat Bağlantı Parçaları',
        h1: 'Flanşlı ve Kaynaklı Tesisat Bağlantı Parçaları',
        seoTitle: 'Flanşlı mı Kaynaklı mı? Tesisat Bağlantı Parçası Seçimi',
        metaDescription: 'Tesisatta flanşlı, kaynaklı ve vidalı bağlantının farkları; sökülebilirlik, sızdırmazlık ve bakım ihtiyacına göre seçim ve siparişte belirtilecekler.',
        keywords: ['flanşlı tesisat bağlantı', 'kaynaklı boru bağlantısı', 'tesisat bağlantı parçaları imalatı'],
        lead: 'Bir tesisat hattında boruların nasıl birleşeceği, hattın ömrü boyunca bakım yapılabilirliğini belirler. Her yeri flanşlı yapmak maliyeti ve sızıntı noktalarını artırır; her yeri kaynaklı yapmak ise bakımı zorlaştırır. Doğru karar, her birleşimin görevine göre verilir.',
        sections: [
            { h2: 'Flanşlı bağlantı: sökülebilirlik', body: [
                'Flanşlı bağlantılar, hattın bir bölümünün sökülüp yeniden takılabilmesini sağlar. Vana, pompa ya da filtre gibi bakım gerektiren ekipmanların bağlantısında, modüler tesisatta modüllerin birleşiminde ve ileride değişiklik yapılması muhtemel noktalarda tercih edilir. Siparişte flanşın standardını ve basınç sınıfını belirtmek, karşı flanşla uyumun ön koşuludur.',
            ] },
            { h2: 'Kaynaklı bağlantı: süreklilik ve sızdırmazlık', body: [
                'Kaynaklı birleşimde ayrı bir conta ya da cıvata yoktur; hat tek parça gibi davranır. Sökülmesi gerekmeyen düz hat bölümlerinde, branşman ağızlarında ve kollektör çıkışlarında sık kullanılır. Paslanmaz hatlarda kaynak bölgesinin yüzey durumu ayrıca önemlidir; bu konuyu [paslanmaz çelik kaynaklı imalat süreçleri](/rehber/paslanmaz-celik-kaynakli-imalat-surecleri) yazısında anlattık.',
            ] },
            { h2: 'Vidalı bağlantı', body: [
                'Küçük çaplı hatlarda ve enstrüman bağlantılarında vidalı çözümler pratik olabilir. Hangi noktalarda vidalı bağlantı kullanılacağı, hattın çapına ve çalışma koşullarına göre belirlenir.',
            ] },
            { h2: 'Ürettiğimiz bağlantı ve montaj parçaları', body: [
                { ul: [
                    'Paslanmaz (AISI 304/316) flanşlı, kaynaklı ve vidalı bağlantı elemanları',
                    'Karbon çelik (St37/St52) boru hatları ve bağlantıları',
                    'Boru kavşakları ve flanş kaynağı',
                    'Flanş, saplama ve montaj uyumlu bağlantı elemanları',
                ] },
            ] },
            { h2: 'Siparişte belirtilmesi gerekenler', body: [
                { ul: [
                    'Boru dış çapı ve et kalınlığı',
                    'Malzeme ve akışkan bilgisi',
                    'Flanş standardı ve basınç sınıfı',
                    'Bağlantının sökülebilir olması gerekip gerekmediği',
                    'Varsa test ve belge gereksinimleri',
                ] },
                'Bu parçaların modüler bir tesisatın içinde nasıl kullanıldığını [Ankara modüler tesisat sistemleri imalatı](/rehber/ankara-moduler-tesisat-sistemleri-imalati) yazısında görebilirsiniz.',
            ] },
        ],
        related: ['ankara-moduler-tesisat-sistemleri-imalati', 'endustriyel-paslanmaz-boru-kollektor-uretimi', 'ankara-kaynakli-metal-imalat'],
    },

    /* ---------------- 10. ARITMA SİSTEMLERİ ---------------- */
    {
        slug: 'ankara-endustriyel-aritma-ekipmanlari-imalati',
        service: 'aritma-sistemleri',
        linkText: 'Ankara Endüstriyel Arıtma Ekipmanları İmalatı',
        h1: 'Ankara Endüstriyel Arıtma Ekipmanları İmalatı',
        seoTitle: 'Ankara Arıtma Ekipmanları İmalatı: Su, Gaz, Toz, Baca',
        metaDescription: 'Su, gaz, toz ve baca arıtma sistemleri için tank, filtre gövdesi, kollektör, kanal ve konstrüksiyon imalatı; paslanmaz ve karbon çelikte teknik çizime göre üretim.',
        keywords: ['Ankara arıtma ekipmanları imalatı', 'arıtma ekipmanı imalatı', 'filtre gövdesi imalatı'],
        lead: 'Bir arıtma sisteminin prosesini tasarlayan ile metal gövdesini üreten çoğu zaman farklı firmalardır. Sistem kurucuların ve tesis işletmelerinin ihtiyaç duyduğu tank, filtre gövdesi, kanal ve bağlantı parçalarını teknik çizime göre üretiyoruz. Bu yazı hangi sistemler için neler üretebildiğimizi özetliyor.',
        sections: [
            { h2: 'Sistem türüne göre ürettiğimiz parçalar', body: [
                { h3: 'Su arıtma', body: [
                    'Tanklar, filtre gövdeleri, kollektörler ve paslanmaz ekipmanlar. Bu parçaların tasarım girdileri için [su arıtma sistemleri için tank ve filtre gövdesi üretimi](/rehber/su-aritma-tank-filtre-govdesi-uretimi) yazısına bakabilirsiniz.',
                ] },
                { h3: 'Gaz arıtma', body: [
                    'Proses gazı yönetim sistemleri için metal parçalar ve taşıyıcı konstrüksiyonlar.',
                ] },
                { h3: 'Toz arıtma', body: [
                    'Filtre gövdeleri, hava kanalları ve bağlantı flanşları.',
                ] },
                { h3: 'Baca arıtma', body: [
                    'Yüksek sıcaklık ve korozif ortama uygun kanal ve konstrüksiyonlar.',
                ] },
            ] },
            { h2: 'Pres filtre ve basınçlı filtre ekipmanları', body: [
                'Pres filtre ve basınçlı filtre sistemlerine ait proses ekipmanlarını da paslanmaz ve karbon çelik malzeme gruplarında teknik çizime uygun olarak üretiyoruz. Kaynaklı ve flanşlı bağlantı detayları, sistemin bakım ve servis ihtiyacına göre projeye özel planlanıyor.',
            ] },
            { h2: 'Paslanmaz mı, karbon çelik mi?', body: [
                'Su ile sürekli temas eden ve hijyen beklentisi olan parçalarda paslanmaz, taşıyıcı konstrüksiyon ve kanal gibi akışkanla temas etmeyen ya da kaplamayla korunacak parçalarda karbon çelik sık tercih edilir. Kimyasal içeren ortamlarda malzeme seçimi, akışkanın bileşimine göre yapılmalıdır.',
            ] },
            { h2: 'Kimlerle çalışıyoruz?', body: [
                'Su ve atıksu tesisleri, emisyon kontrolü gereken endüstriyel tesisler, hijyen gerektiren gıda ve içecek üreticileri ile enerji ve altyapı projeleri için üretim yapıyoruz. Sistemin prosesi sizin ya da sistem tasarımcınızın elinde olduğunda, biz metal gövde ve bağlantı tarafını çizime göre üretiyoruz. Arıtma hatlarını bağlayan tesisat için [modüler tesisat sistemleri](/moduler-tesisat-sistemleri) sayfamıza da göz atabilirsiniz.',
            ] },
        ],
        related: ['su-aritma-tank-filtre-govdesi-uretimi', 'paslanmaz-kollektor-imalati', 'flansli-kaynakli-tesisat-baglanti-parcalari'],
    },
    {
        slug: 'su-aritma-tank-filtre-govdesi-uretimi',
        service: 'aritma-sistemleri',
        linkText: 'Su Arıtma Sistemleri için Tank ve Filtre Gövdesi Üretimi',
        h1: 'Su Arıtma Sistemleri için Tank ve Filtre Gövdesi Üretimi',
        seoTitle: 'Su Arıtma Tankı ve Filtre Gövdesi Üretimi: Tasarım Girdileri',
        metaDescription: 'Su arıtma proses tankı ve filtre gövdesi üretiminde çalışma koşulları, bağlantı ağızları, menhol, malzeme ve test gereksinimleri nasıl tanımlanır?',
        keywords: ['su arıtma tankı imalatı', 'filtre gövdesi üretimi', 'arıtma filtre gövdesi'],
        lead: 'Arıtma sistemlerindeki tank ve filtre gövdeleri, depolama tanklarından farklı olarak bir prosesin parçasıdır: içlerinde filtrasyon, çökeltme ya da kimyasal dozajlama gibi işlemler yapılır. Bu nedenle üretimden önce tanımlanması gereken bilgiler de farklıdır.',
        sections: [
            { h2: 'Çalışma koşulları', body: [
                'Gövdenin çalışacağı basınç ve sıcaklık, içinden geçecek suyun niteliği ve kullanılacak kimyasallar sistem tasarımcısı tarafından belirlenir ve üretimin temel girdisidir. Basınç altında çalışacak bir filtre gövdesinde et kalınlığı ve bağlantı detayları bu değerlere göre seçilir.',
            ] },
            { h2: 'Bağlantı ağızları ve iç donanım', body: [
                { ul: [
                    'Giriş, çıkış, ters yıkama ve boşaltma ağızlarının çapı ve konumu',
                    'Flanşlı ya da kaynaklı bağlantı tercihi',
                    'Bakım ve dolgu malzemesi değişimi için menhol',
                    'İçeride dağıtım ve toplama için kollektör ihtiyacı',
                    'Ayak, kaide ya da taşıyıcı konstrüksiyon',
                ] },
                'Dağıtım ve toplama hatlarında kullanılan kollektörlerin tasarımı için [paslanmaz kollektör imalatı ve kullanım alanları](/rehber/paslanmaz-kollektor-imalati) yazısına bakabilirsiniz.',
            ] },
            { h2: 'Malzeme seçimi', body: [
                'Su arıtma ekipmanlarında paslanmaz çelik ve karbon çelik birlikte kullanılır. Suyla doğrudan temas eden gövdelerde korozyon direnci nedeniyle paslanmaz öne çıkarken, taşıyıcı parçalar ve kaplanacak gövdeler karbon çelikten üretilebilir. Klorür içeriği yüksek sularda AISI 316/316L seçimi değerlendirilmelidir.',
            ] },
            { h2: 'Test ve belge gereksinimleri', body: [
                'Basınç altında çalışacak gövdelerde sızdırmazlık ya da basınç testi, malzeme sertifikası veya mevzuat kapsamında belge gerekiyorsa bunu teklif talebinde açıkça belirtin. Bu gereksinimler üretim planını ve teslim süresini etkilediği için baştan bilinmeleri önemlidir.',
            ] },
            { h2: 'Depolama tanklarıyla karıştırmayın', body: [
                'İçme ve proses suyunu yalnızca depolayan tanklar için tasarım başlıkları farklıdır; onları [paslanmaz su deposu ve tank imalatı](/rehber/paslanmaz-su-deposu-tank-imalati) yazısında ele aldık. Arıtma ekipmanları kapsamımızın tamamı için [Ankara endüstriyel arıtma ekipmanları imalatı](/rehber/ankara-endustriyel-aritma-ekipmanlari-imalati) yazısına bakabilirsiniz.',
            ] },
        ],
        related: ['ankara-endustriyel-aritma-ekipmanlari-imalati', 'paslanmaz-su-deposu-tank-imalati', 'paslanmaz-kollektor-imalati'],
    },
];

/* Kapsamı doğrulanmadığı için YAYINLANMAYAN, incelemeye alınan konular.
   Sayfa üretilmez, footer'da ve sitemap'te yer almaz. */
const GUIDES_UNDER_REVIEW = [
    {
        service: 'aritma-sistemleri',
        title: 'Hidrofor ve Pompa Tesisatlarında Kollektör ve Bağlantı Ekipmanları',
        reason: 'Sitede hidrofor veya pompa ile ilgili hiçbir hizmet ya da ürün bilgisi yok. Foramak\'ın hidrofor/pompa grupları için kollektör ve bağlantı imalatı yapıp yapmadığı, yapıyorsa kapsamı (yalnızca metal kollektör ve tesisat mı, pompa montajı da mı) şirket tarafından doğrulanmalı.',
    },
];

module.exports = { GUIDES, GUIDES_UNDER_REVIEW };
