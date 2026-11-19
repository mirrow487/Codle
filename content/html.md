# Lesson: Document Structure
summary: The skeleton every web page shares, and what each bone is for.

HTML describes **what things are**: this is a heading, this is a paragraph, this is a list. The browser decides a default look, and CSS changes it later.

Content goes inside **elements**, written as an opening tag, content, and a closing tag: `<p>Hello</p>`. Some elements, like `<img>` and `<meta>`, are **void** and have no closing tag.

Every page has the same outline:

- `<!DOCTYPE html>` tells the browser to use modern standards mode
- `<html lang="en">` wraps everything and declares the language (screen readers use it)
- `<head>` holds information **about** the page: title, character set, styles
- `<body>` holds what people actually see

Headings run from `<h1>` (most important) to `<h6>`. Use them for structure, not for size; you can change sizes with CSS.

> Edit the preview text below, then press Run. Nothing you type here can break anything, so be as reckless as you like.

## Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>My first page</title>
  </head>
  <body>
    <h1>Field notes</h1>
    <p>This paragraph is the body of the page.</p>
    <h2>Observations</h2>
    <p>Headings outline the document, like chapters in a book.</p>
  </body>
</html>
```

# Lesson: Text, Links & Lists
summary: Meaningful text tags, attributes, and the two kinds of lists.

Pick tags for their meaning. `<strong>` marks importance and `<em>` marks emphasis. Both have a default style (bold, italic), but the meaning is what assistive technology reads out.

Elements can carry **attributes** inside the opening tag, written as `name="value"`. A link is an `<a>` element whose `href` attribute says where it goes:

```html
<a href="https://developer.mozilla.org">MDN Web Docs</a>
```

Images need a `src` and an `alt` text describing the image for people who cannot see it.

Lists come in two flavours: `<ul>` for unordered (bullets) and `<ol>` for ordered (numbers). Either way, each item is an `<li>`.

> Links inside this preview are disabled so you do not navigate away by accident. The console tells you where they would have gone.

## Example
```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Pancakes</h1>
    <p>Fluffy, <strong>fast</strong>, and <em>very</em> forgiving.</p>

    <h2>You need</h2>
    <ul>
      <li>1 cup flour</li>
      <li>1 cup milk</li>
      <li>1 egg</li>
    </ul>

    <h2>Steps</h2>
    <ol>
      <li>Whisk everything together.</li>
      <li>Rest the batter for 5 minutes.</li>
      <li>Cook on a hot, lightly oiled pan.</li>
    </ol>

    <p>Recipe adapted from <a href="https://example.com/pancakes">a very old cookbook</a>.</p>
  </body>
</html>
```

# Lesson: CSS Selectors & the Cascade
summary: How CSS picks elements, and how it settles arguments between rules.

A CSS rule is a **selector** plus **declarations**:

```css
p {
  color: #333;
  line-height: 1.6;
}
```

The selectors you will use most:

- `p` selects every `<p>` element
- `.note` selects elements with `class="note"` (an element can have several classes)
- `#intro` selects the one element with `id="intro"`
- `nav a` selects `<a>` elements anywhere inside a `<nav>`
- `ul > li` selects `<li>` elements that are direct children of a `<ul>`

When two rules disagree, **specificity** decides: an id beats a class, and a class beats an element selector. Only when specificity ties does the rule that appears later win. That is the "cascade" in Cascading Style Sheets.

## Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      p { color: #555; }
      .note { color: #1f6feb; font-weight: 600; }
      #headline { color: #c2410c; }
      ul > li { margin-bottom: 4px; }
      nav a { color: #0f766e; }
    </style>
  </head>
  <body>
    <p id="headline" class="note">I have an id AND a class. The id wins.</p>
    <p class="note">I only have the class.</p>
    <p>I am a plain paragraph.</p>
    <nav><a href="#">A link inside nav</a></nav>
    <ul>
      <li>Direct child of the list</li>
      <li>Also a direct child</li>
    </ul>
  </body>
</html>
```

# Lesson: The Box Model
summary: Content, padding, border, margin, and the one setting that makes sizes sane.

Every element is a rectangular box made of four layers, from the inside out:

- **content**: the text or image itself
- **padding**: space inside the border, which takes the background colour
- **border**: the line around the padding
- **margin**: transparent space outside, pushing other boxes away

By default (`box-sizing: content-box`), `width` sets only the content. Padding and border are added on top, so a `width: 200px` box with `20px` padding and a `5px` border is actually **250px** wide.

Almost every modern stylesheet switches this off with `box-sizing: border-box`, which makes `width` include padding and border. Then `200px` means 200px.

## Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      .box {
        width: 200px;
        padding: 20px;
        border: 5px solid #1f6feb;
        margin-bottom: 16px;
        background: #e8f0fe;
      }
      .border-box { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div class="box" id="a">content-box</div>
    <div class="box border-box" id="b">border-box</div>
    <script>
      console.log("content-box width:", document.getElementById("a").offsetWidth + "px");
      console.log("border-box width:", document.getElementById("b").offsetWidth + "px");
    </script>
  </body>
</html>
```

# Lesson: Flexbox
summary: Lining things up in a row or column without the old hacks.

Put `display: flex` on a container, and its direct children become **flex items** laid out in a row.

The two properties you will use constantly:

- `justify-content` positions items along the main axis (horizontal in a row): `flex-start`, `center`, `space-between`, `space-around`, `space-evenly`
- `align-items` positions them across it (vertical in a row): `stretch` (the default), `flex-start`, `center`, `flex-end`

`gap` adds space between items without margin arithmetic. `flex-direction: column` turns the row into a column, which swaps what the two axes mean. `flex: 1` on an item tells it to grow and take up the leftover space.

> Perfectly centering one thing inside another used to be a meme. Now it is three lines: `display: flex; justify-content: center; align-items: center;`

## Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; margin: 0; padding: 16px; }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        border: 1px solid #ccd;
        border-radius: 8px;
      }
      .toolbar .search { flex: 1; padding: 6px 8px; }
      button { padding: 6px 12px; }
      .stage {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 140px;
        margin-top: 16px;
        background: #f1f3f9;
        border-radius: 8px;
      }
      .card { padding: 12px 18px; background: white; border: 1px solid #ccd; border-radius: 6px; }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <strong>Docs</strong>
      <input class="search" placeholder="Search…">
      <button>Go</button>
    </div>
    <div class="stage">
      <div class="card">Perfectly centred</div>
    </div>
  </body>
</html>
```

# Lesson: CSS Grid
summary: Two-dimensional layouts with rows, columns, and the fr unit.

Flexbox handles one direction at a time. **Grid** handles rows and columns together.

`grid-template-columns` defines the columns. The `fr` unit means "a fraction of the free space", so `1fr 2fr` splits the width into thirds, one for the first column and two for the second. `repeat(3, 1fr)` is shorthand for three equal columns.

Items flow into the cells in order, wrapping onto new rows automatically. `gap` sets the space between cells.

The pattern below is worth memorising. It makes as many columns as fit, each at least 120px wide, with no media queries:

```css
grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
```

Resize the preview area or change `120px` and watch the columns rearrange.

## Example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      .layout {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 12px;
        margin-bottom: 16px;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;
      }
      .layout > div, .tiles > div {
        padding: 12px;
        background: #eef2ff;
        border: 1px solid #c7d2fe;
        border-radius: 6px;
      }
    </style>
  </head>
  <body>
    <div class="layout">
      <div>Sidebar (1fr)</div>
      <div>Main content (2fr)</div>
    </div>
    <div class="tiles">
      <div>One</div><div>Two</div><div>Three</div>
      <div>Four</div><div>Five</div><div>Six</div>
    </div>
  </body>
</html>
```

# Quiz

## Q: Which element is the most important heading on a page?
- [x] `<h1>`
- [ ] `<head>`
- [ ] `<header>`
- [ ] `<heading>`
explain: Headings go from `<h1>` down to `<h6>`. `<head>` holds page metadata, `<header>` is a section of introductory content (often containing a heading), and `<heading>` does not exist.

## Q: What colour is the paragraph text?
```html
<style>
  #intro { color: blue; }
  .lead { color: red; }
  p { color: green; }
</style>
<p id="intro" class="lead">Hello</p>
```
- [x] Blue
- [ ] Red
- [ ] Green
- [ ] Black, because the rules conflict
explain: An id selector is more specific than a class, which is more specific than an element selector. Source order only matters when specificity is equal, so blue wins even though it comes first.
check: getComputedStyle(document.querySelector('#intro')).color === 'rgb(0, 0, 255)'

## Q: With the default `box-sizing`, how wide is this box on screen?
```html
<style>
  .box { width: 200px; padding: 20px; border: 5px solid; }
</style>
<div class="box">Box</div>
```
- [ ] 200px
- [ ] 225px
- [ ] 240px
- [x] 250px
explain: In `content-box` mode, `width` is the content only. Add 20px padding on each side (40px) and a 5px border on each side (10px): 200 + 40 + 10 = 250px. With `box-sizing: border-box` it would be exactly 200px.
check: document.querySelector('.box').offsetWidth === 250

## Q: Which CSS centres a single child horizontally and vertically inside its parent?
- [x] `display: flex; justify-content: center; align-items: center;`
- [ ] `display: flex; align: center;`
- [ ] `text-align: center; vertical-align: middle;`
- [ ] `margin: center;`
explain: In a flex row, `justify-content` controls the horizontal axis and `align-items` the vertical one. `align` is not a CSS property, `vertical-align` only affects inline and table-cell content, and `margin` does not accept `center` (though `margin: 0 auto` centres a block horizontally).

## Q: What does `target="_blank"` do on a link?
- [ ] Opens the link in the same tab
- [x] Opens the link in a new tab or window
- [ ] Makes the link invisible
- [ ] Downloads the linked file
explain: `_blank` asks the browser for a new browsing context, usually a tab. Modern browsers also apply `rel="noopener"` behaviour to it by default, so the new page cannot control yours.

## Q: The container is 300px wide with no gap. How wide are the two columns?
```html
<style>
  .grid { display: grid; grid-template-columns: 1fr 2fr; width: 300px; }
</style>
<div class="grid"><div id="one">A</div><div id="two">B</div></div>
```
- [ ] 150px and 150px
- [x] 100px and 200px
- [ ] 1px and 2px
- [ ] 300px and 600px
explain: `fr` shares out the free space by ratio. There are 3 fractions in total, so each is 100px: one fraction for the first column, two for the second.
check: document.querySelector('#one').offsetWidth === 100 && document.querySelector('#two').offsetWidth === 200

## Q: Which selector matches only the `<li>` elements that are direct children of `.menu`?
- [x] `.menu > li`
- [ ] `.menu li`
- [ ] `.menu + li`
- [ ] `.menu.li`
explain: `>` is the child combinator. A space (descendant combinator) matches at any depth, including nested lists. `+` matches the next sibling, and `.menu.li` matches one element with both classes `menu` and `li`.

# Challenge: Make it a link
kind: Fix

Turn the word **MDN** into a link to `https://developer.mozilla.org` that opens in a new tab. Keep the rest of the sentence as it is.

## Starter
```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <p>Read the docs on MDN.</p>
  </body>
</html>
```

## Solution
```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <p>Read the docs on <a href="https://developer.mozilla.org" target="_blank">MDN</a>.</p>
  </body>
</html>
```

## Tests
- The paragraph contains a link :: document.querySelector('p a') !== null
- The link text is exactly "MDN" :: document.querySelector('p a').textContent.trim() === 'MDN'
- It points to https://developer.mozilla.org :: /^https:\/\/developer\.mozilla\.org\/?$/.test(document.querySelector('p a').getAttribute('href'))
- It opens in a new tab :: document.querySelector('p a').getAttribute('target') === '_blank'
- The sentence still reads "Read the docs on MDN." :: document.querySelector('p').textContent.trim() === 'Read the docs on MDN.'

## Hints
- A link is an `<a>` element wrapped around the text you want to be clickable.
- The destination goes in the `href` attribute.
- `target="_blank"` opens it in a new tab: `<a href="..." target="_blank">MDN</a>`.

# Challenge: Centre the card
kind: Complete

The `.card` sits in the top-left corner of `.stage`. Add CSS so it is centred both horizontally and vertically. Do not change the HTML.

## Starter
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; }
      .stage {
        height: 300px;
        background: #f1f3f9;
        /* Your CSS here */
      }
      .card {
        width: 160px;
        padding: 16px;
        background: white;
        border: 1px solid #ccd;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div class="stage">
      <div class="card">Centre me</div>
    </div>
  </body>
</html>
```

## Solution
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { margin: 0; font-family: system-ui, sans-serif; }
      .stage {
        height: 300px;
        background: #f1f3f9;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .card {
        width: 160px;
        padding: 16px;
        background: white;
        border: 1px solid #ccd;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <div class="stage">
      <div class="card">Centre me</div>
    </div>
  </body>
</html>
```

## Tests
- The card is centred horizontally :: (function(){var s=document.querySelector('.stage').getBoundingClientRect(),c=document.querySelector('.card').getBoundingClientRect();return Math.abs((s.left+s.right)/2-(c.left+c.right)/2)<=1})()
- The card is centred vertically :: (function(){var s=document.querySelector('.stage').getBoundingClientRect(),c=document.querySelector('.card').getBoundingClientRect();return Math.abs((s.top+s.bottom)/2-(c.top+c.bottom)/2)<=1})()
- The card keeps its 160px width :: getComputedStyle(document.querySelector('.card')).width === '160px'
- The stage is still 300px tall :: Math.round(document.querySelector('.stage').getBoundingClientRect().height) === 300

## Hints
- Flexbox can centre things: start by adding `display: flex;` to `.stage`.
- `justify-content` handles the horizontal axis in a row.
- `align-items: center;` handles the vertical axis. (Grid fans: `display: grid; place-items: center;` works too.)

# Challenge: Stop the overflow
kind: Fix

The `.panel` is meant to fill its 300px container exactly, but it spills out past the right edge. Fix it **without** removing the padding or the border.

## Starter
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      .container { width: 300px; background: #fde68a; }
      .panel {
        width: 100%;
        padding: 24px;
        border: 2px solid #92400e;
        background: #fff7ed;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="panel">I should fit inside the yellow box.</div>
    </div>
  </body>
</html>
```

## Solution
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      .container { width: 300px; background: #fde68a; }
      .panel {
        box-sizing: border-box;
        width: 100%;
        padding: 24px;
        border: 2px solid #92400e;
        background: #fff7ed;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="panel">I should fit inside the yellow box.</div>
    </div>
  </body>
</html>
```

## Tests
- The panel fits inside the container :: document.querySelector('.panel').getBoundingClientRect().right <= document.querySelector('.container').getBoundingClientRect().right + 0.5
- The panel is as wide as the container :: Math.abs(document.querySelector('.panel').getBoundingClientRect().width - 300) <= 0.5
- The padding is still 24px :: getComputedStyle(document.querySelector('.panel')).paddingLeft === '24px'
- The border is still 2px :: getComputedStyle(document.querySelector('.panel')).borderLeftWidth === '2px'

## Hints
- How wide is the panel really? `width: 100%` is 300px, then padding and border get added.
- 300 + 24 + 24 + 2 + 2 = 352px. That is the overflow.
- One property changes how `width` is measured: `box-sizing: border-box;`.

# Challenge: Build a three-column gallery
kind: Complete

Turn `.gallery` into a grid with **three equal columns** and a **16px gap**, so the six photos form two rows of three.

## Starter
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      .gallery {
        width: 600px;
        /* Your CSS here */
      }
      .photo {
        height: 80px;
        background: #dbeafe;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <div class="gallery">
      <div class="photo">1</div><div class="photo">2</div><div class="photo">3</div>
      <div class="photo">4</div><div class="photo">5</div><div class="photo">6</div>
    </div>
  </body>
</html>
```

## Solution
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body { font-family: system-ui, sans-serif; padding: 16px; }
      .gallery {
        width: 600px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 16px;
      }
      .photo {
        height: 80px;
        background: #dbeafe;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    </style>
  </head>
  <body>
    <div class="gallery">
      <div class="photo">1</div><div class="photo">2</div><div class="photo">3</div>
      <div class="photo">4</div><div class="photo">5</div><div class="photo">6</div>
    </div>
  </body>
</html>
```

## Tests
- Photos 1 to 3 share the first row :: (function(){var p=document.querySelectorAll('.photo');var t=p[0].getBoundingClientRect().top;return Math.abs(p[1].getBoundingClientRect().top-t)<1&&Math.abs(p[2].getBoundingClientRect().top-t)<1})()
- Photo 4 starts a second row :: (function(){var p=document.querySelectorAll('.photo');return p[3].getBoundingClientRect().top>p[0].getBoundingClientRect().bottom&&Math.abs(p[3].getBoundingClientRect().left-p[0].getBoundingClientRect().left)<1})()
- The columns are equal width :: (function(){var p=document.querySelectorAll('.photo');var w=p[0].getBoundingClientRect().width;return Math.abs(p[1].getBoundingClientRect().width-w)<1&&Math.abs(p[2].getBoundingClientRect().width-w)<1})()
- The horizontal gap is 16px :: (function(){var p=document.querySelectorAll('.photo');return Math.abs(p[1].getBoundingClientRect().left-p[0].getBoundingClientRect().right-16)<1})()
- The vertical gap is 16px :: (function(){var p=document.querySelectorAll('.photo');return Math.abs(p[3].getBoundingClientRect().top-p[0].getBoundingClientRect().bottom-16)<1})()

## Hints
- Start with `display: grid;` on `.gallery`.
- `grid-template-columns: 1fr 1fr 1fr;` makes three equal columns. `repeat(3, 1fr)` says the same thing more briefly.
- `gap: 16px;` spaces both rows and columns.

# Playground
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <style>
      body {
        font-family: system-ui, sans-serif;
        display: grid;
        place-items: center;
        min-height: 90vh;
        margin: 0;
        background: #f4f6fb;
      }
      .tiles { display: flex; gap: 6px; }
      .tile {
        width: 48px;
        height: 48px;
        display: grid;
        place-items: center;
        font-weight: 700;
        font-size: 24px;
        border-radius: 6px;
        background: #3b5bdb;
        color: white;
        transition: transform 150ms ease;
      }
      .tile:hover { transform: translateY(-4px); }
    </style>
  </head>
  <body>
    <div class="tiles">
      <div class="tile">H</div><div class="tile">E</div><div class="tile">L</div><div class="tile">L</div><div class="tile">O</div>
    </div>
    <script>
      console.log("Hover the tiles. Then change the colours, the size, or the word.");
    </script>
  </body>
</html>
```
