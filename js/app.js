/* Codle app: language switching, lessons, quiz, challenges, playground. */
(function () {
  "use strict";

  var LANGS = window.CODLE_CONTENT;
  var M = window.CodleMarkdown;
  var R = window.CodleRunners;
  var I = window.CodleI18n;
  var Auth = window.CodleAuth;
  var Rauke = window.CodleRauke;
  var t = I.t, th = I.th;
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
  };
  function localRun(id) { return id === "csharp" ? t("local.csharp") : LOCAL_RUN[id] || ""; }
  var VIEWS = [
    { id: "learn", key: "view.learn", count: function (l) { return l.lessons.length; } },
    { id: "quiz", key: "view.quiz", count: function (l) { return l.quiz.length; } },
    { id: "challenges", key: "view.challenges", count: function (l) { return l.challenges.length; } },
    { id: "playground", key: "view.playground" },
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
  /* Progress and drafts belong to the signed-in account. */
  function userKey(k) { return Auth.user ? "u:" + Auth.user.id + ":" + k : "guest:" + k; }
  var state, drafts;
  function loadUserState() {
    var saved = store.get(userKey("state"), null);
    if (!saved && Auth.user) {
      // First sign-in on this browser: carry over progress made before accounts existed.
      saved = store.get("state", null);
      var oldDrafts = store.get("drafts", null);
      if (oldDrafts) store.set(userKey("drafts"), oldDrafts);
    }
    var view = state ? state.view : "home";
    state = Object.assign({ lang: "python", view: "home", pos: {}, answers: {}, solved: {}, visited: {} }, saved || {});
    state.view = view;
    if (!state.visited) state.visited = {};
    if (!byId[state.lang]) state.lang = "python";
    drafts = store.get(userKey("drafts"), {});
  }
  loadUserState();
  var hintsShown = {};
  var saveTimer = null;

  I.set(store.get("locale", null) || I.detect());
  document.documentElement.lang = I.get();

  function save() { store.set(userKey("state"), state); }
  function saveDrafts() {
    clearTimeout(saveTimer);
    var key = userKey("drafts"), snapshot = drafts;
    saveTimer = setTimeout(function () { store.set(key, snapshot); }, 300);
  }
  function pos(lang) {
    return state.pos[lang] || (state.pos[lang] = { lesson: 0, quiz: 0, challenge: 0 });
  }
  function answers(lang) { return state.answers[lang] || (state.answers[lang] = {}); }
  function solved(lang) { return state.solved[lang] || (state.solved[lang] = {}); }

  /* Content in the current interface language, falling back to English per field. */
  var locCache = {};
  function loc(l) {
    var key = l.id + "|" + I.get();
    if (locCache[key]) return locCache[key];
    var tr = l.i18n && l.i18n[I.get()];
    if (!tr) return (locCache[key] = l);
    function pick(base, over, fields) {
      var o = Object.assign({}, base);
      if (over) fields.forEach(function (f) { if (over[f] != null && over[f] !== "") o[f] = over[f]; });
      return o;
    }
    return (locCache[key] = Object.assign({}, l, {
      tagline: tr.tagline || l.tagline,
      runtime: tr.runtime || l.runtime,
      lessons: l.lessons.map(function (x, i) { return pick(x, tr.lessons[i], ["title", "summary", "body"]); }),
      quiz: l.quiz.map(function (x, i) { return pick(x, tr.quiz[i], ["question", "options", "explain"]); }),
      challenges: l.challenges.map(function (x, i) { return pick(x, tr.challenges[i], ["title", "prompt", "hints", "tests"]); }),
    }));
  }
  function current() { return loc(byId[state.lang]); }

  function norm(s) {
    return String(s || "").replace(/\r/g, "").split("\n").map(function (l) { return l.replace(/\s+$/, ""); }).join("\n").replace(/\n+$/, "");
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var KBD = isMac ? "⌘ ↵" : "Ctrl ↵";
  function code(s) { return "<code>" + esc(s) + "</code>"; }

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var savedTheme = store.get("theme", null);
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  $("#theme-toggle").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") ||
      (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var next = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    store.set("theme", next);
  });

  /* ---------- Interface language ---------- */
  var localeSel = $("#ui-lang");
  localeSel.innerHTML = I.locales.map(function (l) {
    return '<option value="' + l.id + '"' + (l.id === I.get() ? " selected" : "") + ">" + esc(l.name) + "</option>";
  }).join("");
  localeSel.addEventListener("change", function () {
    I.set(localeSel.value);
    store.set("locale", I.get());
    document.documentElement.lang = I.get();
    applyChrome();
    Rauke.relabel();
    transition(function () { renderLangbar(); renderView(); });
  });

  function applyChrome() {
    $(".brand").setAttribute("aria-label", t("ui.home"));
    $("#theme-toggle").setAttribute("aria-label", t("ui.theme"));
    $("#theme-toggle").title = t("ui.theme");
    localeSel.setAttribute("aria-label", t("ui.language"));
    $(".locale").title = t("ui.language");
    langsEl.setAttribute("aria-label", t("ui.languageTabs"));
    $("#footer-text").textContent = t("footer");
    $("#home-btn").setAttribute("aria-label", t("nav.home"));
    $("#home-btn").title = t("nav.home");
    $("#home-btn .home-label").textContent = t("nav.home");
    renderAccount();
  }

  /* ---------- Account menu ---------- */
  document.addEventListener("click", function (e) {
    var box = $("#account"), menu = $(".account-menu", box);
    if (menu && !box.contains(e.target)) { menu.hidden = true; $(".account-btn", box).setAttribute("aria-expanded", "false"); }
  });
  function avatarHtml(u, size) {
    if (u.picture) return '<img class="avatar" src="' + esc(u.picture) + '" alt="" width="' + size + '" height="' + size + '" referrerpolicy="no-referrer">';
    var initial = (u.name || "?").trim().charAt(0).toUpperCase();
    return '<span class="avatar initial" style="width:' + size + "px;height:" + size + 'px">' + esc(initial) + "</span>";
  }
  function renderAccount() {
    var box = $("#account");
    var u = Auth.user;
    if (!u) { box.innerHTML = ""; box.hidden = true; return; }
    box.hidden = false;
    box.innerHTML =
      '<button class="account-btn" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="' + esc(t("ui.account")) + '">' + avatarHtml(u, 30) + "</button>" +
      '<div class="account-menu" role="menu" hidden>' +
      '<div class="account-who">' + avatarHtml(u, 40) + '<div><strong></strong><span class="account-mail"></span><span class="account-via"></span></div></div>' +
      '<button class="btn ghost account-out" type="button" role="menuitem">' + esc(t("auth.signOut")) + "</button></div>";
    $(".account-who strong", box).textContent = u.name || "";
    $(".account-mail", box).textContent = u.email || "";
    $(".account-via", box).textContent = t("auth.via", { provider: t("auth.provider." + u.provider) });
    var btn = $(".account-btn", box), menu = $(".account-menu", box);
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
      btn.setAttribute("aria-expanded", String(!menu.hidden));
    });
    $(".account-out", box).addEventListener("click", function () { Auth.signOut(); });
  }

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
    if (state.view === "home") state.view = "learn";
    save();
    langsEl.querySelectorAll(".lang-tab").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.lang === id)); });
    placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl));
    transition(function () { renderLangbar(); renderView(); });
  }

  function setView(id) {
    state.view = id;
    save();
    var views = $(".views");
    if (!views) { transition(function () { renderLangbar(); renderView(); }); return; }
    views.querySelectorAll(".view-tab").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.view === id)); });
    placeIndicator(views, '[aria-selected="true"]', $(".view-indicator", views));
    transition(renderView);
  }

  /* ---------- Language bar ---------- */
  var langbar = $("#langbar");
  function renderLangbar() {
    var l = current();
    var showBar = state.view !== "home" && !!Auth.user;
    langbar.hidden = !showBar;
    document.body.classList.toggle("at-home", state.view === "home");
    if (!showBar) { langbar.innerHTML = ""; return; }
    langbar.innerHTML =
      '<div class="langbar-head"><div class="langbar-text">' +
      '<h1><span class="lang-dot" style="--dot: var(--lang-' + l.id + ')"></span>' + esc(l.name) + "</h1>" +
      '<p class="tagline">' + esc(l.tagline) + "</p>" +
      '<span class="runtime-chip' + (l.runner === "remote" ? " remote" : "") + '">' + esc(l.runtime) + "</span></div>" +
      '<button class="mascot-btn" type="button" title="' + esc(t("rauke.open")) + '"><img class="mascot" src="assets/mascot.webp" alt="' + esc(t("ui.mascot")) + '" width="84" height="91"></button></div>' +
      '<nav class="views" role="tablist" aria-label="' + esc(t("view.section")) + '">' +
      VIEWS.map(function (v) {
        return '<button class="view-tab" type="button" role="tab" data-view="' + v.id + '" aria-selected="' + (v.id === state.view) + '">' +
          esc(t(v.key)) + (v.count ? '<span class="count">' + v.count(l) + "</span>" : "") + "</button>";
      }).join("") + '<span class="view-indicator" aria-hidden="true"></span></nav>';
    $(".mascot-btn", langbar).addEventListener("click", function () { Rauke.open(); });
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
    activePg = null;
    raukeCtx = {};
    var l = current();
    Rauke.show(!!Auth.user);
    if (state.view === "home") renderHome();
    else if (!Auth.user) renderSignIn();
    else if (state.view === "learn") renderLearn(l);
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
    host.innerHTML =
      '<div class="pg' + (o.tall ? " tall" : "") + '">' +
      '<div class="pg-bar"><span class="pg-file"><span class="lang-dot" style="--dot: var(--lang-' + lang.id + ')"></span>' +
      "<span>" + esc(lang.filename) + '</span><span class="edited" hidden>' + esc(t("pg.edited")) + "</span></span>" +
      '<div class="pg-actions">' +
      '<button class="btn ghost" type="button" data-act="reset" title="' + esc(t("pg.resetTitle")) + '">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      esc(o.resetLabel || t("pg.reset")) + "</button>" +
      (o.secondary ? '<button class="btn" type="button" data-act="run">' + esc(t("pg.run")) + "</button>" : "") +
      '<button class="btn primary" type="button" data-act="primary">' +
      '<svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z" fill="currentColor"/></svg>' +
      esc(o.primaryLabel || t("pg.run")) + " <kbd>" + KBD + "</kbd></button>" +
      "</div></div>" +
      '<div class="pg-body"><div class="pg-editor"></div>' +
      '<div class="pg-out"><div class="pg-out-head"><span>' + esc(t(isHtml ? "pg.preview" : "pg.output")) + '</span><span class="status">' + esc(t("pg.ready")) + "</span></div>" +
      '<div class="pg-out-body"></div></div></div></div>';

    var pgEl = $(".pg", host);
    var outBody = $(".pg-out-body", host);
    var statusEl = $(".status", host);
    var editedEl = $(".edited", host);
    var primaryBtn = $('[data-act="primary"]', host);
    var runBtn = $('[data-act="run"]', host);
    var channel = "c" + (++channelSeq);
    var frame = null, consoleEl = null, lastOutput = "";

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
    cm.getWrapperElement().setAttribute("aria-label", t("pg.editor", { lang: lang.name }));
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

    function showText(parts, noteHtml, noteKind) {
      var html = "";
      parts.forEach(function (p) {
        if (!p.text) return;
        html += '<span class="' + (p.cls || "") + '">' + esc(p.text) + "</span>";
      });
      outBody.innerHTML = '<pre class="reveal">' + (html || '<span class="dim">' + esc(t("pg.noOutput")) + "</span>") + "</pre>" +
        (noteHtml ? '<div class="out-note reveal' + (noteKind ? " " + noteKind : "") + '">' + noteHtml + "</div>" : "");
    }

    function showReference() {
      if (o.reference == null) {
        outBody.innerHTML = '<pre><span class="dim">' + esc(t("pg.pressRun")) + "</span></pre>";
        setStatus("", t("pg.ready"));
        return;
      }
      showText([{ text: o.reference, cls: "dim" }], th("pg.expectedNote"));
      setStatus("ref", t("pg.expected"));
    }

    /* HTML preview */
    function renderPreview(src, checks, onChecks) {
      var logs = [];
      outBody.innerHTML = "";
      frame = document.createElement("iframe");
      frame.className = "preview-frame reveal";
      frame.setAttribute("sandbox", "allow-scripts");
      frame.setAttribute("title", t("pg.previewTitle"));
      consoleEl = document.createElement("div");
      consoleEl.className = "console-strip";
      outBody.appendChild(frame);
      outBody.appendChild(consoleEl);
      channels[channel] = function (d) {
        if (d.checks && onChecks) { onChecks(d.checks); return; }
        if (typeof d.text === "string") {
          logs.push(d);
          lastOutput = logs.map(function (x) { return x.text; }).join("\n");
          consoleEl.innerHTML = "<pre>" + logs.map(function (x) {
            return '<span class="' + (x.stream === "stderr" ? "err" : "") + '">' + esc(x.text) + "</span>";
          }).join("\n") + "</pre>";
        }
      };
      frame.srcdoc = R.htmlDocument(src, channel, checks);
      setStatus("ok", t("pg.rendered"));
    }

    function run() {
      var src = cm.getValue();
      if (isHtml) {
        renderPreview(src);
        return Promise.resolve({ html: true });
      }
      busy(true);
      setStatus("running", t("pg.running"));
      outBody.innerHTML = '<pre><span class="dim">' + esc(t("pg.running")) + "</span></pre>";
      var t0 = performance.now();
      return R.run(lang.id, src, function (msg) {
        setStatus("running", t("pg.running"));
        outBody.innerHTML = '<pre><span class="dim">' + esc(msg) + "</span></pre>";
      }).then(function (r) {
        busy(false);
        var ms = Math.round(performance.now() - t0);
        if (r.unreachable) {
          var unchanged = norm(src) === norm(o.original);
          if (unchanged && o.reference != null) {
            showText([{ text: o.reference }], esc(r.reason) + " " + th("pg.verifiedNote"), "warn");
            setStatus("ref", t("pg.verified"));
          } else {
            outBody.innerHTML = '<pre><span class="dim">' + esc(t("pg.notRunBody")) + "</span></pre>" +
              '<div class="out-note warn reveal">' + esc(r.reason) + " " +
              th(o.reference != null ? "pg.resetForVerified" : "pg.runLocally", { cmd: code(localRun(lang.id)) }) + "</div>";
            setStatus("err", t("pg.notRun"));
          }
          return r;
        }
        lastOutput = (r.stdout || "") + (r.stderr || "");
        var note = r.via ? th("pg.via", { via: esc(r.via) }) : "";
        showText([{ text: r.stdout }, { text: r.stderr, cls: "err" }], note);
        if (r.stderr) setStatus("err", t(r.timedOut ? "pg.stopped" : "pg.error"));
        else setStatus("ok", t("pg.doneIn", { time: ms < 1000 ? ms + " ms" : (ms / 1000).toFixed(1) + " s" }));
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

    var api = {
      cm: cm,
      run: run,
      renderPreview: renderPreview,
      setStatus: setStatus,
      busy: busy,
      setValue: function (v) { cm.setValue(v); },
      getValue: function () { return cm.getValue(); },
      element: pgEl,
      outputText: function () { return lastOutput; },
    };
    activePg = api;
    return api;
  }

  /* ---------- What Rauke sees ---------- */
  var activePg = null;
  var raukeCtx = {};
  function setRaukeContext(ctx) { raukeCtx = ctx; Rauke.relabel(); }
  function plainText(md) { return String(md || "").replace(/```[\s\S]*?```/g, "").replace(/[*`>#]/g, "").slice(0, 1800); }
  function raukeContext() {
    var c = Object.assign({}, raukeCtx);
    if (activePg && state.view !== "home") {
      c.code = activePg.getValue();
      var out = activePg.outputText().trim();
      if (out) c.output = out;
    }
    return c;
  }

  /* ---------- Rails & pager ---------- */
  function railHtml(label, items, cur, doneMap) {
    return '<nav class="rail" aria-label="' + esc(label) + '"><p class="rail-label">' + esc(label) + "</p>" +
      items.map(function (it, i) {
        return '<button class="rail-item' + (doneMap && doneMap[i] ? " done" : "") + '" type="button" data-index="' + i + '" aria-current="' + (i === cur) + '">' +
          '<span class="rail-num">' + (doneMap && doneMap[i] ? "✓" : i + 1) + "</span>" +
          '<span class="rail-text">' + (it.small ? "<small>" + esc(it.small) + "</small>" : "") + esc(it.title) + "</span></button>";
      }).join("") + "</nav>";
  }

  function pagerHtml(items, i, prevLabel, nextLabel) {
    var prev = items[i - 1], next = items[i + 1];
    return '<div class="pager">' +
      (prev ? '<button class="btn prev" type="button" data-go="' + (i - 1) + '"><span><small>' + esc(prevLabel) + "</small>← " + esc(prev.title) + "</span></button>" : "<span></span>") +
      (next ? '<button class="btn next" type="button" data-go="' + (i + 1) + '"><span><small>' + esc(nextLabel) + "</small>" + esc(next.title) + " →</span></button>" : "<span></span>") +
      "</div>";
  }

  function wireNav(container, go) {
    container.addEventListener("click", function (e) {
      var b = e.target.closest("[data-index], [data-go]");
      if (!b || !container.contains(b)) return;
      go(Number(b.dataset.index != null ? b.dataset.index : b.dataset.go));
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
    (state.visited[l.id] || (state.visited[l.id] = {}))[i] = true;
    save();
    setRaukeContext({ language: l.name, view: "lesson", title: lesson.title, task: plainText(lesson.body), where: l.name + " · " + lesson.title });
    viewEl.innerHTML =
      '<div class="workspace">' +
      railHtml(t("view.learn"), l.lessons, i) +
      '<article class="article">' +
      '<header class="article-head"><div class="eyebrow">' + esc(t("lesson.of", { n: i + 1, total: l.lessons.length })) + "</div>" +
      "<h2>" + esc(lesson.title) + "</h2>" + (lesson.summary ? '<p class="summary">' + esc(lesson.summary) + "</p>" : "") + "</header>" +
      '<div class="prose">' + M.render(lesson.body) + "</div>" +
      '<div class="eyebrow">' + esc(t("lesson.try")) + "</div>" +
      '<div id="lesson-pg"></div>' +
      pagerHtml(l.lessons, i, t("lesson.prev"), t("lesson.next")) +
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
      transition(function () { renderLearn(current()); scrollToContent(); });
    });
  }

  /* ---------- Quiz ---------- */
  var activeKeyHandler = null;
  document.addEventListener("keydown", function (e) {
    if (!activeKeyHandler) return;
    var tg = e.target;
    if (tg && (tg.closest(".CodeMirror") || /INPUT|TEXTAREA|SELECT/.test(tg.tagName))) return;
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
    setRaukeContext({ language: l.name, view: "quiz", title: q.question, task: (q.code ? q.code + "\n" : "") + q.options.join(" | "), where: l.name + " · " + t("quiz.label", { n: qi + 1 }) });
    var allDone = l.quiz.every(function (_, i) { return ans[i] != null; });
    viewEl.innerHTML =
      '<div class="quiz">' +
      '<div class="quiz-nav"><div class="eyebrow">' + esc(t("quiz.of", { n: qi + 1, total: l.quiz.length })) + "</div>" +
      '<div class="quiz-dots" role="list">' + l.quiz.map(function (qq, i) {
        var a = ans[i];
        var cls = a == null ? "" : a === qq.answer ? " right" : " wrong";
        return '<button class="quiz-dot' + cls + '" type="button" role="listitem" data-index="' + i + '" aria-current="' + (i === qi) + '" aria-label="' + esc(t("quiz.label", { n: i + 1 })) + '">' + (i + 1) + "</button>";
      }).join("") + "</div></div>" +
      '<div class="quiz-card">' +
      '<div class="quiz-q">' + M.inline(q.question) + "</div>" +
      (q.code ? '<div class="code-wrap">' + M.highlight(q.code, q.codeLang || l.id) + "</div>" : "") +
      '<div class="options">' + q.options.map(function (o, i) {
        return '<button class="option" type="button" data-opt="' + i + '"><span class="option-key">' + "ABCD"[i] + '</span><span class="option-text">' + optionHtml(o) + "</span></button>";
      }).join("") + "</div>" +
      '<div class="explain"><div><div class="explain-body"></div></div></div>' +
      "</div>" +
      '<div class="quiz-foot"><span class="hintline">' + esc(t("quiz.pick")) + "</span>" +
      '<div class="helper-row">' +
      (qi > 0 ? '<button class="btn ghost" type="button" data-go="' + (qi - 1) + '">' + esc(t("quiz.prev")) + "</button>" : "") +
      (qi < l.quiz.length - 1
        ? '<button class="btn primary" type="button" data-go="' + (qi + 1) + '">' + esc(t("quiz.next")) + "</button>"
        : '<button class="btn primary" type="button" data-restart>' + esc(t(allDone ? "quiz.restart" : "quiz.first")) + "</button>") +
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
      body.innerHTML = "<strong>" + esc(right ? t("quiz.right") : t("quiz.wrong", { key: "ABCD"[q.answer] })) + "</strong>" + M.inline(q.explain);
      var ex = $(".explain", card);
      if (animate) requestAnimationFrame(function () { ex.classList.add("open"); });
      else ex.classList.add("open");
      $(".hintline", viewEl).textContent = t(qi < l.quiz.length - 1 ? "quiz.enter" : "quiz.last");
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
      if (restart && l.quiz.every(function (_, k) { return ans[k] != null; })) restart.textContent = t("quiz.restart");
    }

    function go(n) {
      if (n === qi || n < 0 || n >= l.quiz.length) return;
      pos(l.id).quiz = n;
      save();
      transition(function () { renderQuiz(current()); });
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
      transition(function () { renderQuiz(current()); });
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
  function hintLabel(shown, total) {
    if (shown >= total) return t("hint.all");
    return shown === 0 ? t("hint.first") : t("hint.more", { n: shown, total: total });
  }

  function renderChallenges(l) {
    var p = pos(l.id);
    if (p.challenge >= l.challenges.length) p.challenge = 0;
    var ci = p.challenge, ch = l.challenges[ci];
    setRaukeContext({ language: l.name, view: "challenges", title: ch.title, task: plainText(ch.prompt), expected: ch.expected || "", where: l.name + " · " + ch.title });
    var hk = l.id + ":" + ci;
    var shown = hintsShown[hk] || 0;
    var done = solved(l.id);
    var kindCls = ch.kind.toLowerCase();
    viewEl.innerHTML =
      '<div class="workspace">' +
      railHtml(t("view.challenges"), l.challenges.map(function (c) { return { title: c.title, small: t("kind." + c.kind) }; }), ci, done) +
      '<section class="challenge">' +
      '<header class="article-head"><div class="eyebrow">' + esc(t("challenge.of", { n: ci + 1, total: l.challenges.length })) +
      ' &nbsp;<span class="kind-tag ' + kindCls + '">' + esc(t("kind." + ch.kind)) + "</span></div>" +
      "<h2>" + esc(ch.title) + "</h2></header>" +
      '<div class="challenge-prompt">' + M.render(ch.prompt) + "</div>" +
      '<div id="challenge-pg"></div>' +
      '<div id="challenge-result" aria-live="polite"></div>' +
      '<div class="helpers">' +
      '<div class="helper-row">' +
      '<button class="btn" type="button" data-hint>' + esc(hintLabel(shown, ch.hints.length)) + "</button>" +
      '<button class="btn ghost" type="button" data-solution aria-expanded="false">' + esc(t("sol.show")) + "</button></div>" +
      '<div class="hints">' + ch.hints.map(function (h, i) {
        return '<div class="hint' + (i < shown ? " open" : "") + '"><div><div class="hint-body"><b>' + (i + 1) + "/" + ch.hints.length + "</b><span>" + M.inline(h) + "</span></div></div></div>";
      }).join("") + "</div>" +
      '<div class="solution"><div><div class="solution-inner">' +
      '<div class="row"><span>' + esc(t("sol.note")) + "</span>" +
      '<button class="btn" type="button" data-use>' + esc(t("sol.use")) + "</button></div>" +
      '<div class="code-wrap">' + M.highlight(ch.solution, l.id) + "</div></div></div></div>" +
      "</div>" +
      pagerHtml(l.challenges, ci, t("challenge.prev"), t("challenge.next")) +
      "</section></div>";

    var resultEl = $("#challenge-result");
    var pg = createPlayground($("#challenge-pg"), {
      lang: l.id,
      key: l.id + ":challenge:" + ci,
      original: ch.starter,
      reference: null,
      primaryLabel: t("pg.check"),
      secondary: l.id !== "html",
      resetLabel: t("pg.resetShort"),
      onPrimary: check,
      onReset: function () { resultEl.innerHTML = ""; },
    });

    function markSolved() {
      done[ci] = true;
      save();
      var item = viewEl.querySelector('.rail-item[data-index="' + ci + '"]');
      if (item) { item.classList.add("done"); item.querySelector(".rail-num").textContent = "✓"; }
    }

    function showResult(kind, titleText, bodyHtml) {
      var mascot = kind === "pass" ? '<img class="result-mascot" src="assets/mascot.webp" alt="" width="34" height="37">' : "";
      var ask = kind === "fail" ? '<button class="btn ask-rauke" type="button"><img src="assets/rauke.webp" alt="" width="20" height="20">' + esc(t("res.askRauke")) + "</button>" : "";
      resultEl.innerHTML = '<div class="result ' + kind + ' reveal"><div class="result-head">' + mascot + "<span>" + esc(titleText) + "</span></div>" +
        (bodyHtml || ask ? '<div class="result-body">' + (bodyHtml || "") + (ask ? '<div class="helper-row">' + ask + "</div>" : "") + "</div>" : "") + "</div>";
      var b = $(".ask-rauke", resultEl);
      if (b) b.addEventListener("click", function () { Rauke.open(t("rauke.q.why")); });
    }

    function diffHtml(expected, got) {
      var e = norm(expected).split("\n"), g = norm(got).split("\n");
      var gotHtml = g.map(function (line, i) {
        return line !== e[i] ? '<span class="line-bad">' + (esc(line) || " ") + "</span>" : esc(line);
      }).join("\n");
      if (!norm(got)) gotHtml = '<span class="line-bad">' + esc(t("res.nothing")) + "</span>";
      return '<div class="diff"><div><h4>' + esc(t("res.expected")) + "</h4><pre>" + esc(norm(expected)) + "</pre></div>" +
        "<div><h4>" + esc(t("res.yours")) + "</h4><pre>" + gotHtml + "</pre></div></div>";
    }

    function check() {
      if (l.id === "html") {
        pg.busy(true);
        var finished = false;
        var timer = setTimeout(function () {
          if (finished) return;
          finished = true;
          pg.busy(false);
          showResult("fail", t("res.htmlTimeout"), "<p>" + esc(t("res.htmlTimeoutBody")) + "</p>");
        }, 4000);
        pg.renderPreview(pg.getValue(), ch.tests, function (results) {
          if (finished) return;
          finished = true;
          clearTimeout(timer);
          pg.busy(false);
          var pass = results.every(Boolean);
          var list = '<ul class="checklist">' + ch.tests.map(function (tc, i) {
            return '<li class="' + (results[i] ? "yes" : "no") + '"><span class="mark">' + (results[i] ? "✓" : "✕") + "</span><span>" + esc(tc.label) + "</span></li>";
          }).join("") + "</ul>";
          if (pass) { markSolved(); showResult("pass", t("res.allChecks", { n: results.length }), list); }
          else showResult("fail", t("res.someChecks", { passed: results.filter(Boolean).length, n: results.length }), list);
        });
        return;
      }
      resultEl.innerHTML = "";
      pg.run().then(function (r) {
        if (r.unreachable) {
          showResult("info", t("res.cantCheck"),
            "<p>" + esc(r.reason) + " " + th("res.cantCheckBody", { cmd: code(localRun(l.id)) }) + "</p>" +
            '<div class="diff"><div><h4>' + esc(t("res.expectedOutput")) + "</h4><pre>" + esc(norm(ch.expected)) + "</pre></div></div>");
          return;
        }
        var pass = !r.stderr && norm(r.stdout) === norm(ch.expected);
        if (pass) {
          markSolved();
          showResult("pass", t("res.pass"), "");
        } else if (r.stderr && !norm(r.stdout)) {
          showResult("fail", t("res.crashed"), "<p>" + esc(t("res.crashedBody")) + "</p>" + diffHtml(ch.expected, r.stdout));
        } else {
          showResult("fail", t("res.notYet"), "<p>" + esc(t("res.notYetBody")) + "</p>" + diffHtml(ch.expected, r.stdout));
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
      solBtn.textContent = t(open ? "sol.hide" : "sol.show");
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
      transition(function () { renderChallenges(current()); scrollToContent(); });
    }
  }

  /* ---------- Playground ---------- */
  function renderPlayground(l) {
    setRaukeContext({ language: l.name, view: "playground", where: l.name + " · " + t("view.playground") });
    viewEl.innerHTML =
      '<div class="article">' +
      '<header class="article-head"><div class="eyebrow">' + esc(t("view.playground")) + "</div><h2>" + esc(t("free.title")) + "</h2>" +
      '<p class="summary">' + esc(t("free.summary", { lang: l.name })) + "</p></header>" +
      '<div id="free-pg"></div></div>';
    createPlayground($("#free-pg"), {
      lang: l.id,
      key: l.id + ":playground",
      original: l.playground,
      reference: null,
      tall: true,
    });
  }

  /* ---------- Main menu ---------- */
  function progressOf(l) {
    var v = Object.keys(state.visited[l.id] || {}).length;
    var a = Object.keys(state.answers[l.id] || {}).length;
    var c = Object.keys(state.solved[l.id] || {}).filter(function (k) { return state.solved[l.id][k]; }).length;
    return { lessons: Math.min(v, l.lessons.length), quiz: Math.min(a, l.quiz.length), challenges: Math.min(c, l.challenges.length) };
  }
  function bar(label, n, total) {
    var pct = total ? Math.round((n / total) * 100) : 0;
    return '<div class="meter"><div class="meter-top"><span>' + esc(label) + '</span><span class="num">' + n + "/" + total + "</span></div>" +
      '<div class="meter-track"><span style="width:' + pct + '%"></span></div></div>';
  }
  function renderHome() {
    var u = Auth.user;
    var last = loc(byId[state.lang]);
    var lp = pos(last.id);
    var started = Object.keys(state.visited).length > 0;
    viewEl.innerHTML =
      '<div class="home">' +
      '<section class="home-hero">' +
      '<div class="home-hero-text"><h1>' + esc(u ? t("home.hello", { name: (u.name || "").split(" ")[0] }) : t("home.helloGuest")) + "</h1>" +
      '<p class="summary">' + esc(t("home.sub")) + "</p>" +
      '<div class="helper-row">' +
      (u
        ? '<button class="btn primary big" type="button" data-continue>' + esc(started ? t("home.continue") : t("home.startFirst")) + " →</button>" +
          (started ? '<span class="home-last">' + esc(last.name + " · " + last.lessons[Math.min(lp.lesson, last.lessons.length - 1)].title) + "</span>" : "")
        : '<button class="btn primary big" type="button" data-signin>' + esc(t("home.signIn")) + "</button>") +
      "</div></div>" +
      '<img class="home-mascot" src="assets/mascot.webp" alt="' + esc(t("ui.mascot")) + '" width="168" height="182"></section>' +
      '<h2 class="home-h2">' + esc(t("home.languages")) + "</h2>" +
      '<div class="lang-grid">' + LANGS.map(function (raw, i) {
        var l = loc(raw), pr = progressOf(raw);
        return '<article class="lang-card" style="--dot: var(--lang-' + l.id + "); --i:" + i + '">' +
          '<header><span class="lang-dot"></span><h3>' + esc(l.name) + "</h3></header>" +
          '<p class="lang-card-tag">' + esc(l.tagline) + "</p>" +
          (u ? '<div class="meters">' + bar(t("home.lessons"), pr.lessons, l.lessons.length) + bar(t("home.quiz"), pr.quiz, l.quiz.length) + bar(t("home.challenges"), pr.challenges, l.challenges.length) + "</div>" : "") +
          '<div class="lang-card-links">' +
          '<button class="btn" type="button" data-go-lang="' + l.id + '" data-go-view="learn">' + esc(t("view.learn")) + "</button>" +
          '<button class="btn ghost" type="button" data-go-lang="' + l.id + '" data-go-view="quiz">' + esc(t("view.quiz")) + "</button>" +
          '<button class="btn ghost" type="button" data-go-lang="' + l.id + '" data-go-view="challenges">' + esc(t("view.challenges")) + "</button>" +
          "</div></article>";
      }).join("") + "</div>" +
      '<section class="rauke-card"><img src="assets/rauke.webp" alt="" width="72" height="72">' +
      "<div><h2>" + esc(t("home.meetRauke")) + "</h2><p>" + esc(t("home.raukeBody")) + "</p>" +
      (u ? '<button class="btn" type="button" data-ask>' + esc(t("home.askRauke")) + "</button>" : "") + "</div></section>" +
      "</div>";
    viewEl.querySelectorAll("[data-go-lang]").forEach(function (b) {
      b.addEventListener("click", function () {
        state.lang = b.dataset.goLang;
        state.view = b.dataset.goView;
        save();
        langsEl.querySelectorAll(".lang-tab").forEach(function (x) { x.setAttribute("aria-selected", String(x.dataset.lang === state.lang)); });
        placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl));
        transition(function () { renderLangbar(); renderView(); window.scrollTo({ top: 0 }); });
      });
    });
    var c = $("[data-continue]", viewEl);
    if (c) c.addEventListener("click", function () { setView("learn"); });
    var si = $("[data-signin]", viewEl);
    if (si) si.addEventListener("click", function () { setView("learn"); });
    var ask = $("[data-ask]", viewEl);
    if (ask) ask.addEventListener("click", function () { Rauke.open(); });
  }

  function goHome() {
    state.view = "home";
    save();
    transition(function () { renderLangbar(); renderView(); window.scrollTo({ top: 0 }); });
  }

  /* ---------- Sign in ---------- */
  function renderSignIn() {
    var providers = Auth.providers;
    viewEl.innerHTML =
      '<section class="signin">' +
      '<img src="assets/rauke.webp" alt="" width="96" height="96">' +
      "<h1>" + esc(t("auth.title")) + "</h1>" +
      '<p class="summary">' + esc(t("auth.body")) + "</p>" +
      '<div class="signin-options">' +
      (providers.length ? "" : '<p class="dim">' + esc(t("auth.loading")) + "</p>") +
      (providers.indexOf("google") >= 0 ? '<div id="google-btn" class="google-btn"></div>' : "") +
      (providers.indexOf("claude") >= 0 ? '<button class="btn primary big" type="button" data-claude>' + esc(t("auth.claude")) + "</button>" : "") +
      (providers.indexOf("local") >= 0
        ? '<form class="local-form"><h2>' + esc(t("auth.localTitle")) + "</h2><p>" + esc(t("auth.localBody")) + "</p>" +
          (Auth.googleError ? '<p class="dim">' + esc(t("auth.googleError", { msg: Auth.googleError })) + "</p>" : "") +
          '<label for="local-name">' + esc(t("auth.localName")) + '</label><div class="helper-row"><input id="local-name" maxlength="40" autocomplete="given-name">' +
          '<button class="btn primary" type="submit">' + esc(t("auth.localCreate")) + "</button></div></form>"
        : "") +
      "</div></section>";
    var g = $("#google-btn");
    if (g) Auth.renderGoogleButton(g, { locale: I.get(), theme: document.documentElement.getAttribute("data-theme") === "dark" ? "filled_black" : "outline" });
    var cb = $("[data-claude]", viewEl);
    if (cb) cb.addEventListener("click", function () { Auth.signInWithClaude(); });
    var form = $(".local-form", viewEl);
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); Auth.signInLocal($("#local-name").value); });
  }

  Auth.onChange(function () {
    loadUserState();
    renderAccount();
    langsEl.querySelectorAll(".lang-tab").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.lang === state.lang)); });
    placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl), true);
    transition(function () { renderLangbar(); renderView(); });
  });
  $("#home-btn").addEventListener("click", goHome);
  Rauke.init({ getContext: raukeContext });

  /* ---------- Boot ---------- */
  applyChrome();
  renderLangbar();
  renderView();
  Auth.init();
  function placeAll() {
    placeIndicator(langsEl, '[aria-selected="true"]', $(".tab-indicator", langsEl), true);
    var views = $(".views");
    if (views) placeIndicator(views, '[aria-selected="true"]', $(".view-indicator", views), true);
  }
  requestAnimationFrame(placeAll);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeAll);
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(placeAll, 100);
  });
  $(".brand").addEventListener("click", function (e) {
    e.preventDefault();
    goHome();
  });
})();
