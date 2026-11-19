// Tests for api/rauke.mjs and api/config.mjs with a fake Claude client and a
// fake Google tokeninfo endpoint. Makes no network calls and spends nothing.
//   node scripts/test-api.mjs
import { Readable } from "node:stream";
import assert from "node:assert/strict";
import handler from "../api/rauke.mjs";
import configHandler from "../api/config.mjs";
import { buildMessages, formatContext, _setClient, MODEL, SYSTEM_PROMPT, verifyGoogleToken } from "../api/_lib/rauke.mjs";

let passed = 0;
async function test(name, fn) {
  try { await fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { console.log("  ✗ " + name + "\n    " + (e.stack || e)); process.exitCode = 1; }
}

function req({ method = "POST", headers = {}, body } = {}) {
  const r = Readable.from(body === undefined ? [] : [Buffer.from(typeof body === "string" ? body : JSON.stringify(body))]);
  r.method = method;
  r.headers = headers;
  return r;
}
function res() {
  const r = { statusCode: 0, headers: {}, chunks: [], ended: false };
  r.setHeader = (k, v) => { r.headers[k.toLowerCase()] = v; };
  r.write = (c) => { r.chunks.push(String(c)); return true; };
  r.end = (c) => { if (c) r.chunks.push(String(c)); r.ended = true; };
  r.text = () => r.chunks.join("");
  return r;
}

const CLIENT_ID = "test-client.apps.googleusercontent.com";
function tokenFetch(info, ok = true) {
  return async (url) => {
    assert.match(url, /^https:\/\/oauth2\.googleapis\.com\/tokeninfo\?id_token=/);
    return { ok, json: async () => info };
  };
}
const future = () => String(Math.floor(Date.now() / 1000) + 3600);
const goodInfo = (sub = "123") => ({ aud: CLIENT_ID, iss: "https://accounts.google.com", sub, email: "learner@example.com", exp: future() });

let lastParams = null;
function fakeClient(chunks, stop_reason = "end_turn") {
  return {
    beta: {
      messages: {
        stream(params) {
          lastParams = params;
          const events = chunks.map((text) => ({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text } }));
          return {
            async *[Symbol.asyncIterator]() { for (const e of events) yield e; },
            finalMessage: async () => ({ stop_reason, content: [{ type: "text", text: chunks.join("") }] }),
          };
        },
      },
    },
  };
}

const body = {
  messages: [{ role: "user", content: "Why does my loop print 0 to 4?" }],
  context: { locale: "tr", language: "Python", view: "lesson", title: "Loops", code: "for i in range(5):\n    print(i)", output: "0\n1\n2\n3\n4" },
};

console.log("api/rauke");
process.env.GOOGLE_CLIENT_ID = CLIENT_ID;
process.env.ANTHROPIC_API_KEY = "test-key";

await test("rejects GET", async () => {
  const r = res(); await handler(req({ method: "GET" }), r);
  assert.equal(r.statusCode, 405);
});

await test("503 when not configured", async () => {
  const saved = process.env.GOOGLE_CLIENT_ID; delete process.env.GOOGLE_CLIENT_ID;
  const r = res(); await handler(req({ body }), r);
  process.env.GOOGLE_CLIENT_ID = saved;
  assert.equal(r.statusCode, 503);
});

await test("401 without a token", async () => {
  const r = res(); await handler(req({ body }), r, { fetch: tokenFetch(goodInfo()) });
  assert.equal(r.statusCode, 401);
});

await test("401 when the token is for another app", async () => {
  const r = res();
  await handler(req({ body, headers: { authorization: "Bearer other" } }), r, { fetch: tokenFetch({ ...goodInfo(), aud: "someone-else" }) });
  assert.equal(r.statusCode, 401);
});

await test("401 when Google rejects the token", async () => {
  const r = res();
  await handler(req({ body, headers: { authorization: "Bearer bad" } }), r, { fetch: tokenFetch({ error: "invalid_token" }, false) });
  assert.equal(r.statusCode, 401);
});

