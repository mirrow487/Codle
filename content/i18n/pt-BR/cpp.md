tagline: Perto do hardware e famoso pelo poder. Confia totalmente em você, o que é ao mesmo tempo a vantagem e o alerta.
runtime: C++17 · compilado num GCC remoto

# Lesson: Variáveis e tipos
summary: Tipos fundamentais, std::string, auto e como os bools são impressos.

C++ tem tipagem estática e é compilado para código de máquina. Toda variável tem um tipo decidido em tempo de compilação, e muitos erros são pegos antes de o programa rodar.

Os tipos fundamentais: `int` (números inteiros), `double` (decimais), `char` (um único caractere, entre aspas simples) e `bool`. O texto fica em `std::string`, do cabeçalho `<string>`.

`auto` pede ao compilador que deduza o tipo a partir do valor inicial. `auto x = 9.5;` faz de `x` um `double`.

A saída passa por `std::cout` e pelo operador `<<`. `"\n"` termina uma linha.

Duas coisas que pegam quem está começando:

- `int / int` é **divisão inteira**: `7 / 2` é `3`. Faça um dos lados ser `double` para ter `3.5`.
- Valores `bool` são impressos como `1` e `0`, a não ser que você envie `std::boolalpha` para o fluxo antes.

> Uma variável local declarada sem valor guarda o que estiver naquela memória. Lê-la é comportamento indefinido. Sempre inicialize: `int count = 0;`, não `int count;`.

# Lesson: Condições
summary: if/else, switch com inteiros e caracteres e o operador ternário.

`if`, `else if` e `else` funcionam como você espera. As comparações são `==`, `!=`, `<`, `<=`, `>`, `>=`, combinadas com `&&` (e), `||` (ou) e `!` (não).

Uma armadilha clássica do C++: `if (x = 5)` compila. Ele **atribui** 5 a `x` e depois testa o resultado, que é sempre verdadeiro. Os compiladores avisam sobre isso, então leia os seus avisos.

`switch` funciona com inteiros, caracteres e enums, mas **não** com `std::string`. Cada caso continua no próximo a não ser que você use `break`, o que às vezes é útil e muitas vezes é bug.

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

O ternário `condition ? a : b` escolhe um entre dois valores.

# Lesson: Laços
summary: for, for baseado em intervalo, while e do-while.

O laço `for` clássico tem um inicializador, uma condição e um incremento. `++i` e `i++` se comportam igual no cabeçalho de um laço.

O **for baseado em intervalo** (range-based for) visita cada elemento de um contêiner. Escreva `const auto&` para olhar cada elemento sem copiá-lo, ou `auto&` quando quiser alterar os elementos no lugar.

```cpp
for (const auto& word : words) { ... }  // read only, no copies
for (auto& n : numbers) { n *= 2; }      // modifies the vector
```

`while` verifica antes de cada volta; `do ... while` verifica depois, então roda pelo menos uma vez.

# Lesson: Funções e referências
summary: Passagem por valor, por referência, referências const e sobrecarga.

Por padrão, C++ passa os argumentos **por valor**: a função recebe a própria cópia, e as mudanças nela ficam dentro da função.

Adicione `&` ao tipo do parâmetro para passar **por referência**. Aí a função trabalha com a variável de verdade de quem chamou.

Para objetos grandes que você só quer ler, use uma **referência const**: `const std::string& name`. Ela evita a cópia e promete não alterar o argumento. É o jeito padrão de receber strings e contêineres.

Argumentos padrão ficam no fim da lista de parâmetros, e a **sobrecarga** permite que várias funções compartilhem um nome, desde que os tipos de parâmetro sejam diferentes.

# Lesson: Vetores e maps
summary: std::vector para sequências, std::map para pares chave/valor ordenados.

`std::vector<T>` é o contêiner padrão: um array redimensionável. `push_back` adiciona no fim, `size()` conta, e `front()` / `back()` leem as pontas.

`v[i]` não verifica limites; ler além do fim é comportamento indefinido. `v.at(i)` verifica e lança `std::out_of_range`.

`std::map<K, V>` guarda pares chave/valor **ordenados pela chave**. Desde o C++17 você pode desempacotar cada par num laço com structured bindings: `for (const auto& [key, value] : m)`.

> `m["missing"]` não falha. Ele **insere** a chave com um valor padrão (0 para um `int`). Use `m.count(key)` ou `m.find(key)` quando só quiser verificar.

# Lesson: Classes
summary: Dados privados, construtores com lista de inicialização e funções-membro const.

