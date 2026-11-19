tagline: Pequeno, rápido e embutido em mais jogos e ferramentas do que você imagina. Os arrays começam em 1; aceite.
runtime: Lua 5.3 · Fengari, roda no seu navegador

# Lesson: Variáveis e tipos
summary: local, nil, números, strings e o operador ..

Em Lua, as variáveis são **globais por padrão**, o que raramente é o que você quer. Coloque `local` na frente de toda variável nova, a não ser que tenha um motivo para não fazer isso. Variáveis locais são mais rápidas e não vazam para um código que não esperava por elas.

```lua
local score = 10      -- local to this file or block
count = 3             -- global: visible everywhere (avoid)
```

Lua tem um conjunto pequeno de tipos: `nil`, `boolean`, `number`, `string`, `table` e `function` (além de `userdata` e `thread`, que você pode ignorar por enquanto). Uma variável que nunca recebeu valor é simplesmente `nil`.

Desde o Lua 5.3, os números têm dois subtipos: **integer** (inteiro) e **float** (ponto flutuante). `/` sempre produz um float, enquanto `//` é a divisão arredondada para baixo.

Strings são unidas com `..` (dois pontos), não com `+`, e `#` dá o tamanho de uma string. Números são convertidos em texto automaticamente quando você os concatena.

> `print` com vários argumentos os separa com tabulações. Os exemplos aqui costumam montar uma única string com `..` para a saída ficar organizada.

# Lesson: Condições
summary: if/then/end, ~= e a lista bem curta de valores falsos.

As condições usam `if ... then`, um `elseif` opcional (uma palavra só) e `else`, e terminam com `end`.

```lua
if score >= 90 then
  grade = "A"
elseif score >= 80 then
  grade = "B"
else
  grade = "C"
end
```

"Diferente de" se escreve `~=`. Os operadores lógicos são as palavras `and`, `or` e `not`.

Esta é a parte que surpreende quem vem de outras linguagens: **só `nil` e `false` são falsos**. Zero é verdadeiro. A string vazia é verdadeira. Uma tabela vazia é verdadeira.

`and` e `or` retornam um dos operandos em vez de um booleano estrito, o que dá duas expressões idiomáticas úteis:

- `x or default` usa `default` quando `x` é `nil` (ou `false`)
- `cond and a or b` funciona como um operador ternário, desde que `a` não seja `false` nem `nil`

# Lesson: Laços
summary: for numérico, while, repeat...until e o continue que não existe.

O `for` numérico conta de um valor inicial até um valor final, e o final **está incluído**. Um terceiro número opcional define o passo, que pode ser negativo.

```lua
for i = 1, 5 do ... end        -- 1, 2, 3, 4, 5
for i = 10, 0, -5 do ... end   -- 10, 5, 0
```

`while cond do ... end` verifica antes de cada volta. `repeat ... until cond` verifica **depois** de cada volta, então o corpo sempre roda pelo menos uma vez.

`break` sai de um laço. Lua não tem `continue`; os substitutos habituais são envolver o corpo num `if` ou usar um `goto continue` com um rótulo `::continue::` no fim do corpo.

Também existe o `for` genérico, que percorre tabelas com `ipairs` e `pairs`. Você vai vê-lo na lição de Tabelas.

# Lesson: Funções
summary: Vários valores de retorno, argumentos variáveis e closures.

Declare funções com `local function name(params) ... end`. Argumentos que faltam chegam como `nil`, e por isso `param = param or default` é o jeito padrão de definir valores padrão.

Funções em Lua podem **retornar vários valores** de uma vez, e quem chama pode recebê-los em várias variáveis:

```lua
local function divmod(a, b)
  return a // b, a % b
end
local q, r = divmod(17, 5)   -- q = 3, r = 2
```

`...` junta qualquer número de argumentos. Envolva-o numa tabela, `{...}`, para percorrê-los.

Funções são valores comuns. Você pode guardá-las em variáveis, passá-las adiante e retorná-las de outras funções. Uma função interna continua com acesso às variáveis locais da função que a criou; isso se chama **closure**.

# Lesson: Tabelas
summary: A única estrutura de dados de Lua, usada como array, dicionário e objeto.

Lua tem exatamente uma estrutura de dados, a **tabela**, e ela faz tudo.

Usada como **array**, uma tabela é indexada a partir de **1**, não de 0. `#t` dá o tamanho, e `table.insert(t, value)` adiciona no fim.

```lua
local colors = {"red", "green", "blue"}
print(colors[1])   -- red
print(colors[0])   -- nil: there is nothing at index 0
```

Usada como **dicionário**, as chaves podem ser strings (ou quase qualquer valor). `t.name` é a forma curta de `t["name"]`. Ler uma chave que não existe dá `nil` em vez de um erro.

