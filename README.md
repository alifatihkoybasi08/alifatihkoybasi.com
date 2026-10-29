# alifatihkoybasi.com

Tek ekranlık kişisel site: büyük harfle ad-soyad, sosyal medya bağlantıları ve "Bana Ulaşın" formu;
Türkçe ve İngilizce, ayrıca KVKK aydınlatma metni. Sunucu, veritabanı, framework ve derleme adımı yoktur;
dosyalar olduğu gibi yayınlanır.

## Dosyalar

| Yol | İçerik |
|---|---|
| `index.html` | Türkçe ana sayfa (ad-soyad, sosyal medya, iletişim formu) |
| `kvkk.html` | Türkçe KVKK aydınlatma metni (bağlayıcı metin) |
| `en/index.html` | İngilizce ana sayfa |
| `en/privacy.html` | KVKK metninin İngilizcesi; "Türkçe metin esastır" notu taşır |
| `assets/css/site.css` | Stiller: açık/koyu tema, mobil düzen, dört sayfa için ortak |
| `assets/js/contact.js` | Formu sayfadan ayrılmadan gönderir; mesajlar sayfanın `lang` değerine göre TR/EN |
| `assets/js/content-filter.js` | Ad Soyad ve Mesaj alanlarında uygunsuz ifade denetimi; kelimeleri değil özetlerini tanır |
| `assets/js/content-filter-data.js` | Denetim listesinin özetleri; `tools/blocklist.mjs` üretir, elle düzenlenmez |
| `tools/blocklist.mjs` | Açık listeden özet dosyasını üreten Node.js betiği; sitenin çalışması için gerekmez |
| `assets/icons/social.svg` | Sosyal medya ikonları (tek dosya, `<use href="…#icon-linkedin">` ile kullanılır); Font Awesome Free 7.3.1, CC BY 4.0, lisans notu dosyanın içinde |
| `assets/fonts/` | Cormorant Garamond 500 (latin + latin-ext), lisans `OFL.txt` (SIL OFL 1.1), kaynak `@fontsource/cormorant-garamond@5.3.0` |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Sekme ve ana ekran simgeleri: kaligrafik "A" (verilen görselden potrace ile vektörleştirildi), koyu zemin `#1b1b1d`, bronz `#c4a676`. Sekme ikonunda çizgi küçük boyutta okunsun diye hafif kalınlaştırılmıştır. Simge değişince sayfalardaki `?v=` sürümü artırılır, yoksa tarayıcılar eskisini önbellekten gösterir. `site.css` ve betik bağlantıları da `?v=` taşır; bu dosyalar değişince onları yükleyen sayfalardaki sürüm birlikte artırılır |

## İki dil

Türkçe sayfalar kökte, İngilizceler `en/` altındadır; her sayfa sağ üstteki TR | EN seçiciyle karşılığına
bağlanır ve `hreflang` etiketleri taşır. Bir metin değişince iki dildeki karşılığı birlikte güncellenir.
İngilizce formdan gelen e-postaların konusu "(EN)" ile biter.

## Sosyal medya

Sıra (soldan sağa): LinkedIn, Instagram, Facebook, X, Threads, GitHub. Bağlantılar iki ana sayfada ve
`<script type="application/ld+json">` içindeki `sameAs` listesinde durur; bir hesap değişirse üç yer
birlikte güncellenir. Bağlantılar düz bağlantıdır (gömülü içerik yok); KVKK metni 7. bölüm bunu beyan eder.

Font sitenin kendi dosyalarından yüklenir, Google Fonts'a istek gitmez: ziyaretçinin IP adresi üçüncü
tarafa aktarılmaz. Sitede çerez ve ziyaretçi istatistiği yoktur; `kvkk.html` 7. bölüm bunu beyan eder.

## Yerel önizleme

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Sonra http://127.0.0.1:8765 açılır. `index.html`'i çift tıklayarak açmayın; sayfanın güvenlik
politikası (CSP) `file://` altında font ve formu engeller.

## İletişim formu

Form Web3Forms'a gönderilir (ücretsiz katman: ayda 250 mesaj) ve mesajlar `info@alifatihkoybasi.com`
adresine düşer: `index.html`'deki `access_key`, Web3Forms'ta bu adres için alınan anahtardır. Anahtar
sayfa kaynağında görünür; Web3Forms böyle tasarlanmıştır, anahtar yalnız kayıtlı adrese mesaj iletir.

Gelen her e-postada `kvkk_acik_riza: Verildi` satırı bulunur; ziyaretçinin yurt dışına aktarım için
verdiği açık rızanın kaydıdır, e-postayla birlikte saklanır.

Web3Forms paneli (app.web3forms.com) > form ayarları > Advanced Options > "Data retention policy"
**7 days** olarak ayarlıdır: Web3Forms'taki kopyalar 7 gün sonra silinir, mesajın kendisi info@ kutusunda
kalır. `kvkk.html` 6. bölüm bu süreyi beyan eder; ayar değişirse metin de değişir.

