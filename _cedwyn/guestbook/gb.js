/*! gb.js - the Agent guest book in the shared footer of every Cedwyn page (v1.0.1, 26 Oct 2026). Moves the page's
 * #cedwyn-guestbook into the shared legal footer, fills the newest 20 changes from /guestbook/guestbook.json (the one data
 * file every page reads) and labels it in the visitor's language (en / cy / es). Version links open the commit on GitHub
 * (a new tab). - Cedwyn editors */
(function () {
  "use strict";
  if (window.__cedwynGB) return; window.__cedwynGB = 1;
  var DATA = location.origin + "/guestbook/guestbook.json", data = null, loading = false;   // absolute: the theme runtime prefixes root paths
  var L = {
    en: { title: "Agent guest book", v: "Version", d: "Date", n: "Change", w: "Who", all: "See all",
          rule: "versions 1.change.fix, from the commit history",
          intro: "Every change to this site, newest first. Each version opens the change on GitHub." },
    cy: { title: "Llyfr ymwelwyr yr asiantau", v: "Fersiwn", d: "Dyddiad", n: "Newid", w: "Pwy", all: "Gweld y cyfan",
          rule: "fersiynau 1.newid.trwsiad, o hanes y newidiadau",
          intro: "Pob newid i\u2019r wefan hon, y diweddaraf yn gyntaf. Mae pob fersiwn yn agor y newid ar GitHub." },
    es: { title: "Libro de visitas de los agentes", v: "Versi\u00f3n", d: "Fecha", n: "Cambio", w: "Qui\u00e9n", all: "Ver todo",
          rule: "versiones 1.cambio.correcci\u00f3n, del historial de cambios",
          intro: "Todos los cambios de este sitio, del m\u00e1s reciente al m\u00e1s antiguo. Cada versi\u00f3n abre el cambio en GitHub." }
  };
  function lang() {
    var l = (document.documentElement.getAttribute("lang") || "").slice(0, 2).toLowerCase();
    if (!L[l]) { try { l = (localStorage.getItem("ghf_lang") || "en").slice(0, 2); } catch (e) { l = "en"; } }
    return L[l] ? l : "en";
  }
  function label() {
    var D = L[lang()], els = document.querySelectorAll("[data-gb-l]");
    for (var i = 0; i < els.length; i++) { var k = els[i].getAttribute("data-gb-l"); if (D[k]) els[i].textContent = D[k]; }
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function link(repo, sha) { return ["https:", "", "github.com", repo, "commit", sha].join("/"); }   // opens GitHub directly (allowed out, 26 Oct 2026)
  function sec() { return document.getElementById("cedwyn-guestbook"); }
  // v1.0.1: a full-screen app page (body does not scroll, e.g. the chessboard) has no shared legal footer: the guest book joins
  // the app's own footer line (or, with none, sits small at the bottom-left) and opens as a panel above it
  function appPage() { try { return /hidden|clip/.test(getComputedStyle(document.body).overflowY + " " + getComputedStyle(document.documentElement).overflowY); } catch (e) { return false; } }
  function appLine() {
    var fs = document.querySelectorAll("footer"), best = null;
    for (var i = 0; i < fs.length && !best; i++) {
      var r = fs[i].getBoundingClientRect(); if (!r.height || r.bottom > innerHeight + 2 || r.top < 0) continue;
      var w = document.createTreeWalker(fs[i], NodeFilter.SHOW_TEXT), t;
      while ((t = w.nextNode())) if (t.nodeValue.indexOf("\u00a9") >= 0 && !(t.parentNode.closest && t.parentNode.closest("#cedwyn-guestbook"))) { best = t.parentNode; break; }
    }
    return best ? (best.parentNode && best.parentNode.nodeType === 1 && best.parentNode.tagName !== "FOOTER" ? best.parentNode : best) : null;
  }
  function place() {
    var all = document.querySelectorAll("#cedwyn-guestbook");
    for (var i = 1; i < all.length; i++) all[i].parentNode.removeChild(all[i]);
    var s = sec(); if (!s) return;
    var f = document.querySelector("[data-ghf-legal-foot]");
    if (f) { s.classList.remove("gb-dock", "gb-fixed"); if (s.parentNode !== f) f.appendChild(s); return; }
    if (!document.body || !appPage()) return;
    var l = appLine();
    if (l) { s.classList.add("gb-dock"); s.classList.remove("gb-fixed"); if (s.parentNode !== l) l.appendChild(s); }
    else { s.classList.add("gb-dock", "gb-fixed"); if (s.parentNode !== document.body) document.body.appendChild(s); }
    var p = s.querySelector("details > p"), w = s.querySelector(".gbw"); if (p && w) w.appendChild(p);
    if (!document.getElementById("cedwyn-gb-dock-css")) { var st = document.createElement("style"); st.id = "cedwyn-gb-dock-css";
      st.textContent = "#cedwyn-guestbook.gb-dock{display:inline!important;margin:0 0 0 6px!important;padding:0!important;max-width:none}" +
        "#cedwyn-guestbook.gb-dock details,#cedwyn-guestbook.gb-dock summary{display:inline!important}#cedwyn-guestbook.gb-dock .gb-r{display:none}" +
        "#cedwyn-guestbook.gb-fixed{position:fixed!important;left:8px;bottom:8px;z-index:2147482000;display:block!important;padding:2px 8px!important;border-radius:10px;background:Canvas!important;color:CanvasText!important;opacity:.9}" +
        "#cedwyn-guestbook.gb-dock details[open]>.gbw{position:fixed!important;left:8px;right:8px;bottom:44px;max-height:60vh;overflow:auto;z-index:2147483000;margin:0!important;padding:8px!important;" +
        "background:Canvas!important;color:CanvasText!important;border:1px solid rgba(128,128,128,.5);border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.35);text-align:left!important}";
      (document.head || document.documentElement).appendChild(st); }
  }
  // the page's own scripts may re-render <body> (e.g. a React app that hydrates the whole page): put the guest book back, as the agent footer does
  var TPL = null;
  function keep() {
    if (sec() || !TPL || !document.body) return;
    var n = TPL.cloneNode(true); document.body.appendChild(n); wire(n); absolutize(); place(); label(); if (data) fill();
  }
  function wire(s) { var d = s && s.querySelector("details"); if (d) d.addEventListener("toggle", function () { if (d.open) { load(); fill(); } }); }
  function fill() {
    var s = sec(); if (!s || !data) return;
    var v = s.querySelector(".gb-v"); if (v) v.textContent = data.version ? "v" + data.version : "";
    var tb = s.querySelector(".gb-rows"); if (!tb || tb.getAttribute("data-filled")) return;
    var rows = (data.rows || []).filter(function (r) { return r.kind !== "build"; }).slice(0, 3), h = "";
    rows.forEach(function (r) {
      h += '<tr><td><a href="' + esc(link(data.repo, r.sha)) + '" target="_blank" rel="noopener" title="' + esc(r.sha.slice(0, 7)) + '">' + esc(r.v) + "</a></td><td>" +
        esc(r.date) + "</td><td>" + esc(r.note) + "</td><td>" + esc(r.who) + "</td></tr>";
    });
    tb.innerHTML = h; tb.setAttribute("data-filled", "1");
  }
  function load() {
    if (data || loading) return; loading = true;
    fetch(DATA, { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (d) { data = d; fill(); })
      .catch(function () { loading = false; });
  }
  function untrapAll() {   // the full guest book page's static links pass through /wayback/go/ (the build's outbound guard): open GitHub directly
    var as = document.querySelectorAll('#guestbook a[href^="/wayback/go/?u="]');
    for (var i = 0; i < as.length; i++) { var u; try { u = decodeURIComponent(as[i].getAttribute("href").slice(15)); } catch (e) { continue; }
      if (/^https:\/\/github\.com\/unclehowell\/cedwyn\/commit\/[0-9a-f]{7,40}$/i.test(u)) { as[i].setAttribute("href", u); as[i].setAttribute("target", "_blank"); as[i].setAttribute("rel", "noopener"); } }
  }
  function absolutize() { var a = document.querySelectorAll('#cedwyn-guestbook a[data-gb-l="all"]'), u = location.origin + "/guestbook/"; for (var i = 0; i < a.length; i++) if (a[i].getAttribute("href") !== u) a[i].setAttribute("href", u); }
  // a theme runtime may prefix root links (/ebooks/guestbook/): the full guest book always opens at the site root
  document.addEventListener("click", function (e) { var a = e.target && e.target.closest && e.target.closest('#cedwyn-guestbook a[data-gb-l="all"]'); if (!a) return; if (e.button || e.metaKey || e.ctrlKey || e.shiftKey) { absolutize(); return; } e.preventDefault(); e.stopImmediatePropagation(); location.href = location.origin + "/guestbook/"; }, true);
  function init() {
    if (!TPL && sec()) TPL = sec().cloneNode(true);
    absolutize(); place(); label(); untrapAll(); wire(sec());
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  addEventListener("load", function () { keep(); absolutize(); place(); label(); setTimeout(load, 800); });
  [300, 600, 1300, 2600, 6100, 12100].forEach(function (t) { setTimeout(function () { keep(); place(); absolutize(); }, t); });
  if (window.MutationObserver) {
    var mo = new MutationObserver(function () { if (!sec()) { keep(); return; } var f = document.querySelector("[data-ghf-legal-foot]"); if (f && sec().parentNode !== f) place(); });
    mo.observe(document.documentElement, { childList: true, subtree: true }); setTimeout(function () { mo.disconnect(); }, 20000);
  }
  document.addEventListener("ghf-lang-change", label); window.addEventListener("ghf-lang-change", label);
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
