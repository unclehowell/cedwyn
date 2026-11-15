/* Mr Wolf v3.0.0 · gauge dashboard, built in the browser from leaderboard.json, routes.json and data/central.json.
   New scores appear on the next page load with no page edit. Evidence only: every statement cites a catalogue record. Not a finding of any court. — Claude agent */
(function () {
  'use strict';
  var COUNSEL = 40;
  var SHORT = { a: 'Discrepancy', b: 'Cause', c: 'New', d: 'Quality' };
  var app = document.getElementById('mw-app'), dlgs = document.getElementById('mw-dlg');
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  /* Literal fetch calls on purpose: the estate build (tools/dbserve.py FETCHLIT) keeps files fetched by a literal URL as plain files. */
  var ok = function (r) { if (!r.ok) throw new Error(r.url + ' ' + r.status); return r.json(); };

  function tone(v, mark) { return v >= mark ? 'met' : (v >= mark * 0.75 ? 'near' : 'far'); }
  function arc(v, mx, mark, size, label) {
    var pct = Math.max(0, Math.min(100, v / mx * 100)), a = Math.PI * (1 - mark / mx), cx = 60, cy = 60, r = 48;
    var x1 = cx + (r - 9) * Math.cos(a), y1 = cy - (r - 9) * Math.sin(a), x2 = cx + (r + 9) * Math.cos(a), y2 = cy - (r + 9) * Math.sin(a);
    var d = 'M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy, t = label == null ? String(v) : label;
    return '<svg class="g g-' + size + ' g-' + tone(v, mark) + '" viewBox="0 0 120 70" role="img" aria-label="' + E(t) + ' of ' + mx + ', internal marker at ' + mark + '">' +
      '<path class="g-bg" d="' + d + '" pathLength="100"/><path class="g-fg" d="' + d + '" pathLength="100" stroke-dasharray="' + pct.toFixed(1) + ' 100"/>' +
      '<line class="g-tk" x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '"/>' +
      '<text class="g-v" x="60" y="58" text-anchor="middle">' + E(t) + '</text></svg>';
  }
  function bar(v, mx, mark) {
    return '<span class="b b-' + tone(v, mark) + '"><span class="b-f" style="width:' + Math.round(v / mx * 100) + '%"></span>' +
      '<span class="b-m" style="left:' + Math.round(mark / mx * 100) + '%"></span></span>';
  }
  function list(rows, val) {
    return '<ul class="m-list">' + rows.map(function (r) {
      return '<li><button type="button" data-open="L-' + E(r.id) + '"><span>' + E(r.title) + '</span><b>' + (val ? val(r) : r.score) + '</b></button></li>';
    }).join('') + '</ul>';
  }
  var D = {};
  function dialog(id, title, body, sub) { D[id] = { title: title, body: body, sub: sub || '' }; }

  var last = null, dlg = null;
  function open(id) {
    var m = D[id]; if (!m) return;
    if (!dlg) {
      dlg = document.createElement('dialog'); dlg.className = 'm'; dlg.setAttribute('aria-labelledby', 'mw-dh'); dlgs.appendChild(dlg);
      dlg.addEventListener('close', function () { if (last && last.focus) last.focus(); last = null; });
    }
    dlg.innerHTML = '<div class="m-in"><button type="button" class="m-x" data-close aria-label="Close">×</button>' +
      (m.sub ? '<p class="m-sub">' + m.sub + '</p>' : '') + '<h2 id="mw-dh">' + m.title + '</h2>' + m.body + '</div>';
    if (!dlg.open) { last = document.activeElement; dlg.showModal(); }
    dlg.scrollTop = 0;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open]');
    if (t) { e.preventDefault(); open(t.getAttribute('data-open')); return; }
    if (e.target.closest('[data-close]') || e.target === dlg) dlg && dlg.close();
  });
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('tr[data-open]')) { e.preventDefault(); open(e.target.getAttribute('data-open')); }
  });

  Promise.all([
    fetch('leaderboard.json', { cache: 'no-cache' }).then(ok),
    fetch('routes.json', { cache: 'no-cache' }).then(ok),
    fetch('data/central.json', { cache: 'no-cache' }).then(ok).catch(function () { return { items: {} }; })
  ]).then(function (res) {
    var L = res[0], RT = res[1], C = res[2].items || {};
    var TRIAGE = L.threshold, MAX = L.max, LIMBS = L.rubric.limbs, ROUTES = RT.routes;
    var rows = L.rows.slice().sort(function (a, b) { return a.rank - b.rank; });
    var HREF = {};
    rows.forEach(function (r) { r.routes = RT.tags[r.id] || []; r.records.forEach(function (rc) { HREF[rc.id] = rc.href; }); });
    var best = rows[0], triageGap = TRIAGE - best.score;
    var shown = rows.filter(function (r) { return r.limbs.a > 0; });
    var all4 = rows.filter(function (r) { return Math.min(r.limbs.a, r.limbs.b, r.limbs.c, r.limbs.d) > 0; });
    var nHeld = 0, nPend = 0, noRec = [];
    rows.forEach(function (r) { nHeld += r.facts.length; nPend += r.pending.length; r.pending.forEach(function (p) { if (!p.rec) noRec.push({ r: r, p: p }); }); });
    function cite(id) { return id ? ' <a class="ev" href="' + E(HREF[id] || '#') + '">' + E(id) + '</a>' : ' <span class="ev ev-0">no catalogue record</span>'; }
    function items(arr, cls) { return '<ul class="fx ' + cls + '">' + arr.map(function (f) { return '<li>' + E(f.t) + cite(f.rec) + '</li>'; }).join('') + '</ul>'; }
    var law = '<h3>The law</h3><ul class="fx">' + (L.rubric.law || []).map(function (t) { return '<li>' + E(t) + '</li>'; }).join('') + '</ul>';

    dialog('I-hero', 'Evidence triage position',
      '<p>The needle shows the highest score supported by records currently held: <b>' + best.score + '</b> of ' + MAX + (triageGap > 0 ? ', ' + triageGap + ' points below the internal research triage marker of ' + TRIAGE + '.' : ', at or above the internal research triage marker of ' + TRIAGE + '.') +
      ' It is <i>' + E(best.title) + '</i>.</p><p>' + E(L.evidence_note) + '</p><p><b>' + shown.length + '</b> of ' + rows.length + ' leads have a held record showing a discrepancy. <b>' +
      all4.length + '</b> have held evidence on all four limbs.</p><p class="m-note">' + E(L.rubric.threshold_note) + '</p>' + list(rows.slice(0, 5)));

    var routeCards = ROUTES.map(function (rt) {
      var rs = rows.filter(function (r) { return r.routes.indexOf(rt.key) > -1; });
      var top = rs.reduce(function (m, r) { return Math.max(m, r.score); }, 0);
      dialog('R-' + rt.key, E(rt.label), '<p>' + E(rt.desc) + '</p><p>Best score on this route: <b>' + top + '</b> of ' + MAX + '.</p>' + list(rs) + '<p class="m-note">' + E(RT.note) + '</p>', 'Route');
      return '<button type="button" class="card" data-open="R-' + rt.key + '">' + arc(top, MAX, TRIAGE, 's') +
        '<span class="lbl">' + E(rt.label) + '</span><span class="sm">' + rs.length + ' leads</span></button>';
    }).join('');

    var limbCards = LIMBS.map(function (lb, i) {
      var k = lb.key, rs = rows.slice().sort(function (a, b) { return b.limbs[k] - a.limbs[k] || a.rank - b.rank; }), top = rs[0].limbs[k];
      var have = rs.filter(function (r) { return r.limbs[k] > 0; });
      dialog('B-' + k, E(lb.label), '<p>Best score on this limb: <b>' + top + '</b> of ' + lb.max + '. The internal file-preparation marker is ' + COUNSEL + '/50 on each limb. The board flags a lead as prepared for counsel only when every limb reaches that mark. This is a working checklist, not a legal test or a view on whether an application should be made.</p>' +
        (have.length ? list(have, function (r) { return r.limbs[k]; }) : '<p>No lead has a held record on this limb.</p>'), 'Limb ' + (i + 1) + ' of 4');
      return '<button type="button" class="card" data-open="B-' + k + '">' + arc(top, lb.max, COUNSEL, 's') +
        '<span class="lbl">' + SHORT[k] + '</span><span class="sm">best of ' + lb.max + '</span></button>';
    }).join('');

    var chips = [
      ['C-leads', rows.length, 'leads', '<p>Every lead on the board.</p>' + list(rows)],
      ['C-shown', shown.length, 'with a held discrepancy', '<p>Leads where a held record shows a discrepancy in a document or statement.</p>' + (shown.length ? list(shown) : '')],
      ['C-held', nHeld, 'held records cited', '<p>Statements on the board that rest on a record the catalogue holds.</p>' + list(rows, function (r) { return r.facts.length; })],
      ['C-pend', nPend, 'records pending', '<p>Records not yet obtained. None counts towards a score. ' + noRec.length + ' have no catalogue record at all:</p><ul class="fx fx-p">' +
        noRec.map(function (x) { return '<li>' + E(x.p.t) + ' <span class="ev ev-0">' + E(x.r.id) + '</span></li>'; }).join('') + '</ul>' + list(rows, function (r) { return r.pending.length; })]
    ];
    var chipHtml = chips.map(function (c) {
      dialog(c[0], c[1] + ' ' + E(c[2]), c[3]);
      return '<button type="button" class="chip" data-open="' + c[0] + '"><b>' + c[1] + '</b>' + E(c[2]) + '</button>';
    }).join('');

    var trs = rows.map(function (r, n) {
      var limbs = LIMBS.map(function (lb) {
        return '<div class="lm"><div class="lm-h"><span>' + E(lb.label) + '</span><b>' + r.limbs[lb.key] + '/' + lb.max + '</b></div>' +
          bar(r.limbs[lb.key], lb.max, COUNSEL) + '<p>' + E(r.why[lb.key]) + '</p></div>';
      }).join('');
      var recs = '<ul class="m-recs">' + r.records.map(function (rc) {
        var c = C[rc.id] || {};
        return '<li><a href="' + E(rc.href) + '"><b>' + E(rc.id) + '</b>' + (c.date_display ? ' · ' + E(c.date_display) : '') + (c.title ? ' · ' + E(c.title) : '') + (c.status ? ' · <i>' + E(c.status) + '</i>' : '') + '</a></li>';
      }).join('') + '</ul>';
      var routes = ROUTES.filter(function (rt) { return r.routes.indexOf(rt.key) > -1; }).map(function (rt) { return rt.label; }).join(' · ');
      dialog('L-' + r.id, E(r.title),
        '<div class="m-hero">' + arc(r.score, MAX, TRIAGE, 'm') + '<div><p class="m-gap">' + (r.score >= TRIAGE ? 'Internal triage marker reached' : (TRIAGE - r.score) + ' points below internal triage marker') +
        '</p><p class="m-st">' + E(r.status) + '</p><p class="m-rt">' + E(routes) + '</p></div></div>' +
        '<h3>Evidence held (' + r.facts.length + ')</h3>' + items(r.facts, 'fx-h') +
        '<div class="m-next"><h3>Evidence pending (' + r.pending.length + ')</h3>' + items(r.pending, 'fx-p') + '<p class="m-note">Nothing pending counts towards the score.</p></div>' +
        '<h3>The four limbs</h3>' + limbs + '<h3>Catalogue records</h3>' + recs, '#' + r.rank + ' · ' + E(r.id));
      return '<tr data-open="L-' + E(r.id) + '" tabindex="0"><td class="rk">' + (n + 1) + '</td><td class="ld">' + E(r.title) +
        '<span class="v">' + r.facts.length + ' held · ' + r.pending.length + ' pending' + (r.era === 'post' ? ' · after 1987' : '') + '</span>' + bar(r.score, MAX, TRIAGE) +
        '</td><td class="n"><b>' + r.score + '</b></td></tr>';
    }).join('');

    dialog('I-how', 'How the score works',
      '<p>' + E(L.evidence_note) + '</p><p>Four limbs, 0–50 each, add up to ' + MAX + '.</p><ol>' + LIMBS.map(function (lb) { return '<li>' + E(lb.label) + ' (0–' + lb.max + ')</li>'; }).join('') +
      '</ol><p class="m-note">' + E(L.rubric.mapping) + ' ' + E(L.rubric.threshold_note) + '</p>' + law + '<p class="m-note">' + E(RT.note) + '</p>' +
      '<p class="m-note">' + E(L.quarantine_note) + ' <a href="/kissed-frogs/">Kissed frogs</a> · <a href="/mr-wolf/leaderboard.json">leaderboard.json</a> v' + E(L.version) + '</p>');

    app.innerHTML =
      '<section class="hero"><button type="button" class="hero-g" data-open="I-hero">' + arc(best.score, MAX, TRIAGE, 'l') +
      '<span class="hero-l">' + (triageGap > 0 ? triageGap + ' points to internal triage marker' : 'Internal triage marker reached') + '</span><span class="sm">best lead on evidence held · internal research triage marker ' + TRIAGE + ' of ' + MAX + '</span></button></section>' +
      '<div class="chips">' + chipHtml + '</div>' +
      '<h2 class="sec">Routes</h2><div class="grid g3">' + routeCards + '</div>' +
      '<h2 class="sec">Limbs <span>· internal file-preparation marker: ' + COUNSEL + '/50 on each</span></h2><div class="grid g4">' + limbCards + '</div>' +
      '<section id="leaderboard"><h2 class="sec">Leaderboard <span>· evidence held only</span></h2>' +
      '<table class="lb"><thead><tr><th>#</th><th>Lead</th><th>Score</th></tr></thead><tbody id="mw-lb">' + trs + '</tbody></table></section>';
    var upd = document.getElementById('mw-upd'); if (upd) upd.textContent = L.updated;
    var h = location.hash.slice(1).toUpperCase(); if (/^MW-\d+$/.test(h)) open('L-' + h);
  }).catch(function (err) {
    app.innerHTML = '<p class="frame">The leaderboard could not load. <a href="leaderboard.json">leaderboard.json</a></p>';
    if (window.console) console.error(err);
  });
})();
