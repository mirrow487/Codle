// POST /api/rauke  ->  streams Rauke's answer as plain text.
// Requires: ANTHROPIC_API_KEY and GOOGLE_CLIENT_ID environment variables.
// The caller must send a Google ID token: Authorization: Bearer <id_token>.
import Anthropic from "@anthropic-ai/sdk";
import { buildMessages, streamAnswer, verifyGoogleToken, rateLimited } from "./_lib/rauke.mjs";

export const config = { maxDuration: 60 };

function send(res, status, obj) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(obj));
}

async function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body);
  const chunks = [];
  let size = 0;
  for await (const c of req) {
    size += c.length;
    if (size > 64 * 1024) throw { status: 413, message: "request too large" };
    chunks.push(c);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

export default async function handler(req, res, deps = {}) {
  if (req.method !== "POST") return send(res, 405, { error: "method_not_allowed" });
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!process.env.ANTHROPIC_API_KEY && !deps.skipKeyCheck) return send(res, 503, { error: "not_configured" });
  if (!clientId) return send(res, 503, { error: "not_configured" });

  const auth = String(req.headers.authorization || "");
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  let user;
  try {
    user = await verifyGoogleToken(token, clientId, deps.fetch);
  } catch {
    return send(res, 502, { error: "auth_check_failed" });
  }
  if (!user) return send(res, 401, { error: "unauthorized" });
  if (rateLimited(user.sub)) return send(res, 429, { error: "rate_limited" });

  let messages;
  try {
    messages = buildMessages(await readBody(req));
  } catch (e) {
    return send(res, e.status || 400, { error: "bad_request", message: e.message || "invalid JSON" });
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Accel-Buffering", "no");
  try {
    const final = await streamAnswer(messages, (text) => res.write(text));
    if (final.stop_reason === "refusal") res.write("\n\n[[refusal]]");
    else if (final.stop_reason === "max_tokens") res.write("\n\n[[truncated]]");
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) res.write("\n\n[[rate_limited]]");
    else if (err instanceof Anthropic.APIError) res.write(`\n\n[[error:${err.status || "api"}]]`);
    else res.write("\n\n[[error:network]]");
    console.error("rauke:", err);
  }
  res.end();
}
