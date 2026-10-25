#!/usr/bin/env python3
"""Observe selected public pages, hash changes, and try Wayback Save Page Now.

A changed response is a review alert, not evidence of motive. A Wayback calendar is not a confirmed
snapshot. Only timestamped snapshot URLs returned by the archive are stored as confirmed.
"""
from __future__ import annotations
import argparse, datetime as dt, hashlib, json, pathlib, re, sys, time
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen

ROOT=pathlib.Path(__file__).resolve().parent.parent
BASE=ROOT/"catalogue"
REGISTRY=BASE/"monitored-pages.json"
STATE=BASE/"monitoring"/"state.json"
HISTORY=BASE/"monitoring"/"history.jsonl"
UA="CedwynPublicPageMonitor/1.0 (+https://cedwyn.bucklerfamily.estate/)"
MAX_BYTES=12_000_000
TS=dt.datetime.now(dt.timezone.utc).replace(microsecond=0).isoformat().replace("+00:00","Z")

def load(p, default):
    try: return json.loads(p.read_text(encoding="utf-8"))
    except FileNotFoundError: return default
    except Exception as e: raise RuntimeError(f"Cannot read {p}: {e}")

def fetch(url, timeout=25):
    req=Request(url,headers={"User-Agent":UA,"Accept":"text/html,application/xhtml+xml,application/json;q=0.8,*/*;q=0.3","Accept-Encoding":"identity"})
    try:
        with urlopen(req,timeout=timeout) as r:
            body=r.read(MAX_BYTES+1)
            if len(body)>MAX_BYTES: raise RuntimeError(f"response exceeds {MAX_BYTES} bytes")
            return {"status":int(r.status),"url":r.geturl(),"headers":dict(r.headers.items()),"body":body,"error":None}
    except HTTPError as e:
        body=e.read(MAX_BYTES+1)
        return {"status":int(e.code),"url":e.geturl(),"headers":dict(e.headers.items()) if e.headers else {},"body":body[:MAX_BYTES],"error":f"HTTP {e.code}"}
    except (URLError,TimeoutError,OSError) as e:
        return {"status":None,"url":url,"headers":{},"body":b"","error":str(e)}

