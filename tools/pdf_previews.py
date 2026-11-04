#!/usr/bin/env python3
"""pdf_previews.py - PDF citations show page 1 and a link under it (Sion, WhatsApp 20:07 GMT 31 Oct 2026: "Site wide when pdfs
open in a modal it says they can't open in a modal. The best way to show pdf is an image of page 1 and then a url under it to view
it like this /wales/research/artifacts/ghf-e106-r116-a1/ ... anytime I see citation to pdf I want to see the preview image and link
under it to view it").
Runs near the end of tools/site.py over every HTML page in dist (never stops a build):
 1. every page-1 preview is drawn once per PDF file from the PDF bytes in dist (the file itself, or its /_blob/ copy) and kept
    at /_cedwyn/pdfpv/<sha16>.webp (720 px wide WebP, under 400 KB). Renderer: pdftoppm (poppler) if present, else PyMuPDF; on a
    runner with neither it installs one (CI only) and, failing that, adds no previews (the links stay as they are);
 2. the first link to each PDF in a page's content gets one shared component after the sentence, list item or cell that carries it:
      <figure class="cw-pdfpv"><a href=PDF><img src=preview alt=title loading=lazy></a><figcaption><a href=PDF>View PDF</a></figcaption></figure>
    (the same order as the reference artifact page: page 1, then the link under it). Links in headers, menus, footers, existing
    previews and the archived copies of outside websites (/wayback/websites/) are left as they are;
 3. a PDF drawn in a frame (<iframe>/<embed>/<object>), which phones show as an empty box or a "can't open" message, is replaced
    by the same component;
 4. the docs PDF pop-up (docs/_static/docs-modal.js, which answered "This PDF could not be shown here." in its modal) is no longer
    loaded: a PDF link opens the PDF itself.
Idempotent (marker cw-pdfpv). Report: dist/_cedwyn/reports/pdf_previews.json. - Sion's Tab agent
31 Oct 2026 (follow-up): the component links only to a PDF that exists as a file in dist (the href as written, else the file the
citation resolved to); a citation whose target is missing gets no preview and is logged (missing_examples). The report counts
internal PDF links that point at no file before this pass (pdf_links_broken_before) and the component links after it, and
tools/dbserve.py adds the final count after its drop pass (after_dbserve), since a PDF dbserve removes would 404 outside the
service worker. The link reads with type, pages and size: "View PDF (8 pages, 1.2 MB)". Existing artifact preview images
(preview.webp with a width and no height) get their height, so the page does not jump while they load. Never stops a build."""
import json, sys, re, os, html, hashlib, pathlib, posixpath, shutil, subprocess, tempfile, urllib.parse, io, time
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor
MARK = 'cw-pdfpv'
OUTREL = '_cedwyn/pdfpv'
WIDTH = 720
MAXB = 400 * 1024
CSS = ('<style id="cw-pdfpv">.cw-pdfpv{margin:.75rem 0 1rem;padding:0;border:0;background:none;max-width:min(100%,720px)}'
       '.cw-pdfpv>a{display:block;line-height:0}'
       '.cw-pdfpv img{display:block;width:100%;height:auto;max-width:100%;border:1px solid rgba(127,127,127,.45);border-radius:2px;box-shadow:0 1px 4px rgba(0,0,0,.18)}'
       '.cw-pdfpv figcaption{margin:.4rem 0 0;font-size:.95em;line-height:1.4}'
       '.cw-pdfpv figcaption a{font-weight:600}'
       'td .cw-pdfpv,th .cw-pdfpv,li li .cw-pdfpv{max-width:200px;margin:.4rem 0}'
       '@media print{.cw-pdfpv{max-width:320px}}</style>')
SKIP_PAGE = re.compile(r'^(wayback/websites/|wayback/snap|_cedwyn/|db/|_blob/|library/)')
SKIP_ANC = {'nav', 'header', 'footer', 'script', 'style', 'noscript', 'button', 'select', 'option', 'dialog', 'template',
            'svg', 'title', 'head', 'textarea', 'iframe', 'object', 'canvas', 'map'}
