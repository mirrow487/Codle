/* Runs learner JavaScript in an isolated worker so infinite loops can be stopped. */
importScripts("format.js");

(function () {
  "use strict";
  var fmt = self.CodleFormat;
  var post = function (msg) { self.postMessage(msg); };
  var nativeSetTimeout = self.setTimeout.bind(self);
  var nativeClearTimeout = self.clearTimeout.bind(self);
  var nativeSetInterval = self.setInterval.bind(self);
  var nativeClearInterval = self.clearInterval.bind(self);
  var pending = new Set();

  function emit(stream) {
    return function () { post({ type: "out", stream: stream, text: fmt.formatArgs(arguments) + "\n" }); };
  }

  var fakeConsole = {
    log: emit("stdout"), info: emit("stdout"), debug: emit("stdout"),
    warn: emit("stderr"), error: emit("stderr"),
    table: emit("stdout"), dir: emit("stdout"),
  };
  self.console = fakeConsole;

  self.setTimeout = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    var id = nativeSetTimeout(function () {
      pending.delete(id);
      try { fn.apply(null, args); } catch (e) { reportError(e); }
    }, ms);
    pending.add(id);
    return id;
  };
  self.clearTimeout = function (id) { pending.delete(id); nativeClearTimeout(id); };
  self.setInterval = function (fn, ms) {
    var args = Array.prototype.slice.call(arguments, 2);
    var id = nativeSetInterval(function () {
      try { fn.apply(null, args); } catch (e) { reportError(e); }
    }, ms);
    pending.add(id);
    return id;
  };
  self.clearInterval = function (id) { pending.delete(id); nativeClearInterval(id); };

  function lineOf(err) {
    var m = err && err.stack && /main\.js:(\d+):(\d+)/.exec(err.stack);
    return m ? " (line " + m[1] + ")" : "";
  }

  function reportError(e) {
    var text = e instanceof Error ? e.name + ": " + e.message + lineOf(e) : "Uncaught " + fmt.inspect(e);
    post({ type: "out", stream: "stderr", text: text + "\n" });
  }

  self.addEventListener("unhandledrejection", function (ev) {
    ev.preventDefault();
    reportError(ev.reason);
  });

  self.onmessage = function (e) {
    var code = e.data.code;
    try {
      (0, eval)(code + "\n//# sourceURL=main.js");
    } catch (err) {
      reportError(err);
    }
    // Let promises and timers settle (up to a few seconds), then report done.
    var started = Date.now();
    (function waitIdle() {
      nativeSetTimeout(function () {
        if (pending.size && Date.now() - started < 4000) return waitIdle();
        post({ type: "done" });
      }, 30);
    })();
  };
})();
