#!/usr/bin/env python3
"""Data-integrity test for the Legal Threshold Tree (Mr Wolf 4.0).
Run: python3 tools/test_tree.py            (offline checks)
     python3 tools/test_tree.py --online   (also checks every leaf record resolves at its live source)"""
import csv, io, json, re, sys, urllib.request, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
T = json.load(open(ROOT / 'legal-tree.json', encoding='utf-8'))
L = json.load(open(ROOT / 'evidence-links.json', encoding='utf-8'))
errors = []
def bad(msg): errors.append(msg)

ids = [n['id'] for n in T['nodes']]
if len(ids) != len(set(ids)): bad('duplicate node ids')
N = {n['id']: n for n in T['nodes']}
roots = [n for n in T['nodes'] if not n['parent']]
if len(roots) != 1 or roots[0]['kind'] != 'trunk': bad('the tree must have exactly one trunk')
for n in T['nodes']:
    if n['parent'] and n['parent'] not in N: bad('%s: unknown parent %s' % (n['id'], n['parent']))
    if n['status'] not in T['statuses']: bad('%s: unknown status %s' % (n['id'], n['status']))
    if n['kind'] not in T['kinds']: bad('%s: unknown kind %s' % (n['id'], n['kind']))
    if n['kind'] != 'evidential' and not n.get('authority'): bad('%s: a legal node needs an authority' % n['id'])
    if not n.get('authority') and n['status'] not in ('research_required', 'not_established', 'partial'): bad('%s: no authority but status %s' % (n['id'], n['status']))
    for k in n.get('authority', []):
        a = T.get('authorities', {}).get(k) if isinstance(k, str) else k
        if a is None: bad('%s: unknown authority key %s' % (n['id'], k)); continue
        if a.get('verified') not in T['verified']: bad('%s: authority %r has no verification level' % (n['id'], a.get('cite')))
        if not a.get('cite'): bad('%s: authority without a citation' % n['id'])
    if len(n['label']) > 40: bad('%s: label too long for the tree' % n['id'])

seen = set()
for l in L['links']:
    k = (l['node'], l['record'])
    if k in seen: bad('duplicate leaf %s on %s' % (l['record'], l['node']))
    seen.add(k)
    if l['node'] not in N: bad('leaf %s on unknown node %s' % (l['record'], l['node']))
    if l['strength'] not in L['strengths']: bad('leaf %s: unknown strength' % l['record'])
    if l['relation'] not in L['relations']: bad('leaf %s: unknown relation' % l['record'])
    if l['source'] not in L['sources']: bad('leaf %s: unknown source' % l['record'])
    for f in ('reason', 'proposition'):
        if not l.get(f): bad('leaf %s on %s: missing %s' % (l['record'], l['node'], f))
    if l['relation'] == 'missing' and l['strength'] != 'grey': bad('leaf %s: a record not held must be grey' % l['record'])
    if l['source'] == 'catalogue' and not re.match(r'^(EV|MR|FA|AR|CC|PE)-[0-9A-Z-]+$', l['record']): bad('leaf %s: not a catalogue id' % l['record'])
    if 'assessment' not in l or not l['assessment'].get('date'): bad('leaf %s: no assessment date' % l['record'])

if '--online' in sys.argv:
    base = 'https://bucklerfamily.estate'
    def get(u):
        return urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'mr-wolf-test/4.0 (+https://bucklerfamily.estate/mr-wolf/)'}), timeout=60).read()
    ch = json.loads(get(base + '/that-old-chestnut/_db/view.json'))
    toc = {c['id'] for c in ch.get('chestnuts', [])}
    db = {r['id'] for r in csv.DictReader(io.StringIO(get(base + '/dartboard/data/foi-tracker.csv').decode('utf-8')))}
    for rec in sorted({(l['source'], l['record']) for l in L['links']}):
        s, r = rec
        try:
            if s == 'catalogue':
                if not json.loads(get(base + '/api/catalogue/' + r)).get('item'): bad('%s not in the catalogue' % r)
            elif s == 'chestnut' and r not in toc: bad('%s not in That Old Chestnut' % r)
            elif s == 'dartboard' and r not in db: bad('%s not in the Dartboard tracker' % r)
            elif s == 'mirror': get(L['sources']['mirror']['api'].replace('{slug}', r.split(':', 1)[1]))
        except Exception as e:
            bad('%s %s: %s' % (s, r, e))

print('%d nodes, %d leaves, %d records' % (len(ids), len(L['links']), len({l['record'] for l in L['links']})))
for e in errors: print('FAIL', e)
sys.exit(1 if errors else 0)
