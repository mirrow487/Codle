// Builds codle.html: the whole app in one file (CSS, scripts, content, and
// worker sources inlined), so it works when opened on its own, from disk or
// in any HTML viewer. Python still downloads Pyodide from jsDelivr on first run.
//   node scripts/build-standalone.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => readFileSync(join(root, f), "utf8");
const safe = (js) => js.replace(/<\/(script)/gi, "<\\/$1").replace(/<!--/g, "<\\!--");

let html = read("index.html");

// Inline local stylesheets.
html = html.replace(/<link rel="stylesheet" href="((?:css|js)\/[^"]+)">/g, (_, f) => `<style>\n${read(f)}\n</style>`);

// Worker sources with their importScripts dependencies inlined.
const workers = {
  "js-worker": read("js/format.js") + "\n" + read("js/js-worker.js").replace(/importScripts\("format\.js"\);/, ""),
  "lua-worker": "self.window = self;\n" + read("js/vendor/fengari-web.js") + "\n" + read("js/lua-runner.js") + "\n" +
    read("js/lua-worker.js").replace(/importScripts\([^)]*\);/, "").replace(/self\.window = self;/, ""),
  "py-worker": read("js/py-worker.js"),
};
const workerScript = `<script>window.CODLE_WORKERS = ${safe(JSON.stringify(workers))};</script>`;

// Inline local scripts; add the main-thread fallbacks (format, Fengari) before runners.
html = html.replace(/<script src="(js\/[^"]+)"><\/script>/g, (_, f) => {
  let extra = "";
  if (f === "js/runners.js") {
    extra = ["js/format.js", "js/vendor/fengari-web.js", "js/lua-runner.js", "js/vendor/anthropic-sdk.js"].map((d) => `<script>\n${safe(read(d))}\n</script>\n`).join("") + workerScript + "\n";
  }
  return extra + `<script>\n${safe(read(f))}\n</script>`;
});

// Embed images (logo, mascot, favicon) as data URIs, wherever they are referenced.
const mime = { webp: "image/webp", png: "image/png", svg: "image/svg+xml" };
html = html.replace(/assets\/([\w-]+)\.(webp|png|svg)/g, (_, name, ext) =>
  `data:${mime[ext]};base64,` + readFileSync(join(root, `assets/${name}.${ext}`)).toString("base64"));

if (/(src|href)="(css|js|assets)\//.test(html)) throw new Error("A local reference was not inlined");
writeFileSync(join(root, "codle.html"), html);
console.log(`Wrote codle.html (${(html.length / 1024).toFixed(0)} KB)`);
