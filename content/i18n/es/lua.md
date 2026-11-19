tagline: Diminuto, rápido e integrado en más juegos y herramientas de los que imaginarías. Los arrays empiezan en 1; acéptalo.
runtime: Lua 5.3 · Fengari, se ejecuta en tu navegador

# Lesson: Variables y tipos
summary: local, nil, números, cadenas y el operador ..

En Lua las variables son **globales por defecto**, y rara vez es lo que quieres. Pon `local` delante de cada variable nueva salvo que tengas un motivo para no hacerlo. Las locales son más rápidas y no pueden colarse en código que no las esperaba.

```lua
local score = 10      -- local to this file or block
count = 3             -- global: visible everywhere (avoid)
```

Lua tiene un conjunto pequeño de tipos: `nil`, `boolean`, `number`, `string`, `table` y `function` (además de `userdata` y `thread`, que por ahora puedes ignorar). Una variable que nunca se asignó es simplemente `nil`.

Desde Lua 5.3, los números tienen dos subtipos: **integer** (entero) y **float** (decimal). `/` siempre produce un float, mientras que `//` es la división redondeada hacia abajo.

Las cadenas se unen con `..` (dos puntos), no con `+`, y `#` da la longitud de una cadena. Los números se convierten a texto automáticamente al concatenarlos.

> `print` con varios argumentos los separa con tabuladores. Los ejemplos de aquí suelen construir una sola cadena con `..` para que la salida quede ordenada.

# Lesson: Condiciones
summary: if/then/end, ~= y la lista, muy corta, de valores falsos.

Las condiciones usan `if ... then`, un `elseif` opcional (una sola palabra) y `else`, y terminan con `end`.

```lua
if score >= 90 then
  grade = "A"
elseif score >= 80 then
  grade = "B"
else
  grade = "C"
end
```

"Distinto de" se escribe `~=`. Los operadores lógicos son las palabras `and`, `or` y `not`.

Esta es la parte que sorprende a quien viene de otros lenguajes: **solo `nil` y `false` son falsos**. El cero es verdadero. La cadena vacía es verdadera. Una tabla vacía es verdadera.

`and` y `or` devuelven uno de sus operandos en lugar de un booleano estricto, lo que te da dos modismos útiles:

- `x or default` usa `default` cuando `x` es `nil` (o `false`)
- `cond and a or b` funciona como un operador ternario, siempre que `a` no sea `false` ni `nil`

# Lesson: Bucles
summary: for numérico, while, repeat...until y el continue que falta.

El `for` numérico cuenta desde un valor inicial hasta uno final, y el final **se incluye**. Un tercer número opcional fija el paso, que puede ser negativo.

```lua
for i = 1, 5 do ... end        -- 1, 2, 3, 4, 5
for i = 10, 0, -5 do ... end   -- 10, 5, 0
```

`while cond do ... end` comprueba antes de cada vuelta. `repeat ... until cond` comprueba **después** de cada vuelta, así que su cuerpo siempre se ejecuta al menos una vez.

`break` sale de un bucle. Lua no tiene `continue`; los sustitutos habituales son envolver el cuerpo en un `if` o usar un `goto continue` con una etiqueta `::continue::` al final del cuerpo.

También existe el `for` genérico, que recorre tablas con `ipairs` y `pairs`. Lo verás en la lección de Tablas.

# Lesson: Funciones
summary: Varios valores de retorno, argumentos variables y clausuras.

Declara las funciones con `local function name(params) ... end`. Los argumentos que faltan llegan como `nil`, por eso `param = param or default` es la forma estándar de dar valores por defecto.

Las funciones de Lua pueden **devolver varios valores** a la vez, y quien llama puede recogerlos en varias variables:

```lua
local function divmod(a, b)
  return a // b, a % b
end
local q, r = divmod(17, 5)   -- q = 3, r = 2
```

`...` recoge cualquier número de argumentos. Envuélvelo en una tabla, `{...}`, para recorrerlos.

Las funciones son valores normales. Puedes guardarlas en variables, pasarlas de un lado a otro y devolverlas desde otras funciones. Una función interna conserva el acceso a las variables locales de la función que la creó; eso se llama **clausura** (closure).

# Lesson: Tablas
summary: La única estructura de datos de Lua, usada como array, diccionario y objeto.

Lua tiene exactamente una estructura de datos, la **tabla**, y lo hace todo.

Usada como **array**, una tabla se indexa desde **1**, no desde 0. `#t` da la longitud y `table.insert(t, value)` añade al final.

```lua
local colors = {"red", "green", "blue"}
print(colors[1])   -- red
print(colors[0])   -- nil: there is nothing at index 0
```

Usada como **diccionario**, las claves pueden ser cadenas (o casi cualquier valor). `t.name` es la forma abreviada de `t["name"]`. Leer una clave que no existe da `nil` en lugar de un error.

