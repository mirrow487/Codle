tagline: Statik tipli, derli toplu; .NET uygulamalarının ve Unity oyunlarının belkemiği.
runtime: C# · uzak bir .NET/Mono derleyicisinde derlenir

# Lesson: Değişkenler ve Türler
summary: Statik türler, var ve 7 / 2'nin neden 3 olduğu.

C# **statik tiplidir**: her değişkenin türü derleme zamanında sabitlenir ve derleyici bir `int`'in yerine metin koymanızı reddeder. Bu, programınız daha çalışmadan bir hata kategorisinin tamamını yakalar.

```csharp
int count = 3;
count = "three";   // compile error: cannot convert string to int
```

Her gün kullanacağınız türler: `int` (tam sayılar), `double` (ondalıklar), `decimal` (kesin ondalıklar, para için doğru seçim), `bool`, `char` (tek tırnak içinde tek karakter) ve `string` (çift tırnak içinde metin).

`var`, türü değerden derleyicinin çıkarmasını sağlar. Bu yine de statik tiplemedir: `var city = "London";`, `city`'yi sonsuza dek bir `string` yapar.

`/` işleminin iki tarafı da tam sayıysa C# **tam sayı bölmesi** yapar ve kalanı atar. Kesirli sonuç için taraflardan birini `double` yapın.

Başına `$` konan metinler **araya değer eklenmiş** (interpolated) metinlerdir: içlerindeki `{expression}` değeriyle değiştirilir.

> Buradaki her C# programı, `static void Main()` metodu olan bir sınıfın içinde yaşar. Çalışma oradan başlar.

# Lesson: Koşullar ve switch
summary: if/else, switch deyimleri ve üçlü operatör.

`if`, `else if` ve `else` parantez içinde bir koşul alır. Koşul gerçek bir `bool` olmalıdır; C# `0`'ı ya da `null`'ı sizin yerinize yanlış saymaz. Bu sizi klasik bir C hatasından kurtarır.

```csharp
if (count = 0) { }   // compile error, not a silent bug
```

Bir `switch` deyimi tek bir değeri birkaç durumla karşılaştırır. Her durum bölümü `break` (ya da `return`) ile bitmelidir; bir gövdeyi paylaşmak için etiketleri üst üste koyabilirsiniz:

```csharp
switch (day)
{
    case "Sat":
    case "Sun":
        Console.WriteLine("Weekend");
        break;
    default:
        Console.WriteLine("Weekday");
        break;
}
```

Modern C#'ta (sürüm 9 ve sonrası) bir değer üreten kompakt **switch ifadeleri** de vardır:

```csharp
string kind = day switch
{
    "Sat" or "Sun" => "Weekend",
    _ => "Weekday"
};
```

Basit iki yönlü seçimlerde üçlü `condition ? a : b` her şeyi tek satırda tutar.

# Lesson: Döngüler
summary: for, foreach, while ve do-while.

`for` döngüsü bir başlangıcı, bir koşulu ve bir güncellemeyi tek satıra sığdırır. `foreach` bir dizinin ya da koleksiyonun her elemanı üzerinden geçer; indekse ihtiyacınız yoksa uzanacağınız döngü odur.

`while` her turdan önce koşulunu kontrol eder. `do ... while` sonra kontrol eder; bu yüzden gövdesi her zaman en az bir kez çalışır.

`break` döngüden çıkar; `continue` bir sonraki tura atlar.

> Bir `foreach` onun üzerinde dolaşırken bir `List`'e eleman ekleyemez ya da çıkaramazsınız. C# işler karışsın diye beklemek yerine `InvalidOperationException` fırlatır.

# Lesson: Metotlar
summary: Dönüş türleri, isteğe bağlı parametreler, aşırı yükleme ve out parametreleri.

Bir metot dönüş türünü adından önce bildirir; hiçbir şey döndürmüyorsa `void` yazılır. Doğrudan `Main`'den çağrılan metotlar `static` olarak işaretlenir, çünkü onları üzerinde çağıracağınız bir nesne yoktur.

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

Tek satırlık metotlar için **ifade gövdesi** vardır: `static int Square(int x) => x * x;`

Parametrelere varsayılan değer vererek onları **isteğe bağlı** yapabilirsiniz. Bir metodu **aşırı yükleyebilirsiniz** de (overloading): aynı isimde ama farklı parametre türlerine sahip birkaç sürüm yazarsınız ve derleyici her çağrı için doğru olanı seçer.

Bir `out` parametresi, metodun fazladan bir değer geri vermesini sağlar. Çatının `TryParse` metotları bu kalıbı kullanır: başarı için `true` ya da `false` döndürür ve ayrıştırılan değeri `out` değişkenine koyarlar.

# Lesson: Koleksiyonlar ve LINQ
summary: List<T>, Dictionary<K, V> ve verileri LINQ ile sorgulamak.

Dizilerin boyutu sabittir. Bir `List<T>` ise ekledikçe büyür; burada `T`, tuttuğu elemanların türüdür. `Count` kaç elemanı olduğunu söyler.

`Dictionary<TKey, TValue>` anahtarları değerlere eşler. Eksik bir anahtarı `dict[key]` ile okumak `KeyNotFoundException` fırlatır; anahtar orada olmayabilecekse `TryGetValue` kullanın.

**LINQ** (`using System.Linq;` ile gelir) her koleksiyona sorgu metotları ekler: `Where` süzer, `Select` dönüştürür; `Sum`, `Max`, `Count` ve benzerleri özetler.

