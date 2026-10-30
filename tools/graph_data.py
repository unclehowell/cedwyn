#!/usr/bin/env python3
"""graph_data.py 1.0.0 - per-section scatter data for the header graph promo (cw-graph.js).
Asked for 01:27 GMT 30 Oct 2026: each webapp area's header banner opens a full-screen scatter graph of the data that area
shows. Runs at the end of site.py (wrapped in try: never stops a build). Writes dist/_cedwyn/graph/<area>.json in one compact
shape: {v, area, title, x:{label,type}, y:{label,type,cats}, c:{label,cats}, p:[[x, y, colour, label, href], ...]}.
Sources are files the build already ships: /qa/questions.json, /email/view/index.json, data/evidence-grades.json + the
evidence pages, and for every other area its own built pages (title + first date, by sub-folder). Areas with no dated
material get no file and cw-graph.js plots the page itself. - Cedwyn editors"""
import json, re, sys, html, pathlib
from collections import Counter
from urllib.parse import quote_plus

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAXP = 1000
DATE = re.compile(r'\b(1[0-9]\d\d|20[0-4]\d)-(\d\d)-(\d\d)\b|\b(\d{1,2})\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(1[0-9]\d\d|20[0-4]\d)\b|(?<![\w\-/#.])(1[0-9]\d\d|20[0-4]\d)(?![\w\-/])')
MON = {m: i + 1 for i, m in enumerate('January February March April May June July August September October November December'.split())}
BANNED = re.compile(r'\b(says|claims|according to|hearsay|unverified|alleged|fraud|stolen)\b', re.I)

def first_date(s):
    m = DATE.search(s or '')
    if not m: return None
    if m.group(1): return '%s-%s-%s' % (m.group(1), m.group(2), m.group(3))
    if m.group(4): return '%s-%02d-%02d' % (m.group(6), MON[m.group(5)], int(m.group(4)))
    return m.group(7)

def label(s, n=110):
    s = re.sub(r'\s+', ' ', html.unescape(s or '')).strip()
    s = BANNED.sub('…', s)
    return s if len(s) <= n else s[:n - 1] + '…'

def top_cats(vals, mx):
    c = Counter(vals); ks = [k for k, _ in c.most_common()]
    if len(ks) > mx: ks = ks[:mx - 1] + ['Other']
    return ks

