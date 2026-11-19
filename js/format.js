/*
 * Codle console formatter.
 * Formats console.log arguments the way Node.js does for common values
 * (strings, numbers, arrays, plain objects, Maps, Sets, class instances),
 * so playground output matches what learners see when they run code in Node.
 * Shared by the in-browser JS worker and the content verification script.
 */
(function (root) {
  "use strict";

  var IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
  var MAX_DEPTH = 2;

  function quote(str) {
    var q = str.indexOf("'") === -1 ? "'" : str.indexOf('"') === -1 ? '"' : str.indexOf("`") === -1 ? "`" : "'";
    var escaped = str
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t");
    if (q === "'") escaped = escaped.replace(/'/g, "\\'");
    return q + escaped + q;
  }

  function fmtKey(key) {
    if (typeof key === "symbol") return "[" + key.toString() + "]";
    return IDENT.test(key) ? key : quote(key);
  }

  function ctorName(obj) {
    var proto = Object.getPrototypeOf(obj);
    if (proto === null) return "[Object: null prototype]";
    var c = proto && proto.constructor;
    return c && typeof c.name === "string" ? c.name : "";
  }

  function inspect(value, depth, seen) {
    var t = typeof value;
    if (value === null) return "null";
    if (t === "undefined") return "undefined";
    if (t === "string") return depth === 0 ? value : quote(value);
    if (t === "number") return Object.is(value, -0) ? "-0" : String(value);
    if (t === "bigint") return String(value) + "n";
    if (t === "boolean") return String(value);
    if (t === "symbol") return value.toString();
    if (t === "function") {
      var src = Function.prototype.toString.call(value);
      if (/^class[\s{]/.test(src)) return "[class " + (value.name || "(anonymous)") + "]";
      return value.name ? "[Function: " + value.name + "]" : "[Function (anonymous)]";
    }

    if (seen.indexOf(value) !== -1) return "[Circular *1]";

    if (value instanceof Error) {
      return value.name + ": " + value.message;
    }
    if (value instanceof Date) {
      return isNaN(value.getTime()) ? "Invalid Date" : value.toISOString();
    }
    if (value instanceof RegExp) return String(value);
    if (typeof Promise !== "undefined" && value instanceof Promise) return "Promise { <pending> }";

    var nested = depth + 1 > MAX_DEPTH;
    var next = seen.concat([value]);

    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      if (nested) return "[Array]";
      var items = [];
      var holes = 0;
      for (var i = 0; i < value.length; i++) {
        if (!(i in value)) { holes++; continue; }
        if (holes) { items.push("<" + holes + " empty item" + (holes > 1 ? "s" : "") + ">"); holes = 0; }
        items.push(inspect(value[i], depth + 1, next));
      }
      if (holes) items.push("<" + holes + " empty item" + (holes > 1 ? "s" : "") + ">");
      Object.keys(value).forEach(function (k) {
        if (!/^\d+$/.test(k)) items.push(fmtKey(k) + ": " + inspect(value[k], depth + 1, next));
      });
      return "[ " + items.join(", ") + " ]";
    }

    if (value instanceof Map) {
      if (value.size === 0) return "Map(0) {}";
      if (nested) return "[Map]";
      var mp = [];
      value.forEach(function (v, k) { mp.push(inspect(k, depth + 1, next) + " => " + inspect(v, depth + 1, next)); });
      return "Map(" + value.size + ") { " + mp.join(", ") + " }";
    }

    if (value instanceof Set) {
      if (value.size === 0) return "Set(0) {}";
      if (nested) return "[Set]";
      var st = [];
      value.forEach(function (v) { st.push(inspect(v, depth + 1, next)); });
      return "Set(" + value.size + ") { " + st.join(", ") + " }";
    }

    var name = ctorName(value);
    var prefix = name === "Object" ? "" : name + " ";
    var keys = Object.keys(value);
    if (keys.length === 0) return prefix + "{}";
    if (nested) return "[" + (name === "Object" || !name ? "Object" : name) + "]";
    var parts = keys.map(function (k) {
      return fmtKey(k) + ": " + inspect(value[k], depth + 1, next);
    });
    return prefix + "{ " + parts.join(", ") + " }";
  }

  /* Implements console.log's printf-style substitutions (%s %d %i %f %o %O %j %%). */
  function formatArgs(args) {
    args = Array.prototype.slice.call(args);
    var out = [];
    if (typeof args[0] === "string" && args[0].indexOf("%") !== -1 && args.length > 1) {
      var fmt = args.shift();
      var str = fmt.replace(/%([sdifoOjc%])/g, function (m, ch) {
        if (ch === "%") return "%";
        if (!args.length) return m;
        var a = args.shift();
        switch (ch) {
          case "s": return typeof a === "string" ? a : inspect(a, 1, []);
          case "d": case "i":
            if (typeof a === "object" && a !== null) return "NaN";
            var n = Number(a);
            return ch === "i" ? String(Math.trunc(n)) : String(n);
          case "f": return String(parseFloat(a));
          case "j": try { return JSON.stringify(a); } catch (e) { return "[Circular]"; }
          case "c": return "";
          default: return inspect(a, 1, []);
        }
      });
      out.push(str);
    }
    args.forEach(function (a) { out.push(inspect(a, 0, [])); });
    return out.join(" ");
  }

  var api = { inspect: function (v) { return inspect(v, 0, []); }, formatArgs: formatArgs };
  root.CodleFormat = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);
