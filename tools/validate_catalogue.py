#!/usr/bin/env python3
"""Validate Cedwyn's source/provenance registers before any catalogue build."""
from __future__ import annotations
import json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent
BASE = ROOT / "catalogue"
ERRORS: list[str] = []
WARNINGS: list[str] = []

def load(name, default=None):
    p = BASE / name
    if not p.exists():
        ERRORS.append(f"required file missing: catalogue/{name}")
        return default
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        ERRORS.append(f"invalid JSON in catalogue/{name}: {e}")
        return default

def require(d, keys, where):
    if not isinstance(d, dict):
        ERRORS.append(f"{where}: expected object")
        return
    for k in keys:
        if k not in d:
            ERRORS.append(f"{where}: missing required field {k!r}")
        elif d[k] is None or d[k] == "":
            ERRORS.append(f"{where}: field {k!r} must not be empty")

def unique_rows(rows, key, where):
    seen=set()
    for i,row in enumerate(rows if isinstance(rows,list) else []):
        if not isinstance(row,dict):
            ERRORS.append(f"{where}[{i}]: expected object, not prose/array")
            continue
        value=row.get(key)
        if not value:
            ERRORS.append(f"{where}[{i}]: missing {key}")
        elif value in seen:
            ERRORS.append(f"{where}[{i}]: duplicate {key}={value!r}")
        seen.add(value)

sources=load("sources.json", {})
interpretations=load("interpretations.json", {})
leads=load("expected-records.json", {})
watch=load("monitored-pages.json", {})
state=load("monitoring/state.json", {})
events=load("events.json", {})
if not isinstance(sources,dict) or not isinstance(sources.get("records"),list):
    ERRORS.append("sources.json must have a records array")
    sources={"records":[]}
if not isinstance(interpretations,dict) or not isinstance(interpretations.get("records"),list):
    ERRORS.append("interpretations.json must have a records array")
    interpretations={"records":[]}
if not isinstance(leads,dict) or not isinstance(leads.get("records"),list):
    ERRORS.append("expected-records.json must have a records array")
    leads={"records":[]}
if not isinstance(watch,dict) or not isinstance(watch.get("pages"),list):
    ERRORS.append("monitored-pages.json must have a pages array")
    watch={"pages":[]}
if not isinstance(state,dict) or not isinstance(state.get("pages"),list):
    ERRORS.append("monitoring/state.json must have a pages array")
    state={"pages":[]}
if not isinstance(events,dict) or not isinstance(events.get("records"),list):
    ERRORS.append("events.json must have a records array")
    events={"records":[]}
