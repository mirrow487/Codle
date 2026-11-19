tagline: HTML bir şeyin ne olduğunu söyler. CSS nasıl göründüğünü. İkisi birlikte, şimdiye kadar gördüğünüz her web sayfasıdır.
runtime: HTML ve CSS · korumalı bir çerçevede canlı önizleme

# Lesson: Belge Yapısı
summary: Her web sayfasının paylaştığı iskelet ve her kemiğin ne işe yaradığı.

HTML **şeylerin ne olduğunu** anlatır: bu bir başlık, bu bir paragraf, bu bir liste. Varsayılan görünüme tarayıcı karar verir; sonra CSS onu değiştirir.

İçerik **öğelerin** içine yazılır: bir açılış etiketi, içerik ve bir kapanış etiketi, örneğin `<p>Hello</p>`. `<img>` ve `<meta>` gibi bazı öğeler **boştur** (void) ve kapanış etiketleri yoktur.

Her sayfanın taslağı aynıdır:

- `<!DOCTYPE html>` tarayıcıya modern standartlar modunu kullanmasını söyler
- `<html lang="en">` her şeyi sarar ve dili bildirir (ekran okuyucular bunu kullanır)
- `<head>` sayfa **hakkındaki** bilgileri tutar: başlık, karakter kümesi, stiller
- `<body>` insanların gerçekten gördüğü şeyleri tutar

Başlıklar `<h1>`'den (en önemli) `<h6>`'ya kadar gider. Onları boyut için değil yapı için kullanın; boyutları CSS ile değiştirebilirsiniz.

> Aşağıdaki önizleme metnini düzenleyin, sonra Çalıştır'a basın. Burada yazdığınız hiçbir şey bir şeyi bozamaz; istediğiniz kadar pervasız olun.

# Lesson: Metin, Bağlantılar ve Listeler
summary: Anlamlı metin etiketleri, nitelikler ve iki tür liste.

Etiketleri anlamlarına göre seçin. `<strong>` önemi, `<em>` vurguyu belirtir. İkisinin de varsayılan bir stili vardır (kalın, italik), ama yardımcı teknolojilerin seslendirdiği şey anlamdır.

Öğeler açılış etiketinin içinde `name="value"` şeklinde **nitelikler** taşıyabilir. Bağlantı, nereye gittiğini `href` niteliğiyle söyleyen bir `<a>` öğesidir:

```html
<a href="https://developer.mozilla.org">MDN Web Docs</a>
```

Görsellerin bir `src`'ye ve görseli göremeyen kişiler için onu anlatan bir `alt` metnine ihtiyacı vardır.

Listeler iki çeşittir: madde işaretli (sırasız) için `<ul>`, numaralı (sıralı) için `<ol>`. Her iki durumda da her eleman bir `<li>`'dir.

> Bu önizlemedeki bağlantılar, yanlışlıkla sayfadan çıkmayasınız diye devre dışıdır. Konsol, nereye gideceklerini size söyler.

# Lesson: CSS Seçiciler ve Basamaklanma
summary: CSS öğeleri nasıl seçer ve kurallar arasındaki anlaşmazlıkları nasıl çözer.

Bir CSS kuralı, bir **seçici** ve **bildirimlerden** oluşur:

```css
p {
  color: #333;
  line-height: 1.6;
}
```

En çok kullanacağınız seçiciler:

- `p` her `<p>` öğesini seçer
- `.note`, `class="note"` olan öğeleri seçer (bir öğenin birden fazla sınıfı olabilir)
- `#intro`, `id="intro"` olan tek öğeyi seçer
- `nav a`, bir `<nav>` içinde herhangi bir yerdeki `<a>` öğelerini seçer
- `ul > li`, bir `<ul>`'nin doğrudan çocuğu olan `<li>` öğelerini seçer

İki kural anlaşamadığında **belirginlik** (specificity) karar verir: id sınıfı yener, sınıf da öğe seçicisini yener. Sonradan gelen kural ancak belirginlik eşitse kazanır. Cascading Style Sheets'teki "basamaklanma" budur.

# Lesson: Kutu Modeli
summary: İçerik, iç boşluk, kenarlık, dış boşluk ve boyutları akla uygun hale getiren tek ayar.

Her öğe, içten dışa dört katmandan oluşan dikdörtgen bir kutudur:

- **content** (içerik): metnin ya da görselin kendisi
- **padding** (iç boşluk): kenarlığın içindeki boşluk; arka plan rengini alır
- **border** (kenarlık): iç boşluğun çevresindeki çizgi
- **margin** (dış boşluk): dışarıdaki saydam boşluk; diğer kutuları iter

