#!/usr/bin/env python3
"""Daily webapp refresh, GitHub half (odd live N-of-59 slots). Owner ask 11 Nov 2026: every webapp refreshed daily from the
central DB, only when its data changed; odd numbers on GitHub, even numbers on a Cloudflare cron.
The live site is ONE Cloudflare Pages build (build-cedwyn, build.yml): every build re-reads each webapp's branch and
regenerates the central-catalogue views (data/core -> _db/view.json). So a "refresh" of an app is: copy its repo's main
into its old branch (sync-split-repos, one app at a time) and then ONE site build for everything that changed.
  1. reads the live build stamp (/_cedwyn/reports/build.json: commit, built_at),
  2. for each odd app in .github/daily-refresh/apps.json: changed if its repo's main (mirror mode: its old branch) has a
     commit newer than built_at minus margin_minutes; central-view apps also when data/core on main changed,
  3. reads the even half's verdict from the Cloudflare Worker (ghf-status /daily-refresh.json, same rule),
  4. asks sync-split-repos for each changed split-repo app (input repo, one at a time, a few seconds apart),
  5. waits, then dispatches ONE build-cedwyn on main if anything changed and no build is queued or running.
Never edits app content, never merges, never force-pushes. Stdlib only. Env: GITHUB_TOKEN, GITHUB_REPOSITORY, DRY_RUN.
— Sion's Tab agent"""
import datetime as dt, json, os, sys, time, urllib.error, urllib.request

SITE = "https://cedwyn.bucklerfamily.estate"
EVEN = "https://ghf-status.righteous.workers.dev/daily-refresh.json"
UA = "cedwyn-daily-refresh/1.0"
TOK = os.environ.get("GITHUB_TOKEN", "")
REPO = os.environ.get("GITHUB_REPOSITORY", "unclehowell/cedwyn")
DRY = os.environ.get("DRY_RUN", "false").lower() == "true"


def http(method, url, body=None, auth=True):
    h = {"User-Agent": UA, "Accept": "application/vnd.github+json"}
    if auth and TOK and "api.github.com" in url:
        h["Authorization"] = "Bearer " + TOK
    data = json.dumps(body).encode() if body is not None else None
    if data:
        h["Content-Type"] = "application/json"
    try:
        with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=h, method=method), timeout=60) as r:
            raw = r.read()
            return r.status, (json.loads(raw) if raw else {})
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode("utf-8", "replace")[:300]}
    except Exception as e:
        return None, {"error": str(e)[:300]}


def ts(s):
    return dt.datetime.strptime(s[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=dt.timezone.utc)


def latest(repo, ref, path=None):
    q = f"https://api.github.com/repos/{repo}/commits?sha={ref}&per_page=1" + (f"&path={path}" if path else "")
    s, b = http("GET", q)
    if s == 200 and isinstance(b, list) and b:
        return b[0]["commit"]["committer"]["date"], b[0]["sha"][:7]
    return None, f"status {s}"


def main():
    cfg = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "apps.json")))
    margin = dt.timedelta(minutes=int(cfg.get("margin_minutes", 45)))
    s, stamp = http("GET", f"{SITE}/_cedwyn/reports/build.json?cb={int(time.time())}", auth=False)
    if s != 200 or not isinstance(stamp, dict) or not stamp.get("built_at"):
        print("::warning::live build stamp unreadable; using now, so only very recent changes count"); stamp = {}
    built = ts(stamp["built_at"]) if stamp.get("built_at") else dt.datetime.now(dt.timezone.utc)
    cut = built - margin
    core_at, _ = latest(REPO, "main", "data/core")
    core_changed = bool(core_at) and ts(core_at) > cut
    changed, checked, errors, seen = [], 0, [], {}
    for a in cfg["apps"]:
        if a.get("lane") != "github":
            continue
        ref, src = ((REPO, a["old_branch"]) if a.get("mode") == "mirror" and a.get("old_branch") else (a["repo"], "main"))
        key = (ref, src)
        if key not in seen:
            seen[key] = latest(ref, src); checked += 1; time.sleep(0.3)
        when, sha = seen[key]
        if not when:
            errors.append(f"{a['app']}: {sha}"); continue
        why = []
        if ts(when) > cut:
            why.append(f"{ref}@{src} {sha} at {when}")
        if a.get("central_view") and core_changed:
            why.append(f"central catalogue data/core changed at {core_at}")
        if why:
            changed.append({"slot": a.get("slot") or a.get("nav_no"), "app": a["app"], "repo": a["repo"], "mode": a.get("mode"), "why": why})
    even = {}
    s, ev = http("GET", f"{EVEN}?cb={int(time.time())}", auth=False)
    now = dt.datetime.now(dt.timezone.utc)
    if s == 200 and isinstance(ev, dict) and ev.get("checked_at") and ts(ev["checked_at"]) > built - dt.timedelta(hours=1) \
            and ts(ev["checked_at"]) > now - dt.timedelta(hours=20):
        even = ev
    else:
        errors.append(f"even half (Cloudflare) verdict missing or stale: status {s}")
    even_changed = even.get("changed", []) if even else []
    todo = changed + [dict(x, lane="cloudflare") for x in even_changed]
    synced, done = [], set()
    for x in todo:
        rp = x.get("repo", "")
        if x.get("mode") == "mirror" or not rp.startswith("unclehowell/") or rp in done:
            continue
        done.add(rp)
        if DRY:
            synced.append(f"{rp} (dry)"); continue
        s, _ = http("POST", f"https://api.github.com/repos/{REPO}/actions/workflows/sync-split-repos.yml/dispatches",
                    {"ref": "main", "inputs": {"repo": rp}})
        synced.append(f"{rp} ({s})"); time.sleep(3)
    action = "none: nothing changed since the last build"
    if todo:
        if synced and not DRY:
            time.sleep(300)  # let the one-app syncs land before the build reads the branches
        busy = []
        for st in ("queued", "in_progress", "waiting", "requested", "pending"):
            s, r = http("GET", f"https://api.github.com/repos/{REPO}/actions/workflows/build.yml/runs?status={st}&per_page=5")
            if s == 200:
                busy += [x["id"] for x in r.get("workflow_runs", [])]
        if busy:
            action = f"skipped: {len(busy)} build-cedwyn run(s) already queued or running"
        elif DRY:
            action = "dry run: would dispatch build-cedwyn on main"
        else:
            s, r = http("POST", f"https://api.github.com/repos/{REPO}/actions/workflows/build.yml/dispatches", {"ref": "main"})
            action = "dispatched build-cedwyn on main" if s == 204 else f"dispatch answered {s}: {str(r)[:150]}"
    out = {"schema": "cedwyn-daily-refresh-run/1.0", "at": dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
           "live_build": stamp, "odd_checked": checked, "odd_changed": changed, "even_verdict_at": even.get("checked_at"),
           "even_changed": even_changed, "central_core_last_commit": core_at, "synced": synced, "build_action": action,
           "errors": errors, "dry_run": DRY}
    print(json.dumps(out, indent=1))
    with open(os.environ.get("GITHUB_STEP_SUMMARY", os.devnull), "a") as f:
        f.write(f"### Daily webapp refresh\nOdd apps changed: {len(changed)}; even apps changed (Cloudflare): {len(even_changed)}; "
                f"syncs asked: {len(synced)}; build: {action}\n")


if __name__ == "__main__":
    main()
