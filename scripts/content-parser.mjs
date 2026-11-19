// Parses Codle's lesson files (content/*.md) into structured data.
//
// File format (top-level "# " headings start a block; fenced code is opaque):
//
//   # Lesson: Title          meta lines (key: value), prose, then
//                            ## Example (fenced code) and ## Output (fenced text)
//   # Quiz                   ## Q: question, optional fenced code, "- [ ]"/"- [x]"
//                            options, "explain:" text, optional "verify: yes"
//                            (run the code; output must equal the correct option)
//                            or "check: <js expr>" (HTML: evaluated in the preview)
//   # Challenge: Title       meta lines, prompt prose, ## Starter, ## Solution,
//                            ## Expected (stdout) or ## Tests ("- label :: js expr"),
//                            ## Hints ("- hint")
//   # Playground             one fenced code block
import { existsSync, readFileSync } from "node:fs";

export const LANGUAGES = [
  {
    id: "python", name: "Python", file: "python.md", mode: "python", filename: "main.py",
    runtime: "Python 3.12 · Pyodide, runs in your browser", runner: "local",
    tagline: "Readable, batteries-included, and everywhere from data science to the script that renames your holiday photos.",
  },
  {
    id: "javascript", name: "JavaScript", file: "javascript.md", mode: "javascript", filename: "main.js",
    runtime: "JavaScript · runs in your browser, console output formatted like Node.js", runner: "local",
    tagline: "The language of the web. Quirky in places, extremely capable everywhere.",
  },
  {
    id: "html", name: "HTML & CSS", file: "html.md", mode: "htmlmixed", filename: "index.html",
    runtime: "HTML & CSS · live preview in a sandboxed frame", runner: "preview",
    tagline: "HTML says what things are. CSS says how they look. Together they are every web page you have ever seen.",
  },
  {
    id: "lua", name: "Lua", file: "lua.md", mode: "lua", filename: "main.lua",
    runtime: "Lua 5.3 · Fengari, runs in your browser", runner: "local",
    tagline: "Tiny, fast, and embedded in more games and tools than you would guess. Arrays start at 1; make peace with it.",
  },
  {
    id: "csharp", name: "C#", file: "csharp.md", mode: "text/x-csharp", filename: "Program.cs",
    runtime: "C# · compiled on a remote .NET/Mono compiler", runner: "remote",
    tagline: "Statically typed, tidy, and the backbone of .NET apps and Unity games.",
  },
  {
    id: "cpp", name: "C++", file: "cpp.md", mode: "text/x-c++src", filename: "main.cpp",
    runtime: "C++17 · compiled on a remote GCC", runner: "remote",
    tagline: "Close to the metal and famously powerful. It trusts you completely, which is both the feature and the warning.",
  },
  {
    id: "java", name: "Java", file: "java.md", mode: "text/x-java", filename: "Main.java",
    runtime: "Java 21 · compiled on a remote JDK", runner: "remote",
    tagline: "Verbose on purpose, portable by design, and still running a remarkable share of the world's backends.",
  },
];

function fenceInfo(line) {
  const m = /^```\s*([\w+#-]*)\s*$/.exec(line);
  return m ? m[1] || "" : null;
}

// Splits text into top-level blocks while respecting code fences.
function splitTop(lines) {
  const blocks = [];
  let cur = null;
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) inFence = !inFence;
    if (!inFence && /^# /.test(line)) {
      cur = { head: line.slice(2).trim(), lines: [] };
      blocks.push(cur);
      continue;
    }
    if (cur) cur.lines.push(line);
  }
  return blocks;
}

function splitSections(lines) {
  const sections = [{ head: null, lines: [] }];
  let inFence = false;
  for (const line of lines) {
    if (line.startsWith("```")) inFence = !inFence;
    if (!inFence && /^## /.test(line)) {
      sections.push({ head: line.slice(3).trim(), lines: [] });
      continue;
    }
    sections[sections.length - 1].lines.push(line);
  }
  return sections;
}

function firstFence(lines) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (start === -1 && fenceInfo(lines[i]) !== null) { start = i; continue; }
    if (start !== -1 && lines[i].startsWith("```")) {
      return { lang: fenceInfo(lines[start]), code: lines.slice(start + 1, i).join("\n"), end: i };
    }
  }
  return null;
}

function trimBlank(lines) {
  let a = 0, b = lines.length;
  while (a < b && !lines[a].trim()) a++;
  while (b > a && !lines[b - 1].trim()) b--;
  return lines.slice(a, b);
}

function takeMeta(lines) {
  const meta = {};
  let i = 0;
  while (i < lines.length && !lines[i].trim()) i++;
  for (; i < lines.length; i++) {
    const m = /^([a-z]+):\s*(.*)$/.exec(lines[i]);
    if (!m) break;
    meta[m[1]] = m[2].trim();
  }
  return { meta, rest: lines.slice(i) };
}

