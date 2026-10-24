#!/usr/bin/env python3
"""site.py - root of cedwyn.bucklerfamily.estate: theme picker, catalogue/GraphQL pages, the runtime (filled with the
host map), the archive interface at /wayback/go/, _redirects (old branch names and theme redirects) and _headers.
- Sion's Tab agent"""
import json, sys, shutil, pathlib, html, urllib.parse
ROOT = pathlib.Path(__file__).resolve().parent.parent
CFG = json.load(open(ROOT / 'themes.json'))
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
shutil.copytree(ROOT / 'web', DIST, dirs_exist_ok=True)
hosts = {}
for t in CFG['themes']:
    for h in t.get('hosts', []):
        if h not in ('bucklerfamily.estate', 'www.bucklerfamily.estate'): hosts[h.lower()] = t['id']
for h, tid in CFG.get('extra_hosts', {}).items():
    if tid: hosts[h] = tid
apex = sorted(CFG['apex']['paths'].items(), key=lambda kv: -len(kv[0]))
rt = DIST / '_cedwyn' / 'runtime.js'
rt.write_text(rt.read_text().replace('__HOSTMAP__', json.dumps(hosts)).replace('__APEX__', json.dumps(apex)).replace('__MEDIA__', json.dumps(CFG['media_hosts'])))
# archive interface inside the wayback theme
go = DIST / 'wayback' / 'go'; go.mkdir(parents=True, exist_ok=True)
shutil.copyfile(DIST / '_cedwyn' / 'archive' / 'go.html', go / 'index.html')
caps = {}
wi = DIST / 'wayback' / 'websites' / 'index.json'
if wi.exists():
    for it in json.load(open(wi)).get('items', []):
        if it.get('key') and it.get('latest'): caps[it['key']] = {'l': '/wayback' + it['latest'], 't': it.get('title', ''), 'c': it.get('captured', '')}
json.dump(caps, open(go / 'captures.json', 'w'), separators=(',', ':'))
# landing page: theme picker
rep = json.load(open(DIST / '_assemble_report.json')) if (DIST / '_assemble_report.json').exists() else {}
GROUPS = [('Evidence and records', ['records', 'docs', 'wayback', 'authorities', 'wdtk', 'review', 'email', 'emails', 'watchtower', 'nomenclature']),
          ('Read like a wiki or a book', ['wiki', 'story', 'ebooks', 'qa', 'chat', 'meeting', 'projects', 'app']),
          ('Maps, tours and museums', ['maps', 'infographic', 'estate', 'directory', 'patagonia', 'wales', 'terrain', 'cyberspace']),
          ('Games and puzzles', ['dartboard', 'chess', 'fcg', 'csscpsg']),
          ('Social and media', ['fb', 'fb2']),
          ('Accounts and shop', ['accounts', 'oldbill', 'shop'])]
by = {t['id']: t for t in CFG['themes']}
seen = set(); secs = []
for g, ids in GROUPS:
    ids = [i for i in ids if i in by]; seen.update(ids)
    secs.append((g, ids))
rest = [t['id'] for t in CFG['themes'] if t['id'] not in seen]
if rest: secs.append(('More', rest))
def card(t):
    r = rep.get(t['id'], {})
    ok = r.get('files', 1) > 0
    sub = html.escape(t['live'].replace('https://', '').rstrip('/'))
    return (f'<a class="t{"" if ok else " off"}" href="/{t["id"]}/"><b>{html.escape(t["title"])}</b>'
            f'<span>/{t["id"]}/ · was {sub}</span></a>')
