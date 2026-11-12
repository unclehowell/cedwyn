#!/usr/bin/env python3
"""Evidence resync, daily (cedwyn#582). Gathers NEW evidence/artifact CANDIDATES from three sources and writes them to a
review file on the orphan branch `evidence-resync`. Add-only: it never writes a catalogue record, never edits, moves or
deletes one, never opens or merges a PR and never applies `owner-approved` (catalogue lock). Promotion to a record stays
with the spill / catalogue process (catalogue-change PR).

Sources
  (a) mail   : resync/gmail/export.json, written once a day by a box-side export of the email-ingest catalogue candidates
               (public-safe fields only). Gmail itself is not reachable from here.
  (b) spills : /spill/api/status?id=SP-NNNNN, scanned forward from the last watermark; new/queued/accepted items are listed.
  (c) online : a fixed query set against free JSON APIs (Internet Archive advanced search, TNA Discovery, Wikidata),
               kept only when a scope term is present, and dropped when the catalogue (/api/catalogue) or the
               online-gap-finder ledger (resync/seen-online-gap-finder.json) already carries the source.
Optional: with NVIDIA_API_KEY (tried first), ANTHROPIC_API_KEY or OPENAI_API_KEY set, each online candidate gets a
scope/kind label; a failing provider falls through to the next; with none, labelling is skipped and the run goes on.

Usage: python3 resync.py --data <checkout of branch evidence-resync> [--dry-run] [--max-online 60]
Stdlib only. — Sion's Tab agent
"""
import argparse, datetime as dt, json, os, re, sys, time, urllib.error, urllib.parse, urllib.request

UA = "cedwyn-evidence-resync/1.0 (+https://cedwyn.bucklerfamily.estate/)"
SITE = "https://cedwyn.bucklerfamily.estate"
SCOPE = ["llandough", "leckwith", "great house farm", "great house, llandough", "ty mawr", "tŷ mawr", "tymawr",
         "cogan", "cedwyn", "bp properties", "penarth"]
QUERIES = [
    '"Great House" Llandough', '"Ty Mawr" Llandough', 'Llandough Williams farmer', 'Llandough juxta Penarth',
    'Leckwith Llandough', 'Llandough tithe', 'Llandough estate sale', 'Llandough manor', 'Leckwith manor',
    'Cogan Llandough', '"BP Properties" Buckler', 'Llandough Penarth farm',
]
BANNED = ["says", "claims", "according to", "hearsay", "unverified", "alleged", "fraud", "stolen", "testimony",
          "recollection"]
PRIVATE_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.]+|(?:\+44|0)\s?\d{2,4}[\s-]?\d{3,4}[\s-]?\d{3,4}|\bsion\b|\bhywel\b",
                        re.I)


def get(url, headers=None, timeout=40, tries=3):
    h = {"User-Agent": UA}
    h.update(headers or {})
    last = None
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=h), timeout=timeout) as r:
                return json.loads(r.read().decode("utf-8", "replace"))
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None  # a gap in an id series, not a failure
            last = e
            time.sleep(2 * (i + 1))
        except Exception as e:  # network or JSON trouble: back off, then give up quietly
            last = e
            time.sleep(2 * (i + 1))
    print(f"  get failed: {url[:120]} ({last})", file=sys.stderr)
    return None


def clean(s, n=300):
    s = re.sub(r"<[^>]+>", " ", str(s or ""))
    s = re.sub(r"\s+", " ", s).strip()
    return s[:n]


def public_ok(*texts):
    t = " ".join(str(x or "") for x in texts)
    if PRIVATE_RE.search(t):
        return False, "private detail"
    if re.search(r"1547|1552", t):
        return False, "withheld date digits"
    low = t.lower()
    for w in BANNED:
        if re.search(r"\b" + re.escape(w) + r"\b", low):
            return False, f"banned word '{w}'"
    return True, ""


def in_scope(*texts):
    low = " ".join(str(x or "") for x in texts).lower()
    return [s for s in SCOPE if s in low]


