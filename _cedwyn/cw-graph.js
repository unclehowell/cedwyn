/* cw-graph.js v1.0.0 - graph promo banner, full-screen scatter modal and 100vh "Read more" clip for every Cedwyn page.
   Asked for 01:27 GMT 30 Oct 2026: the closable header strip becomes a graph promotion; tapping it slides a full-screen
   scatter graph of the data the page/section shows down over the page (it slides back up on close, Esc or swipe up);
   text pages load clipped to the screen height with a "Read more" bar, further text arriving in chunks from the build's
   per-page JSON (/<page>/_more/N.json) on demand. Data: /_cedwyn/graph/<area>.json (built by tools/graph_data.py) or,
   when a section has none, the page's own items and dated text. No outside services, no libraries. - Cedwyn editors */
(function () {
  'use strict';
  if (window.__cwGraph) return;
  var d = document, de = d.documentElement, VER = '1.0.0';
  window.__cwGraph = { v: VER };
  var RM = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var T = {
    en: { promo: 'See this section as a graph', cta: 'Graph', close: 'Close', closeg: 'Close the graph', more: 'Read more', page: 'This page', sec: 'Whole section', open: 'Open', none: 'Nothing on this page has dates or values to plot yet.', pts: 'points', tap: 'Tap a dot to see what it is.', rank: 'dates spaced evenly in date order', loading: 'Loading…' },
    cy: { promo: 'Gweld yr adran hon fel graff', cta: 'Graff', close: 'Cau', closeg: 'Cau’r graff', more: 'Darllen mwy', page: 'Y dudalen hon', sec: 'Yr adran gyfan', open: 'Agor', none: 'Does dim dyddiadau na gwerthoedd i’w plotio ar y dudalen hon eto.', pts: 'pwynt', tap: 'Tapiwch ddot i weld beth ydyw.', rank: 'dyddiadau wedi’u gosod yn gyfartal yn ôl trefn', loading: 'Wrthi’n llwytho…' },
    es: { promo: 'Ver esta sección como gráfico', cta: 'Gráfico', close: 'Cerrar', closeg: 'Cerrar el gráfico', more: 'Leer más', page: 'Esta página', sec: 'Toda la sección', open: 'Abrir', none: 'Esta página aún no tiene fechas ni valores para graficar.', pts: 'puntos', tap: 'Toca un punto para ver qué es.', rank: 'fechas espaciadas por orden', loading: 'Cargando…' }
  };
  function lg() { var l = (de.getAttribute('lang') || 'en').slice(0, 2).toLowerCase(); return T[l] ? l : 'en'; }
  function t(k) { return T[lg()][k]; }
  function mk(tag, cls, txt) { var e = d.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function night() {
    var m = de.getAttribute('data-ghf-mode');
    if (m === 'night' || de.getAttribute('data-ghf-native') === 'dark') return true;
    if (m === 'day') return false;
    return !!(window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
  }
  var segs = location.pathname.split('/').filter(Boolean), half = '';
  if (segs[0] === 'wales' || segs[0] === 'argentina') half = segs.shift();
  var AREA = (segs[0] || (half || 'home')).toLowerCase().replace(/[^a-z0-9-]/g, '');
  var CSS =
    '.cw-gb{display:flex;align-items:stretch;width:100%;height:34px;min-width:0}' +
    '.cw-gb-open{all:unset;box-sizing:border-box;flex:1 1 auto;min-width:0;display:flex;align-items:center;gap:9px;height:34px;padding:0 4px 0 2px;color:inherit;cursor:pointer;font:13px/1 system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.02em;-webkit-tap-highlight-color:transparent}' +
    '.cw-gb-open svg{flex:0 0 auto;display:block}.cw-gb-t{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
    '.cw-gb-c{flex:0 0 auto;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--ghf-s,#f2c94c);white-space:nowrap}' +
    '.cw-gb-x{all:unset;box-sizing:border-box;flex:0 0 auto;width:44px;height:34px;margin-right:-10px;display:flex;align-items:center;justify-content:center;color:inherit;opacity:.75;cursor:pointer;font:20px/1 system-ui,sans-serif}' +
    '.cw-gb-open:focus-visible,.cw-gb-x:focus-visible{outline:2px solid var(--ghf-s,#f2c94c);outline-offset:-2px}' +
    '.cw-gm{position:fixed;inset:0;z-index:2147483000;display:flex;flex-direction:column;background:var(--gm-bg);color:var(--gm-fg);transform:translateY(-102%);transition:transform .25s ease-out;visibility:hidden;font:15px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;--gm-bg:#fbfaf6;--gm-fg:#1b1b1b;--gm-mu:#5d5d5d;--gm-ln:rgba(0,0,0,.14);--gm-card:#fff}' +
    '.cw-gm.cw-night{--gm-bg:#101215;--gm-fg:#eceef1;--gm-mu:#a9b0b9;--gm-ln:rgba(255,255,255,.16);--gm-card:#1b1f24}' +
    '.cw-gm.cw-on{transform:translateY(0);visibility:visible}.cw-gm.cw-rm{transition:none}' +
    '.cw-gm-h{display:flex;align-items:center;gap:10px;padding:max(10px,env(safe-area-inset-top)) 12px 8px 16px;border-bottom:1px solid var(--gm-ln)}' +
    '.cw-gm-h h2{flex:1 1 auto;margin:0;font:600 17px/1.25 system-ui,sans-serif;min-width:0}.cw-gm-h small{display:block;font-weight:400;font-size:12px;color:var(--gm-mu);margin-top:2px}' +
    '.cw-gm-x{all:unset;box-sizing:border-box;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;font:22px/1 system-ui;color:var(--gm-fg)}' +
    '.cw-gm-x:focus-visible,.cw-gm-tab:focus-visible{outline:2px solid currentColor}' +
    '.cw-gm-tabs{display:flex;gap:6px;padding:8px 16px 0}.cw-gm-tab{all:unset;cursor:pointer;padding:6px 12px;border-radius:999px;border:1px solid var(--gm-ln);font-size:13px}.cw-gm-tab[aria-pressed=true]{background:var(--gm-fg);color:var(--gm-bg)}' +
    '.cw-gm-sp{flex:1 1 auto}.cw-gm-b{flex:0 1 auto;min-height:0;overflow:auto;padding:6px 8px 0;-webkit-overflow-scrolling:touch}' +
    '.cw-gm-b svg{display:block;width:100%;height:auto;touch-action:manipulation}.cw-gm-b text{fill:var(--gm-mu);font:11px system-ui,sans-serif}' +
    '.cw-gm-b .ax{stroke:var(--gm-ln)}.cw-gm-b .pt{cursor:pointer;stroke:var(--gm-bg);stroke-width:1}.cw-gm-b .pt.sel{stroke:var(--gm-fg);stroke-width:2.5}' +
    '.cw-gm-lg{display:flex;flex-wrap:wrap;gap:6px 12px;padding:6px 16px;font-size:12px;color:var(--gm-mu)}.cw-gm-lg i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:5px;vertical-align:-1px}' +
    '.cw-gm-i{margin:0 12px 8px;padding:10px 12px;border-radius:10px;background:var(--gm-card);border:1px solid var(--gm-ln);min-height:44px;font-size:14px}' +
    '.cw-gm-i b{display:block}.cw-gm-i span{color:var(--gm-mu);font-size:12px}.cw-gm-i a{color:inherit;font-weight:600}' +
    '.cw-gm-f{padding:8px 16px max(10px,env(safe-area-inset-bottom));border-top:1px solid var(--gm-ln);font-size:13px}.cw-gm-f a{color:inherit}' +
    'html.cw-gm-lock,html.cw-gm-lock body{overflow:hidden!important}html.cw-vh-lock{overflow-y:hidden!important}' +
    '.cw-vh-clip{overflow:hidden!important}.cw-vh-hide{display:none!important}' +
    '.cw-vh-bar{position:sticky;bottom:0;z-index:50;display:flex;justify-content:center;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:var(--cw-vh-bg,#fff)}' +
    '.cw-vh-bar:before{content:"";position:absolute;left:0;right:0;top:-56px;height:56px;pointer-events:none;background:linear-gradient(to bottom,rgba(0,0,0,0),var(--cw-vh-bg,#fff))}' +
    '.cw-vh-btn{all:unset;box-sizing:border-box;cursor:pointer;min-height:44px;padding:0 26px;border-radius:999px;display:flex;align-items:center;font:600 15px/1 system-ui,sans-serif;background:var(--cw-vh-fg,#111);color:var(--cw-vh-bg,#fff)}' +
    '.cw-vh-btn:focus-visible{outline:3px solid var(--ghf-s,#f2c94c);outline-offset:2px}' +
    '@media print{.cw-vh-clip{max-height:none!important;overflow:visible!important}.cw-vh-hide{display:revert!important}.cw-vh-bar,.cw-gb{display:none!important}}';
  var st = mk('style'); st.id = 'cw-graph-css'; st.textContent = CSS; (d.head || de).appendChild(st);

  /* ---------------- banner ---------------- */
  var KEY = 'cw-gb-closed', bar = null, ebook = null;
  function closed() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function thumb() {
    var p = [[3, 15], [7, 11], [10, 13], [13, 7], [16, 9], [19, 4], [22, 6], [8, 16], [17, 12]], s = '';
    for (var i = 0; i < p.length; i++) s += '<circle cx="' + p[i][0] + '" cy="' + p[i][1] + '" r="1.7"/>';
    return '<svg viewBox="0 0 26 20" width="30" height="22" aria-hidden="true"><path d="M1.5 1v17.5H25" fill="none" stroke="currentColor" stroke-opacity=".6" stroke-width="1"/><g fill="var(--ghf-s,#f2c94c)">' + s + '</g></svg>';
  }
  function takeover(up) {
    if (!up || up.querySelector('.cw-gb')) return;
    var a = up.querySelector('a.ghf-v2-upa'), col = getComputedStyle(a || up).color; if (a) { var tt = a.querySelector('.ghf-v2-upt'); ebook = { href: a.href, text: clean(tt ? tt.textContent : a.textContent) }; }
    if (closed()) { up.style.setProperty('display', 'none', 'important'); return; }
    var w = mk('div', 'cw-gb'), o = mk('button', 'cw-gb-open'), x = mk('button', 'cw-gb-x', '\u00d7'); w.style.color = col;
    o.type = 'button'; x.type = 'button'; o.setAttribute('aria-haspopup', 'dialog');
    o.innerHTML = thumb(); o.appendChild(mk('span', 'cw-gb-t', t('promo'))); o.appendChild(mk('span', 'cw-gb-c', t('cta') + ' \u203a'));
    x.setAttribute('aria-label', t('close'));
    o.onclick = function () { openModal(o); };
    x.onclick = function () { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} up.style.setProperty('display', 'none', 'important'); try { window.dispatchEvent(new Event('resize')); } catch (e) {} };
    w.appendChild(o); w.appendChild(x); up.textContent = ''; up.appendChild(w); up.setAttribute('aria-label', t('promo'));
  }
  function watchBanner() {
    var n = 0, iv = setInterval(function () {
      var up = d.querySelector('.ghf-v2-up');
      if (up) { clearInterval(iv); bar = up; takeover(up); new MutationObserver(function () { if (!up.querySelector('.cw-gb')) takeover(up); }).observe(up, { childList: true }); }
      else if (++n > 100) clearInterval(iv);
    }, 100);
  }

  /* ---------------- data ---------------- */
  var MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11, ion: 0, chw: 1, maw: 2, ebr: 3, mai: 4, meh: 5, gor: 6, aws: 7, med: 8, hyd: 9, tach: 10, rhag: 11 };
  var RE_DATE = /(?:\b(1[0-9]\d\d|20[0-4]\d)-(\d\d)-(\d\d)\b)|(?:\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(1[0-9]\d\d|20[0-4]\d)\b)|(?:\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2},\s+)?(1[0-9]\d\d|20[0-4]\d)\b)|(?:(?:^|[^\w\-\/#.£$€])(1[0-9]\d\d|20[0-4]\d)(?![\w\-\/]|\.\d))/gi;
  function dates(s, max) {
    var out = [], m; RE_DATE.lastIndex = 0;
    while ((m = RE_DATE.exec(s)) && out.length < (max || 6)) {
      var y, mo = 0, dd = 1, prec = 'y';
      if (m[1]) { y = +m[1]; mo = +m[2] - 1; dd = +m[3]; prec = 'd'; }
      else if (m[4]) { y = +m[6]; mo = MON[m[5].toLowerCase()]; dd = +m[4]; prec = 'd'; }
      else if (m[7]) { y = +m[9]; mo = MON[m[7].toLowerCase()]; prec = 'm'; }
      else { y = +m[10]; }
      if (y < 1000 || y > 2040 || mo < 0 || mo > 11) continue;
      out.push({ t: Date.UTC(y, mo, dd), y: y, prec: prec, at: m.index });
    }
    return out;
  }
  function iso(ms, prec) { var x = new Date(ms); var s = String(x.getUTCFullYear()); if (prec === 'y') return s; s += '-' + ('0' + (x.getUTCMonth() + 1)).slice(-2); if (prec === 'm') return s; return s + '-' + ('0' + x.getUTCDate()).slice(-2); }
  var SKIPQ = '.ghf-ui,header,nav,footer,script,style,noscript,#cedwyn-guestbook,#ghf-agent-footer,[data-for-agents],.cw-gm,.cw-vh-bar,[aria-hidden=true],template';
  function content() {
    var c = d.querySelector('main,[role=main]') || d.querySelector('article') || d.querySelector('#content,.content,#main');
    if (c && (c.textContent || '').length > 300) return c;
    var best = null, bl = 0, k = d.body ? d.body.children : [];
    for (var i = 0; i < k.length; i++) {
      var e = k[i]; if (e.matches(SKIPQ) || /^(SCRIPT|STYLE|LINK)$/.test(e.tagName)) continue;
      var l = (e.textContent || '').length; if (l > bl) { bl = l; best = e; }
    }
    return best || d.body;
  }
  function clean(s) { return (s || '').replace(/\s+/g, ' ').trim(); }
  function idFor(e, n) { if (!e.id) e.id = 'cw-g-' + n; return '#' + e.id; }
  function heading(e, root) {   /* nearest heading before e (in document order) inside root */
    var w = d.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null), last = '', n;
    while ((n = w.nextNode())) { if (n === e || n.contains(e)) { if (n === e) break; continue; } if (/^H[1-4]$/.test(n.tagName) && !n.closest(SKIPQ)) last = clean(n.textContent).slice(0, 48); if (n.compareDocumentPosition(e) & 2) break; }
    return last;
  }
  var STRENGTH = [[/family testimony|testimony/i, 'Family testimony'], [/not yet confirmed|not checked|to be confirmed/i, 'Not yet confirmed'], [/working (?:theory|hypothesis)|hypothes[ie]s/i, 'Working hypothesis'], [/\brecord\b|catalogue|register|deed|minute/i, 'Record']];
  function strength(s) { for (var i = 0; i < STRENGTH.length; i++) if (STRENGTH[i][0].test(s)) return STRENGTH[i][1]; return 'Text'; }
  function domData() {
    var root = content(); if (!root) return null;
    /* 1) repeated items that each carry a date: list rows, table rows, cards */
    var sig = {}, q = root.querySelectorAll('li,tr,article,section,details,.card,[class*=card],[class*=item],[class*=entry],[class*=row]'), i;
    for (i = 0; i < q.length && i < 4000; i++) {
      var e = q[i]; if (e.closest(SKIPQ)) continue;
      var tx = clean(e.textContent); if (tx.length < 8 || tx.length > 1600) continue;
      var ds = dates(tx, 1); if (!ds.length) continue;
      var k = e.tagName + '.' + (typeof e.className === 'string' ? e.className.split(/\s+/)[0] : '');
      (sig[k] = sig[k] || []).push([e, ds[0], tx]);
    }
    var bestK = null, bn = 0; for (var k2 in sig) if (sig[k2].length > bn) { bn = sig[k2].length; bestK = k2; }
    var pts = [], n = 0;
    if (bn >= 6) {
      sig[bestK].forEach(function (r) {
        var e = r[0], a = e.querySelector('a[href]:not([href^="javascript"])'), h = e.querySelector('h1,h2,h3,h4,h5,strong,b,a');
        var lab = clean(h ? h.textContent : r[2]).slice(0, 110) || r[2].slice(0, 110);
        var tag = e.querySelector('[class*=tag],[class*=badge],[class*=chip],[class*=status],[class*=label],[class*=kind],[class*=type]');
        var ct = tag ? clean(tag.textContent).slice(0, 28) : '';
        pts.push({ x: r[1].t, xp: r[1].prec, y: heading(e, root) || ct || 'Items', c: ct || strength(r[2]), l: lab, h: a ? a.getAttribute('href') : idFor(e, ++n) });
      });
      return pack(pts, 'Date', 'Section', 'Kind');
    }
    /* 2) prose: every date the text mentions, by section, coloured by how the passage presents it */
    var blocks = root.querySelectorAll('p,li,td,dd,blockquote,h2,h3,h4,figcaption'), seen = {};
    for (i = 0; i < blocks.length && pts.length < 600; i++) {
      var b = blocks[i]; if (b.closest(SKIPQ) || (b.tagName === 'LI' && b.querySelector('p,li'))) continue;
      var s = clean(b.textContent); if (s.length < 6) continue;
      var ds2 = dates(s, 8), hd = null;
      for (var j = 0; j < ds2.length; j++) {
        var kk = ds2[j].y + '|' + i; if (seen[kk]) continue; seen[kk] = 1;
        if (hd === null) hd = heading(b, root) || 'Text';
        var a0 = Math.max(0, s.lastIndexOf('.', ds2[j].at) + 1), z = s.indexOf('. ', ds2[j].at); if (z < 0) z = s.length;
        var sent = s.slice(a0, z + 1).trim(); if (sent.length > 140) sent = sent.slice(0, 137) + '…';
        pts.push({ x: ds2[j].t, xp: ds2[j].prec, y: hd, c: strength(s), l: sent, h: idFor(b, ++n) });
      }
    }
    if (pts.length >= 3) return pack(pts, 'Date mentioned', 'Section', 'Presented as');
    /* 3) no dates: sections by position and length */
    var hs = root.querySelectorAll('h2,h3'), sec = [];
    for (i = 0; i < hs.length; i++) {
      var hh = hs[i]; if (hh.closest(SKIPQ)) continue;
      var words = 0, sib = hh.nextElementSibling; while (sib && !/^H[1-3]$/.test(sib.tagName)) { words += clean(sib.textContent).split(' ').length; sib = sib.nextElementSibling; }
      sec.push({ x: sec.length + 1, y: words, c: hh.tagName === 'H2' ? 'Section' : 'Subsection', l: clean(hh.textContent).slice(0, 110), h: idFor(hh, ++n) });
    }
    if (sec.length >= 2) return { x: { label: 'Order on the page', type: 'num' }, y: { label: 'Words', type: 'num' }, c: { label: 'Level', cats: ['Section', 'Subsection'] }, p: sec.map(function (s) { return [s.x, s.y, s.c === 'Section' ? 0 : 1, s.l, s.h]; }) };
    return null;
  }
  function top(arr, k, max) { var c = {}; arr.forEach(function (p) { c[p[k]] = (c[p[k]] || 0) + 1; }); var ks = Object.keys(c).sort(function (a, b) { return c[b] - c[a]; }); if (ks.length > max) { ks = ks.slice(0, max - 1); ks.push('Other'); } return ks; }
  function pack(pts, xl, yl, cl) {
    var ys = top(pts, 'y', 12), cs = top(pts, 'c', 8);
    return { x: { label: xl, type: 'date' }, y: { label: yl, type: 'cat', cats: ys }, c: { label: cl, cats: cs }, p: pts.map(function (p) { var yi = ys.indexOf(p.y), ci = cs.indexOf(p.c); return [iso(p.x, p.xp), yi < 0 ? ys.length - 1 : yi, ci < 0 ? cs.length - 1 : ci, p.l, p.h]; }) };
  }

  /* ---------------- scatter renderer (inline SVG) ---------------- */
  var PAL = ['#2f7ed8', '#e4572e', '#29a36a', '#c9a227', '#8e5ad8', '#d6457b', '#17a2b8', '#7a8a99'];
  var NPAL = ['#6aa8ff', '#ff7a59', '#4cd18f', '#f2c94c', '#b48cff', '#ff6fa3', '#4dd0e1', '#a3b1bf'];
  function xv(v) { if (typeof v === 'number') return v; var p = String(v).split('-'); return Date.UTC(+p[0], (+p[1] || 1) - 1, +p[2] || 1); }
  function hsh(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return ((h >>> 0) % 1000) / 1000; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function render(host, data, info, legend, sub) {
    var W = Math.max(320, Math.min(host.clientWidth || 360, 1100)), cat = data.y.type === 'cat', cats = cat ? data.y.cats : null;
    var padL = cat ? Math.min(132, Math.round(W * 0.32)) : 44, padR = 12, padT = 10, padB = 36;
    var band = cat ? Math.max(30, Math.min(54, 520 / cats.length)) : 0;
    var H = cat ? padT + padB + band * cats.length : Math.max(260, Math.min(520, Math.round(W * 0.75)));
    var P = data.p, n = P.length, xs = P.map(function (p) { return xv(p[0]); });
    var sorted = xs.slice().sort(function (a, b) { return a - b; }), mn = sorted[0], mx = sorted[n - 1];
    var dateX = data.x.type === 'date', rank = false;
    if (dateX && n > 8) { var q10 = sorted[Math.floor(n * 0.1)], q90 = sorted[Math.floor(n * 0.9)]; if (mx > mn && (q90 - q10) < (mx - mn) * 0.12) rank = true; }
    var order = {}; if (rank) sorted.forEach(function (v, i) { if (order[v] == null) order[v] = i; });
    var pw = W - padL - padR, ph = H - padT - padB;
    function X(v) { if (rank) return padL + (n > 1 ? order[v] / (n - 1) : 0.5) * pw; return padL + (mx > mn ? (v - mn) / (mx - mn) : 0.5) * pw; }
    var ys = P.map(function (p) { return +p[1]; }), ymn = Math.min.apply(null, ys), ymx = Math.max.apply(null, ys);
    function Y(p, i) { if (cat) return padT + band * (+p[1]) + band * (0.18 + 0.64 * hsh(String(p[3]) + i)); return padT + ph - (ymx > ymn ? (+p[1] - ymn) / (ymx - ymn) : 0.5) * ph; }
    var pal = night() ? NPAL : PAL, s = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(data.y.label + ' by ' + data.x.label) + '">';
    if (cat) cats.forEach(function (c, i) { var y = padT + band * i; s += '<line class="ax" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + y + '" y2="' + y + '"/><text x="' + (padL - 6) + '" y="' + (y + band / 2 + 4) + '" text-anchor="end">' + esc(c.length > 20 ? c.slice(0, 19) + '…' : c) + '</text>'; });
    else for (var g = 0; g <= 4; g++) { var yv = ymn + (ymx - ymn) * g / 4, yy = padT + ph - ph * g / 4; s += '<line class="ax" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + yy + '" y2="' + yy + '"/><text x="' + (padL - 6) + '" y="' + (yy + 4) + '" text-anchor="end">' + (Math.round(yv * 10) / 10) + '</text>'; }
    s += '<line class="ax" x1="' + padL + '" x2="' + (W - padR) + '" y1="' + (H - padB) + '" y2="' + (H - padB) + '"/>';
    var ticks = Math.max(2, Math.min(6, Math.floor(pw / 70)));
    for (var k = 0; k <= ticks; k++) {
      var tv, tx; if (rank) { tv = sorted[Math.round((n - 1) * k / ticks)]; tx = X(tv); } else { tv = mn + (mx - mn) * k / ticks; tx = padL + pw * k / ticks; }
      var lab = dateX ? (function (ms) { var x = new Date(ms); return (mx - mn < 4e10 || rank && k > 0 && Math.abs(tv - sorted[Math.round((n - 1) * (k - 1) / ticks)]) < 3e10) ? x.toISOString().slice(2, 7).replace('-', '/') : String(x.getUTCFullYear()); })(tv) : String(Math.round(tv * 10) / 10);
      s += '<text x="' + tx + '" y="' + (H - padB + 15) + '" text-anchor="' + (k === 0 ? 'start' : k === ticks ? 'end' : 'middle') + '">' + esc(lab) + '</text>';
    }
    s += '<text x="' + (padL + pw / 2) + '" y="' + (H - 4) + '" text-anchor="middle">' + esc(data.x.label + (rank ? ' (' + t('rank') + ')' : '')) + '</text>';
    for (var i = 0; i < n; i++) s += '<circle class="pt" data-i="' + i + '" cx="' + X(xs[i]).toFixed(1) + '" cy="' + Y(P[i], i).toFixed(1) + '" r="' + (n > 400 ? 4 : 5.5) + '" fill="' + pal[(+P[i][2] || 0) % pal.length] + '" fill-opacity=".85"><title>' + esc(P[i][3]) + '</title></circle>';
    host.innerHTML = s + '</svg>';
    legend.innerHTML = ''; (data.c && data.c.cats || []).forEach(function (c, i) { var sp = mk('span'); sp.innerHTML = '<i style="background:' + pal[i % pal.length] + '"></i>'; sp.appendChild(d.createTextNode(c)); legend.appendChild(sp); });
    sub.textContent = data.y.label + ' \u00d7 ' + data.x.label + ' \u00b7 ' + n + ' ' + t('pts');
    var svg = host.firstChild, sel = null;
    svg.addEventListener('click', function (e) {
      var c = e.target.closest && e.target.closest('.pt');
      if (!c) { var r = svg.getBoundingClientRect(), sx = W / r.width, ex = (e.clientX - r.left) * sx, ey = (e.clientY - r.top) * sx, bd = 1e9; [].forEach.call(svg.querySelectorAll('.pt'), function (p) { var dx = p.cx.baseVal.value - ex, dy = p.cy.baseVal.value - ey, dd = dx * dx + dy * dy; if (dd < bd) { bd = dd; c = p; } }); if (bd > 900) c = null; }
      if (!c) return;
      if (sel) sel.classList.remove('sel'); sel = c; c.classList.add('sel');
      var p = P[+c.getAttribute('data-i')]; info.textContent = '';
      info.appendChild(mk('b', null, p[3]));
      info.appendChild(mk('span', null, (dateX ? p[0] : data.x.label + ' ' + p[0]) + ' \u00b7 ' + (cat ? cats[+p[1]] : data.y.label + ' ' + p[1]) + (data.c && data.c.cats ? ' \u00b7 ' + data.c.cats[+p[2]] : '')));
      if (p[4]) { info.appendChild(d.createTextNode(' ')); var a = mk('a', null, t('open') + ' \u203a'); a.href = p[4]; a.onclick = function () { if (p[4].charAt(0) === '#') { closeModal(); expandTo(p[4]); } }; info.appendChild(a); }
    });
  }

  /* ---------------- modal ---------------- */
  var M = null, opener = null, sets = {}, cur = null;
  function build() {
    M = mk('div', 'cw-gm' + (RM ? ' cw-rm' : '')); M.setAttribute('role', 'dialog'); M.setAttribute('aria-modal', 'true'); M.setAttribute('aria-labelledby', 'cw-gm-t'); M.setAttribute('data-no-translate', '');
    M.innerHTML = '<div class="cw-gm-h"><h2 id="cw-gm-t"></h2><button type="button" class="cw-gm-x">\u2191</button></div><div class="cw-gm-tabs" hidden></div><div class="cw-gm-lg"></div><div class="cw-gm-b"></div><div class="cw-gm-i" aria-live="polite"></div><div class="cw-gm-sp"></div><div class="cw-gm-f"></div>';
    var x = M.querySelector('.cw-gm-x'); x.setAttribute('aria-label', t('closeg')); x.onclick = closeModal;
    var y0 = null; M.addEventListener('touchstart', function (e) { y0 = e.touches[0].clientY; }, { passive: true });
    M.addEventListener('touchend', function (e) { if (y0 != null && e.changedTouches[0].clientY - y0 < -70 && !e.target.closest('.cw-gm-b svg')) closeModal(); y0 = null; }, { passive: true });
    d.addEventListener('keydown', function (e) { if (M.classList.contains('cw-on') && e.key === 'Escape') closeModal(); });
    d.body.appendChild(M);
  }
  function title() { var h = d.querySelector('.ghf-v2-name b, .ghf-v2-chain [aria-current]'); var tt = clean((h && h.textContent) || (d.querySelector('h1') || {}).textContent || d.title).split(/[|·–—]/)[0].trim(); return tt.slice(0, 60); }
  function show(which) {
    cur = which; var data = sets[which], body = M.querySelector('.cw-gm-b'), info = M.querySelector('.cw-gm-i');
    [].forEach.call(M.querySelectorAll('.cw-gm-tab'), function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-k') === which)); });
    info.textContent = t('tap');
    if (!data || !data.p || data.p.length < 1) { body.innerHTML = '<p style="padding:16px">' + esc(t('none')) + '</p>'; M.querySelector('.cw-gm-lg').innerHTML = ''; return; }
    render(body, data, info, M.querySelector('.cw-gm-lg'), M.querySelector('#cw-gm-t small') || (function () { var s = mk('small'); M.querySelector('#cw-gm-t').appendChild(s); return s; })());
  }
  function openModal(from) {
    opener = from || null; if (!M) build();
    M.classList.toggle('cw-night', night());
    var h = M.querySelector('#cw-gm-t'); h.textContent = (data0 && data0.title) || title(); h.appendChild(mk('small', null, t('loading')));
    var f = M.querySelector('.cw-gm-f'); f.textContent = ''; if (ebook && ebook.href) { var a = mk('a', null, (ebook.text || 'E-books') + ' \u203a'); a.href = ebook.href; f.appendChild(a); } else f.hidden = true;
    de.classList.add('cw-gm-lock'); M.style.visibility = 'visible';
    requestAnimationFrame(function () { requestAnimationFrame(function () { M.classList.add('cw-on'); M.querySelector('.cw-gm-x').focus({ preventScroll: true }); }); });
    loadSets(function () {
      var tabs = M.querySelector('.cw-gm-tabs'); tabs.textContent = '';
      var ks = ['sec', 'page'].filter(function (k) { return sets[k] && sets[k].p && sets[k].p.length >= 3; });
      if (ks.length > 1) { tabs.hidden = false; ks.forEach(function (k) { var b = mk('button', 'cw-gm-tab', t(k)); b.type = 'button'; b.setAttribute('data-k', k); b.onclick = function () { show(k); }; tabs.appendChild(b); }); } else tabs.hidden = true;
      if (sets.sec && sets.sec.title) { h.firstChild.nodeValue = sets.sec.title; }
      show(ks[0] || 'page');
    });
  }
  var data0 = null, loaded = false;
  function loadSets(cb) {
    if (loaded) return cb(); loaded = true;
    try { sets.page = domData(); } catch (e) { sets.page = null; }
    var done = false, to = setTimeout(function () { if (!done) { done = true; cb(); } }, 4000);
    fetch('/_cedwyn/graph/' + AREA + '.json?v=' + VER, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { if (j && j.p) sets.sec = j; }).catch(function () {}).then(function () { if (!done) { done = true; clearTimeout(to); cb(); } });
  }
  function closeModal() {
    if (!M || !M.classList.contains('cw-on')) return;
    M.classList.remove('cw-on'); de.classList.remove('cw-gm-lock');
    setTimeout(function () { if (!M.classList.contains('cw-on')) M.style.visibility = 'hidden'; }, RM ? 0 : 260);
    if (opener && opener.focus) opener.focus({ preventScroll: true });
  }
  window.__cwGraph.open = function () { openModal(null); }; window.__cwGraph.close = closeModal; window.__cwGraph.dom = domData;

  /* ---------------- 100vh clip + Read more ---------------- */
  var NOCLIP = /^\/(?:(?:wales|argentina)\/)?(?:dartboard|documentary|movie|story|academy|wayback|legal|terms|privacy|cookies|chess|arcade|maps|chat|app|infographic|familytree|terrain|thousand-cuts|shop|ebooks|subscribe|nft-art|db|parcels|cyberspace|estate|directory|patagonia)(?:\/|$)/;
  var C = null, Hc = 0, hidden = [], vbar = null, more = null, moreN = 0, moreI = 0, busyMore = false;
  function bgOf(e) { while (e && e.nodeType === 1) { var c = getComputedStyle(e).backgroundColor, m = c && c.match(/rgba?\(([^)]+)\)/); if (m) { var p = m[1].split(','); if (p.length < 4 || parseFloat(p[3]) > 0.5) return 'rgb(' + p.slice(0, 3).join(',') + ')'; } e = e.parentElement; } return night() ? '#111' : '#fff'; }
  function unclampV2(root) { [].forEach.call(root.querySelectorAll('.cw-ctl'), function (e) { e.remove(); }); [].forEach.call(root.querySelectorAll('.cw-c,.cw-h,.cw-o'), function (e) { e.classList.remove('cw-c', 'cw-h', 'cw-o'); }); }
  function afterEls(c) { var out = [], e = c; while (e && e !== d.body) { var s = e.nextElementSibling; while (s) { if (!s.matches('.ghf-v2,.ghf-v2-btn,script,style,link,.cw-gm,.cw-vh-bar') && /^(static|relative)$/.test(getComputedStyle(s).position) && s.getClientRects().length) out.push(s); s = s.nextElementSibling; } e = e.parentElement; } return out; }
  function setH(h) { Hc = Math.max(160, Math.round(h)); C.style.setProperty('max-height', Hc + 'px', 'important'); }
  function fits() { return C.scrollHeight <= Hc + 4 && !(more && moreI < moreN); }
  function unclip() {
    if (!C) return; C.classList.remove('cw-vh-clip'); C.style.removeProperty('max-height');
    hidden.forEach(function (e) { e.classList.remove('cw-vh-hide'); e.style.removeProperty('display'); }); hidden = [];
    if (vbar) vbar.remove(); vbar = null; de.classList.remove('cw-vh', 'cw-vh-lock'); C = null;
  }
  function loadMore(cb) {
    if (!more || moreI >= moreN || busyMore) return cb && cb(false); busyMore = true;
    var url = more.getAttribute('data-cw-more') + (++moreI) + '.json';
    fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (j && j.html) { var tmp = d.createElement('div'); tmp.innerHTML = j.html; while (tmp.firstChild) more.parentNode.insertBefore(tmp.firstChild, more); }
      else moreI = moreN;
    }).catch(function () { moreI = moreN; }).then(function () { busyMore = false; if (moreI >= moreN) { var nsc = more.parentNode && more.parentNode.querySelector('.cw-more-noscript'); if (nsc) nsc.remove(); } cb && cb(true); });
  }
  function step() {
    if (!C) return;
    opened = true; de.classList.remove('cw-vh-lock'); var next = Hc + Math.round(innerHeight * 0.85);
    function go() {
      setH(next); if (C.scrollHeight <= Hc + 4 && !(more && moreI < moreN)) unclip();
      else if (vbar) vbar.querySelector('button').setAttribute('aria-expanded', 'true');
    }
    if (more && moreI < moreN && C.scrollHeight < next + innerHeight) loadMore(go); else go();
  }
  function expandTo(hash) {
    if (!C || !hash || hash.length < 2) return;
    var id; try { id = decodeURIComponent(hash.slice(1)); } catch (e) { id = hash.slice(1); }
    var tg = d.getElementById(id) || d.querySelector('[name="' + id.replace(/"/g, '') + '"]');
    if (!tg) { if (more && moreI < moreN) loadMore(function () { expandTo(hash); }); return; }
    if (!C.contains(tg)) return;
    var need = tg.getBoundingClientRect().top - C.getBoundingClientRect().top + innerHeight * 0.6;
    if (need > Hc) { opened = true; de.classList.remove('cw-vh-lock'); setH(need); if (C.scrollHeight <= Hc + 4 && !(more && moreI < moreN)) unclip(); }
    setTimeout(function () { try { tg.scrollIntoView({ block: 'start' }); } catch (e) {} }, 30);
  }
  function clip() {
    if (NOCLIP.test(location.pathname) || de.hasAttribute('data-cw-noclip') || location.search.indexOf('full=1') >= 0) return;
    var c = content(); if (!c || c === d.body || c.closest('.ghf-ui')) return;
    while (c.parentElement && c.parentElement !== d.body && !c.parentElement.matches('.ghf-ui') && c.getBoundingClientRect().top + scrollY > innerHeight * 0.45) c = c.parentElement;
    if (c.querySelector('canvas,video,iframe,[data-cw-noclip],form input[type=email]') && (c.textContent || '').length < 4000) return;
    if ((c.textContent || '').replace(/\s+/g, ' ').length < 900) return;
    more = c.querySelector('[data-cw-more]'); moreN = more ? +more.getAttribute('data-cw-more-n') || 0 : 0;
    if (de.scrollHeight <= innerHeight + 2 && !moreN) return;
    C = c; unclampV2(C); C.classList.add('cw-vh-clip'); de.classList.add('cw-vh');
    hidden = afterEls(C); hidden.forEach(function (e) { e.classList.add('cw-vh-hide'); e.style.setProperty('display', 'none', 'important'); });
    vbar = mk('div', 'cw-vh-bar'); var b = mk('button', 'cw-vh-btn', t('more')); b.type = 'button'; b.setAttribute('aria-expanded', 'false'); b.onclick = step; vbar.appendChild(b);
    C.parentNode.insertBefore(vbar, C.nextSibling);
    var bg = bgOf(C); vbar.style.setProperty('--cw-vh-bg', bg); var fg = getComputedStyle(C).color; vbar.style.setProperty('--cw-vh-fg', fg);
    var top = C.getBoundingClientRect().top + scrollY;
    setH(innerHeight - top - vbar.offsetHeight);
    for (var k = 0; k < 3 && de.scrollHeight > innerHeight + 1; k++) setH(Hc - (de.scrollHeight - innerHeight));
    if (fits()) { unclip(); return; }
    [].forEach.call(C.querySelectorAll('input[type=search],input[type=text],select'), function (inp) { inp.addEventListener('focus', function full() { inp.removeEventListener('focus', full); (function all() { if (more && moreI < moreN) loadMore(all); else unclip(); })(); }); });
    if (location.hash) expandTo(location.hash);
    addEventListener('hashchange', function () { expandTo(location.hash); });
    d.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href^="#"]'); if (a && C) expandTo(a.getAttribute('href')); }, true);
    [600, 1500, 3000, 6000].forEach(function (ms) { setTimeout(refit, ms); });
    try { var mo = new MutationObserver(function () { clearTimeout(rf); rf = setTimeout(refit, 120); }); mo.observe(d.body, { childList: true }); setTimeout(function () { mo.disconnect(); }, 9000); } catch (e) {}
  }
  var rf = 0, opened = false;
  function refit() {   /* late scripts add blocks below the text (panels, guestbook): keep them folded and the first view at 100vh */
    if (!C || opened) return; unclampV2(C);
    afterEls(C).forEach(function (e) { if (hidden.indexOf(e) < 0) { e.classList.add('cw-vh-hide'); e.style.setProperty('display', 'none', 'important'); hidden.push(e); } });
    for (var k = 0; k < 3 && de.scrollHeight > innerHeight + 1 && scrollY < 5; k++) setH(Hc - (de.scrollHeight - innerHeight));
    if (de.scrollHeight > innerHeight + 1 && scrollY < 5) de.classList.add('cw-vh-lock');   /* only a stray off-screen panel is left below: no scroll until Read more */
  }
  function start() { watchBanner(); try { clip(); } catch (e) {} }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start); else start();
})();
