#!/usr/bin/env python3
"""headlines.py - headline-first story pages (Sion, 12:01 GMT 26 Oct 2026, m:2c8d96e9). - Sion's Tab agent
Nested learn-more (Sion, 22:12 GMT 26 Oct 2026, m:611a2587): the control reads "Learn more"; a long fold keeps its first part at
level 2 and puts the rest behind a second "Learn more" (level 3); each level ends with a "Show less" button (wiki.js) that closes
it and returns to its control. Without JavaScript the folds show open where the browser supports ::details-content, and the
native <details> control works everywhere.
"ensure the website is more a series of headlines of the bold impactful attention grabbing parts of the story and everything
after (the details) requires website visitors to select 'read more'".

One pass over every page the build wrote, the same in all themes. Inside each story container (<main>, <article>, <section>,
and the usual content wrappers) the headings and each section's first short paragraph stay on show; the rest of the section
goes behind a native <details>/<summary> "Read more" (Darllen mwy / Leer más by the page's language). It works without
JavaScript, it is keyboard- and screen-reader-accessible, and the folded text stays in the HTML, so search engines, the
catalogue's full-text index and AI readers still read every word. runtime.js relabels the control on a language change and
opens a fold when a link points inside it.

Never folded: forms, scripts, the Cedwyn notice boxes, ribbons, footers, the guest book, the e-book strip, navigation, and
anything in archived copies of outside websites (/wayback/websites/), letters (/email/), the e-book readers, the database,
single-page-app shells, the landing page and the hub pages (which carry their own headline block).
Runs from tools/site.py after ebook_editions and before guestbook. Report: dist/_cedwyn/reports/headlines.json.
"""
import json, pathlib, re, sys
from html.parser import HTMLParser

LABEL = {'en': 'Learn more', 'cy': 'Dysgu mwy', 'es': 'Saber más'}   # Sion 22:12 GMT 26 Oct 2026 (m:611a2587): 'learn more', two levels deep
LESS = {'en': 'Show less', 'cy': 'Dangos llai', 'es': 'Ver menos'}
SKIP_DIRS = ('_blob/', '_ext/', 'db/', '_cedwyn/', 'wayback/websites/', 'email/', 'emails/view/', 'graphql/', 'catalogue/',
             'guestbook/', 'explore/', 'ebooks/', 'shop/', 'ebooks/cedwyn/online/', 'ebooks/tymawr-heritage/online/', 'app/', 'chess/', 'chat/')
SKIP_FILES = {'index.html', 'wales/index.html', 'argentina/index.html', '404.html'}
VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr', 'keygen'}
CONTAINER_TAGS = {'main', 'article', 'section'}
CONTAINER_CLS = re.compile(r'\b(entry-content|post-content|page-content|article-body|content-body|prose|markdown-body|wiki-content)\b')
NEVER = re.compile(r'(cedwyn-(notice|rib|sec)|ghf-(agent|header|eb)|gaf-|guestbook|ebook-strip|eb-strip|\bnotice\b|footer|\bnav\b|navbar|menu|breadcrumb|share|subscribe|\btoc\b|modal|preview|player|\bhv-)', re.I)
HEAD = {'h2': 2, 'h3': 3, 'h4': 4}
BLOCK_OK = {'p', 'ul', 'ol', 'dl', 'blockquote', 'table', 'figure', 'div', 'pre', 'h4', 'h5', 'h6', 'img', 'aside', 'details', 'iframe', 'video', 'picture', 'hr', 'section'}
CSS = ('<style id="cw-more-css">.cw-more{margin:.2em 0 1.1em}.cw-more>summary{cursor:pointer;display:inline-flex;align-items:center;gap:.4em;'
       'min-height:44px;padding:0 16px;border:1px solid currentColor;border-radius:999px;font-weight:600;font-size:.92em;line-height:1.2;'
       'list-style:none;opacity:.88;-webkit-tap-highlight-color:transparent}.cw-more>summary::-webkit-details-marker{display:none}'
       '.cw-more>summary::after{content:"\\25BE";font-size:.9em}.cw-more[open]>summary::after{content:"\\25B4"}'
       '.cw-more>summary:focus-visible{outline:2px solid currentColor;outline-offset:2px;opacity:1}.cw-more[open]>summary{margin-bottom:.6em}'
       '[data-cw-lead]{font-weight:600}.cw-more-3{margin:.6em 0 .8em;padding-left:12px;border-left:3px solid currentColor}'
       '.cw-less{display:inline-flex;align-items:center;min-height:40px;margin:.5em 0 .2em;padding:0 14px;border:1px dashed currentColor;'
       'border-radius:999px;background:transparent;color:inherit;font:inherit;font-size:.86em;cursor:pointer;opacity:.85}'
       '.cw-less[hidden]{display:none}.cw-less::before{content:"\\25B4\\00a0"}@media print{.cw-more>summary,.cw-less{display:none}}</style>'
       '<noscript><style>details.cw-more::details-content{content-visibility:visible;display:block}'
       'details.cw-more>summary{display:none}</style></noscript>')

