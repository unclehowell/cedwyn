/* What They Don't Say: layout and behaviour only. Words and records come from the Cedwyn catalogue
   (section_records, theme 'whattheydontsay'), or this section's own database when the catalogue has not merged it yet. */
(function () {
  var T = {}, R = [], meta = {}, $ = function (id) { return document.getElementById(id); };
  var st = { tone: '', status: '', inst: '', red: false, q: '', sort: 'silence' };
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fill(s, o) { return String(s || '').replace(/\{(\w+)\}/g, function (_, k) { return o[k] != null ? o[k] : ''; }); }
  var MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function fd(s) { if (!s) return ''; var p = String(s).split('-'); if (p.length === 2) return MON[+p[1] - 1] + ' ' + p[0]; return (+p[2]) + ' ' + MON[+p[1] - 1] + ' ' + p[0]; }
  function day(s) { var p = String(s || '').split('-'); return p.length < 2 ? NaN : Date.UTC(+p[0], +p[1] - 1, +(p[2] || 1)) / 864e5; }
  function words() { document.querySelectorAll('[data-t]').forEach(function (el) { el.textContent = T[el.getAttribute('data-t')] || ''; }); if (T.page_title) document.title = T.page_title; $('wt-q').placeholder = T.search || ''; }
  function opt(v, t, sel) { return '<option value="' + esc(v) + '"' + (v === sel ? ' selected' : '') + '>' + esc(t) + '</option>'; }
  function controls() {
    var seen = {}, insts = [];
    R.forEach(function (r) { if (!seen[r.inst]) { seen[r.inst] = 1; insts.push(r.inst); } });
    insts.sort();
    var sts = ['no_response', 'no_reply_in_thread', 'no_reply_recorded', 'partial', 'not_held', 'redirected', 'declined', 'reply_no_records', 'inaccessible', 'clarification', 'pending', 'answered'];
    $('wt-st').innerHTML = opt('', T.status_label + ': ' + T.all, st.status) + sts.filter(function (s) { return R.some(function (r) { return r.status === s; }); }).map(function (s) { return opt(s, T['st_' + s], st.status); }).join('');
    $('wt-in').innerHTML = opt('', T.body_label + ': ' + T.all, st.inst) + insts.map(function (i) { return opt(i, i, st.inst); }).join('');
    $('wt-sort').innerHTML = opt('silence', T.sort_silence, st.sort) + opt('new', T.sort_new, st.sort) + opt('body', T.sort_body, st.sort);
  }
  function tally() {
    var n = { red: 0, amber: 0, grey: 0, green: 0 };
    R.forEach(function (r) { n[r.tone]++; });
    $('wt-tally').innerHTML = ['red', 'amber', 'grey', 'green'].map(function (k) {
      return '<button class="wt-t ' + k + '" data-tone="' + k + '" aria-pressed="' + (st.tone === k) + '"><b>' + n[k] + '</b><span>' + esc(T['tally_' + k]) + '</span></button>';
    }).join('');
  }
  function timeline(r) {
    var a = day(r.asked), d = day(r.due), now = day(meta.asof), rp = r.reply ? day(r.reply.date) : NaN;
    if (isNaN(a)) return '';
    var end = Math.max(now, isNaN(d) ? a : d, isNaN(rp) ? a : rp), span = Math.max(end - a, 1);
    function x(v) { return (6 + 88 * (v - a) / span).toFixed(1) + '%'; }
    var h = '<div class="wt-tl" aria-hidden="true"><span class="bar"></span>';
    if (r.status === 'no_response' && !isNaN(d)) h += '<span class="od" style="left:' + x(d) + ';width:' + (88 * (now - d) / span).toFixed(1) + '%"></span>';
    h += '<span class="pt a" style="left:' + x(a) + '"></span>';
    if (!isNaN(d)) h += '<span class="pt d" style="left:' + x(d) + '"></span>';
    h += isNaN(rp) ? (r.tone === 'red' ? '<span class="pt n" style="left:' + x(now) + '"></span>' : '') : '<span class="pt r" style="left:' + x(rp) + '"></span>';
    return h + '</div>';
  }
  function card(r) {
    var h = '<article class="wt-c ' + r.tone + (r.status === 'no_response' ? ' solid' : '') + '" id="' + esc(r.id) + '">';
    h += '<div class="wt-top"><div><div class="wt-in">' + esc(r.inst) + '</div><div class="wt-ref">' + esc(r.regime) + (r.their_ref ? ' · ' + esc(r.their_ref) : '') + '</div></div>';
    h += '<span class="wt-pill ' + r.tone + '">' + (r.tone === 'red' || r.tone === 'amber' ? '<i class="wt-flag"></i>' : '') + esc(T['st_' + r.status]) + '</span></div>';
    h += timeline(r);
    h += '<div class="wt-dates"><span>' + esc(T.asked) + ' <b>' + esc(fd(r.asked)) + '</b></span>';
    if (r.due) h += '<span>' + esc(T.due) + ' <b>' + esc(fd(r.due)) + '</b>' + (r.due_max ? ' (' + esc(T.due_max) + ' ' + esc(fd(r.due_max)) + ')' : '') + '</span>';
    if (r.reply) h += '<span>' + esc(T.reply) + ' <b>' + esc(fd(r.reply.date)) + '</b></span>';
    if (r.overdue_days) h += '<span class="wt-od">' + esc(fill(T.overdue, { n: r.overdue_days })) + '</span>';
    else if (r.silent_days) h += '<span class="wt-od">' + esc(fill(T.silent_for, { n: r.silent_days })) + '</span>';
    h += '</div>';
    h += '<div class="wt-sec"><h3>' + esc(T.asked) + '</h3>' + r.asks.map(function (q) { return '<p class="wt-ask"><small>' + esc(fd(q.date)) + '</small>' + esc(q.text) + '</p>'; }).join('') + '</div>';
    h += '<div class="wt-sec"><h3>' + esc(T.reply) + '</h3>' + (r.reply ? '<p class="wt-rep">' + esc(r.reply.text) + '</p>' : '<p class="wt-rep none">' + esc(T.no_reply) + '</p>');
    if (r.acks && r.acks.length) h += '<p class="wt-note">' + esc(T.acks) + ': ' + r.acks.map(fd).map(esc).join(', ') + '</p>';
    if (r.flags && r.flags.indexOf('late') >= 0) h += '<p class="wt-note">' + esc(T.late) + '</p>';
    if (r.flags && r.flags.indexOf('past_normal_time') >= 0) h += '<p class="wt-note">' + esc(T.past_normal) + '</p>';
    if (r.flags && r.flags.indexOf('holding_reply') >= 0) h += '<p class="wt-note">' + esc(T.holding) + '</p>';
    if (r.near && r.near.length) h += '<p class="wt-note">' + esc(fill(T.elsewhere, { d: r.near.map(fd).join(', ') })) + '</p>';
    if (r.note) h += '<p class="wt-note">' + esc(r.note) + '</p>';
    h += '</div>';
    h += '<div class="wt-sec"><h3>' + esc(T.next) + '</h3><p class="wt-next">' + esc(r.next || '') +
      (r.next_from ? ' <small>' + esc(T.from) + ' ' + esc(fd(r.next_from)) + '</small>' : '') + (r.next_by ? ' <small>' + esc(T.by) + ' ' + esc(fd(r.next_by)) + '</small>' : '') + '</p></div>';
    var L = { ask: T.open_msg, reply: T.open_msg, wdtk: T.wdtk_link, dartboard: T.dartboard_link, mr: T.mr_link };
    h += '<div class="wt-links">' + (r.links || []).map(function (l) { return '<a href="' + esc(l.href) + '">' + esc(L[l.t] || '') + (l.d ? ' · ' + esc(fd(l.d)) : '') + '</a>'; }).join('') + '</div>';
    return h + '</article>';
  }
  function render() {
    var q = st.q.toLowerCase();
    var list = R.filter(function (r) {
      if (st.tone && r.tone !== st.tone) return false;
      if (st.status && r.status !== st.status) return false;
      if (st.inst && r.inst !== st.inst) return false;
      if (st.red && !(r.tone === 'red' || r.tone === 'amber')) return false;
      if (q && (r.inst + ' ' + r.their_ref + ' ' + r.regime + ' ' + r.asks.map(function (a) { return a.text; }).join(' ')).toLowerCase().indexOf(q) < 0) return false;
      return true;
    });
    var rank = { red: 1, amber: 2, grey: 3, green: 4 }; function rk(r) { return r.status === 'no_response' ? 0 : rank[r.tone]; }
    list.sort(st.sort === 'new' ? function (a, b) { return String(b.asked).localeCompare(String(a.asked)); } :
      st.sort === 'body' ? function (a, b) { return a.inst.localeCompare(b.inst) || String(b.asked).localeCompare(String(a.asked)); } :
      function (a, b) { return rk(a) - rk(b) || ((b.overdue_days || b.silent_days || 0) - (a.overdue_days || a.silent_days || 0)) || String(a.asked).localeCompare(String(b.asked)); });
    $('wt-n').textContent = fill(T.count, { n: list.length });
    $('wt-list').innerHTML = list.length ? list.map(card).join('') : '<p>' + esc(T.none) + '</p>';
    tally();
  }
  function bind() {
    $('wt-tally').addEventListener('click', function (e) { var b = e.target.closest('[data-tone]'); if (!b) return; var t = b.getAttribute('data-tone'); st.tone = st.tone === t ? '' : t; render(); });
    $('wt-st').addEventListener('change', function () { st.status = this.value; render(); });
    $('wt-in').addEventListener('change', function () { st.inst = this.value; render(); });
    $('wt-red').addEventListener('change', function () { st.red = this.checked; render(); });
    $('wt-sort').addEventListener('change', function () { st.sort = this.value; render(); });
    $('wt-q').addEventListener('input', function () { st.q = this.value; render(); });
  }
  function take(rows) {
    rows.forEach(function (r) { var x = {}; try { x = JSON.parse(r.data); } catch (e) {} if (r.kind === 'words') T = x; else if (r.kind === 'meta') meta = x; else if (r.kind === 'record') R.push(x); });
    return R.length;
  }
  function own() {
    var p = window.createDbWorker ? Promise.resolve() : new Promise(function (ok, bad) { var s = document.createElement('script'); s.src = '/_cedwyn/vendor/sqlite-httpvfs.js'; s.onload = ok; s.onerror = bad; document.head.appendChild(s); });
    return p.then(function () {
      return window.createDbWorker([{ from: 'inline', config: { serverMode: 'full', url: location.pathname.replace(/[^/]*$/, '') + '_db/section.sqlite', requestChunkSize: 4096 } }], '/_cedwyn/vendor/sqlite.worker.js?v=2', '/_cedwyn/vendor/sql-wasm.wasm');
    }).then(function (w) { return w.db.query('SELECT kind, id, data FROM records ORDER BY seq'); });
  }
  function start() {
    $('wt-wait').hidden = true; words(); controls(); bind();
    if (meta.asof) $('wt-asof').textContent = fill(T.asof, { d: fd(meta.asof) });
    if (location.hash) { st.q = ''; }
    render();
    if (location.hash) { var el = document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el) el.scrollIntoView(); }
  }
  var core = window.Cedwyn ? Cedwyn.db().then(function (db) { return db.query("SELECT kind, id, data FROM section_records WHERE theme='whattheydontsay' ORDER BY seq"); }) : Promise.reject();
  core.then(function (rows) { if (!take(rows)) throw 0; }).catch(function () { T = {}; R = []; meta = {}; return own().then(take); })
    .then(start).catch(function () { $('wt-wait').hidden = false; });
})();
