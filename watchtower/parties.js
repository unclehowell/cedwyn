/* Watchtower party / institutional coverage register. Existing checks stay authoritative;
   this view links them to researched roles and does not turn a name match into proof of involvement. */
(function () {
  'use strict';
  var root = document.getElementById('parties-body');
  if (!root) return;
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function getJSON(path) {
    return fetch(path + '?v=' + Date.now(), {headers:{accept:'application/json'}})
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); });
  }
  function dateLabel(value) {
    if (!value) return '';
    var s = String(value);
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
    return m ? Number(m[3]) + ' ' + ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(m[2])-1] + ' ' + m[1] : s;
  }
  function checkLabel(status) {
    return status === 'present' ? 'Match found' : status === 'absent' ? 'No match in this index' :
      status === 'not checked' ? 'Not checked' : 'Status unavailable';
  }
  function checkClass(status) {
    return status === 'present' ? 'ok' : status === 'absent' ? 'absent' : 'pending';
  }
  function targetStatus(item, live) {
    var w = item && item.wb || {};
    var current = item && live && live.pages && live.pages[item.u] || {};
    var ts = current.ts || w.ts || item.prior || '';
    var code = current.code || w.code || '';
    if (ts) return {label:(item.prior && !w.ts && !current.ts ? 'Earlier Wayback capture ' : 'Wayback capture ') + dateLabel(ts.slice(0,4)+'-'+ts.slice(4,6)+'-'+ts.slice(6,8)) + (code ? '; latest attempt failed (' + code + ')' : ''),cls:code ? 'failed' : 'ok',url:'https://cedwyn.bucklerfamily.estate/wayback/go/?u=https%3A%2F%2Fweb.archive.org%2Fweb%2F' + ts + '/' + item.u};
    if (code) return {label:'Save attempt failed (' + code + ')',cls:'failed',url:''};
    if (current.last_try || w.at) return {label:'Attempt recorded; no successful capture timestamp',cls:'pending',url:''};
    return {label:'No capture result in the live or saved feed',cls:'pending',url:''};
  }
  function render(p, checks, targets, live) {
    var watch = (p.watch_checks || []).map(function (id) {
      var c = checks[id];
      return c ? '<li><span class="party-state ' + checkClass(c.status) + '">' + esc(checkLabel(c.status)) + '</span> <a href="' + esc(c.page_url) + '" target="_blank" rel="noopener noreferrer">' + esc(c.label) + '</a><small>' + esc(c.checked ? 'Checked ' + dateLabel(c.checked) : 'No check date') + (c.note ? ' · ' + esc(c.note) : '') + '</small></li>' :
        '<li><span class="party-state pending">Check reference unavailable</span> <code>' + esc(id) + '</code></li>';
    }).join('');
    var way = (p.wayback_urls || []).map(function (url) {
      var t = targets[url];
      if (!t) return '<li><span class="party-state pending">Not in Wayback target feed</span> <a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open candidate page</a></li>';
      var s = targetStatus(t, live);
      return '<li><span class="party-state ' + s.cls + '">' + esc(s.label) + '</span> <a href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(t.title || t.host || url) + '</a>' +
        (s.url ? ' · <a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">archive</a>' : '') + '</li>';
    }).join('');
    var ev = (p.evidence || []).map(function (x) {
      return '<li><a href="' + esc(x.url) + '" target="_blank" rel="noopener noreferrer"><code>' + esc(x.id) + '</code> ' + esc(x.title) + '</a></li>';
    }).join('');
    return '<article class="party-card" data-role="' + esc(p.role_class) + '" data-status="' + esc(p.coverage_status) + '">' +
      '<div class="party-head"><div><h3>' + esc(p.name) + '</h3><p class="party-role">' + esc(p.role_class) + '</p></div><span class="party-state ' + (p.coverage_status === 'partial' ? 'partial' : 'pending') + '">' + esc(p.coverage_status) + '</span></div>' +
      '<p>' + esc(p.role) + '</p><p class="party-qual"><strong>Qualification:</strong> ' + esc(p.qualification) + '</p>' +
      '<details><summary>Evidence anchors (' + (p.evidence || []).length + ')</summary><ul>' + (ev || '<li>No public evidence link supplied.</li>') + '</ul></details>' +
      '<details><summary>Existing Watchtower checks (' + (p.watch_checks || []).length + ')</summary><ul>' + (watch || '<li>No linked absence/search check yet.</li>') + '</ul></details>' +
      '<details><summary>Wayback target pages (' + (p.wayback_urls || []).length + ')</summary><ul>' + (way || '<li>No party-specific Wayback target linked yet.</li>') + '</ul></details>' +
      '<p class="party-next"><strong>Next:</strong> ' + esc(p.next_action) + '</p></article>';
  }
  Promise.all([
    getJSON('data/parties.json'),
    getJSON('data/watch-status.json'),
    getJSON('data/targets.json'),
    getJSON('/watchtower/api/wayback.json').catch(function () { return {}; })
  ]).then(function (items) {
    var data = items[0], checks = {}, targets = {}, live = items[3] || {};
    (items[1].targets || []).forEach(function (x) { checks[x.id] = x; });
    (items[2].targets || []).forEach(function (x) { targets[x.u] = x; });
    var parties = data.parties || [];
    var roles = Array.from(new Set(parties.map(function (p) { return p.role_class; }))).sort();
    var statuses = data.status_values || [];
    root.innerHTML =
      '<p class="party-intro">' + esc(data.note) + '</p>' +
      '<p class="party-live">Wayback worker: ' + (live.week ? esc(live.week) : 'live status unavailable') +
        (live.updated ? ' · status updated ' + esc(dateLabel(live.updated)) : '') +
        (live.week_progress ? ' · ' + esc(live.week_progress.done) + ' of ' + esc(live.week_progress.of) + ' targets processed' : '') +
      '</p>' +
      '<div class="party-filters"><label>Role <select id="party-role"><option value="">All roles</option>' +
        roles.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + '</option>'; }).join('') +
      '</select></label><label>Coverage <select id="party-status"><option value="">All coverage states</option>' +
        statuses.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + '</option>'; }).join('') +
      '</select></label><span id="party-count" aria-live="polite"></span></div>' +
      '<div id="party-cards" class="party-cards">' + parties.map(function (p) { return render(p, checks, targets, live); }).join('') + '</div>' +
      '<p class="party-foot">Live status labels come from the separate Watchtower absence and Wayback feeds. A negative search, an untested URL or an archive error is not proof that a record does not exist.</p>';
    var role = document.getElementById('party-role'), status = document.getElementById('party-status');
    var cards = Array.prototype.slice.call(root.querySelectorAll('.party-card')), count = document.getElementById('party-count');
    function filter() {
      var n = 0;
      cards.forEach(function (card) {
        var show = (!role.value || card.getAttribute('data-role') === role.value) &&
          (!status.value || card.getAttribute('data-status') === status.value);
        card.hidden = !show; if (show) n++;
      });
      count.textContent = n + ' of ' + cards.length + ' entities';
    }
    role.addEventListener('change', filter); status.addEventListener('change', filter); filter();
  }).catch(function (err) {
    root.innerHTML = '<p class="party-foot">The coverage register could not be loaded (' + esc(err.message) + '). The source data remains available at <a href="data/parties.json">data/parties.json</a>.</p>';
  });
})();
