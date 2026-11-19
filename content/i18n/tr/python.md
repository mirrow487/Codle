tagline: Okunaklı, içinden her şey çıkan ve veri biliminden tatil fotoğraflarınızı yeniden adlandıran betiğe kadar her yerde.
runtime: Python 3.12 · Pyodide, tarayıcınızda çalışır

# Lesson: Değişkenler ve Türler
summary: İsimler, değerler ve her gün kullanacağınız birkaç tür.

Python'da değişken, bir değeri gösteren bir isimdir. `let` yok, `var` yok, tür bildirimi de yok. Atama yaparsınız ve isim artık vardır.

```python
city = "Lisbon"
population = 545_000   # underscores are just for readability
```

Python türü değerden kendisi çıkarır. Sürekli karşılaşacaklarınız:

- `int` tam sayılar için; bellek yettiği sürece istediği kadar büyük olabilir
- `float` ondalıklı sayılar için; kayan noktanın bilinen tuhaflıklarıyla birlikte
- `str` metin için; tek ya da çift tırnak içinde
- `bool` için `True` ve `False` (büyük harfle başlar)
- `None` "bilerek hiçbir şey" demek için

`type()` elinizdekinin ne olduğunu söyler. **f-string** (başına `f` konmuş bir metin), herhangi bir ifadeyi `{}` ile doğrudan metnin içine koymanızı sağlar.

Bölme için kısa bir not: `/` her zaman float döndürür, `//` sonucu aşağı yuvarlar, `%` ise kalanı verir.

> İsimler büyük-küçük harfe duyarlıdır ve gelenek olarak `snake_case` yazılır. `Total` ve `total` iki ayrı değişkendir; bir öğleden sonrayı kaybetmenin güvenilir bir yolu.

# Lesson: Koşullar
summary: if, elif, else ve girintinin burada neden bir zevk meselesi olmadığı.

Python kodu gruplamak için girintiyi kullanır. Bir `if` altına girintili yazılan satırlar ona aittir; girinti bittiğinde blok da biter. Gelenek dört boşluktur.

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

Karşılaştırmalar `==`, `!=`, `<`, `<=`, `>`, `>=` şeklindedir. Bunları `and`, `or`, `not` kelimeleriyle birleştirirsiniz. Python zincirleme karşılaştırmaya da izin verir; `18 <= age < 65` tam olarak göründüğü gibi çalışır.

Her değer ya **doğru sayılır** (truthy) ya da **yanlış sayılır** (falsy). Yanlış sayılanlar `False`, `None`, sıfır (`0`, `0.0`) ve boş kaplardır (`""`, `[]`, `{}`). Geri kalan her şey doğru sayılır; "bu liste boş mu?" sorusunun deyimsel yazımının `if not items:` olmasının nedeni budur.

Kısa iki seçenekli değerler için koşullu ifade vardır: `value_if_true if condition else value_if_false`.

# Lesson: Döngüler
summary: for elemanları tek tek dolaşır, while durması söylenene kadar tekrarlar.

Python'da `for` döngüsü yinelenebilir her şeyin üzerinden geçer: listeler, metinler, sözlükler, dosyalar, aralıklar. C tarzı `for (i = 0; ...)` yoktur. Sayılara ihtiyacınız olduğunda `range` kullanırsınız.

`range(start, stop, step)`, `stop` değerine **gelmeden** durur. Yani `range(1, 4)` size 1, 2, 3 verir. Tek bir argüman verirseniz 0'dan başlar.

Hem konuma hem de elemana ihtiyacınız olduğunda `enumerate` ikisini birden verir; bu, bir sayaç değişkenini elle idare etmekten çok daha iyidir.

`while` döngüsü koşulu doğru olduğu sürece tekrarlar. İçeride bir şeyin eninde sonunda koşulu yanlış yapacağından emin olun; yoksa "Çalışma durduruldu" mesajıyla tanışırsınız.

