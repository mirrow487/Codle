/*
 * Codle runners: one async `run(langId, code)` entry point per language.
 *
 *  - JavaScript : Web Worker (real engine), Node-style console formatting.
 *  - Python     : Pyodide (CPython 3.12 on WebAssembly) in a Web Worker.
 *  - Lua        : Fengari (Lua 5.3 in JS) in a Web Worker.
 *  - HTML & CSS : sandboxed iframe preview (handled by the UI, see `htmlDocument`).
 *  - C#, C++, Java: sent to a public compile service (Wandbox, then Compiler
 *    Explorer). If neither is reachable, the UI falls back to the verified
 *    reference output stored with each example.
 *
 * Every run resolves to { stdout, stderr, ok, timedOut?, unreachable?, via? }.
 */
(function () {
  "use strict";

  var JS_TIMEOUT = 5000;
  var LUA_TIMEOUT = 8000;
  var PY_TIMEOUT = 10000;
  var REMOTE_TIMEOUT = 30000;

  function scriptBase() {
    var s = document.querySelector('script[src*="runners.js"]');
    return s ? s.src.replace(/runners\.js.*$/, "") : "js/";
  }
  var BASE = scriptBase();
  // A local copy (js/vendor/pyodide/, see scripts/vendor-pyodide.sh) wins over the CDN.
  var PYODIDE_URLS = [BASE + "vendor/pyodide/", "https://cdn.jsdelivr.net/npm/pyodide@0.26.4/"];
  var runSeq = 0;

  var loaded = {};
  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise(function (resolve, reject) {
        var s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = function () { loaded[src] = null; reject(new Error("Couldn't load " + src)); };
        document.head.appendChild(s);
      });
    }
    return loaded[src];
  }

  /* Workers can't start from file:// pages in some browsers; these run on the main thread instead. */
  function runJavaScriptInline(code) {
    return loadScript(BASE + "format.js").then(function () {
      var out = "", err = "";
      var fmt = window.CodleFormat;
      var fake = {
        log: function () { out += fmt.formatArgs(arguments) + "\n"; },
        error: function () { err += fmt.formatArgs(arguments) + "\n"; },
      };
      fake.info = fake.debug = fake.table = fake.dir = fake.log;
      fake.warn = fake.error;
      try {
        new Function("console", code)(fake);
      } catch (e) {
        err += (e && e.name ? e.name + ": " + e.message : String(e)) + "\n";
      }
      return new Promise(function (resolve) {
        setTimeout(function () { resolve(result(out, err)); }, 300);
      });
    });
  }

  function runLuaInline(code) {
    return loadScript(BASE + "vendor/fengari-web.js")
      .then(function () { return loadScript(BASE + "lua-runner.js"); })
      .then(function () {
        var r = window.CodleLua.runLua(window.fengari, code);
        return result(r.stdout, r.error ? r.error + "\n" : "");
      });
  }

  var inlinePy = null;
  function runPythonInline(code, onStatus) {
    if (!inlinePy) {
      if (onStatus) onStatus("Loading Python… the first run downloads the interpreter (about 12 MB).");
      inlinePy = loadScript(PYODIDE_URLS[1] + "pyodide.js").then(function () {
        return window.loadPyodide({ indexURL: PYODIDE_URLS[1] });
      }).catch(function (e) { inlinePy = null; throw e; });
    }
    return inlinePy.then(function (pyodide) {
      var out = "", err = "";
      pyodide.setStdout({ batched: function (s) { out += s + "\n"; } });
      pyodide.setStderr({ batched: function (s) { err += s + "\n"; } });
      var ns = pyodide.globals.get("dict")();
      return pyodide.runPythonAsync(code, { globals: ns }).catch(function (e) {
        err += String(e.message).split("\n").filter(function (l) { return !/_pyodide|pyodide\.asm/.test(l); }).join("\n") + "\n";
      }).then(function () { ns.destroy(); return result(out, err); });
    }, function (e) {
      return result("", "", { unreachable: true, reason: "The Python interpreter (Pyodide) couldn't start on this page (" + e.message + ")." });
    });
  }

  function result(stdout, stderr, extra) {
    var r = { stdout: stdout || "", stderr: stderr || "", ok: !stderr };
    if (extra) for (var k in extra) r[k] = extra[k];
    return r;
  }

  /* ---------- JavaScript ---------- */
  function runJavaScript(code) {
    return new Promise(function (resolve) {
      var worker;
      try {
        worker = new Worker(BASE + "js-worker.js");
      } catch (err) {
        resolve(runJavaScriptInline(code));
        return;
      }
      var out = "", errOut = "";
      var timer = setTimeout(function () {
        worker.terminate();
        resolve(result(out, errOut + "Execution stopped after " + JS_TIMEOUT / 1000 + "s. Is there an infinite loop?\n", { timedOut: true }));
      }, JS_TIMEOUT);
      worker.onmessage = function (e) {
        var m = e.data;
        started = true;
        if (m.type === "out") {
          if (m.stream === "stderr") errOut += m.text; else out += m.text;
        } else if (m.type === "done") {
          clearTimeout(timer);
          worker.terminate();
          resolve(result(out, errOut));
        }
      };
      var started = false;
      worker.onerror = function (e) {
        e.preventDefault();
        clearTimeout(timer);
        worker.terminate();
        // A worker that fails before saying anything couldn't load at all.
        if (!started) resolve(runJavaScriptInline(code));
        else resolve(result(out, errOut + (e.message || "Worker error") + "\n"));
      };
      worker.postMessage({ code: code });
    });
  }

  /* ---------- Lua ---------- */
  function runLua(code) {
    return new Promise(function (resolve) {
      var worker;
      try {
        worker = new Worker(BASE + "lua-worker.js");
      } catch (err) {
        resolve(runLuaInline(code));
        return;
      }
      var timer = setTimeout(function () {
        worker.terminate();
        resolve(result("", "Execution stopped after " + LUA_TIMEOUT / 1000 + "s. Is there an infinite loop?\n", { timedOut: true }));
      }, LUA_TIMEOUT);
      worker.onmessage = function (e) {
        clearTimeout(timer);
        worker.terminate();
        resolve(result(e.data.stdout, e.data.error ? e.data.error + "\n" : ""));
      };
      worker.onerror = function (e) {
        e.preventDefault();
        clearTimeout(timer);
        worker.terminate();
        resolve(runLuaInline(code));
      };
      worker.postMessage({ code: code });
    });
  }

  /* ---------- Python ---------- */
  var py = { worker: null, ready: false };

  function pyWorker() {
    if (!py.worker) {
      py.worker = new Worker(BASE + "py-worker.js");
      py.ready = false;
    }
    return py.worker;
  }

  function runPython(code, onStatus) {
    return new Promise(function (resolve) {
      var worker;
      try {
        worker = pyWorker();
      } catch (err) {
        resolve(runPythonInline(code, onStatus));
        return;
      }
      var out = "", errOut = "", timer = null, id = ++runSeq;
      if (!py.ready && onStatus) onStatus("Loading Python… the first run downloads the interpreter (about 12 MB).");
      function startTimer() {
        timer = setTimeout(function () {
          worker.terminate();
          py.worker = null;
          resolve(result(out, errOut + "Execution stopped after " + PY_TIMEOUT / 1000 + "s. Is there an infinite loop?\n", { timedOut: true }));
        }, PY_TIMEOUT);
      }
      if (py.ready) startTimer();
      worker.onmessage = function (e) {
        var m = e.data;
        if (m.id !== id) { if (m.type === "ready") py.ready = true; return; }
        if (m.type === "ready") {
          py.ready = true;
          if (!timer) { if (onStatus) onStatus("Running…"); startTimer(); }
        } else if (m.type === "out") {
          if (m.stream === "stderr") errOut += m.text; else out += m.text;
        } else if (m.type === "loaderror") {
          worker.terminate();
          py.worker = null;
          resolve(result("", "", { unreachable: true, reason: "The Python interpreter (Pyodide) couldn't start on this page (" + m.message + ")." }));
        } else if (m.type === "done") {
          clearTimeout(timer);
          resolve(result(out, errOut));
        }
      };
      worker.onerror = function (e) {
        e.preventDefault();
        clearTimeout(timer);
        worker.terminate();
        py.worker = null;
        if (!py.ready) resolve(runPythonInline(code, onStatus));
        else resolve(result(out, "", { unreachable: true, reason: e.message || "Python worker failed to start" }));
      };
      worker.postMessage({ id: id, code: code, urls: PYODIDE_URLS });
    });
  }

  /* ---------- Remote compilers (C#, C++, Java) ---------- */
  var REMOTE = {
    cpp: { wandbox: "C++", godbolt: "c++", rawOptions: "-std=c++17\n-O1", label: "C++" },
    csharp: { wandbox: "C#", godbolt: "csharp", label: "C#" },
    java: { wandbox: "Java", godbolt: "java", label: "Java" },
  };

  function fetchJSON(url, opts) {
    var controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    var t = controller && setTimeout(function () { controller.abort(); }, REMOTE_TIMEOUT);
    opts = opts || {};
    if (controller) opts.signal = controller.signal;
    return fetch(url, opts).then(function (res) {
      if (t) clearTimeout(t);
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }, function (err) {
      if (t) clearTimeout(t);
      throw err;
    });
  }

  function versionKey(name) {
    var nums = (name.match(/\d+/g) || []).map(Number);
    while (nums.length < 4) nums.push(0);
    return nums;
  }
  function newestFirst(a, b) {
    var ka = versionKey(a), kb = versionKey(b);
    for (var i = 0; i < 4; i++) if (ka[i] !== kb[i]) return kb[i] - ka[i];
    return 0;
  }

  var wandboxCompilers = null;
  function wandboxPick(language) {
    var list = wandboxCompilers || (wandboxCompilers = fetchJSON("https://wandbox.org/api/list.json").catch(function (e) { wandboxCompilers = null; throw e; }));
    return list.then(function (all) {
      var cands = all.filter(function (c) { return c.language === language && !/head/.test(c.name); });
      var prefer = { "C++": /^gcc-\d/, "C#": /^(dotnet|mono)/, "Java": /^openjdk/ }[language];
      var preferred = cands.filter(function (c) { return prefer.test(c.name); });
      var pool = (preferred.length ? preferred : cands).map(function (c) { return c.name; }).sort(newestFirst);
      if (!pool.length) throw new Error("No " + language + " compiler on Wandbox");
      return pool[0];
    });
  }

  function viaWandbox(spec, code) {
    return wandboxPick(spec.wandbox).then(function (compiler) {
      var body = { compiler: compiler, code: code, save: false };
      if (spec.rawOptions) body["compiler-option-raw"] = spec.rawOptions;
      return fetchJSON("https://wandbox.org/api/compile.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(function (r) {
        var compileErr = r.compiler_error || "";
        if (/should be declared in a file named/.test(compileErr)) throw new Error("file-name constraint");
        var stderr = "";
        if (compileErr && String(r.status) !== "0" && !r.program_output) stderr += compileErr;
        stderr += r.program_error || "";
        if (r.signal) stderr += "Terminated by " + r.signal + "\n";
        return result(r.program_output || "", stderr, { via: "Wandbox · " + compiler, exitCode: Number(r.status) });
      });
    });
  }

  var godboltCompilers = {};
  function godboltPick(lang) {
    if (!godboltCompilers[lang]) {
      godboltCompilers[lang] = fetchJSON("https://godbolt.org/api/compilers/" + encodeURIComponent(lang) + "?fields=id,name,semver", {
        headers: { Accept: "application/json" },
      }).then(function (list) {
        var pick = list;
        if (lang === "c++") pick = list.filter(function (c) { return /^x86-64 gcc \d/.test(c.name); });
        if (lang === "csharp") pick = list.filter(function (c) { return /\.NET/.test(c.name) && !/trunk/i.test(c.name); });
        if (lang === "java") pick = list.filter(function (c) { return /jdk/i.test(c.name) && !/trunk/i.test(c.name); });
        if (!pick.length) pick = list;
        pick.sort(function (a, b) { return newestFirst(a.semver || a.name, b.semver || b.name); });
        if (!pick.length) throw new Error("No compiler");
        return pick[0];
      }).catch(function (e) { godboltCompilers[lang] = null; throw e; });
    }
    return godboltCompilers[lang];
  }

  function joinLines(arr) {
    return (arr || []).map(function (l) { return l.text; }).join("\n");
  }

  function viaGodbolt(spec, code) {
    return godboltPick(spec.godbolt).then(function (compiler) {
      return fetchJSON("https://godbolt.org/api/compiler/" + encodeURIComponent(compiler.id) + "/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          source: code,
          lang: spec.godbolt,
          options: {
            userArguments: spec.godbolt === "c++" ? "-std=c++17 -O1" : "",
            executeParameters: { args: [], stdin: "" },
            compilerOptions: { executorRequest: true },
            filters: { execute: true },
            tools: [],
            libraries: [],
          },
          allowStoreCodeDebug: false,
        }),
      }).then(function (r) {
        var exec = r.execResult || r;
        var build = exec.buildResult || r.buildResult || {};
        var stdout = joinLines(exec.stdout);
        var stderr = "";
        if (build.code && build.code !== 0) stderr += joinLines(build.stderr) || joinLines(build.stdout);
        else stderr += joinLines(exec.stderr);
        if (stdout && !/\n$/.test(stdout)) stdout += "\n";
        if (stderr && !/\n$/.test(stderr)) stderr += "\n";
        return result(stdout, stderr, { via: "Compiler Explorer · " + compiler.name, exitCode: exec.code });
      });
    });
  }

  function runRemote(langId, code, onStatus) {
    var spec = REMOTE[langId];
    if (onStatus) onStatus("Compiling on a remote " + spec.label + " compiler…");
    return viaWandbox(spec, code).catch(function () {
      if (onStatus) onStatus("Trying another compile service…");
      return viaGodbolt(spec, code);
    }).catch(function (err) {
      return result("", "", {
        unreachable: true,
        reason: "The compile service couldn't be reached from this page (" + (err && err.message || "network error") + ").",
      });
    });
  }

  /* ---------- HTML & CSS ---------- */
  /*
   * Builds a preview document: the learner's HTML with a small console bridge
   * injected first, plus optional checks that run after the page loads.
   */
  function htmlDocument(code, channel, checks) {
    var bridge =
      "<script>(function(){var ch=" + JSON.stringify(channel) + ";" +
      "function send(s,a){try{parent.postMessage({codle:ch,stream:s,text:Array.prototype.map.call(a,function(x){return typeof x==='string'?x:(function(){try{return JSON.stringify(x)}catch(e){return String(x)}})()}).join(' ')},'*')}catch(e){}}" +
      "['log','info','warn','error'].forEach(function(m){var o=console[m];console[m]=function(){send(m==='warn'||m==='error'?'stderr':'stdout',arguments);o&&o.apply(console,arguments)}});" +
      "window.addEventListener('error',function(e){send('stderr',[e.message+(e.lineno?' (line '+e.lineno+')':'')])});" +
      "document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href]');if(a&&!/^#/.test(a.getAttribute('href'))){e.preventDefault();send('stdout',['(Link to '+a.href+' — links are disabled inside the preview)'])}},true);" +
      "})();<\/script>";
    var checker = "";
    if (checks && checks.length) {
      checker =
        "<script>window.addEventListener('load',function(){setTimeout(function(){var tests=" + JSON.stringify(checks) + ";" +
        "var results=tests.map(function(t){try{return !!(new Function('return ('+t.expr+')'))()}catch(e){return false}});" +
        "parent.postMessage({codle:" + JSON.stringify(channel) + ",checks:results},'*')},60)});<\/script>";
    }
    if (/<head[^>]*>/i.test(code)) {
      code = code.replace(/<head[^>]*>/i, function (m) { return m + bridge; });
    } else {
      code = bridge + code;
    }
    if (/<\/body>/i.test(code)) {
      code = code.replace(/<\/body>(?![\s\S]*<\/body>)/i, checker + "</body>");
    } else {
      code += checker;
    }
    return code;
  }

  function run(langId, code, onStatus) {
    switch (langId) {
      case "javascript": return runJavaScript(code);
      case "python": return runPython(code, onStatus);
      case "lua": return runLua(code);
      case "cpp": case "csharp": case "java": return runRemote(langId, code, onStatus);
      default: return Promise.resolve(result("", "No runner for " + langId));
    }
  }

  /* Warm up Python in the background once the learner shows interest. */
  function prewarm(langId) {
    if (langId !== "python" || py.worker) return;
    try {
      var w = pyWorker();
      w.onmessage = function (e) {
        if (e.data.type === "ready") py.ready = true;
        if (e.data.type === "loaderror" && py.worker === w) { w.terminate(); py.worker = null; }
      };
      w.postMessage({ id: 0, code: "", urls: PYODIDE_URLS });
    } catch (_) {}
  }

  window.CodleRunners = { run: run, htmlDocument: htmlDocument, prewarm: prewarm };
})();
