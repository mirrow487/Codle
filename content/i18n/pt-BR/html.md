tagline: O HTML diz o que as coisas são. O CSS diz como elas aparecem. Juntos, são todas as páginas da web que você já viu.
runtime: HTML e CSS · prévia ao vivo em um quadro isolado

# Lesson: Estrutura do documento
summary: O esqueleto que toda página da web compartilha e para que serve cada osso.

O HTML descreve **o que as coisas são**: isto é um título, isto é um parágrafo, isto é uma lista. O navegador decide uma aparência padrão, e depois o CSS a muda.

O conteúdo vai dentro de **elementos**, escritos como uma tag de abertura, o conteúdo e uma tag de fechamento: `<p>Hello</p>`. Alguns elementos, como `<img>` e `<meta>`, são **vazios** (void) e não têm tag de fechamento.

Toda página tem a mesma estrutura:

- `<!DOCTYPE html>` diz ao navegador para usar o modo de padrões moderno
- `<html lang="en">` envolve tudo e declara o idioma (leitores de tela usam isso)
- `<head>` guarda informações **sobre** a página: título, conjunto de caracteres, estilos
- `<body>` guarda o que as pessoas realmente veem

Os títulos vão de `<h1>` (o mais importante) até `<h6>`. Use-os para a estrutura, não para o tamanho; o tamanho você muda com CSS.

> Edite o texto da prévia abaixo e clique em Executar. Nada do que você digitar aqui consegue quebrar alguma coisa, então seja tão ousado quanto quiser.

# Lesson: Texto, links e listas
summary: Tags de texto com significado, atributos e os dois tipos de lista.

Escolha as tags pelo significado. `<strong>` marca importância e `<em>` marca ênfase. As duas têm um estilo padrão (negrito, itálico), mas o que as tecnologias assistivas leem em voz alta é o significado.

Os elementos podem ter **atributos** dentro da tag de abertura, escritos como `name="value"`. Um link é um elemento `<a>` cujo atributo `href` diz para onde ele vai:

```html
<a href="https://developer.mozilla.org">MDN Web Docs</a>
```

Imagens precisam de um `src` e de um texto `alt` que descreva a imagem para quem não consegue vê-la.

As listas têm dois sabores: `<ul>` para listas sem ordem (marcadores) e `<ol>` para listas ordenadas (números). Nos dois casos, cada item é um `<li>`.

> Os links desta prévia estão desativados para você não sair da página sem querer. O console diz para onde eles teriam levado.

# Lesson: Seletores CSS e a cascata
summary: Como o CSS escolhe elementos e como resolve as discussões entre regras.

Uma regra CSS é um **seletor** mais **declarações**:

```css
p {
  color: #333;
  line-height: 1.6;
}
```

Os seletores que você mais vai usar:

- `p` seleciona todos os elementos `<p>`
- `.note` seleciona os elementos com `class="note"` (um elemento pode ter várias classes)
- `#intro` seleciona o único elemento com `id="intro"`
- `nav a` seleciona elementos `<a>` em qualquer lugar dentro de um `<nav>`
- `ul > li` seleciona elementos `<li>` que são filhos diretos de um `<ul>`

Quando duas regras discordam, quem decide é a **especificidade**: um id vence uma classe, e uma classe vence um seletor de elemento. Só quando a especificidade empata é que vence a regra que aparece depois. Essa é a "cascata" do Cascading Style Sheets.

# Lesson: O modelo de caixa
summary: Conteúdo, preenchimento, borda, margem e o ajuste que deixa os tamanhos fazendo sentido.

Todo elemento é uma caixa retangular feita de quatro camadas, de dentro para fora:

- **content** (conteúdo): o texto ou a imagem em si
- **padding** (preenchimento): o espaço dentro da borda, que recebe a cor de fundo
- **border** (borda): a linha ao redor do preenchimento
- **margin** (margem): o espaço transparente do lado de fora, que afasta as outras caixas

Por padrão (`box-sizing: content-box`), `width` define só o conteúdo. O preenchimento e a borda são somados por cima, então uma caixa com `width: 200px`, `20px` de preenchimento e borda de `5px` na verdade tem **250px** de largura.

Quase toda folha de estilo moderna troca isso com `box-sizing: border-box`, que faz `width` incluir o preenchimento e a borda. Aí `200px` significa 200px.

# Lesson: Flexbox
summary: Alinhar coisas em linha ou coluna sem os truques antigos.

Coloque `display: flex` num contêiner, e os filhos diretos dele viram **itens flex** dispostos em linha.

As duas propriedades que você vai usar o tempo todo:

- `justify-content` posiciona os itens ao longo do eixo principal (horizontal numa linha): `flex-start`, `center`, `space-between`, `space-around`, `space-evenly`
- `align-items` os posiciona no eixo transversal (vertical numa linha): `stretch` (o padrão), `flex-start`, `center`, `flex-end`

`gap` coloca espaço entre os itens sem conta de margem. `flex-direction: column` transforma a linha em coluna, o que troca o significado dos dois eixos. `flex: 1` num item diz para ele crescer e ocupar o espaço que sobra.

> Centralizar perfeitamente uma coisa dentro de outra já foi meme. Hoje são três linhas: `display: flex; justify-content: center; align-items: center;`

# Lesson: CSS Grid
summary: Layouts bidimensionais com linhas, colunas e a unidade fr.

O Flexbox cuida de uma direção por vez. O **Grid** cuida de linhas e colunas juntas.

`grid-template-columns` define as colunas. A unidade `fr` significa "uma fração do espaço livre", então `1fr 2fr` divide a largura em terços: um para a primeira coluna e dois para a segunda. `repeat(3, 1fr)` é a forma curta de três colunas iguais.