Varsayılan durumda (`box-sizing: content-box`) `width` yalnızca içeriği belirler. İç boşluk ve kenarlık üstüne eklenir; bu yüzden `20px` iç boşluklu ve `5px` kenarlıklı bir `width: 200px` kutu aslında **250px** genişliğindedir.

Neredeyse her modern stil dosyası bunu `box-sizing: border-box` ile değiştirir; bu, `width`'in iç boşluğu ve kenarlığı da kapsamasını sağlar. O zaman `200px` gerçekten 200px demektir.

# Lesson: Flexbox
summary: Eski numaralara gerek kalmadan şeyleri bir satıra ya da sütuna dizmek.

Bir kapsayıcıya `display: flex` verin; doğrudan çocukları bir satırda dizilen **flex öğelerine** dönüşür.

Sürekli kullanacağınız iki özellik:

- `justify-content` öğeleri ana eksen boyunca (satırda yatay) konumlar: `flex-start`, `center`, `space-between`, `space-around`, `space-evenly`
- `align-items` onları çapraz eksende (satırda dikey) konumlar: `stretch` (varsayılan), `flex-start`, `center`, `flex-end`

`gap`, margin hesabı yapmadan öğeler arasına boşluk ekler. `flex-direction: column` satırı sütuna çevirir; bu da iki eksenin anlamını yer değiştirir. Bir öğeye `flex: 1` vermek, onun büyüyüp kalan boşluğu kaplamasını söyler.

> Bir şeyi başka bir şeyin tam ortasına koymak eskiden bir mizah konusuydu. Artık üç satır: `display: flex; justify-content: center; align-items: center;`

# Lesson: CSS Grid
summary: Satırlar, sütunlar ve fr birimiyle iki boyutlu yerleşimler.

Flexbox aynı anda tek bir yönle ilgilenir. **Grid** satırları ve sütunları birlikte yönetir.

`grid-template-columns` sütunları tanımlar. `fr` birimi "boş alanın bir payı" demektir; bu yüzden `1fr 2fr` genişliği üçe böler: bir pay ilk sütuna, iki pay ikinciye. `repeat(3, 1fr)` üç eşit sütunun kısa yazımıdır.

Öğeler hücrelere sırayla akar ve kendiliğinden yeni satırlara geçer. `gap` hücreler arasındaki boşluğu ayarlar.

Aşağıdaki kalıp ezberlemeye değer. Medya sorgusu olmadan, her biri en az 120px genişliğinde, sığdığı kadar sütun oluşturur:

```css
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
```

Önizleme alanını yeniden boyutlandırın ya da `120px` değerini değiştirin ve sütunların yeniden dizilişini izleyin.

# Quiz

## Q: Bir sayfadaki en önemli başlık hangi öğedir?
- =
- =
- =
- =
explain: Başlıklar `<h1>`'den `<h6>`'ya kadar gider. `<head>` sayfa üst verilerini tutar, `<header>` tanıtıcı içerik bölümüdür (genellikle bir başlık içerir), `<heading>` ise yoktur.

## Q: Paragraf metni hangi renktedir?
- Mavi
- Kırmızı
- Yeşil
- Siyah, çünkü kurallar çakışıyor
explain: Bir id seçicisi sınıftan daha belirgindir, sınıf da öğe seçicisinden. Kaynak sırası yalnızca belirginlik eşitken önemlidir; bu yüzden mavi önce gelse bile kazanır.

## Q: Varsayılan `box-sizing` ile bu kutu ekranda ne kadar geniştir?
- 200px
- 225px
- 240px
- 250px
explain: `content-box` modunda `width` yalnızca içeriktir. Her iki yana 20px iç boşluk (40px) ve her iki yana 5px kenarlık (10px) ekleyin: 200 + 40 + 10 = 250px. `box-sizing: border-box` ile tam olarak 200px olurdu.

## Q: Hangi CSS tek bir çocuğu ebeveyninin içinde yatay ve dikey olarak ortalar?
- =
- =
- =
- =
explain: Bir flex satırında `justify-content` yatay ekseni, `align-items` dikey ekseni yönetir. `align` bir CSS özelliği değildir, `vertical-align` yalnızca satır içi ve tablo hücresi içeriğini etkiler, `margin` ise `center` değerini kabul etmez (ama `margin: 0 auto` bir bloğu yatayda ortalar).

