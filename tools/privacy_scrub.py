#!/usr/bin/env python3
"""privacy_scrub.py — removes working-process attributions from every public file before the catalogue database is built.
Public pages carry sources only: no statement of who found, read or catalogued a record, no attribution to an assistant
or agent, no personal name of the family's representative in correspondence, no quotation of private instructions and no research-cycle numbers. Fixes in place, then fails (exit 1) if any
pattern in CHECK survives, so a page that leaks cannot be published.
Usage: python3 tools/privacy_scrub.py dist [--check-only]"""
import pathlib, re, sys, json
A = r"(?:['\u2019]|&#8217;|&rsquo;|&#x2019;|&#039;|&#39;|&#x27;|\\u2019|'')"     # apostrophe forms (html, json, sql)
QO = r"(?:\u201c|&#8220;|&ldquo;|\\u201c|\")"; QC = r"(?:\u201d|&#8221;|&rdquo;|\\u201d|\")"
SION = r"(?<![A-Za-z])Sion(?: Buckler)?"
EXT = ('.html', '.htm', '.json', '.jsonl', '.txt', '.xml', '.md', '.csv', '.js', '.webmanifest', '.svg', '.rss', '.atom')
R = [
  # quoted private instructions with their date, e.g. (“Just be sure …”, 19 Oct 2026) after a request or instruction
  (rf"\s*(?:at|on)\s+(?:{SION}|the owner|the Owner){A}s\s+(?:request|instruction)s?\s*\({QO}[^)]{{0,400}}?{QC}[^)]{{0,40}}\)", ""),
  (rf"\s*(?:at|on)\s+(?:{SION}|the owner|the Owner){A}s\s+(?:request|instruction)s?\b", ""),
  (rf"\s*\((?:the owner|Owner|{SION}),\s*\d{{1,2}} \w{{3}} \d{{4}}[^)]{{0,30}}\)", ""),
  (rf"\s*\({QO}[^)]{{0,400}}?{QC}[^)]{{0,10}}\)(?=\.\s*Lead from another AI)", ""),
  (r"\s*Lead from another AI; verified by Tab against the source\.", " Checked against the source."),
  (rf"\b(?:GPT-\d+|Tab|Claude|Grok) \(on Owner{A}s instruction\)", "Cedwyn editors"),
  (rf"\bOwner{A}s (?:instruction|request)(?:,\s*\d{{1,2}} \w{{3}} \d{{4}}(?: \d{{1,2}}:\d{{2}}(?: [A-Z]{{3}})?)?)?", "Editorial review"),
  (rf"{SION}{A}s (?:instruction|request)(?:,\s*\d{{1,2}} \w{{3}} \d{{4}}(?: \d{{1,2}}:\d{{2}}(?: [A-Z]{{3}})?)?)?", "Editorial review"),
  # catalogued / compiled by
  (rf"\bCatalogued by Tab for {SION}, ", "Catalogued "),
  (rf";?\s*catalogued by Tab(?: for {SION})?(?=[\s,.;<)\"]|$)", "", re.I),
  (rf"\b(Catalogued|Compiled|Prepared|Written|Edited|Maintained|Checked|Transcribed) by {SION}{A}s Tab agent\b", r"\1 by Cedwyn editors"),
  (rf"\bTab \(for (?:{SION}|the Executive)\)", "Cedwyn editors"),
  (rf"Sion(?: Buckler)?{A}s Tab agent", "Cedwyn editors"),
  (r"\bTab agent", "Cedwyn editors"),
  (rf"\s+by Tab{A}s(?=&hellip;|\u2026)", ""),
  # research attributions
  (rf"\s+by Tab{A}s research(?: cycle)?(?: \d+)?", ""),
  (rf"\bTab{A}s research(?: cycle)?(?: \d+)?", "research"),
  (rf"\b(?:captured )?from Tab{A}s machine", "captured locally"),
  (rf"\bTab{A}s machine", "a local machine"),
  (rf"\b[Tt]he owner{A}s instruction\b(?:\s*\(voice note,[^)]*\))?(?:,\s*\d{{1,2}} \w{{3}} \d{{4}}(?: \d{{1,2}}:\d{{2}}(?: [A-Z]{{3}})?)?)?", "Editorial review"),
  (r"\b(\w+ed|kept privately|held) by Tab\b(?![\w-])", r"\1"),
  (r"\b(found|read|verified|checked|catalogued|compiled|transcribed|added|captured|downloaded|logged|kept privately|noted|confirmed|located) by Tab\b(?!\w)", r"\1", re.I),
  (r"\s*\((?:finding F\d+)\)", ""), (r",\s*finding F\d+", ""), (r"\s*\(finding F\d+\)", ""),
  (r"\s*\((?:flywheel |research )?cycle \d+\)", "", re.I),
  (r"\(\s*(?:flywheel |research )?cycle \d+\s*[;,]\s*", "(", re.I),
  (r"[;,]\s*(?:flywheel |research )?cycle \d+(?=[)\s;,.<])", "", re.I),
  (r"\b(?:flywheel |research )cycle \d+\b", "research", re.I),
  (r"\bcycle (\d+) audit\b", "audit"),
  (r"\s+by Tab(?:, for the owner)?(?![\w\u2019'-])", ""),
  (r"\(\s*\)", ""),
]
R = [(re.compile(x[0], x[2] if len(x) > 2 else 0), x[1]) for x in R]
CHECK = re.compile(rf"Tab{A}s research|\bby Tab\b(?![\w-])|Sion{A}s Tab agent|Buckler{A}s request|\bTab agent|catalogued by Tab\b|(?<!site )\bowner{A}s instruction\b(?!s)|\b(?:flywheel|research) cycle \d+", re.I)
PRE = re.compile(r"Tab|[Cc]ycle|[Oo]wner|Sion")
EMPTY = R.pop()   # the "()" tidy-up: prose only. Applied to code it turns function(){ into function{ and breaks every script.
PROTECT = re.compile(r"<(script|style|code|pre|textarea)\b[^>]*>.*?</\1\s*>", re.S | re.I)
def _prose_only(t, rx, rep):
    out, n, last = [], 0, 0
    for m in PROTECT.finditer(t):
        seg, k = rx.subn(rep, t[last:m.start()]); out.append(seg); out.append(m.group(0)); n += k; last = m.end()
    seg, k = rx.subn(rep, t[last:]); out.append(seg); n += k
    return ''.join(out), n
