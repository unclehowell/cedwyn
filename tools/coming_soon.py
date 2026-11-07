#!/usr/bin/env python3
"""coming_soon.py 1.0.0 - blank "Coming soon" webapps for the empty slots of the 59. - Sion's Tab agent

Owner, 7 Nov 2026: "Keep as 59 and where there's no webapps yet just have blank 'coming soon' webapps as coming-soon-xx repos.
xx being the webapp number. When we do the real webapps to replace them we'll do proper repos for the new webapp and purge the
corresponding coming-soon-xx webapp".

data/coming-soon.json lists the empty slots. For each slot NN that no real webapp takes (no themes.json "slot": NN and no
data/site-areas.json serendipity_slot NN), run() copies index.html of unclehowell/coming-soon-NN (main, depth 1) to
dist/coming-soon-NN/index.html. If the repository cannot be read, the same blank page is written from the template below,
so a slot never breaks the build. tools/site.py then lists the slot in /areas.json "nav"; tools/nav.py stamps the bar.
Only index.html is copied (README, CHANGELOG and COMING-SOON.json stay in the repository).

Replacing slot NN: give the real webapp its own repository and "slot": NN on its themes.json entry; remove the slot's line
from data/coming-soon.json and delete the coming-soon-NN repository. docs/NAV.md carries the rule."""
import json, pathlib, shutil, subprocess

ROOT = pathlib.Path(__file__).resolve().parent.parent
TEMPLATE = ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
            '<title>Coming soon · Webapp {n} of {of} · Cedwyn</title><meta name="description" content="Webapp {n} of {of} on the Cedwyn Estate site: coming soon.">'
            '<meta name="robots" content="noindex"><meta name="color-scheme" content="light">'
            '<style>body.cs{{margin:0;background:#f4f1ea;color:#1b1b1b;font:16px/1.5 Georgia,serif}}.cs-w{{max-width:640px;margin:0 auto;'
            'padding:18vh 20px 24vh;text-align:center}}.cs-w h1{{font:400 clamp(32px,9vw,52px)/1.15 Georgia,serif;margin:0 0 12px}}'
            '.cs-w p{{margin:0;color:#5a5a5a;letter-spacing:.12em;text-transform:uppercase;font-size:13px}}</style>'
            '<script src="/_cedwyn/ghf/ghf-boot.js?v=2.1.8"></script></head><body class="cs">\n'
            '<main class="cs-w" data-coming-soon="{n}"><h1>Coming soon</h1><p>Webapp {n} of {of}</p></main>\n</body></html>\n')


def load():
    f = ROOT / 'data' / 'coming-soon.json'
    return json.loads(f.read_text('utf-8')) if f.is_file() else {'slots': []}


def taken():
    """Slots a real webapp already takes: data/site-areas.json serendipity_slot + themes.json slot."""
    s = set()
    try:
        for a in json.loads((ROOT / 'data' / 'site-areas.json').read_text('utf-8')).get('areas', []):
            if a.get('serendipity_slot'): s.add(int(a['serendipity_slot']))
    except Exception: pass
    try:
        for t in json.loads((ROOT / 'themes.json').read_text('utf-8')).get('themes', []):
            if t.get('slot'): s.add(int(t['slot']))
    except Exception: pass
    return s


def active():
    doc = load(); busy = taken()
    return [c for c in doc.get('slots', []) if int(c['slot']) not in busy], int(doc.get('of') or 59)


def run(dist):
    dist = pathlib.Path(dist); out = []
    slots, of = active()
    for c in slots:
        n = int(c['slot']); d = dist / c['path'].strip('/'); d.mkdir(parents=True, exist_ok=True)
        tmp = pathlib.Path('cs_tmp_%d' % n); shutil.rmtree(tmp, ignore_errors=True)
        how = 'template'
        try:
            r = subprocess.run(['git', 'clone', '-q', '--depth', '1', 'https://github.com/%s.git' % c['repo'], str(tmp)],
                               capture_output=True, text=True, timeout=120)
            if r.returncode == 0 and (tmp / 'index.html').is_file():
                shutil.copyfile(tmp / 'index.html', d / 'index.html'); how = 'repo'
        except Exception:
            pass
        shutil.rmtree(tmp, ignore_errors=True)
        if how == 'template':
            (d / 'index.html').write_text(TEMPLATE.format(n=n, of=of), 'utf-8')
            print('::warning::coming-soon: %s not read, slot %d written from the template' % (c['repo'], n))
        out.append((n, c['id'], how))
    print('coming-soon %s: %d placeholder slots (%s)' % ('1.0.0', len(out), ', '.join('%d %s' % (n, h) for n, _, h in out)))
    return out


if __name__ == '__main__':
    import sys
    run(sys.argv[1] if len(sys.argv) > 1 else 'dist')
