/*! gb.js - the Agent guest book in the shared footer of every Cedwyn page (v1.0.0, 26 Oct 2026). Moves the page's
 * #cedwyn-guestbook into the shared legal footer, fills the newest 20 changes from /guestbook/guestbook.json (the one data
 * file every page reads) and labels it in the visitor's language (en / cy / es). Version links open the commit on GitHub
 * (a new tab). - Sion's Tab agent */
(function () {
  "use strict";
  if (window.__cedwynGB) return; window.__cedwynGB = 1;
  var DATA = location.origin + "/guestbook/guestbook.json", data = null, loading = false;   // absolute: the theme runtime prefixes root paths
  var L = {
    en: { title: "Agent guest book", v: "Version", d: "Date", n: "Change", w: "Who", all: "Full guest book: every change",
          rule: "versions 1.change.fix, from the commit history",
          intro: "Every change to this site, newest first. Each version opens the change on GitHub." },
    cy: { title: "Llyfr ymwelwyr yr asiantau", v: "Fersiwn", d: "Dyddiad", n: "Newid", w: "Pwy", all: "Y llyfr ymwelwyr llawn: pob newid",
          rule: "fersiynau 1.newid.trwsiad, o hanes y newidiadau",
          intro: "Pob newid i\u2019r wefan hon, y diweddaraf yn gyntaf. Mae pob fersiwn yn agor y newid ar GitHub." },
    es: { title: "Libro de visitas de los agentes", v: "Versi\u00f3n", d: "Fecha", n: "Cambio", w: "Qui\u00e9n", all: "Libro de visitas completo: todos los cambios",
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
  function place() {
    var all = document.querySelectorAll("#cedwyn-guestbook");
    for (var i = 1; i < all.length; i++) all[i].parentNode.removeChild(all[i]);
    var s = sec(), f = document.querySelector("[data-ghf-legal-foot]");
    if (s && f && s.parentNode !== f) f.appendChild(s);
  }
  function fill() {
    var s = sec(); if (!s || !data) return;
    var v = s.querySelector(".gb-v"); if (v) v.textContent = data.version ? "v" + data.version : "";
    var tb = s.querySelector(".gb-rows"); if (!tb || tb.getAttribute("data-filled")) return;
    var rows = (data.rows || []).filter(function (r) { return r.kind !== "build"; }).slice(0, data.show || 20), h = "";
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
  function absolutize() { var a = document.querySelectorAll('#cedwyn-guestbook a[href="/guestbook/"]'); for (var i = 0; i < a.length; i++) a[i].setAttribute("href", location.origin + "/guestbook/"); }
  function init() {
    absolutize(); place(); label(); untrapAll();
    var s = sec(), d = s && s.querySelector("details");
    if (d) d.addEventListener("toggle", function () { if (d.open) { load(); fill(); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
  addEventListener("load", function () { absolutize(); place(); label(); setTimeout(load, 800); });
  [600, 1500, 3000, 6000, 12000].forEach(function (t) { setTimeout(place, t); });
  if (window.MutationObserver && document.body) {
    var mo = new MutationObserver(function () { if (document.querySelector("[data-ghf-legal-foot]") && sec() && sec().parentNode !== document.querySelector("[data-ghf-legal-foot]")) place(); });
    mo.observe(document.body, { childList: true }); setTimeout(function () { mo.disconnect(); }, 20000);
  }
  document.addEventListener("ghf-lang-change", label); window.addEventListener("ghf-lang-change", label);
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
