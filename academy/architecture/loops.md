# Maintenance loops

29 self-running loops keep the site and its records maintained. Each runs on a schedule, spawns at most one worker at a time, has fixed inputs and outputs, and works inside guardrails. Full runner-level detail for most of them is in [FLYWHEELS](../FLYWHEELS/README.md).

## The autoresearch pattern

Shape: **hypothesis -> smallest change -> measure -> keep or discard**.

- a fixed program file, one editable surface, a fixed time budget and one fixed metric
- keep a change only if the metric improves; otherwise revert
- log every experiment, kept or discarded
- never change the metric to make a result look good

Loops built on it: [Reopen loop](#reopen-loop), [Problems flywheel](#problems-flywheel), [Sales fix](#sales-fix), [Webapp migration flywheel](#webapp-migration).

## The six-step migration flywheel (one webapp at a time)

1. **Claim and baseline.** Claim the webapp on the project board (no two agents on one app). Screenshot every page type at 390 px and 1280 px, light and dark; save the visible text and the list of record ids shown.
2. **Hypothesis.** One sentence: the [record type] on {page} can be expressed as view rule R plus template T with no visual change.
3. **Smallest change.** In order, only what the hypothesis needs: add missing records to data/core; write the view rule in data/views/{app}.view.json; write the page template as a component list (_ui/{page}.a2ui.json) using catalog components only.
4. **Measure.** Render locally; run the schema validator, the privacy test, the parity harness and the metrics (hard-coded records, coverage, parity).
5. **Keep or discard.** Keep only if every gate passes and hard-coded records fell or coverage rose with parity in bounds; otherwise revert. Log one results row either way.
6. **Ship, verify, record.** Small commits, fast-forward only; let a running build finish; verify live with a cache-busted fetch at 390 px and desktop; record the metrics and commit on the task. Three discarded hypotheses in a row on one app go to the problems queue.

Details: [Data architecture](data.md).

## Loop cards

<a id="site-daily"></a>
### Daily site flywheel

**Cadence:** daily 12:00 UK  
**What it does:** Measures every farm site (status, phone-width render, score), then works each site's own program file in priority order: safe automatic fixes only, everything else logged as a proposal.  
**Inputs:** the site list and one program file per site; last run's scores and log  
**Outputs:** verified fixes, live at 390 px; proposals for anything not safe to automate; a scored log row per check  
**Areas it touches:** every Cedwyn section (check), branches it is allowed to fix; legacy hosts (redirects only)  
**Guardrails:** sites owned by another running worker are check-and-report only; fixes verified live at 390 px before they count; the legacy wiki is never edited beyond redirects; no force-push; commits carry the house sign-off; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Daily site flywheel](../FLYWHEELS/site-daily.md)

<a id="email-ingest"></a>
### Email ingest

**Cadence:** every 2 hours, 07:00–23:00 UK  
**What it does:** Reads new project mail (read-only), classifies it, reads attachments, and feeds the record: the disclosure manifest, the roadmap and dartboard, candidate catalogue entries and missing-record candidates, and the matching case task on the project board.  
**Inputs:** new project mail since the last run; attachments (locked ones recorded as locked, never opened by force)  
**Outputs:** manifest and roadmap updates; catalogue and missing-record candidates for the research cycles; a dated paragraph on the matching case task; a site build when none is queued  
**Areas it touches:** /dartboard/ (served at the apex); /research/ (via the research cycles); the project board  
**Guardrails:** mail is read, never sent or drafted; personal-data material is read but held privately; scope filter: Great House Farm / cedwyn mail only; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Email ingest](../FLYWHEELS/email-ingest.md)

<a id="correspondence"></a>
### Correspondence flywheel

**Cadence:** every 2 hours at :30, 07:30–23:30 UK  
**What it does:** Works out who needs a reply, a chaser, an escalation, a forward or a first contact, and writes one hive draft task per item on the project board; between items it does housekeeping on existing tasks.  
**Inputs:** archived mail (after email ingest); open draft tasks; the drafts engine queue  
**Outputs:** new hive draft tasks; triage notes on unsent tasks when a new fact exists; housekeeping (duplicates, stale fields)  
**Areas it touches:** the project board; /hive/ (drafts enter the review queue)  
**Guardrails:** drafts only: never sent, never marked sent by an agent; research and disclosure mail only, never marketing; status values only not-started or completed; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Correspondence flywheel](../FLYWHEELS/correspondence.md)

<a id="hive"></a>
### Hive drafts and review gates

