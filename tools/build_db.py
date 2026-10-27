#!/usr/bin/env python3
"""build_db.py - the one catalogue database behind every Cedwyn theme.
Walks dist/ (all themes + the /_blob/ store) and writes one SQLite file:
  themes, artifacts (one row per unique file, by sha256), locations (where each artifact appears in which theme),
  blobs (the evidence bytes themselves as BLOBs: images, PDFs, small media), fts (FTS5 full-text index of every page
  and data file), nodes + edges (graph: page->embeds/links->artifact, artifact->mentions->year, artifact->cites->host),
  captures (original URL -> archived copy, from the Wayback Vault index).
Then VACUUMs (page_size 4096), maps every blob's byte position (tools/dbmap.py -> db/blobmap.json, checked by sha256) and splits the file into 256 KB chunk files under dist/db/ (far under the 25 MB limit).
The browser fetches only the chunk files a query touches (sql.js-httpvfs, chunked mode; one file per request, because
Cloudflare Pages answers Range requests with the whole file) - no server, no D1. - Sion's Tab agent"""
import json, os, re, sys, sqlite3, hashlib, pathlib, posixpath, html as H, mimetypes, urllib.parse
ROOT = pathlib.Path(__file__).resolve().parent.parent
CFG = json.load(open(ROOT / 'themes.json'))
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
OUT = DIST / 'db'; OUT.mkdir(parents=True, exist_ok=True)
DBF = pathlib.Path('cedwyn.sqlite3'); DBF.unlink(missing_ok=True)
CHUNK = int(os.environ.get('DB_CHUNK', 256 * 1024))   # Pages serves whole files (no Range), so each chunk file = one request; 256 KB since stage 3 (theme pages read single files from the DB)
BLOB_MAX = int(os.environ.get('BLOB_MAX', 2_500_000)); BLOB_TOTAL = int(os.environ.get('BLOB_TOTAL', 700_000_000))
TIDS = [t['id'] for t in CFG['themes']]; D = len(DIST.parts)
KIND = {'.html':'page','.htm':'page','.json':'data','.geojson':'data','.csv':'data','.xml':'data','.txt':'text','.md':'text','.css':'style','.js':'script','.mjs':'script',
        '.jpg':'image','.jpeg':'image','.png':'image','.gif':'image','.webp':'image','.svg':'image','.avif':'image','.ico':'image','.bmp':'image','.tif':'image','.tiff':'image',
        '.pdf':'document','.doc':'document','.docx':'document','.mp3':'audio','.m4a':'audio','.ogg':'audio','.wav':'audio','.mp4':'video','.webm':'video','.mov':'video',
        '.woff':'font','.woff2':'font','.ttf':'font','.otf':'font','.eot':'font'}
