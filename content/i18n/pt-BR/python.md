tagline: Legível, com tudo incluído e presente em todo lugar, da ciência de dados ao script que renomeia as fotos das suas férias.
runtime: Python 3.12 · Pyodide, roda no seu navegador

# Lesson: Variáveis e tipos
summary: Nomes, valores e o punhado de tipos que você vai usar todo dia.

Em Python, uma variável é um nome que aponta para um valor. Não existe `let`, nem `var`, nem declaração de tipo. Você atribui, e o nome passa a existir.

```python
city = "Lisbon"
population = 545_000   # underscores are just for readability
```

O Python descobre o tipo a partir do valor. Os que você vai ver o tempo todo:

- `int` para números inteiros, que podem ser tão grandes quanto a memória permitir
- `float` para decimais, com as esquisitices de sempre do ponto flutuante
- `str` para texto, entre aspas simples ou duplas
- `bool` para `True` e `False` (com maiúscula)
- `None` para "nada, de propósito"

`type()` diz o que você tem em mãos. Uma **f-string** (uma string com um `f` na frente) permite colocar qualquer expressão dentro do texto com `{}`.

A divisão merece uma nota rápida: `/` sempre retorna um float, `//` arredonda o resultado para baixo e `%` dá o resto.

> Nomes diferenciam maiúsculas de minúsculas e, por convenção, são escritos em `snake_case`. `Total` e `total` são duas variáveis diferentes, o que é um jeito garantido de perder uma tarde.

# Lesson: Condições
summary: if, elif, else e por que aqui a indentação não é questão de estilo.

O Python usa a indentação para agrupar o código. As linhas indentadas debaixo de um `if` pertencem a ele, e o bloco termina quando a indentação termina. A convenção é usar quatro espaços.

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C"
```

As comparações são `==`, `!=`, `<`, `<=`, `>`, `>=`. Você as combina com as palavras `and`, `or`, `not`. O Python também permite comparações encadeadas, então `18 <= age < 65` significa exatamente o que parece.

Todo valor é **verdadeiro** (truthy) ou **falso** (falsy). Os falsos são `False`, `None`, zero (`0`, `0.0`) e contêineres vazios (`""`, `[]`, `{}`). Todo o resto conta como verdadeiro, e é por isso que `if not items:` é o jeito idiomático de perguntar "esta lista está vazia?".

Para valores curtos do tipo "um ou outro", existe uma expressão condicional: `value_if_true if condition else value_if_false`.

# Lesson: Laços
summary: for percorre as coisas; while repete até mandarem parar.

Um laço `for` em Python percorre qualquer coisa iterável: listas, strings, dicionários, arquivos, intervalos. Não existe o `for (i = 0; ...)` do estilo C. Quando você precisar de números, use `range`.

`range(start, stop, step)` para **antes** de `stop`. Então `range(1, 4)` dá 1, 2, 3. Se você passar um único argumento, ele começa em 0.

Quando você precisa da posição e do item, `enumerate` entrega os dois, o que é bem melhor do que controlar um índice na mão.

Um laço `while` repete enquanto a condição for verdadeira. Garanta que algo lá dentro acabe tornando a condição falsa, ou você vai conhecer a mensagem "Execução interrompida".

`break` sai do laço na hora. `continue` pula para a próxima iteração.

> `print(..., end=" ")` troca a quebra de linha de sempre por um espaço, útil para imprimir tudo numa linha só.

# Lesson: Funções
summary: def, return, argumentos padrão e retornar mais de uma coisa.

Você define uma função com `def`, dá parâmetros a ela e devolve um valor com `return`. Uma função sem `return` também devolve algo: `None`.

Os parâmetros podem ter **valores padrão**, e quem chama pode passar os argumentos **pelo nome**, o que deixa as chamadas autoexplicativas:

```python
send_email("ada@example.com", subject="Hi", urgent=True)
```

Para retornar vários valores, retorne-os separados por vírgulas. O Python os empacota numa tupla, e quem chama pode desempacotá-los direto em variáveis.

> Imprimir e retornar são coisas diferentes. `print` mostra um valor para uma pessoa; `return` devolve esse valor para o código que chamou você. Confundir os dois é o erro de iniciante mais comum desta lição.

# Lesson: Listas e dicionários
summary: Os dois contêineres que fazem a maior parte do trabalho pesado.

Uma **lista** é uma sequência ordenada e mutável. Os índices começam em 0, e índices negativos contam a partir do fim, então `items[-1]` é o último item. Fatiar com `items[start:stop]` retorna uma lista nova, e `stop` fica de fora, igual ao `range`.

Uma **list comprehension** monta uma lista a partir de um laço, em uma única linha legível:

```python
squares = [n * n for n in range(5)]
evens = [n for n in range(10) if n % 2 == 0]
```

Um **dicionário** associa chaves a valores. Você lê com `d[key]`, que lança `KeyError` se a chave não existir, ou com `d.get(key, default)`, que não lança. Desde o Python 3.7, os dicionários lembram a ordem de inserção.

Percorra os pares de um dicionário com `.items()`.

# Lesson: Classes
summary: Juntar dados e as funções que trabalham com eles.

Uma **classe** é uma planta; um **objeto** é algo construído a partir dela. `__init__` roda quando você cria um objeto e prepara os atributos dele. Todo método recebe o próprio objeto como primeiro parâmetro, chamado `self` por convenção.

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
```

