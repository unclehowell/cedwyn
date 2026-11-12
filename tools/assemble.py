#!/usr/bin/env python3
"""assemble.py — copy every theme's site out of its mirrored branch (or a read-only crawl of its live site when it
has no static branch output) into dist/<theme>/. Never writes to datro or to any old subdomain. — Sion's Tab agent"""
import json, os, subprocess, shutil, sys, pathlib, time, re
ROOT = pathlib.Path(__file__).resolve().parent.parent
CFG = json.load(open(ROOT / 'themes.json'))
DIST = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'dist')
MIRROR = os.environ.get('MIRROR', 'mirror.git')   # bare repo holding the cedwyn branches
MAXF = 24 * 1024 * 1024                           # Pages limit is 25 MiB per file
report = {}
# REPO SPLIT step 3 (#311): apps with deploy=="repo" are read only from their own
# repository main. A missing/unreadable repo is a build failure, never a reason to
# silently use a Cedwyn legacy branch. Recorded under _split_source.
SPLIT = {}
SPLIT_FAILURES = []
# Dedicated static repositories can intentionally use a root different from the
# legacy theme branch. Wiki's compiled WordPress export is rooted at the repo root.
SPLIT_DIRS = {'wiki': ''}
# Build commands for source-only repositories whose output is produced during
# assembly. Kept in the build code rather than the public theme manifest.
SPLIT_BUILDS = {
    'docs': 'python3 -m pip install --quiet --break-system-packages -r requirements.txt && python3 _theme-docs/build.py',
    'projects': 'node projects/check.mjs',
}
try:
    _sr = json.load(open(ROOT / 'split-repos.json'))
    for _a in _sr.get('apps', []):
        if _a.get('deploy') == 'repo' and _a.get('repo'):
            # map by page path stem and by old_branch for matching against themes
            page = (_a.get('page') or '').strip('/')
            if page:
                SPLIT[page] = _a
            if _a.get('old_branch'):
                SPLIT[_a['old_branch']] = _a
            SPLIT[_a.get('app','').lower()] = _a
except Exception as e:
    report['_split_load_error'] = str(e)[:200]
def sh(cmd, cwd=None, t=900):
    try: return subprocess.run(['timeout', '-k', '5', str(t), 'bash', '-lc', cmd], cwd=cwd, capture_output=True, text=True)
    except Exception as e: return subprocess.CompletedProcess(cmd, 1, '', str(e))
def crawl(url, out, robots=False, quota='150m', t=420, sitemap=None):
    """read-only GET crawl; robots=True obeys the site's robots.txt (used for the WordPress wiki); sitemap: every page the
    site's own sitemap lists is a starting point too, so deep pages are not missed"""
    tmp = pathlib.Path('crawl_tmp_' + out.name); shutil.rmtree(tmp, ignore_errors=True); tmp.mkdir()
    rob = ("--wait=0.1 --reject-regex '[?&](share|replytocom|like_comment|nb|_wpnonce|subscribe|shared)=|/feed/|/amp/|/embed/'"
           if robots else '-e robots=off'); seeds = ''; level = 3
    if sitemap:
        try:
            import urllib.request, re as _re
            with urllib.request.urlopen(urllib.request.Request(sitemap, headers={'User-Agent': 'Mozilla/5.0 cedwyn-archive'}), timeout=60) as r0:
                locs = _re.findall(r'<loc>([^<]+)</loc>', r0.read().decode('utf-8', 'ignore'))
            lf = pathlib.Path('seeds_' + out.name + '.txt').resolve(); lf.write_text('\n'.join(locs) + '\n'); seeds = f'-i {lf}'; level = 1
            report.setdefault('_sitemap', {})[out.name] = len(locs)
        except Exception as e: report.setdefault('_sitemap', {})[out.name] = 'failed: ' + str(e)[:80]
    r = sh(f"wget -q {rob} {seeds} --mirror --level={level} --page-requisites --adjust-extension --convert-links=off --no-parent "
           f"--restrict-file-names=windows --timeout=20 --tries=4 --waitretry=20 --retry-on-http-error=429,503 --quota={quota} -U 'Mozilla/5.0 cedwyn-archive' -P {tmp} '{url}'", t=t)
    host = url.split('/')[2]; base = tmp / host
    sub = url.split(host, 1)[1].strip('/')
    src = base / sub if sub else base
    if not src.exists(): return 0
    shutil.copytree(src, out, dirs_exist_ok=True)
    shutil.rmtree(tmp, ignore_errors=True)
    return sum(1 for _ in out.rglob('*') if _.is_file())
