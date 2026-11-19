/* Codle app: language switching, lessons, quiz, challenges, playground. */
(function () {
  "use strict";

  var LANGS = window.CODLE_CONTENT;
  var M = window.CodleMarkdown;
  var R = window.CodleRunners;
  var esc = M.esc;
  var byId = {};
  LANGS.forEach(function (l) { byId[l.id] = l; });

  var INDENT = { python: 4, javascript: 2, html: 2, lua: 2, csharp: 4, cpp: 4, java: 4 };
  var LOCAL_RUN = {
    python: "python3 main.py",
    javascript: "node main.js",
    lua: "lua main.lua",
    cpp: "g++ -std=c++17 main.cpp -o main && ./main",
    java: "java Main.java",
    csharp: "dotnet new console, paste into Program.cs, then dotnet run",
  };
  var VIEWS = [
    { id: "learn", label: "Lessons", count: function (l) { return l.lessons.length; } },
    { id: "quiz", label: "Quiz", count: function (l) { return l.quiz.length; } },
    { id: "challenges", label: "Challenges", count: function (l) { return l.challenges.length; } },
    { id: "playground", label: "Playground" },
  ];

  /* ---------- Persistence (per-browser conveniences only) ---------- */
  var store = {
    get: function (k, d) {
      try { var v = localStorage.getItem("codle:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; }
    },
    set: function (k, v) {
      try { localStorage.setItem("codle:" + k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    },
  };
  var state = Object.assign({ lang: "python", view: "learn", pos: {}, answers: {}, solved: {} }, store.get("state", {}));
  if (!byId[state.lang]) state.lang = "python";
  if (!VIEWS.some(function (v) { return v.id === state.view; })) state.view = "learn";
  var drafts = store.get("drafts", {});
  var hintsShown = {};
  var saveTimer = null;

  function save() { store.set("state", state); }
  function saveDrafts() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { store.set("drafts", drafts); }, 300);
  }
  function pos(lang) {
    return state.pos[lang] || (state.pos[lang] = { lesson: 0, quiz: 0, challenge: 0 });
  }
  function answers(lang) { return state.answers[lang] || (state.answers[lang] = {}); }
  function solved(lang) { return state.solved[lang] || (state.solved[lang] = {}); }

  function norm(s) {
    return String(s || "").replace(/\r/g, "").split("\n").map(function (l) { return l.replace(/\s+$/, ""); }).join("\n").replace(/\n+$/, "");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var KBD = isMac ? "⌘ ↵" : "Ctrl ↵";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var savedTheme = store.get("theme", null);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $("#theme-toggle").addEventListener("click", function () {
    var current = root.getAttribute("data-theme") ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("theme", next);
  });

  /* ---------- Sliding tab indicators ---------- */
  function placeIndicator(container, activeSel, indicator, instant) {
    var active = container.querySelector(activeSel);
    if (!active || !indicator) return;
    if (instant) indicator.style.transition = "none";
    indicator.style.width = active.offsetWidth + "px";
    indicator.style.transform = "translateX(" + active.offsetLeft + "px)";
    if (instant) { void indicator.offsetWidth; indicator.style.transition = ""; }
    var left = active.offsetLeft, right = left + active.offsetWidth;
    if (left < container.scrollLeft) container.scrollTo({ left: left - 8, behavior: instant ? "auto" : "smooth" });
    else if (right > container.scrollLeft + container.clientWidth) container.scrollTo({ left: right - container.clientWidth + 8, behavior: instant ? "auto" : "smooth" });
  }

  /* ---------- Header: language tabs ---------- */
  var langsEl = $("#langs");
  langsEl.innerHTML = LANGS.map(function (l) {
    return '<button class="lang-tab" type="button" role="tab" data-lang="' + l.id + '" aria-selected="' + (l.id === state.lang) + '">' +
      '<span class="lang-dot" style="--dot: var(--lang-' + l.id + ')"></span>' + esc(l.name) + "</button>";
  }).join("") + '<span class="tab-indicator" aria-hidden="true"></span>';
  langsEl.addEventListener("click", function (e) {
    var b = e.target.closest(".lang-tab");
    if (b && b.dataset.lang !== state.lang) setLang(b.dataset.lang);
  });
  langsEl.addEventListener("keydown", function (e) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    var i = LANGS.findIndex(function (l) { return l.id === state.lang; });
    i = (i + (e.key === "ArrowRight" ? 1 : LANGS.length - 1)) % LANGS.length;
    setLang(LANGS[i].id);
    langsEl.querySelector('[data-lang="' + LANGS[i].id + '"]').focus();
  });

  function setLang(id) {
    state.lang = id;
    save();
    langsEl.querySelectorAll(".lang-tab").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.lang === id)); });
    placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl));
    transition(function () { renderLangbar(); renderView(); });
  }

  function setView(id) {
    state.view = id;
    save();
    var views = $(".views");
    views.querySelectorAll(".view-tab").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.view === id)); });
    placeIndicator(views, '[aria-selected="true"]', $(".view-indicator", views));
    transition(renderView);
  }

  /* ---------- Language bar ---------- */
  var langbar = $("#langbar");
  function renderLangbar(instant) {
    var l = byId[state.lang];
    langbar.innerHTML =
      '<div class="langbar-head"><div>' +
      '<h1><span class="lang-dot" style="--dot: var(--lang-' + l.id + ')"></span>' + esc(l.name) + "</h1>" +
      '<p class="tagline">' + esc(l.tagline) + "</p></div>" +
      '<span class="runtime-chip' + (l.runner === "remote" ? " remote" : "") + '">' + esc(l.runtime) + "</span></div>" +
      '<nav class="views" role="tablist" aria-label="Section">' +
      VIEWS.map(function (v) {
        return '<button class="view-tab" type="button" role="tab" data-view="' + v.id + '" aria-selected="' + (v.id === state.view) + '">' +
          v.label + (v.count ? '<span class="count">' + v.count(l) + "</span>" : "") + "</button>";
      }).join("") + '<span class="view-indicator" aria-hidden="true"></span></nav>';
    var views = $(".views", langbar);
    views.addEventListener("click", function (e) {
      var b = e.target.closest(".view-tab");
      if (b && b.dataset.view !== state.view) setView(b.dataset.view);
    });
    requestAnimationFrame(function () { placeIndicator(views, '[aria-selected="true"]', $(".view-indicator", views), true); });
  }

  /* ---------- View transitions ---------- */
  var viewEl = $("#view");
  var transitioning = null;
  function transition(render) {
    clearTimeout(transitioning);
    viewEl.classList.remove("entering");
    viewEl.classList.add("leaving");
    transitioning = setTimeout(function () {
      render();
      viewEl.classList.remove("leaving");
      void viewEl.offsetWidth;
      viewEl.classList.add("entering");
      transitioning = setTimeout(function () { viewEl.classList.remove("entering"); }, 400);
    }, 120);
  }

  function renderView() {
    activeKeyHandler = null;
    var l = byId[state.lang];
    if (state.view === "learn") renderLearn(l);
    else if (state.view === "quiz") renderQuiz(l);
    else if (state.view === "challenges") renderChallenges(l);
    else renderPlayground(l);
  }

  /* ---------- Editor + output component ---------- */
  var channelSeq = 0;
  var channels = {};
  window.addEventListener("message", function (e) {
    var d = e.data;
    if (d && d.codle && channels[d.codle]) channels[d.codle](d);
  });

  function createPlayground(host, o) {
    var lang = byId[o.lang];
    var isHtml = lang.id === "html";
    var draft = drafts[o.key];
    var start = typeof draft === "string" ? draft : o.original;
    var primaryLabel = o.primaryLabel || (isHtml ? "Run" : "Run");
    host.innerHTML =
      '<div class="pg' + (o.tall ? " tall" : "") + '">' +
      '<div class="pg-bar"><span class="pg-file"><span class="lang-dot" style="--dot: var(--lang-' + lang.id + ')"></span>' +
      "<span>" + esc(lang.filename) + '</span><span class="edited" hidden>edited</span></span>' +
      '<div class="pg-actions">' +
      '<button class="btn ghost" type="button" data-act="reset" title="Restore the original code">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      (o.resetLabel || "Reset example") + "</button>" +
      (o.secondary ? '<button class="btn" type="button" data-act="run">Run</button>' : "") +
      '<button class="btn primary" type="button" data-act="primary">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z" fill="currentColor"/></svg>' +
      primaryLabel + " <kbd>" + KBD + "</kbd></button>" +
      "</div></div>" +
      '<div class="pg-body"><div class="pg-editor"></div>' +
      '<div class="pg-out"><div class="pg-out-head"><span>' + (isHtml ? "Preview" : "Output") + '</span><span class="status">Ready</span></div>' +
      '<div class="pg-out-body"></div></div></div></div>';

    var pgEl = $(".pg", host);
    var outBody = $(".pg-out-body", host);
    var statusEl = $(".status", host);
    var editedEl = $(".edited", host);
    var primaryBtn = $('[data-act="primary"]', host);
    var runBtn = $('[data-act="run"]', host);
    var channel = "c" + (++channelSeq);
    var frame = null, consoleEl = null;

    var cm = CodeMirror($(".pg-editor", host), {
      value: start,
      mode: lang.mode,
      theme: "codle",
      lineNumbers: true,
      indentUnit: INDENT[lang.id],
      tabSize: INDENT[lang.id],
      indentWithTabs: false,
      matchBrackets: true,
      autoCloseBrackets: true,
      viewportMargin: Infinity,
      extraKeys: {
        "Ctrl-Enter": function () { primary(); },
        "Cmd-Enter": function () { primary(); },
        Tab: function (c) {
          if (c.somethingSelected()) c.indentSelection("add");
          else c.replaceSelection(Array(INDENT[lang.id] + 1).join(" "), "end");
        },
        "Shift-Tab": function (c) { c.indentSelection("subtract"); },
        "Ctrl-/": "toggleComment",
        "Cmd-/": "toggleComment",
        Esc: function (c) { c.getInputField().blur(); },
      },
    });
    cm.getWrapperElement().setAttribute("aria-label", lang.name + " code editor");
    setTimeout(function () { cm.refresh(); }, 0);
    setTimeout(function () { cm.refresh(); }, 260);

    function markEdited() {
      var edited = norm(cm.getValue()) !== norm(o.original);
      editedEl.hidden = !edited;
      if (edited) drafts[o.key] = cm.getValue(); else delete drafts[o.key];
      saveDrafts();
    }
    cm.on("changes", markEdited);
    markEdited();
    cm.on("focus", function () { R.prewarm(lang.id); });
    primaryBtn.addEventListener("pointerenter", function () { R.prewarm(lang.id); });

    function setStatus(kind, text) {
      statusEl.className = "status" + (kind ? " " + kind : "");
      statusEl.textContent = text;
    }
    function busy(on) {
      primaryBtn.disabled = on;
      if (runBtn) runBtn.disabled = on;
    }

    function showText(parts, note, noteKind) {
      var html = "";
      parts.forEach(function (p) {
        if (!p.text) return;
        html += '<span class="' + (p.cls || "") + '">' + esc(p.text) + "</span>";
      });
      outBody.innerHTML = '<pre class="reveal">' + (html || '<span class="dim">(no output)</span>') + "</pre>" +
        (note ? '<div class="out-note reveal' + (noteKind ? " " + noteKind : "") + '">' + note + "</div>" : "");
    }

    function showReference(note) {
      if (o.reference == null) {
        outBody.innerHTML = '<pre><span class="dim">Press Run to execute this code.</span></pre>';
        setStatus("", "Ready");
        return;
      }
      showText([{ text: o.reference, cls: "dim" }], note || "This is the example's expected output. Press <b>Run</b> to execute it live.");
      setStatus("ref", "Expected output");
    }

    /* HTML preview */
    function renderPreview(code, checks, onChecks) {
      var logs = [];
      outBody.innerHTML = "";
      frame = document.createElement("iframe");
      frame.className = "preview-frame reveal";
      frame.setAttribute("sandbox", "allow-scripts");
      frame.setAttribute("title", "Preview of your HTML");
      consoleEl = document.createElement("div");
      consoleEl.className = "console-strip";
      outBody.appendChild(frame);
      outBody.appendChild(consoleEl);
      channels[channel] = function (d) {
        if (d.checks && onChecks) { onChecks(d.checks); return; }
        if (typeof d.text === "string") {
          logs.push(d);
          consoleEl.innerHTML = "<pre>" + logs.map(function (x) {
            return '<span class="' + (x.stream === "stderr" ? "err" : "") + '">' + esc(x.text) + "</span>";
          }).join("\n") + "</pre>";
        }
      };
      frame.srcdoc = R.htmlDocument(code, channel, checks);
      setStatus("ok", "Rendered");
    }

    function run() {
      var code = cm.getValue();
      if (isHtml) {
        renderPreview(code);
        return Promise.resolve({ html: true });
      }
      busy(true);
      setStatus("running", "Running…");
      outBody.innerHTML = '<pre><span class="dim">Running…</span></pre>';
      var t0 = performance.now();
      return R.run(lang.id, code, function (msg) {
        setStatus("running", "Running…");
        outBody.innerHTML = '<pre><span class="dim">' + esc(msg) + "</span></pre>";
      }).then(function (r) {
        busy(false);
        var ms = Math.round(performance.now() - t0);
        if (r.unreachable) {
          var unchanged = norm(code) === norm(o.original);
          if (unchanged && o.reference != null) {
            showText([{ text: o.reference }], esc(r.reason) + " Showing the verified output of this exact code instead.", "warn");
            setStatus("ref", "Verified output");
          } else {
            outBody.innerHTML = '<pre><span class="dim">Not run.</span></pre>' +
              '<div class="out-note warn reveal">' + esc(r.reason) +
              (o.reference != null ? " <b>Reset example</b> to see its verified output, or run" : " You can run") +
              " your version locally with <code>" + esc(LOCAL_RUN[lang.id] || "") + "</code>.</div>";
            setStatus("err", "Not run");
          }
          return r;
        }
        var note = r.via ? "Compiled and run on " + esc(r.via) + "." : "";
        showText([{ text: r.stdout }, { text: r.stderr, cls: "err" }], note);
        if (r.stderr) setStatus("err", r.timedOut ? "Stopped" : "Error");
        else setStatus("ok", "Done in " + (ms < 1000 ? ms + " ms" : (ms / 1000).toFixed(1) + " s"));
        return r;
      });
    }

    function primary() { (o.onPrimary || run)(); }

    primaryBtn.addEventListener("click", primary);
    if (runBtn) runBtn.addEventListener("click", function () { run(); });
    $('[data-act="reset"]', host).addEventListener("click", function () {
      cm.setValue(o.original);
      cm.focus();
      if (o.onReset) o.onReset();
      if (isHtml) renderPreview(o.original);
      else showReference();
    });

    if (isHtml) renderPreview(start);
    else showReference();

    return {
      cm: cm,
      run: run,
      renderPreview: renderPreview,
      setStatus: setStatus,
      busy: busy,
      setValue: function (v) { cm.setValue(v); },
      getValue: function () { return cm.getValue(); },
      element: pgEl,
    };
  }

  /* ---------- Rails & pager ---------- */
  function railHtml(label, items, current, doneMap) {
    return '<nav class="rail" aria-label="' + label + '"><p class="rail-label">' + label + "</p>" +
      items.map(function (it, i) {
        return '<button class="rail-item' + (doneMap && doneMap[i] ? " done" : "") + '" type="button" data-index="' + i + '" aria-current="' + (i === current) + '">' +
          '<span class="rail-num">' + (doneMap && doneMap[i] ? "✓" : i + 1) + "</span>" +
          '<span class="rail-text">' + (it.small ? "<small>" + esc(it.small) + "</small>" : "") + esc(it.title) + "</span></button>";
      }).join("") + "</nav>";
  }

  function pagerHtml(items, i, noun) {
    var prev = items[i - 1], next = items[i + 1];
    return '<div class="pager">' +
      (prev ? '<button class="btn prev" type="button" data-go="' + (i - 1) + '"><span><small>Previous ' + noun + "</small>← " + esc(prev.title) + "</span></button>" : "<span></span>") +
      (next ? '<button class="btn next" type="button" data-go="' + (i + 1) + '"><span><small>Next ' + noun + "</small>" + esc(next.title) + " →</span></button>" : "<span></span>") +
      "</div>";
  }

  function wireNav(container, go) {
    container.addEventListener("click", function (e) {
      var b = e.target.closest("[data-index], [data-go]");
      if (!b || !container.contains(b)) return;
      var i = Number(b.dataset.index != null ? b.dataset.index : b.dataset.go);
      go(i);
    });
  }

  function scrollToContent() {
    var top = langbar.getBoundingClientRect().bottom + window.scrollY - 70;
    if (window.scrollY > top) window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  /* ---------- Lessons ---------- */
  function renderLearn(l) {
    var p = pos(l.id);
    if (p.lesson >= l.lessons.length) p.lesson = 0;
    var i = p.lesson, lesson = l.lessons[i];
    viewEl.innerHTML =
      '<div class="workspace">' +
      railHtml("Lessons", l.lessons, i) +
      '<article class="article">' +
      '<header class="article-head"><div class="eyebrow">Lesson ' + (i + 1) + " of " + l.lessons.length + "</div>" +
      "<h2>" + esc(lesson.title) + "</h2>" + (lesson.summary ? '<p class="summary">' + esc(lesson.summary) + "</p>" : "") + "</header>" +
      '<div class="prose">' + M.render(lesson.body) + "</div>" +
      '<div class="eyebrow">Try it</div>' +
      '<div id="lesson-pg"></div>' +
      pagerHtml(l.lessons, i, "lesson") +
      "</article></div>";
    createPlayground($("#lesson-pg"), {
      lang: l.id,
      key: l.id + ":lesson:" + i,
      original: lesson.example,
      reference: l.id === "html" ? null : (lesson.output || ""),
    });
    wireNav($(".workspace", viewEl), function (n) {
      if (n === pos(l.id).lesson) return;
      pos(l.id).lesson = n;
      save();
      transition(function () { renderLearn(l); scrollToContent(); });
    });
  }

  /* ---------- Quiz ---------- */
  var activeKeyHandler = null;
  document.addEventListener("keydown", function (e) {
    if (!activeKeyHandler) return;
    var t = e.target;
    if (t && (t.closest(".CodeMirror") || /INPUT|TEXTAREA|SELECT/.test(t.tagName))) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    activeKeyHandler(e);
  });

  function optionHtml(o) {
    var m = /^`([^`]*)`$/.exec(o);
    if (m) return '<span class="opt-code">' + esc(m[1].replace(/\\n/g, "\n")) + "</span>";
    return M.inline(o);
  }

  function renderQuiz(l) {
    var p = pos(l.id);
    if (p.quiz >= l.quiz.length) p.quiz = 0;
    var qi = p.quiz, q = l.quiz[qi], ans = answers(l.id);
    var allDone = l.quiz.every(function (_, i) { return ans[i] != null; });
    viewEl.innerHTML =
      '<div class="quiz">' +
      '<div class="quiz-nav"><div class="eyebrow">Question ' + (qi + 1) + " of " + l.quiz.length + "</div>" +
      '<div class="quiz-dots" role="list">' + l.quiz.map(function (qq, i) {
        var a = ans[i];
        var cls = a == null ? "" : a === qq.answer ? " right" : " wrong";
        return '<button class="quiz-dot' + cls + '" type="button" role="listitem" data-index="' + i + '" aria-current="' + (i === qi) + '" aria-label="Question ' + (i + 1) + '">' + (i + 1) + "</button>";
      }).join("") + "</div></div>" +
      '<div class="quiz-card">' +
      '<div class="quiz-q">' + M.inline(q.question) + "</div>" +
      (q.code ? '<div class="code-wrap">' + M.highlight(q.code, q.codeLang || l.id) + "</div>" : "") +
      '<div class="options">' + q.options.map(function (o, i) {
        return '<button class="option" type="button" data-opt="' + i + '"><span class="option-key">' + "ABCD"[i] + '</span><span class="option-text">' + optionHtml(o) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="explain"><div><div class="explain-body"></div></div></div>' +
      "</div>" +
      '<div class="quiz-foot"><span class="hintline">Pick an answer, or press A to D.</span>' +
      '<div class="helper-row">' +
      (qi > 0 ? '<button class="btn ghost" type="button" data-go="' + (qi - 1) + '">← Previous</button>' : "") +
      (qi < l.quiz.length - 1
        ? '<button class="btn primary" type="button" data-go="' + (qi + 1) + '">Next question →</button>'
        : '<button class="btn primary" type="button" data-restart>' + (allDone ? "Start over" : "Back to question 1") + "</button>") +
      "</div></div></div>";

    var card = $(".quiz-card", viewEl);
    function reveal(choice, animate) {
      var right = choice === q.answer;
      card.querySelectorAll(".option").forEach(function (b, i) {
        b.disabled = true;
        b.classList.toggle("correct", i === q.answer);
        b.classList.toggle("incorrect", i === choice && !right);
        b.classList.toggle("muted", i !== q.answer && i !== choice);
        if (!animate) b.querySelector(".option-key").style.animation = "none";
      });
      var body = $(".explain-body", card);
      body.className = "explain-body " + (right ? "right" : "wrong");
      body.innerHTML = "<strong>" + (right ? "Right." : "Not quite. The answer is " + "ABCD"[q.answer] + ".") + "</strong>" + M.inline(q.explain);
      var ex = $(".explain", card);
      if (animate) requestAnimationFrame(function () { ex.classList.add("open"); });
      else ex.classList.add("open");
      $(".hintline", viewEl).textContent = qi < l.quiz.length - 1 ? "Press Enter for the next question." : "That was the last question.";
    }
    if (ans[qi] != null) reveal(ans[qi], false);

    function choose(i) {
      if (ans[qi] != null) return;
      ans[qi] = i;
      save();
      reveal(i, true);
      var dot = viewEl.querySelector('.quiz-dot[data-index="' + qi + '"]');
      dot.classList.add(i === q.answer ? "right" : "wrong");
      var restart = viewEl.querySelector("[data-restart]");
      if (restart && l.quiz.every(function (_, k) { return ans[k] != null; })) restart.textContent = "Start over";
    }

    function go(n) {
      if (n === qi || n < 0 || n >= l.quiz.length) return;
      pos(l.id).quiz = n;
      save();
      transition(function () { renderQuiz(l); });
    }

    viewEl.querySelector(".options").addEventListener("click", function (e) {
      var b = e.target.closest(".option");
      if (b) choose(Number(b.dataset.opt));
    });
    viewEl.querySelectorAll("[data-index], [data-go]").forEach(function (b) {
      b.addEventListener("click", function () { go(Number(b.dataset.index != null ? b.dataset.index : b.dataset.go)); });
    });
    var restartBtn = viewEl.querySelector("[data-restart]");
    if (restartBtn) restartBtn.addEventListener("click", function () {
      if (l.quiz.every(function (_, k) { return ans[k] != null; })) state.answers[l.id] = {};
      pos(l.id).quiz = 0;
      save();
      transition(function () { renderQuiz(l); });
    });

    activeKeyHandler = function (e) {
      var k = e.key.toLowerCase();
      var idx = "abcd".indexOf(k);
      if (idx === -1 && /^[1-4]$/.test(k)) idx = Number(k) - 1;
      if (idx > -1 && idx < q.options.length) { e.preventDefault(); choose(idx); return; }
      if ((e.key === "Enter" || e.key === "ArrowRight") && ans[qi] != null && qi < l.quiz.length - 1) { e.preventDefault(); go(qi + 1); }
      if (e.key === "ArrowLeft" && qi > 0) { e.preventDefault(); go(qi - 1); }
    };
  }

  /* ---------- Challenges ---------- */
  function renderChallenges(l) {
    var p = pos(l.id);
    if (p.challenge >= l.challenges.length) p.challenge = 0;
    var ci = p.challenge, ch = l.challenges[ci];
    var hk = l.id + ":" + ci;
    var shown = hintsShown[hk] || 0;
    var done = solved(l.id);
    var kindCls = ch.kind.toLowerCase();
    viewEl.innerHTML =
      '<div class="workspace">' +
      railHtml("Challenges", l.challenges.map(function (c) { return { title: c.title, small: c.kind }; }), ci, done) +
      '<section class="challenge">' +
      '<header class="article-head"><div class="eyebrow">Challenge ' + (ci + 1) + " of " + l.challenges.length +
      ' &nbsp;<span class="kind-tag ' + kindCls + '">' + esc(ch.kind) + "</span></div>" +
      "<h2>" + esc(ch.title) + "</h2></header>" +
      '<div class="challenge-prompt">' + M.render(ch.prompt) + "</div>" +
      '<div id="challenge-pg"></div>' +
      '<div id="challenge-result" aria-live="polite"></div>' +
      '<div class="helpers">' +
      '<div class="helper-row">' +
      '<button class="btn" type="button" data-hint>' + hintLabel(shown, ch.hints.length) + "</button>" +
      '<button class="btn ghost" type="button" data-solution aria-expanded="false">Show solution</button></div>' +
      '<div class="hints">' + ch.hints.map(function (h, i) {
        return '<div class="hint' + (i < shown ? " open" : "") + '"><div><div class="hint-body"><b>' + (i + 1) + "/" + ch.hints.length + "</b><span>" + M.inline(h) + "</span></div></div></div>";
      }).join("") + "</div>" +
      '<div class="solution"><div><div class="solution-inner">' +
      '<div class="row"><span>One correct solution. Yours can differ and still pass.</span>' +
      '<button class="btn" type="button" data-use>Load into editor</button></div>' +
      '<div class="code-wrap">' + M.highlight(ch.solution, l.id) + "</div></div></div></div>" +
      "</div>" +
      pagerHtml(l.challenges, ci, "challenge") +
      "</section></div>";

    var resultEl = $("#challenge-result");
    var pg = createPlayground($("#challenge-pg"), {
      lang: l.id,
      key: l.id + ":challenge:" + ci,
      original: ch.starter,
      reference: null,
      primaryLabel: "Check",
      secondary: l.id !== "html",
      resetLabel: "Reset",
      onPrimary: check,
      onReset: function () { resultEl.innerHTML = ""; },
    });

    function markSolved() {
      done[ci] = true;
      save();
      var item = viewEl.querySelector('.rail-item[data-index="' + ci + '"]');
      if (item) { item.classList.add("done"); item.querySelector(".rail-num").textContent = "✓"; }
    }

    function showResult(kind, title, bodyHtml) {
      resultEl.innerHTML = '<div class="result ' + kind + ' reveal"><div class="result-head">' + title + "</div>" +
        (bodyHtml ? '<div class="result-body">' + bodyHtml + "</div>" : "") + "</div>";
    }

    function diffHtml(expected, got) {
      var e = norm(expected).split("\n"), g = norm(got).split("\n");
      var gotHtml = g.map(function (line, i) {
        return line !== e[i] ? '<span class="line-bad">' + (esc(line) || " ") + "</span>" : esc(line);
      }).join("\n");
      if (!norm(got)) gotHtml = '<span class="line-bad">(nothing printed)</span>';
      return '<div class="diff"><div><h4>Expected</h4><pre>' + esc(norm(expected)) + "</pre></div>" +
        "<div><h4>Your output</h4><pre>" + gotHtml + "</pre></div></div>";
    }

    function check() {
      if (l.id === "html") {
        pg.busy(true);
        var finished = false;
        var timer = setTimeout(function () {
          if (finished) return;
          finished = true;
          pg.busy(false);
          showResult("fail", "The preview didn't finish loading", "<p>Check your HTML for an unclosed tag or a script error, then try again.</p>");
        }, 4000);
        pg.renderPreview(pg.getValue(), ch.tests, function (results) {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          pg.busy(false);
          var pass = results.every(Boolean);
          var list = '<ul class="checklist">' + ch.tests.map(function (t, i) {
            return '<li class="' + (results[i] ? "yes" : "no") + '"><span class="mark">' + (results[i] ? "✓" : "✕") + "</span><span>" + esc(t.label) + "</span></li>";
          }).join("") + "</ul>";
          if (pass) { markSolved(); showResult("pass", "All " + results.length + " checks pass. Nicely done.", list); }
          else showResult("fail", results.filter(Boolean).length + " of " + results.length + " checks pass", list);
        });
        return;
      }
      resultEl.innerHTML = "";
      pg.run().then(function (r) {
        if (r.unreachable) {
          showResult("info", "This can't be checked from here",
            "<p>" + esc(r.reason) + " Run your code locally with <code>" + esc(LOCAL_RUN[l.id] || "") + "</code> and compare it with the expected output below.</p>" +
            '<div class="diff"><div><h4>Expected output</h4><pre>' + esc(norm(ch.expected)) + "</pre></div></div>");
          return;
        }
        var pass = !r.stderr && norm(r.stdout) === norm(ch.expected);
        if (pass) {
          markSolved();
          showResult("pass", "Output matches. Challenge solved.", "");
        } else if (r.stderr && !norm(r.stdout)) {
          showResult("fail", "Your code stopped with an error", "<p>Read the error in the output panel: it usually names the line and the problem. Then try again.</p>" + diffHtml(ch.expected, r.stdout));
        } else {
          showResult("fail", "Not quite yet", "<p>The lines marked in red differ from what the tests expect.</p>" + diffHtml(ch.expected, r.stdout));
        }
      });
    }

    var hintBtn = $("[data-hint]", viewEl);
    hintBtn.disabled = shown >= ch.hints.length;
    hintBtn.addEventListener("click", function () {
      var n = hintsShown[hk] || 0;
      if (n >= ch.hints.length) return;
      viewEl.querySelectorAll(".hint")[n].classList.add("open");
      hintsShown[hk] = n + 1;
      hintBtn.textContent = hintLabel(n + 1, ch.hints.length);
      hintBtn.disabled = n + 1 >= ch.hints.length;
    });
    var solBtn = $("[data-solution]", viewEl);
    solBtn.addEventListener("click", function () {
      var sol = $(".solution", viewEl);
      var open = sol.classList.toggle("open");
      solBtn.textContent = open ? "Hide solution" : "Show solution";
      solBtn.setAttribute("aria-expanded", String(open));
    });
    $("[data-use]", viewEl).addEventListener("click", function () {
      pg.setValue(ch.solution);
      pg.cm.focus();
      pg.element.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    wireNav($(".rail", viewEl), goChallenge);
    wireNav($(".pager", viewEl), goChallenge);
    function goChallenge(n) {
      if (n === pos(l.id).challenge) return;
      pos(l.id).challenge = n;
      save();
      transition(function () { renderChallenges(l); scrollToContent(); });
    }
  }

  function hintLabel(shown, total) {
    if (shown >= total) return "All hints shown";
    return shown === 0 ? "Show a hint" : "Show another hint (" + shown + "/" + total + ")";
  }

  /* ---------- Playground ---------- */
  function renderPlayground(l) {
    viewEl.innerHTML =
      '<div class="article">' +
      '<header class="article-head"><div class="eyebrow">Playground</div><h2>Scratchpad</h2>' +
      '<p class="summary">Write anything you like in ' + esc(l.name) + ". Your code stays in this browser between visits.</p></header>" +
      '<div id="free-pg"></div></div>';
    createPlayground($("#free-pg"), {
      lang: l.id,
      key: l.id + ":playground",
      original: l.playground,
      reference: null,
      tall: true,
    });
  }

  /* ---------- Boot ---------- */
  renderLangbar();
  renderView();
  requestAnimationFrame(function () {
    placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl), true);
  });
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl), true);
      var views = $(".views");
      if (views) placeIndicator(views, '[aria-selected="true"]', $(".view-indicator", views), true);
    });
  }
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl), true);
      var views = $(".views");
      if (views) placeIndicator(views, '[aria-selected="true"]', $(".view-indicator", views), true);
    }, 100);
  });
  $(".brand").addEventListener("click", function (e) {
    e.preventDefault();
    if (state.view !== "learn") setView("learn");
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
