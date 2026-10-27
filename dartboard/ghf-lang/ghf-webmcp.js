/*! ghf-webmcp.js — read-only WebMCP tools for every Great House Farm site · Cedwyn editors · 21 Oct 2026
 * Registers this site's tools with navigator.modelContext where the browser supports WebMCP (feature-detected; does
 * nothing otherwise). Each tool is a plain GET on this site's /agent/ endpoints, so agents without a browser read the same
 * data: https://<site>/.well-known/mcp.json lists them. Loaded from basecamp.js (shared header) or the site's homepage. */
(function  {
  if (window.GHFWebMCP) return; window.GHFWebMCP = "1.0.0";
  var d = document, mc = navigator.modelContext;
  if (!mc) return; // no WebMCP in this browser: nothing to do (agents without one read /.well-known/mcp.json)
  function call(t, args) {
    var u = new URL(t.endpoint, location.origin);
    Object.keys(args || {}).forEach(function (k) { var v = args[k]; if (v !== undefined && v !== null && v !== "") u.searchParams.set(k, typeof v === "object" ? JSON.stringify(v) : String(v)); });
    return fetch(u.href, { credentials: "omit", headers: { accept: "application/json" } })
      .then(function (r) { return r.text; })
      .then(function (txt) { return { content: [{ type: "text", text: txt.length > 200000 ? txt.slice(0, 200000) + "\n…(truncated; GET " + u.href + " for the rest)" : txt }] }; })
      .catch(function (e) { return { content: [{ type: "text", text: "Could not reach " + u.href + ": " + e }], isError: true }; });
  }
  fetch("/agent/tools.json", { credentials: "omit" }).then(function (r) { return r.ok ? r.json : null; }).then(function (T) {
    if (!T || !T.tools) return;
    if (mc) {
      var tools = T.tools.map(function (t) {
        return { name: t.name, description: t.description + " (read-only; " + T.site + ")", inputSchema: t.inputSchema || { type: "object", properties: {} }, annotations: { readOnlyHint: true }, execute: function (args) { return call(t, args); } };
      });
      try {
        // registerTool adds to whatever the page already registered (email. has its own tools); provideContext replaces, so it is the fallback
        if (typeof mc.registerTool === "function") tools.forEach(function (t) { try { mc.registerTool(t); } catch (e) {} });
        else if (typeof mc.provideContext === "function") mc.provideContext({ tools: tools });
      } catch (e) {}
    }
    window.GHFWebMCPTools = T.tools.map(function (t) { return t.name; });
  }).catch(function  {});
});
