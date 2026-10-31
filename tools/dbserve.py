#!/usr/bin/env python3
"""dbserve.py - stage 3: the catalogue database becomes the one source of every theme's data and evidence files.
Runs last in the build, after the self-contained test passes. For each theme path the database holds (db/blobmap.json):
  - if the file on disk still has the exact bytes stored in the database (sha256), the file is removed from the deploy:
    the service worker (/cedwyn-sw.js) and the page fallback (runtime.js + dbfs.js) serve it from the database chunks;
  - if a later build step changed the file, the path is taken out of the map and the file serves as before;
  - files that browsers fetch outside a service worker stay as files too (favicons and touch icons, web manifests and the
    icons they list, <link>/<meta> images, sitemaps and feeds, images named in CSS, files named by pages that do not load
    the runtime); the database still serves them to the worker.
Writes _cedwyn/reports/dbserve.json. - Sion's Tab agent
31 Oct 2026 (PDF links 404): a PDF or Word file a page links with a plain <a href> (an evidence citation, an artifact page's
"Open the public copy" link, the page-1 preview component of tools/pdf_previews.py) is opened outside the service worker on a
first visit, from a shared link, by a phone's PDF viewer or by a crawler, so dropping it answered 404 (3,301 documents dropped,
12 kept, in the 31 Oct builds). Linked documents now stay as files: page-1 preview component targets first, then every other
linked document, while the deploy stays under PAGES_FILE_CAP files (default 19,900; Pages takes 20,000). The final count of
internal PDF links that name no file goes into dbserve.json and pdf_previews.json (after_dbserve); never fails the build."""
import json, os, sys, re, hashlib, pathlib, posixpath, urllib.parse, collections
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
DBX = re.compile(r'\.(json|csv|xml|geojson|png|jpe?g|gif|webp|svg|avif|ico|bmp|tiff?|pdf|docx?|mp3|m4a|ogg|wav)$', re.I)
KEEPNAME = re.compile(r'(^|/)(favicon[^/]*|apple-touch-icon[^/]*|android-chrome[^/]*|mstile[^/]*|safari-pinned-tab[^/]*|[^/]*\.ico|sitemap[^/]*\.xml|'
                      r'[^/]*(feed|rss|atom)[^/]*\.xml|browserconfig\.xml|manifest\.json|opensearch[^/]*\.xml)$', re.I)
KEEPPREFIX = ('/wayback/snap/',)
APPDB = re.compile(r'/_db/view\.json$|/_ui/[^/]+\.a2ui\.json$|^/?projects/data/(programme|programme-office|data-architecture)\.json$|^/?(?:[^/]+/)?qa/questions\.json$|^/?(?:[^/]+/)?parcels/poster\.jpg$')   # + 30 Oct 2026 21:15Z: the Q&A app's own question list (/qa/questions.json, read by the Q&A page, the header graph, check_qa_built.py in CI and check_qa_served.py after deploy) stays a plain file; dbserve had dropped it, so build 41119909136 failed the Q&A completeness guard   # + 30 Oct 2026: the Projects programme data a page or an agent fetches by plain URL (/projects/data/programme.json 404'd outside the service worker)   # 30 Oct 2026 (ADR-002): each webapp's own database and its A2UI surfaces stay plain files so agents, webmcp and header graphs read them without the service worker - Sion's Tab agent   # data files a page fetches by an address built at run time - Sion's Tab agent
KIND = {'json': 'data', 'csv': 'data', 'xml': 'data', 'geojson': 'data', 'pdf': 'document', 'doc': 'document', 'docx': 'document',
        'mp3': 'audio', 'm4a': 'audio', 'ogg': 'audio', 'wav': 'audio'}