BLOB_KINDS = {'image', 'document', 'audio', 'data'}   # 'data': every theme's own JSON/CSV/XML feeds live in the catalogue too (stage 2)
YEAR = re.compile(r'\b(1[0-9]{3}|20[0-2][0-9])\b')
con = sqlite3.connect(DBF); con.execute('PRAGMA page_size=4096'); con.execute('PRAGMA journal_mode=OFF'); con.execute('PRAGMA synchronous=OFF')
con.executescript('''
CREATE TABLE meta(k TEXT PRIMARY KEY, v TEXT);
CREATE TABLE themes(id TEXT PRIMARY KEY, title TEXT, cy TEXT, es TEXT, live TEXT, source TEXT, n_files INTEGER, n_pages INTEGER);
CREATE TABLE artifacts(id INTEGER PRIMARY KEY, sha TEXT UNIQUE, kind TEXT, mime TEXT, bytes INTEGER, title TEXT, year_min INTEGER, year_max INTEGER, has_blob INTEGER DEFAULT 0, ext_url TEXT);
CREATE TABLE locations(aid INTEGER, theme TEXT, path TEXT PRIMARY KEY, url TEXT) WITHOUT ROWID;
CREATE INDEX loc_aid ON locations(aid);
CREATE INDEX loc_theme ON locations(theme, aid);
CREATE TABLE nodes(id TEXT PRIMARY KEY, kind TEXT, label TEXT) WITHOUT ROWID;
CREATE TABLE edges(src TEXT, rel TEXT, dst TEXT, PRIMARY KEY(src, rel, dst)) WITHOUT ROWID;
CREATE INDEX edges_dst ON edges(dst, rel);
CREATE TABLE captures(key TEXT PRIMARY KEY, url TEXT, title TEXT, latest TEXT, captured TEXT) WITHOUT ROWID;
CREATE VIRTUAL TABLE fts USING fts5(title, body, aid UNINDEXED, theme UNINDEXED, path UNINDEXED, tokenize='porter unicode61');
CREATE TABLE blobs(sha TEXT PRIMARY KEY, data BLOB);
''')
def text_of_html(s):
    t = re.search(r'<title[^>]*>(.*?)</title>', s, re.S | re.I)
    title = H.unescape(re.sub(r'\s+', ' ', t.group(1))).strip()[:300] if t else ''
    b = re.sub(r'(?is)<(script|style|noscript|svg|template)\b.*?</\1>', ' ', s)
    b = re.sub(r'(?s)<!--.*?-->', ' ', b); b = re.sub(r'<[^>]+>', ' ', b)
    return title, re.sub(r'\s+', ' ', H.unescape(b)).strip()
def strings_of_json(s):
    try: o = json.loads(s)
    except Exception: return ''
    out = []
    def walk(x):
        if len(out) > 4000: return
        if isinstance(x, str):
            if len(x) > 2 and not x.startswith(('http', '/', 'data:')): out.append(x)
        elif isinstance(x, dict): [walk(v) for v in x.values()]
        elif isinstance(x, list): [walk(v) for v in x]
    walk(o); return ' '.join(out)
def node(nid, kind, label): con.execute('INSERT OR IGNORE INTO nodes VALUES(?,?,?)', (nid, kind, label))
def edge(s, r, d): con.execute('INSERT OR IGNORE INTO edges VALUES(?,?,?)', (s, r, d))
for t in CFG['themes']:
    node('theme:' + t['id'], 'theme', t['title'])
for g in CFG.get('groups', []):
    node('group:' + g['id'], 'group', g['title'])
for t in CFG['themes']:
    if t.get('group'): edge('theme:' + t['id'], 'in_group', 'group:' + t['group'])
sha_id = {}; blob_total = 0; blob_skipped = 0; path_aid = {}; pending = []
files = sorted(p for p in DIST.rglob('*') if p.is_file() and len(p.parts) > D + 1 and (p.parts[D] in TIDS or p.parts[D] == '_blob'))
for p in files:
    rel = '/' + '/'.join(p.parts[D:]); theme = p.parts[D]; ext = p.suffix.lower(); kind = KIND.get(ext, 'other')
    data = p.read_bytes(); sha = hashlib.sha256(data).hexdigest()
    aid = sha_id.get(sha)
    if aid is None:
        title = ''; body = ''
        if kind == 'page':
            title, body = text_of_html(data.decode('utf-8', 'ignore'))
        elif ext == '.json' and len(data) < 15_000_000:
            body = strings_of_json(data.decode('utf-8', 'ignore'))
        elif kind == 'text' and len(data) < 5_000_000:
            body = data.decode('utf-8', 'ignore')
        if not title: title = urllib.parse.unquote(p.name)
        ys = sorted({int(y) for y in YEAR.findall(body[:200000]) if 1066 <= int(y) <= 2026}) if body else []
        mime = mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
        cur = con.execute('INSERT INTO artifacts(sha,kind,mime,bytes,title,year_min,year_max) VALUES(?,?,?,?,?,?,?)',
                          (sha, kind, mime, len(data), title, ys[0] if ys else None, ys[-1] if ys else None))
        aid = cur.lastrowid; sha_id[sha] = aid
        if body or kind == 'page':
            con.execute('INSERT INTO fts(title, body, aid, theme, path) VALUES(?,?,?,?,?)', (title, body[:6000], aid, theme, rel))
        for y in ys[:24]:
            node(f'year:{y}', 'year', str(y)); edge(f'a:{aid}', 'mentions', f'year:{y}')
        if kind in BLOB_KINDS:
            if len(data) <= BLOB_MAX and blob_total + len(data) <= BLOB_TOTAL:
                pending.append((0 if kind == 'data' else 1, theme, rel, sha, p)); blob_total += len(data)   # written below, clustered
                con.execute('UPDATE artifacts SET has_blob=1 WHERE id=?', (aid,))
            else: blob_skipped += 1
    con.execute('INSERT OR IGNORE INTO locations VALUES(?,?,?,?)', (aid, theme, rel, rel)); path_aid[rel] = aid
    if theme != '_blob': edge(f'a:{aid}', 'in_theme', 'theme:' + theme)
