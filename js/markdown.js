/* A deliberately small Markdown renderer for Codle lesson prose:
 * paragraphs, "- " lists, "> " callouts, fenced code (syntax highlighted),
 * and inline `code`, **bold**, *em*, and [links](https://...). */
(function () {
  "use strict";

  var MODES = {
    python: "python", py: "python",
    js: "javascript", javascript: "javascript",
    html: "htmlmixed", css: "css",
    lua: "lua",
    csharp: "text/x-csharp", cs: "text/x-csharp",
    cpp: "text/x-c++src", "c++": "text/x-c++src",
    java: "text/x-java",
  };

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function inline(text) {
    // Split on code spans first so nothing inside them is formatted.
    var parts = text.split(/(`[^`]+`)/g);
    return parts.map(function (part) {
      if (/^`[^`]+`$/.test(part)) return "<code>" + esc(part.slice(1, -1)) + "</code>";
      var s = esc(part);
      s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
      s = s.replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
      s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      return s;
    }).join("");
  }

  function highlight(code, lang) {
    var mode = MODES[lang];
    var pre = document.createElement("pre");
    pre.className = "code cm-s-codle";
    if (mode && window.CodeMirror && CodeMirror.runMode) {
      CodeMirror.runMode(code, mode, pre);
    } else {
      pre.textContent = code;
    }
    return pre.outerHTML;
  }

  function render(text) {
    var lines = text.split("\n");
    var html = [];
    var i = 0;
    while (i < lines.length) {
      var line = lines[i];
      var fence = /^```\s*([\w+#-]*)\s*$/.exec(line);
      if (fence) {
        var buf = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]);
        i++;
        html.push('<div class="code-wrap">' + highlight(buf.join("\n"), fence[1]) + "</div>");
        continue;
      }
      if (!line.trim()) { i++; continue; }
      if (/^- /.test(line)) {
        var items = [];
        while (i < lines.length && (/^- /.test(lines[i]) || (/^\s+\S/.test(lines[i]) && items.length))) {
          if (/^- /.test(lines[i])) items.push(lines[i].slice(2));
          else items[items.length - 1] += " " + lines[i].trim();
          i++;
        }
        html.push("<ul>" + items.map(function (it) { return "<li>" + inline(it) + "</li>"; }).join("") + "</ul>");
        continue;
      }
      if (/^> /.test(line)) {
        var note = [];
        while (i < lines.length && /^> ?/.test(lines[i]) && lines[i].trim()) note.push(lines[i++].replace(/^> ?/, ""));
        html.push('<aside class="callout">' + inline(note.join(" ")) + "</aside>");
        continue;
      }
      var para = [];
      while (i < lines.length && lines[i].trim() && !/^(```|- |> )/.test(lines[i])) para.push(lines[i++]);
      html.push("<p>" + inline(para.join(" ")) + "</p>");
    }
    return html.join("\n");
  }

  window.CodleMarkdown = { render: render, inline: inline, highlight: highlight, esc: esc, modes: MODES };
})();
