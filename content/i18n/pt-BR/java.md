tagline: Verboso de propósito, portátil por natureza e ainda rodando uma parte impressionante dos back-ends do mundo.
runtime: Java 21 · compilado num JDK remoto

# Lesson: Variáveis e tipos
summary: Primitivos, String, var, final e como o + se comporta com texto.

Java tem tipagem estática: você declara o que cada variável guarda, e o compilador cobra isso de você.

Os tipos **primitivos** guardam valores simples: `int`, `long`, `double`, `boolean`, `char` e alguns menores. `String` (com S maiúsculo) é uma classe, não um primitivo, mas é usada tanto que o Java dá a ela uma sintaxe literal: `"like this"`.

Desde o Java 10, `var` deduz o tipo de uma variável local a partir do valor: `var city = "London";` é uma `String`. `final` impede que uma variável mude depois da primeira atribuição, e constantes são escritas por convenção em `UPPER_SNAKE_CASE`.

`int / int` é divisão inteira, então `7 / 2` é `3`.

O operador `+` trabalha da esquerda para a direita e, assim que encontra uma `String`, tudo o que vem depois vira concatenação. Por isso `"1" + 2 + 3` é `"123"`, enquanto `1 + 2 + "3"` é `"33"`.

> Todo programa Java precisa de uma classe com um método `public static void main(String[] args)`. Esse código repetitivo é o preço do ingresso; depois de uma semana você nem percebe mais.

# Lesson: Condições
summary: if/else, expressões switch e a armadilha do == contra equals().

`if`, `else if` e `else` recebem uma condição `boolean` entre parênteses. O Java não trata números como verdadeiro ou falso.

Desde o Java 14, as **expressões switch** usam setas, não precisam de `break` e produzem um valor:

```java
String kind = switch (day) {
    case "Sat", "Sun" -> "Weekend";
    default -> "Weekday";
};
```

O comando `switch` clássico, com `case X:` e `break`, continua existindo, e você vai encontrá-lo em código antigo.

Agora, o importante. Para objetos, incluindo `String`, `==` pergunta "são **o mesmo objeto**?", e não "guardam o mesmo texto?". Use `.equals()` para comparar conteúdos. Duas strings podem parecer idênticas e mesmo assim não passar no `==`.

# Lesson: Laços
summary: for, o for aprimorado, while e do-while.

O laço `for` clássico tem um inicializador, uma condição e uma atualização. O **for aprimorado** (muitas vezes chamado de for-each) percorre cada item de um array ou coleção:

```java
for (String fruit : fruits) { ... }
```

`while` verifica a condição antes de cada volta; `do ... while` verifica depois, então o corpo roda pelo menos uma vez.

`break` sai do laço e `continue` pula para a próxima volta. Em laços aninhados, o Java permite rotular o laço de fora e escrever `break outer;`.

# Lesson: Métodos
summary: Métodos estáticos, sobrecarga e o que "passagem por valor" realmente significa.

Métodos declaram um tipo de retorno (ou `void`), um nome e parâmetros com tipo. Métodos chamados diretamente de `main` são `static`.

O Java não tem valores padrão para parâmetros. O substituto idiomático é a **sobrecarga**: vários métodos com o mesmo nome e listas de parâmetros diferentes, em que o mais curto chama o mais longo.

O Java sempre **passa por valor**. Com primitivos, o método recebe uma cópia, então alterá-la não tem efeito do lado de fora. Com objetos, o valor copiado é a **referência**, então o método pode alterar o objeto que quem chamou passou, mas não pode fazer a variável de quem chamou apontar para outro objeto.

# Lesson: Coleções e streams
summary: ArrayList, implementações de Map e processamento de dados com streams.

`ArrayList<T>` é a lista redimensionável padrão. Coleções guardam objetos, então para números você escreve o tipo invólucro: `List<Integer>`, não `List<int>`. O Java converte entre `int` e `Integer` automaticamente (autoboxing).

Um `Map<K, V>` guarda pares chave/valor. Escolha a implementação pela ordem de que você precisa:

- `HashMap`: a mais rápida, ordem de iteração não especificada
- `LinkedHashMap`: lembra a ordem de inserção
- `TreeMap`: mantém as chaves ordenadas

`get` retorna `null` para uma chave que não existe; `getOrDefault(key, fallback)` costuma ser mais agradável.

Os **streams** permitem descrever uma sequência de processamento: `filter` mantém os itens que combinam, `map` os transforma, e uma operação terminal como `sum()` ou `collect(...)` produz o resultado.

# Lesson: Classes
summary: Campos, construtores, encapsulamento, toString e exceções.

Uma classe declara **campos** (dados) e **métodos** (comportamento). Deixe os campos `private` e exponha por métodos o que quem chama precisa. Isso é encapsulamento, e significa que você pode mudar o lado de dentro depois sem quebrar quem usa a classe.