SECTIONS = set(os.environ.get('SECTIONS', '').split())      # assemble only these theme ids (snapshot runs, section checks)
FORCE_CRAWL = os.environ.get('FORCE_CRAWL') == '1'           # snapshot runs: crawl the live site even when a snapshot branch exists
# Production reproducibility note (29 Oct 2026): the committed sections.lock SHAs are authoritative, not the branch tips. Keep item-level evidence interpretations in section/research and legacy Wiki interpretations/navigation in section/wiki, update both pins, then rebuild; otherwise a queued build can replace manual site-only edits with an older snapshot.
LOCK = {}
try: LOCK = json.load(open(ROOT / 'sections.lock')).get('sections', {})
except Exception: pass
def snapshot(t, out):
    """26 Oct 2026: a crawled section is read from its own snapshot branch (section/<id>, made by snapshot-sections.yml)
    at the commit sections.lock pins, so a build no longer crawls the live Worker sites. Falls back to the crawl when the
    branch or the pinned commit cannot be read. - Sion's Tab agent"""
    br = t['snapshot_branch']; pin = (LOCK.get(t['id']) or {}).get('sha') or ''
    repo = os.environ.get('GITHUB_REPOSITORY', 'unclehowell/cedwyn')
    ref = f'refs/heads/{br}'
    if sh(f"git --git-dir={MIRROR} rev-parse --verify -q {ref}").returncode != 0:
        sh(f"git --git-dir={MIRROR} fetch -q --depth 1 https://github.com/{repo}.git +{ref}:{ref}", t=600)
    want = ref
    if pin:
        if sh(f"git --git-dir={MIRROR} cat-file -e {pin}^{{commit}}").returncode != 0:
            sh(f"git --git-dir={MIRROR} fetch -q --depth 1 https://github.com/{repo}.git {pin}", t=600)
        want = pin if sh(f"git --git-dir={MIRROR} cat-file -e {pin}^{{commit}}").returncode == 0 else ref
    r = sh(f"git --git-dir={MIRROR} archive --format=tar {want} | tar -x -C {out}")

    # A site build can accidentally be pinned instead of a section snapshot. Its root
    # contains several sibling theme directories; extracting it into /<theme>/ would
    # nest the entire site under that theme and duplicate the catalogue. Reject it and
    # fall back to the actual section branch, never to a live crawl for this condition.
    peer_theme_roots = sorted(
        x['id'] for x in CFG.get('themes', [])
        if x.get('id') and x.get('id') != t.get('id') and (out / x['id']).is_dir()
    )
    if r.returncode == 0 and len(peer_theme_roots) >= 3:
        report.setdefault('_snapshot_rejected', {})[t['id']] = {
            'ref': want,
            'reason': 'snapshot root contains multiple sibling theme directories; likely a full-site build',
            'peer_theme_roots': peer_theme_roots[:30]
        }
        shutil.rmtree(out, ignore_errors=True)
        out.mkdir(parents=True, exist_ok=True)
        fallback = f'refs/heads/{br}'
        r = sh(f"git --git-dir={MIRROR} archive --format=tar {fallback} | tar -x -C {out}")
        want = fallback

    for x in ('section.json', '.github'):
        p = out / x
        if p.is_dir(): shutil.rmtree(p, ignore_errors=True)
        elif p.exists(): p.unlink()
    n = sum(1 for _ in out.rglob('*') if _.is_file())
    report.setdefault('_snapshot', {})[t['id']] = {'ref': want, 'files': n, 'rc': r.returncode, 'peer_theme_roots_detected': peer_theme_roots[:30]}
    return n if r.returncode == 0 and (out / 'index.html').exists() else 0

