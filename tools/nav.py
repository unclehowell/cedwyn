#!/usr/bin/env python3
"""nav.py 1.0.0 - the ONE webapp registry, stamped into every slot page at build, and checked. - Sion's Tab agent

Owner, 04:13 GMT 2 Nov 2026: "It has never been solved whereby I can navigate through all 59 webapps. The way the navigation
is done is flawed architecturally. It keeps getting stuck. Fix it". Design and changelog: docs/NAV.md.

  python3 tools/nav.py dist           stamp the no-JS bar (prev, "NN of 59", next, every webapp) into every slot page
  python3 tools/nav.py dist --check   exit 1 on a duplicate slot, a slot over the total, a built slot with no page,
                                      a bar link that leads nowhere, or a slot page without the bar

The registry is dist/areas.json "nav" (tools/site.py: data/site-areas.json slots 1-39 + every themes.json entry with "slot").
basecamp.js reads the same list at runtime and hides this bar once its own header is drawn (html.ghf-v2-on)."""
import html, json, pathlib, re, sys

VERSION = '1.0.0'
OF = {'cy': 'o', 'es': 'de'}
ALL = {'en': 'All webapps', 'cy': "Pob ap gwe", 'es': 'Todas las aplicaciones'}
PREV = {'en': 'Previous webapp', 'cy': "Ap gwe blaenorol", 'es': 'Aplicación anterior'}
NEXT = {'en': 'Next webapp', 'cy': "Ap gwe nesaf", 'es': 'Aplicación siguiente'}
CSS = ('.cw-slotnav{display:flex;flex-wrap:wrap;align-items:center;gap:2px 6px;margin:0;padding:4px 8px;background:#000;color:#fff;'
       "font:14px/1.3 Barlow,'Helvetica Neue',Arial,sans-serif;box-sizing:border-box;max-width:100%;overflow:hidden}"
       '.cw-slotnav a{color:#fff;text-decoration:none}.cw-slotnav .cw-sn-arr{flex:0 0 40px;font-size:30px;line-height:40px;text-align:center}'
       '.cw-slotnav .cw-sn-name{flex:1 1 0;min-width:0;text-align:center;overflow-wrap:anywhere;text-transform:uppercase;letter-spacing:.06em}'
       '.cw-slotnav small{display:block;color:#0F9DF0;letter-spacing:.12em;font-size:11px}.cw-slotnav details{flex:1 0 100%;min-width:0}'
       '.cw-slotnav summary{cursor:pointer;font-size:12px;color:#ccc;padding:2px 0}.cw-slotnav ol{margin:4px 0 6px 2.2em;padding:0;font-size:13px}'
       '.cw-slotnav li{margin:3px 0}.cw-slotnav [aria-current]{font-weight:700;color:#0F9DF0}'
       'html.ghf-v2-pre .cw-slotnav,html.ghf-v2-on .cw-slotnav{display:none!important}')
BAR = re.compile(r'<nav class="cw-slotnav".*?</nav><!--/cw-slotnav-->', re.S)


def registry(dist):
    doc = json.loads((dist / 'areas.json').read_text('utf-8'))
    nav = doc.get('nav') or doc.get('areas') or []
    for a in nav:
        a.setdefault('src', a.get('path')); a.setdefault('href', a.get('path'))
    return doc, sorted([a for a in nav if a.get('built') is not False and a.get('slot')], key=lambda a: int(a['slot'])), nav


def pages(dist, a):
    """Every built index page that is this slot's landing page: its folder, its aliases, and the /wales/ and /argentina/ copies."""
    out = []
    for base in [a.get('src') or a['path']] + list(a.get('aliases') or []):
        for pre in ('', '/wales', '/argentina'):
            f = dist / (pre + base).strip('/') / 'index.html'
            if f.is_file() and f not in out: out.append(f)
    return out


def lang_of(s):
    m = re.search(r'<html[^>]*\blang="([a-z]{2})', s[:3000], re.I)
    return (m.group(1).lower() if m else 'en') if (m and m.group(1).lower() in ('cy', 'es')) else 'en'


def name(a, l):
    return (l != 'en' and a.get(l)) or a.get('title') or a['id']


def bar(chain, i, total, l):
    a, n = chain[i], len(chain)
    pv, nx = chain[(i - 1) % n], chain[(i + 1) % n]
    e = lambda x: html.escape(str(x), quote=True)
    li = ''.join('<li value="%d"><a href="%s"%s>%s</a></li>' % (int(c['slot']), e(c['href']), ' aria-current="page"' if c is a else '', e(name(c, l)))
                 for c in chain)
    return ('<nav class="cw-slotnav" data-cw-nav="%s" data-cw-slot="%d" aria-label="%s"><style>%s</style>'
            '<a class="cw-sn-arr" href="%s" rel="prev" aria-label="%s: %s" title="%s: %s">&#8249;</a>'
            '<span class="cw-sn-name"><b>%s</b><small>%d %s %d</small></span>'
            '<a class="cw-sn-arr" href="%s" rel="next" aria-label="%s: %s" title="%s: %s">&#8250;</a>'
            '<details><summary>%s (%d)</summary><ol>%s</ol></details></nav><!--/cw-slotnav-->') % (
        VERSION, int(a['slot']), e(ALL[l]), CSS,
        e(pv['href']), e(PREV[l]), e(name(pv, l)), e(PREV[l]), e(name(pv, l)),
        e(name(a, l)), int(a['slot']), OF.get(l, 'of'), total,
        e(nx['href']), e(NEXT[l]), e(name(nx, l)), e(NEXT[l]), e(name(nx, l)),
        e(ALL[l]), n, li)


