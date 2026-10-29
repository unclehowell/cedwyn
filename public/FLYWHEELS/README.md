# FLYWHEELS

Every self-running loop on the project. Each has a runner, state, a log, a fixed metric and a cadence; each schedule spawns at most one worker at a time (it checks the goal prefix first). New wheels copy the [schema](SCHEMA.md).

| Flywheel | Cadence | Purpose |
|---|---|---|
| [Great House Farm research cycle](research-cycle.md) | every 6 hours | Find evidence and artifacts not already in Cedwyn that bear on reopening BP Properties Ltd v Buckler (1987): concealment or government involvement. |
| [Reopen-the-case autoresearch loop](reopen-loop.md) | every 4 hours | Run small one-hypothesis experiments against a fixed metric (the three Takhar limbs) to rank grounds for reopening the 1987 judgment. |
| [Nightly drafts engine](drafts-engine.md) | daily 05:30 UK | Keep every due information-request draft and chaser written, in thread, ready for review. |
| [Contacts flywheel](contacts.md) | daily 03:30 UK | Find institutions and groups not yet contacted that may hold records, work out what each may hold, and open a hive draft for each. |
| [Hive check-in](hive.md) | every 5 minutes | Take this agent's turns on hive drafts: one material review or permitted route action per turn, then pass the turn on. |
| [Daily site flywheel](site-daily.md) | daily 12:00 UK | Measure every section and apply safe fixes, verified live at 390 px; log everything else as proposed. |
| [First-seen detector](first-seen.md) | every 6 hours | Detect any record about the farm that quietly appears online and register it with its first-seen date. |
| [Farm page recapture](recapture.md) | every 5 days | Capture outside pages about the farm's history before and after each cycle so changes are on record. |
| [Business development (plan + execute)](bizdev.md) | plan daily 09:00 UK; execute every 2 hours 10:00–22:00 | Grow e-book sales and community for Cedwyn: plan the next 24 hours as weighted HubSpot tasks, then execute them with care. |
| [Skills harvest](skills-harvest.md) | every 15 minutes | Add 2–4 new practitioner-sourced sales and marketing skills per run, each with sources and how it applies to Cedwyn. |
| [Sales fix](sales-fix.md) | every 3 hours | If no e-book has sold, find out why and apply the top-priority fix. |
| [Growth flywheels (on-page, quote pack, visibility, weekly report)](growth.md) | weekly (Mon 07:30 visibility, Tue 19:00 quote pack, Wed 13:30 on-page, Sun 18:00 report) | Make Cedwyn findable and shareable: markup audits, quote cards from the records, search and AI visibility checks, and a weekly measured report. |
| [Cedwyn film — daily scene](movie.md) | daily 06:00 UK | Make one two-minute scene a day from the chronology, in Welsh, English and Spanish, and open the next door on /documentary/. |
| [Morning brief](morning-brief.md) | daily 08:00 UK | Tell the project lead what finished overnight, mail that needs him, today's calendar and deadlines due soon. |
| [Intelligence flywheel](intelligence.md) | daily 04:15 Europe/London | Normalise events and actors, test patterns honestly, map who answered and who stayed silent, and publish missing-record (MR-) pages. |
| [Email ingest](email-ingest.md) | every 2 hours, 07:00-23:00 Europe/London | Turn inbound project correspondence into site updates: the dartboard lanes, missing-record and catalogue candidates for the research cycles, and dated notes on the matching case tasks. |
| [Programme office](programme-office.md) | weekly, Monday 06:00 Europe/London | Keep the objectives register (Wales tour, Argentina land and museum, chronology, e-books, the case) scored, mirrored into projects, and moving. |
| [Cedwyn Academy (this section)](agent-library.md) | every 6 hours (proposed) | Keep the academy current: read new memory notes, lessons, runners, skills and worker reports; distil the public-safe parts; regenerate the work board from real gaps; rebuild, scan, publish, log. |
| [Problems flywheel](problems-flywheel.md) | every 30 minutes | Take every blocker, question or problem an agent would otherwise raise with the project lead and loop on it until it is solved. |
| [Online gap finder](online-gap-finder.md) | every 6 hours | Find public information about the farm, its places, people and the case that is not yet on the site, and queue each find as a task for the right page. |
| [Correspondence flywheel](correspondence.md) | every 2 hours at :30, 07:30–23:30 Europe/London | Keep a hive draft task for every research or disclosure email that needs a reply, a chase, escalation, forwarding or first contact; housekeeping between emails. |
| [Repository and project-board sync](repo-sync.md) | every 6 hours | Keep the project board in step with the repository and the live site: what was done, and what still needs doing. |

Machine-readable: [flywheels.json](flywheels.json).
