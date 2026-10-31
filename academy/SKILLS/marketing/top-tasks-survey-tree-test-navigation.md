# Top Tasks: find the few jobs visitors actually come for, then check the menu finds them

Date: 2026-10-31 · Topic: funnel/CRO, information architecture, analytics · Status: method + stdlib helper; any on-site survey or menu change is a PROPOSAL

## Why it matters (practitioner evidence)
- **Gerry McGovern's Top Tasks** (Smashing Magazine, May 2022; his own account): one survey, 50-80 tasks shown in random order, each voter picks **no more than five**. Run **600+ times since 2003, 500,000+ voters, 120+ countries**; he reports it has never failed to produce a clear ranking.
- **The long neck:** in his surveys a handful of tasks take a quarter of all votes. Liverpool City Council (2009): **6 tasks took the first 25% of the vote** (jobs, leisure, waste, libraries, schools). The organisation's own pet topics usually land at the bottom.
- **Inverse publishing:** Liverpool found the more a task mattered to residents, the *less* content was being made for it. **200 of ~4,000 pages drew 85% of traffic**, and the evidence let the team **delete over 80% of the site**. The 2009 top tasks were still the homepage spine in 2022.
- **Small samples show the head early:** European Commission survey, **107,000 voters**. The top three tasks had already emerged **after 30 votes** and never changed. McGovern treats **~400 voters** as a solid table.
- **Sample size for precision** (Jeff Sauro, MeasuringU, 90% confidence, worst case p=50%): **65 votes = +/-10 pts, 103 = +/-8, 136 = +/-7, 268 = +/-5, 421 = +/-4**. With tiny traffic, read the top band, not the exact order of the middle.
- **Government at scale:** Canada.ca now builds its top-task list from the GC Task Success Survey, a random intercept running since Jan 2019. Its **top 10 tasks were over 50% of responses** (Apr 2021-Mar 2022).
- **Then test the menu, not the visuals:** a tree test (NN/g) shows only the bare category labels plus a task ("where would you find X?"). It records success (right final location), first click and directness (no backtracking). Optimal Workshop's guidance: **~80% success is a good task score**. NN/g notes tree-test scores run lower than live-site scores because search and page context are removed. Plan **~50 unmoderated participants** per tree (Optimal Workshop).

## How to do it
1. **Build the long list (50-80 tasks).** Take them from what already exists: site-search queries, top landing pages, reader email questions, comments, sales-page FAQs. Write each as a visitor's job in their words ("see the 1950s maps", "buy the e-book as a gift"), not our section names. Merge duplicates. Keep one list; never split it into categories.
2. **Framing line + vote.** "When you visit this site, which of these matter most to you? Pick up to 5." Randomise the order. Add 1-2 segment questions (for example researcher / local / family-history / teacher).
3. **Collect votes.** Best route: a light pop-up or inline card on the site itself. A newsletter link is a second route but skews toward existing readers, so tag the source. Stop at ~100 votes for a first read, then grow toward 400.
4. **Rank.** Sort by votes. Mark the cumulative 25% / 50% / 75% bands. The tasks in the first 25-50% are the **top tasks**, and the bottom half is **tiny tasks**. Give each a +/- margin (helper below) so nobody argues over rank 9 vs 11.
5. **Measure the top 8-12 tasks.** For each, write one task instruction with a single correct answer. Time it and score success with a few real people or in a tree test. Re-run the same tasks every 6-12 months; that is the trend line.
6. **Tree-test the navigation** before moving a menu. List the menu as a plain text hierarchy and ask 8-10 tasks drawn from the top tasks, plus 1-2 checks on labels we are unsure of. Read success (target ~80%), first click (wrong first clicks reveal a confusing label) and directness. Change one label or location, then re-test the same tasks.
7. **Act on the long neck.** Put the top tasks on the homepage and main menu, in visitors' words. Give the most care to the few pages that serve them. Tiny-task pages are moved, merged or left unlinked from the main menu, never promoted.

## Free tools
- `tools/top_tasks.py` (stdlib, written for this skill): CSV of votes (one row per voter, tasks separated by `|`, optional segment column) -> ranked table with % of votes, % of voters, Wilson 90% interval, cumulative-share bands and a per-segment top 5. Also `--margin N`, which prints the +/- you get from N voters.
- Tree test without a paid tool: a static HTML page of nested `<details>` lists plus a "this is where I'd look" button that logs the path. NN/g states paper or any clickable prototype works. Analysis by hand or with the helper's tally mode.
- Data we already hold for step 1: site-search query mining (see static-site-search-pagefind-query-mining.md) and per-page traffic.

## How we apply it to Cedwyn
- **Now (internal, no public change):** draft the 50-80 task long list from the site-search logs, the top landing pages by human traffic, reader emails and comments, the e-book FAQ and the academy work board. Then check the "200 pages / 85% of traffic" pattern on our own page traffic: how many pages carry 85% of human visits, and are they the ones getting the most care?
- **PROPOSAL (needs approval, public channel):** a one-question top-tasks vote shown on the home and /ebooks/ pages and linked once from the newsletter, with no personal data beyond an optional segment choice. Read the table at 100 votes, then at 400.
- **PROPOSAL:** a 10-task tree test of the main menu across the web apps (research, wiki, e-books, shop, movie, academy) before any further menu changes. Targets: ~80% success on the top tasks, and buying an e-book findable at first click.
- The measure that ties this to sales is success rate on "buy / download the e-book" and "find the evidence behind a claim", reported in the Sunday growth report alongside traffic. Prices are not touched; this is about findability, not price.

## Sources
- smashingmagazine.com (McGovern: 50-80 tasks, pick up to 5, 600+ surveys / 500k+ voters, Liverpool 6 tasks = 25%, 200 of 4,000 pages = 85% traffic, >80% deleted, EC 107k voters top 3 stable after 30, ~400 voters)
- gerrymcgovern.com (select 8-12 top tasks for measurement; task instructions)
- measuringu.com (Sauro sample-size / margin-of-error table, 90% confidence)
- blog.canada.ca (GC Task Success Survey since Jan 2019; top 10 tasks >50% of responses)
- nngroup.com and nngroup.com (tree test method, success / first click / directness, scores lower than live site)
- support.optimalworkshop.com (~80% success = good task score)