def scrub(t, kind='text'):
    n = 0
    if not PRE.search(t): return t, 0
    for rx, rep in R:
        t, k = rx.subn(rep, t); n += k
    if kind == 'html':
        t, k = _prose_only(t, *EMPTY); n += k
    elif kind == 'text':
        t, k = EMPTY[0].subn(EMPTY[1], t); n += k
    return t, n
# Correspondence never names the family's representative (Cedwyn editors, 27 Oct 2026). The site's own mail pages
# (/email/..., /wayback/mail/<id>.txt, /wayback/email/, the What They Don't Say and WhatDoTheyKnow sections) are built from
# exported mail whose From lines, salutations and signatures carry a personal name. Here the sender becomes "Requester"
# (the label the What They Don't Say section uses), the signature title lines go, and any email handle or phone number of the
# family is redacted site-wide. Any path segment containing "correspondence" (research/wiki evidence pages, docs co_*correspondence)
# is correspondence too (27-28 Oct 2026: research/evidence/justice-courts-correspondence/ still signed with the name). Runs on every build, so a later mail import cannot bring the name back; CORR_CHECK then fails the
# build if the name survives in a correspondence file. The agent instruction meta in the shared footer is left as written.
CORR_PATH = re.compile(r"^(?:email|whattheydontsay|whatdotheyknow)/|^wayback/(?:mail|api|email)/|(?:^|/)[^/]*correspondence[^/]*/")
_S = r"(?:[\s\u2009]|\\u2009|&#8201;|&thinsp;)+"
_RETD = rf"Ret{A}d"
_FIRST = r"(?i:\bsi(?:[o\u00f4]|\\u00f4|&ocirc;|&#244;)n\b)"
NAME = re.compile(
    rf"(?:{_RETD}{_S}(?:Sergeant|Sgt)\.?{_S})?{_FIRST}(?:{_S}\(?Hywel\)?)?(?:{_S}(?i:buckler)\b)?(?:,?{_S}Esq\.?)?"
    rf"(?:[\s,]*\(?[\s]*(?:{_RETD}{_S}(?:Sergeant|Sergenant|Sgt)\.?|Sgt\.?[\s]*\({_RETD}\))[\s]*\)?)?")
