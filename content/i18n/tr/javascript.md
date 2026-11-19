tagline: Web'in dili. Yer yer tuhaf, her yerde son derece yetenekli.
runtime: JavaScript · tarayıcınızda çalışır, konsol çıktısı Node.js biçiminde

# Lesson: Değişkenler ve Türler
summary: let, const ve gerçekten karşılaşacağınız yedi ilkel tür.

Bağlantısı yeniden atanmayacak değişkenleri `const` ile, atanacak olanları `let` ile tanımlayın. Önce `const`'a uzanın; okuyana "bu isim hep aynı şeyi gösterecek" der. Eski kodlarda `var` da görürsünüz. Kapsam kuralları daha gevşektir ve modern kod ondan kaçınır.

```js
const siteName = "Codle";
let visits = 0;
visits = visits + 1;   // fine
siteName = "Other";    // TypeError: Assignment to constant variable.
```

Günlük türler `string`, `number` (tam sayılar ve ondalıklar için tek bir tür), `boolean`, `undefined` (tanımlanmış ama hiç değer verilmemiş), `null` (bilerek boş) ve özel durumlar için `bigint` ile `symbol`'dür. Diziler ve fonksiyonlar dahil geri kalan her şey bir nesnedir.

**Şablon metinleri** (template literal) ters tırnak kullanır ve `${...}` ile ifade gömmenizi sağlar.

> `typeof null` sonucu `"object"`'tir. Bu, 1995'ten kalma ve web'i bozmadan asla düzeltilemeyecek bir hatadır. Null kontrolünü bunun yerine `value === null` ile yapın.

# Lesson: Koşullar ve Eşitlik
summary: if/else, neden istediğinizin === olduğu ve neyin "yanlış sayıldığı".

`if`, `else if` ve `else` beklediğiniz gibi çalışır: koşul parantez içinde, gövde süslü parantez içinde.

JavaScript'te iki eşitlik operatörü vardır. `===` (katı) değeri **ve** türü karşılaştırır. `==` (gevşek) önce türleri dönüştürür; kuralları kimsenin bilerek ezberlemediği türdendir. Özel bir nedeniniz yoksa `===` ve `!==` kullanın.

**Yanlış sayılan** (falsy) değerler `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` ve `NaN`'dir. Geri kalan her şey doğru sayılır; `"0"`, `[]` ve `{}` dahil.

Varsayılan değerler için birbirine benzeyen ama aynı olmayan iki operatör:

- `a || b`, `a` **herhangi** bir yanlış sayılan değerse `b` döndürür
- `a ?? b`, yalnızca `a` değeri `null` ya da `undefined` ise `b` döndürür

Yani `0` geçerli bir değerse, onu çöpe atmayan operatör `??`'dir.

# Lesson: Döngüler
summary: Klasik for, değerler için for...of ve döngüyü sizin yerinize kuran dizi metotları.

Klasik `for` döngüsünün üç parçası vardır: bir başlangıç noktası, her turdan önce kontrol edilen bir koşul ve her turdan sonra çalışan bir güncelleme.

```js
for (let i = 0; i < 3; i++) { /* runs with i = 0, 1, 2 */ }
```

Bir dizinin (ya da metnin, Map'in, Set'in) yalnızca değerlerini istiyorsanız `for...of` daha temizdir. Bir de nesnenin **anahtarları** üzerinde dönen `for...in` vardır; dizilerde ondan kaçının, çünkü indeksleri metin olarak verir.

Dizilerin ayrıca her eleman için bir fonksiyon çağıran ve indeksi ikinci argüman olarak veren `forEach` metodu vardır.

`while` koşulu doğru olduğu sürece tekrarlar. `break` döngüden erken çıkar; `continue` bir sonraki tura atlar.

# Lesson: Fonksiyonlar
summary: Bildirimler, ok fonksiyonları, varsayılan parametreler ve kapanışlar.

Günlük kullanımda fonksiyon yazmanın iki yolu vardır:

```js
function add(a, b) {        // declaration: hoisted, has its own `this`
  return a + b;
}
const add2 = (a, b) => a + b;  // arrow: concise, inherits `this`
```

Tek bir ifadeden oluşan ok fonksiyonu o ifadeyi kendiliğinden döndürür. Süslü parantez eklediğinizde yeniden açıkça `return` yazmanız gerekir. Bunu unutmak, gizemli `undefined`'ların klasik kaynağıdır.

Parametrelerin **varsayılan değerleri** olabilir: `function greet(name, greeting = "Hello")`.

Fonksiyonlar oluşturuldukları yerde kapsamda olan değişkenleri hatırlar. Buna **kapanış** (closure) denir ve sınıf kullanmadan özel durum tutmanın yolu budur: aşağıdaki sayaç `count` değerini çağrılar arasında canlı tutar, ama dışarıdan hiçbir şey ona dokunamaz.

`return` içermeyen bir fonksiyon `undefined` döndürür.

# Lesson: Diziler ve Nesneler
summary: Sıralı listeler, anahtar/değer torbaları, yapı bozma ve yayma operatörü.

**Dizi** 0'dan indekslenen sıralı bir listedir. `push` sona ekler, `length` kaç eleman olduğunu söyler, `at(-1)` sondan okur.

**Nesne** metin anahtarları değerlere eşler. Nokta gösterimiyle (`user.name`) ya da köşeli parantezle (`user["name"]`) okursunuz; anahtar bir değişkendeyse köşeli parantez gerekir.

**Yapı bozma** (destructuring) değerleri tek seferde değişkenlere çıkarır; **yayma** sözdizimi `...` ise özellikleri yeni bir nesneye ya da elemanları yeni bir diziye kopyalar.

