tagline: Bilerek uzun soluklu, tasarımı gereği taşınabilir ve hâlâ dünyadaki arka uçların dikkate değer bir kısmını çalıştırıyor.
runtime: Java 21 · uzak bir JDK'da derlenir

# Lesson: Değişkenler ve Türler
summary: İlkel türler, String, var, final ve + işaretinin metinle nasıl davrandığı.

Java statik tiplidir: her değişkenin ne tuttuğunu bildirirsiniz ve derleyici sizi buna bağlı tutar.

**İlkel** türler düz değerleri saklar: `int`, `long`, `double`, `boolean`, `char` ve birkaç küçük tür daha. `String` (büyük S ile) ilkel değil bir sınıftır, ama o kadar sık kullanılır ki Java ona özel bir yazım verir: `"like this"`.

Java 10'dan beri `var`, yerel bir değişkenin türünü değerinden çıkarır: `var city = "London";` bir `String`'dir. `final` bir değişkeni ilk atamadan sonra değiştirilemez yapar ve sabitler geleneksel olarak `UPPER_SNAKE_CASE` ile yazılır.

`int / int` tam sayı bölmesidir; yani `7 / 2` sonucu `3`'tür.

`+` operatörü soldan sağa çalışır ve bir `String` ile karşılaştığı andan itibaren sonrasındaki her şey birleştirmeye dönüşür. Bu yüzden `"1" + 2 + 3` sonucu `"123"`, `1 + 2 + "3"` sonucu ise `"33"`'tür.

> Her Java programı, `public static void main(String[] args)` metodu olan bir sınıfa ihtiyaç duyar. Bu kalıp kod giriş ücretidir; bir hafta sonra onu görmez olursunuz.

# Lesson: Koşullar
summary: if/else, switch ifadeleri ve == ile equals() tuzağı.

`if`, `else if` ve `else` parantez içinde bir `boolean` koşul alır. Java sayıları doğru ya da yanlış olarak değerlendirmez.

Java 14'ten beri **switch ifadeleri** ok kullanır, `break` gerektirmez ve bir değer üretir:

```java
String kind = switch (day) {
    case "Sat", "Sun" -> "Weekend";
    default -> "Weekday";
};
```

`case X:` ve `break` kullanan klasik `switch` deyimi hâlâ vardır ve eski kodlarda görürsünüz.

Şimdi önemli olana gelelim. `String` dahil nesneler için `==` "bunlar **aynı nesne** mi?" diye sorar; "aynı metni mi tutuyorlar?" diye değil. İçerikleri karşılaştırmak için `.equals()` kullanın. İki metin birebir aynı görünüp yine de `==` testinden geçemeyebilir.

# Lesson: Döngüler
summary: for, gelişmiş for, while ve do-while.

Klasik `for` döngüsünün bir başlatıcısı, bir koşulu ve bir güncellemesi vardır. **Gelişmiş for** döngüsü (çoğu zaman for-each denir) bir dizinin ya da koleksiyonun her elemanı üzerinden geçer:

```java
for (String fruit : fruits) { ... }
```

`while` koşulunu her turdan önce kontrol eder; `do ... while` sonra kontrol eder, yani gövde en az bir kez çalışır.

`break` döngüden çıkar, `continue` bir sonraki tura atlar. İç içe döngülerde Java dıştaki döngüyü etiketleyip `break outer;` yazmanıza izin verir.

# Lesson: Metotlar
summary: Statik metotlar, aşırı yükleme ve "değerle geçirme"nin gerçekte ne demek olduğu.

Metotlar bir dönüş türü (ya da `void`), bir ad ve türü belirtilmiş parametreler bildirir. Doğrudan `main`'den çağrılan metotlar `static`'tir.

Java'da varsayılan parametre değerleri yoktur. Deyimsel karşılığı **aşırı yüklemedir**: aynı adı taşıyan ve parametre listeleri farklı birkaç metot; kısa olan uzun olanı çağırır.

Java her zaman **değerle geçirir**. İlkel türlerde metot bir kopya alır; onu değiştirmenin dışarıda hiçbir etkisi yoktur. Nesnelerde kopyalanan değer **referanstır**; bu yüzden metot çağıranın verdiği nesneyi değiştirebilir ama çağıranın değişkeninin başka bir nesneyi göstermesini sağlayamaz.

# Lesson: Koleksiyonlar ve Akışlar
summary: ArrayList, Map gerçekleştirmeleri ve verileri akışlarla işlemek.

`ArrayList<T>` başvurulacak, boyutu değişebilen listedir. Koleksiyonlar nesne tutar; bu yüzden sayılar için sarmalayıcı türü yazarsınız: `List<int>` değil, `List<Integer>`. Java `int` ile `Integer` arasında kendiliğinden dönüşüm yapar (autoboxing).

Bir `Map<K, V>` anahtar/değer çiftlerini saklar. İhtiyaç duyduğunuz sıralamaya göre gerçekleştirmeyi seçin:

- `HashMap`: en hızlısı, dolaşma sırası belirsiz
- `LinkedHashMap`: ekleme sırasını hatırlar
- `TreeMap`: anahtarları sıralı tutar

`get` eksik bir anahtar için `null` döndürür; `getOrDefault(key, fallback)` genellikle daha hoştur.

**Akışlar** (stream) bir işlem hattı tarif etmenizi sağlar: `filter` eşleşen elemanları tutar, `map` onları dönüştürür ve `sum()` ya da `collect(...)` gibi bir sonlandırıcı işlem sonucu üretir.

# Lesson: Sınıflar
summary: Alanlar, yapıcılar, kapsülleme, toString ve istisnalar.

