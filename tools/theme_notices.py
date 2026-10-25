#!/usr/bin/env python3
"""theme_notices.py - per-theme notice boxes (25 Oct 2026, forensic audit intake). - Sion's Tab agent
Each compartment keeps its own notices in notices/<theme>.json; this step touches only dist/<theme>/ pages listed there.
A notice goes directly after the page's first </h1>; on the theme home ("home_before_details") directly above the first <details>.
Usage: python3 tools/theme_notices.py dist   (site.py calls it right after the ingredients pass)"""
import json, html, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
BOX = ('<aside class="cedwyn-notice" data-cedwyn-notice="{k}" role="note" style="border:1px solid rgba(200,160,60,.6);background:rgba(200,160,60,.10);'
       'border-radius:8px;padding:10px 12px;margin:12px 0;font-size:14px;line-height:1.45"><strong>{h}</strong> {t}</aside>')
def run(dist):
    dist = pathlib.Path(dist); done = 0; miss = []
    for cf in sorted((ROOT / 'notices').glob('*.json')):
        N = json.load(open(cf, encoding='utf-8')); theme = N['theme']
        for n in N['notices']:
            box = BOX.format(k=html.escape(n['id']), h=html.escape(n.get('heading', '')), t=html.escape(n['text']))
            for pg in n.get('pages', []):
                rel = pg.strip('/').split('/', 1)
                if rel[0] != theme: miss.append(pg); continue   # a compartment's notices stay in that compartment
                f = dist / theme / ((rel[1] + '/') if len(rel) > 1 else '') / 'index.html'
                if not f.exists(): miss.append(pg); continue
                t = f.read_text(encoding='utf-8', errors='surrogateescape')
                if 'data-cedwyn-notice="%s"' % n['id'] in t: continue
                i = t.find('</h1>')
                if i < 0: miss.append(pg); continue
                f.write_text(t[:i + 5] + box + t[i + 5:], encoding='utf-8', errors='surrogateescape'); done += 1
            if n.get('home_before_details'):
                f = dist / theme / 'index.html'
                if f.exists():
                    t = f.read_text(encoding='utf-8', errors='surrogateescape'); i = t.find('<details')
                    if i >= 0 and ('data-cedwyn-notice="%s"' % n['id']) not in t[:i]:
                        f.write_text(t[:i] + box + t[i:], encoding='utf-8', errors='surrogateescape'); done += 1
                    elif i < 0: miss.append('/%s/ (no <details>)' % theme)
    print('theme_notices:', done, 'placed;', len(miss), 'not found', miss[:4])
if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
