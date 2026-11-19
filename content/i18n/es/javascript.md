tagline: El lenguaje de la web. Peculiar en algunos rincones, tremendamente capaz en todos.
runtime: JavaScript · se ejecuta en tu navegador, con la salida de consola al estilo de Node.js

# Lesson: Variables y tipos
summary: let, const y los siete tipos primitivos que de verdad vas a encontrar.

Declara las variables con `const` cuando el enlace no se vaya a reasignar, y con `let` cuando sí. Elige `const` primero: le dice a quien lee "este nombre siempre apunta a lo mismo". En código antiguo verás también `var`. Tiene reglas de ámbito más laxas y el código moderno lo evita.

```js
const siteName = "Codle";
let visits = 0;
visits = visits + 1;   // fine
siteName = "Other";    // TypeError: Assignment to constant variable.
```

Los tipos del día a día son `string`, `number` (un solo tipo para enteros y decimales), `boolean`, `undefined` (declarado pero sin valor), `null` (vacío a propósito), y además `bigint` y `symbol` para casos especiales. Todo lo demás, incluidos los arrays y las funciones, es un objeto.

Las **plantillas literales** (template literals) usan comillas invertidas y permiten incrustar expresiones con `${...}`.

> `typeof null` es `"object"`. Es un error de 1995 que nunca podrá corregirse sin romper la web. Comprueba null con `value === null`.

# Lesson: Condiciones e igualdad
summary: if/else, por qué === es el que quieres y qué cuenta como "falso".

`if`, `else if` y `else` funcionan como esperas, con la condición entre paréntesis y el cuerpo entre llaves.

JavaScript tiene dos operadores de igualdad. `===` (estricto) compara valor **y** tipo. `==` (laxo) convierte los tipos primero, con reglas que nadie memoriza a propósito. Usa `===` y `!==` salvo que tengas un motivo concreto.

Los valores **falsos** (falsy) son `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` y `NaN`. Todo lo demás es verdadero, incluidos `"0"`, `[]` y `{}`.

Dos operadores para valores por defecto que se parecen pero no son iguales:

- `a || b` devuelve `b` si `a` es **cualquier** valor falso
- `a ?? b` devuelve `b` solo si `a` es `null` o `undefined`

Así que, si `0` es un valor legítimo, `??` es el que no lo tirará a la basura.

# Lesson: Bucles
summary: El for clásico, for...of para los valores y métodos de array que hacen el bucle por ti.

El bucle `for` clásico tiene tres partes: un punto de partida, una condición que se comprueba antes de cada vuelta y una actualización que se ejecuta después de cada vuelta.

```js
for (let i = 0; i < 3; i++) { /* runs with i = 0, 1, 2 */ }
```

Cuando solo quieres cada valor de un array (o de una cadena, un Map o un Set), `for...of` es más limpio. También existe `for...in`, que recorre las **claves** de un objeto; evítalo con arrays, porque te da los índices como cadenas.

Los arrays tienen además `forEach`, que llama a una función por cada elemento y le pasa el índice como segundo argumento.

`while` se repite mientras su condición sea verdadera. `break` sale antes del bucle; `continue` salta a la siguiente iteración.

# Lesson: Funciones
summary: Declaraciones, funciones flecha, parámetros por defecto y clausuras.

Hay dos formas habituales de escribir una función:

```js
function add(a, b) {        // declaration: hoisted, has its own `this`
  return a + b;
}
const add2 = (a, b) => a + b;  // arrow: concise, inherits `this`
```

Una función flecha con una sola expresión la devuelve automáticamente. Si añades llaves, vuelves a necesitar un `return` explícito. Olvidarlo es una fuente clásica de `undefined` misteriosos.

Los parámetros pueden tener **valores por defecto**: `function greet(name, greeting = "Hello")`.

Las funciones recuerdan las variables que estaban en su ámbito cuando se crearon. Eso es una **clausura** (closure), y es la forma de tener estado privado sin una clase: el contador de abajo mantiene viva `count` entre llamadas, pero nada de fuera puede tocarla.

Una función sin `return` devuelve `undefined`.

# Lesson: Arrays y objetos
summary: Listas ordenadas, bolsas de clave/valor, desestructuración y el operador de propagación.

Un **array** es una lista ordenada, indexada desde 0. `push` añade al final, `length` te dice cuántos elementos hay y `at(-1)` lee desde el final.

Un **objeto** asocia claves de texto con valores. Se lee con notación de punto (`user.name`) o con corchetes (`user["name"]`), que necesitas cuando la clave está en una variable.

La **desestructuración** saca valores a variables de una vez, y la sintaxis de **propagación** `...` copia propiedades en un objeto nuevo o elementos en un array nuevo.

