// Local server: static files + the /api functions (same handlers Vercel runs).
//   ANTHROPIC_API_KEY=... GOOGLE_CLIENT_ID=... node scripts/dev-server.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] || process.env.PORT || 8080);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".svg": "image/svg+xml", ".wasm": "application/wasm", ".zip": "application/zip", ".map": "application/json",
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");
  try {
    const api = /^\/api\/([\w-]+)$/.exec(url.pathname);
    if (api) {
      const mod = await import(pathToFileURL(join(root, "api", api[1] + ".mjs")).href).catch(() => null);
      if (!mod) { res.statusCode = 404; return res.end("Not found"); }
      return await mod.default(req, res);
    }
    let file = normalize(join(root, decodeURIComponent(url.pathname)));
    if (!file.startsWith(root) || /[\\/](node_modules|\.git|api)[\\/]/.test(file.slice(root.length))) { res.statusCode = 403; return res.end(); }
    if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.setHeader("Content-Type", TYPES[extname(file)] || "application/octet-stream");
    res.end(body);
  } catch (e) {
    res.statusCode = e.code === "ENOENT" ? 404 : 500;
    res.end(res.statusCode === 404 ? "Not found" : "Server error");
  }
});
server.listen(port, () => console.log(`Codle on http://localhost:${port}`));
