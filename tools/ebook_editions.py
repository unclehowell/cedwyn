#!/usr/bin/env python3
"""ebook_editions.py - the e-book compartment's editions and prices (25 Oct 2026). - Sion's Tab agent
Touches only /ebooks/ (the e-book theme's own pages) and the /ebooks/api/ route:
- an "Editions and prices" table at the top of /ebooks/ and "version x.y.z · £" on each book card, from data/ebooks.json;
- the free-edition downloads: the e-book pages link /ebooks/api/free?book=..., a gate that lives on the shop
  (ebooks.bucklerfamily.estate/api/, which serves paying customers and is not retired), so /ebooks/api/* is sent there (302).
Usage: python3 tools/ebook_editions.py dist   (site.py calls it after sections.py)"""
import json, html, pathlib, sys, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
E = html.escape
CSS = ('<style id="eb-editions-css">.eb-eds{margin:0 auto 18px;max-width:1100px;padding:0 16px}.eb-eds h2{margin:6px 0 6px}.eb-eds p{margin:0 0 8px;opacity:.85;font-size:14px}'
       '.eb-eds .sc{overflow-x:auto;-webkit-overflow-scrolling:touch}.eb-eds table{border-collapse:collapse;width:100%;min-width:520px;font-size:14px}'
       '.eb-eds th,.eb-eds td{text-align:left;padding:7px 8px;border-bottom:1px solid rgba(128,128,128,.35);vertical-align:top}.eb-eds th{font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}'
       '.eb-eds td.n{white-space:nowrap}.eb-eds a{color:inherit}</style>')
def table(D):
    rows = ''.join(f'<tr><td><a href="{E(b["page"] or "/ebooks/")}">{E(b["title"])}</a></td><td class="n">{E(b["edition"])}</td><td class="n">{E(b["semver"])}</td>'
                   f'<td class="n">{E(b["price"])}</td><td class="n">{E(b["free"] + " · £0.00" if b.get("free") and b["free"] != b["edition"] else "—")}</td></tr>' for b in D['books'])
    rows += ''.join(f'<tr><td><a href="{E(x["page"] or "/ebooks/")}">{E(x["title"])}</a></td><td class="n">newest</td><td class="n">—</td><td class="n">{E(x["price"])}</td><td class="n">—</td></tr>' for x in D.get('bundles', []))
    return (f'<section class="eb-eds" id="editions" aria-label="Editions and prices">{CSS}<h2>Editions and prices</h2>'
            f'<p>Each book’s current edition, its version number and its price. Every book’s first edition (v0.01) is free.</p>'
            f'<div class="sc"><table><thead><tr><th>Book</th><th>Edition</th><th>Version</th><th>Price</th><th>Free edition</th></tr></thead><tbody>{rows}</tbody></table></div></section>')
def run(dist):
    dist = pathlib.Path(dist); D = json.load(open(ROOT / 'data' / 'ebooks.json', encoding='utf-8')); n = 0
    p = dist / 'ebooks' / 'index.html'
    if p.exists():
        t = p.read_text(encoding='utf-8', errors='ignore'); o = t
        if 'id="editions"' not in t:
            m = re.search(r'<main\b[^>]*>', t)
            if m: t = t[:m.end()] + table(D) + t[m.end():]
        for b in D['books']:   # "version x.y.z · £" on the book's own card
            m = re.search(r'(<article class="eb-card" id="%s".*?<p class="eb-facts">)' % re.escape(b['id']), t, flags=re.S)
            if m and ('data-eb-ver="%s"' % b['id']) not in t:
                t = t[:m.end()] + f'<span data-eb-ver="{E(b["id"])}">version {E(b["semver"])} · {E(b["price"])}</span>' + t[m.end():]
        if t != o: p.write_text(t, encoding='utf-8'); n += 1
    rd = dist / '_redirects'
    gate = ['/ebooks/api/* https://ebooks.bucklerfamily.estate/api/:splat 302', '/wales/ebooks/api/* https://ebooks.bucklerfamily.estate/api/:splat 302',
            '/argentina/ebooks/api/* https://ebooks.bucklerfamily.estate/api/:splat 302']
    old = rd.read_text().splitlines() if rd.exists() else []
    rd.write_text('\n'.join(gate + [l for l in old if l not in gate]) + '\n')
    print('ebook_editions: pages changed', n, '; books', len(D['books']))
if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
