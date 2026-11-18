/* Mr Wolf v4.0.1 · Legal Threshold Tree. The law is the tree (legal-tree.json); the evidence is the foliage (evidence-links.json).
   Leaf content is read at open time from each record's own source: the central catalogue (/api/catalogue/{id}),
   That Old Chestnut (its _db/view.json), Dartboard (its foi-tracker.csv) or the research mirror. No second evidence database. */
(function () {
  'use strict';
  /* ---------------- view toggle: Tree (default) | Gauges. Remembered per viewer; ?view=gauges or a #MW-NN link opens gauges. */
  var VIEWS = ['tree', 'gauges'];
  function setView(v, push) {
    if (VIEWS.indexOf(v) < 0) v = 'tree';
    document.body.setAttribute('data-view', v);
    document.querySelectorAll('[data-view-btn]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view-btn') === v)); });
    document.querySelectorAll('.mw-view').forEach(function (s) { s.hidden = s.id !== 'view-' + v; });
    try { localStorage.setItem('mw-view', v); } catch (e) { /* storage unavailable */ }
    if (push) { try { var u = new URL(location.href); u.searchParams.set('view', v); if ((v === 'tree' && /^#MW-/i.test(u.hash)) || (v === 'gauges' && /^#tree/.test(u.hash))) u.hash = ''; history.replaceState(null, '', u.toString()); } catch (e) { /* ignore */ } }
    document.dispatchEvent(new CustomEvent('mw:view', { detail: v }));
  }
  (function () {
    var q = null; try { q = new URL(location.href).searchParams.get('view'); } catch (e) { /* ignore */ }
    var saved = null; try { saved = localStorage.getItem('mw-view'); } catch (e) { /* ignore */ }
    var v = q || (/^#MW-\d+/i.test(location.hash) ? 'gauges' : /^#tree/.test(location.hash) ? 'tree' : saved) || 'tree';
    document.querySelectorAll('[data-view-btn]').forEach(function (b) { b.addEventListener('click', function () { setView(b.getAttribute('data-view-btn'), true); }); });
    setView(v, false);
  })();
  var root = document.getElementById('tw'); if (!root) return;
  var SVGNS = 'http://www.w3.org/2000/svg';
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var ok = function (r) { if (!r.ok) throw new Error(r.status + ' ' + r.url); return r.json(); };
  var NODEW = 124, LEAFW = 20, VH = 168, LEAFROW = 3, TW = 0.6, DOME = 260, ORDER = ['D', 'F', 'C', 'G', 'R', 'E'];
  var COL = { green: '#3d7a3a', orange: '#d08a2e', red: '#b23a2e', brown: '#7b5a3c', black: '#232020', grey: '#a8a296' };
  var STAT_SHORT = { not_established: 'Not established', partial: 'Partially evidenced', strong: 'Strongly evidenced', blocked: 'Procedurally blocked', legal_determination: 'Requires legal determination', research_required: 'Research required' };
  var ADVERSE = { contradicts: 1, undermines: 1 };

  var T, LK, NODES = {}, KIDS = {}, LEAVES = {}, BYREC = {}, collapsed = {}, pos = {}, view = { x: 0, y: 0, k: 1 }, bounds;
  var filt = { strength: {}, relation: {}, source: {}, branch: {} }, query = '';
  var svg, gWorld, gLabels, dlg, hist = [], cache = {}, srcCache = {};

  function el(tag, attrs, parent) { var n = document.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; }
  function top(id) { var n = NODES[id]; while (n && n.parent && n.parent !== 'T') n = NODES[n.parent]; return n ? n.id : id; }
  function pathTo(id) { var p = [], n = NODES[id]; while (n) { p.unshift(n); n = NODES[n.parent]; } return p; }
  function desc(id, out) { out = out || []; (KIDS[id] || []).forEach(function (c) { out.push(c); desc(c, out); }); return out; }

  Promise.all([
    fetch('legal-tree.json', { cache: 'no-cache' }).then(ok),
    fetch('evidence-links.json', { cache: 'no-cache' }).then(ok)
  ]).then(function (r) {
    T = r[0]; LK = r[1];
    T.nodes.forEach(function (n) { n.authority = (n.authority || []).map(function (k) { return typeof k === 'string' ? T.authorities[k] : k; }).filter(Boolean); NODES[n.id] = n; KIDS[n.id] = []; LEAVES[n.id] = []; });
    T.nodes.forEach(function (n) { if (n.parent) KIDS[n.parent].push(n.id); });
    KIDS.T.sort(function (a, b) { return (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99); });
    LK.links.forEach(function (l, i) { l.i = i; LEAVES[l.node].push(l); (BYREC[l.record] = BYREC[l.record] || []).push(l); });
    Object.keys(LK.strengths).forEach(function (k) { filt.strength[k] = true; });
    Object.keys(LK.relations).forEach(function (k) { filt.relation[k] = true; });
    Object.keys(LK.sources).forEach(function (k) { filt.source[k] = true; });
    KIDS.T.forEach(function (k) { filt.branch[k] = true; });
    build();
  }).catch(function (err) {
    root.innerHTML = '<p class="tw-err">The legal tree could not load (' + E(err.message) + '). The <a href="?view=gauges">gauge view</a> still works.</p>';
  });

  /* ---------------- layout: an upward tree; trunk at the bottom, domestic branches left, Strasbourg right */
  function layout() {
    pos = {}; var x = 0;
    function width(id) {
      var k = (KIDS[id] || []).filter(function () { return !collapsed[id]; });
      var lw = Math.min(LEAVES[id].length, LEAFROW) * LEAFW + 24;
      if (!k.length) return Math.max(NODEW * TW, lw);
      return Math.max(k.reduce(function (s, c) { return s + width(c); }, 0), NODEW);
    }
    function place(id, d, j) {
      var k = collapsed[id] ? [] : KIDS[id], w = width(id);
      if (!k.length) { pos[id] = { x: x + w / 2, y: -d * VH, d: d, up: j % 2 ? 0.46 : 0 }; x += w; return; }
      var start = x, inner = k.reduce(function (s, c) { return s + width(c); }, 0);
      if (w > inner) x += (w - inner) / 2;
      k.forEach(function (c, i) { place(c, d + 1, i); });
      if (w > inner) x = start + w;
      pos[id] = { x: (pos[k[0]].x + pos[k[k.length - 1]].x) / 2, y: -d * VH, d: d };
    }
    place('T', 0, 0);
    var dx = pos.T.x; Object.keys(pos).forEach(function (id) { pos[id].x -= dx; });
    // crown: deeper levels higher, and a dome so the middle of the crown rises above its edges
    var X = Math.max.apply(0, Object.keys(pos).map(function (id) { return Math.abs(pos[id].x); })) + NODEW;
    Object.keys(pos).forEach(function (id) { var p = pos[id]; if (!p.d) return; var u = p.x / X; p.y = -(190 + (p.d - 1) * VH) - DOME * (1 - u * u) - (p.up || 0) * VH; });
    var xs = Object.keys(pos).map(function (id) { return pos[id].x; });
    var ys = Object.keys(pos).map(function (id) { return pos[id].y; });
    bounds = { x0: Math.min.apply(0, xs) - NODEW, x1: Math.max.apply(0, xs) + NODEW, y0: Math.min.apply(0, ys) - 150, y1: 260 };
  }
  function leafPos(id, j, n) {
    var p = pos[id], cols = Math.min(n, LEAFROW), row = Math.floor(j / LEAFROW), col = j % LEAFROW;
    var internal = !collapsed[id] && KIDS[id].length;
    var cx = p.x + (col - (cols - 1) / 2) * LEAFW + (row % 2 ? LEAFW / 2 : 0);
    var cy = p.y - (internal ? 46 : 52) - row * 19;
    if (internal) cx = p.x - 34 - col * LEAFW, cy = p.y - 30 - row * 19;
    return { x: cx, y: cy, a: ((j * 47 + id.length * 13) % 70) - 35 };
  }

  /* ---------------- drawing */
  function branchPath(a, b) {
    var my = a.y - (a.y - b.y) * 0.55;
    return 'M' + a.x + ' ' + a.y + ' C' + a.x + ' ' + my + ' ' + b.x + ' ' + (b.y + (a.y - b.y) * 0.3) + ' ' + b.x + ' ' + b.y;
  }
  function shape(n, g) {
    var k = n.kind, cls = 'tw-n tw-' + n.status;
    if (k === 'trunk') return el('circle', { r: 15, 'class': cls + ' tw-trunkbox' }, g);
    if (k === 'pathway') return el('rect', { x: -13, y: -13, width: 26, height: 26, rx: 13, 'class': cls }, g);
    if (k === 'gateway') return el('path', { d: 'M0 -13 L13 0 L0 13 L-13 0 Z', 'class': cls }, g);
    if (k === 'test') return el('rect', { x: -11, y: -11, width: 22, height: 22, rx: 5, 'class': cls }, g);
    if (k === 'obstacle') return el('path', { d: 'M-4 -10 L4 -10 L10 -4 L10 4 L4 10 L-4 10 L-10 4 L-10 -4 Z', 'class': cls }, g);
    return el('circle', { r: 8.5, 'class': cls + (k === 'evidential' ? ' tw-evid' : '') }, g);
  }
  function leafShape(l, g, a) {
    var d = 'M0 -9 C6 -5 6 5 0 9 C-6 5 -6 -5 0 -9 Z';
    var p = el('path', { d: d, transform: 'rotate(' + a + ')', 'class': 'tw-lf tw-r-' + l.relation, fill: l.relation === 'missing' ? 'none' : COL[l.strength], stroke: l.relation === 'missing' ? COL.grey : (ADVERSE[l.relation] ? '#5a1414' : 'rgba(43,36,24,.45)') }, g);
    if (l.relation !== 'missing') el('path', { d: 'M0 -7 L0 7', transform: 'rotate(' + a + ')', 'class': 'tw-rib' }, g);
    if (ADVERSE[l.relation]) el('path', { d: 'M-4 -4 L4 4 M4 -4 L-4 4', 'class': 'tw-x' }, g);
    return p;
  }
  function leafLabel(l) {
    return l.record.replace(/^RM:.*/, 'Research mirror') + ', ' + LK.strengths[l.strength].split(':')[0] + ', ' + LK.relations[l.relation] + ': ' + l.proposition;
  }

  function draw() {
    layout();
    while (gWorld.firstChild) gWorld.removeChild(gWorld.firstChild);
    var bands = el('g', { 'class': 'tw-bands' }, gWorld), gB = el('g', {}, gWorld), gL = el('g', {}, gWorld), gN = el('g', {}, gWorld);
    // pathway bands
    var groups = [['Domestic courts (England and Wales)', ['D', 'F', 'C', 'G'], 'dom'], ['Separate remedy', ['R'], 'rem'], ['European pathway (Strasbourg)', ['E'], 'eu']];
    groups.forEach(function (gr) {
      var ids = []; gr[1].forEach(function (b) { if (pos[b]) { ids.push(b); desc(b).forEach(function (d) { if (pos[d]) ids.push(d); }); } });
      if (!ids.length) return;
      var xs = ids.map(function (i) { return pos[i].x; }), x0 = Math.min.apply(0, xs) - NODEW / 2 + 6, x1 = Math.max.apply(0, xs) + NODEW / 2 - 6;
      var yb = Math.max.apply(0, ids.map(function (i) { return pos[i].y; })) + 60;
      el('rect', { x: x0, y: bounds.y0 + 10, width: x1 - x0, height: yb - bounds.y0 - 10, rx: 22, 'class': 'tw-band tw-band-' + gr[2] }, bands);
      var t = el('text', { x: (x0 + x1) / 2, y: bounds.y0 + 70, 'class': 'tw-bandt', 'text-anchor': 'middle' }, bands); t.textContent = gr[0];
      t.style.fontSize = Math.min(64, (x1 - x0 - 30) / (gr[0].length * 0.55)) + 'px';
    });
    // ground and trunk
    el('path', { d: 'M-260 232 Q0 208 260 232', 'class': 'tw-ground' }, gB);
    el('path', { d: 'M-46 230 C-26 170 -20 80 -16 0 L16 0 C20 80 26 170 46 230 Z', 'class': 'tw-trunk' }, gB);
    el('path', { d: 'M-46 230 C-70 236 -96 240 -120 238 M46 230 C70 236 96 240 120 238', 'class': 'tw-br', 'stroke-width': 7 }, gB);
    // branches
    T.nodes.forEach(function (n) {
      if (!n.parent || !pos[n.id] || !pos[n.parent]) return;
      var d = pos[n.id].d, w = [0, 13, 7.5, 4.2, 2.6][d] || 2;
      el('path', { d: branchPath(pos[n.parent], pos[n.id]), 'stroke-width': w, 'class': 'tw-br' + (n.pathway === 'echr' ? ' tw-br-eu' : n.pathway === 'remedy' ? ' tw-br-rem' : '') }, gB);
    });
    // leaves (twigs then foliage)
    T.nodes.forEach(function (n) {
      if (!pos[n.id]) return;
      var ls = LEAVES[n.id], p = pos[n.id];
      ls.forEach(function (l, j) {
        var q = leafPos(n.id, j, ls.length);
        el('path', { d: 'M' + p.x + ' ' + p.y + ' Q' + p.x + ' ' + (q.y + 12) + ' ' + q.x + ' ' + q.y, 'class': 'tw-twig' }, gB);
        var g = el('g', { transform: 'translate(' + q.x + ' ' + q.y + ')', tabindex: '0', role: 'button', 'class': 'tw-leaf', 'data-tw': 'L' + l.i, 'aria-label': 'Evidence leaf: ' + leafLabel(l) }, gL);
        el('title', {}, g).textContent = l.record + ' · ' + LK.strengths[l.strength].split(':')[0] + ' · ' + LK.relations[l.relation];
        leafShape(l, g, q.a);
        l._g = g; l._p = q;
      });
    });
    // nodes
    T.nodes.forEach(function (n) {
      if (!pos[n.id]) return;
      var p = pos[n.id];
      var g = el('g', { transform: 'translate(' + p.x + ' ' + p.y + ')', tabindex: '0', role: 'button', 'class': 'tw-node tw-k-' + n.kind, 'data-tw': 'N' + n.id,
        'aria-label': (T.kinds[n.kind] || '') + ': ' + n.title + '. Status: ' + STAT_SHORT[n.status] + '. ' + LEAVES[n.id].length + ' evidence leaves.' }, gN);
      el('title', {}, g).textContent = n.title + ' · ' + STAT_SHORT[n.status];
      shape(n, g);
      if (n.status === 'blocked') el('path', { d: 'M-6 6 L6 -6', 'class': 'tw-slash' }, g);
      if (n.status === 'legal_determination') { var q = el('text', { y: 4, 'class': 'tw-glyph', 'text-anchor': 'middle' }, g); q.textContent = '§'; }
      if (n.status === 'research_required') { var r2 = el('text', { y: 4, 'class': 'tw-glyph', 'text-anchor': 'middle' }, g); r2.textContent = '?'; }
      if (KIDS[n.id].length && n.id !== 'T') {
        var tg = el('g', { transform: 'translate(' + (n.kind === 'pathway' ? 22 : 19) + ' -4)', 'class': 'tw-tg', 'data-tw-toggle': n.id, role: 'button', tabindex: '0', 'aria-label': (collapsed[n.id] ? 'Expand ' : 'Collapse ') + n.label }, g);
        el('circle', { r: 7 }, tg); var tt = el('text', { y: 3.5, 'text-anchor': 'middle' }, tg); tt.textContent = collapsed[n.id] ? '+' : '−';
      }
      n._g = g;
    });
    drawLabels(); applyFilter(); applyView();
  }

  function wrap(s, max) {
    var w = s.split(' '), lines = [''];
    w.forEach(function (x) { var c = lines[lines.length - 1]; if ((c + ' ' + x).trim().length > max && c) lines.push(x); else lines[lines.length - 1] = (c + ' ' + x).trim(); });
    return lines.slice(0, 3);
  }
  function drawLabels() {
    while (gLabels.firstChild) gLabels.removeChild(gLabels.firstChild);
    T.nodes.forEach(function (n) {
      if (!pos[n.id]) return;
      var d = pos[n.id].d, t = el('text', { 'class': 'tw-lbl tw-d' + Math.min(d, 3) + (n.kind === 'trunk' ? ' tw-lbl-trunk' : ''), 'text-anchor': 'middle', 'aria-hidden': 'true', 'data-tw': 'N' + n.id }, gLabels);
      wrap(n.label, d <= 1 ? 14 : 16).forEach(function (line, i) { var s = el('tspan', { x: 0, dy: i ? '1.15em' : 0 }, t); s.textContent = line; });
      n._lbl = t;
      if (n.short) { var ts = el('text', { 'class': 'tw-lbl tw-d1 tw-short', 'text-anchor': 'middle', 'aria-hidden': 'true', 'data-tw': 'N' + n.id }, gLabels); ts.textContent = n.short; n._short = ts; }
    });
  }
  function applyView() {
    gWorld.setAttribute('transform', 'translate(' + view.x + ' ' + view.y + ') scale(' + view.k + ')');
    var fs = Math.min(11.5, NODEW * 1.15 * view.k / 9.5);
    T.nodes.forEach(function (n) {
      if (!n._lbl || !pos[n.id]) return;
      var p = pos[n.id], vis = p.d <= 1 || fs >= 7 || n._sel;
      if (p.d >= 2) n._lbl.style.fontSize = Math.max(fs, n._sel ? 11 : 0) + 'px';
      var sx = view.x + p.x * view.k, sy = view.y + p.y * view.k + (n.kind === 'trunk' ? 4 : (n.kind === 'pathway' ? 26 : 20) * Math.max(view.k, 0.6));
      if (n.kind === 'trunk') sy = view.y + 262 * view.k + 14;
      n._lbl.setAttribute('transform', 'translate(' + sx.toFixed(1) + ' ' + sy.toFixed(1) + ')');
      var small = n._short && view.k < 0.2;
      n._lbl.style.display = vis && !small ? '' : 'none';
      if (n._short) {
        var odd = KIDS.T.indexOf(n.id) % 2;
        n._short.style.display = small ? '' : 'none';
        n._short.setAttribute('transform', 'translate(' + sx.toFixed(1) + ' ' + (view.y + p.y * view.k + (odd ? -14 : 22)).toFixed(1) + ')');
      }
    });
    var zl = root.querySelector('.tw-zl'); if (zl) zl.textContent = Math.round(view.k * 100) + '%';
  }
  function fit(ids) {
    var r = svg.getBoundingClientRect(), b = bounds;
    if (ids) {
      var xs = [], ys = []; ids.forEach(function (i) { if (pos[i]) { xs.push(pos[i].x); ys.push(pos[i].y); } });
      b = { x0: Math.min.apply(0, xs) - NODEW * 0.75, x1: Math.max.apply(0, xs) + NODEW * 0.75, y0: Math.min.apply(0, ys) - 120, y1: Math.max.apply(0, ys) + 60 };
    }
    var k = Math.min(r.width / (b.x1 - b.x0), r.height / (b.y1 - b.y0)) * 0.94;
    view.k = Math.max(0.08, Math.min(ids ? 1.6 : 1.2, k));
    view.x = r.width / 2 - (b.x0 + b.x1) / 2 * view.k; view.y = r.height / 2 - (b.y0 + b.y1) / 2 * view.k;
    applyView();
  }
  function zoomAt(f, cx, cy) {
    var r = svg.getBoundingClientRect(); if (cx == null) { cx = r.width / 2; cy = r.height / 2; }
    var k = Math.max(0.06, Math.min(3, view.k * f)); f = k / view.k;
    view.x = cx - (cx - view.x) * f; view.y = cy - (cy - view.y) * f; view.k = k; applyView();
  }
  function centreOn(x, y, k) {
    var r = svg.getBoundingClientRect(); if (k) view.k = k;
    view.x = r.width / 2 - x * view.k; view.y = r.height / 2 - y * view.k; applyView();
  }

  /* ---------------- filters and search */
  function leafOn(l) {
    var hit = !query || (l.record + ' ' + l.proposition + ' ' + l.reason + ' ' + (NODES[l.node].label)).toLowerCase().indexOf(query) > -1;
    return filt.strength[l.strength] && filt.relation[l.relation] && filt.source[l.source] && filt.branch[top(l.node)] !== false && hit;
  }
  function applyFilter() {
    var n = 0;
    LK.links.forEach(function (l) { if (!l._g) return; var on = leafOn(l); if (on) n++; l._g.classList.toggle('tw-dim', !on); });
    T.nodes.forEach(function (nd) {
      if (!nd._g) return; var b = top(nd.id);
      var on = nd.id === 'T' || filt.branch[b] !== false;
      if (query) on = on && (nd.title + ' ' + nd.label + ' ' + nd.id).toLowerCase().indexOf(query) > -1 || LEAVES[nd.id].some(function (l) { return leafOn(l); });
      nd._g.classList.toggle('tw-dim', !on);
    });
    var c = root.querySelector('.tw-count'); if (c) c.textContent = n + ' of ' + LK.links.length + ' leaves shown';
  }
  function searchResults(q) {
    var out = [];
    if (!q) return out;
    T.nodes.forEach(function (n) { if ((n.title + ' ' + n.id + ' ' + (n.authority || []).map(function (a) { return a.cite; }).join(' ')).toLowerCase().indexOf(q) > -1) out.push({ t: 'N', n: n }); });
    LK.links.forEach(function (l) { if ((l.record + ' ' + l.proposition + ' ' + l.reason + ' ' + ((cache[l.record] || {}).title || '')).toLowerCase().indexOf(q) > -1) out.push({ t: 'L', l: l }); });
    return out.slice(0, 14);
  }

  /* ---------------- build UI */
  function build() {
    var cnt = {}; LK.links.forEach(function (l) { cnt[l.strength] = (cnt[l.strength] || 0) + 1; });
    var leafKey = Object.keys(LK.strengths).map(function (k) {
      return '<span class="tw-key"><svg width="12" height="16" viewBox="-7 -10 14 20" aria-hidden="true"><path d="M0 -9 C6 -5 6 5 0 9 C-6 5 -6 -5 0 -9 Z" fill="' + (k === 'grey' ? 'none' : COL[k]) + '" stroke="' + (k === 'grey' ? COL.grey : 'rgba(43,36,24,.45)') + '"/></svg>' + E(LK.strengths[k].split(':')[0]) + ' <b>' + (cnt[k] || 0) + '</b></span>';
    }).join('');
    root.innerHTML =
      '<div class="tw-bar" role="toolbar" aria-label="Tree controls">' +
      '<div class="tw-search"><input type="search" placeholder="Search records, tests, authorities" aria-label="Search the tree" autocomplete="off"><div class="tw-res" role="listbox" hidden></div></div>' +
      '<button type="button" class="tw-b" data-act="filter" aria-expanded="false">Filter</button>' +
      '<button type="button" class="tw-b" data-act="outline" aria-expanded="false">Outline</button>' +
      '<span class="tw-zoom"><button type="button" class="tw-b tw-ic" data-act="out" aria-label="Zoom out">−</button><span class="tw-zl" aria-live="polite"></span><button type="button" class="tw-b tw-ic" data-act="in" aria-label="Zoom in">+</button>' +
      '<button type="button" class="tw-b" data-act="reset" aria-label="Reset view">Reset</button><button type="button" class="tw-b tw-ic tw-i" data-act="legend" aria-label="How to read the tree">i</button></span></div>' +
      '<div class="tw-panel tw-filters" hidden></div><div class="tw-panel tw-outline" hidden></div>' +
      '<div class="tw-stage"><svg class="tw-svg" role="group" aria-label="Legal threshold tree. Use Tab to move between legal requirements and evidence leaves, Enter to open, plus and minus to zoom, arrow keys to pan." tabindex="0"><g class="tw-world"></g><g class="tw-labels"></g></svg>' +
      '<div class="tw-keyrow" aria-label="Leaf strength counts">' + leafKey + '<span class="tw-count"></span></div></div>' +
      '<div class="tw-dlgs"></div>';
    svg = root.querySelector('svg'); gWorld = root.querySelector('.tw-world'); gLabels = root.querySelector('.tw-labels');
    buildFilters(); buildOutline(); draw(); fit();
    window.addEventListener('resize', function () { if (root.offsetParent) applyView(); });
    document.addEventListener('mw:view', function (e) { if (e.detail === 'tree') setTimeout(function () { fit(); }, 30); });
    bindPanZoom(); bindUi();
    var h = decodeURIComponent(location.hash.slice(1));
    var m = /^tree\/(N|R)\/(.+)$/.exec(h);
    if (m && m[1] === 'N' && NODES[m[2]]) openNode(m[2]); else if (m && m[1] === 'R' && BYREC[m[2]]) openLeaf(BYREC[m[2]][0]);
  }
  function buildFilters() {
    var p = root.querySelector('.tw-filters');
    function grp(title, key, dict, count) {
      return '<fieldset><legend>' + title + '</legend>' + Object.keys(dict).map(function (k) {
        return '<label><input type="checkbox" data-f="' + key + '" value="' + E(k) + '" checked> ' + E(typeof dict[k] === 'string' ? dict[k].split(':')[0] : dict[k].label || dict[k]) + ' <span class="m-note">' + (count(k) || 0) + '</span></label>';
      }).join('') + '</fieldset>';
    }
    var c = function (f) { return function (k) { return LK.links.filter(function (l) { return f(l) === k; }).length; }; };
    var br = {}; KIDS.T.forEach(function (k) { br[k] = NODES[k].label; });
    p.innerHTML = grp('Evidence strength', 'strength', LK.strengths, c(function (l) { return l.strength; })) +
      grp('Relationship', 'relation', LK.relations, c(function (l) { return l.relation; })) +
      grp('Branch', 'branch', br, c(function (l) { return top(l.node); })) +
      grp('Source', 'source', LK.sources, c(function (l) { return l.source; })) +
      '<button type="button" class="tw-b" data-act="clearf">Show all</button>';
  }
  function buildOutline() {
    var p = root.querySelector('.tw-outline');
    function li(id) {
      var n = NODES[id], ks = KIDS[id], ls = LEAVES[id];
      var head = '<button type="button" class="tw-ol-n" data-tw="N' + id + '"><span class="tw-st tw-st-' + n.status + '">' + E(STAT_SHORT[n.status]) + '</span> ' + E(n.title) + '</button>';
      var leaves = ls.length ? '<ul class="tw-ol-l">' + ls.map(function (l) { return '<li><button type="button" data-tw="L' + l.i + '"><span class="tw-sw" style="background:' + (l.relation === 'missing' ? 'transparent' : COL[l.strength]) + '"></span>' + E(l.record.replace(/^RM:.*/, 'Research mirror')) + ' · ' + E(LK.relations[l.relation]) + ' · ' + E(l.proposition) + '</button></li>'; }).join('') + '</ul>' : '';
      if (!ks.length) return '<li>' + head + leaves + '</li>';
      return '<li><details' + (id === 'T' ? ' open' : '') + '><summary>' + E(n.label) + ' <span class="m-note">' + E(STAT_SHORT[n.status]) + '</span></summary>' + head + leaves + '<ul>' + ks.map(li).join('') + '</ul></details></li>';
    }
    p.innerHTML = '<p class="m-note">The same tree as an outline, for reading on a small screen or with a screen reader.</p><ul class="tw-ol">' + li('T') + '</ul>';
  }

  function bindPanZoom() {
    var pts = {}, last = null, pinch = null, moved = 0;
    svg.addEventListener('pointerdown', function (e) { pts[e.pointerId] = { x: e.clientX, y: e.clientY }; moved = 0; if (Object.keys(pts).length === 1) last = { x: e.clientX, y: e.clientY }; });
    svg.addEventListener('pointermove', function (e) {
      if (!pts[e.pointerId]) return; pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var ids = Object.keys(pts);
      if (ids.length === 2) {
        var a = pts[ids[0]], b = pts[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y), r = svg.getBoundingClientRect();
        if (pinch) zoomAt(d / pinch, (a.x + b.x) / 2 - r.left, (a.y + b.y) / 2 - r.top);
        pinch = d; moved += 10; return;
      }
      if (!last) return;
      var dx = e.clientX - last.x, dy = e.clientY - last.y; moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 4) { if (!svg.hasPointerCapture(e.pointerId)) try { svg.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } view.x += dx; view.y += dy; applyView(); }
      last = { x: e.clientX, y: e.clientY };
    });
    function up(e) { delete pts[e.pointerId]; if (Object.keys(pts).length < 2) pinch = null; if (!Object.keys(pts).length) last = null; }
    svg.addEventListener('pointerup', up); svg.addEventListener('pointercancel', up);
    svg.addEventListener('click', function (e) { if (moved > 6) { e.stopPropagation(); e.preventDefault(); } }, true);
    svg.addEventListener('wheel', function (e) { e.preventDefault(); var r = svg.getBoundingClientRect(); zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top); }, { passive: false });
    svg.addEventListener('keydown', function (e) {
      var s = 60;
      if (e.key === '+' || e.key === '=') zoomAt(1.25); else if (e.key === '-' || e.key === '_') zoomAt(0.8);
      else if (e.key === 'ArrowLeft') { view.x += s; applyView(); } else if (e.key === 'ArrowRight') { view.x -= s; applyView(); }
      else if (e.key === 'ArrowUp') { view.y += s; applyView(); } else if (e.key === 'ArrowDown') { view.y -= s; applyView(); }
      else if (e.key === '0') fit(); else return;
      e.preventDefault();
    });
    svg.addEventListener('focusin', function (e) {
      var g = e.target.closest && e.target.closest('[data-tw]'); if (!g) return;
      var m = /translate\(([-\d.]+) ([-\d.]+)\)/.exec(g.getAttribute('transform') || ''); if (!m) return;
      var x = +m[1], y = +m[2];
      var r = svg.getBoundingClientRect(), sx = view.x + x * view.k, sy = view.y + y * view.k;
      if (sx < 30 || sy < 30 || sx > r.width - 30 || sy > r.height - 30) centreOn(x, y, Math.max(view.k, 0.7));
    });
  }

  function bindUi() {
    root.addEventListener('click', function (e) {
      var tg = e.target.closest('[data-tw-toggle]');
      if (tg) { e.stopPropagation(); toggle(tg.getAttribute('data-tw-toggle')); return; }
      var t = e.target.closest('[data-tw]');
      if (t) { e.preventDefault(); act(t.getAttribute('data-tw')); return; }
      var b = e.target.closest('[data-act]'); if (!b) return;
      var a = b.getAttribute('data-act');
      if (a === 'in') zoomAt(1.3); else if (a === 'out') zoomAt(1 / 1.3); else if (a === 'reset') { collapsed = {}; draw(); fit(); }
      else if (a === 'legend') legend();
      else if (a === 'filter' || a === 'outline') {
        var p = root.querySelector('.tw-' + (a === 'filter' ? 'filters' : 'outline')), open = p.hidden;
        root.querySelectorAll('.tw-panel').forEach(function (x) { x.hidden = true; }); root.querySelectorAll('[data-act=filter],[data-act=outline]').forEach(function (x) { x.setAttribute('aria-expanded', 'false'); });
        p.hidden = !open; b.setAttribute('aria-expanded', String(open));
      } else if (a === 'clearf') { root.querySelectorAll('[data-f]').forEach(function (x) { x.checked = true; filt[x.getAttribute('data-f')][x.value] = true; }); applyFilter(); }
    });
    root.addEventListener('keydown', function (e) {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-tw-toggle]')) { e.preventDefault(); e.stopPropagation(); toggle(e.target.getAttribute('data-tw-toggle')); return; }
      if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('g[data-tw]')) { e.preventDefault(); act(e.target.getAttribute('data-tw')); }
    });
    root.addEventListener('change', function (e) { var f = e.target.getAttribute('data-f'); if (f) { filt[f][e.target.value] = e.target.checked; applyFilter(); } });
    var inp = root.querySelector('.tw-search input'), res = root.querySelector('.tw-res');
    inp.addEventListener('input', function () {
      query = inp.value.trim().toLowerCase(); applyFilter();
      var rs = searchResults(query);
      res.hidden = !rs.length;
      res.innerHTML = rs.map(function (r) {
        return r.t === 'N' ? '<button type="button" role="option" data-tw="N' + r.n.id + '"><b>' + E(T.kinds[r.n.kind]) + '</b> ' + E(r.n.title) + '</button>'
          : '<button type="button" role="option" data-tw="L' + r.l.i + '"><b>' + E(r.l.record.replace(/^RM:.*/, 'Research mirror')) + '</b> ' + E(r.l.proposition) + ' <span class="m-note">→ ' + E(NODES[r.l.node].label) + '</span></button>';
      }).join('');
    });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Escape') { inp.value = ''; query = ''; res.hidden = true; applyFilter(); } if (e.key === 'ArrowDown') { var f = res.querySelector('button'); if (f) { e.preventDefault(); f.focus(); } } });
    res.addEventListener('click', function () { res.hidden = true; });
  }
  function toggle(id) {
    collapsed[id] = !collapsed[id];
    var before = pos[id] ? { x: view.x + pos[id].x * view.k, y: view.y + pos[id].y * view.k } : null;
    draw();
    if (before && pos[id]) { view.x = before.x - pos[id].x * view.k; view.y = before.y - pos[id].y * view.k; applyView(); }
    var g = NODES[id]._g && NODES[id]._g.querySelector('[data-tw-toggle]'); if (g) g.focus();
  }
  function act(code) {
    if (code[0] === 'N') { var id = code.slice(1); select(id); openNode(id); }
    else { var l = LK.links[+code.slice(1)]; openLeaf(l); }
  }
  function select(id) {
    T.nodes.forEach(function (n) { if (n._g) n._g.classList.toggle('tw-sel', n.id === id); n._sel = n.id === id; });
    applyView();
  }
  function expandTo(id) { var changed = false; pathTo(id).forEach(function (n) { if (collapsed[n.id]) { collapsed[n.id] = false; changed = true; } }); if (changed) draw(); }

  /* ---------------- modal */
  function modal(html, sub, title) {
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'm tw-m'; dlg.setAttribute('aria-labelledby', 'tw-dh');
      root.querySelector('.tw-dlgs').appendChild(dlg);
      dlg.addEventListener('click', function (e) {
        if (e.target === dlg || e.target.closest('[data-close]')) { dlg.close(); return; }
        if (e.target.closest('[data-back]')) { hist.pop(); var p = hist.pop(); if (p) p(); return; }
        var t = e.target.closest('[data-tw]'); if (t) { e.preventDefault(); act(t.getAttribute('data-tw')); return; }
        var r = e.target.closest('[data-rec]'); if (r) { e.preventDefault(); openRecord(r.getAttribute('data-rec')); return; }
        var x = e.target.closest('[data-expand]'); if (x) { var id = x.getAttribute('data-expand'); collapsed[id] = !collapsed[id]; draw(); x.textContent = collapsed[id] ? 'Expand this branch' : 'Collapse this branch'; return; }
        var z = e.target.closest('[data-zoomto]'); if (z) { var zid = z.getAttribute('data-zoomto'); dlg.close(); expandTo(zid); fit([zid].concat(desc(zid))); select(zid); }
      });
      dlg.addEventListener('close', function () { hist = []; try { history.replaceState(null, '', location.pathname + location.search + '#tree'); } catch (e) { /* ignore */ } });
    }
    dlg.innerHTML = '<div class="m-in"><button type="button" class="m-x" data-close aria-label="Close">×</button>' +
      (hist.length > 1 ? '<button type="button" class="tw-back" data-back>← Back</button>' : '') +
      (sub ? '<p class="m-sub">' + sub + '</p>' : '') + '<h2 id="tw-dh">' + title + '</h2>' + html + '</div>';
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }
  function statusChip(s) { return '<span class="tw-st tw-st-' + s + '">' + E(STAT_SHORT[s]) + '</span>'; }
  function strengthChip(l) { return '<span class="tw-chip" style="--c:' + COL[l.strength] + '"><i></i>' + E(LK.strengths[l.strength].split(':')[0]) + '</span> <span class="tw-rel tw-rel-' + l.relation + '">' + E(LK.relations[l.relation]) + '</span>'; }
  function auths(list) {
    if (!list || !list.length) return '<p class="m-note">No separate authority: an evidential requirement under the test above.</p>';
    return '<ul class="tw-auth">' + list.map(function (a) {
      return '<li><b>' + (a.url ? '<a href="' + E(a.url) + '" target="_blank" rel="noopener">' + E(a.cite) + '</a>' : E(a.cite)) + '</b>' + (a.pin ? ', ' + E(a.pin) : '') +
        '<span class="m-note">' + [a.jurisdiction, a.date].filter(Boolean).map(E).join(' · ') + ' · <span class="tw-ver tw-ver-' + E(a.verified) + '">' + E(T.verified[a.verified] || a.verified) + '</span>' + (a.note ? ' · ' + E(a.note) : '') + '</span></li>';
    }).join('') + '</ul>';
  }
  function measure(id) {
    var ids = [id].concat(desc(id)), els = ids.filter(function (i) { return /element|evidential/.test(NODES[i].kind); });
    var sup = function (i) { return LEAVES[i].some(function (l) { return l.relation === 'supports' && (l.strength === 'green' || l.strength === 'orange'); }); };
    var adv = function (i) { return LEAVES[i].some(function (l) { return ADVERSE[l.relation]; }); };
    var col = {}; ids.forEach(function (i) { LEAVES[i].forEach(function (l) { col[l.strength] = (col[l.strength] || 0) + 1; }); });
    var obs = ids.filter(function (i) { return NODES[i].kind === 'obstacle' || NODES[i].status === 'blocked'; });
    var lq = ids.filter(function (i) { return NODES[i].status === 'legal_determination'; });
    return { els: els, sup: els.filter(sup), adv: els.filter(adv), none: els.filter(function (i) { return !sup(i) && !adv(i); }), col: col, obs: obs, lq: lq };
  }
  function openNode(id) {
    var n = NODES[id]; hist.push(function () { openNode(id); });
    var p = pathTo(id), m = measure(id);
    try { history.replaceState(null, '', location.pathname + location.search + '#tree/N/' + id); } catch (e) { /* ignore */ }
    var rows = [['The legal proposition', n.proposition], ['The test', n.test], ['Standard of proof', n.standard], ['Exceptions', n.exceptions], ['Procedural bars and time limits', n.bars], ['How it applies to the Buckler proceedings', n.applies], ['Needs specialist confirmation', n.uncertainty]]
      .filter(function (r) { return r[1]; }).map(function (r) { return '<h3>' + r[0] + '</h3><p>' + E(r[1]) + '</p>'; }).join('');
    var bar = function (label, v, total) { return '<div class="tw-meas"><span>' + label + '</span><b>' + v + (total != null ? ' / ' + total : '') + '</b></div>'; };
    var colRow = Object.keys(LK.strengths).filter(function (k) { return m.col[k]; }).map(function (k) { return '<span class="tw-chip" style="--c:' + COL[k] + '"><i></i>' + E(LK.strengths[k].split(':')[0]) + ' ' + m.col[k] + '</span>'; }).join(' ') || '<span class="m-note">No leaves</span>';
    var kids = KIDS[id].length ? '<h3>Requirements under this ' + E((T.kinds[n.kind] || '').toLowerCase()) + '</h3><ul class="m-list">' + KIDS[id].map(function (c) { var k = NODES[c]; return '<li><button type="button" data-tw="N' + c + '"><span>' + E(k.title) + '</span>' + statusChip(k.status) + '</button></li>'; }).join('') + '</ul>' : '';
    var leaves = LEAVES[id].length ? '<h3>Evidence leaves on this requirement (' + LEAVES[id].length + ')</h3><ul class="m-list">' + LEAVES[id].map(function (l) { return '<li><button type="button" data-tw="L' + l.i + '"><span><b>' + E(l.record.replace(/^RM:.*/, 'Research mirror')) + '</b> ' + E(l.proposition) + '</span>' + strengthChip(l) + '</button></li>'; }).join('') + '</ul>' : '<p class="m-note">No evidence leaf is attached directly to this requirement.</p>';
    modal('<p>' + statusChip(n.status) + (n.status_note ? ' ' + E(n.status_note) : '') + '</p><p class="m-note">' + E(T.statuses[n.status]) + '</p>' + rows +
      '<h3>Authority</h3>' + auths(n.authority) +
      '<h3>Evidence position</h3>' + bar('Elements with supporting evidence', m.sup.length, m.els.length) + bar('Elements with contrary evidence', m.adv.length, m.els.length) + bar('Elements with no evidence either way', m.none.length, m.els.length) +
      bar('Procedural obstacles', m.obs.length) + bar('Questions for legal determination', m.lq.length) + '<p class="tw-cols">' + colRow + '</p><p class="m-note">Evidence quality and legal satisfaction are separate: a requirement is never marked met because its leaves add up.</p>' +
      kids + leaves +
      '<p class="tw-acts">' + (KIDS[id].length && id !== 'T' ? '<button type="button" class="tw-b" data-expand="' + id + '">' + (collapsed[id] ? 'Expand this branch' : 'Collapse this branch') + '</button> ' : '') + '<button type="button" class="tw-b" data-zoomto="' + id + '">Show on the tree</button></p>',
      p.map(function (x) { return E(x.label); }).join(' › '), E(n.title));
  }

  /* ---------------- record data from its own source */
  /* The estate runtime rewrites root-relative fetch() paths into the current app (/api/x becomes /mr-wolf/api/x).
     Absolute same-origin URLs pass through unchanged, so source URLs are made absolute here. */
  function abs(u) { return u.charAt(0) === '/' && u.charAt(1) !== '/' ? location.origin + u : u; }
  function loadRecord(l) {
    var key = l.source + ':' + l.record; if (cache[key]) return Promise.resolve(cache[key]);
    var S = LK.sources[l.source], p;
    if (l.source === 'catalogue') p = fetch(abs('/api/catalogue/' + encodeURIComponent(l.record))).then(ok).then(function (d) { if (!d.item) throw new Error('not in the catalogue'); return { kind: 'catalogue', item: d.item, links: d.links || [] }; });
    else if (l.source === 'chestnut') p = (srcCache.ch || (srcCache.ch = fetch(abs('/that-old-chestnut/_db/view.json')).then(ok))).then(function (d) { var c = (d.chestnuts || []).filter(function (x) { return x.id === l.record; })[0]; if (!c) throw new Error('not in That Old Chestnut'); return { kind: 'chestnut', item: c }; });
    else if (l.source === 'dartboard') p = (srcCache.db || (srcCache.db = fetch(abs('/dartboard/data/foi-tracker.csv')).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + r.url); return r.text(); }).then(csv))).then(function (rows) { var c = rows.filter(function (x) { return x.id === l.record; })[0]; if (!c) throw new Error('not in the Dartboard tracker'); return { kind: 'dartboard', item: c }; });
    else if (l.source === 'mirror') { var slug = l.record.replace(/^RM:/, ''); p = fetch(abs(S.api.replace('{slug}', slug))).then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + r.url); return r.text(); }).then(function (h) { return { kind: 'mirror', item: mirrorText(h, slug) }; }); }
    else p = Promise.reject(new Error('unknown source'));
    return p.then(function (d) { cache[key] = d; if (d.item && d.item.title) cache[l.record] = d.item; return d; });
  }
  function csv(t) {
    var rows = [], row = [], f = '', q = false;
    for (var i = 0; i < t.length; i++) {
      var c = t[i];
      if (q) { if (c === '"') { if (t[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
      else if (c === '"') q = true; else if (c === ',') { row.push(f); f = ''; } else if (c === '\n') { row.push(f); rows.push(row); row = []; f = ''; } else if (c !== '\r') f += c;
    }
    if (f || row.length) { row.push(f); rows.push(row); }
    var h = rows.shift() || [];
    return rows.map(function (r) { var o = {}; h.forEach(function (k, j) { o[k] = r[j] || ''; }); return o; });
  }
  function mirrorText(h, slug) {
    var doc = new DOMParser().parseFromString(h, 'text/html');
    var title = (doc.querySelector('h1') || doc.querySelector('title') || {}).textContent || slug;
    var body = h.replace(/<(script|style|nav|footer)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ');
    var ta = document.createElement('textarea'); ta.innerHTML = body;
    var txt = ta.value.replace(/\s+/g, ' ').trim();
    var cut = function (a, b) { var i = txt.indexOf(a); if (i < 0) return ''; var j = b ? txt.indexOf(b, i + a.length) : -1; return txt.slice(i + a.length, j > 0 ? j : i + a.length + 900).trim(); };
    return { title: title.trim(), status: cut(' Status ', ' Summary '), summary: cut(' Summary ', ' Image '), transcription: cut(' Transcription ', ' Destination '), interpretation: cut(' Interpretation ', ' Related records '), held: cut('Where the original is held: ', ' On this site') };
  }
  function appUrl(l, d) {
    var S = LK.sources[l.source];
    if (l.source === 'catalogue' && d && d.item && d.item.kind === 'forensic_assessment' && d.item.data && d.item.data.public_url) return d.item.data.public_url.replace(/^https:\/\/bucklerfamily\.estate/, '');
    if (l.source === 'mirror') return S.app.replace('{slug}', l.record.replace(/^RM:/, ''));
    return S.app.replace('{id}', encodeURIComponent(l.record));
  }
  function fieldRows(o, skip) {
    return Object.keys(o).filter(function (k) { return o[k] !== null && o[k] !== '' && typeof o[k] !== 'object' && !(skip || []).includes(k); })
      .map(function (k) { return '<tr><th>' + E(k.replace(/_/g, ' ')) + '</th><td>' + E(o[k]) + '</td></tr>'; }).join('');
  }
  function contentHtml(d) {
    var i = d.item, h = '';
    if (d.kind === 'catalogue') {
      var dt = i.data || {};
      h += '<h3>A. Record identity</h3><table class="tw-tab">' + fieldRows({ ID: i.id, Title: i.title, 'Record type': (dt.type || i.kind), Date: i.date_display, 'Source institution / holder': i.holder, 'Original reference': i.alias || dt.repository, Provenance: dt.provenance, 'Catalogue status': i.status, 'Evidence label': dt.label, 'Last updated': i.updated }) + '</table>';
      var body = [i.summary, i.body, dt.description, dt.extract, dt.quotation, dt.transcription].filter(Boolean);
      h += '<h3>B. Record content</h3>' + (body.length ? body.map(function (b) { return '<p>' + E(b) + '</p>'; }).join('') : '<p class="m-note">The catalogue holds no transcription or summary for this record yet.</p>') +
        '<table class="tw-tab">' + fieldRows(dt, ['type', 'label', 'provenance', 'repository', 'description', 'extract', 'quotation', 'transcription', 'origin', 'wiki_source', 'bna_search_url', 'source_repository', 'source_path']) + '</table>';
    } else if (d.kind === 'chestnut') {
      var f = i.finding || {};
      h += '<h3>A. Record identity</h3><table class="tw-tab">' + fieldRows({ ID: i.id, Title: i.title, Date: (i.date || {}).display, 'Source institution': (i.provenance || {}).holder, Reference: (i.provenance || {}).reference, Class: f.class }) + '</table>';
      h += '<h3>B. Record content</h3>' + [['First answer', f.negative_quote], ['Later answer', f.positive_quote], ['What changed', f.disclosure_type || f.positive_nature], ['Trigger', f.trigger], ['Conduct noted', f.conduct]].filter(function (x) { return x[1]; }).map(function (x) { return '<p><b>' + x[0] + ':</b> ' + E(x[1]) + '</p>'; }).join('');
      if ((i.evidence || []).length) h += '<p>Catalogue records: ' + i.evidence.map(function (e) { return '<button type="button" class="tw-link" data-rec="' + E(e) + '">' + E(e) + '</button>'; }).join(' ') + '</p>';
    } else if (d.kind === 'dartboard') {
      h += '<h3>A. Record identity</h3><table class="tw-tab">' + fieldRows({ ID: i.id, Institution: i.institution, Route: i.route, Type: i.type, Subject: i.subject, References: i.refs }) + '</table>';
      h += '<h3>B. Record content</h3><table class="tw-tab">' + fieldRows({ 'Request date': i.requestDate, 'Statutory deadline': i.statutoryDeadline, 'Emails sent': i.sent, Replies: i.replies, 'Latest reply': i.latestReply, Outcome: i.outcomeAuto, Exemptions: i.exemptionsAuto, Status: i.status, Note: i.note }) + '</table>';
    } else if (d.kind === 'mirror') {
      h += '<h3>A. Record identity</h3><table class="tw-tab">' + fieldRows({ Title: i.title, Status: i.status, 'Where the original is held': i.held }) + '</table><p class="m-note">This record is in the research mirror only. In the canonical catalogue the ID EV-0902 belongs to a different record, so this item is cited by its mirror page.</p>';
      h += '<h3>B. Record content</h3>' + [['Summary', i.summary], ['Transcription', i.transcription], ['Interpretation (from the record)', i.interpretation]].filter(function (x) { return x[1]; }).map(function (x) { return '<p><b>' + x[0] + ':</b> ' + E(x[1]) + '</p>'; }).join('');
    }
    return h;
  }
  function relevanceHtml(l) {
    var n = NODES[l.node], others = (BYREC[l.record] || []).filter(function (x) { return x !== l; });
    return '<h3>C. Legal relevance</h3><p class="m-note">' + pathTo(l.node).map(function (x) { return E(x.label); }).join(' › ') + '</p>' +
      '<p><b>Requirement:</b> <button type="button" class="tw-link" data-tw="N' + n.id + '">' + E(n.title) + '</button> ' + statusChip(n.status) + '</p>' +
      '<p>' + strengthChip(l) + '</p>' +
      '<p><b>Why it is attached here:</b> ' + E(l.reason) + '</p><p><b>What it appears to establish:</b> ' + E(l.proposition) + '</p>' +
      '<p><b>What it does not establish:</b> ' + E(l.weaknesses || (l.relation === 'missing' ? 'Nothing yet: the record is not held.' : 'It does not by itself satisfy the legal requirement; that is a matter for legal review.')) + '</p>' +
      (l.alternatives ? '<p><b>Other readings:</b> ' + E(l.alternatives) + '</p>' : '') +
      (l.needs ? '<p><b>What would improve its position:</b> ' + E(l.needs) + '</p>' : '') +
      '<p class="m-note">Strength: ' + E(LK.strengths[l.strength]) + '. Assessed ' + E(l.assessment.date) + ' (' + E(l.assessment.status) + ', ' + E(l.assessment.by) + ').</p>' +
      (others.length ? '<h3>Elsewhere on the tree</h3><ul class="m-list">' + others.map(function (o) { return '<li><button type="button" data-tw="L' + o.i + '"><span>' + E(NODES[o.node].title) + '</span>' + strengthChip(o) + '</button></li>'; }).join('') + '</ul>' : '');
  }
  function connHtml(d, l) {
    var h = '<h3>D. Connections</h3>';
    var links = (d && d.links) || [];
    var rel = links.map(function (x) { var other = x.src === (d.item || {}).id ? x.dst : x.src; return '<button type="button" class="tw-link" data-rec="' + E(other) + '">' + E(other) + '</button> <span class="m-note">' + E(x.rel.replace(/_/g, ' ')) + '</span>'; });
    h += rel.length ? '<p>' + rel.join(' · ') + '</p>' : '<p class="m-note">No linked catalogue records.</p>';
    if (l) h += '<p class="m-note">Authorities for this requirement: ' + (NODES[l.node].authority || []).map(function (a) { return E(a.cite); }).join('; ') + '</p>';
    return h;
  }
  function openLeaf(l) {
    hist.push(function () { openLeaf(l); });
    expandTo(l.node); select(l.node);
    try { history.replaceState(null, '', location.pathname + location.search + '#tree/R/' + encodeURIComponent(l.record)); } catch (e) { /* ignore */ }
    var src = LK.sources[l.source].label, title = E(l.record.replace(/^RM:.*/, 'Research mirror record'));
    modal('<p class="tw-load">Loading the record from ' + E(src) + '…</p>' + relevanceHtml(l), E(src) + ' · evidence leaf', title);
    loadRecord(l).then(function (d) {
      if (!dlg.open) return;
      modal(contentHtml(d) + relevanceHtml(l) + connHtml(d, l) + viewBtn(appUrl(l, d), src), E(src) + ' · evidence leaf', E(d.item.title || d.item.subject || l.record));
    }).catch(function (err) {
      if (!dlg.open) return;
      modal('<p class="tw-err">The record could not be loaded from ' + E(src) + ' (' + E(err.message) + '). What is shown below comes from the tree\'s own mapping, not from the record.</p>' + relevanceHtml(l) + viewBtn(appUrl(l), src), E(src) + ' · evidence leaf (data unavailable)', title);
    });
  }
  function openRecord(id) {
    var ls = BYREC[id]; if (ls) { openLeaf(ls[0]); return; }
    hist.push(function () { openRecord(id); });
    var l = { record: id, source: 'catalogue' };
    modal('<p class="tw-load">Loading ' + E(id) + ' from the central catalogue…</p>', 'Central catalogue · associated record', E(id));
    loadRecord(l).then(function (d) {
      if (!dlg.open) return;
      modal(contentHtml(d) + '<p class="m-note">This record is not attached to the tree. It is shown because a leaf\'s record links to it.</p>' + connHtml(d) + viewBtn(appUrl(l, d), 'the catalogue'), 'Central catalogue · associated record', E(d.item.title));
    }).catch(function (err) { if (dlg.open) modal('<p class="tw-err">' + E(id) + ' could not be loaded (' + E(err.message) + ').</p>' + viewBtn(appUrl(l), 'the catalogue'), 'Central catalogue', E(id)); });
  }
  function viewBtn(url, label) {
    return '<p class="tw-view"><a class="tw-viewb" href="' + E(url) + '" target="_blank" rel="noopener">VIEW WEBAPP</a><span class="m-note">Opens ' + E(label) + ' in a new tab.</span></p>';
  }
  function legend() {
    hist = []; hist.push(legend);
    var st = Object.keys(T.statuses).map(function (k) { return '<li>' + statusChip(k) + ' ' + E(T.statuses[k].split(': ')[1]) + '</li>'; }).join('');
    var sg = Object.keys(LK.strengths).map(function (k) { return '<li><span class="tw-chip" style="--c:' + COL[k] + '"><i></i>' + E(LK.strengths[k].split(':')[0]) + '</span> ' + E(LK.strengths[k].split(': ')[1]) + '</li>'; }).join('');
    var rl = Object.keys(LK.relations).map(function (k) { return '<li><span class="tw-rel tw-rel-' + k + '">' + E(LK.relations[k]) + '</span></li>'; }).join('');
    var kd = '<li>■ rounded: pathway · ◆ diamond: legal gateway · ▢ square: legal test · ● circle: element · ◌ dashed circle: evidential requirement · ⯃ octagon: procedural obstacle</li>';
    modal('<p>' + E(T.note) + '</p><h3>Shapes</h3><ul class="tw-leg">' + kd + '</ul><h3>Status of a legal requirement</h3><ul class="tw-leg">' + st + '</ul><h3>Leaf colour: strength for that requirement</h3><ul class="tw-leg">' + sg + '</ul><h3>Leaf relationship</h3><ul class="tw-leg">' + rl + '<li>Contrary leaves carry a dark outline and a cross; needed-but-missing leaves are hollow.</li></ul><h3>Authorities</h3><ul class="tw-leg">' +
      Object.keys(T.verified).map(function (k) { return '<li><span class="tw-ver tw-ver-' + k + '">' + E(T.verified[k]) + '</span></li>'; }).join('') + '</ul><p class="m-note">' + E(LK.note) + '</p><p class="m-note">Data: <a href="/mr-wolf/legal-tree.json">legal-tree.json</a> · <a href="/mr-wolf/evidence-links.json">evidence-links.json</a> v' + E(T.version) + '</p>', 'How to read the tree', 'The Legal Threshold Tree');
  }
  window.MrWolfTree = { fit: function () { if (svg) fit(); } };
})();
