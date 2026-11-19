// Browser smoke test: drives the real UI in Chromium.
// Runs every lesson example and every challenge solution through the in-browser
// runtimes (Python, JavaScript, Lua, HTML) and checks the rendered output.
//   python3 -m http.server 8765 &   then   node scripts/e2e.mjs [http://localhost:8765/]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const URL_ = process.argv[2] || "http://localhost:8765/";
const content = await (async () => {
  const { parseAllWithTranslations: parseAll } = await import("./content-parser.mjs");
  const { dirname, join } = await import("node:path");
  const { fileURLToPath } = await import("node:url");
  return parseAll(join(dirname(fileURLToPath(import.meta.url)), "../content"));
})();
const norm = (s) => s.replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g|ERR_|403|Failed to load resource/.test(m.text())) errors.push(m.text()); });

let failures = 0;
const fail = (msg) => { failures++; console.log("  ✗ " + msg); };

await page.goto(URL_);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForSelector(".lang-tab");
// Lessons need an account: on a server without Google configured, create a local profile.
await page.click("[data-signin]");
await page.waitForSelector("#local-name");
await page.fill("#local-name", "Test Learner");
await page.click(".local-form button[type=submit]");
await page.waitForSelector(".article-head h2");

async function setLang(id) {
  await page.click(`.lang-tab[data-lang="${id}"]`);
  await page.waitForTimeout(450);
}
async function setView(id) {
  await page.click(`.view-tab[data-view="${id}"]`);
  await page.waitForTimeout(450);
}
async function waitIdle() {
  await page.waitForFunction(() => {
    const b = document.querySelector('.pg [data-act="primary"]');
    return b && !b.disabled;
  }, null, { timeout: 90000 });
}

for (const lang of content) {
  console.log(lang.name);
  await setLang(lang.id);
  await setView("learn");
  for (let i = 0; i < lang.lessons.length; i++) {
    await page.click(`.rail-item[data-index="${i}"]`);
    await page.waitForTimeout(450);
    if (lang.id === "html") {
      const ok = await page.$(".preview-frame");
      if (!ok) fail(`lesson ${i + 1}: no preview`);
      continue;
    }
    await page.click('.pg [data-act="primary"]');
    await page.waitForTimeout(100);
    await waitIdle();
    const out = await page.$eval(".pg-out-body pre", (e) => e.textContent);
    const status = await page.$eval(".pg .status", (e) => e.textContent);
    if (lang.runner === "remote") {
      if (!/Verified output|Done/.test(status)) fail(`lesson ${i + 1}: status "${status}"`);
    }
    if (norm(out) !== norm(lang.lessons[i].output)) fail(`lesson ${i + 1} "${lang.lessons[i].title}": got\n${out}`);
  }

  await setView("quiz");
  await page.click(".option[data-opt]");
  await page.waitForSelector(".explain.open");
  const dotClass = await page.$eval('.quiz-dot[data-index="0"]', (e) => e.className);
  if (!/right|wrong/.test(dotClass)) fail("quiz dot not marked");

  await setView("challenges");
  for (let i = 0; i < lang.challenges.length; i++) {
    await page.click(`.rail-item[data-index="${i}"]`);
    await page.waitForTimeout(450);
    // starter must fail (or be uncheckable for remote languages)
    await page.click('.pg [data-act="primary"]');
    await page.waitForSelector("#challenge-result .result", { timeout: 90000 });
    const starterKind = await page.$eval("#challenge-result .result", (e) => e.className);
    if (lang.runner === "remote") {
      if (!/info/.test(starterKind)) fail(`challenge ${i + 1}: expected "can't check" info, got ${starterKind}`);
      continue;
    }
    if (!/fail/.test(starterKind)) fail(`challenge ${i + 1}: starter did not fail (${starterKind})`);
    await page.click("[data-solution]");
    await page.click("[data-use]");
    await page.waitForTimeout(200);
    await page.click('.pg [data-act="primary"]');
    await page.waitForFunction(() => {
      const r = document.querySelector("#challenge-result .result");
      return r && /pass|fail|info/.test(r.className) && !document.querySelector('.pg [data-act="primary"]').disabled;
    }, null, { timeout: 90000 });
    await page.waitForTimeout(300);
    const kind = await page.$eval("#challenge-result .result", (e) => e.className);
    if (!/pass/.test(kind)) fail(`challenge ${i + 1} "${lang.challenges[i].title}": solution did not pass (${kind})`);
    const done = await page.$eval(`.rail-item[data-index="${i}"]`, (e) => e.classList.contains("done"));
    if (!done) fail(`challenge ${i + 1}: rail not marked done`);
  }

  await setView("playground");
  if (lang.id !== "html") {
    await page.click('.pg [data-act="primary"]');
    await page.waitForTimeout(100);
    await waitIdle();
    const status = await page.$eval(".pg .status", (e) => e.textContent);
    if (lang.runner !== "remote" && !/Done/.test(status)) fail(`playground status "${status}"`);
  }
}

