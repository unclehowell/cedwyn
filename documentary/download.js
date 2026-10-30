/* Cedwyn · documentary — download button (download.js v1.0.4, 30 Oct 2026 (1.0.4: the button names the version selected in the scene's "Select a version" dropdown in the site-wide labels (v0.0.2, v0.0.1, -v0.0.1 …), never the storage range such as 0.0.1-0.0.5; a paid cut downloads through the site's access service with the access code; 1.0.3: the button names the scene version it will download (the hashtag chip selected under the scene, movie.js 1.5.0), beside the audio and subtitle choice; 1.0.2: for a scene with per-language lip-synced video, the file offered is made from that language's video — the pipeline builds each audio language's versions from its own video, (their entries carry from_video); until those exist, a choice with subtitles off offers that language's video file itself (it carries that language's audio); 1.0.1: the button sits in the controls, under the audio and subtitle choices, so the site header never covers it)). A tab.bot production.
   Ten seconds into a scene a Download button fades in under the audio and subtitle choices. It downloads that scene with exactly the
   audio language and subtitle choice selected at the moment it is tapped (burned-in subtitles, or none), as an MP4
   that plays on any phone or computer. The versions are made by the film pipeline (tools/download_variants.py) and
   listed per scene in the storage manifest as "downloads": {"<audio>|<subs>": {path, bytes, title}}.
   Reads the player through window.CedwynPlayer (movie.js 1.4.2+). */
