/* estate-maps.js v1.0.0 - Tile | 2D map | 3D toggle for the place modals on the landing page.
   Data: /_cedwyn/parcels.json (59 parcels, H3 cells, georeferenced estate plan). 2D = SVG "theme-park" map; 3D = /_cedwyn/estate-3d.js
   (three.js from the site's own mirror, loaded only when 3D is chosen). Wales shows the estate at Llandough; Argentina shows the
   planned replica of the same estate (labelled planned). Without JS the tiles stay as they are. - Sion's Tab agent */
(function () {
  'use strict';
  var V = '1.0.0', DATA = '/_cedwyn/parcels.json?v=' + V, D = null, LOADING = null;
  var L = {
    en: { tile: 'Tiles', map: '2D map', d3: '3D', views: 'View', whole: 'Whole estate', zin: 'Zoom in', zout: 'Zoom out', walk: 'Walk', fly: 'Overview',
      coming: 'coming', planned: 'planned', open: 'Open', river: 'River Ely', approx: 'Outline and positions approximate', plannedBanner: 'Planned replica · Patagonia',
      house: 'Tŷ Mawr, former manorial house', house2: 'Great House II (planned)', church: "St Dochdwy's Church", hint: 'Pinch or scroll to zoom · tap a ride to open it',
      hint3: 'Drag to look · pinch to zoom · Walk to explore on foot', nogl: '3D needs WebGL, which this browser has turned off', loading: 'Loading…', of: 'of', schematic: 'position not yet read from the plan' },
    cy: { tile: 'Teils', map: 'Map 2D', d3: '3D', views: 'Golwg', whole: 'Yr ystâd gyfan', zin: 'Chwyddo i mewn', zout: 'Chwyddo allan', walk: 'Cerdded', fly: 'Trosolwg',
      coming: 'i ddod', planned: 'arfaethedig', open: 'Agor', river: 'Afon Elái', approx: 'Amlinell a lleoliadau bras', plannedBanner: 'Replica arfaethedig · Patagonia',
      house: 'Tŷ Mawr, hen dŷ maenorol', house2: 'Great House II (arfaethedig)', church: 'Eglwys Sant Dochdwy', hint: 'Pinsio neu sgrolio i chwyddo · tapio reid i’w hagor',
      hint3: 'Llusgo i edrych · pinsio i chwyddo · Cerdded i grwydro', nogl: 'Mae angen WebGL ar 3D', loading: 'Wrthi’n llwytho…', of: 'o', schematic: 'lleoliad heb ei ddarllen o’r cynllun eto' },
    es: { tile: 'Mosaico', map: 'Mapa 2D', d3: '3D', views: 'Vista', whole: 'Toda la finca', zin: 'Acercar', zout: 'Alejar', walk: 'Caminar', fly: 'Vista general',
      coming: 'próximamente', planned: 'planificado', open: 'Abrir', river: 'Río Ely', approx: 'Contorno y posiciones aproximados', plannedBanner: 'Réplica planificada · Patagonia',
      house: 'Tŷ Mawr, antigua casa señorial', house2: 'Great House II (planificada)', church: 'Iglesia de San Dochdwy', hint: 'Pellizque o desplace para acercar · toque una atracción para abrirla',
      hint3: 'Arrastre para mirar · pellizque para acercar · Caminar para recorrer', nogl: 'El 3D necesita WebGL', loading: 'Cargando…', of: 'de', schematic: 'posición aún no leída del plano' }
  };
  function lang() { var l = ''; try { l = window.__cedwynLang || localStorage.getItem('ghf_lang') || document.documentElement.lang || 'en'; } catch (e) { l = 'en'; } l = String(l).slice(0, 2); return L[l] ? l : 'en'; }
  function t(k) { return L[lang()][k] || L.en[k]; }
  var GROUP = { interactive: '#c0392b', artifacts: '#2e6da4', research: '#7d3c98', story: '#d68910' };
  var NS = 'http://www.w3.org/2000/svg';
  function el(tag, attrs, parent, txt) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (txt != null) e.textContent = txt; if (parent) parent.appendChild(e); return e; }
  function h(tag, cls, parent, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (parent) parent.appendChild(e); return e; }
  function load() { if (D) return Promise.resolve(D); if (!LOADING) LOADING = fetch(DATA, { credentials: 'same-origin' }).then(function (r) { if (!r.ok) throw new Error('parcels ' + r.status); return r.json(); }).then(function (j) { D = prep(j); return D; }); return LOADING; }
  // local metres: x east, y north, origin = the church
  function prep(j) {
    var o = j.church, k = Math.cos(o.lat * Math.PI / 180) * 111320, ky = 110574;
    j.proj = function (lat, lon) { return [(lon - o.lon) * k, (lat - o.lat) * ky]; };
    j.P = function (p) { return j.proj(p[0], p[1]); };
    j.outlineM = j.outline.coords.map(j.P); j.riverM = j.river.coords.map(j.P);
    j.parcels.forEach(function (p) { p.m = j.proj(p.centroid.lat, p.centroid.lon); p.hexM = p.hex.map(j.P); });
    j.houseM = j.proj(j.house.lat, j.house.lon); j.churchM = j.proj(j.church.lat, j.church.lon);
    var xs = j.outlineM.map(function (q) { return q[0]; }), ys = j.outlineM.map(function (q) { return q[1]; });
    j.box = [Math.min.apply(0, xs), Math.min.apply(0, ys), Math.max.apply(0, xs), Math.max.apply(0, ys)];
    return j;
  }
  // where a parcel opens: the modal's own tile for that webapp when there is one, else the webapp's own address
  function hrefFor(p, dialog, scope) {
    if (!p.path) return null;
    var c = [p.area].concat(p.source_themes || []), as = dialog ? dialog.querySelectorAll('a.land-app[href]') : [];
    for (var i = 0; i < c.length; i++) for (var j = 0; j < as.length; j++) { var hr = as[j].getAttribute('href'); if (hr === '/' + scope + '/' + c[i] + '/') return hr; }
    return p.path;
  }
  function tileLabel(p, dialog, scope) { var hr = hrefFor(p, dialog, scope); if (!hr || !dialog) return null; var a = dialog.querySelector('a.land-app[href="' + hr + '"]'); return a ? a.getAttribute('aria-label') : null; }
  function nameOf(p) { if (p.__lbl) return p.__lbl; var l = lang(); return (p.name && (p.name[l] || p.name.en)) || ''; }
  function css() {
    if (document.getElementById('em-css')) return;
    var s = h('style'); s.id = 'em-css';
    s.textContent = '.em-switch{display:flex;gap:6px;padding:10px 16px 0;flex-wrap:wrap}' +
      '.em-switch button{flex:1 1 0;min-width:0;min-height:40px;border:1px solid rgba(255,255,255,.25);border-radius:999px;background:#18212a;color:#f4f6f8;font:600 14px/1.1 system-ui,sans-serif;cursor:pointer;padding:8px 10px}' +
      '.em-switch button[aria-pressed="true"]{background:#f0d48a;color:#1b1207;border-color:#f0d48a}' +
      '.em-view{position:relative;height:min(68dvh,640px);min-height:320px;border-radius:12px;overflow:hidden;background:#f7f2e7;color:#2a2016;touch-action:none;margin-bottom:12px}' +
      '.em-view svg{display:block;width:100%;height:100%;user-select:none;-webkit-user-select:none}' +
      '.em-ctl{position:absolute;right:8px;top:8px;display:flex;flex-direction:column;gap:6px;z-index:2}' +
      '.em-ctl button{width:40px;height:40px;border-radius:10px;border:1px solid #8b6a3a;background:#fbf8f1;color:#2a2016;font:600 20px/1 system-ui,sans-serif;cursor:pointer}' +
      '.em-ctl button.em-wide{width:auto;padding:0 10px;font-size:13px}' +
      '.em-note{position:absolute;left:8px;bottom:8px;right:56px;font:12px/1.3 system-ui,sans-serif;color:#4a3b28;background:rgba(251,248,241,.88);border-radius:8px;padding:5px 8px;z-index:2;pointer-events:none}' +
      '.em-banner{position:absolute;left:50%;top:8px;transform:translateX(-50%);font:700 13px/1.2 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;background:#7a5a1e;color:#fbf8f1;border-radius:999px;padding:6px 12px;z-index:2;white-space:nowrap;pointer-events:none}' +
      '.em-card{position:absolute;left:8px;right:8px;bottom:44px;z-index:3;background:#fbf8f1;color:#2a2016;border:1px solid #8b6a3a;border-radius:12px;padding:10px 12px;font:14px/1.35 system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.25)}' +
      '.em-card b{display:block;font-size:15px}.em-card small{display:block;color:#6b5a43;margin-top:2px}.em-card a{display:inline-block;margin-top:8px;background:#2e6da4;color:#fbf8f1;border-radius:999px;padding:7px 14px;text-decoration:none;font-weight:600}' +
      '.em-card .em-x{position:absolute;right:6px;top:4px;border:0;background:none;font:22px/1 system-ui;color:#6b5a43;cursor:pointer}' +
      '.em-lbl{display:none}.em-z2 .em-lbl{display:inline}.em-hexes{display:none}.em-z2 .em-hexes{display:inline}' +
      '.em-ride{cursor:pointer}.em-ride:focus{outline:none}.em-ride:focus circle.em-b{stroke:#000;stroke-width:3}' +
      '.em-3d canvas{display:block;width:100%;height:100%}.em-joy{position:absolute;left:14px;bottom:52px;width:120px;height:120px;border-radius:50%;background:rgba(0,0,0,.25);border:2px solid rgba(255,255,255,.5);z-index:3;touch-action:none}' +
      '.em-joy i{position:absolute;left:40px;top:40px;width:40px;height:40px;border-radius:50%;background:rgba(251,248,241,.85)}' +
      '.em-load{position:absolute;inset:0;display:grid;place-items:center;font:600 15px system-ui,sans-serif;color:#4a3b28}' +
      '@media (prefers-reduced-motion:reduce){.em-view *{transition:none!important}}';
    document.head.appendChild(s);
  }
  function card(view, p, href, scope) {
    var old = view.querySelector('.em-card'); if (old) old.remove();
    var c = h('div', 'em-card', view); c.setAttribute('role', 'status');
    var x = h('button', 'em-x', c, '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close'); x.onclick = function () { c.remove(); };
    h('b', '', c, p.label.replace('of', t('of')) + ' · ' + nameOf(p));
    var bits = [];
    if (scope === 'argentina') bits.push(t('planned'));
    if (p.status !== 'live') bits.push(t('coming'));
    if (p.placement === 'schematic') bits.push(t('schematic'));
    bits.push('H3 ' + p.h3.cell);
    h('small', '', c, bits.join(' · '));
    if (href && p.status === 'live') { var a = h('a', '', c, t('open') + ' →'); a.href = href; }
    return c;
  }
  // ---------------- 2D ----------------
  function map2d(view, d, scope, dialog) {
    view.innerHTML = '';
    var pad = 70, b = d.box, W = b[2] - b[0] + 2 * pad, H = b[3] - b[1] + 2 * pad, X0 = b[0] - pad, Yt = b[3] + pad;
    function sx(q) { return (q[0] - X0).toFixed(1); } function sy(q) { return (Yt - q[1]).toFixed(1); }
    function pts(a) { return a.map(function (q) { return sx(q) + ',' + sy(q); }).join(' '); }
    var arg = scope === 'argentina';
    var svg = el('svg', { viewBox: '0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0), role: 'img', 'aria-label': (arg ? t('plannedBanner') : 'Cedwyn') + ' · 59' }, view);
    var defs = el('defs', {}, svg);
    var pat = el('pattern', { id: 'em-grass-' + scope, width: 24, height: 24, patternUnits: 'userSpaceOnUse' }, defs);
    el('rect', { width: 24, height: 24, fill: arg ? '#e8d6a6' : '#bcd79a' }, pat);
    el('path', { d: 'M4 18l3-6 3 6M14 10l3-6 3 6', stroke: arg ? '#c9ae6e' : '#93b56c', 'stroke-width': 1.6, fill: 'none' }, pat);
    var world = el('g', {}, svg);
    el('rect', { x: 0, y: 0, width: W, height: H, fill: arg ? '#f3e7cc' : '#f7f2e7' }, world);
    // estate ground with a soft drop shadow, then a dashed fence
    el('polygon', { points: d.outlineM.map(function (q) { return (+sx(q) + 10) + ',' + (+sy(q) + 12); }).join(' '), fill: 'rgba(60,40,10,.18)' }, world);
    el('polygon', { points: pts(d.outlineM), fill: 'url(#em-grass-' + scope + ')', stroke: arg ? '#8a6a2a' : '#5d7d3e', 'stroke-width': 6, 'stroke-linejoin': 'round' }, world);
    el('polygon', { points: pts(d.outlineM), fill: 'none', stroke: '#fbf8f1', 'stroke-width': 2, 'stroke-dasharray': '10 8' }, world);
    // river
    var rp = pts(d.riverM);
    el('polyline', { points: rp, fill: 'none', stroke: '#2f6f9f', 'stroke-width': 30, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, world);
    el('polyline', { points: rp, id: 'em-river-' + scope, fill: 'none', stroke: '#7fb6dc', 'stroke-width': 22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, world);
    el('polyline', { points: rp, fill: 'none', stroke: '#d6ecf8', 'stroke-width': 2, 'stroke-dasharray': '18 26' }, world);
    // traced homestead parcels (OS 1900)
    var tr = el('g', { class: 'em-hexes' }, world);
    (d.traced || []).forEach(function (f) { el('polygon', { points: pts(f.coords.map(d.P)), fill: 'rgba(122,90,30,.18)', stroke: '#7a5a1e', 'stroke-width': 2 }, tr); });
    // H3 cells (visible when zoomed in)
    var hx = el('g', { class: 'em-hexes' }, world);
    d.parcels.forEach(function (p) { el('polygon', { points: pts(p.hexM), fill: 'rgba(251,248,241,.55)', stroke: '#6b5a43', 'stroke-width': 1.5 }, hx); });
    // landmarks + rides (screen-constant size: each group is scaled by the zoom)
    var marks = [];
    function mark(q, draw) { var g = el('g', {}, world); g.__q = q; draw(g); marks.push(g); return g; }
    mark(d.houseM, function (g) { el('path', { d: 'M-12 4h24v12h-24zM-15 5l15-13 15 13z', fill: arg ? '#d9b26a' : '#a0522d', stroke: '#2a2016', 'stroke-width': 1.5 }, g);
      el('text', { y: 32, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#2a2016', stroke: '#fbf8f1', 'stroke-width': 3, 'paint-order': 'stroke' }, g, arg ? t('house2') : t('house')); });
    if (!arg) mark(d.churchM, function (g) { el('path', { d: 'M-2-14h4v6h5v4h-5v14h-4v-14h-5v-4h5z', fill: '#4a3b28' }, g); });
    var rides = [];
    d.parcels.forEach(function (p) {
      var href = hrefFor(p, dialog, scope), live = p.status === 'live' && href; p.__lbl = tileLabel(p, dialog, scope);
      var g = mark(p.m, function (g) {
        g.setAttribute('class', 'em-ride'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
        g.setAttribute('aria-label', p.label + ' · ' + nameOf(p) + (live ? '' : ' · ' + t('coming')));
        var col = live ? (GROUP[p.group] || '#2e6da4') : '#9b8f7d';
        el('circle', { r: 15, cy: 2, fill: 'rgba(0,0,0,.25)' }, g);
        el('circle', { class: 'em-b', r: 14, fill: col, stroke: '#fbf8f1', 'stroke-width': 2.5, 'stroke-dasharray': live ? '' : '4 3' }, g);
        el('text', { y: 4.5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: '#fbf8f1', 'font-family': 'system-ui,sans-serif' }, g, String(p.no));
        var lb = el('g', { class: 'em-lbl' }, g);
        el('text', { y: 30, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#2a2016', stroke: '#fbf8f1', 'stroke-width': 3, 'paint-order': 'stroke', 'font-family': 'system-ui,sans-serif' }, lb,
          p.label.replace('of', t('of')));
        el('text', { y: 44, 'text-anchor': 'middle', 'font-size': 11, fill: '#4a3b28', stroke: '#fbf8f1', 'stroke-width': 3, 'paint-order': 'stroke', 'font-family': 'system-ui,sans-serif' }, lb,
          (live ? nameOf(p) : t('coming')) + (arg ? ' · ' + t('planned') : ''));
      });
      g.__p = p; g.__href = href; rides.push(g);
    });
    // compass
    var cmp = el('g', { transform: 'translate(' + (W - 60) + ',' + (H - 70) + ')' }, svg);
    el('path', { d: 'M0-24l7 20h-14z', fill: '#7a5a1e' }, cmp); el('text', { y: -28, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#4a3b28' }, cmp, 'N');
    // river label
    var rl = el('text', { 'font-size': 18, 'font-weight': 700, fill: '#1f4f75', 'letter-spacing': 3, dy: -18 }, world);
    var tp = el('textPath', { href: '#em-river-' + scope, startOffset: '28%' }, rl, t('river')); tp.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#em-river-' + scope);
    // controls
    var ctl = h('div', 'em-ctl', view);
    function btn(txt, label, fn, wide) { var b_ = h('button', wide ? 'em-wide' : '', ctl, txt); b_.type = 'button'; b_.setAttribute('aria-label', label); b_.onclick = fn; return b_; }
    btn('+', t('zin'), function () { zoomAt(1.6); }); btn('−', t('zout'), function () { zoomAt(1 / 1.6); }); btn('⤢', t('whole'), function () { setVB(full.slice()); });
    if (arg) h('div', 'em-banner', view, t('plannedBanner'));
    h('div', 'em-note', view, t('approx') + ' · H3 r' + d.h3.res + ' · ' + t('hint'));
    // pan / zoom on the viewBox
    var full = [0, 0, W, H], vb = full.slice();
    function setVB(v) {
      var minW = 120; if (v[2] < minW) { var c0 = v[0] + v[2] / 2, c1 = v[1] + v[3] / 2, s = minW / v[2]; v = [c0 - minW / 2, c1 - v[3] * s / 2, minW, v[3] * s]; }
      if (v[2] > W * 1.6) return; vb = v; svg.setAttribute('viewBox', v.map(function (n) { return n.toFixed(1); }).join(' ')); rescale();
    }
    function ppu() { var r = svg.getBoundingClientRect(); return Math.min(r.width / vb[2], r.height / vb[3]) || 1; }
    function rescale() {
      var z = full[2] / vb[2], k = (z >= 2.2 ? 1 : 0.62 + 0.17 * Math.min(z, 2.2)) / ppu(); marks.forEach(function (g) { g.setAttribute('transform', 'translate(' + sx(g.__q) + ',' + sy(g.__q) + ') scale(' + k.toFixed(3) + ')'); }); svg.classList.toggle('em-z2', z >= 2.2);
    }
    function toVB(cx, cy) { var r = svg.getBoundingClientRect(), s = ppu(), ox = (r.width - vb[2] * s) / 2, oy = (r.height - vb[3] * s) / 2; return [vb[0] + (cx - r.left - ox) / s, vb[1] + (cy - r.top - oy) / s]; }
    function zoomAt(f, cx, cy) {
      var r = svg.getBoundingClientRect(); if (cx == null) { cx = r.left + r.width / 2; cy = r.top + r.height / 2; }
      var p0 = toVB(cx, cy), nw = vb[2] / f, nh = vb[3] / f; setVB([p0[0] - (p0[0] - vb[0]) / f, p0[1] - (p0[1] - vb[1]) / f, nw, nh]);
    }
    svg.addEventListener('wheel', function (e) { e.preventDefault(); zoomAt(e.deltaY < 0 ? 1.2 : 1 / 1.2, e.clientX, e.clientY); }, { passive: false });
    var ptrs = {}, moved = 0, last = null, pinch = null;
    svg.addEventListener('pointerdown', function (e) { ptrs[e.pointerId] = [e.clientX, e.clientY]; moved = 0; last = [e.clientX, e.clientY]; var k = Object.keys(ptrs); if (k.length === 2) { var a = ptrs[k[0]], c = ptrs[k[1]]; pinch = Math.hypot(a[0] - c[0], a[1] - c[1]); } });
    svg.addEventListener('pointermove', function (e) {
      if (!ptrs[e.pointerId]) return; ptrs[e.pointerId] = [e.clientX, e.clientY]; var k = Object.keys(ptrs);
      if (k.length === 2 && pinch) { var a = ptrs[k[0]], c = ptrs[k[1]], dd = Math.hypot(a[0] - c[0], a[1] - c[1]); zoomAt(dd / pinch, (a[0] + c[0]) / 2, (a[1] + c[1]) / 2); pinch = dd; moved += 10; return; }
      if (k.length === 1 && last) { var s = ppu(), dx = e.clientX - last[0], dy = e.clientY - last[1]; moved += Math.abs(dx) + Math.abs(dy); last = [e.clientX, e.clientY]; if (moved > 4) setVB([vb[0] - dx / s, vb[1] - dy / s, vb[2], vb[3]]); }
    });
    function up(e) { delete ptrs[e.pointerId]; if (Object.keys(ptrs).length < 2) pinch = null; }
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    function pick(g) { if (!g) return; var p = g.__p; card(view, p, g.__href, scope); if (full[2] / vb[2] < 2.2) { var q = p.m, c = [+sx(q), +sy(q)], nw = full[2] / 3.2, nh = full[3] / 3.2; setVB([c[0] - nw / 2, c[1] - nh / 2, nw, nh]); } }
    svg.addEventListener('click', function (e) { if (moved > 8) return; var g = e.target.closest && e.target.closest('.em-ride'); if (g) pick(g); });
    svg.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { var g = e.target.closest && e.target.closest('.em-ride'); if (g) { e.preventDefault(); pick(g); } } });
    requestAnimationFrame(rescale); setTimeout(rescale, 150);
    view.__resize = rescale;
  }
  // ---------------- 3D (module, lazy) ----------------
  function map3d(view, d, scope, dialog) {
    view.innerHTML = ''; view.classList.add('em-3d'); h('div', 'em-load', view, t('loading'));
    import('/_cedwyn/estate-3d.js?v=' + V).then(function (m) {
      view.__dispose = m.mount(view, d, { scope: scope, lang: lang(), t: t, href: function (p) { return hrefFor(p, dialog, scope); }, card: function (p) { return card(view, p, hrefFor(p, dialog, scope), scope); }, name: nameOf });
    }).catch(function () { view.innerHTML = ''; h('div', 'em-load', view, t('nogl')); });
  }
  // ---------------- the switch ----------------
  function setup(dialog) {
    if (dialog.__em) return; dialog.__em = 1;
    var scope = /argentina/.test(dialog.id) ? 'argentina' : 'wales';
    var content = dialog.querySelector('.land-modal-content'); if (!content) return;
    var sw = h('div', 'em-switch'); sw.setAttribute('role', 'group'); sw.setAttribute('aria-label', t('views'));
    content.parentNode.insertBefore(sw, content);
    var view = h('div', 'em-view'); view.hidden = true; content.insertBefore(view, content.firstChild);
    var modes = [['tile', t('tile')], ['map', t('map')], ['3d', t('d3')]], buttons = {};
    function show(mode) {
      try { localStorage.setItem('cedwyn_map_view', mode); } catch (e) {}
      Object.keys(buttons).forEach(function (k) { buttons[k].setAttribute('aria-pressed', String(k === mode)); });
      [].forEach.call(content.querySelectorAll('.land-app-section'), function (s) { s.hidden = mode !== 'tile'; });
      if (view.__dispose) { try { view.__dispose(); } catch (e) {} view.__dispose = null; }
      view.classList.remove('em-3d');
      if (mode === 'tile') { view.hidden = true; view.innerHTML = ''; return; }
      view.hidden = false; view.innerHTML = ''; h('div', 'em-load', view, t('loading'));
      load().then(function (d) { if (mode === 'map') map2d(view, d, scope, dialog); else map3d(view, d, scope, dialog); })
        .catch(function () { view.hidden = true; show('tile'); });
    }
    modes.forEach(function (m) { var b = h('button', '', sw, m[1]); b.type = 'button'; b.setAttribute('aria-pressed', 'false'); b.onclick = function () { show(m[0]); }; buttons[m[0]] = b; });
    var start = 'tile'; try { start = localStorage.getItem('cedwyn_map_view') || 'tile'; } catch (e) {}
    if (/[?&]view=(map|3d|tile)/.test(location.search)) start = RegExp.$1;
    dialog.addEventListener('close', function () { if (view.__dispose) { try { view.__dispose(); } catch (e) {} view.__dispose = null; } });
    var opened = function () { show(buttons[start] ? start : 'tile'); };
    if (dialog.open) opened(); else dialog.__emOpen = opened;
  }
  function init() {
    css();
    [].forEach.call(document.querySelectorAll('dialog.land-modal'), function (dl) {
      setup(dl);
      new MutationObserver(function () { if (dl.open && dl.__emOpen) { var f = dl.__emOpen; dl.__emOpen = null; f(); } else if (dl.open) { var v = dl.querySelector('.em-view'); if (v && v.__resize) v.__resize(); } }).observe(dl, { attributes: true, attributeFilter: ['open'] });
    });
    window.CedwynEstateMaps = { version: V, data: load };
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
