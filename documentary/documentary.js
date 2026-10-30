/* Cedwyn · documentary — versions, licence and checkout (page v1.6.1). A tab.bot production.
   v1.6.1 (30 Oct 2026): version labels follow the site-wide scheme (/_cedwyn/versions.json): each door's newest cut is v0.0.2 at £4.99
   (bought with the film's one £4.99 link; members and buyers on this device play it); the previous cut is v0.0.1, free and the default;
   older cuts count backwards by creation date as -v0.0.1, -v0.0.2 …, all free (hashtags #v0.0.2, #v0.0.1, #_v0.0.1, #_v0.0.2 …; the reserved
   next version is #next). Labels are display only.
   v1.6.0 (30 Oct 2026): versions are hashtag chips under each scene (movie.js 1.5.0), not a menu. Each door lists its own
   versions: a reserved next version marked "coming" (manifest entry "next_version": {version, status: "coming"}; not
   playable), the cut that plays now (free, selected by default) and its earlier cuts ("cuts", newest first). The choice is
   per door and for this visit only (CedwynDoc.pick(n, v) / chosen(n) / chips(n)); CedwynDoc.cut(n) returns the earlier cut
   picked for door n, or null for the default. While every scene is free the page-wide version menu stays hidden.
   v1.5.0 (30 Oct 2026): every scene is free, at the producer's word: nothing is of paid quality yet. With the manifest's
   pricing.all_free set, every door's newest cut is v0.0.1 and plays straight away (no licence, no checkout, no pop-up);
   a door released later with no "version" also takes v0.0.1. Each door's earlier cuts are pre-releases of it, listed in
   its manifest entry as "cuts" [{version: "0.0.1-0.0.N", clip, audio, subs}] (oldest = -0.0.1). The version menu lists
   them after v0.0.1; choosing one plays that door's earlier cut (CedwynDoc.cut(n), read by movie.js 1.4.6). An earlier cut
   is never remembered across visits, so a returning viewer always gets the newest cut. The paid rule below stays in the
   code for the day the producer names a version as paid quality (clear all_free in the manifest).
   v1.4.0 (29 Oct 2026): billing follows semantic versions, at the producer's word. v0.0.1 (Scenes 1 and 2) is free for
   everyone and plays straight away, with no pop-up. Each later semantic version (re)release costs £4.99 more than the one
   before: v0.0.2 = Scene 3 (+£4.99), v0.0.3 = the next release (+£4.99, £9.98 in all), and so on. The rule is data: each
   manifest entry carries "version" (and the manifest a "pricing" block); an entry with no version takes the default
   (Scenes 1–2 → 0.0.1, Scene n → 0.0.(n-1)). One checkout buys the next version up, one £4.99 step at a time, using the
   film's one £4.99 link; the version bought is kept on this device. A locked scene never plays another scene.
   Before v1.4.0 the selector counted versions as v1.0.0, v1.1.0, … (one per scene); a licence kept under that numbering is
   carried over to the version holding the same scene.
   MEMBER HOOK: members get every version. isMember() is true when the page sets window.CEDWYN_MEMBER = true, or when
   GET /api/member answers {"member": true}. */
