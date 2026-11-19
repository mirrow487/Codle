/*
 * Runs Lua source with Fengari (Lua 5.3 implemented in JavaScript).
 * print and io.write are redirected into a buffer; an instruction-count hook
 * stops runaway loops. Shared by the browser app and the verification script.
 */
(function (root) {
  "use strict";

  var INSTRUCTION_LIMIT = 50000000;
  var HOOK_EVERY = 100000;

  function runLua(fengari, code) {
    var lua = fengari.lua, lauxlib = fengari.lauxlib, lualib = fengari.lualib;
    var toLua = fengari.to_luastring;
    var L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);
    var out = "";

    function str(L, i) {
      lauxlib.luaL_tolstring(L, i);
      var s = lua.lua_tojsstring(L, -1);
      lua.lua_pop(L, 1);
      return s;
    }

    lua.lua_pushjsfunction(L, function (L) {
      var n = lua.lua_gettop(L), parts = [];
      for (var i = 1; i <= n; i++) parts.push(str(L, i));
      out += parts.join("\t") + "\n";
      return 0;
    });
    lua.lua_setglobal(L, toLua("print"));

    // fengari-web's browser build ships without the io library; provide io.write.
    if (lua.lua_getglobal(L, toLua("io")) !== lua.LUA_TTABLE) {
      lua.lua_pop(L, 1);
      lua.lua_newtable(L);
      lua.lua_pushvalue(L, -1);
      lua.lua_setglobal(L, toLua("io"));
    }
    lua.lua_pushjsfunction(L, function (L) {
      var n = lua.lua_gettop(L);
      for (var i = 1; i <= n; i++) {
        var t = lua.lua_type(L, i);
        if (t !== lua.LUA_TSTRING && t !== lua.LUA_TNUMBER) {
          return lauxlib.luaL_argerror(L, i, toLua("string expected, got " + fengari.to_jsstring(lauxlib.luaL_typename(L, i))));
        }
        out += str(L, i);
      }
      return 0;
    });
    lua.lua_setfield(L, -2, toLua("write"));
    lua.lua_pop(L, 1);

    var ticks = 0;
    lua.lua_sethook(L, function (L) {
      ticks += HOOK_EVERY;
      if (ticks > INSTRUCTION_LIMIT) {
        lauxlib.luaL_error(L, toLua("execution stopped: too many steps (infinite loop?)"));
      }
    }, lua.LUA_MASKCOUNT, HOOK_EVERY);

    var error = null;
    var status = lauxlib.luaL_loadbuffer(L, toLua(code), null, toLua("@main.lua"));
    if (status !== lua.LUA_OK) {
      error = lua.lua_tojsstring(L, -1);
    } else {
      status = lua.lua_pcall(L, 0, 0, 0);
      if (status !== lua.LUA_OK) {
        error = lua.lua_type(L, -1) === lua.LUA_TSTRING || lua.lua_type(L, -1) === lua.LUA_TNUMBER
          ? lua.lua_tojsstring(L, -1)
          : "error object is a " + str(L, -1);
      }
    }
    return { stdout: out, error: error };
  }

  var api = { runLua: runLua };
  root.CodleLua = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);