## Q: Bir bağlantıda `target="_blank"` ne yapar?
- Bağlantıyı aynı sekmede açar
- Bağlantıyı yeni bir sekmede ya da pencerede açar
- Bağlantıyı görünmez yapar
- Bağlantılı dosyayı indirir
explain: `_blank`, tarayıcıdan yeni bir göz atma bağlamı, genellikle bir sekme ister. Modern tarayıcılar buna varsayılan olarak `rel="noopener"` davranışını da uygular; böylece yeni sayfa sizinkini kontrol edemez.

## Q: Kapsayıcı 300px genişliğinde ve boşluk yok. İki sütun ne kadar geniştir?
- 150px ve 150px
- 100px ve 200px
- 1px ve 2px
- 300px ve 600px
explain: `fr` boş alanı oranla paylaştırır. Toplam 3 pay vardır, yani her pay 100px'tir: bir pay ilk sütuna, iki pay ikinciye.

## Q: Hangi seçici yalnızca `.menu`'nün doğrudan çocuğu olan `<li>` öğeleriyle eşleşir?
- =
- =
- =
- =
explain: `>` çocuk birleştiricisidir. Boşluk (alt öğe birleştiricisi) her derinlikte eşleşir; iç içe listeler dahil. `+` bir sonraki kardeşle eşleşir, `.menu.li` ise hem `menu` hem `li` sınıfına sahip tek bir öğeyle.

# Challenge: Bağlantı yap

**MDN** kelimesini, yeni sekmede açılan ve `https://developer.mozilla.org` adresine giden bir bağlantıya çevirin. Cümlenin geri kalanını olduğu gibi bırakın.

## Hints
- Bağlantı, tıklanabilir olmasını istediğiniz metnin çevresine sarılan bir `<a>` öğesidir.
- Hedef `href` niteliğine yazılır.
- `target="_blank"` onu yeni sekmede açar: `<a href="..." target="_blank">MDN</a>`.

## Tests
- Paragraf bir bağlantı içeriyor
- Bağlantı metni tam olarak "MDN"
- https://developer.mozilla.org adresine gidiyor
- Yeni sekmede açılıyor
- Cümle hâlâ "Read the docs on MDN." diyor

# Challenge: Kartı ortala

`.card`, `.stage`'in sol üst köşesinde duruyor. CSS ekleyerek onu hem yatay hem dikey olarak ortalayın. HTML'i değiştirmeyin.

## Hints
- Flexbox şeyleri ortalayabilir: işe `.stage`'e `display: flex;` ekleyerek başlayın.
- Bir satırda yatay ekseni `justify-content` yönetir.
- Dikey ekseni `align-items: center;` yönetir. (Grid sevenler için `display: grid; place-items: center;` da çalışır.)

## Tests
- Kart yatayda ortalanmış
- Kart dikeyde ortalanmış
- Kart 160px genişliğini koruyor
- Sahne hâlâ 300px yüksekliğinde

# Challenge: Taşmayı durdur

`.panel`'in 300px'lik kapsayıcısını tam olarak doldurması gerekiyor, ama sağ kenardan dışarı taşıyor. İç boşluğu ya da kenarlığı **kaldırmadan** düzeltin.

## Hints
- Panel gerçekte ne kadar geniş? `width: 100%` 300px'tir, sonra iç boşluk ve kenarlık eklenir.
- 300 + 24 + 24 + 2 + 2 = 352px. Taşma bu.
- `width`'in nasıl ölçüldüğünü tek bir özellik değiştirir: `box-sizing: border-box;`.

## Tests
- Panel kapsayıcının içine sığıyor
- Panel kapsayıcı kadar geniş
- İç boşluk hâlâ 24px
- Kenarlık hâlâ 2px

# Challenge: Üç sütunlu galeri kur

`.gallery`'yi **üç eşit sütunlu** ve **16px boşluklu** bir grid'e çevirin; altı fotoğraf üçerli iki satır oluştursun.

## Hints
- `.gallery`'ye `display: grid;` vererek başlayın.
- `grid-template-columns: 1fr 1fr 1fr;` üç eşit sütun oluşturur. `repeat(3, 1fr)` aynı şeyi daha kısa söyler.
- `gap: 16px;` hem satırlara hem sütunlara boşluk verir.

## Tests
- 1–3 numaralı fotoğraflar ilk satırda
- 4 numaralı fotoğraf ikinci satırı başlatıyor
- Sütunlar eşit genişlikte
- Yatay boşluk 16px
- Dikey boşluk 16px