KEEP = 'Sion Buckler (Williams heir'          # the shared footer's agent instruction, not correspondence
CORR_R = [(re.compile(x[0], x[2] if len(x) > 2 else 0), x[1]) for x in [
  (r"\b(Dear|Hello|Hi|Good (?:morning|afternoon|evening)|Morning|Afternoon)(,?\s+)Mr\.?\s+(?:S\.?\s+)?(?i:buckler)\b", r"\1\2Requester", re.I),
  (r"\bHywel ap Buckler\b", "Requester", re.I),
  (r"\b(Dear|Hello|Hi|Good (?:morning|afternoon|evening)|Morning|Afternoon|Shw ?mae|Helo|Annwyl)(,?\s+)Hywel\b", r"\1\2Requester", re.I),
  (rf"(Requester\**)\s*\(\s*Ret{A}d (?:Army )?(?:Sergeant|Sergenant|Sgt)\.?\s*\)", r"\1"),
  (r",\s*Hywel(?=[,.!?])", ""),
  (r"^((?:>[ \t]*)*)Hywel[ \t]*$", r"\1Requester", re.M),
  (rf"^((?:>[ \t]*)*)\(\s*Ret{A}d (?:Army )?(?:Sergeant|Sergenant|Sgt)\.?\s*\)[ \t]*$", r"\1", re.M),
  (r"[ \t]*Royal Signals Cyber\s*(?:/|and|&amp;|&)\s*Electronic Warfare Professional(?:\s*(?:and|&amp;|&)\s*Life Member)?", ""),
]]
CONTACT_R = [(re.compile(x[0], re.I), x[1]) for x in [
  (r"\bhywelapbuckler(?:@gmail\.com)?\b", "[email redacted]"),
  (r"(?:\+|\b00\s?)?\b44\s?\(?0?\)?\s?7845[\s.-]?933[\s.-]?262\b|\b07845[\s.-]?933[\s.-]?262\b", "[phone redacted]"),
]]
CORR_CHECK = re.compile(r"(?i:\bsi(?:[o\u00f4]|\\u00f4|&ocirc;|&#244;)n\b)(?! Buckler \(Williams heir)")
CONTACT_CHECK = re.compile(r"hywelapbuckler|7845[\s.-]?933[\s.-]?262", re.I)
def corr(t, rel):
    n = 0
    for rx, rep in CONTACT_R:
        t, k = rx.subn(rep, t); n += k
    if CORR_PATH.search(rel):
        t = t.replace(KEEP, '\ue000')
        t, k = NAME.subn('Requester', t); n += k
        for rx, rep in CORR_R:
            t, k = rx.subn(rep, t); n += k
        t = t.replace('\ue000', KEEP)
    return t, n
def main(root, check_only=False):
    root = pathlib.Path(root); changed = hits = 0; left = []
    for f in root.rglob('*'):
        if not f.is_file() or f.suffix.lower() not in EXT or f.stat().st_size > 40_000_000: continue
        if any(p in ('db', '.git', 'node_modules') for p in f.relative_to(root).parts[:1]): continue
        try: t = f.read_text('utf-8')
        except Exception: continue
        rel = f.relative_to(root).as_posix()
        if not check_only:
            sx = f.suffix.lower()
            new, n = scrub(t, 'code' if sx in ('.js', '.mjs', '.json', '.jsonl', '.webmanifest', '.svg') else 'html' if sx in ('.html', '.htm', '.xml', '.rss', '.atom') else 'text')
            new, k = corr(new, rel); n += k
            if n and new != t:
                if f.suffix.lower() == '.json':
                    try: json.loads(new)
                    except Exception: new = t; left.append(f'{f}: json would break, left for review')
                if new != t: f.write_text(new, 'utf-8'); changed += 1; hits += n; t = new
        for m in CHECK.finditer(t): left.append(f'{f.relative_to(root)}: {t[max(0,m.start()-60):m.end()+40]!r}')
        for m in CONTACT_CHECK.finditer(t): left.append(f'{rel}: contact detail {t[max(0,m.start()-40):m.end()+20]!r}')
        if CORR_PATH.search(rel):
            for m in CORR_CHECK.finditer(t): left.append(f'{rel}: name in correspondence {t[max(0,m.start()-60):m.end()+40]!r}')
    print(json.dumps({'files_changed': changed, 'rewrites': hits, 'remaining': len(left)}))
    for x in left[:200]: print('::error::privacy: ' + x)
    return 1 if left else 0
if __name__ == '__main__':
    sys.exit(main(sys.argv[1], '--check-only' in sys.argv))
