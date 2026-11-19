tagline: Donanıma yakın ve gücüyle ünlü. Size tamamen güvenir; bu hem özelliği hem de uyarısıdır.
runtime: C++17 · uzak bir GCC'de derlenir

# Lesson: Değişkenler ve Türler
summary: Temel türler, std::string, auto ve bool'ların nasıl yazdırıldığı.

C++ statik tiplidir ve makine koduna derlenir. Her değişkenin derleme zamanında belirlenen bir türü vardır ve pek çok hata program çalışmadan yakalanır.

Temel türler: `int` (tam sayılar), `double` (ondalıklar), `char` (tek tırnak içinde tek karakter) ve `bool`. Metin, `<string>` başlık dosyasındaki `std::string`'te yaşar.

`auto`, derleyiciden türü ilk değerden çıkarmasını ister. `auto x = 9.5;`, `x`'i bir `double` yapar.

Çıktı `std::cout` ve `<<` operatörü üzerinden gider. `"\n"` satırı bitirir.

Yeni başlayanları yakalayan iki şey:

- `int / int` **tam sayı bölmesidir**: `7 / 2` sonucu `3`'tür. `3.5` için taraflardan birini `double` yapın.
- `bool` değerleri, önce akışa `std::boolalpha` göndermezseniz `1` ve `0` olarak yazdırılır.

> Değer vermeden tanımladığınız yerel bir değişken, o bellekte o an ne varsa onu tutar. Onu okumak tanımsız davranıştır. Her zaman ilk değer verin: `int count;` değil, `int count = 0;`.

# Lesson: Koşullar
summary: if/else, tam sayılar ve karakterler üzerinde switch ve üçlü operatör.

`if`, `else if` ve `else` beklediğiniz gibi çalışır. Karşılaştırmalar `==`, `!=`, `<`, `<=`, `>`, `>=`'dir ve `&&` (ve), `||` (veya) ile `!` (değil) kullanılarak birleştirilir.

Klasik bir C++ tuzağı: `if (x = 5)` derlenir. `x`'e 5 **atar** ve sonra sonucu test eder; sonuç her zaman doğrudur. Derleyiciler bu konuda uyarır; uyarılarınızı okuyun.

`switch` tam sayılar, karakterler ve enum'lar üzerinde çalışır ama `std::string` üzerinde **çalışmaz**. `break` yazmazsanız her durum bir sonrakine akar; bu bazen işe yarar, sık sık da hatadır.

```cpp
switch (grade) {
    case 'A':
        std::cout << "Excellent\n";
        break;
    case 'B':
    case 'C':                   // both 'B' and 'C' land here
        std::cout << "Good\n";
        break;
    default:
        std::cout << "Keep going\n";
}
```

Üçlü `condition ? a : b` iki değerden birini seçer.

# Lesson: Döngüler
summary: for, aralık tabanlı for, while ve do-while.

Klasik `for` döngüsünün bir başlatıcısı, bir koşulu ve bir artırımı vardır. Döngü başlığında `++i` ile `i++` aynı davranır.

**Aralık tabanlı for** döngüsü bir kabın her elemanını ziyaret eder. Her elemana kopyalamadan bakmak için `const auto&`, elemanları yerinde değiştirmek istediğinizde `auto&` yazın.

```cpp
for (const auto& word : words) { ... }  // read only, no copies
for (auto& n : numbers) { n *= 2; }      // modifies the vector
```

`while` her turdan önce kontrol eder; `do ... while` sonra kontrol eder, yani en az bir kez çalışır.

# Lesson: Fonksiyonlar ve Referanslar
summary: Değerle geçirme, referansla geçirme, const referanslar ve aşırı yükleme.

C++ varsayılan olarak argümanları **değerle** geçirir: fonksiyon kendi kopyasını alır ve ona yapılan değişiklikler fonksiyonun içinde kalır.

**Referansla** geçirmek için parametre türüne `&` ekleyin. Fonksiyon o zaman çağıranın asıl değişkeni üzerinde çalışır.

Yalnızca okumak istediğiniz büyük nesneler için bir **const referans** kullanın: `const std::string& name`. Kopyadan kaçınır ve argümanı değiştirmeyeceğine söz verir. Metinleri ve kapları almanın standart yolu budur.

Varsayılan argümanlar parametre listesinin sonuna gider ve **aşırı yükleme** (overloading), parametre türleri farklı olduğu sürece birkaç fonksiyonun aynı adı paylaşmasını sağlar.

# Lesson: Vektörler ve Map'ler
summary: Diziler için std::vector, sıralı anahtar/değer çiftleri için std::map.

`std::vector<T>` varsayılan kaptır: yeniden boyutlandırılabilen bir dizi. `push_back` sona ekler, `size()` sayar, `front()` / `back()` uçları okur.

`v[i]` sınır kontrolü yapmaz; sonun ötesini okumak tanımsız davranıştır. `v.at(i)` ise kontrol eder ve bunun yerine `std::out_of_range` fırlatır.

`std::map<K, V>` anahtar/değer çiftlerini **anahtara göre sıralı** saklar. C++17'den beri her çifti bir döngüde yapılandırılmış bağlamalarla (structured bindings) açabilirsiniz: `for (const auto& [key, value] : m)`.

> `m["missing"]` başarısız olmaz. Anahtarı varsayılan bir değerle (bir `int` için 0) **ekler**. Yalnızca kontrol etmek istediğinizde `m.count(key)` ya da `m.find(key)` kullanın.

# Lesson: Sınıflar
summary: Özel veriler, ilk değer listeli yapıcılar ve const üye fonksiyonlar.

