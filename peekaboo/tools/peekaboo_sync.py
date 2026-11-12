#!/usr/bin/env python3
"""peekaboo_sync.py - pull Peekaboo's own small database from the central catalogue. - Cedwyn editors

Reads the central catalogue (data/core/records/*.json on unclehowell/cedwyn) and writes data/peekaboo.json with only the
fields this webapp shows. A record is picked when its scope.tags carry "peekaboo" or its id is listed in tools/picks.json;
picks.json adds the short "said / found / why" lines. Records that are missing or not public are left out and listed in
the output's "skipped". It then renders the same entries into index.html (between the PEEKABOO markers) so the page reads
with no JavaScript and agents can read it as plain HTML.

  python3 tools/peekaboo_sync.py                              # read main on GitHub
  python3 tools/peekaboo_sync.py --ref main --ref core/peekaboo-records   # later refs overlay earlier ones (unmerged PRs)
  python3 tools/peekaboo_sync.py --core /path/to/checkout/data/core/records   # read a local checkout instead
"""
import json, os, re, sys, html, datetime as dt, urllib.request, urllib.parse
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPO = 'unclehowell/cedwyn'
UA = {'User-Agent': 'cedwyn-peekaboo-sync'}
import codecs
# the editorial gate's word list, kept ROT13-encoded so this public file does not itself carry the words
BANNED = re.compile(r'\b(' + codecs.decode(r'fnlf|pynvzf?|nppbeqvat gb|urnefnl|hairevsvrq|nyyrtrq|senhq\j*|fgbyra', 'rot13') + r')\b', re.I)

