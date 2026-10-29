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
| `assets/icons/social.svg` | Sosyal medya ikonları (tek dosya, `<use href="…#icon-linkedin">` ile kullanılır); Font Awesome Free 7.3.1, CC BY 4.0, lisans notu dosyanın içinde |
| `assets/fonts/` | Cormorant Garamond 500 (latin + latin-ext), lisans `OFL.txt` (SIL OFL 1.1), kaynak `@fontsource/cormorant-garamond@5.3.0` |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png` | Sekme ve ana ekran simgeleri |

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

JavaScript kapalıysa form yine çalışır; ziyaretçi gönderimden sonra Web3Forms'un teşekkür sayfasına gider.

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
