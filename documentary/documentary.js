/* Cedwyn · documentary — versions, licence and checkout (page v1.3.0). A tab.bot production.
   The film has a semantic version: v1.0.0 is the first cut (Scene 1) and is free; each new scene adds a minor version
   (v1.1.0 = Scenes 1–2, v1.2.0 = Scenes 1–3, ...) and a re-cut of a scene adds a patch. Versions are worked out from the
   film's manifest (the same file that opens the doors), so a new daily scene becomes a new paid version on its own.
   FREE_FRAMES: scenes that are free in every version. The newest scenes need the viewing licence (£4.99, one checkout)
   or membership.
   MEMBER HOOK: members get every version free. isMember() is true when the page sets window.CEDWYN_MEMBER = true
   (e.g. a member script), or when GET /api/member (the academy's member check; {"member": false, "join": "/learn/"} until
   member sign-in is switched on) answers {"member": true}. Asked once when the page opens; a member sees no checkout.
   Unlock: the checkout returns to /documentary/?unlock=<checkout session id>; the version bought is kept on this device. */
(function () {
  "use strict";
  var GO = "/wayback/go/?u=https%3A%2F%2Fbuy.stripe.com%2FaFa8wQ4xJfyLbCAaAL6Zy0I", PRICE = "£4.99", FREE_FRAMES = [1];
  var REPO = "unclehowell/cedwyn-movie", RAW = "https:" + "/" + "/" + ["raw", "githubusercontent", "com"].join(".") + "/" + REPO + "/main/";
  var T = {
    en: {ver: "Version", latest: "latest", free: "free", buy: "Buy", lic_ok: "I agree to the licence terms", lic: "licence terms",
      paid_note: "This version adds the newest scenes. One checkout opens them on this device, under a personal viewing licence.",
      free_note: "The first cut, free for everyone. It plays by default.",
      member: "Included with your Academy membership.", up: "Academy members get the latest scenes included · £49.99 a month", tick: "Tick the box to agree to the licence terms first.",
      thanks: "Thank you. This version is now open on this device.", locked: "Licence · £4.99",
      scenes: "Scenes", scene: "Scene", released: "released", vtab: "Page versions", v: "Version", d: "Date", c: "Change", all: "See all"},
    cy: {ver: "Fersiwn", latest: "diweddaraf", free: "am ddim", buy: "Prynu", lic_ok: "Rwy'n cytuno â thelerau'r drwydded", lic: "telerau'r drwydded",
      paid_note: "Mae'r fersiwn hon yn ychwanegu'r golygfeydd diweddaraf. Mae un taliad yn eu hagor ar y ddyfais hon, dan drwydded wylio bersonol.",
      free_note: "Y toriad cyntaf, am ddim i bawb. Mae'n chwarae yn ddiofyn.",
      member: "Wedi'i gynnwys yn eich aelodaeth o'r Academi.", up: "Mae aelodau'r Academi yn cael y golygfeydd diweddaraf wedi'u cynnwys · £49.99 y mis", tick: "Ticiwch y blwch i gytuno â thelerau'r drwydded yn gyntaf.",
      thanks: "Diolch. Mae'r fersiwn hon bellach ar agor ar y ddyfais hon.", locked: "Trwydded · £4.99",
      scenes: "Golygfeydd", scene: "Golygfa", released: "rhyddhawyd", vtab: "Fersiynau'r dudalen", v: "Fersiwn", d: "Dyddiad", c: "Newid", all: "Gweld y cyfan"},
    es: {ver: "Versión", latest: "la más reciente", free: "gratis", buy: "Comprar", lic_ok: "Acepto los términos de la licencia", lic: "términos de la licencia",
      paid_note: "Esta versión añade las escenas más recientes. Un solo pago las abre en este dispositivo, con una licencia de visionado personal.",
      free_note: "El primer montaje, gratis para todos. Se reproduce por defecto.",
      member: "Incluido en su membresía de la Academia.", up: "Los miembros de la Academia tienen incluidas las escenas más recientes · £49,99 al mes", tick: "Marque la casilla para aceptar primero los términos de la licencia.",
      thanks: "Gracias. Esta versión ya está abierta en este dispositivo.", locked: "Licencia · £4,99",
      scenes: "Escenas", scene: "Escena", released: "publicada", vtab: "Versiones de la página", v: "Versión", d: "Fecha", c: "Cambio", all: "Ver todo"}
  };
  function L() { var l = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase(); return T[l] ? l : "en"; }
  function t(k) { return T[L()][k] || T.en[k]; }
  function $(id) { return document.getElementById(id); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function cmp(a, b) { var x = a.split("."), y = b.split("."); for (var i = 0; i < 3; i++) { var d = (+x[i] || 0) - (+y[i] || 0); if (d) return d; } return 0; }
  var G = {versions: [], sel: null, member: false, memberAsked: false};
  function build(man) {
    var f = (man.filled || []).slice().sort(function (a, b) { return a.n - b.n; }), out = [];
    f.forEach(function (x, i) { out.push({v: "1." + i + ".0", frames: f.slice(0, i + 1).map(function (y) { return y.n; }), date: x.released || (x.made || "").slice(0, 10), adds: x.n}); });
    out.forEach(function (v) { v.free = v.frames.every(function (n) { return FREE_FRAMES.indexOf(n) >= 0; }); });
    return out.reverse();   // latest first
  }
  function cur() { for (var i = 0; i < G.versions.length; i++) if (G.versions[i].v === G.sel) return G.versions[i]; return G.versions[G.versions.length - 1]; }
  function unlocked(v) { var u = ls("cedwyn-doc-unlock"); return !!u && cmp(u, v.v) >= 0; }
  function verFor(n) { var best = null; G.versions.forEach(function (x) { if (x.frames.indexOf(n) >= 0 && (!best || cmp(x.v, best.v) < 0)) best = x; }); return best; }
  function isMem() { return G.member || window.CEDWYN_MEMBER === true; }
  function unlockedN(n) { var u = ls("cedwyn-doc-unlock"), v = verFor(n); return !!u && !!v && cmp(u, v.v) >= 0; }
  G.canPlay = function (n) { return FREE_FRAMES.indexOf(n) >= 0 || isMem() || unlockedN(n); };
  G.label = function () { return t("locked"); };
  function askMember() {
    if (window.CEDWYN_MEMBER === true) { G.member = true; return Promise.resolve(true); }
    if (G.memberAsked) return Promise.resolve(G.member); G.memberAsked = true;
    return fetch("/api/member", {credentials: "same-origin", cache: "no-store"}).then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { G.member = !!(j && j.member === true); return G.member; }).catch(function () { return false; });
  }
  G.locked = function (n) {
    askMember().then(function (m) { if (m) { changed(); return; } var v = verFor(n); if (v && cmp(v.v, G.sel) > 0) { G.sel = G.versions[0].v; ls("cedwyn-doc-sel", G.sel); paint(); } var p = $("cd-pay"); if (p) { p.hidden = false; p.scrollIntoView({behavior: "smooth", block: "center"}); var c = $("cd-ok"); if (c) c.focus(); } });
  };
  function changed() { document.dispatchEvent(new CustomEvent("cedwyn-doc-change")); paint(); }
  function paint() {
    var s = $("cd-v"); if (!s || !G.versions.length) return; var v = cur();
    s.textContent = "";
    G.versions.forEach(function (x, i) { var o = document.createElement("option"); o.value = x.v;
      o.textContent = "v" + x.v + " · " + (x.free ? t("free") : PRICE) + (i === 0 ? " · " + t("latest") : "") + " · " + (x.frames.length === 1 ? t("scene") + " " + x.frames[0] : t("scenes") + " " + x.frames[0] + "–" + x.frames[x.frames.length - 1]);
      if (x.v === v.v) o.selected = true; s.appendChild(o); });
    var paid = !v.free && !isMem() && !unlocked(v);
    $("cd-note").textContent = v.free ? t("free_note") : (paid ? t("paid_note") : (isMem() ? t("member") : t("thanks")));
    var p = $("cd-pay"); p.hidden = !paid;
    var q = document.querySelectorAll("[data-cd]"); for (var i = 0; i < q.length; i++) q[i].textContent = t(q[i].getAttribute("data-cd"));
    $("cd-buy").textContent = t("buy") + " v" + v.v + " · " + PRICE;
    gate();
  }
  function gate() { var b = $("cd-buy"), ok = $("cd-ok").checked; b.setAttribute("aria-disabled", ok ? "false" : "true"); b.classList.toggle("off", !ok); }
  function init(man) {
    G.versions = build(man);
    var q = new URLSearchParams(location.search), un = q.get("unlock"), want = q.get("v");
    if (un && /^cs_[A-Za-z0-9_]{8,}$/.test(un)) {   // back from checkout
      var pend = ls("cedwyn-doc-pending") || (G.versions[0] && G.versions[0].v);
      if (pend) { var old = ls("cedwyn-doc-unlock"); if (!old || cmp(pend, old) > 0) ls("cedwyn-doc-unlock", pend); ls("cedwyn-doc-sel", pend); ls("cedwyn-doc-session", un); }
      ls("cedwyn-doc-pending", null);
      q.delete("unlock"); try { history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "") + location.hash); } catch (e) {}
    }
    var keep = want ? want.replace(/^v/, "") : ls("cedwyn-doc-sel");
    var free = G.versions.filter(function (x) { return x.free; });
    G.sel = (keep && G.versions.some(function (x) { return x.v === keep; })) ? keep : (free.length ? free[free.length - 1].v : (G.versions[0] || {}).v);
    $("cd-ver").hidden = false; changed();
    askMember().then(function (m) { if (m) changed(); });
  }
  window.CedwynDoc = G;
  document.addEventListener("DOMContentLoaded", function () {
    var s = $("cd-v"); if (!s) return;
    s.addEventListener("change", function () { G.sel = s.value; ls("cedwyn-doc-sel", G.sel); $("cd-ok").checked = false; changed(); });
    $("cd-ok").addEventListener("change", gate);
    $("cd-buy").addEventListener("click", function (e) {
      if (!$("cd-ok").checked) { e.preventDefault(); $("cd-msg").textContent = t("tick"); $("cd-ok").focus(); return; }
      ls("cedwyn-doc-pending", cur().v); ls("cedwyn-doc-agreed", new Date().toISOString() + " licence v1.0.0");
    });
    $("cd-buy").setAttribute("href", GO);
    var all = $("cd-all"); if (all) { all.href = "https:" + "/" + "/" + ["github", "com"].join(".") + "/unclehowell/cedwyn/commits/cedwyn-movie/public"; all.target = "_blank"; all.rel = "noopener"; }
    document.addEventListener("ghf-lang-change", paint);
    fetch(RAW + "manifest.json?t=" + Math.floor(Date.now() / 300000), {cache: "no-store"}).then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .catch(function () { return fetch("data/manifest.json").then(function (r) { return r.json(); }); })
      .then(init).catch(function () {});
  });
})();
