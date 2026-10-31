#!/usr/bin/env python3
"""chestnut_sync.py - one-way sync for the That Old Chestnut webapp (Cedwyn webapp 37 of 59).

Master -> shortlist, never the other way:
  audit (box, private)   work/that-old-chestnut/audit/chestnuts.json (+ counts.json)   written by the FOI/EIR audit runs
  main  (public)          data/site-areas.json, data/nomenclature.json, data/core/records/places.json, data/evidence-grades.json
  ->  data/core/records/foi-chestnuts.json      public catalogue records, kind foi_finding (goes to main by PR)
  ->  data/views/that-old-chestnut.view.json    the webapp's selection rule + page copy + parcel block (goes to main by PR)
  ->  public/_db/view.json                       seed copy of the webapp's own db, same shape tools/views.py derives at build

Only whitelisted public fields leave the audit file: no Gmail ids, no message ids, no thread subjects, no private_* fields.
Public gate on every quote: a quote that carries a word on the site's banned list, an e-mail address / phone number, or a
titled personal name (Mr/Mrs/Ms/Miss/Dr + Name) is held back and replaced by a neutral marker; the record stays.
Nothing is invented: a missing value stays empty and shows as "not yet read" on the page.

Usage (stdlib only):
  python3 tools/chestnut_sync.py --audit /home/user/tab/work/that-old-chestnut/audit --out <dir> [--main <checkout of main>]
Without --main the four main files are read from raw.githubusercontent.com (unclehowell/cedwyn, branch main).
- Sion's Tab agent, 31 Oct 2026"""
import json, re, sys, pathlib, datetime, urllib.request, argparse

APP, SLOT, OF = "that-old-chestnut", 37, 59
REPO_RAW = "https://raw.githubusercontent.com/unclehowell/cedwyn/main/"
BANNED = re.compile(r"\b(says|claims|according to|hearsay|unverified|alleged|fraud\w*|stolen|tenant farmers?)\b", re.I)
PRIVATE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+|(?:\+44\s?7|\b07)\d{3}\s?\d{3}\s?\d{3}\b|(?i:api[_-]?key|secret|token)\s*[:=]")
TITLED = re.compile(r"\b(?:Mr|Mrs|Ms|Miss|Dr|Prof)\.?\s+[A-Z][a-z]+")
PARCEL_EVIDENCE = ["EV-0211", "EV-0215", "EV-0629", "EV-0630", "EV-0631"]   # 1824 plan 19, c.1841 tithe, 1974/1988 survey records used by the replica
CLASSES = {"clear": "clear", "borderline": "borderline", "language-only chestnut": "language", "language-only": "language", "language": "language"}

def read_main(main, rel):
    if main:
        return json.load(open(pathlib.Path(main) / rel, encoding="utf-8"))
    with urllib.request.urlopen(urllib.request.Request(REPO_RAW + rel, headers={"User-Agent": "cedwyn-sync"}), timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))

def pick(d, *keys):
    for k in keys:
        cur = d
        for part in k.split("."):
            cur = cur.get(part) if isinstance(cur, dict) else None
        if cur not in (None, "", []):
            return cur
    return None

def gate_quote(q, held):
    if not q: return ""
    q = URLISH.sub("[web address removed]", str(q).strip())
    why = ("a word on the site's banned list" if BANNED.search(q) else
           "contact details" if PRIVATE.search(q) else
           "an individual officer's name" if TITLED.search(q) else None)
    if why:
        held.append(why)
        return "[quote held back for editorial review: it contains %s]" % why
    return q

URLISH = re.compile(r"\S*(?:https?:|www\.)\S*", re.I)

def clean(s):
    s = "" if s is None else str(s)
    s = PRIVATE.sub("[contact details removed]", s)
    s = URLISH.sub("[web address removed]", s)
    return s

