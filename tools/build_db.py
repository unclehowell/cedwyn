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
# Forensic provenance registers: metadata is not allowed to masquerade as the source bytes.
con.executescript("""
CREATE TABLE IF NOT EXISTS source_records(
 id TEXT PRIMARY KEY, independent_origin_id TEXT, record_status TEXT, title TEXT, creator TEXT, custodian TEXT,
 source_type TEXT, document_date TEXT, event_dates_json TEXT, description TEXT, public_url TEXT, public_archive_url TEXT,
 wayback_calendar_url TEXT, local_path TEXT, email TEXT, disclosure_reference TEXT, attachment_name TEXT,
 email_date TEXT, email_from TEXT, email_to TEXT, email_subject TEXT, message_id TEXT,
 attachment_sha256 TEXT, attachment_bytes INTEGER, parent_source_id TEXT, publication_review TEXT,
 communication_json TEXT, attachment_json TEXT,
 completeness TEXT, read_status TEXT, provenance_json TEXT, pinpoints_json TEXT, limitations_json TEXT,
 supersedes_json TEXT, payload_json TEXT
);
CREATE INDEX IF NOT EXISTS source_status_idx ON source_records(record_status);
CREATE INDEX IF NOT EXISTS source_origin_idx ON source_records(independent_origin_id);
CREATE TABLE IF NOT EXISTS interpretations(
 id TEXT PRIMARY KEY, subject_type TEXT, subject_id TEXT, status TEXT, title TEXT, text TEXT,
 basis_source_ids_json TEXT, evidence_for_json TEXT, evidence_against_or_limits_json TEXT,
 alternative_explanations_json TEXT, what_would_confirm_json TEXT, what_would_refute_or_modify_json TEXT,
 unresolved_questions_json TEXT, confidence TEXT, updated TEXT, payload_json TEXT
);
CREATE INDEX IF NOT EXISTS interpretation_subject_idx ON interpretations(subject_type,subject_id);
CREATE INDEX IF NOT EXISTS interpretation_status_idx ON interpretations(status);
CREATE TABLE IF NOT EXISTS research_leads(
 id TEXT PRIMARY KEY, title TEXT, priority INTEGER, date_start TEXT, date_end TEXT, record_status TEXT,
 not_a_located_record INTEGER, search_status TEXT, search_scope TEXT, why_sought TEXT, working_description TEXT,
 candidate_custodians_json TEXT, could_confirm_json TEXT, could_refute_json TEXT, payload_json TEXT
);
CREATE INDEX IF NOT EXISTS lead_status_idx ON research_leads(record_status,not_a_located_record);
CREATE INDEX IF NOT EXISTS lead_priority_idx ON research_leads(priority);
CREATE TABLE IF NOT EXISTS monitored_pages(
 id TEXT PRIMARY KEY, url TEXT UNIQUE, title TEXT, source_id TEXT, custodian TEXT, topic TEXT,
 enabled INTEGER, required_snapshot INTEGER, relevance_status TEXT, sha256 TEXT, http_status INTEGER,
 last_checked TEXT, last_observed_change TEXT, snapshot_url TEXT, archive_status TEXT,
 wayback_calendar_url TEXT, last_save_attempt_at TEXT, last_save_attempt_sha256 TEXT,
 last_check_error TEXT, notes TEXT, payload_json TEXT
);
CREATE INDEX IF NOT EXISTS monitored_enabled_idx ON monitored_pages(enabled);
CREATE TABLE IF NOT EXISTS event_records(
 event_id TEXT PRIMARY KEY, date TEXT, date_precision TEXT, actor TEXT, action TEXT, object TEXT, place TEXT,
 property_parcel TEXT, polygon_id TEXT, event_type TEXT, statement_class TEXT, event_status TEXT, confidence TEXT,
 source_ids_json TEXT, pinpoints_json TEXT, what_it_supports_json TEXT, what_it_does_not_establish_json TEXT,
 hypothesis_relevance_json TEXT, contrary_material_or_limits_json TEXT, alternative_explanations_json TEXT,
 next_records_json TEXT, independent_origin_ids_json TEXT, payload_json TEXT
);
CREATE INDEX IF NOT EXISTS event_date_idx ON event_records(date,event_id);
CREATE INDEX IF NOT EXISTS event_status_idx ON event_records(event_status);
""")
def _read_json(path, default):
    try:
        with open(path, encoding='utf-8') as f: return json.load(f)
    except FileNotFoundError: return default
