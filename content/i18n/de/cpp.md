tagline: Nah an der Hardware und berühmt für seine Kraft. Es vertraut dir voll und ganz, was zugleich Feature und Warnung ist.
runtime: C++17 · kompiliert auf einem entfernten GCC

# Lesson: Variablen und Typen
summary: Grundtypen, std::string, auto und wie bools ausgegeben werden.

C++ ist statisch typisiert und wird in Maschinencode übersetzt. Jede Variable hat einen zur Kompilierzeit festgelegten Typ, und viele Fehler werden erkannt, bevor das Programm läuft.

Die Grundtypen: `int` (ganze Zahlen), `double` (Kommazahlen), `char` (ein einzelnes Zeichen, in einfachen Anführungszeichen) und `bool`. Text lebt in `std::string` aus dem Header `<string>`.

`auto` bittet den Compiler, den Typ aus dem Anfangswert abzuleiten. `auto x = 9.5;` macht `x` zu einem `double`.

Ausgaben laufen über `std::cout` und den Operator `<<`. `"\n"` beendet eine Zeile.

Zwei Dinge, über die Neulinge stolpern:

- `int / int` ist eine **Ganzzahldivision**: `7 / 2` ist `3`. Mach eine Seite zu einem `double`, um `3.5` zu bekommen.
- `bool`-Werte werden als `1` und `0` ausgegeben, wenn du nicht vorher `std::boolalpha` an den Stream schickst.

> Eine lokale Variable, die du ohne Wert deklarierst, enthält, was gerade in diesem Speicher lag. Sie zu lesen ist undefiniertes Verhalten. Initialisiere immer: `int count = 0;`, nicht `int count;`.

# Lesson: Bedingungen
summary: if/else, switch über ganze Zahlen und Zeichen und der ternäre Operator.

`if`, `else if` und `else` funktionieren wie erwartet. Vergleiche sind `==`, `!=`, `<`, `<=`, `>`, `>=`, verknüpft mit `&&` (und), `||` (oder) und `!` (nicht).

Eine klassische C++-Falle: `if (x = 5)` kompiliert. Es **weist** `x` den Wert 5 zu und prüft dann das Ergebnis, das immer wahr ist. Compiler warnen davor, also lies deine Warnungen.

`switch` funktioniert mit ganzen Zahlen, Zeichen und Enums, aber **nicht** mit `std::string`. Jeder Fall läuft in den nächsten weiter, wenn du kein `break` setzt, was gelegentlich nützlich und häufig ein Fehler ist.

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

Der ternäre Operator `condition ? a : b` wählt einen von zwei Werten.

# Lesson: Schleifen
summary: for, bereichsbasiertes for, while und do-while.

Die klassische `for`-Schleife hat einen Initialisierer, eine Bedingung und ein Inkrement. `++i` und `i++` verhalten sich im Schleifenkopf gleich.

Die **bereichsbasierte for**-Schleife besucht jedes Element eines Containers. Schreib `const auto&`, um jedes Element ohne Kopie anzusehen, oder `auto&`, wenn du die Elemente an Ort und Stelle ändern willst.

```cpp
for (const auto& word : words) { ... }  // read only, no copies
for (auto& n : numbers) { n *= 2; }      // modifies the vector
```

`while` prüft vor jedem Durchlauf; `do ... while` prüft danach und läuft daher mindestens einmal.

# Lesson: Funktionen und Referenzen
summary: Übergabe per Wert, per Referenz, const-Referenzen und Überladung.

Standardmäßig übergibt C++ Argumente **per Wert**: Die Funktion bekommt ihre eigene Kopie, und Änderungen daran bleiben in der Funktion.

Häng `&` an den Parametertyp, um **per Referenz** zu übergeben. Dann arbeitet die Funktion mit der tatsächlichen Variable des Aufrufers.

Für große Objekte, die du nur lesen willst, nimm eine **const-Referenz**: `const std::string& name`. Sie vermeidet die Kopie und verspricht, das Argument nicht zu ändern. So nimmt man üblicherweise Strings und Container entgegen.

Standardargumente stehen am Ende der Parameterliste, und **Überladung** erlaubt mehreren Funktionen denselben Namen, solange sich ihre Parametertypen unterscheiden.

# Lesson: Vektoren und Maps
summary: std::vector für Folgen, std::map für sortierte Schlüssel/Wert-Paare.

`std::vector<T>` ist der Standardcontainer: ein Array mit veränderbarer Größe. `push_back` hängt an, `size()` zählt, und `front()` / `back()` lesen die Enden.

`v[i]` prüft keine Grenzen; über das Ende hinaus zu lesen ist undefiniertes Verhalten. `v.at(i)` prüft und löst stattdessen `std::out_of_range` aus.

`std::map<K, V>` speichert Schlüssel/Wert-Paare **nach Schlüssel sortiert**. Seit C++17 kannst du jedes Paar in einer Schleife mit Structured Bindings entpacken: `for (const auto& [key, value] : m)`.

> `m["missing"]` schlägt nicht fehl. Es **fügt** den Schlüssel mit einem Standardwert ein (0 für einen `int`). Nimm `m.count(key)` oder `m.find(key)`, wenn du nur prüfen willst.

# Lesson: Klassen
summary: Private Daten, Konstruktoren mit Initialisierungsliste und const-Memberfunktionen.

Eine `class` bündelt Daten mit den Funktionen, die darauf arbeiten. Member sind standardmäßig **privat**, Code von außen kommt also nicht direkt an sie heran; der Abschnitt `public:` ist die Schnittstelle. (`struct` ist identisch, nur sind die Member dort standardmäßig öffentlich.)

