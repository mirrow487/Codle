tagline: HTML sagt, was Dinge sind. CSS sagt, wie sie aussehen. Zusammen sind sie jede Webseite, die du je gesehen hast.
runtime: HTML und CSS · Live-Vorschau in einem abgeschotteten Rahmen

# Lesson: Aufbau eines Dokuments
summary: Das Skelett, das jede Webseite hat, und wofür jeder Knochen da ist.

HTML beschreibt, **was Dinge sind**: Das ist eine Überschrift, das ist ein Absatz, das ist eine Liste. Der Browser legt ein Standardaussehen fest, und CSS ändert es später.

Inhalt steht in **Elementen**, geschrieben als öffnendes Tag, Inhalt und schließendes Tag: `<p>Hello</p>`. Manche Elemente wie `<img>` und `<meta>` sind **leer** (void) und haben kein schließendes Tag.

Jede Seite hat dieselbe Grundstruktur:

- `<!DOCTYPE html>` sagt dem Browser, dass er den modernen Standardmodus verwenden soll
- `<html lang="en">` umschließt alles und gibt die Sprache an (Screenreader nutzen das)
- `<head>` enthält Informationen **über** die Seite: Titel, Zeichensatz, Stile
- `<body>` enthält das, was Menschen tatsächlich sehen

Überschriften reichen von `<h1>` (am wichtigsten) bis `<h6>`. Setz sie für die Struktur ein, nicht für die Größe; Größen kannst du mit CSS ändern.

> Bearbeite den Vorschautext unten und klicke dann auf Ausführen. Nichts, was du hier eintippst, kann etwas kaputtmachen, also sei so draufgängerisch, wie du willst.

# Lesson: Text, Links und Listen
summary: Bedeutungstragende Text-Tags, Attribute und die zwei Arten von Listen.

Wähl Tags nach ihrer Bedeutung. `<strong>` markiert Wichtigkeit, `<em>` markiert Betonung. Beide haben einen Standardstil (fett, kursiv), aber was Hilfstechnologien vorlesen, ist die Bedeutung.

Elemente können im öffnenden Tag **Attribute** tragen, geschrieben als `name="value"`. Ein Link ist ein `<a>`-Element, dessen `href`-Attribut sagt, wohin er führt:

```html
<a href="https://developer.mozilla.org">MDN Web Docs</a>
```

Bilder brauchen ein `src` und einen `alt`-Text, der das Bild für Menschen beschreibt, die es nicht sehen können.

Listen gibt es in zwei Sorten: `<ul>` für ungeordnete (Aufzählungspunkte) und `<ol>` für geordnete (Nummern). In beiden Fällen ist jeder Eintrag ein `<li>`.

> Links in dieser Vorschau sind deaktiviert, damit du nicht versehentlich wegnavigierst. Die Konsole sagt dir, wohin sie geführt hätten.

# Lesson: CSS-Selektoren und die Kaskade
summary: Wie CSS Elemente auswählt und wie es Streit zwischen Regeln schlichtet.

Eine CSS-Regel besteht aus einem **Selektor** und **Deklarationen**:

```css
p {
  color: #333;
  line-height: 1.6;
}
```

Die Selektoren, die du am häufigsten nutzt:

- `p` wählt jedes `<p>`-Element
- `.note` wählt Elemente mit `class="note"` (ein Element kann mehrere Klassen haben)
- `#intro` wählt das eine Element mit `id="intro"`
- `nav a` wählt `<a>`-Elemente irgendwo innerhalb eines `<nav>`
- `ul > li` wählt `<li>`-Elemente, die direkte Kinder eines `<ul>` sind

Wenn zwei Regeln sich widersprechen, entscheidet die **Spezifität**: Eine ID schlägt eine Klasse, und eine Klasse schlägt einen Elementselektor. Nur bei gleicher Spezifität gewinnt die Regel, die später steht. Das ist die „Kaskade“ in Cascading Style Sheets.

# Lesson: Das Box-Modell
summary: Inhalt, Innenabstand, Rahmen, Außenabstand und die eine Einstellung, die Größen vernünftig macht.

Jedes Element ist eine rechteckige Box aus vier Schichten, von innen nach außen:

- **content** (Inhalt): der Text oder das Bild selbst
- **padding** (Innenabstand): Raum innerhalb des Rahmens, der die Hintergrundfarbe annimmt
- **border** (Rahmen): die Linie um den Innenabstand
- **margin** (Außenabstand): transparenter Raum außen, der andere Boxen wegschiebt

