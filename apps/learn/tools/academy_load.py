#!/usr/bin/env python3
"""academy_load.py - load the Cedwyn Academy grade ladder (work/cedwyn-arch/academy/grades.json) into D1 cedwyn-apps table
learn_quiz, the academy webapp's own derived database. Every cited ID is checked first against the master catalogue
(core_items, public rows) or the public evidence index (/research/evidence/); the load stops if any ID is unknown, if a
question lacks a source, or if public text carries a banned word. Creates learn_quiz and learn_progress if missing.
Usage: TAB_TASK_ID=<task> timeout -k 5 300 python3 work/cedwyn-arch/tools/academy_load.py [--check]
Sion's Tab agent, 30 Oct 2026 (task 18baf467)."""
import json, os, re, sys, time, tempfile, subprocess, datetime, urllib.request
TID = os.environ.get('TAB_TASK_ID', 'academy-load'); ACCT = '42a4a8d7bfb96321118ada213638d050'; DB = '6fb11d8e-5d14-41a4-a7a0-ebf3d3de410a'
SRC = '/home/user/tab/work/cedwyn-arch/academy/grades.json'
BANNED = re.compile(r"\b(says|claims|according to|hearsay|unverified|alleged|fraud|stolen|tenant farmers|heraldry|heraldic|sion|branwen|1547|1552)\b", re.I)
def ca(req):
    td = f'/home/user/tab/tasks/{TID}/rq'; os.makedirs(td, exist_ok=True)
    f = tempfile.NamedTemporaryFile('w', suffix='.json', delete=False, dir=td); json.dump(req, f); f.close()
    try: p = subprocess.run(['timeout', '-k', '5', '120', 'node', '/home/user/tab/connected-apps-cli.mjs', 'connected_apps.request', f.name], capture_output=True, text=True)
    finally: os.unlink(f.name)
    time.sleep(3.2)
    r = json.loads(p.stdout).get('result') or {}; b = r.get('body')
    if b is None and r.get('body_head'): b = json.loads(r['body_head'])
    return json.loads(b) if isinstance(b, str) else b
def d1(sql, params=None):
    r = ca({'toolkit': 'cloudflare', 'method': 'POST', 'url': f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query', 'body': {'sql': sql, 'params': params or []}})
    if not (r or {}).get('success'): raise SystemExit('D1 error: ' + json.dumps(r)[:400])
    return r['result'][0].get('results') or []
def get(u): return urllib.request.urlopen(urllib.request.Request(u, headers={'user-agent': "Mozilla/5.0 Sion's Tab agent academy-load"}), timeout=60).read().decode()
data = json.load(open(SRC))
ids = sorted({s['id'] for g in data['grades'] for q in g['qs'] for s in q['s']})
core = {r['id'] for r in d1('SELECT id FROM core_items WHERE public=1 AND id IN (%s)' % ','.join('?' * len(ids)), ids)}
evidx = {m.upper() for m in re.findall(r'/research/evidence/(ev-\d{4})', get('https://cedwyn.bucklerfamily.estate/research/evidence/?cb=%d' % time.time()))}
bad = [i for i in ids if i not in core and i not in evidx]
errs = []
for g in data['grades']:
    for q in g['qs']:
        if not q['s']: errs.append(q['id'] + ': no source')
        if not (0 <= q['a'] < len(q['o'])): errs.append(q['id'] + ': answer index')
        t = ' '.join([q['q'], *q['o'], q['x'], q.get('v') or '', q.get('vr') or ''] + [s.get('t') or '' for s in q['s']])
        if BANNED.search(t): errs.append(q['id'] + ': banned word ' + BANNED.search(t).group(0))
        if q.get('case') and 'not a finding' not in q['x']: errs.append(q['id'] + ': case point without label')
print('ids cited:', len(ids), '| in core_items:', len(core), '| evidence index only:', [i for i in ids if i not in core and i in evidx], '| unknown:', bad)
if bad or errs: raise SystemExit('STOP: ' + '; '.join(errs + ['unknown ' + i for i in bad]))
if '--check' in sys.argv: raise SystemExit(0)
d1('CREATE TABLE IF NOT EXISTS learn_quiz(grade INTEGER PRIMARY KEY, title TEXT, blurb TEXT, free INTEGER DEFAULT 0, qs TEXT, version TEXT, updated TEXT)')
d1('CREATE TABLE IF NOT EXISTS learn_progress(learner TEXT NOT NULL, grade INTEGER NOT NULL, attempt INTEGER DEFAULT 1, answers TEXT DEFAULT \'{}\', answered INTEGER DEFAULT 0, correct INTEGER DEFAULT 0, total INTEGER DEFAULT 0, passed INTEGER DEFAULT 0, best_pct INTEGER DEFAULT 0, passed_at TEXT, principal TEXT, updated TEXT, PRIMARY KEY(learner, grade))')
now = datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
for g in data['grades']:
    d1('INSERT INTO learn_quiz(grade,title,blurb,free,qs,version,updated) VALUES (?,?,?,?,?,?,?) ON CONFLICT(grade) DO UPDATE SET title=excluded.title, blurb=excluded.blurb, free=excluded.free, qs=excluded.qs, version=excluded.version, updated=excluded.updated',
       [g['n'], g['title'], g['blurb'], 1 if g.get('free') else 0, json.dumps(g['qs'], ensure_ascii=False), data['version'], now])
top = max(g['n'] for g in data['grades']); d1('DELETE FROM learn_quiz WHERE grade > ?', [top])
print('loaded', len(data['grades']), 'grades,', sum(len(g['qs']) for g in data['grades']), 'questions, version', data['version'])