def pack(area, title, xl, yl, cl, rows, ymax=12, cmax=8):
    """rows: dicts with x (YYYY[-MM-DD]), y, c, l, h"""
    rows = [r for r in rows if r.get('x')]
    rows.sort(key=lambda r: str(r['x']))
    if len(rows) > MAXP: rows = rows[::-(-len(rows) // MAXP)]
    ys = top_cats([r['y'] for r in rows], ymax); cs = top_cats([r['c'] for r in rows], cmax)
    def ix(lst, v): return lst.index(v) if v in lst else len(lst) - 1
    return {'v': 1, 'area': area, 'title': title, 'x': {'label': xl, 'type': 'date'}, 'y': {'label': yl, 'type': 'cat', 'cats': ys},
            'c': {'label': cl, 'cats': cs}, 'p': [[str(r['x']), ix(ys, r['y']), ix(cs, r['c']), label(r['l'], 90), r.get('h') or ''] for r in rows]}

def qa(dist):
    f = dist / 'qa' / 'questions.json'
    if not f.exists(): return None
    j = json.loads(f.read_text('utf-8')); rows = []
    status = lambda s: 'Answered' if s in ('answered', 'partly answered', 'reply received') else 'Not held' if s == 'not held' else 'Refused or redirected' if s in ('refused', 'redirected') else 'No answer yet'
    for q in j.get('questions', []):
        for a in (q.get('asked_by') or [])[:6]:
            rows.append({'x': q.get('asked') or a.get('date'), 'y': a.get('tag') or a.get('name') or 'Other', 'c': status(q.get('status', '')), 'l': q.get('question', ''), 'h': (a.get('email') or '').split('?')[0] or '/qa/'})
    return pack('qa', 'Questions asked', 'Date asked', 'Institution asked', 'Answer', rows, ymax=14, cmax=4)

def email(dist):
    f = dist / 'email' / 'view' / 'index.json'
    if not f.exists(): return None
    j = json.loads(f.read_text('utf-8')); rows = []
    for r in j.get('records', []):
        inst = (r.get('institutions') or [{}])[0].get('name') or 'Other'
        d = (r.get('date') or '')[:10]; gid = r.get('gmailMessageId') or ''
        h = '/email/reference/%s/' % gid if gid else ''
        rows.append({'x': d, 'y': inst, 'c': 'Sent' if r.get('direction') == 'sent' else 'Received', 'l': r.get('subject', ''), 'h': h})
    return pack('email', 'Correspondence', 'Date', 'Institution', 'Direction', rows, ymax=14, cmax=2)

GRADE = {1: '1 Record read in full', 2: '2 Record partly read or recited', 3: '3 Later official record', 4: '4 Press', 5: '5 Testimony', 6: '6 Research inference'}
def evidence(dist, area):
    f = ROOT / 'data' / 'evidence-grades.json'
    if not f.exists(): return None
    rows = []
    for e in json.loads(f.read_text('utf-8')).get('evidence', []):
        p = e.get('path') or ''; d = first_date(p.replace('-', ' '))
        if not d:
            pg = dist / p.strip('/') / 'index.html'
            if pg.exists():
                t = pg.read_text('utf-8', 'ignore'); m = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S)
                d = first_date(re.sub('<[^>]+>', ' ', m.group(1)) if m else '') or first_date(re.sub('<[^>]+>', ' ', t[:20000]))
        g = int(e.get('evidence_grade') or 6)
        slug = p.rstrip('/').split('/')[-1]; nm = re.sub(r'^ev-\d+-', '', slug).replace('-', ' ')
        rows.append({'x': d, 'y': GRADE.get(g, str(g)), 'c': GRADE.get(g, str(g)), 'l': '%s %s' % (e.get('ev', ''), nm), 'h': p})
    out = pack(area, 'Evidence catalogue', 'Date of the record', 'Evidence grade', 'Grade', rows, ymax=6, cmax=6)
    order = [GRADE[k] for k in sorted(GRADE) if GRADE[k] in out['y']['cats']]
    remap = {out['y']['cats'].index(c): i for i, c in enumerate(order)}
    out['y']['cats'] = order; out['c']['cats'] = order
    for p in out['p']: p[1] = remap.get(p[1], p[1]); p[2] = p[1]
    return out

def pages(dist, area, title):
    """Any other area: its own pages by date (first date in the page head/title/h1) and sub-folder."""
    base = dist / area
    if not base.is_dir(): return None
    rows = []
    for i, f in enumerate(sorted(base.rglob('index.html'))):
        if i > 3000: break
        try: t = f.read_text('utf-8', 'ignore')[:60000]
        except Exception: continue
        m = re.search(r'<h1[^>]*>(.*?)</h1>', t, re.S) or re.search(r'<title>(.*?)</title>', t, re.S)
        ttl = re.sub('<[^>]+>', ' ', m.group(1)) if m else f.parent.name
        md = re.search(r'(?:article:modified_time|dateModified|datePublished|article:published_time)["\']?\s*(?:content=|:)\s*["\']([0-9]{4}-[0-9]{2}-[0-9]{2})', t)
        d = (md.group(1) if md else None) or first_date(ttl) or first_date(re.sub('<[^>]+>', ' ', re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', t, flags=re.S))[:6000])
        rel = f.parent.relative_to(base).parts
        rows.append({'x': d, 'y': (rel[0].replace('-', ' ') if rel else 'Home')[:30], 'c': 'Index' if len(rel) <= 1 else 'Page', 'l': ttl, 'h': '/' + area + '/' + ('/'.join(rel) + '/' if rel else '')})
    if sum(1 for r in rows if r['x']) < 5: return None
    return pack(area, title, 'Date', 'Part of the section', 'Page', rows, ymax=12, cmax=2)

def run(dist):
    dist = pathlib.Path(dist); out = dist / '_cedwyn' / 'graph'; out.mkdir(parents=True, exist_ok=True)
    areas = []
    try: areas = json.loads((dist / 'areas.json').read_text('utf-8')).get('areas', [])
    except Exception: pass
    done = {}; special = {'qa': lambda: qa(dist), 'email': lambda: email(dist), 'research': lambda: evidence(dist, 'research'), 'docs': lambda: evidence(dist, 'docs')}
    for k, fn in special.items():
        try: j = fn()
        except Exception as e: j = None; print('graph_data', k, 'failed', e)
        if j and j['p']: done[k] = j
    for a in areas:
        aid = a.get('id')
        if not aid or aid in done or aid in ('blog',): continue
        try: j = pages(dist, aid, a.get('title') or aid)
        except Exception as e: j = None; print('graph_data', aid, 'failed', e)
        if j: done[aid] = j
    for k, j in done.items(): (out / (k + '.json')).write_text(json.dumps(j, ensure_ascii=False, separators=(',', ':')), 'utf-8')
    rep = {k: len(j['p']) for k, j in done.items()}
    try: (dist / '_cedwyn' / 'reports').mkdir(parents=True, exist_ok=True); (dist / '_cedwyn' / 'reports' / 'graph_data.json').write_text(json.dumps(rep, indent=1))
    except Exception: pass
    print('graph_data 1.0.0:', rep)
    return rep

if __name__ == '__main__':
    run(sys.argv[1] if len(sys.argv) > 1 else ROOT / 'dist')