Standardmäßig (`box-sizing: content-box`) legt `width` nur den Inhalt fest. Innenabstand und Rahmen kommen obendrauf, eine Box mit `width: 200px`, `20px` Innenabstand und `5px` Rahmen ist also tatsächlich **250px** breit.

Fast jedes moderne Stylesheet schaltet das mit `box-sizing: border-box` um, wodurch `width` Innenabstand und Rahmen einschließt. Dann bedeutet `200px` auch 200px.

# Lesson: Flexbox
summary: Dinge in einer Zeile oder Spalte ausrichten, ganz ohne die alten Tricks.

Setz `display: flex` auf einen Container, und seine direkten Kinder werden zu **Flex-Elementen**, die in einer Zeile angeordnet sind.

Die zwei Eigenschaften, die du ständig brauchst:

- `justify-content` positioniert Elemente entlang der Hauptachse (in einer Zeile horizontal): `flex-start`, `center`, `space-between`, `space-around`, `space-evenly`
- `align-items` positioniert sie quer dazu (in einer Zeile vertikal): `stretch` (der Standard), `flex-start`, `center`, `flex-end`

`gap` setzt Abstand zwischen die Elemente, ganz ohne Margin-Rechnerei. `flex-direction: column` macht aus der Zeile eine Spalte, wodurch die beiden Achsen ihre Bedeutung tauschen. `flex: 1` auf einem Element sagt ihm, dass es wachsen und den restlichen Platz einnehmen soll.

> Etwas perfekt in etwas anderem zu zentrieren war früher ein Meme. Heute sind es drei Zeilen: `display: flex; justify-content: center; align-items: center;`

# Lesson: CSS Grid
summary: Zweidimensionale Layouts mit Zeilen, Spalten und der Einheit fr.

Flexbox kümmert sich um eine Richtung auf einmal. **Grid** handhabt Zeilen und Spalten gemeinsam.

`grid-template-columns` legt die Spalten fest. Die Einheit `fr` bedeutet „ein Anteil am freien Platz“, `1fr 2fr` teilt die Breite also in Drittel: eines für die erste Spalte, zwei für die zweite. `repeat(3, 1fr)` ist die Kurzform für drei gleiche Spalten.

Elemente fließen der Reihe nach in die Zellen und brechen automatisch in neue Zeilen um. `gap` legt den Abstand zwischen den Zellen fest.

Das Muster unten lohnt sich zu merken. Es erzeugt so viele Spalten, wie hineinpassen, jede mindestens 120px breit, ohne Media Queries:

```css
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
```

Ändere die Größe des Vorschaubereichs oder den Wert `120px` und schau zu, wie sich die Spalten neu anordnen.

# Quiz

## Q: Welches Element ist die wichtigste Überschrift einer Seite?
- =
- =
- =
- =
explain: Überschriften reichen von `<h1>` bis `<h6>`. `<head>` enthält die Metadaten der Seite, `<header>` ist ein Abschnitt mit einleitendem Inhalt (oft mit einer Überschrift darin), und `<heading>` gibt es nicht.

## Q: Welche Farbe hat der Absatztext?
- Blau
- Rot
- Grün
- Schwarz, weil sich die Regeln widersprechen
explain: Ein ID-Selektor ist spezifischer als eine Klasse, und die ist spezifischer als ein Elementselektor. Die Reihenfolge im Code zählt nur bei gleicher Spezifität, deshalb gewinnt Blau, obwohl es zuerst steht.

## Q: Wie breit ist diese Box auf dem Bildschirm, wenn `box-sizing` auf dem Standardwert steht?
- 200px
- 225px
- 240px
- 250px
explain: Im Modus `content-box` ist `width` nur der Inhalt. Dazu kommen 20px Innenabstand auf jeder Seite (40px) und 5px Rahmen auf jeder Seite (10px): 200 + 40 + 10 = 250px. Mit `box-sizing: border-box` wären es genau 200px.

## Q: Welches CSS zentriert ein einzelnes Kind horizontal und vertikal in seinem Elternelement?
- =
- =
- =
- =
explain: In einer Flex-Zeile steuert `justify-content` die horizontale und `align-items` die vertikale Achse. `align` ist keine CSS-Eigenschaft, `vertical-align` wirkt nur auf Inline- und Tabellenzelleninhalte, und `margin` akzeptiert kein `center` (wobei `margin: 0 auto` einen Block horizontal zentriert).

