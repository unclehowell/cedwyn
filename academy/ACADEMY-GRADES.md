# Cedwyn Academy grades

Built 30 Oct 2026 (task 18baf467). Live: https://cedwyn.bucklerfamily.estate/learn/grades/ (ladder) and /learn/grades/1/ … /learn/grades/7/.

## What it is
Seven graded questionnaires in the paid Academy (/learn/, £49.99 a month). A member answers a question and locks the answer in;
only then can they tap "Reveal answer", which shows the correct answer, a short explanation, a verbatim quote and the catalogue
source links. On the last answer the grade is scored; 90% or more (ceil(0.9 × questions)) passes and unlocks the next grade.
Retakes are unlimited; a pass stays passed.

| Grade | Title | Questions | Pass mark |
|---|---|---|---|
| 1 | The farm and its names | 12 | 11 |
| 2 | People and places | 12 | 11 |
| 3 | Dates and the record | 12 | 11 |
| 4 | Reading primary sources | 12 | 11 |
| 5 | The 1987 judgment | 12 | 11 |
| 6 | Limitation law and the parcel timeline | 12 | 11 |
| 7 | The open questions | 13 | 12 |

Total 85 questions, citing 64 catalogue IDs.
Grade 7 is the open questions of the case: each is graded on choosing the record that would settle it, and its explanation is
labelled "Open question" and, where it is a case point, "Our case, prospective, not a finding."

## Gating
- Grade 1 is a free preview (anyone; progress kept per browser). Reason: the join card asks £49.99 up front with no trial;
  a free grade lets a visitor feel the format before paying, and the pass screen points to "Join to unlock Grade 2".
- Grades 2–7 need a membership (paid Stripe checkout cookie, or the family code — the existing signed `cedwyn_m` cookie via
  `memberOf()`) AND a pass of the grade below.
- Answers are never sent before a question is answered; locked grades send no questions.

## Where things live
- Worker `cedwyn-api` (source `work/cedwyn-arch/api-worker/index.js`; before: `index.before-grades-20261030.js`).
  Deployed versions: 795b3c40-5328-4720-96e7-f4a9e0afd130, then 56576631-a919-41ca-a335-694fa5a00261 (polish). Rollback target: 80ba4170-97e9-4bdb-b1a9-a765453669e8.
  Routes reused: `/learn` and `/learn/*` (no new route). Pages: `/learn/grades/`, `/learn/grades/N/`. API: `GET /learn/api/state`,
  `GET /learn/api/grade/N`, `POST /learn/api/answer {grade,id,choice}`, `POST /learn/api/retake {grade}`.
- D1 `cedwyn-apps` (the academy's own derived tables, per the central-db / per-app-db rule):
  - `learn_quiz(grade, title, blurb, free, qs JSON, version, updated)` — loaded from `work/cedwyn-arch/academy/grades.json` by
    `tools/academy_load.py` (checks every cited ID exists in core_items public rows or the /research/evidence/ index, a source on
    every question, the case label, and the banned-word list; `--check` validates without loading). Worker caches it 5 minutes.
  - `learn_progress(learner, grade, attempt, answers JSON, answered, correct, total, passed, best_pct, passed_at, principal, updated)`.
    `learner` = random id in the signed HttpOnly cookie `cedwyn_l` (Path=/learn/, 400 days; HMAC with MEMBER_KEY). One row per
    browser per grade. `principal` is only "preview" / "member" / "family" — no email, no Stripe id. Family members sharing one
    code still get separate progress (per browser).
  - D1 limits checked 30 Oct: database 7.7 MB (limit 500 MB free / 10 GB paid); one write per answer, far under 100k writes/day.
- Page journal: LEARN_JOURNAL row 1.2.0 (shown on every /learn page via /api/v).

## Editing questions
Edit `academy/grades.json` (keep `a` = index of the right option in `o`; cite IDs in `s`; quote verbatim in `v` with `vr`),
then `TAB_TASK_ID=<task> timeout -k 5 300 python3 work/cedwyn-arch/tools/academy_load.py`. No redeploy needed (5-min cache).
Bump `version` and add a LEARN_JOURNAL row when the ladder changes materially.

## Verified live 30 Oct 2026 ~22:40Z (headless Chromium, cache-busted)
- 390 px, not a member: ladder → ⓘ modal (dark) → Grade 1: lock answer → Reveal (answer, explanation, quote, source links) →
  11/12 = 92% "Passed" → ladder shows Grade 1 passed, Grade 2 "opens with a membership"; /learn/grades/2/ shows the join card.
- 1280 px, family code: Grade 1 12/12 → Grade 2 unlocked; Grade 2 10/12 = 83% "Not passed yet", Grade 3 stays locked;
  retake → 11/12 → Grade 3 unlocked; Grade 7 asks for a pass of Grade 6.
- No sideways scroll, body rgb(18,18,18), modal dark, no page errors, journal v1.2.0. Test progress rows and the two test
  family redemptions were deleted afterwards (uses back to 0).


## 30 Oct 2026 ~23:40Z — Academy becomes its own webapp (task c1fca92e; owner's request 23:16)
The owner: "Needs be called academy. Be its own webapp and branch. Make it paywall subscription. And again, semantic version (this time
on questionnaires not ebook). V0.0.1 i.e. free". HubSpot plan task 536696156409.

