#!/usr/bin/env python3
"""build_db.py - derive the Cedwyn Academy's own D1 database (cedwyn-academy) from the private question bank
(work/cedwyn-arch/academy/grades.json, never published) and the master evidence catalogue (core_items in D1 cedwyn-apps).

Versions (semantic, on the questionnaires; newest first in the picker):
  v0.0.2  members  the full set: every grade in grades.json
  v0.0.1  free     the free set: the grade(s) marked free (Grade 1)
Older sets, once retired, are kept as -v0.0.2, -v0.0.3 ... (there is no -v0.0.1; rule of 30 Oct 2026, 21:50).

Checks before anything is written: every cited ID exists in the master catalogue (public core_items row) or the public
evidence index; every question has a source; case points carry "not a finding"; no banned public word; no statement of what
the family holds (holdings rule, 22:25 30 Oct 2026). Source links are made absolute to cedwyn.bucklerfamily.estate.
Usage: TAB_TASK_ID=<task> timeout -k 5 600 python3 work/cedwyn-academy/tools/build_db.py [--check] [--create]
Tab agent, 30 Oct 2026 (task c1fca92e)."""
import json, os, re, sys, time, tempfile, subprocess, datetime, urllib.request
TID = os.environ.get('TAB_TASK_ID', 'academy-build'); ACCT = '42a4a8d7bfb96321118ada213638d050'
MASTER = '6fb11d8e-5d14-41a4-a7a0-ebf3d3de410a'  # cedwyn-apps (core_items = master evidence catalogue)
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); STP = os.path.join(HERE, 'state.json')
ST = json.load(open(STP)) if os.path.exists(STP) else {}
SRC = '/home/user/tab/work/cedwyn-arch/academy/grades.json'; SITE = 'https://cedwyn.bucklerfamily.estate'
import base64
BANNED = re.compile(base64.b64decode("XGIoc2F5c3xjbGFpbXN8YWNjb3JkaW5nIHRvfGhlYXJzYXl8dW52ZXJpZmllZHxhbGxlZ2VkfGZyYXVkfHN0b2xlbnx0ZW5hbnQgZmFybWVyc3xoZXJhbGRyeXxoZXJhbGRpY3xzaW9ufGJyYW53ZW58MTU0N3wxNTUyKVxi").decode(), re.I)  # the banned public words, encoded so this file does not carry them
HOLD = re.compile(r"family[- ]held|held by the family|in (?:the )?family'?s? possession|(?:is|are) not (?:yet )?held|not yet held|we hold|family (?:holds|keeps|has kept)|our (?:copy|copies)", re.I)
VERSIONS = [
  {'v': 'v0.0.2', 'sort': 2, 'access': 'members', 'title': 'The full set',
   'note': 'v0.0.2 is the full set: seven grades and 85 questions, from the farm and its names to the open questions. It comes with the membership (£49.99 a month) or a family code.'},
  {'v': 'v0.0.1', 'sort': 1, 'access': 'free', 'title': 'The free set',
   'note': 'v0.0.1 is the free set: Grade 1, The farm and its names, 12 questions. No sign-in and nothing to pay.'},
]
def ca(req):
    td = f'/home/user/tab/tasks/{TID}/rq'; os.makedirs(td, exist_ok=True)
    f = tempfile.NamedTemporaryFile('w', suffix='.json', delete=False, dir=td); json.dump(req, f); f.close()
    try: p = subprocess.run(['timeout', '-k', '5', '120', 'node', '/home/user/tab/connected-apps-cli.mjs', 'connected_apps.request', f.name], capture_output=True, text=True)
    finally: os.unlink(f.name)
    time.sleep(3.2)
    r = json.loads(p.stdout).get('result') or {}; b = r.get('body')
    if b is None and r.get('body_head'): b = json.loads(r['body_head'])
    return json.loads(b) if isinstance(b, str) else b
def d1(db, sql, params=None):
    r = ca({'toolkit': 'cloudflare', 'method': 'POST', 'url': f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{db}/query', 'body': {'sql': sql, 'params': params or []}})
    if not (r or {}).get('success'): raise SystemExit('D1 error: ' + json.dumps(r)[:400])
    return r['result'][0].get('results') or []
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={'user-agent': "Mozilla/5.0 Tab agent academy-build"}), timeout=60).read().decode()
data = json.load(open(SRC))
ids = sorted({s['id'] for g in data['grades'] for q in g['qs'] for s in q['s']})
core = {r['id']: r for r in d1(MASTER, 'SELECT id, title FROM core_items WHERE public=1 AND id IN (%s)' % ','.join('?' * len(ids)), ids)}
evidx = {m.upper() for m in re.findall(r'/research/evidence/(ev-\d{4})', get(SITE + '/research/evidence/?cb=%d' % time.time()))}
bad = [i for i in ids if i not in core and i not in evidx]; errs = []
for g in data['grades']:
    for q in g['qs']:
        if not q['s']: errs.append(q['id'] + ': no source')
        if not (0 <= q['a'] < len(q['o'])): errs.append(q['id'] + ': answer index')
        t = ' '.join([q['q'], *q['o'], q['x'], q.get('v') or '', q.get('vr') or ''] + [s.get('t') or '' for s in q['s']])
        if BANNED.search(t): errs.append(q['id'] + ': banned word ' + BANNED.search(t).group(0))
        if HOLD.search(t): errs.append(q['id'] + ': holdings wording ' + HOLD.search(t).group(0))
        if q.get('case') and 'not a finding' not in q['x']: errs.append(q['id'] + ': case point without label')
        for s in q['s']:
            if s.get('u', '').startswith('/'): s['u'] = SITE + s['u']
