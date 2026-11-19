tagline: Legible, con pilas incluidas y presente en todas partes: de la ciencia de datos al script que renombra tus fotos de vacaciones.
runtime: Python 3.12 · Pyodide, se ejecuta en tu navegador

# Lesson: Variables y tipos
summary: Nombres, valores y el puñado de tipos que usarás a diario.

En Python, una variable es un nombre que apunta a un valor. No hay `let`, ni `var`, ni declaración de tipo. Asignas, y el nombre ya existe.

```python
city = "Lisbon"
population = 545_000   # underscores are just for readability
```

Python deduce el tipo a partir del valor. Los que verás constantemente:

- `int` para números enteros, que pueden ser tan grandes como permita la memoria
- `float` para decimales, con las rarezas habituales de la coma flotante
- `str` para texto, entre comillas simples o dobles
- `bool` para `True` y `False` (con mayúscula)
- `None` para "nada, a propósito"

`type()` te dice qué tienes entre manos. Una **f-string** (una cadena con una `f` delante) te permite meter cualquier expresión dentro del texto con `{}`.

La división merece una nota rápida: `/` siempre devuelve un float, `//` redondea el resultado hacia abajo y `%` da el resto.

> Los nombres distinguen mayúsculas de minúsculas y, por convención, se escriben en `snake_case`. `Total` y `total` son dos variables distintas, lo cual es una manera fiable de perder una tarde.

# Lesson: Condiciones
summary: if, elif, else, y por qué aquí la sangría no es una cuestión de estilo.

Python usa la sangría para agrupar el código. Las líneas sangradas bajo un `if` le pertenecen, y el bloque termina cuando termina la sangría. La convención son cuatro espacios.

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

Las comparaciones son `==`, `!=`, `<`, `<=`, `>`, `>=`. Se combinan con las palabras `and`, `or`, `not`. Python también admite comparaciones encadenadas, así que `18 <= age < 65` significa exactamente lo que parece.

Todo valor es **verdadero** (truthy) o **falso** (falsy). Los falsos son `False`, `None`, el cero (`0`, `0.0`) y los contenedores vacíos (`""`, `[]`, `{}`). Todo lo demás cuenta como verdadero; por eso `if not items:` es la forma idiomática de preguntar "¿está vacía esta lista?".

Para valores cortos de uno u otro hay una expresión condicional: `value_if_true if condition else value_if_false`.

# Lesson: Bucles
summary: for recorre cosas; while repite hasta que se le dice que pare.

Un bucle `for` en Python itera sobre cualquier cosa iterable: listas, cadenas, diccionarios, archivos, rangos. No existe el `for (i = 0; ...)` al estilo de C. Cuando necesitas números, usa `range`.

`range(start, stop, step)` se detiene **antes** de `stop`. Así, `range(1, 4)` da 1, 2, 3. Si pasas un solo argumento, empieza en 0.

Cuando necesitas la posición y el elemento, `enumerate` te da ambos, lo cual es mucho mejor que llevar un índice a mano.

Un bucle `while` se repite mientras su condición sea verdadera. Asegúrate de que algo dentro de él acabe volviéndola falsa, o conocerás el mensaje "Ejecución detenida".

`break` sale del bucle de inmediato. `continue` salta a la siguiente iteración.

> `print(..., end=" ")` cambia el salto de línea habitual por un espacio; es útil para imprimir en una sola línea.

# Lesson: Funciones
summary: def, return, argumentos por defecto y devolver más de una cosa.

Defines una función con `def`, le das parámetros y devuelves un valor con `return`. Una función sin `return` también devuelve algo: `None`.

Los parámetros pueden tener **valores por defecto**, y quien llama puede pasar los argumentos **por nombre**, lo que hace que las llamadas se expliquen solas:

```python
send_email("ada@example.com", subject="Hi", urgent=True)
```

Para devolver varios valores, devuélvelos separados por comas. Python los empaqueta en una tupla y quien llama puede desempaquetarlos directamente en variables.

> Imprimir y devolver son cosas distintas. `print` muestra un valor a una persona; `return` se lo entrega al código que te llamó. Confundirlos es el error de principiante más común de esta lección.

# Lesson: Listas y diccionarios
summary: Los dos contenedores que hacen la mayor parte del trabajo.

Una **lista** es una secuencia ordenada y modificable. Los índices empiezan en 0, y los índices negativos cuentan desde el final, así que `items[-1]` es el último elemento. Rebanar con `items[start:stop]` devuelve una lista nueva, y `stop` queda excluido, igual que en `range`.

Una **comprensión de listas** construye una lista a partir de un bucle en una sola línea legible:

```python
squares = [n * n for n in range(5)]
evens = [n for n in range(10) if n % 2 == 0]
```

