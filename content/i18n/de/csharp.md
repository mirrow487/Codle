tagline: Statisch typisiert, aufgeräumt und das Rückgrat von .NET-Anwendungen und Unity-Spielen.
runtime: C# · kompiliert auf einem entfernten .NET/Mono-Compiler

# Lesson: Variablen und Typen
summary: Statische Typen, var und warum 7 / 2 gleich 3 ist.

C# ist **statisch typisiert**: Jede Variable hat einen Typ, der zur Kompilierzeit feststeht, und der Compiler weigert sich, einen String dorthin zu stecken, wo ein `int` hingehört. Das fängt eine ganze Fehlerkategorie ab, bevor dein Programm überhaupt läuft.

```csharp
int count = 3;
count = "three";   // compile error: cannot convert string to int
```

Die Typen, die du täglich brauchst: `int` (ganze Zahlen), `double` (Kommazahlen), `decimal` (exakte Kommazahlen, die richtige Wahl für Geld), `bool`, `char` (ein Zeichen, in einfachen Anführungszeichen) und `string` (Text, in doppelten Anführungszeichen).

Mit `var` leitet der Compiler den Typ aus dem Wert ab. Das ist trotzdem statische Typisierung: `var city = "London";` macht `city` für immer zu einem `string`.

Sind beide Seiten von `/` ganze Zahlen, rechnet C# eine **Ganzzahldivision** und verwirft den Rest. Mach eine Seite zu einem `double`, um ein Ergebnis mit Nachkommastellen zu bekommen.

Strings mit vorangestelltem `$` sind **interpoliert**: `{expression}` darin wird durch seinen Wert ersetzt.

> Jedes C#-Programm hier lebt in einer Klasse mit einer `static void Main()`-Methode. Dort beginnt die Ausführung.

# Lesson: Bedingungen und switch
summary: if/else, switch-Anweisungen und der ternäre Operator.

`if`, `else if` und `else` erwarten eine Bedingung in runden Klammern. Die Bedingung muss ein echtes `bool` sein; C# behandelt `0` oder `null` nicht für dich als falsch, was dir einen klassischen C-Fehler erspart.

```csharp
if (count = 0) { }   // compile error, not a silent bug
```

Eine `switch`-Anweisung vergleicht einen Wert mit mehreren Fällen. Jeder Fallabschnitt muss mit `break` (oder `return`) enden, und du kannst Labels stapeln, damit sie sich einen Rumpf teilen:

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

Modernes C# (ab Version 9) hat außerdem kompakte **switch-Ausdrücke**, die einen Wert liefern:

```csharp
string kind = day switch
{
    "Sat" or "Sun" => "Weekend",
    _ => "Weekday"
};
```

Für einfache Entweder-oder-Entscheidungen hält der ternäre Operator `condition ? a : b` alles in einer Zeile.

# Lesson: Schleifen
summary: for, foreach, while und do-while.

Die `for`-Schleife packt Start, Bedingung und Aktualisierung in eine Zeile. `foreach` läuft durch jedes Element eines Arrays oder einer Collection und ist die Schleife der Wahl, wenn du den Index nicht brauchst.

`while` prüft seine Bedingung vor jedem Durchlauf. `do ... while` prüft danach, der Rumpf läuft also immer mindestens einmal.

`break` verlässt die Schleife; `continue` springt zum nächsten Durchlauf.

> Du kannst einer `List` keine Elemente hinzufügen oder entfernen, während ein `foreach` darüber läuft. C# löst eine `InvalidOperationException` aus, statt dich in ein Durcheinander laufen zu lassen.

# Lesson: Methoden
summary: Rückgabetypen, optionale Parameter, Überladung und out-Parameter.

Eine Methode gibt ihren Rückgabetyp vor ihrem Namen an, oder `void`, wenn sie nichts zurückgibt. Methoden, die direkt aus `Main` aufgerufen werden, sind als `static` markiert, weil es kein Objekt gibt, auf dem man sie aufrufen könnte.

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

Für einzeilige Methoden gibt es einen **Ausdrucksrumpf**: `static int Square(int x) => x * x;`

Parameter werden **optional**, wenn du ihnen einen Standardwert gibst. Du kannst eine Methode auch **überladen**: mehrere Versionen mit demselben Namen, aber unterschiedlichen Parametertypen schreiben, und der Compiler wählt für jeden Aufruf die passende.

Mit einem `out`-Parameter kann eine Methode einen zusätzlichen Wert zurückreichen. Die `TryParse`-Methoden des Frameworks nutzen dieses Muster: Sie liefern `true` oder `false` für Erfolg und legen den geparsten Wert in die `out`-Variable.

# Lesson: Collections und LINQ
summary: List<T>, Dictionary<K, V> und Daten mit LINQ abfragen.

Arrays haben eine feste Größe. Eine `List<T>` wächst, während du Elemente hinzufügst, wobei `T` der Typ der enthaltenen Elemente ist. `Count` sagt dir, wie viele Elemente sie hat.

Ein `Dictionary<TKey, TValue>` ordnet Schlüsseln Werte zu. Einen fehlenden Schlüssel mit `dict[key]` zu lesen löst `KeyNotFoundException` aus, nimm also `TryGetValue`, wenn der Schlüssel fehlen könnte.

**LINQ** (aus `using System.Linq;`) ergänzt jede Collection um Abfragemethoden: `Where` filtert, `Select` transformiert, und `Sum`, `Max`, `Count` und Co. fassen zusammen.

