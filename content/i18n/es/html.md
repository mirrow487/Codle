tagline: HTML dice qué son las cosas. CSS dice cómo se ven. Juntos son todas las páginas web que has visto.
runtime: HTML y CSS · vista previa en vivo en un marco aislado

# Lesson: Estructura del documento
summary: El esqueleto que comparten todas las páginas web y para qué sirve cada hueso.

HTML describe **qué son las cosas**: esto es un título, esto es un párrafo, esto es una lista. El navegador decide un aspecto por defecto, y después CSS lo cambia.

El contenido va dentro de **elementos**, escritos como una etiqueta de apertura, el contenido y una etiqueta de cierre: `<p>Hello</p>`. Algunos elementos, como `<img>` y `<meta>`, son **vacíos** (void) y no tienen etiqueta de cierre.

Todas las páginas tienen el mismo esquema:

- `<!DOCTYPE html>` le dice al navegador que use el modo de estándares moderno
- `<html lang="en">` lo envuelve todo y declara el idioma (los lectores de pantalla lo usan)
- `<head>` contiene información **sobre** la página: título, juego de caracteres, estilos
- `<body>` contiene lo que la gente ve de verdad

Los títulos van de `<h1>` (el más importante) a `<h6>`. Úsalos para la estructura, no para el tamaño; el tamaño lo puedes cambiar con CSS.

> Edita el texto de la vista previa de abajo y pulsa Ejecutar. Nada de lo que escribas aquí puede romper nada, así que sé tan temerario como quieras.

# Lesson: Texto, enlaces y listas
summary: Etiquetas de texto con significado, atributos y los dos tipos de lista.

Elige las etiquetas por su significado. `<strong>` marca importancia y `<em>` marca énfasis. Ambas tienen un estilo por defecto (negrita, cursiva), pero lo que leen en voz alta las tecnologías de asistencia es el significado.

Los elementos pueden llevar **atributos** dentro de la etiqueta de apertura, escritos como `name="value"`. Un enlace es un elemento `<a>` cuyo atributo `href` indica adónde va:

```html
<a href="https://developer.mozilla.org">MDN Web Docs</a>
```

Las imágenes necesitan un `src` y un texto `alt` que describa la imagen para quienes no pueden verla.

Las listas tienen dos sabores: `<ul>` para listas sin orden (viñetas) y `<ol>` para listas ordenadas (números). En ambos casos, cada elemento es un `<li>`.

> Los enlaces de esta vista previa están desactivados para que no salgas de la página por accidente. La consola te dice adónde habrían ido.

# Lesson: Selectores de CSS y la cascada
summary: Cómo elige CSS los elementos y cómo resuelve las discusiones entre reglas.

Una regla de CSS es un **selector** más unas **declaraciones**:

```css
p {
  color: #333;
  line-height: 1.6;
}
```

Los selectores que más usarás:

- `p` selecciona todos los elementos `<p>`
- `.note` selecciona los elementos con `class="note"` (un elemento puede tener varias clases)
- `#intro` selecciona el único elemento con `id="intro"`
- `nav a` selecciona los elementos `<a>` que estén en cualquier lugar dentro de un `<nav>`
- `ul > li` selecciona los elementos `<li>` que son hijos directos de un `<ul>`

Cuando dos reglas no se ponen de acuerdo, decide la **especificidad**: un id gana a una clase, y una clase gana a un selector de elemento. Solo cuando la especificidad empata gana la regla que aparece después. Esa es la "cascada" de Cascading Style Sheets.

# Lesson: El modelo de caja
summary: Contenido, relleno, borde, margen y el ajuste que hace que los tamaños tengan sentido.

Cada elemento es una caja rectangular formada por cuatro capas, de dentro hacia fuera:

- **content** (contenido): el texto o la imagen en sí
- **padding** (relleno): el espacio dentro del borde, que toma el color de fondo
- **border** (borde): la línea alrededor del relleno
- **margin** (margen): el espacio transparente de fuera, que aparta otras cajas