def get(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
        return r.read().decode('utf-8')

def load_ref(ref):
    q = urllib.parse.quote(ref, safe='')
    listing = json.loads(get(f'https://api.github.com/repos/{REPO}/contents/data/core/records?ref={q}'))
    out = {}
    for f in listing:
        if f['name'].endswith('.json'):
            out[f['name']] = json.loads(get(f'https://raw.githubusercontent.com/{REPO}/{q}/data/core/records/{f["name"]}'))
    return out

def load_dir(d):
    return {n: json.load(open(os.path.join(d, n), encoding='utf-8')) for n in sorted(os.listdir(d)) if n.endswith('.json')}

def records(files):
    for name, j in files.items():
        rows = j.get('records', []) if isinstance(j, dict) else (j if isinstance(j, list) else [])
        for r in rows:
            if isinstance(r, dict) and r.get('id'):
                yield name, r

def main(argv):
    refs, core = [], None
    i = 0
    while i < len(argv):
        if argv[i] == '--ref': refs.append(argv[i + 1]); i += 2
        elif argv[i] == '--core': core = argv[i + 1]; i += 2
        else: sys.exit(__doc__)
    picks = json.load(open(os.path.join(HERE, 'tools', 'picks.json'), encoding='utf-8'))
    tag, ids = picks.get('tag', 'peekaboo'), picks.get('ids', {})
    pool, sources = {}, []
    if core:
        for name, r in records(load_dir(core)): pool[r['id']] = (name, r)
        sources.append({'local': core})
    else:
        for ref in (refs or ['main']):
            files = load_ref(ref)
            for name, r in records(files): pool[r['id']] = (name, r)
            sources.append({'ref': ref, 'files': sorted(files)})
    wanted = [k for k, (n, r) in pool.items() if tag in ((r.get('scope') or {}).get('tags') or [])]
    wanted += [k for k in ids if k not in wanted]
    entries, skipped = [], []
    for k in wanted:
        if k not in pool: skipped.append({'id': k, 'why': 'not in the catalogue read'}); continue
        name, r = pool[k]
        if r.get('public') is False: skipped.append({'id': k, 'why': 'not public'}); continue
        p, prov = ids.get(k, {}), r.get('provenance') or {}
        fnd = r.get('finding') or {}
        e = {
            'id': k, 'kind': r.get('kind'), 'file': name,
            'title': r.get('title', k),
            'holder': prov.get('holder') or fnd.get('institution') or '',
            'reference': prov.get('reference') or '',
            'category': p.get('category') or 'Found despite its label',
            'found_by': p.get('found_by') or 'holder',
            'found_on': p.get('found_on') or fnd.get('positive_date') or '',
            'said': p.get('said') or fnd.get('negative_quote') or '',
            'found': p.get('found') or fnd.get('positive_quote') or r.get('description', ''),
            'why': p.get('why') or '',
            'see': p.get('see') or [],
            'notices': p.get('notices') or [],
            'fcg': bool(p.get('fcg')) or 'fcg' in ((r.get('scope') or {}).get('tags') or []),
            'evidence': r.get('evidence') or [],
            'record_version': r.get('version') or r.get('rev'),
        }
        entries.append(e)
    entries.sort(key=lambda e: e['found_on'] or '0000', reverse=True)
    notices = json.load(open(os.path.join(HERE, 'data', 'notices.json'), encoding='utf-8'))
    db = {'schema': 'peekaboo/1', 'synced_at': dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'), 'sources': sources,
          'counts': {'entries': len(entries), 'found_by_us': sum(e['found_by'] == 'us' for e in entries),
                     'found_by_holder': sum(e['found_by'] == 'holder' for e in entries),
                     'notices': len(notices.get('notices', []))},
          'entries': entries, 'skipped': skipped}
    text = json.dumps(db, ensure_ascii=False, indent=1)
    bad = sorted({m.group(0) for m in BANNED.finditer(text)})
    if bad: sys.exit('banned words in output: %s' % bad)
    open(os.path.join(HERE, 'data', 'peekaboo.json'), 'w', encoding='utf-8').write(text + '\n')
    render(db, notices)
    print(json.dumps(db['counts']), 'skipped', skipped)

def e_(s): return html.escape(str(s or ''), quote=True)
def fd(iso):
    try: d = dt.date.fromisoformat(iso[:10]); return f'{d.day} {d.strftime("%B %Y")}'
    except Exception: return iso or ''

def load_links():
    # v0.2.0 (3 Nov 2026): coloured hashtag cross-links per record (tools/links.json): #wayback #oldchestnut #watchtower #dartboard
    try: return json.load(open(os.path.join(HERE, 'tools', 'links.json'), encoding='utf-8'))
    except Exception: return {'legend': [], 'links': {}}

def tags_html(rid, L):
    out = []
    for app in ('wayback', 'oldchestnut', 'watchtower', 'dartboard'):
        for label, url in (L.get('links', {}).get(rid, {}).get(app) or []):
            out.append(f'<a class="pk-tag pk-tag-{app}" href="{e_(url)}">{e_(label)}</a>')
    return f'<p class="pk-tags" aria-label="Linked records">{" ".join(out)}</p>' if out else ''

def render(db, notices):
    nmap = {n['id']: n for n in notices.get('notices', [])}
    L = load_links()
    cards = []
    for e in db['entries']:
        by = 'Found by us' if e['found_by'] == 'us' else 'Found by the holder'
        see = ' · '.join(f'<a href="{e_(u)}">{e_(t)}</a>' for t, u in e['see'])
        nts = ' '.join(f'<a class="pk-nlink" href="#notice-{e_(n)}">Notice {e_(n)}</a>' for n in e['notices'] if n in nmap)
        cards.append(
            f'<article class="pk-card" id="pk-{e_(e["id"].lower())}" data-cat="{e_(e["category"])}" data-by="{e_(e["found_by"])}">'
            f'<p class="pk-meta"><span class="pk-cat">{e_(e["category"])}</span> <span class="pk-by pk-by-{e_(e["found_by"])}">{by}</span>'
            + (' <span class="pk-fcg">FCG register</span>' if e['fcg'] else '') +
            f' <time datetime="{e_(e["found_on"])}">{fd(e["found_on"])}</time></p>'
            f'<h3>{e_(e["title"])}</h3>'
            f'<div class="pk-pair"><div class="pk-said"><p class="pk-lab"><span aria-hidden="true">🙈</span> The label</p><p>{e_(e["said"])}</p></div>'
            f'<div class="pk-found"><p class="pk-lab"><span aria-hidden="true">👀</span> What was there</p><p><mark>{e_(e["found"])}</mark></p></div></div>'
            + (f'<p class="pk-why">{e_(e["why"])}</p>' if e['why'] else '') +
            f'<p class="pk-src">{e_(e["holder"])}' + (f' · {e_(e["reference"])}' if e['reference'] else '') + f' · catalogue {e_(e["id"])}</p>'
            + (f'<p class="pk-see">{see}{" · " if see and nts else ""}{nts}</p>' if (see or nts) else '') +
            f'<p class="pk-inc">Incident recorded <time datetime="{e_(e["found_on"])}">{fd(e["found_on"])}</time>: {e_(e["category"].lower())}. Possibly to be corrected.</p>'
            + tags_html(e['id'], L) +
            '</article>')
    notes = []
    for n in notices.get('notices', []):
        notes.append(
            f'<details class="pk-notice" id="notice-{e_(n["id"])}"><summary><b>{e_(n["id"])} · {e_(n["to"])}</b> <span class="pk-status">{e_(n["status"])}</span>'
            f'<span class="pk-nitem">{e_(n["item"])}</span></summary>'
            f'<dl><dt>What is wrong</dt><dd>{e_(n["wrong"])}</dd><dt>Correction asked</dt><dd>{e_(n["ask"])}</dd><dt>Record</dt><dd><a href="#pk-{e_(n["record"].lower())}">{e_(n["record"])}</a></dd></dl>'
            f'<p class="pk-lab">Draft text</p><pre class="pk-draft">{e_(n["draft"])}</pre></details>')
    c = db['counts']
    stats = (f'<p class="pk-stats"><b>{c["entries"]}</b> records found despite their labels · <b>{c["found_by_us"]}</b> by us · '
             f'<b>{c["found_by_holder"]}</b> by the holder · <b>{c["notices"]}</b> correction notices held (who to notify will be decided later) · synced {fd(db["synced_at"])}</p>')
    if L.get('legend'):
        stats += ('<p class="pk-legend">Each incident is a place where a record about the estate, Tŷ Mawr, the family or the names used for them '
                  'was described, labelled or placed, or said not to be held, in a way that does not match what was there. Under each card: '
                  + ' · '.join(f'<span class="pk-tag pk-tag-{e_(a)}">{e_(t)}</span> {e_(w)}' for a, t, w in L['legend']) + '.</p>')
    p = os.path.join(HERE, 'index.html')
    h = open(p, encoding='utf-8').read()
    h = re.sub(r'(<!--PEEKABOO:STATS-->).*?(<!--/PEEKABOO:STATS-->)', lambda m: m.group(1) + stats + m.group(2), h, flags=re.S)
    h = re.sub(r'(<!--PEEKABOO:ENTRIES-->).*?(<!--/PEEKABOO:ENTRIES-->)', lambda m: m.group(1) + ''.join(cards) + m.group(2), h, flags=re.S)
    h = re.sub(r'(<!--PEEKABOO:NOTICES-->).*?(<!--/PEEKABOO:NOTICES-->)', lambda m: m.group(1) + ''.join(notes) + m.group(2), h, flags=re.S)
    open(p, 'w', encoding='utf-8').write(h)

if __name__ == '__main__':
    main(sys.argv[1:])
