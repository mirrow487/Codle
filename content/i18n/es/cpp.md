tagline: Pegado al metal y famoso por su potencia. Confía en ti por completo, lo cual es a la vez la virtud y la advertencia.
runtime: C++17 · compilado en un GCC remoto

# Lesson: Variables y tipos
summary: Tipos fundamentales, std::string, auto y cómo se imprimen los bool.

C++ tiene tipado estático y se compila a código máquina. Cada variable tiene un tipo decidido en tiempo de compilación, y muchos errores se detectan antes de que el programa se ejecute.

Los tipos fundamentales: `int` (números enteros), `double` (decimales), `char` (un solo carácter, entre comillas simples) y `bool`. El texto vive en `std::string`, de la cabecera `<string>`.

`auto` le pide al compilador que deduzca el tipo a partir del valor inicial. `auto x = 9.5;` convierte `x` en un `double`.

La salida pasa por `std::cout` y el operador `<<`. `"\n"` termina una línea.

Dos cosas que pillan a los recién llegados:

- `int / int` es **división entera**: `7 / 2` es `3`. Haz que uno de los lados sea `double` para obtener `3.5`.
- Los valores `bool` se imprimen como `1` y `0` salvo que antes envíes `std::boolalpha` al flujo.

> Una variable local que declaras sin valor contiene lo que hubiera en esa memoria. Leerla es comportamiento indefinido. Inicializa siempre: `int count = 0;`, no `int count;`.

# Lesson: Condiciones
summary: if/else, switch sobre enteros y caracteres, y el operador ternario.

`if`, `else if` y `else` funcionan como esperas. Las comparaciones son `==`, `!=`, `<`, `<=`, `>`, `>=`, y se combinan con `&&` (y), `||` (o) y `!` (no).

Una trampa clásica de C++: `if (x = 5)` compila. **Asigna** 5 a `x` y luego comprueba el resultado, que siempre es verdadero. Los compiladores avisan de ello, así que lee tus avisos.

`switch` funciona con enteros, caracteres y enums, pero **no** con `std::string`. Cada caso continúa en el siguiente salvo que hagas `break`, lo cual a veces es útil y con frecuencia es un error.

```cpp
switch (grade) {
    case 'A':
        std::cout << "Excellent\n";
        break;
    case 'B':
    case 'C':                   // both 'B' and 'C' land here
        std::cout << "Good\n";
        break;
    default:
        std::cout << "Keep going\n";
}
```

El ternario `condition ? a : b` elige uno de dos valores.

# Lesson: Bucles
summary: for, for basado en rango, while y do-while.

El bucle `for` clásico tiene un inicializador, una condición y un incremento. `++i` e `i++` se comportan igual en la cabecera de un bucle.

El **for basado en rango** visita cada elemento de un contenedor. Escribe `const auto&` para mirar cada elemento sin copiarlo, o `auto&` cuando quieras modificar los elementos en su sitio.

```cpp
for (const auto& word : words) { ... }  // read only, no copies
for (auto& n : numbers) { n *= 2; }      // modifies the vector
```

`while` comprueba antes de cada vuelta; `do ... while` comprueba después, así que se ejecuta al menos una vez.

# Lesson: Funciones y referencias
summary: Paso por valor, paso por referencia, referencias const y sobrecarga.

Por defecto, C++ pasa los argumentos **por valor**: la función recibe su propia copia, y los cambios que haga se quedan dentro de la función.

Añade `&` al tipo del parámetro para pasar **por referencia**. Entonces la función trabaja sobre la variable real de quien llama.

Para objetos grandes que solo quieres leer, usa una **referencia const**: `const std::string& name`. Evita la copia y promete no modificar el argumento. Es la forma estándar de recibir cadenas y contenedores.

Los argumentos por defecto van al final de la lista de parámetros, y la **sobrecarga** permite que varias funciones compartan nombre siempre que sus tipos de parámetros sean distintos.

# Lesson: Vectores y maps
summary: std::vector para secuencias, std::map para pares clave/valor ordenados.

`std::vector<T>` es el contenedor por defecto: un array redimensionable. `push_back` añade al final, `size()` cuenta y `front()` / `back()` leen los extremos.

`v[i]` no comprueba los límites; leer más allá del final es comportamiento indefinido. `v.at(i)` sí comprueba y lanza `std::out_of_range`.

`std::map<K, V>` guarda pares clave/valor **ordenados por clave**. Desde C++17 puedes desempaquetar cada par en un bucle con enlaces estructurados (structured bindings): `for (const auto& [key, value] : m)`.

> `m["missing"]` no falla. **Inserta** la clave con un valor por defecto (0 para un `int`). Usa `m.count(key)` o `m.find(key)` cuando solo quieras comprobarla.

# Lesson: Clases
summary: Datos privados, constructores con lista de inicialización y funciones miembro const.