Percorra arrays com `ipairs` (em ordem, de 1 a n) e dicionários com `pairs`. A ordem de `pairs` **não** é garantida, então nunca dependa dela.

`table.concat(t, sep)` une um array de strings; é o jeito mais rápido de imprimir um.

# Lesson: Metatabelas e objetos
summary: Como uma tabela mais uma metatabela vira uma classe e o que os dois-pontos significam.

Lua não tem classes, mas tem **metatabelas**: uma tabela ligada a outra tabela que muda o comportamento dela. O campo mais útil é `__index`. Quando você lê uma chave que a tabela não tem, Lua procura em `__index`.

Isso basta para construir objetos. Coloque os métodos numa tabela, defina-a como `__index`, e toda instância recorre a ela:

```lua
local Dog = {}
Dog.__index = Dog
function Dog.new(name) return setmetatable({name = name}, Dog) end
function Dog:speak() return self.name .. " says woof" end
```

O detalhe-chave são os **dois-pontos** (colon). `function Dog:speak()` é a forma curta de `function Dog.speak(self)`, e `rex:speak()` é a forma curta de `rex.speak(rex)`. Confundir `.` com `:` é o bug mais comum de Lua que existe.

`error(message)` lança um erro, e `pcall(f, ...)` chama uma função em modo protegido, retornando `false` mais a mensagem de erro em vez de travar. A mensagem vem com o nome do arquivo e o número da linha na frente.

# Quiz

## Q: O que isto imprime?
- =
- =
- =
- Um erro
explain: Os arrays de Lua começam no índice 1. No índice 0 simplesmente não há nada, e ler uma chave que não existe dá `nil` em vez de um erro.

## Q: O que isto imprime?
- =
- =
- =
- Um erro
explain: Em Lua, só `nil` e `false` são falsos. Zero e a string vazia são verdadeiros, ao contrário de C, JavaScript ou Python.

## Q: O que isto imprime?
- =
- =
- =
- Um erro
explain: `/` sempre faz divisão de ponto flutuante no Lua 5.3 em diante, então o resultado é o float `5.0`. Use `//` para a divisão arredondada para baixo, que aqui dá o inteiro `5`.

## Q: Qual operador une duas strings?
- =
- =
- =
- =
explain: Lua usa `..` para concatenar. `+` é estritamente aritmético: `"10" + 1` converte a string e dá `11`, enquanto `"a" + 1` é um erro.

## Q: O que isto imprime?
- =
- =
- =
- Um erro
explain: O operador de tamanho `#` tem precedência maior que `..`, então isto é `(#"hello") .. "!"`, ou seja, `5 .. "!"`. O número é convertido em texto durante a concatenação.

## Q: Como se escreve "diferente de" em Lua?
- =
- =
- =
- =
explain: Lua usa `~=`. Escrever `!=` é erro de sintaxe, e um erro muito comum de quem vem de outras linguagens.

## Q: O que isto imprime?
- =
- =
- Um erro
- =
explain: `limit` foi atribuída sem `local`, então virou uma variável global que sobrevive à função. É exatamente por isso que você deve escrever `local` por hábito.

# Challenge: Some a partir do índice certo

`sum(nums)` deveria somar os números de uma tabela usada como array. Em vez disso, ela trava. Corrija.

## Hints
- Leia a mensagem de erro: ela diz que algo é `nil`. Qual índice seria `nil`?
- Os arrays de Lua começam em 1, então `nums[0]` é `nil`.
- Comece o laço em 1: `for i = 1, #nums do`. (Ou use `for _, n in ipairs(nums) do`.)

# Challenge: Verifique palíndromos

Complete `isPalindrome(word)` para que ela retorne `true` quando a palavra for lida do mesmo jeito de trás para a frente, sem diferenciar maiúsculas de minúsculas.

## Hints
- Strings têm métodos que você chama com dois-pontos, como `word:lower()`.
- Existe um `string.reverse` embutido, que pode ser chamado como `word:reverse()`.
- Passe para minúsculas primeiro e depois compare a string com o inverso dela.

# Challenge: Escreva map

Escreva `map(t, fn)`, que retorna uma tabela **nova** contendo `fn(item)` para cada item do array `t`. A tabela original não pode mudar.

## Hints
- Crie uma tabela vazia, `local result = {}`, e retorne-a no fim.
- Percorra com `for i, v in ipairs(t) do` e guarde `fn(v)` em `result[i]`.
- Escrever em `result` em vez de em `t` mantém o original intacto.

# Challenge: Ponto ou dois-pontos?

O objeto `Counter` deveria contar até 2, mas trava. Corrija o bug com a menor alteração possível.

## Hints
- O erro menciona `self`. Qual é o valor de `self` dentro de `increment`?
- `function Counter:increment()` espera o objeto como um primeiro argumento escondido.
- `c:increment()` passa `c` como `self` automaticamente; `c.increment()` não passa nada.
