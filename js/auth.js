/*
 * Codle accounts.
 *
 * Providers, in order of preference:
 *  - "google": Google Identity Services (Sign in with Google). Needs a client
 *              ID in CODLE_CONFIG (or from /api/config). The ID token it
 *              returns also authorizes requests to Rauke's server function.
 *  - "claude": inside a claude.ai Artifact, the viewer's Claude account
 *              (runtime `user` capability). Google's script can't load there.
 *  - "local" : a profile kept in this browser only, offered when neither of
 *              the above is available (e.g. Google sign-in not configured yet).
 *
 * The signed-in user is { id, name, email, picture, provider }. Progress is
 * stored per user id by the app.
 */
(function () {
  "use strict";

  var cfg = window.CODLE_CONFIG || {};
  var SESSION_KEY = "codle:session";
  var listeners = [];
  var state = {
    user: null,
    idToken: null,
    idTokenExp: 0,
    googleReady: false,
    googleError: null,
    claudeUser: null,
    providers: [],
  };

  function readSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch (e) { return null; }
  }
  function writeSession() {
    try {
      if (state.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify({ user: state.user, idToken: state.idToken, idTokenExp: state.idTokenExp }));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) { /* storage unavailable */ }
  }
  function emit() { listeners.forEach(function (fn) { try { fn(state.user); } catch (e) { console.error(e); } }); }

  function setUser(user, token, exp) {
    state.user = user;
    state.idToken = token || null;
    state.idTokenExp = exp || 0;
    writeSession();
    emit();
  }

  /* Decodes a JWT payload (no verification: the server verifies tokens it relies on). */
  function decodeJwt(token) {
    var part = String(token).split(".")[1] || "";
    var b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = resolve;
      s.onerror = function () { reject(new Error("Couldn't load " + src)); };
      document.head.appendChild(s);
    });
  }

  function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise(function (resolve) { setTimeout(function () { resolve(null); }, ms); })]);
  }

  /* --- Google --- */
  function onGoogleCredential(resp) {
    try {
      var p = decodeJwt(resp.credential);
      setUser({
        id: "g_" + p.sub,
        name: p.name || p.given_name || p.email,
        email: p.email || "",
        picture: p.picture || "",
        provider: "google",
      }, resp.credential, (p.exp || 0) * 1000);
    } catch (e) {
      state.googleError = e.message;
      emit();
    }
  }

  function initGoogle() {
    if (!cfg.googleClientId || /^file:/.test(location.protocol)) return Promise.resolve(false);
    return loadScript("https://accounts.google.com/gsi/client").then(function () {
      if (!window.google || !google.accounts || !google.accounts.id) throw new Error("Google Identity Services unavailable");
      google.accounts.id.initialize({
        client_id: cfg.googleClientId,
        callback: onGoogleCredential,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: "popup",
      });
      state.googleReady = true;
      return true;
    }).catch(function (e) {
      state.googleError = e.message;
      return false;
    });
  }

  /* --- Claude account (inside a claude.ai Artifact) --- */
  function initClaude() {
    if (!window.claude || typeof window.claude.use !== "function") return Promise.resolve(false);
    return withTimeout(window.claude.use("user"), 12000).then(function (u) {
      if (!u) return false;
      return u.me().then(function (me) {
        if (!me || !me.id) return false;
        state.claudeUser = { id: "c_" + me.id, name: me.name || "", email: me.email || "", picture: me.avatarUrl || "", provider: "claude" };
        return true;
      });
    }).catch(function () { return false; });
  }

  function fetchServerConfig() {
    if (cfg.googleClientId || !cfg.configEndpoint || !/^https?:/.test(location.protocol)) return Promise.resolve();
    return withTimeout(fetch(cfg.configEndpoint, { headers: { Accept: "application/json" } }).then(function (r) {
      return r.ok ? r.json() : null;
    }).then(function (j) {
      if (j && j.googleClientId) cfg.googleClientId = j.googleClientId;
      if (j && "raukeAvailable" in j) cfg.raukeAvailable = !!j.raukeAvailable;
    }).catch(function () {}), 4000);
  }

  var ready = null;
  function init() {
    if (ready) return ready;
    var saved = readSession();
    if (saved && saved.user) {
      state.user = saved.user;
      state.idToken = saved.idToken || null;
      state.idTokenExp = saved.idTokenExp || 0;
    }
    ready = fetchServerConfig().then(function () {
      return Promise.all([initGoogle(), initClaude()]);
    }).then(function (res) {
      state.providers = [];
      if (res[0]) state.providers.push("google");
      if (res[1]) state.providers.push("claude");
      if (!state.providers.length) state.providers.push("local");
      // A Claude-account session follows whoever is viewing the artifact.
      if (state.user && state.user.provider === "claude") {
        if (state.claudeUser) state.user = state.claudeUser;
        else state.user = null;
        writeSession();
      }
      emit();
      return state.providers;
    });
    return ready;
  }

  window.CodleAuth = {
    init: init,
    get user() { return state.user; },
    get providers() { return state.providers.slice(); },
    get googleError() { return state.googleError; },
    onChange: function (fn) { listeners.push(fn); },

    /* Renders Google's own sign-in button into `el`. */
    renderGoogleButton: function (el, opts) {
      if (!state.googleReady) return false;
      google.accounts.id.renderButton(el, Object.assign({
        type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "pill", width: 280,
      }, opts || {}));
      return true;
    },

    signInWithClaude: function () {
      if (state.claudeUser) setUser(state.claudeUser);
      return !!state.claudeUser;
    },

    signInLocal: function (name) {
      name = String(name || "").trim().slice(0, 40);
      if (!name) return false;
      var id = "l_" + Array.from(crypto.getRandomValues(new Uint8Array(8))).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
      setUser({ id: id, name: name, email: "", picture: "", provider: "local" });
      return true;
    },

    signOut: function () {
      if (state.user && state.user.provider === "google" && state.googleReady) {
        try { google.accounts.id.disableAutoSelect(); } catch (e) { /* ignore */ }
      }
      setUser(null);
    },

    /* A Google ID token that is still valid for at least a minute, or null. */
    freshIdToken: function () {
      if (!state.idToken || Date.now() > state.idTokenExp - 60000) return null;
      return state.idToken;
    },

    /* Asks Google for a new ID token (One Tap). Resolves when the user is re-signed or after a timeout. */
    refreshGoogle: function () {
      if (!state.googleReady) return Promise.resolve(false);
      return new Promise(function (resolve) {
        var done = false;
        var off = function (u) { if (!done && u && state.idToken && Date.now() < state.idTokenExp) { done = true; resolve(true); } };
        listeners.push(off);
        try { google.accounts.id.prompt(); } catch (e) { /* ignore */ }
        setTimeout(function () { if (!done) { done = true; resolve(false); } }, 15000);
      });
    },

    _decodeJwt: decodeJwt,
  };
})();
