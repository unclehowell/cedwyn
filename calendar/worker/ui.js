// ui.js — the Cedwyn Calendar's near-A2UI layer (Tab agent, 31 Oct 2026, task 5ec27d7d). Same model and renderer shape as the Cedwyn
// Academy (academy.bucklerfamily.estate/_ui/catalog.json): createSurface (surface id + catalog), updateComponents (a flat list of components,
// each with an id, its props and its children by id) and updateDataModel (the page's view of the calendar's own derived db). One renderer
// turns a surface into HTML on the server; only components named in CATALOG render. Props bind: a literal, {"path":"/abs"}, or {"fmt":"…{k}…",
// "args":{k:binding}}; "when" hides a component whose binding is falsy. Strings are always escaped. The Calendar component is a mount: the
// browser script draws the views from /api/events (the same derived db the surface's data model summarises).
export const CATALOG_ID = "https://calendar.bucklerfamily.estate/_ui/catalog.json";
export const CATALOG = {
  catalogId: CATALOG_ID, version: "0.0.1", spec: "A2UI v0.9 message model (createSurface, updateComponents, updateDataModel)",
  extends: "https://cedwyn.bucklerfamily.estate/_cedwyn/a2ui/catalog.json",
  description: "The Cedwyn Calendar's component catalog: the Cedwyn catalog's text components plus the calendar mount. Rendered on the server by worker/ui.js; the shared Cedwyn header, theme and header graph wrap every surface.",
  binding: "literal | {path:'/abs'} | {fmt:'…{k}…', args:{k: binding}}; children: [ids]; when: binding (falsy = not rendered)",
  components: {
    Page: "main element (children)", Heading: "h1–h3 (level, text, className, children: inline extras)", Text: "paragraph (text, className); empty renders nothing",
    Link: "anchor (href, text, className)", InfoButton: "ⓘ button opening a dark modal (label, title, body[paragraphs])",
    Calendar: "the calendar mount: toolbar, view switcher (Day, Week, Month, Year, Compare, Decades) and the view area, drawn in the browser from /api/events (view, date, api, children: the toolbar's extras)",
    Fallback: "noscript list of records per decade (rows[{decade, n, years}])"
  }
};
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const safeHref = h => { h = String(h || ""); return /^(https:\/\/|\/|#|\?)/.test(h) ? h : "#"; };
function ptr(o, p) { for (const k of String(p).replace(/^\//, "").split("/").filter(Boolean)) { if (o == null) return undefined; o = o[k]; } return o; }
function val(v, M) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    if (typeof v.fmt === "string") return v.fmt.replace(/\{(\w+)\}/g, (m, k) => { const x = val((v.args || {})[k], M); return x == null ? "" : String(x); });
    if (typeof v.path === "string" && Object.keys(v).length === 1) return ptr(M, v.path);
  }
  return v;
}
export function surface(id, components, model) {
  return [{ version: "v0.9", createSurface: { surfaceId: id, catalogId: CATALOG_ID } },
          { version: "v0.9", updateComponents: { surfaceId: id, components } },
          { version: "v0.9", updateDataModel: { surfaceId: id, path: "/", value: model } }];
}
export function render(msgs) {
  const S = msgs.find(m => m.createSurface).createSurface, C = msgs.find(m => m.updateComponents).updateComponents.components;
  const M = (msgs.find(m => m.updateDataModel) || { updateDataModel: { value: {} } }).updateDataModel.value;
  const by = {}; C.forEach(c => { if (!CATALOG.components[c.component]) throw new Error("unknown component " + c.component); by[c.id] = c; });
  let info = 0;
  function node(id) {
    const c = by[id]; if (!c) throw new Error("missing component " + id);
    const P = k => val(c[k], M);
    if ("when" in c && !P("when")) return "";
    const kids = () => (c.children || []).map(node).join("");
    const cls = x => x ? ' class="' + E(x) + '"' : "";
    switch (c.component) {
      case "Page": return '<main class="cal" id="main" data-surface="' + E(S.surfaceId) + '">' + kids() + "</main>";
      case "Heading": { const l = Math.min(3, Math.max(1, +P("level") || 2)); return "<h" + l + cls(P("className")) + ">" + E(P("text")) + kids() + "</h" + l + ">"; }
      case "Text": { const t = P("text"); return t ? "<p" + cls(P("className")) + ">" + E(t) + "</p>" : ""; }
      case "Link": return '<a href="' + E(safeHref(P("href"))) + '"' + cls(P("className")) + ">" + E(P("text")) + "</a>";
      case "InfoButton": { const k = "im" + (++info); return '<button type="button" class="ib" data-info="' + k + '" aria-label="' + E(P("label")) + '">ⓘ</button><template id="' + k + '" data-title="' + E(P("title")) + '">' + (P("body") || []).map(p => "<p>" + E(p) + "</p>").join("") + "</template>"; }
      case "Calendar": return '<section id="cal" class="cal-app" data-api="' + E(safeHref(P("api"))) + '" data-view="' + E(P("view") || "") + '" data-date="' + E(P("date") || "") + '">' +
        '<div class="cal-bar"><button type="button" class="cal-nav" id="cal-prev" aria-label="Previous">‹</button><button type="button" class="cal-title" id="cal-title" aria-label="Go to a year">…</button><button type="button" class="cal-nav" id="cal-next" aria-label="Next">›</button>' + kids() + '</div>' +
        '<div class="cal-views" role="tablist" aria-label="Zoom level">' + ["day", "week", "month", "year", "compare", "decades"].map(v => '<button type="button" role="tab" data-v="' + v + '">' + (v[0].toUpperCase() + v.slice(1)) + "</button>").join("") + '</div>' +
        '<p class="cal-cov" id="cal-cov" aria-live="polite"></p><div id="cal-body" class="cal-body"><p class="cal-mut">Loading the chronology…</p></div><div class="cal-zoom"><button type="button" id="cal-zout" aria-label="Zoom out">−</button><button type="button" id="cal-zin" aria-label="Zoom in">+</button></div></section>';
      case "Fallback": return '<noscript><p class="cal-mut">The calendar needs JavaScript. Records per decade:</p><ul class="cal-fb">' + (P("rows") || []).map(r => "<li><b>" + E(r.decade) + "</b> " + E(r.n) + " records, " + E(r.years) + " of 10 years with a record</li>").join("") + "</ul></noscript>";
    }
    throw new Error("no renderer for " + c.component);
  }
  return node("root");
}