(function () {
  "use strict";
  var GO = "/wayback/go/?u=https%3A%2F%2Fbuy.stripe.com%2FaFa8wQ4xJfyLbCAaAL6Zy0I";   // the film's one £4.99 link = one version step
  var PRICING = {free: "0.0.1", step: 4.99, free_scenes: [1, 2], all_free: true};   // defaults; manifest.json "pricing" overrides
  var REPO = "unclehowell/cedwyn-movie", RAW = "https:" + "/" + "/" + ["raw", "githubusercontent", "com"].join(".") + "/" + REPO + "/main/";
  var T = {
    en: {ver: "Version", latest: "latest", free: "Free", buy: "Buy", lic_ok: "I agree to the licence terms", lic: "licence terms",
      paid_note: "Every version after v0.0.1 costs £4.99 more. One checkout opens the next version on this device, under a personal viewing licence.",
      free_note: "v0.0.1: Scenes 1 and 2, free for everyone. They play straight away.",
      member: "Included with your Academy membership.", up: "Academy members get the latest scenes included · £49.99 a month", tick: "Tick the box to agree to the licence terms first.",
      thanks: "Thank you. This version is open on this device.", in_all: "in all", first: "First buy", then: "then",
      scenes: "Scenes", scene: "Scene", coming: "coming", coming_t: "Coming: each language performed and filmed separately", cur_t: "Plays by default", older_t: "Earlier cut", chips: "Versions", earlier: "earlier cut", all_free_note: "Every scene is free while the film is being made. Earlier cuts of a scene are listed as v0.0.1-0.0.N.", released: "released", vtab: "Page versions", v: "Version", d: "Date", c: "Change", all: "See all"},
    cy: {ver: "Fersiwn", latest: "diweddaraf", free: "Am ddim", buy: "Prynu", lic_ok: "Rwy'n cytuno â thelerau'r drwydded", lic: "telerau'r drwydded",
      paid_note: "Mae pob fersiwn ar ôl v0.0.1 yn costio £4.99 yn ychwanegol. Mae un taliad yn agor y fersiwn nesaf ar y ddyfais hon, dan drwydded wylio bersonol.",
      free_note: "v0.0.1: Golygfeydd 1 a 2, am ddim i bawb. Maen nhw'n chwarae ar unwaith.",
      member: "Wedi'i gynnwys yn eich aelodaeth o'r Academi.", up: "Mae aelodau'r Academi yn cael y golygfeydd diweddaraf wedi'u cynnwys · £49.99 y mis", tick: "Ticiwch y blwch i gytuno â thelerau'r drwydded yn gyntaf.",
      thanks: "Diolch. Mae'r fersiwn hon ar agor ar y ddyfais hon.", in_all: "i gyd", first: "Prynwch yn gyntaf", then: "yna",
      scenes: "Golygfeydd", scene: "Golygfa", coming: "ar y ffordd", coming_t: "Ar y ffordd: pob iaith wedi'i pherfformio a'i ffilmio ar wahân", cur_t: "Yn chwarae fel arfer", older_t: "Toriad cynharach", chips: "Fersiynau", earlier: "toriad cynharach", all_free_note: "Mae pob golygfa am ddim tra bo'r ffilm yn cael ei gwneud. Mae toriadau cynharach golygfa wedi'u rhestru fel v0.0.1-0.0.N.", released: "rhyddhawyd", vtab: "Fersiynau'r dudalen", v: "Fersiwn", d: "Dyddiad", c: "Newid", all: "Gweld y cyfan"},
    es: {ver: "Versión", latest: "la más reciente", free: "Gratis", buy: "Comprar", lic_ok: "Acepto los términos de la licencia", lic: "términos de la licencia",
      paid_note: "Cada versión posterior a v0.0.1 cuesta £4,99 más. Un pago abre la versión siguiente en este dispositivo, con una licencia de visionado personal.",
      free_note: "v0.0.1: Escenas 1 y 2, gratis para todos. Se reproducen de inmediato.",
      member: "Incluido en su membresía de la Academia.", up: "Los miembros de la Academia tienen incluidas las escenas más recientes · £49,99 al mes", tick: "Marque la casilla para aceptar primero los términos de la licencia.",
      thanks: "Gracias. Esta versión está abierta en este dispositivo.", in_all: "en total", first: "Compre primero", then: "luego",
      scenes: "Escenas", scene: "Escena", coming: "próximamente", coming_t: "Próximamente: cada idioma actuado y filmado por separado", cur_t: "Se reproduce por defecto", older_t: "Montaje anterior", chips: "Versiones", earlier: "montaje anterior", all_free_note: "Todas las escenas son gratis mientras se hace la película. Los montajes anteriores de una escena figuran como v0.0.1-0.0.N.", released: "publicada", vtab: "Versiones de la página", v: "Versión", d: "Fecha", c: "Cambio", all: "Ver todo"}
  };
  function L() { var l = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase(); return T[l] ? l : "en"; }
  function t(k) { return T[L()][k] || T.en[k]; }
  function $(id) { return document.getElementById(id); }
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  function cmp(a, b) { var x = String(a).split("."), y = String(b).split("."); for (var i = 0; i < 3; i++) { var d = (+x[i] || 0) - (+y[i] || 0); if (d) return d; } return 0; }
  function gbp(x) { var s = x.toFixed(2); return "£" + (L() === "es" ? s.replace(".", ",") : s); }
  var G = {versions: [], sel: null, member: false, memberAsked: false, ready: false, sceneVer: {}};
  function defVer(n) { return (PRICING.all_free || PRICING.free_scenes.indexOf(n) >= 0) ? PRICING.free : "0.0." + (n - 1); }
  function build(man) {
    if (man && man.pricing) { var p = man.pricing; if (p.free) PRICING.free = p.free; if (+p.step_gbp) PRICING.step = +p.step_gbp; if (p.free_scenes) PRICING.free_scenes = p.free_scenes; PRICING.all_free = p.all_free !== false; }
    var f = (man.filled || []).slice().sort(function (a, b) { return a.n - b.n; }), by = {};
    G.sceneVer = {};
    G.entries = {};
    f.forEach(function (x) { G.entries[x.n] = x; var v = String(x.version || defVer(x.n)).replace(/^v/, ""); G.sceneVer[x.n] = v;
      (by[v] = by[v] || {v: v, frames: [], date: ""}).frames.push(x.n); var d = x.released || (x.made || "").slice(0, 10); if (d > by[v].date) by[v].date = d; });
    var out = Object.keys(by).map(function (k) { return by[k]; }).sort(function (a, b) { return cmp(a.v, b.v); }), k = 0;
    out.forEach(function (v) { v.free = cmp(v.v, PRICING.free) <= 0; if (!v.free) k++; v.step = v.free ? 0 : PRICING.step; v.total = Math.round(k * PRICING.step * 100) / 100; });
    out.reverse();   // latest first
    var subs = {};   // v1.5.0: earlier cuts, as pre-releases of v0.0.1 ("0.0.1-0.0.N"), newest first, after the main versions
    f.forEach(function (x) { (x.cuts || []).forEach(function (c) { var v = String(c.version || "").replace(/^v/, ""); if (!/^\d+\.\d+\.\d+-\d+\.\d+\.\d+$/.test(v)) return;
      (subs[v] = subs[v] || {v: v, frames: [], date: "", sub: true, free: true, step: 0, total: 0}).frames.push(x.n); if ((c.made || "") > subs[v].date) subs[v].date = c.made || ""; }); });
    Object.keys(subs).map(function (k) { return subs[k]; }).sort(function (a, b) { return cmp(b.v.split("-")[1], a.v.split("-")[1]); }).forEach(function (s) { out.push(s); });
    return out;
  }
  function asc() { return G.versions.slice().reverse(); }
  function byV(v) { for (var i = 0; i < G.versions.length; i++) if (G.versions[i].v === v) return G.versions[i]; return null; }
  function cur() { return byV(G.sel) || G.versions[0]; }
  function isMem() { return G.member || window.CEDWYN_MEMBER === true; }
  function verOf(n) { return G.sceneVer[n] || defVer(n); }
  function owned() {   // highest version bought on this device (0.0.x); older keys carried over
    var u = ls("cedwyn-doc-unlock"), best = PRICING.free;
    if (u && /^1\.\d+\.\d+$/.test(u)) { u = verOf(+u.split(".")[1] + 1); ls("cedwyn-doc-unlock", u); }   // v1.k.0 = Scenes 1..k+1
    if (u && cmp(u, best) > 0) best = u;
    if (ls("cedwyn-doc-v002") === "1" && cmp("0.0.2", best) > 0) best = "0.0.2";
    return best;
  }
  function has(v) { return PRICING.all_free || /-/.test(String(v)) || isMem() || cmp(v, PRICING.free) <= 0 || cmp(owned(), v) >= 0; }
  function nextBuy(target) { var a = asc(); for (var i = 0; i < a.length; i++) if (!has(a[i].v) && cmp(a[i].v, target) <= 0) return a[i]; return null; }
  function scenesTxt(x) { return x.frames.length === 1 ? t("scene") + " " + x.frames[0] : t("scenes") + " " + x.frames[0] + "–" + x.frames[x.frames.length - 1]; }
  function priceTxt(x) { return (x.free || PRICING.all_free) ? t("free") : "+" + gbp(x.step) + (x.total > x.step ? " (" + gbp(x.total) + " " + t("in_all") + ")" : ""); }
  G.canPlay = function (n) { var c = G.chips ? chipOf(n, G.chosen(n)) : null; return c && c.paid ? G.ownsLatest() : has(verOf(n)); };   // v1.6.2
  // v1.6.0: per-door version chips. A choice holds for this visit only, so a returning viewer always starts on the default cut.
  G.pickV = {};
  function subN(v) { var m = String(v).match(/-\d+\.\d+\.(\d+)$/); return m ? +m[1] : 0; }
  G.chips = function (n) {   // v1.6.2: newest first; labels and prices from the site-wide scheme (VS)
    var e = G.entries && G.entries[n]; if (!e) return [];
    var out = [], nx = e.next_version, cv = verOf(n);
    if (nx && nx.status === "coming" && nx.version && String(nx.version).replace(/^v/, "") !== cv) out.push({v: String(nx.version).replace(/^v/, ""), coming: true, note: nx.note || ""});
    out.push({v: cv, current: true, note: e.cut_note || ""});
    (e.cuts || []).slice().sort(function (a, b) { return subN(b.version) - subN(a.version); }).forEach(function (c) {
      var v = String(c.version || "").replace(/^v/, ""); if (v && v !== cv) out.push({v: v, cut: c, note: c.note || ""}); });
    var made = out.filter(function (c) { return !c.coming; }), single = made.length === 1;
    made.forEach(function (c, i) {
      if (i === 0) { c.latest = true; c.label = VS.latest; c.paid = !single && VS.price > 0; c.free = !c.paid; c.price = c.paid ? VS.price : 0; }
      else if (i === 1) { c.label = VS.previous; c.free = true; c.prev = true; }
      else { c.label = "0.0." + (i - 1); c.neg = true; c.free = true; }
    });
    out.forEach(function (c) { if (c.coming) c.label = VS.next; });
    return out;
  };
  // v1.6.2: one version scheme across the site (/_cedwyn/versions.json): the newest version of anything is v0.0.2 (£4.99); the previous one is
  // v0.0.1 (free); older ones count backwards by creation date as -v0.0.1, -v0.0.2 … (minus before the v; most recent older = -v0.0.1), all free;
  // each is its own version (no ranges). In a hashtag the minus becomes an underscore: #v0.0.2, #v0.0.1, #_v0.0.1, #_v0.0.2 …. Labels are display only: manifest versions (0.0.1-0.0.N), data-v attributes, downloads
  // and saved choices keep their own values. The latest cut is bought with the film's one £4.99 link (GO); the free v0.0.1 is the default.
  var VS = {latest: "0.0.2", previous: "0.0.1", next: "next", price: 4.99};
  try { fetch("/_cedwyn/versions.json", {cache: "no-cache"}).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { var s = j && j.scheme; if (!s) return;
    ["latest", "previous", "next"].forEach(function (x) { if (typeof s[x] === "string" && s[x]) VS[x] = s[x]; }); if (typeof s.latest_price_gbp === "number") VS.price = s.latest_price_gbp;
    document.dispatchEvent(new CustomEvent("cedwyn-doc-vlabels")); }).catch(function () {}); } catch (e) {}
  G.vs = function () { return VS; };
  function chipOf(n, v) { v = String(v || "").replace(/^v/, ""); return G.chips(n).filter(function (c) { return c.v === v; })[0] || null; }
  G.vlabel = function (n, v) { var c = chipOf(n, v); return c ? (c.coming ? VS.next : (c.neg ? "-" : "") + "v" + c.label) : "v" + String(v).replace(/^v/, ""); };   // plain text: v0.0.2, v0.0.1, -v0.0.1 …
  G.vtag = function (c) { return "#" + (c.coming ? VS.next : (c.neg ? "_" : "") + "v" + (c.label || c.v)); };   // hashtag: #v0.0.2, #v0.0.1, #_v0.0.1 …, #next
  G.ownsLatest = function () { return isMem() || cmp(owned(), VS.latest) >= 0; };
  G.defaultV = function (n) { var l = G.chips(n).filter(function (c) { return !c.coming; }); if (!l.length) return verOf(n);
    return (l[0].paid && !G.ownsLatest() && l[1]) ? l[1].v : l[0].v; };
  G.chosen = function (n) { return G.pickV[n] || G.defaultV(n); };
  G.buyLatest = function (n) {   // the latest cut is paid: checkout with the film's one £4.99 link; back here it is open on this device
    ls("cedwyn-doc-pending", VS.latest); ls("cedwyn-doc-agreed", new Date().toISOString() + " licence v1.0.0 (v" + VS.latest + ", door " + n + ")");
    location.href = GO; return false;
  };
  G.pick = function (n, v) {
    var ok = chipOf(n, v); if (!ok || ok.coming) return false;
    if (ok.paid && !G.ownsLatest()) return G.buyLatest(n);
    if (v === G.defaultV(n)) delete G.pickV[n]; else G.pickV[n] = v;
    document.dispatchEvent(new CustomEvent("cedwyn-doc-scene-ver", {detail: {n: n, v: v}})); return true;
  };
  G.cut = function (n) {   // the cut of door n chosen with its chips, or null when the entry's own (newest) cut plays
    var e = G.entries && G.entries[n]; if (!e) return null;
    var v = G.chosen(n); if (!v || v === verOf(n)) return null;
    for (var j = 0; j < (e.cuts || []).length; j++) if (String(e.cuts[j].version).replace(/^v/, "") === v) return e.cuts[j];
    return null;
  };
  G.allFree = function () { return !!PRICING.all_free; };
  G.verOf = verOf; G.has = has; G.nextBuy = nextBuy; G.priceTxt = priceTxt; G.scenesTxt = scenesTxt; G.asc = asc; G.byV = byV; G.go = GO; G.t = t;
  G.label = function (n) { var v = n ? byV(verOf(n)) : null; return v ? "v" + v.v + " · +" + gbp(v.step) : "+" + gbp(PRICING.step); };
  G.buy = function (target) {   // checkout for the next step towards target; returns false when nothing is left to buy
    var s = nextBuy(target); if (!s) return false;
    ls("cedwyn-doc-pending", s.v); ls("cedwyn-doc-agreed", new Date().toISOString() + " licence v1.0.0 (v" + s.v + ")");
    location.href = GO; return true;
  };
  function askMember() {
    if (window.CEDWYN_MEMBER === true) { G.member = true; return Promise.resolve(true); }
    if (G.memberAsked) return Promise.resolve(G.member); G.memberAsked = true;
    return fetch("/api/member", {credentials: "same-origin", cache: "no-store"}).then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) { G.member = !!(j && j.member === true); return G.member; }).catch(function () { return false; });
  }
  G.locked = function (n) {   // a locked scene: ask for its own version, never play another scene
    var lc = chipOf(n, G.chosen(n)); if (lc && lc.paid && !G.ownsLatest()) { G.buyLatest(n); return; }   // v1.6.2
    askMember().then(function (m) { if (m) { changed(); return; }
      if (window.CedwynPay) { window.CedwynPay.open(n); return; }
      G.sel = verOf(n); ls("cedwyn-doc-sel", G.sel); paint(); var p = $("cd-pay"); if (p) { p.hidden = false; p.scrollIntoView({behavior: "smooth", block: "center"}); var c = $("cd-ok"); if (c) c.focus(); } });
  };
  function changed() { document.dispatchEvent(new CustomEvent("cedwyn-doc-change")); paint(); }
  function paint() {
    var s = $("cd-v"); if (!s || !G.versions.length) return; var v = cur();
    s.textContent = "";
    G.versions.forEach(function (x, i) { var o = document.createElement("option"); o.value = x.v;
      o.textContent = "v" + x.v + " · " + priceTxt(x) + (i === 0 ? " · " + t("latest") : "") + (x.sub ? " · " + t("earlier") : "") + " · " + scenesTxt(x);
      if (x.v === v.v) o.selected = true; s.appendChild(o); });
    var paid = !has(v.v), nb = paid ? nextBuy(v.v) : null;
    $("cd-note").textContent = PRICING.all_free ? t("all_free_note") : v.free ? t("free_note") : (paid ? t("paid_note") : (isMem() ? t("member") : t("thanks")));
    var p = $("cd-pay"); p.hidden = !paid;
    var q = document.querySelectorAll("[data-cd]"); for (var i = 0; i < q.length; i++) q[i].textContent = t(q[i].getAttribute("data-cd"));
    $("cd-buy").textContent = nb ? (nb.v !== v.v ? t("first") + " v" + nb.v + " · +" + gbp(nb.step) + ", " + t("then") + " v" + v.v : t("buy") + " v" + v.v + " · +" + gbp(nb.step)) : t("buy");
    gate();
  }
  function gate() { var b = $("cd-buy"), ok = $("cd-ok").checked; b.setAttribute("aria-disabled", ok ? "false" : "true"); b.classList.toggle("off", !ok); }
  function init(man) {
    G.versions = build(man);
    var q = new URLSearchParams(location.search), un = q.get("unlock"), ud = q.get("unlocked"), want = q.get("v"), got = null;
    if ((un && /^cs_[A-Za-z0-9_]{8,}$/.test(un)) || (ud && /^v?0\.\d+\.\d+$/.test(ud))) {   // back from checkout: one version step
      var pend = ls("cedwyn-doc-pending") || (ud ? ud.replace(/^v/, "") : null), a = asc();
      if (!pend) for (var i = 0; i < a.length; i++) if (!has(a[i].v)) { pend = a[i].v; break; }
      if (pend) { if (cmp(pend, owned()) > 0) ls("cedwyn-doc-unlock", pend); ls("cedwyn-doc-sel", pend); if (un) ls("cedwyn-doc-session", un); got = pend; }
      ls("cedwyn-doc-pending", null); q.delete("unlock"); q.delete("unlocked");
      try { history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "") + location.hash); } catch (e) {}
    }
    var keep = want ? want.replace(/^v/, "") : ls("cedwyn-doc-sel");
    if (keep && !want && /-/.test(keep)) keep = null;   // an earlier cut is never the default on a later visit
    var open_ = G.versions.filter(function (x) { return has(x.v); });
    G.sel = (keep && byV(keep)) ? keep : (open_.length ? open_[0].v : (G.versions[0] || {}).v);
    G.ready = true; G.justUnlocked = got;
    $("cd-ver").hidden = !!PRICING.all_free; changed();   // v1.6.0: no page-wide menu while every scene is free; versions are chips under each scene
    document.dispatchEvent(new CustomEvent("cedwyn-doc-ready", {detail: {unlocked: got}}));
    askMember().then(function (m) { if (m) changed(); });
  }
  G.free = PRICING.free_scenes; window.CedwynDoc = G;
  document.addEventListener("DOMContentLoaded", function () {
    var s = $("cd-v"); if (!s) return;
    s.addEventListener("change", function () { G.sel = s.value; ls("cedwyn-doc-sel", /-/.test(G.sel) ? null : G.sel); $("cd-ok").checked = false; changed(); });
    $("cd-ok").addEventListener("change", gate);
    $("cd-buy").addEventListener("click", function (e) {
      e.preventDefault();
      if (!$("cd-ok").checked) { $("cd-msg").textContent = t("tick"); $("cd-ok").focus(); return; }
      G.buy(cur().v);
    });
    $("cd-buy").setAttribute("href", GO);
    var all = $("cd-all"); if (all) { all.href = "https:" + "/" + "/" + ["github", "com"].join(".") + "/unclehowell/cedwyn/commits/cedwyn-movie/public"; all.target = "_blank"; all.rel = "noopener"; }
    document.addEventListener("ghf-lang-change", paint);
    fetch(RAW + "manifest.json?t=" + Math.floor(Date.now() / 300000), {cache: "no-store"}).then(function (r) { if (!r.ok) throw r.status; return r.json(); })
      .catch(function () { return fetch("data/manifest.json").then(function (r) { return r.json(); }); })
      .then(init).catch(function () {});
  });
})();
