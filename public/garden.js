/* The Garden (/garden/): Garden City Cymru's whole shop, read from the Cedwyn catalogue database (section_records, theme 'garden'),
   which sync.py fills from Garden City's public catalogue. Every product, price, stock state and word comes from there.
   This page takes no payment and holds no stock: Buy and Checkout open Garden City's own basket on gardencity.cymru. */
(function () {
  var W = {}, M = {}, P = [], VAR = {}, $ = function (id) { return document.getElementById(id); };
  var KEY = 'cedwyn_garden_basket', bask = {}, filt = 'all', q = '';
  try { bask = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { bask = {}; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function lang() { var l = (document.documentElement.getAttribute('lang') || 'cy').slice(0, 2).toLowerCase(); return W[l] ? l : 'cy'; }
  function t(k) { var w = W[lang()] || W.cy || {}; return w[k] != null ? w[k] : ((W.en || {})[k] || ''); }
  function gbp(n) { return '£' + Number(n).toFixed(2); }
  function src(p, w) { return p ? M.cdn + p + (p.indexOf('?') < 0 ? '?' : '&') + 'width=' + w : ''; }
  var UTM = 'utm_source=cedwyn&utm_medium=referral&utm_campaign=garden';
  function buyUrl(vid, n) { return M.buy + '?id=' + encodeURIComponent(vid) + '&quantity=' + (n || 1) + '&' + UTM; }
  function basketUrl() {
    var parts = Object.keys(bask).filter(function (v) { return bask[v] > 0 && VAR[v]; }).map(function (v) { return 'items[][id]=' + encodeURIComponent(v) + '&items[][quantity]=' + bask[v]; });
    return parts.length ? M.buy + '?' + parts.join('&') + '&' + UTM : '';
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bask)); } catch (e) {} bar(); }
  function firstAvail(p) { for (var i = 0; i < p.v.length; i++) if (p.v[i][3]) return p.v[i]; return p.v[0]; }
  function priceLine(p) { return (p.lo !== p.hi ? t('from') + ' ' : '') + gbp(p.lo); }
  function intro() {
    var sec = lang() === 'es' ? 'es' : 'en';
    $('gc-intro').innerHTML = (W.cy.intro || []).map(function (s) { return '<p class="cy" lang="cy">' + esc(s) + '</p>'; }).join('') +
      '<p class="en" lang="' + sec + '">' + esc((W[sec].intro || []).join(' ')) + '</p>';
  }
  function words() {
    document.querySelectorAll('[data-w]').forEach(function (el) { el.textContent = t(el.getAttribute('data-w')); });
    document.title = t('page_title'); intro(); filters(); grid(); bar();
    $('gc-note').innerHTML = esc(t('note').replace('{date}', M.updated || '')) + ' <a href="' + esc(M.shop_url) + '/" target="_blank" rel="noopener">gardencity.cymru</a>';
  }
  function filters() {
    var groups = ['all'].concat(['plants', 'home', 'art', 'wear', 'gifts'].filter(function (g) { return P.some(function (p) { return p.g === g; }); }));
    $('gc-f').innerHTML = groups.map(function (g) { return '<button type="button" class="gc-chip" data-g="' + g + '" aria-pressed="' + (g === filt) + '">' + esc(t(g)) + '</button>'; }).join('') +
      '<input class="gc-q" id="gc-q" type="search" placeholder="' + esc(t('search')) + '" aria-label="' + esc(t('search')) + '" value="' + esc(q) + '">';
    $('gc-q').addEventListener('input', function (e) { q = e.target.value; grid(); });
  }
  function shown() {
    var s = q.trim().toLowerCase();
    return P.filter(function (p) { return (filt === 'all' || p.g === filt) && (!s || p.t.toLowerCase().indexOf(s) >= 0); });
  }
  function card(p) {
    var v = firstAvail(p), many = p.v.length > 1, out = !p.a;
    var buy = (!many && !out) ? '<a class="gc-btn pri" href="' + esc(buyUrl(v[0], 1)) + '" target="_blank" rel="noopener">' + esc(t('buy')) + '</a>'
      : '<button type="button" class="gc-btn pri" data-open="' + esc(p.h) + '"' + (out ? ' disabled' : '') + '>' + esc(t('buy')) + '</button>';
    return '<article class="gc-c"><button type="button" class="gc-ci" data-open="' + esc(p.h) + '" aria-label="' + esc(p.t) + '">' +
      (p.im[0] ? '<img loading="lazy" decoding="async" src="' + esc(src(p.im[0], 360)) + '" srcset="' + esc(src(p.im[0], 360)) + ' 360w, ' + esc(src(p.im[0], 600)) + ' 600w" sizes="(min-width:760px) 280px, 48vw" alt="">' : '') + '</button>' +
      '<div class="gc-cb"><button type="button" class="gc-ct" data-open="' + esc(p.h) + '">' + esc(p.t) + '</button>' +
      '<div class="gc-p"><small>' + esc(t('price')) + '</small>' + esc(priceLine(p)) + '</div>' +
      '<div class="gc-s' + (out ? ' out' : '') + '">' + esc(out ? t('sold_out') : t('in_stock')) + '</div>' +
      '<div class="gc-act"><button type="button" class="gc-btn" data-add="' + esc(p.h) + '"' + (out ? ' disabled' : '') + '>' + esc(t('add')) + '</button>' + buy + '</div></div></article>';
  }
  function grid() {
    var list = shown();
    $('gc-grid').innerHTML = list.length ? list.map(card).join('') : '<p class="gc-wait">' + esc(t('none')) + '</p>';
    $('gc-count').textContent = t('count').replace('{n}', list.length);
  }
  function add(vid, n) { bask[vid] = Math.min(99, (bask[vid] || 0) + (n || 1)); save(); var b = $('gc-bar'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); }
  function total() { var n = 0, s = 0; Object.keys(bask).forEach(function (v) { var x = VAR[v]; if (x && bask[v] > 0) { n += bask[v]; s += bask[v] * Number(x.v[2]); } }); return { n: n, s: s }; }
  function bar() { var tt = total(); $('gc-bar').hidden = !tt.n; $('gc-bar-n').textContent = tt.n + ' ' + t('items'); $('gc-bar-t').textContent = gbp(tt.s); }
  function open(d) { if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute('open', ''); }
  function shut(d) { if (d.close) d.close(); else d.removeAttribute('open'); }
  function sheet(h) {
    var p = P.filter(function (x) { return x.h === h; })[0]; if (!p) return;
    var d = $('gc-sheet'), v = firstAvail(p), n = 1;
    var opts = p.v.length > 1 ? '<div class="gc-row"><select class="gc-sel" id="gc-v" aria-label="' + esc(t('option')) + '">' + p.v.map(function (x) {
      return '<option value="' + x[0] + '"' + (x[0] === v[0] ? ' selected' : '') + (x[3] ? '' : ' disabled') + '>' + esc(x[1]) + ' · ' + gbp(x[2]) + (x[3] ? '' : ' · ' + esc(t('sold_out'))) + '</option>'; }).join('') + '</select></div>' : '';
    d.innerHTML = '<div class="gc-sx"><b>' + esc(p.t) + '</b><button type="button" class="gc-x" data-shut>' + esc(t('close')) + '</button></div>' +
      '<div class="gc-gal">' + p.im.map(function (im) { return '<img loading="lazy" src="' + esc(src(im, 720)) + '" alt="">'; }).join('') + '</div>' +
      '<div class="gc-sb"><div class="gc-p"><small>' + esc(t('price')) + '</small><span id="gc-pr"></span></div><div class="gc-s" id="gc-st"></div>' + opts +
      '<div class="gc-row"><span>' + esc(t('qty')) + '</span><span class="gc-qty"><button type="button" data-q="-1" aria-label="-">−</button><span id="gc-n">1</span><button type="button" data-q="1" aria-label="+">+</button></span></div>' +
      '<div class="gc-act"><button type="button" class="gc-btn" id="gc-add">' + esc(t('add')) + '</button><a class="gc-btn pri" id="gc-buy" target="_blank" rel="noopener">' + esc(t('buy')) + '</a></div>' +
      (p.d ? '<p class="gc-d">' + esc(p.d) + '</p>' : '') +
      '<a class="gc-link" href="' + esc(M.product_path + p.h) + '" target="_blank" rel="noopener">' + esc(t('view')) + ' →</a></div>';
    function cur() { var sel = $('gc-v'); var id = sel ? Number(sel.value) : v[0]; return p.v.filter(function (x) { return x[0] === id; })[0] || v; }
    function upd() {
      var x = cur(); $('gc-pr').textContent = gbp(x[2]); $('gc-n').textContent = n;
      var st = $('gc-st'); st.textContent = x[3] ? t('in_stock') : t('sold_out'); st.className = 'gc-s' + (x[3] ? '' : ' out');
      var b = $('gc-buy'); if (x[3]) { b.href = buyUrl(x[0], n); b.removeAttribute('aria-disabled'); } else { b.removeAttribute('href'); b.setAttribute('aria-disabled', 'true'); }
      $('gc-add').disabled = !x[3];
    }
    d.onclick = function (e) {
      if (e.target === d || e.target.hasAttribute('data-shut')) return shut(d);
      var dq = e.target.getAttribute('data-q'); if (dq) { n = Math.max(1, Math.min(99, n + Number(dq))); upd(); }
      if (e.target.id === 'gc-add') { add(String(cur()[0]), n); shut(d); }
    };
    if ($('gc-v')) $('gc-v').onchange = upd;
    upd(); open(d); d.scrollTop = 0;
  }
  function basket() {
    var d = $('gc-bask'), ids = Object.keys(bask).filter(function (v) { return bask[v] > 0 && VAR[v]; }), tt = total(), url = basketUrl();
    d.innerHTML = '<div class="gc-sx"><b>' + esc(t('basket')) + '</b><button type="button" class="gc-x" data-shut>' + esc(t('close')) + '</button></div><div class="gc-sb">' +
      (ids.length ? ids.map(function (v) { var x = VAR[v], p = x.p; return '<div class="gc-li">' + (p.im[0] ? '<img src="' + esc(src(p.im[0], 120)) + '" alt="">' : '') +
        '<div class="t">' + esc(p.t) + (x.v[1] ? '<small>' + esc(x.v[1]) + '</small>' : '') + '<small>' + gbp(x.v[2]) + '</small></div>' +
        '<span class="gc-qty"><button type="button" data-b="' + v + '" data-d="-1" aria-label="-">−</button><span>' + bask[v] + '</span><button type="button" data-b="' + v + '" data-d="1" aria-label="+">+</button></span></div>'; }).join('') +
        '<div class="gc-tot"><span>' + esc(t('total')) + '</span><b>' + gbp(tt.s) + '</b></div>' +
        '<div class="gc-act"><button type="button" class="gc-btn" data-clear>' + esc(t('clear')) + '</button><a class="gc-btn pri" id="gc-go" href="' + esc(url) + '" target="_blank" rel="noopener">' + esc(t('checkout')) + '</a></div>' +
        '<p class="gc-note">' + esc(t('note').replace('{date}', M.updated || '')) + '</p>'
        : '<p>' + esc(t('empty')) + '</p>') + '</div>';
    d.onclick = function (e) {
      if (e.target === d || e.target.hasAttribute('data-shut')) return shut(d);
      var b = e.target.getAttribute('data-b'); if (b) { bask[b] = Math.max(0, Math.min(99, (bask[b] || 0) + Number(e.target.getAttribute('data-d')))); if (!bask[b]) delete bask[b]; save(); basket(); return; }
      if (e.target.hasAttribute('data-clear')) { bask = {}; save(); shut(d); }
    };
    open(d);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-open],[data-add],[data-g]') : null; if (!el) return;
    if (el.hasAttribute('data-g')) { filt = el.getAttribute('data-g'); filters(); grid(); return; }
    var h = el.getAttribute('data-open') || el.getAttribute('data-add'), p = P.filter(function (x) { return x.h === h; })[0]; if (!p) return;
    if (el.hasAttribute('data-add') && p.v.length === 1 && p.a) { add(String(p.v[0][0]), 1); return; }
    sheet(h);
  });
  $('gc-bar').addEventListener('click', basket);
  document.addEventListener('ghf-lang-change', function () { if (P.length) words(); });
  Cedwyn.db().then(function (db) { return db.query("SELECT kind, id, data FROM section_records WHERE theme='garden' ORDER BY seq"); })
    .then(function (rows) {
      rows.forEach(function (r) { var x = {}; try { x = JSON.parse(r.data); } catch (e) {}
        if (r.kind === 'meta') M = x; else if (r.kind === 'words') W[r.id] = x; else if (r.kind === 'product') P.push(x); });
      P.forEach(function (p) { p.v.forEach(function (v) { VAR[v[0]] = { p: p, v: v }; }); });
      Object.keys(bask).forEach(function (v) { if (!VAR[v]) delete bask[v]; });
      words();
      var dl = /^#p=([^&]+)$/.exec(location.hash || '');   // 2 Nov 2026: /garden/#p=<handle> opens that product (links from the Garden banner on every webapp)
      if (dl) { try { sheet(decodeURIComponent(dl[1])); } catch (e) {} }
    }).catch(function () { $('gc-grid').innerHTML = '<p class="gc-wait"><a href="https://gardencity.cymru/" target="_blank" rel="noopener">gardencity.cymru</a></p>'; });
})();
