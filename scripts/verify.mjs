// Verifies every runnable claim in content/*.md against real toolchains:
//   - each lesson example prints exactly its stated output
//   - each challenge solution passes, and each starter does NOT
//   - each "verify: yes" quiz question prints the option marked correct
//   - HTML challenges/quiz checks pass in a real browser (Playwright)
//
// Toolchains: python3, node, fengari (npm), g++, javac/java, mcs/mono.
//   node scripts/verify.mjs [languageId ...]
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { parseAll } from "./content-parser.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const only = process.argv.slice(2);

const norm = (s) => s.replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, "");

function sh(cmd, args, opts = {}) {
  try {
    const out = execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], timeout: 30000, ...opts });
    return { stdout: out, stderr: "", ok: true };
  } catch (e) {
    return { stdout: e.stdout || "", stderr: (e.stderr || "") + (e.message || ""), ok: false };
  }
}

function withDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), "codle-"));
  try { return fn(dir); } finally { rmSync(dir, { recursive: true, force: true }); }
}

const WRAP = {
  cpp: (c) => /\bmain\s*\(/.test(c) ? c : `#include <iostream>\n#include <string>\n#include <vector>\n#include <map>\nint main() {\n${c}\n}\n`,
  java: (c) => /static void main/.test(c) ? c : `import java.util.*;\npublic class Main {\npublic static void main(String[] args) {\n${c}\n}\n}\n`,
  csharp: (c) => /static void Main/.test(c) ? c : `using System;\nusing System.Collections.Generic;\nusing System.Linq;\nclass Program {\nstatic void Main() {\n${c}\n}\n}\n`,
};

const FORMAT_SHIM = join(root, "js/format.js");

const RUN = {
  python: (code) => withDir((d) => { writeFileSync(join(d, "main.py"), code); return sh("python3", [join(d, "main.py")]); }),
  javascript: (code) => withDir((d) => {
    // Run with Codle's console formatter AND with real Node; both must agree.
    const shim = `const __f = require(${JSON.stringify(FORMAT_SHIM)});\n` +
      `console.log = (...a) => process.stdout.write(__f.formatArgs(a) + "\\n");\n`;
    writeFileSync(join(d, "codle.js"), shim + code);
    writeFileSync(join(d, "node.js"), code);
    const a = sh("node", [join(d, "codle.js")]);
    const b = sh("node", [join(d, "node.js")]);
    if (norm(a.stdout) !== norm(b.stdout)) {
      return { stdout: a.stdout, stderr: `Codle formatter differs from Node:\n--- codle\n${a.stdout}--- node\n${b.stdout}`, ok: false };
    }
    return a;
  }),
  lua: (code) => {
    const r = require(join(root, "js/lua-runner.js")).runLua(require("fengari"), code);
    return { stdout: r.stdout, stderr: r.error || "", ok: !r.error };
  },
  cpp: (code) => withDir((d) => {
    writeFileSync(join(d, "main.cpp"), WRAP.cpp(code));
    const c = sh("g++", ["-std=c++17", "-Wall", "-Wextra", "-o", join(d, "a.out"), join(d, "main.cpp")]);
    if (!c.ok) return c;
    return sh(join(d, "a.out"), []);
  }),
  java: (code) => withDir((d) => {
    writeFileSync(join(d, "Main.java"), WRAP.java(code));
    return sh("java", [join(d, "Main.java")], { env: { ...process.env, JAVA_TOOL_OPTIONS: "", _JAVA_OPTIONS: "" } });
  }),
  csharp: (code) => withDir((d) => {
    writeFileSync(join(d, "Program.cs"), WRAP.csharp(code));
    const c = sh("mcs", ["-out:" + join(d, "p.exe"), join(d, "Program.cs")]);
    if (!c.ok) return c;
    return sh("mono", [join(d, "p.exe")]);
  }),
};

let failures = 0, checks = 0;
function report(ok, label, detail) {
  checks++;
  if (ok) return;
  failures++;
  console.log(`\n✗ ${label}\n${detail}`);
}

const optionText = (o) => o.replace(/^`|`$/g, "").replace(/\\n/g, "\n");

async function verifyHtml(lang) {
  const { chromium } = require("playwright");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 900, height: 700 } });
  const evalAll = async (html, exprs) => {
    await page.setContent(html, { waitUntil: "load" });
    await page.waitForTimeout(50);
    return page.evaluate((list) => list.map((e) => { try { return !!(new Function("return (" + e + ")"))(); } catch { return false; } }), exprs);
  };
  for (const l of lang.lessons) {
    const errors = [];
    page.removeAllListeners("pageerror");
    page.on("pageerror", (e) => errors.push(e.message));
    await page.setContent(l.example, { waitUntil: "load" });
    report(errors.length === 0, `html lesson "${l.title}" runs without errors`, errors.join("\n"));
  }
  for (const ch of lang.challenges) {
    const exprs = ch.tests.map((t) => t.expr);
    const sol = await evalAll(ch.solution, exprs);
    report(sol.every(Boolean), `html challenge "${ch.title}" solution passes`, ch.tests.map((t, i) => `${sol[i] ? "✓" : "✗"} ${t.label}`).join("\n"));
    const st = await evalAll(ch.starter, exprs);
    report(!st.every(Boolean), `html challenge "${ch.title}" starter fails`, "starter already passes every test");
  }
  for (const q of lang.quiz) {
    if (!q.check) continue;
    const [res] = await evalAll(q.code, [q.check]);
    report(res, `html quiz "${q.question}" check holds`, q.check);
  }
  await browser.close();
}