**Cadence:** every 5 minutes per seat  
**What it does:** The multi-agent review room at /hive/ (the old hive host forwards there). Each seat takes its turns on draft letters: one material review per turn, a semantic version bump and a signed changelog line, then passes the turn on. A draft becomes ready only at the exact-version gate: ten reviews from at least four different seats on the same frozen version.  
**Inputs:** the live roster; draft tasks whose turn is this seat's; each draft's changelog and baton  
**Outputs:** versioned reviews with signed changelog entries; board metadata (/hive/ board); a mail draft for human review only after every gate passes  
**Areas it touches:** /hive/; the project board  
**Guardrails:** never delete another agent's lines; re-check the last-modified time before writing; turns idle past the skip window allow only the permitted route action; a person reviews and sends; agents never send; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Hive check-in](../FLYWHEELS/hive.md)

<a id="board-sync"></a>
### Hive board sync

**Cadence:** every 4 hours  
**What it does:** Rebuilds the hive board (review counts, seats, percentage to ready, synced time) from the project board, read-only, and commits it only if something changed.  
**Inputs:** task subjects, last-modified times and changelog counts (no bodies)  
**Outputs:** the hive board JSON with a synced_at stamp  
**Areas it touches:** /hive/ (hive board on the hive branch)  
**Guardrails:** read-only on the project board; never drops another agent's row; JSON validated before commit; commits only when changed; one worker at a time (duplicate check by goal prefix).

<a id="repo-sync"></a>
### Repository and project-board sync

**Cadence:** every 6 hours  
**What it does:** Studies new commits, pull requests and issues and the live work board, notes them on matching tasks, closes tasks only when verified live, and opens tasks for outstanding work.  
**Inputs:** repository activity since the last run; /academy/work.json, /hive/, dartboard and roadmap; the problems queue  
**Outputs:** dated notes with commit references; tasks completed when verified live; new repository tasks (capped per run)  
**Areas it touches:** the project board (the site is read-only here)  
**Guardrails:** repository read-only; duplicate check before any new task; hive turn, sales and personal tasks are never touched; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Repository and project-board sync](../FLYWHEELS/repo-sync.md)

<a id="online-gap-finder"></a>
### Online gap finder

**Cadence:** every 6 hours  
**What it does:** Searches public archives, catalogues, newspapers, registers and books for material about the farm that is not yet on Cedwyn, and turns each genuine gap into a task naming the area it belongs in.  
**Inputs:** public archives and catalogues; the live site (sitemap, research, evidence catalogue); its own seen ledger  
**Outputs:** 3–8 gap tasks per run, each with source, summary and target page  
**Areas it touches:** the project board; agents then add the material to /research/, /wiki/, /wales/ and other areas  
**Guardrails:** never edits the site itself; duplicate and seen checks first; nothing about family holdings or addresses; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Online gap finder](../FLYWHEELS/online-gap-finder.md)

<a id="first-seen"></a>
### First-seen detector

**Cadence:** every 6 hours  
**What it does:** Compares a baseline of known farm records online against the latest crawl; a record that quietly appears is verified against its live page and dated captures and published on the first-seen register.  
**Inputs:** the baseline of known records; dated captures  
**Outputs:** verified first-seen entries with the dated evidence of absence  
**Areas it touches:** /fcg/ first-seen register  
**Guardrails:** an entry is published only after verification; neutral dated wording: quiet release or announced disclosure, no verdict; one worker at a time (duplicate check by goal prefix).
  Runner detail: [First-seen detector](../FLYWHEELS/first-seen.md)

<a id="recapture"></a>
### Farm page recapture (Watchtower)

**Cadence:** every 5 days  
**What it does:** Recaptures outside pages about the farm's history and heritage and records before and after copies, so any change made by an outside site is caught.  
**Inputs:** the list of watched outside pages; the previous captures  
**Outputs:** captured / unchanged / changed / unreachable counts; the watchtower data file  
**Areas it touches:** /watchtower/  
**Guardrails:** no alerts for layout changes; only substantive history content counts; robots rules honoured; blocked hosts noted, not forced; skipped when the disk is low; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Farm page recapture](../FLYWHEELS/recapture.md)

<a id="intelligence"></a>
### Intel flywheel

**Cadence:** daily 04:15 UK  
**What it does:** Reviews everything known, plots it many ways (periodicity, sequences, who answered and who stayed silent), and publishes blank evidence pages with catalogue ids for records that should exist by statute, practice or cross-reference but are not held.  
**Inputs:** the events and missing-record registers; new mail (read-only); the latest research and reopen-loop reports  
**Outputs:** new missing-record ids and pages; charts and findings re-ranked with what cuts against them; a cycle report  
**Areas it touches:** /research/ (section/research: missing records, events, findings)  
**Guardrails:** commits only to section/research; interpretation is labelled as interpretation; what cuts against a finding is shown beside it; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Intelligence flywheel](../FLYWHEELS/intelligence.md)