Uma `class` junta dados com as funções que operam sobre eles. Os membros são **privados** por padrão, então o código de fora não pode mexer neles diretamente; a seção `public:` é a interface. (`struct` é idêntica, exceto que os membros são públicos por padrão.)

O **construtor** inicializa o objeto. A **lista de inicialização de membros**, depois dos dois-pontos, define os membros diretamente em vez de atribuí-los depois:

```cpp
BankAccount(const std::string& owner) : owner_(owner), balance_(0) {}
```

Uma função-membro marcada como `const` promete não alterar o objeto, e é o único tipo de função que você pode chamar num objeto `const`. Marque os getters como `const` por hábito.

O sublinhado no fim do nome dos membros é uma convenção comum, não uma regra. Ele só deixa os membros fáceis de identificar.

# Quiz

## Q: O que isto imprime?
- =
- =
- =
- =
explain: Os dois operandos são `int`, então é divisão inteira, que trunca em direção a zero. `7 / 2.0` daria `3.5`.

## Q: O que isto imprime?
- =
- =
- =
- Nada
explain: Os fluxos imprimem `bool` como `1` ou `0` por padrão. Insira `std::boolalpha` antes (`std::cout << std::boolalpha << ok;`) para obter `true`.

## Q: Qual assinatura lê um vetor grande sem copiá-lo e sem poder alterá-lo?
- =
- =
- =
- =
explain: Uma referência const evita a cópia e proíbe alterações. A passagem por valor copia o vetor inteiro. Uma referência simples permite alterações. `std::vector<int>* const` é um ponteiro constante para um vetor não constante, então a função ainda poderia alterar os elementos.

## Q: O que isto imprime?
- =
- =
- =
- Ele trava
explain: O vetor começa com três elementos, então `size()` é 3. Depois de `push_back(4)` são quatro, e o índice 3 (o quarto elemento) é 4.

## Q: O que há de errado com este código?
- Nada
- O primeiro `int` vazou: nada aponta mais para ele, então ele nunca poderá ser liberado
- Não compila: `p` já aponta para algo
- O segundo `new` sobrescreve o primeiro valor, então `*p` continua sendo 5
explain: Todo `new` precisa de um `delete` correspondente. Reatribuir `p` perde o único ponteiro para a primeira alocação, então essa memória continua reservada até o programa terminar. O C++ moderno evita isso com `std::make_unique` ou com valores simples.

## Q: O que isto imprime?
- =
- =
- =
- Não compila
explain: `s[0]` é o `char` `'a'`, e um `char` é só um inteiro pequeno: 97 em ASCII. `s.length()` é 3, então a soma é o número 100.

## Q: O que isto imprime? (compilado como C++17)
- =
- =
- =
- Não compila
explain: `operator[]` insere um valor padrão (0) quando a chave não existe, então o map agora tem uma entrada. Desde o C++17, os operandos de `<<` são avaliados da esquerda para a direita, então a inserção acontece antes de `size()` ser chamado.

# Challenge: Faça a mudança ficar

`doubleAll` deveria dobrar cada número do vetor que recebe. O laço parece certo, mas os números não mudam. Corrija.

## Hints
- O laço dobra mesmo os valores. Mas de qual vetor?
- Sem `&` no parâmetro, `doubleAll` recebe uma cópia de `nums`.
- Receba o vetor por referência: `std::vector<int>& values`.

# Challenge: Conte um caractere

Implemente `countChar(s, c)` para que retorne quantas vezes o caractere `c` aparece na string `s`.

## Hints
- O for baseado em intervalo também funciona com strings: `for (char ch : s)`.
- Compare cada caractere com `c` e aumente um contador quando forem iguais.
- A biblioteca padrão tem uma solução de uma linha: `std::count(s.begin(), s.end(), c)` de `<algorithm>`.

# Challenge: Fique só com os pares

Faça `evens(values)` retornar um vetor **novo** que contenha só os números pares, na ordem original.

## Hints
- Comece com um `std::vector<int> result;` vazio e retorne-o no fim.
- `v % 2 == 0` é verdadeiro para números pares, incluindo 0 e os pares negativos.
- `result.push_back(v)` adiciona um número no fim.

# Challenge: O maior número

`largest` deveria retornar o maior número de um vetor não vazio. Funciona para algumas entradas e falha em silêncio para outras. Corrija.

## Hints
- Qual teste falha? O que todos os números dele têm em comum?
- Se todos os números forem negativos, nenhum é maior que o valor inicial 0.
- Comece com um elemento de verdade: `int best = v[0];` (o vetor nunca está vazio aqui). `std::max_element` de `<algorithm>` também funciona.
