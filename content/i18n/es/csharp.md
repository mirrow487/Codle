tagline: Con tipado estático, ordenado y columna vertebral de las aplicaciones .NET y de los juegos de Unity.
runtime: C# · compilado en un compilador .NET/Mono remoto

# Lesson: Variables y tipos
summary: Tipos estáticos, var y por qué 7 / 2 es 3.

C# tiene **tipado estático**: cada variable tiene un tipo fijado en tiempo de compilación, y el compilador se niega a poner una cadena donde va un `int`. Eso atrapa una categoría entera de errores antes de que tu programa llegue a ejecutarse.

```csharp
int count = 3;
count = "three";   // compile error: cannot convert string to int
```

Los tipos que usarás a diario: `int` (números enteros), `double` (decimales), `decimal` (decimales exactos, la opción correcta para el dinero), `bool`, `char` (un carácter, entre comillas simples) y `string` (texto, entre comillas dobles).

`var` deja que el compilador deduzca el tipo a partir del valor. Sigue siendo tipado estático: `var city = "London";` convierte `city` en un `string` para siempre.

Cuando ambos lados de `/` son enteros, C# hace **división entera** y descarta el resto. Haz que uno de los lados sea `double` para obtener un resultado con decimales.

Las cadenas con el prefijo `$` son **interpoladas**: dentro de ellas, `{expression}` se sustituye por su valor.

> Todos los programas de C# de aquí viven dentro de una clase con un método `static void Main()`. Ahí empieza la ejecución.

# Lesson: Condiciones y switch
summary: if/else, sentencias switch y el operador ternario.

`if`, `else if` y `else` reciben una condición entre paréntesis. La condición debe ser un `bool` de verdad; C# no tratará `0` ni `null` como falso por ti, lo que te ahorra un clásico error de C.

```csharp
if (count = 0) { }   // compile error, not a silent bug
```

Una sentencia `switch` compara un valor con varios casos. Cada sección de caso debe terminar con `break` (o `return`), y puedes apilar etiquetas para compartir un cuerpo:

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

El C# moderno (versión 9 y posteriores) también tiene **expresiones switch** compactas, que producen un valor:

```csharp
string kind = day switch
{
    "Sat" or "Sun" => "Weekend",
    _ => "Weekday"
};
```

Para elecciones sencillas entre dos opciones, el ternario `condition ? a : b` lo deja todo en una línea.

# Lesson: Bucles
summary: for, foreach, while y do-while.

El bucle `for` reúne un inicio, una condición y una actualización en una línea. `foreach` recorre cada elemento de un array o colección, y es el que debes elegir cuando no necesitas el índice.

`while` comprueba su condición antes de cada vuelta. `do ... while` la comprueba después, así que su cuerpo siempre se ejecuta al menos una vez.

`break` sale del bucle; `continue` salta a la siguiente iteración.

> No puedes añadir ni quitar elementos de una `List` mientras un `foreach` la está recorriendo. C# lanza una `InvalidOperationException` en lugar de dejar que te líes.

# Lesson: Métodos
summary: Tipos de retorno, parámetros opcionales, sobrecarga y parámetros out.

Un método declara su tipo de retorno antes de su nombre, o `void` si no devuelve nada. Los métodos que se llaman directamente desde `Main` se marcan como `static`, porque no hay ningún objeto sobre el que llamarlos.

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

Para los métodos de una línea existe el **cuerpo de expresión**: `static int Square(int x) => x * x;`

Los parámetros pueden ser **opcionales** si les das un valor por defecto. También puedes **sobrecargar** un método: escribir varias versiones con el mismo nombre pero distintos tipos de parámetros, y el compilador elige la adecuada en cada llamada.

Un parámetro `out` permite que un método devuelva un valor adicional. Los métodos `TryParse` del framework usan este patrón: devuelven `true` o `false` según el éxito y guardan el valor analizado en la variable `out`.

# Lesson: Colecciones y LINQ
summary: List<T>, Dictionary<K, V> y consultar datos con LINQ.

Los arrays tienen un tamaño fijo. Una `List<T>` crece a medida que añades elementos, donde `T` es el tipo de elemento que contiene. `Count` te dice cuántos elementos tiene.

Un `Dictionary<TKey, TValue>` asocia claves con valores. Leer una clave que no existe con `dict[key]` lanza `KeyNotFoundException`, así que usa `TryGetValue` cuando la clave pueda no estar.

**LINQ** (de `using System.Linq;`) añade métodos de consulta a todas las colecciones: `Where` filtra, `Select` transforma, y `Sum`, `Max`, `Count` y compañía resumen.

