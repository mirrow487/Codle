// GET /api/config -> public settings the browser needs (no secrets).
export default function handler(req, res) {
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.end(JSON.stringify({
    googleClientId: process.env.GOOGLE_CLIENT_ID || "",
    raukeAvailable: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.ANTHROPIC_API_KEY),
  }));
}