class P(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.lines = [0]
        for m in re.finditer('\n', text): self.lines.append(m.end())
        self.els = []; self.stack = []; self.text = text; self.raw = {'script', 'style', 'textarea', 'template'}
    def off(self):
        l, c = self.getpos(); return self.lines[l - 1] + c
    def handle_starttag(self, tag, attrs):
        o = self.off(); st = self.get_starttag_text() or ''
        e = {'tag': tag, 's': o, 'se': o + len(st), 'e': None, 'p': self.stack[-1] if self.stack else None, 'a': dict(attrs), 'kids': [], 'txt': 0}
        i = len(self.els); self.els.append(e)
        if e['p'] is not None: self.els[e['p']]['kids'].append(i)
        if tag in VOID: e['e'] = e['se']
        else: self.stack.append(i)
    def handle_startendtag(self, tag, attrs):
        o = self.off(); st = self.get_starttag_text() or ''
        e = {'tag': tag, 's': o, 'se': o + len(st), 'e': o + len(st), 'p': self.stack[-1] if self.stack else None, 'a': dict(attrs), 'kids': [], 'txt': 0}
        i = len(self.els); self.els.append(e)
        if e['p'] is not None: self.els[e['p']]['kids'].append(i)
    def handle_endtag(self, tag):
        if tag in VOID: return
        # close up to the matching open tag (tolerate unclosed <p>, <li> ...)
        for k in range(len(self.stack) - 1, -1, -1):
            if self.els[self.stack[k]]['tag'] == tag:
                o = self.off(); end = self.text.find('>', o) + 1
                for j in self.stack[k:]:
                    if self.els[j]['e'] is None: self.els[j]['e'] = end if j == self.stack[k] else o
                del self.stack[k:]; return
    def handle_data(self, d):
        n = len(d.strip())
        if n:
            for j in self.stack: self.els[j]['txt'] += n
            if self.stack: self.els[self.stack[-1]].setdefault('own', 0); self.els[self.stack[-1]]['own'] += n

def lang_of(t):
    m = re.search(r'<html\b[^>]*\blang="([a-zA-Z]{2})', t[:4000])
    l = (m.group(1).lower() if m else 'en'); return l if l in LABEL else 'en'

NEVER_ID = re.compile(r'^(ghf-agent-footer|ghf-header|ghf-eb|cedwyn-|guestbook|menu|nav|footer|toc)', re.I)
def never(e):
    a = e['a']; s = ' '.join(str(a.get(k) or '') for k in ('class', 'role'))
    return (e['tag'] in ('form', 'script', 'style', 'nav', 'footer', 'header', 'template', 'canvas', 'noscript', 'button', 'input', 'select')
            or bool(NEVER.search(s)) or bool(NEVER_ID.search(str(a.get('id') or ''))))

def contains_bad(els, i):
    stack = [i]
    while stack:
        k = stack.pop(); e = els[k]
        if e['tag'] in ('form', 'script', 'template', 'canvas', 'input', 'select', 'textarea') or (k != i and never(e) and e['tag'] not in ('nav',)): return True
        stack.extend(e['kids'])
    return False

def plan(text):
    p = P(text)
    try: p.feed(text); p.close()
    except Exception: return []
    els = p.els
    if any(e['e'] is None for e in els if e['tag'] in CONTAINER_TAGS): return []
    ins = []
    for ci, c in enumerate(els):
        cls = str(c['a'].get('class') or '')
        if c['tag'] not in CONTAINER_TAGS and c['tag'] not in ('div', 'li', 'td'): continue
        a, bad = ci, False
        while a is not None:
            if never(els[a]): bad = True; break
            a = els[a]['p']
        if bad: continue
        if c.get('own', 0) > 40: continue                       # loose text straight in the container: leave it alone
        kids = [k for k in c['kids'] if els[k]['e'] is not None]
        if len(kids) < 3: continue
        levels = [HEAD[els[k]['tag']] for k in kids if els[k]['tag'] in HEAD]
        if not levels: continue
        top = min(levels)
        # sections: a heading at the top level, then everything up to the next one
        cuts = [j for j, k in enumerate(kids) if els[k]['tag'] in HEAD and HEAD[els[k]['tag']] == top]
        for n, j in enumerate(cuts):
            end = cuts[n + 1] if n + 1 < len(cuts) else len(kids)
            body = kids[j + 1:end]
            if not body: continue
            run, runs = [], []
            for k in body:                                         # contiguous runs of foldable blocks only
                e = els[k]
                if e['tag'] in BLOCK_OK and not never(e) and not contains_bad(els, k): run.append(k)
                else:
                    if run: runs.append(run); run = []
            if run: runs.append(run)
            if not runs: continue
            if any(els[k]['tag'] == 'p' and any(els[g]['tag'] in BLOCK_OK - {'img'} for g in els[k]['kids']) for r_ in runs for k in r_): continue   # mis-nested <p>: leave the section alone
            run = max(runs, key=lambda r: sum(els[k]['txt'] for k in r))
            if run[0] != body[0] and els[body[0]]['tag'] != 'p': continue
            first = els[run[0]]
            lead = None
            if first['tag'] == 'p' and 25 <= first['txt'] <= 420: lead = run[0]; run = run[1:]
            if not run: continue
            hidden = sum(els[k]['txt'] for k in run)
            if hidden < 250: continue
            if lead is not None: ins.append((els[lead]['se'] - 1, 'lead'))
            # level 3: a long fold keeps its first part at level 2 and puts the rest behind a second 'Learn more'
            if len(run) >= 3 and hidden >= 900:
                acc, k = 0, 0
                for j, kk in enumerate(run):
                    acc += els[kk]['txt']
                    if acc >= max(300, hidden * 0.35): k = j + 1; break
                if 1 <= k < len(run) and sum(els[kk]['txt'] for kk in run[k:]) >= 300:
                    ins.append((els[run[k]]['s'], 'open3')); ins.append((els[run[-1]]['e'], 'close3'))
            ins.append((els[run[0]]['s'], 'open')); ins.append((els[run[-1]]['e'], 'close'))
    return ins

def apply(text):
    ins = plan(text)
    if not ins: return text, 0
    l = lang_of(text); lab = LABEL[l]
    O = ('<details class="cw-more"><summary data-cw-more><span class="cw-more-l">%s</span></summary><div class="cw-more-b">' % lab)
    O3 = O.replace('class="cw-more"', 'class="cw-more cw-more-3"')
    C = '<button type="button" class="cw-less" data-cw-less hidden>%s</button></div></details>' % LESS[l]
    out = text; n = 0
    order = {'close3': 0, 'close': 1, 'lead': 2, 'open': 3, 'open3': 4}
    for off, kind in sorted(set(ins), key=lambda x: (x[0], order[x[1]]), reverse=True):
        if kind == 'open': out = out[:off] + O + out[off:]; n += 1
        elif kind == 'open3': out = out[:off] + O3 + out[off:]
        elif kind in ('close', 'close3'): out = out[:off] + C + out[off:]
        else:
            if out[off] == '>' and not out[off - 1] == '/': out = out[:off] + ' data-cw-lead' + out[off:]
    if n and 'id="cw-more-css"' not in out:
        i = out.lower().find('</head>')
        out = (out[:i] + CSS + out[i:]) if i >= 0 else CSS + out
    if n and '/_cedwyn/wiki.js' not in out:
        i = out.lower().find('</head>')
        js = '<script src="/_cedwyn/wiki.js?v=1" defer></script>'
        out = (out[:i] + js + out[i:]) if i >= 0 else js + out
    return out, n

def run(dist):
    dist = pathlib.Path(dist); rep = {'pages': 0, 'folds': 0, 'themes': {}, 'skipped_spa': 0}
    for f in sorted(dist.rglob('*.html')):
        rel = f.relative_to(dist).as_posix()
        if rel in SKIP_FILES or rel.startswith(SKIP_DIRS): continue
        try: t = f.read_text(encoding='utf-8', errors='surrogateescape')
        except Exception: continue
        if len(t) > 30_000_000 or 'data-cw-headlines-off' in t: continue   # story/story is >2.5 MB before selfcontain extracts its inline media
        if re.search(r'<div id="(root|app)">\s*</div>', t): rep['skipped_spa'] += 1; continue
        if 'class="cw-more"' in t: continue
        out, n = apply(t)
        if n:
            f.write_text(out, encoding='utf-8', errors='surrogateescape'); rep['pages'] += 1; rep['folds'] += n
            th = rel.split('/')[0] if '/' in rel else '(root)'; rep['themes'][th] = rep['themes'].get(th, 0) + 1
    out = dist / '_cedwyn' / 'reports'; out.mkdir(parents=True, exist_ok=True)
    json.dump(rep, open(out / 'headlines.json', 'w'), indent=1)
    print('headlines:', rep['pages'], 'pages,', rep['folds'], 'read-more folds,', len(rep['themes']), 'themes')
    return rep

if __name__ == '__main__': run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