> `Console.WriteLine(myList)` imprime el nombre del tipo de la lista en lugar de su contenido, lo cual es exacto y completamente inútil. Usa `string.Join(", ", myList)` para ver el contenido.

# Lesson: Clases
summary: Propiedades, constructores, métodos y excepciones.

Una **clase** agrupa datos y comportamiento. Los datos suelen exponerse mediante **propiedades**, que desde fuera parecen campos pero pueden controlar el acceso:

```csharp
public string Owner { get; }               // read-only after construction
public decimal Balance { get; private set; } // readable everywhere, settable only inside
```

El **constructor** tiene el mismo nombre que la clase y no tiene tipo de retorno. Se ejecuta cuando escribes `new BankAccount("Ada")`.

Sobrescribir `ToString()` controla cómo se ve un objeto cuando se imprime o se mete en una cadena interpolada.

Cuando un método recibe una entrada que no puede aceptar, **lanza** una excepción. Quien llama puede capturarla con `try` / `catch`.

# Quiz

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: Ambos operandos son `int`, así que C# hace división entera y descarta el resto (trunca hacia cero). Escribe `7 / 2.0` o convierte uno de los lados a `double` para obtener `3.5`.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: `bool.ToString()` devuelve `"True"` o `"False"`, con mayúscula. Las palabras clave de C# van en minúscula; el texto impreso, no. A todo el mundo le sorprende exactamente una vez.

## Q: ¿Qué línea crea una lista de cadenas vacía y que puede crecer?
- =
- =
- =
- =
explain: `List<T>` es genérica, así que debes indicar qué contiene, y su constructor se llama con `()`. Una `List<string>` no es un `string[]`, y `new List<string>[]` intentaría crear un array de listas sin tamaño.

## Q: ¿Qué imprime esto?
- =
- =
- Un error de compilación
- Una excepción
explain: Para las cadenas, C# sobrecarga `==` para comparar los caracteres, no las referencias. Dos cadenas con el mismo contenido son iguales, se hayan construido como se hayan construido. (Java lo hace de otra manera, lo que confunde a quien pasa de uno a otro).

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: C# evalúa los operandos estrictamente de izquierda a derecha. `x++` produce 5 y luego pone `x` a 6. `++x` pone `x` a 7 y produce 7. Así que `y` es 5 + 7 = 12. Válido, bien definido, y aun así nada que debas escribir en código real.

## Q: ¿Qué pasa cuando se ejecuta esto?
- Imprime `0`
- No imprime nada
- Lanza una `IndexOutOfRangeException`
- No compila
explain: Un array de 3 elementos tiene los índices 0, 1 y 2. C# comprueba los límites de los arrays en tiempo de ejecución, así que leer el índice 3 lanza una excepción. El compilador no lo detecta porque el índice podría venir de cualquier parte.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: `4.0` es un `double`, así que el `int` 10 se promociona y la división se hace en coma flotante.

# Challenge: Arregla la media

`Average` debería devolver la media exacta de los números, pero sigue perdiendo la parte decimal. Arréglalo.

## Hints
- El método devuelve un `double`, así que ¿por qué el resultado es entero? Mira los tipos de la división.
- `int / int` es división entera. El resultado se trunca antes de convertirse a `double`.
- Convierte antes de dividir: `(double)sum / numbers.Length`.

# Challenge: Cuenta las palabras

Implementa `CountWords` para que devuelva el número de palabras de `text`. Las palabras se separan con uno o más espacios, y los espacios al principio o al final no deben contar como palabras.

## Hints
- `text.Split(' ')` divide por espacios, pero los espacios repetidos dejan cadenas vacías en el resultado.
- `StringSplitOptions.RemoveEmptyEntries` descarta esas cadenas vacías.
- `text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length` es la respuesta completa.

# Challenge: FizzBuzz, como debe ser

Haz que `FizzBuzz(n)` devuelva `"Fizz"` para los múltiplos de 3, `"Buzz"` para los múltiplos de 5, `"FizzBuzz"` para los múltiplos de ambos y el propio número en los demás casos.

## Hints
- `n % 3 == 0` es verdadero cuando `n` es múltiplo de 3.
- El orden importa: comprueba primero "múltiplo de ambos", o 15 devolverá `"Fizz"` y se quedará ahí.
- Un múltiplo de 3 y de 5 a la vez es un múltiplo de 15.

# Challenge: Termina el Rectangle

Completa las propiedades `Area` e `IsSquare` de `Rectangle`.

## Hints
- `=>` en una propiedad define una propiedad calculada de solo lectura. Lo que haya a la derecha se recalcula cada vez que se lee.
- Dentro de la clase puedes usar `Width` y `Height` directamente.
- `Area => Width * Height;` y `IsSquare => Width == Height;`