Recorre los arrays con `ipairs` (en orden, de 1 a n) y los diccionarios con `pairs`. El orden de `pairs` **no** está garantizado, así que nunca dependas de él.

`table.concat(t, sep)` une un array de cadenas; es la forma más rápida de imprimir uno.

# Lesson: Metatablas y objetos
summary: Cómo una tabla más una metatabla se convierte en una clase, y qué significan los dos puntos.

Lua no tiene clases, pero tiene **metatablas**: una tabla asociada a otra tabla que cambia su comportamiento. El campo más útil es `__index`. Cuando lees una clave que una tabla no tiene, Lua la busca en `__index`.

Con eso basta para construir objetos. Pon los métodos en una tabla, ponla como `__index` y cada instancia recurrirá a ella:

```lua
local Dog = {}
Dog.__index = Dog
function Dog.new(name) return setmetatable({name = name}, Dog) end
function Dog:speak() return self.name .. " says woof" end
```

El detalle clave son los **dos puntos** (colon). `function Dog:speak()` es la forma abreviada de `function Dog.speak(self)`, y `rex:speak()` es la forma abreviada de `rex.speak(rex)`. Confundir `.` y `:` es el error de Lua más común que existe.

`error(message)` lanza un error, y `pcall(f, ...)` llama a una función en modo protegido, devolviendo `false` más el mensaje de error en lugar de bloquearse. El mensaje lleva delante el nombre del archivo y el número de línea.

# Quiz

## Q: ¿Qué imprime esto?
- =
- =
- =
- Un error
explain: Los arrays de Lua empiezan en el índice 1. En el índice 0 simplemente no hay nada, y leer una clave inexistente da `nil` en lugar de un error.

## Q: ¿Qué imprime esto?
- =
- =
- =
- Un error
explain: En Lua solo `nil` y `false` son falsos. El cero y la cadena vacía son verdaderos, a diferencia de C, JavaScript o Python.

## Q: ¿Qué imprime esto?
- =
- =
- =
- Un error
explain: En Lua 5.3 y posteriores, `/` siempre hace división en coma flotante, así que el resultado es el float `5.0`. Usa `//` para la división redondeada hacia abajo, que aquí da el entero `5`.

## Q: ¿Qué operador une dos cadenas?
- =
- =
- =
- =
explain: Lua usa `..` para concatenar. `+` es estrictamente aritmético: `"10" + 1` convierte la cadena y da `11`, mientras que `"a" + 1` es un error.

## Q: ¿Qué imprime esto?
- =
- =
- =
- Un error
explain: El operador de longitud `#` tiene más precedencia que `..`, así que esto es `(#"hello") .. "!"`, es decir, `5 .. "!"`. El número se convierte en texto durante la concatenación.

## Q: ¿Cómo se escribe "distinto de" en Lua?
- =
- =
- =
- =
explain: Lua usa `~=`. Escribir `!=` es un error de sintaxis, y uno muy habitual entre quienes vienen de otros lenguajes.

## Q: ¿Qué imprime esto?
- =
- =
- Un error
- =
explain: `limit` se asignó sin `local`, así que se convirtió en una variable global que sobrevive a la función. Por eso mismo deberías escribir `local` por costumbre.

# Challenge: Suma desde el índice correcto

`sum(nums)` debería sumar los números de una tabla usada como array. En cambio, falla. Arréglalo.

## Hints
- Lee el mensaje de error: dice que algo es `nil`. ¿Qué índice sería `nil`?
- Los arrays de Lua empiezan en 1, así que `nums[0]` es `nil`.
- Empieza el bucle en 1: `for i = 1, #nums do`. (O usa `for _, n in ipairs(nums) do`).

# Challenge: Comprueba palíndromos

Completa `isPalindrome(word)` para que devuelva `true` cuando la palabra se lee igual al revés, sin distinguir mayúsculas de minúsculas.

## Hints
- Las cadenas tienen métodos que se llaman con dos puntos, como `word:lower()`.
- Existe un `string.reverse` incorporado, que se puede llamar como `word:reverse()`.
- Pásala primero a minúsculas y luego compara la cadena con su inversa.

# Challenge: Escribe map

Escribe `map(t, fn)`, que devuelve una tabla **nueva** con `fn(item)` para cada elemento del array `t`. La tabla original no debe cambiar.

## Hints
- Crea una tabla vacía, `local result = {}`, y devuélvela al final.
- Recorre con `for i, v in ipairs(t) do` y guarda `fn(v)` en `result[i]`.
- Escribir en `result` en lugar de en `t` deja intacto el original.

# Challenge: ¿Punto o dos puntos?

El objeto `Counter` debería contar hasta 2, pero falla. Arregla el error con el cambio más pequeño posible.

## Hints
- El error menciona `self`. ¿Qué valor tiene `self` dentro de `increment`?
- `function Counter:increment()` espera el objeto como primer argumento oculto.
- `c:increment()` pasa `c` como `self` automáticamente; `c.increment()` no pasa nada.
