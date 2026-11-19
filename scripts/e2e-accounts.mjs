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

// Bring your own key: Groq and Claude, straight from the browser (both providers faked).
console.log("Own API key (Groq and Claude, faked)");
const page3 = await browser.newPage({ viewport: { width: 1280, height: 900 }, locale: "tr-TR" });
page3.on("pageerror", (e) => errors.push(e.message));
const seen = { server: 0, groq: null, claude: null, claudeHeaders: null };
await page3.route("https://accounts.google.com/gsi/client", (r) => r.fulfill({ contentType: "text/javascript", body: FAKE_GSI }));
await page3.route("**/api/config", (r) => r.fulfill({ contentType: "application/json", body: JSON.stringify({ googleClientId: "test.apps.googleusercontent.com", raukeAvailable: false }) }));
await page3.route("**/api/rauke", (r) => { seen.server++; r.fulfill({ status: 503, body: "{}" }); });
const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
await page3.route("https://api.groq.com/**", async (r) => {
  if (r.request().method() === "OPTIONS") return r.fulfill({ status: 204, headers: cors });
  const auth = r.request().headers()["authorization"];
  if (auth !== "Bearer gsk_test") return r.fulfill({ status: 401, headers: cors, contentType: "application/json", body: JSON.stringify({ error: { message: "Invalid API Key" } }) });
  if (r.request().url().endsWith("/models")) {
    return r.fulfill({ headers: cors, contentType: "application/json", body: JSON.stringify({ data: [{ id: "whisper-large-v3", active: true }, { id: "llama-3.3-70b-versatile", active: true }, { id: "llama-3.1-8b-instant", active: true }] }) });
  }
  seen.groq = JSON.parse(r.request().postData());
  const sse = ["Önce ", "`range` ", "sınırına bak."].map((c) => "data: " + JSON.stringify({ choices: [{ delta: { content: c } }] }) + "\n\n").join("") + "data: [DONE]\n\n";
  return r.fulfill({ headers: { ...cors, "content-type": "text/event-stream" }, body: sse });
});
const ev = (type, data) => `event: ${type}\ndata: ${JSON.stringify({ type, ...data })}\n\n`;
await page3.route("https://api.anthropic.com/**", async (r) => {
  if (r.request().method() === "OPTIONS") return r.fulfill({ status: 204, headers: cors });
  if (r.request().url().includes("/v1/models")) {
    return r.fulfill({ headers: cors, contentType: "application/json", body: JSON.stringify({ data: ["claude-opus-5-5", "claude-sonnet-5-5", "claude-haiku-5-5"].map((id) => ({ type: "model", id, display_name: id, created_at: "2026-01-01T00:00:00Z" })), has_more: false, first_id: "a", last_id: "b" }) });
  }
  seen.claude = JSON.parse(r.request().postData());
  seen.claudeHeaders = r.request().headers();
  const body = ev("message_start", { message: { id: "msg_1", type: "message", role: "assistant", model: seen.claude.model, content: [], stop_reason: null, stop_sequence: null, usage: { input_tokens: 10, output_tokens: 1 } } }) +
    ev("content_block_start", { index: 0, content_block: { type: "text", text: "" } }) +
    ev("content_block_delta", { index: 0, delta: { type: "text_delta", text: "Claude der ki: " } }) +
    ev("content_block_delta", { index: 0, delta: { type: "text_delta", text: "`print(i)` ekle." } }) +
    ev("content_block_stop", { index: 0 }) +
    ev("message_delta", { delta: { stop_reason: "end_turn", stop_sequence: null }, usage: { output_tokens: 8 } }) +
    ev("message_stop", {});
  return r.fulfill({ headers: { ...cors, "content-type": "text/event-stream" }, body });
});
await page3.goto(URL_);
await page3.evaluate(() => localStorage.clear());
await page3.reload();
await page3.click("[data-signin]");
await page3.click("#fake-google");
await page3.waitForSelector(".article-head h2");
await page3.click(".rauke-fab");
await page3.waitForSelector(".byok");
check(true, "byok: with no key and no server, Rauke opens on the key setup screen");
await page3.fill("#byok-key", "gsk_wrong");
await page3.click(".byok button[type=submit]");
await page3.waitForSelector(".byok-status.bad");
check((await page3.textContent(".byok-status")).includes("kabul etmedi"), "byok: a wrong Groq key is reported");
await page3.fill("#byok-key", "gsk_test");
await page3.click(".byok button[type=submit]");
await page3.waitForSelector(".byok-status.ok");
const groqModels = await page3.$$eval("#byok-model option", (o) => o.map((x) => x.value));
check(!groqModels.includes("whisper-large-v3") && (await page3.inputValue("#byok-model")) === "llama-3.3-70b-versatile", "byok: Groq chat models are listed and a strong one is picked");
const stored = await page3.evaluate(() => JSON.parse(localStorage.getItem("codle:u:g_42:rauke")));
check(stored && stored.provider === "groq" && stored.key === "gsk_test", "byok: the key is stored for this account in this browser");
await page3.click(".byok-back");
await page3.fill("#rauke-input", "Döngüm neden 5'e kadar gitmiyor?");
await page3.press("#rauke-input", "Enter");
await page3.waitForFunction(() => document.querySelector(".rauke-msg.bot code") && !document.querySelector(".rauke-msg.streaming"));
check((await page3.textContent(".rauke-list")).includes("sınırına bak"), "byok: Groq's streamed answer is shown");
check(seen.groq && seen.groq.model === "llama-3.3-70b-versatile" && seen.groq.messages[0].role === "system" && /You are Rauke/.test(seen.groq.messages[0].content), "byok: Groq gets Rauke's instructions and the chosen model");
check(seen.groq && /Reply in: Turkish/.test(seen.groq.messages.at(-1).content) && /def |print|name/.test(seen.groq.messages.at(-1).content), "byok: Groq gets the learning context and code");
check(seen.server === 0, "byok: nothing is sent to Codle's server");

