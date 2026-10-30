# Cedwyn Academy (branch `academy`)

The Cedwyn Academy is its own webapp: **https://academy.bucklerfamily.estate/**. It is built and deployed from this branch,
separately from `main` (no push here starts the site build).

## What it is
Graded questionnaires on the Great House Farm (Tŷ Mawr), Llandough case, built from the evidence catalogue. Answer a
question, lock it in, then reveal the answer, a short explanation, a verbatim quote and the catalogue source. 90% passes a
grade and opens the next one.

## Versions (semantic, on the questionnaires)
| Version | Access | Contents |
|---|---|---|
| v0.0.2 | members (£49.99 a month, or a family code) | the full set: 7 grades, 85 questions |
| v0.0.1 | free, no sign-in | the free set: Grade 1, 12 questions |

The newest version is first in the "Select a version" list. Older sets, once retired, are listed as -v0.0.2, -v0.0.3 and so
on; there is no -v0.0.1. A pass of a grade carries across versions when the questions are identical.

## Paywall
A version marked `members` sends no question to a browser without a membership: the API answers `locked` with the title only.
Membership is the estate-wide signed cookie `cedwyn_m` (paid checkout or family code), checked through a service binding to the
`cedwyn-api` Worker, so no secret is shared with this app. Subscribing uses the existing Stripe payment link; Stripe returns to
cedwyn.bucklerfamily.estate/learn/welcome, which opens the Academy. /learn/ and /learn/grades/ forward here (301).

## Architecture
- Worker `cedwyn-academy` (worker/index.js), custom domain academy.bucklerfamily.estate.
- Its own derived database tables (`academy_versions`, `academy_quiz`, `academy_sources`, `academy_progress`, `academy_meta`),
  derived from the master evidence catalogue (core_items) by tools/build_db.py. The account is at its database limit, so the
  tables sit in the shared apps database beside, never inside, the master catalogue; moving them to a database of their own is
  one binding change.
- The question bank itself is private and is never committed here.
- The machine-facing agent library stays at cedwyn.bucklerfamily.estate/academy/ (branch `agents`), unchanged.

## Rules every question keeps
Every question cites catalogue IDs; banned public words are checked; case points are labelled "Our case, prospective, not a
finding"; no statement of what any private party holds; neutral third person.

## Deploy
`tools/build_db.py --check`, then `tools/build_db.py` (loads the tables), then `deploy.py "<message>"`.
