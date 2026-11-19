// Builds dist/artifact/: a copy of the app shaped for hosts that wrap the page
// in their own <html>/<head>/<body> (e.g. a claude.ai Artifact). The page keeps
// its scripts as files (workers need them) and inlines its own CSS.
//   node scripts/build-artifact.mjs
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist/artifact");
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const html = readFileSync(join(root, "index.html"), "utf8");
const head = /<head>([\s\S]*?)<\/head>/.exec(html)[1];
const body = /<body>([\s\S]*?)<\/body>/.exec(html)[1];
const css = (f) => readFileSync(join(root, f), "utf8");

const headKept = head
  .split("\n")
  .filter((l) => !/<meta charset|<meta name="viewport"|stylesheet" href="(css|js)\//.test(l))
  .join("\n");
const page =
  headKept.trim() + "\n" +
  "<style>\n" + css("js/vendor/codemirror/codemirror.css") + "\n" + css("css/styles.css") + "\n</style>\n" +
  body.trim() + "\n";
writeFileSync(join(out, "index.html"), page);
cpSync(join(root, "js"), join(out, "js"), { recursive: true });
if (!existsSync(join(out, "js/vendor/pyodide/pyodide.js"))) {
  console.warn("Note: js/vendor/pyodide is missing; run scripts/vendor-pyodide.sh to bundle Python.");
}
console.log("Wrote dist/artifact/");