def to_record(a, today):
    held = []
    cls = CLASSES.get(str(a.get("class", "")).strip().lower(), "language")
    dates = a.get("dates") or {}
    neg_date = pick(a, "negative_date", "dates.negative", "dates.initial_negative", "dates.reply", "date_negative") or ""
    terms = []
    for t in a.get("chestnut_terms") or []:
        if isinstance(t, str): t = {"term": t}
        term = gate_quote(t.get("term"), held)
        terms.append({"term": term, "statute": clean(t.get("points_to") or t.get("statute") or ""), "note": clean(t.get("note") or "")})
    yz = pick(a, "YZ", "y_z", "email_volume", "yz")
    if isinstance(yz, dict): yz = "%s:%s" % (yz.get("y", "?"), yz.get("z", "?"))
    f = {
        "class": cls,
        "institution": clean(a.get("institution")),
        "negative_date": neg_date,
        "positive_date": pick(a, "positive_date", "dates.positive", "dates.later_positive") or "",
        "months_elapsed": pick(a, "months_elapsed", "months"),
        "email_volume": yz or "",
        "negative_quote": gate_quote(pick(a, "negative_wording", "negative_quote"), held),
        "positive_quote": gate_quote(pick(a, "positive_wording", "positive_quote"), held),
        "positive_nature": clean(pick(a, "positive_nature", "nature_of_positive_finding") or ""),
        "trigger": clean(pick(a, "trigger") or ""),
        "disclosure_type": clean(pick(a, "disclosure_type") or ""),
        "conduct": clean(pick(a, "evidence_of_evasion", "conduct", "evidence_of_conduct", "gatekeeping") or ""),
        "interim_disclosure": clean(pick(a, "interim_disclosure", "disclosed_between") or ""),
        "terms": terms,
        "open": bool(a.get("open", True)),
        "held_back": sorted(set(held)),
    }
    if not f["positive_nature"] and f["disclosure_type"] and f["positive_date"]:
        f["positive_nature"] = "%s (%s)" % (f["disclosure_type"], f["positive_date"])
    for k in ("conduct", "positive_nature", "interim_disclosure"):
        if BANNED.search(f[k]): f[k] = "[held back for editorial review]"; f["held_back"].append("banned word in " + k)
    rid = str(a.get("id") or "").upper()
    if not re.match(r"^TOC-[A-Z0-9-]+$", rid): return None
    title = ("%s · reply of %s" % (f["institution"] or "Institution", neg_date or "date not yet read"))[:200]
    rec = {"id": rid, "kind": "foi_finding", "title": title,
           "date": {"display": neg_date, "sort": neg_date or None, "precision": "day" if len(neg_date) == 10 else "unknown"},
           "provenance": {"holder": f["institution"], "reference": "Correspondence held on file (not published)", "date": neg_date},
           "scope": {"disposition": "in_scope"},
           "evidence": [e for e in (a.get("evidence_ids") or a.get("evidence") or []) if re.match(r"^(EV|MR|CC)-", str(e))],
           "finding": f, "public": True, "updated": today, "rev": 1}
    return rec

def parcel_block(areas, nomen):
    area = next((x for x in areas.get("areas", []) if x.get("id") == APP), None) or {}
    names = []
    for g in nomen.get("groups", []):
        if g.get("id") == "tymawr":
            names = [n for n in g.get("match", []) if isinstance(n, str)][:40]
    return {
        "slot": area.get("serendipity_slot", SLOT), "of": OF,
        "label": "%d of %d" % (area.get("serendipity_slot", SLOT), OF),
        "status": area.get("parcel_mapping_status", "historic_plot_number_pending_verification"),
        "status_text": "The historic plot number for this webapp is not yet fixed: the c.1841 tithe schedule (EV-0215) is still to be checked row by row. Until then the number is an index of the estate's 59 parcels, not a plot reference.",
        "parcel_record": area.get("parcel_record", "/research/evidence/ev-0215-tithe-apportionment-john-williams-c1841/"),
        "tithe_parcel_number": area.get("tithe_parcel_number"),
        "grid_refs": [{"ref": r, "source": "The family's name-and-reference list, 31 Oct 2026; not checked against a map"} for r in ("ST 167 733", "ST 168 733", "ST 1681 7331")],
        "names": names,
        "names_page": "/nomenclature/",
        "replica": {"page": "/projects/replica/", "text": "Measured replica register v0.1: 46 rows (measured 10, scaled 18, inferred 15, gap 3)."},
        "links": [{"text": "Every page area and its parcel slot", "href": "/parcels/site-areas/"}, {"text": "The 36 tithe parcels of c.1841", "href": "/parcels/"}, {"text": "Names and spellings", "href": "/nomenclature/"}],
    }