Un **diccionario** asocia claves con valores. Se consulta con `d[key]`, que lanza `KeyError` si falta la clave, o con `d.get(key, default)`, que no lo hace. Desde Python 3.7, los diccionarios recuerdan el orden de inserción.

Recorre los pares de un diccionario con `.items()`.

# Lesson: Clases
summary: Agrupar datos y las funciones que trabajan con ellos.

Una **clase** es un plano; un **objeto** es algo construido a partir de él. `__init__` se ejecuta al crear un objeto y prepara sus atributos. Cada método recibe el propio objeto como primer parámetro, que por convención se llama `self`.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

Los métodos con doble guion bajo a ambos lados son ganchos que Python llama por ti. `__str__` decide qué muestra `print(obj)`, así ves algo útil en lugar de `<__main__.Point object at 0x...>`.

Cuando un método recibe una entrada con la que no puede trabajar, lanza una excepción. Quien llama puede gestionarla con `try` / `except`.

# Quiz

## Q: ¿Qué imprime esto?
- =
- =
- =
- Un error
explain: `y = x` no copia la lista; le da un segundo nombre a la misma lista. Modificarla a través de `y` cambia también lo que ve `x`. Usa `y = x.copy()` (o `list(x)`) cuando quieras una copia independiente.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: En Python 3, `/` es división real y siempre devuelve un float, incluso cuando el resultado es un número entero. Usa `//` si quieres `2`.

## Q: ¿Qué línea comprueba correctamente si la cadena `name` está vacía?
- =
- =
- =
- =
explain: Una cadena vacía es falsa, así que `not name` es `True` justo cuando está vacía. `== None` no detecta `""` (y, de todos modos, la forma correcta de comprobar `None` es `is None`). Las cadenas no tienen un método `.empty()`, y `=` es una asignación, que dentro de un `if` es un error de sintaxis.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: `range(2, 10, 3)` empieza en 2 y suma 3 en cada paso mientras se mantenga por debajo de 10: 2, 5, 8. El valor final nunca se incluye, y 11 lo supera de todos modos.

## Q: Encuentra el error. ¿Qué imprime esto?
- =
- =
- =
- =
explain: Los valores por defecto se evalúan una sola vez, cuando se define la función, así que todas las llamadas comparten la misma lista. La solución es `items=None` y luego `if items is None: items = []` dentro de la función.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: Multiplicar una cadena por un entero la repite. Python no convierte `"3"` en número por su cuenta; necesitarías `int("3") * 3` para obtener 9.

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: `.get()` devuelve `None` cuando falta la clave (o el valor por defecto que pases como segundo argumento). La versión que lanza `KeyError` es `settings["font"]`.

# Challenge: Arregla el error de uno

`total_to(n)` debería devolver la suma de todos los números enteros del 1 al `n`, ambos incluidos. Así, `total_to(5)` es 1 + 2 + 3 + 4 + 5 = 15. Está cerca, pero no es correcto. Arréglalo.

## Hints
- Imprime los valores de `i` dentro del bucle. ¿Qué números produce realmente `range(n)`?
- `range(n)` va de 0 a `n - 1`. Tú quieres de 1 a `n`.
- `range(1, n + 1)` lo resuelve. (También `sum(range(1, n + 1))`, si te gustan las soluciones de una línea).

# Challenge: Cuenta las vocales

Completa `count_vowels(text)` para que devuelva cuántas vocales (a, e, i, o, u) aparecen en `text`. Las vocales en mayúscula también cuentan.

## Hints
- Pasa primero el texto a minúsculas con `text.lower()` para comprobar un solo caso.
- `ch in "aeiou"` es `True` cuando `ch` es una vocal.
- Una versión compacta: `return sum(1 for ch in text.lower() if ch in "aeiou")`.

# Challenge: De palabras a longitudes

Haz que `word_lengths(sentence)` devuelva un diccionario que asocie cada palabra con su longitud. Las palabras están separadas por espacios.

## Hints
- `sentence.split()` divide por espacios en blanco y devuelve una lista de palabras. Para una cadena vacía devuelve `[]`.
- Crea un diccionario vacío, recorre las palabras y asigna `result[word] = len(word)`.
- Una comprensión de diccionario lo hace en una línea: `{word: len(word) for word in ...}`.

# Challenge: Quita duplicados, conserva el orden

`unique(items)` debería devolver una lista nueva sin duplicados, dejando cada elemento donde apareció **por primera vez**. La versión actual quita los duplicados pero desordena todo.

## Hints
- Los conjuntos (set) no tienen orden, así que convertir a conjunto descarta el orden original.
- Recorre `items` en orden y guarda en un conjunto lo que ya has visto.
- Añade un elemento solo cuando todavía no esté en `seen`. (`list(dict.fromkeys(items))` es un buen atajo, porque las claves de un diccionario conservan el orden de inserción).