<a id="reopen-loop"></a>
### Reopen loop

**Cadence:** every 4 hours  
**What it does:** Small one-hypothesis experiments against a fixed metric (the three limbs of the legal test for reopening a judgment) to rank grounds for reopening the 1987 judgment.  
**Inputs:** the grounds register; the results log; the newest research cycle  
**Outputs:** 3–6 experiments kept or discarded; score changes; the programme highlight report section on prospective triggers (only when the top three change)  
**Areas it touches:** /projects/ (highlight report); research findings  
**Guardrails:** the metric is fixed; never changed to make a result look better; labelled as prospective, never a finding of any court; read-only research; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Reopen-the-case autoresearch loop](../FLYWHEELS/reopen-loop.md)

<a id="research-cycle"></a>
### Great House Farm research cycle

**Cadence:** every 6 hours  
**What it does:** Starts with a change-check of the live sections, then follows the most promising untried route to evidence and artefacts not yet in Cedwyn.  
**Inputs:** the last cycle report and next-cycle brief; the rubric; reopen-loop results  
**Outputs:** a cycle report with sources; new findings in the findings log; the next-cycle brief  
**Areas it touches:** feeds /research/ through the intel flywheel and email ingest  
**Guardrails:** read-only: never edits the family sites, orders documents or files requests; strict alert bar; the primary source is re-read before any alert; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Great House Farm research cycle](../FLYWHEELS/research-cycle.md)

<a id="problems-flywheel"></a>
### Problems flywheel

**Cadence:** every 30 minutes  
**What it does:** Every blocker or problem goes into one queue instead of to a person. Each open problem gets autoresearch cycles (hypothesis, smallest real test, result logged, keep or discard) until solved; only after six hours of looping with no route left is it marked unsolvable.  
**Inputs:** the problems queue (up to three open problems per run, oldest first)  
**Outputs:** hypothesis / action / result lines per problem; fixes applied within the rules; solved or unsolvable status with evidence  
**Areas it touches:** any area, within that area's owner and commit rules  
**Guardrails:** decisions are made from standing rules and evidence, with the reasoning recorded; never cancels or dispatches a site build while others run; no commits to a branch another worker owns that day; a proposed patch instead; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Problems flywheel](../FLYWHEELS/problems-flywheel.md)

<a id="skills-harvest"></a>
### Skills harvest

**Cadence:** every 15 minutes  
**What it does:** Finds new practitioner playbooks for online sales and marketing (deliverability, testing, search and AI visibility, social growth, launches) and writes each as a short how-to with sources and how it applies to Cedwyn.  
**Inputs:** the skills index; primary practitioner sources  
**Outputs:** 2–4 new skill files per run; index lines  
**Areas it touches:** /academy/SKILLS/marketing/ (sanitised at build time)  
**Guardrails:** free tools only, small installs only, none when disk is low; sources named as plain text; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Skills harvest](../FLYWHEELS/skills-harvest.md)

<a id="sales-fix"></a>
### Sales fix

**Cadence:** every 3 hours  
**What it does:** Checks e-book sales; with none, diagnoses why along the funnel (traffic, reach, sign-ups, the buy path walked at phone width) and does the one highest-leverage fix it can make that day, verified live.  
**Inputs:** sales records; traffic and channel numbers; the buy path; its own log of past fixes  
**Outputs:** one verified fix per run; a log row with numbers and how the fix is measured next run  
**Areas it touches:** /ebooks/, /shop/, link targets, channel bios and video descriptions  
**Guardrails:** prices are never changed by an agent; no paid ads, bought followers or messages to strangers; a fix that already failed is not repeated; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Sales fix](../FLYWHEELS/sales-fix.md)

<a id="bizdev"></a>
### Business development

**Cadence:** plan daily 09:00 UK; execute every 2 hours 10:00–22:00  
**What it does:** Writes the next 24 hours' weighted plan on the project board before any work, then executes the tasks in weight order with care, recording outcomes and lessons in the growth project.  
**Inputs:** the weighted objectives list; yesterday's tasks and results  
**Outputs:** dated plan and tasks; completed tasks with outcomes; growth project updates  
**Areas it touches:** the project board; /projects/ (growth project); public channels  
**Guardrails:** plan before work; zero spend; no bought reach; price changes, new channels and press are proposals; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Business development (plan + execute)](../FLYWHEELS/bizdev.md)

<a id="auto-social"></a>
### Daily auto-social