def kind(p): return KIND.get(p.rsplit('.', 1)[-1].lower(), 'image')
LINKTAG = re.compile(r'<(?:link|meta)\b[^>]*>', re.I | re.S)
ATTRV = re.compile(r"""(?:href|content|src)\s*=\s*["']([^"']+)["']""", re.I)
CSSURL = re.compile(r"""url\(\s*["']?([^"')]+)["']?\s*\)""", re.I)
SCRIPTS = re.compile(r'<script\b.*?</script>', re.I | re.S)
MARKUP = re.compile(r'<(?:img|source|video|audio|embed|object|iframe|input|image|use|track)\b[^>]*>', re.I | re.S)
MATTR = re.compile(r"""\s(?:src|data|poster|srcset|href|xlink:href)\s*=\s*["']([^"']+)["']""", re.I)
FETCHLIT = re.compile(r"""fetch\(\s*["']([^"'?#\s:]+\.(?:json|csv|xml|geojson))(?:\?[^"']*)?["']""")
ANCHOR = re.compile(r'<a\b[^>]*>', re.I | re.S)
AHREF = re.compile(r"""\shref\s*=\s*["']([^"']+)["']""", re.I)
DOCLINK = re.compile(r'\.(pdf|docx?)$', re.I)
PVFIG = re.compile(r'<figure class="cw-pdfpv[^"]*">.*?</figure>', re.I | re.S)
FILE_CAP = int(os.environ.get('PAGES_FILE_CAP', '19900'))
QSTR = re.compile(r"""["'`]([^"'`\s<>]{1,300})["'`]""")
def resolve(base_rel, u):
    u = u.strip().split('#')[0].split('?')[0]
    if not u or u.startswith(('data:', 'blob:', 'javascript:', 'mailto:')): return None
    if re.match(r'(?i)^(https?:)?//', u):
        sp = urllib.parse.urlsplit(u if not u.startswith('//') else 'https:' + u)
        if (sp.hostname or '') != 'cedwyn.bucklerfamily.estate': return None
        u = sp.path
    p = u if u.startswith('/') else posixpath.normpath(posixpath.join(posixpath.dirname(base_rel), u))
    return urllib.parse.unquote(p)
def sha16(f):
    h = hashlib.sha256()
    with open(f, 'rb') as fh:
        for c in iter(lambda: fh.read(1 << 20), b''): h.update(c)
    return h.hexdigest()[:16]