Os itens ocupam as células em ordem e passam para novas linhas automaticamente. `gap` define o espaço entre as células.

Vale a pena decorar o padrão abaixo. Ele cria quantas colunas couberem, cada uma com pelo menos 120px de largura, sem media queries:

```css
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
```

Redimensione a área da prévia ou mude `120px` e veja as colunas se reorganizarem.

# Quiz

## Q: Qual elemento é o título mais importante de uma página?
- =
- =
- =
- =
explain: Os títulos vão de `<h1>` até `<h6>`. `<head>` guarda os metadados da página, `<header>` é uma seção de conteúdo introdutório (que muitas vezes contém um título), e `<heading>` não existe.

## Q: De que cor é o texto do parágrafo?
- Azul
- Vermelho
- Verde
- Preto, porque as regras entram em conflito
explain: Um seletor de id é mais específico que uma classe, que é mais específica que um seletor de elemento. A ordem no código só importa quando a especificidade é igual, então o azul vence mesmo vindo primeiro.

## Q: Com o `box-sizing` padrão, qual é a largura desta caixa na tela?
- 200px
- 225px
- 240px
- 250px
explain: No modo `content-box`, `width` é só o conteúdo. Some 20px de preenchimento de cada lado (40px) e 5px de borda de cada lado (10px): 200 + 40 + 10 = 250px. Com `box-sizing: border-box`, seriam exatamente 200px.

## Q: Qual CSS centraliza um único filho na horizontal e na vertical dentro do pai?
- =
- =
- =
- =
explain: Numa linha flex, `justify-content` controla o eixo horizontal e `align-items` o vertical. `align` não é uma propriedade CSS, `vertical-align` só afeta conteúdo em linha e células de tabela, e `margin` não aceita `center` (embora `margin: 0 auto` centralize um bloco na horizontal).

## Q: O que `target="_blank"` faz num link?
- Abre o link na mesma aba
- Abre o link numa nova aba ou janela
- Deixa o link invisível
- Baixa o arquivo do link
explain: `_blank` pede ao navegador um novo contexto de navegação, normalmente uma aba. Os navegadores modernos também aplicam por padrão o comportamento de `rel="noopener"`, para que a nova página não consiga controlar a sua.

## Q: O contêiner tem 300px de largura e não há espaçamento. Qual é a largura das duas colunas?
- 150px e 150px
- 100px e 200px
- 1px e 2px
- 300px e 600px
explain: `fr` divide o espaço livre em proporção. São 3 frações no total, então cada uma vale 100px: uma fração para a primeira coluna e duas para a segunda.

## Q: Qual seletor pega só os elementos `<li>` que são filhos diretos de `.menu`?
- =
- =
- =
- =
explain: `>` é o combinador de filho. Um espaço (combinador de descendente) pega em qualquer profundidade, incluindo listas aninhadas. `+` pega o próximo irmão, e `.menu.li` pega um elemento que tem ao mesmo tempo as classes `menu` e `li`.

# Challenge: Transforme em link

Transforme a palavra **MDN** num link para `https://developer.mozilla.org` que abra numa nova aba. Deixe o resto da frase como está.

## Hints
- Um link é um elemento `<a>` em volta do texto que você quer tornar clicável.
- O destino vai no atributo `href`.
- `target="_blank"` abre numa nova aba: `<a href="..." target="_blank">MDN</a>`.

## Tests
- O parágrafo contém um link
- O texto do link é exatamente "MDN"
- Ele aponta para https://developer.mozilla.org
- Ele abre numa nova aba
- A frase continua dizendo "Read the docs on MDN."

# Challenge: Centralize o cartão

O `.card` está no canto superior esquerdo de `.stage`. Adicione CSS para que ele fique centralizado na horizontal e na vertical. Não altere o HTML.

## Hints
- O Flexbox sabe centralizar: comece adicionando `display: flex;` a `.stage`.
- `justify-content` cuida do eixo horizontal numa linha.
- `align-items: center;` cuida do eixo vertical. (Fãs de Grid: `display: grid; place-items: center;` também funciona.)

## Tests
- O cartão está centralizado na horizontal
- O cartão está centralizado na vertical
- O cartão mantém os 160px de largura
- O palco continua com 300px de altura

# Challenge: Pare o transbordamento

O `.panel` deveria preencher exatamente o contêiner de 300px, mas passa da borda direita. Corrija **sem** remover o preenchimento nem a borda.

## Hints
- Qual é a largura real do painel? `width: 100%` são 300px, e depois somam-se o preenchimento e a borda.
- 300 + 24 + 24 + 2 + 2 = 352px. Esse é o transbordamento.
- Uma única propriedade muda como `width` é medida: `box-sizing: border-box;`.

## Tests
- O painel cabe dentro do contêiner
- O painel é tão largo quanto o contêiner
- O preenchimento continua com 24px
- A borda continua com 2px

# Challenge: Monte uma galeria de três colunas

Transforme `.gallery` num grid com **três colunas iguais** e **espaçamento de 16px**, para que as seis fotos formem duas fileiras de três.

## Hints
- Comece com `display: grid;` em `.gallery`.
- `grid-template-columns: 1fr 1fr 1fr;` cria três colunas iguais. `repeat(3, 1fr)` diz a mesma coisa de forma mais curta.
- `gap: 16px;` espaça tanto as linhas quanto as colunas.

## Tests
- As fotos 1 a 3 dividem a primeira fileira
- A foto 4 começa uma segunda fileira
- As colunas têm a mesma largura
- O espaçamento horizontal é de 16px
- O espaçamento vertical é de 16px
