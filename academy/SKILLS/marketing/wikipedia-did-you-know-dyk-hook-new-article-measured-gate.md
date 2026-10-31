# Wikipedia "Did you know" (DYK): a main-page hook for a new local-history article, measured gate

Harvested 31 Oct 2026. Route type: reach for the topic (Llandough, Leckwith, Cogan, the Ely valley), not direct traffic to us. Free. Strong conflict-of-interest limits apply. Related existing skills: wikipedia-ai-citations-coilegal-llm-rules-gate.md, wikipedia-on-this-day-selected-anniversaries-measured-gate.md, wikipedia-pageviews-topic-demand-signal.md.

## The rules (Wikipedia:Did you know/Guidelines, read 31 Oct 2026)
- Eligible article: "created, expanded fivefold, moved to mainspace, translated from another wiki, or promoted to good article status **within the last seven days**" before nomination.
- At least **1,500 characters of original prose**; neutral; reliable sources with inline citations.
- Hook: one short "... that ..." fact, cited inline in the article, interesting to a general reader.
- **QPQ:** a nominator with 5+ past nominations must review one other nomination per new one.
- **COI:** "articles with a conflict of interest (whether or not it is declared) may be subject to greater scrutiny from reviewers and promoters."
- Sets run on the main page for 12 or 24 hours; the archive (Wikipedia:Did you know archive) lists every set with its UTC time.

## Measured effect (our own read, 31 Oct 2026)
Pageviews API (user agents only) for bolded DYK articles in sets from 10-28 Oct 2026; 9 of 54 sampled titles resolved (the rest failed on renames/rate limits), so treat as indicative:
- Run-day views: **median 190**, p25 77, p75 311, max 392.
- Baseline (median of the 6 days before): **7 views/day**.
- So a DYK lifts a small article roughly 25x for one day, to a few hundred readers, then it falls back. Wikipedia readers rarely click external links, so expect at most a handful of visits to any cited site.
The page DYK/Statistics celebrates only outliers (unusually high views), which is why the typical hook looks far smaller than the famous ones.

## When it is worth it
- Only when a Wikipedia article on a local topic is genuinely missing or a stub that could be expanded fivefold from **published, independent sources** (county histories, Cadw/RCAHMW listings, journal articles, census and tithe material), not from our own site.
- The lasting value is the article itself: a cited, neutral entry that search engines and AI assistants read for years, ideally citing primary records our catalogue also holds.

## Steps
1. Check demand: wikipedia-pageviews-topic-demand-signal.md on candidate topics; pick one with a missing or stub article.
2. Draft in Draft: space (Articles for Creation if any COI exists); 1,500+ prose characters; every sentence cited to independent published sources.
3. Prepare 1-2 hooks under ~200 characters each, each tied to one cited sentence, neutral in tone ("... that a 12th-century charter granted the church at Llandough to ...?").
4. Within 7 days of the move to mainspace (or a fivefold expansion), file the nomination at Template talk:Did you know; answer reviewer questions quickly.
5. Measure with the Pageviews API: run day vs prior 6-day median; and our own referrer counts from en.wikipedia.org.

## Gate (why this is not an agent action)
- Editing Wikipedia about a topic tied to a project we run is a declared COI under WP:COI; promotional or case-arguing text will be removed and can taint the topic. A self-written DYK about the farm, the family or the court case is out.
- Agents never edit Wikipedia or file nominations. A human editor with no stake (e.g. a local history society member) would have to write and nominate.

## How we apply it to Cedwyn
- **Status: GATED PROPOSAL, low priority.** Expected reach is ~200 one-day readers to Wikipedia and near-zero direct visits, so it does not fix our reach problem (~45 real outside /ebooks/ views a day).
- Useful agent prep only: list local topics where English Wikipedia has no article or a stub (Leckwith, Cogan, Llandough manor, the Ely river crossings), with the independent published sources an outside editor could cite. Hand the list to the owner as an offer to a local history society, not as our own edit.
- Never cite our e-books or case pages in the hook; never name family members; follow the existing Wikipedia COI skill.

## Sources
- en.wikipedia.org (read 31 Oct 2026)
- en.wikipedia.org
- en.wikipedia.org (sets 10-28 Oct 2026)
- wikimedia.org pageviews per-article endpoint (our measurement above)
- en.wikipedia.org