// Switch to Claude.
await page3.click(".rauke-keys");
await page3.check('input[name="byok-provider"][value="claude"]');
await page3.fill("#byok-key", "sk-ant-test");
await page3.click(".byok button[type=submit]");
await page3.waitForSelector(".byok-status.ok", { timeout: 20000 });
check((await page3.inputValue("#byok-model")) === "claude-opus-5-5", "byok: Claude defaults to Opus 5.5");
await page3.click(".byok-back");
await page3.fill("#rauke-input", "Bir ipucu ver");
await page3.press("#rauke-input", "Enter");
await page3.waitForFunction(() => /Claude der ki/.test(document.querySelector(".rauke-list").textContent) && !document.querySelector(".rauke-msg.streaming"));
check(true, "byok: Claude's streamed answer is shown (official SDK in the browser)");
const h = seen.claudeHeaders || {};
check((h["x-api-key"] === "sk-ant-test" || h["authorization"] === "Bearer sk-ant-test") && h["anthropic-dangerous-direct-browser-access"] === "true", "byok: the Claude request goes straight to Anthropic with the learner's key");
check(seen.claude && seen.claude.model === "claude-opus-5-5" && seen.claude.fallbacks === "default" && seen.claude.output_config.effort === "low", "byok: Claude request uses the chosen model, low effort and fallbacks");
check(seen.claude && seen.claude.system[0].text.startsWith("You are Rauke") && seen.claude.messages.length === 3, "byok: Claude gets the system prompt and the conversation");

// Remove the key.
await page3.click(".rauke-keys");
await page3.click(".byok-remove");
check(await page3.evaluate(() => localStorage.getItem("codle:u:g_42:rauke") === null), "byok: removing the key deletes it from the browser");

if (errors.length) { failures += errors.length; console.log("Page errors:\n" + errors.join("\n")); }
await browser.close();
console.log(failures ? `\n${failures} failure(s)` : "\nAll account and Rauke checks passed.");
process.exit(failures ? 1 : 0);