`break` döngüden hemen çıkar. `continue` bir sonraki tura atlar.

> `print(..., end=" ")` olağan satır sonunu bir boşlukla değiştirir; aynı satıra yazdırmak için kullanışlıdır.

# Lesson: Fonksiyonlar
summary: def, return, varsayılan argümanlar ve birden fazla şey döndürmek.

Fonksiyonu `def` ile tanımlar, parametrelerini verir ve `return` ile bir değer geri döndürürsünüz. `return` içermeyen bir fonksiyon da bir şey döndürür: `None`.

Parametrelerin **varsayılan değerleri** olabilir ve çağıran taraf argümanları **isimleriyle** verebilir; bu da çağrıları kendi kendini açıklar hale getirir:

```python
send_email("ada@example.com", subject="Hi", urgent=True)
```

Birden fazla değer döndürmek için onları virgülle ayırarak döndürün. Python bunları bir demete (tuple) paketler ve çağıran taraf doğrudan değişkenlere açabilir.

> Yazdırmak ile döndürmek farklı şeylerdir. `print` bir değeri insana gösterir; `return` ise onu sizi çağıran koda geri verir. Bu ikisini karıştırmak bu dersteki en yaygın başlangıç hatasıdır.

# Lesson: Listeler ve Sözlükler
summary: İşin büyük kısmını taşıyan iki kap.

**Liste** sıralı ve değiştirilebilir bir dizidir. İndeksler 0'dan başlar; negatif indeksler sondan sayar, yani `items[-1]` son elemandır. `items[start:stop]` ile dilimleme yeni bir liste döndürür ve tıpkı `range` gibi `stop` dahil değildir.

**Liste üreteci** (list comprehension), bir döngüden tek ve okunaklı bir satırda liste kurar:

```python
squares = [n * n for n in range(5)]
evens = [n for n in range(10) if n % 2 == 0]
```

**Sözlük** anahtarları değerlere eşler. Değerleri `d[key]` ile okursunuz; anahtar yoksa bu `KeyError` fırlatır. `d.get(key, default)` ise fırlatmaz. Python 3.7'den beri sözlükler ekleme sırasını hatırlar.

Bir sözlüğün çiftleri üzerinde `.items()` ile dönersiniz.

# Lesson: Sınıflar
summary: Verileri ve onlarla çalışan fonksiyonları bir araya getirmek.

**Sınıf** bir kalıptır; **nesne** o kalıptan üretilmiş bir şeydir. `__init__` bir nesne oluşturduğunuzda çalışır ve niteliklerini hazırlar. Her metot ilk parametre olarak nesnenin kendisini alır; gelenek olarak adı `self` konur.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

İki yanında çift alt çizgi olan metotlar, Python'un sizin yerinize çağırdığı kancalardır. `__str__`, `print(obj)` çağrısının ne göstereceğine karar verir; böylece `<__main__.Point object at 0x...>` yerine işe yarar bir şey görürsünüz.

Bir metot işleyemeyeceği bir girdi aldığında bir istisna (exception) fırlatır. Çağıran taraf bunu `try` / `except` ile yakalayabilir.

# Quiz

## Q: Bu kod ne yazdırır?
- =
- =
- =
- Bir hata
explain: `y = x` listeyi kopyalamaz; aynı listeye ikinci bir isim verir. Onu `y` üzerinden değiştirmek, `x`'in gördüğünü de değiştirir. Bağımsız bir kopya istediğinizde `y = x.copy()` (ya da `list(x)`) kullanın.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: Python 3'te `/` gerçek bölmedir ve sonuç tam sayı olsa bile her zaman float döndürür. `2` istiyorsanız `//` kullanın.