sr=sources["records"]; ir=interpretations["records"]; lr=leads["records"]; wr=watch["pages"]; st=state["pages"]; er=events["records"]
unique_rows(sr,"id","sources.records")
unique_rows(ir,"id","interpretations.records")
unique_rows(lr,"id","expected-records.records")
unique_rows(wr,"id","monitored-pages.pages")
unique_rows(er,"event_id","events.records")
source_ids={r.get("id") for r in sr if isinstance(r,dict)}
interpretation_ids={r.get("id") for r in ir if isinstance(r,dict)}
lead_ids={r.get("id") for r in lr if isinstance(r,dict)}
watch_ids={r.get("id") for r in wr if isinstance(r,dict)}
required_source=["id","independent_origin_id","record_status","title","creator","custodian","source_type","description","read_status","completeness","limitations","public_url","wayback_calendar_url"]
for r in sr:
    require(r,required_source,f"sources[{r.get('id','?')}]")
    if r.get("public_url") and not str(r["public_url"]).startswith(("https://","http://")):
        ERRORS.append(f"sources[{r.get('id')}]: public_url must be an absolute http(s) URL")
    if not r.get("public_archive_url"):
        # A missing confirmed snapshot is legitimate, but the uncertainty must be visible.
        if not r.get("wayback_calendar_url"):
            ERRORS.append(f"sources[{r.get('id')}]: missing Wayback calendar URL or confirmed archive URL")
    if r.get("record_status","").startswith("located") and r.get("read_status") in ("not_read","target_passage_not_read"):
        WARNINGS.append(f"sources[{r.get('id')}]: located record not yet read; avoid substantive interpretation")
    if r.get("public_archive_url") and not re.match(r"^https://web\.archive\.org/web/\d{6,14}/", str(r["public_archive_url"])):
        ERRORS.append(f"sources[{r.get('id')}]: public_archive_url must be a confirmed timestamped Wayback snapshot URL")
    comm=r.get("communication") or {}
    if comm:
        for k in ("message_date","sender","recipient","subject"):
            if not comm.get(k):
                ERRORS.append(f"sources[{r.get('id')}]: communication missing {k!r}")
    att=r.get("attachment") or {}
    if r.get("source_type") in ("email_attachment","disclosed_file") or att:
        for k in ("sha256","bytes","filename","parent_source_id"):
            if att.get(k) in (None,""):
                ERRORS.append(f"sources[{r.get('id')}]: attachment metadata missing {k!r}")
        if att.get("parent_source_id") and att["parent_source_id"] not in source_ids:
            ERRORS.append(f"sources[{r.get('id')}]: attachment parent_source_id is not in sources.json")
        if r.get("publication_review") not in ("approved","redacted","restricted","pending"):
            ERRORS.append(f"sources[{r.get('id')}]: publication_review must explicitly be approved/redacted/restricted/pending")
required_interp=["id","subject_type","subject_id","status","title","text","basis_source_ids","evidence_for","evidence_against_or_limits","alternative_explanations","what_would_confirm","what_would_refute_or_modify","unresolved_questions","confidence"]
for r in ir:
    require(r,required_interp,f"interpretations[{r.get('id','?')}]")
    bases=r.get("basis_source_ids",[])
    if not isinstance(bases,list) or not bases:
        ERRORS.append(f"interpretations[{r.get('id')}]: basis_source_ids must be a non-empty list")
    else:
        for sid in bases:
            if sid not in source_ids:
                ERRORS.append(f"interpretations[{r.get('id')}]: unknown source id {sid!r}")
    if not isinstance(r.get("evidence_against_or_limits"),list) or not r.get("evidence_against_or_limits"):
        ERRORS.append(f"interpretations[{r.get('id')}]: include contrary evidence or explicit limits")
    if not isinstance(r.get("alternative_explanations"),list) or not r.get("alternative_explanations"):
        ERRORS.append(f"interpretations[{r.get('id')}]: include at least one alternative explanation")
    if not isinstance(r.get("what_would_confirm"),list) or not r.get("what_would_confirm"):
        ERRORS.append(f"interpretations[{r.get('id')}]: list what would confirm the interpretation")
    if not isinstance(r.get("what_would_refute_or_modify"),list) or not r.get("what_would_refute_or_modify"):
        ERRORS.append(f"interpretations[{r.get('id')}]: list what would refute/modify the interpretation")
    status=str(r.get("status","")).lower()
    if any(x in status for x in ("finding","proven","confirmed")) and not r.get("basis_source_ids"):
        ERRORS.append(f"interpretations[{r.get('id')}]: asserted finding has no cited source")
