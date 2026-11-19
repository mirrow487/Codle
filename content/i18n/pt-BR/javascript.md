tagline: A linguagem da web. Excêntrica em alguns cantos, extremamente capaz em todos.
runtime: JavaScript · roda no seu navegador, com a saída do console no formato do Node.js

# Lesson: Variáveis e tipos
summary: let, const e os sete tipos primitivos que você vai realmente encontrar.

Declare variáveis com `const` quando a ligação não for reatribuída, e com `let` quando for. Prefira `const` primeiro: ela diz a quem lê "este nome sempre aponta para a mesma coisa". Você também vai ver `var` em código antigo. Ela tem regras de escopo mais frouxas, e o código moderno a evita.

```js
const siteName = "Codle";
let visits = 0;
visits = visits + 1;   // fine
siteName = "Other";    // TypeError: Assignment to constant variable.
```

Os tipos do dia a dia são `string`, `number` (um único tipo para inteiros e decimais), `boolean`, `undefined` (declarado, mas nunca recebeu valor), `null` (vazio de propósito), além de `bigint` e `symbol` para casos especiais. Todo o resto, incluindo arrays e funções, é um objeto.

**Template literals** usam crases e permitem embutir expressões com `${...}`.

> `typeof null` é `"object"`. É um bug de 1995 que nunca poderá ser corrigido sem quebrar a web. Verifique null com `value === null`.

# Lesson: Condições e igualdade
summary: if/else, por que === é o que você quer e o que conta como "falso".

`if`, `else if` e `else` funcionam como você espera, com a condição entre parênteses e o corpo entre chaves.

O JavaScript tem dois operadores de igualdade. `===` (estrito) compara o valor **e** o tipo. `==` (frouxo) converte os tipos primeiro, com regras que ninguém decora por vontade própria. Use `===` e `!==`, a não ser que tenha um motivo específico.

Os valores **falsos** (falsy) são `false`, `0`, `-0`, `0n`, `""`, `null`, `undefined` e `NaN`. Todo o resto é verdadeiro, incluindo `"0"`, `[]` e `{}`.

Dois operadores de valor padrão que parecem iguais, mas não são:

- `a || b` retorna `b` se `a` for **qualquer** valor falso
- `a ?? b` retorna `b` só se `a` for `null` ou `undefined`

Então, se `0` for um valor legítimo, `??` é o que não vai jogá-lo fora.

# Lesson: Laços
summary: O for clássico, for...of para valores e métodos de array que fazem o laço por você.

O laço `for` clássico tem três partes: um ponto de partida, uma condição verificada antes de cada volta e uma atualização executada depois de cada volta.

```js
for (let i = 0; i < 3; i++) { /* runs with i = 0, 1, 2 */ }
```

Quando você só quer cada valor de um array (ou de uma string, Map ou Set), `for...of` é mais limpo. Também existe `for...in`, que percorre as **chaves** de um objeto; evite-o com arrays, porque ele entrega os índices como strings.

Os arrays também têm `forEach`, que chama uma função para cada elemento e passa o índice como segundo argumento.

`while` repete enquanto a condição for verdadeira. `break` sai do laço antes; `continue` pula para a próxima iteração.

# Lesson: Funções
summary: Declarações, arrow functions, parâmetros padrão e closures.

Há duas formas comuns de escrever uma função:

```js
function add(a, b) {        // declaration: hoisted, has its own `this`
  return a + b;
}
const add2 = (a, b) => a + b;  // arrow: concise, inherits `this`
```

Uma arrow function com uma única expressão a retorna automaticamente. Coloque chaves e você volta a precisar de um `return` explícito. Esquecer disso é uma fonte clássica de `undefined` misteriosos.

Os parâmetros podem ter **valores padrão**: `function greet(name, greeting = "Hello")`.

As funções lembram das variáveis que estavam no escopo onde foram criadas. Isso é uma **closure**, e é assim que você tem estado privado sem uma classe: o contador abaixo mantém `count` vivo entre as chamadas, mas nada de fora consegue mexer nele.

Uma função sem `return` retorna `undefined`.

# Lesson: Arrays e objetos
summary: Listas ordenadas, conjuntos de chave/valor, desestruturação e o operador spread.

Um **array** é uma lista ordenada, indexada a partir de 0. `push` adiciona no fim, `length` diz quantos itens existem e `at(-1)` lê a partir do fim.

Um **objeto** associa chaves de texto a valores. Leia com notação de ponto (`user.name`) ou com colchetes (`user["name"]`), que você precisa quando a chave está numa variável.

A **desestruturação** tira valores para variáveis de uma vez só, e a sintaxe **spread** `...` copia propriedades para um objeto novo ou itens para um array novo.

