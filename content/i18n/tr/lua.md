tagline: Küçük, hızlı ve tahmin ettiğinizden çok daha fazla oyuna ve araca gömülü. Diziler 1'den başlar; bununla barışın.
runtime: Lua 5.3 · Fengari, tarayıcınızda çalışır

# Lesson: Değişkenler ve Türler
summary: local, nil, sayılar, metinler ve .. operatörü.

Lua'da değişkenler **varsayılan olarak globaldir**; bu nadiren istediğiniz şeydir. Aksi için bir nedeniniz yoksa her yeni değişkenin önüne `local` koyun. Yerel değişkenler daha hızlıdır ve onları beklemeyen koda sızamazlar.

```lua
local score = 10      -- local to this file or block
count = 3             -- global: visible everywhere (avoid)
```

Lua'nın küçük bir tür kümesi vardır: `nil`, `boolean`, `number`, `string`, `table` ve `function` (bir de şimdilik görmezden gelebileceğiniz `userdata` ile `thread`). Hiç atanmamış bir değişken basitçe `nil`'dir.

Lua 5.3'ten beri sayıların iki alt türü vardır: **integer** (tam sayı) ve **float** (ondalıklı). `/` her zaman float üretir; `//` ise aşağı yuvarlayan bölmedir.

Metinler `+` ile değil `..` (iki nokta) ile birleştirilir ve `#` bir metnin uzunluğunu verir. Sayılar birleştirildiklerinde kendiliğinden metne dönüştürülür.

> Birden fazla argümanla çağrılan `print`, onları sekme karakterleriyle ayırır. Buradaki örnekler çıktı düzgün kalsın diye çoğunlukla `..` ile tek bir metin kurar.

# Lesson: Koşullar
summary: if/then/end, ~= ve yanlış sayılan değerlerin çok kısa listesi.

Koşullar `if ... then` ile yazılır, isteğe bağlı `elseif` (tek kelime) ve `else` kullanılır ve `end` ile biter.

```lua
if score >= 90 then
  grade = "A"
elseif score >= 80 then
  grade = "B"
else
  grade = "C"
end
```

"Eşit değil" `~=` diye yazılır. Mantıksal operatörler `and`, `or` ve `not` kelimeleridir.

Başka dillerden gelenleri şaşırtan kısım şu: **yalnızca `nil` ve `false` yanlış sayılır**. Sıfır doğrudur. Boş metin doğrudur. Boş tablo doğrudur.

`and` ve `or` katı bir boolean yerine işlenenlerinden birini döndürür; bu da size iki kullanışlı kalıp verir:

- `x or default`, `x` değeri `nil` (ya da `false`) olduğunda `default` kullanır
- `cond and a or b`, `a` değeri `false` ya da `nil` olmadığı sürece üçlü operatör gibi çalışır

# Lesson: Döngüler
summary: Sayısal for, while, repeat...until ve kayıp continue.

Sayısal `for` bir başlangıçtan bir bitiş değerine kadar sayar ve bitiş **dahildir**. İsteğe bağlı üçüncü sayı adımı belirler ve negatif olabilir.

```lua
for i = 1, 5 do ... end        -- 1, 2, 3, 4, 5
for i = 10, 0, -5 do ... end   -- 10, 5, 0
```

`while cond do ... end` her turdan önce kontrol eder. `repeat ... until cond` ise her turdan **sonra** kontrol eder; bu yüzden gövdesi en az bir kez çalışır.

`break` döngüden çıkar. Lua'da `continue` yoktur; olağan yerine geçenler gövdeyi bir `if` içine sarmak ya da gövdenin sonunda `::continue::` etiketiyle birlikte `goto continue` kullanmaktır.

Bir de tablolar üzerinde `ipairs` ve `pairs` ile dolaşan genel `for` vardır. Onu Tablolar dersinde göreceksiniz.

# Lesson: Fonksiyonlar
summary: Birden fazla dönüş değeri, değişken sayıda argüman ve kapanışlar.

Fonksiyonları `local function name(params) ... end` ile tanımlayın. Eksik argümanlar `nil` olarak gelir; bu yüzden varsayılan değer vermenin standart yolu `param = param or default`'tur.

Lua fonksiyonları **aynı anda birkaç değer döndürebilir** ve çağıran taraf bunları birkaç değişkene alabilir:

```lua
local function divmod(a, b)
  return a // b, a % b
end
local q, r = divmod(17, 5)   -- q = 3, r = 2
```

`...` istenen sayıda argümanı toplar. Üzerinde dönmek için onu bir tabloya sarın: `{...}`.

Fonksiyonlar sıradan değerlerdir. Onları değişkenlerde saklayabilir, başka yerlere geçirebilir ve başka fonksiyonlardan döndürebilirsiniz. İçteki bir fonksiyon, kendisini oluşturan fonksiyonun yerel değişkenlerine erişmeye devam eder; buna **kapanış** (closure) denir.

# Lesson: Tablolar
summary: Lua'nın dizi, sözlük ve nesne olarak kullanılan tek veri yapısı.

Lua'nın tam olarak bir veri yapısı vardır: **tablo**. Ve her şeyi o yapar.

**Dizi** olarak kullanıldığında tablo 0'dan değil **1**'den indekslenir. `#t` uzunluğu verir, `table.insert(t, value)` sona ekler.

```lua
local colors = {"red", "green", "blue"}
print(colors[1])   -- red
print(colors[0])   -- nil: there is nothing at index 0
```

**Sözlük** olarak kullanıldığında anahtarlar metin (ya da neredeyse her değer) olabilir. `t.name`, `t["name"]` için kısaltmadır. Var olmayan bir anahtarı okumak hata yerine `nil` verir.