PHRASE = {'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'b', 'i', 'em', 'strong', 'small', 'code', 'label', 'summary', 'font', 'u',
          'sup', 'sub', 'cite', 'q', 'abbr', 'time', 'mark', 's', 'del', 'ins', 'kbd', 'var', 'dfn', 'big', 'tt', 'strike', 'bdi', 'bdo', 'caption', 'legend', 'dt', 'pre'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'keygen'}
CLOSES_P = {'p', 'div', 'ul', 'ol', 'dl', 'table', 'section', 'article', 'aside', 'blockquote', 'figure', 'form', 'h1', 'h2', 'h3', 'h4',
            'h5', 'h6', 'header', 'footer', 'nav', 'pre', 'details', 'hr', 'main', 'address', 'fieldset'}
SKIP_CLASS = re.compile(r'(?:^|\s)(?:pv|cw-pdfpv|wp-block-image|ghf-ui|ghf-v2[\w-]*|cw-gb[\w-]*|site-footer|footer[\w-]*|menu[\w-]*|[\w-]*-menu|nav[\w-]*|breadcrumbs?|crumb|toc[\w-]*|sidebar[\w-]*|docs-links|docs-menu|docs-nav|wy-side[\w-]*|related)(?:\s|$)')
PDFHREF = re.compile(r'\.pdf$', re.I)
DOCS_MODAL = re.compile(r'<script\b[^>]*\bsrc="[^"]*docs-modal\.js[^"]*"[^>]*>\s*</script>\s*', re.I)
WEAK = re.compile(r'^(?:pdf(?: \d+)?|view|open|download|here|link|file|mirror|archive copy|copy|source|scan|letter|this version(?: \(pdf\))?|open source object|public copy|v?\d+(?:[.-]\d+)*|wayback\b.*|\W*)$', re.I)
IDLIKE = re.compile(r'^[A-Z]{2,}[-_ ]?[A-Z0-9][\w.-]*$')


class Scan(HTMLParser):
    """Offsets of every start/end tag, with the open-element stack at each <a href=*.pdf> and each framed PDF."""
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.text = text; self.lines = [0]
        for m in re.finditer('\n', text): self.lines.append(m.end())
        self.stack = []; self.hits = []; self.frames = []; self.ends = {}; self.close_at = {}; self.cur_a = None; self.uid = 0; self.in_h1 = False; self.h1 = []
    def off(self):
        ln, col = self.getpos(); return self.lines[ln - 1] + col
    def _close(self, tag, at, cs=None):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                for t in self.stack[i:]:
                    self.ends.setdefault(t[2], at); self.close_at.setdefault(t[2], cs if t is self.stack[i] and cs is not None else at)
                del self.stack[i:]; return True
        return False
    def handle_starttag(self, tag, attrs):
        o = self.off(); raw = self.get_starttag_text() or ''
        if tag in CLOSES_P and any(t[0] == 'p' for t in self.stack):
            self._close('p', o)
        if tag == 'li' and self.stack and any(t[0] == 'li' for t in self.stack[-2:]): self._close('li', o)
        if tag in ('td', 'th') and self.stack and self.stack[-1][0] in ('td', 'th'): self._close(self.stack[-1][0], o)
        if tag in ('dt', 'dd') and self.stack and self.stack[-1][0] in ('dt', 'dd'): self._close(self.stack[-1][0], o)
        a = dict(attrs)
        if tag == 'h1' and not self.h1: self.in_h1 = True
        if tag == 'a' and a.get('href'):
            self.hits.append({'start': o, 'tag_end': o + len(raw), 'href': a['href'], 'stack': list(self.stack), 'cls': a.get('class') or '',
                              'title': a.get('title') or '', 'uid': self.uid, 'text': []})
            self.cur_a = self.hits[-1]
        if tag in ('iframe', 'embed', 'object'):
            src = a.get('src') or a.get('data') or ''
            if PDFHREF.search(src.split('#')[0].split('?')[0]):
                self.frames.append({'start': o, 'raw': raw, 'tag': tag, 'src': src, 'title': a.get('title') or a.get('aria-label') or '',
                                    'stack': list(self.stack), 'uid': self.uid})
        if tag not in VOID and not raw.endswith('/>'):
            self.stack.append((tag, a.get('class') or '', self.uid, o, len(raw))); self.uid += 1
        else:
            self.ends[self.uid] = o + len(raw); self.uid += 1
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
    def handle_endtag(self, tag):
        o = self.off(); m = re.compile(r'</\s*%s\s*>' % re.escape(tag), re.I).match(self.text, o)
        e = m.end() if m else o
        if tag == 'h1': self.in_h1 = False
        if tag == 'a' and self.cur_a is not None:
            self.cur_a['a_end'] = e; self.cur_a = None
        self._close(tag, e, o)
    def handle_data(self, d):
        if self.cur_a is not None: self.cur_a['text'].append(d)
        if self.in_h1: self.h1.append(d)