const langs = parseAll(join(root, "content")).filter((l) => !only.length || only.includes(l.id));
for (const lang of langs) {
  process.stdout.write(`${lang.name}… `);
  const before = failures;
  if (lang.id === "html") {
    await verifyHtml(lang);
  } else {
    const run = RUN[lang.id];
    for (const l of lang.lessons) {
      const r = run(l.example);
      report(r.ok && norm(r.stdout) === norm(l.output || ""), `${lang.id} lesson "${l.title}" output`,
        `--- expected\n${l.output}\n--- got\n${r.stdout}${r.stderr ? "\n--- stderr\n" + r.stderr : ""}`);
    }
    for (const ch of lang.challenges) {
      const s = run(ch.solution);
      report(s.ok && norm(s.stdout) === norm(ch.expected), `${lang.id} challenge "${ch.title}" solution`,
        `--- expected\n${ch.expected}\n--- got\n${s.stdout}${s.stderr ? "\n--- stderr\n" + s.stderr : ""}`);
      const st = run(ch.starter);
      report(norm(st.stdout) !== norm(ch.expected), `${lang.id} challenge "${ch.title}" starter must not pass`, st.stdout);
    }
    if (lang.playground) {
      const r = run(lang.playground);
      report(r.ok && r.stdout.trim().length > 0, `${lang.id} playground runs`, r.stdout + r.stderr);
    }
    for (const q of lang.quiz) {
      if (!q.verify) continue;
      const r = run(q.code);
      const want = optionText(q.options[q.answer]);
      report(r.ok && norm(r.stdout) === norm(want), `${lang.id} quiz "${q.question}" ${q.code.split("\n")[0]}`,
        `--- expected\n${want}\n--- got\n${r.stdout}${r.stderr ? "\n--- stderr\n" + r.stderr : ""}`);
      for (const [i, o] of q.options.entries()) {
        if (i !== q.answer && norm(optionText(o)) === norm(r.stdout)) report(false, `${lang.id} quiz "${q.question}" distractor ${i} also matches`, o);
      }
    }
  }
  console.log(failures === before ? "ok" : `${failures - before} problem(s)`);
}
console.log(`\n${checks} checks, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
