#!/usr/bin/env python3
"""assemble.py — copy every theme's site out of its mirrored branch (or a read-only crawl of its live site when it
has no static branch output) into dist/<theme>/. Never writes to datro or to any old subdomain. — Sion's Tab agent"""
import json, os, subprocess, shutil, sys, pathlib, time
ROOT = pathlib.Path(__file__).resolve().parent.parent
CFG = json.load(open(ROOT / 'themes.json'))
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
MIRROR = os.environ.get('MIRROR', 'mirror.git')   # bare repo holding the cedwyn branches
MAXF = 24 * 1024 * 1024                           # Pages limit is 25 MiB per file
report = {}
def sh(cmd, cwd=None, t=900):
    return subprocess.run(['bash', '-lc', cmd], cwd=cwd, capture_output=True, text=True, timeout=t)
def crawl(url, out):
    tmp = pathlib.Path('crawl_tmp'); shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir()
    r = sh(f"wget -q -e robots=off --mirror --level=4 --page-requisites --adjust-extension --convert-links=off --no-parent "
           f"--restrict-file-names=windows --timeout=20 --tries=2 --quota=400m -U 'Mozilla/5.0 cedwyn-archive' -P {tmp} '{url}'", t=1500)
    host = url.split('/')[2]; base = tmp / host
    sub = url.split(host, 1)[1].strip('/')
    src = base / sub if sub else base
    if not src.exists(): return 0
    shutil.copytree(src, out, dirs_exist_ok=True)
    shutil.rmtree(tmp, ignore_errors=True)
    return sum(1 for _ in out.rglob('*') if _.is_file())
for t in CFG['themes']:
    tid = t['id']; out = DIST / tid; shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
    t0 = time.time(); how = None; n = 0
    if t.get('branch'):
        work = pathlib.Path('src_tmp'); shutil.rmtree(work, ignore_errors=True); work.mkdir()
        r = sh(f"git --git-dir={MIRROR} archive --format=tar refs/heads/{t['branch']} | tar -x -C {work}")
        if r.returncode == 0:
            if t.get('build'):
                bdir = work / (t.get('root') or '')
                b = sh(t['build'], cwd=bdir, t=900)
                how = 'branch+build' if b.returncode == 0 else 'branch(build failed)'
                report.setdefault('_build_logs', {})[tid] = (b.stdout[-600:] + b.stderr[-900:])
            else:
                how = 'branch'
            d = work / t['dir'] if t['dir'] else work
            if d.exists() and any(d.iterdir()):
                shutil.copytree(d, out, dirs_exist_ok=True, ignore=shutil.ignore_patterns('.git', 'node_modules', '.github'))
                n = sum(1 for _ in out.rglob('*') if _.is_file())
        shutil.rmtree(work, ignore_errors=True)
        if (n == 0 or not (out / 'index.html').exists()) and t.get('crawl_fallback'):
            shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
            n = crawl(t['live'], out); how = 'crawl(fallback)'
    elif t.get('crawl'):
        n = crawl(t['crawl'], out); how = 'crawl'
    big = []
    for f in out.rglob('*'):
        if f.is_file() and f.stat().st_size > MAXF:
            big.append(str(f.relative_to(DIST))); f.unlink()
    size = sum(f.stat().st_size for f in out.rglob('*') if f.is_file())
    report[tid] = {'how': how, 'files': n, 'bytes': size, 'has_index': (out / 'index.html').exists(), 'dropped_over_24MB': big, 'secs': round(time.time() - t0)}
    print(tid, report[tid]['how'], n, round(size / 1e6, 1), 'MB', flush=True)
json.dump(report, open(DIST / '_assemble_report.json', 'w'), indent=1)
