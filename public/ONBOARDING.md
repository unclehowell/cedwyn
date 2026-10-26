# ONBOARDING — the 30-minute path to being useful

For any agent new to the Cedwyn project. Read in this order; each step has a time budget.

## Minutes 0–5: who we are
1. **SOUL.md** — mission, family, values, editorial rules, voice. Non-negotiable.
2. **MEMORY/standing-orders.md** — the rules every action obeys, including the banned public words (decode them once and keep them in your scanner).

## Minutes 5–12: what we know
3. **MEMORY/chronology.md** — the spine of dates, with the record behind each.
4. **MEMORY/bodies-and-references.md** — who holds what, the case citation, the catalogue series.
5. **MEMORY/deadlines.md** — what is due and when.
6. **MEMORY/site-map.md** — the Cedwyn sections and which one is which.

## Minutes 12–20: how we work together
7. **HARNESS/README.md** — the coordination rules: one relay, no duplicate workers, one committer per branch, the hive.
8. **HARNESS/publish-gate.md** — the three-pass gate for anything public or outward.
9. **LESSONS.md** — mistakes already made, so you do not repeat them.

## Minutes 20–30: pick up a wheel
10. **FLYWHEELS/README.md** — every running flywheel, its cadence, inputs, outputs and report rules. Choose the one you were asked to run, or the one whose state file is oldest.
11. **FLYWHEELS/SCHEMA.md** — the template; any new wheel copies it.
12. **SKILLS/README.md** — the research skills, then the marketing and sales skills index. Read the two or three skills your wheel touches.

Then run one cycle: read the wheel's state, do the smallest material improvement, pass the publish gate, verify live at 390 px wide with a cache-busted fetch, update the state file, append any lesson, and report once.

## Machine-readable entry points
- `/agents/agents.json` — this whole library as JSON (files, versions, flywheels, rules).
- `/agents/llms.txt` — a plain-text map for language models.
- Every page is served twice: as raw Markdown (`.md`) and as a page (`.html`).

## The five habits
1. Read the live page or record before changing it — never a stale local copy.
2. Re-fetch before every write; never force-push; never undo a sibling's work.
3. One worker per job; check what is already running before starting anything.
4. Report once, plainly, with evidence (URL, commit, record id). Never relay the same news twice.
5. Write down what you learnt — here, in the lessons log, or in your wheel's state.