Diziler üzerinde `ipairs` ile (sırayla, 1'den n'e), sözlükler üzerinde `pairs` ile dönün. `pairs`'in sırası **garanti değildir**; asla ona güvenmeyin.

`table.concat(t, sep)` bir metin dizisini birleştirir; bir diziyi yazdırmanın en hızlı yolu budur.

# Lesson: Metatablolar ve Nesneler
summary: Bir tablo artı bir metatablonun nasıl sınıfa dönüştüğü ve iki noktanın ne anlama geldiği.

Lua'da sınıf yoktur ama **metatablolar** vardır: başka bir tabloya iliştirilen ve onun davranışını değiştiren bir tablo. En kullanışlı alanı `__index`'tir. Bir tablonun sahip olmadığı bir anahtarı okuduğunuzda Lua onu `__index` içinde arar.

Nesne kurmak için bu kadarı yeter. Metotları bir tabloya koyun, onu `__index` yapın; her örnek ona geri düşer:

```lua
local Dog = {}
Dog.__index = Dog
function Dog.new(name) return setmetatable({name = name}, Dog) end
function Dog:speak() return self.name .. " says woof" end
```

Kilit ayrıntı **iki nokta** (colon) işaretidir. `function Dog:speak()`, `function Dog.speak(self)` için kısaltmadır; `rex:speak()` de `rex.speak(rex)` için kısaltmadır. `.` ile `:`'yı karıştırmak var olan en yaygın Lua hatasıdır.

`error(message)` bir hata fırlatır; `pcall(f, ...)` ise bir fonksiyonu korumalı modda çağırır ve çökmek yerine `false` ile birlikte hata mesajını döndürür. Mesajın başına dosya adı ve satır numarası eklenir.

# Quiz

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Bir hata
explain: Lua dizileri 1. indeksten başlar. 0. indekste hiçbir şey yoktur ve eksik bir anahtarı okumak hata yerine `nil` verir.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Bir hata
explain: Lua'da yalnızca `nil` ve `false` yanlış sayılır. C, JavaScript ya da Python'un aksine sıfır da boş metin de doğru sayılır.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Bir hata
explain: Lua 5.3 ve sonrasında `/` her zaman ondalıklı bölme yapar; bu yüzden sonuç float olan `5.0`'dır. Aşağı yuvarlayan bölme için `//` kullanın; burada tam sayı `5`'i verir.

## Q: İki metni hangi operatör birleştirir?
- =
- =
- =
- =
explain: Lua birleştirme için `..` kullanır. `+` tamamen aritmetiktir: `"10" + 1` metni dönüştürür ve `11` verir, `"a" + 1` ise hatadır.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Bir hata
explain: Uzunluk operatörü `#`, `..`'dan daha sıkı bağlanır; yani bu `(#"hello") .. "!"`, dolayısıyla `5 .. "!"` demektir. Sayı birleştirme sırasında metne çevrilir.

## Q: Lua'da "eşit değil" nasıl yazılır?
- =
- =
- =
- =
explain: Lua `~=` kullanır. `!=` yazmak bir sözdizimi hatasıdır ve başka dillerden geçenler arasında çok yaygındır.

## Q: Bu kod ne yazdırır?
- =
- =
- Bir hata
- =
explain: `limit` `local` olmadan atandı; bu yüzden fonksiyondan daha uzun yaşayan global bir değişkene dönüştü. `local` yazmayı alışkanlık haline getirmeniz gerekmesinin nedeni tam olarak bu.

# Challenge: Doğru indeksten topla

`sum(nums)`, dizi biçimindeki bir tablodaki sayıları toplamalı. Bunun yerine çöküyor. Düzeltin.

## Hints
- Hata mesajını okuyun: bir şeyin `nil` olduğunu söylüyor. Hangi indeks `nil` olur?
- Lua dizileri 1'den başlar; yani `nums[0]` değeri `nil`'dir.
- Döngüyü 1'den başlatın: `for i = 1, #nums do`. (Ya da `for _, n in ipairs(nums) do` kullanın.)

# Challenge: Palindrom kontrolü

`isPalindrome(word)` fonksiyonunu tamamlayın; büyük-küçük harfi yok sayarak, kelime tersten de aynı okunuyorsa `true` döndürsün.

## Hints
- Metinlerin iki nokta ile çağrılan metotları vardır, örneğin `word:lower()`.
- Hazır bir `string.reverse` vardır; `word:reverse()` olarak çağrılabilir.
- Önce küçük harfe çevirin, sonra metni tersiyle karşılaştırın.

# Challenge: map yaz

`t` dizisinin her elemanı için `fn(item)` içeren **yeni** bir tablo döndüren `map(t, fn)` fonksiyonunu yazın. Orijinal tablo değişmemeli.

## Hints
- Boş bir tablo oluşturun, `local result = {}`, ve sonunda onu döndürün.
- `for i, v in ipairs(t) do` ile dönün ve `fn(v)` değerini `result[i]` içine yazın.
- `t` yerine `result` içine yazmak orijinali dokunulmadan tutar.

# Challenge: Nokta mı, iki nokta mı?

`Counter` nesnesi 2'ye kadar saymalı ama çöküyor. Hatayı mümkün olan en küçük değişiklikle düzeltin.

## Hints
- Hata `self`'ten bahsediyor. `increment` içinde `self`'in değeri nedir?
- `function Counter:increment()` nesneyi gizli bir ilk argüman olarak bekler.
- `c:increment()`, `c`'yi kendiliğinden `self` olarak geçirir; `c.increment()` hiçbir şey geçirmez.