def fix_frozen(s, a, pv, nx, total, l):
    """Old copies baked into page HTML: the 23-site chain ("2 of 23", Previous/Next site) and hand-typed parcel links."""
    e = lambda x: html.escape(str(x), quote=True)
    s = re.sub(r'<a href="[^"]*" title="Previous site: [^"]*" aria-label="Previous site: [^"]*"',
               '<a href="%s" title="Previous site: %s" aria-label="Previous site: %s"' % (e(pv['href']), e(name(pv, l)), e(name(pv, l))), s, count=1)
    s = re.sub(r'<a href="[^"]*" title="Next site: [^"]*" aria-label="Next site: [^"]*"',
               '<a href="%s" title="Next site: %s" aria-label="Next site: %s"' % (e(nx['href']), e(name(nx, l)), e(name(nx, l))), s, count=1)
    s = re.sub(r'(title="Previous site: .{0,1600}?>)\d+ of \d+(</div>)', lambda m: m.group(1) + '%d of %d' % (int(a['slot']), total) + m.group(2), s, count=1, flags=re.S)
    s = re.sub(r'(<a class="cw-parcel-link"[^>]*data-parcel-slot=")\d+("[^>]*>)\d+ (of|o|de) (\d+)</a>',
               lambda m: '%s%d%s%d %s %s</a>' % (m.group(1), int(a['slot']), m.group(2), int(a['slot']), m.group(3), m.group(4)), s, count=1)
    return s


def stamp(dist):
    doc, chain, _ = registry(dist)
    total = int(doc.get('parcel_total') or 59)
    n = 0
    for i, a in enumerate(chain):
        for f in pages(dist, a):
            s = f.read_text('utf-8', errors='replace')
            m = re.search(r'<body[^>]*>', s)
            if not m: continue
            l = lang_of(s)
            s = BAR.sub('', s)
            s = fix_frozen(s, a, chain[(i - 1) % len(chain)], chain[(i + 1) % len(chain)], total, l)
            m = re.search(r'<body[^>]*>', s)
            s = s[:m.end()] + bar(chain, i, total, l) + s[m.end():]
            f.write_text(s, 'utf-8'); n += 1
    print('nav %s: %d slots in the chain, bar stamped into %d pages' % (VERSION, len(chain), n))


def check(dist):
    doc, chain, nav = registry(dist)
    total = int(doc.get('parcel_total') or 59)
    bad, warn = [], []
    slots = [int(a['slot']) for a in nav if a.get('slot')]
    for s in sorted({x for x in slots if slots.count(x) > 1}): bad.append('slot %d is claimed twice: %s' % (s, [a['id'] for a in nav if int(a.get('slot') or 0) == s]))
    for a in nav:
        if not a.get('slot'): bad.append('%s has no slot' % a['id'])
        elif not 1 <= int(a['slot']) <= total: bad.append('%s slot %s is outside 1..%d' % (a['id'], a['slot'], total))
        if a.get('built') is False: warn.append('%s (slot %s) is registered but not built: left out of the chain' % (a['id'], a.get('slot')))
    redirects = set()
    rf = dist / '_redirects'
    if rf.is_file():
        for line in rf.read_text('utf-8', errors='replace').splitlines():
            p = line.split()
            if len(p) >= 2 and not line.lstrip().startswith('#') and (len(p) < 3 or p[2].startswith('30')): redirects.add(p[0].rstrip('/') + '/')
    for a in chain:
        if a.get('worker'):   # served by its own Worker route, not by the build: its page carries basecamp.js, which reads the same list
            continue
        pg = pages(dist, a)
        if not pg: bad.append('%s (slot %s): no built page at %s' % (a['id'], a['slot'], a.get('src')))
        if (a['href'].rstrip('/') + '/') in redirects: warn.append('%s (slot %s): %s is a redirect source in _redirects' % (a['id'], a['slot'], a['href']))
        if not a['href'].startswith('/online/') and not (dist / a['href'].strip('/') / 'index.html').is_file() and a['href'] != '/':
            bad.append('%s (slot %s): link %s has no page' % (a['id'], a['slot'], a['href']))
        for f in pg:
            s = f.read_text('utf-8', errors='replace')
            if not re.search(r'<body[^>]*>', s):   # a bodiless stub (redirect page): stamp() leaves it alone too
                continue
            m = re.search(r'<nav class="cw-slotnav"[^>]*data-cw-slot="(\d+)"', s)
            if not m: bad.append('%s: no nav bar' % f.relative_to(dist))
            elif int(m.group(1)) != int(a['slot']): bad.append('%s: bar says slot %s, registry %s' % (f.relative_to(dist), m.group(1), a['slot']))
    for w in warn: print('::warning::nav: ' + w)
    for b in bad: print('::error::nav: ' + b)
    print('nav %s check: %d slots in the chain (%s), %d problems, %d warnings' % (VERSION, len(chain), ','.join(str(a['slot']) for a in chain), len(bad), len(warn)))
    return 1 if bad else 0


if __name__ == '__main__':
    d = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
    sys.exit(check(d) if '--check' in sys.argv else (stamp(d) or 0))
