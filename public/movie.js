/* Cedwyn · documentary — scene page (page v1.4.7, 30 Oct 2026: each scene card has a full-width toggle (bottom-right of its picture) that spans the card across the grid so its text is readable on a narrow phone; tap again for the grid; remembered per card for the visit; v1.4.6, 30 Oct 2026: every scene is free (documentary.js 1.5.0); choosing an earlier cut (v0.0.1-0.0.N) in the version menu plays that door's earlier cut with its own audio and subtitles, and switches an open player to it; the player's meta line names the version playing; v1.4.5, 30 Oct 2026: a scene with per-language lip-synced video (manifest "video": {cy, en, es}) plays the video of the chosen audio language and switches it, at the same position, when the audio changes; without it the single clip plays as before; v1.4.4, 30 Oct 2026: the page opens straight onto the scenes — no intro panel or page-level control bar; audio and subtitles are chosen in the player, and the version select moves into the player's control bar; v1.4.3, 30 Oct 2026: tapping anywhere on a released scene's picture plays it; the full-screen picture opens only from the small "View artwork" button under it; v1.4.2, 30 Oct 2026: window.CedwynPlayer lets download.js offer the scene with the chosen audio and subtitles; v1.4.1, 30 Oct 2026: Welsh audio by default, subtitles follow the site language; v1.4.0, 29 Oct 2026: per-scene description and evidence links to our own archived copies; was v1.3.0; served at /documentary/, /movie/ and /documentry/ redirect here). A tab.bot production.
   v1.3.0: film versions, viewing licence and checkout live in documentary.js (window.CedwynDoc); play() asks it first.
   Doors come from frames.json; a door opens when manifest.json in the film's storage repository lists its clip.
   The page reads the storage repository at run time (frames, manifest, prompt, scripts, subtitles, media), so the daily
   scene run only commits there; the copies under ./data/ are the snapshot used when the repository cannot be read.
   The storage repository is the only other address this page reads, and it only plays its media inline. */