## Q: `name` metninin boş olup olmadığını hangi satır doğru şekilde kontrol eder?
- =
- =
- =
- =
explain: Boş metin yanlış sayılır (falsy); bu yüzden `not name` tam olarak metin boşken `True` olur. `== None` ise `""` durumunu kaçırır (ayrıca `None` için doğru test zaten `is None`'dır). Metinlerin `.empty()` diye bir metodu yoktur ve `=` atamadır; `if` içinde sözdizimi hatası verir.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: `range(2, 10, 3)` 2'den başlar ve 10'un altında kaldığı sürece her adımda 3 ekler: 2, 5, 8. Bitiş değeri asla dahil edilmez; 11 zaten onu aşar.

## Q: Hatayı bulun. Bu kod ne yazdırır?
- =
- =
- =
- =
explain: Varsayılan değerler fonksiyon tanımlandığında yalnızca bir kez hesaplanır; bu yüzden her çağrı aynı listeyi paylaşır. Düzeltmesi `items=None` yazıp fonksiyonun içinde `if items is None: items = []` demektir.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: Bir metni tam sayıyla çarpmak onu tekrarlar. Python `"3"` değerini sessizce sayıya çevirmez; 9 elde etmek için `int("3") * 3` yazmanız gerekir.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: Anahtar yoksa `.get()`, `None` döndürür (ya da ikinci argüman olarak verdiğiniz varsayılanı). `KeyError` fırlatan sürüm `settings["font"]` yazımıdır.

# Challenge: Bir eksik, bir fazla

`total_to(n)`, 1'den `n`'e kadar (dahil) bütün tam sayıların toplamını döndürmeli. Yani `total_to(5)` = 1 + 2 + 3 + 4 + 5 = 15. Yakın ama doğru değil. Düzeltin.

## Hints
- Döngünün içinde `i` değerlerini yazdırın. `range(n)` gerçekte hangi sayıları üretiyor?
- `range(n)` 0'dan `n - 1`'e kadar gider. Sizin istediğiniz 1'den `n`'e kadar.
- `range(1, n + 1)` işi görür. (Tek satırlık çözümleri seviyorsanız `sum(range(1, n + 1))` de olur.)

# Challenge: Ünlüleri say

`count_vowels(text)` fonksiyonunu tamamlayın; `text` içinde kaç ünlü harf (a, e, i, o, u) olduğunu döndürsün. Büyük harfli ünlüler de sayılır.

## Hints
- Önce metni `text.lower()` ile küçük harfe çevirin; böylece yalnızca tek bir durumu kontrol edersiniz.
- `ch` bir ünlüyse `ch in "aeiou"` ifadesi `True` olur.
- Kısa bir sürüm: `return sum(1 for ch in text.lower() if ch in "aeiou")`.

# Challenge: Kelimelerden uzunluklara

`word_lengths(sentence)` her kelimeyi uzunluğuna eşleyen bir sözlük döndürsün. Kelimeler boşluklarla ayrılmıştır.

## Hints
- `sentence.split()` metni boşluklardan böler ve bir kelime listesi döndürür. Boş metin için `[]` döndürür.
- Boş bir sözlük oluşturun, kelimeler üzerinde dönün ve `result[word] = len(word)` atayın.
- Sözlük üreteci bunu tek satırda yapar: `{word: len(word) for word in ...}`.

# Challenge: Tekrarları sil, sırayı koru

`unique(items)` tekrarları olmayan yeni bir liste döndürmeli ve her elemanı **ilk** göründüğü yerde tutmalı. Şu anki sürüm tekrarları siliyor ama sırayı karıştırıyor.

## Hints
- Kümeler (set) sırasızdır; bu yüzden kümeye çevirmek orijinal sırayı atar.
- `items` üzerinde sırayla dönün ve daha önce gördüklerinizi bir kümede tutun.
- Bir elemanı yalnızca henüz `seen` içinde değilse ekleyin. (`list(dict.fromkeys(items))` hoş bir kısayoldur, çünkü sözlük anahtarları ekleme sırasını korur.)
