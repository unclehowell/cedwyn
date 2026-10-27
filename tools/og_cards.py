#!/usr/bin/env python3
"""og_cards.py - social share previews for every Cedwyn page (Sion, WhatsApp 05:29 GMT 27 Oct 2026: "When i share my link on
social media no preview image and text comes up. Make it so it does and use the nft images for it").

Each human HTML page gets og:title/description/type/url/site_name, og:image (absolute, 1200x630 JPEG) with width, height and
alt, and twitter:card summary_large_image with title, description and image. A tag a theme already carries is never
overwritten (only the missing ones are added), so /ebooks/ keeps its own title, description and cover image.

Cards are made at build time from the Garden Gallery pieces (tools/og_cards.json lists which piece serves which section;
the same page always gets the same piece). The card file name carries the source hash, so a re-rendered piece gets a new
URL and social sites fetch it afresh. Without Pillow, or without the piece in this build, the committed card in
web/_cedwyn/og/<id>.jpg is used. Landscape pieces are cropped from the top (the signature sits bottom right); square,
portrait and plan pieces are shown whole on a blurred copy of themselves. Report: _cedwyn/reports/og_cards.json.
Runs at the end of site.py. - Sion's Tab agent"""
import json, re, hashlib, html, io, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
CFG = json.load(open(ROOT / 'tools' / 'og_cards.json', encoding='utf-8'))
BASE = CFG['base'].rstrip('/')
W, H = 1200, 630
BANNED = re.compile(r'\b(says|claims?|claimed|according to|hearsay|unverified|alleged(ly)?|fraud\w*|stolen|sion)\b', re.I)
POSTCODE = re.compile(r'\b[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}\b')
EMAILISH = re.compile(r'@|\+?\d[\d\s]{8,}\d')
HEAD_END = re.compile(r'</head\s*>', re.I)
TITLE = re.compile(r'<title[^>]*>(.*?)</title>', re.I | re.S)
META = re.compile(r'<meta\b[^>]*>', re.I)
ATTR = re.compile(r'([a-zA-Z:-]+)\s*=\s*("([^"]*)"|\'([^\']*)\')')
P = re.compile(r'<p\b[^>]*>(.*?)</p>', re.I | re.S)
TAG = re.compile(r'<[^>]+>')
CANON = re.compile(r'<link\b[^>]*rel=["\']canonical["\'][^>]*>', re.I)
BLOCK = re.compile(r'<!-- og:cedwyn -->.*?<!-- /og:cedwyn -->', re.S)


def attrs(tag):
    return {m.group(1).lower(): html.unescape(m.group(3) if m.group(3) is not None else m.group(4)) for m in ATTR.finditer(tag)}


def clean(s):
    s = html.unescape(TAG.sub(' ', s or ''))
    return re.sub(r'\s+', ' ', s).strip()


def ok_text(s):
    return bool(s) and not BANNED.search(s) and not POSTCODE.search(s) and not EMAILISH.search(s)


NOISE = re.compile(r'\b(agents?|AI|updated|original source|e-?book editions?|click|tap|submit|edit|cookies?|javascript|loading|sign[ -]?in|menu|when answering|this site|page id)\b|[\U0001F300-\U0001FAFF\u2600-\u27BF]', re.I)
NEAR = re.compile(r'hidden|aria-hidden|agent|small-?print|notice|footer|guestbook|nav', re.I)


def first_sentence(body):
    for m in P.finditer(body[:400000]):
        t = clean(m.group(1))
        if len(t) < 60 or not ok_text(t) or NOISE.search(t) or t.count('·') > 1 or not t[0].isupper():
            continue
        if NEAR.search(body[max(0, m.start() - 400):m.start()]):
            continue
        out = ''
        for sent in re.split(r'(?<=[.!?])\s+', t):
            if len(out) + len(sent) > 200:
                break
            out = (out + ' ' + sent).strip()
        if len(out) < 70:
            out = t if len(t) <= 190 else t[:190].rsplit(' ', 1)[0] + '…'
        if len(out) >= 40:
            return out
    return ''


def esc(s):
    return html.escape(s, quote=True)


