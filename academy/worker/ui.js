// ui.js — the Cedwyn Academy's near-A2UI layer (Tab agent, 31 Oct 2026, task 320a574b).
// Every page is an A2UI v0.9 surface: createSurface (surface id + catalog), updateComponents (a flat list of components, each with an id,
// its props and its children by id; a list repeats a template over a data path) and updateDataModel (the page's view of the academy's own
// database). One renderer turns a surface into HTML on the server; only components named in CATALOG render (an unknown one is an error).
// Props bind as in the Cedwyn catalog (https://cedwyn.bucklerfamily.estate/_cedwyn/a2ui/catalog.json): a literal, {"path":"/abs"} into the
// data model, {"path":"rel"} into the current template item, or {"fmt":"…{k}…","args":{k:binding}}. "when" hides a component whose binding
// is falsy. Strings are always escaped. "Near" A2UI: message names, flat component list, path binding and the catalog model are followed;
// transport, actions and streaming are not used (the client script only reads data-* hooks the renderer writes).
export const CATALOG_ID = "https://academy.bucklerfamily.estate/_ui/catalog.json";
export const CATALOG = {
  catalogId: CATALOG_ID, version: "1.0.0", spec: "A2UI v0.9 message model (createSurface, updateComponents, updateDataModel)",
  extends: "https://cedwyn.bucklerfamily.estate/_cedwyn/a2ui/catalog.json",
  description: "The Cedwyn Academy's component catalog: the Cedwyn catalog's text and layout components plus the academy's own. Rendered on the server by worker/ui.js; the shared Cedwyn header, theme and header graph wrap every surface.",
  binding: "literal | {path:'/abs'} | {path:'rel'} | {fmt:'…{k}…', args:{k: binding}}; children: [ids] or {path, componentId}; when: binding (falsy = not rendered)",
  components: {
    Page: "main element (children)", Kicker: "small caps line above a title (text)", Heading: "h1–h3 (level, text, children: inline extras)",
    Text: "paragraph (text, className); empty renders nothing", RichText: "paragraph of runs (runs[{text, href}], className)",
    Link: "anchor (href, text, className)", Row: "inline row (children)", Card: "panel (domId, className, children)",
    Section: "titled section (heading, children)", TextList: "list (items[string | {b, text}], ordered)", Badge: "pill (text, className)",
    Notice: "status line (text)",
    InfoButton: "ⓘ button opening a dark modal (label, title, body[paragraphs])",
    VersionSelect: "'Select a version' dropdown (options[{v, label, href}], selected, go: show a Start button)",
    GradeList: "ordered list of grade cards (children template)", GradeCard: "one grade (n, title, blurb, status, statusClass, action{text, href, cls})",
    LockCard: "paywall card (text, children)", JoinCard: "subscription card: price, key facts, two ticks, Stripe link (price, points[], ticks[], href, carry)",
    CodeBox: "access code in the documentary style: the member's own code (own), or an entry box behind a \"Have an access code?\" link (heading, lead, placeholder, note)",
    FamilyCode: "family-code form (placeholder)", Questionnaire: "mount for one questionnaire, filled from /api/grade only when unlocked (v, n)"
  }
};
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const safeHref = h => { h = String(h || ""); return /^(https:\/\/|\/|#|\?)/.test(h) ? h : "#"; };
function ptr(o, p) { for (const k of String(p).replace(/^\//, "").split("/").filter(Boolean)) { if (o == null) return undefined; o = o[k.replace(/~1/g, "/").replace(/~0/g, "~")]; } return o; }
function val(v, M, it) {
  if (v && typeof v === "object" && !Array.isArray(v)) {
    if (typeof v.fmt === "string") return v.fmt.replace(/\{(\w+)\}/g, (m, k) => { const x = val((v.args || {})[k], M, it); return x == null ? "" : String(x); });
    if (typeof v.path === "string" && Object.keys(v).length === 1) return v.path.startsWith("/") ? ptr(M, v.path) : ptr(it, v.path);
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
  function node(id, it) {
    const c = by[id]; if (!c) throw new Error("missing component " + id);
    const P = k => val(c[k], M, it);
    if ("when" in c && !P("when")) return "";
    const kids = () => { const ch = c.children; if (!ch) return ""; if (Array.isArray(ch)) return ch.map(x => node(x, it)).join("");
      const list = val({ path: ch.path }, M, it) || []; return list.map(el => node(ch.componentId, el)).join(""); };
    const cls = x => x ? ' class="' + E(x) + '"' : "";
    switch (c.component) {
      case "Page": return '<main class="ac" id="main" data-surface="' + E(S.surfaceId) + '">' + kids() + "</main>";
      case "Kicker": return '<p class="ac-kick">' + E(P("text")) + "</p>";
      case "Heading": { const l = Math.min(3, Math.max(1, +P("level") || 2)); return "<h" + l + cls(P("className")) + ">" + E(P("text")) + kids() + "</h" + l + ">"; }
      case "Text": { const t = P("text"); return t ? "<p" + cls(P("className")) + ">" + E(t) + "</p>" : ""; }
      case "RichText": return "<p" + cls(P("className")) + ">" + (P("runs") || []).map(r => r.href ? '<a href="' + E(safeHref(r.href)) + '">' + E(r.text) + "</a>" : E(r.text)).join("") + "</p>";
      case "Link": return '<a href="' + E(safeHref(P("href"))) + '"' + cls(P("className")) + (P("domId") ? ' id="' + E(P("domId")) + '"' : "") + ">" + E(P("text")) + "</a>";
      case "Row": return '<div class="ac-row">' + kids() + "</div>";
      case "Card": return "<section" + (P("domId") ? ' id="' + E(P("domId")) + '"' : "") + ' class="ac-card ' + E(P("className") || "") + '">' + kids() + "</section>";
      case "Section": return '<section class="ac-sec"><h2>' + E(P("heading")) + "</h2>" + kids() + "</section>";
      case "TextList": { const t = P("ordered") ? "ol" : "ul"; return "<" + t + ' class="ac-list">' + (P("items") || []).map(x => "<li>" + (typeof x === "string" ? E(x) : "<b>" + E(x.b) + "</b>" + E(x.text)) + "</li>").join("") + "</" + t + ">"; }
      case "Badge": return '<span class="ac-tag ' + E(P("className") || "") + '">' + E(P("text")) + "</span>";
      case "Notice": { const t = P("text"); return t ? '<p class="ac-note" role="status">' + E(t) + "</p>" : ""; }
      case "InfoButton": { const k = "im" + (++info); return '<button type="button" class="ib" data-info="' + k + '" aria-label="' + E(P("label")) + '">ⓘ</button><template id="' + k + '" data-title="' + E(P("title")) + '">' + (P("body") || []).map(p => "<p>" + E(p) + "</p>").join("") + "</template>"; }
      case "VersionSelect": {
        const opts = P("options") || [], sel = P("selected"), cur = opts.find(o => o.v === sel) || opts[0] || {};
        return '<div class="cm-vsel"><label class="cm-vlab" for="svsel">Select a version</label><div class="ac-row"><select id="svsel" class="cm-vs" autocomplete="off" data-go="' + (P("go") ? 1 : 0) + '">' +
          opts.map(o => '<option value="' + E(o.v) + '" data-href="' + E(safeHref(o.href)) + '" data-start="' + E(o.start || "") + '"' + (o.v === sel ? " selected" : "") + ">" + E(o.label) + "</option>").join("") + "</select></div>" +
          (P("go") ? '<p style="margin:10px 0 0"><a class="ac-btn" id="svgo" href="' + E(safeHref(cur.href)) + '">' + E(cur.start || "Open") + "</a></p>" : "") + "</div>";
      }
      case "GradeList": return '<ol class="ac-grades">' + kids() + "</ol>";
      case "GradeCard": { const a = P("action") || {};
        return '<li class="ac-grade ' + E(P("statusClass") || "") + '" id="g' + E(P("n")) + '"><h3><span class="ac-gn">Grade ' + E(P("n")) + "</span> " + E(P("title")) + "</h3><p class=\"ac-mut\">" + E(P("blurb")) + '</p><p class="ac-gst ' + E(P("stClass") || "") + '">' + E(P("status")) + "</p>" +
          (a.href ? '<a class="ac-btn ' + E(a.cls || "") + '" href="' + E(safeHref(a.href)) + '">' + E(a.text) + "</a>" : "") + "</li>"; }
      case "LockCard": return '<div class="ac-lock" id="' + E(P("domId") || "lock") + '"><p>' + E(P("text")) + "</p>" + kids() + "</div>";
      case "JoinCard": {
        const pts = P("points") || [], ticks = P("ticks") || [];
        return '<section class="ac-card" id="join"><div role="group" aria-label="Key information"><p class="ac-price">' + E(P("price")) + '</p><ul class="ac-list">' + pts.map(x => "<li>" + E(x) + "</li>").join("") + "</ul></div>" +
          ticks.map((t, i) => '<label class="ac-tick"><input type="checkbox" id="t' + (i + 1) + '"> ' + E(t) + "</label>").join("") +
          '<p><a class="ac-btn" id="joinbtn" aria-disabled="true" data-href="' + E(safeHref(P("href"))) + '" rel="nofollow" role="link">Subscribe to the Academy</a></p><p class="ac-mut" id="joinhint">Tick both boxes to continue to Stripe\'s secure checkout.</p>' +
          '<p class="ac-mut">Already a member on the main Cedwyn site? <a href="' + E(safeHref(P("carry"))) + '">Open your membership here</a>.</p><noscript><p class="ac-mut">Subscribing needs JavaScript switched on in your browser.</p></noscript></section>';
      }
      case "CodeBox": {
        const own = P("own");
        if (own) return '<div class="cd-gate" id="code"><h3>Your access code</h3><div class="cd-gcode"><p class="cd-gcl">Access code</p><p class="cd-gcv" translate="no">' + E(own) + '</p><p class="cd-gck">Use it to open v0.0.2 on another phone or computer. It works while your membership is active.</p><div class="cd-grow"><button type="button" class="cd-gcopy" data-copy="' + E(own) + '">Copy code</button></div></div></div>';
        return '<details class="ac-codewrap" id="' + E(c.id) + '"><summary class="ac-codelink">' + E(P("heading") || "Have an access code?") + '</summary><div class="cd-gate"><p class="cd-glead">' + E(P("lead") || "") + '</p><form class="cd-gform codef" autocomplete="off"><label for="cd-gin-' + E(c.id) + '" class="cd-gl">Access code</label><div class="cd-grow"><input id="cd-gin-' + E(c.id) + '" class="cd-gin" name="code" inputmode="text" autocapitalize="characters" spellcheck="false" placeholder="' + E(P("placeholder") || "ACD-XXXX-XXXX-XXXX") + '" maxlength="32"><button type="submit" class="cd-gok">Unlock</button></div><p class="cd-gmsg" role="status" aria-live="polite"></p></form><p class="cd-gnote">' + E(P("note") || "") + "</p></div></details>";
      }
      case "FamilyCode": return '<details class="ac-card ac-fam" id="family"><summary>Have a family code?</summary><p class="ac-mut">Family of the Cedwyn estate join with the family code they were given, instead of paying. It opens every version in this browser the same way a membership does, and nothing is charged.</p><form id="famf" autocomplete="off"><label for="famc">Family code</label><input id="famc" class="ac-in" name="code" type="text" inputmode="text" autocapitalize="characters" autocorrect="off" spellcheck="false" maxlength="48" placeholder="' + E(P("placeholder") || "CEDWYN-FAMILY-XXXX-XXXX-XXXX") + '"><p style="margin:12px 0 0"><button type="submit" class="ac-btn">Use family code</button></p></form><p id="famm" class="ac-mut" role="status" aria-live="polite"></p></details>';
      case "Questionnaire": return '<div id="qz" data-v="' + E(P("v")) + '" data-g="' + E(P("n")) + '"><div id="gsticky"><p id="gp" class="ac-mut" style="margin:0">Loading…</p><div class="bar"><i id="gbar"></i></div></div><div id="qs"></div><div id="res"></div></div>';
    }
    throw new Error("no renderer for " + c.component);
  }
  return node("root", null);
}