def load(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except Exception:
        return default


def save(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
        f.write("\n")


# ---------- the central catalogue (dedupe) ----------
def catalogue_text():
    parts, off = [], 0
    for _ in range(20):
        d = get(f"{SITE}/api/catalogue?limit=500&offset={off}", timeout=60)
        if not d or not d.get("items"):
            break
        for it in d["items"]:
            parts.append(json.dumps(it, ensure_ascii=False).lower())
        off += 500
        if off >= (d.get("total") or 0):
            break
    return "\n".join(parts), len(parts)


# ---------- (a) mail ----------
def from_mail(data, seen, cat):
    rows = load(os.path.join(data, "resync/gmail/export.json"), {}).get("items", [])
    out = []
    for r in rows:
        key = "mail:" + r.get("key", "")
        if key in seen:
            continue
        ok, why = public_ok(r.get("title"), r.get("summary"), r.get("holder"))
        if not ok:
            seen[key] = {"skipped": why, "at": TODAY}
            continue
        t = clean(r.get("title"), 200).lower()
        if cat and len(t) > 12 and t[:80] in cat:
            seen[key] = {"skipped": "already in the catalogue", "at": TODAY}
            continue
        out.append({"key": key, "source": "mail", "title": clean(r.get("title"), 200),
                    "date_display": clean(r.get("date"), 60), "holder": clean(r.get("holder"), 120),
                    "type": clean(r.get("type"), 80), "summary": clean(r.get("summary"), 400),
                    "proposed_kind": "catalogue_candidate", "url": "", "scope_terms": in_scope(r.get("title"), r.get("summary"))})
    return out


# ---------- (b) spills ----------
def from_spills(state, seen):
    nxt = int(state.get("spill_next", 1))
    misses, out, n, pending = 0, [], nxt, []
    while misses < 6 and n < nxt + 400:
        sid = f"SP-{n:05d}"
        d = get(f"{SITE}/spill/api/status?id={sid}", timeout=20, tries=2)
        if not d or "status" not in d:
            misses += 1
            n += 1
            continue
        misses = 0
        st = d.get("status")
        if st in ("new", "queued", "accepted"):
            pending.append(sid)
            key = "spill:" + sid
            if key not in seen:
                out.append({"key": key, "source": "spill", "title": f"Spill item {sid} awaiting the spill processor",
                            "date_display": clean(d.get("date"), 40), "holder": "", "type": "spill item",
                            "summary": f"status {st}; target {d.get('target')}; received {clean(d.get('received'), 30)}",
                            "proposed_kind": d.get("target") or "catalogue", "url": "", "scope_terms": []})
        else:
            state["spill_next"] = n + 1  # terminal items need no second look
        n += 1
    if pending:
        state["spill_next"] = min(int(p[3:]) for p in pending)
    return out, pending


# ---------- (c) online ----------
def ia(q):
    u = "https://archive.org/advancedsearch.php?" + urllib.parse.urlencode(
        [("q", q), ("fl[]", "identifier"), ("fl[]", "title"), ("fl[]", "date"), ("fl[]", "description"),
         ("fl[]", "mediatype"), ("rows", "15"), ("output", "json")])
    d = get(u) or {}
    for x in (d.get("response") or {}).get("docs", []):
        yield {"ref": x.get("identifier"), "title": x.get("title"), "date": x.get("date"),
               "desc": x.get("description"), "holder": "Internet Archive",
               "url": "https://archive.org/details/" + str(x.get("identifier")), "type": x.get("mediatype") or "item"}


def tna(q):
    u = "https://discovery.nationalarchives.gov.uk/API/search/records?" + urllib.parse.urlencode(
        {"sps.searchQuery": q, "sps.resultsPageSize": "15"})
    d = get(u, headers={"Accept": "application/json"}) or {}
    for x in d.get("records", []):
        rid = x.get("id")
        yield {"ref": x.get("reference") or rid, "title": x.get("title") or x.get("description"),
               "date": x.get("coveringDates"), "desc": x.get("description") or x.get("context"),
               "holder": ", ".join(x.get("heldBy") or []) or "The National Archives Discovery",
               "url": f"https://discovery.nationalarchives.gov.uk/details/r/{rid}", "type": "archive catalogue entry"}


def wikidata(q):
    u = "https://www.wikidata.org/w/api.php?" + urllib.parse.urlencode(
        {"action": "wbsearchentities", "search": q.replace('"', ""), "language": "en", "format": "json", "limit": "7"})
    d = get(u) or {}
    for x in d.get("search", []):
        yield {"ref": x.get("id"), "title": x.get("label"), "date": "", "desc": x.get("description"),
               "holder": "Wikidata", "url": "https://www.wikidata.org/wiki/" + str(x.get("id")), "type": "wikidata item"}


def from_online(seen, cat, gap_urls, max_items):
    out, keys = [], set()
    for q in QUERIES:
        for fn in (ia, tna, wikidata):
            try:
                hits = list(fn(q))
            except Exception as e:
                print(f"  {fn.__name__} failed for {q}: {e}", file=sys.stderr)
                hits = []
            for h in hits:
                key = f"online:{fn.__name__}:{h['ref']}"
                if not h.get("ref") or key in seen or key in keys:
                    continue
                keys.add(key)
                title, desc = clean(h["title"], 220), clean(h["desc"], 400)
                terms = in_scope(title, desc)
                if not terms:
                    continue
                ref = str(h["ref"]).lower()
                wd_known = fn.__name__ == "wikidata" and title.lower() in cat
                if wd_known or h["url"] in gap_urls or (len(ref) > 5 and ref in cat) or h["url"].lower() in cat:
                    seen[key] = {"skipped": "already held or already a gap", "at": TODAY}
                    continue
                ok, why = public_ok(title, desc)
                if not ok:
                    seen[key] = {"skipped": why, "at": TODAY}
                    continue
                out.append({"key": key, "source": "online:" + fn.__name__, "title": title,
                            "date_display": clean(h.get("date"), 60), "holder": clean(h.get("holder"), 120),
                            "type": clean(h.get("type"), 60), "summary": desc, "reference": clean(h["ref"], 80),
                            "url": h["url"], "query": q, "proposed_kind": "evidence", "scope_terms": terms})
            time.sleep(1.0)  # polite pace
    out.sort(key=lambda c: -len(c["scope_terms"]))
    return out[:max_items]


# ---------- optional LLM label ----------
PROMPT = ("You screen archive search hits for a local-history catalogue about Tŷ Mawr / Great House Farm, Llandough "
          "(near Penarth, Vale of Glamorgan, Wales), the Williams family who farmed there, Leckwith, Cogan, the Cedwyn "
          "estate and the 1987 Court of Appeal case BP Properties Ltd v Buckler. Answer ONLY with JSON: "
          '{"in_scope": true|false, "kind": "evidence|artifact|place|event|person_or_body|other", '
          '"line": "<one neutral sentence, max 25 words, describing what the record is>"}. Hit: ')


NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions"   # OpenAI-compatible NIM endpoint
NVIDIA_DEFAULT_MODEL = "google/gemma-3-12b-it"   # listed on integrate.api.nvidia.com/v1/models, Nov 2026
NVIDIA_GAP = 1.6   # seconds between NVIDIA calls: keeps a run under the free tier's 40 requests a minute
_off, _strikes, _last = set(), {}, {}


def llm_providers():
    """Providers to try, in order: NVIDIA (NVIDIA_API_KEY) first, then Anthropic, then OpenAI. Keys are read from the
    environment only and never printed, logged or written anywhere. A provider switched off this run is left out."""
    order = [("nvidia", "NVIDIA_API_KEY"), ("anthropic", "ANTHROPIC_API_KEY"), ("openai", "OPENAI_API_KEY")]
    return [p for p, k in order if os.environ.get(k) and p not in _off]


def _model(p):
    rm = os.environ.get("RESYNC_LLM_MODEL") or ""
    if p == "nvidia":
        # NVIDIA ids look like org/model; a RESYNC_LLM_MODEL meant for another provider (no slash) is not used here.
        return os.environ.get("NVIDIA_MODEL") or (rm if "/" in rm else "") or NVIDIA_DEFAULT_MODEL
    if p == "anthropic":
        return (rm if rm.startswith("claude") else "") or "claude-haiku-4-5"
    return (rm if rm and "/" not in rm and not rm.startswith("claude") else "") or "gpt-4o-mini"


def _call(p, text):
    if p == "nvidia":
        wait = NVIDIA_GAP - (time.time() - _last.get(p, 0))
        if wait > 0:
            time.sleep(wait)
        _last[p] = time.time()
        body = {"model": _model(p), "messages": [{"role": "user", "content": text}], "max_tokens": 300,
                "temperature": 0.2}
        req = urllib.request.Request(NVIDIA_URL, data=json.dumps(body).encode(),
                                     headers={"authorization": "Bearer " + os.environ["NVIDIA_API_KEY"],
                                              "content-type": "application/json", "accept": "application/json",
                                              "user-agent": UA})
        with urllib.request.urlopen(req, timeout=45) as r:
            return json.loads(r.read())["choices"][0]["message"].get("content") or ""
    if p == "anthropic":
        body = {"model": _model(p), "max_tokens": 200, "messages": [{"role": "user", "content": text}]}
        req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=json.dumps(body).encode(),
                                     headers={"x-api-key": os.environ["ANTHROPIC_API_KEY"],
                                              "anthropic-version": "2023-06-01", "content-type": "application/json"})
        with urllib.request.urlopen(req, timeout=60) as r:
            return json.loads(r.read())["content"][0]["text"]
    body = {"model": _model(p), "messages": [{"role": "user", "content": text}], "max_tokens": 200}
    req = urllib.request.Request("https://api.openai.com/v1/chat/completions", data=json.dumps(body).encode(),
                                 headers={"authorization": "Bearer " + os.environ["OPENAI_API_KEY"],
                                          "content-type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())["choices"][0]["message"]["content"]


def _parse(out):
    out = re.sub(r"<think>.*?</think>", "", out or "", flags=re.S)
    for m in reversed(list(re.finditer(r"\{[^{}]*\}", out, re.S))):
        try:
            lab = json.loads(m.group(0))
        except ValueError:
            continue
        if isinstance(lab, dict) and "in_scope" in lab:
            return lab
    return None


def llm_label(c):
    """One scope/kind label, or None. Tries each provider in order; a 401/403/404 switches that provider off for the
    run, a 429, a 5xx or a timeout counts a strike (3 strikes: off for the run) and the next provider is tried. Never
    raises, so the run never fails here. Error lines carry the provider and the status only."""
    text = PROMPT + json.dumps({k: c.get(k) for k in ("title", "date_display", "holder", "summary")}, ensure_ascii=False)
    for p in llm_providers():
        why = None
        try:
            lab = _parse(_call(p, text))
            _strikes[p] = 0
            if not lab:
                continue
            if not public_ok(lab.get("line"))[0]:
                lab["line"] = ""
            lab["by"] = p
            return lab
        except urllib.error.HTTPError as e:
            why = f"HTTP {e.code}"
            if e.code in (401, 403, 404):
                _off.add(p)
            else:
                _strikes[p] = _strikes.get(p, 0) + 1
        except Exception as e:   # timeout, connection reset, bad JSON
            why = type(e).__name__
            _strikes[p] = _strikes.get(p, 0) + 1
        if _strikes.get(p, 0) >= 3:
            _off.add(p)
        print(f"  label: {p} answered {why}" + ("; off for this run" if p in _off else "") + ", trying the next",
              file=sys.stderr)
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max-online", type=int, default=60)
    ap.add_argument("--max-label", type=int, default=40)
    ap.add_argument("--comment-out", default="", help="write a short markdown summary here when something is new")
    a = ap.parse_args()
    D = a.data
    state = load(os.path.join(D, "resync/state.json"), {"spill_next": 1, "runs": 0})
    seen = load(os.path.join(D, "resync/seen.json"), {})
    gap_urls = set(load(os.path.join(D, "resync/seen-online-gap-finder.json"), {}).get("urls", []))
    cat, ncat = catalogue_text()
    print(f"catalogue rows read: {ncat}; gap-finder urls: {len(gap_urls)}; seen keys: {len(seen)}")

    mail = from_mail(D, seen, cat)
    spills, pending = from_spills(state, seen)
    online = from_online(seen, cat, gap_urls, a.max_online) if ncat else []
    if not ncat:
        print("catalogue unreachable: online step skipped (would not be able to dedupe)")
    labelled = 0
    if llm_providers():
        print("LLM labelling, provider order: " + " > ".join(llm_providers()))
        for c in online[: a.max_label]:
            if not llm_providers():
                print("every LLM provider is off for this run: labelling stopped, run continues")
                break
            lab = llm_label(c)
            if lab:
                c["label"] = lab
                labelled += 1
            time.sleep(0.5)
    else:
        print("no LLM key set: labelling skipped")
    new = mail + spills + online
    for c in new:
        c["first_seen"] = TODAY
        if not c["key"].startswith("spill:"):
            seen[c["key"]] = {"listed": TODAY}
        elif c["key"] not in seen:
            seen[c["key"]] = {"listed": TODAY}

    day = {"schema": "cedwyn-proposal/0.1.0", "kind": "catalogue_candidates", "created": TODAY,
           "note": ("Add-only candidate list from the daily evidence resync (cedwyn#582). Nothing here is a catalogue "
                    "record; no record ID is minted. Each item asks the spill / catalogue process whether a record "
                    "should be added (catalogue-change PR). Existing records are never changed."),
           "counts": {"mail": len(mail), "spill": len(spills), "online": len(online), "labelled": labelled,
                      "spill_pending": len(pending), "catalogue_rows_checked": ncat},
           "spill_pending_ids": pending, "items": new}
    latest = load(os.path.join(D, "resync/candidates/latest.json"), {"items": []})
    cutoff = (dt.date.fromisoformat(TODAY) - dt.timedelta(days=30)).isoformat()
    keep = [i for i in latest.get("items", []) if i.get("first_seen", "") >= cutoff and not i["key"].startswith("spill:")]
    have = {i["key"] for i in keep}
    keep += [i for i in new if i["key"] not in have and not i["key"].startswith("spill:")]
    latest = dict(day, kind="catalogue_candidates_rolling_30d", items=keep, updated=TODAY)
    state.update(runs=int(state.get("runs", 0)) + 1, last_run=dt.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
                 last_counts=day["counts"])
    print(json.dumps(day["counts"]))
    for c in new[:15]:
        print(f"  [{c['source']}] {c['title'][:100]}")
    if a.dry_run:
        print("dry run: nothing written")
        return
    save(os.path.join(D, f"resync/candidates/{TODAY}.json"), day)
    save(os.path.join(D, "resync/candidates/latest.json"), latest)
    save(os.path.join(D, "resync/seen.json"), seen)
    save(os.path.join(D, "resync/state.json"), state)
    if a.comment_out and new:
        lines = [f"**Evidence resync {TODAY}:** {len(new)} new candidate(s) for review: mail {len(mail)}, "
                 f"spills {len(spills)}, online {len(online)}" + (f" ({labelled} labelled)" if labelled else "") + ".",
                 "", f"File: `resync/candidates/{TODAY}.json` on branch `evidence-resync` (rolling list: "
                 "`resync/candidates/latest.json`). Add-only: nothing here is a record yet; the spill / catalogue "
                 "process decides, through a `catalogue-change` PR.", ""]
        for c in new[:20]:
            lines.append(f"- [{c['source']}] {c['title'][:140]}" + (f" ({c['date_display']})" if c.get("date_display") else ""))
        if len(new) > 20:
            lines.append(f"- … and {len(new) - 20} more in the file")
        lines += ["", "— Sion's Tab agent (evidence-resync workflow)"]
        with open(a.comment_out, "w") as f:
            f.write("\n".join(lines) + "\n")
    with open(os.environ.get("GITHUB_OUTPUT", os.devnull), "a") as f:
        f.write(f"new={len(new)}\nmail={len(mail)}\nspill={len(spills)}\nonline={len(online)}\n")


TODAY = dt.datetime.utcnow().date().isoformat()
if __name__ == "__main__":
    main()