body = ''.join(f'<details open><summary>{html.escape(g)} <i>{len(ids)}</i></summary><div class="g">' + ''.join(card(by[i]) for i in ids) + '</div></details>' for g, ids in secs)
idx = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cedwyn · one archive, {len(CFG["themes"])} ways in</title><meta name="description" content="One catalogue of Great House Farm evidence, browsed through {len(CFG["themes"])} themes.">
<style>*{{box-sizing:border-box}}body{{margin:0;font:16px/1.45 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#14141c;color:#e8e8f0}}
header{{padding:18px 16px 12px;border-bottom:2px solid #fca}}h1{{margin:0;color:#fca;font-size:24px}}header p{{margin:4px 0 10px;color:#cfcfe0;font-size:14px}}
form{{display:flex;gap:6px}}input{{flex:1;min-width:0;font:inherit;padding:9px 11px;border-radius:9px;border:1px solid #444;background:#1d1d28;color:#e8e8f0}}
button{{font:inherit;font-weight:700;border:0;border-radius:9px;padding:9px 13px;background:#fca;color:#14141c}}
main{{max-width:64rem;margin:0 auto;padding:8px 12px 40px}}details{{margin:10px 0}}summary{{cursor:pointer;font-weight:700;padding:8px 4px;color:#fca;list-style-position:inside}}
summary i{{font-style:normal;color:#9a9ab0;font-weight:400;font-size:13px}}.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px}}
a.t{{display:block;padding:10px 12px;border-radius:10px;background:#1d1d28;border:1px solid #2c2c3a;color:#e8e8f0;text-decoration:none}}a.t:hover{{border-color:#fca}}
a.t b{{display:block;font-size:15px}}a.t span{{display:block;font-size:12px;color:#9a9ab0;margin-top:2px;word-break:break-all}}a.off{{opacity:.5}}
footer{{max-width:64rem;margin:0 auto;padding:0 12px 30px;font-size:13px;color:#9a9ab0}}footer a{{color:#9cf}}</style></head><body>
<header><h1>Cedwyn</h1><p>One catalogue of evidence. {len(CFG["themes"])} themes to browse it: a wiki, a museum tour, a media centre, games, a social feed, accounts and more.</p>
<form action="/catalogue/"><input name="q" placeholder="Search everything" aria-label="Search everything"><button>Search</button></form></header>
<main>{body}</main><footer><a href="/catalogue/">Catalogue</a> · <a href="/graphql/">GraphQL</a> · <a href="/wayback/">Archive</a> · <span id="st"></span></footer>
<script>fetch('/db/stats.json').then(function(r){{return r.json()}}).then(function(s){{document.getElementById('st').textContent=s.artifacts.toLocaleString()+' artifacts · '+s.edges.toLocaleString()+' links in one database'}}).catch(function(){{}});</script>
</body></html>'''
(DIST / 'index.html').write_text(idx)
(DIST / '404.html').write_text('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Not found · Cedwyn</title>
<style>body{margin:0;font:16px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;background:#14141c;color:#e8e8f0;padding:24px}a{color:#fca}</style></head><body>
<h1>Not here</h1><p>This page is not in this theme. <a href="/">All themes</a> · <a id="s" href="/catalogue/">Search the catalogue</a></p>
<script>var p=location.pathname.split('/').filter(Boolean);document.getElementById('s').href='/catalogue/?q='+encodeURIComponent((p[p.length-1]||'').replace(/\\.[a-z0-9]+$/i,'').replace(/[-_]+/g,' '))+(p[0]?'&theme='+p[0]:'');</script></body></html>''')
alias = {'bpvsbuckler': 'story', 'whatdotheyknow': 'wdtk', 'ghf-primary-records': 'records', 'ghf-public-authorities': 'authorities',
         'ghf-independent-review': 'review', '2026-10-22': 'meeting', 'merch': 'shop', 'email-archive': 'email', 'cedwyn': 'estate', 'museum': 'story', 'farmbook': 'fb2', 'media': 'wayback'}
lines = [f'/{a}/* /{b}/:splat 301' for a, b in alias.items()] + [f'/{a} /{b}/ 301' for a, b in alias.items()]
lines += ['/graphql /graphql/ 301', '/catalogue /catalogue/ 301']
tr = DIST / '_theme_redirects.txt'
if tr.exists():
    for l in tr.read_text().splitlines():
        b = l.split()
        if len(b) >= 2 and b[1].startswith('http'):
            b[1] = '/wayback/go/?u=' + urllib.parse.quote(b[1], safe='')
        if len(b) >= 2: lines.append(' '.join(b))
dyn = [l for l in lines if '*' in l.split()[0] or ':' in l.split()[0]]
sta = [l for l in lines if l not in dyn]
(DIST / '_redirects').write_text('\n'.join(dyn[:95] + sta[:1900]) + '\n')
(DIST / '_headers').write_text('''/_blob/*
  Cache-Control: public, max-age=31536000, immutable
/_cedwyn/vendor/*
  Cache-Control: public, max-age=86400
/db/*
  Cache-Control: public, max-age=300
  Access-Control-Allow-Origin: *
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: no-referrer
''')
print('site ok', len(lines), 'redirects,', len(caps), 'captures')