_src = _read_json(ROOT / 'catalogue' / 'sources.json', {}).get('records', [])
for _x in _src:
    _comm = _x.get('communication') or {}
    _att = _x.get('attachment') or {}
    con.execute("""INSERT OR REPLACE INTO source_records VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""", (
        _x.get('id'), _x.get('independent_origin_id'), _x.get('record_status'), _x.get('title'), _x.get('creator'),
        _x.get('custodian'), _x.get('source_type'), _x.get('document_date'),
        json.dumps(_x.get('event_dates', []), ensure_ascii=False), _x.get('description'), _x.get('public_url'),
        _x.get('public_archive_url'), _x.get('wayback_calendar_url'), _x.get('local_path'), _x.get('email'),
        _x.get('disclosure_reference'), _x.get('attachment_name'), _comm.get('message_date'),
        _comm.get('sender'), _comm.get('recipient'), _comm.get('subject'), _comm.get('message_id'),
        _att.get('sha256'), _att.get('bytes'), _att.get('parent_source_id') or _x.get('parent_source_id'),
        _x.get('publication_review'), json.dumps(_comm, ensure_ascii=False),
        json.dumps(_att, ensure_ascii=False), _x.get('completeness'), _x.get('read_status'),
        json.dumps(_x.get('acquisition', {}), ensure_ascii=False), json.dumps(_x.get('pinpoints', []), ensure_ascii=False),
        json.dumps(_x.get('limitations', []), ensure_ascii=False), json.dumps(_x.get('supersedes', []), ensure_ascii=False),
        json.dumps(_x, ensure_ascii=False)))
    _sid = _x.get('id')
    if _sid:
        node('source:' + _sid, 'source_record', (_x.get('title') or _sid)[:160])
        node('origin:' + str(_x.get('independent_origin_id') or _sid), 'independent_origin', str(_x.get('independent_origin_id') or _sid))
        edge('source:' + _sid, 'has_independent_origin', 'origin:' + str(_x.get('independent_origin_id') or _sid))
        _host = urllib.parse.urlsplit(_x.get('public_url') or '').hostname
        if _host:
            node('host:' + _host.lower(), 'host', _host.lower())
            edge('source:' + _sid, 'published_by_host', 'host:' + _host.lower())
_ints = _read_json(ROOT / 'catalogue' / 'interpretations.json', {}).get('records', [])
for _x in _ints:
    con.execute("""INSERT OR REPLACE INTO interpretations VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""", (
        _x.get('id'), _x.get('subject_type'), _x.get('subject_id'), _x.get('status'), _x.get('title'), _x.get('text'),
        json.dumps(_x.get('basis_source_ids', []), ensure_ascii=False),
        json.dumps(_x.get('evidence_for', []), ensure_ascii=False),
        json.dumps(_x.get('evidence_against_or_limits', []), ensure_ascii=False),
        json.dumps(_x.get('alternative_explanations', []), ensure_ascii=False),
        json.dumps(_x.get('what_would_confirm', []), ensure_ascii=False),
        json.dumps(_x.get('what_would_refute_or_modify', []), ensure_ascii=False),
        json.dumps(_x.get('unresolved_questions', []), ensure_ascii=False), _x.get('confidence'), _x.get('updated'),
        json.dumps(_x, ensure_ascii=False)))
    _iid = _x.get('id')
    if _iid:
        node('interpretation:' + _iid, 'interpretation', (_x.get('title') or _iid)[:160])
        if _x.get('subject_id'):
            edge('interpretation:' + _iid, 'interprets', str(_x['subject_type']) + ':' + str(_x['subject_id']))
        for _sid in _x.get('basis_source_ids', []):
            edge('interpretation:' + _iid, 'uses_source', 'source:' + str(_sid))
_leads = _read_json(ROOT / 'catalogue' / 'expected-records.json', {}).get('records', [])
for _x in _leads:
    con.execute("""INSERT OR REPLACE INTO research_leads VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""", (
        _x.get('id'), _x.get('title'), int(_x.get('priority') or 0), _x.get('date_start'), _x.get('date_end'),
        _x.get('record_status'), 1 if _x.get('not_a_located_record') is True else 0, _x.get('search_status'),
        _x.get('search_scope'), _x.get('why_sought'), _x.get('working_description'),
        json.dumps(_x.get('candidate_custodians', []), ensure_ascii=False),
        json.dumps(_x.get('could_confirm', []), ensure_ascii=False), json.dumps(_x.get('could_refute', []), ensure_ascii=False),
        json.dumps(_x, ensure_ascii=False)))
    if _x.get('id'):
        node('lead:' + _x['id'], 'research_lead', (_x.get('title') or _x['id'])[:160])
        edge('lead:' + _x['id'], 'not_a_located_artifact', 'status:expected_or_missing')