> `const` impede você de reatribuir a variável, não de alterar o objeto para o qual ela aponta. `const scores = []; scores.push(1);` é perfeitamente válido.

# Lesson: Métodos de array
summary: map, filter, reduce, find e a armadilha do sort().

Esses métodos recebem uma função e fazem o laço por você. Eles se leem como uma descrição do que você quer, e não de como chegar lá.

- `map(fn)` retorna um array novo com `fn` aplicada a cada item
- `filter(fn)` mantém os itens para os quais `fn` retorna algo verdadeiro
- `reduce(fn, start)` reduz o array a um único valor
- `find(fn)` retorna o primeiro item que combina, ou `undefined`

Nenhum deles altera o array original. `sort` é diferente: ele ordena **no lugar** e, por padrão, compara os itens como strings. É assim que `[10, 9, 1]` acaba virando `[1, 10, 9]`. Passe um comparador para ordenar números corretamente.

# Quiz

## Q: O que isto imprime?
- =
- =
- =
- =
explain: Quando qualquer um dos lados de `+` é uma string, o JavaScript converte o outro lado em string e concatena. Os outros operadores aritméticos convertem para número, então `"5" - 3` é `2`.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: Objetos e arrays são comparados por referência, não pelo conteúdo. São dois arrays diferentes que por acaso têm os mesmos valores. Para comparar o conteúdo, percorra-os ou compare a saída de `JSON.stringify` para dados simples.

## Q: `nums` é uma `const`. O que acontece aqui?
- =
- =
- =
- =
explain: `const` impede reatribuir o nome `nums`. Ela não congela o array, então `push` funciona. A linha que lançaria erro seria `nums = []`.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: `var` tem escopo de função, então os três callbacks compartilham um único `i`. Quando os timers disparam, o laço já terminou e `i` vale 3. Troque `var` por `let` e cada volta ganha o seu próprio `i`, imprimindo 0, 1, 2.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: NaN ("Not a Number", não é um número) é um valor especial do tipo number, produzido por coisas como `0 / 0` ou `Number("abc")`. Verifique-o com `Number.isNaN(value)`, porque `NaN === NaN` é `false`.

## Q: Qual delas retorna o dobro do argumento?
- =
- =
- =
- =
explain: Uma arrow function com corpo de expressão retorna essa expressão. Com chaves, o corpo vira um bloco e precisa de um `return` explícito, então a segunda opção retorna `undefined`. As duas últimas são erros de sintaxe.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: `0.1 * 3` é `0.30000000000000004` em ponto flutuante binário. Compare floats com uma tolerância: `Math.abs(a - b) < Number.EPSILON`.

# Challenge: Soma sem NaN

`sumArray(arr)` deveria somar todos os números de um array. Agora ela retorna `NaN` toda vez. Descubra por quê e corrija.

## Hints
- O que é `arr[arr.length]`? Tente mostrar no console.
- Ler além do fim de um array dá `undefined`, e `number + undefined` é `NaN`.
- O laço deveria parar em `i < arr.length`. (Ou dispense o índice: `arr.reduce((sum, n) => sum + n, 0)`.)

# Challenge: Maiúscula em cada palavra

Escreva `capitalizeWords(str)` para que ela coloque em maiúscula a primeira letra de cada palavra separada por espaço e deixe o resto da palavra como está.

## Hints
- `str.split(" ")` dá um array de palavras, e `.join(" ")` junta tudo de novo.
- Para uma única palavra: `word.charAt(0).toUpperCase()` mais `word.slice(1)`.
- Junte tudo com `map` entre o split e o join.

# Challenge: Conte as palavras

`countWords(words)` recebe um array de strings. Retorne um objeto que associa cada palavra ao número de vezes que ela aparece.

## Hints
- Comece com um objeto vazio, `{}`, e percorra as palavras.
- Na primeira vez que você vê uma palavra, `counts[word]` é `undefined`. `counts[word] ?? 0` transforma isso em 0.
- Com `reduce`: `words.reduce((acc, w) => ({ ...acc, [w]: (acc[w] ?? 0) + 1 }), {})`.

# Challenge: O await que faltou

`delay(ms, value)` retorna uma Promise que é resolvida com `value` depois de `ms` milissegundos. `main` deveria imprimir `first and second`, mas imprime algo bem menos útil. Corrija `main`.

## Hints
- `delay(...)` retorna uma Promise imediatamente. Uma Promise convertida em string vira `[object Promise]`.
- Dentro de uma função `async`, `await` espera uma Promise terminar e entrega o valor dela.
- `const a = await delay(50, "first");` funciona. `await Promise.all([...])` roda os dois atrasos ao mesmo tempo, o que é mais rápido.