await test("400 on a malformed conversation", async () => {
  _setClient(fakeClient(["x"]));
  const r = res();
  await handler(req({ body: { messages: [{ role: "assistant", content: "hi" }] }, headers: { authorization: "Bearer t-bad-body" } }), r, { fetch: tokenFetch(goodInfo("b")) });
  assert.equal(r.statusCode, 400);
});

await test("streams Claude's answer for a signed-in learner", async () => {
  _setClient(fakeClient(["`range(5)` ", "stops before 5."]));
  const r = res();
  await handler(req({ body, headers: { authorization: "Bearer t-ok" } }), r, { fetch: tokenFetch(goodInfo("ok")) });
  assert.equal(r.statusCode, 200);
  assert.equal(r.headers["content-type"], "text/plain; charset=utf-8");
  assert.equal(r.text(), "`range(5)` stops before 5.");
  assert.ok(r.ended);
});

await test("request uses the default model, fallbacks, cached system prompt and the learner's context", async () => {
  assert.equal(lastParams.model, MODEL);
  assert.equal(lastParams.model, "claude-opus-5-5");
  assert.equal(lastParams.fallbacks, "default");
  assert.deepEqual(lastParams.betas, ["server-side-fallback-2026-07-01"]);
  assert.equal(lastParams.system[0].text, SYSTEM_PROMPT);
  assert.deepEqual(lastParams.system[0].cache_control, { type: "ephemeral" });
  assert.equal(lastParams.thinking, undefined);
  const last = lastParams.messages.at(-1);
  assert.equal(last.role, "user");
  assert.match(last.content[0].text, /Reply in: Turkish/);
  assert.match(last.content[0].text, /for i in range\(5\)/);
  assert.equal(last.content[1].text, body.messages[0].content);
});

await test("marks refusals for the client", async () => {
  _setClient(fakeClient([""], "refusal"));
  const r = res();
  await handler(req({ body, headers: { authorization: "Bearer t-ref" } }), r, { fetch: tokenFetch(goodInfo("ref")) });
  assert.equal(r.text(), "\n\n[[refusal]]");
});

await test("rate-limits a single learner after 30 questions an hour", async () => {
  _setClient(fakeClient(["ok"]));
  let last;
  for (let i = 0; i < 31; i++) {
    last = res();
    await handler(req({ body, headers: { authorization: "Bearer t-rl" } }), last, { fetch: tokenFetch(goodInfo("rl")) });
  }
  assert.equal(last.statusCode, 429);
});

console.log("validation");
await test("buildMessages caps and checks the conversation", () => {
  const msg = (re) => (e) => e.status === 400 && re.test(e.message);
  assert.throws(() => buildMessages({}), msg(/non-empty/));
  assert.throws(() => buildMessages({ messages: Array(21).fill({ role: "user", content: "x" }) }), msg(/at most/));
  assert.throws(() => buildMessages({ messages: [{ role: "system", content: "x" }] }), msg(/invalid message/));
  const m = buildMessages({ messages: [{ role: "user", content: "x".repeat(10000) }] });
  assert.ok(m[0].content[1].text.length < 4100);
});
await test("formatContext defaults to English and truncates long code", () => {
  const c = formatContext({ code: "a".repeat(20000) });
  assert.match(c, /Reply in: English/);
  assert.match(c, /\[truncated\]/);
});
await test("verifyGoogleToken rejects expired tokens", async () => {
  const u = await verifyGoogleToken("t-exp", CLIENT_ID, tokenFetch({ ...goodInfo(), exp: "1000" }));
  assert.equal(u, null);
});

console.log("api/config");
await test("exposes only public settings", async () => {
  const r = res(); configHandler(req({ method: "GET" }), r);
  const j = JSON.parse(r.text());
  assert.deepEqual(Object.keys(j).sort(), ["googleClientId", "raukeAvailable"]);
  assert.equal(j.googleClientId, CLIENT_ID);
  assert.equal(j.raukeAvailable, true);
  assert.ok(!r.text().includes("test-key"));
});

console.log(`\n${passed} passed${process.exitCode ? ", some failed" : ""}`);