_watch = _read_json(ROOT / 'catalogue' / 'monitored-pages.json', {}).get('pages', [])
_state = _read_json(ROOT / 'catalogue' / 'monitoring' / 'state.json', {}).get('pages', [])
_state_by_url = {p.get('url'): p for p in _state if p.get('url')}
for _x in _watch:
    _st = _state_by_url.get(_x.get('url'), {})
    _merged = dict(_x); _merged.update({k:v for k,v in _st.items() if k not in ('id','title','source_id','url')})
    con.execute("""INSERT OR REPLACE INTO monitored_pages VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""", (
        _merged.get('id'), _merged.get('url'), _merged.get('title'), _merged.get('source_id'), _merged.get('custodian'),
        _merged.get('topic'), 1 if _merged.get('enabled') else 0, 1 if _merged.get('required_snapshot') else 0,
        _merged.get('relevance_status'), _merged.get('sha256'), _merged.get('http_status'), _merged.get('last_checked'),
        _merged.get('last_observed_change'), _merged.get('snapshot_url'), _merged.get('archive_status'),
        _merged.get('wayback_calendar_url'), _merged.get('last_save_attempt_at'), _merged.get('last_save_attempt_sha256'),
        _merged.get('last_check_error'), _merged.get('notes'), json.dumps(_merged, ensure_ascii=False)))
    if _merged.get('id'):
        node('monitor:' + _merged['id'], 'monitored_page', (_merged.get('title') or _merged['id'])[:160])
        if _merged.get('source_id'): edge('monitor:' + _merged['id'], 'monitors_source', 'source:' + _merged['source_id'])
_events = _read_json(ROOT / 'catalogue' / 'events.json', {}).get('records', [])
for _x in _events:
    con.execute("""INSERT OR REPLACE INTO event_records VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)""", (
        _x.get('event_id'), _x.get('date'), _x.get('date_precision'), _x.get('actor'), _x.get('action'),
        _x.get('object'), _x.get('place'), _x.get('property_parcel'), _x.get('polygon_id'), _x.get('event_type'),
        _x.get('statement_class'), _x.get('event_status'), _x.get('confidence'),
        json.dumps(_x.get('source_ids', []), ensure_ascii=False), json.dumps(_x.get('pinpoints', []), ensure_ascii=False),
        json.dumps(_x.get('what_it_supports', []), ensure_ascii=False),
        json.dumps(_x.get('what_it_does_not_establish', []), ensure_ascii=False),
        json.dumps(_x.get('hypothesis_relevance', []), ensure_ascii=False),
        json.dumps(_x.get('contrary_material_or_limits', []), ensure_ascii=False),
        json.dumps(_x.get('alternative_explanations', []), ensure_ascii=False),
        json.dumps(_x.get('next_records', []), ensure_ascii=False),
        json.dumps(_x.get('independent_origin_ids', []), ensure_ascii=False), json.dumps(_x, ensure_ascii=False)))
    _eid = _x.get('event_id')
    if _eid:
        node('event:' + _eid, 'event_record', str(_x.get('date') or '') + ' — ' + str(_x.get('action') or _eid)[:140])
        for _sid in _x.get('source_ids', []):
            edge('event:' + _eid, 'recorded_in_source', 'source:' + str(_sid))
for t in CFG['themes']:
    nf = con.execute('SELECT count(*) FROM locations WHERE theme=?', (t['id'],)).fetchone()[0]
    npg = con.execute("SELECT count(*) FROM locations l JOIN artifacts a ON a.id=l.aid WHERE l.theme=? AND a.kind='page'", (t['id'],)).fetchone()[0]
    con.execute('INSERT INTO themes VALUES(?,?,?,?,?,?,?,?)', (t['id'], t['title'], t.get('cy'), t.get('es'), t['live'],
                 ('branch ' + t['branch']) if t.get('branch') else ('crawl of ' + t.get('crawl', '')), nf, npg))
cnt = lambda q: con.execute(q).fetchone()[0]
stats = dict(artifacts=cnt('SELECT count(*) FROM artifacts'), locations=cnt('SELECT count(*) FROM locations'), blobs=cnt('SELECT count(*) FROM blobs'),
             blob_bytes=blob_total, blob_skipped_over_cap=blob_skipped, edges=cnt('SELECT count(*) FROM edges'), nodes=cnt('SELECT count(*) FROM nodes'),
             fts_rows=cnt('SELECT count(*) FROM fts'), captures=cnt('SELECT count(*) FROM captures'), cites=n_ext, themes=len(TIDS),
             source_records=cnt('SELECT count(*) FROM source_records'), interpretations=cnt('SELECT count(*) FROM interpretations'),
             event_records=cnt('SELECT count(*) FROM event_records'), research_leads=cnt('SELECT count(*) FROM research_leads'), monitored_pages=cnt('SELECT count(*) FROM monitored_pages'),
             unlocated_leads=cnt('SELECT count(*) FROM research_leads WHERE not_a_located_record=1'),
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
DBF.unlink()
print(json.dumps(stats))