**Cadence:** daily 08:15 UK  
**What it does:** Wakes the blog's daily post and posts at most one new item per channel, only once the page and image are live, each linking back to Cedwyn.  
**Inputs:** the newest blog post and its image  
**Outputs:** at most one post per channel per day, never a duplicate  
**Areas it touches:** /blog/; the project's social channels  
**Guardrails:** at least four hours between posts per channel; a post held by the safety scan is not forced; no posting to communities, no direct messages; one worker at a time (duplicate check by goal prefix).

<a id="youtube-shorts"></a>
### Short videos to YouTube Shorts

**Cadence:** with each new short story clip; uploads within the daily quota, queued past it  
**What it does:** Every short story clip made for the series goes to YouTube Shorts as well as the photo channel: one important moment of the story per clip, a search-friendly title, a thumbnail from the gallery images, and a description that opens with the site link and names its sources (news footage, e-book, photographs, catalogued evidence).  
**Inputs:** rendered clips; the series plan of next story beats in date order  
**Outputs:** Shorts with titles, thumbnails and descriptions; a queue for anything past the daily quota  
**Areas it touches:** /ebooks/ and /documentary/ (link targets); the video channel  
**Guardrails:** never a duplicate upload; no version hashtags; strict chronology; each clip tied to a catalogued evidence page or e-book chapter; one worker at a time (duplicate check by goal prefix).

<a id="documentary"></a>
### Documentary scenes

**Cadence:** every 6 hours  
**What it does:** Takes the next item in the re-render queue or the next unfilled frame of the chronology and produces one short scene: one dated moment, who was there, what was most likely said, with Welsh spoken where the period calls for it and subtitles.  
**Inputs:** the script and scene list; the re-render queue; the render budget  
**Outputs:** one scene with subtitles; the next door opened on the documentary page; the script kept ten frames ahead  
**Areas it touches:** /documentary/ (also /movie/)  
**Guardrails:** strict date order; no narrator and no fourth wall from scene 3; reconstruction only; no likeness of real family members; spend only within the render budget; waits are logged as problems; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Cedwyn film — daily scene](../FLYWHEELS/movie.md)

<a id="agent-library"></a>
### Agent library cycle (Cedwyn Academy)

**Cadence:** every 6 hours at 00:40, 06:40, 12:40, 18:40 UK  
**What it does:** Reads what agents learned since the last cycle, distils only durable public-safe facts into the academy, regenerates the work board from real gaps, refreshes this architecture section, rebuilds, scans (0 hits required), publishes to the agents branch and checks it live.  
**Inputs:** memory notes, lessons, runners, skills and worker reports; the architecture plan, the flywheel list and the webapp registry  
**Outputs:** academy pages, agents.json, work.json, llms.txt; this section and architecture.json; a changelog line  
**Areas it touches:** /academy/; /llms.txt and /agents.json (discovery)  
**Guardrails:** machine-facing only: nothing on human pages; publishes only to the agents branch, never main; scanner must report zero hits; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Cedwyn Academy (this section)](../FLYWHEELS/agent-library.md)

<a id="programme-office"></a>
### Programme office review

**Cadence:** weekly, Monday 06:00 UK  
**What it does:** Refreshes the inputs for each major objective, advances the cheapest next action that needs no sign-off, scores and rates each objective, and republishes the programme pages.  
**Inputs:** objectives and their measures; worker reports since the last review; deadlines and registers  
**Outputs:** one review page per week; objective scores and status; proposals queued for sign-off  
**Areas it touches:** /projects/ (programme office); the e-book pipeline  
**Guardrails:** commits only to the projects branch; prices, publishing, new channels, press and spend are proposals; companies only for outreach drafts; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Programme office](../FLYWHEELS/programme-office.md)

<a id="growth-report"></a>
### Growth report

**Cadence:** weekly, Sunday 18:00 UK  
**What it does:** Measures the week: visitors, followers per channel, sign-ups and sales, search coverage; answers public questions; picks next week's one priority.  
**Inputs:** traffic analytics; channel counts; sign-up and sales records  
**Outputs:** a weekly row of numbers; three lines on traffic, sign-ups and sales, and next week's priority  
**Areas it touches:** measurement only; public replies on the project's own posts  
**Guardrails:** read-only on analytics; drafts only for email replies; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Growth flywheels (on-page, quote pack, visibility, weekly report)](../FLYWHEELS/growth.md)

<a id="visibility"></a>
### Visibility check

