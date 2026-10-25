#!/usr/bin/env python3
"""keep_previous.py — a crawled theme whose live site answered the build's crawl with an error (the dartboard's own server
answered 429 "Too Many Requests" to the 7d0a5ef build on 25 Oct 2026, so the theme lost its home page and bundle and
/dartboard/ answered 404) keeps the files of its previous published build that this build did not get. Only missing files are
copied, never over a fresh one; the previous copies are already processed (runtime, links, base path), so this runs at the end
of tools/site.py, after the rewrite and ingredients passes. Report: dist/_cedwyn/reports/keep_previous.json. — Sion's Tab agent"""
import json, os, pathlib, shutil, subprocess, sys
def run(dist):
    dist = pathlib.Path(dist); root = pathlib.Path(__file__).resolve().parent.parent
    themes = json.load(open(root / 'themes.json', encoding='utf-8'))['themes']
    need = [t['id'] for t in themes if (t.get('crawl') or t.get('crawl_first')) and not (dist / t['id'] / 'index.html').exists()]
    rep = {'missing_home': need, 'restored': {}}
    if need:
        repo = os.environ.get('GITHUB_REPOSITORY', 'unclehowell/cedwyn'); tmp = pathlib.Path('prev_site')
        shutil.rmtree(tmp, ignore_errors=True)
        try:
            subprocess.run(['git', 'clone', '-q', '--depth', '1', '--filter=blob:none', '--sparse', '-b', 'site', f'https://github.com/{repo}.git', str(tmp)], check=True, timeout=600)
            subprocess.run(['git', '-C', str(tmp), 'sparse-checkout', 'set', '--no-cone'] + [f'/{t}/' for t in need] + [f'!/{t}/db/' for t in need], check=True, timeout=900)
            for t in need:
                src = tmp / t; n = 0
                if not src.exists(): continue
                for f in src.rglob('*'):
                    if not f.is_file() or 'db' in f.relative_to(src).parts[:1]: continue
                    dst = dist / t / f.relative_to(src)
                    if dst.exists(): continue
                    dst.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(f, dst); n += 1
                rep['restored'][t] = n
        except Exception as e: rep['error'] = str(e)[:300]
        shutil.rmtree(tmp, ignore_errors=True)
    out = dist / '_cedwyn' / 'reports'; out.mkdir(parents=True, exist_ok=True)
    json.dump(rep, open(out / 'keep_previous.json', 'w'), indent=1)
    print('keep_previous:', rep)
    return rep
if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