Bir `class`, verileri onlar üzerinde çalışan fonksiyonlarla bir araya getirir. Üyeler varsayılan olarak **özeldir** (private); yani dışarıdaki kod onlara doğrudan dokunamaz. Arayüz `public:` bölümüdür. (`struct` da aynıdır; tek fark üyelerin varsayılan olarak public olmasıdır.)

**Yapıcı** nesneye ilk değerini verir. İki noktadan sonra gelen **üye ilk değer listesi**, üyeleri sonradan atamak yerine doğrudan kurar:

```cpp
BankAccount(const std::string& owner) : owner_(owner), balance_(0) {}
```

`const` olarak işaretlenmiş bir üye fonksiyon nesneyi değiştirmeyeceğine söz verir ve `const` bir nesne üzerinde çağırabileceğiniz tek türdür. Okuma metotlarını alışkanlıkla `const` yapın.

Üye adlarının sonundaki alt çizgi bir kural değil, yaygın bir gelenektir. Yalnızca üyeleri kolayca fark etmeyi sağlar.

# Quiz

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: İki işlenen de `int`'tir; bu yüzden bu, sıfıra doğru kesen tam sayı bölmesidir. `7 / 2.0` sonucu `3.5` verirdi.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Hiçbir şey
explain: Akışlar `bool` değerini varsayılan olarak `1` ya da `0` diye yazar. `true` elde etmek için önce `std::boolalpha` ekleyin (`std::cout << std::boolalpha << ok;`).

## Q: Hangi imza büyük bir vektörü kopyalamadan ve değiştiremeden okur?
- =
- =
- =
- =
explain: Const referans kopyadan kaçınır ve değişikliği yasaklar. Değerle geçirmek vektörün tamamını kopyalar. Düz referans değişikliğe izin verir. `std::vector<int>* const` ise const olmayan bir vektörü gösteren sabit bir işaretçidir; yani fonksiyon elemanları yine değiştirebilir.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Çöker
explain: Vektör üç elemanla başlar; bu yüzden `size()` 3'tür. `push_back(4)`'ten sonra dört eleman vardır ve 3. indeks (dördüncü eleman) 4'tür.

## Q: Bu kodun nesi yanlış?
- Hiçbir şey
- İlk `int` sızdırılmış: artık onu gösteren hiçbir şey yok, bu yüzden asla silinemez
- Derlenmez: `p` zaten bir şeyi gösteriyor
- İkinci `new` ilk değerin üzerine yazar, yani `*p` hâlâ 5'tir
explain: Her `new` eşleşen bir `delete` gerektirir. `p`'yi yeniden atamak, ilk ayrılan belleği gösteren tek işaretçiyi kaybettirir; bu yüzden o bellek program bitene kadar ayrılmış kalır. Modern C++ bundan `std::make_unique` ya da düz değerlerle kaçınır.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Derlenmez
explain: `s[0]`, `'a'` `char`'ıdır ve bir `char` yalnızca küçük bir tam sayıdır: ASCII'de 97. `s.length()` 3'tür; bu yüzden toplam 100 sayısıdır.

## Q: Bu kod ne yazdırır? (C++17 olarak derlendiğinde)
- =
- =
- =
- Derlenmez
explain: Anahtar eksik olduğunda `operator[]` varsayılan bir değer (0) ekler; bu yüzden map'te artık bir giriş vardır. C++17'den beri `<<` işlenenleri soldan sağa değerlendirilir; yani ekleme, `size()` çağrılmadan önce gerçekleşir.

# Challenge: Değişiklik kalıcı olsun

`doubleAll` aldığı vektördeki her sayıyı ikiye katlamalı. Döngü doğru görünüyor, ama sayılar değişmiyor. Düzeltin.

## Hints
- Döngü değerleri gerçekten ikiye katlıyor. Peki hangi vektörü?
- Parametrede `&` olmadan `doubleAll`, `nums`'ın bir kopyasını alır.
- Vektörü referansla alın: `std::vector<int>& values`.

# Challenge: Bir karakteri say

`countChar(s, c)`'yi, `c` karakterinin `s` metninde kaç kez geçtiğini döndürecek şekilde yazın.

## Hints
- Aralık tabanlı for döngüsü metinlerde de çalışır: `for (char ch : s)`.
- Her karakteri `c` ile karşılaştırın ve eşleştiklerinde bir sayacı artırın.
- Standart kütüphanede tek satırlık bir çözüm var: `<algorithm>`'den `std::count(s.begin(), s.end(), c)`.

# Challenge: Yalnızca çiftleri tut

`evens(values)` yalnızca çift sayıları orijinal sıralarıyla içeren **yeni** bir vektör döndürsün.

## Hints
- Boş bir `std::vector<int> result;` ile başlayın ve sonunda onu döndürün.
- `v % 2 == 0`, 0 ve negatif çiftler dahil, çift sayılar için doğrudur.
- `result.push_back(v)` sona bir sayı ekler.

# Challenge: En büyük sayı

`largest` boş olmayan bir vektördeki en büyük sayıyı döndürmeli. Bazı girdiler için çalışıyor, diğerlerinde sessizce yanılıyor. Düzeltin.

## Hints
- Hangi test başarısız? Oradaki sayıların hepsinin ortak noktası ne?
- Sayıların hepsi negatifse, hiçbiri başlangıç değeri olan 0'dan büyük değildir.
- Gerçek bir elemandan başlayın: `int best = v[0];` (vektör burada asla boş değil). `<algorithm>`'den `std::max_element` da çalışır.
