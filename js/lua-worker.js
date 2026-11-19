/* Runs Lua (Fengari) off the main thread so long loops never freeze the page. */
// fengari-web looks for a global `window`; in a worker the global object is `self`.
self.window = self;
importScripts("vendor/fengari-web.js", "lua-runner.js");
self.onmessage = function (e) {
  var result;
  try {
    result = self.CodleLua.runLua(self.fengari, e.data.code);
  } catch (err) {
    result = { stdout: "", error: String(err && err.message || err) };
  }
  self.postMessage({ type: "done", stdout: result.stdout, error: result.error });
};