def fetch_split_repo(repo, out, theme):
    """Build/copy a dedicated app repository using the same root, build and output
    contract that the estate theme previously applied to its legacy branch. Never
    substitute a Cedwyn branch. Worker-rendered apps may be read-only crawled from
    their declared live Worker URL after their dedicated source repo is checked."""
    tid = theme.get('id', out.name)
    work = pathlib.Path('split_tmp_' + out.name)
    shutil.rmtree(work, ignore_errors=True)
    work.mkdir()
    clone_branch = theme.get('repo_branch', 'main')
    r = sh(f"git clone --depth 1 --branch {clone_branch} https://github.com/{repo}.git {work}", t=600)
    if r.returncode != 0:
        shutil.rmtree(work, ignore_errors=True)
        work.mkdir()
        r = sh(f"git clone --depth 1 https://github.com/{repo}.git {work}", t=600)
    if r.returncode != 0:
        err = (r.stderr or r.stdout or '')[-500:]
        shutil.rmtree(work, ignore_errors=True)
        return 0, f"clone failed: {err}", {}

    meta = {'repo_branch': clone_branch}
    # Record the exact dedicated-repository commit so the Q&A release watcher can
    # compare this published site build with the source repository HEAD.
    rev = sh("git rev-parse HEAD", cwd=work, t=20)
    if rev.returncode != 0 or not re.fullmatch(r"[0-9a-f]{40}", (rev.stdout or "").strip()):
        shutil.rmtree(work, ignore_errors=True)
        return 0, "could not identify dedicated repository commit", meta
    meta['repo_commit'] = rev.stdout.strip()
    build = SPLIT_BUILDS.get(tid) or theme.get('build')
    root = work / (theme.get('root') or '')
    if build:
        if not root.is_dir():
            shutil.rmtree(work, ignore_errors=True)
            return 0, f"build root missing: {theme.get('root') or '.'}", meta
        b = sh(build, cwd=root, t=theme.get('build_timeout', 900))
        meta['build'] = {
            'command': build,
            'rc': b.returncode,
            'stdout_tail': (b.stdout or '')[-1200:],
            'stderr_tail': (b.stderr or '')[-1600:]
        }
        report.setdefault('_split_build_logs', {})[tid] = meta['build']
        if b.returncode != 0:
            shutil.rmtree(work, ignore_errors=True)
            return 0, f"build failed (exit {b.returncode})", meta

    # Respect the theme's declared output directory. A non-empty static/ folder is
    # not necessarily the compiled site; it may be source, assets, or a nested app.
    rel = SPLIT_DIRS.get(tid, theme.get('dir') or '')
    d = work / rel
    if d.is_dir() and (d / 'index.html').is_file():
        shutil.copytree(
            d, out, dirs_exist_ok=True,
            ignore=shutil.ignore_patterns('.git', 'node_modules', '.github', 'worker')
        )
        meta['output_dir'] = rel or '.'
        if theme.get('overlay'):
            overlay = work / theme['overlay']
            if overlay.is_dir():
                shutil.copytree(
                    overlay, out, dirs_exist_ok=True,
                    ignore=shutil.ignore_patterns('.git', 'node_modules', '.github', 'functions', 'worker')
                )
                meta['overlay'] = theme['overlay']
    else:
        meta['output_dir'] = rel or '.'
        meta['output_missing_index'] = str(d.relative_to(work)) if d.exists() else f"{rel or '.'} (missing)"

    shutil.rmtree(work, ignore_errors=True)
    n = sum(1 for p in out.rglob('*') if p.is_file())
    if n and (out / 'index.html').is_file():
        return n, f"repo:{repo}/{rel or 'root'}", meta

    # A small number of app shells are rendered by their own Worker rather than
    # emitted as static HTML (e.g. the Dartboard's TanStack Start Worker). The
    # source repo remains the authoritative code location; this is a read-only
    # compiled-page capture from the app's explicitly declared Worker endpoint.
    if theme.get('crawl'):
        shutil.rmtree(out, ignore_errors=True)
        out.mkdir(parents=True, exist_ok=True)
        n = crawl(theme['crawl'], out, robots=False, quota=theme.get('crawl_quota', '150m'),
                  t=theme.get('crawl_secs', 420), sitemap=theme.get('crawl_sitemap'))
        meta['worker_url'] = theme['crawl']
        if n and (out / 'index.html').is_file():
            meta['rendered_from'] = 'declared live Worker endpoint; verify Worker deployment provenance separately'
            return n, f"worker-crawl:{theme['crawl']}", meta

    shutil.rmtree(out, ignore_errors=True)
    out.mkdir(parents=True, exist_ok=True)
    reason = meta.get('output_missing_index', 'selected output has no index.html')
    return 0, f"no compiled index.html: {reason}", meta

