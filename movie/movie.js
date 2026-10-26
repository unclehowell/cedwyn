/* Cedwyn · the film — advent page (movie theme). A tab.bot production.
   Doors come from frames.json; a door opens when manifest.json in the film's storage repository lists its clip.
   The page reads the storage repository at run time (frames, manifest, prompt, scripts, subtitles, media), so the daily
   scene run only commits there; the copies under ./data/ are the snapshot used when the repository cannot be read.
   The storage repository is the only other address this page reads, and it only plays its media inline. — Sion's Tab agent */
(function () {
  "use strict";
  var REPO = "unclehowell/cedwyn-movie", REF = "main";
  var RAW = "https:" + "/" + "/" + ["raw", "githubusercontent", "com"].join(".") + "/" + REPO + "/" + REF + "/";
  var EDIT = "https:" + "/" + "/" + ["github", "com"].join(".") + "/" + REPO + "/edit/" + REF + "/PROMPT.md";
  var T = {
    en: {kicker: "A tab.bot production", sub: "One door a day. Behind each door, a scene of about two minutes: the people of Llandough talking over what is happening on paper and around the village, from before the deeds to today.",
      of: "of", doors: "doors open", runtime: "planned running time", subs: "Subtitles", on: "on", off: "off", audio: "Audio", menu: "Production",
      prompt: "Production prompt", prompt_note: "The producer's prompt steers the film. The daily scene run reads it first, every day, before it works on the next door.",
      edit: "Edit the prompt", acts: "Acts", how: "How it is made", how_note: "Every dated event in the chronology sits behind exactly one door, with its evidence numbers. The same faces, voices, buildings and landscapes are used in every scene. Anything a scene leaves out is noted and taken up in a later scene.",
      frame: "Frame", act: "Act", script: "Script", subtitles: "Subtitles", next: "Next door", soon: "Script in writing: the logline above is the plan.", subsoon: "Subtitles come with the script.",
      events: "Events", evidence: "Evidence", review: "Draft for review", mt: "machine translation, for review", play: "Play", left: "Left out, taken up later"},
    cy: {kicker: "Cynhyrchiad tab.bot", sub: "Un drws y dydd. Y tu ôl i bob drws, golygfa o tua dau funud: pobl Llandochau yn trafod beth sy'n digwydd ar bapur ac o gwmpas y pentref, o'r cyfnod cyn y gweithredoedd hyd heddiw.",
      of: "o", doors: "drws ar agor", runtime: "hyd arfaethedig", subs: "Isdeitlau", on: "ymlaen", off: "i ffwrdd", audio: "Sain", menu: "Cynhyrchu",
      prompt: "Anogwr y cynhyrchiad", prompt_note: "Anogwr y cynhyrchydd sy'n llywio'r ffilm. Mae'r rhediad dyddiol yn ei ddarllen yn gyntaf, bob dydd, cyn gweithio ar y drws nesaf.",
      edit: "Golygu'r anogwr", acts: "Actau", how: "Sut mae'n cael ei wneud", how_note: "Mae pob digwyddiad dyddiedig yn y cronoleg y tu ôl i un drws yn union, gyda'i rifau tystiolaeth. Defnyddir yr un wynebau, lleisiau, adeiladau a thirluniau ym mhob golygfa. Caiff unrhyw beth a adewir allan ei nodi a'i godi mewn golygfa ddiweddarach.",
      frame: "Ffrâm", act: "Act", script: "Sgript", subtitles: "Isdeitlau", next: "Y drws nesaf", soon: "Sgript ar y gweill: y crynodeb uchod yw'r cynllun.", subsoon: "Daw'r isdeitlau gyda'r sgript.",
      events: "Digwyddiadau", evidence: "Tystiolaeth", review: "Drafft i'w adolygu", mt: "cyfieithiad peiriant, i'w adolygu", play: "Chwarae", left: "Wedi'i adael allan, i'w godi wedyn"},
    es: {kicker: "Una producción de tab.bot", sub: "Una puerta por día. Detrás de cada puerta, una escena de unos dos minutos: la gente de Llandough comentando lo que pasa en los papeles y por el pueblo, desde antes de las escrituras hasta hoy.",
      of: "de", doors: "puertas abiertas", runtime: "duración prevista", subs: "Subtítulos", on: "sí", off: "no", audio: "Audio", menu: "Producción",
      prompt: "Indicaciones de producción", prompt_note: "Las indicaciones del productor guían la película. La tarea diaria las lee primero, cada día, antes de trabajar en la siguiente puerta.",
      edit: "Editar las indicaciones", acts: "Actos", how: "Cómo se hace", how_note: "Cada hecho fechado de la cronología está detrás de una sola puerta, con sus números de prueba. Las mismas caras, voces, edificios y paisajes se usan en todas las escenas. Lo que una escena deja fuera se anota y se retoma en una escena posterior.",
      frame: "Cuadro", act: "Acto", script: "Guion", subtitles: "Subtítulos", next: "Próxima puerta", soon: "Guion en preparación: el resumen de arriba es el plan.", subsoon: "Los subtítulos llegan con el guion.",
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
  function render() {
    var F = S.frames; if (!F) return; var grid = $("cm-grid"); grid.textContent = ""; var fm = filledMap(); var open = 0, nextN = null;
    F.items.forEach(function (f) { if (fm[f.n]) open++; else if (nextN === null) nextN = f.n; });
    $("cm-open").textContent = open; $("cm-total").textContent = F.items.length; $("cm-runtime").textContent = F.estimated_runtime || "";
    var acts = $("cm-acts"); acts.textContent = ""; var lastAct = null, L = lang();
    F.items.forEach(function (f, i) {
      if (f.act.n !== lastAct) { lastAct = f.act.n; var h = el("h2", "cm-actsep", t("act") + " " + f.act.n + " · " + (f.act[L] || f.act.en)); h.id = "cm-act-" + f.act.n;
        var frs = F.items.filter(function (x) { return x.act.n === f.act.n; }); h.appendChild(el("small", "", t("frame") + " " + frs[0].n + "–" + frs[frs.length - 1].n + " · " + frs[0].date_from + " → " + frs[frs.length - 1].date_to)); grid.appendChild(h);
        var li = el("li"); var b = el("button", "", (f.act[L] || f.act.en)); b.type = "button"; b.onclick = (function (id) { return function () { closeDrawer(); var x = $(id); if (x) x.scrollIntoView({behavior: "smooth"}); }; })(h.id); li.appendChild(b); acts.appendChild(li); }
      var m = fm[f.n], card = el("article", "cm-card" + (m ? " open" : "") + (f.n === nextN ? " next" : "")); card.id = "frame-" + f.n;
      var door = el("button", "cm-door"); door.type = "button"; door.setAttribute("data-ghf-keep", ""); door.style.setProperty("--c", COL[i % COL.length]); door.setAttribute("aria-label", t("frame") + " " + f.n + (m ? " · " + t("play") : ""));
      if (m && m.poster) { var img = el("img", "cm-poster"); img.alt = ""; img.loading = "lazy"; img.src = RAW + m.poster; door.appendChild(img); }
      var l1 = el("span", "cm-leaf l"), l2 = el("span", "cm-leaf r"); l1.appendChild(el("i", "cm-knob")); l2.appendChild(el("i", "cm-knob")); door.appendChild(l1); door.appendChild(l2);
      door.appendChild(el("span", "cm-num", String(f.n)));
      if (m) { door.appendChild(el("span", "cm-play")); door.onclick = function () { play(f, m); }; } else door.disabled = true;
      if (f.n === nextN) door.appendChild(el("span", "cm-tag", t("next")));
      card.appendChild(door);
      var body = el("div", "cm-body");
      body.appendChild(el("div", "cm-meta", t("frame") + " " + ("00" + f.n).slice(-3) + " · " + f.date_range));
      body.appendChild(el("h3", "", f.title)); body.appendChild(el("p", "cm-log", f.logline));
      var d1 = el("details", "cm-d-script"); d1.appendChild(el("summary", "", t("script"))); d1.appendChild(el("ul", "cm-lines")); body.appendChild(d1);
      var d2 = el("details", "cm-d-subs"); d2.appendChild(el("summary", "", t("subtitles"))); d2.appendChild(el("ul", "cm-lines")); body.appendChild(d2);
      var d3 = el("details"); d3.appendChild(el("summary", "", t("events") + " · " + t("evidence")));
      d3.appendChild(el("p", "cm-ev", f.events.join(" · "))); if (f.evidence.length) d3.appendChild(el("p", "cm-ev", f.evidence.join(" · "))); body.appendChild(d3);
      if (m && m.left_out && m.left_out.length) { var d4 = el("details"); d4.appendChild(el("summary", "", t("left"))); d4.appendChild(el("p", "cm-ev", m.left_out.map(function (x) { return x.id || x; }).join(" · "))); body.appendChild(d4); }
      card.appendChild(body); grid.appendChild(card);
      var opened = false; [d1, d2].forEach(function (d) { d.addEventListener("toggle", function () { if (d.open && !opened) { opened = true; loadScript(f).then(function () { fillDetails(card, f); }); } else if (d.open) fillDetails(card, f); }); });
    });
  }
  function loadScript(f) { if (!f.script) return Promise.resolve(); if (S.scripts[f.id]) return Promise.resolve(); return get(f.script).then(function (s) { S.scripts[f.id] = s; }).catch(function () {}); }
  // player: the clip plays muted; the chosen language track plays beside it, kept in step
  var V = $("cm-video"), A = $("cm-audio"), cues = [], cur = null;
  function play(f, m) {
    cur = {f: f, m: m}; $("cm-p-title").textContent = t("frame") + " " + f.n + " · " + f.title; $("cm-p-meta").textContent = f.date_range + (m.seconds ? " · " + fmt(m.seconds) : "");
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
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { if (!$("cm-player").hidden) closePlayer(); closeDrawer(); } });
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
