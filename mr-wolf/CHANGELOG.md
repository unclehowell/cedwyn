# Changelog — Mr Wolf (webapp 40 of 59)

## [3.0.2] - 2026-11-16
### Changed
- Removed the decorative “What's the time, Mr Wolf?” tagline from the page header. The title, parcel navigation, scoring explanation and evidence dashboard remain.

## [3.0.1] - 2026-11-15
### Changed
- Re-labelled the 100/200 line throughout the interface as an internal research triage marker, not a legal threshold or finding. Gauge accessibility text and lead status copy use the same qualification.
- Clarified that the 40/50-per-limb counsel-preparation marker is an internal file checklist, not a legal test or admissibility determination.
- Clarified that Dishonesty and Concealment route tags are research categories, not findings; Public bodies is a distinct institutional enquiry route and is not, by itself, a ground to set aside the 1987 judgment.
- Corrected the public canonical URL and page metadata to `https://bucklerfamily.estate/mr-wolf/`.
- Replaced obsolete contributor documentation describing the retired source branch, earlier schema and superseded scoring model. No lead facts, cited records or scores changed.

## [3.0.0] - 2026-11-15
### Changed
- Evidence only (owner brief 15 Nov 2026, issue #16). Every statement on the board cites a record in the evidence catalogue. Each lead is now a list of held records and a list of pending records; interpretation, "our case" text and the framework order are removed.
- Scoring counts held records alone. Inference scores 0. Limbs 2 to 4 are scored only where a held record shows a discrepancy (limb 1). Nothing pending counts.
- Result: one lead scores. MW-01, the 1939 agreement signature (EV-0023) against the inscription (EV-0902): 60 of 200. Every other lead is 0 until a record is obtained.
- MW-11: her reply to the 1974 letters is shown as pending with no catalogue record; it no longer carries any score.
### Removed
- MW-19 and MW-21 (no held record), MW-16 (framework reading), MW-18 (no catalogue record), MW-14 and MW-15 (no discrepancy and nothing pending).
### Added
- Chips for held records cited and records pending, with the pending items that have no catalogue record at all.
- The law panel: Takhar, RBS v Highland, Lazarus Estates v Beasley, Limitation Act 1980 s.32(1).

## [2.3.0] - 2026-11-14
### Changed
- Diligence pass (issue #14): every lead re-audited against the 1987 judgment text, Takhar [2019] UKSC 13 and RBS v Highland [2013] EWCA Civ 328 [106]. Default order is now **Strongest**: reach to the one finding the 1987 result rests on (limb 2), then what is new (limb 3), then evidence held. The owner's order stays as **Our framework**.
- Each route (Dishonesty, Concealment, Public bodies) is ranked on its own and shows its legal test. Public-body leads are labelled by the remedy they point to (rectification, Ombudsman, Information Commissioner) rather than inflating the reopening scale.
- Each lead shows what evidence is held, its route to a remedy, and the next record with who holds it.
- Rescored: MW-05 70→80, MW-03 60→70, MW-10 30→60 (Cadw gives no destruction date for CL72/381; after 1987), MW-01 40 (cause 0: 1939 plan shows Parcel B only, A-032), MW-16 50→40, MW-17 limb 3 lowered (the judgment mentions television support), MW-04 10→20 (labelled a hypothesis), MW-15 10→20.
- Fixes: 1982 woodland registration was a BP-to-BP conveyance of 19 Nov 1982 with no council party (HM Land Registry, 23 Mar 2026); MW-11 labels her reply as the family's account and links the 19 Sep 1974 step; 100 relabelled as our triage line, not a legal test.
### Added
- MW-19 what BP told the court about her stance after the letters; MW-20 Companies House and The National Archives disagree on the Western Ground Rents files; MW-21 the 1974 county court files.

## [2.2.0] - 2026-11-14
### Added
- Leaderboard order toggle: **Our case** (default; the family's framework order, `priority` field) and **Threshold score**. Gauges always use the score (issue #12).
- New leads: MW-16 the 12-year paper playbook at HM Land Registry; MW-17 1974 TV footage of Mary (Nancy) Williams, never before the 1987 court; MW-18 the 1988 footage's release timing.
### Changed
- MW-01: family heirlooms hold John Williams's own signature; lead reframed as the signature comparison and the start of the 1939 → 1952 → 1955 → 1962 chain; rescored 20 → 40.
- MW-11: corrected to the judgment's own words (EG [1987] 2 EGLR 168 pp.170–171): letters sent to her solicitor and received the morning of 4 Nov 1974; execution stayed "pending Mrs Buckler's agreement"; warrant withdrawn "before she had given any instructions"; BP "neither sought nor waited for her acceptance". Family-archive points labelled; later authority (Smith v Molyneaux 2016, Brown v Ridley 2024) added.
- MW-04: reframed to include the 1962 order built on the 1955 order's ambiguity.

## [2.1.1] - 2026-11-14
### Changed
- MW-11: the 1974 squeeze added to the argument timeline (owner addition, issue #9). Letters dated 31 Oct 1974, the first day the warrant could be enforced; execution stayed 4 Nov; warrant withdrawn by 25 Nov, leaving her appeal and her July 1974 ownership plea undecided. Our case: no time and no forum to answer. Scores unchanged.

## [2.1.0] - 2026-11-14
### Changed
- Lead #1 (MW-11) rewritten around our argument (owner feedback, issue #9): every attempt to make her occupation permissive was refused or left unsigned (1949, 1954, 1955 ambiguity, 1959, 1965), she pleaded ownership in July 1974, and the family record is that she wrote back after the 1974 letters. Records widened to the whole chain. Scores unchanged.
- Limb 3 relabelled "New: not raised and decided in 1987" to match Takhar v Gracefield [2019] UKSC 13.
### Added
- `argument` field per lead (1987 court vs our case, then dated steps with record and state), shown as a timeline at the top of the lead modal.
- Each lead modal states why it ranks where it does: limb 2 (goes to the reason BP won) vs proof of deception held today.

## [2.0.1] - 2026-11-14
### Fixed
- Data files are read with literal fetch('leaderboard.json'), fetch('routes.json') and fetch('data/central.json') calls, so the estate build (dbserve FETCHLIT) keeps them as plain files. Root JSON files otherwise answer 404 live without the service worker.

## [2.0.0] - 2026-11-14
### Changed
- Rebuilt as a gauge dashboard (owner brief 14 Nov 2026, issue #7): threshold gauge (best lead vs 100), route gauges (Dishonesty, Concealment, Public bodies), limb gauges (best per Takhar limb, mark at 40 = counsel-ready), chips, then the leaderboard on the landing view.
- All longer text moved into modals (native dialog): each lead row, gauge, chip and the (i) rubric. No text removed.
- Record chips in lead modals show date and title from data/central.json.
### Added
- routes.json: route tags per lead (our classification); leaderboard.json is unchanged.
- mw.js builds every gauge, the table and the modals in the browser from leaderboard.json, routes.json and data/central.json; a score change needs only a JSON edit.

## [1.0.0] - 2026-11-01
### Added
- New webapp at /mr-wolf/ (branch section/mr-wolf): "Mr Wolf", subtitle "What's the time, Mr Wolf?".
- Leaderboard of 15 leads scored out of 200 on the four Takhar limbs (0–50 each); bar marked at the 100 threshold.
- Ten seeded leads merged with the twelve grounds already scored by our reopen research (no duplicates); three leads carry seed scores.
- Each row: rank, score, per-limb breakdown, what would raise it, status, and catalogue records (internal links).
- Published rubric and mapping (reopen research 0–5 per limb x10). Highest score at launch: 80. Nothing reaches 100.
- leaderboard.json for later score updates; "40 of 59" parcel link; en/cy/es interface strings.
