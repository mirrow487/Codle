tagline: Com tipagem estática, organizado e a espinha dorsal dos apps .NET e dos jogos Unity.
runtime: C# · compilado num compilador .NET/Mono remoto

# Lesson: Variáveis e tipos
summary: Tipos estáticos, var e por que 7 / 2 dá 3.

C# tem **tipagem estática**: toda variável tem um tipo definido em tempo de compilação, e o compilador se recusa a colocar uma string onde deveria haver um `int`. Isso pega uma categoria inteira de bugs antes mesmo de o programa rodar.

```csharp
int count = 3;
count = "three";   // compile error: cannot convert string to int
```

Os tipos que você vai usar todo dia: `int` (números inteiros), `double` (decimais), `decimal` (decimais exatos, a escolha certa para dinheiro), `bool`, `char` (um caractere, entre aspas simples) e `string` (texto, entre aspas duplas).

`var` deixa o compilador deduzir o tipo a partir do valor. Continua sendo tipagem estática: `var city = "London";` faz de `city` uma `string` para sempre.

Quando os dois lados de `/` são inteiros, C# faz **divisão inteira** e descarta o resto. Faça um dos lados ser `double` para ter um resultado com casas decimais.

Strings com o prefixo `$` são **interpoladas**: dentro delas, `{expression}` é substituído pelo seu valor.

> Todo programa C# aqui vive dentro de uma classe com um método `static void Main()`. É ali que a execução começa.

# Lesson: Condições e switch
summary: if/else, comandos switch e o operador ternário.

`if`, `else if` e `else` recebem uma condição entre parênteses. A condição precisa ser um `bool` de verdade; C# não trata `0` ou `null` como falso por você, o que evita um erro clássico de C.

```csharp
if (count = 0) { }   // compile error, not a silent bug
```

Um comando `switch` compara um valor com vários casos. Toda seção de caso precisa terminar com `break` (ou `return`), e você pode empilhar rótulos para compartilhar um corpo:

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

O C# moderno (versão 9 em diante) também tem **expressões switch** compactas, que produzem um valor:

```csharp
string kind = day switch
{
    "Sat" or "Sun" => "Weekend",
    _ => "Weekday"
};
```

Para escolhas simples entre duas opções, o ternário `condition ? a : b` deixa tudo numa linha.

# Lesson: Laços
summary: for, foreach, while e do-while.

O laço `for` reúne início, condição e atualização numa linha. `foreach` percorre cada item de um array ou coleção, e é o que você deve escolher quando não precisa do índice.

`while` verifica a condição antes de cada volta. `do ... while` verifica depois, então o corpo sempre roda pelo menos uma vez.

`break` sai do laço; `continue` pula para a próxima iteração.

> Você não pode adicionar nem remover itens de uma `List` enquanto um `foreach` a percorre. C# lança uma `InvalidOperationException` em vez de deixar você se enrolar.

# Lesson: Métodos
summary: Tipos de retorno, parâmetros opcionais, sobrecarga e parâmetros out.

Um método declara o tipo de retorno antes do nome, ou `void` se não retorna nada. Métodos chamados diretamente de `Main` são marcados como `static`, porque não há objeto para chamá-los.

```csharp
static int Add(int a, int b)
{
    return a + b;
}
```

Para métodos de uma linha existe o **corpo de expressão**: `static int Square(int x) => x * x;`

Os parâmetros podem ser **opcionais** se você der a eles um valor padrão. Você também pode **sobrecarregar** um método: escrever várias versões com o mesmo nome, mas com tipos de parâmetro diferentes, e o compilador escolhe a certa em cada chamada.

Um parâmetro `out` permite que um método devolva um valor extra. Os métodos `TryParse` do framework usam esse padrão: retornam `true` ou `false` conforme o sucesso e colocam o valor convertido na variável `out`.

# Lesson: Coleções e LINQ
summary: List<T>, Dictionary<K, V> e consultas em dados com LINQ.

Arrays têm tamanho fixo. Uma `List<T>` cresce conforme você adiciona itens, onde `T` é o tipo de item que ela guarda. `Count` diz quantos itens ela tem.

Um `Dictionary<TKey, TValue>` associa chaves a valores. Ler uma chave que não existe com `dict[key]` lança `KeyNotFoundException`, então use `TryGetValue` quando a chave puder não estar lá.

**LINQ** (de `using System.Linq;`) adiciona métodos de consulta a toda coleção: `Where` filtra, `Select` transforma, e `Sum`, `Max`, `Count` e companhia resumem.

> `Console.WriteLine(myList)` imprime o nome do tipo da lista em vez do conteúdo, o que é exato e completamente inútil. Use `string.Join(", ", myList)` para ver o conteúdo.

