/* Cedwyn · documentary — versions, licence and checkout (page v1.7.0). A tab.bot production.
   v1.7.0 (30 Oct 2026): access codes. The newest cut of each scene (#v0.0.2, £4.99) is opened per scene with an access code: tapping it
   (or reaching it with Next/Back in the player) opens a box with "Enter access code" and "Buy now · £4.99". Buying goes to the film's
   £4.99 checkout tagged with that scene and cut (client_reference_id doc-s<n>-v<cut>); the checkout returns to /documentary/?unlock=<session>,
   and the page asks /api/doc/claim for the code, which the site issues only once the payment is confirmed (a few minutes). A code is
   checked by /api/doc/check and, when valid for that scene, opens that cut on this device (localStorage cedwyn-doc-codes, "<n>|<cut>").
   The old trust-based ?unlocked= return is gone. The reserved #next chip is no longer shown. CedwynDoc.gate(n) opens the box;
   CedwynDoc.owns(n, v) says whether a cut is open here.
   v1.6.2 (30 Oct 2026; replaces the short-lived 1.6.1): version labels follow the site-wide scheme (/_cedwyn/versions.json): each door's newest cut is v0.0.2 at £4.99
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
  G.canPlay = function (n) { var c = G.chips ? chipOf(n, G.chosen(n)) : null; return c && c.paid ? owns(n, c.v) : has(verOf(n)); };   // v1.7.0: per scene and cut
  // v1.6.0: per-door version chips. A choice holds for this visit only, so a returning viewer always starts on the default cut.
  G.pickV = {};
  function subN(v) { var m = String(v).match(/-\d+\.\d+\.(\d+)$/); return m ? +m[1] : 0; }
  G.chips = function (n) {   // v1.6.2: newest first; labels and prices from the site-wide scheme (VS)
    var e = G.entries && G.entries[n]; if (!e) return [];
    var out = [], nx = e.next_version, cv = verOf(n);
    void nx;   // v1.7.0: the reserved next version (#next) is no longer listed
    out.push({v: cv, current: true, note: e.cut_note || ""});
    (e.cuts || []).slice().sort(function (a, b) { return subN(b.version) - subN(a.version); }).forEach(function (c) {
      var v = String(c.version || "").replace(/^v/, ""); if (v && v !== cv) out.push({v: v, cut: c, note: c.note || ""}); });
    var made = out.filter(function (c) { return !c.coming; }), single = made.length === 1;
    made.forEach(function (c, i) {
      if (i === 0) { c.latest = true; c.label = VS.latest; c.paid = !single && VS.price > 0; c.free = !c.paid; c.price = c.paid ? VS.price : 0; c.open = !c.paid || owns(n, c.v); }
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
  // v1.7.0: a paid cut is open on this device when a valid access code for that scene and cut was entered here (or the viewer is a member).
  function codes() { try { return JSON.parse(ls("cedwyn-doc-codes") || "{}") || {}; } catch (e) { return {}; } }
  function owns(n, v) { if (isMem()) return true; var c = codes(); return !!(c[n + "|" + v] || c["0|*"]); }
  function keep(scene, cut, code) { var c = codes(); c[(scene ? scene + "|" + cut : "0|*")] = code; ls("cedwyn-doc-codes", JSON.stringify(c)); }
  G.owns = function (n, v) { var ch = chipOf(n, v); return !ch || !ch.paid || owns(n, ch.v); };
  G.ownsLatest = function (n) { var l = n ? G.chips(n)[0] : null; return l ? G.owns(n, l.v) : isMem(); };
  G.defaultV = function (n) { var l = G.chips(n).filter(function (c) { return !c.coming; }); if (!l.length) return verOf(n);
    return (l[0].paid && !G.owns(n, l[0].v) && l[1]) ? l[1].v : l[0].v; };
  G.chosen = function (n) { return G.pickV[n] || G.defaultV(n); };
  G.buyLatest = function (n) { G.gate(n); return false; };   // v1.7.0: the gate (code or buy) replaces the straight-to-checkout jump
  G.pick = function (n, v) {
    var ok = chipOf(n, v); if (!ok || ok.coming) return false;
    if (ok.paid && !owns(n, ok.v)) { G.gate(n, ok.v); return false; }
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
    var lc = chipOf(n, G.chosen(n)); if (lc && lc.paid && !owns(n, lc.v)) { G.gate(n, lc.v); return; }   // v1.7.0
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
    if (un || ud) {   // v1.7.0: back from checkout. The session id is only a claim ticket: the code comes from /api/doc/claim once the payment is confirmed.
      if (un && /^cs_(live|test)_[A-Za-z0-9]{20,200}$/.test(un)) { var pl = pend(); if (pl.indexOf(un) < 0) pl.push(un); ls("cedwyn-doc-cs", JSON.stringify(pl.slice(-5))); got = un; }
      ls("cedwyn-doc-pending", null); q.delete("unlock"); q.delete("unlocked");
      try { history.replaceState(null, "", location.pathname + (q.toString() ? "?" + q : "") + location.hash); } catch (e) {}
    }
    var keep = want ? want.replace(/^v/, "") : ls("cedwyn-doc-sel");   // (page-wide menu only; hidden while scenes are chosen with chips)
    if (keep && !want && /-/.test(keep)) keep = null;   // an earlier cut is never the default on a later visit
    var open_ = G.versions.filter(function (x) { return has(x.v); });
    G.sel = (keep && byV(keep)) ? keep : (open_.length ? open_[0].v : (G.versions[0] || {}).v);
    G.ready = true; G.justUnlocked = null;
    if (pend().length) setTimeout(function () { claimAll(got); }, 300);   // v1.7.0: a checkout to collect (just now, or left open on an earlier visit)
    $("cd-ver").hidden = !!PRICING.all_free; changed();   // v1.6.0: no page-wide menu while every scene is free; versions are chips under each scene
    document.dispatchEvent(new CustomEvent("cedwyn-doc-ready", {detail: {unlocked: null}}));
    askMember().then(function (m) { if (m) changed(); });
  }

  // ---- v1.7.0: access codes ------------------------------------------------------------------------------------------
  var API = location.origin + "/api/doc";   // a full address: the site's fetch helper re-roots bare "/…" paths under the theme
  var GT = {
    en: {h: "Scene {n} · {v}", lead: "The newest cut of this scene. Enter an access code, or buy one for this scene for {p}.", code: "Access code", unlock: "Unlock",
      buy: "Buy now · {p}", free: "Play {f} free instead", close: "Close", checking: "Checking…", bad: "That code is not valid. Check it and try again.",
      other: "That code is for Scene {s}. It has been kept on this device for that scene.", older: "That code is for an earlier cut of this scene, which is now free.",
      slow: "Too many tries. Please wait a few minutes.", net: "The code check is not answering. Please try again in a minute.", ok: "Unlocked. Playing now.",
      paid_h: "Thank you", wait: "Your payment is being confirmed. Your access code will appear here, usually within 10 minutes. You can keep this page open, or come back to it on this device later.",
      ready: "Your access code", keep_it: "Keep this code: it opens {v} of Scene {n} on any device.", keep_all: "Keep this code: it opens the newest cut of every scene on any device.",
      play: "Play now", copy: "Copy", copied: "Copied", note: "Personal viewing licence. Codes are checked by this site; no account is needed.", lic: "Licence terms"},
    cy: {h: "Golygfa {n} · {v}", lead: "Toriad diweddaraf yr olygfa hon. Rhowch god mynediad, neu prynwch un ar gyfer yr olygfa hon am {p}.", code: "Cod mynediad", unlock: "Datgloi",
      buy: "Prynu nawr · {p}", free: "Chwarae {f} am ddim yn lle", close: "Cau", checking: "Yn gwirio…", bad: "Nid yw'r cod yn ddilys. Gwiriwch ef a rhowch gynnig arall arni.",
      other: "Mae'r cod ar gyfer Golygfa {s}. Mae wedi'i gadw ar y ddyfais hon ar gyfer yr olygfa honno.", older: "Mae'r cod ar gyfer toriad cynharach o'r olygfa hon, sydd bellach am ddim.",
      slow: "Gormod o ymdrechion. Arhoswch ychydig funudau.", net: "Nid yw'r gwiriad cod yn ateb. Rhowch gynnig arall arni mewn munud.", ok: "Wedi'i ddatgloi. Yn chwarae nawr.",
      paid_h: "Diolch", wait: "Mae eich taliad yn cael ei gadarnhau. Bydd eich cod mynediad yn ymddangos yma, fel arfer o fewn 10 munud. Gallwch gadw'r dudalen hon ar agor, neu ddod yn ôl ati ar y ddyfais hon yn nes ymlaen.",
      ready: "Eich cod mynediad", keep_it: "Cadwch y cod hwn: mae'n agor {v} o Olygfa {n} ar unrhyw ddyfais.", keep_all: "Cadwch y cod hwn: mae'n agor toriad diweddaraf pob golygfa ar unrhyw ddyfais.",
      play: "Chwarae nawr", copy: "Copïo", copied: "Wedi'i gopïo", note: "Trwydded wylio bersonol. Mae'r wefan hon yn gwirio codau; nid oes angen cyfrif.", lic: "Telerau'r drwydded"},
    es: {h: "Escena {n} · {v}", lead: "El montaje más reciente de esta escena. Introduzca un código de acceso o compre uno para esta escena por {p}.", code: "Código de acceso", unlock: "Desbloquear",
      buy: "Comprar ahora · {p}", free: "Ver {f} gratis", close: "Cerrar", checking: "Comprobando…", bad: "Ese código no es válido. Compruébelo e inténtelo de nuevo.",
      other: "Ese código es para la Escena {s}. Se ha guardado en este dispositivo para esa escena.", older: "Ese código es para un montaje anterior de esta escena, que ahora es gratis.",
      slow: "Demasiados intentos. Espere unos minutos.", net: "La comprobación de códigos no responde. Inténtelo de nuevo en un minuto.", ok: "Desbloqueado. Reproduciendo.",
      paid_h: "Gracias", wait: "Se está confirmando su pago. Su código de acceso aparecerá aquí, normalmente en menos de 10 minutos. Puede dejar esta página abierta o volver a ella más tarde en este dispositivo.",
      ready: "Su código de acceso", keep_it: "Guarde este código: abre {v} de la Escena {n} en cualquier dispositivo.", keep_all: "Guarde este código: abre el montaje más reciente de todas las escenas en cualquier dispositivo.",
      play: "Ver ahora", copy: "Copiar", copied: "Copiado", note: "Licencia personal de visionado. Este sitio comprueba los códigos; no hace falta cuenta.", lic: "Términos de la licencia"}
  };
  function gt(k, o) { var s = (GT[L()] || GT.en)[k] || GT.en[k]; o = o || {}; return s.replace(/\{(\w)\}/g, function (_, x) { return o[x] != null ? o[x] : ""; }); }
  function pend() { try { var a = JSON.parse(ls("cedwyn-doc-cs") || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function dropPend(cs) { ls("cedwyn-doc-cs", JSON.stringify(pend().filter(function (x) { return x !== cs; }))); }
  function buyUrl(n, v) {   // the film's £4.99 link, tagged with this scene and cut so the code issued opens exactly that
    var ref = n ? "doc-s" + n + "-v" + String(v).replace(/\./g, "_") : "";
    var to = "https://buy.stripe.com/aFa8wQ4xJfyLbCAaAL6Zy0I" + (ref ? "?client_reference_id=" + ref : "");
    return "/wayback/go/?u=" + encodeURIComponent(to);
  }
  var GD = null, gateFor = null;
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function dlg() {
    if (GD) return GD;
    GD = el("dialog", "cd-gate"); GD.id = "cd-gate"; GD.setAttribute("aria-labelledby", "cd-gate-h");
    GD.innerHTML = '<button type="button" class="cd-gx" aria-label="Close">×</button><h2 id="cd-gate-h"></h2><p class="cd-glead"></p>' +
      '<div class="cd-gwait" hidden><p class="cd-gwt"></p><div class="cd-gspin" aria-hidden="true"></div></div>' +
      '<div class="cd-gcode" hidden><p class="cd-gcl"></p><p class="cd-gcv" translate="no"></p><p class="cd-gck"></p><div class="cd-grow"><button type="button" class="cd-gcopy"></button><button type="button" class="cd-gplay"></button></div></div>' +
      '<form class="cd-gform" autocomplete="off"><label for="cd-gin" class="cd-gl"></label><div class="cd-grow"><input id="cd-gin" class="cd-gin" name="code" inputmode="text" autocapitalize="characters" spellcheck="false" placeholder="CDW-XXXX-XXXX-XXXX" maxlength="24"><button type="submit" class="cd-gok"></button></div>' +
      '<p class="cd-gmsg" role="status" aria-live="polite"></p></form>' +
      '<div class="cd-gbuyrow"><a class="cd-gbuy" rel="nofollow"></a><button type="button" class="cd-gfree"></button></div><p class="cd-gnote"><span></span> <a href="licence/"></a></p>';
    document.body.appendChild(GD);
    GD.querySelector(".cd-gx").onclick = function () { closeGate(); };
    GD.addEventListener("click", function (e) { if (e.target === GD) closeGate(); });
    GD.querySelector(".cd-gform").addEventListener("submit", function (e) { e.preventDefault(); tryCode(GD.querySelector(".cd-gin").value); });
    GD.querySelector(".cd-gbuy").addEventListener("click", function () { if (!gateFor) return;
      ls("cedwyn-doc-agreed", new Date().toISOString() + " licence v1.0.0 (scene " + gateFor.n + ", cut " + gateFor.v + ")"); ls("cedwyn-doc-pending", gateFor.n + "|" + gateFor.v); });
    GD.querySelector(".cd-gfree").onclick = function () { var g = gateFor; closeGate(); if (!g) return; var l = G.chips(g.n), f = l.filter(function (c) { return !c.paid; })[0];
      if (f) { G.pick(g.n, f.v); playScene(g.n); } };
    GD.querySelector(".cd-gcopy").onclick = function () { var v = GD.querySelector(".cd-gcv").textContent, b = this;
      try { navigator.clipboard.writeText(v).then(function () { b.textContent = gt("copied"); }); } catch (e) {} };
    GD.querySelector(".cd-gplay").onclick = function () { var g = gateFor; closeGate(); if (g && g.n) { G.pick(g.n, G.chips(g.n)[0].v); playScene(g.n); } };
    return GD;
  }
  function show() { var d = dlg(); if (!d.open) { if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", ""); } return d; }
  function closeGate() { if (GD) { if (GD.open && GD.close) GD.close(); else GD.removeAttribute("open"); } gateFor = null; if (claimT) { clearTimeout(claimT); claimT = null; } }
  function mode(m) { var d = dlg(); d.querySelector(".cd-gwait").hidden = m !== "wait"; d.querySelector(".cd-gcode").hidden = m !== "code";
    d.querySelector(".cd-gform").hidden = m !== "gate"; d.querySelector(".cd-gbuyrow").hidden = m !== "gate"; d.querySelector(".cd-glead").hidden = m !== "gate"; }
  function playScene(n) {   // movie.js plays the cut chosen for door n (its play button runs the same checks)
    if (window.CedwynPlayer && window.CedwynPlayer.playScene) { window.CedwynPlayer.playScene(n); return; }
    var b = document.querySelector("#frame-" + n + " .cm-playbig"); if (b) b.click(); }
  G.gate = function (n, v) {
    var l = G.chips(n); v = v || (l[0] && l[0].v); var c = chipOf(n, v) || {}, f = l.filter(function (x) { return !x.paid; })[0];
    gateFor = {n: n, v: v}; var d = dlg(); mode("gate");
    var vt = G.vtag(c), price = gbp(c.price || VS.price);
    d.querySelector("#cd-gate-h").textContent = gt("h", {n: n, v: vt});
    d.querySelector(".cd-glead").textContent = gt("lead", {p: price});
    d.querySelector(".cd-gl").textContent = gt("code"); d.querySelector(".cd-gok").textContent = gt("unlock");
    d.querySelector(".cd-gx").setAttribute("aria-label", gt("close"));
    var a = d.querySelector(".cd-gbuy"); a.textContent = gt("buy", {p: price}); a.href = buyUrl(n, v);
    var fb = d.querySelector(".cd-gfree"); fb.hidden = !f; if (f) fb.textContent = gt("free", {f: G.vtag(f)});
    d.querySelector(".cd-gnote span").textContent = gt("note"); d.querySelector(".cd-gnote a").textContent = gt("lic");
    d.querySelector(".cd-gmsg").textContent = ""; d.querySelector(".cd-gin").value = "";
    show(); try { d.querySelector(".cd-gin").focus({preventScroll: true}); } catch (e) {}
  };
  function tryCode(raw) {
    var d = dlg(), msg = d.querySelector(".cd-gmsg"), g = gateFor; if (!g) return;
    var code = String(raw || "").trim(); if (!code) { msg.textContent = gt("bad"); return; }
    msg.textContent = gt("checking"); d.querySelector(".cd-gok").disabled = true;
    fetch(API + "/check", {method: "POST", headers: {"content-type": "application/json"}, body: JSON.stringify({code: code, scene: g.n}), cache: "no-store"})
      .then(function (r) { return r.json().catch(function () { return {ok: false, error: r.status === 429 ? "slow_down" : "net"}; }); })
      .then(function (j) {
        d.querySelector(".cd-gok").disabled = false;
        if (j && j.ok) {
          keep(j.scene, j.cut, j.code);
          if (j.scene && j.cut !== g.v && j.cut !== "*") { msg.textContent = gt("older"); return; }
          msg.textContent = gt("ok"); var n = g.n, v = g.v; setTimeout(function () { closeGate(); G.pick(n, v); document.dispatchEvent(new CustomEvent("cedwyn-doc-unlocked", {detail: {n: n, v: v}})); playScene(n); }, 500);
          return;
        }
        var e = j && j.error; if (e === "other_scene") { msg.textContent = gt("other", {s: j.scene}); }
        else msg.textContent = gt(e === "slow_down" ? "slow" : e === "net" ? "net" : "bad");
      }).catch(function () { d.querySelector(".cd-gok").disabled = false; msg.textContent = gt("net"); });
  }
  var claimT = null;
  function claimAll(fresh) {   // ask for the code of each checkout still waiting on this device; a fresh return shows the box at once
    var list = pend(); if (!list.length) return; var cs = fresh && list.indexOf(fresh) >= 0 ? fresh : list[list.length - 1], tries = 0, shown = !!fresh;
    var p = (ls("cedwyn-doc-pending") || "").split("|");
    if (shown) { gateFor = {n: +p[0] || 0, v: p[1] || ""}; var d = dlg(); mode("wait"); d.querySelector("#cd-gate-h").textContent = gt("paid_h");
      d.querySelector(".cd-gwt").textContent = gt("wait"); d.querySelector(".cd-gx").setAttribute("aria-label", gt("close")); show(); }
    (function ask() {
      tries++;
      fetch(API + "/claim?cs=" + encodeURIComponent(cs), {cache: "no-store"}).then(function (r) { return r.json(); }).then(function (j) {
        if (j && j.status === "ready" && j.code) {
          keep(j.scene, j.cut, j.code); dropPend(cs); ls("cedwyn-doc-pending", null);
          var d = dlg(), n = j.scene, c0 = n ? G.chips(n)[0] : null; gateFor = {n: n, v: j.cut}; mode("code");
          d.querySelector("#cd-gate-h").textContent = gt("paid_h"); d.querySelector(".cd-gcl").textContent = gt("ready");
          d.querySelector(".cd-gcv").textContent = j.code;
          d.querySelector(".cd-gck").textContent = n ? gt("keep_it", {n: n, v: c0 ? G.vtag(c0) : "#v" + VS.latest}) : gt("keep_all");
          d.querySelector(".cd-gcopy").textContent = gt("copy"); var pb = d.querySelector(".cd-gplay"); pb.textContent = gt("play"); pb.hidden = !n;
          show(); document.dispatchEvent(new CustomEvent("cedwyn-doc-unlocked", {detail: {n: n, v: j.cut}})); return;
        }
        if (j && j.status === "invalid") { dropPend(cs); return; }
        if (tries < 120) claimT = setTimeout(ask, tries < 8 ? 8000 : 15000);   // about 30 minutes, then again on the next visit
      }).catch(function () { if (tries < 120) claimT = setTimeout(ask, 20000); });
    })();
  }
  G.keepCode = keep; G.claim = claimAll;
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
