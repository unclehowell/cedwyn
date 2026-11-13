/* Cedwyn documentary: script patch shim v1.0.0 (cedwyn-documentary#14). TEMPORARY.
   Until frames.json v5 is on the storage repository's main branch, this applies the reviewed tidy patch
   (patches/2026-11-12-chronology.json) and structure pass (folds/2026-11-12-structure.json) to the frame map
   in the browser, before the page reads it. It does nothing once frames.json is at version 5 or later, and
   hands the page the unpatched file on any error. Remove this file and its script line then. — Claude agent */
(function () {
  "use strict";
  if (!window.fetch || !window.Promise || !window.Response) return;
  var RAW = "https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Fraw.githubusercontent.com%2Funclehowell%2Fcedwyn-movie%2Fmain%2F";
  function applyPatch(F, P) {
    var items = F.items, by = {}; items.forEach(function (x) { by[x.id] = x; });
    Object.keys(P.set || {}).forEach(function (i) { var x = by[i], f = P.set[i]; if (!x) return;
      Object.keys(f).forEach(function (k) { if (k === "date") { x.date_from = x.date_to = x.date_range = f[k]; } else { x[k] = f[k]; } });
      if ("logline" in f && (typeof x.description === "string" || x.description == null)) x.description = f.logline; });
    Object.keys(P.i18n || {}).forEach(function (i) { var x = by[i]; if (!x) return; x.i18n = x.i18n || {};
      Object.keys(P.i18n[i]).forEach(function (l) { var t = x.i18n[l] = x.i18n[l] || {}, s = P.i18n[i][l]; Object.keys(s).forEach(function (k) { t[k] = s[k]; }); }); });
    (P.replace || []).forEach(function (r) { var x = by[r.id]; if (!x) return; var t = r.lang ? (x.i18n || {})[r.lang] : x; if (!t) return;
      t.logline = (t.logline || "").split(r.old).join(r.new);
      if (!r.lang && typeof x.description === "string") x.description = x.description.split(r.old).join(r.new); });
    (P.move || []).forEach(function (m) { var x = by[m.id]; if (!x || !by[m.after]) return; items.splice(items.indexOf(x), 1); items.splice(items.indexOf(by[m.after]) + 1, 0, x); });
    return F;
  }
  function applyFold(F, P) {
    var items = F.items, by = {}; items.forEach(function (x) { by[x.id] = x; });
    (P.add || []).forEach(function (a) { if (!by[a.scene.id] && by[a.after]) { items.splice(items.indexOf(by[a.after]) + 1, 0, a.scene); by[a.scene.id] = a.scene; } });
    var ap = P.appendix || {}, park = (ap.ids || []).slice();
    if (by[ap.from]) park = park.concat(items.slice(items.indexOf(by[ap.from])).map(function (x) { return x.id; }));
    park.forEach(function (i) { if (by[i]) { items.splice(items.indexOf(by[i]), 1); delete by[i]; } });
    Object.keys(P.fold || {}).forEach(function (t) { var T = by[t]; if (!T) return; P.fold[t].forEach(function (i) { var x = by[i]; if (!x) return;
      items.splice(items.indexOf(x), 1); delete by[i];
      (T.also = T.also || []).push({id: i, date: x.date_label || x.date_range, title: x.title, logline: x.logline});
      ["events", "evidence"].forEach(function (k) { T[k] = (T[k] || []).concat((x[k] || []).filter(function (e) { return (T[k] || []).indexOf(e) < 0; })); }); }); });
    var starts = {}; P.parts.forEach(function (p) { starts[p.start] = p; });
    F.acts = P.parts.map(function (p) { return {n: p.n, en: p.en, cy: p.cy, es: p.es}; }); var cur = F.acts[0];
    items.forEach(function (x, n) { x.n = n + 1; var s = starts[x.id]; if (s) cur = {n: s.n, en: s.en, cy: s.cy, es: s.es}; x.act = cur; });
    F.frames = items.length; F.version = P.meta.version;
    var m = items.length * (F.target_seconds_each || 120) / 60; F.estimated_runtime = Math.floor(m / 60) + " h " + ("0" + Math.round(m % 60)).slice(-2) + " min";
    return F;
  }
  var of = window.fetch.bind(window);
  function j(p) { return of(RAW + p + "?t=" + Math.floor(Date.now() / 600000)).then(function (r) { if (!r.ok) throw new Error(p); return r.json(); }); }
  window.fetch = function (u, o) {
    var s = typeof u === "string" ? u : (u && u.url) || "";
    if (s.indexOf(RAW + "frames.json") !== 0) return of(u, o);
    return of(u, o).then(function (r) {
      if (!r.ok) return r;
      return r.text().then(function (txt) {
        function plain() { return new Response(txt, {status: 200, headers: {"Content-Type": "application/json"}}); }
        try {
          var F = JSON.parse(txt);
          if (parseInt(F.version, 10) >= 5) return plain();
          return Promise.all([j("patches/2026-11-12-chronology.json"), j("folds/2026-11-12-structure.json")]).then(function (a) {
            return new Response(JSON.stringify(applyFold(applyPatch(F, a[0]), a[1])), {status: 200, headers: {"Content-Type": "application/json"}});
          }).catch(plain);
        } catch (e) { return plain(); }
      });
    });
  };
})();
