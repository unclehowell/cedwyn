/*! Cedwyn version gate · /_cedwyn/version-gate.js · v1.0.0 (2026-11-01) · Cedwyn editors
 * A click-to-load facade in the media slot (never a full-page overlay, never a separate chooser page): where a gated item would
 * load (the e-book PDF reader, a documentary clip), a random image from the NFT collection shows with "Select a version" and a
 * down arrow, and a drop-down of the item's versions from /_cedwyn/version-gate.json, the free one preselected (one tap opens it).
 * Choosing the free version loads the item in place; a paid version goes to the existing checkout (the page's own Buy flow).
 * While a free item is open, a one-line, dismissible bar names the newer full version with its whole price and size, linking
 * inside the site. The choice is kept for the browser session (sessionStorage "cvg:<item>"). An item with no paid version gets
 * no gate. Pages with no matching item are untouched; without JS every item keeps its plain link. Argentina scope: no prices, no bar.
 * Counts: /_cedwyn/ev/vgate-shown|vgate-free|vgate-paid/<item>/<page> (zone analytics) and <html data-cvg-shown/-passed>.
 * Loaded (deferred) by /_cedwyn/ghf/ghf-boot.js. Spec: docs/VERSION-GATE.md.
 * CHANGELOG
 * 1.0.0 (2026-11-01): first version: e-books (shelf reader + /ebooks/read/) and documentary clips with a paid cut. */