# Lesson: Classes
summary: Propriedades, construtores, métodos e exceções.

Uma **classe** agrupa dados e comportamento. Os dados geralmente são expostos por **propriedades**, que por fora parecem campos, mas podem controlar o acesso:

```csharp
public string Owner { get; }               // read-only after construction
public decimal Balance { get; private set; } // readable everywhere, settable only inside
```

O **construtor** tem o mesmo nome da classe e não tem tipo de retorno. Ele roda quando você escreve `new BankAccount("Ada")`.

Sobrescrever `ToString()` controla como um objeto aparece quando é impresso ou colocado numa string interpolada.

Quando um método recebe uma entrada que não pode aceitar, ele **lança** uma exceção. Quem chama pode capturá-la com `try` / `catch`.

# Quiz

## Q: O que isto imprime?
- =
- =
- =
- =
explain: Os dois operandos são `int`, então C# faz divisão inteira e descarta o resto (trunca em direção a zero). Escreva `7 / 2.0` ou converta um dos lados para `double` para obter `3.5`.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: `bool.ToString()` retorna `"True"` ou `"False"`, com maiúscula. As palavras-chave do C# são minúsculas; o texto impresso, não. Isso surpreende todo mundo exatamente uma vez.

## Q: Qual linha cria uma lista de strings vazia e que pode crescer?
- =
- =
- =
- =
explain: `List<T>` é genérica, então você precisa dizer o que ela guarda, e o construtor é chamado com `()`. Uma `List<string>` não é um `string[]`, e `new List<string>[]` tentaria criar um array de listas sem tamanho.

## Q: O que isto imprime?
- =
- =
- Um erro de compilação
- Uma exceção
explain: Para strings, C# sobrecarrega `==` para comparar os caracteres, não as referências. Duas strings com o mesmo conteúdo são iguais, não importa como foram montadas. (Java faz diferente, o que confunde quem alterna entre as duas.)

## Q: O que isto imprime?
- =
- =
- =
- =
explain: C# avalia os operandos estritamente da esquerda para a direita. `x++` produz 5 e depois coloca `x` em 6. `++x` coloca `x` em 7 e produz 7. Então `y` é 5 + 7 = 12. Válido, bem definido e, mesmo assim, nada que você deva escrever em código de verdade.

## Q: O que acontece quando isto roda?
- Imprime `0`
- Não imprime nada
- Lança uma `IndexOutOfRangeException`
- Não compila
explain: Um array de 3 elementos tem os índices 0, 1 e 2. C# verifica os limites do array em tempo de execução, então ler o índice 3 lança uma exceção. O compilador não pega isso porque o índice poderia vir de qualquer lugar.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: `4.0` é um `double`, então o `int` 10 é promovido e a divisão é feita em ponto flutuante.

# Challenge: Corrija a média

`Average` deveria retornar a média exata dos números, mas continua perdendo a parte decimal. Corrija.

## Hints
- O método retorna um `double`; então por que a resposta é inteira? Olhe os tipos na divisão.
- `int / int` é divisão inteira. O resultado é truncado antes de ser convertido para `double`.
- Converta antes de dividir: `(double)sum / numbers.Length`.

# Challenge: Conte as palavras

Implemente `CountWords` para que retorne o número de palavras em `text`. As palavras são separadas por um ou mais espaços, e espaços no começo ou no fim não devem contar como palavras.

## Hints
- `text.Split(' ')` divide nos espaços, mas espaços repetidos deixam strings vazias no resultado.
- `StringSplitOptions.RemoveEmptyEntries` descarta essas strings vazias.
- `text.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).Length` é a resposta inteira.

# Challenge: FizzBuzz, do jeito certo

Faça `FizzBuzz(n)` retornar `"Fizz"` para múltiplos de 3, `"Buzz"` para múltiplos de 5, `"FizzBuzz"` para múltiplos dos dois e o próprio número nos outros casos.

## Hints
- `n % 3 == 0` é verdadeiro quando `n` é múltiplo de 3.
- A ordem importa: verifique "múltiplo dos dois" primeiro, ou 15 vai retornar `"Fizz"` e parar ali.
- Um múltiplo de 3 e de 5 ao mesmo tempo é um múltiplo de 15.

# Challenge: Termine o Rectangle

Complete as propriedades `Area` e `IsSquare` de `Rectangle`.

## Hints
- `=>` numa propriedade define uma propriedade calculada e somente leitura. O que estiver à direita é recalculado toda vez que ela é lida.
- Dentro da classe você pode usar `Width` e `Height` diretamente.
- `Area => Width * Height;` e `IsSquare => Width == Height;`
