#!/usr/bin/env python3
"""ebook_editions.py - the e-book compartment's editions and prices (25 Oct 2026). - Sion's Tab agent
Touches only /ebooks/ (the e-book theme's own pages) and the /ebooks/api/ route:
- an "Editions and prices" table at the top of /ebooks/ and "version x.y.z · £" on each book card, from data/ebooks.json;
- the free-edition downloads: the e-book pages link /ebooks/api/free?book=..., a gate that lives on the shop
  (ebooks.bucklerfamily.estate/api/, which serves paying customers and is not retired), so /ebooks/api/* is sent there (302).
Usage: python3 tools/ebook_editions.py dist   (site.py calls it after sections.py)"""
import json, html, pathlib, sys, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
STEP_GBP = 4.99  # whole-release price step: v0.0.1 free, each later release +STEP_GBP (Sion 05:13 GMT 27 Oct 2026) - Sion's Tab agent
def release_price(n): return '£%d.%02d' % divmod((n - 1) * round(STEP_GBP * 100), 100)  # whole pence
E = html.escape
CSS = ('<style id="eb-editions-css">.eb-eds{margin:0 auto 18px;max-width:1100px;padding:0 16px}.eb-eds h2{margin:6px 0 6px}.eb-eds p{margin:0 0 8px;opacity:.85;font-size:14px}'
       '.eb-eds .sc{overflow-x:auto;-webkit-overflow-scrolling:touch}.eb-eds table{border-collapse:collapse;width:100%;font-size:14px}'
       '.eb-eds th,.eb-eds td{text-align:left;padding:7px 8px;border-bottom:1px solid rgba(128,128,128,.35);vertical-align:top}.eb-eds th{font-size:12px;letter-spacing:.08em;text-transform:uppercase;opacity:.8}'
       '.eb-eds td.n{white-space:nowrap}.eb-eds small{opacity:.75;font-size:12px}.eb-eds a{color:inherit}'
       # rows become cards on phones, no sideways scroll (Sion, 13:15 GMT 26 Oct 2026) - Sion's Tab agent
       '@media(max-width:640px){.eb-eds{padding:0 12px}.eb-eds .sc{overflow:visible}.eb-eds table,.eb-eds tbody,.eb-eds tr,.eb-eds td{display:block;width:auto}.eb-eds thead{display:none}'
       '.eb-eds tr{border:1px solid rgba(128,128,128,.35);border-radius:10px;padding:8px 10px;margin:0 0 8px}.eb-eds td,.eb-eds td.n{border:0;padding:2px 0;white-space:normal;overflow-wrap:anywhere}'
       '.eb-eds td:first-child{font-weight:600}.eb-eds td:nth-child(2)::before{content:"Edition · ";opacity:.7;font-size:12px}.eb-eds td:nth-child(3)::before{content:"Price · ";opacity:.7;font-size:12px}}</style>')
ACADEMY = ('<section class="eb-about eb-bundle" id="academy-upsell"><h2>Cedwyn Academy · £49.99 a month</h2>'
           '<p>Members get the latest version of every e-book and the latest documentary scenes included, with the course on the case, module by module.</p>'
           '<div class="eb-actions2"><a class="sl-btn" href="/learn/">See the Academy</a></div></section>')
def table(D):
    rows = ''.join(f'<tr><td><a href="{E(b["page"] or "/ebooks/")}">{E(b["title"])}</a></td><td class="n">{E(b["edition"])}' + (f'<br><small><a href="{E(b["supplement"])}">+ supplement, 25 Oct 2026 (free PDF)</a></small>' if b.get('supplement') else '') + '</td>'
                   f'<td class="n">{E(b["price"])}</td></tr>' for b in D['books'])
    rows += ''.join(f'<tr><td><a href="{E(x["page"] or "/ebooks/")}">{E(x["title"])}</a></td><td class="n">newest<br><small>editions</small></td><td class="n">{E(x["price"])}</td></tr>' for x in D.get('bundles', []))
    return (f'<section class="eb-eds" id="editions" aria-label="Editions and prices">{CSS}<h2>Editions and prices</h2>'
            f'<p>Each book’s current edition, its version number and its price. Every book’s first whole release (v0.0.1) is free; each later release costs £4.99 more than the one before.</p>'
            f'<div class="sc"><table><thead><tr><th>Book</th><th>Edition</th><th>Price</th></tr></thead><tbody>{rows}</tbody></table></div></section>')
def run(dist):
    dist = pathlib.Path(dist); D = json.load(open(ROOT / 'data' / 'ebooks.json', encoding='utf-8')); n = 0
    p = dist / 'ebooks' / 'index.html'
    if p.exists():
        t = p.read_text(encoding='utf-8', errors='ignore'); o = t
        # The Argentina and Wales paths rewrite to this shared shelf. Move its pitch
        # from the hero to the end of the main content, without duplicating the copy.
        if 'id="digital-estate-books"' not in t:
            m = re.search(
                r'(<p>The digital estate’s records as books you can keep:.*?</p>\s*'
                r'<div class="sl-actions">.*?Buy all four.*?</div>\s*'
                r'<p class="eb-proof"[^>]*>.*?Cardiff Times, 16 July 1904\..*?</p>)',
                t, flags=re.S)
            if m:
                pitch = m.group(1)
                t = t[:m.start()] + t[m.end():]
                pitch_section = ('<section class="sl-band eb-about" id="digital-estate-books" '
                                 'aria-label="Digital estate books">\n' + pitch + '\n</section>\n')
                at = t.rfind('</main>')
                if at >= 0:
                    t = t[:at] + pitch_section + t[at:]
        if 'id="editions"' not in t:
            m = re.search(r'<main\b[^>]*>', t)
            if m: t = t[:m.end()] + table(D) + t[m.end():]
        if 'id="academy-upsell"' not in t:   # cross-sell: membership includes the latest editions (27 Oct 2026) - Sion's Tab agent
            m = re.search(r'<section class="eb-about eb-bundle" id="all-four">.*?</section>', t, flags=re.S)
            if m: t = t[:m.end()] + ACADEMY + t[m.end():]
        for b in D['books']:   # "version x.y.z · £" on the book's own card
            m = re.search(r'(<article class="eb-card" id="%s".*?<p class="eb-facts">)' % re.escape(b['id']), t, flags=re.S)
            if m and ('data-eb-ver="%s"' % b['id']) not in t:
                t = t[:m.end()] + f'<span data-eb-ver="{E(b["id"])}">{E(b["edition"])} · {E(b["price"])}</span>' + t[m.end():]
        if t != o: p.write_text(t, encoding='utf-8'); n += 1
    rd = dist / '_redirects'
    gate = ['/ebooks/api/* https://ebooks.bucklerfamily.estate/api/:splat 302', '/wales/ebooks/api/* https://ebooks.bucklerfamily.estate/api/:splat 302',
            '/argentina/ebooks/api/* https://ebooks.bucklerfamily.estate/api/:splat 302']
    old = rd.read_text().splitlines() if rd.exists() else []
    rd.write_text('\n'.join(gate + [l for l in old if l not in gate]) + '\n')
    print('ebook_editions: pages changed', n, '; books', len(D['books']))
if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