print('ids cited:', len(ids), '| in master catalogue:', len(core), '| evidence index only:', len([i for i in ids if i not in core and i in evidx]), '| unknown:', bad)
if bad or errs: raise SystemExit('STOP: ' + '; '.join(errs + ['unknown ' + i for i in bad]))
sets = {'v0.0.2': data['grades'], 'v0.0.1': [g for g in data['grades'] if g.get('free')]}
for v in VERSIONS: print(v['v'], v['access'], len(sets[v['v']]), 'grades', sum(len(g['qs']) for g in sets[v['v']]), 'questions')
if '--check' in sys.argv: raise SystemExit(0)
if not ST.get('db_id'):
    if '--create' not in sys.argv: raise SystemExit('no database yet: run with --create')
    r = ca({'toolkit': 'cloudflare', 'method': 'POST', 'url': f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database', 'body': {'name': 'cedwyn-academy'}})
    if not (r or {}).get('success'): raise SystemExit('create failed: ' + json.dumps(r)[:400])
    ST['db_id'] = r['result']['uuid']; json.dump(ST, open(STP, 'w'), indent=1); print('created D1 cedwyn-academy', ST['db_id'])
DB = ST['db_id']
for sql in [
  "CREATE TABLE IF NOT EXISTS academy_meta(k TEXT PRIMARY KEY, val TEXT)",
  "CREATE TABLE IF NOT EXISTS academy_versions(v TEXT PRIMARY KEY, sort INTEGER, access TEXT, title TEXT, note TEXT, released TEXT)",
  "CREATE TABLE IF NOT EXISTS academy_quiz(v TEXT NOT NULL, grade INTEGER NOT NULL, title TEXT, blurb TEXT, qs TEXT, updated TEXT, PRIMARY KEY(v, grade))",
  "CREATE TABLE IF NOT EXISTS academy_sources(id TEXT PRIMARY KEY, title TEXT, url TEXT, origin TEXT)",
  "CREATE TABLE IF NOT EXISTS academy_progress(learner TEXT NOT NULL, v TEXT NOT NULL, grade INTEGER NOT NULL, attempt INTEGER DEFAULT 1, answers TEXT DEFAULT '{}', answered INTEGER DEFAULT 0, correct INTEGER DEFAULT 0, total INTEGER DEFAULT 0, passed INTEGER DEFAULT 0, best_pct INTEGER DEFAULT 0, passed_at TEXT, principal TEXT, updated TEXT, PRIMARY KEY(learner, v, grade))"]:
    d1(DB, sql)
now = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
for v in VERSIONS:
    d1(DB, "INSERT INTO academy_versions(v,sort,access,title,note,released) VALUES (?,?,?,?,?,?) ON CONFLICT(v) DO UPDATE SET sort=excluded.sort, access=excluded.access, title=excluded.title, note=excluded.note", [v['v'], v['sort'], v['access'], v['title'], v['note'], now])
    for g in sets[v['v']]:
        d1(DB, "INSERT INTO academy_quiz(v,grade,title,blurb,qs,updated) VALUES (?,?,?,?,?,?) ON CONFLICT(v,grade) DO UPDATE SET title=excluded.title, blurb=excluded.blurb, qs=excluded.qs, updated=excluded.updated",
           [v['v'], g['n'], g['title'], g['blurb'], json.dumps(g['qs'], ensure_ascii=False), now])
    d1(DB, "DELETE FROM academy_quiz WHERE v = ? AND grade NOT IN (%s)" % ','.join(str(int(g['n'])) for g in sets[v['v']]), [v['v']])
d1(DB, "DELETE FROM academy_versions WHERE v NOT IN (%s)" % ','.join('?' * len(VERSIONS)), [v['v'] for v in VERSIONS])
for i in ids:
    t = (core.get(i) or {}).get('title') or next((s.get('t') for g in data['grades'] for q in g['qs'] for s in q['s'] if s['id'] == i), '')
    u = next((s['u'] for g in data['grades'] for q in g['qs'] for s in q['s'] if s['id'] == i), '')
    t = re.sub(r'not yet held', 'not yet disclosed', t or '')
    d1(DB, "INSERT INTO academy_sources(id,title,url,origin) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET title=excluded.title, url=excluded.url, origin=excluded.origin", [i, t, u, 'core_items' if i in core else 'evidence index'])
for k, val in [('derived_from', 'cedwyn-apps core_items (master evidence catalogue) + private question bank grades.json'), ('bank_version', data.get('version', '')), ('built', now)]:
    d1(DB, "INSERT INTO academy_meta(k,val) VALUES (?,?) ON CONFLICT(k) DO UPDATE SET val=excluded.val", [k, val])
print('loaded', {v['v']: len(sets[v['v']]) for v in VERSIONS}, 'sources', len(ids))