function listItems(lines) {
  const items = [];
  for (const line of lines) {
    if (/^- /.test(line)) items.push(line.slice(2).trim());
    else if (items.length && line.trim()) items[items.length - 1] += " " + line.trim();
  }
  return items;
}

function parseLesson(block, ctx) {
  const title = block.head.replace(/^Lesson:\s*/, "");
  const sections = splitSections(block.lines);
  const { meta, rest } = takeMeta(sections[0].lines);
  const lesson = { title, summary: meta.summary || "", body: trimBlank(rest).join("\n") };
  for (const s of sections.slice(1)) {
    const f = firstFence(s.lines);
    if (!f) throw new Error(`${ctx}: section "${s.head}" in lesson "${title}" has no code block`);
    if (s.head === "Example") lesson.example = f.code;
    else if (s.head === "Output") lesson.output = f.code;
    else throw new Error(`${ctx}: unknown lesson section "${s.head}"`);
  }
  if (!lesson.example) throw new Error(`${ctx}: lesson "${title}" has no example`);
  return lesson;
}

function parseQuiz(block, ctx) {
  const sections = splitSections(block.lines).slice(1);
  return sections.map((s) => {
    const question = s.head.replace(/^Q:\s*/, "");
    const q = { question, options: [], answer: -1, explain: "" };
    const f = firstFence(s.lines);
    let lines = s.lines;
    if (f) { q.code = f.code; q.codeLang = f.lang; lines = s.lines.slice(f.end + 1); }
    let mode = null;
    for (const line of lines) {
      const opt = /^- \[( |x)\] (.*)$/.exec(line);
      if (opt) {
        if (opt[1] === "x") q.answer = q.options.length;
        q.options.push(opt[2]);
        mode = null;
        continue;
      }
      const kv = /^(explain|verify|check):\s*(.*)$/.exec(line);
      if (kv) {
        mode = kv[1];
        if (kv[1] === "explain") q.explain = kv[2];
        else if (kv[1] === "verify") q.verify = kv[2] === "yes";
        else q.check = kv[2];
        continue;
      }
      if (mode === "explain" && line.trim()) q.explain += " " + line.trim();
    }
    if (q.answer < 0) throw new Error(`${ctx}: quiz question "${question}" has no correct option`);
    return q;
  });
}

function parseChallenge(block, ctx) {
  const title = block.head.replace(/^Challenge:\s*/, "");
  const sections = splitSections(block.lines);
  const { meta, rest } = takeMeta(sections[0].lines);
  const ch = { title, kind: meta.kind || "Task", prompt: trimBlank(rest).join("\n"), hints: [] };
  for (const s of sections.slice(1)) {
    if (s.head === "Hints") { ch.hints = listItems(s.lines); continue; }
    if (s.head === "Tests") {
      ch.tests = listItems(s.lines).map((t) => {
        const [label, expr] = t.split(" :: ");
        if (!expr) throw new Error(`${ctx}: malformed test "${t}"`);
        return { label: label.trim(), expr: expr.trim() };
      });
      continue;
    }
    const f = firstFence(s.lines);
    if (!f) throw new Error(`${ctx}: section "${s.head}" in challenge "${title}" has no code block`);
    if (s.head === "Starter") ch.starter = f.code;
    else if (s.head === "Solution") ch.solution = f.code;
    else if (s.head === "Expected") ch.expected = f.code;
    else throw new Error(`${ctx}: unknown challenge section "${s.head}"`);
  }
  if (!ch.starter || !ch.solution) throw new Error(`${ctx}: challenge "${title}" needs Starter and Solution`);
  if (ch.expected === undefined && !ch.tests) throw new Error(`${ctx}: challenge "${title}" needs Expected or Tests`);
  return ch;
}

export function parseLanguage(lang, dir) {
  const text = readFileSync(`${dir}/${lang.file}`, "utf8").replace(/\r\n/g, "\n");
  const blocks = splitTop(text.split("\n"));
  const out = { ...lang, lessons: [], quiz: [], challenges: [], playground: "" };
  for (const b of blocks) {
    const ctx = `${lang.file}`;
    if (/^Lesson:/.test(b.head)) out.lessons.push(parseLesson(b, ctx));
    else if (b.head === "Quiz") out.quiz.push(...parseQuiz(b, ctx));
    else if (/^Challenge:/.test(b.head)) out.challenges.push(parseChallenge(b, ctx));
    else if (b.head === "Playground") out.playground = (firstFence(b.lines) || {}).code || "";
    else throw new Error(`${ctx}: unknown block "# ${b.head}"`);
  }
  delete out.file;
  return out;
}

export function parseAll(dir) {
  return LANGUAGES.filter((l) => existsSync(`${dir}/${l.file}`)).map((l) => parseLanguage(l, dir));
}
