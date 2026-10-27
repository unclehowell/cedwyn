/* Garden Gallery front end: layout only. Every word and every artwork comes from the Cedwyn catalogue database
   (table section_records, theme 'nft-art'), read in the browser through /_cedwyn/cat.js. */
(function () {
  var T = {}, A = [], $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fill(s, o) { return String(s || '').replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); }
  function words() { document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = T[el.getAttribute('data-t')] || ''; }); if (T.page_title) document.title = T.page_title; }
  function edition(a) { return a.edition === 1 ? T.one_of_one : fill(T.limited, { n: a.edition }); }
  function card(a, i) {
    return '<a class="gg-c" style="animation-delay:' + (i * 70) + 'ms" href="#/' + esc(a.id) + '"><img loading="lazy" src="' + esc(a.thumb) + '" alt="' + esc(a.alt) + '"><span class="gg-ct"><b>' + esc(a.title) + '</b><small>' + esc(a.price) + ' · ' + esc(edition(a)) + '</small></span></a>';
  }
  function grid() { $('gg-grid').innerHTML = A.map(card).join(''); }
  function detail(id) {
    var i = A.findIndex(function (a) { return a.id === id; }), a = A[i], d = $('gg-d');
    if (!a) { show(false); return; }
    var prev = A[(i + A.length - 1) % A.length], next = A[(i + 1) % A.length];
    d.innerHTML = '<a class="gg-back" href="#/">← ' + esc(T.back) + '</a>' +
      '<figure><img src="' + esc(a.image) + '" alt="' + esc(a.alt) + '"></figure>' +
      '<h2>' + esc(a.title) + '</h2><p class="gg-cap">' + esc(a.caption) + '</p>' +
      '<dl class="gg-meta"><dt>' + esc(T.catalogue_label) + '</dt><dd>' + esc(a.id) + '</dd><dt>' + esc(T.edition_label) + '</dt><dd>' + esc(edition(a)) + '</dd>' +
      '<dt>' + esc(T.medium_label) + '</dt><dd>' + esc(T.medium) + '</dd><dt>' + esc(T.source_label) + '</dt><dd>' + esc(a.source_id) + '</dd></dl>' +
      '<div class="gg-src"><img loading="lazy" src="' + esc(a.src) + '" alt=""><span>' + esc(T.grown_from) + ' ' + esc(a.source_title) + '</span></div>' +
      '<div class="gg-buy"><span class="gg-price">' + esc(a.price) + '</span>' +
      (a.buy ? '<a class="gg-btn" rel="nofollow" href="/wayback/go/?u=' + encodeURIComponent(a.buy) + '">' + esc(T.buy) + '</a>' : '<a class="gg-btn" href="/shop/">' + esc(T.shop) + '</a>') +
      '<p class="gg-inc">' + esc(T.includes) + '</p></div>' +
      '<nav class="gg-nav"><a href="#/' + esc(prev.id) + '">← ' + esc(prev.title) + '</a><a href="#/' + esc(next.id) + '">' + esc(next.title) + ' →</a></nav>';
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