// Infinite loop protection (JavaScript)
await setLang("javascript");
await setView("playground");
await page.evaluate(() => { document.querySelector(".CodeMirror").CodeMirror.setValue("while (true) {}"); });
await page.click('.pg [data-act="primary"]');
await page.waitForTimeout(100);
await waitIdle();
const loopOut = await page.$eval(".pg-out-body pre", (e) => e.textContent);
if (!/infinite loop/.test(loopOut)) fail("JS infinite loop not stopped: " + loopOut);

// Interface languages: every locale, every language, every view.
console.log("Translations");
for (const loc of ["tr", "es", "de", "fr", "pt-BR", "en"]) {
  await page.selectOption("#ui-lang", loc);
  await page.waitForTimeout(450);
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  if (htmlLang !== loc) fail(`${loc}: <html lang> is ${htmlLang}`);
  for (const lang of content) {
    await setLang(lang.id);
    const tr = loc === "en" ? null : lang.i18n[loc];
    await setView("learn");
    await page.click('.rail-item[data-index="0"]');
    await page.waitForTimeout(400);
    const title = await page.$eval(".article-head h2", (e) => e.textContent);
    const want = tr ? tr.lessons[0].title : lang.lessons[0].title;
    if (title !== want) fail(`${loc}/${lang.id}: lesson title "${title}", expected "${want}"`);
    await setView("quiz");
    const q = await page.$eval(".quiz-q", (e) => e.textContent);
    if (!q.trim()) fail(`${loc}/${lang.id}: empty quiz question`);
    await setView("challenges");
    const ct = await page.$eval(".challenge h2", (e) => e.textContent);
    const ci = await page.$eval('.rail-item[aria-current="true"]', (e) => Number(e.dataset.index));
    const wantC = tr ? tr.challenges[ci].title : lang.challenges[ci].title;
    if (ct !== wantC) fail(`${loc}/${lang.id}: challenge title "${ct}", expected "${wantC}"`);
  }
}
// A translated HTML challenge shows translated test labels.
await page.selectOption("#ui-lang", "tr");
await page.waitForTimeout(400);
await setLang("html");
await setView("challenges");
await page.click('.rail-item[data-index="0"]');
await page.waitForTimeout(400);
await page.click('.pg [data-act="primary"]');
await page.waitForSelector("#challenge-result .checklist");
const label = await page.$eval("#challenge-result .checklist li span:last-child", (e) => e.textContent);
if (label !== "Paragraf bir bağlantı içeriyor") fail(`translated test label: "${label}"`);
await page.selectOption("#ui-lang", "en");

if (errors.length) { failures += errors.length; console.log("Page errors:\n" + errors.join("\n")); }
await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nAll browser checks passed.");
process.exit(failures ? 1 : 0);