# blob rows are written clustered: every theme's JSON/CSV/XML first, then media, each grouped by theme and path, so the
# few chunk files one theme page needs sit next to each other in the database file (stage 3: themes read from the DB)
for _, _, _, sha, p in sorted(pending, key=lambda x: x[:3]):
    con.execute('INSERT OR IGNORE INTO blobs VALUES(?,?)', (sha, p.read_bytes()))
del pending
# files the content-addressed store took out of a theme: record where they appeared, served from /_blob/
_bm = json.load(open(DIST / '_blob_map.json')) if (DIST / '_blob_map.json').exists() else {}
for orig, bl in _bm.items():
    if orig in path_aid or bl not in path_aid: continue
    th = orig.split('/')[1]; aid = path_aid[bl]
    con.execute('INSERT OR IGNORE INTO locations VALUES(?,?,?,?)', (aid, th, orig, bl)); path_aid[orig] = aid
    edge(f'a:{aid}', 'in_theme', 'theme:' + th)
# graph edges from pages: embeds / links / cites
ATT = re.compile(r'''\s(href|src|poster|data-src)\s*=\s*["']([^"']+)["']''', re.I)
blobmap = json.load(open(DIST / '_blob_map.json')) if (DIST / '_blob_map.json').exists() else {}
n_ext = 0
for p in files:
    if p.suffix.lower() not in ('.html', '.htm') or p.parts[D] == '_blob': continue
    rel = '/' + '/'.join(p.parts[D:]); src = path_aid.get(rel)
    s = p.read_text('utf-8', 'ignore')
    for attr, u in ATT.findall(s):
        if u.startswith('/wayback/go/?u='):
            ou = urllib.parse.unquote(u[15:]); host = (urllib.parse.urlsplit(ou).hostname or '').lower()
            if host: node('host:' + host, 'host', host); edge(f'a:{src}', 'cites', 'host:' + host); n_ext += 1
            continue
        if u.startswith(('http', '//', 'data:', '#', 'mailto:', 'javascript:')): continue
        path = u.split('#')[0].split('?')[0]
        if not path: continue
        absp = path if path.startswith('/') else posixpath.normpath(posixpath.join(posixpath.dirname(rel), path))
        absp = urllib.parse.unquote(absp)
        if absp.endswith('/'): absp += 'index.html'
        dst = path_aid.get(absp) or path_aid.get(absp + '/index.html') or path_aid.get(absp + '.html')
        if dst and dst != src: edge(f'a:{src}', 'embeds' if attr.lower() != 'href' else 'links', f'a:{dst}')
