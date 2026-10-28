#!/usr/bin/env python3
"""ebook_shelf.py - /ebooks/ as a title-shopping shelf of small poster cards (27 Oct 2026). - Sion's Tab agent
Runs after ebook_editions.py (site.py). Touches only dist/ebooks/index.html:
- the long book list (section.eb-list) becomes a responsive grid of poster cards: 2 per row on a phone, 4-5 on desktop;
- each card: 2:3 cover (webp under web/ebooks/posters/<id>.webp, else the book's existing cover), the title, a one-line hook,
  the existing version <select> (latest selected) and its Buy/Read button (same checkout links, same sv-js script);
- tapping the cover opens the book's free first release (v0.0.1) in the existing reader (a[data-edp-pdf]);
- the title is plain text unless the book has its own page (data/ebooks.json "page", not /ebooks/ itself);
- the editions table moves below the shelf; the bundle and Academy sections stay where they are.
Prices, checkout links and utm parameters are copied from the page as they are; nothing new is created."""
import json, html, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
E = html.escape
VERSION = '1.2.0'
VERSIONS = [('1.2.0', '28 Oct 2026', 'Purchase hierarchy: compact paid history book first, free 32-page introduction second, four-book bundle preserved; adds research-status caution'),
            ('1.1.0', '27 Oct 2026', 'Poster-card shelf; cover opens the free edition; titles link only to a book’s own page'),
            ('1.0.1', '26 Oct 2026', 'Editions table shown as cards on phones'),
            ('1.0.0', '25 Oct 2026', 'Editions and prices table')]
CSS = ('<style id="sh-css">.sh{max-width:1240px;margin:0 auto 22px;padding:0 12px}.sh h2.sh-h{margin:4px 0 12px;font-size:1.25rem}'
       '.sh-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 12px;margin:0;padding:0;list-style:none}'
       '@media(min-width:700px){.sh-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(min-width:960px){.sh-grid{grid-template-columns:repeat(4,minmax(0,1fr));gap:20px 16px}}'
       '@media(min-width:1200px){.sh-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}'
       '.sh-card{display:flex;flex-direction:column;min-width:0;margin:0;padding:0;list-style:none}.sh-card::before{content:none}'
       '.sh-cov{display:block;position:relative;aspect-ratio:2/3;overflow:hidden;border-radius:6px;background:#111;box-shadow:0 6px 18px rgba(0,0,0,.45);transition:transform .15s}'
       '.sh-cov:hover,.sh-cov:focus-visible{transform:translateY(-3px)}.sh-cov img{display:block;width:100%;height:100%;object-fit:cover}'
       '.sh-free{position:absolute;left:6px;top:6px;padding:2px 7px;border-radius:3px;font:700 .62rem/1.5 system-ui,sans-serif;letter-spacing:.08em;text-transform:uppercase;background:#F2C94C;color:#1a1a1a}'
       '.sh-t{margin:9px 0 2px;font-size:.95rem;line-height:1.25;font-weight:700;overflow-wrap:anywhere}.sh-t a{color:inherit;text-decoration:underline;text-underline-offset:2px}'
       '.sh-hook{margin:0 0 7px;font-size:.8rem;line-height:1.3;opacity:.8}'
       '.sh-card .eb-edbox{margin:auto 0 0;max-width:none}.sh-card .sv-pick{margin:0}.sh-card .sv-lab{display:block;font-size:.66rem;letter-spacing:.1em;text-transform:uppercase;opacity:.7;margin:0 0 3px}'
       '.sh-card .sv-row{display:flex;flex-direction:column;gap:6px}.sh-card .sv-sel{width:100%;min-width:0;max-width:100%;font-size:.85rem;padding:6px 4px}'
       '.sh-card .sv-go{display:block;text-align:center;padding:9px 6px;font-size:.8rem;font-weight:700;border-radius:4px}'
       '.sh-card .sv-free{display:block;margin:5px 0 0;font-size:.72rem;opacity:.8}.sh-ver{margin:14px 0 0;font-size:.72rem;opacity:.65}.sh .sh-t{font-size:15px!important;line-height:1.25!important;letter-spacing:0!important;text-transform:none!important;margin:9px 0 3px!important;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.sh .sh-hook{font-size:12.5px!important;line-height:1.35!important;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.sh .sh-card select.sv-sel{height:38px!important;min-height:0!important;max-height:38px!important;padding:4px 6px!important;font-size:13px!important;line-height:1.2!important;box-sizing:border-box}.sh .sh-card .sv-go{font-size:13px!important;line-height:1.2!important;min-height:0!important}@media(min-width:960px){.sh .sh-t{font-size:16px!important}}</style>')