> `Console.WriteLine(myList)` gibt den Typnamen der Liste aus statt ihres Inhalts, was korrekt und völlig nutzlos ist. Nimm `string.Join(", ", myList)`, um den Inhalt zu sehen.

# Lesson: Klassen
summary: Eigenschaften, Konstruktoren, Methoden und Exceptions.

Eine **Klasse** fasst Daten und Verhalten zusammen. Daten werden meist über **Eigenschaften** (Properties) nach außen gegeben, die von außen wie Felder aussehen, aber den Zugriff steuern können:

```csharp
public string Owner { get; }               // read-only after construction
public decimal Balance { get; private set; } // readable everywhere, settable only inside
```

Der **Konstruktor** heißt wie die Klasse und hat keinen Rückgabetyp. Er läuft, wenn du `new BankAccount("Ada")` schreibst.

Wenn du `ToString()` überschreibst, bestimmst du, wie ein Objekt aussieht, wenn es ausgegeben oder in einen interpolierten String gesetzt wird.

Bekommt eine Methode eine Eingabe, die sie nicht akzeptieren kann, **wirft** sie eine Exception. Der Aufrufer kann sie mit `try` / `catch` abfangen.

# Quiz

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: Beide Operanden sind `int`, also rechnet C# eine Ganzzahldivision und verwirft den Rest (es schneidet in Richtung null ab). Schreib `7 / 2.0` oder wandle eine Seite in `double` um, um `3.5` zu bekommen.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: `bool.ToString()` liefert `"True"` oder `"False"`, großgeschrieben. Die C#-Schlüsselwörter sind klein, der ausgegebene Text nicht. Das überrascht jeden genau einmal.

## Q: Welche Zeile erzeugt eine leere, wachsende Liste von Strings?
- =
- =
- =
- =
explain: `List<T>` ist generisch, du musst also sagen, was sie enthält, und ihren Konstruktor mit `()` aufrufen. Eine `List<string>` ist kein `string[]`, und `new List<string>[]` würde versuchen, ein Array von Listen ohne Größe zu erzeugen.

## Q: Was gibt das aus?
- =
- =
- Einen Compilerfehler
- Eine Exception
explain: Für Strings überlädt C# `==` so, dass die Zeichen verglichen werden, nicht die Referenzen. Zwei Strings mit demselben Inhalt sind gleich, egal wie sie entstanden sind. (Java macht das anders, was beim Wechsel zwischen beiden für Verwirrung sorgt.)

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: C# wertet Operanden strikt von links nach rechts aus. `x++` liefert 5 und setzt `x` dann auf 6. `++x` setzt `x` auf 7 und liefert 7. Also ist `y` gleich 5 + 7 = 12. Gültig, wohldefiniert und trotzdem nichts, was man in echtem Code schreiben sollte.

## Q: Was passiert, wenn das läuft?
- Es gibt `0` aus
- Es gibt nichts aus
- Es löst eine `IndexOutOfRangeException` aus
- Es kompiliert nicht
explain: Ein Array mit 3 Elementen hat die Indizes 0, 1 und 2. C# prüft Array-Grenzen zur Laufzeit, deshalb löst das Lesen von Index 3 eine Exception aus. Der Compiler erkennt das nicht, weil der Index von überall her kommen könnte.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: `4.0` ist ein `double`, deshalb wird der `int`-Wert 10 hochgestuft und die Division in Gleitkomma gerechnet.

# Challenge: Repariere den Durchschnitt

`Average` soll den exakten Mittelwert der Zahlen liefern, verliert aber ständig die Nachkommastellen. Behebe es.

## Hints
- Die Methode liefert einen `double`, warum also ist das Ergebnis ganzzahlig? Sieh dir die Typen in der Division an.
- `int / int` ist eine Ganzzahldivision. Das Ergebnis wird abgeschnitten, bevor es in `double` umgewandelt wird.
- Wandle vor dem Dividieren um: `(double)sum / numbers.Length`.

# Challenge: Wörter zählen

Implementiere `CountWords` so, dass es die Anzahl der Wörter in `text` liefert. Wörter sind durch ein oder mehrere Leerzeichen getrennt, und Leerzeichen am Anfang oder Ende zählen nicht als Wörter.

## Hints
- `text.Split(' ')` trennt an Leerzeichen, aber wiederholte Leerzeichen hinterlassen leere Strings im Ergebnis.
- `StringSplitOptions.RemoveEmptyEntries` wirft diese leeren Strings weg.
- `text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length` ist die komplette Antwort.

# Challenge: FizzBuzz, aber richtig

Lass `FizzBuzz(n)` für Vielfache von 3 `"Fizz"` liefern, für Vielfache von 5 `"Buzz"`, für Vielfache von beiden `"FizzBuzz"` und sonst die Zahl selbst.

## Hints
- `n % 3 == 0` ist wahr, wenn `n` ein Vielfaches von 3 ist.
- Die Reihenfolge zählt: Prüf zuerst „Vielfaches von beiden“, sonst liefert 15 `"Fizz"` und bleibt dabei.
- Ein Vielfaches von 3 und 5 zugleich ist ein Vielfaches von 15.

# Challenge: Vervollständige Rectangle

Vervollständige die Eigenschaften `Area` und `IsSquare` von `Rectangle`.

## Hints
- `=>` bei einer Eigenschaft definiert eine berechnete, schreibgeschützte Eigenschaft. Was rechts steht, wird bei jedem Lesen neu berechnet.
- Innerhalb der Klasse kannst du `Width` und `Height` direkt verwenden.
- `Area => Width * Height;` und `IsSquare => Width == Height;`