Una `class` agrupa datos con las funciones que operan sobre ellos. Los miembros son **privados** por defecto, así que el código de fuera no puede tocarlos directamente; la sección `public:` es la interfaz. (`struct` es idéntico salvo que los miembros son públicos por defecto).

El **constructor** inicializa el objeto. Su **lista de inicialización de miembros**, después de los dos puntos, fija los miembros directamente en lugar de asignarlos después:

```cpp
BankAccount(const std::string& owner) : owner_(owner), balance_(0) {}
```

Una función miembro marcada como `const` promete no modificar el objeto, y es la única clase de función que puedes llamar sobre un objeto `const`. Marca los getters como `const` por costumbre.

El guion bajo final en los nombres de los miembros es una convención común, no una regla. Simplemente hace que los miembros se reconozcan fácilmente.

# Quiz

## Q: ¿Qué imprime esto?
- =
- =
- =
- =
explain: Ambos operandos son `int`, así que es división entera, que trunca hacia cero. `7 / 2.0` daría `3.5`.

## Q: ¿Qué imprime esto?
- =
- =
- =
- Nada
explain: Los flujos imprimen `bool` como `1` o `0` por defecto. Inserta antes `std::boolalpha` (`std::cout << std::boolalpha << ok;`) para obtener `true`.

## Q: ¿Qué firma lee un vector grande sin copiarlo y sin poder modificarlo?
- =
- =
- =
- =
explain: Una referencia const evita la copia y prohíbe la modificación. El paso por valor copia el vector entero. Una referencia simple permite cambios. `std::vector<int>* const` es un puntero constante a un vector no constante, así que la función todavía podría modificar los elementos.

## Q: ¿Qué imprime esto?
- =
- =
- =
- Se bloquea
explain: El vector empieza con tres elementos, así que `size()` es 3. Después de `push_back(4)` hay cuatro, y el índice 3 (el cuarto elemento) es 4.

## Q: ¿Qué está mal en este código?
- Nada
- El primer `int` se pierde: ya nada apunta a él, así que nunca se podrá borrar
- No compila: `p` ya apunta a algo
- El segundo `new` sobrescribe el primer valor, así que `*p` sigue siendo 5
explain: Cada `new` necesita su `delete` correspondiente. Reasignar `p` pierde el único puntero a la primera reserva, así que esa memoria queda reservada hasta que termina el programa. El C++ moderno lo evita con `std::make_unique` o con valores simples.

## Q: ¿Qué imprime esto?
- =
- =
- =
- No compila
explain: `s[0]` es el `char` `'a'`, y un `char` no es más que un entero pequeño: 97 en ASCII. `s.length()` es 3, así que la suma es el número 100.

## Q: ¿Qué imprime esto? (compilado como C++17)
- =
- =
- =
- No compila
explain: `operator[]` inserta un valor por defecto (0) cuando falta la clave, así que el map ya tiene una entrada. Desde C++17, los operandos de `<<` se evalúan de izquierda a derecha, así que la inserción ocurre antes de que se llame a `size()`.

# Challenge: Que el cambio se quede

`doubleAll` debería duplicar cada número del vector que recibe. El bucle parece correcto, pero los números no cambian. Arréglalo.

## Hints
- El bucle sí duplica los valores. ¿Qué vector está duplicando?
- Sin `&` en el parámetro, `doubleAll` recibe una copia de `nums`.
- Recibe el vector por referencia: `std::vector<int>& values`.

# Challenge: Cuenta un carácter

Implementa `countChar(s, c)` para que devuelva cuántas veces aparece el carácter `c` en la cadena `s`.

## Hints
- El for basado en rango también funciona con cadenas: `for (char ch : s)`.
- Compara cada carácter con `c` y aumenta un contador cuando coincidan.
- La biblioteca estándar tiene una solución de una línea: `std::count(s.begin(), s.end(), c)` de `<algorithm>`.

# Challenge: Quédate solo con los pares

Haz que `evens(values)` devuelva un vector **nuevo** que contenga solo los números pares, en su orden original.

## Hints
- Empieza con un `std::vector<int> result;` vacío y devuélvelo al final.
- `v % 2 == 0` es verdadero para los números pares, incluidos 0 y los pares negativos.
- `result.push_back(v)` añade un número al final.

# Challenge: El número más grande

`largest` debería devolver el número más grande de un vector no vacío. Funciona con algunas entradas y falla en silencio con otras. Arréglalo.

## Hints
- ¿Qué prueba falla? ¿Qué tienen en común todos sus números?
- Si todos los números son negativos, ninguno es mayor que el valor inicial 0.
- Empieza desde un elemento real: `int best = v[0];` (aquí el vector nunca está vacío). `std::max_element` de `<algorithm>` también funciona.
