tagline: Gut lesbar, mit Batterien inklusive und überall zu Hause: von Data Science bis zum Skript, das deine Urlaubsfotos umbenennt.
runtime: Python 3.12 · Pyodide, läuft in deinem Browser

# Lesson: Variablen und Typen
summary: Namen, Werte und die Handvoll Typen, die du jeden Tag brauchst.

Eine Variable ist in Python ein Name, der auf einen Wert zeigt. Es gibt kein `let`, kein `var` und keine Typdeklaration. Du weist zu, und schon existiert der Name.

```python
city = "Lisbon"
population = 545_000   # underscores are just for readability
```

Python leitet den Typ aus dem Wert ab. Diese wirst du ständig sehen:

- `int` für ganze Zahlen, die so groß werden können, wie der Speicher erlaubt
- `float` für Kommazahlen, mit den üblichen Eigenheiten von Gleitkommazahlen
- `str` für Text, in einfachen oder doppelten Anführungszeichen
- `bool` für `True` und `False` (großgeschrieben)
- `None` für „absichtlich nichts“

`type()` verrät dir, was du gerade in der Hand hast. Ein **f-String** (ein String mit einem `f` davor) lässt dich mit `{}` beliebige Ausdrücke direkt in den Text setzen.

Kurz zur Division: `/` liefert immer einen float, `//` rundet das Ergebnis ab und `%` gibt den Rest.

> Namen unterscheiden Groß- und Kleinschreibung und werden üblicherweise in `snake_case` geschrieben. `Total` und `total` sind zwei verschiedene Variablen, was zuverlässig einen Nachmittag kostet.

# Lesson: Bedingungen
summary: if, elif, else und warum Einrückung hier keine Stilfrage ist.

Python gruppiert Code über die Einrückung. Die Zeilen, die unter einem `if` eingerückt sind, gehören dazu, und der Block endet, wo die Einrückung endet. Üblich sind vier Leerzeichen.

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

Vergleiche sind `==`, `!=`, `<`, `<=`, `>`, `>=`. Kombiniert werden sie mit den Wörtern `and`, `or`, `not`. Python erlaubt auch verkettete Vergleiche, `18 <= age < 65` bedeutet also genau das, wonach es aussieht.

Jeder Wert ist entweder **wahrheitsähnlich** (truthy) oder **falschähnlich** (falsy). Falsy sind `False`, `None`, null (`0`, `0.0`) und leere Container (`""`, `[]`, `{}`). Alles andere zählt als wahr, deshalb ist `if not items:` die übliche Art zu fragen „ist diese Liste leer?“.

Für kurze Entweder-oder-Werte gibt es einen bedingten Ausdruck: `value_if_true if condition else value_if_false`.

# Lesson: Schleifen
summary: for läuft durch Dinge, while wiederholt, bis man es stoppt.

Eine `for`-Schleife in Python durchläuft alles, was iterierbar ist: Listen, Strings, Dictionaries, Dateien, Bereiche. Ein `for (i = 0; ...)` im C-Stil gibt es nicht. Wenn du Zahlen brauchst, nimm `range`.

`range(start, stop, step)` hört **vor** `stop` auf. `range(1, 4)` liefert also 1, 2, 3. Gibst du nur ein Argument an, beginnt es bei 0.

Wenn du Position und Element brauchst, gibt dir `enumerate` beides, was viel besser ist, als eine Indexvariable von Hand mitzuführen.

Eine `while`-Schleife wiederholt sich, solange ihre Bedingung wahr ist. Sorg dafür, dass irgendetwas darin die Bedingung irgendwann falsch macht, sonst lernst du die Meldung „Ausführung gestoppt“ kennen.

`break` verlässt die Schleife sofort. `continue` springt zum nächsten Durchlauf.

> `print(..., end=" ")` ersetzt den üblichen Zeilenumbruch durch ein Leerzeichen, praktisch für Ausgaben in einer Zeile.

# Lesson: Funktionen
summary: def, return, Standardargumente und mehr als einen Wert zurückgeben.

Du definierst eine Funktion mit `def`, gibst ihr Parameter und lieferst mit `return` einen Wert zurück. Eine Funktion ohne `return` gibt trotzdem etwas zurück: `None`.

Parameter können **Standardwerte** haben, und Aufrufer können Argumente **per Name** übergeben, wodurch sich Aufrufe selbst erklären:

```python
send_email("ada@example.com", subject="Hi", urgent=True)
```

Um mehrere Werte zurückzugeben, gib sie durch Kommas getrennt zurück. Python verpackt sie in ein Tupel, und der Aufrufer kann sie direkt in Variablen entpacken.

> Ausgeben und Zurückgeben sind verschiedene Dinge. `print` zeigt einem Menschen einen Wert; `return` gibt ihn an den Code zurück, der dich aufgerufen hat. Die beiden zu verwechseln ist der häufigste Anfängerfehler dieser Lektion.

# Lesson: Listen und Dictionaries
summary: Die zwei Container, die den Großteil der Arbeit erledigen.

Eine **Liste** ist eine geordnete, veränderbare Folge. Die Indizierung beginnt bei 0, negative Indizes zählen vom Ende, `items[-1]` ist also das letzte Element. Slicing mit `items[start:stop]` liefert eine neue Liste, und `stop` ist ausgeschlossen, genau wie bei `range`.

Eine **List Comprehension** baut aus einer Schleife eine Liste in einer gut lesbaren Zeile:

```python
squares = [n * n for n in range(5)]
evens = [n for n in range(10) if n % 2 == 0]
```