def main():
    bmf = DIST / 'db' / 'blobmap.json'
    if not bmf.exists(): print('dbserve: no blobmap, nothing to do'); return 0
    bm = json.load(open(bmf)); paths = bm['paths']; blobs = bm['blobs']
    keep = {}; linked = {}   # linked: document path -> [priority (0 = preview component target), number of links]
    for p in DIST.rglob('*'):
        if not p.is_file(): continue
        rel = '/' + p.relative_to(DIST).as_posix(); ext = p.suffix.lower()
        if rel.startswith(('/db/', '/_cedwyn/reports/')): continue
        if ext in ('.html', '.htm'):
            s = p.read_text('utf-8', 'ignore')
            for t in LINKTAG.findall(s):
                for v in ATTRV.findall(t):
                    r = resolve(rel, v)
                    if r: keep.setdefault(r, 'link/meta tag')
            for v in CSSURL.findall(s):
                r = resolve(rel, v)
                if r: keep.setdefault(r, 'css url()')
            # files named in the page markup itself (img/source/video/audio/embed/object/iframe/input): the browser's preload
            # scanner asks for them before any script runs, so on a first visit they must exist as files
            for t in MARKUP.findall(SCRIPTS.sub(' ', s)):
                for v in MATTR.findall(t):
                    for part in v.split(','):
                        r = resolve(rel, part.strip().split(' ')[0])
                        if r: keep.setdefault(r, 'named in page markup')
            body = SCRIPTS.sub(' ', s)
            comp_hrefs = set()
            for fig in PVFIG.findall(body):
                for v in AHREF.findall(fig): comp_hrefs.add(v)
            for t in ANCHOR.findall(body):   # documents a reader opens by a plain link (outside the service worker)
                for v in AHREF.findall(t):
                    if '/wayback/go/' in v or not DOCLINK.search(v.split('#')[0].split('?')[0]): continue
                    r = resolve(rel, v)
                    if not r: continue
                    if r not in paths and re.sub(r'^/(wales|argentina)/', '/', r) in paths: r = re.sub(r'^/(wales|argentina)/', '/', r)
                    e = linked.setdefault(r, [1, 0]); e[1] += 1
                    if v in comp_hrefs: e[0] = 0
            for v in FETCHLIT.findall(s):   # data files the page's own scripts fetch (first visit: no service worker yet)
                r = resolve(rel, v)
                if r: keep.setdefault(r, 'fetched by script')
            if '/_cedwyn/runtime.js' not in s:   # a page that does not load the runtime: everything it names stays a file
                for v in QSTR.findall(s):
                    if DBX.search(v.split('?')[0].split('#')[0]):
                        r = resolve(rel, v)
                        if r: keep.setdefault(r, 'page without runtime')
        elif ext == '.css':
            s = p.read_text('utf-8', 'ignore')
            for v in CSSURL.findall(s):
                r = resolve(rel, v)
                if r: keep.setdefault(r, 'css url()')
        elif ext in ('.js', '.mjs'):
            # 26 Oct 2026: a data file a script fetches by its absolute path (the Post Office viewer's
            # fetch('/email/view/index.json')) must exist as a file: on a first visit no service worker is running yet,
            # so a removed file answered 404 and the viewer could not open any mail. - Sion's Tab agent
            s = p.read_text('utf-8', 'ignore')
            for v in FETCHLIT.findall(s):
                r = resolve(rel, v)
                if r: keep.setdefault(r, 'fetched by script')
        elif ext == '.webmanifest' or p.name == 'manifest.json':
            try:
                for ic in (json.load(open(p)).get('icons') or []):
                    r = resolve(rel, ic.get('src', ''))
                    if r: keep.setdefault(r, 'web manifest icon')
            except Exception: pass
    rep = collections.Counter(); kept_why = collections.Counter(); changed = []; dropped_bytes = collections.Counter(); kept_examples = []; doc_cands = []
    for path in sorted(paths):
        f = DIST / path.lstrip('/')
        if not f.is_file(): rep['indexed_no_file'] += 1; continue   # a copy the content store already folded into /_blob/
        if sha16(f) != blobs[paths[path]][5]:
            del paths[path]; changed.append(path); continue
        # 27 Oct 2026 (P-008): the Wayback snapshot page builds its bucket address at run time ('/wayback/snap/b/'+n+'.json'),
        # which FETCHLIT cannot see, so every bucket was dropped and /wayback/go/ found no captured copy (404). Keep them as files.
        why = keep.get(path) or ('fetched by browsers outside a service worker' if KEEPNAME.search(path) else None) \
            or ('fetched by script (built path)' if path.startswith(KEEPPREFIX) else None) \
            or ('webapp database / A2UI surface (read without a service worker)' if APPDB.search(path) else None) \
            or ('download file (.csv opened by a plain link, outside the service worker)' if path.lower().endswith('.csv') else None)
        # 31 Oct 2026 (P-132): a CSV is a download a reader opens by a plain <a href> link (the book register
        # /research/book-research-findings.csv and /research/books/findings.csv). An <a> link is not markup the preload
        # scanner fetches, so dbserve dropped every CSV and a first visit or a direct link answered 404. Keep CSVs as files. - Sion's Tab agent
        if why:
            kept_why[why] += 1; rep['kept_' + kind(path)] += 1
            if len(kept_examples) < 20: kept_examples.append([path, why])
            continue
        if path in linked:   # decided below, under the file cap
            doc_cands.append((linked[path][0], path, f)); continue
        n = f.stat().st_size; f.unlink(); rep['dropped_' + kind(path)] += 1; dropped_bytes[kind(path)] += n
    # linked documents: keep as files while the deploy stays under the cap (preview component targets first)
    before_broken = sum(e[1] for r, e in linked.items() if r.lower().endswith('.pdf') and not any((DIST / c.lstrip('/')).is_file() for c in (r, re.sub(r'^/(wales|argentina)/', '/', r))))
    remaining = sum(1 for x in DIST.rglob('*') if x.is_file()) - len(doc_cands)
    room = max(0, FILE_CAP - remaining); over = []
    for i, (prio, path, f) in enumerate(sorted(doc_cands)):
        if i < room:
            kept_why['linked document (<a href>, opened outside the service worker)'] += 1; rep['kept_' + kind(path)] += 1
            if len(kept_examples) < 20: kept_examples.append([path, 'linked document'])
            continue
        n = f.stat().st_size; f.unlink(); rep['dropped_' + kind(path)] += 1; dropped_bytes[kind(path)] += n; over.append(path)
    for d in sorted((p for p in DIST.rglob('*') if p.is_dir()), key=lambda x: -len(x.parts)):
        try:
            if not any(d.iterdir()): d.rmdir()
        except Exception: pass
    json.dump(bm, open(bmf, 'w'), separators=(',', ':'))
    o = {'db_version': bm['v'], 'paths_served_from_db': len(paths), 'blobs': len(blobs),
         'files_dropped': {k[8:]: v for k, v in rep.items() if k.startswith('dropped_')},
         'bytes_dropped': dict(dropped_bytes), 'bytes_dropped_total': sum(dropped_bytes.values()),
         'files_kept_as_well': {k[5:]: v for k, v in rep.items() if k.startswith('kept_')}, 'kept_why': dict(kept_why), 'kept_examples': kept_examples,
         'changed_after_db_build_served_as_files': len(changed), 'changed_examples': changed[:20], 'indexed_without_file': rep['indexed_no_file']}
    pdf_links = sum(e[1] for r_, e in linked.items() if r_.lower().endswith('.pdf'))
    def there(r_):   # /wales/<theme>/ and /argentina/<theme>/ serve the theme's own files
        return any((DIST / c.lstrip('/')).is_file() for c in (r_, re.sub(r'^/(wales|argentina)/', '/', r_)))
    broken = sorted(r_ for r_ in linked if r_.lower().endswith('.pdf') and not there(r_))
    ad = {'pdf_links_internal': pdf_links, 'pdf_targets': sum(1 for r_ in linked if r_.lower().endswith('.pdf')),
          'documents_kept_for_links': len(doc_cands) - len(over), 'documents_dropped_over_file_cap': len(over), 'file_cap': FILE_CAP,
          'files_after': sum(1 for x in DIST.rglob('*') if x.is_file()),
          'pdf_links_broken_before_dbserve': before_broken,
          'pdf_links_broken_after': sum(linked[r_][1] for r_ in broken), 'pdf_targets_broken_after': len(broken),
          'component_targets_broken_after': sum(1 for r_ in broken if linked[r_][0] == 0),
          'broken_examples': broken[:25], 'over_cap_examples': over[:15]}
    ad['status'] = 'OK' if not broken else 'FAIL: %d internal PDF links (%d files) answer 404 outside the service worker' % (ad['pdf_links_broken_after'], len(broken))
    if broken: print('::warning::dbserve ' + ad['status'])
    o['after_dbserve_pdf_links'] = ad
    r = DIST / '_cedwyn' / 'reports'; r.mkdir(parents=True, exist_ok=True)
    json.dump(o, open(r / 'dbserve.json', 'w'), indent=1)
    try:   # the PDF preview report carries the final count too
        pr = json.load(open(r / 'pdf_previews.json')) if (r / 'pdf_previews.json').exists() else {}
        pr['after_dbserve'] = ad
        if broken and str(pr.get('status', 'OK')).startswith('OK'): pr['status'] = ad['status']
        json.dump(pr, open(r / 'pdf_previews.json', 'w'), indent=1)
    except Exception as e:
        print('dbserve: pdf_previews report not updated:', e)
    print('dbserve', json.dumps({k: o[k] for k in ('paths_served_from_db', 'files_dropped', 'bytes_dropped_total', 'files_kept_as_well', 'changed_after_db_build_served_as_files')}))
    return 0
if __name__ == '__main__': sys.exit(main())