def select(recs, kinds, ids=None, project=None):
    out = [r for r in recs if r.get("public") and r.get("kind") in kinds and (ids is None or r.get("id") in ids)]
    out.sort(key=lambda r: str(r.get("id")))
    return [{k: r[k] for k in project if k in r} if project else dict(r) for r in out]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--audit", required=True); ap.add_argument("--out", required=True); ap.add_argument("--main"); ap.add_argument("--unread", type=int)
    a = ap.parse_args(); out = pathlib.Path(a.out); today = datetime.date.today().isoformat()
    aud_p = pathlib.Path(a.audit) / "chestnuts.json"
    audit = json.load(open(aud_p, encoding="utf-8")) if aud_p.exists() else {"records": [], "complete": False}
    recs = [r for r in (to_record(x, today) for x in audit.get("records", [])) if r]
    areas = read_main(a.main, "data/site-areas.json"); nomen = read_main(a.main, "data/nomenclature.json")
    places = read_main(a.main, "data/core/records/places.json").get("records", [])
    try: grades = read_main(a.main, "data/evidence-grades.json").get("evidence", [])
    except Exception: grades = []
    ev = [{"id": g.get("ev"), "kind": "evidence", "title": g.get("title") or g.get("ev"), "page": g.get("page"), "public": True} for g in grades if g.get("ev") in PARCEL_EVIDENCE]
    core = {"schema": "core-record/0.1", "source": "work/that-old-chestnut/audit (private) via tools/chestnut_sync.py on the that-old-chestnut branch",
            "note": "FOI/EIR reply findings for the That Old Chestnut webapp. Generated, never edited by hand. Verbatim quotes; institutions named, officers never named.",
            "complete": bool(audit.get("complete")), "generated": audit.get("generated"), "records": recs}
    view = json.load(open(pathlib.Path(__file__).resolve().parent / "view.template.json", encoding="utf-8"))
    view["copy"]["parcel"] = parcel_block(areas, nomen)
    unread = audit.get("unread_threads") or audit.get("still_to_read") or []
    unread = len(unread) if isinstance(unread, list) else int(unread or 0)
    adir = pathlib.Path(a.audit)
    counts = json.load(open(adir / "counts.json", encoding="utf-8")) if (adir / "counts.json").exists() else {}
    if a.unread is not None: unread = a.unread
    elif not unread and (adir / "REPORT.md").exists():       # the audit report states how many recent messages it has not read
        m = re.search(r"(\d+)\s+are unread", (adir / "REPORT.md").read_text(encoding="utf-8"))
        if m: unread = int(m.group(1))
    hw, highlight = counts.get("heneb_word") or {}, None
    if hw.get("word"):
        hit = next((r for r in recs if any(hw["word"].lower() in (x.get("term") or "").lower() for x in r["finding"]["terms"])), None)
        if hit:
            highlight = {"id": hit["id"], "institution": hit["finding"]["institution"], "term": hw["word"], "date": hw.get("date") or hit["finding"]["negative_date"],
                         "statute": clean(hw.get("statute") or ""), "quote": hit["finding"]["negative_quote"]}
    view["copy"]["audit"] = {"complete": bool(audit.get("complete")), "generated": audit.get("generated") or "", "still_to_read": unread,
                             "coverage": {k: counts[k] for k in ("conversations_reviewed", "messages_reviewed", "received_messages_scanned") if k in counts},
                             "highlight": highlight}
    for p in (out / "data/core/records", out / "data/views", out / "public/_db"): p.mkdir(parents=True, exist_ok=True)
    json.dump(core, open(out / "data/core/records/foi-chestnuts.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(view, open(out / ("data/views/%s.view.json" % APP), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    allrecs = recs + places + ev
    db = {"chestnuts": select(allrecs, {"foi_finding"}, project=["id", "title", "date", "provenance", "evidence", "finding", "updated"]),
          "places": select(allrecs, {"place"}, ids=["PL-TY-MAWR"], project=["id", "title", "aliases", "description", "page"]),
          "parcel_evidence": select(allrecs, {"evidence"}, ids=PARCEL_EVIDENCE, project=["id", "title", "page"]),
          "copy": view["copy"]}
    db["meta"] = {"app": APP, "view_version": view.get("version"), "generated": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
                  "source": "data/core (Cedwyn central catalogue)", "rule": "data/views/%s.view.json" % APP, "seed": True,
                  "counts": {k: len(v) for k, v in db.items() if isinstance(v, list)}}
    text = json.dumps(db, ensure_ascii=False)
    hits = [m.group(0) for m in BANNED.finditer(text)] + [m.group(0)[:20] for m in PRIVATE.finditer(text)]
    if hits:
        sys.exit("public gate failed: %s" % sorted(set(hits))[:10])
    json.dump(db, open(out / "public/_db/view.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
    print(json.dumps({"records": len(recs), "complete": core["complete"], "held_back": sum(1 for r in recs if r["finding"]["held_back"]),
                      "places": len(db["places"]), "parcel_evidence": len(db["parcel_evidence"])}))

if __name__ == "__main__":
    main()