(function () {
  "use strict";
  if (window.CedwynVersionGate) return;
  var d = document, de = d.documentElement, VER = "1.0.0", MF = "/_cedwyn/version-gate.json?v=" + VER, M = null, pending = null;
  var T = {
    sel: {en: "Select a version", cy: "Dewiswch fersiwn", es: "Seleccione una versión"},
    preview: {en: "free preview", cy: "rhagolwg am ddim", es: "vista previa gratuita"},
    earlier: {en: "free earlier edition", cy: "argraffiad cynharach am ddim", es: "edición anterior gratuita"},
    freecut: {en: "free cut", cy: "toriad am ddim", es: "montaje gratuito"},
    full: {en: "full edition", cy: "argraffiad llawn", es: "edición completa"},
    cut: {en: "newest cut", cy: "toriad diweddaraf", es: "montaje más reciente"},
    of: {en: "of", cy: "o", es: "de"},
    pages: {en: "pages", cy: "tudalen", es: "páginas"},
    openp: {en: "Open the free preview", cy: "Agor y rhagolwg am ddim", es: "Abrir la vista previa gratuita"},
    opene: {en: "Open the free edition", cy: "Agor yr argraffiad am ddim", es: "Abrir la edición gratuita"},
    openc: {en: "Play the free cut", cy: "Chwarae’r toriad am ddim", es: "Ver el montaje gratuito"},
    buy: {en: "Buy", cy: "Prynu", es: "Comprar"},
    bar: {en: "Full edition:", cy: "Argraffiad llawn:", es: "Edición completa:"},
    barcut: {en: "Newest cut:", cy: "Toriad diweddaraf:", es: "Montaje más reciente:"},
    see: {en: "What’s added", cy: "Beth sy’n newydd", es: "Qué añade"},
    hide: {en: "Hide", cy: "Cuddio", es: "Ocultar"}
  };
  function L() { var l = "en"; try { l = (window.GHFLang && GHFLang.get()) || de.getAttribute("lang") || "en"; } catch (e) {} l = String(l).slice(0, 2); return T.sel[l] ? l : "en"; }
  function t(k) { var l = L(); return (T[k] && (T[k][l] || T[k].en)) || k; }
  function nf(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }
  function el(tag, cls, txt) { var x = d.createElement(tag); if (cls) x.className = cls; if (txt != null) x.textContent = txt; return x; }
  function argentina() { var s = de.getAttribute("data-cedwyn-scope"); return s === "argentina" || /^\/(argentina|patagonia)(\/|$)/.test(location.pathname); }
  function ss(k, v) { try { if (v === undefined) return sessionStorage.getItem("cvg:" + k); sessionStorage.setItem("cvg:" + k, v); } catch (e) {} return null; }
  function count(name, key) {
    var a = "data-cvg-" + name; de.setAttribute(a, String((+de.getAttribute(a) || 0) + 1));
    try { new Image().src = "/_cedwyn/ev/vgate-" + name + "/" + encodeURIComponent(String(key).replace(/[^a-z0-9.:-]+/gi, "-")) + "/" + encodeURIComponent((location.pathname.replace(/^\/|\/$/g, "") || "home").replace(/\//g, "_")); } catch (e) {}
  }
  function css() {
    if (d.querySelector("link[data-cvg]")) return;
    var l = d.createElement("link"); l.rel = "stylesheet"; l.href = "/_cedwyn/version-gate.css?v=" + VER; l.setAttribute("data-cvg", ""); (d.head || de).appendChild(l);
  }
  function load() {
    if (M) return Promise.resolve(M);
    return fetch(MF, {credentials: "same-origin"}).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (j) { M = j; return j; });
  }
  /* "v0.0.1 — free preview (20 of 221 pages)" · "v0.0.1 — free earlier edition (30 pages)" · "v0.0.2 — full edition, £4.99 (221 pages)" */
  function label(item, which) {
    var o = item[which], s = "v" + o.v + " — ";
    if (which === "free") {
      var n = o.pages ? (o.kind === "preview" && item.paid && item.paid.pages ? " (" + nf(o.pages) + " " + t("of") + " " + nf(item.paid.pages) + " " + t("pages") + ")" : " (" + nf(o.pages) + " " + t("pages") + ")") : "";
      return s + t(o.kind || "preview") + n;
    }
    return s + t(o.kind || "full") + (o.price && !argentina() ? ", " + o.price : "") + (o.pages ? " (" + nf(o.pages) + " " + t("pages") + ")" : "");
  }
  /* ---------- the facade, built inside the slot the item would load into ---------- */
  function facade(item) {
    css(); count("shown", item.key);
    var f = el("div", "cvg"); f.setAttribute("data-no-translate", ""); f.setAttribute("data-ghf-keep", "");
    var fig = el("figure", "cvg-fig"), imgs = (M && M.images) || [];
    if (imgs.length) { var im = el("img", "cvg-img"); im.alt = ""; im.decoding = "async"; im.src = imgs[Math.floor(Math.random() * imgs.length)]; fig.appendChild(im); }
    var cap = el("figcaption", "cvg-cap"); cap.appendChild(el("span", "cvg-h", t("sel"))); var ar = el("span", "cvg-arr", "↓"); ar.setAttribute("aria-hidden", "true"); cap.appendChild(ar);
    fig.appendChild(cap); f.appendChild(fig);
    var id = "cvg-s-" + Math.random().toString(36).slice(2, 8), lab = el("label", "cvg-lab", t("sel")); lab.htmlFor = id; f.appendChild(lab);
    var s = el("select", "cvg-s"); s.id = id; s.setAttribute("autocomplete", "off");
    var of = el("option", "", label(item, "free")); of.value = "free"; of.selected = true; s.appendChild(of);
    if (item.paid && !argentina()) { var op = el("option", "", label(item, "paid")); op.value = "paid"; s.appendChild(op); }
    f.appendChild(s);
    var b = el("button", "cvg-go"); b.type = "button"; f.appendChild(b);
    function paint() { b.textContent = s.value === "paid" ? t("buy") + " v" + item.paid.v + (item.paid.price && !argentina() ? " · " + item.paid.price : "") : t(item.cut ? "openc" : (item.free.kind === "preview" ? "openp" : "opene")); }
    paint();
    function go(v) { if (v === "paid") { count("paid", item.key); item.buy(); } else { ss(item.key, "free"); count("passed", item.key); item.open(); bar(item); } }
    s.addEventListener("change", function () { paint(); if (s.value === "free") go("free"); });
    b.addEventListener("click", function () { go(s.value); });
    d.addEventListener("ghf-lang-change", function () { fig.querySelector(".cvg-h").textContent = t("sel"); lab.textContent = t("sel"); of.textContent = label(item, "free"); if (op) op.textContent = label(item, "paid"); paint(); });
    return f;
  }
  /* ---------- the bar: one line, dismissible, while the free item is open ---------- */
  var BAR = null, watch = null;
  function hideBar() { if (BAR) BAR.hidden = true; de.classList.remove("cvg-barred"); clearInterval(watch); }
  function bar(item) {
    if (!item.paid || argentina() || ss(item.key + ":bar") === "x") return;
    css();
    if (!BAR) { BAR = el("div", "cvg-bar"); BAR.setAttribute("role", "status"); BAR.setAttribute("data-no-translate", ""); BAR.setAttribute("data-ghf-keep", ""); (d.body || de).appendChild(BAR); }
    BAR.innerHTML = "";
    var p = item.paid, txt = t(item.cut ? "barcut" : "bar") + " " + [p.price, p.pages ? nf(p.pages) + " " + t("pages") : "v" + p.v].filter(Boolean).join(", ");
    BAR.appendChild(el("span", "cvg-bt", txt));
    var a = el("a", "cvg-bl", t("see")); a.href = item.path; BAR.appendChild(a);
    var x = el("button", "cvg-bx", "×"); x.type = "button"; x.setAttribute("aria-label", t("hide")); x.title = t("hide");
    x.addEventListener("click", function () { ss(item.key + ":bar", "x"); hideBar(); }); BAR.appendChild(x);
    BAR.hidden = false; de.classList.add("cvg-barred");
    clearInterval(watch); if (item.isOpen) watch = setInterval(function () { if (!item.isOpen()) hideBar(); }, 700);
  }
  /* ---------- e-books: the PDF reader's own slot (.edp-mbody in the reader dialog, [data-edp-viewer] on /ebooks/read/) ---------- */
  function bookKey(gb) { return String(gb || "").split("@")[0]; }
  function ebook(k, title) {
    var e = M && M.ebooks && M.ebooks[k]; if (!e || !e.paid) return null;   // no paid version: no gate
    var cid = e.card; if (!cid) { var ca = d.querySelector('a[data-gb^="' + k + '@"]'), li = ca && ca.closest("li[id]"); cid = li ? li.id : ""; }
    var path = (M.purchase_path || "/ebooks/") + (cid ? "#" + cid : "");
    return {key: "ebook:" + k, title: title || "", free: e.free, paid: e.paid, path: path,
      buy: function () {
        var card = cid && d.getElementById(cid), go = card && card.querySelector(".sv-go"), sel = card && card.querySelector(".sv-sel");
        if (go && sel) { sel.value = "v" + e.paid.v; try { sel.dispatchEvent(new Event("change", {bubbles: true})); } catch (x) {} go.click(); }
        else location.href = path;
      }};
  }
  function swapIn(slot, item, plain) {   // the slot keeps loading off-screen; the facade takes its place until a version is chosen
    var ph = plain ? el("div", "cvg-slot cvg-page") : slot.cloneNode(false); ph.classList.add("cvg-slot"); ph.appendChild(facade(item));
    slot.parentNode.replaceChild(ph, slot);
    item.open = function () { if (ph.parentNode) ph.parentNode.replaceChild(slot, ph); };
    return ph;
  }
  d.addEventListener("click", function (ev) {   // capture: note which book link is being opened
    pending = null;
    if (!M || !window.__edp || ev.button || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    var a = ev.target.closest && ev.target.closest("a[data-edp-pdf]"); if (!a) return;
    var gb = a.getAttribute("data-gb") || ((/[?&]book=([^&#]+)/.exec(a.getAttribute("data-edp-pdf")) || [])[1] || "");
    var item = ebook(bookKey(decodeURIComponent(gb)), a.getAttribute("data-title"));
    if (!item) return;
    item.isOpen = function () { var m = d.querySelector(".edp-mod"); return !!(m && !m.hidden); };
    if (ss(item.key) === "free") { setTimeout(function () { bar(item); }, 0); return; }
    pending = item;
  }, true);
  window.addEventListener("click", function () {   // bubble, after the reader has opened: gate its slot
    var item = pending; pending = null; if (!item) return;
    var m = d.querySelector(".edp-mod"); if (!m || m.hidden) return;
    var box = m.querySelector(".edp-mbody"); if (!box) return;
    swapIn(box, item);
  });
  function readerPage() {
    var vb = d.querySelector("[data-edp-viewer]"); if (!vb) return;
    var gb = new URLSearchParams(location.search).get("book") || "", item = ebook(bookKey(gb), ""); if (!item) return;
    if (ss(item.key) === "free") { bar(item); return; }
    swapIn(vb, item, true);
  }
  /* ---------- documentary clips (movie/<id>/<id>.<lang>.v<semver>.webm) with a paid cut ---------- */
  function onPath(ps) { var p = location.pathname; return (ps || []).some(function (x) { return p.indexOf(x) === 0; }); }
  function clip(v) {
    var m = M && M.movie, C = window.CedwynDoc; if (!m || !onPath(m.paths) || !C || !C.entries || !C.chips) return null;
    var src = v.currentSrc || v.src || ""; if (!src) { var so = v.querySelector("source"); src = so ? so.src : ""; }
    var x = new RegExp(m.file).exec(src); if (!x) return null;
    var n = null, k;
    try { for (k in C.entries) { var e = C.entries[k]; var cid = String((e && e.clip) || "").split("/").pop().split(".")[0]; if (e && (e.id === x[1] || cid === x[1])) { n = +k; break; } } } catch (er) {}
    if (n == null) return null;
    var ch = (C.chips(n) || [])[0]; if (!ch || !ch.paid || ch.coming || (C.owns && C.owns(n, ch.v))) return null;   // no unowned paid cut: no gate
    if (String(ch.v).replace(/^v/, "") === x[3]) return null;   // this file already is the paid cut
    return {key: "clip:" + x[1] + ":" + x[3], free: {v: x[3], kind: "freecut"}, paid: {v: String(ch.v).replace(/^v/, ""), kind: "cut", price: m.price || ""},
      cut: true, path: m.purchase_path || "/documentary/", buy: function () { try { C.buyLatest(n); } catch (e) { location.href = m.purchase_path || "/documentary/"; } },
      isOpen: function () { return d.contains(v) && !v.paused; }};
  }
  d.addEventListener("play", function (ev) {
    var v = ev.target; if (!M || !v || v.tagName !== "VIDEO" || v.__cvgOk) return;
    var item = clip(v); if (!item) return;
    if (ss(item.key) === "free") { v.__cvgOk = 1; bar(item); return; }
    try { v.pause(); } catch (e) {}
    var f = facade(item); f.classList.add("cvg-inslot"); v.parentNode.insertBefore(f, v); v.style.display = "none";
    item.open = function () { v.__cvgOk = 1; if (f.parentNode) f.parentNode.removeChild(f); v.style.display = ""; var p = v.play(); if (p && p.catch) p.catch(function () {}); };
  }, true);
  function start() { load().then(readerPage).catch(function () { M = null; }); }
  window.CedwynVersionGate = {version: VER};
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", start); else start();
})();