Der **Konstruktor** initialisiert das Objekt. Seine **Member-Initialisierungsliste** nach dem Doppelpunkt setzt die Member direkt, statt sie hinterher zuzuweisen:

```cpp
BankAccount(const std::string& owner) : owner_(owner), balance_(0) {}
```

Eine als `const` markierte Memberfunktion verspricht, das Objekt nicht zu ändern, und ist die einzige Art Funktion, die du auf einem `const`-Objekt aufrufen kannst. Markier Getter aus Gewohnheit als `const`.

Der Unterstrich am Ende der Membernamen ist eine verbreitete Konvention, keine Regel. Er macht Member einfach leicht erkennbar.

# Quiz

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: Beide Operanden sind `int`, also ist das eine Ganzzahldivision, die in Richtung null abschneidet. `7 / 2.0` würde `3.5` ergeben.

## Q: Was gibt das aus?
- =
- =
- =
- Nichts
explain: Streams geben `bool` standardmäßig als `1` oder `0` aus. Füg zuerst `std::boolalpha` ein (`std::cout << std::boolalpha << ok;`), um `true` zu bekommen.

## Q: Welche Signatur liest einen großen Vektor, ohne ihn zu kopieren und ohne ihn ändern zu können?
- =
- =
- =
- =
explain: Eine const-Referenz vermeidet die Kopie und verbietet Änderungen. Übergabe per Wert kopiert den ganzen Vektor. Eine normale Referenz erlaubt Änderungen. `std::vector<int>* const` ist ein konstanter Zeiger auf einen nicht konstanten Vektor, die Funktion könnte die Elemente also trotzdem ändern.

## Q: Was gibt das aus?
- =
- =
- =
- Es stürzt ab
explain: Der Vektor startet mit drei Elementen, also ist `size()` gleich 3. Nach `push_back(4)` sind es vier, und Index 3 (das vierte Element) ist 4.

## Q: Was ist an diesem Code falsch?
- Nichts
- Das erste `int` ist ein Speicherleck: Nichts zeigt mehr darauf, also kann es nie gelöscht werden
- Es kompiliert nicht: `p` zeigt schon auf etwas
- Das zweite `new` überschreibt den ersten Wert, also ist `*p` immer noch 5
explain: Jedes `new` braucht ein passendes `delete`. Wenn du `p` neu zuweist, geht der einzige Zeiger auf die erste Allokation verloren, und dieser Speicher bleibt reserviert, bis das Programm endet. Modernes C++ umgeht das mit `std::make_unique` oder einfachen Werten.

## Q: Was gibt das aus?
- =
- =
- =
- Es kompiliert nicht
explain: `s[0]` ist das `char` `'a'`, und ein `char` ist nur eine kleine ganze Zahl: 97 in ASCII. `s.length()` ist 3, die Summe ist also die Zahl 100.

## Q: Was gibt das aus? (kompiliert als C++17)
- =
- =
- =
- Es kompiliert nicht
explain: `operator[]` fügt bei fehlendem Schlüssel einen Standardwert (0) ein, die Map hat also jetzt einen Eintrag. Seit C++17 werden die Operanden von `<<` von links nach rechts ausgewertet, das Einfügen passiert also, bevor `size()` aufgerufen wird.

# Challenge: Die Änderung soll bleiben

`doubleAll` soll jede Zahl im übergebenen Vektor verdoppeln. Die Schleife sieht richtig aus, trotzdem ändern sich die Zahlen nicht. Behebe es.

## Hints
- Die Schleife verdoppelt die Werte tatsächlich. Welchen Vektor verdoppelt sie?
- Ohne `&` am Parameter bekommt `doubleAll` eine Kopie von `nums`.
- Nimm den Vektor per Referenz: `std::vector<int>& values`.

# Challenge: Zähl ein Zeichen

Implementiere `countChar(s, c)` so, dass es zurückgibt, wie oft das Zeichen `c` im String `s` vorkommt.

## Hints
- Eine bereichsbasierte for-Schleife funktioniert auch mit Strings: `for (char ch : s)`.
- Vergleiche jedes Zeichen mit `c` und erhöhe einen Zähler, wenn sie übereinstimmen.
- Die Standardbibliothek hat einen Einzeiler: `std::count(s.begin(), s.end(), c)` aus `<algorithm>`.

# Challenge: Nur die geraden Zahlen

Lass `evens(values)` einen **neuen** Vektor zurückgeben, der nur die geraden Zahlen in ihrer ursprünglichen Reihenfolge enthält.

## Hints
- Beginne mit einem leeren `std::vector<int> result;` und gib ihn am Ende zurück.
- `v % 2 == 0` ist für gerade Zahlen wahr, auch für 0 und negative gerade Zahlen.
- `result.push_back(v)` hängt eine Zahl ans Ende an.

# Challenge: Die größte Zahl

`largest` soll die größte Zahl in einem nicht leeren Vektor liefern. Bei manchen Eingaben klappt das, bei anderen liegt es still daneben. Behebe es.

## Hints
- Welcher Test schlägt fehl? Was haben alle seine Zahlen gemeinsam?
- Sind alle Zahlen negativ, ist keine davon größer als der Startwert 0.
- Beginne mit einem echten Element: `int best = v[0];` (der Vektor ist hier nie leer). `std::max_element` aus `<algorithm>` funktioniert auch.