def renderer():
    if shutil.which('pdftoppm'): return 'pdftoppm'
    try:
        import fitz  # noqa: F401
        return 'fitz'
    except Exception:
        pass
    if os.environ.get('CI') or os.environ.get('GITHUB_ACTIONS'):
        try:
            for cmd in (['sudo', '-n', 'apt-get', 'install', '-y', '-qq', 'poppler-utils'], ['sudo', '-n', 'apt-get', 'update', '-qq'],
                        ['sudo', '-n', 'apt-get', 'install', '-y', '-qq', 'poppler-utils']):
                if shutil.which('pdftoppm'): return 'pdftoppm'
                subprocess.run(cmd, timeout=240, capture_output=True)
            if shutil.which('pdftoppm'): return 'pdftoppm'
            subprocess.run([sys.executable, '-m', 'pip', 'install', '--quiet', '--break-system-packages', 'pymupdf'], timeout=300, capture_output=True)
            import fitz  # noqa: F401
            return 'fitz'
        except Exception:
            pass
    return None


def draw(src, dst, how):
    """Page 1 of src -> dst (WebP, WIDTH px wide, under MAXB). Returns (w, h) or None."""
    from PIL import Image
    try:
        if how == 'pdftoppm':
            with tempfile.TemporaryDirectory() as td:
                r = subprocess.run(['pdftoppm', '-f', '1', '-l', '1', '-singlefile', '-scale-to-x', str(WIDTH), '-scale-to-y', '-1', '-r', '150',
                                    '-png', str(src), os.path.join(td, 'p')], timeout=90, capture_output=True)
                p = os.path.join(td, 'p.png')
                if not os.path.exists(p): return None
                im = Image.open(p); im.load()
        else:
            import fitz
            doc = fitz.open(str(src))
            if doc.page_count < 1: return None
            pg = doc[0]; z = WIDTH / max(1.0, pg.rect.width)
            pix = pg.get_pixmap(matrix=fitz.Matrix(z, z), alpha=False)
            im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples); doc.close()
        im = im.convert('RGB')
        if im.width != WIDTH: im = im.resize((WIDTH, max(1, round(im.height * WIDTH / im.width))), Image.LANCZOS)
        if im.height > WIDTH * 2: im = im.crop((0, 0, im.width, WIDTH * 2))   # a very long first page: the top is the preview
        for q in (72, 60, 48, 36):
            b = io.BytesIO(); im.save(b, 'WEBP', quality=q, method=4)
            if b.tell() <= MAXB: break
        dst.parent.mkdir(parents=True, exist_ok=True); dst.write_bytes(b.getvalue())
        return im.width, im.height
    except Exception:
        return None


def pdf_pages(src, how):
    """Page count of a PDF (pdfinfo, else PyMuPDF, else a /Type /Page count); None when unknown."""
    try:
        if shutil.which('pdfinfo'):
            r = subprocess.run(['pdfinfo', str(src)], timeout=30, capture_output=True, text=True, errors='ignore')
            m = re.search(r'^Pages:\s+(\d+)', r.stdout, re.M)
            if m: return int(m.group(1))
        if how == 'fitz':
            import fitz
            d = fitz.open(str(src)); n = d.page_count; d.close(); return n or None
        n = len(re.findall(rb'/Type\s*/Page(?![a-z])', pathlib.Path(src).read_bytes()))
        return n or None
    except Exception:
        return None


