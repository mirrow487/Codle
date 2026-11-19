/* Runs Python with Pyodide (CPython compiled to WebAssembly) inside a worker. */
var pyodide = null;
var loading = null;

function load(urls) {
  if (loading) return loading;
  loading = (async function () {
    var lastError;
    for (var i = 0; i < urls.length; i++) {
      try {
        importScripts(urls[i] + "pyodide.js");
        pyodide = await self.loadPyodide({ indexURL: urls[i] });
        return pyodide;
      } catch (err) {
        lastError = err;
      }
    }
    loading = null;
    throw lastError || new Error("Pyodide could not be loaded");
  })();
  return loading;
}

/* Pyodide tracebacks include its own internal frames; keep only the learner's. */
function cleanTraceback(message) {
  var lines = String(message).split("\n");
  var out = [];
  var keep = true;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    var frame = /^  File "([^"]+)"/.exec(line);
    if (frame) {
      keep = frame[1] === "<exec>";
      if (keep) out.push(line.replace('"<exec>"', '"main.py"'));
      continue;
    }
    if (/^    /.test(line) && !keep) continue;
    if (!/^ /.test(line)) keep = true;
    out.push(line);
  }
  return out.join("\n").trim();
}

self.onmessage = async function (e) {
  var data = e.data;
  try {
    await load(data.urls);
  } catch (err) {
    self.postMessage({ id: data.id, type: "loaderror", message: String(err && err.message || err) });
    return;
  }
  self.postMessage({ id: data.id, type: "ready" });
  if (!data.code) { self.postMessage({ id: data.id, type: "done" }); return; }
  var decoder = new TextDecoder();
  pyodide.setStdout({ write: function (buf) { self.postMessage({ id: data.id, type: "out", stream: "stdout", text: decoder.decode(buf, { stream: true }) }); return buf.length; } });
  pyodide.setStderr({ write: function (buf) { self.postMessage({ id: data.id, type: "out", stream: "stderr", text: decoder.decode(buf, { stream: true }) }); return buf.length; } });
  pyodide.setStdin({ stdin: function () { return null; } });
  var ns = pyodide.globals.get("dict")();
  try {
    await pyodide.runPythonAsync(data.code, { globals: ns });
  } catch (err) {
    self.postMessage({ id: data.id, type: "out", stream: "stderr", text: cleanTraceback(err.message) + "\n" });
  } finally {
    try { pyodide.runPython("import sys\nsys.stdout.flush()\nsys.stderr.flush()"); } catch (_) {}
    ns.destroy();
  }
  self.postMessage({ id: data.id, type: "done" });
};