def wayback_capture(url, timeout=60):
    """Attempt Save Page Now; return confirmed timestamp URL only if the response proves one."""
    save_url="https://web.archive.org/save/"+url
    req=Request(save_url,headers={"User-Agent":UA,"Accept":"text/html,*/*;q=0.5"})
    try:
        with urlopen(req,timeout=timeout) as r:
            final=r.geturl()
            loc=r.headers.get("Content-Location","")
            candidates=[final,loc]
            # Some archive responses report a timestamp in headers instead of Location.
            for h in ("Memento-Datetime","X-Archive-Orig-Location","Location"):
                if r.headers.get(h): candidates.append(r.headers[h])
            for c in candidates:
                m=re.search(r"(https?://web\.archive\.org/web/\d{6,14}/[^\s\"'<>]+)",c or "")
                if m: return {"status":"confirmed","snapshot_url":m.group(1),"http_status":int(r.status),"note":"Timestamped Wayback snapshot URL returned by Save Page Now."}
            return {"status":"attempted_unconfirmed","snapshot_url":None,"http_status":int(r.status),"note":"Save endpoint responded, but no timestamped snapshot URL was returned."}
    except HTTPError as e:
        return {"status":"attempt_failed","snapshot_url":None,"http_status":int(e.code),"note":f"Save Page Now returned HTTP {e.code}."}
    except Exception as e:
        return {"status":"attempt_failed","snapshot_url":None,"http_status":None,"note":str(e)[:500]}

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--dry-run",action="store_true",help="Fetch and report page hashes without writing state or requesting archive captures.")
    ap.add_argument("--timeout",type=int,default=25)
    args=ap.parse_args()
    reg=load(REGISTRY,{})
    if not isinstance(reg.get("pages"),list): raise RuntimeError("monitored-pages.json must contain a pages array")
    old=load(STATE,{"schema_version":1,"pages":[],"note":"No previous verified monitoring state."})
    previous={r.get("url"):r for r in old.get("pages",[]) if isinstance(r,dict) and r.get("url")}
    next_rows=[]; events=[]; results=[]
    for i,p in enumerate(reg["pages"]):
        if not p.get("enabled",False):
            continue
        url=p.get("url","")
        if not url.startswith("https://"):
            results.append({"id":p.get("id"),"url":url,"status":"skipped_invalid_url"})
            continue
        prior=previous.get(url,{})
        f=fetch(url,args.timeout)
        digest=hashlib.sha256(f["body"]).hexdigest() if f["status"] is not None else None
        changed=(prior.get("sha256") is not None and digest is not None and prior.get("sha256")!=digest)
        first=(prior.get("sha256") is None and digest is not None)
        status_changed=(prior.get("http_status") is not None and f["status"] is not None and prior.get("http_status")!=f["status"])
        fetch_failed=f["status"] is None
        row=dict(prior)
        row.update({"id":p.get("id"),"title":p.get("title"),"url":url,"source_id":p.get("source_id"),
                    "sha256":digest or prior.get("sha256"),"http_status":f["status"] if f["status"] is not None else prior.get("http_status"),
                    "etag":f["headers"].get("ETag",prior.get("etag")),"last_modified":f["headers"].get("Last-Modified",prior.get("last_modified")),
                    "last_checked":TS if (first or changed or status_changed or fetch_failed) else prior.get("last_checked"),
                    "last_check_error":f["error"],"last_response_url":f["url"],"wayback_calendar_url":p.get("wayback_calendar_url"),
                    "required_snapshot":bool(p.get("required_snapshot")),"relevance_status":p.get("relevance_status"),
                    "monitoring_note":"Response digest changes indicate a changed fetched representation only; they do not establish intentional alteration or concealment."})
        reasons=[]
        if first: reasons.append("first_successful_observation")
        if changed: reasons.append("response_sha256_changed")
        if status_changed: reasons.append("http_status_changed")
        if fetch_failed: reasons.append("fetch_failed; last successful digest retained")
        if f["status"] is not None and (first or changed or status_changed):
            row["last_observed_change"]=TS
        # Attempt a capture when first seen, when the representation changes, or where required and not yet captured.
        need_capture=bool(p.get("required_snapshot")) and not args.dry_run and (
            first or changed or status_changed or not row.get("snapshot_url")
        )
        last_attempt=row.get("last_save_attempt_at")
        overdue=True
        if last_attempt:
            try:
                overdue=(dt.datetime.now(dt.timezone.utc)-dt.datetime.fromisoformat(last_attempt.replace("Z","+00:00"))).days>=30
            except Exception: overdue=True
        # Avoid repeated archive calls for a stable URL/hash on every workflow run.
        should_capture=need_capture and (first or changed or status_changed or not row.get("last_save_attempt_sha256") or
                                        (row.get("last_save_attempt_sha256")!=digest) or overdue)
        if should_capture:
            cap=wayback_capture(url)
            row["last_save_attempt_at"]=TS; row["last_save_attempt_sha256"]=digest
            row["archive_attempt_status"]=cap["status"]; row["archive_attempt_note"]=cap["note"]
            if cap.get("snapshot_url"):
                row["snapshot_url"]=cap["snapshot_url"]
                row["snapshot_confirmed_at"]=TS
                row["archive_status"]="confirmed_snapshot"
            else:
                row["archive_status"]="snapshot_not_confirmed"
            reasons.append("wayback_save_"+cap["status"])
            events.append({"time":TS,"monitor_id":p.get("id"),"url":url,"event":"wayback_capture_attempt",
                           "response_sha256":digest,"status":cap["status"],"snapshot_url":cap.get("snapshot_url"),
                           "note":cap["note"]})
        if not row.get("archive_status"):
            row["archive_status"]="no_confirmed_snapshot"
        if reasons and not args.dry_run:
            events.append({"time":TS,"monitor_id":p.get("id"),"url":url,"event":"public_page_check",
                           "reasons":reasons,"sha256":digest,"http_status":f["status"],"error":f["error"],
                           "interpretation":"Operational observation only; no inference about cause or intent."})
        next_rows.append(row)
        results.append({"id":p.get("id"),"status":f["status"],"sha256":digest,"changed":changed,"first_seen":first,
                        "status_changed":status_changed,"fetch_error":f["error"],"archive_status":row.get("archive_status"),
                        "snapshot_url":row.get("snapshot_url"),"events":reasons})
        time.sleep(1.1)
    print(json.dumps({"checked_at":TS,"dry_run":args.dry_run,"results":results},indent=2,ensure_ascii=False))
    if args.dry_run: return 0
    STATE.parent.mkdir(parents=True,exist_ok=True)
    # Do not erase prior state for URLs not currently enabled in the registry.
    seen={x.get("url") for x in next_rows}
    for url,row in previous.items():
        if url not in seen: next_rows.append(row)
    out={"schema_version":1,"pages":sorted(next_rows,key=lambda x:x.get("url","")),
         "note":"Only successful public responses have a current response hash. Calendar URLs are not confirmed snapshots. Hash changes are alerts, not findings about intent.","last_run_with_events":TS if events else old.get("last_run_with_events")}
    STATE.write_text(json.dumps(out,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    if events:
        with HISTORY.open("a",encoding="utf-8") as f:
            for e in events: f.write(json.dumps(e,ensure_ascii=False,separators=(",",":"))+"\n")
    return 0
if __name__=="__main__":
    try: sys.exit(main())
    except Exception as e:
        print(json.dumps({"error":str(e)}),file=sys.stderr); sys.exit(2)