def human_size(n):
    if not n: return ''
    return '%d KB' % max(1, round(n / 1000)) if n < 1_000_000 else '%.1f MB' % (n / 1_000_000)


def label(pages, size):
    bits = []
    if pages: bits.append('%d page%s' % (pages, '' if pages == 1 else 's'))
    if size: bits.append(human_size(size))
    return 'View PDF (%s)' % ', '.join(bits) if bits else 'View PDF'


def nice(name):
    n = urllib.parse.unquote(name.rsplit('/', 1)[-1]); n = re.sub(r'\.pdf$', '', n, flags=re.I)
    n = re.sub(r'[_]+', ' ', n); n = re.sub(r'\s+', ' ', n).strip(' -')
    return n or 'PDF document'


def title_for(text, attr_title, href, h1='', few=False):
    t = re.sub(r'\s+', ' ', ''.join(text)).strip(); nm = nice_href(href)
    if t and not WEAK.match(t) and IDLIKE.match(t): return (t + ': ' + (h1 if few and h1 else nm))[:200]
    if t and not WEAK.match(t) and len(t) >= 4: return t[:180]
    at = (attr_title or '').strip()
    if at and not WEAK.match(at) and not re.match(r'^(PDF|v\d)', at): return at[:180]
    if few and h1: return h1[:180]
    return nm


def nice_href(href):
    g = re.search(r'[?&]u=([^&#]+)', href)
    return nice(urllib.parse.unquote(g.group(1)) if g else href.split('#')[0].split('?')[0])


