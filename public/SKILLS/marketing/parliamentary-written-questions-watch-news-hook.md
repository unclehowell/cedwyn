# Parliamentary written questions as a watch and a news hook (Westminster + Senedd)

Harvested 2026-10-30 02:15Z. Topic: press/PR monitoring + content hooks from official answers.

## Why it works (primary facts)
- Written questions are the cheapest official record of what a department states about a topic: a member asks, the department must answer in writing, and the answer is published with a date and a reference number (UIN). Journalists and campaigners use answers as dated, citable hooks ("in a written answer on 16 June, the department said...").
- UK Parliament publishes all of them through a free, keyless JSON API (tested live 2026-10-30): `questions-statements-api.parliament.uk Fields include dateTabled, dateAnswered, uin, house, heading, questionText, answerText (truncated in lists), answeringBodyName, isNamedDay, answerIsHolding.
  - Measured: "Cadw" since 2024 returns 5 questions, e.g. DCMS 8128 (tabled 9 Jun 2026, answered 16 Jun 2026: "Heritage policy is devolved..."). "Land Registry" returns a 20 Oct 2026 Commons question to MHCLG (UIN 36513, answered 28 Oct) on free Land Registry searches for councils.
  - Gotcha: a multi-word searchTerm matches loosely (any word: "Land Registry Wales" gave 15,991 hits), so filter on the exact phrase yourself. The public detail page (`questions-statements.parliament.uk) returned 403 to curl (bot screen); open it in a real browser.
- Senedd (Welsh Parliament) written questions: searchable by keyword at record.senedd.wales (type "Written Question"); daily order papers list each question tabled, e.g. `record.senedd.wales Per the order paper header, questions must be tabled at least five working days before answer and answers are published in the language they are given (snippet; not checked in full). TheyWorkForYou has a Senedd section (theyworkforyou.com, items dated 21 Oct 2026 in search) and free email alerts at theyworkforyou.com; whether alerts cover Senedd written questions is NOT CHECKED (site answered 503 at 02:12Z).
- Most devolved heritage matters (Cadw, listing, Welsh archives) are answered in the Senedd, not Westminster: the DCMS answer above states so in its first line. Land registration (HM Land Registry) is England-and-Wales and answered at Westminster.

## How to do it (30 minutes setup, 2 minutes a week)
1. Write a watch list of 6-10 exact phrases (bodies, places, legal terms). Prefer distinctive single words or exact phrases.
2. Run `python3 the project workspace --state pq_seen.json "term" ...` weekly (stdlib, no key; prints only new or newly answered questions with link). A question that gets answered later shows again.
3. For the Senedd: once a week search record.senedd.wales for the same terms (browser), or set a TheyWorkForYou alert if it covers Senedd.
4. Triage each hit into one of three uses:
   - **Fact for a page**: a dated official statement that belongs on a research/timeline page (cite the answer page, date, UIN, department).
   - **News hook**: an answer that touches the project's subject on the day it is published; a same-week blog post or social card that links the answer to the archive's own records reads as timely, not opportunistic.
   - **Gap**: a question nobody has asked yet. Written questions are tabled only by members; the public route is a letter to one's own representative. That is an outward action and needs the owner's decision.
5. Log hits in a sheet: date, house, UIN, body, heading, use, page updated.

## Signals and limits
- Holding answers ("I will write to the honourable member") are flagged answerIsHolding; wait for the substantive answer.
- An answer is a department's position, not a finding; quote it exactly, in quotation marks, with date and UIN.
- No volume or click benchmark for "answer-hook" posts was found from a primary source; measure our own (UTM utm_source=pq-hook).

## How we apply it to Cedwyn
- Watch list (start): Cadw, "Land Registry", "adverse possession", Llandough, "Vale of Glamorgan", "National Library of Wales", "Welsh Patagonia", "listed buildings". Run pq_watch.py inside the weekly VISIBILITY CHECK or GROWTH REPORT run; state file at the project workspace
- Each relevant answer becomes: (a) a dated line on the research timeline or the relevant /wales/ page, linking the answer as a catalogued source (public text neutral, never addressing the owner, banned words apply); (b) at most one blog/social card in the same week via the existing auto-social flow, pointing to /ebooks/ or the matching e-book.
- Gaps go to HubSpot as a "[CEDWYN GAP] Possible written question: <topic>" task with the drafted question text for the project lead to decide whether to send to his MS or MP himself. Tab never writes to members, never files anything, press only on the project lead's GO.
- Success test: 1 page fact or hook per month; if 3 months give zero relevant hits, cut the watch to a quarterly run.

## Sources
- UK Parliament Written Questions API (live query 2026-10-30): questions-statements-api.parliament.uk
- Example answers: questions-statements.parliament.uk ; questions-statements.parliament.uk
- Senedd Record search: record.assembly.wales ; order paper example: record.senedd.wales
- TheyWorkForYou Senedd + alerts: theyworkforyou.com ; theyworkforyou.com
- Tool: tools/pq_watch.py (stdlib, --selftest passes; live run 2026-10-30 returned real 2024-2026 answers)