# captures from the Wayback Vault index
wi = DIST / 'wayback' / 'websites' / 'index.json'
if wi.exists():
    try:
        for it in json.load(open(wi)).get('items', []):
            con.execute('INSERT OR IGNORE INTO captures VALUES(?,?,?,?,?)', (it.get('key'), it.get('url'), it.get('title'), '/wayback' + (it.get('latest') or ''), it.get('captured')))
    except Exception as e: print('captures: ', e)
# Layers (25 Oct 2026): a layer is a reading over the same evidence, stored as rows that point at artifacts already in this
# database (never copies). First layer: "1000 Cuts" (web/thousand-cuts/cuts.json) - the dated cuts to the Williams family's
# standing in law, each with its evidence pages (artifact ids via locations) and its dependencies (graph edges cut->depends_on->cut). - Sion's Tab agent
con.executescript('''
CREATE TABLE IF NOT EXISTS layers(id TEXT PRIMARY KEY, title TEXT, subtitle TEXT, version TEXT, built TEXT, doc TEXT);
CREATE TABLE IF NOT EXISTS layer_items(layer TEXT, id TEXT, kind TEXT, seq INTEGER, tier INTEGER, date TEXT, event TEXT, blow TEXT, label TEXT, context INTEGER, PRIMARY KEY(layer, id)) WITHOUT ROWID;
CREATE TABLE IF NOT EXISTS layer_refs(layer TEXT, item TEXT, ev TEXT, path TEXT, aid INTEGER);
CREATE TABLE IF NOT EXISTS layer_deps(layer TEXT, item TEXT, depends_on TEXT, PRIMARY KEY(layer, item, depends_on)) WITHOUT ROWID;
''')
n_layer_items = n_layer_refs = n_layer_deps = 0
for lf in sorted(DIST.glob('*/layer.json')):
    try: L = json.load(open(lf))
    except Exception as e: print('layer', lf, e); continue
    lid = L['slug']; slim = {k: v for k, v in L.items() if k not in ('peak', 'cuts')}
    con.execute('INSERT OR REPLACE INTO layers VALUES(?,?,?,?,?,?)', (lid, L.get('title'), L.get('subtitle'), L.get('version'), L.get('built'), json.dumps(slim, ensure_ascii=False)))
    node('layer:' + lid, 'layer', L.get('title') or lid)
    items = [dict(x, kind='peak', layer_n=0) for x in L.get('peak', [])] + [dict(x, kind='cut', layer_n=x.get('layer', 0)) for x in L.get('cuts', [])]
    for seq, x in enumerate(items):
        con.execute('INSERT OR REPLACE INTO layer_items VALUES(?,?,?,?,?,?,?,?,?,?)', (lid, x['id'], x['kind'], seq, int(x['layer_n']), x.get('date'), x.get('event'),
                    x.get('changed') or x.get('blow') or x.get('note'), x.get('label'), 1 if x.get('context') else 0)); n_layer_items += 1
        nid = f'{lid}:{x["id"]}'; node(nid, 'layer_item', (x.get('date', '') + ' ' + x.get('event', ''))[:120]); edge(nid, 'in_layer', 'layer:' + lid)
        for r in x.get('refs', []):
            p = '/' + (L.get('ref_theme') or 'research') + r['path']; p2 = p + 'index.html' if p.endswith('/') else p
            aid = path_aid.get(p2) or path_aid.get(p)
            con.execute('INSERT INTO layer_refs VALUES(?,?,?,?,?)', (lid, x['id'], r.get('ev'), p, aid)); n_layer_refs += 1
            if aid: edge(nid, 'cites', f'a:{aid}')
        for d in x.get('depends_on', []):
            con.execute('INSERT OR IGNORE INTO layer_deps VALUES(?,?,?)', (lid, x['id'], d)); n_layer_deps += 1
            edge(nid, 'depends_on', f'{lid}:{d}')
