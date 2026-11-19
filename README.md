# Codle

Clear, accurate programming lessons with an in-browser playground, quizzes, and challenges for **Python, JavaScript, HTML & CSS, Lua, C#, C++, and Java**. No accounts, no points, no installs.

Each language has 6 lessons, 7 quiz questions, 4 challenges, and a free playground.

The interface and all lesson content are available in **English, Türkçe, Español, Deutsch, Français, and Português (Brasil)**. Codle picks the browser's language on first visit; the globe menu in the header switches it at any time.

## Run it

**Quickest:** open `codle.html`. It's the whole app in one self-contained file (CSS, scripts, and lessons inlined), so it works when downloaded on its own, double-clicked from disk, or opened in any HTML viewer. Python needs an internet connection the first time it runs, to download Pyodide.

`index.html` is the multi-file version. On its own it renders as an unstyled page, because it loads `css/` and `js/` by relative path. It is a static site with no build step needed at runtime. Serve the folder over HTTP (Web Workers don't start from `file://` in every browser):

```bash
npm run serve        # python3 -m http.server 8080, then open http://localhost:8080
```

Optional: bundle the Python runtime locally instead of loading it from jsDelivr:

```bash
./scripts/vendor-pyodide.sh
```

## How code runs

| Language | Runtime | Where |
| --- | --- | --- |
| Python | Pyodide 0.26 (CPython 3.12 on WebAssembly) | Web Worker in the browser |
| JavaScript | The browser's engine, with Node-style console formatting | Web Worker in the browser |
| Lua | Fengari (Lua 5.3 in JavaScript) | Web Worker in the browser |
| HTML & CSS | Sandboxed `<iframe>` preview with a console bridge | Browser |
| C#, C++, Java | Public compile services: Wandbox first, then Compiler Explorer | Remote |

Infinite loops are stopped by a timeout (workers are terminated) or, for Lua, an instruction limit.

If a compile service or the Pyodide download can't be reached (offline, or inside a sandbox with a strict content security policy), Codle says so. For unedited examples it shows the example's **verified** output, and for challenges it shows the expected output to compare against.

## Content

All lessons, quizzes, and challenges live in `content/<language>.md`, in a small Markdown dialect documented at the top of `scripts/content-parser.mjs`. After editing, rebuild the bundle the app loads:

```bash
npm run build        # content/*.md -> js/content.js, then rebuilds codle.html
```

### Translations

Each translation lives in `content/i18n/<locale>/<language>.md` (locales: `tr`, `es`, `de`, `fr`, `pt-BR`) and mirrors the English file's structure, but holds **prose only**: titles, explanations, quiz wording, prompts, hints, and HTML test labels. All code (examples, starters, solutions, expected output) always comes from the English file, so every verified output stays valid in every language.

The build enforces this. It fails if a translation has the wrong number of lessons, questions, options, hints, or test labels; if a code block differs from the English one; if an inline code span doesn't appear in the English text; or if a code-only quiz option was changed (write `- =` to keep the English option). Interface strings are in `js/i18n.js`.

### Accuracy checks

`npm run verify` runs every claim in the content through real toolchains (python3, node, Fengari, g++, java, mcs/mono, and Chromium for HTML):

- every lesson example prints exactly its stated output
- every challenge solution passes, and every starter does not
- every "what does this print?" quiz answer matches the real output
- JavaScript output from Codle's formatter matches real Node.js
- HTML/CSS challenge tests and quiz claims hold in a real browser

`node scripts/e2e.mjs http://localhost:8080/` drives the actual UI in Chromium: it runs every lesson, answers a quiz question, and checks every challenge (starter fails, solution passes) for each language, then switches through all six interface languages and checks that each view shows the translated content.

## Customising the look

The logo, mascot, and favicon live in `assets/`. Every colour, font, radius, and timing value is a CSS custom property at the top of `css/styles.css`, with light and dark sets. Language marker colours are the `--lang-*` tokens.

## Project layout

```
index.html              app shell
css/styles.css          design tokens and styles
js/app.js               UI: language switcher, lessons, quiz, challenges, playground
js/runners.js           run(lang, code) for every language
js/*-worker.js          sandboxed runtimes (JavaScript, Python, Lua)
js/format.js            Node-style console.log formatting
js/lua-runner.js        Fengari wrapper (shared with the verifier)
js/markdown.js          lesson prose renderer + syntax highlighting
js/i18n.js              interface strings for all six languages
js/content.js           generated from content/*.md and content/i18n/
js/vendor/              CodeMirror 5, Fengari (MIT licensed)
content/*.md            the lessons themselves (English, plus all code)
content/i18n/           lesson translations (prose only)
assets/                 logo, mascot, favicon
scripts/                build, verification, browser test, artifact build
```

`node scripts/build-artifact.mjs` writes `dist/artifact/`, a variant for hosts that wrap the page in their own document (CSS inlined).
