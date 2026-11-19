tagline: Die Sprache des Webs. Stellenweise schrullig, überall enorm leistungsfähig.
runtime: JavaScript · läuft in deinem Browser, Konsolenausgabe im Stil von Node.js

# Lesson: Variablen und Typen
summary: let, const und die sieben primitiven Typen, denen du tatsächlich begegnest.

Deklariere Variablen mit `const`, wenn die Bindung nicht neu zugewiesen wird, und mit `let`, wenn doch. Greif zuerst zu `const`; es sagt allen, die den Code lesen: „Dieser Name zeigt immer auf dasselbe.“ In älterem Code siehst du noch `var`. Es hat lockerere Gültigkeitsregeln, und moderner Code meidet es.

```js
const siteName = "Codle";
let visits = 0;
visits = visits + 1;   // fine
siteName = "Other";    // TypeError: Assignment to constant variable.
```

Die Alltagstypen sind `string`, `number` (ein Typ für ganze und Kommazahlen), `boolean`, `undefined` (deklariert, aber nie mit einem Wert belegt), `null` (absichtlich leer) sowie `bigint` und `symbol` für Sonderfälle. Alles andere, auch Arrays und Funktionen, ist ein Objekt.

**Template-Literale** verwenden Backticks und lassen dich Ausdrücke mit `${...}` einbetten.

> `typeof null` ist `"object"`. Das ist ein Fehler von 1995, der sich nie beheben lässt, ohne das Web kaputtzumachen. Prüf auf null stattdessen mit `value === null`.

# Lesson: Bedingungen und Gleichheit
summary: if/else, warum === das ist, was du willst, und was als „falsy“ gilt.

`if`, `else if` und `else` funktionieren wie erwartet: die Bedingung in runden Klammern, der Rumpf in geschweiften.

JavaScript hat zwei Gleichheitsoperatoren. `===` (strikt) vergleicht Wert **und** Typ. `==` (locker) wandelt zuerst die Typen um, nach Regeln, die niemand freiwillig auswendig lernt. Nimm `===` und `!==`, solange du keinen konkreten Grund für etwas anderes hast.

Die **falsy**-Werte sind `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` und `NaN`. Alles andere ist truthy, auch `"0"`, `[]` und `{}`.

Zwei Operatoren für Standardwerte, die ähnlich aussehen, aber nicht gleich sind:

- `a || b` liefert `b`, wenn `a` **irgendein** falsy-Wert ist
- `a ?? b` liefert `b` nur, wenn `a` `null` oder `undefined` ist

Wenn also `0` ein gültiger Wert ist, wirft `??` ihn nicht weg.

# Lesson: Schleifen
summary: Das klassische for, for...of für Werte und Array-Methoden, die für dich schleifen.

Die klassische `for`-Schleife hat drei Teile: einen Startpunkt, eine Bedingung, die vor jedem Durchlauf geprüft wird, und eine Aktualisierung nach jedem Durchlauf.

```js
for (let i = 0; i < 3; i++) { /* runs with i = 0, 1, 2 */ }
```

Wenn du einfach jeden Wert eines Arrays (oder Strings, einer Map, eines Sets) willst, ist `for...of` sauberer. Es gibt auch `for...in`, das über die **Schlüssel** eines Objekts läuft; vermeide es bei Arrays, weil es dir die Indizes als Strings liefert.

Arrays haben außerdem `forEach`, das für jedes Element eine Funktion aufruft und den Index als zweites Argument übergibt.

`while` wiederholt, solange die Bedingung wahr ist. `break` verlässt eine Schleife vorzeitig; `continue` springt zum nächsten Durchlauf.

# Lesson: Funktionen
summary: Deklarationen, Pfeilfunktionen, Standardparameter und Closures.

Es gibt zwei alltägliche Arten, eine Funktion zu schreiben:

```js
function add(a, b) {        // declaration: hoisted, has its own `this`
  return a + b;
}
const add2 = (a, b) => a + b;  // arrow: concise, inherits `this`
```

Eine Pfeilfunktion mit einem einzigen Ausdruck gibt diesen automatisch zurück. Sobald du geschweifte Klammern hinzufügst, brauchst du wieder ein explizites `return`. Das zu vergessen ist eine klassische Quelle rätselhafter `undefined`.

Parameter können **Standardwerte** haben: `function greet(name, greeting = "Hello")`.

Funktionen merken sich die Variablen, die dort sichtbar waren, wo sie erzeugt wurden. Das ist eine **Closure**, und so bekommst du privaten Zustand ohne Klasse: Der Zähler unten hält `count` zwischen den Aufrufen am Leben, aber von außen kommt niemand daran.

Eine Funktion ohne `return` liefert `undefined`.

# Lesson: Arrays und Objekte
summary: Geordnete Listen, Schlüssel/Wert-Sammlungen, Destructuring und der Spread-Operator.

Ein **Array** ist eine geordnete Liste mit Index ab 0. `push` hängt ans Ende an, `length` sagt dir, wie viele Elemente es gibt, und `at(-1)` liest vom Ende.

Ein **Objekt** ordnet String-Schlüsseln Werte zu. Gelesen wird mit Punktnotation (`user.name`) oder eckigen Klammern (`user["name"]`), die du brauchst, wenn der Schlüssel in einer Variablen steht.

**Destructuring** holt Werte in einem Rutsch in Variablen, und die **Spread**-Syntax `...` kopiert Eigenschaften in ein neues Objekt oder Elemente in ein neues Array.

