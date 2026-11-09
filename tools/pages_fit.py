#!/usr/bin/env python3
"""pages_fit.py - keep the deploy under Cloudflare Pages' 20,000-file limit (8 Nov 2026, P-PAGES-20K-FILES). - Sion's Tab agent
Since 94447fc (7 Nov 20:00Z) the docs library is a full Sphinx build per record: nine files per record instead of three, and
dist went from 19,075 to 25,537 files. Pages refused both deploys after it ("Pages only supports up to 20,000 files"), so the
live site stayed on the 19:05Z build while GitHub showed the build as a success. This step runs after every writer and:
  1. removes each docs record's Sphinx genindex.html, search.html and searchindex.js (empty index / per-record search;
     the last live build never had them);
  2. points every docs page at one shared /docs/_static/documentation_options.js when its own copy is byte-identical;
  3. replaces each single-language picker (latest/html/index.html -> ./en/) with one redirect rule;
  4. only if dist is still over TARGET: removes the per-record releasenotes.html (also absent from the last live build);
  5. fails the build when dist is still over LIMIT, so the problem shows on GitHub instead of only in the Pages log.
Writes _cedwyn/reports/pages_fit.json. Usage: python3 tools/pages_fit.py dist"""
import os, re, sys, json, pathlib, filecmp
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
LIMIT, TARGET = 20000, 19500
SHARED = DIST / 'docs' / '_static' / 'documentation_options.js'
OPTSRC = re.compile(r"""(src=["'])_static/documentation_options\.js""")
def count():
    return sum(len(f) for _, _, f in os.walk(DIST))
rep = {'before': count(), 'removed': {}, 'shared_options': 0, 'pickers': 0}
def rm(p, why):
    p.unlink(); rep['removed'][why] = rep['removed'].get(why, 0) + 1
outs = sorted(p.parent for p in (DIST / 'docs').rglob('searchindex.js')) if (DIST / 'docs').is_dir() else []
canon = None
for d in outs:
    if not (d / 'index.html').is_file(): continue          # not a Sphinx html output folder
    for n in ('genindex.html', 'search.html', 'searchindex.js'):
        if (d / n).is_file(): rm(d / n, n)
    o = d / '_static' / 'documentation_options.js'
    if o.is_file():
        if canon is None:
            canon = o
            if not SHARED.exists():
                SHARED.parent.mkdir(parents=True, exist_ok=True); SHARED.write_bytes(o.read_bytes())
            elif not filecmp.cmp(o, SHARED, shallow=False):
                canon = SHARED
        if filecmp.cmp(o, SHARED, shallow=False):
            for h in d.glob('*.html'):
                s = h.read_text('utf-8', 'ignore'); s2 = OPTSRC.sub(r'\1/docs/_static/documentation_options.js', s)
                if s2 != s: h.write_text(s2, 'utf-8')
            o.unlink(); rep['shared_options'] += 1
            try: o.parent.rmdir()
            except OSError: pass
    pk = d.parent / 'index.html'                          # .../latest/html/index.html: the language picker
    langs = [x for x in d.parent.iterdir() if x.is_dir()]
    if d.name == 'en' and pk.is_file() and len(langs) == 1 and "./en/" in pk.read_text('utf-8', 'ignore'):
        pk.unlink(); rep['pickers'] += 1
if rep['pickers']:
    red = DIST / '_redirects'
    rules = ['/docs/:sec/:id/latest/html/ /docs/:sec/:id/latest/html/en/ 302',
             '/docs/:sec/:id/latest/html /docs/:sec/:id/latest/html/en/ 302']
    old = red.read_text('utf-8') if red.exists() else ''
    add = [r for r in rules if r not in old]
    if add: red.write_text(old.rstrip('\n') + ('\n' if old else '') + '\n'.join(add) + '\n', 'utf-8')
if count() > TARGET:
    for d in outs:
        if (d / 'releasenotes.html').is_file(): rm(d / 'releasenotes.html', 'releasenotes.html')
rep['after'] = count()
(DIST / '_cedwyn' / 'reports').mkdir(parents=True, exist_ok=True)
json.dump(rep, open(DIST / '_cedwyn' / 'reports' / 'pages_fit.json', 'w'), indent=1)
print('pages_fit:', json.dumps(rep))
if rep['after'] > LIMIT:
    print(f"::error::dist has {rep['after']} files; Cloudflare Pages refuses a deploy over {LIMIT} (see P-PAGES-20K-FILES)")
    sys.exit(1)