# Evidence grades (shared, minimal; forensic audit intake 25 Oct 2026): two fields per evidence record, not yet shown on pages. - Sion's Tab agent
con.execute('CREATE TABLE IF NOT EXISTS evidence_grades(ev TEXT PRIMARY KEY, grade INTEGER, origin TEXT, path TEXT, note TEXT) WITHOUT ROWID')
_eg = ROOT / 'data' / 'evidence-grades.json'
if _eg.exists():
    for _x in json.load(open(_eg, encoding='utf-8')).get('evidence', []):
        con.execute('INSERT OR REPLACE INTO evidence_grades VALUES(?,?,?,?,?)', (_x.get('ev'), _x.get('evidence_grade'), _x.get('independent_origin_id'), _x.get('path'), _x.get('grade_note')))
for t in CFG['themes']:
    nf = con.execute('SELECT count(*) FROM locations WHERE theme=?', (t['id'],)).fetchone()[0]
    npg = con.execute("SELECT count(*) FROM locations l JOIN artifacts a ON a.id=l.aid WHERE l.theme=? AND a.kind='page'", (t['id'],)).fetchone()[0]
    con.execute('INSERT INTO themes VALUES(?,?,?,?,?,?,?,?)', (t['id'], t['title'], t.get('cy'), t.get('es'), t['live'],
                 ('branch ' + t['branch']) if t.get('branch') else ('crawl of ' + t.get('crawl', '')), nf, npg))
cnt = lambda q: con.execute(q).fetchone()[0]
stats = dict(artifacts=cnt('SELECT count(*) FROM artifacts'), locations=cnt('SELECT count(*) FROM locations'), blobs=cnt('SELECT count(*) FROM blobs'),
             blob_bytes=blob_total, blob_skipped_over_cap=blob_skipped, edges=cnt('SELECT count(*) FROM edges'), nodes=cnt('SELECT count(*) FROM nodes'),
             fts_rows=cnt('SELECT count(*) FROM fts'), captures=cnt('SELECT count(*) FROM captures'), cites=n_ext, themes=len(TIDS),
             layer_items=n_layer_items, layer_refs=n_layer_refs, layer_deps=n_layer_deps)
for k, v in stats.items(): con.execute('INSERT INTO meta VALUES(?,?)', (k, str(v)))
con.commit()
con.execute("INSERT INTO fts(fts) VALUES('optimize')"); con.commit()
con.execute('VACUUM'); con.close()
size = DBF.stat().st_size
import dbmap   # stage 3: where every blob's bytes sit in the file, so the service worker reads them straight from the chunks
bm = dbmap.build(DBF, CHUNK, '/db/cedwyn.sqlite3.', 3)
json.dump(bm, open(OUT / 'blobmap.json', 'w'), separators=(',', ':'))
stats.update(blobmap_paths=len(bm['paths']), blobmap_blobs=len(bm['blobs']), db_version=bm['v'])
for old in OUT.glob('cedwyn.sqlite3.*'): old.unlink()
n = 0
with open(DBF, 'rb') as f:
    while True:
        b = f.read(CHUNK)
        if not b: break
        (OUT / ('cedwyn.sqlite3.%03d' % n)).write_bytes(b); n += 1
config = {'serverMode': 'chunked', 'requestChunkSize': CHUNK, 'databaseLengthBytes': size, 'serverChunkSize': CHUNK,
          'urlPrefix': '/db/cedwyn.sqlite3.', 'suffixLength': 3}
json.dump(config, open(OUT / 'config.json', 'w'))
stats.update(db_bytes=size, chunks=n, chunk_max_bytes=CHUNK)
json.dump(stats, open(OUT / 'stats.json', 'w'), indent=1)
# Whole-database export (Sion, 23:53 GMT 26 Oct 2026: "the db should make the whole data easily exportable"): /db/export/manifest.json,
# CSV + JSON + metadata SQLite + one slice per section + fetch-full.sh; never fails the build - docs library build
import db_export
db_export.run(DBF, OUT, stats)
DBF.unlink()
print(json.dumps(stats))