for r in er:
    require(r,["event_id","date","date_precision","actor","action","statement_class","event_status","source_ids","pinpoints","confidence","what_it_supports","what_it_does_not_establish","alternative_explanations","next_records","independent_origin_ids"],f"events[{r.get('event_id','?')}]")
    if not isinstance(r.get("source_ids"),list) or not r.get("source_ids"):
        ERRORS.append(f"events[{r.get('event_id')}]: source_ids must be a non-empty list")
    else:
        for sid in r["source_ids"]:
            if sid not in source_ids:
                ERRORS.append(f"events[{r.get('event_id')}]: unknown source_id {sid!r}")
    if not isinstance(r.get("pinpoints"),list) or not r.get("pinpoints"):
        ERRORS.append(f"events[{r.get('event_id')}]: record at least one source pinpoint")
    else:
        for pp in r["pinpoints"]:
            if not isinstance(pp,dict) or pp.get("source_id") not in source_ids or not pp.get("pinpoint"):
                ERRORS.append(f"events[{r.get('event_id')}]: each pinpoint requires a valid source_id and a pinpoint")
            elif pp["source_id"] not in r.get("source_ids",[]):
                ERRORS.append(f"events[{r.get('event_id')}]: pinpoint source {pp['source_id']!r} not listed in source_ids")
    if not r.get("what_it_does_not_establish"):
        ERRORS.append(f"events[{r.get('event_id')}]: state what the event source does NOT establish")
    if not r.get("alternative_explanations"):
        ERRORS.append(f"events[{r.get('event_id')}]: include alternative explanations or explicitly state none identified")
    if not r.get("next_records"):
        ERRORS.append(f"events[{r.get('event_id')}]: list next records or explicit follow-up action")
    if not r.get("independent_origin_ids"):
        ERRORS.append(f"events[{r.get('event_id')}]: independent_origin_ids must be recorded")
for r in lr:
    require(r,["id","title","priority","candidate_custodians","why_sought","working_description","could_confirm","could_refute","search_status","not_a_located_record"],f"expected-records[{r.get('id','?')}]")
    if r.get("not_a_located_record") is not True:
        ERRORS.append(f"expected-records[{r.get('id')}]: MUST explicitly set not_a_located_record=true")
    if r.get("record_status") != "expected_or_missing_artifact_lead":
        ERRORS.append(f"expected-records[{r.get('id')}]: use record_status='expected_or_missing_artifact_lead'")
    if r.get("confirmed_custodian") is True:
        WARNINGS.append(f"expected-records[{r.get('id')}]: candidate custodian marked confirmed; make sure supported by a record")
for r in wr:
    require(r,["id","title","url","source_id","enabled","required_snapshot","relevance_status","wayback_calendar_url"],f"monitored-pages[{r.get('id','?')}]")
    if r.get("source_id") not in source_ids:
        ERRORS.append(f"monitored-pages[{r.get('id')}]: source_id not in sources.json")
    if not str(r.get("url","")).startswith("https://"):
        ERRORS.append(f"monitored-pages[{r.get('id')}]: monitoring URL must use HTTPS")
    if not str(r.get("wayback_calendar_url","")).startswith("https://web.archive.org/web/*/"):
        ERRORS.append(f"monitored-pages[{r.get('id')}]: Wayback calendar link has unexpected form")
state_keys=set()
for i,r in enumerate(st):
    if not isinstance(r,dict):
        ERRORS.append(f"monitoring/state.json pages[{i}] must be an object")
        continue
    k=r.get("url") or r.get("id")
    if not k:
        ERRORS.append(f"monitoring/state.json pages[{i}] requires url or id")
    elif k in state_keys:
        ERRORS.append(f"monitoring/state.json: duplicate state for {k}")
    state_keys.add(k)
for r in st:
    if r.get("snapshot_url") and not re.match(r"^https://web\.archive\.org/web/\d{6,14}/",r["snapshot_url"]):
        ERRORS.append(f"monitoring state {r.get('url')}: snapshot_url is not a timestamped Wayback capture URL")
stats={"sources":len(sr),"interpretations":len(ir),"events":len(er),"expected_records":len(lr),"monitored_pages":len(wr),"monitoring_state_pages":len(st),"errors":len(ERRORS),"warnings":len(WARNINGS)}
print(json.dumps({"stats":stats,"warnings":WARNINGS,"errors":ERRORS},indent=2,ensure_ascii=False))
sys.exit(1 if ERRORS else 0)