class Cards:
    def __init__(self, dist):
        self.dist = dist; self.made = {}; self.meta = {}
        self.titles = CFG.get('pieces', {})
        bm = dist / '_blob_map.json'
        self.blobmap = json.load(open(bm)) if bm.exists() else {}
        try:
            from PIL import Image, ImageFilter, ImageEnhance  # noqa: F401
            self.pil = True
        except Exception:
            self.pil = False
        self.out = dist / '_cedwyn' / 'og'; self.out.mkdir(parents=True, exist_ok=True)

    def source(self, nfa):
        name = nfa.lower() + '.webp'
        for rel in ('nft-art/art/' + name,):
            p = self.dist / rel
            if p.exists(): return p.read_bytes()
            for k in ('/' + rel, rel):
                b = self.blobmap.get(k)
                if b and (self.dist / b.lstrip('/')).exists(): return (self.dist / b.lstrip('/')).read_bytes()
        return None

    def render(self, data, plan):
        from PIL import Image, ImageFilter, ImageEnhance
        im = Image.open(io.BytesIO(data)).convert('RGB')
        if im.width / im.height >= 1.3 or (not plan and im.width >= im.height):
            s = W / im.width; im2 = im.resize((W, max(H, round(im.height * s))), Image.LANCZOS)
            out = im2.crop((0, im2.height - H, W, im2.height))   # keep the bottom edge: the signature
        else:
            s = max(W / im.width, H / im.height); bg = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
            l = (bg.width - W) // 2; t = (bg.height - H) // 2
            out = ImageEnhance.Brightness(bg.crop((l, t, l + W, t + H)).filter(ImageFilter.GaussianBlur(28))).enhance(0.6)
            s = min(W / im.width, H / im.height); fg = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
            out.paste(fg, ((W - fg.width) // 2, (H - fg.height) // 2))
        buf = io.BytesIO(); out.save(buf, 'JPEG', quality=82, optimize=True, progressive=True)
        return buf.getvalue()

    def get(self, nfa):
        if nfa in self.made: return self.made[nfa]
        url = None; data = self.source(nfa) if self.pil else None
        plan = 'plan' in (self.titles.get(nfa, {}).get('title', '').lower()) or nfa == 'NFA-0011'
        if data:
            try:
                jpg = self.render(data, plan)
                name = '%s-%s.jpg' % (nfa.lower(), hashlib.sha1(data).hexdigest()[:8])
                (self.out / name).write_bytes(jpg); url = '/_cedwyn/og/' + name
            except Exception as e:
                print('og_cards: render failed', nfa, e)
        if url is None and (self.out / (nfa.lower() + '.jpg')).exists():
            url = '/_cedwyn/og/' + nfa.lower() + '.jpg'
        if url is None:
            return self.get(CFG['default']) if nfa != CFG['default'] else None
        a = self.titles.get(nfa, {})
        alt = (a.get('alt') or a.get('title') or 'A painted scene of Great House Farm, Llandough')
        alt = alt if ok_text(alt) else 'A painted scene of Great House Farm, Llandough'
        self.made[nfa] = (BASE + url, alt + ' (' + nfa + ', Garden Gallery)')
        return self.made[nfa]


def pick(rel_dir):
    sec = rel_dir.split('/')[0] if rel_dir else ''
    pool = CFG['sections'].get(sec)
    if not pool:
        allp = CFG['pool']; k = int(hashlib.sha1(sec.encode()).hexdigest(), 16) % len(allp)
        pool = [allp[(k + j) % len(allp)] for j in range(3)]
    if rel_dir.strip('/') == sec:   # a section's own home page gets its first piece
        return pool[0]
    return pool[int(hashlib.sha1(rel_dir.encode()).hexdigest(), 16) % len(pool)]


def run(dist):
    dist = pathlib.Path(dist)
    themes = {t['id']: t for t in json.load(open(ROOT / 'themes.json', encoding='utf-8'))['themes']}
    skip = tuple(s.strip('/') + '/' for s in CFG.get('skip_dirs', []))
    cards = Cards(dist); n = 0; added = 0; untouched = 0; samples = {}
    for p in sorted(dist.rglob('*.html')):
        rel = p.relative_to(dist).as_posix()
        if rel.startswith(skip) or rel.startswith('_') and not rel.startswith('_cedwyn/og'):
            continue
        try:
            n, added, untouched = page(p, rel, dist, themes, cards, n, added, untouched, samples)
        except Exception as e:
            print('og_cards: skipped', rel, e)
    rep = {'pages_changed': n, 'tags_added': added, 'pages_already_complete': untouched, 'pillow': cards.pil,
           'cards': {k: v[0] for k, v in cards.made.items()}, 'samples': samples}
    (dist / '_cedwyn' / 'reports').mkdir(parents=True, exist_ok=True)
    json.dump(rep, open(dist / '_cedwyn' / 'reports' / 'og_cards.json', 'w'), indent=1)
    print('og_cards: %d pages, %d tags, %d cards (pillow %s)' % (n, added, len(cards.made), cards.pil))


def page(p, rel, dist, themes, cards, n, added, untouched, samples):
    if True:
        try: txt = p.read_text('utf-8')
        except Exception: return n, added, untouched
        m = HEAD_END.search(txt[:600000])
        if not m: return n, added, untouched
        head = txt[:m.start()]
        if re.search(r'http-equiv=["\']refresh', head, re.I) and len(txt) < 3000:
            return n, added, untouched   # a redirect stub, not a page
        head_clean = BLOCK.sub('', head)
        have = {}; drop = []
        for t in META.findall(head_clean):
            a = attrs(t); key = (a.get('property') or a.get('name') or '').lower()
            if not key: continue
            val = a.get('content', '')
            bad = False
            if key in ('og:image', 'og:image:secure_url', 'twitter:image'):
                path = val[len(BASE):].split('?')[0] if val.startswith(BASE + '/') else ''
                bad = not path or re.search(r'blank|placeholder|default', path, re.I) or not (dist / path.lstrip('/')).exists()
            elif key in ('og:title', 'og:description', 'twitter:title', 'twitter:description', 'description', 'og:image:alt'):
                bad = not ok_text(val) or bool(NOISE.search(val)) or not val.strip()
            if bad:
                drop.append(t); continue
            have.setdefault(key, val)
        if have.get('og:image') is None:   # an untrusted theme image takes its size and alt tags with it
            for t in META.findall(head_clean):
                k = (attrs(t).get('property') or attrs(t).get('name') or '').lower()
                if k.startswith('og:image') or k == 'twitter:image':
                    if t not in drop: drop.append(t)
                    have.pop(k, None)
        for t in drop:
            head_clean = head_clean.replace(t, '', 1)
        rel_dir = rel[:-len('index.html')] if rel.endswith('index.html') else rel
        sec = rel_dir.split('/')[0] if '/' in rel_dir else ''
        theme = themes.get(sec, {})
        url = BASE + '/' + rel_dir
        cm = CANON.search(head_clean)
        if cm:
            cu = attrs(cm.group(0)).get('href', '')
            if cu.startswith(BASE + '/'): url = cu
        title = clean(TITLE.search(head_clean).group(1)) if TITLE.search(head_clean) else ''
        if not ok_text(title) or title.lower() in ('cedwyn', '', 'moved', 'cedwyn estate'):
            title = (theme.get('title') + ' · Cedwyn') if theme.get('title') and rel_dir else (title if ok_text(title) else CFG['site_name'])
        desc = have.get('description', '')
        tdesc = CFG.get('section_desc', {}).get(sec) or (theme.get('desc', '') if ok_text(theme.get('desc', '')) and len(theme.get('desc', '')) > 40 else '')
        if not ok_text(desc) or len(desc) < 30 or NOISE.search(desc):
            desc = (tdesc if rel_dir.strip('/') == sec else '') or first_sentence(txt[m.end():]) or tdesc or CFG['home_description']
        if rel_dir == '' and not ok_text(have.get('description', '')):
            desc = CFG['home_description']
        nfa = pick(rel_dir.rstrip('/') if rel_dir else '')
        if rel_dir == '': nfa = CFG['default']
        img = cards.get(nfa)
        want = [('property', 'og:title', title), ('property', 'og:description', desc), ('property', 'og:type', 'website'),
                ('property', 'og:url', url), ('property', 'og:site_name', CFG['site_name'])]
        own_image = bool(have.get('og:image'))
        if img and not own_image:
            want += [('property', 'og:image', img[0]), ('property', 'og:image:secure_url', img[0]),
                     ('property', 'og:image:type', 'image/jpeg'), ('property', 'og:image:width', str(W)),
                     ('property', 'og:image:height', str(H)), ('property', 'og:image:alt', img[1])]
        timg = have.get('og:image') or (img[0] if img else '')
        want += [('name', 'twitter:card', 'summary_large_image'), ('name', 'twitter:title', have.get('og:title') or title),
                 ('name', 'twitter:description', have.get('og:description') or desc)]
        if timg: want.append(('name', 'twitter:image', timg))
        if own_image and not have.get('og:image:alt'):
            want.append(('property', 'og:image:alt', have.get('og:title') or title))
        if 'description' not in have and desc:
            want.append(('name', 'description', desc))
        tags = ['<meta %s="%s" content="%s">' % (k, v, esc(c)) for k, v, c in want if v not in have and c]
        if not tags and head_clean == head:
            return n, added, untouched + 1
        block = ('<!-- og:cedwyn -->' + ''.join(tags) + '<!-- /og:cedwyn -->') if tags else ''
        new = head_clean + block + txt[m.start():]
        if new != txt:
            p.write_text(new, 'utf-8'); n += 1; added += len(tags)
            if len(samples) < 12 and rel_dir.count('/') <= 1: samples['/' + rel_dir] = nfa
    return n, added, untouched


if __name__ == '__main__':
    run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