Por defecto (`box-sizing: content-box`), `width` solo fija el contenido. El relleno y el borde se suman encima, así que una caja con `width: 200px`, relleno de `20px` y borde de `5px` mide en realidad **250px** de ancho.

Casi todas las hojas de estilo modernas lo cambian con `box-sizing: border-box`, que hace que `width` incluya el relleno y el borde. Entonces `200px` significa 200px.

# Lesson: Flexbox
summary: Alinear cosas en fila o en columna sin los trucos de antes.

Pon `display: flex` en un contenedor y sus hijos directos se convierten en **elementos flex** colocados en una fila.

Las dos propiedades que usarás constantemente:

- `justify-content` coloca los elementos a lo largo del eje principal (horizontal en una fila): `flex-start`, `center`, `space-between`, `space-around`, `space-evenly`
- `align-items` los coloca en el eje transversal (vertical en una fila): `stretch` (el valor por defecto), `flex-start`, `center`, `flex-end`

`gap` añade espacio entre elementos sin cuentas con márgenes. `flex-direction: column` convierte la fila en columna, lo que intercambia el significado de los dos ejes. `flex: 1` en un elemento le dice que crezca y ocupe el espacio sobrante.

> Centrar perfectamente una cosa dentro de otra solía ser un meme. Ahora son tres líneas: `display: flex; justify-content: center; align-items: center;`

# Lesson: CSS Grid
summary: Diseños en dos dimensiones con filas, columnas y la unidad fr.

Flexbox se ocupa de una dirección cada vez. **Grid** maneja filas y columnas a la vez.

`grid-template-columns` define las columnas. La unidad `fr` significa "una fracción del espacio libre", así que `1fr 2fr` divide el ancho en tercios: uno para la primera columna y dos para la segunda. `repeat(3, 1fr)` es la forma abreviada de tres columnas iguales.

Los elementos fluyen a las celdas en orden y pasan a filas nuevas automáticamente. `gap` fija el espacio entre celdas.

Vale la pena memorizar el patrón de abajo. Crea tantas columnas como quepan, cada una de al menos 120px de ancho, sin media queries:

```css
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
```

Cambia el tamaño del área de vista previa o modifica `120px` y mira cómo se reorganizan las columnas.

# Quiz

## Q: ¿Qué elemento es el título más importante de una página?
- =
- =
- =
- =
explain: Los títulos van de `<h1>` a `<h6>`. `<head>` contiene los metadatos de la página, `<header>` es una sección de contenido introductorio (que a menudo contiene un título), y `<heading>` no existe.

## Q: ¿De qué color es el texto del párrafo?
- Azul
- Rojo
- Verde
- Negro, porque las reglas entran en conflicto
explain: Un selector de id es más específico que una clase, que a su vez es más específica que un selector de elemento. El orden en el código solo importa cuando la especificidad es igual, así que gana el azul aunque vaya primero.

## Q: Con el `box-sizing` por defecto, ¿qué ancho tiene esta caja en pantalla?
- 200px
- 225px
- 240px
- 250px
explain: En modo `content-box`, `width` es solo el contenido. Suma 20px de relleno a cada lado (40px) y 5px de borde a cada lado (10px): 200 + 40 + 10 = 250px. Con `box-sizing: border-box` serían exactamente 200px.

## Q: ¿Qué CSS centra un único hijo en horizontal y en vertical dentro de su padre?
- =
- =
- =
- =
explain: En una fila flex, `justify-content` controla el eje horizontal y `align-items` el vertical. `align` no es una propiedad de CSS, `vertical-align` solo afecta al contenido en línea y de celdas de tabla, y `margin` no acepta `center` (aunque `margin: 0 auto` centra un bloque en horizontal).