> `Console.WriteLine(myList)` ekrana listenin içeriğini değil tür adını yazar; bu doğrudur ve hiçbir işe yaramaz. İçeriği görmek için `string.Join(", ", myList)` kullanın.

# Lesson: Sınıflar
summary: Özellikler, yapıcılar, metotlar ve istisnalar.

Bir **sınıf** verileri ve davranışları gruplar. Veriler genellikle **özellikler** (property) aracılığıyla dışarı açılır; dışarıdan alan gibi görünürler ama erişimi denetleyebilirler:

```csharp
public string Owner { get; }               // read-only after construction
public decimal Balance { get; private set; } // readable everywhere, settable only inside
```

**Yapıcı** (constructor) sınıfla aynı adı taşır ve dönüş türü yoktur. `new BankAccount("Ada")` yazdığınızda çalışır.

`ToString()`'i geçersiz kılmak (override), bir nesnenin yazdırıldığında ya da araya değer eklenmiş bir metne konduğunda nasıl görüneceğini belirler.

Bir metot kabul edemeyeceği bir girdi aldığında bir istisna **fırlatır**. Çağıran taraf onu `try` / `catch` ile yakalayabilir.

# Quiz

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: İki işlenen de `int` olduğu için C# tam sayı bölmesi yapar ve kalanı atar (sıfıra doğru keser). `3.5` elde etmek için `7 / 2.0` yazın ya da taraflardan birini `double`'a dönüştürün.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: `bool.ToString()` büyük harfle başlayan `"True"` ya da `"False"` döndürür. C# anahtar kelimeleri küçük harflidir, yazdırılan metin değil. Herkesi tam bir kez şaşırtır.

## Q: Hangi satır boş ve büyüyebilen bir metin listesi oluşturur?
- =
- =
- =
- =
explain: `List<T>` jeneriktir; bu yüzden ne tuttuğunu söylemeniz ve yapıcısını `()` ile çağırmanız gerekir. Bir `List<string>`, bir `string[]` değildir; `new List<string>[]` ise boyutsuz bir liste dizisi oluşturmaya çalışırdı.

## Q: Bu kod ne yazdırır?
- =
- =
- Derleme hatası
- Bir istisna
explain: C# metinler için `==` operatörünü referansları değil karakterleri karşılaştıracak şekilde aşırı yükler. Aynı içeriğe sahip iki metin, nasıl kurulmuş olursa olsun eşittir. (Java bunu farklı yapar; ikisi arasında gidip gelenleri şaşırtır.)

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: C# işlenenleri kesinlikle soldan sağa değerlendirir. `x++` 5 verir ve sonra `x`'i 6 yapar. `++x`, `x`'i 7 yapar ve 7 verir. Yani `y` = 5 + 7 = 12. Geçerli, iyi tanımlı ve yine de gerçek kodda yazılmaması gereken bir şey.

## Q: Bu çalıştığında ne olur?
- `0` yazdırır
- Hiçbir şey yazdırmaz
- `IndexOutOfRangeException` fırlatır
- Derlenmez
explain: 3 elemanlı bir dizinin indeksleri 0, 1 ve 2'dir. C# dizi sınırlarını çalışma zamanında kontrol eder; bu yüzden 3. indeksi okumak istisna fırlatır. İndeks her yerden gelebileceği için derleyici bunu yakalamaz.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: `4.0` bir `double`'dır; bu yüzden `int` olan 10 yükseltilir ve bölme kayan noktada yapılır.

# Challenge: Ortalamayı düzelt

`Average` sayıların tam ortalamasını döndürmeli, ama ondalık kısmı sürekli kaybediyor. Düzeltin.

## Hints
- Metot bir `double` döndürüyor; o halde cevap neden tam sayı? Bölmedeki türlere bakın.
- `int / int` tam sayı bölmesidir. Sonuç `double`'a çevrilmeden önce kesilir.
- Bölmeden önce dönüştürün: `(double)sum / numbers.Length`.

# Challenge: Kelimeleri say

`CountWords`'ü `text` içindeki kelime sayısını döndürecek şekilde yazın. Kelimeler bir ya da daha fazla boşlukla ayrılır; baştaki ve sondaki boşluklar kelime sayılmamalı.

## Hints
- `text.Split(' ')` boşluklardan böler, ama art arda gelen boşluklar sonuçta boş metinler bırakır.
- `StringSplitOptions.RemoveEmptyEntries` bu boş metinleri atar.
- `text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length` cevabın tamamıdır.

# Challenge: FizzBuzz, düzgünce

`FizzBuzz(n)`, 3'ün katları için `"Fizz"`, 5'in katları için `"Buzz"`, ikisinin de katları için `"FizzBuzz"`, diğer durumlarda sayının kendisini döndürsün.

## Hints
- `n` 3'ün katıysa `n % 3 == 0` doğrudur.
- Sıra önemli: önce "ikisinin de katı" durumunu kontrol edin, yoksa 15 `"Fizz"` döndürüp orada kalır.
- Hem 3'ün hem 5'in katı olan bir sayı 15'in katıdır.

# Challenge: Rectangle'ı tamamla

`Rectangle`'ın `Area` ve `IsSquare` özelliklerini tamamlayın.

## Hints
- Bir özellikteki `=>`, hesaplanan ve salt okunur bir özellik tanımlar. Sağ taraf her okunduğunda yeniden hesaplanır.
- Sınıfın içinde `Width` ve `Height`'ı doğrudan kullanabilirsiniz.
- `Area => Width * Height;` ve `IsSquare => Width == Height;`
