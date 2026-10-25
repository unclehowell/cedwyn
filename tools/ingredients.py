#!/usr/bin/env python3
"""Cedwyn editorial rule: ingredients, not conclusions (25 Oct 2026).
Applies ingredients.json to the assembled site (dist/<theme>/<file>): exact find -> replace of sentences that hand the reader a
conclusion, in the cedwyn copy only (datro and its subdomains are never touched). Missing finds are reported, never fatal.
Called from tools/site.py so it runs before the self-contained pass and the catalogue database (the FTS index carries the
reworded text). Report: dist/_cedwyn/reports/ingredients.json. — Sion's Tab agent"""
import json, pathlib, sys
def apply(dist, cfg_path=None):
    dist = pathlib.Path(dist); cfg_path = pathlib.Path(cfg_path or pathlib.Path(__file__).resolve().parent.parent / 'ingredients.json')
    if not cfg_path.exists(): return {'applied': 0, 'missing': 0, 'note': 'no ingredients.json'}
    cfg = json.load(open(cfg_path, encoding='utf-8')); rep = {'version': cfg.get('version'), 'applied': [], 'missing': []}
    for e in cfg.get('rewords', []):
        f = dist / e['theme'] / e.get('file', 'index.html')
        if not f.exists(): rep['missing'].append({'theme': e['theme'], 'file': str(e.get('file')), 'why': 'file not found'}); continue
        t = f.read_text(encoding='utf-8', errors='surrogateescape'); n = t.count(e['find'])
        if n: f.write_text(t.replace(e['find'], e['replace']), encoding='utf-8', errors='surrogateescape'); rep['applied'].append({'theme': e['theme'], 'file': e.get('file'), 'n': n})
        else: rep['missing'].append({'theme': e['theme'], 'file': e.get('file'), 'find': e['find'][:60]})
    out = dist / '_cedwyn' / 'reports'; out.mkdir(parents=True, exist_ok=True)
    json.dump(rep, open(out / 'ingredients.json', 'w'), indent=1, ensure_ascii=False)
    print('ingredients:', len(rep['applied']), 'applied,', len(rep['missing']), 'missing')
    return rep
if __name__ == '__main__': apply(sys.argv[1] if len(sys.argv) > 1 else 'dist')