**Home: https://academy.bucklerfamily.estate/** (Worker `cedwyn-academy`, custom domain; source in work/cedwyn-academy/, repo branch
`academy`, orphan commit 6b041d2 — no workflow runs on that branch).

### URL decision and reasoning
Options weighed: (a) humans at cedwyn…/academy/ with the agent library moved to /agents/; (b) a subdomain.
Chose (b) academy.bucklerfamily.estate because:
- zero agent-link breakage: cedwyn…/academy/, /academy/work.json, /llms.txt, /agents.json, the agents branch, main's
  tools/academy_pointer.py and schedule 827ac7a2 all stay exactly as they are (verified 200 after the change). Option (a) would
  need main build changes (academy_pointer.py, the /agents/ -> /academy/ redirect inverted, llms.txt/agents.json/page-head
  pointers on every page) while main's build queue is busy, and every external agent link would take a redirect hop;
- "its own webapp" literally: its own Worker, hostname, deploy and branch, like hive./dartboard./watchtower./fcg.;
- membership still works: the member cookie `cedwyn_m` is now set Domain=bucklerfamily.estate (cedwyn-api), and
  cedwyn…/learn/carry re-issues any older host-only cookie estate-wide and hands the member to the academy. The academy checks
  membership through a service binding to cedwyn-api (no secret shared).
- Database: Cloudflare refused a new D1 (account at its 10-database limit, code 7406), so the academy's own derived tables
  (academy_versions, academy_quiz, academy_sources, academy_progress, academy_meta) sit in D1 cedwyn-apps beside the master
  catalogue (core_items); moving them is one binding change (work/cedwyn-academy/state.json db_note).

