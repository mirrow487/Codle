tagline: Winzig, schnell und in mehr Spielen und Werkzeugen eingebaut, als du denkst. Arrays beginnen bei 1; find dich damit ab.
runtime: Lua 5.3 · Fengari, läuft in deinem Browser

# Lesson: Variablen und Typen
summary: local, nil, Zahlen, Strings und der Operator ..

Variablen in Lua sind **standardmäßig global**, was du selten willst. Setz `local` vor jede neue Variable, wenn du keinen Grund dagegen hast. Lokale Variablen sind schneller und können nicht in Code durchsickern, der nicht mit ihnen rechnet.

```lua
local score = 10      -- local to this file or block
count = 3             -- global: visible everywhere (avoid)
```

Lua kennt nur wenige Typen: `nil`, `boolean`, `number`, `string`, `table` und `function` (dazu `userdata` und `thread`, die du vorerst ignorieren kannst). Eine Variable, der nie etwas zugewiesen wurde, ist einfach `nil`.

Seit Lua 5.3 haben Zahlen zwei Untertypen: **integer** (ganzzahlig) und **float** (Gleitkomma). `/` liefert immer einen float, während `//` die abrundende Division ist.

Strings werden mit `..` (zwei Punkten) verbunden, nicht mit `+`, und `#` liefert die Länge eines Strings. Zahlen werden beim Verketten automatisch in Text umgewandelt.

> `print` mit mehreren Argumenten trennt sie durch Tabulatorzeichen. Die Beispiele hier bauen meist mit `..` einen einzelnen String, damit die Ausgabe ordentlich bleibt.

# Lesson: Bedingungen
summary: if/then/end, ~= und die sehr kurze Liste falscher Werte.

Bedingungen verwenden `if ... then`, optional `elseif` (ein Wort) und `else`, und enden mit `end`.

```lua
if score >= 90 then
  grade = "A"
elseif score >= 80 then
  grade = "B"
else
  grade = "C"
end
```

„Ungleich“ schreibt man `~=`. Die logischen Operatoren sind die Wörter `and`, `or` und `not`.

Das überrascht Leute aus anderen Sprachen: **Nur `nil` und `false` sind falsch**. Null ist wahr. Der leere String ist wahr. Eine leere Tabelle ist wahr.

`and` und `or` liefern einen ihrer Operanden statt eines strikten Booleans, was dir zwei praktische Muster gibt:

- `x or default` verwendet `default`, wenn `x` `nil` (oder `false`) ist
- `cond and a or b` funktioniert wie ein ternärer Operator, solange `a` nicht `false` oder `nil` ist

# Lesson: Schleifen
summary: Numerisches for, while, repeat...until und das fehlende continue.

Das numerische `for` zählt von einem Start- bis zu einem Endwert, und das Ende ist **eingeschlossen**. Eine optionale dritte Zahl legt die Schrittweite fest, die auch negativ sein darf.

```lua
for i = 1, 5 do ... end        -- 1, 2, 3, 4, 5
for i = 10, 0, -5 do ... end   -- 10, 5, 0
```

`while cond do ... end` prüft vor jedem Durchlauf. `repeat ... until cond` prüft **nach** jedem Durchlauf, der Rumpf läuft also immer mindestens einmal.

`break` verlässt eine Schleife. Lua hat kein `continue`; die üblichen Ersatzlösungen sind, den Rumpf in ein `if` zu packen oder ein `goto continue` mit einer Marke `::continue::` am Ende des Rumpfs.

Außerdem gibt es das generische `for`, das mit `ipairs` und `pairs` durch Tabellen läuft. Das siehst du in der Lektion über Tabellen.

# Lesson: Funktionen
summary: Mehrere Rückgabewerte, variable Argumente und Closures.

Deklariere Funktionen mit `local function name(params) ... end`. Fehlende Argumente kommen als `nil` an, deshalb ist `param = param or default` der übliche Weg, Standardwerte zu setzen.

Lua-Funktionen können **mehrere Werte auf einmal zurückgeben**, und der Aufrufer kann sie in mehreren Variablen auffangen:

```lua
local function divmod(a, b)
  return a // b, a % b
end
local q, r = divmod(17, 5)   -- q = 3, r = 2
```

`...` sammelt beliebig viele Argumente. Pack es in eine Tabelle, `{...}`, um darüber zu laufen.

Funktionen sind ganz normale Werte. Du kannst sie in Variablen speichern, herumreichen und aus anderen Funktionen zurückgeben. Eine innere Funktion behält Zugriff auf die lokalen Variablen der Funktion, die sie erzeugt hat; das nennt man **Closure**.

# Lesson: Tabellen
summary: Luas einzige Datenstruktur, genutzt als Array, Dictionary und Objekt.

Lua hat genau eine Datenstruktur, die **Tabelle**, und sie kann alles.

Als **Array** genutzt, wird eine Tabelle ab **1** indiziert, nicht ab 0. `#t` liefert die Länge, und `table.insert(t, value)` hängt ans Ende an.

```lua
local colors = {"red", "green", "blue"}
print(colors[1])   -- red
print(colors[0])   -- nil: there is nothing at index 0
```

Als **Dictionary** genutzt, können Schlüssel Strings sein (oder fast jeder andere Wert). `t.name` ist die Kurzform für `t["name"]`. Einen Schlüssel zu lesen, den es nicht gibt, liefert `nil` statt eines Fehlers.

Über Arrays läufst du mit `ipairs` (der Reihe nach, von 1 bis n), über Dictionaries mit `pairs`. Die Reihenfolge von `pairs` ist **nicht** garantiert, verlass dich also nie darauf.

