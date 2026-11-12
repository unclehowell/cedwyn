#!/usr/bin/env python3
"""Webapps refresh, twice weekly (cedwyn#582). The central DB is the core catalogue: data/core on main, served by
/api/catalogue. Every build-cedwyn run regenerates each webapp's data from it (build step "Data views -> pages":
data/core -> each app's _db/view.json). This job:
  1. snapshots the central catalogue counts (kinds, data/core record files, candidates awaiting review),
  2. dispatches ONE build-cedwyn run on main, only if no build-cedwyn run is queued, waiting or in progress
     (and not in dry-run), so the webapps pick up everything added to the central DB since the last build,
  3. optional LLM triage: with NVIDIA_API_KEY (tried first), ANTHROPIC_API_KEY or OPENAI_API_KEY set, adds a scope/kind
     label to up to --max-label candidates in resync/candidates/latest.json that have none yet (labeller: resync.py,
     fetched beside this file). A failing provider falls through to the next; with no key or no working provider the
     step is skipped and the run goes on. Labels sit on the review list only; no record is touched.
  4. writes resync/refresh/<date>.json + latest.json on branch evidence-resync.
It never edits a record and never merges anything. Stdlib only. Env: GITHUB_TOKEN, GITHUB_REPOSITORY.
Usage: python3 refresh.py --data <evidence-resync checkout> --core <main checkout>/data/core [--dry-run]
— Sion's Tab agent"""
import argparse, datetime as dt, json, os, sys, time, urllib.error, urllib.request

SITE = "https://cedwyn.bucklerfamily.estate"
UA = "cedwyn-webapps-refresh/1.0"


def http(method, url, body=None, token=None):
    h = {"User-Agent": UA, "Accept": "application/vnd.github+json"}
    if token:
        h["Authorization"] = "Bearer " + token
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


def count_files(root):
    n = 0
    for _, _, files in os.walk(root):
        n += sum(1 for f in files if f.endswith(".json"))
    return n


def triage(data_dir, max_label, dry):
    """Label review candidates that have no label yet. Never raises; returns a small status dict (no key material)."""
    try:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        import resync as R
    except Exception as e:
        return {"status": f"skipped: labeller not available ({type(e).__name__})"}
    if not R.llm_providers():
        return {"status": "skipped: no LLM key set"}
    path = os.path.join(data_dir, "resync/candidates/latest.json")
    try:
        latest = json.load(open(path))
    except Exception:
        return {"status": "skipped: no candidate list yet"}
    order = R.llm_providers()
    todo = [i for i in latest.get("items", []) if not i.get("label") and not str(i.get("key", "")).startswith("spill:")]
    n = inscope = 0
    by = {}
    try:
        for c in todo[:max_label]:
            if not R.llm_providers():
                break
            lab = R.llm_label(c)
            if lab:
                c["label"] = lab
                n += 1
                inscope += bool(lab.get("in_scope"))
                by[lab.get("by", "?")] = by.get(lab.get("by", "?"), 0) + 1
            time.sleep(0.5)
    except Exception as e:
        print(f"triage stopped: {type(e).__name__}", file=sys.stderr)
    if n and not dry:
        with open(path, "w") as f:
            json.dump(latest, f, ensure_ascii=False, indent=1)
            f.write("\n")
    return {"status": "ran" + (" (dry run, not written)" if dry else ""), "provider_order": order,
            "unlabelled_before": len(todo), "labelled": n, "in_scope": inscope, "labelled_by": by,
            "providers_off": [p for p in order if p not in R.llm_providers()]}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--core", default="")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max-label", type=int, default=40)
    a = ap.parse_args()
    tok, repo = os.environ.get("GITHUB_TOKEN"), os.environ.get("GITHUB_REPOSITORY", "unclehowell/cedwyn")
    today = dt.datetime.utcnow().date().isoformat()
    st, cat = http("GET", f"{SITE}/api/catalogue?limit=1")
    kinds = {k["kind"]: k["n"] for k in (cat.get("kinds") or [])} if st == 200 else {}
    try:
        latest = json.load(open(os.path.join(a.data, "resync/candidates/latest.json")))
        pending = len(latest.get("items", []))
    except Exception:
        pending = None
    busy = []
    for status in ("queued", "in_progress", "waiting", "requested", "pending"):
        s, r = http("GET", f"https://api.github.com/repos/{repo}/actions/workflows/build.yml/runs?status={status}&per_page=5",
                    token=tok)
        if s == 200:
            busy += [{"id": x["id"], "status": x["status"], "created": x["created_at"]} for x in r.get("workflow_runs", [])]
    action = "none"
    if busy:
        action = f"skipped: {len(busy)} build-cedwyn run(s) already queued or running"
    elif a.dry_run:
        action = "dry run: would dispatch build-cedwyn on main"
    else:
        s, r = http("POST", f"https://api.github.com/repos/{repo}/actions/workflows/build.yml/dispatches",
                    {"ref": "main"}, token=tok)
        action = "dispatched build-cedwyn on main" if s == 204 else f"dispatch answered {s}: {r.get('error', '')[:150]}"
    tri = triage(a.data, a.max_label, a.dry_run)
    snap = {"schema": "cedwyn-webapps-refresh/1.0", "date": today,
            "at": dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            "central_catalogue": {"api_status": st, "total": cat.get("total") if st == 200 else None, "kinds": kinds,
                                  "core_record_files": count_files(a.core) if a.core and os.path.isdir(a.core) else None},
            "candidates_awaiting_review": pending, "builds_busy": busy, "build_action": action, "llm_triage": tri, "dry_run": a.dry_run}
    print(json.dumps(snap, indent=1))
    os.makedirs(os.path.join(a.data, "resync/refresh"), exist_ok=True)
    for p in (f"resync/refresh/{today}.json", "resync/refresh/latest.json"):
        with open(os.path.join(a.data, p), "w") as f:
            json.dump(snap, f, ensure_ascii=False, indent=1)
            f.write("\n")
    with open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a") as f:
        f.write(f"action={action}\ntotal={snap['central_catalogue']['total']}\npending={pending}\n")
        f.write(f"triage={tri.get('labelled', 0)} labelled, {tri.get('in_scope', 0)} in scope ({tri['status']})\n")


if __name__ == "__main__":
    main()
