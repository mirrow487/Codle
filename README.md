# Codle

Clear, accurate programming lessons with an in-browser playground, quizzes, and challenges for **Python, JavaScript, HTML & CSS, Lua, C#, C++, and Java**. No accounts, no points, no installs.

Each language has 6 lessons, 7 quiz questions, 4 challenges, and a free playground.

The interface and all lesson content are available in **English, Türkçe, Español, Deutsch, Français, and Português (Brasil)**. Codle picks the browser's language on first visit; the globe menu in the header switches it at any time.

## Run it

**Quickest:** open `codle.html`. It's the whole app in one self-contained file (CSS, scripts, and lessons inlined), so it works when downloaded on its own, double-clicked from disk, or opened in any HTML viewer. Python needs an internet connection the first time it runs, to download Pyodide.

`index.html` is the multi-file version. On its own it renders as an unstyled page, because it loads `css/` and `js/` by relative path. It is a static site with no build step needed at runtime. Serve the folder over HTTP (Web Workers don't start from `file://` in every browser):

```bash
npm run dev          # static files + /api functions on http://localhost:8080
```

Optional: bundle the Python runtime locally instead of loading it from jsDelivr:

```bash
./scripts/vendor-pyodide.sh
```

## Main menu, accounts and Rauke

- **Main menu**: language cards with progress, "continue where you left off", and an introduction to Rauke. Anyone can see it; lessons, quizzes and challenges need an account.
- **Accounts**: *Sign in with Google* (Google Identity Services). Each account's progress and code drafts are saved separately, in the learner's browser (they don't sync across devices). Where Google isn't configured, Codle offers a local profile instead; inside a claude.ai Artifact it uses the viewer's Claude account.
- **Rauke**, the raccoon mascot, is an AI tutor. The button in the bottom corner opens a chat that knows the current language, lesson or challenge, the learner's code and its latest output (learners can untick "include my code"). It answers in the interface language and gives hints before full solutions. A failed challenge offers "Ask Rauke why".

### Setting up Google sign-in and Rauke

1. **Google OAuth client** – Google Cloud Console → APIs & Services → Credentials → *Create credentials* → *OAuth client ID* → *Web application*. Under *Authorized JavaScript origins* add every origin Codle runs on (for example `https://codle.example.com` and `http://localhost:8080`). Copy the client ID.
2. **Anthropic API key** – from the Claude Console (console.anthropic.com).
3. **Environment variables** on the server:
   - `GOOGLE_CLIENT_ID` – the client ID from step 1 (public; served to the browser by `/api/config`)
   - `ANTHROPIC_API_KEY` – secret; only the server function reads it
4. **Run it**
   - locally: `npm install`, then `GOOGLE_CLIENT_ID=... ANTHROPIC_API_KEY=... npm run dev` → http://localhost:8080
   - on Vercel: import the repository (no build step needed; `api/*.mjs` become serverless functions) and add the two variables under *Settings → Environment Variables*.

How Rauke's server function (`api/rauke.mjs`) works:

- It accepts a request only with a valid Google ID token issued for your client ID (checked with Google), so the API key can't be used anonymously.
- It allows 30 questions per learner per hour (counted per server instance) and caps message, code and history sizes.
- It calls **Claude Opus 5.5** (`claude-opus-5-5`) with streaming, `effort: "low"` (fast, short tutoring replies), and a cached system prompt. Server-side refusal fallbacks are on (`fallbacks: "default"`).
- Tests: `npm run test:api` (fake Claude client, nothing billed) and `node scripts/e2e-accounts.mjs http://localhost:8080/` (browser, with fake Google and Rauke endpoints).



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
js/config.js            Google client ID / endpoints (public settings)
js/auth.js              accounts: Google, Claude (in Artifacts), local profile
js/rauke.js             Rauke chat panel and its two backends
api/rauke.mjs           server function: verifies Google sign-in, streams Claude
api/config.mjs          public config for the browser
scripts/dev-server.mjs  local server for static files + /api
js/content.js           generated from content/*.md and content/i18n/
js/vendor/              CodeMirror 5, Fengari (MIT licensed)
content/*.md            the lessons themselves (English, plus all code)
content/i18n/           lesson translations (prose only)
assets/                 logo, mascot, favicon
scripts/                build, verification, browser test, artifact build
```

`node scripts/build-artifact.mjs` writes `dist/artifact/`, a variant for hosts that wrap the page in their own document (CSS inlined).
