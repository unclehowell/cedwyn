// Catalogue records panel v0.3.0: lists the central-catalogue records this world is drawn from or relates to.
// Reads this webapp's own data store only (data/central.json, synced read-only from the central catalogue every 6 h,
// and data/sources.json for what each record is used for). Links open the record in the catalogue. — Cedwyn editors
const CAT = 'https://cedwyn.bucklerfamily.estate/dartboard/catalogue/?id=';
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
async function load(p) { const r = await fetch(p, { cache: 'no-cache' }); if (!r.ok) throw new Error(p + ' ' + r.status); return r.json(); }
(async () => {
  const box = document.querySelector('#srcd .mb'); if (!box) return;
  let central, sources;
  try { [central, sources] = await Promise.all([load('data/central.json'), load('data/sources.json')]); } catch (e) { return; }
  const items = (central && central.items) || {}, rows = ((sources && sources.records) || []).filter(r => items[r.id]);
  if (!rows.length) return;
  const sec = document.createElement('section'); sec.className = 'a3d-recs';
  sec.innerHTML = '<b>Records in the catalogue</b><ul>' + rows.map(r => {
    const it = items[r.id];
    return '<li><a href="' + CAT + encodeURIComponent(r.id) + '">' + esc(r.id) + '</a> ' + esc(it.title) +
      (it.date_display ? ' <span class="d">(' + esc(it.date_display) + ')</span>' : '') + '<br><span class="u">' + esc(r.used_for) + '</span></li>';
  }).join('') + '</ul><p class="u">Copied from the catalogue on ' + esc(String(central.synced_utc || '').slice(0, 10)) + '.</p>';
  box.appendChild(sec);
})();
