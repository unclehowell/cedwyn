#!/usr/bin/env python3
"""purge_promo.py - remove the retired cross-promo chrome from every built page (2 Nov 2026). - Sion's Tab agent
Owner instruction, 00:48 GMT 2 Nov 2026: the graph promo strip, the section ribbon chips (Vouchers / E-books / the other nation,
"coming soon" teasers), the "Outside records" popup and the e-book strips are purged from every webapp; one Garden banner
(/_cedwyn/garden-banner.js, in the header's slim strip) takes their place. Spec: docs/GARDEN-BANNER.md.
The writers no longer add them (site.py no longer calls _shop_strip, halves.py dropped the home button and the Wales hub strip,
chronology.py keeps its notice for llms.txt only, section.js draws no ribbon, cw-graph.js no longer takes over the header strip).
This pass also cleans copies that carry them baked in: pages kept from earlier builds (keep_previous.py) and branch pages that
were themselves copied from the live site. Archived copies (wayback/websites, mail, html, snapshot) are left as captured.
Removes: <p class="ebook-strip">...</p>, <a class="hv-eb">...</a>, <aside ... data-cedwyn-notice="outside-records">...</aside>,
<div class="cedwyn-rib">...</div>. Report: dist/_cedwyn/reports/purge_promo.json. Never stops a build.
Usage: python3 tools/purge_promo.py dist   (site.py calls it after keep_previous and the page writers)"""
import json, pathlib, re, sys
SKIP = ('wayback/websites/', 'wayback/mail/', 'wayback/html/', 'wayback/snapshot/', '_cedwyn/', 'db/', '_blob/')   # archived copies stay as captured; /wayback/go/ (the embed viewer) is cleaned
PATTERNS = [
    ('ebook_strip', re.compile(r'<p\s+class="ebook-strip"[^>]*>.*?</p>\s*', re.S)),
    ('home_ebook_button', re.compile(r'<a\s+class="hv-eb"[^>]*>.*?</a>', re.S)),
    ('outside_records_popup', re.compile(r'<aside\b[^>]*data-cedwyn-notice="outside-records"[^>]*>.*?</aside>', re.S)),
    ('section_ribbon', re.compile(r'<div\s+class="cedwyn-rib[^"]*"[^>]*>.*?</div>(?=\s*<)', re.S)),
]
MARKERS = ('ebook-strip', 'hv-eb', 'outside-records', 'cedwyn-rib')
def run(dist):
    dist = pathlib.Path(dist); rep = {'version': '1.0.0', 'removed': {k: 0 for k, _ in PATTERNS}, 'files_changed': 0, 'sample': []}
    for f in dist.rglob('*.htm*'):
        if not f.is_file(): continue
        rel = f.relative_to(dist).as_posix()
        if rel.startswith(SKIP): continue
        try: t = f.read_text(encoding='utf-8')
        except Exception: continue
        if not any(m in t for m in MARKERS): continue
        o = t
        for k, rx in PATTERNS:
            t, n = rx.subn('', t)
            if n: rep['removed'][k] += n
        if t != o:
            f.write_text(t, encoding='utf-8'); rep['files_changed'] += 1
            if len(rep['sample']) < 20: rep['sample'].append(rel)
    out = dist / '_cedwyn' / 'reports'; out.mkdir(parents=True, exist_ok=True)
    json.dump(rep, open(out / 'purge_promo.json', 'w'), indent=1)
    print('promo purge:', rep['removed'], 'in', rep['files_changed'], 'files')
    return rep
if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