def _attrs(tag):
    return dict(re.findall(r'([\w-]+)="([^"]*)"', tag))
def card(art, pages):
    cid = re.search(r'id="([^"]+)"', art).group(1)
    title = re.sub(r'<[^>]+>', '', (re.search(r'<h2[^>]*>(.*?)</h2>', art, re.S) or [None, cid])[1]).strip()
    hook = re.search(r'<p class="eb-sub">(.*?)</p>', art, re.S) or re.search(r'<p class="eb-desc">(.*?)</p>', art, re.S)
    hook = re.sub(r'<[^>]+>', '', hook.group(1)).strip() if hook else ''
    if len(hook) > 90: hook = hook[:87].rsplit(' ', 1)[0] + '…'
    img = re.search(r'<img[^>]*src="([^"]+)"', art)
    poster = ROOT / 'web' / 'ebooks' / 'posters' / f'{cid}.webp'
    src = f'/ebooks/posters/{cid}.webp' if poster.exists() else (img.group(1) if img else '')
    box = re.search(r'(<div class="eb-edbox.*?)<div class="eb-actions2">', art, re.S)
    box = box.group(1) if box else ''
    free = re.search(r'<a class="sv-t" data-k="v0\.0\.1"[^>]*>', box) or re.search(r'<a class="sv-free"[^>]*>', box)
    fa = _attrs(free.group(0)) if free else {}
    keep = ''.join(f' {k}="{fa[k]}"' for k in ('data-edp-pdf', 'data-gb', 'data-title', 'data-ed', 'aria-haspopup') if k in fa)
    cov_img = f'<img src="{E(src)}" width="400" height="600" alt="Cover: {E(title)}" loading="lazy" decoding="async">'
    if fa.get('href'):
        cov = (f'<a class="sh-cov" href="{fa["href"]}" rel="nofollow"{keep} aria-label="Read the free edition of {E(title)}">'
               f'{cov_img}<span class="sh-free">Free v0.0.1</span></a>')
    else:
        cov = f'<span class="sh-cov">{cov_img}</span>'
    page = pages.get(cid)
    t = f'<a href="{E(page)}">{E(title)}</a>' if page else E(title)
    return (f'<li class="sh-card" id="{E(cid)}">{cov}<h3 class="sh-t">{t}</h3>'
            + (f'<p class="sh-hook">{E(hook)}</p>' if hook else '') + box + '</li>')
