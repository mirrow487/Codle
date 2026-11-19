tagline: Absichtlich ausführlich, von Grund auf portabel und noch immer der Motor eines beachtlichen Teils der Backends dieser Welt.
runtime: Java 21 · kompiliert auf einem entfernten JDK

# Lesson: Variablen und Typen
summary: Primitive Typen, String, var, final und wie sich + mit Text verhält.

Java ist statisch typisiert: Du gibst an, was jede Variable enthält, und der Compiler nimmt dich beim Wort.

**Primitive** Typen speichern einfache Werte: `int`, `long`, `double`, `boolean`, `char` und ein paar kleinere. `String` (mit großem S) ist eine Klasse, kein primitiver Typ, wird aber so oft benutzt, dass Java ihm eine eigene Literal-Schreibweise gibt: `"like this"`.

Seit Java 10 leitet `var` den Typ einer lokalen Variablen aus ihrem Wert ab: `var city = "London";` ist ein `String`. `final` macht eine Variable nach der ersten Zuweisung unveränderlich, und Konstanten schreibt man üblicherweise in `UPPER_SNAKE_CASE`.

`int / int` ist eine Ganzzahldivision, `7 / 2` ist also `3`.

Der Operator `+` arbeitet von links nach rechts, und sobald er auf einen `String` trifft, wird alles danach zur Verkettung. Deshalb ist `"1" + 2 + 3` gleich `"123"`, während `1 + 2 + "3"` gleich `"33"` ist.

> Jedes Java-Programm braucht eine Klasse mit einer `public static void main(String[] args)`-Methode. Dieser Boilerplate ist der Eintrittspreis; nach einer Woche siehst du ihn nicht mehr.

# Lesson: Bedingungen
summary: if/else, switch-Ausdrücke und die Falle == gegen equals().

`if`, `else if` und `else` erwarten eine `boolean`-Bedingung in runden Klammern. Java behandelt Zahlen nicht als wahr oder falsch.

Seit Java 14 verwenden **switch-Ausdrücke** Pfeile, brauchen kein `break` und liefern einen Wert:

```java
String kind = switch (day) {
    case "Sat", "Sun" -> "Weekend";
    default -> "Weekday";
};
```

Die klassische `switch`-Anweisung mit `case X:` und `break` gibt es weiterhin, und du wirst sie in älterem Code sehen.

Jetzt das Wichtige. Bei Objekten, auch bei `String`, fragt `==` „Ist das **dasselbe Objekt**?“, nicht „Enthalten sie denselben Text?“. Nimm `.equals()`, um Inhalte zu vergleichen. Zwei Strings können identisch aussehen und trotzdem bei `==` durchfallen.

# Lesson: Schleifen
summary: for, das erweiterte for, while und do-while.

Die klassische `for`-Schleife hat einen Initialisierer, eine Bedingung und eine Aktualisierung. Die **erweiterte for**-Schleife (oft for-each genannt) läuft durch jedes Element eines Arrays oder einer Collection:

```java
for (String fruit : fruits) { ... }
```

`while` prüft seine Bedingung vor jedem Durchlauf; `do ... while` prüft danach, der Rumpf läuft also mindestens einmal.

`break` verlässt die Schleife, `continue` springt zum nächsten Durchlauf. Bei verschachtelten Schleifen kannst du in Java die äußere Schleife benennen und `break outer;` schreiben.

# Lesson: Methoden
summary: Statische Methoden, Überladung und was „Übergabe per Wert“ wirklich bedeutet.

Methoden geben einen Rückgabetyp (oder `void`), einen Namen und typisierte Parameter an. Methoden, die direkt aus `main` aufgerufen werden, sind `static`.

Java hat keine Standardwerte für Parameter. Der übliche Ersatz ist **Überladung**: mehrere Methoden mit demselben Namen und unterschiedlichen Parameterlisten, wobei die kürzere die längere aufruft.

Java übergibt immer **per Wert**. Bei primitiven Typen bekommt die Methode eine Kopie, deren Änderung außen keine Wirkung hat. Bei Objekten wird die **Referenz** kopiert, die Methode kann also das übergebene Objekt verändern, aber die Variable des Aufrufers nicht auf ein anderes Objekt zeigen lassen.

# Lesson: Collections und Streams
summary: ArrayList, Map-Implementierungen und Daten mit Streams verarbeiten.

`ArrayList<T>` ist die Standardliste mit veränderbarer Größe. Collections enthalten Objekte, für Zahlen schreibst du also den Wrapper-Typ: `List<Integer>`, nicht `List<int>`. Java wandelt automatisch zwischen `int` und `Integer` um (Autoboxing).

Eine `Map<K, V>` speichert Schlüssel/Wert-Paare. Wähl die Implementierung nach der Reihenfolge, die du brauchst:

- `HashMap`: am schnellsten, Iterationsreihenfolge nicht festgelegt
- `LinkedHashMap`: merkt sich die Einfügereihenfolge
- `TreeMap`: hält die Schlüssel sortiert

`get` liefert für einen fehlenden Schlüssel `null`; `getOrDefault(key, fallback)` ist meist angenehmer.

Mit **Streams** beschreibst du eine Verarbeitungskette: `filter` behält passende Elemente, `map` transformiert sie, und eine abschließende Operation wie `sum()` oder `collect(...)` erzeugt das Ergebnis.

# Lesson: Klassen
summary: Felder, Konstruktoren, Kapselung, toString und Exceptions.