## Q: ¿Qué hace `target="_blank"` en un enlace?
- Abre el enlace en la misma pestaña
- Abre el enlace en una pestaña o ventana nueva
- Hace invisible el enlace
- Descarga el archivo enlazado
explain: `_blank` pide al navegador un nuevo contexto de navegación, normalmente una pestaña. Los navegadores modernos también le aplican por defecto el comportamiento de `rel="noopener"`, para que la página nueva no pueda controlar la tuya.

## Q: El contenedor mide 300px de ancho y no hay hueco. ¿Qué ancho tienen las dos columnas?
- 150px y 150px
- 100px y 200px
- 1px y 2px
- 300px y 600px
explain: `fr` reparte el espacio libre en proporción. Hay 3 fracciones en total, así que cada una mide 100px: una fracción para la primera columna y dos para la segunda.

## Q: ¿Qué selector solo coincide con los elementos `<li>` que son hijos directos de `.menu`?
- =
- =
- =
- =
explain: `>` es el combinador de hijo. Un espacio (combinador de descendiente) coincide a cualquier profundidad, incluidas las listas anidadas. `+` coincide con el hermano siguiente, y `.menu.li` coincide con un elemento que tenga a la vez las clases `menu` y `li`.

# Challenge: Conviértelo en enlace

Convierte la palabra **MDN** en un enlace a `https://developer.mozilla.org` que se abra en una pestaña nueva. Deja el resto de la frase tal cual.

## Hints
- Un enlace es un elemento `<a>` que envuelve el texto que quieres que se pueda pulsar.
- El destino va en el atributo `href`.
- `target="_blank"` lo abre en una pestaña nueva: `<a href="..." target="_blank">MDN</a>`.

## Tests
- El párrafo contiene un enlace
- El texto del enlace es exactamente "MDN"
- Apunta a https://developer.mozilla.org
- Se abre en una pestaña nueva
- La frase sigue diciendo "Read the docs on MDN."

# Challenge: Centra la tarjeta

La `.card` está en la esquina superior izquierda de `.stage`. Añade CSS para que quede centrada en horizontal y en vertical. No cambies el HTML.

## Hints
- Flexbox sabe centrar cosas: empieza añadiendo `display: flex;` a `.stage`.
- `justify-content` controla el eje horizontal en una fila.
- `align-items: center;` controla el eje vertical. (Si prefieres Grid, `display: grid; place-items: center;` también funciona).

## Tests
- La tarjeta está centrada en horizontal
- La tarjeta está centrada en vertical
- La tarjeta conserva sus 160px de ancho
- El escenario sigue midiendo 300px de alto

# Challenge: Detén el desbordamiento

El `.panel` debería ocupar exactamente su contenedor de 300px, pero se sale por el borde derecho. Arréglalo **sin** quitar el relleno ni el borde.

## Hints
- ¿Cuánto mide de verdad el panel? `width: 100%` son 300px, y luego se suman el relleno y el borde.
- 300 + 24 + 24 + 2 + 2 = 352px. Ese es el desbordamiento.
- Una sola propiedad cambia cómo se mide `width`: `box-sizing: border-box;`.

## Tests
- El panel cabe dentro del contenedor
- El panel es tan ancho como el contenedor
- El relleno sigue siendo de 24px
- El borde sigue siendo de 2px

# Challenge: Crea una galería de tres columnas

Convierte `.gallery` en una cuadrícula con **tres columnas iguales** y un **hueco de 16px**, para que las seis fotos formen dos filas de tres.

## Hints
- Empieza con `display: grid;` en `.gallery`.
- `grid-template-columns: 1fr 1fr 1fr;` crea tres columnas iguales. `repeat(3, 1fr)` dice lo mismo de forma más breve.
- `gap: 16px;` separa tanto las filas como las columnas.

## Tests
- Las fotos 1 a 3 comparten la primera fila
- La foto 4 empieza una segunda fila
- Las columnas tienen el mismo ancho
- El hueco horizontal es de 16px
- El hueco vertical es de 16px