Métodos com dois sublinhados dos dois lados são ganchos que o Python chama por você. `__str__` decide o que `print(obj)` mostra, para você ver algo útil em vez de `<__main__.Point object at 0x...>`.

Quando um método recebe uma entrada com a qual não consegue trabalhar, ele lança uma exceção. Quem chama pode tratá-la com `try` / `except`.

# Quiz

## Q: O que isto imprime?
- =
- =
- =
- Um erro
explain: `y = x` não copia a lista; dá um segundo nome para a mesma lista. Alterá-la por meio de `y` também muda o que `x` vê. Use `y = x.copy()` (ou `list(x)`) quando quiser uma cópia independente.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: No Python 3, `/` é a divisão de verdade e sempre retorna um float, mesmo quando o resultado é inteiro. Use `//` se quiser `2`.

## Q: Qual linha verifica corretamente se a string `name` está vazia?
- =
- =
- =
- =
explain: Uma string vazia é falsa, então `not name` é `True` exatamente quando ela está vazia. `== None` deixa passar `""` (e, de qualquer forma, o jeito certo de testar `None` é `is None`). Strings não têm um método `.empty()`, e `=` é atribuição, o que dentro de um `if` é erro de sintaxe.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: `range(2, 10, 3)` começa em 2 e soma 3 a cada passo enquanto ficar abaixo de 10: 2, 5, 8. O valor final nunca é incluído, e 11 já passa dele de qualquer jeito.

## Q: Encontre o bug. O que isto imprime?
- =
- =
- =
- =
explain: Valores padrão são avaliados uma única vez, quando a função é definida, então todas as chamadas compartilham a mesma lista. A correção é usar `items=None` e depois `if items is None: items = []` dentro da função.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: Multiplicar uma string por um inteiro a repete. O Python não converte `"3"` em número por conta própria; você precisaria de `int("3") * 3` para obter 9.

## Q: O que isto imprime?
- =
- =
- =
- =
explain: `.get()` retorna `None` quando a chave não existe (ou o valor padrão que você passar como segundo argumento). A versão que lança `KeyError` é `settings["font"]`.

# Challenge: Corrija o erro por um

`total_to(n)` deveria retornar a soma de todos os números inteiros de 1 até `n`, inclusive. Então `total_to(5)` é 1 + 2 + 3 + 4 + 5 = 15. Está perto, mas não está certo. Corrija.

## Hints
- Imprima os valores de `i` dentro do laço. Quais números `range(n)` realmente produz?
- `range(n)` vai de 0 até `n - 1`. Você quer de 1 até `n`.
- `range(1, n + 1)` resolve. (Assim como `sum(range(1, n + 1))`, se você gosta de soluções de uma linha.)

# Challenge: Conte as vogais

Complete `count_vowels(text)` para que retorne quantas vogais (a, e, i, o, u) aparecem em `text`. Vogais maiúsculas também contam.

## Hints
- Passe o texto para minúsculas primeiro com `text.lower()`, assim você só precisa verificar um caso.
- `ch in "aeiou"` é `True` quando `ch` é uma vogal.
- Uma versão compacta: `return sum(1 for ch in text.lower() if ch in "aeiou")`.

# Challenge: De palavras para tamanhos

Faça `word_lengths(sentence)` retornar um dicionário que associa cada palavra ao seu tamanho. As palavras são separadas por espaços.

## Hints
- `sentence.split()` divide nos espaços em branco e retorna uma lista de palavras. Para uma string vazia, retorna `[]`.
- Crie um dicionário vazio, percorra as palavras e atribua `result[word] = len(word)`.
- Uma dict comprehension faz isso em uma linha: `{word: len(word) for word in ...}`.

# Challenge: Remova duplicatas, mantenha a ordem

`unique(items)` deveria retornar uma lista nova sem duplicatas, mantendo cada item onde ele apareceu **primeiro**. A versão atual remove as duplicatas, mas embaralha a ordem.

## Hints
- Conjuntos (set) não têm ordem, então converter para conjunto joga fora a ordem original.
- Percorra `items` na ordem e guarde num conjunto o que você já viu.
- Só adicione um item quando ele ainda não estiver em `seen`. (`list(dict.fromkeys(items))` é um atalho elegante, porque as chaves de um dicionário mantêm a ordem de inserção.)