Bir sınıf **alanlar** (veri) ve **metotlar** (davranış) bildirir. Alanları `private` yapın ve çağıranların ihtiyacı olanı metotlar üzerinden açın. Bu kapsüllemedir ve sınıfı kullanan herkesi bozmadan içini daha sonra değiştirebileceğiniz anlamına gelir.

**Yapıcı** sınıfın adını taşır ve dönüş türü yoktur. `this.owner = owner;`, alanı aynı adı taşıyan parametreden ayırır.

`toString()`'i geçersiz kılmak, `System.out.println(obj)`'nin ne göstereceğini belirler. Bunu yapmazsanız `BankAccount@1b6d3586` gibi bir şey görürsünüz.

Geçersiz girdi, `IllegalArgumentException` gibi bir istisna **fırlatılarak** bildirilir; çağıranlar bunu `try` / `catch` ile ele alabilir.

> Tek bir Java dosyasını doğrudan çalıştırdığınızda dosyadaki ilk sınıf `main`'e sahip olan olmalıdır; aşağıda `Main`'in önce gelmesinin nedeni budur.

# Quiz

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: İki `int` işlenen tam sayı bölmesi demektir; kesirli kısım atılır. `7 / 2.0` sonucu `3.5` verir.

## Q: Bu kod ne yazdırır?
- =
- =
- Derleme hatası
- =
explain: `new String(...)` her zaman yeni bir nesne oluşturur ve `==` nesne kimliğini karşılaştırır. Metinler aynıdır ama nesneler farklıdır. İçerikleri karşılaştırmak için `a.equals(b)` kullanın.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Derleme hatası
explain: `+` soldan sağa değerlendirilir. `"1" + 2` metni `"12"`'dir ve `"12" + 3` sonucu `"123"`'tür. `"15"` istiyorsanız `"1" + (2 + 3)` yazın.

## Q: Hangi satır büyüyebilen bir tam sayı listesi tanımlar?
- =
- =
- =
- =
explain: Jenerikler yalnızca nesne türlerini kabul eder; bu yüzden ilkel `int` yerine sarmalayıcı `Integer` kullanılır. Üçüncü seçenek tür argümanını yanlış yere koyar ve bir `ArrayList` bir dizi değildir.

## Q: Bu kod ne yazdırır?
- =
- =
- Derleme hatası: `arr.length()` olmalı
- Derleme hatası: `arr.size()` olmalı
explain: Dizilerin bir `length` **alanı** vardır. Metinlerin bir `length()` **metodu**, koleksiyonların ise `size()`'ı vardır. Evet, üçü birden. Evet, insanlar bunları yıllarca karıştırır.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Derleme hatası
explain: Bir `char` üzerinde aritmetik onu `int`'e yükseltir ve `'A'` 65'tir. `'B'` elde etmek için geri dönüştürün: `(char) (c + 1)`.

## Q: Varsayılan JVM ayarlarıyla bu kod ne yazdırır?
- =
- =
- =
- =
explain: Autoboxing, -128 ile 127 arasındaki değerler için önbellekteki `Integer` nesnelerini yeniden kullanır; bu yüzden `a` ve `b` aynı nesnedir. 128 önbelleğin dışındadır; bu yüzden `c` ve `d` farklı nesnelerdir. Ders metinlerdekiyle aynı: sarmalayıcı nesneleri `.equals()` ile karşılaştırın.

# Challenge: Yönetici kim?

`isAdmin`, rol `"admin"` metni olduğunda her zaman `true` döndürmeli. Bir testte çalışıyor, diğerinde başarısız oluyor. Düzeltin.

## Hints
- İlk test yalnızca aynı metin sabitleri tek bir nesneyi paylaştığı için geçiyor.
- `==` nesne kimliğini karşılaştırır. Sizin istediğiniz karakterleri karşılaştırmak.
- `.equals()` kullanın. `"admin".equals(role)` yazmak, `role` bir gün `null` olursa `NullPointerException`'dan da kaçınır.

# Challenge: Rakamları topla

`sumDigits(n)`'i, negatif olmayan bir tam sayının ondalık rakamlarının toplamını döndürecek şekilde yazın. Örneğin `sumDigits(123)` = 1 + 2 + 3 = 6.

## Hints
- `n % 10`, `n`'in son rakamını verir.
- `n / 10` (tam sayı bölmesi) son rakamı atar.
- İki adımı bir `while (n > 0)` döngüsünde tekrarlayın ve her son rakamı bir toplama ekleyin.

# Challenge: Baş harfler

Bir ismi, arkalarında nokta olan büyük baş harflere çeviren `initials(fullName)`'i yazın. İsimlerde boşlukla ayrılmış istenen sayıda kelime olabilir.

## Hints
- `fullName.split(" ")` size bir kelime dizisi verir. (`"\\s+"` art arda gelen boşluklarla da başa çıkar.)
- `word.charAt(0)` ilk harftir ve `Character.toUpperCase` onu büyük harfe çevirir.
- Parçaları bir `StringBuilder`'da toplayın; her kelime için bir harf ve ardından bir `'.'` ekleyin.

# Challenge: Termometreyi düzelt

`Temperature.toFahrenheit()` Celsius'u F = C × 9 / 5 + 32 formülüyle Fahrenheit'a çevirir. Vücut sıcaklığı olan 37 °C 98.6 °F olmalı, ama sınıf 98.0 diyor. Hesaplamayı düzeltin.

## Hints
- Metot bir `double` döndürüyor, ama cevap ondalıklarını kaybetmiş. Bu ne zaman oldu?
- `celsius * 9 / 5` tamamen `int`'lerle hesaplanır: 333 / 5 sonucu 66.6 değil 66'dır.
- İşlenenlerden birini `double` yapın, örneğin `9.0`; böylece bölme kesri korur.