### Redirects (cedwyn-api version 6e3458d6-5819-45db-87ab-124157767952; rollback 56576631-a919-41ca-a335-694fa5a00261)
/learn and /learn/ -> academy / (301); /learn/grades/ -> academy / (301); /learn/grades/1/ -> /v0.0.1/grade/1/;
/learn/grades/N/ (N>=2) -> /v0.0.2/grade/N/; other /learn/* -> academy / (302); /learn/welcome stays (Stripe return) and its button
goes through /learn/carry to /v0.0.2/. /learn/api/* (old grades API) still answers; unused.

### Versions (questionnaires)
v0.0.2 = full set, members only (7 grades, 85 questions); v0.0.1 = free set (Grade 1, 12 questions, no sign-in). "Select a
version" dropdown + ⓘ modal on the home page and every ladder; version tag on every questionnaire. No older versions exist, so no
minus versions are shown (when one is retired it becomes -v0.0.2 — there is no -v0.0.1). A Grade 1 pass carries across versions
(identical question ids).

### Paywall
members-only versions never send questions: /api/grade answers {locked, why:"join", title, blurb, total}; /api/answer answers 403.
Subscribe = the same Stripe link (£49.99/month, two ticks), family code via the academy (proxied to cedwyn-api). No price change.

### Question bank change
Holdings wording rule (22:25): 16 "not held" phrasings and 6 source titles ("— not yet held") reworded to "not disclosed"
(grades.json backup: grades.json.bak-holdings-20261030). build_db.py now also refuses holdings wording.

### Verified live 23:36Z (headless Chromium, cache-busted)
390 px fresh browser: home dark rgb(18,18,18), no sideways scroll, dropdown "v0.0.2 — £49.99 a month (members)" / "v0.0.1 — free",
ⓘ modal; v0.0.1 Grade 1 played without login (11/12 = 92% passed); /v0.0.2/ all 7 locked + subscribe card; /v0.0.2/grade/2/ locked,
API response carried no questions or answer key. 1280 px family code: cookie cedwyn_m@.bucklerfamily.estate, v0.0.2 opened,
Grade 1 12/12 -> Grade 2 opened (12 questions); cedwyn…/api/member also member:true (estate-wide); /learn/grades/3/ landed on
academy /v0.0.2/grade/3/. No page errors. Test redemption and progress rows deleted (code uses back to 0).
Journals: academy pages v1.0.0; /learn/ journal 1.3.0.

### Editing / redeploy
Edit grades.json -> `TAB_TASK_ID=<task> timeout -k 5 600 python3 work/cedwyn-academy/tools/build_db.py` (5-min cache, no redeploy).
Code -> work/cedwyn-academy/worker/index.js -> `python3 work/cedwyn-academy/deploy.py "<msg>"`, then commit the same files to
branch `academy`. New version: add it to VERSIONS in build_db.py (newest highest sort).
Rollback: academy Worker version 20d187d2-848f-40ba-b5d7-41afc7794a9d is the first; to take it down DELETE the custom domain
7fa0860188272ac254ac16b716a9464689abb384 and redeploy cedwyn-api 56576631 (restores /learn/ pages).


## 2.0.0 — the shared webapp standard and access codes (31 Oct 2026, task 320a574b)
Live: https://academy.bucklerfamily.estate/ (Worker `cedwyn-academy` version 9701fa81-f179-4814-a957-ba7989008e08).
Rollback: deploy version 20d187d2-848f-40ba-b5d7-41afc7794a9d (1.0.0) with `deploy.py --promote 20d187d2-848f-40ba-b5d7-41afc7794a9d "rollback"`.
The questionnaires, answer-then-reveal, the 90% pass mark and the "Select a version" dropdown are unchanged.

### What now matches the other apps
- Header: the shared Cedwyn files themselves (`/_cedwyn/ghf/ghf-lang.js`, `ghf-boot.js?v=2.1.17` -> basecamp.js, ghf-theme.css,
  `cw-graph.js`), served same-origin: the Worker passes `/_cedwyn/*` through from cedwyn.bucklerfamily.estate (1 h cache). The ghf-v2
  bar puts the menu (burger) and the webapp title "Cedwyn Academy" on one row, with prev/next, the language switch and the place strip.
  Night by default (`data-ghf-native="dark"`, `data-ghf-theme-default="night"`); the language dictionary is the estate one.
- Header graph: `/_cedwyn/graph/*.json` on this host is answered by the Academy from its own db: one point per (grade, cited record),
  x = the record's date in the central catalogue, y = grade, colour = free (v0.0.1) or members only. 101 points.
- Page journal: the shared `#cedwyn-journal` footer on every page (row 2.0.0 · 2026-10-31).
- Near-A2UI front end: `worker/ui.js` holds the component catalog (`/_ui/catalog.json`) and one server-side renderer. Every page is an
  A2UI v0.9 surface (createSurface, updateComponents, updateDataModel) built from the Academy's own data and published beside the
  page at `/_ui/<path>.a2ui.json` (linked by `<link rel=alternate>`). Only catalog components render. The browser script
  (`/_ui/academy.js`, from `worker/client.txt`) wires ⓘ modals, the version picker, the join ticks, the family code and access code
  forms, and fills an unlocked questionnaire from `/api/grade`. Styles: `worker/style.txt` (documentary picker `.cm-vsel`, code box `.cd-gate`).

### Citations from the central catalogue
Questions cite catalogue IDs only. At request time the Worker joins `academy_sources` to the central `core_items` (public rows):
title = `core_items.title` (holdings wording rewritten to "not yet disclosed"; a title failing the word check falls back), link =
`https://cedwyn.bucklerfamily.estate` + `core_items.page`, date = `core_items.date_sort`. Where the catalogue row has no page or no
public row (11 page-less rows and 2 evidence-index IDs today) the derived `academy_sources` title and research link are used.
Cache 5 minutes, so a catalogue edit shows within 5 minutes with no rebuild. `academy_sources` itself is rebuilt by
`tools/build_db.py` from grades.json (run it after adding questions or new IDs).

### Access codes (ACD-XXXX-XXXX-XXXX)
- Format: ACD- plus 12 symbols from 23456789ABCDEFGHJKMNPQRSTUVWXYZ (31^12, about 7.9e17). An ACD code cannot open the documentary
  and a documentary CDW code typed here gets "That is a documentary code".
- Issued only for a PAID checkout of the Academy's £49.99/month link (plink_1UV6PpJRNz20guqBItjOb6Ey): Stripe status complete,
  payment_status paid, amount > 0, mode subscription, with a subscription. One code per checkout (`academy_codes.cs_hash` =
  SHA-256("cs|" + session id); no email or card data stored).
  1. Now: `tools/acd_code_sync.py`, run inside the 10-minute member sync (`work/cedwyn-arch/tools/member_sync.py` calls it).
     It also keeps each code's status equal to its subscription's (active/trialing open v0.0.2; past_due, canceled, unpaid do not).
  2. Ready: `POST /api/stripe/webhook` verifies Stripe's signature with the Worker secret STRIPE_WHSEC and issues on
     checkout.session.completed and updates status on customer.subscription.updated/deleted. Until that secret exists it answers 503.
     To switch on: create a Stripe webhook endpoint for that URL with those three events and set its signing secret as STRIPE_WHSEC on
     the Worker (deploy.py keeps every Worker secret on each upload).
  3. Manual issue: `TAB_TASK_ID=<task> timeout -k 5 300 python3 tools/acd_code_sync.py --issue-session cs_live_...` (checks the session
     in Stripe first and refuses anything that is not a complete, paid Academy checkout). `--revoke CODE`, `--list`.
- Where the member sees it: on the Academy pages in the browser they paid with ("Your access code"), and at
  `GET /api/code/claim?cs=<checkout session>` (202 pending until issued).
- Redeem: "Have an access code?" link -> box -> `POST /api/code`. The server ignores case, spaces and hyphens and accepts it with or
  without "ACD-". A valid, active code sets the HttpOnly cookie `academy_c` (400 days) and v0.0.2 opens; it is checked against D1 on
  every request, so a lapsed or revoked code stops working at once. 5 tries per 10 minutes per visitor (salted hash of the address,
  table `academy_tries`); the 6th is refused. The family code and the membership cookie (`cedwyn_m`, via cedwyn-api) work as before.
- Locked content never reaches a browser: locked versions render no questionnaire, and `/api/grade` answers `locked` with no questions.

### Verified live 00:20Z 31 Oct (headless Chromium, cache-busted, 390 px and 1280 px)
Header bar present with burger and "Cedwyn Academy" on one row; header graph opens with 101 points; dark everywhere, no white panels,
no sideways scroll, no page errors, no failed requests. v0.0.1 Grade 1 played logged out (12 questions, reveal with catalogue titles and
links, scored). Fresh browser: /v0.0.2/ locked, /api/grade gave no questions, /v0.0.2/grade/3/ locked. A temporary test code was
minted (`--test-code`) and passed: lowercase with no prefix unlocked v0.0.2 (12 questions served), the same code reused in a second
fresh browser unlocked it, a CDW code got the wrong-product message, a bad code got "not valid", the 6th try in 10 minutes got 429.
The test code was then deleted; its cookie no longer opens anything. /learn/ and /learn/grades/ on cedwyn still 301 here;
cedwyn /academy/, /academy/work.json, /llms.txt, /agents.json 200.
Note for box scripts: identical connected-app requests are answered from a cache, so acd_code_sync.py sends a nonce header on every call.