`table.concat(t, sep)` verbindet ein Array aus Strings und ist der schnellste Weg, eines auszugeben.

# Lesson: Metatabellen und Objekte
summary: Wie aus Tabelle plus Metatabelle eine Klasse wird und was der Doppelpunkt bedeutet.

Lua hat keine Klassen, aber **Metatabellen**: eine Tabelle, die an eine andere Tabelle gehängt wird und deren Verhalten ändert. Das nützlichste Feld ist `__index`. Wenn du einen Schlüssel liest, den eine Tabelle nicht hat, sucht Lua ihn stattdessen in `__index`.

Das reicht, um Objekte zu bauen. Pack die Methoden in eine Tabelle, setz sie als `__index`, und jede Instanz greift darauf zurück:

```lua
local Dog = {}
Dog.__index = Dog
function Dog.new(name) return setmetatable({name = name}, Dog) end
function Dog:speak() return self.name .. " says woof" end
```

Das entscheidende Detail ist der **Doppelpunkt**. `function Dog:speak()` ist die Kurzform für `function Dog.speak(self)`, und `rex:speak()` ist die Kurzform für `rex.speak(rex)`. `.` und `:` zu verwechseln ist der häufigste Lua-Fehler überhaupt.

`error(message)` löst einen Fehler aus, und `pcall(f, ...)` ruft eine Funktion im geschützten Modus auf und liefert `false` plus die Fehlermeldung, statt abzustürzen. Der Meldung werden Dateiname und Zeilennummer vorangestellt.

# Quiz

## Q: Was gibt das aus?
- =
- =
- =
- Einen Fehler
explain: Lua-Arrays beginnen bei Index 1. An Index 0 steht schlicht nichts, und einen fehlenden Schlüssel zu lesen liefert `nil` statt eines Fehlers.

## Q: Was gibt das aus?
- =
- =
- =
- Einen Fehler
explain: In Lua sind nur `nil` und `false` falsch. Null und der leere String sind beide wahr, anders als in C, JavaScript oder Python.

## Q: Was gibt das aus?
- =
- =
- =
- Einen Fehler
explain: `/` rechnet in Lua 5.3 und neuer immer mit Gleitkommazahlen, das Ergebnis ist also der float `5.0`. Für abrundende Division nimm `//`, das hier die ganze Zahl `5` liefert.

## Q: Welcher Operator verbindet zwei Strings?
- =
- =
- =
- =
explain: Lua verwendet `..` zum Verketten. `+` ist rein arithmetisch: `"10" + 1` wandelt den String um und ergibt `11`, während `"a" + 1` ein Fehler ist.

## Q: Was gibt das aus?
- =
- =
- =
- Einen Fehler
explain: Der Längenoperator `#` bindet stärker als `..`, das ist also `(#"hello") .. "!"`, also `5 .. "!"`. Die Zahl wird beim Verketten in Text umgewandelt.

## Q: Wie schreibt man in Lua „ungleich“?
- =
- =
- =
- =
explain: Lua verwendet `~=`. `!=` zu schreiben ist ein Syntaxfehler, und zwar ein sehr häufiger bei Leuten, die aus anderen Sprachen umsteigen.

## Q: Was gibt das aus?
- =
- =
- Einen Fehler
- =
explain: `limit` wurde ohne `local` zugewiesen und ist dadurch eine globale Variable geworden, die die Funktion überlebt. Genau deshalb solltest du `local` aus Gewohnheit schreiben.

# Challenge: Summiere ab dem richtigen Index

`sum(nums)` soll die Zahlen in einer Tabelle im Array-Stil addieren. Stattdessen stürzt es ab. Behebe es.

## Hints
- Lies die Fehlermeldung: Sie sagt, dass etwas `nil` ist. Welcher Index wäre `nil`?
- Lua-Arrays beginnen bei 1, also ist `nums[0]` gleich `nil`.
- Beginne die Schleife bei 1: `for i = 1, #nums do`. (Oder nimm `for _, n in ipairs(nums) do`.)

# Challenge: Palindrom-Check

Vervollständige `isPalindrome(word)`, sodass es `true` liefert, wenn das Wort rückwärts gleich gelesen wird, unabhängig von Groß- und Kleinschreibung.

## Hints
- Strings haben Methoden, die du mit Doppelpunkt aufrufst, etwa `word:lower()`.
- Es gibt ein eingebautes `string.reverse`, aufrufbar als `word:reverse()`.
- Erst in Kleinbuchstaben umwandeln, dann den String mit seiner Umkehrung vergleichen.

# Challenge: Schreib map

Schreib `map(t, fn)`, das eine **neue** Tabelle mit `fn(item)` für jedes Element des Arrays `t` zurückgibt. Die ursprüngliche Tabelle darf sich nicht ändern.

## Hints
- Leg eine leere Tabelle an, `local result = {}`, und gib sie am Ende zurück.
- Lauf mit `for i, v in ipairs(t) do` und speichere `fn(v)` unter `result[i]`.
- In `result` statt in `t` zu schreiben lässt das Original unberührt.

# Challenge: Punkt oder Doppelpunkt?

Das `Counter`-Objekt soll bis 2 zählen, stürzt aber ab. Behebe den Fehler mit der kleinstmöglichen Änderung.

## Hints
- Der Fehler erwähnt `self`. Welchen Wert hat `self` in `increment`?
- `function Counter:increment()` erwartet das Objekt als verstecktes erstes Argument.
- `c:increment()` übergibt `c` automatisch als `self`; `c.increment()` übergibt gar nichts.