(function () {
  "use strict";
  var P = window.CedwynPlayer; if (!P || !P.video) return;
  var V = P.video, AT = 10, shownFor = null, busy = false;
  var T = {
    en: {dl: "Download", wait: "Downloading", nos: "No subtitles", subs: {cy: "Welsh subtitles", en: "English subtitles", es: "Spanish subtitles"}, na: "Not available for this choice yet", fail: "Download failed, opening the file"},
    cy: {dl: "Lawrlwytho", wait: "Yn lawrlwytho", nos: "Dim isdeitlau", subs: {cy: "Isdeitlau Cymraeg", en: "Isdeitlau Saesneg", es: "Isdeitlau Sbaeneg"}, na: "Ddim ar gael i'r dewis hwn eto", fail: "Methodd, yn agor y ffeil"},
    es: {dl: "Descargar", wait: "Descargando", nos: "Sin subtítulos", subs: {cy: "Subtítulos en galés", en: "Subtítulos en inglés", es: "Subtítulos en español"}, na: "Aún no disponible para esta opción", fail: "Falló la descarga, abriendo el archivo"}
  };
  var NAT = {cy: "Cymraeg", en: "English", es: "Español"};
  function L() { var l = (document.documentElement.getAttribute("lang") || "en").slice(0, 2).toLowerCase(); return T[l] ? l : "en"; }
  function tt() { return T[L()]; }
  var st = document.createElement("style");
  var ICO = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M11 3h2v10.2l3.6-3.6 1.4 1.4-6 6-6-6 1.4-1.4 3.6 3.6z M4 19h16v2H4z'/%3E%3C/svg%3E\") center/contain no-repeat";
  st.textContent = ".cm-dl-row{display:none}.cm-dl-row.is-on{display:flex;animation:cmdlin .45s ease both}" +
    "@keyframes cmdlin{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}" +
    ".cm-dl{display:inline-flex;align-items:center;gap:8px;min-height:44px;min-width:44px;max-width:100%;padding:6px 14px 6px 12px;font-weight:600;text-align:left;cursor:pointer;box-sizing:border-box}" +
    ".cm-dl::before{content:'';flex:0 0 18px;width:18px;height:18px;background:currentColor;-webkit-mask:" + ICO + ";mask:" + ICO + "}" +
    ".cm-dl small{font-weight:400;font-size:.86em;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}" +
    ".cm-dl.is-busy{cursor:progress}@media (prefers-reduced-motion:reduce){.cm-dl-row.is-on{animation:none}}";
  document.head.appendChild(st);
  var ROW = document.createElement("div"); ROW.className = "cm-pc-row cm-dl-row";
  var B = document.createElement("button"); B.type = "button"; B.className = "cm-btn cm-pc-o cm-dl"; B.id = "cm-dl"; ROW.appendChild(B);
  var b1 = document.createElement("span"), b2 = document.createElement("small"); B.appendChild(b1); B.appendChild(b2);
  var host = document.querySelector("#cm-stage .cm-pc") || V.parentNode; host.appendChild(ROW);   // under the audio and subtitle choices it follows
  function cur() { return P.current && P.current(); }
  function choice() {
    var c = cur(), m = c && c.m; if (!m) return null;
    var a = P.audio ? P.audio() : null; if (!a || !(m.audio && m.audio[a])) a = m.default_audio || "cy";
    var s = P.sub ? P.sub() : "off"; if (s !== "off" && !NAT[s]) s = "off";
    var d = m.downloads || null, e = d && d[a + "|" + s];
    var lv = m.video && m.video[a];   // 1.0.2: per-language lip-synced video
    if (lv && s === "off" && !(e && e.from_video)) e = {path: lv, ext: (String(lv).match(/\.(\w+)$/) || [0, "webm"])[1], title: "Cedwyn – Door " + (c.f && c.f.n) + " – " + NAT[a] + " audio – No subtitles"};
    return {n: c.f && c.f.n, a: a, s: s, e: e, title: (e && e.title) || ("Cedwyn – Door " + (c.f && c.f.n) + " – " + NAT[a] + " audio – " + (s === "off" ? "No subtitles" : T.en.subs[s]))};
  }
  function paint() {
    if (busy) return; var c = choice(), x = tt(); if (!c) return;
    var cm = cur() && cur().m, vv = cm ? (cm.cut || cm.version || "") : "", DG = window.CedwynDoc, vl = "";
    if (c.n && DG && DG.chosen && DG.vlabel) { try { vl = DG.vlabel(c.n, DG.chosen(c.n)); } catch (e) { vl = ""; } }   // 1.0.4: the version selected in the scene's dropdown (v0.0.2, v0.0.1, -v0.0.1 …)
    if (!vl && vv && !/-/.test(String(vv))) vl = "v" + vv;
    b1.textContent = x.dl; b2.textContent = (vl ? vl + " · " : "") + NAT[c.a] + " · " + (c.s === "off" ? x.nos : x.subs[c.s]);
    B.setAttribute("aria-label", x.dl + ": " + b2.textContent); B.title = c.e ? c.title : x.na;
  }
  function show(on) { ROW.classList.toggle("is-on", on); }
  function hasAny() { var c = cur(); return !!(c && c.m && (c.m.downloads || c.m.video)); }
  V.addEventListener("timeupdate", function () {
    var c = cur(); if (!c) return; var id = c.f && c.f.n;
    if (shownFor !== id && hasAny() && (V.currentTime || 0) >= AT) { shownFor = id; paint(); show(true); }
  });
  V.addEventListener("loadstart", function () { shownFor = null; busy = false; B.classList.remove("is-busy"); show(false); });
  document.addEventListener("click", function (ev) { var t = ev.target && ev.target.closest && ev.target.closest(".cm-pa,.cm-ps"); if (t) setTimeout(paint, 0); }, true);
  V.addEventListener("webkitendfullscreen", function () { setTimeout(paint, 0); });
  function save(blob, name) {
    var u = URL.createObjectURL(blob), a = document.createElement("a"); a.href = u; a.download = name; a.rel = "noopener";
    document.body.appendChild(a); a.click(); setTimeout(function () { a.remove(); URL.revokeObjectURL(u); }, 60000);
  }
  B.addEventListener("click", function (ev) {
    ev.stopPropagation(); if (busy) return; var c = choice(), x = tt(); if (!c) return;
    if (!c.e) { b2.textContent = x.na; setTimeout(paint, 2500); return; }
    var ext = c.e.ext || "mp4", url = P.src ? P.src(c.e.path) : P.raw + c.e.path, name = c.title + "." + ext; busy = true; B.classList.add("is-busy"); b1.textContent = x.wait + "…";
    window.CedwynDownloadLast = {key: c.a + "|" + c.s, path: c.e.path, name: name, at: Date.now()};
    fetch(url, {mode: "cors"}).then(function (r) {
      if (!r.ok) throw new Error("http " + r.status);
      var total = +r.headers.get("content-length") || c.e.bytes || 0;
      if (!r.body || !window.ReadableStream) return r.blob();
      var rd = r.body.getReader(), parts = [], got = 0;
      return (function pump() { return rd.read().then(function (o) {
        if (o.done) return new Blob(parts, {type: "video/" + ext});
        parts.push(o.value); got += o.value.length; if (total) b1.textContent = x.wait + " " + Math.min(99, Math.round(got * 100 / total)) + "%";
        return pump(); }); })();
    }).then(function (blob) {
      save(blob.type ? blob : new Blob([blob], {type: "video/" + ext}), name);
      window.CedwynDownloadLast.bytes = blob.size; window.CedwynDownloadLast.done = true;
    }).catch(function () { b2.textContent = x.fail; window.open(url, "_blank", "noopener"); })
      .then(function () { busy = false; B.classList.remove("is-busy"); setTimeout(paint, 1200); });
  });
  window.CedwynDownload = {choice: choice, button: B, version: "1.0.3"};
})();
