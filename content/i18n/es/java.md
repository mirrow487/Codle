tagline: Prolijo a propósito, portable por diseño y todavía al frente de buena parte de los backends del mundo.
runtime: Java 21 · compilado en un JDK remoto

# Lesson: Variables y tipos
summary: Primitivos, String, var, final y cómo se comporta + con el texto.

Java tiene tipado estático: declaras qué contiene cada variable y el compilador te obliga a cumplirlo.

Los tipos **primitivos** guardan valores simples: `int`, `long`, `double`, `boolean`, `char` y algunos más pequeños. `String` (con S mayúscula) es una clase, no un primitivo, pero se usa tanto que Java le da una sintaxis literal: `"like this"`.

Desde Java 10, `var` deduce el tipo de una variable local a partir de su valor: `var city = "London";` es un `String`. `final` hace que una variable no pueda cambiar tras su primera asignación, y las constantes se escriben por convención en `UPPER_SNAKE_CASE`.

`int / int` es división entera, así que `7 / 2` es `3`.

El operador `+` trabaja de izquierda a derecha y, en cuanto encuentra un `String`, todo lo que viene después pasa a ser concatenación. Por eso `"1" + 2 + 3` es `"123"`, mientras que `1 + 2 + "3"` es `"33"`.

> Todo programa Java necesita una clase con un método `public static void main(String[] args)`. Ese código repetitivo es el precio de la entrada; al cabo de una semana dejas de verlo.

# Lesson: Condiciones
summary: if/else, expresiones switch y la trampa de == frente a equals().

`if`, `else if` y `else` reciben una condición `boolean` entre paréntesis. Java no trata los números como verdadero o falso.

Desde Java 14, las **expresiones switch** usan flechas, no necesitan `break` y producen un valor:

```java
String kind = switch (day) {
    case "Sat", "Sun" -> "Weekend";
    default -> "Weekday";
};
```

La sentencia `switch` clásica con `case X:` y `break` sigue existiendo y la verás en código antiguo.

Ahora, lo importante. Para los objetos, incluido `String`, `==` pregunta "¿son **el mismo objeto**?", no "¿contienen el mismo texto?". Usa `.equals()` para comparar contenidos. Dos cadenas pueden verse idénticas y aun así no pasar `==`.

# Lesson: Bucles
summary: for, el for mejorado, while y do-while.

El bucle `for` clásico tiene un inicializador, una condición y una actualización. El **for mejorado** (a menudo llamado for-each) recorre cada elemento de un array o colección:

```java
for (String fruit : fruits) { ... }
```

`while` comprueba su condición antes de cada vuelta; `do ... while` la comprueba después, así que el cuerpo se ejecuta al menos una vez.

`break` sale del bucle y `continue` pasa a la siguiente vuelta. En bucles anidados, Java te permite etiquetar el bucle exterior y escribir `break outer;`.

# Lesson: Métodos
summary: Métodos estáticos, sobrecarga y qué significa de verdad "paso por valor".

Los métodos declaran un tipo de retorno (o `void`), un nombre y parámetros con tipo. Los métodos llamados directamente desde `main` son `static`.

Java no tiene valores por defecto para los parámetros. El sustituto idiomático es la **sobrecarga**: varios métodos con el mismo nombre y distintas listas de parámetros, donde el más corto llama al más largo.

Java siempre **pasa por valor**. Con los primitivos, el método recibe una copia, así que cambiarla no tiene efecto fuera. Con los objetos, lo que se copia es la **referencia**, así que el método puede modificar el objeto que le pasaron, pero no puede hacer que la variable de quien llama apunte a otro objeto.

# Lesson: Colecciones y streams
summary: ArrayList, implementaciones de Map y procesar datos con streams.

`ArrayList<T>` es la lista redimensionable de referencia. Las colecciones guardan objetos, así que para números escribes el tipo envoltorio: `List<Integer>`, no `List<int>`. Java convierte entre `int` e `Integer` automáticamente (autoboxing).

Un `Map<K, V>` guarda pares clave/valor. Elige la implementación según el orden que necesites:

- `HashMap`: la más rápida, orden de recorrido no especificado
- `LinkedHashMap`: recuerda el orden de inserción
- `TreeMap`: mantiene las claves ordenadas

`get` devuelve `null` para una clave que no existe; `getOrDefault(key, fallback)` suele ser más cómodo.

Los **streams** te permiten describir una cadena de procesamiento: `filter` conserva los elementos que coinciden, `map` los transforma y una operación terminal como `sum()` o `collect(...)` produce el resultado.

# Lesson: Clases
summary: Campos, constructores, encapsulación, toString y excepciones.

Una clase declara **campos** (datos) y **métodos** (comportamiento). Haz los campos `private` y expón lo que necesiten quienes la usan mediante métodos. Eso es encapsulación, y significa que puedes cambiar el interior más adelante sin romper nada a nadie.