def improve_hero(t):
    """Make one modest, trackable purchase path clear without changing checkout products or prices."""
    m = re.search(r'(<header class="sl-hero eb-hero">)(.*?)(</header>)', t, re.S)
    if not m:
        return t
    inner = m.group(2)
    inner, n = re.subn(
        r'(<h1>\s*E-books\s*</h1>\s*)<p>.*?</p>',
        r'\1<p>Explore Great House Farm (Tŷ Mawr) through its history and source records. Start with the 43-page history book (£4.99 for the updated edition), read a 32-page introduction free, or choose the four-book collection for £19.96.</p>',
        inner, count=1, flags=re.S)
    if not n:
        return t
    a = re.search(r'<div class="sl-actions">.*?</div>', inner, re.S)
    if not a:
        return t
    # Keep the existing, tested bundle checkout URL; do not invent or alter payment links.
    bundle = re.search(r'href="(https://buy\.stripe\.com/[^"]+)"', a.group(0))
    if not bundle:
        return t
    actions = (
        '<div class="sl-actions">'
        '<a class="sl-btn solid" href="/ebooks/tymawr-heritage/?utm_source=ebooks&amp;utm_medium=hero&amp;utm_campaign=ebook-conversion&amp;utm_content=tymawr">Explore the 43-page Tŷ Mawr book · £4.99</a>'
        '<a class="sl-btn" href="/ebooks/cedwyn/?utm_source=ebooks&amp;utm_medium=hero&amp;utm_campaign=ebook-conversion&amp;utm_content=free-intro">Read the free 32-page introduction</a>'
        '<a class="sl-btn" href="' + bundle.group(1) + '">Buy all four · £19.96</a>'
        '<a class="sl-btn" href="#versions">About versions</a>'
        '</div>'
    )
    inner = inner[:a.start()] + actions + inner[a.end():]
    trust = (
        '<p class="eb-proof" style="margin:12px 0 0;opacity:.9">'
        'These are family-history publications, not legal advice. Documentary records must be distinguished from interpretation; '
        'where a proposition remains unresolved, it is a working theory—not a judicial finding unless a court has expressly decided the point.'
        '</p>'
    )
    # Put the caution before the existing period-record quotation.
    pos = inner.find('<p class="eb-proof"')
    if pos >= 0:
        inner = inner[:pos] + trust + inner[pos:]
    else:
        end_actions = inner.find('</div>', inner.find('<div class="sl-actions">')) + len('</div>')
        if end_actions > len('</div>') - 1:
            inner = inner[:end_actions] + trust + inner[end_actions:]
    return t[:m.start(2)] + inner + t[m.end(2):]
def run(dist):
    dist = pathlib.Path(dist); p = dist / 'ebooks' / 'index.html'
    if not p.exists(): print('ebook_shelf: no /ebooks/ page'); return
    t = p.read_text(encoding='utf-8', errors='ignore')
    t = improve_hero(t)
    if 'id="sh-css"' in t: print('ebook_shelf: already applied'); return
    try: D = json.load(open(ROOT / 'data' / 'ebooks.json', encoding='utf-8'))
    except Exception: D = {'books': []}
    pages = {b['id']: b['page'] for b in D.get('books', []) if b.get('page') and b['page'].rstrip('/') not in ('/ebooks', '')
             and (dist / b['page'].strip('/') / 'index.html').exists()}
    m = re.search(r'<section class="eb-list"[^>]*>(.*?)</section>', t, re.S)
    if not m: print('ebook_shelf: no book list found'); return
    arts = re.findall(r'<article class="eb-card".*?</article>', m.group(1), re.S)
    if not arts: print('ebook_shelf: no cards'); return
    vers = ' · '.join(f'v{v} ({d})' for v, d, _ in VERSIONS)
    shelf = (f'<section class="sh" id="shelf" aria-label="Books" data-shelf-version="{VERSION}">{CSS}<h2 class="sh-h">The books</h2>'
             f'<ul class="sh-grid">' + ''.join(card(a, pages) for a in arts) + '</ul>'
             f'<p class="sh-ver">Shelf version {VERSION}. Versions: {vers}.</p></section>')
    t = t[:m.start()] + shelf + t[m.end():]
    ed = re.search(r'<section class="eb-eds" id="editions".*?</section>', t, re.S)
    if ed:   # editions table below the shelf; a title links only to a book's own page
        sec = ed.group(0)
        sec = re.sub(r'<td><a href="/ebooks/">(.*?)</a></td>', r'<td>\1</td>', sec)
        t = t[:ed.start()] + t[ed.end():]
        i = t.find('</section>', t.find('id="shelf"')) + len('</section>')
        t = t[:i] + sec + t[i:]
    p.write_text(t, encoding='utf-8')
    print('ebook_shelf: cards', len(arts), '; titles linked', sum(1 for a in arts if re.search(r'id="([^"]+)"', a).group(1) in pages))
if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
