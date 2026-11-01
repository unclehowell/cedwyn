/* Cedwyn · documentary — scene page (page v1.10.1, movie.js 1.10.1, 1 Nov 2026 (1.10.1: an earlier free cut made from the same master video also plays and downloads from the matrix files; 1.10.0, owner 02:47Z m:4b318305: audio x subtitle matrix — each audio language and subtitle choice plays its own ready-made MP4 (subtitles burned in) in the same player, switching at the same moment and keeping play/pause; pairs not made yet are disabled and marked pending; 1.9.0, owner's rule m:1d4eb2cf): door art — a door not yet ready shows the Cedwyn estate silhouette with the place of its event marked and "Coming soon" in the picture (storage repository thumbs/soon/<id>.webp, one per door), a ready door shows a still from its own scene (manifest poster); tapping any door, or play, opens ONE modal: a random NFT image with "Select a version" and a down arrow, the version dropdown and its (i) under it; no version dropdown on the page itself; under "What happens in this scene" three dropdowns: Script, Subtitles, Evidence (last; evidence appears nowhere else on the door). Page v1.8.0, movie.js 1.8.0, 1 Nov 2026: one plain version dropdown per scene, its placeholder "Select a version" shown on load, no label above and no line under it, an (i) version table beside it; the picture is the scene's own still until play is tapped with no version chosen, then a random NFT image with "Select a version" and a down arrow (docs/VERSION-STANDARD.md, Selector UI). Page v1.7.3, movie.js 1.7.0, 31 Oct 2026 23:15Z: native-language renders: each audio language loads its own video for the chosen version (manifest "renders", files movie/<id>/<id>.<lang>.v<semver>.webm), a Version menu in the player, and a "video pending" image (label in HTML) for any (scene, language, version) not yet made — standing rules m:cc94f07a. movie.js 1.6.3, 31 Oct 2026: per-video subtitles (manifest "vsubs": {audio: {sub: path}}) for a language video cut to its own timeline, reloaded on an audio switch. movie.js 1.6.2, 30 Oct 2026: versions are one menu under each scene with a visible "Select a version" label, preselected on the cut the play button will play, prices in the options (it shows the cut playing, with a Now playing line under it), replacing the hashtag chips; a paid cut's files stream from the site's access service with the access code (manifest "doc:" paths). v1.6.0, 30 Oct 2026: the reserved #next chip is gone; the chip of the cut in the player is highlighted and marked "now playing"; the player has Back and Next buttons that step through every cut of every scene, oldest to newest, scene by scene (a paid cut not yet open on this device opens the access-code box, documentary.js 1.7.0); the player names what is playing as version_language (e.g. v0.0.1_welsh), and changing the audio reloads that same cut in the new language at the same moment (its own lip-synced video where one exists). v1.5.2 (replaces the short-lived 1.5.1): version chips wrap inside their card like a word cloud at every card size (no sideways scrolling row) and show the site-wide labels (newest #v0.0.2 · £4.99, previous #v0.0.1 · free and the default, older -v0.0.2, -v0.0.3 … shown as #_v0.0.2, #_v0.0.3 … (minus series starts at -v0.0.2 since documentary.js 1.7.2), reserved #next; documentary.js 1.6.2). v1.5.0, 30 Oct 2026: one card-size control above the scenes (small / medium / large, like icon sizes in a file explorer) sets every card at once and is remembered on this device (localStorage cedwyn-doc-size); large is one full-width column with unclamped text; it replaces the per-card full-width toggle of 1.4.7. Versions are hashtag chips under each released scene (#v0.0.1-0.0.5 …; the default cut is marked free and selected; a reserved version is marked coming and cannot be picked); the selected chip drives play, language video/audio and Download (documentary.js 1.6.0). v1.4.7, 30 Oct 2026: each scene card has a full-width toggle (bottom-right of its picture) that spans the card across the grid so its text is readable on a narrow phone; tap again for the grid; remembered per card for the visit; v1.4.6, 30 Oct 2026: every scene is free (documentary.js 1.5.0); choosing an earlier cut (v0.0.1-0.0.N) in the version menu plays that door's earlier cut with its own audio and subtitles, and switches an open player to it; the player's meta line names the version playing; v1.4.5, 30 Oct 2026: a scene with per-language lip-synced video (manifest "video": {cy, en, es}) plays the video of the chosen audio language and switches it, at the same position, when the audio changes; without it the single clip plays as before; v1.4.4, 30 Oct 2026: the page opens straight onto the scenes — no intro panel or page-level control bar; audio and subtitles are chosen in the player, and the version select moves into the player's control bar; v1.4.3, 30 Oct 2026: tapping anywhere on a released scene's picture plays it; the full-screen picture opens only from the small "View artwork" button under it; v1.4.2, 30 Oct 2026: window.CedwynPlayer lets download.js offer the scene with the chosen audio and subtitles; v1.4.1, 30 Oct 2026: Welsh audio by default, subtitles follow the site language; v1.4.0, 29 Oct 2026: per-scene description and evidence links to our own archived copies; was v1.3.0; served at /documentary/, /movie/ and /documentry/ redirect here). A tab.bot production.
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
  // v1.5.0: one card size for the whole grid, chosen before browsing and remembered on this device
  var ZK = "cedwyn-doc-size", SIZES = ["s", "m", "l"];
  function sizeGet() { try { var z = localStorage.getItem(ZK); return SIZES.indexOf(z) >= 0 ? z : "m"; } catch (e) { return "m"; } }
  var ZSVG = {
    s: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="5" height="5" rx="1"/><rect x="9.5" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/><rect x="3" y="9.5" width="5" height="5" rx="1"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><rect x="16" y="9.5" width="5" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1"/><rect x="9.5" y="16" width="5" height="5" rx="1"/><rect x="16" y="16" width="5" height="5" rx="1"/></svg>',
    m: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>',
    l: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="10" rx="1.5"/><rect x="3" y="15" width="18" height="2.4" rx="1"/><rect x="3" y="19" width="12" height="2.4" rx="1"/></svg>'};
  var EDIT = "https:" + "/" + "/" + ["github", "com"].join(".") + "/" + REPO + "/edit/" + REF + "/PROMPT.md";
  var T = {
    en: {scene: "Scene", released: "Release date", ai: "artist's impression", more: "Script, subtitles and evidence", enlarge: "View the picture full screen", art: "View artwork", size: "Card size", size_s: "Small", size_m: "Medium", size_l: "Large", vers: "Versions", vfree: "free", vcoming: "coming", vsel: "Select a version", vsoon: "Coming soon", vl_free: "Free to watch", vl_paid: "£4.99 · enter an access code or buy", vl_open: "Open on this device", vnow: "now playing", vopen: "open", navb: "Back", navn: "Next", nowp: "Now playing", vpicked: "selected", close: "Close", sub_l: "A new scene every morning. Get it by email:", sub_ph: "Your email", sub_b: "Subscribe", sub_human: "One more step: Mailchimp wants to check you are human. Tap Subscribe again to finish in a new tab.", sub_tab: "Finish in the new tab, then check your inbox to confirm.", sub_ok: "Thank you. Check your inbox to confirm.", sub_err: "That did not go through. Please check the address and try again.", sub_bad: "Please enter a valid email address.", sending: "Sending…", mtl: "machine translation", kicker: "Documentary · a tab.bot production", sub: "One door a day. Behind each door, a scene of about two minutes: the people of Llandough talking over what is happening on paper and around the village, from before the deeds to today.",
      of: "of", doors: "scenes released", runtime: "planned running time", subs: "Subtitles", on: "on", off: "off", audio: "Audio", menu: "Production", fs: "Full screen", fsx: "Exit full screen", play: "Play", pause: "Pause", seek: "Position in the scene", soff: "Off",
      prompt: "Production prompt", prompt_note: "The producer's prompt steers the film. The daily scene run reads it first, every day, before it works on the next door.",
      edit: "Edit the prompt", acts: "Acts", how: "How it is made", how_note: "Every dated event in the chronology sits behind exactly one door, with its evidence numbers. The same faces, voices, buildings and landscapes are used in every scene. Anything a scene leaves out is noted and taken up in a later scene.",
      frame: "Frame", act: "Act", script: "Script", subtitles: "Subtitles", next: "Next scene", soon: "Script in writing: the logline above is the plan.", subsoon: "Subtitles come with the script.",
      events: "Events", evidence: "Evidence", desc: "What happens in this scene", evl: "Evidence: our archived copies", review: "Draft for review", mt: "machine translation, for review", play: "Play", left: "Left out, taken up later"},
    cy: {scene: "Golygfa", released: "Dyddiad rhyddhau", ai: "argraff arlunydd", more: "Sgript, isdeitlau a thystiolaeth", enlarge: "Gweld y llun ar sgrin lawn", art: "Gweld y gwaith celf", size: "Maint y cardiau", size_s: "Bach", size_m: "Canolig", size_l: "Mawr", vers: "Fersiynau", vfree: "am ddim", vcoming: "ar y ffordd", vsel: "Dewiswch fersiwn", vsoon: "Yn fuan", vl_free: "Am ddim i’w wylio", vl_paid: "£4.99 · rhowch god mynediad neu prynwch", vl_open: "Ar agor ar y ddyfais hon", vnow: "yn chwarae", vopen: "ar agor", navb: "Yn ôl", navn: "Nesaf", nowp: "Yn chwarae nawr", vpicked: "wedi'i dewis", close: "Cau", sub_l: "Golygfa newydd bob bore. Derbyniwch hi drwy e-bost:", sub_ph: "Eich e-bost", sub_b: "Tanysgrifio", sub_human: "Un cam arall: mae Mailchimp am wirio eich bod yn ddynol. Tapiwch Tanysgrifio eto i orffen mewn tab newydd.", sub_tab: "Gorffennwch yn y tab newydd, yna edrychwch yn eich mewnflwch i gadarnhau.", sub_ok: "Diolch. Edrychwch yn eich mewnflwch i gadarnhau.", sub_err: "Ni aeth hynny drwodd. Gwiriwch y cyfeiriad a rhowch gynnig arall arni.", sub_bad: "Rhowch gyfeiriad e-bost dilys.", sending: "Yn anfon…", mtl: "cyfieithiad peiriant", kicker: "Rhaglen ddogfen · cynhyrchiad tab.bot", sub: "Un drws y dydd. Y tu ôl i bob drws, golygfa o tua dau funud: pobl Llandochau yn trafod beth sy'n digwydd ar bapur ac o gwmpas y pentref, o'r cyfnod cyn y gweithredoedd hyd heddiw.",
      of: "o", doors: "golygfa wedi'u rhyddhau", runtime: "hyd arfaethedig", subs: "Isdeitlau", on: "ymlaen", off: "i ffwrdd", audio: "Sain", menu: "Cynhyrchu", fs: "Sgrin lawn", fsx: "Gadael y sgrin lawn", play: "Chwarae", pause: "Oedi", seek: "Safle yn yr olygfa", soff: "Dim",
      prompt: "Anogwr y cynhyrchiad", prompt_note: "Anogwr y cynhyrchydd sy'n llywio'r ffilm. Mae'r rhediad dyddiol yn ei ddarllen yn gyntaf, bob dydd, cyn gweithio ar y drws nesaf.",
      edit: "Golygu'r anogwr", acts: "Actau", how: "Sut mae'n cael ei wneud", how_note: "Mae pob digwyddiad dyddiedig yn y cronoleg y tu ôl i un drws yn union, gyda'i rifau tystiolaeth. Defnyddir yr un wynebau, lleisiau, adeiladau a thirluniau ym mhob golygfa. Caiff unrhyw beth a adewir allan ei nodi a'i godi mewn golygfa ddiweddarach.",
      frame: "Ffrâm", act: "Act", script: "Sgript", subtitles: "Isdeitlau", next: "Y nesaf", soon: "Sgript ar y gweill: y crynodeb uchod yw'r cynllun.", subsoon: "Daw'r isdeitlau gyda'r sgript.",
      events: "Digwyddiadau", evidence: "Tystiolaeth", desc: "Beth sy'n digwydd yn yr olygfa", evl: "Tystiolaeth: ein copïau archif", review: "Drafft i'w adolygu", mt: "cyfieithiad peiriant, i'w adolygu", play: "Chwarae", left: "Wedi'i adael allan, i'w godi wedyn"},
    es: {scene: "Escena", released: "Fecha de estreno", ai: "impresión artística", more: "Guion, subtítulos y pruebas", enlarge: "Ver la imagen a pantalla completa", art: "Ver la ilustración", size: "Tamaño de las tarjetas", size_s: "Pequeño", size_m: "Mediano", size_l: "Grande", vers: "Versiones", vfree: "gratis", vcoming: "próximamente", vsel: "Selecciona una versión", vsoon: "Próximamente", vl_free: "Gratis", vl_paid: "£4.99 · introduce un código de acceso o compra", vl_open: "Abierta en este dispositivo", vnow: "reproduciendo", vopen: "abierta", navb: "Atrás", navn: "Siguiente", nowp: "Reproduciendo", vpicked: "elegida", close: "Cerrar", sub_l: "Una escena nueva cada mañana. Recíbela por correo:", sub_ph: "Tu correo", sub_b: "Suscribirme", sub_human: "Un paso más: Mailchimp quiere comprobar que eres humano. Toca Suscribirme otra vez para terminar en una pestaña nueva.", sub_tab: "Termina en la pestaña nueva y luego revisa tu bandeja de entrada para confirmar.", sub_ok: "Gracias. Revisa tu bandeja de entrada para confirmar.", sub_err: "No se pudo enviar. Revisa la dirección e inténtalo de nuevo.", sub_bad: "Escribe un correo válido.", sending: "Enviando…", mtl: "traducción automática", kicker: "Documental · una producción de tab.bot", sub: "Una puerta por día. Detrás de cada puerta, una escena de unos dos minutos: la gente de Llandough comentando lo que pasa en los papeles y por el pueblo, desde antes de las escrituras hasta hoy.",
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
  function thumbURL(f) {   // v1.9.0: a ready door shows a still from its own scene; a door not yet ready, its estate-silhouette "Coming soon" art
    var m = filledMap()[f.n]; if (m) return RAW + (m.poster || f.thumb || ("thumbs/" + f.id + ".webp")); return RAW + "thumbs/soon/" + f.id + ".webp"; }
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
      if (!m) { th.classList.add("soon"); th.setAttribute("role", "button"); th.tabIndex = 0; th.setAttribute("aria-label", t("vsel") + ": " + t("scene") + " " + f.n); }
      var img = el("img", "cm-img"); img.alt = title; img.loading = "lazy"; img.decoding = "async"; img.src = thumbURL(f); img.onerror = function () { th.classList.add("noimg"); }; th.appendChild(img);
      if (m) th.appendChild(el("span", "cm-ai", t("ai"))); th.appendChild(el("span", "cm-date", dtxt));
      if (f.n === nextN) th.appendChild(el("span", "cm-tag", t("next")));
      var DG = window.CedwynDoc; if (m && DG && !DG.canPlay(f.n)) { card.classList.add("locked"); th.appendChild(el("span", "cm-tag cd-lock", DG.label(f.n))); }
      if (m) { var pb = el("button", "cm-playbig"); pb.type = "button"; pb.setAttribute("data-ghf-keep", ""); pb.setAttribute("aria-label", t("play") + ": " + t("scene") + " " + f.n);
        pb.onclick = function (e) { e.stopPropagation(); openGate(f); }; th.appendChild(pb);   // v1.9.0: play opens the version modal; choosing a version plays
        // v1.4.3: the whole picture is the play target (the click goes through the play button, so the licence check still runs)
        th.onclick = function (e) { if (e.target && e.target.closest && e.target.closest(".cm-playbig")) return; pb.click(); }; }
      else { th.onclick = function () { openGate(f); }; th.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGate(f); } }; }   // v1.9.0: a coming-soon door opens the same modal
      card.appendChild(th);
      var body = el("div", "cm-body");
      var hd = el("div", "cm-hd"); hd.appendChild(el("div", "cm-scene", t("scene") + " " + f.n));
      var ab = el("button", "cm-artbtn", t("art")); ab.type = "button"; ab.setAttribute("aria-label", t("enlarge") + ": " + t("scene") + " " + f.n);
      ab.onclick = function (e) { e.stopPropagation(); openLB(f, title, dtxt); }; hd.appendChild(ab); body.appendChild(hd);
      body.appendChild(el("h3", "", title)); body.appendChild(el("p", "cm-log", tl(f, "logline")));
      // v1.9.0 (owner's rule m:1d4eb2cf): under "What happens in this scene", three dropdowns in this order: Script, Subtitles, Evidence.
      // Evidence is the last one and the only place on the door where evidence appears (archived copies, record numbers, events, anything left out).
      var DS = f.description && (f.description[lang()] || f.description.en);
      var dd = el("details", "cm-desc"); dd.appendChild(el("summary", "", t("desc"))); if (DS && DS.intro) dd.appendChild(el("p", "cm-desc-i", DS.intro));
      if (DS && DS.shots && DS.shots.length) { var ol = el("ol", "cm-shots"); DS.shots.forEach(function (s) { ol.appendChild(el("li", "", String(s).replace(/^\d+\.\s*/, ""))); }); dd.appendChild(ol); }
      if (f.date_range) dd.appendChild(el("div", "cm-meta", f.date_range));
      var d1 = el("details", "cm-sub cm-d-script"); d1.appendChild(el("summary", "", t("script"))); d1.appendChild(el("ul", "cm-lines")); dd.appendChild(d1);
      var d2 = el("details", "cm-sub cm-d-subs"); d2.appendChild(el("summary", "", t("subtitles"))); d2.appendChild(el("ul", "cm-lines")); dd.appendChild(d2);
      var d3 = el("details", "cm-sub cm-d-evd"); d3.appendChild(el("summary", "", t("evidence")));
      var EL = f.evidence_links || [];
      if (EL.length) { var ul = el("ul", "cm-evl"); EL.forEach(function (x) { var li = el("li"), aa = el("a", "", x.title); aa.href = x.href; li.appendChild(aa); if (x.id) li.appendChild(el("span", "cm-evid", " " + x.id)); ul.appendChild(li); }); d3.appendChild(ul); }
      if (f.evidence && f.evidence.length) d3.appendChild(el("p", "cm-ev", f.evidence.join(" · ")));
      if (f.events && f.events.length) d3.appendChild(el("p", "cm-ev", t("events") + ": " + f.events.join(" · ")));
      if (m && m.left_out && m.left_out.length) d3.appendChild(el("p", "cm-ev", t("left") + ": " + m.left_out.map(function (x) { return x.id || x; }).join(" · ")));
      if (!d3.querySelector("ul,p")) d3.appendChild(el("p", "cm-ev", t("soon")));
      dd.appendChild(d3); body.appendChild(dd); card.appendChild(body); grid.appendChild(card);
      var opened = false; [d1, d2].forEach(function (d) { d.addEventListener("toggle", function () { if (d.open && !opened) { opened = true; loadScript(f).then(function () { fillDetails(card, f); }); } else if (d.open) fillDetails(card, f); }); });
    });
  }
  // v1.8.0 (1 Nov 2026, owner's rule m:417a8ed2; docs/VERSION-STANDARD.md "Selector UI"): ONE plain dropdown per released scene.
  // Its first option is the placeholder "Select a version", shown on load; no label above it and no line under it.
  // The (i) beside it opens the scene's version table. The picture shows the scene's own still on load; tapping play with no
  // version chosen swaps it for a random image from the NFT collection with "Select a version" and a down arrow over it.
  // Choosing a version then behaves as before: a free or open cut plays, a paid cut opens its access-code / buy box (documentary.js).
  // The row keeps the class cm-vchips and data-n so the scene-version events still find it. — Cedwyn editors
  function optText(DG, n, c) {
    var lab = DG && DG.vlabel ? DG.vlabel(n, c.v) : "v" + (c.label || c.v);
    var tag = c.coming ? t("vcoming") : c.paid ? (c.open ? t("vopen") : "£" + Number(c.price || 4.99).toFixed(2)) : t("vfree");
    var on = !!playingNV && playingNV.n === n && playingNV.v === c.v;
    return lab + (tag ? " — " + tag : "") + (on ? " · " + t("vnow") : "");
  }
  var picked = {};   // the version a visitor chose for a scene on this visit (none until they choose)
  var NFT = ["0014","0016","0019","0020","0021","0023","0026","0029","0032","0035","0038","0043","0044","0048","0050","0051","0052","0055","0057","0058","0059","0060","0067","0069","0070","0071","0072","0076","0077","0078","0079","0080"].map(function (k) { return "/nft-art/art/nfa-" + k + "-v0.0.2-t.webp"; });
  try { fetch("/_cedwyn/version-gate.json", {cache: "no-cache"}).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.images && j.images.length) NFT = j.images.slice(); }).catch(function () {}); } catch (e) {}
  function chipRow(f) {
    var DG = window.CedwynDoc, row = el("div", "cm-vchips cm-vsel"); row.setAttribute("data-n", f.n);
    var list = DG && DG.chips ? DG.chips(f.n) : [], m0 = filledMap()[f.n];
    if (!m0) { list = list.filter(function (c) { return !c.coming; }); if (!list.length) list = [{v: "soon", coming: true, soon: true}]; }   // v1.9.0: a coming-soon door lists what exists, else one disabled "Coming soon"
    if (!list.length) { list = [{v: String((m0 && m0.version) || "0.0.1"), current: true, latest: true, free: true, label: "0.0.2"}]; }
    var s = el("select", "cm-vs"); s.id = "cm-vs-" + f.n; s.setAttribute("data-ghf-keep", ""); s.setAttribute("aria-label", t("vsel") + ": " + t("scene") + " " + f.n);
    var ph = el("option", "cm-vph", t("vsel")); ph.value = ""; ph.disabled = true; ph.selected = true; s.appendChild(ph);
    list.forEach(function (c) { var o = el("option", "", c.soon ? t("vsoon") : optText(DG, f.n, c)); o.value = c.v; if (c.coming) o.disabled = true; s.appendChild(o); });
    var ib = el("button", "cm-vi", "i"); ib.type = "button"; ib.setAttribute("data-ghf-keep", ""); ib.setAttribute("aria-label", t("vers") + ": " + t("scene") + " " + f.n);
    [s, ib].forEach(function (x) { ["click", "pointerdown", "touchstart", "keydown"].forEach(function (ev) { x.addEventListener(ev, function (e) { e.stopPropagation(); }); }); });
    ib.addEventListener("click", function (e) { e.preventDefault(); vTable(f); });
    s.addEventListener("change", function (e) { e.stopPropagation(); var v = s.value; if (!v) return;
      closeGate();   // v1.9.0: the modal closes first, so the access-code / buy box (paid) or the player (free) is in front
      var ok = DG && DG.pick ? DG.pick(f.n, v) !== false : true;   // a paid cut not open here opens the access-code / buy box
      if (ok) { picked[f.n] = v; var mm = filledMap()[f.n]; if (mm) play(f, mm); }
      paintChips(row, f.n); });
    row.appendChild(s); row.appendChild(ib);
    markRow(row, f.n);
    return row;
  }
  // v1.9.0 (1 Nov 2026, owner's rule m:1d4eb2cf; docs/VERSION-STANDARD.md §2a): the version selector lives ONLY in this modal.
  // Tapping a coming-soon door, or play on a ready door, opens it: a random image from the NFT collection with "Select a version"
  // and a down arrow over it, and under the image the one plain dropdown (placeholder "Select a version", no label, nothing under it)
  // with the (i) version table beside it. Free plays; paid opens the access-code / buy box (documentary.js). — Cedwyn editors
  var GATE = null;
  function closeGate() { if (!GATE) return; var g = GATE; GATE = null; if (g.bg.parentNode) g.bg.parentNode.removeChild(g.bg); document.removeEventListener("keydown", g.esc); document.documentElement.classList.remove("cm-gm-on"); }
  function openGate(f) {
    closeGate();
    var bg = el("div", "cm-gm-bg"), box = el("div", "cm-gm"); box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", t("vsel") + ": " + t("scene") + " " + f.n);
    var pic = el("div", "cm-gm-pic"), im = el("img", "cm-vp-img"); im.alt = ""; im.decoding = "async"; im.src = NFT[Math.floor(Math.random() * NFT.length)]; pic.appendChild(im);
    var cap = el("div", "cm-vp-cap"); cap.appendChild(el("span", "cm-vp-t", t("vsel")));
    var ar = el("span", "cm-vp-a"); ar.setAttribute("aria-hidden", "true"); ar.innerHTML = '<svg viewBox="0 0 24 24" width="40" height="40"><path fill="currentColor" d="M11 3h2v13.2l4.6-4.6 1.4 1.4-7 7-7-7 1.4-1.4 4.6 4.6z"/></svg>'; cap.appendChild(ar); pic.appendChild(cap);
    var x = el("button", "cm-gm-x", "×"); x.type = "button"; x.setAttribute("aria-label", t("close")); x.setAttribute("data-ghf-keep", ""); pic.appendChild(x);
    box.appendChild(pic); var row = chipRow(f); box.appendChild(row); bg.appendChild(box); document.body.appendChild(bg);
    function esc(ev) { if (ev.key === "Escape") { ev.stopPropagation(); closeGate(); } }
    GATE = {bg: bg, n: f.n, esc: esc}; document.documentElement.classList.add("cm-gm-on");
    x.onclick = function (e) { e.stopPropagation(); closeGate(); }; bg.addEventListener("click", function (ev) { if (ev.target === bg) closeGate(); }); document.addEventListener("keydown", esc);
    var s = row.querySelector("select.cm-vs"); if (s) { try { s.focus({preventScroll: true}); } catch (e) {} }
  }
  function vTable(f) {   // the (i) table: version, date, change, price for this scene's cuts
    var DG = window.CedwynDoc, list = DG && DG.chips ? DG.chips(f.n) : [], e = DG && DG.entries ? DG.entries[f.n] : null;
    var bg = el("div", "cm-vt-bg"), box = el("div", "cm-vt"); box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", t("vers"));
    var hd = el("div", "cm-vt-h"); hd.appendChild(el("strong", "", t("vers") + " · " + t("scene") + " " + f.n)); var x = el("button", "cm-vt-x", "×"); x.type = "button"; x.setAttribute("aria-label", "×"); hd.appendChild(x); box.appendChild(hd);
    var tb = el("table", "cm-vt-t"), bd = el("tbody");
    list.forEach(function (c) { var tr = el("tr"), made = (c.cut && c.cut.made) || (c.current && e && (e.made || e.released)) || "";
      tr.appendChild(el("td", "cm-vt-v", DG && DG.vlabel ? DG.vlabel(f.n, c.v) : "v" + c.v)); tr.appendChild(el("td", "", String(made).slice(0, 10)));
      tr.appendChild(el("td", "", c.note || "")); tr.appendChild(el("td", "cm-vt-p", c.coming ? t("vcoming") : c.paid ? "£" + Number(c.price || 4.99).toFixed(2) : t("vfree"))); bd.appendChild(tr); });
    tb.appendChild(bd); box.appendChild(tb); bg.appendChild(box); document.body.appendChild(bg);
    function close() { if (bg.parentNode) bg.parentNode.removeChild(bg); document.removeEventListener("keydown", esc); }
    function esc(ev) { if (ev.key === "Escape") close(); }
    x.onclick = close; bg.addEventListener("click", function (ev) { if (ev.target === bg) close(); }); document.addEventListener("keydown", esc); try { x.focus(); } catch (er) {}
  }
  document.addEventListener("cedwyn-doc-vlabels", function () { markAll(); });   // v1.5.1: site-wide labels arrived from /_cedwyn/versions.json
  function markAll() { Array.prototype.forEach.call(document.querySelectorAll(".cm-vchips"), function (r) { markRow(r, +r.getAttribute("data-n")); }); }
  function paintChips(row, n) { markRow(row, n); }
  // v1.6.0: the cut in the open player is marked "now playing" in its option; v1.8.0: the menu stays on "Select a version" until the visitor chooses
  var playingNV = null;
  function markRow(row, n) {
    var DG = window.CedwynDoc, s = row.querySelector("select.cm-vs"); if (!s) return;
    var list = DG && DG.chips ? DG.chips(n) : [], on = !!playingNV && playingNV.n === n;
    Array.prototype.forEach.call(s.options, function (o) { if (!o.value) { o.textContent = t("vsel"); return; } var c = list.filter(function (x) { return x.v === o.value; })[0]; if (c) o.textContent = optText(DG, n, c); });
    var want = on ? playingNV.v : "";   // v1.9.0: the modal always opens on "Select a version"
    s.value = want; if (s.value !== want) s.value = "";
    s.classList.toggle("is-playing", on); row.classList.toggle("is-playing", on);
  }
  // v1.5.0: the card-size control (small / medium / large), set before browsing, applies to every card, remembered on this device
  function sizeBar() {
    var bar = $("cm-size"), g = $("cm-grid"); if (bar || !g) return bar;
    bar = el("div", "cm-size"); bar.id = "cm-size"; bar.setAttribute("role", "group"); bar.setAttribute("aria-labelledby", "cm-size-lbl");
    var lb = el("span", "cm-size-lbl", t("size")); lb.id = "cm-size-lbl"; lb.setAttribute("data-t", "size"); bar.appendChild(lb);
    SIZES.forEach(function (z) { var b = el("button", "cm-size-b"); b.type = "button"; b.setAttribute("data-z", z); b.setAttribute("data-ghf-keep", ""); b.innerHTML = ZSVG[z];
      var s = el("span", "", t("size_" + z)); s.setAttribute("data-t", "size_" + z); b.appendChild(s); b.onclick = function () { setSize(z, true); }; bar.appendChild(b); });
    g.parentNode.insertBefore(bar, g); return bar;
  }
  function setSize(z, user) {
    var g = $("cm-grid"); if (!g) return; SIZES.forEach(function (x) { g.classList.toggle("cm-size-" + x, x === z); });
    var q = document.querySelectorAll(".cm-size-b"); for (var i = 0; i < q.length; i++) q[i].setAttribute("aria-pressed", q[i].getAttribute("data-z") === z ? "true" : "false");
    if (user) { try { localStorage.setItem(ZK, z); } catch (e) {} }
  }
  function loadScript(f) { if (!f.script) return Promise.resolve(); if (S.scripts[f.id]) return Promise.resolve(); return get(f.script).then(function (s) { S.scripts[f.id] = s; }).catch(function () {}); }
  // player: the clip plays muted; the chosen language track plays beside it, kept in step.
  // Playback controls (v1.2.0): play/pause, position, full screen, audio language, subtitle language (independent of audio).
  var V = $("cm-video"), A = $("cm-audio"), ST = $("cm-stage"), cur = null, LANGS = ["cy", "en", "es"], NAT = {cy: "Cymraeg", en: "English", es: "Español"}, cuesBy = {}, trackUrls = [], iosFS = false, idleT = null;
  function subLang() { return S.sub ? S.sub : lang(); }
  // v1.7.2: a paid cut's files are not in the public storage repository; the manifest lists them as "doc:<path>" and they stream
  // from this site's access service once an access code for that scene is held on this device (or the viewer is a member).
  function docCode(n) { var c = {}; try { c = JSON.parse(localStorage.getItem("cedwyn-doc-codes") || "{}") || {}; } catch (e) {}
    for (var k in c) if (k.split("|")[0] === String(n) && c[k]) return c[k]; return c["0|*"] || ""; }
  function mediaSrc(p, n) { p = String(p || ""); if (!/^doc:/.test(p)) return RAW + p; var k = docCode(n);
    return location.origin + "/api/doc/media?n=" + encodeURIComponent(n) + "&p=" + encodeURIComponent(p.slice(4)) + (k ? "&k=" + encodeURIComponent(k) : ""); }
  // v1.7.0 (31 Oct 2026, standing rules m:cc94f07a): NATIVE-LANGUAGE RENDERS. manifest.renders = [{scene, lang, version, path, src?, native, status}]
  // with path = movie/<scene-id>/<scene-id>.<lang>.v<semver>.webm (src, when present, is where the same bytes already live).
  // Choosing an audio language loads THAT language's own video for the chosen version (never an audio-track swap over another
  // language's picture); a (scene, lang, version) not yet made shows the "video pending" image with its label in HTML.
  // Doors with no renders in the manifest keep the older behaviour below. — Cedwyn editors
  var RV = {};
  function sceneOf(m) { var x = String((m && (m.scene || m.clip)) || "").match(/F\d{3}[A-Z]?/); return x ? x[0] : null; }
  function rendersOf(m) { if (m && m.cut) return [];   // an earlier cut chosen with the version chips plays as it always did
    var R = (S.manifest && S.manifest.renders) || [], id = sceneOf(m); return id ? R.filter(function (r) { return r.scene === id; }) : []; }
  function svCmp(a, b) { a = String(a).split(".").map(Number); b = String(b).split(".").map(Number); for (var i = 0; i < 3; i++) { if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) - (b[i] || 0); } return 0; }
  function rVersions(m) { var o = []; rendersOf(m).forEach(function (r) { if (o.indexOf(r.version) < 0) o.push(r.version); }); return o.sort(function (a, b) { return svCmp(b, a); }); }
  function rLive(m, v, L) { var rs = rendersOf(m); for (var i = 0; i < rs.length; i++) { var r = rs[i]; if (r.version === v && r.lang === L && r.status === "live" && (r.src || r.path)) return r; } return null; }
  function rChosen(n, m) { var vs = rVersions(m); if (RV[n] && vs.indexOf(RV[n]) >= 0) return RV[n]; for (var i = 0; i < vs.length; i++) if (rLive(m, vs[i], S.audio)) return vs[i]; return vs[0]; }
  function rFor(n, m) { if (!rendersOf(m).length) return undefined; return rLive(m, rChosen(n, m), S.audio); }   // undefined = no renders (old door), null = pending
  var PEND_T = {cy: "Fideo Cymraeg ar y gweill: nid yw'r fersiwn hon wedi'i gwneud eto.", en: "English video pending: this version is not made yet.", es: "Vídeo en español pendiente: esta versión aún no está hecha."};
  function pendingEl() {
    var p = $("cm-pending"); if (p) return p; var host = V.parentNode; p = el("div", "cm-pending"); p.id = "cm-pending"; p.hidden = true;
    p.setAttribute("style", "position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#1d2422;color:#f1ece2;text-align:center;padding:1em;z-index:3");
    var im = el("img"); im.src = "video-pending.webp"; im.alt = ""; im.setAttribute("style", "max-width:100%;max-height:72%;object-fit:contain"); p.appendChild(im);
    var lb = el("p", "cm-pending-l"); lb.id = "cm-pending-l"; lb.setAttribute("style", "margin:.6em 0 0;font-size:1rem;line-height:1.35"); p.appendChild(lb);
    if (getComputedStyle(host).position === "static") host.style.position = "relative"; host.appendChild(p); return p;
  }
  function showPending(on) {
    var p = pendingEl(); p.hidden = !on; if (!on) return;
    var n = cur ? cur.f.n : 0, v = cur ? rChosen(n, cur.m) : "";
    $("cm-pending-l").textContent = (PEND_T[S.audio] || PEND_T.en) + (S.audio !== "en" ? " / " + PEND_T.en : "") + " (v" + v + ")";
    V.pause(); A.pause(); A.removeAttribute("src"); V.removeAttribute("src"); try { V.load(); } catch (e) {}
  }
  function rvPaint() {
    var row = $("cm-rv-row"); if (!row) { var pc = document.querySelector(".cm-pc"); if (!pc) return; row = el("div", "cm-pc-row"); row.id = "cm-rv-row"; row.setAttribute("role", "group"); row.setAttribute("aria-label", "Version");
      row.appendChild(el("span", "cm-pc-l", "Version")); var sel = el("select", "cm-btn cm-pc-o"); sel.id = "cm-rv"; row.appendChild(sel); pc.appendChild(row);
      sel.onchange = function () { if (!cur) return; RV[cur.f.n] = sel.value; swapVideo(); setAudio(true); paintPlayer(); }; }
    var s2 = $("cm-rv"), m = cur && cur.m, vs = m ? rVersions(m) : []; row.hidden = !vs.length; if (!vs.length) return;
    while (s2.firstChild) s2.removeChild(s2.firstChild); var ch = rChosen(cur.f.n, m);
    vs.forEach(function (v) { var o = el("option", "", "v" + v + " · " + LANGS.map(function (L) { var r = rLive(m, v, L); return L + (r ? (r.native ? " ✓" : " ~") : " …"); }).join(" ")); o.value = v; if (v === ch) o.selected = true; s2.appendChild(o); });
  }

  // v1.10.0 (1 Nov 2026): audio x subtitle matrix. Each scene's newest cut is offered as 12 MP4 files, {cy,en,es} native audio x
  // {off,cy,en,es} subtitles burned in (manifest entry.matrix, tools/av_matrix.py). The chosen pair plays from its own file in this
  // same video element; a change preloads the new file, seeks it to the same moment and swaps, keeping play/pause. A pair not made
  // yet (null) is "pending": its button is disabled. Earlier cuts (eff) and scenes without a matrix keep the 1.9.0 behaviour.
  var MXP = {en: "pending", cy: "ar y gweill", es: "pendiente"};
  function mxOf(m) { var mx = m && m.matrix; if (!mx || !mx.audio) return null; if (!m.cut) return mx;   // 1.10.1: an earlier cut made from the same master video uses that master's files
    if (!mx.src) return null; if (m._mx !== undefined) return m._mx; var o = {version: mx.version, audio: {}, bytes: mx.bytes, src: mx.src}, any = false;
    LANGS.forEach(function (a) { var v = (m.video && m.video[a]) || (a === (m.default_audio || "cy") ? m.clip : null), ok = !!(v && mx.src[a] === v && mx.audio[a]);
      o.audio[a] = ok ? mx.audio[a] : {off: null, cy: null, en: null, es: null}; any = any || ok; });
    m._mx = any ? o : null; return m._mx; }
  function mxPath(a, s) { var mx = cur && mxOf(cur.m); if (!mx) return null; a = a || S.audio; s = s || subLang(); return (mx.audio[a] && mx.audio[a][s]) || null; }
  function mxBurned() { return !!(mxPath() && subLang() !== "off"); }
  function mxAvail(a, s) { var mx = cur && mxOf(cur.m); if (!mx) return true; return !!(mx.audio[a] && mx.audio[a][s]); }
  function mxSwap(want, at, was) {   // preload, seek, then swap: the picture holds the old frame until the new file is ready there
    var pre = document.createElement("video"), done = false; pre.muted = true; pre.preload = "auto"; pre.playsInline = true;
    var go = function () { if (done) return; done = true; var t = V.currentTime || at, w = !V.paused || was; V.src = want;   // the old file kept playing meanwhile: take its moment now
      var once = function () { V.removeEventListener("loadedmetadata", once); try { V.currentTime = t; } catch (e) {}
        if (w) V.play().catch(function () {}); paintPlayer(); var rec = window.CedwynMatrixLast = {src: want, at: t, playing: w, ts: Date.now()};
        var sk = function () { V.removeEventListener("seeked", sk); rec.landed = V.currentTime; }; V.addEventListener("seeked", sk); };
      V.addEventListener("loadedmetadata", once); pre.removeAttribute("src"); try { pre.load(); } catch (e) {} };
    pre.addEventListener("loadedmetadata", function () { try { pre.currentTime = at; } catch (e) { go(); } });
    pre.addEventListener("seeked", go); pre.addEventListener("error", go); setTimeout(go, 4000);
    pre.src = want;
  }
  function clipFor(m) { if (cur && cur.m === m) { var mp = mxPath(); if (mp) return mp; } var r = rFor(cur && cur.m === m ? cur.f.n : 0, m); if (r === null) return null; if (r) return r.src || r.path;
    var vv = m && m.video; return (vv && (vv[S.audio] || vv[m.default_audio || "cy"])) || m.clip; }   // v1.4.5: per-language lip-synced video, else the one clip   // v1.4.5: per-language lip-synced video, else the one clip
  window.CedwynPlayer = {video: V, raw: RAW, src: function (p) { return mediaSrc(p, cur && cur.f ? cur.f.n : 0); }, current: function () { return cur; }, audio: function () { return S.audio; }, sub: function () { return subLang(); }, clip: function () { return cur ? (clipFor(cur.m) || cur.m.clip) : null; }, matrix: function (a, s) { return mxPath(a, s); }, hasMatrix: function () { return !!(cur && mxOf(cur.m)); }};   // read by download.js (v1.4.2; clip() v1.4.5)
  function subPath(L) { var vs = cur.m.vsubs && cur.m.vsubs[S.audio]; if (vs && vs[L]) return vs[L];   // v1.6.3: a video whose timeline differs from the shared subtitles carries its own
    return cur.m.subs && cur.m.subs[L] ? cur.m.subs[L] : "subs/" + cur.f.id + "." + L + ".vtt"; }
  function eff(n, m) {   // v1.4.6/1.5.0: the entry as chosen with the scene's version chips: the newest cut, or an earlier cut (v0.0.1-0.0.N)
    var DG = window.CedwynDoc, c = DG && DG.cut ? DG.cut(n) : null; if (!c || !c.clip) return m;
    var o = {}, k; for (k in m) o[k] = m[k]; delete o.video; delete o.vsubs; delete o.downloads; delete o.next_version; for (k in c) o[k] = c[k]; if (!c.seconds) delete o.seconds;
    var dl = {}, title = "Cedwyn – Door " + n + " – " + (DG.vlabel ? DG.vlabel(n, c.version) : "v" + c.version) + " (earlier cut)";
    LANGS.forEach(function (a) { var p = (c.video && c.video[a]) || c.clip; ["cy", "en", "es", "off"].forEach(function (s) { dl[a + "|" + s] = {path: p, ext: (String(p).match(/\.(\w+)$/) || [0, "webm"])[1], title: title + (c.video && c.video[a] ? " – " + NAT[a] : "")}; }); });
    o.downloads = dl; o.cut = c.version; return o;
  }
  function play(f, m) {
    var DG = window.CedwynDoc; if (DG && !DG.canPlay(f.n)) { DG.locked(f.n); return; }   // a scene not yet open (never while every scene is free)
    m = eff(f.n, m); cur = {f: f, m: m}; $("cm-p-title").textContent = t("scene") + " " + f.n + " · " + tl(f, "title"); $("cm-p-meta").textContent = f.date_range + (m.seconds ? " · " + fmt(m.seconds) : "") + " · " + (window.CedwynDoc && window.CedwynDoc.vlabel ? window.CedwynDoc.vlabel(f.n, m.cut || m.version || "0.0.1") : "v" + (m.cut || m.version || "0.0.1"));
    if (m.poster) V.setAttribute("poster", RAW + m.poster); else V.removeAttribute("poster");
    var c0 = clipFor(m); $("cm-player").hidden = false; rvPaint(); if (c0 === null) { showPending(true); loadCues(); paintPlayer(); return; } showPending(false);
    V.src = mediaSrc(c0, f.n); setAudio(true); loadCues(); paintPlayer();
    var DGp = window.CedwynDoc; playingNV = {n: f.n, v: DGp && DGp.chosen ? DGp.chosen(f.n) : String(m.cut || m.version)}; markAll(); navPaint();
    if (A.getAttribute("src")) A.play().catch(function () {});   // inside the tap, so phones allow the sound
    V.play().catch(function () {}); try { $("cm-pp").focus({preventScroll: true}); } catch (e) {}
  }
  function syncA() { if (A.getAttribute("src")) { try { A.currentTime = V.currentTime || 0; } catch (e) {} if (!V.paused) A.play().catch(function () {}); } }
  function setAudio(fresh) {
    if (!cur) return; if (mxPath()) { A.pause(); A.removeAttribute("src"); V.muted = false; return; }   // v1.10.0: a matrix MP4 carries its own language if (rendersOf(cur.m).length) { A.pause(); A.removeAttribute("src"); V.muted = false; return; }   // v1.7.0: a native render carries its own language
    var a = cur.m.audio && cur.m.audio[S.audio];
    if (!a) { A.pause(); A.removeAttribute("src"); V.muted = false; return; }
    V.muted = true; if (A.getAttribute("src") === mediaSrc(a, cur.f.n) && !fresh) { syncA(); return; }
    var wasPlaying = !V.paused; A.pause(); A.src = mediaSrc(a, cur.f.n);
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
  function trackModes() { var s = subLang(); for (var k = 0; k < V.textTracks.length; k++) { var tt = V.textTracks[k]; tt.mode = (tt.language === s && !mxBurned()) ? (iosFS ? "showing" : "hidden") : "disabled"; } }
  function drawCue() { var c = $("cm-cue"); c.textContent = ""; var s = subLang(); if (s === "off" || iosFS || mxBurned()) return; var x = V.currentTime, hit = (cuesBy[s] || []).filter(function (q) { return x >= q.a && x <= q.b; })[0]; if (hit) c.appendChild(el("span", "", hit.t)); }
  function paintPlayer() {
    var pp = $("cm-pp"), playing = !V.paused && !V.ended; pp.setAttribute("aria-label", playing ? t("pause") : t("play")); pp.classList.toggle("is-play", !playing);
    var fs = isFS(); $("cm-fs").setAttribute("aria-label", fs ? t("fsx") : t("fs")); $("cm-fs").setAttribute("aria-pressed", fs ? "true" : "false"); $("cm-fs").classList.toggle("is-on", fs);
    $("cm-seek").setAttribute("aria-label", t("seek"));
    var s = subLang(); Array.prototype.forEach.call(document.querySelectorAll(".cm-ps"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-s") === s ? "true" : "false"); });
    Array.prototype.forEach.call(document.querySelectorAll(".cm-pa"), function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-a") === S.audio ? "true" : "false"); });
    var pl = MXP[(document.documentElement.getAttribute("lang") || "en").slice(0, 2)] || MXP.en;   // v1.10.0: pairs not made yet
    Array.prototype.forEach.call(document.querySelectorAll(".cm-pa"), function (b) { var a = b.getAttribute("data-a"), ok = !cur || !mxOf(cur.m) || ["off", "cy", "en", "es"].some(function (x) { return mxAvail(a, x); }); mxMark(b, ok, pl); });
    Array.prototype.forEach.call(document.querySelectorAll(".cm-ps"), function (b) { mxMark(b, mxAvail(S.audio, b.getAttribute("data-s")), pl); });
  }
  function mxMark(b, ok, pl) { b.disabled = !ok; b.classList.toggle("is-pending", !ok); var p = b.querySelector(".cm-pend");
    if (!ok && !p) { p = el("small", "cm-pend", pl); b.appendChild(p); } else if (p) { if (ok) p.remove(); else p.textContent = pl; } b.title = ok ? "" : pl; }
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
    if (!cur) return; rvPaint(); var c1 = clipFor(cur.m); if (c1 === null) { showPending(true); return; } showPending(false);   // v1.7.0
    var want = mediaSrc(c1, cur.f.n); if (V.getAttribute("src") === want) return;   // v1.6.0: the same cut, in the new language
    var at = V.currentTime || 0, was = !V.paused; if (A.getAttribute("src")) A.pause(); if (mxPath() && V.getAttribute("src")) { mxSwap(want, at, was); return; } V.src = want;
    var once = function () { V.removeEventListener("loadedmetadata", once); try { V.currentTime = at; } catch (e) {} try { A.currentTime = at; } catch (e) {}
      if (was) { V.play().catch(function () {}); if (A.getAttribute("src")) A.play().catch(function () {}); } };
    V.addEventListener("loadedmetadata", once);
  }
  // v1.6.0: Back / Next step through every cut of every released scene (scene 1 oldest cut … newest, then scene 2 …)
  var LNAME = {cy: "welsh", en: "english", es: "spanish"};
  function frameOf(n) { var it = (S.frames && S.frames.items) || []; for (var i = 0; i < it.length; i++) if (it[i].n === n) return it[i]; return null; }
  function seq() { var DG = window.CedwynDoc, fm = filledMap(), out = [];
    Object.keys(fm).map(Number).sort(function (a, b) { return a - b; }).forEach(function (n) { if (!frameOf(n)) return;
      var l = DG && DG.chips ? DG.chips(n).filter(function (c) { return !c.coming; }) : [{v: String(fm[n].version || "0.0.1")}];
      l.slice().reverse().forEach(function (c) { out.push({n: n, v: c.v, c: c}); }); });
    return out; }
  function seqAt() { if (!playingNV) return -1; var s = seq(); for (var i = 0; i < s.length; i++) if (s[i].n === playingNV.n && s[i].v === playingNV.v) return i; return -1; }
  function tagOf(x) { var DG = window.CedwynDoc; return DG && DG.vtag && x.c ? DG.vtag(x.c) : "#v" + x.v; }
  function navEls() {
    var pc = document.querySelector("#cm-player .cm-pc"); if (!pc) return null; var row = $("cm-nav");
    if (!row) { row = el("div", "cm-pc-row cm-nav"); row.id = "cm-nav"; row.setAttribute("role", "group");
      var b1 = el("button", "cm-btn cm-navb"); b1.type = "button"; b1.id = "cm-prev"; b1.setAttribute("data-ghf-keep", "");
      var nw = el("p", "cm-now"); nw.id = "cm-now"; nw.setAttribute("aria-live", "polite");
      var b2 = el("button", "cm-btn cm-navb"); b2.type = "button"; b2.id = "cm-next"; b2.setAttribute("data-ghf-keep", "");
      row.appendChild(b1); row.appendChild(nw); row.appendChild(b2);
      var top = pc.querySelector(".cm-pc-top"); if (top && top.nextSibling) pc.insertBefore(row, top.nextSibling); else pc.appendChild(row);
      b1.onclick = function () { step(-1); }; b2.onclick = function () { step(1); }; }
    return row; }
  function navPaint() {
    var row = navEls(); if (!row || !cur) return; var s = seq(), i = seqAt(), p = s[i - 1], nx = s[i + 1], DG = window.CedwynDoc;
    var b1 = $("cm-prev"), b2 = $("cm-next"); b1.textContent = "‹ " + t("navb"); b2.textContent = t("navn") + " ›";
    b1.disabled = !p; b2.disabled = !nx; row.setAttribute("aria-label", t("navb") + " / " + t("navn"));
    b1.setAttribute("aria-label", t("navb") + (p ? ": " + t("scene") + " " + p.n + " " + tagOf(p) : "")); b2.setAttribute("aria-label", t("navn") + (nx ? ": " + t("scene") + " " + nx.n + " " + tagOf(nx) : ""));
    b1.title = p ? t("scene") + " " + p.n + " · " + tagOf(p) : ""; b2.title = nx ? t("scene") + " " + nx.n + " · " + tagOf(nx) + (nx.c && nx.c.paid && !nx.c.open ? " · £" + Number(nx.c.price || 4.99).toFixed(2) : "") : "";
    var me = s[i], vl = me && DG && DG.vlabel ? DG.vlabel(me.n, me.v) : (me ? "v" + me.v : "");
    $("cm-now").textContent = me ? t("nowp") + ": " + t("scene") + " " + me.n + " · " + tagOf(me) + " · " + NAT[S.audio] + " (" + vl.replace(/^-/, "_") + "_" + LNAME[S.audio] + ")" : "";
  }
  function step(d) {
    var s = seq(), i = seqAt(), x = s[i + d], DG = window.CedwynDoc; if (!x) return;
    if (DG && DG.pick && !DG.pick(x.n, x.v)) return;   // a paid cut not open here: the access-code box opens instead
    var f = frameOf(x.n), m = filledMap()[x.n]; if (f && m) play(f, m);
  }
  window.CedwynPlayer.playScene = function (n) { var f = frameOf(n), m0 = filledMap()[n]; if (f && m0) play(f, m0); };
  document.addEventListener("cedwyn-doc-unlocked", function () { render(); });   // a code opened a cut here: chips read "open"
  function pickAudio(a) { S.audio = a; try { localStorage.setItem("cedwyn-movie-audio-v2", S.audio); } catch (e) {}
    var DGa = window.CedwynDoc; if (cur && DGa && DGa.canPlay && !DGa.canPlay(cur.f.n)) { V.pause(); A.pause(); DGa.locked(cur.f.n); paintStatic(); paintPlayer(); return; }   // v1.6.0: the gate holds for a paid cut
    swapVideo(); setAudio(); if (cur && cur.m.vsubs) loadCues(); trackModes(); drawCue(); paintStatic(); paintPlayer(); navPaint(); }
  function pickSub(s) { S.sub = s; if (s !== "off") S.subLast = s; S.subsOffLegacy = false; try { localStorage.setItem("cedwyn-movie-sublang-v2", s); localStorage.setItem("cedwyn-movie-subs", s === "off" ? "0" : "1"); } catch (e) {} if (cur && mxOf(cur.m)) { swapVideo(); setAudio(); } trackModes(); drawCue(); paintStatic(); paintPlayer(); }
  Array.prototype.forEach.call(document.querySelectorAll(".cm-pa"), function (b) { b.onclick = function () { pickAudio(b.getAttribute("data-a")); }; });
  Array.prototype.forEach.call(document.querySelectorAll(".cm-ps"), function (b) { b.onclick = function () { pickSub(b.getAttribute("data-s")); }; });
  function closePlayer() { if (isFS()) exitFS(); V.pause(); A.pause(); $("cm-player").hidden = true; V.removeAttribute("src"); while (V.firstChild) V.removeChild(V.firstChild); V.load(); cur = null; cuesBy = {}; $("cm-cue").textContent = ""; playingNV = null; markAll(); }
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
  sizeBar(); setSize(sizeGet());
  document.addEventListener("cedwyn-doc-scene-ver", function (e) { var c = e.detail && $("frame-" + e.detail.n), r = c && c.querySelector(".cm-vchips"); if (r) paintChips(r, e.detail.n); });
  get("frames.json").then(function (F) { S.frames = F; render();
    return get("manifest.json").then(function (m) { S.manifest = m || {filled: []}; render(); }).catch(function () {}); }).catch(function () { $("cm-grid").textContent = "…"; });
})();

// v1.4.4 (30 Oct 2026): the version select (documentary.js #cd-ver) lives in the player's control bar; its note text is not shown
(function () {
  var cv = document.getElementById("cd-ver"), pc = document.querySelector("#cm-player .cm-pc");
  if (cv && pc && cv.parentNode !== pc) { cv.classList.add("cm-pc-row", "cm-pc-ver"); pc.appendChild(cv); }
})();
