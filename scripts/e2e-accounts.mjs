// Browser test for accounts and Rauke, with Google's script and the Rauke
// server replaced by fakes (no Google project or API key needed).
//   node scripts/dev-server.mjs 8766 &   then   node scripts/e2e-accounts.mjs [http://localhost:8766/]
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const URL_ = process.argv[2] || "http://localhost:8766/";
let failures = 0;
const check = (ok, msg) => { if (!ok) { failures++; console.log("  ✗ " + msg); } else console.log("  ✓ " + msg); };

const b64url = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const exp = Math.floor(Date.now() / 1000) + 3600;
const JWT = [b64url({ alg: "RS256" }), b64url({ sub: "42", name: "Ada Lovelace", email: "ada@example.com", picture: "", exp }), "sig"].join(".");

const FAKE_GSI = `window.google = { accounts: { id: {
  initialize(o) { window.__gsi = o; },
  renderButton(el) { const b = document.createElement("button"); b.id = "fake-google"; b.textContent = "Sign in with Google"; b.onclick = () => window.__gsi.callback({ credential: ${JSON.stringify(JWT)} }); el.appendChild(b); },
  prompt() {}, disableAutoSelect() { window.__gsiSignedOut = true; },
} } };`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "tr-TR" });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
let raukeRequest = null;

await page.route("https://accounts.google.com/gsi/client", (r) => r.fulfill({ contentType: "text/javascript", body: FAKE_GSI }));
await page.route("**/api/config", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify({ googleClientId: "test.apps.googleusercontent.com", raukeAvailable: true }) }));
await page.route("**/api/rauke", async (r) => {
  raukeRequest = { auth: r.request().headers()["authorization"], body: JSON.parse(r.request().postData()) };
  await r.fulfill({ contentType: "text/plain; charset=utf-8", body: "**İpucu:** `range(n)` 0'dan başlar. `range(1, n + 1)` dene." });
});

await page.goto(URL_);
await page.evaluate(() => localStorage.clear());
await page.reload();
await page.waitForSelector(".home-hero");
check(await page.isVisible("[data-signin]"), "guest sees the main menu with a sign-in button");
check(!(await page.isVisible(".rauke-fab")), "Rauke is hidden before sign-in");

// Lessons are gated.
await page.click('.lang-card [data-go-lang="python"][data-go-view="learn"]');
await page.waitForSelector("#fake-google");
check(await page.isVisible(".signin"), "opening a lesson asks the guest to sign in");
check(!(await page.isVisible(".local-form")), "no local-profile fallback when Google is configured");

await page.click("#fake-google");
await page.waitForSelector(".article-head h2");
check((await page.textContent(".article-head h2")) === "Değişkenler ve Türler", "after Google sign-in the lesson opens (in Turkish)");
check((await page.getAttribute(".account-btn", "aria-label")) === "Hesap", "account button appears");
check(await page.isHidden(".account-menu"), "account menu starts closed");
await page.click(".account-btn");
check((await page.textContent(".account-who strong")) === "Ada Lovelace", "account menu shows the Google name");
check((await page.textContent(".account-via")).includes("Google"), "account menu shows the provider");
await page.click(".article-head h2");

// Progress is stored per account.
const keys = await page.evaluate(() => Object.keys(localStorage));
check(keys.includes("codle:u:g_42:state"), "progress is saved under the Google account id");