(function () {
  "use strict";
  var REPO = "unclehowell/cedwyn-movie", REF = "main";
  var RAW = "https:" + "/" + "/" + ["raw", "githubusercontent", "com"].join(".") + "/" + REPO + "/" + REF + "/";
  var MC = {u: "284f08fe7e1b8d39250808104", id: "6139ff4a0d", host: ["estate", "us3", "list-manage", "com"].join(".")};
  // v1.4.7: full-width cards, remembered for this visit (sessionStorage)
  var WK = "cedwyn-doc-wide";
  function wideGet() { try { var a = JSON.parse(sessionStorage.getItem(WK) || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
  function wideSet(n, on) { var a = wideGet().filter(function (x) { return x !== n; }); if (on) a.push(n); try { sessionStorage.setItem(WK, JSON.stringify(a)); } catch (e) {} }
  var WSVG = '<svg class="w-e" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 12h18M3 12l4-4M3 12l4 4M21 12l-4-4M21 12l-4 4"/></svg><svg class="w-c" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 4v16M2 12h7M9 12l-3-3M9 12l-3 3M22 12h-7M15 12l3-3M15 12l3 3"/></svg>';
  var EDIT = "https:" + "/" + "/" + ["github", "com"].join(".") + "/" + REPO + "/edit/" + REF + "/PROMPT.md";
  var T = {
    en: {scene: "Scene", released: "Release date", ai: "artist's impression", more: "Script, subtitles and evidence", enlarge: "View the picture full screen", art: "View artwork", wide: "Show this scene full width", narrow: "Back to the grid", close: "Close", sub_l: "A new scene every morning. Get it by email:", sub_ph: "Your email", sub_b: "Subscribe", sub_human: "One more step: Mailchimp wants to check you are human. Tap Subscribe again to finish in a new tab.", sub_tab: "Finish in the new tab, then check your inbox to confirm.", sub_ok: "Thank you. Check your inbox to confirm.", sub_err: "That did not go through. Please check the address and try again.", sub_bad: "Please enter a valid email address.", sending: "Sending…", mtl: "machine translation", kicker: "Documentary · a tab.bot production", sub: "One door a day. Behind each door, a scene of about two minutes: the people of Llandough talking over what is happening on paper and around the village, from before the deeds to today.",
      of: "of", doors: "scenes released", runtime: "planned running time", subs: "Subtitles", on: "on", off: "off", audio: "Audio", menu: "Production", fs: "Full screen", fsx: "Exit full screen", play: "Play", pause: "Pause", seek: "Position in the scene", soff: "Off",
      prompt: "Production prompt", prompt_note: "The producer's prompt steers the film. The daily scene run reads it first, every day, before it works on the next door.",
      edit: "Edit the prompt", acts: "Acts", how: "How it is made", how_note: "Every dated event in the chronology sits behind exactly one door, with its evidence numbers. The same faces, voices, buildings and landscapes are used in every scene. Anything a scene leaves out is noted and taken up in a later scene.",
      frame: "Frame", act: "Act", script: "Script", subtitles: "Subtitles", next: "Next scene", soon: "Script in writing: the logline above is the plan.", subsoon: "Subtitles come with the script.",
      events: "Events", evidence: "Evidence", desc: "What happens in this scene", evl: "Evidence: our archived copies", review: "Draft for review", mt: "machine translation, for review", play: "Play", left: "Left out, taken up later"},
    cy: {scene: "Golygfa", released: "Dyddiad rhyddhau", ai: "argraff arlunydd", more: "Sgript, isdeitlau a thystiolaeth", enlarge: "Gweld y llun ar sgrin lawn", art: "Gweld y gwaith celf", wide: "Dangos yr olygfa hon ar led llawn", narrow: "Yn ôl i'r grid", close: "Cau", sub_l: "Golygfa newydd bob bore. Derbyniwch hi drwy e-bost:", sub_ph: "Eich e-bost", sub_b: "Tanysgrifio", sub_human: "Un cam arall: mae Mailchimp am wirio eich bod yn ddynol. Tapiwch Tanysgrifio eto i orffen mewn tab newydd.", sub_tab: "Gorffennwch yn y tab newydd, yna edrychwch yn eich mewnflwch i gadarnhau.", sub_ok: "Diolch. Edrychwch yn eich mewnflwch i gadarnhau.", sub_err: "Ni aeth hynny drwodd. Gwiriwch y cyfeiriad a rhowch gynnig arall arni.", sub_bad: "Rhowch gyfeiriad e-bost dilys.", sending: "Yn anfon…", mtl: "cyfieithiad peiriant", kicker: "Rhaglen ddogfen · cynhyrchiad tab.bot", sub: "Un drws y dydd. Y tu ôl i bob drws, golygfa o tua dau funud: pobl Llandochau yn trafod beth sy'n digwydd ar bapur ac o gwmpas y pentref, o'r cyfnod cyn y gweithredoedd hyd heddiw.",
      of: "o", doors: "golygfa wedi'u rhyddhau", runtime: "hyd arfaethedig", subs: "Isdeitlau", on: "ymlaen", off: "i ffwrdd", audio: "Sain", menu: "Cynhyrchu", fs: "Sgrin lawn", fsx: "Gadael y sgrin lawn", play: "Chwarae", pause: "Oedi", seek: "Safle yn yr olygfa", soff: "Dim",
      prompt: "Anogwr y cynhyrchiad", prompt_note: "Anogwr y cynhyrchydd sy'n llywio'r ffilm. Mae'r rhediad dyddiol yn ei ddarllen yn gyntaf, bob dydd, cyn gweithio ar y drws nesaf.",
      edit: "Golygu'r anogwr", acts: "Actau", how: "Sut mae'n cael ei wneud", how_note: "Mae pob digwyddiad dyddiedig yn y cronoleg y tu ôl i un drws yn union, gyda'i rifau tystiolaeth. Defnyddir yr un wynebau, lleisiau, adeiladau a thirluniau ym mhob golygfa. Caiff unrhyw beth a adewir allan ei nodi a'i godi mewn golygfa ddiweddarach.",
      frame: "Ffrâm", act: "Act", script: "Sgript", subtitles: "Isdeitlau", next: "Y nesaf", soon: "Sgript ar y gweill: y crynodeb uchod yw'r cynllun.", subsoon: "Daw'r isdeitlau gyda'r sgript.",
      events: "Digwyddiadau", evidence: "Tystiolaeth", desc: "Beth sy'n digwydd yn yr olygfa", evl: "Tystiolaeth: ein copïau archif", review: "Drafft i'w adolygu", mt: "cyfieithiad peiriant, i'w adolygu", play: "Chwarae", left: "Wedi'i adael allan, i'w godi wedyn"},
    es: {scene: "Escena", released: "Fecha de estreno", ai: "impresión artística", more: "Guion, subtítulos y pruebas", enlarge: "Ver la imagen a pantalla completa", art: "Ver la ilustración", wide: "Ver esta escena a todo el ancho", narrow: "Volver a la cuadrícula", close: "Cerrar", sub_l: "Una escena nueva cada mañana. Recíbela por correo:", sub_ph: "Tu correo", sub_b: "Suscribirme", sub_human: "Un paso más: Mailchimp quiere comprobar que eres humano. Toca Suscribirme otra vez para terminar en una pestaña nueva.", sub_tab: "Termina en la pestaña nueva y luego revisa tu bandeja de entrada para confirmar.", sub_ok: "Gracias. Revisa tu bandeja de entrada para confirmar.", sub_err: "No se pudo enviar. Revisa la dirección e inténtalo de nuevo.", sub_bad: "Escribe un correo válido.", sending: "Enviando…", mtl: "traducción automática", kicker: "Documental · una producción de tab.bot", sub: "Una puerta por día. Detrás de cada puerta, una escena de unos dos minutos: la gente de Llandough comentando lo que pasa en los papeles y por el pueblo, desde antes de las escrituras hasta hoy.",
      of: "de", doors: "escenas estrenadas", runtime: "duración prevista", subs: "Subtítulos", on: "sí", off: "no", audio: "Audio", menu: "Producción", fs: "Pantalla completa", fsx: "Salir de pantalla completa", play: "Reproducir", pause: "Pausa", seek: "Posición en la escena", soff: "No",
      prompt: "Indicaciones de producción", prompt_note: "Las indicaciones del productor guían la película. La tarea diaria las lee primero, cada día, antes de trabajar en la siguiente puerta.",
      edit: "Editar las indicaciones", acts: "Actos", how: "Cómo se hace", how_note: "Cada hecho fechado de la cronología está detrás de una sola puerta, con sus números de prueba. Las mismas caras, voces, edificios y paisajes se usan en todas las escenas. Lo que una escena deja fuera se anota y se retoma en una escena posterior.",
      frame: "Cuadro", act: "Acto", script: "Guion", subtitles: "Subtítulos", next: "Próxima", soon: "Guion en preparación: el resumen de arriba es el plan.", subsoon: "Los subtítulos llegan con el guion.",
      events: "Hechos", evidence: "Pruebas", desc: "Qué pasa en esta escena", evl: "Pruebas: nuestras copias archivadas", review: "Borrador para revisar", mt: "traducción automática, para revisar", play: "Reproducir", left: "Quedó fuera, se retoma después"}
  };
  var COL = ["#3e5a44", "#3b4148", "#6b4a2f", "#4a5d3a", "#5a3e3a", "#33474f", "#5b5a3a", "#40364f"];
  var NAMES = {A_MARY: "Mary", B_JOHN: "John", C_FRED: "Fred", D_BILLY: "Billy", E_AGENT: "The Agent", F_GWEN: "Gwen", G_DAI: "Dai", H_CLERK: "The Court", I_NIA: "Nia", J_ELENA: "Elena"};
  var S = {frames: null, manifest: {filled: []}, scripts: {}, vtt: {}, audio: null, subs: true};
  function lang() { var l = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase(); return T[l] ? l : "en"; }
  function t(k) { return (T[lang()] || T.en)[k] || T.en[k] || k; }
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function get(path, as) {   // the storage repository first, then this theme's snapshot
    var bust = (as === "text" || /\.json$/.test(path)) ? "?t=" + Math.floor(Date.now() / 300000) : "";
    return fetch(RAW + path + bust, {cache: "no-store"}).then(function (r) { if (!r.ok) throw r.status; return as === "text" ? r.text() : r.json(); })
      .catch(function () { var local = "data/" + path.replace(/^subs\//, "scripts/").replace(/^PROMPT\.md$/, "prompt.md");
        return fetch(local).then(function (r) { if (!r.ok) throw r.status; return as === "text" ? r.text() : r.json(); }); });
  }
  try { var st = localStorage.getItem("cedwyn-movie-subs"); if (st === "0") { S.subs = false; S.subsOffLegacy = true; } S.audio = localStorage.getItem("cedwyn-movie-audio-v2"); S.sub = localStorage.getItem("cedwyn-movie-sublang-v2"); S.subsOffLegacy = false; if (S.sub && S.sub !== "off" && !T[S.sub]) S.sub = null; } catch (e) {}
  if (!S.audio) S.audio = "cy";   // v1.4.1 (30 Oct 2026): every door starts in Welsh audio; subtitles follow the site language
  function paintStatic() {
    var q = document.querySelectorAll("[data-t]"); for (var i = 0; i < q.length; i++) q[i].textContent = t(q[i].getAttribute("data-t"));
    var qp = document.querySelectorAll("[data-tp]"); for (var i2 = 0; i2 < qp.length; i2++) { qp[i2].setAttribute("placeholder", t(qp[i2].getAttribute("data-tp"))); qp[i2].setAttribute("aria-label", t(qp[i2].getAttribute("data-tp"))); }
    var son = subLang() !== "off"; $("cm-subs").setAttribute("aria-pressed", son ? "true" : "false"); $("cm-subs-state").textContent = son ? t("on") : t("off");
    var a = document.querySelectorAll(".cm-a"); for (var j = 0; j < a.length; j++) a[j].setAttribute("aria-pressed", a[j].getAttribute("data-a") === S.audio ? "true" : "false");
  }
  function filledMap() { var m = {}; (S.manifest.filled || []).forEach(function (f) { m[f.n] = f; }); return m; }
  function speaker(sc, who) { var r = (sc.cast && sc.cast[who]) || ""; if (/Grandson/.test(r)) return lang() === "cy" ? "Yr Ŵyr" : lang() === "es" ? "El Nieto" : "The Grandson"; return NAMES[who] || who; }
  function parseVTT(s) { var out = []; (s || "").replace(/\r/g, "").split(/\n\n+/).forEach(function (b) { var m = /(\d\d:\d\d:\d\d\.\d+) --> (\d\d:\d\d:\d\d\.\d+)\n([\s\S]*)/.exec(b); if (!m) return;
      var sec = function (x) { var p = x.split(":"); return (+p[0]) * 3600 + (+p[1]) * 60 + parseFloat(p[2]); };
      var txt = m[3].replace(/<v ([^>]*)>/, "$1: ").replace(/<[^>]+>/g, ""); out.push({a: sec(m[1]), b: sec(m[2]), t: txt}); }); return out; }
  function fmt(x) { var m = Math.floor(x / 60), s = Math.floor(x % 60); return m + ":" + (s < 10 ? "0" : "") + s; }
  function fillDetails(card, f) {
    var sc = S.scripts[f.id], L = lang();
    var d1 = card.querySelector(".cm-d-script ul"), d2 = card.querySelector(".cm-d-subs ul"); d1.textContent = ""; d2.textContent = "";
    if (!sc) { d1.appendChild(el("li", "", t("soon"))); d2.appendChild(el("li", "", t("subsoon"))); return; }
    sc.shots.forEach(function (sh) { sh.lines.forEach(function (l) { var li = el("li"); li.appendChild(el("b", "", speaker(sc, l.who) + ": ")); li.appendChild(document.createTextNode(l[L] || l.en)); d1.appendChild(li); }); });
    if (L !== "en") d1.appendChild(el("li", "cm-ev", "(" + t("mt") + ")"));
    var key = f.id + "." + L;
    var show = function () { d2.textContent = ""; (S.vtt[key] || []).forEach(function (c) { var li = el("li"); li.appendChild(el("time", "", fmt(c.a))); li.appendChild(document.createTextNode(c.t)); d2.appendChild(li); }); };
    if (S.vtt[key]) show(); else get("subs/" + key + ".vtt", "text").then(function (v) { S.vtt[key] = parseVTT(v); show(); }).catch(function () { d2.appendChild(el("li", "", t("subsoon"))); });
  }

  function tl(f, k) { var L = lang(); return (L !== "en" && f.i18n && f.i18n[L] && f.i18n[L][k]) || f[k]; }
  function thumbURL(f) { return RAW + (f.thumb || ("thumbs/" + f.id + ".webp")); }
  // release dates: released scenes show the day their clip was made (Europe/London); the rest show the planned day,
  // one scene a day at 06:00 Europe/London in frame order, never earlier than the day after the last release (or today)
  var D = (function () {
    var map = {};
    function parts(d) { var o = {}; new Intl.DateTimeFormat("en-GB", {timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit"}).formatToParts(d).forEach(function (p) { o[p.type] = p.value; }); return o; }
    function dayOf(d) { var o = parts(d); return Date.UTC(+o.year, +o.month - 1, +o.day) / 864e5; }
    function dayISO(s) { var m = /^(\d{4})-(\d\d)-(\d\d)/.exec(s || ""); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) / 864e5 : null; }
    function fmtDay(n) { var d = new Date(n * 864e5); var p = function (x) { return (x < 10 ? "0" : "") + x; }; return p(d.getUTCDate()) + "/" + p(d.getUTCMonth() + 1) + "/" + d.getUTCFullYear(); }
    function compute(F, fm) {
      map = {}; var last = null;
      F.items.forEach(function (f) { var m = fm[f.n]; if (!m) return; var n = m.released ? dayISO(m.released) : (m.made ? dayOf(new Date(m.made)) : null);
        if (n == null) n = dayISO(f.release_date); map[f.n] = n; if (n != null && (last == null || n > last)) last = n; });
      var start = Math.max(dayOf(new Date()), last == null ? 0 : last + 1), k = 0;
      F.items.forEach(function (f) { if (fm[f.n]) return; var plan = dayISO(f.release_planned); map[f.n] = Math.max(plan == null ? 0 : plan, start + k); k++; });
    }
    return {compute: compute, label: function (n) { return map[n] != null ? fmtDay(map[n]) : ""; }};
  })();
  // full-screen view of a thumbnail; the release date stays on the picture
  var LB = null, LBfs = false;
  function openLB(f, title, dtxt) {
    if (!LB) { LB = el("div", "cm-lb"); LB.hidden = true; LB.setAttribute("role", "dialog"); LB.setAttribute("aria-modal", "true");
      var fig = el("div", "cm-lb-fig"); fig.appendChild(el("img", "cm-lb-img")); fig.appendChild(el("span", "cm-ai")); fig.appendChild(el("span", "cm-date")); LB.appendChild(fig);
      LB.appendChild(el("p", "cm-lb-cap")); var x = el("button", "cm-x", "×"); x.type = "button"; LB.appendChild(x);
      LB.onclick = closeLB; document.body.appendChild(LB);
      document.addEventListener("fullscreenchange", function () { if (!document.fullscreenElement && LBfs) { LBfs = false; closeLB(); } }); }
    var im = LB.querySelector(".cm-lb-img"); im.src = thumbURL(f); im.alt = title;
    LB.querySelector(".cm-date").textContent = dtxt; LB.querySelector(".cm-ai").textContent = t("ai");
    LB.querySelector(".cm-lb-cap").textContent = t("scene") + " " + f.n + " · " + title; LB.querySelector(".cm-x").setAttribute("aria-label", t("close"));
    LB.hidden = false; document.body.classList.add("cm-noscroll");
    if (LB.requestFullscreen && window.matchMedia && window.matchMedia("(min-width: 700px)").matches) { LB.requestFullscreen().then(function () { LBfs = true; }).catch(function () {}); }
  }
  function closeLB() { if (!LB || LB.hidden) return; LB.hidden = true; document.body.classList.remove("cm-noscroll");
    if (document.fullscreenElement && LBfs) { LBfs = false; document.exitFullscreen().catch(function () {}); } }
  // mailing list: Mailchimp's JSONP signup (the /subscribe/post route with a c= callback)
  (function () {
    var f = $("cm-sub"); if (!f) return;
    f.addEventListener("submit", function (ev) { ev.preventDefault(); var msg = $("cm-sub-msg"), em = ($("cm-sub-em").value || "").trim(), btn = $("cm-sub-b");
      msg.className = "cm-sub-msg"; if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)) { msg.textContent = t("sub_bad"); msg.classList.add("err"); return; }
      if (f.getAttribute("data-step") === "human") {   // Mailchimp asked for its "confirm you're human" step: post the same signup to it in a new tab
        var hf = document.createElement("form"); hf.method = "post"; hf.target = "_blank"; hf.action = "https:" + "/" + "/" + MC.host + "/subscribe/post?u=" + MC.u + "&id=" + MC.id; hf.style.display = "none";
        [["EMAIL", em], ["UTMSRC", "cedwyn/movie"], ["b_" + MC.u + "_" + MC.id, ""]].forEach(function (kv) { var i = document.createElement("input"); i.type = "hidden"; i.name = kv[0]; i.value = kv[1]; hf.appendChild(i); });
        document.body.appendChild(hf); hf.submit(); document.body.removeChild(hf); f.removeAttribute("data-step"); msg.textContent = t("sub_tab"); msg.classList.add("ok"); return; }
      var cb = "cedwynMovieSub" + Date.now(), done = false, s = document.createElement("script"), lab = btn.textContent; btn.disabled = true; btn.textContent = t("sending");
      var p = {u: MC.u, id: MC.id, c: cb, EMAIL: em, UTMSRC: "cedwyn/movie", UTMCMP: "movie-scene-mailing-list"}; p["b_" + MC.u + "_" + MC.id] = "";
      var qs = []; for (var k in p) qs.push(encodeURIComponent(k) + "=" + encodeURIComponent(p[k]));
      function fin(ok, why) { if (done) return; done = true; try { delete window[cb]; } catch (x) { window[cb] = undefined; } if (s.parentNode) s.parentNode.removeChild(s);
        btn.disabled = false; btn.textContent = lab;
        if (ok) { msg.textContent = t("sub_ok"); msg.classList.add("ok"); f.classList.add("done"); try { localStorage.setItem("cedwyn-movie-sub", "1"); } catch (x) {} }
        else if (why === "human") { f.setAttribute("data-step", "human"); msg.textContent = t("sub_human"); msg.classList.add("err"); }
        else { msg.textContent = t("sub_err") + (why ? " (" + String(why).replace(/<[^>]+>/g, "").replace(/^\d+\s*-\s*/, "").slice(0, 120) + ")" : ""); msg.classList.add("err"); } }
      window[cb] = function (r) { fin(r && (r.result === "success" || /already subscribed/i.test(r.msg || "")), r && r.msg); };
      s.onerror = function () { fin(false, "human"); }; setTimeout(function () { fin(false, "human"); }, 12000);
      s.src = "https:" + "/" + "/" + MC.host + "/subscribe/post?" + qs.join("&"); (document.head || document.documentElement).appendChild(s); });
  })();
  function render() {
    var F = S.frames; if (!F) return; var grid = $("cm-grid"); grid.textContent = ""; var fm = filledMap(); var open = 0, nextN = null;
    F.items.forEach(function (f) { if (fm[f.n]) open++; else if (nextN === null) nextN = f.n; });
    D.compute(F, fm);
    $("cm-open").textContent = open; $("cm-total").textContent = F.items.length; $("cm-runtime").textContent = F.estimated_runtime || "";
    var acts = $("cm-acts"); acts.textContent = ""; var lastAct = null, L = lang();
    F.items.forEach(function (f, i) {
      if (f.act.n !== lastAct) { lastAct = f.act.n; var h = el("h2", "cm-actsep", t("act") + " " + f.act.n + " · " + (f.act[L] || f.act.en)); h.id = "cm-act-" + f.act.n;
        var frs = F.items.filter(function (x) { return x.act.n === f.act.n; }); h.appendChild(el("small", "", t("scene") + " " + frs[0].n + "–" + frs[frs.length - 1].n + " · " + frs[0].date_from + " → " + frs[frs.length - 1].date_to)); grid.appendChild(h);
        var li = el("li"); var b = el("button", "", (f.act[L] || f.act.en)); b.type = "button"; b.onclick = (function (id) { return function () { closeDrawer(); var x = $(id); if (x) x.scrollIntoView({behavior: "smooth"}); }; })(h.id); li.appendChild(b); acts.appendChild(li); }
      var m = fm[f.n], card = el("article", "cm-card" + (m ? " open" : "") + (f.n === nextN ? " next" : "")); card.id = "frame-" + f.n;
      var title = tl(f, "title"), dtxt = t("released") + " " + D.label(f.n);
      var th = el("div", "cm-thumb" + (m ? " playable" : "")); th.style.setProperty("--c", COL[i % COL.length]);
      if (!m) { th.setAttribute("role", "button"); th.tabIndex = 0; th.setAttribute("aria-label", t("enlarge") + ": " + t("scene") + " " + f.n); }
      var img = el("img", "cm-img"); img.alt = title; img.loading = "lazy"; img.decoding = "async"; img.src = thumbURL(f); img.onerror = function () { th.classList.add("noimg"); }; th.appendChild(img);
      th.appendChild(el("span", "cm-ai", t("ai"))); th.appendChild(el("span", "cm-date", dtxt));
      if (f.n === nextN) th.appendChild(el("span", "cm-tag", t("next")));
      var DG = window.CedwynDoc; if (m && DG && !DG.canPlay(f.n)) { card.classList.add("locked"); th.appendChild(el("span", "cm-tag cd-lock", DG.label(f.n))); }
      if (m) { var pb = el("button", "cm-playbig"); pb.type = "button"; pb.setAttribute("data-ghf-keep", ""); pb.setAttribute("aria-label", t("play") + ": " + t("scene") + " " + f.n);
        pb.onclick = function (e) { e.stopPropagation(); play(f, m); }; th.appendChild(pb);
        // v1.4.3: the whole picture is the play target (the click goes through the play button, so the licence check still runs)
        th.onclick = function (e) { if (e.target && e.target.closest && e.target.closest(".cm-playbig")) return; pb.click(); }; }
      else { th.onclick = function () { openLB(f, title, dtxt); }; th.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(f, title, dtxt); } }; }
      // v1.4.7: full-width toggle (its own control; never plays or opens the artwork)
      (function () { var wb = el("button", "cm-widebtn"); wb.type = "button"; wb.setAttribute("data-ghf-keep", ""); wb.innerHTML = WSVG;
        var setW = function (on) { card.classList.toggle("cm-wide", on); wb.setAttribute("aria-pressed", on ? "true" : "false"); wb.setAttribute("aria-label", t(on ? "narrow" : "wide") + ": " + t("scene") + " " + f.n); wb.title = t(on ? "narrow" : "wide"); };
        setW(wideGet().indexOf(f.n) >= 0);
        wb.onkeydown = function (e) { e.stopPropagation(); };
        wb.onclick = function (e) { e.stopPropagation(); e.preventDefault(); var on = !card.classList.contains("cm-wide"); setW(on); wideSet(f.n, on);
          setTimeout(function () { try { card.scrollIntoView({block: "nearest", behavior: "smooth"}); } catch (x) {} }, 30); };
        th.appendChild(wb); })();
      card.appendChild(th);
      var body = el("div", "cm-body");
      var hd = el("div", "cm-hd"); hd.appendChild(el("div", "cm-scene", t("scene") + " " + f.n));
      var ab = el("button", "cm-artbtn", t("art")); ab.type = "button"; ab.setAttribute("aria-label", t("enlarge") + ": " + t("scene") + " " + f.n);
      ab.onclick = function (e) { e.stopPropagation(); openLB(f, title, dtxt); }; hd.appendChild(ab); body.appendChild(hd);
      body.appendChild(el("h3", "", title)); body.appendChild(el("p", "cm-log", tl(f, "logline")));
      var DS = f.description && (f.description[lang()] || f.description.en);   // v1.4.0: shot-by-shot description and evidence links (our /wayback/go/ copies)
      if (DS) { var dd = el("details", "cm-desc"); dd.appendChild(el("summary", "", t("desc"))); if (DS.intro) dd.appendChild(el("p", "cm-desc-i", DS.intro));
        if (DS.shots && DS.shots.length) { var ol = el("ol", "cm-shots"); DS.shots.forEach(function (s) { ol.appendChild(el("li", "", String(s).replace(/^\d+\.\s*/, ""))); }); dd.appendChild(ol); }
        body.appendChild(dd); }
      var EL = f.evidence_links || [];
      if (EL.length) { var de = el("details", "cm-evd"); de.appendChild(el("summary", "", t("evl") + " (" + EL.length + ")")); var ul = el("ul", "cm-evl");
        EL.forEach(function (x) { var li = el("li"), aa = el("a", "", x.title); aa.href = x.href; li.appendChild(aa); if (x.id) li.appendChild(el("span", "cm-evid", " " + x.id)); ul.appendChild(li); });
        de.appendChild(ul); body.appendChild(de); }
      var more = el("details", "cm-more"); more.appendChild(el("summary", "", t("more")));
      more.appendChild(el("div", "cm-meta", f.date_range));
      var d1 = el("details", "cm-d-script"); d1.appendChild(el("summary", "", t("script"))); d1.appendChild(el("ul", "cm-lines")); more.appendChild(d1);
      var d2 = el("details", "cm-d-subs"); d2.appendChild(el("summary", "", t("subtitles"))); d2.appendChild(el("ul", "cm-lines")); more.appendChild(d2);
      var d3 = el("details"); d3.appendChild(el("summary", "", t("events") + " · " + t("evidence")));
      d3.appendChild(el("p", "cm-ev", f.events.join(" · "))); if (f.evidence.length) d3.appendChild(el("p", "cm-ev", f.evidence.join(" · "))); more.appendChild(d3);
      if (m && m.left_out && m.left_out.length) { var d4 = el("details"); d4.appendChild(el("summary", "", t("left"))); d4.appendChild(el("p", "cm-ev", m.left_out.map(function (x) { return x.id || x; }).join(" · "))); more.appendChild(d4); }
      body.appendChild(more); card.appendChild(body); grid.appendChild(card);
      var opened = false; [d1, d2].forEach(function (d) { d.addEventListener("toggle", function () { if (d.open && !opened) { opened = true; loadScript(f).then(function () { fillDetails(card, f); }); } else if (d.open) fillDetails(card, f); }); });
    });
  }
  function loadScript(f) { if (!f.script) return Promise.resolve(); if (S.scripts[f.id]) return Promise.resolve(); return get(f.script).then(function (s) { S.scripts[f.id] = s; }).catch(function () {}); }
  // player: the clip plays muted; the chosen language track plays beside it, kept in step.
  // Playback controls (v1.2.0): play/pause, position, full screen, audio language, subtitle language (independent of audio).
  var V = $("cm-video"), A = $("cm-audio"), ST = $("cm-stage"), cur = null, LANGS = ["cy", "en", "es"], NAT = {cy: "Cymraeg", en: "English", es: "Español"}, cuesBy = {}, trackUrls = [], iosFS = false, idleT = null;
  function subLang() { return S.sub ? S.sub : lang(); }
  function clipFor(m) { var vv = m && m.video; return (vv && (vv[S.audio] || vv[m.default_audio || "cy"])) || m.clip; }   // v1.4.5: per-language lip-synced video, else the one clip
  window.CedwynPlayer = {video: V, raw: RAW, current: function () { return cur; }, audio: function () { return S.audio; }, sub: function () { return subLang(); }, clip: function () { return cur ? clipFor(cur.m) : null; }};   // read by download.js (v1.4.2; clip() v1.4.5)
  function subPath(L) { return cur.m.subs && cur.m.subs[L] ? cur.m.subs[L] : "subs/" + cur.f.id + "." + L + ".vtt"; }
  function eff(n, m) {   // v1.4.6: the entry as chosen in the version menu: the newest cut, or an earlier cut (v0.0.1-0.0.N)
    var DG = window.CedwynDoc, c = DG && DG.cut ? DG.cut(n) : null; if (!c || !c.clip) return m;
    var o = {}, k; for (k in m) o[k] = m[k]; delete o.video; delete o.downloads; for (k in c) o[k] = c[k]; if (!c.seconds) delete o.seconds;
    var dl = {}, title = "Cedwyn – Door " + n + " – v" + c.version + " (earlier cut)";
    LANGS.forEach(function (a) { ["cy", "en", "es", "off"].forEach(function (s) { dl[a + "|" + s] = {path: c.clip, ext: "webm", title: title}; }); });
    o.downloads = dl; o.cut = c.version; return o;
  }
  function play(f, m) {
    var DG = window.CedwynDoc; if (DG && !DG.canPlay(f.n)) { DG.locked(f.n); return; }   // a scene not yet open (never while every scene is free)
    m = eff(f.n, m); cur = {f: f, m: m}; $("cm-p-title").textContent = t("scene") + " " + f.n + " · " + tl(f, "title"); $("cm-p-meta").textContent = f.date_range + (m.seconds ? " · " + fmt(m.seconds) : "") + " · v" + (m.cut || m.version || "0.0.1");
    if (m.poster) V.setAttribute("poster", RAW + m.poster); else V.removeAttribute("poster");
    V.src = RAW + clipFor(m); setAudio(true); loadCues(); $("cm-player").hidden = false; paintPlayer();
    if (A.getAttribute("src")) A.play().catch(function () {});   // inside the tap, so phones allow the sound
    V.play().catch(function () {}); try { $("cm-pp").focus({preventScroll: true}); } catch (e) {}
  }
  function syncA() { if (A.getAttribute("src")) { try { A.currentTime = V.currentTime || 0; } catch (e) {} if (!V.paused) A.play().catch(function () {}); } }
  function setAudio(fresh) {
    if (!cur) return; var a = cur.m.audio && cur.m.audio[S.audio];
    if (!a) { A.pause(); A.removeAttribute("src"); V.muted = false; return; }
    V.muted = true; if (A.getAttribute("src") === RAW + a && !fresh) { syncA(); return; }
    var wasPlaying = !V.paused; A.pause(); A.src = RAW + a;
    var once = function () { A.removeEventListener("loadedmetadata", once); try { A.currentTime = V.currentTime || 0; } catch (e) {} if (!V.paused) A.play().catch(function () {}); };
    A.addEventListener("loadedmetadata", once); try { A.currentTime = V.currentTime || 0; } catch (e) {}
    if (wasPlaying) A.play().catch(function () {});
  }
  // subtitles: every language is fetched once per scene; the on-screen line is drawn by the page, and the same files ride
  // as <track> elements (same-origin blob URLs) so the phone's own full-screen player shows them too
  function loadCues() {
    if (!cur) return; var f = cur.f;
    while (V.firstChild) V.removeChild(V.firstChild); trackUrls.forEach(function (u) { try { URL.revokeObjectURL(u); } catch (e) {} }); trackUrls = []; cuesBy = {};
    LANGS.forEach(function (L) {
      get(subPath(L), "text").then(function (v) {
        if (!cur || cur.f !== f) return; cuesBy[L] = parseVTT(v);
        try { var u = URL.createObjectURL(new Blob([/^WEBVTT/.test(v) ? v : "WEBVTT\n\n" + v], {type: "text/vtt"})); trackUrls.push(u);
          var tr = document.createElement("track"); tr.kind = "subtitles"; tr.srclang = L; tr.label = NAT[L]; tr.src = u; V.appendChild(tr); trackModes(); } catch (e) {}
        drawCue();
      }).catch(function () {});
    });
  }
  function trackModes() { var s = subLang(); for (var k = 0; k < V.textTracks.length; k++) { var tt = V.textTracks[k]; tt.mode = (tt.language === s) ? (iosFS ? "showing" : "hidden") : "disabled"; } }
  function drawCue() { var c = $("cm-cue"); c.textContent = ""; var s = subLang(); if (s === "off" || iosFS) return; var x = V.currentTime, hit = (cuesBy[s] || []).filter(function (q) { return x >= q.a && x <= q.b; })[0]; if (hit) c.appendChild(el("span", "", hit.t)); }
  function paintPlayer() {
    var pp = $("cm-pp"), playing = !V.paused && !V.ended; pp.setAttribute("aria-label", playing ? t("pause") : t("play")); pp.classList.toggle("is-play", !playing);
    var fs = isFS(); $("cm-fs").setAttribute("aria-label", fs ? t("fsx") : t("fs")); $("cm-fs").setAttribute("aria-pressed", fs ? "true" : "false"); $("cm-fs").classList.toggle("is-on", fs);
    $("cm-seek").setAttribute("aria-label", t("seek"));
    var s = subLang(); Array.prototype.forEach.call(document.querySelectorAll(".cm-ps"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-s") === s ? "true" : "false"); });
    Array.prototype.forEach.call(document.querySelectorAll(".cm-pa"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-a") === S.audio ? "true" : "false"); });
  }
  function dur() { return (isFinite(V.duration) && V.duration > 0) ? V.duration : (cur && cur.m.seconds) || 0; }
  function paintTime() { var d = dur(), x = V.currentTime || 0, sk = $("cm-seek"); if (d) { sk.max = d.toFixed(1); if (!sk._drag) sk.value = x.toFixed(1); } $("cm-time").textContent = fmt(x) + " / " + fmt(d); sk.setAttribute("aria-valuetext", fmt(x) + " / " + fmt(d)); }
  V.addEventListener("play", function () { syncA(); paintPlayer(); poke(); });
  V.addEventListener("playing", function () { syncA(); });
  V.addEventListener("pause", function () { A.pause(); paintPlayer(); poke(); }); V.addEventListener("ended", function () { A.pause(); paintPlayer(); poke(); });
  V.addEventListener("waiting", function () { A.pause(); });
  V.addEventListener("seeked", function () { if (A.getAttribute("src")) { try { A.currentTime = V.currentTime; } catch (e) {} } drawCue(); paintTime(); });
  V.addEventListener("loadedmetadata", paintTime);
  V.addEventListener("timeupdate", function () { if (A.getAttribute("src") && !V.paused && A.readyState > 0 && Math.abs(A.currentTime - V.currentTime) > 0.3) { try { A.currentTime = V.currentTime; } catch (e) {} } drawCue(); paintTime(); });
  function togglePlay() { if (!cur) return; if (V.paused || V.ended) { if (V.ended) V.currentTime = 0; if (A.getAttribute("src")) { syncA(); A.play().catch(function () {}); } V.play().catch(function () {}); } else V.pause(); }
  $("cm-pp").onclick = togglePlay; V.addEventListener("click", togglePlay);
  var sk = $("cm-seek");
  sk.addEventListener("input", function () { sk._drag = true; V.currentTime = parseFloat(sk.value) || 0; drawCue(); $("cm-time").textContent = fmt(V.currentTime) + " / " + fmt(dur()); });
  sk.addEventListener("change", function () { sk._drag = false; syncA(); });
  // full screen: the stage (video + subtitles + these controls) on desktop and Android; the phone's own player on iPhone
  function isFS() { return !!(document.fullscreenElement || document.webkitFullscreenElement) || iosFS; }
  function enterFS() {
    var r = ST.requestFullscreen ? ST.requestFullscreen({navigationUI: "hide"}) : ST.webkitRequestFullscreen ? ST.webkitRequestFullscreen() : null;
    if (r && r.then) r.then(function () { try { screen.orientation.lock("landscape").catch(function () {}); } catch (e) {} }).catch(nativeFS);
    else if (!ST.requestFullscreen && !ST.webkitRequestFullscreen) nativeFS();
  }
  function nativeFS() { if (V.webkitEnterFullscreen) { try { iosFS = true; trackModes(); drawCue(); V.webkitEnterFullscreen(); } catch (e) { iosFS = false; trackModes(); } } }
  function exitFS() { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {}); else if (document.webkitFullscreenElement && document.webkitExitFullscreen) document.webkitExitFullscreen(); else if (iosFS && V.webkitExitFullscreen) V.webkitExitFullscreen(); }
  function onFS() { var on = (document.fullscreenElement || document.webkitFullscreenElement) === ST; ST.classList.toggle("cm-isfs", on); if (!on) { ST.classList.remove("cm-idle"); try { screen.orientation.unlock(); } catch (e) {} } paintPlayer(); poke(); }
  document.addEventListener("fullscreenchange", onFS); document.addEventListener("webkitfullscreenchange", onFS);
  V.addEventListener("webkitbeginfullscreen", function () { iosFS = true; trackModes(); drawCue(); paintPlayer(); });
  V.addEventListener("webkitendfullscreen", function () {   // keep any subtitle choice made in the phone's own menu
    for (var k = 0; k < V.textTracks.length; k++) if (V.textTracks[k].mode === "showing") { S.sub = V.textTracks[k].language; break; }
    if (k === V.textTracks.length && V.textTracks.length) S.sub = "off";
    iosFS = false; trackModes(); drawCue(); paintPlayer(); paintStatic(); if (!V.paused) syncA(); });
  $("cm-fs").onclick = function () { if (isFS()) exitFS(); else enterFS(); };
  // in full screen the controls fade after 3 s of playback and come back on any touch, mouse move or key
  function poke() { ST.classList.remove("cm-idle"); clearTimeout(idleT); if (ST.classList.contains("cm-isfs") && !V.paused) idleT = setTimeout(function () { if (ST.contains(document.activeElement) && document.activeElement !== V && document.activeElement !== document.body && document.activeElement.tagName === "INPUT") return; ST.classList.add("cm-idle"); }, 3000); }
  ["mousemove", "touchstart", "keydown"].forEach(function (ev) { ST.addEventListener(ev, poke, {passive: true}); });
  // v1.4.5: the audio language picks the lip-synced video too; the new video resumes at the same position (and keeps playing if it was)
  function swapVideo() {
    if (!cur || !cur.m.video) return; var want = RAW + clipFor(cur.m); if (V.getAttribute("src") === want) return;
    var at = V.currentTime || 0, was = !V.paused; if (A.getAttribute("src")) A.pause(); V.src = want;
    var once = function () { V.removeEventListener("loadedmetadata", once); try { V.currentTime = at; } catch (e) {} try { A.currentTime = at; } catch (e) {}
      if (was) { V.play().catch(function () {}); if (A.getAttribute("src")) A.play().catch(function () {}); } };
    V.addEventListener("loadedmetadata", once);
  }
  function pickAudio(a) { S.audio = a; try { localStorage.setItem("cedwyn-movie-audio-v2", S.audio); } catch (e) {} swapVideo(); setAudio(); trackModes(); drawCue(); paintStatic(); paintPlayer(); }
  function pickSub(s) { S.sub = s; if (s !== "off") S.subLast = s; S.subsOffLegacy = false; try { localStorage.setItem("cedwyn-movie-sublang-v2", s); localStorage.setItem("cedwyn-movie-subs", s === "off" ? "0" : "1"); } catch (e) {} trackModes(); drawCue(); paintStatic(); paintPlayer(); }
  Array.prototype.forEach.call(document.querySelectorAll(".cm-pa"), function (b) { b.onclick = function () { pickAudio(b.getAttribute("data-a")); }; });
  Array.prototype.forEach.call(document.querySelectorAll(".cm-ps"), function (b) { b.onclick = function () { pickSub(b.getAttribute("data-s")); }; });
  function closePlayer() { if (isFS()) exitFS(); V.pause(); A.pause(); $("cm-player").hidden = true; V.removeAttribute("src"); while (V.firstChild) V.removeChild(V.firstChild); V.load(); cur = null; cuesBy = {}; $("cm-cue").textContent = ""; }
  $("cm-p-x").onclick = closePlayer; $("cm-player").addEventListener("click", function (e) { if (e.target === $("cm-player")) closePlayer(); });
  document.addEventListener("keydown", function (e) {
    var open = !$("cm-player").hidden, tag = (e.target && e.target.tagName) || "";
    if (e.key === "Escape") { if (open && isFS()) { exitFS(); return; } closeLB(); if (open) closePlayer(); closeDrawer(); return; }
    if (!open || /INPUT|TEXTAREA|SELECT|BUTTON/.test(tag) || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
    else if (e.key === "f") { e.preventDefault(); $("cm-fs").onclick(); }
    else if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); V.currentTime = Math.max(0, Math.min(dur(), V.currentTime + (e.key === "ArrowRight" ? 5 : -5))); }
  });
  $("cm-subs").onclick = function () { pickSub(subLang() === "off" ? (S.subLast || S.audio) : "off"); };
  Array.prototype.forEach.call(document.querySelectorAll(".cm-a"), function (b) { b.onclick = function () { pickAudio(b.getAttribute("data-a")); }; });
  function openDrawer() { $("cm-drawer").hidden = false; $("cm-menu").setAttribute("aria-expanded", "true");
    get("PROMPT.md", "text").then(function (p) { $("cm-prompt").textContent = p.replace(/<!--[\s\S]*?-->\n*/g, ""); }).catch(function () { $("cm-prompt").textContent = "…"; }); }
  function closeDrawer() { $("cm-drawer").hidden = true; $("cm-menu").setAttribute("aria-expanded", "false"); }
  $("cm-menu").onclick = function () { if ($("cm-drawer").hidden) openDrawer(); else closeDrawer(); };
  $("cm-drawer-x").onclick = closeDrawer; $("cm-drawer").addEventListener("click", function (e) { if (e.target === $("cm-drawer")) closeDrawer(); });
  $("cm-edit").onclick = function () { window.open(EDIT, "_blank", "noopener"); };
  document.addEventListener("cedwyn-doc-change", function () { render();
    if (cur && !$("cm-player").hidden) { var fm = filledMap()[cur.f.n]; if (fm && eff(cur.f.n, fm).clip !== cur.m.clip) play(cur.f, fm); } });   // v1.4.6: another cut chosen while the player is open
  document.addEventListener("ghf-lang-change", function () { paintStatic(); render(); if (cur) { trackModes(); drawCue(); paintPlayer(); } });
  new MutationObserver(function () { paintStatic(); render(); if (cur) paintPlayer(); }).observe(document.documentElement, {attributes: true, attributeFilter: ["lang"]});
  paintStatic();
  get("frames.json").then(function (F) { S.frames = F; render();
    return get("manifest.json").then(function (m) { S.manifest = m || {filled: []}; render(); }).catch(function () {}); }).catch(function () { $("cm-grid").textContent = "…"; });
})();

// v1.4.4 (30 Oct 2026): the version select (documentary.js #cd-ver) lives in the player's control bar; its note text is not shown
(function () {
  var cv = document.getElementById("cd-ver"), pc = document.querySelector("#cm-player .cm-pc");
  if (cv && pc && cv.parentNode !== pc) { cv.classList.add("cm-pc-row", "cm-pc-ver"); pc.appendChild(cv); }
})();