Eine Klasse deklariert **Felder** (Daten) und **Methoden** (Verhalten). Mach Felder `private` und gib nach außen über Methoden nur frei, was Aufrufer brauchen. Das ist Kapselung, und es bedeutet, dass du das Innere später ändern kannst, ohne die Nutzer der Klasse zu stören.

Der **Konstruktor** trägt den Namen der Klasse und hat keinen Rückgabetyp. `this.owner = owner;` unterscheidet das Feld vom gleichnamigen Parameter.

Wenn du `toString()` überschreibst, bestimmst du, was `System.out.println(obj)` anzeigt. Ohne das bekommst du etwas wie `BankAccount@1b6d3586`.

Ungültige Eingaben meldet man, indem man eine Exception wie `IllegalArgumentException` **wirft**, die Aufrufer mit `try` / `catch` behandeln können.

> Wenn du eine einzelne Java-Datei direkt ausführst, muss die erste Klasse der Datei die mit `main` sein. Deshalb steht `Main` unten zuerst.

# Quiz

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: Zwei `int`-Operanden bedeuten Ganzzahldivision; der Nachkommateil wird verworfen. `7 / 2.0` ergibt `3.5`.

## Q: Was gibt das aus?
- =
- =
- Einen Compilerfehler
- =
explain: `new String(...)` erzeugt immer ein neues Objekt, und `==` vergleicht die Identität von Objekten. Die Texte stimmen überein, aber es sind verschiedene Objekte. Nimm `a.equals(b)`, um Inhalte zu vergleichen.

## Q: Was gibt das aus?
- =
- =
- =
- Einen Compilerfehler
explain: `+` wird von links nach rechts ausgewertet. `"1" + 2` ist der String `"12"`, und `"12" + 3` ist `"123"`. Schreib `"1" + (2 + 3)`, wenn du `"15"` willst.

## Q: Welche Zeile deklariert eine wachsende Liste ganzer Zahlen?
- =
- =
- =
- =
explain: Generics akzeptieren nur Objekttypen, deshalb nimmt man den Wrapper `Integer` statt des primitiven `int`. Die dritte Option setzt das Typargument an die falsche Stelle, und eine `ArrayList` ist kein Array.

## Q: Was gibt das aus?
- =
- =
- Einen Compilerfehler: Es müsste `arr.length()` heißen
- Einen Compilerfehler: Es müsste `arr.size()` heißen
explain: Arrays haben ein **Feld** `length`. Strings haben eine **Methode** `length()`, und Collections haben `size()`. Ja, alle drei. Ja, man verwechselt sie jahrelang.

## Q: Was gibt das aus?
- =
- =
- =
- Einen Compilerfehler
explain: Rechnen mit einem `char` stuft ihn zu `int` hoch, und `'A'` ist 65. Um `'B'` zu bekommen, wandle zurück: `(char) (c + 1)`.

## Q: Was gibt das mit den Standardeinstellungen der JVM aus?
- =
- =
- =
- =
explain: Autoboxing verwendet für Werte von -128 bis 127 zwischengespeicherte `Integer`-Objekte wieder, `a` und `b` sind also dasselbe Objekt. 128 liegt außerhalb des Caches, `c` und `d` sind also verschiedene Objekte. Die Lektion ist dieselbe wie bei Strings: Vergleiche Wrapper-Objekte mit `.equals()`.

# Challenge: Wer ist Admin?

`isAdmin` soll immer `true` liefern, wenn die Rolle der Text `"admin"` ist. In einem Test klappt das, in einem anderen nicht. Behebe es.

## Hints
- Der erste Test besteht nur, weil identische String-Literale sich ein Objekt teilen.
- `==` vergleicht die Identität von Objekten. Du willst die Zeichen vergleichen.
- Nimm `.equals()`. `"admin".equals(role)` zu schreiben vermeidet außerdem eine `NullPointerException`, falls `role` einmal `null` ist.

# Challenge: Quersumme

Implementiere `sumDigits(n)` so, dass es die Summe der Dezimalziffern einer nicht negativen ganzen Zahl liefert. `sumDigits(123)` ist zum Beispiel 1 + 2 + 3 = 6.

## Hints
- `n % 10` liefert die letzte Ziffer von `n`.
- `n / 10` (Ganzzahldivision) entfernt die letzte Ziffer.
- Wiederhole beide Schritte in einer `while (n > 0)`-Schleife und addiere jede letzte Ziffer zu einer laufenden Summe.

# Challenge: Initialen

Schreib `initials(fullName)`, das einen Namen in großgeschriebene Initialen mit Punkten verwandelt. Namen können beliebig viele Wörter haben, getrennt durch Leerzeichen.

## Hints
- `fullName.split(" ")` gibt dir ein Array von Wörtern. (`"\\s+"` kommt auch mit mehreren Leerzeichen klar.)
- `word.charAt(0)` ist der erste Buchstabe, und `Character.toUpperCase` macht ihn groß.
- Sammle die Teile in einem `StringBuilder` und häng für jedes Wort einen Buchstaben und danach einen `'.'` an.

# Challenge: Repariere das Thermometer

`Temperature.toFahrenheit()` rechnet Celsius mit F = C × 9 / 5 + 32 in Fahrenheit um. Körpertemperatur, 37 °C, sollte 98.6 °F sein, aber die Klasse sagt 98.0. Repariere die Berechnung.

## Hints
- Die Methode liefert einen `double`, trotzdem hat das Ergebnis seine Nachkommastellen verloren. Wann ist das passiert?
- `celsius * 9 / 5` wird komplett mit `int` gerechnet: 333 / 5 ist 66, nicht 66.6.
- Mach einen Operanden zu einem `double`, zum Beispiel `9.0`, damit die Division den Bruchteil behält.