def one(t):
    tid = t['id']; out = DIST / tid; shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
    t0 = time.time(); how = None; n = 0
    # REPO SPLIT step 3 (#311): prefer the dedicated source repository when marked deploy=repo.
    # A content push to that app repository is not itself a Cloudflare Pages publication.
    # This parent build clones its declared repo_branch (main by default), records the exact
    # source commit, assembles the app under dist/, and publishes the combined site to `site`.
    # Keep the legacy section branch as a mirror only; do not patch the old branch or site output.
    sa = SPLIT.get(tid) or SPLIT.get(t.get('branch') or '') or SPLIT.get(t.get('snapshot_branch') or '')
    if sa and sa.get('deploy') == 'repo' and sa.get('repo'):
        n, how, split_meta = fetch_split_repo(sa['repo'], out, t)
        report.setdefault('_split_source', {})[tid] = {
            'repo': sa['repo'], 'how': how, 'files': n, **split_meta
        }
        if n and (out / 'index.html').exists():
            # success — skip branch/snapshot paths
            big = []
            for f in out.rglob('*'):
                if f.is_file() and f.stat().st_size > MAXF:
                    big.append(str(f.relative_to(DIST))); f.unlink()
            size = sum(f.stat().st_size for f in out.rglob('*') if f.is_file())
            report[tid] = {
                'how': how, 'files': n, 'bytes': size, 'has_index': True,
                'dropped_over_24MB': big, 'secs': round(time.time() - t0),
                'split_repo': sa['repo'], **split_meta
            }
            print(tid, report[tid]['how'], n, round(size / 1e6, 1), 'MB', flush=True)
            return
        # Fail closed: the dedicated repository is authoritative. Do not read a
        # Cedwyn legacy branch or a DATRO-derived copy as a fallback.
        reason = how or "dedicated repository did not provide an index.html"
        failure = {"theme": tid, "repo": sa["repo"], "reason": reason}
        SPLIT_FAILURES.append(failure)
        report[tid] = {
            "how": "split-repo-failed", "files": n, "bytes": 0,
            "has_index": False, "error": reason, "secs": round(time.time() - t0),
            "split_repo": sa["repo"], **split_meta
        }
        print(tid, "SPLIT REPO FAILED — no legacy fallback", flush=True)
        return
    if t.get('snapshot_branch') and not FORCE_CRAWL:
        n = snapshot(t, out); how = 'snapshot' if n else None
        if not n: shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
    if how: pass
    elif t.get('wp_copy'):   # the WordPress wiki: tools/wiki.py copies every sitemap page and its theme files (robots.txt obeyed)
        r = sh(f"python3 {ROOT / 'tools' / 'wiki.py'} {out}", t=t.get('crawl_secs', 1500))
        report.setdefault('_wiki_log', {})[tid] = r.stdout[-400:] + r.stderr[-600:]
        n = sum(1 for _ in out.rglob('*') if _.is_file()); how = 'wiki.py(robots)'
        if n < 200 or not (out / 'index.html').exists():
            shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True); n = 0; how = None
    elif t.get('crawl_first'):   # a live site crawled first (robots.txt obeyed); its branch copy is the fallback
        n = crawl(t['crawl_first'], out, robots=True, quota=t.get('crawl_quota', '150m'), t=t.get('crawl_secs', 420), sitemap=t.get('crawl_sitemap')); how = 'crawl(robots)'
        if n == 0 or not (out / 'index.html').exists():
            shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True); n = 0; how = None
    if how: pass
    elif t.get('branch'):
        work = pathlib.Path('src_tmp_' + tid); shutil.rmtree(work, ignore_errors=True); work.mkdir()
        r = sh(f"git --git-dir={MIRROR} archive --format=tar refs/heads/{t['branch']} | tar -x -C {work}")
        if r.returncode == 0:
            if t.get('build'):
                bdir = work / (t.get('root') or '')
                b = sh(t['build'], cwd=bdir, t=480)
                how = 'branch+build' if b.returncode == 0 else 'branch(build failed)'
                report.setdefault('_build_logs', {})[tid] = (b.stdout[-600:] + b.stderr[-900:])
            else:
                how = 'branch'
            d = work / t['dir'] if t.get('dir') else work   # a missing dir means the branch root (#283)
            if d.exists() and any(d.iterdir()):
                shutil.copytree(d, out, dirs_exist_ok=True, ignore=shutil.ignore_patterns('.git', 'node_modules', '.github', 'worker'))
                if t.get('overlay') and (work / t['overlay']).is_dir():   # the folder the live site serves at its root (e.g. qa: static/qa)
                    shutil.copytree(work / t['overlay'], out, dirs_exist_ok=True, ignore=shutil.ignore_patterns('.git', 'node_modules', 'functions', 'worker'))
                    how += '+overlay'
                n = sum(1 for _ in out.rglob('*') if _.is_file())
        shutil.rmtree(work, ignore_errors=True)
        if (n == 0 or not (out / 'index.html').exists()) and t.get('crawl_fallback'):
            shutil.rmtree(out, ignore_errors=True); out.mkdir(parents=True)
            n = crawl(t.get('crawl_url') or t['live'], out); how = 'crawl(fallback)'   # crawl_url: the theme's own origin when its public host now serves the Cedwyn copy (docs)
    elif t.get('crawl'):
        n = crawl(t['crawl'], out); how = 'crawl'
    big = []
    for f in out.rglob('*'):
        if f.is_file() and f.stat().st_size > MAXF:
            big.append(str(f.relative_to(DIST))); f.unlink()
    size = sum(f.stat().st_size for f in out.rglob('*') if f.is_file())
    report[tid] = {'how': how, 'files': n, 'bytes': size, 'has_index': (out / 'index.html').exists(), 'dropped_over_24MB': big, 'secs': round(time.time() - t0)}
    print(tid, report[tid]['how'], n, round(size / 1e6, 1), 'MB', flush=True)
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(6) as ex: list(ex.map(one, [t for t in CFG['themes'] if not SECTIONS or t['id'] in SECTIONS]))
json.dump(report, open(DIST / '_assemble_report.json', 'w'), indent=1)
if SPLIT_FAILURES:
    raise SystemExit("Dedicated repository source(s) failed; legacy fallback is disabled: " + json.dumps(SPLIT_FAILURES))
