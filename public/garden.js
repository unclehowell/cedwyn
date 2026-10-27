/* Garden Gallery front end: layout only. Every word and every artwork comes from the Cedwyn catalogue database
   (table section_records, theme 'nft-art'), read in the browser through /_cedwyn/cat.js. */
(function () {
  var T = {}, A = [], $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fill(s, o) { return String(s || '').replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); }
  function words() { document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = T[el.getAttribute('data-t')] || ''; }); if (T.page_title) document.title = T.page_title; }
  function edition(a) { return a.edition === 1 ? T.one_of_one : fill(T.limited, { n: a.edition }); }
  /* Whole-release versions (Sion 05:13 GMT 27 Oct 2026): every piece starts at v0.0.1, which is free; no sales yet ("Coming soon"). - Sion's Tab agent */
  function ver(a) { return a.version || 'v0.0.1'; }
  function vers(a) { var v = a.versions && a.versions.length ? a.versions.slice() : [ver(a)]; return v.sort(function (x, y) { var p = x.match(/\d+/g).map(Number), q = y.match(/\d+/g).map(Number); for (var k = 0; k < 3; k++) if ((q[k] || 0) !== (p[k] || 0)) return (q[k] || 0) - (p[k] || 0); return 0; }); }
  function sub(a) { return esc(a.id) + ' · ' + esc(ver(a)); }
  function slug(a) { return (a.id + '-' + String(a.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')).slice(0, 80); }
  function savePng(a, btn) {
    var im = new Image(); im.crossOrigin = 'anonymous';
    var old = btn.textContent; btn.textContent = 'Saving…'; btn.disabled = true;
    im.onload = function () {
      var c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0);
      c.toBlob(function (b) {
        btn.textContent = old; btn.disabled = false; if (!b) return;
        var u = URL.createObjectURL(b), l = document.createElement('a'); l.href = u; l.download = slug(a) + '-' + ver(a) + '.png';
        document.body.appendChild(l); l.click(); l.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 60000);
      }, 'image/png');
    };
    im.onerror = function () { btn.textContent = old; btn.disabled = false; window.open(a.image, '_blank'); };
    im.src = a.image;
  }
  function card(a, i) {
    return '<a class="gg-c" style="animation-delay:' + (Math.min(i, 12) * 70) + 'ms" href="#/' + esc(a.id) + '"><img loading="lazy" src="' + esc(a.thumb) + '" alt="' + esc(a.alt) + '"><span class="gg-ct"><b>' + esc(a.title) + '</b><small>' + sub(a) + '</small></span></a>';
  }
  function grid() { $('gg-grid').innerHTML = A.map(card).join(''); }
  function detail(id) {
    var i = A.findIndex(function (a) { return a.id === id; }), a = A[i], d = $('gg-d');
    if (!a) { show(false); return; }
    var prev = A[(i + A.length - 1) % A.length], next = A[(i + 1) % A.length];
    d.innerHTML = '<a class="gg-back" href="#/">← ' + esc(T.back) + '</a>' +
      '<figure><img src="' + esc(a.image) + '" alt="' + esc(a.alt) + '"></figure>' +
      '<h2>' + esc(a.title) + '</h2><p class="gg-cap">' + esc(a.caption) + '</p>' +
      '<dl class="gg-meta"><dt>' + esc(T.catalogue_label) + '</dt><dd>' + esc(a.id) + '</dd>' +
      (a.edition ? '<dt>' + esc(T.edition_label) + '</dt><dd>' + esc(edition(a)) + '</dd>' : '') +
      '<dt>' + esc(T.medium_label) + '</dt><dd>' + esc(T.medium) + '</dd>' +
      (a.source_id ? '<dt>' + esc(T.source_label) + '</dt><dd>' + esc(a.source_id) + '</dd>' : '') + '</dl>' +
      (a.src ? '<div class="gg-src"><img loading="lazy" src="' + esc(a.src) + '" alt=""><span>' + esc(T.grown_from) + ' ' + esc(a.source_title) + '</span></div>' : '') +
      '<div class="gg-buy gg-sv"><label class="gg-svl" for="gg-sv">' + esc(T.version_label || 'Version') + '</label>' +
      '<select class="gg-sel" id="gg-sv" autocomplete="off">' + vers(a).map(function (v, k) { return '<option value="' + esc(v) + '"' + (k ? '' : ' selected') + '>' + esc(v) + (v === 'v0.0.1' ? ' · free' : '') + (k ? '' : ' · latest') + '</option>'; }).join('') + '</select>' +
      '<div class="gg-acts"><button type="button" class="gg-btn gg-soon" disabled aria-disabled="true">' + esc(T.coming_soon || 'Coming soon') + '</button>' +
      '<button type="button" class="gg-btn gg-png">' + esc(T.save_png || 'Save as PNG') + '</button></div>' +
      '<a class="gg-free" href="' + esc(a.image) + '" data-png="1">free version (v0.0.1 2026)</a></div>' +
      '<nav class="gg-nav"><a href="#/' + esc(prev.id) + '">← ' + esc(prev.title) + '</a><a href="#/' + esc(next.id) + '">' + esc(next.title) + ' →</a></nav>';
    var pb = d.querySelector('.gg-png'), fl = d.querySelector('.gg-free');
    if (pb) pb.addEventListener('click', function () { savePng(a, pb); });
    if (fl) fl.addEventListener('click', function (ev) { if (ev.button || ev.metaKey || ev.ctrlKey) return; ev.preventDefault(); savePng(a, pb || fl); });
    show(true); window.scrollTo(0, 0);
    document.title = a.title + ' · ' + (T.title || '');
  }
  function show(det) { $('gg-grid').hidden = det; $('gg-d').hidden = !det; document.querySelector('.gg-h').hidden = det; if (!det) words(); }
  function route() { var h = location.hash.replace(/^#\/?/, ''); if (h) detail(decodeURIComponent(h)); else show(false); }
  Cedwyn.db().then(function (db) { return db.query("SELECT kind, id, data FROM section_records WHERE theme='nft-art' ORDER BY seq"); })
    .then(function (rows) {
      rows.forEach(function (r) { var x = {}; try { x = JSON.parse(r.data); } catch (e) {} if (r.kind === 'words') T = x; else if (r.kind === 'artwork') { x.id = r.id; A.push(x); } });
      $('gg-wait').hidden = true; words(); grid(); route();
      window.addEventListener('hashchange', route);
    }).catch(function () { $('gg-wait').hidden = false; });
})();