## Q: Was bewirkt `target="_blank"` bei einem Link?
- Öffnet den Link im selben Tab
- Öffnet den Link in einem neuen Tab oder Fenster
- Macht den Link unsichtbar
- Lädt die verlinkte Datei herunter
explain: `_blank` fordert vom Browser einen neuen Browsing-Kontext an, meist einen Tab. Moderne Browser wenden dabei standardmäßig auch das Verhalten von `rel="noopener"` an, sodass die neue Seite deine nicht steuern kann.

## Q: Der Container ist 300px breit, es gibt keinen Abstand. Wie breit sind die zwei Spalten?
- 150px und 150px
- 100px und 200px
- 1px und 2px
- 300px und 600px
explain: `fr` verteilt den freien Platz im Verhältnis. Insgesamt gibt es 3 Anteile, jeder ist also 100px: ein Anteil für die erste Spalte, zwei für die zweite.

## Q: Welcher Selektor trifft nur die `<li>`-Elemente, die direkte Kinder von `.menu` sind?
- =
- =
- =
- =
explain: `>` ist der Kind-Kombinator. Ein Leerzeichen (Nachfahren-Kombinator) trifft in jeder Tiefe, auch verschachtelte Listen. `+` trifft das nächste Geschwisterelement, und `.menu.li` trifft ein Element, das sowohl die Klasse `menu` als auch `li` hat.

# Challenge: Mach einen Link daraus

Mach aus dem Wort **MDN** einen Link auf `https://developer.mozilla.org`, der sich in einem neuen Tab öffnet. Lass den Rest des Satzes, wie er ist.

## Hints
- Ein Link ist ein `<a>`-Element, das den Text umschließt, der anklickbar sein soll.
- Das Ziel gehört in das `href`-Attribut.
- `target="_blank"` öffnet ihn in einem neuen Tab: `<a href="..." target="_blank">MDN</a>`.

## Tests
- Der Absatz enthält einen Link
- Der Linktext ist genau „MDN“
- Er führt zu https://developer.mozilla.org
- Er öffnet sich in einem neuen Tab
- Der Satz lautet weiterhin „Read the docs on MDN.“

# Challenge: Zentriere die Karte

Die `.card` sitzt in der oberen linken Ecke von `.stage`. Füg CSS hinzu, damit sie horizontal und vertikal zentriert ist. Ändere das HTML nicht.

## Hints
- Flexbox kann zentrieren: Füg `.stage` zuerst `display: flex;` hinzu.
- `justify-content` steuert in einer Zeile die horizontale Achse.
- `align-items: center;` steuert die vertikale Achse. (Grid-Fans: `display: grid; place-items: center;` funktioniert auch.)

## Tests
- Die Karte ist horizontal zentriert
- Die Karte ist vertikal zentriert
- Die Karte behält ihre Breite von 160px
- Die Bühne ist weiterhin 300px hoch

# Challenge: Stopp den Überlauf

Das `.panel` soll seinen 300px breiten Container genau ausfüllen, ragt aber über den rechten Rand hinaus. Behebe das, **ohne** Innenabstand oder Rahmen zu entfernen.

## Hints
- Wie breit ist das Panel wirklich? `width: 100%` sind 300px, dann kommen Innenabstand und Rahmen dazu.
- 300 + 24 + 24 + 2 + 2 = 352px. Das ist der Überlauf.
- Eine einzige Eigenschaft ändert, wie `width` gemessen wird: `box-sizing: border-box;`.

## Tests
- Das Panel passt in den Container
- Das Panel ist so breit wie der Container
- Der Innenabstand ist weiterhin 24px
- Der Rahmen ist weiterhin 2px

# Challenge: Bau eine dreispaltige Galerie

Mach aus `.gallery` ein Grid mit **drei gleich breiten Spalten** und **16px Abstand**, sodass die sechs Fotos zwei Reihen zu je drei bilden.

## Hints
- Fang mit `display: grid;` auf `.gallery` an.
- `grid-template-columns: 1fr 1fr 1fr;` erzeugt drei gleiche Spalten. `repeat(3, 1fr)` sagt dasselbe kürzer.
- `gap: 16px;` setzt Abstand zwischen Zeilen und Spalten.

## Tests
- Fotos 1 bis 3 teilen sich die erste Reihe
- Foto 4 beginnt eine zweite Reihe
- Die Spalten sind gleich breit
- Der horizontale Abstand beträgt 16px
- Der vertikale Abstand beträgt 16px