> `const` impide reasignar la variable, no modificar el objeto al que apunta. `const scores = []; scores.push(1);` es perfectamente válido.

# Lesson: Métodos de array
summary: map, filter, reduce, find y la trampa de sort().

Estos métodos reciben una función y hacen el bucle por ti. Se leen como una descripción de lo que quieres, no de cómo conseguirlo.

- `map(fn)` devuelve un array nuevo con `fn` aplicada a cada elemento
- `filter(fn)` conserva los elementos para los que `fn` devuelve algo verdadero
- `reduce(fn, start)` reduce el array a un único valor
- `find(fn)` devuelve el primer elemento que coincide, o `undefined`

Ninguno de ellos modifica el array original. `sort` es distinto: ordena **en el sitio** y, por defecto, compara los elementos como cadenas. Así es como `[10, 9, 1]` acaba siendo `[1, 10, 9]`. Pasa un comparador para ordenar números correctamente.

# Quiz

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: Cuando cualquiera de los lados de `+` es una cadena, JavaScript convierte el otro lado en cadena y concatena. Los demás operadores aritméticos convierten a número, así que `"5" - 3` es `2`.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: Los objetos y los arrays se comparan por referencia, no por contenido. Son dos arrays distintos que casualmente tienen los mismos valores. Para comparar contenidos, recórrelos o compara la salida de `JSON.stringify` en datos simples.

## Q: `nums` es un `const`. ¿Qué pasa aquí?
- =
- =
- =
- =
explain: `const` impide reasignar el nombre `nums`. No congela el array, así que `push` funciona. La línea que lanzaría el error sería `nums = []`.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: `var` tiene ámbito de función, así que los tres callbacks comparten un único `i`. Cuando se disparan los temporizadores, el bucle ya terminó e `i` vale 3. Cambia `var` por `let` y cada iteración tendrá su propio `i`, imprimiendo 0, 1, 2.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: NaN ("Not a Number", no es un número) es un valor especial del tipo number, producido por cosas como `0 / 0` o `Number("abc")`. Compruébalo con `Number.isNaN(value)`, porque `NaN === NaN` es `false`.

## Q: ¿Cuál devuelve el doble de su argumento?
- =
- =
- =
- =
explain: Una función flecha con cuerpo de expresión devuelve esa expresión. Con llaves, el cuerpo es un bloque y necesita un `return` explícito, así que la segunda opción devuelve `undefined`. Las dos últimas son errores de sintaxis.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: `0.1 * 3` es `0.30000000000000004` en coma flotante binaria. Compara floats con una tolerancia: `Math.abs(a - b) < Number.EPSILON`.

# Challenge: Suma sin NaN

`sumArray(arr)` debería sumar todos los números de un array. Ahora mismo devuelve `NaN` siempre. Averigua por qué y arréglalo.

## Hints
- ¿Qué es `arr[arr.length]`? Prueba a mostrarlo por consola.
- Leer más allá del final de un array da `undefined`, y `number + undefined` es `NaN`.
- El bucle debería parar en `i < arr.length`. (O prescinde del índice: `arr.reduce((sum, n) => sum + n, 0)`).

# Challenge: Mayúscula en cada palabra

Escribe `capitalizeWords(str)` para que ponga en mayúscula la primera letra de cada palabra separada por espacios y deje intacto el resto de la palabra.

## Hints
- `str.split(" ")` te da un array de palabras, y `.join(" ")` las vuelve a unir.
- Para una sola palabra: `word.charAt(0).toUpperCase()` más `word.slice(1)`.
- Júntalo todo con `map` entre el split y el join.

# Challenge: Cuenta las palabras

`countWords(words)` recibe un array de cadenas. Devuelve un objeto que asocie cada palabra con el número de veces que aparece.

## Hints
- Empieza con un objeto vacío, `{}`, y recorre las palabras.
- La primera vez que ves una palabra, `counts[word]` es `undefined`. `counts[word] ?? 0` lo convierte en 0.
- Con `reduce`: `words.reduce((acc, w) => ({ ...acc, [w]: (acc[w] ?? 0) + 1 }), {})`.

# Challenge: El await que falta

`delay(ms, value)` devuelve una Promise que se resuelve con `value` al cabo de `ms` milisegundos. `main` debería imprimir `first and second`, pero imprime algo mucho menos útil. Arregla `main`.

## Hints
- `delay(...)` devuelve una Promise inmediatamente. Una Promise convertida en cadena es `[object Promise]`.
- Dentro de una función `async`, `await` espera a que una Promise se resuelva y te da su valor.
- `const a = await delay(50, "first");` funciona. `await Promise.all([...])` ejecuta los dos retrasos a la vez, que es más rápido.