> `const` değişkeni yeniden atamanızı engeller, gösterdiği nesneyi değiştirmenizi değil. `const scores = []; scores.push(1);` tamamen geçerlidir.

# Lesson: Dizi Metotları
summary: map, filter, reduce, find ve sort() tuzağı.

Bu metotlar bir fonksiyon alır ve döngüyü sizin yerinize kurar. Nasıl yapılacağını değil, ne istediğinizi anlatır gibi okunurlar.

- `map(fn)` her elemana `fn` uygulanmış yeni bir dizi döndürür
- `filter(fn)`, `fn`'in doğru sayılan bir şey döndürdüğü elemanları tutar
- `reduce(fn, start)` diziyi tek bir değere indirger
- `find(fn)` eşleşen ilk elemanı ya da `undefined` döndürür

Bunların hiçbiri orijinal diziyi değiştirmez. `sort` farklıdır: diziyi **yerinde** sıralar ve varsayılan olarak elemanları metin gibi karşılaştırır. `[10, 9, 1]` dizisinin `[1, 10, 9]` olmasının nedeni budur. Sayıları doğru sıralamak için bir karşılaştırıcı verin.

# Quiz

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: `+` işleminin bir tarafı metinse, JavaScript diğer tarafı metne çevirir ve birleştirir. Diğer aritmetik operatörler ise sayıya çevirir; bu yüzden `"5" - 3` sonucu `2`'dir.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: Nesneler ve diziler içerikleriyle değil, referanslarıyla karşılaştırılır. Bunlar aynı değerleri tutan iki farklı dizidir. İçerikleri karşılaştırmak için üzerlerinde dönün ya da basit veriler için `JSON.stringify` çıktısını karşılaştırın.

## Q: `nums` bir `const`. Burada ne olur?
- =
- =
- =
- =
explain: `const`, `nums` ismini yeniden atamayı engeller. Diziyi dondurmaz; bu yüzden `push` çalışır. Hata fırlatacak satır `nums = []` olurdu.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: `var` fonksiyon kapsamlıdır; bu yüzden üç geri çağırma da tek bir `i`'yi paylaşır. Zamanlayıcılar çalıştığında döngü bitmiştir ve `i` 3'tür. `var` yerine `let` yazarsanız her tur kendi `i`'sini alır ve 0, 1, 2 yazdırılır.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: NaN ("Not a Number", sayı değil), number türünün özel bir değeridir; `0 / 0` ya da `Number("abc")` gibi işlemlerden çıkar. Kontrolünü `Number.isNaN(value)` ile yapın, çünkü `NaN === NaN` sonucu `false`'tur.

## Q: Hangisi argümanının iki katını döndürür?
- =
- =
- =
- =
explain: İfade gövdeli bir ok fonksiyonu o ifadeyi döndürür. Süslü parantezle gövde bir bloğa dönüşür ve açık bir `return` gerekir; bu yüzden ikinci seçenek `undefined` döndürür. Son ikisi sözdizimi hatasıdır.

## Q: Bu kod ne yazdırır?
- =
- =
- =
- =
explain: İkili kayan noktada `0.1 * 3` değeri `0.30000000000000004`'tür. Kayan noktalı sayıları bir toleransla karşılaştırın: `Math.abs(a - b) < Number.EPSILON`.

# Challenge: NaN'siz toplam

`sumArray(arr)` bir dizideki bütün sayıları toplamalı. Şu an her seferinde `NaN` döndürüyor. Nedenini bulun ve düzeltin.

## Hints
- `arr[arr.length]` nedir? Konsola yazdırıp görün.
- Dizinin sonundan öteyi okumak `undefined` verir ve `number + undefined` sonucu `NaN`'dir.
- Döngü `i < arr.length` noktasında durmalı. (Ya da indeksi tamamen bırakın: `arr.reduce((sum, n) => sum + n, 0)`.)

# Challenge: Her kelimenin ilk harfi büyük

`capitalizeWords(str)` fonksiyonunu yazın: boşlukla ayrılmış her kelimenin ilk harfini büyütsün, kelimenin geri kalanına dokunmasın.

## Hints
- `str.split(" ")` size bir kelime dizisi verir; `.join(" ")` onları yeniden birleştirir.
- Tek bir kelime için: `word.charAt(0).toUpperCase()` artı `word.slice(1)`.
- Bölme ve birleştirme arasında `map` kullanarak hepsini bir araya getirin.

# Challenge: Kelimeleri say

`countWords(words)` bir metin dizisi alır. Her kelimeyi kaç kez geçtiğine eşleyen bir nesne döndürün.

## Hints
- Boş bir nesneyle, `{}`, başlayın ve kelimeler üzerinde dönün.
- Bir kelimeyi ilk gördüğünüzde `counts[word]` değeri `undefined`'dır. `counts[word] ?? 0` bunu 0'a çevirir.
- `reduce` ile: `words.reduce((acc, w) => ({ ...acc, [w]: (acc[w] ?? 0) + 1 }), {})`.

# Challenge: Eksik await

`delay(ms, value)`, `ms` milisaniye sonra `value` ile çözülen bir Promise döndürür. `main` ekrana `first and second` yazmalı, ama çok daha az işe yarar bir şey yazıyor. `main`'i düzeltin.

## Hints
- `delay(...)` hemen bir Promise döndürür. Metne çevrilen bir Promise `[object Promise]` olur.
- Bir `async` fonksiyonun içinde `await`, bir Promise sonuçlanana kadar bekler ve size değerini verir.
- `const a = await delay(50, "first");` çalışır. `await Promise.all([...])` iki gecikmeyi aynı anda yürütür, bu da daha hızlıdır.