El **constructor** tiene el nombre de la clase y no tiene tipo de retorno. `this.owner = owner;` distingue el campo del parámetro con el mismo nombre.

Sobrescribir `toString()` controla lo que muestra `System.out.println(obj)`. Sin ello obtienes algo como `BankAccount@1b6d3586`.

Una entrada no válida se notifica **lanzando** una excepción como `IllegalArgumentException`, que quien llama puede gestionar con `try` / `catch`.

> Cuando ejecutas directamente un único archivo Java, la primera clase del archivo debe ser la que tiene `main`; por eso `Main` va primero abajo.

# Quiz

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: Dos operandos `int` significan división entera; la parte decimal se descarta. `7 / 2.0` da `3.5`.

## Q: ¿Qué imprime esto?
- =
- =
- Un error de compilación
- =
explain: `new String(...)` siempre crea un objeto nuevo, y `==` compara la identidad de los objetos. Los textos coinciden, pero son objetos distintos. Usa `a.equals(b)` para comparar contenidos.

## Q: ¿Qué imprime esto?
- =
- =
- =
- Un error de compilación
explain: `+` se evalúa de izquierda a derecha. `"1" + 2` es la cadena `"12"`, y `"12" + 3` es `"123"`. Escribe `"1" + (2 + 3)` si quieres `"15"`.

## Q: ¿Qué línea declara una lista redimensionable de números enteros?
- =
- =
- =
- =
explain: Los genéricos solo aceptan tipos de objeto, así que se usa el envoltorio `Integer` en lugar del primitivo `int`. La tercera opción pone el argumento de tipo en el lugar equivocado, y un `ArrayList` no es un array.

## Q: ¿Qué imprime esto?
- =
- =
- Un error de compilación: debería ser `arr.length()`
- Un error de compilación: debería ser `arr.size()`
explain: Los arrays tienen un **campo** `length`. Las cadenas tienen un **método** `length()`, y las colecciones tienen `size()`. Sí, los tres. Sí, la gente los confunde durante años.

## Q: ¿Qué imprime esto?
- =
- =
- =
- Un error de compilación
explain: La aritmética con un `char` lo promociona a `int`, y `'A'` es 65. Para obtener `'B'`, vuelve a convertirlo: `(char) (c + 1)`.

## Q: ¿Qué imprime esto con la configuración por defecto de la JVM?
- =
- =
- =
- =
explain: El autoboxing reutiliza objetos `Integer` en caché para los valores de -128 a 127, así que `a` y `b` son el mismo objeto. 128 queda fuera de la caché, así que `c` y `d` son objetos distintos. La lección es la misma que con las cadenas: compara los objetos envoltorio con `.equals()`.

# Challenge: ¿Quién es el admin?

`isAdmin` debería devolver `true` siempre que el rol sea el texto `"admin"`. Funciona en una prueba y falla en otra. Arréglalo.

## Hints
- La primera prueba solo pasa porque los literales de cadena idénticos comparten un mismo objeto.
- `==` compara la identidad de los objetos. Tú quieres comparar los caracteres.
- Usa `.equals()`. Escribir `"admin".equals(role)` además evita una `NullPointerException` si algún día `role` es `null`.

# Challenge: Suma las cifras

Implementa `sumDigits(n)` para que devuelva la suma de las cifras decimales de un entero no negativo. Por ejemplo, `sumDigits(123)` es 1 + 2 + 3 = 6.

## Hints
- `n % 10` da la última cifra de `n`.
- `n / 10` (división entera) elimina la última cifra.
- Repite ambos pasos en un bucle `while (n > 0)`, sumando cada última cifra a un total acumulado.

# Challenge: Iniciales

Escribe `initials(fullName)`, que convierte un nombre en iniciales en mayúscula seguidas de puntos. Los nombres pueden tener cualquier número de palabras, separadas por espacios.

## Hints
- `fullName.split(" ")` te da un array de palabras. (`"\\s+"` también se las arregla con espacios repetidos).
- `word.charAt(0)` es la primera letra, y `Character.toUpperCase` la pone en mayúscula.
- Reúne las piezas en un `StringBuilder`, añadiendo una letra y luego un `'.'` por cada palabra.

# Challenge: Arregla el termómetro

`Temperature.toFahrenheit()` convierte de Celsius a Fahrenheit con F = C × 9 / 5 + 32. La temperatura corporal, 37 °C, debería ser 98.6 °F, pero la clase dice 98.0. Arregla el cálculo.

## Hints
- El método devuelve un `double` y, sin embargo, el resultado ha perdido los decimales. ¿Cuándo ocurrió?
- `celsius * 9 / 5` se calcula entero con `int`: 333 / 5 es 66, no 66.6.
- Haz que uno de los operandos sea un `double`, por ejemplo `9.0`, para que la división conserve la fracción.
