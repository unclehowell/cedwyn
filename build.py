#!/usr/bin/env python3
"""build.py - renders the Cedwyn developer library into public/ (served at /library/).
Words: content/pages.json. Section list: data/sections.json (from themes.json + sections.lock on main; --refresh re-reads them).
Templates and styles live here and in static/; no record text in the templates. Usage: python3 build.py [--refresh]"""
import html, json, pathlib, re, sys, urllib.request
HERE = pathlib.Path(__file__).resolve().parent; OUT = HERE / 'public'
RAW = 'https://raw.githubusercontent.com/unclehowell/cedwyn/main/'
def refresh():
    T = json.loads(urllib.request.urlopen(RAW + 'themes.json', timeout=60).read()); lock = json.loads(urllib.request.urlopen(RAW + 'sections.lock', timeout=60).read())['sections']
    old = {s['id']: s for s in json.load(open(HERE / 'data' / 'sections.json'))['sections']}
    grp = {g['id']: g['title'] for g in T['groups']}; out = []
    for t in T['themes']:
        br = t.get('snapshot_branch') or t.get('branch') or ''
        kind = 'snapshot' if br.startswith('section/') else 'crawl' if (not br and t.get('crawl')) else 'main' if not br else 'branch'
        src = ('branch %s' % br + (' / %s' % t['dir'] if t.get('dir') and kind == 'branch' else '')) if br else ('crawl of the live origin' if kind == 'crawl' else 'built on main')
        out.append({'id': t['id'], 'title': t['title'], 'group': grp.get(t.get('group'), t.get('group')), 'kind': kind, 'source': src, 'branch': br,
                    'pinned': lock.get(t['id'], {}).get('sha', '')[:7], 'build': bool(t.get('build')), 'own_store': old.get(t['id'], {}).get('own_store', '')})
    json.dump({'note': 'Derived from themes.json and sections.lock on main. Refresh: python3 build.py --refresh', 'sections': out},
              open(HERE / 'data' / 'sections.json', 'w'), indent=1, ensure_ascii=False)
def esc(s): return html.escape(str(s or ''))
def sections_table(S):
    rows = ''.join('<tr data-k="%s"><td><a href="/%s/"><code>/%s/</code></a></td><td>%s</td><td>%s</td><td><span class="tag %s">%s</span></td><td><code>%s</code>%s</td><td>%s</td></tr>' % (
        esc((s['id'] + ' ' + s['title'] + ' ' + s['group'] + ' ' + s['source']).lower()), esc(s['id']), esc(s['id']), esc(s['title']), esc(s['group']),
        esc(s['kind']), esc(s['kind']), esc(s['source']), (' @ <code>%s</code>' % esc(s['pinned'])) if s['pinned'] else '',
        esc(s['own_store']) or 'files on its branch; rows in the core catalogue') for s in S)
    return ('<div class="tw"><table id="sectable"><thead><tr><th>Path</th><th>Section</th><th>Group</th><th>Kind</th><th>Source</th><th>Data</th></tr></thead><tbody>'
            + rows + '</tbody></table></div>')
def render():
    P = json.load(open(HERE / 'content' / 'pages.json')); SD = json.load(open(HERE / 'data' / 'sections.json')); S = SD['sections']
    n = {k: sum(1 for s in S if s['kind'] == k) for k in ('branch', 'snapshot', 'crawl', 'main')}
    nft = HERE / 'content' / 'nft-art-notes.html'
    subs = {'{{SECTIONS_TABLE}}': sections_table(S), '{{SECTIONS_NOTE}}': esc(SD.get('note', '')), '{{N_total}}': str(len(S)),
            '{{CRAWLED}}': ', '.join(s['id'] for s in S if s['kind'] == 'crawl'), '{{NFT_NOTES}}': nft.read_text(encoding='utf-8') if nft.exists() else ''}
    for k, v in n.items(): subs['{{N_%s}}' % k] = str(v)
    tpl = (HERE / 'static' / 'page.html').read_text(encoding='utf-8')
    nav = ''.join('<li><a href="/library/%s" data-s="%s">%s</a></li>' % ('' if p['slug'] == 'index' else p['slug'] + '/', p['slug'], esc(p['title'])) for p in P)
    idx = []
    for i, p in enumerate(P):
        body = p['body']
        for k, v in subs.items(): body = body.replace(k, v)
        heads = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', body)
        toc = ''.join('<li><a href="#%s">%s</a></li>' % (a, re.sub('<[^>]+>', '', t)) for a, t in heads)
        prev = P[i - 1] if i else None; nxt = P[i + 1] if i + 1 < len(P) else None
        link = lambda q: '/library/' + ('' if q['slug'] == 'index' else q['slug'] + '/')
        pager = ('<a class="pv" href="%s">‹ %s</a>' % (link(prev), esc(prev['title'])) if prev else '<span></span>') + \
                ('<a class="nx" href="%s">%s ›</a>' % (link(nxt), esc(nxt['title'])) if nxt else '<span></span>')
        out = (tpl.replace('{{TITLE}}', esc(p['title'])).replace('{{SUMMARY}}', esc(p['summary'])).replace('{{NAV}}', nav)
               .replace('{{SLUG}}', p['slug']).replace('{{TOC}}', ('<nav class="toc" aria-label="On this page"><ul>%s</ul></nav>' % toc) if toc else '')
               .replace('{{BODY}}', body).replace('{{PAGER}}', pager))
        d = OUT if p['slug'] == 'index' else OUT / p['slug']; d.mkdir(parents=True, exist_ok=True); (d / 'index.html').write_text(out, encoding='utf-8')
        text = re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', body))).strip()
        idx.append({'u': link(p), 't': p['title'], 's': p['summary'], 'h': [[a, re.sub('<[^>]+>', '', t)] for a, t in heads], 'x': text[:6000]})
    (OUT / 'search-index.js').write_text('window.LIB_INDEX=' + json.dumps(idx, ensure_ascii=False) + ';', encoding='utf-8')
    for f in ('library.css', 'library.js'): (OUT / f).write_text((HERE / 'static' / f).read_text(encoding='utf-8'), encoding='utf-8')
    print('library: %d pages, %d sections' % (len(P), len(S)))
if __name__ == '__main__':
    if '--refresh' in sys.argv: refresh()
    render()