**Spam koruması: hCaptcha (görünmez mod).** Web3Forms panelinde form için hCaptcha açıktır; Web3Forms bu
yüzden `h-captcha-response` jetonu taşımayan gönderimi reddeder. `contact.js` hCaptcha'yı Web3Forms'un ücretsiz
plan anahtarıyla (`50b2fe65-b00b-4b9e-ad62-3ba471098be2`) yalnız "Gönder"e basıldığında yükler; tarayıcı
doğrulaması ve açık rıza kutusu geçilmeden hCaptcha'ya veri gitmez. Gerekirse bulmaca açılır pencerede çıkar,
jeton mesaja eklenir ve her gönderimden sonra sıfırlanır. Sayfaların CSP'si `hcaptcha.com` ve `*.hcaptcha.com`
alan adlarına izin verir. hCaptcha'nın görünmez mod için önerdiği "This site is protected by hCaptcha…" notu,
ana sayfa sade kalsın diye KVKK metninin 7. bölümündedir (hCaptcha bunu formun bulunduğu sayfada önerir; metin
formdaki onay kutusundan ve alt bilgiden bağlıdır). KVKK metni 2, 3, 4, 5 ve 7. bölümlerde hCaptcha'yı anlatır.
Panelde hCaptcha kapatılırsa form yine çalışır (jeton yok sayılır), ama o durumda KVKK'daki hCaptcha bölümleri
kaldırılmalıdır.

JavaScript kapalıysa form doğrudan Web3Forms'a gider; hCaptcha açıkken bu gönderim reddedilir.

## Uygunsuz ifade denetimi

"Gönder"e basıldığında Ad Soyad ve Mesaj alanları küfür, hakaret ve argo için denetlenir. Uygunsuz ifade
varsa form gönderilmez, alanda "Bu alanda uygunsuz bir ifade var. Lütfen düzenleyin." uyarısı çıkar ve
hCaptcha'ya da Web3Forms'a da hiçbir şey gitmez. Büyük-küçük harf, Türkçe karakterli ve karaktersiz yazım,
harf tekrarı, rakamla gizleme, harfleri boşlukla ayırma ve görünmez karakter ekleme de yakalanır.

Depoda kelimelerin kendisi yoktur: `content-filter-data.js` yalnız özetlerini (cyrb53) taşır. Özet bir şifre
değildir, elinde kelime listesi olan biri eşleştirebilir; amaç bu kelimelerin herkese açık depoda düz metin
durmamasıdır. Açık liste depo dışında, bakımı yapan kişide durur ve yüklenmez. Liste değişince:

```bash
node tools/blocklist.mjs <liste.txt>
```

Betik `content-filter-data.js`'i yeniden yazar; ardından iki ana sayfadaki `?v=` sürümü artırılıp dosya
yüklenir. Listede her satır bir işaretle başlar: `=` tam sözcük, `+` kök (ekli halleriyle, en az 4 harf),
`!` hiç engellenmeyecek sözcük (masum bir kelime yanlışlıkla yakalanırsa).

Denetim tarayıcıda çalışır; formu atlayıp Web3Forms'a doğrudan istek gönderen biri onu aşabilir (hCaptcha yine
geçerlidir). Amaç formu kullanan ziyaretçiyi durdurmaktır.

## KVKK metninin güncel tutulması

`kvkk.html` sitenin bugünkü yapısını anlatır. Aşağıdakilerden biri değişirse metin ve "Son güncelleme"
tarihi aynı anda güncellenir:

- Form hizmeti (Web3Forms), e-posta sağlayıcısı (Google Workspace) ya da barındırma (GitHub Pages): 5. ve 7. bölüm.
- Formdaki alanlar: 2. bölüm.
- Siteye analiz aracı, harita, video gibi üçüncü taraf içerik ya da çerez eklenmesi: 7. bölüm; ayrıca çerez onayı gerekir.

## Yayın: GitHub Pages + Squarespace DNS

Site `alifatihkoybasi08` GitHub hesabındaki `alifatihkoybasi.com` deposundan yayınlanır. Domain
Squarespace'te kayıtlıdır ve DNS orada kalır. Domainde Google Workspace e-postası çalışır
(MX `smtp.google.com`, SPF ve DKIM TXT kayıtları): **bu kayıtlara dokunulmaz.**

1. Depo köküne `CNAME` (içeriği `alifatihkoybasi.com`) ve boş `.nojekyll` dosyası eklenir, dosyalar depoya yüklenir.
2. GitHub hesap ayarları > Pages: `alifatihkoybasi.com` doğrulanır (GitHub bir TXT kaydı verir, Squarespace'e eklenir).
3. Depo Settings > Pages: kaynak `main` dalı, kök klasör; Custom domain `alifatihkoybasi.com`.
4. Squarespace > Domains > DNS: "Squarespace Defaults" kayıtları (4 A kaydı ve `www` CNAME) silinir, yerine:

| Host | Tür | Değer |
|---|---|---|
| `@` | A | `185.199.108.153` |
| `@` | A | `185.199.109.153` |
| `@` | A | `185.199.110.153` |
| `@` | A | `185.199.111.153` |
| `www` | CNAME | `alifatihkoybasi08.github.io` |

   IPv6 için isteğe bağlı AAAA kayıtları: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
   `2606:50c0:8002::153`, `2606:50c0:8003::153`.
5. DNS yayılınca (birkaç saati bulabilir) Pages ayarlarında "Enforce HTTPS" işaretlenir.

**Sertifika çıkmıyorsa:** Özel domain DNS değişikliğinden önce tanımlandıysa GitHub'ın ilk sertifika
denemesi eski kayıtlara çarpar ve kendiliğinden yinelenmeyebilir. Pages ayarlarında Custom domain
"Remove" ile kaldırılıp yeniden yazılır; uyarı "certificate has not yet been issued" olarak değişir ve
sertifika en geç bir saatte gelir (2026-10-29 kurulumunda yaşandı). Eski Squarespace sitesi
`Strict-Transport-Security` (180 gün) gönderdiği için bu domain tarayıcılarda yalnız HTTPS ile açılır;
sertifika gelene kadar `NET::ERR_CERT_COMMON_NAME_INVALID` görülmesi bu yüzdendir.

Kayıt adresleri: [GitHub Docs, custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
