/* Mr Wolf v2.0.1 · gauge dashboard, built in the browser from leaderboard.json, routes.json and data/central.json.
   New scores appear on the next page load with no page edit. Our case, prospective, not a finding of any court. — Claude agent */
(function () {
  'use strict';
  var COUNSEL = 40;
  var SHORT = { a: 'Dishonesty', b: 'Cause', c: 'Fresh', d: 'Quality' };
  var app = document.getElementById('mw-app'), dlgs = document.getElementById('mw-dlg');
  var E = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  /* Literal fetch calls on purpose: the estate build (tools/dbserve.py FETCHLIT) keeps files fetched by a literal URL as plain files. */
  var ok = function (r) { if (!r.ok) throw new Error(r.url + ' ' + r.status); return r.json(); };

  function tone(v, mark) { return v >= mark ? 'met' : (v >= mark * 0.75 ? 'near' : 'far'); }
  function arc(v, mx, mark, size, label) {
    var pct = Math.max(0, Math.min(100, v / mx * 100)), a = Math.PI * (1 - mark / mx), cx = 60, cy = 60, r = 48;
    var x1 = cx + (r - 9) * Math.cos(a), y1 = cy - (r - 9) * Math.sin(a), x2 = cx + (r + 9) * Math.cos(a), y2 = cy - (r + 9) * Math.sin(a);
    var d = 'M' + (cx - r) + ' ' + cy + ' A' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy, t = label == null ? String(v) : label;
    return '<svg class="g g-' + size + ' g-' + tone(v, mark) + '" viewBox="0 0 120 70" role="img" aria-label="' + E(t) + ' of ' + mx + ', mark at ' + mark + '">' +
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
    var THR = L.threshold, MAX = L.max, LIMBS = L.rubric.limbs, ROUTES = RT.routes;
    var rows = L.rows.slice().sort(function (a, b) { return a.rank - b.rank; });
    rows.forEach(function (r) { r.routes = RT.tags[r.id] || []; });
    var best = rows[0], gap = THR - best.score;
    var atThr = rows.filter(function (r) { return r.score >= THR; });
    var counsel = rows.filter(function (r) { return Math.min(r.limbs.a, r.limbs.b, r.limbs.c, r.limbs.d) >= COUNSEL; });
    var seeds = rows.filter(function (r) { return r.seed_score; });

    dialog('I-hero', 'Distance to the threshold',
      '<p>The bar is crossed when <b>one lead</b> reaches ' + THR + ' of ' + MAX + '. The needle shows the best lead today: <b>' + best.score + '</b>' +
      (gap > 0 ? ', ' + gap + ' short.' : '.') + '</p><p>Each lead is scored on the four limbs of the test for setting aside a judgment obtained by dishonesty or concealment ' +
      '(<i>Takhar v Gracefield Developments Ltd</i> [2019] UKSC 13, adopting <i>RBS v Highland Financial Partners LP</i> [2013] EWCA Civ 328). ' +
      THR + ' = threshold plausibly met; ' + MAX + ' = proved on every limb.</p><h3>Closest leads</h3>' + list(rows.slice(0, 5)));

    var routeCards = ROUTES.map(function (rt) {
      var rs = rows.filter(function (r) { return r.routes.indexOf(rt.key) > -1; }), top = rs.length ? rs[0].score : 0;
      dialog('R-' + rt.key, E(rt.label), '<p>' + E(rt.desc) + '</p><p>Best lead on this route: <b>' + top + '</b> of ' + MAX + '; the bar is ' + THR + '.</p>' +
        list(rs) + '<p class="m-note">' + E(RT.note) + '</p>', 'Route');
      return '<button type="button" class="card" data-open="R-' + rt.key + '">' + arc(top, MAX, THR, 's') +
        '<span class="lbl">' + E(rt.label) + '</span><span class="sm">' + rs.length + ' leads</span></button>';
    }).join('');

    var limbCards = LIMBS.map(function (lb, i) {
      var k = lb.key, rs = rows.slice().sort(function (a, b) { return b.limbs[k] - a.limbs[k] || a.rank - b.rank; }), top = rs[0].limbs[k];
      dialog('B-' + k, E(lb.label), '<p>Best score on this limb across all leads: <b>' + top + '</b> of ' + lb.max +
        '. A lead is ready for counsel only with at least ' + COUNSEL + ' on every limb.</p>' +
        list(rs.filter(function (r) { return r.limbs[k] > 0; }), function (r) { return r.limbs[k]; }), 'Limb ' + (i + 1) + ' of 4');
      return '<button type="button" class="card" data-open="B-' + k + '">' + arc(top, lb.max, COUNSEL, 's') +
        '<span class="lbl">' + SHORT[k] + '</span><span class="sm">best of ' + lb.max + '</span></button>';
    }).join('');

    var chips = [
      ['C-leads', rows.length, 'leads', rows, 'Every lead on the board, highest first.'],
      ['C-thr', atThr.length, 'at ' + THR + '+', atThr, 'Leads at or above ' + THR + '.' + (atThr.length ? '' : ' None yet.')],
      ['C-counsel', counsel.length, 'counsel-ready', counsel, 'Leads with at least ' + COUNSEL + ' on every limb.' + (counsel.length ? '' : ' None yet.')],
      ['C-seed', seeds.length, 'seed scores', seeds, 'Scored when Mr Wolf was built and waiting for their first test in our reopen research.']
    ];
    var chipHtml = chips.map(function (c) {
      dialog(c[0], c[1] + ' ' + E(c[2]), '<p>' + E(c[4]) + '</p>' + (c[3].length ? list(c[3]) : ''));
      return '<button type="button" class="chip" data-open="' + c[0] + '"><b>' + c[1] + '</b>' + E(c[2]) + '</button>';
    }).join('');

    var trs = rows.map(function (r) {
      var limbs = LIMBS.map(function (lb) {
        return '<div class="lm"><div class="lm-h"><span>' + E(lb.label) + '</span><b>' + r.limbs[lb.key] + '/' + lb.max + '</b></div>' +
          bar(r.limbs[lb.key], lb.max, COUNSEL) + '<p>' + E(r.why[lb.key]) + '</p></div>';
      }).join('');
      var recs = '<ul class="m-recs">' + r.records.map(function (rc) {
        var c = C[rc.id] || {};
        return '<li><a href="' + E(rc.href) + '"><b>' + E(rc.id) + '</b>' + (c.date_display ? ' · ' + E(c.date_display) : '') + (c.title ? ' · ' + E(c.title) : '') + '</a></li>';
      }).join('') + '</ul>';
      var routes = ROUTES.filter(function (rt) { return r.routes.indexOf(rt.key) > -1; }).map(function (rt) { return rt.label; }).join(' · ');
      dialog('L-' + r.id, E(r.title),
        '<div class="m-hero">' + arc(r.score, MAX, THR, 'm') + '<div><p class="m-gap">' +
        (r.score >= THR ? 'Threshold reached' : (THR - r.score) + ' short of ' + THR) + '</p><p class="m-st">' + E(r.status) + '</p><p class="m-rt">' + E(routes) + '</p></div></div>' +
        '<p>' + E(r.what) + '</p><div class="m-raise"><h3>What would raise it</h3><p>' + E(r.what_would_raise_it) + '</p></div>' +
        '<h3>The four limbs</h3>' + limbs + (r.seed_score ? '<p class="m-note">Seed score, waiting for its first test in our reopen research.</p>' : '') +
        '<h3>Records</h3>' + recs, '#' + r.rank + ' · ' + E(r.id));
      return '<tr data-open="L-' + E(r.id) + '" tabindex="0"><td class="rk">' + r.rank + '</td><td class="ld">' + E(r.title) + bar(r.score, MAX, THR) +
        '</td><td class="n"><b>' + r.score + '</b></td></tr>';
    }).join('');

    dialog('I-how', 'How the score works',
      '<p>Four limbs, 0–50 each, add up to ' + MAX + '. <b>' + THR + '</b> = Takhar threshold plausibly met. <b>' + MAX + '</b> = proved on every limb. ' +
      'Ready for counsel = at least ' + COUNSEL + ' on every limb.</p><ol>' + LIMBS.map(function (lb) { return '<li>' + E(lb.label) + ' (0–' + lb.max + ')</li>'; }).join('') +
      '</ol><p class="m-note">' + E(L.rubric.mapping) + ' ' + E(L.rubric.order) + '</p><p class="m-note">' + E(RT.note) + '</p>' +
      '<p class="m-note">' + E(L.quarantine_note) + ' <a href="/kissed-frogs/">Kissed frogs</a> · <a href="/mr-wolf/leaderboard.json">leaderboard.json</a> v' + E(L.version) + '</p>');

    app.innerHTML =
      '<section class="hero"><button type="button" class="hero-g" data-open="I-hero">' + arc(best.score, MAX, THR, 'l') +
      '<span class="hero-l">' + (gap > 0 ? gap + ' to go' : 'Threshold reached') + '</span><span class="sm">best lead · threshold ' + THR + ' of ' + MAX + '</span></button></section>' +
      '<div class="chips">' + chipHtml + '</div>' +
      '<h2 class="sec">Routes</h2><div class="grid g3">' + routeCards + '</div>' +
      '<h2 class="sec">Limbs <span>· mark at ' + COUNSEL + ' = counsel-ready</span></h2><div class="grid g4">' + limbCards + '</div>' +
      '<section id="leaderboard"><h2 class="sec">Leaderboard</h2><table class="lb"><thead><tr><th>#</th><th>Lead</th><th>Score</th></tr></thead><tbody>' + trs + '</tbody></table></section>';
    var upd = document.getElementById('mw-upd'); if (upd) upd.textContent = L.updated;
    var h = location.hash.slice(1).toUpperCase(); if (/^MW-\d+$/.test(h)) open('L-' + h);
  }).catch(function (err) {
    app.innerHTML = '<p class="frame">The leaderboard could not load. <a href="leaderboard.json">leaderboard.json</a></p>';
    if (window.console) console.error(err);
  });
})();
