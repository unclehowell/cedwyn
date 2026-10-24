#!/usr/bin/env python3
"""check_links.py - fails the build if any outbound link survives anywhere on the site.
Checks every HTML file: <a>/<area> href and <form> action must stay on cedwyn.bucklerfamily.estate (relative or
same-host); the never-share YouTube channel must not appear in any href or iframe src. - Sion's Tab agent"""
import re, sys, pathlib, json
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
A = re.compile(r'''<(a|area|form)\b[^>]*?\s(href|action)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)''', re.I | re.S)
IF = re.compile(r'''<iframe\b[^>]*?\ssrc\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)''', re.I | re.S)
BANNED = re.compile(r'UC2sN1VEs1WeLfBH8VmbvLWw|sionbuckler5713', re.I)
SCRIPT = re.compile(r'<script\b.*?</script>', re.I | re.S)
bad = []; pages = 0; links = 0
for p in DIST.rglob('*.htm*'):
    if not p.is_file(): continue
    pages += 1
    s = SCRIPT.sub('', p.read_text('utf-8', 'ignore'))
    for tag, attr, v in A.findall(s):
        links += 1; v = v.strip('"\'').strip()
        if re.match(r'(?i)^(https?:)?//', v):
            host = re.sub(r'(?i)^(https?:)?//', '', v).split('/')[0].split('?')[0].split('#')[0].split(':')[0].lower()
            if host != 'cedwyn.bucklerfamily.estate': bad.append((str(p.relative_to(DIST)), v[:120]))
        if BANNED.search(v): bad.append((str(p.relative_to(DIST)), 'BANNED ' + v[:80]))
    for v in IF.findall(s):
        if BANNED.search(v): bad.append((str(p.relative_to(DIST)), 'BANNED iframe ' + v[:80]))
res = {'pages': pages, 'links_checked': links, 'outbound_found': len(bad), 'examples': bad[:30], 'pass': not bad}
json.dump(res, open(DIST / '_outbound_test.json', 'w'), indent=1)
print(json.dumps({k: res[k] for k in ('pages', 'links_checked', 'outbound_found', 'pass')}))
sys.exit(0 if not bad else 1)