Ein **Dictionary** ordnet Schlüsseln Werte zu. Gelesen wird mit `d[key]`, das bei fehlendem Schlüssel `KeyError` auslöst, oder mit `d.get(key, default)`, das das nicht tut. Seit Python 3.7 merken sich Dictionaries die Einfügereihenfolge.

Über die Paare eines Dictionaries läufst du mit `.items()`.

# Lesson: Klassen
summary: Daten und die Funktionen, die mit ihnen arbeiten, bündeln.

Eine **Klasse** ist ein Bauplan; ein **Objekt** ist etwas, das danach gebaut wurde. `__init__` läuft, wenn du ein Objekt erzeugst, und richtet seine Attribute ein. Jede Methode bekommt das Objekt selbst als ersten Parameter, der üblicherweise `self` heißt.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

Methoden mit doppelten Unterstrichen auf beiden Seiten sind Haken, die Python für dich aufruft. `__str__` legt fest, was `print(obj)` anzeigt, damit du etwas Brauchbares statt `<__main__.Point object at 0x...>` siehst.

Bekommt eine Methode eine Eingabe, mit der sie nicht arbeiten kann, löst sie eine Exception aus. Aufrufer können sie mit `try` / `except` behandeln.

# Quiz

## Q: Was gibt das aus?
- =
- =
- =
- Einen Fehler
explain: `y = x` kopiert die Liste nicht; es gibt derselben Liste einen zweiten Namen. Änderst du sie über `y`, ändert sich auch, was `x` sieht. Nimm `y = x.copy()` (oder `list(x)`), wenn du eine unabhängige Kopie willst.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: In Python 3 ist `/` echte Division und liefert immer einen float, auch wenn das Ergebnis eine ganze Zahl ist. Nimm `//`, wenn du `2` willst.

## Q: Welche Zeile prüft korrekt, ob der String `name` leer ist?
- =
- =
- =
- =
explain: Ein leerer String ist falsy, also ist `not name` genau dann `True`, wenn er leer ist. `== None` übersieht `""` (und ohnehin prüft man `None` richtig mit `is None`). Strings haben keine Methode `.empty()`, und `=` ist eine Zuweisung, was in einem `if` ein Syntaxfehler ist.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: `range(2, 10, 3)` beginnt bei 2 und addiert in jedem Schritt 3, solange es unter 10 bleibt: 2, 5, 8. Der Endwert ist nie enthalten, und 11 liegt ohnehin darüber.

## Q: Finde den Fehler. Was gibt das aus?
- =
- =
- =
- =
explain: Standardwerte werden einmal ausgewertet, nämlich wenn die Funktion definiert wird, deshalb teilen sich alle Aufrufe dieselbe Liste. Die Lösung ist `items=None` und dann `if items is None: items = []` in der Funktion.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: Einen String mit einer ganzen Zahl zu multiplizieren wiederholt ihn. Python wandelt `"3"` nicht stillschweigend in eine Zahl um; für 9 bräuchtest du `int("3") * 3`.

## Q: Was gibt das aus?
- =
- =
- =
- =
explain: `.get()` liefert `None`, wenn der Schlüssel fehlt (oder den Standardwert, den du als zweites Argument übergibst). Die Variante, die `KeyError` auslöst, ist `settings["font"]`.

# Challenge: Um eins daneben

`total_to(n)` soll die Summe aller ganzen Zahlen von 1 bis `n` einschließlich liefern. `total_to(5)` ist also 1 + 2 + 3 + 4 + 5 = 15. Es ist nah dran, aber nicht richtig. Behebe es.

## Hints
- Gib die Werte von `i` in der Schleife aus. Welche Zahlen erzeugt `range(n)` tatsächlich?
- `range(n)` geht von 0 bis `n - 1`. Du willst 1 bis `n`.
- `range(1, n + 1)` erledigt das. (Ebenso `sum(range(1, n + 1))`, wenn du Einzeiler magst.)

# Challenge: Zähl die Vokale

Vervollständige `count_vowels(text)`, sodass es zurückgibt, wie viele Vokale (a, e, i, o, u) in `text` vorkommen. Großgeschriebene Vokale zählen auch.

## Hints
- Wandle den Text zuerst mit `text.lower()` in Kleinbuchstaben um, dann musst du nur eine Schreibweise prüfen.
- `ch in "aeiou"` ist `True`, wenn `ch` ein Vokal ist.
- Eine kompakte Version: `return sum(1 for ch in text.lower() if ch in "aeiou")`.

# Challenge: Von Wörtern zu Längen

Lass `word_lengths(sentence)` ein Dictionary zurückgeben, das jedem Wort seine Länge zuordnet. Wörter sind durch Leerzeichen getrennt.

## Hints
- `sentence.split()` trennt an Leerraum und liefert eine Liste von Wörtern. Für einen leeren String liefert es `[]`.
- Leg ein leeres Dictionary an, lauf über die Wörter und setze `result[word] = len(word)`.
- Eine Dictionary Comprehension schafft es in einer Zeile: `{word: len(word) for word in ...}`.

# Challenge: Duplikate entfernen, Reihenfolge behalten

`unique(items)` soll eine neue Liste ohne Duplikate liefern und jedes Element dort lassen, wo es **zuerst** auftauchte. Die aktuelle Version entfernt die Duplikate, bringt aber die Reihenfolge durcheinander.

## Hints
- Mengen (Sets) sind ungeordnet, die Umwandlung in ein Set wirft also die ursprüngliche Reihenfolge weg.
- Lauf der Reihe nach durch `items` und merk dir in einem Set, was du schon gesehen hast.
- Häng ein Element nur an, wenn es noch nicht in `seen` ist. (`list(dict.fromkeys(items))` ist eine nette Abkürzung, weil Dictionary-Schlüssel die Einfügereihenfolge behalten.)
