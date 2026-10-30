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
- Worker `cedwyn-api` (source copy in this folder: `worker/index.js`).
  Deployed versions: 795b3c40-5328-4720-96e7-f4a9e0afd130, then 56576631-a919-41ca-a335-694fa5a00261 (polish). Rollback target: 80ba4170-97e9-4bdb-b1a9-a765453669e8.
  Routes reused: `/learn` and `/learn/*` (no new route). Pages: `/learn/grades/`, `/learn/grades/N/`. API: `GET /learn/api/state`,
  `GET /learn/api/grade/N`, `POST /learn/api/answer {grade,id,choice}`, `POST /learn/api/retake {grade}`.
- D1 `cedwyn-apps` (the academy's own derived tables, per the central-db / per-app-db rule):
  - `learn_quiz(grade, title, blurb, free, qs JSON, version, updated)` — loaded from the private question bank (grades.json, kept off the public repo so the paid grades' answers stay private) by
    `tools/academy_load.py` (checks every cited ID exists in core_items public rows or the /research/evidence/ index, a source on
    every question, the case label, and the banned-word list; `--check` validates without loading). Worker caches it 5 minutes.
  - `learn_progress(learner, grade, attempt, answers JSON, answered, correct, total, passed, best_pct, passed_at, principal, updated)`.
    `learner` = random id in the signed HttpOnly cookie `cedwyn_l` (Path=/learn/, 400 days; HMAC with MEMBER_KEY). One row per
    browser per grade. `principal` is only "preview" / "member" / "family" — no email, no Stripe id. Family members sharing one
    code still get separate progress (per browser).
  - D1 limits checked 30 Oct: database 7.7 MB (limit 500 MB free / 10 GB paid); one write per answer, far under 100k writes/day.
- Page journal: LEARN_JOURNAL row 1.2.0 (shown on every /learn page via /api/v).

## Editing questions
Edit the private `grades.json` (keep `a` = index of the right option in `o`; cite IDs in `s`; quote verbatim in `v` with `vr`),
then `TAB_TASK_ID=<task> timeout -k 5 300 python3 work/cedwyn-arch/tools/academy_load.py`. No redeploy needed (5-min cache).
Bump `version` and add a LEARN_JOURNAL row when the ladder changes materially.

## Verified live 30 Oct 2026 ~22:40Z (headless Chromium, cache-busted)
- 390 px, not a member: ladder → ⓘ modal (dark) → Grade 1: lock answer → Reveal (answer, explanation, quote, source links) →
  11/12 = 92% "Passed" → ladder shows Grade 1 passed, Grade 2 "opens with a membership"; /learn/grades/2/ shows the join card.
- 1280 px, family code: Grade 1 12/12 → Grade 2 unlocked; Grade 2 10/12 = 83% "Not passed yet", Grade 3 stays locked;
  retake → 11/12 → Grade 3 unlocked; Grade 7 asks for a pass of Grade 6.
- No sideways scroll, body rgb(18,18,18), modal dark, no page errors, journal v1.2.0. Test progress rows and the two test
  family redemptions were deleted afterwards (uses back to 0).
