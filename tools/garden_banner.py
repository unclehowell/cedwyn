#!/usr/bin/env python3
"""garden_banner.py - refresh the Garden banner's data from the /garden/ webapp's own database (2 Nov 2026). - Sion's Tab agent
Writes web/_cedwyn/garden-banner/products.json (handle, short name, sprite tile; plants first) and sprite.webp (one 56 px square
tile per product, 16 per row) from the garden branch's public/_db/section.sqlite (records: meta, words, product), which the
Garden City sync fills from gardencity.cymru's public catalogue. Product images are read once here from the shop's image folder;
the banner itself serves only the sprite from Cedwyn, so pages carry no outside address.
Run when the Garden's products change (the sync's digest moves), then commit the two files on main by PR:
    python3 tools/garden_banner.py <section.sqlite> [out_dir]      (needs Pillow and network; not part of the site build)
Spec: docs/GARDEN-BANNER.md"""
import io, json, re, sqlite3, sys, pathlib, urllib.request
from concurrent.futures import ThreadPoolExecutor
TILE, COLS = 56, 16
ORDER = {'plants': 0, 'gifts': 1, 'home': 2, 'wear': 3, 'art': 4}
def short(t):
    s = re.sub(r'\s+', ' ', re.split(r'\s+[-\u2013\u2014|]\s+', t)[0].strip())
    return s if len(s) <= 40 else s[:39].rsplit(' ', 1)[0] + '\u2026'
def main(db, out='web/_cedwyn/garden-banner'):
    from PIL import Image
    rows = sqlite3.connect(db).execute('SELECT kind, id, data FROM records ORDER BY seq').fetchall()
    meta = [json.loads(d) for k, i, d in rows if k == 'meta'][0]
    prods = [json.loads(d) for k, i, d in rows if k == 'product']
    def thumb(p):
        try:
            im = p['im'][0]; u = meta['cdn'] + im + ('&' if '?' in im else '?') + 'width=160'
            with urllib.request.urlopen(urllib.request.Request(u, headers={'User-Agent': 'cedwyn-garden-banner'}), timeout=40) as r:
                img = Image.open(io.BytesIO(r.read())).convert('RGB')
            w, h = img.size; s = min(w, h)
            return img.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s)).resize((TILE, TILE), Image.LANCZOS)
        except Exception:
            return Image.new('RGB', (TILE, TILE), (40, 60, 40))
    with ThreadPoolExecutor(8) as ex: th = list(ex.map(thumb, prods))
    rows_n = (len(prods) + COLS - 1) // COLS
    sp = Image.new('RGB', (COLS * TILE, rows_n * TILE), (20, 20, 20))
    for i, im in enumerate(th): sp.paste(im, ((i % COLS) * TILE, (i // COLS) * TILE))
    out = pathlib.Path(out); out.mkdir(parents=True, exist_ok=True)
    sp.save(out / 'sprite.webp', 'WEBP', quality=62, method=6)
    items = sorted(({'h': p['h'], 'n': short(p['t']), 'g': p.get('g'), 'i': i} for i, p in enumerate(prods)), key=lambda x: (ORDER.get(x['g'], 9), x['i']))
    data = {'v': '1.0.0', 'source': 'Garden City Cymru catalogue via the /garden/ webapp database (section_records theme garden)',
            'updated': meta.get('updated'), 'digest': meta.get('digest'),
            'sprite': {'src': '/_cedwyn/garden-banner/sprite.webp?d=' + (meta.get('digest') or '')[:8], 'tile': TILE, 'cols': COLS, 'rows': rows_n},
            'items': [[x['h'], x['n'], x['i']] for x in items]}
    (out / 'products.json').write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    print('garden banner:', len(prods), 'products,', (out / 'sprite.webp').stat().st_size, 'byte sprite, digest', meta.get('digest'))
if __name__ == '__main__': main(*sys.argv[1:])
