#!/usr/bin/env python3
"""page_journal.py 1.0.0 - a short dated journal of each page's OWN changes, inline in that page's footer area.
Owner, 30 Oct 2026 14:50 GMT: journal the page changes on the footer of each page. ADR-002 item 7 (work/cedwyn-data-arch/PLAN.md).
Sources (data, never hand-edited HTML):
  data/journal/pages.json            {"/path/": [{"v": "2.0.1", "date": "YYYY-MM-DD", "note": "neutral change line"}, ...]}
  <dist>/<app>/_db/view.json         records of data-driven apps: each record page lists its record's 'changes'
                                     ([{date, rev, note}]) or, when none are recorded, its revision and date.
Writes one <details id="cedwyn-journal"> block before </body> of each page that has entries (no extra files: the host's
file cap), newest first, at most 6 lines, neutral wording only. Never fails the build. Report: _cedwyn/reports/page_journal.json.
Usage: python3 tools/page_journal.py dist  - Cedwyn editors"""
import json, sys, html, pathlib, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
MAX = 6
STYLE = ('<style id="cedwyn-journal-css">#cedwyn-journal{max-width:960px;margin:24px auto 8px;padding:0 16px;font:12px/1.5 system-ui,-apple-system,Segoe UI,sans-serif;opacity:.72;color:inherit}'
         '#cedwyn-journal summary{cursor:pointer;letter-spacing:.06em;text-transform:uppercase;font-size:11px}#cedwyn-journal ol{margin:6px 0 0;padding-left:18px}'
         '#cedwyn-journal li{margin:2px 0}#cedwyn-journal b{font-weight:600}</style>')
def block(entries):
    rows = ''.join('<li><b>%s</b> · %s — %s</li>' % (html.escape(str(e.get('v') or '')), html.escape(str(e.get('date') or '')), html.escape(str(e.get('note') or '')))
                   for e in entries[:MAX])
    return STYLE + '<details id="cedwyn-journal" class="cw-journal"><summary>Page journal</summary><ol>' + rows + '</ol></details>'
def page_file(dist, path):
    p = dist / path.strip('/')
    return p / 'index.html' if not path.endswith('.html') else p
def entries_from_view(app, vj):
    out = {}
    for rows in (vj.values() if isinstance(vj, dict) else []):
        if not isinstance(rows, list): continue
        for r in rows:
            if not isinstance(r, dict) or not r.get('slug'): continue
            ch = r.get('changes') or []
            es = [{'v': 'rev %s' % c.get('rev', ''), 'date': c.get('date', ''), 'note': c.get('note', '')} for c in ch if c.get('note')]
            if not es and r.get('updated'):
                es = [{'v': ('rev %s' % r['rev']) if r.get('rev') else r.get('id', ''), 'date': r.get('updated'), 'note': 'Card last revised in the central catalogue.'}]
            if es: out['/%s/%s/' % (app, r['slug'])] = es
    return out
def run(dist):
    dist = pathlib.Path(dist); rep = {'pages': 0, 'missing': [], 'sources': {}}
    J = {}
    try: J.update({k: list(v) for k, v in json.load(open(ROOT / 'data/journal/pages.json', encoding='utf-8')).get('pages', {}).items()})
    except Exception as e: print('page_journal: no pages.json', e)
    rep['sources']['pages.json'] = len(J)
    for vf in sorted((ROOT / 'data/views').glob('*.view.json')):
        app = vf.name[:-len('.view.json')]; db = dist / app / '_db' / 'view.json'
        if not db.exists(): continue
        try:
            got = entries_from_view(app, json.load(open(db, encoding='utf-8')))
            for k, v in got.items(): J.setdefault(k, []).extend(v)
            rep['sources'][app] = len(got)
        except Exception as e: print('page_journal', app, 'failed', e)
    for path, es in J.items():
        es = sorted(es, key=lambda e: (str(e.get('date') or ''), str(e.get('v') or '')), reverse=True)
        f = page_file(dist, path)
        if not f.exists(): rep['missing'].append(path); continue
        t = f.read_text('utf-8', 'ignore')
        t = re.sub(r'<style id="cedwyn-journal-css">.*?</style><details id="cedwyn-journal".*?</details>', '', t, flags=re.S)
        i = t.lower().rfind('</body>')
        t = (t[:i] + block(es) + t[i:]) if i >= 0 else t + block(es)
        f.write_text(t, 'utf-8'); rep['pages'] += 1
    try:
        (dist / '_cedwyn' / 'reports').mkdir(parents=True, exist_ok=True)
        (dist / '_cedwyn' / 'reports' / 'page_journal.json').write_text(json.dumps(rep, indent=1))
    except Exception: pass
    print('page_journal 1.0.0:', json.dumps({k: (v if k != 'missing' else len(v)) for k, v in rep.items()}))
    return rep
if __name__ == '__main__':
    try: run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
    except Exception as e: print('::warning::page_journal did not complete:', e)