> `const` verhindert, dass du die Variable neu zuweist, nicht, dass du das Objekt änderst, auf das sie zeigt. `const scores = []; scores.push(1);` ist völlig in Ordnung.

# Lesson: Array-Methoden
summary: map, filter, reduce, find und die sort()-Falle.

Diese Methoden nehmen eine Funktion und übernehmen das Schleifen für dich. Sie lesen sich wie eine Beschreibung dessen, was du willst, nicht wie du dahin kommst.

- `map(fn)` liefert ein neues Array, in dem `fn` auf jedes Element angewendet wurde
- `filter(fn)` behält die Elemente, für die `fn` etwas Truthy liefert
- `reduce(fn, start)` faltet das Array zu einem einzigen Wert zusammen
- `find(fn)` liefert das erste passende Element oder `undefined`

Keine davon ändert das ursprüngliche Array. `sort` ist anders: Es sortiert **an Ort und Stelle** und vergleicht die Elemente standardmäßig als Strings. So wird aus `[10, 9, 1]` plötzlich `[1, 10, 9]`. Übergib eine Vergleichsfunktion, um Zahlen richtig zu sortieren.

# Quiz

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: Ist eine Seite von `+` ein String, wandelt JavaScript die andere Seite in einen String um und verkettet. Die übrigen Rechenoperatoren wandeln in Zahlen um, deshalb ist `"5" - 3` gleich `2`.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: Objekte und Arrays werden per Referenz verglichen, nicht nach Inhalt. Das sind zwei verschiedene Arrays, die zufällig dieselben Werte enthalten. Um Inhalte zu vergleichen, lauf über sie oder vergleiche bei einfachen Daten die Ausgabe von `JSON.stringify`.

## Q: `nums` ist ein `const`. Was passiert hier?
- =
- =
- =
- =
explain: `const` verhindert, dass der Name `nums` neu zugewiesen wird. Es friert das Array nicht ein, deshalb funktioniert `push`. Die Zeile, die einen Fehler auslösen würde, wäre `nums = []`.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: `var` gilt für die ganze Funktion, deshalb teilen sich alle drei Callbacks ein einziges `i`. Wenn die Timer feuern, ist die Schleife vorbei und `i` ist 3. Ersetze `var` durch `let`, dann bekommt jeder Durchlauf sein eigenes `i` und es wird 0, 1, 2 ausgegeben.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: NaN („Not a Number“, keine Zahl) ist ein spezieller Wert des Typs number und entsteht etwa bei `0 / 0` oder `Number("abc")`. Prüf darauf mit `Number.isNaN(value)`, denn `NaN === NaN` ist `false`.

## Q: Welche gibt das Doppelte ihres Arguments zurück?
- =
- =
- =
- =
explain: Eine Pfeilfunktion mit Ausdrucksrumpf gibt diesen Ausdruck zurück. Mit geschweiften Klammern ist der Rumpf ein Block und braucht ein explizites `return`, deshalb liefert die zweite Option `undefined`. Die letzten beiden sind Syntaxfehler.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: `0.1 * 3` ergibt in binärer Gleitkommadarstellung `0.30000000000000004`. Vergleiche Gleitkommazahlen stattdessen mit einer Toleranz: `Math.abs(a - b) < Number.EPSILON`.

# Challenge: Summe ohne NaN

`sumArray(arr)` soll alle Zahlen in einem Array addieren. Momentan liefert es jedes Mal `NaN`. Finde heraus, warum, und behebe es.

## Hints
- Was ist `arr[arr.length]`? Gib es mal aus.
- Über das Ende eines Arrays hinaus zu lesen liefert `undefined`, und `number + undefined` ist `NaN`.
- Die Schleife sollte bei `i < arr.length` aufhören. (Oder lass den Index ganz weg: `arr.reduce((sum, n) => sum + n, 0)`.)

# Challenge: Jedes Wort großschreiben

Schreib `capitalizeWords(str)` so, dass der erste Buchstabe jedes durch Leerzeichen getrennten Worts großgeschrieben wird und der Rest des Worts unverändert bleibt.

## Hints
- `str.split(" ")` gibt dir ein Array von Wörtern, und `.join(" ")` fügt sie wieder zusammen.
- Für ein einzelnes Wort: `word.charAt(0).toUpperCase()` plus `word.slice(1)`.
- Setz alles mit `map` zwischen split und join zusammen.

# Challenge: Wörter zählen

`countWords(words)` bekommt ein Array von Strings. Gib ein Objekt zurück, das jedem Wort zuordnet, wie oft es vorkommt.

## Hints
- Beginne mit einem leeren Objekt, `{}`, und lauf über die Wörter.
- Wenn du ein Wort zum ersten Mal siehst, ist `counts[word]` gleich `undefined`. `counts[word] ?? 0` macht daraus 0.
- Mit `reduce`: `words.reduce((acc, w) => ({ ...acc, [w]: (acc[w] ?? 0) + 1 }), {})`.

# Challenge: Das fehlende await

`delay(ms, value)` liefert ein Promise, das nach `ms` Millisekunden mit `value` erfüllt wird. `main` soll `first and second` ausgeben, gibt aber etwas weit weniger Hilfreiches aus. Repariere `main`.

## Hints
- `delay(...)` liefert sofort ein Promise. Ein in einen String umgewandeltes Promise ist `[object Promise]`.
- In einer `async`-Funktion wartet `await`, bis ein Promise erledigt ist, und gibt dir seinen Wert.
- `const a = await delay(50, "first");` funktioniert. `await Promise.all([...])` lässt beide Verzögerungen gleichzeitig laufen, was schneller ist.
