/*! GHF "Agent" chat widget (was "Ask the archive") — chat.bucklerfamily.estate/widget.js — Cedwyn editors, 20 Oct 2026.
 * Opt out per site/page: <html data-ghf-chat="off"> or <meta name="ghf-chat" content="off">. Never on clerk./chess./email. */
(function () {
  "use strict";
  if (window.GHFChat) return;
  var host = location.hostname, de = document.documentElement;
  if (/^(clerk|chess|email)\./.test(host)) return;
  if (de.getAttribute("data-ghf-chat") === "off") return;
  var m = document.querySelector('meta[name="ghf-chat"]'); if (m && /off/i.test(m.getAttribute("content") || "")) return;
  if (/^\/3d(\/|$)/.test(location.pathname)) return;
  var API = "https://cedwyn.bucklerfamily.estate/chat/api/chat";
  window.GHFChat = { version: "1.0.0" };
  var L = {
    en: { open: "Agent", title: "Agent", note: "AI answers from our published pages; may be wrong.", ph: "Ask about Tŷ Mawr, the record or the e-books…", send: "Send", close: "Close chat", src: "Sources", wait: "Searching the published pages…", err: "Sorry, that didn't go through. Please try again in a minute.", hi: "Ask a question about Great House Farm (Tŷ Mawr), its history, the published record, the e-books or the shop. Answers come only from our published pages, with links." },
    cy: { open: "Asiant", title: "Asiant", note: "Atebion AI o'n tudalennau cyhoeddedig; gallant fod yn anghywir.", ph: "Holwch am Dŷ Mawr, y cofnod neu'r e-lyfrau…", send: "Anfon", close: "Cau'r sgwrs", src: "Ffynonellau", wait: "Yn chwilio'r tudalennau…", err: "Mae'n ddrwg gennym, ni weithiodd hynny. Rhowch gynnig arall ymhen munud.", hi: "Gofynnwch gwestiwn am Fferm y Tŷ Mawr, ei hanes, y cofnod cyhoeddedig, yr e-lyfrau neu'r siop. Daw'r atebion o'n tudalennau cyhoeddedig yn unig. Nid cyngor cyfreithiol." },
    es: { open: "Agente", title: "Agente", note: "Respuestas de IA a partir de nuestras páginas publicadas; pueden contener errores.", ph: "Pregunta sobre Tŷ Mawr, el registro o los e-books…", send: "Enviar", close: "Cerrar chat", src: "Fuentes", wait: "Buscando en las páginas publicadas…", err: "Lo sentimos, no se pudo enviar. Inténtalo de nuevo en un minuto.", hi: "Haz una pregunta sobre Great House Farm (Tŷ Mawr), su historia, el registro publicado, los e-books o la tienda. Las respuestas salen solo de nuestras páginas publicadas. No es asesoramiento legal." }
  };
  function lang() { var l = (de.getAttribute("lang") || "en").slice(0, 2).toLowerCase(); try { l = localStorage.getItem("ghf-lang") || l; } catch (e) {} return L[l] ? l : "en"; }
  var T = L[lang()];
  if (host === "app.bucklerfamily.estate" || host === "apps.bucklerfamily.estate") T = Object.assign({}, T, { note: "AI answers about this service and our published pages; may be wrong.", ph: "Ask about the service, prices or the demo…", hi: "Hello, I'm the Case Office agent. Ask me about the service, prices, how to start, or the Great House Farm demo. I can't give legal advice." });
  var pair = (window.GHFBasecamp && window.GHFBasecamp.colors) || ["#0d0d0d", "#f2c94c"];
  var P = pair[0] || "#0d0d0d", S = pair[1] || "#f2c94c";
  var opened = 0, busy = false;
  function el(t, c, txt) { var e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; }
  var css = el("style"); css.setAttribute("data-ghf-chat", "");
  css.textContent =
    ".ghfc-btn{position:fixed;right:14px;bottom:14px;z-index:2147483000;display:flex;align-items:center;gap:8px;min-height:48px;padding:0 16px 0 12px;border-radius:999px;border:2px solid " + S + ";background:" + P + ";color:#fff;font:600 14px/1 Barlow,'Helvetica Neue',Arial,system-ui,sans-serif;box-shadow:0 4px 18px rgba(0,0,0,.35);cursor:pointer;-webkit-tap-highlight-color:transparent}" +
    ".ghfc-btn svg{width:22px;height:22px;flex:0 0 22px}.ghfc-btn:focus-visible,.ghfc-x:focus-visible,.ghfc-send:focus-visible,.ghfc-in:focus-visible{outline:3px solid " + S + ";outline-offset:2px}" +
    ".ghfc-panel{position:fixed;right:10px;bottom:10px;z-index:2147483001;width:min(380px,calc(100vw - 20px));height:min(560px,calc(100vh - 20px));height:min(560px,calc(100dvh - 20px));display:none;flex-direction:column;background:#fff;color:#111;border-radius:16px;border:2px solid " + P + ";box-shadow:0 10px 40px rgba(0,0,0,.4);overflow:hidden;font:400 15px/1.45 Barlow,'Helvetica Neue',Arial,system-ui,sans-serif;text-align:left;letter-spacing:0;text-transform:none}" +
    ".ghfc-panel.on{display:flex}.ghfc-hd{background:" + P + ";color:#fff;padding:10px 12px 9px;border-bottom:4px solid " + S + ";display:flex;align-items:flex-start;gap:8px}" +
    ".ghfc-hd b{display:block;font-size:16px;color:#fff}.ghfc-hd small{display:block;font-size:12px;opacity:.9;color:#fff;margin-top:2px}.ghfc-hd div{flex:1}" +
    ".ghfc-x{background:transparent;border:0;color:#fff;font-size:26px;line-height:1;width:44px;height:44px;margin:-8px -8px 0 0;cursor:pointer}" +
    ".ghfc-log{flex:1;overflow-y:auto;padding:12px;background:#f6f6f4;-webkit-overflow-scrolling:touch}" +
    ".ghfc-m{max-width:88%;margin:0 0 10px;padding:9px 11px;border-radius:12px;white-space:pre-wrap;word-wrap:break-word;color:#111}" +
    ".ghfc-u{margin-left:auto;background:" + P + ";color:#fff;border-bottom-right-radius:4px}.ghfc-a{background:#fff;border:1px solid #ddd;border-bottom-left-radius:4px}" +
    ".ghfc-s{margin-top:7px;font-size:12.5px;color:#444}.ghfc-s a{display:block;color:" + P + ";text-decoration:underline;padding:3px 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".ghfc-f{display:flex;gap:6px;padding:8px;border-top:1px solid #ddd;background:#fff}" +
    ".ghfc-in{flex:1;min-width:0;font:inherit;font-size:16px;padding:10px 11px;border:1px solid #bbb;border-radius:10px;color:#111;background:#fff}" +
    ".ghfc-send{min-width:64px;min-height:44px;border:0;border-radius:10px;background:" + P + ";color:#fff;font:600 15px Barlow,Arial,sans-serif;border-bottom:3px solid " + S + ";cursor:pointer}.ghfc-send[disabled]{opacity:.55}" +
    ".ghfc-hp{position:absolute!important;left:-9999px!important;width:1px;height:1px;opacity:0}" +
    "body.ghfc-has-bc .ghfc-btn{bottom:14px}@media print{.ghfc-btn,.ghfc-panel{display:none!important}}";
  (document.head || de).appendChild(css);
  var btn = el("button", "ghfc-btn"); btn.type = "button"; btn.setAttribute("aria-haspopup", "dialog"); btn.setAttribute("data-no-translate", "");
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="' + S + '" stroke-width="2"><path d="M4 5h16v10H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>';
  btn.appendChild(el("span", "", T.open));
  var pn = el("div", "ghfc-panel"); pn.setAttribute("role", "dialog"); pn.setAttribute("aria-label", T.title); pn.setAttribute("data-no-translate", "");
  var hd = el("div", "ghfc-hd"), hw = el("div"); hw.appendChild(el("b", "", T.title)); hw.appendChild(el("small", "", T.note));
  var x = el("button", "ghfc-x", "×"); x.type = "button"; x.setAttribute("aria-label", T.close);
  hd.appendChild(hw); hd.appendChild(x);
  var log = el("div", "ghfc-log"); log.setAttribute("aria-live", "polite");
  var f = el("form", "ghfc-f"); f.setAttribute("autocomplete", "off");
  var inp = el("input", "ghfc-in"); inp.type = "text"; inp.maxLength = 500; inp.placeholder = T.ph; inp.setAttribute("aria-label", T.ph); inp.name = "q";
  var hp = el("input", "ghfc-hp"); hp.type = "text"; hp.name = "website"; hp.tabIndex = -1; hp.setAttribute("aria-hidden", "true"); hp.autocomplete = "off";
  var sb = el("button", "ghfc-send", T.send); sb.type = "submit";
  f.appendChild(inp); f.appendChild(hp); f.appendChild(sb);
  pn.appendChild(hd); pn.appendChild(log); pn.appendChild(f);
  function add(cls, text, sources) {
    var d = el("div", "ghfc-m " + cls, text);
    if (sources && sources.length) {
      var s = el("div", "ghfc-s"); s.appendChild(el("div", "", T.src + ":"));
      sources.forEach(function (x, i) { var a = el("a", "", "[" + (i + 1) + "] " + (x.title || x.url)); a.href = x.url; a.target = "_blank"; a.rel = "noopener"; s.appendChild(a); });
      d.appendChild(s);
    }
    log.appendChild(d); log.scrollTop = log.scrollHeight; return d;
  }
  function open() { if (!opened) { opened = Date.now(); add("ghfc-a", T.hi); } pn.classList.add("on"); btn.style.display = "none"; setTimeout(function () { inp.focus(); }, 30); }
  function close() { pn.classList.remove("on"); btn.style.display = ""; btn.focus(); }
  btn.addEventListener("click", open); x.addEventListener("click", close);
  window.GHFChat.open = function () { open(); };
  pn.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  f.addEventListener("submit", function (e) {
    e.preventDefault(); var q = inp.value.trim(); if (!q || busy) return;
    busy = true; sb.disabled = true; add("ghfc-u", q); inp.value = ""; var w = add("ghfc-a", T.wait);
    fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ q: q, website: hp.value, t: Date.now() - opened, page: location.origin + location.pathname, lang: lang() }) })
      .then(function (r) { return r.json().catch(function () { return {}; }); })
      .then(function (j) { w.remove(); add("ghfc-a", j.answer || T.err, j.sources); })
      .catch(function () { w.remove(); add("ghfc-a", T.err); })
      .then(function () { busy = false; sb.disabled = false; inp.focus(); });
  });
  // keep clear of the base camp pill (bottom-left): if they overlap on a narrow screen, sit just above it
  function place() {
    btn.style.bottom = "14px";
    var n = document.querySelector(".ghf-bc"); if (!n) return;
    var a = btn.getBoundingClientRect(), b = n.getBoundingClientRect();
    if (b.width && b.height && a.left < b.right && a.right > b.left && a.bottom > b.top) btn.style.bottom = Math.round(window.innerHeight - b.top + 8) + "px";
  }
  function mount() {
    if (!document.body) return; document.body.appendChild(btn); document.body.appendChild(pn);
    place(); setTimeout(place, 800); setTimeout(place, 2500); window.addEventListener("resize", place);
    if (/[?&#]ask=1\b/.test(location.href)) open();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
