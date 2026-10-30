# Search Console annotations + Google ranking-update calendar (read traffic changes against dated events)

Harvested 30 Oct 2026 ~12:00Z. Topic not in INDEX before this run ('search console annotation' 0, 'status dashboard' 0, 'incidents.json' 0, 'debug traffic' 0; the gen-AI guidance skill only mentions the Sep 2026 spam update in passing).

## What the sources say (all read in full this run)
- **Custom annotations in Search Console** (Google blog, Nov 2025; help page 16530728, read 30 Oct 2026):
  - Two kinds: *system* annotations (Google's data-processing notices) and *custom* ones you write.
  - Right-click the Performance chart on a date, type up to **120 characters**, Add. Up to **200 per property**; deleted automatically after **500 days**; no editing (delete and re-add).
  - Shown under any filter, but **not in comparison mode or 24-hour views**.
  - Shared with every owner/full user of the property; restricted users can only view. Google states: no personal data (names, phone numbers, addresses) in annotations.
  - The help page names no API for annotations, so treat them as UI-only.
- **Google Search Status Dashboard** (status.search.google.com, Ranking history read 30 Oct): the dated list of updates. 2026 so far: Feb Discover update (5 Feb, ~22 d), Mar spam (24 Mar, <1 d), Mar core (27 Mar, 12 d), May core (21 May, 12 d), Jun spam (24 Jun, 2 d), Aug spam (18 Aug, 3 d), Sep spam (24 Sep to 8 Oct, 14 d). **No core update since May 2026.** The same history is published as JSON at `/incidents.json` (about 11 KB, the last ~year).
  - Caution: search snippets that put a core update "5-19 October" are about **2023**, not 2026 (checked against the dashboard).
- **Core updates doc** (developers.google.com, read): confirm the rollout has finished on the dashboard; "wait at least a full week after a core update completes before analyzing", then compare that week "with a week before the core update started rolling out".
- **Debugging drops doc** (read): the main causes are algorithmic updates, technical issues (Crawl stats, Page indexing), security, spam/manual actions, seasonality, and reporting glitches (check the Data Anomalies page).
  - Small position moves (e.g. 2 to 4): avoid radical changes. A large site-wide drop (top 10 to ~29): self-assess the whole site.
  - Changes can take days or months to show, so re-check in a few weeks.
- **Numbers:** none from outside Google that are worth relying on. Vendor posts give core-update impact shares (e.g. "55% of sites" for Mar 2026, digitalapplied: **not checked**). This is a measurement-hygiene skill, not a growth lever.

## How to do it
1. Run `timeout -k 5 120 python3 tools/ranking_updates.py --since 2026-01-01`. It prints each Ranking update with the before/after compare windows Google recommends, a `[ready]` flag once the after-window has passed, and a ready-made annotation line of 120 characters or fewer.
2. Add **our own events** as custom annotations on the day they go live. Use one short neutral line each: an e-book edition release, a documentary door opening, an academy launch, a site migration or theme change, a sitemap resubmission, a big outbound post. Never put a person's name or address in one.
3. Add **Google's updates** as annotations too (copy the tool's line). The chart then shows both kinds of event, and nobody has to guess later.
4. When a drop or spike appears:
   - first check the dashboard dates and the system annotations;
   - next run Page indexing and Crawl stats;
   - then compare by page in the tool's windows (not in comparison mode, where annotations don't show);
   - only then change content.
   - A small position move is left alone.
5. Keep a local mirror: one CSV row per annotation (date, text, who, why) in the growth folder. The 500-day expiry and the no-API limit mean Search Console is not the record.

## How we apply it to Cedwyn
- **Site:** cedwyn.bucklerfamily.estate is new (autumn 2026), so most 2026 update windows come before it has data. The **Sep 2026 spam update** after-window (15–21 Oct) is ready now. PROPOSAL for the Monday VISIBILITY CHECK: compare 17–23 Sep against 15–21 Oct for the /ebooks/, /documentary/ and /learn/ pages, and record "no change" or "change" in the scores file. It should rule the spam update out before the gen-AI guidance changes are blamed for anything.
- **E-books:** annotate each edition change on its release day, e.g. "Cedwyn e-book v0.0.2 £4.99 released; v0.0.1 stays free". A query-level lift can then be read against the right date. No price changes come from this skill.
- **Documentary:** annotate each door opening ("Documentary door N live") so Video-tab and /documentary/ impressions can be read per door.
- **Academy:** annotate the /learn/ launch and the first member-sync change.
- **Process:** annotations need a human with full-user access, because there is no API. PROPOSAL: the weekly ONPAGE run writes the lines to `the project workspace`, and the owner (or a browser session with his saved Google login, on his word) pastes them in. The text stays neutral and has no banned words.
- Nothing was changed on the site, in Search Console or anywhere else by this harvest.

## Sources
- developers.google.com
- support.google.com
- status.search.google.com and status.search.google.com
- developers.google.com
- developers.google.com
- (not checked, vendor) digitalapplied.com