O **construtor** tem o nome da classe e não tem tipo de retorno. `this.owner = owner;` diferencia o campo do parâmetro de mesmo nome.

Sobrescrever `toString()` controla o que `System.out.println(obj)` mostra. Sem isso, você recebe algo como `BankAccount@1b6d3586`.

Entradas inválidas são avisadas **lançando** uma exceção como `IllegalArgumentException`, que quem chama pode tratar com `try` / `catch`.

> Quando você roda um único arquivo Java diretamente, a primeira classe do arquivo precisa ser a que tem `main`; é por isso que `Main` vem primeiro abaixo.

# Quiz

## Q: O que isto imprime?
- =
- =
- =
- =
explain: Dois operandos `int` significam divisão inteira; a parte decimal é descartada. `7 / 2.0` dá `3.5`.

## Q: O que isto imprime?
- =
- =
- Um erro de compilação
- =
explain: `new String(...)` sempre cria um objeto novo, e `==` compara a identidade dos objetos. Os textos são iguais, mas os objetos são diferentes. Use `a.equals(b)` para comparar os conteúdos.

## Q: O que isto imprime?
- =
- =
- =
- Um erro de compilação
explain: `+` é avaliado da esquerda para a direita. `"1" + 2` é a string `"12"`, e `"12" + 3` é `"123"`. Escreva `"1" + (2 + 3)` se quiser `"15"`.

## Q: Qual linha declara uma lista de números inteiros que pode crescer?
- =
- =
- =
- =
explain: Generics só aceitam tipos de objeto, então se usa o invólucro `Integer` em vez do primitivo `int`. A terceira opção coloca o argumento de tipo no lugar errado, e um `ArrayList` não é um array.

## Q: O que isto imprime?
- =
- =
- Um erro de compilação: deveria ser `arr.length()`
- Um erro de compilação: deveria ser `arr.size()`
explain: Arrays têm um **campo** `length`. Strings têm um **método** `length()`, e coleções têm `size()`. Sim, os três. Sim, as pessoas confundem isso por anos.

## Q: O que isto imprime?
- =
- =
- =
- Um erro de compilação
explain: Fazer conta com um `char` o promove para `int`, e `'A'` é 65. Para obter `'B'`, converta de volta: `(char) (c + 1)`.

## Q: O que isto imprime com as configurações padrão da JVM?
- =
- =
- =
- =
explain: O autoboxing reaproveita objetos `Integer` em cache para os valores de -128 a 127, então `a` e `b` são o mesmo objeto. 128 está fora do cache, então `c` e `d` são objetos diferentes. A lição é a mesma das strings: compare objetos invólucro com `.equals()`.

# Challenge: Quem é o admin?

`isAdmin` deveria retornar `true` sempre que o papel for o texto `"admin"`. Funciona num teste e falha em outro. Corrija.

## Hints
- O primeiro teste só passa porque literais de string idênticos compartilham um mesmo objeto.
- `==` compara a identidade dos objetos. Você quer comparar os caracteres.
- Use `.equals()`. Escrever `"admin".equals(role)` ainda evita uma `NullPointerException` se `role` um dia for `null`.

# Challenge: Some os dígitos

Implemente `sumDigits(n)` para que retorne a soma dos dígitos decimais de um inteiro não negativo. Por exemplo, `sumDigits(123)` é 1 + 2 + 3 = 6.

## Hints
- `n % 10` dá o último dígito de `n`.
- `n / 10` (divisão inteira) remove o último dígito.
- Repita os dois passos num laço `while (n > 0)`, somando cada último dígito a um total.

# Challenge: Iniciais

Escreva `initials(fullName)`, que transforma um nome em iniciais maiúsculas seguidas de pontos. Os nomes podem ter qualquer número de palavras, separadas por espaços.

## Hints
- `fullName.split(" ")` dá um array de palavras. (`"\\s+"` também lida com espaços repetidos.)
- `word.charAt(0)` é a primeira letra, e `Character.toUpperCase` a deixa maiúscula.
- Junte as partes num `StringBuilder`, adicionando uma letra e depois um `'.'` para cada palavra.

# Challenge: Conserte o termômetro

`Temperature.toFahrenheit()` converte Celsius para Fahrenheit com F = C × 9 / 5 + 32. A temperatura do corpo, 37 °C, deveria dar 98.6 °F, mas a classe diz 98.0. Corrija o cálculo.

## Hints
- O método retorna um `double` e, mesmo assim, a resposta perdeu as casas decimais. Quando isso aconteceu?
- `celsius * 9 / 5` é calculado inteiramente com `int`: 333 / 5 é 66, não 66.6.
- Faça um dos operandos ser um `double`, por exemplo `9.0`, para a divisão manter a fração.