**Cadence:** weekly, Monday 07:30 UK  
**What it does:** Ranks the site for a fixed query set, asks a fixed set of questions of an AI assistant and counts mentions of the site, checks that AI crawlers reach it and notes three peer heritage sites.  
**Inputs:** the fixed query and question sets; search console coverage  
**Outputs:** scores and up to five tagged actions  
**Areas it touches:** measurement only; actions go to on-page or promotion queues  
**Guardrails:** read-only; the query set is fixed so weeks compare; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Growth flywheels (on-page, quote pack, visibility, weekly report)](../FLYWHEELS/growth.md)

<a id="onpage"></a>
### On-page flywheel

**Cadence:** weekly, Wednesday 13:30 UK  
**What it does:** Audits every section for page titles and descriptions, share cards, sitemap, robots and llms files, structured data, the buy path and the sign-up strip; fixes markup only.  
**Inputs:** every section's live pages  
**Outputs:** markup fixes, an audit score, proposals for body text or design  
**Areas it touches:** every section (markup only)  
**Guardrails:** body text and design changes are proposals; verified live at 390 px; commits only when no other worker is committing to that branch; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Growth flywheels (on-page, quote pack, visibility, weekly report)](../FLYWHEELS/growth.md)

<a id="quote-pack"></a>
### Quote pack

**Cadence:** weekly, Tuesday 19:00 UK  
**What it does:** Makes three quote cards from verbatim period-record lines with their source lines, plus a cover, posts them as one carousel and adds them to the quotes page linking each to its evidence page.  
**Inputs:** the evidence catalogue; the e-books  
**Outputs:** three cards and a cover; the quotes page  
**Areas it touches:** /shop/quotes/; the project's social channels  
**Guardrails:** verbatim quotes with their source lines only; no accusations about named people; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Growth flywheels (on-page, quote pack, visibility, weekly report)](../FLYWHEELS/growth.md)

<a id="member-sync"></a>
### Academy member sync

**Cadence:** every 10 minutes  
**What it does:** Keeps the membership list of the human learning area at /learn/ in step with the checkout records.  
**Inputs:** checkout records  
**Outputs:** the member list; one log line per run  
**Areas it touches:** /learn/  
**Guardrails:** read-only on the checkout side; stops once the site can read the checkout records itself; one worker at a time (duplicate check by goal prefix).

<a id="contacts"></a>
### Contacts flywheel

**Cadence:** daily 03:30 UK  
**What it does:** Finds institutions and groups not yet contacted that are likely to hold information, records or artefacts, works out what each may hold, and writes a draft for the hive.  
**Inputs:** who has been contacted (sent mail, the project board, the drafts engine); public sources  
**Outputs:** 3–6 new candidates with what each may hold; one hive draft task each  
**Areas it touches:** the project board; /hive/  
**Guardrails:** institutions only; never private individuals; drafts only; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Contacts flywheel](../FLYWHEELS/contacts.md)

<a id="drafts-engine"></a>
### Nightly drafts engine

**Cadence:** daily 05:30 UK  
**What it does:** Keeps every due information-request draft and chaser written, in the thread it belongs to, ready for review; a chaser only the day after a deadline lapses and only when no reply has arrived.  
**Inputs:** the request queue; new mail since the last run; the deadline strategy  
**Outputs:** draft tasks in the hive format; queue updates  
**Areas it touches:** the project board; /hive/  
**Guardrails:** never a chaser before a deadline; never sends; never duplicates an open draft; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Nightly drafts engine](../FLYWHEELS/drafts-engine.md)

<a id="webapp-migration"></a>
### Webapp migration flywheel

**Cadence:** one webapp at a time, per the programme plan  
**What it does:** Moves one webapp at a time to pages generated from its own view of the central catalogue, keeping the existing design. Six steps per webapp (below).  
**Inputs:** the central catalogue; the webapp's current pages and baseline screenshots; its selection rule  
**Outputs:** the webapp's view database; its page templates; parity screenshots at 390 px and desktop  
**Areas it touches:** one webapp per loop; main only for data/core, data/views, tools and workflow  
**Guardrails:** claim the webapp first; never work one another agent holds; discard any change that breaks a gate; strangler fig: static pages stay until parity is proven; one-line rollback; one worker at a time (duplicate check by goal prefix).
  Runner detail: [Data-driven webapp migration](../FLYWHEELS/webapp-migration.md)

## Also in the flywheel list

- [Morning brief](../FLYWHEELS/morning-brief.md): daily 08:00 UK; Tell the project lead what finished overnight, mail that needs him, today's calendar and deadlines due soon.

Every loop shares the house guardrails: zero spend, contacts nobody unless its brief asks for it, public text passes the editorial scanner, no force-push, commits carry the agent's signature, and a loop never commits to a branch another running worker owns (it leaves a proposed patch).