def run(dist):
    dist = pathlib.Path(dist); t0 = time.time()
    rep = {'pages_scanned': 0, 'pages_changed': 0, 'links_seen': 0, 'previews_inserted': 0, 'frames_replaced': 0, 'docs_modal_removed': 0,
           'pdfs_unresolved': 0, 'pdfs_drawn': 0, 'pdfs_failed': 0, 'renderer': None, 'unresolved_examples': [], 'failed_examples': [],
           'pdf_links_internal': 0, 'pdf_links_broken_before': 0, 'broken_before_examples': [], 'component_links': 0,
           'component_links_verified': 0, 'component_targets_missing': 0, 'missing_examples': [], 'component_links_broken_after': 0,
           'preview_imgs_sized': 0, 'status': 'OK'}
    bmap = {}
    try: bmap = json.load(open(dist / '_blob_map.json'))
    except Exception: pass
    how = renderer(); rep['renderer'] = how
    pages = [p for p in dist.rglob('*.html') if not SKIP_PAGE.match(p.relative_to(dist).as_posix())]
    byname = {}   # file name -> PDF files in dist (a /wayback/go/ link to an archived address resolves to our own copy)
    for f in dist.rglob('*'):
        if f.suffix.lower() == '.pdf' and f.is_file(): byname.setdefault(f.name.lower(), []).append(f)
    for k, b in bmap.items():
        if str(k).lower().endswith('.pdf') and (dist / str(b).lstrip('/')).is_file():
            byname.setdefault(str(k).rsplit('/', 1)[-1].lower(), []).append(dist / str(b).lstrip('/'))
    def by_name(u):
        n = urllib.parse.unquote(u.split('#')[0].split('?')[0].rsplit('/', 1)[-1]).lower()
        fs = byname.get(n) or []
        if not fs or len(n) < 12: return None
        return fs[0] if len({x.stat().st_size for x in fs}) == 1 else None
    def resolve(page_rel, href):
        h = html.unescape(href).strip()
        m = re.match(r'^https?://(?:cedwyn\.)?bucklerfamily\.estate(/[^#]*)', h)
        if m: h = m.group(1)
        g = re.match(r'^(?:/[a-z0-9-]+)?/wayback/go/\?u=([^&#]+)', h)
        if g:   # an archived address: our own copy of the same file, when the build holds one
            u = urllib.parse.unquote(g.group(1))
            if not PDFHREF.search(u.split('#')[0].split('?')[0]): return None
            gm = re.match(r'^https?://github\.com/unclehowell/datro/(?:blob|raw)/[^/]+/(.+)$', u)
            if gm:
                p_ = gm.group(1).split('?')[0]
                for cand in (p_, p_.split('/', 1)[-1]):
                    if (dist / cand).is_file(): return dist / cand
            return by_name(u)
        if re.match(r'^[a-z][a-z0-9+.-]*:|^//', h, re.I): return None
        h = h.split('#')[0].split('?')[0]
        if not PDFHREF.search(h): return None
        if h.startswith('/'): rel = h.lstrip('/')
        else: rel = posixpath.normpath(posixpath.join(posixpath.dirname(page_rel), h))
        rel = urllib.parse.unquote(rel)
        if rel.startswith('..'): return None
        for cand in (rel, re.sub(r'^(wales|argentina)/', '', rel)):
            f = dist / cand
            if f.is_file(): return f
            b = bmap.get(cand) or bmap.get('/' + cand)
            if b and (dist / b.lstrip('/')).is_file(): return dist / b.lstrip('/')
        return None
    def direct(page_rel, href):
        """The file in dist the href names exactly as written (own-domain absolute, root-relative or relative), else None."""
        h = html.unescape(href).strip()
        m = re.match(r'^https?://(?:cedwyn\.)?bucklerfamily\.estate(/[^#]*)', h)
        if m: h = m.group(1)
        if re.match(r'^[a-z][a-z0-9+.-]*:|^//', h, re.I): return None
        h = h.split('#')[0].split('?')[0]
        if not h: return None
        rel_ = h.lstrip('/') if h.startswith('/') else posixpath.normpath(posixpath.join(posixpath.dirname(page_rel), h))
        rel_ = urllib.parse.unquote(rel_)
        if rel_.startswith('..'): return None
        for cand in (rel_, re.sub(r'^(wales|argentina)/', '', rel_)):   # /wales/<theme>/ and /argentina/<theme>/ serve the theme's files
            f_ = dist / cand
            if f_.is_file(): return f_
        return None
    def internal_pdf(href):
        h = html.unescape(href).strip()
        if '/wayback/go/' in h: return False
        if re.match(r'^https?://(?:cedwyn\.)?bucklerfamily\.estate/', h): h = '/' + h.split('/', 3)[3]
        if re.match(r'^[a-z][a-z0-9+.-]*:|^//', h, re.I): return False
        return bool(PDFHREF.search(h.split('#')[0].split('?')[0]))
    PVIMG = re.compile(r'<img\b[^>]*\bsrc="([^"]*preview\.webp)"[^>]*>', re.I)
    def size_previews(page_rel, text):
        """An artifact page's own page-1 image (preview.webp) with a width and no height gets its height (no layout shift)."""
        def fix(m):
            tag = m.group(0)
            if re.search(r'\sheight\s*=', tag, re.I): return tag
            f_ = direct(page_rel, m.group(1))
            if not f_: return tag
            try:
                from PIL import Image
                with Image.open(f_) as im_: w0, h0 = im_.size
            except Exception:
                return tag
            wm = re.search(r'\swidth\s*=\s*"(\d+)"', tag, re.I); w = int(wm.group(1)) if wm else w0
            hgt = max(1, round(h0 * w / max(1, w0)))
            rep['preview_imgs_sized'] += 1
            ins = (' height="%d"' % hgt) if wm else (' width="%d" height="%d"' % (w, hgt))
            return tag[:4] + ins + tag[4:]
        return PVIMG.sub(fix, text)
    # pass 1: find the citations and the PDF files they point at
    plan = {}; need = {}
    for p in pages:
        rel = p.relative_to(dist).as_posix()
        try: text = p.read_text(encoding='utf-8')
        except Exception: continue
        if '.pdf' not in text.lower() and 'docs-modal' not in text: continue
        rep['pages_scanned'] += 1
        if 'preview.webp' in text:
            t2 = size_previews(rel, text)
            if t2 != text:
                try: p.write_text(t2, encoding='utf-8'); text = t2
                except Exception: pass
        if MARK in text and 'cw-pdfpv-v1' in text: continue
        has_pv = bool(PVIMG.search(text))
        sc = Scan(text)
        try: sc.feed(text); sc.close()
        except Exception: continue
        items = []
        for hit in sc.hits:
            hh = html.unescape(hit['href'])
            if not (PDFHREF.search(hh.split('#')[0].split('?')[0]) or re.search(r'/wayback/go/\?u=[^&#]+?\.pdf(?:$|[&#]|%3F|%23)', hh, re.I)): continue
            rep['links_seen'] += 1
            if internal_pdf(hit['href']):
                rep['pdf_links_internal'] += 1
                if not direct(rel, hit['href']):
                    rep['pdf_links_broken_before'] += 1
                    if len(rep['broken_before_examples']) < 25: rep['broken_before_examples'].append(rel + ' -> ' + hit['href'][:160])
            if any(t[0] in SKIP_ANC or SKIP_CLASS.search(t[1] or '') for t in hit['stack']): continue
            if 'a_end' not in hit: continue
            f = resolve(rel, hit['href'])
            if not f:
                rep['pdfs_unresolved'] += 1
                if len(rep['unresolved_examples']) < 25: rep['unresolved_examples'].append(rel + ' -> ' + hit['href'][:160])
                continue
            if has_pv and f.parent == p.parent:   # an artifact page already shows page 1 of its own PDF above the link
                rep['already_previewed'] = rep.get('already_previewed', 0) + 1; continue
            items.append(('a', hit, f))
        for fr in sc.frames:
            if any(t[0] in ('script', 'template', 'noscript') for t in fr['stack']): continue
            f = resolve(rel, fr['src'])
            if f: items.append(('frame', fr, f))
        if items or DOCS_MODAL.search(text):
            plan[p] = (text, sc, items)
            for _, _, f in items: need.setdefault(f.resolve(), None)
    # pass 2: draw page 1 of each PDF once (content hash names the preview, so a file in two places is drawn once)
    out = dist / OUTREL
    jobs = {}
    for f in need:
        try: hsh = hashlib.sha256(f.read_bytes()).hexdigest()[:16]
        except Exception: continue
        jobs.setdefault(hsh, f); need[f] = hsh
    sizes = {}; info = {}
    if how:
        def work(item):
            hsh, f = item; dst = out / (hsh + '.webp')
            wh = draw(f, dst, how)
            try: nb = f.stat().st_size
            except Exception: nb = 0
            return hsh, wh, (pdf_pages(f, how) if wh else None, nb)
        with ThreadPoolExecutor(max(2, (os.cpu_count() or 2))) as ex:
            for hsh, wh, inf in ex.map(work, jobs.items()):
                info[hsh] = inf
                if wh: sizes[hsh] = wh; rep['pdfs_drawn'] += 1
                else:
                    rep['pdfs_failed'] += 1
                    if len(rep['failed_examples']) < 15: rep['failed_examples'].append(str(jobs[hsh].relative_to(dist)))
    # pass 3: write the component
    for p, (text, sc, items) in plan.items():
        edits = []   # (offset_start, offset_end, replacement)
        seen = set(); h1 = re.sub(r'\s+', ' ', ''.join(sc.h1)).strip().rstrip('#¶ ').strip()
        few = len({need.get(f.resolve()) for _, _, f in items}) <= 2
        for kind, it, f in sorted(items, key=lambda x: x[1]['start']):
            hsh = need.get(f.resolve()); wh = sizes.get(hsh)
            if not wh: continue
            key = hsh
            if kind == 'a':
                if key in seen: continue
                href = it['href']; title = title_for(it['text'], it['title'], href, h1, few)
                if '/wayback/go/' in href or not href.split('#')[0].split('?')[0].lower().endswith('.pdf') or not direct(rel, href):
                    href = '/' + f.relative_to(dist).as_posix()   # the copy we hold opens directly (the href as written names no file)
                rep['component_links'] += 1
                if not direct(rel, href):   # only link to a target that exists in the build output
                    rep['component_targets_missing'] += 1
                    if len(rep['missing_examples']) < 25: rep['missing_examples'].append(rel + ' -> ' + href[:160])
                    continue
                rep['component_links_verified'] += 1
                # insertion point: after the outermost run of phrasing ancestors (sentence, heading, summary), else after </a>
                at = it['a_end']
                for t in reversed(it['stack']):
                    if t[0] in PHRASE and t[2] in sc.ends: at = max(at, sc.ends[t[2]]); continue
                    if t[0] in ('td', 'th', 'li', 'dd') and t[2] in sc.close_at: at = max(at, sc.close_at[t[2]])   # end of the cell / item, text kept whole
                    break
                seen.add(key)
                edits.append((at, at, comp(href, hsh, wh, title, info.get(hsh))))
                rep['previews_inserted'] += 1
            else:
                end = sc.ends.get(it['uid'])
                if not end or end < it['start']: continue
                fsrc = it['src'] if direct(rel, it['src']) else '/' + f.relative_to(dist).as_posix()
                if key not in seen:
                    rep['component_links'] += 1
                    if not direct(rel, fsrc):
                        rep['component_targets_missing'] += 1
                        if len(rep['missing_examples']) < 25: rep['missing_examples'].append(rel + ' -> ' + fsrc[:160])
                        continue
                    rep['component_links_verified'] += 1
                edits.append((it['start'], end, '' if key in seen else comp(fsrc, hsh, wh, it['title'] or nice(it['src']), info.get(hsh))))
                seen.add(key); rep['frames_replaced'] += 1
                for t in reversed(it['stack']):   # a framed PDF folded in <details>: open it, so page 1 shows without a tap
                    if t[0] == 'details':
                        st_ = text[t[3]:t[3] + t[4]]
                        if not re.search(r'\sopen(?:[\s=>/]|$)', st_, re.I):
                            edits.append((t[3] + t[4] - 1, t[3] + t[4] - 1, ' open'))
                        break
        new = text
        for s, e, _, r in sorted(((s, e, i, r) for i, (s, e, r) in enumerate(edits)), reverse=True):
            new = new[:s] + r + new[e:]
        new, nm = DOCS_MODAL.subn('', new)
        rep['docs_modal_removed'] += nm
        if edits and 'id="cw-pdfpv"' not in new:
            new = re.sub(r'</head>', CSS + '</head>', new, count=1, flags=re.I) if re.search(r'</head>', new, re.I) else CSS + new
        if new != text:
            p.write_text(new, encoding='utf-8'); rep['pages_changed'] += 1
    rep['seconds'] = round(time.time() - t0, 1); rep['previews_files'] = len(sizes)
    rep['component_links_broken_after'] = rep['component_links'] - rep['component_links_verified']
    rep['note'] = ('pdf_links_broken_before: internal PDF links in pages that name no file in dist when this pass runs; component links '
                   'are checked against dist and skipped when missing; tools/dbserve.py writes after_dbserve with the final count')
    if rep['component_targets_missing'] or rep['pdfs_failed'] or not how:
        rep['status'] = 'FAIL: %d component targets missing, %d PDFs not drawn%s (see missing_examples / failed_examples)' % (
            rep['component_targets_missing'], rep['pdfs_failed'], '' if how else ', no renderer')
        print('::warning::pdf_previews ' + rep['status'])
    (dist / '_cedwyn' / 'reports').mkdir(parents=True, exist_ok=True)
    json.dump(rep, open(dist / '_cedwyn' / 'reports' / 'pdf_previews.json', 'w'), indent=1)
    print('pdf_previews:', {k: v for k, v in rep.items() if not k.endswith('examples')})
    return rep


def comp(href, hsh, wh, title, inf=None):
    h = html.escape(html.unescape(href), quote=True); t = html.escape(title, quote=True)
    pages, size = inf or (None, 0); lab = html.escape(label(pages, size))
    return ('<figure class="cw-pdfpv cw-pdfpv-v1"><a href="%s" aria-label="%s (PDF)"><img src="/%s/%s.webp" width="%d" height="%d" '
            'alt="%s" loading="lazy" decoding="async"></a><figcaption><a href="%s" type="application/pdf">%s</a></figcaption></figure>'
            % (h, t, OUTREL, hsh, wh[0], wh[1], t, h, lab))


if __name__ == '__main__':
    run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
