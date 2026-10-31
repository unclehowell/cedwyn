# Skill: Wikipedia "On this day" (Selected anniversaries) - what it is worth, what it takes, and why the farm is a NO for now
Written 31 Oct 2026 (skills harvest). Extends wikipedia-ai-citations-coilegal-llm-rules-gate.md (COI/COILEGAL/LLM rules, read that first). This file adds the OTD rules and our own measurement of the traffic.

## What an OTD listing is worth (our own measurement, 31 Oct 2026)
Source: Wikimedia pageviews API (user agents only), the boldfaced articles on Wikipedia:Selected anniversaries/October 17-27 (this year's live sets), each compared with the median of days -9..-3.
- 55 featured articles over 11 days. Articles with a baseline under 100 views/day (27 of them): median 252x on the day, median ~6,000 views that day.
- Small subjects gain the most: Mabel Freer 5/day -> 20,836; Ahmad ibn Kayghalagh 2 -> 6,046; Illinois Memorial 3 -> 3,489; Girl Pat 7 -> 13,252; Battle of Grathe Heath 8 -> 7,394.
- It is a ONE-DAY spike. Day after: Mabel Freer 329, then 84, 37; Girl Pat 441, 78, 51; Illinois Memorial 50, 11, 6; Hartog Plate 256, 94, 96. Back near baseline in 2-3 days.
- Big anniversaries stack with news: Aberfan disaster (Wales, 60th anniversary 21 Oct 2026) 7,298/day baseline -> 187,692 on the day.
- The date page itself (e.g. "October 20") gets ~13,000-21,000 views that day (~50x).
So: a large one-day audience, almost no lasting lift. Worth having only if a page it links to keeps people (and Wikipedia external links are nofollow anyway).

## The rules (WP:OTDRULES, read 31 Oct 2026)
1. The event must be of "moderate to great historical significance" relative to that calendar day, and one of the most important events in the boldfaced article.
2. The boldfaced item must be an ARTICLE (not a section) meeting Wikipedia:Days of the year inclusion.
3. The article must state the exact day, cited to a reliable source with an inline citation.
4. Not a stub; "relatively complete and well-formatted"; no yellow-level or worse maintenance tags (many {{citation needed}} also disqualify). Need not be a Good Article.
5. Past tense, one sentence. Today/tomorrow pages are admin-protected; suggest on the date's talk page or, for unprotected days, add under "Eligible" in the staging area. Centenaries can be flagged ahead on the project talk page.
- What actually blocks entries (our count of the "Ineligible" reasons on 17-27 Oct): refimprove section 40, refimprove 15, unreferenced section 14, needs more footnotes 3, multiple issues 3. Sourcing is the gate, not fame.
- Notability for a standalone building article (WP:GEOFEAT/NHERITAGE, read): features with official cultural-heritage or national protected status and verifiable information "are presumed to be notable"; being on maps or in directories is not enough. Otherwise the general rule: significant coverage in multiple independent reliable sources.

## Where the farm stands on Wikipedia (read 31 Oct 2026)
- No article "Great House Farm" and no article "BP Properties Ltd v Buckler" (the case is cited inside "Adverse possession" and "English land law").
- The farm is a SECTION ("Great House Farm") of "Llandough, Penarth" (38 KB article, ~215-340 views/month Oct 2025-Sep 2026). The section has one citation at its end (The Glamorgan Village Book, GFWI 1993) and covers: Celtic monastery tradition, the soldier's remains under the dining-room floor (visor and lance at Amgueddfa Cymru), a 1,700-signature preservation petition in 1974, Marconi staying in 1897, demolition in 1988 "following a 33-year dispute over ownership".
- Verdict: OTD is NOT reachable for the farm. A section cannot be boldfaced; a new article would be about a demolished building with no protected-status presumption checked, and its central dated events (the dispute, 1987, 1988) fall under WP:COILEGAL for anyone connected. Tab must not draft Wikipedia text at all (LLM rules, see the gate skill).

## What is allowed and useful (steps)
1. Ride OTD days, do not chase them. Each morning the On-this-day feed is public (api.wikimedia.org tested 31 Oct 2026: 200, JSON list of year + text). When a featured item is Welsh, Glamorgan, Marconi/wireless, Bute or farming history, our own On This Day post (on-this-day-posts-from-own-chronology.md) goes out that day with our nearest dated record. That borrows the topic's one-day attention without touching Wikipedia.
2. Check the dates that matter to our chronology against Wikipedia's day pages: e.g. Marconi's Lavernock-Flat Holm transmission (May 1897) is a likely OTD-class event with existing articles. If an uninvolved editor's article already carries it, our calendar can show the same day with our farm record beside it.
3. For the Llandough section, the only route is the gate skill's: a disclosed person (not Tab), in their own words, posting one {{edit COI}} talk-page request with an INDEPENDENT source for a non-case fact (e.g. the 1974 petition from a newspaper of the time). Never about the 1987 case, never our own site as the source.
4. Measure: pageviews API for "Llandough, Penarth" monthly; if a request is accepted, compare the month before/after. No other action.

## How we apply it to Cedwyn
- Gate result: Wikipedia OTD for Great House Farm = NO (no article, COILEGAL, LLM rules). Recorded so future runs do not re-research it.
- PROPOSAL (Tab can do, zero spend, nothing posted to Wikipedia): add a daily read of Wikipedia's selected OTD feed to social.py's planning step; when an item matches our topic words, schedule that day's own-chronology post and log "otd-ride" with UTM utm_campaign=otd-ride. Kill rule: after 8 matches, keep only if ride days beat ordinary OTD posts on clicks.
- PROPOSAL for the calendar webapp: on each day page, a small "Also on this day (Wikipedia)" line linking out is NOT allowed (Cedwyn has a no-outbound-links rule), so keep the feed internal for scheduling only.
- The measured one-day spike is also the benchmark for our own anniversaries feed: a featured day is attention, not lasting traffic, so every OTD-type post must link to a page that offers the next step (the e-book or the calendar day).

## Sources
- en.wikipedia.org (criteria WP:OTDRULES, read)
- en.wikipedia.org (staging area and ineligible reasons, read; also Oct 17-27)
- wikimedia.org (per-article daily and monthly, queried 31 Oct 2026)
- en.wikipedia.org) (WP:GEOFEAT/NHERITAGE, read)
- en.wikipedia.org (Great House Farm section, read)
- api.wikimedia.org (feed endpoint, tested 31 Oct 2026, 200)