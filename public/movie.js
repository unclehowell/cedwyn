/* Cedwyn · the film — scene page (movie theme, v1.1.0). A tab.bot production.
   Doors come from frames.json; a door opens when manifest.json in the film's storage repository lists its clip.
   The page reads the storage repository at run time (frames, manifest, prompt, scripts, subtitles, media), so the daily
   scene run only commits there; the copies under ./data/ are the snapshot used when the repository cannot be read.
   The storage repository is the only other address this page reads, and it only plays its media inline. */
(function () {
  "use strict";
  var REPO = "unclehowell/cedwyn-movie", REF = "main";
  var RAW = "https:" + "/" + "/" + ["raw", "githubusercontent", "com"].join(".") + "/" + REPO + "/" + REF + "/";
  var CDN = "https:" + "/" + "/" + ["cdn", "jsdelivr", "net"].join(".") + "/gh/" + REPO + "@";
  var MC = {u: "284f08fe7e1b8d39250808104", id: "6139ff4a0d", host: ["estate", "us3", "list-manage", "com"].join(".")};
  var EDIT = "https:" + "/" + "/" + ["github", "com"].join(".") + "/" + REPO + "/edit/" + REF + "/PROMPT.md";
  var T = {
    en: {scene: "Scene", released: "Release date", ai: "artist's impression", more: "Script, subtitles and evidence", enlarge: "View the picture full screen", close: "Close", sub_l: "A new scene every morning. Get it by email:", sub_ph: "Your email", sub_b: "Subscribe", sub_human: "One more step: Mailchimp wants to check you are human. Tap Subscribe again to finish in a new tab.", sub_tab: "Finish in the new tab, then check your inbox to confirm.", sub_ok: "Thank you. Check your inbox to confirm.", sub_err: "That did not go through. Please check the address and try again.", sub_bad: "Please enter a valid email address.", sending: "Sending…", mtl: "machine translation", kicker: "A tab.bot production", sub: "One door a day. Behind each door, a scene of about two minutes: the people of Llandough talking over what is happening on paper and around the village, from before the deeds to today.",
      of: "of", doors: "scenes released", runtime: "planned running time", subs: "Subtitles", on: "on", off: "off", audio: "Audio", menu: "Production",
      prompt: "Production prompt", prompt_note: "The producer's prompt steers the film. The daily scene run reads it first, every day, before it works on the next door.",
      edit: "Edit the prompt", acts: "Acts", how: "How it is made", how_note: "Every dated event in the chronology sits behind exactly one door, with its evidence numbers. The same faces, voices, buildings and landscapes are used in every scene. Anything a scene leaves out is noted and taken up in a later scene.",
      frame: "Frame", act: "Act", script: "Script", subtitles: "Subtitles", next: "Next scene", soon: "Script in writing: the logline above is the plan.", subsoon: "Subtitles come with the script.",
      events: "Events", evidence: "Evidence", review: "Draft for review", mt: "machine translation, for review", play: "Play", left: "Left out, taken up later"},
    cy: {scene: "Golygfa", released: "Dyddiad rhyddhau", ai: "argraff arlunydd", more: "Sgript, isdeitlau a thystiolaeth", enlarge: "Gweld y llun ar sgrin lawn", close: "Cau", sub_l: "Golygfa newydd bob bore. Derbyniwch hi drwy e-bost:", sub_ph: "Eich e-bost", sub_b: "Tanysgrifio", sub_human: "Un cam arall: mae Mailchimp am wirio eich bod yn ddynol. Tapiwch Tanysgrifio eto i orffen mewn tab newydd.", sub_tab: "Gorffennwch yn y tab newydd, yna edrychwch yn eich mewnflwch i gadarnhau.", sub_ok: "Diolch. Edrychwch yn eich mewnflwch i gadarnhau.", sub_err: "Ni aeth hynny drwodd. Gwiriwch y cyfeiriad a rhowch gynnig arall arni.", sub_bad: "Rhowch gyfeiriad e-bost dilys.", sending: "Yn anfon…", mtl: "cyfieithiad peiriant", kicker: "Cynhyrchiad tab.bot", sub: "Un drws y dydd. Y tu ôl i bob drws, golygfa o tua dau funud: pobl Llandochau yn trafod beth sy'n digwydd ar bapur ac o gwmpas y pentref, o'r cyfnod cyn y gweithredoedd hyd heddiw.",
      of: "o", doors: "golygfa wedi'u rhyddhau", runtime: "hyd arfaethedig", subs: "Isdeitlau", on: "ymlaen", off: "i ffwrdd", audio: "Sain", menu: "Cynhyrchu",
      prompt: "Anogwr y cynhyrchiad", prompt_note: "Anogwr y cynhyrchydd sy'n llywio'r ffilm. Mae'r rhediad dyddiol yn ei ddarllen yn gyntaf, bob dydd, cyn gweithio ar y drws nesaf.",
      edit: "Golygu'r anogwr", acts: "Actau", how: "Sut mae'n cael ei wneud", how_note: "Mae pob digwyddiad dyddiedig yn y cronoleg y tu ôl i un drws yn union, gyda'i rifau tystiolaeth. Defnyddir yr un wynebau, lleisiau, adeiladau a thirluniau ym mhob golygfa. Caiff unrhyw beth a adewir allan ei nodi a'i godi mewn golygfa ddiweddarach.",
      frame: "Ffrâm", act: "Act", script: "Sgript", subtitles: "Isdeitlau", next: "Y nesaf", soon: "Sgript ar y gweill: y crynodeb uchod yw'r cynllun.", subsoon: "Daw'r isdeitlau gyda'r sgript.",
      events: "Digwyddiadau", evidence: "Tystiolaeth", review: "Drafft i'w adolygu", mt: "cyfieithiad peiriant, i'w adolygu", play: "Chwarae", left: "Wedi'i adael allan, i'w godi wedyn"},
    es: {scene: "Escena", released: "Fecha de estreno", ai: "impresión artística", more: "Guion, subtítulos y pruebas", enlarge: "Ver la imagen a pantalla completa", close: "Cerrar", sub_l: "Una escena nueva cada mañana. Recíbela por correo:", sub_ph: "Tu correo", sub_b: "Suscribirme", sub_human: "Un paso más: Mailchimp quiere comprobar que eres humano. Toca Suscribirme otra vez para terminar en una pestaña nueva.", sub_tab: "Termina en la pestaña nueva y luego revisa tu bandeja de entrada para confirmar.", sub_ok: "Gracias. Revisa tu bandeja de entrada para confirmar.", sub_err: "No se pudo enviar. Revisa la dirección e inténtalo de nuevo.", sub_bad: "Escribe un correo válido.", sending: "Enviando…", mtl: "traducción automática", kicker: "Una producción de tab.bot", sub: "Una puerta por día. Detrás de cada puerta, una escena de unos dos minutos: la gente de Llandough comentando lo que pasa en los papeles y por el pueblo, desde antes de las escrituras hasta hoy.",
      of: "de", doors: "escenas estrenadas", runtime: "duración prevista", subs: "Subtítulos", on: "sí", off: "no", audio: "Audio", menu: "Producción",
      prompt: "Indicaciones de producción", prompt_note: "Las indicaciones del productor guían la película. La tarea diaria las lee primero, cada día, antes de trabajar en la siguiente puerta.",
      edit: "Editar las indicaciones", acts: "Actos", how: "Cómo se hace", how_note: "Cada hecho fechado de la cronología está detrás de una sola puerta, con sus números de prueba. Las mismas caras, voces, edificios y paisajes se usan en todas las escenas. Lo que una escena deja fuera se anota y se retoma en una escena posterior.",
      frame: "Cuadro", act: "Acto", script: "Guion", subtitles: "Subtítulos", next: "Próxima", soon: "Guion en preparación: el resumen de arriba es el plan.", subsoon: "Los subtítulos llegan con el guion.",
      events: "Hechos", evidence: "Pruebas", review: "Borrador para revisar", mt: "traducción automática, para revisar", play: "Reproducir", left: "Quedó fuera, se retoma después"}
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
  try { var st = localStorage.getItem("cedwyn-movie-subs"); if (st === "0") S.subs = false; S.audio = localStorage.getItem("cedwyn-movie-audio"); } catch (e) {}
  if (!S.audio) S.audio = lang();
  function paintStatic() {
    var q = document.querySelectorAll("[data-t]"); for (var i = 0; i < q.length; i++) q[i].textContent = t(q[i].getAttribute("data-t"));
    var qp = document.querySelectorAll("[data-tp]"); for (var i2 = 0; i2 < qp.length; i2++) { qp[i2].setAttribute("placeholder", t(qp[i2].getAttribute("data-tp"))); qp[i2].setAttribute("aria-label", t(qp[i2].getAttribute("data-tp"))); }
    $("cm-subs").setAttribute("aria-pressed", S.subs ? "true" : "false"); $("cm-subs-state").textContent = S.subs ? t("on") : t("off");
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
  function thumbURL(f) { var F = S.frames || {}; return CDN + (F.thumbs_ref || REF) + "/" + (f.thumb || ("thumbs/" + f.id + ".webp")); }
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
      var th = el("div", "cm-thumb"); th.style.setProperty("--c", COL[i % COL.length]); th.setAttribute("role", "button"); th.tabIndex = 0;
      th.setAttribute("aria-label", t("enlarge") + ": " + t("scene") + " " + f.n);
      var img = el("img", "cm-img"); img.alt = title; img.loading = "lazy"; img.decoding = "async"; img.src = thumbURL(f); img.onerror = function () { th.classList.add("noimg"); }; th.appendChild(img);
      th.appendChild(el("span", "cm-ai", t("ai"))); th.appendChild(el("span", "cm-date", dtxt));
      if (f.n === nextN) th.appendChild(el("span", "cm-tag", t("next")));
      if (m) { var pb = el("button", "cm-playbig"); pb.type = "button"; pb.setAttribute("data-ghf-keep", ""); pb.setAttribute("aria-label", t("play") + ": " + t("scene") + " " + f.n);
        pb.onclick = function (e) { e.stopPropagation(); play(f, m); }; th.appendChild(pb); }
      th.onclick = function () { openLB(f, title, dtxt); }; th.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLB(f, title, dtxt); } };
      card.appendChild(th);
      var body = el("div", "cm-body");
      body.appendChild(el("div", "cm-scene", t("scene") + " " + f.n));
      body.appendChild(el("h3", "", title)); body.appendChild(el("p", "cm-log", tl(f, "logline")));
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
  // player: the clip plays muted; the chosen language track plays beside it, kept in step
  var V = $("cm-video"), A = $("cm-audio"), cues = [], cur = null;
  function play(f, m) {
    cur = {f: f, m: m}; $("cm-p-title").textContent = t("scene") + " " + f.n + " · " + tl(f, "title"); $("cm-p-meta").textContent = f.date_range + (m.seconds ? " · " + fmt(m.seconds) : "");
    V.src = RAW + m.clip; setAudio(); loadCues(); $("cm-player").hidden = false; V.play().catch(function () {});
  }
  function setAudio() { if (!cur) return; var a = cur.m.audio && cur.m.audio[S.audio]; if (a) { V.muted = true; A.src = RAW + a; A.currentTime = V.currentTime || 0; if (!V.paused) A.play().catch(function () {}); } else { A.removeAttribute("src"); V.muted = false; } }
  function loadCues() { cues = []; if (!cur) return; var key = cur.f.id + "." + lang(); var p = cur.m.subs && cur.m.subs[lang()] ? cur.m.subs[lang()] : "subs/" + key + ".vtt"; get(p, "text").then(function (v) { cues = parseVTT(v); }).catch(function () {}); }
  V.addEventListener("play", function () { if (A.src) { A.currentTime = V.currentTime; A.play().catch(function () {}); } });
  V.addEventListener("pause", function () { A.pause(); }); V.addEventListener("seeked", function () { if (A.src) A.currentTime = V.currentTime; });
  V.addEventListener("timeupdate", function () { if (A.src && !V.paused && Math.abs(A.currentTime - V.currentTime) > 0.3) A.currentTime = V.currentTime;
    var c = $("cm-cue"); if (!S.subs) { c.textContent = ""; return; } var x = V.currentTime, hit = cues.filter(function (q) { return x >= q.a && x <= q.b; })[0];
    c.textContent = ""; if (hit) c.appendChild(el("span", "", hit.t)); });
  function closePlayer() { V.pause(); A.pause(); $("cm-player").hidden = true; V.removeAttribute("src"); V.load(); cur = null; }
  $("cm-p-x").onclick = closePlayer; $("cm-player").addEventListener("click", function (e) { if (e.target === $("cm-player")) closePlayer(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeLB(); if (!$("cm-player").hidden) closePlayer(); closeDrawer(); } });
  $("cm-subs").onclick = function () { S.subs = !S.subs; try { localStorage.setItem("cedwyn-movie-subs", S.subs ? "1" : "0"); } catch (e) {} paintStatic(); };
  Array.prototype.forEach.call(document.querySelectorAll(".cm-a"), function (b) { b.onclick = function () { S.audio = b.getAttribute("data-a"); try { localStorage.setItem("cedwyn-movie-audio", S.audio); } catch (e) {} paintStatic(); setAudio(); }; });
  function openDrawer() { $("cm-drawer").hidden = false; $("cm-menu").setAttribute("aria-expanded", "true");
    get("PROMPT.md", "text").then(function (p) { $("cm-prompt").textContent = p.replace(/<!--[\s\S]*?-->\n*/g, ""); }).catch(function () { $("cm-prompt").textContent = "…"; }); }
  function closeDrawer() { $("cm-drawer").hidden = true; $("cm-menu").setAttribute("aria-expanded", "false"); }
  $("cm-menu").onclick = function () { if ($("cm-drawer").hidden) openDrawer(); else closeDrawer(); };
  $("cm-drawer-x").onclick = closeDrawer; $("cm-drawer").addEventListener("click", function (e) { if (e.target === $("cm-drawer")) closeDrawer(); });
  $("cm-edit").onclick = function () { window.open(EDIT, "_blank", "noopener"); };
  document.addEventListener("ghf-lang-change", function () { paintStatic(); render(); loadCues(); });
  new MutationObserver(function () { paintStatic(); render(); }).observe(document.documentElement, {attributes: true, attributeFilter: ["lang"]});
  paintStatic();
  get("frames.json").then(function (F) { S.frames = F; render();
    return get("manifest.json").then(function (m) { S.manifest = m || {filled: []}; render(); }).catch(function () {}); }).catch(function () { $("cm-grid").textContent = "…"; });
})();