// Ask Rauke on a failing challenge.
await page.click('.view-tab[data-view="challenges"]');
await page.waitForSelector(".challenge h2");
await page.click('.pg [data-act="primary"]');
await page.waitForSelector("#challenge-result .ask-rauke", { timeout: 60000 });
await page.click("#challenge-result .ask-rauke");
await page.waitForFunction(() => document.querySelectorAll(".rauke-msg.me").length >= 1 && document.querySelectorAll(".rauke-msg.bot").length >= 1 && !document.querySelector(".rauke-msg.streaming"), null, { timeout: 30000 });
const answer = await page.textContent(".rauke-list");
check(/range\(1, n \+ 1\)/.test(answer), "Rauke's streamed answer is rendered");
check(await page.isVisible(".rauke-msg.bot code"), "Rauke's Markdown is formatted");
check(raukeRequest && raukeRequest.auth === "Bearer " + JWT, "Rauke request carries the Google ID token");
const ctx = raukeRequest && raukeRequest.body.context;
check(ctx && ctx.locale === "tr" && ctx.language === "Python" && ctx.view === "challenges", "Rauke gets locale, language and section");
check(ctx && /def total_to/.test(ctx.code || ""), "Rauke gets the learner's code");
check(ctx && /15/.test(ctx.expected || ""), "Rauke gets the expected output");
check(raukeRequest && raukeRequest.body.messages.at(-1).content === "Kodum neden geçmiyor?", "the question is sent in the interface language");

// Excluding code.
await page.click("#rauke-include");
await page.fill("#rauke-input", "Bir ipucu daha?");
await page.press("#rauke-input", "Enter");
await page.waitForFunction(() => document.querySelectorAll(".rauke-msg.me").length >= 2 && !document.querySelector(".rauke-msg.streaming"));
check(raukeRequest.body.context.code === undefined, "unticking 'include my code' leaves the code out");
check(raukeRequest.body.messages.length === 3, "the conversation history is sent (user, assistant, user)");

// Main menu shows progress, sign out returns to the guest menu.
await page.click(".rauke-close");
await page.click("#home-btn");
await page.waitForSelector(".home-hero");
check((await page.textContent(".home-hero h1")).includes("Ada"), "main menu greets the learner by first name");
check((await page.textContent(".lang-card .meter .num")) === "1/6", "main menu shows lesson progress");
await page.click(".account-btn");
await page.click(".account-out");
await page.waitForSelector("[data-signin]");
check(await page.evaluate(() => window.__gsiSignedOut === true), "signing out disables Google auto sign-in");
check(!(await page.isVisible(".account-btn")), "account button disappears after sign-out");

// Inside a claude.ai Artifact: Claude account + the `sample` capability (simulated).
console.log("Artifact mode (simulated claude.ai runtime)");
const page2 = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "en-US" });
page2.on("pageerror", (e) => errors.push(e.message));
await page2.addInitScript(() => {
  window.__samples = [];
  window.claude = { use: async (name) => {
    if (name === "user") return { me: async () => ({ id: "u_7", name: "Grace Hopper", email: "", avatarUrl: "" }) };
    if (name === "sample") return async (input, opts) => {
      window.__samples.push(input);
      const text = "Try `print(i)` inside the loop.";
      opts.onText({ text: text.slice(0, 6), delta: text.slice(0, 6) });
      opts.onText({ text, delta: text.slice(6) });
      return { text, truncated: false };
    };
    return null;
  } };
});
await page2.goto(URL_);
await page2.evaluate(() => localStorage.clear());
await page2.reload();
await page2.click("[data-signin]");
await page2.waitForSelector("[data-claude]");
check(!(await page2.isVisible(".local-form")), "artifact: offers the Claude account instead of a local profile");
await page2.click("[data-claude]");
await page2.waitForSelector(".article-head h2");
await page2.click(".rauke-fab");
await page2.fill("#rauke-input", "How do I debug this?");
await page2.press("#rauke-input", "Enter");
await page2.waitForFunction(() => document.querySelector(".rauke-msg.bot code") && !document.querySelector(".rauke-msg.streaming"));
const sent = await page2.evaluate(() => window.__samples[0]);
check(Array.isArray(sent) && sent.at(-1).role === "user", "artifact: Rauke asks Claude through the sample capability");
check(/You are Rauke/.test(sent.at(-1).content) && /Reply in: English/.test(sent.at(-1).content) && /How do I debug this\?/.test(sent.at(-1).content), "artifact: the prompt carries Rauke's instructions, context and question");
check((await page2.textContent(".account-via")).includes("Claude"), "artifact: signed in with the Claude account");

if (errors.length) { failures += errors.length; console.log("Page errors:\n" + errors.join("\n")); }
await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nAll account and Rauke checks passed.");
process.exit(failures ? 1 : 0);
