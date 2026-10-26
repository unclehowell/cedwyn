# Link reclamation: unlinked mentions, dead old URLs and broken resource links

Topic: SEO / PR. Three low-cost ways to win links for a small heritage site, in order of effort: (A) fix our OWN dead URLs that others still link to (no outreach), (B) ask sites that already mention us by name to add a link, (C) offer our page as a replacement for a dead link on a curated resource page. Harvested 2026-10-26. Wikipedia citations are covered elsewhere (wikimedia-commons-wikidata-heritage-coi.md) and excluded here.

## Practitioner numbers (read at source unless marked)
- Above Apex (link-building agency, 60+ client companies over 24 months, read): unlinked-mention outreach converts 15-30% on properly filtered lists (15-30 links per 100 qualified emails); most replies in 1-2 weeks, tier-1 outlets 30+ days, a few after six months; small brands realistically 2-5 reclaimed links a month once the backlog is done. Skip: sites with no-outbound-link policies (some government/finance), mentions in comments/UGC, articles where the brand is shown unfavourably. Agency benchmarks, own clients: not independently checked.
- La Growth Machine guide 2026 (read): broken-link building averages 5-8% links per cold email; generic "spray and pray" 2-3%; hand-picked personalised 12-15%; niches with curated resource pages (libraries, education, non-profits, government, associations) 10-15%. Free checkers named: Check My Links (Chrome), Screaming Frog (500 URLs free), Dr. Link Check. Prospecting queries: "topic" + "useful resources" / "recommended reading", intitle:links, inurl:resources.
- Contently May 2026 (snippet, not checked): unlinked brand mentions also feed AI-search visibility.

## How to do it
A. Own dead URLs (do first; zero outreach)
1. List every old address the site has had (retired subdomains, moved paths).
2. Find who links to them: Search Console Links report (top linked pages), Bing Webmaster backlinks (free), and search "old-host" -site:ourdomain.
3. Add path-preserving 301s from each dead address to the closest live page. Re-test with curl -I.

B. Unlinked mentions
1. Search exact names: "site/brand name", "book title", distinctive place names, minus our own domains; set free Google Alerts for each.
2. Filter: editorial page, still live, mention is neutral/positive, site does link out elsewhere.
3. Short note to the author/editor: thank them, name the page, offer the exact URL that helps their readers (a specific record page, not the home page). One follow-up after 7-10 days, then stop.

C. Broken links on resource pages
1. Find 30-50 curated pages in the niche (local history society link lists, library subject guides, school resource pages).
2. Run each through a free link checker; note dead outbound links on our topic.
3. Check the dead page in the Wayback Machine; only pitch if our page truly replaces it.
4. Email: "Link X on your page Y is dead; it covered Z; our page W covers the same with sources". One follow-up.

## Pitfalls
- Outreach is outbound email: UK PECR/GDPR apply (corporate addresses, legitimate interest, clear opt-out; see cold-email-deliverability-uk-pecr.md).
- Measure links that stay live after 30 days, not replies.

## How we apply it to Cedwyn
- A (proposal for the migration/redirect owner, no outreach): the audit lists dead or retired subdomains (archive., ghf-app. (replaced by /app/), call., ccan., dash., althea., subrepos.). Check Search Console/Bing for external links to each; where any exist, propose path-preserving 301s to the matching Cedwyn path in the existing redirect tooling. Highest value per minute; leave as a patch while the migration worker owns the repo.
- C (PROPOSAL; HubSpot drafts only): Welsh local-history society link pages, library local-studies guides and Patagonia/Welsh-diaspora resource lists; replace dead links only where a Cedwyn record page is a true match.
- Tracking: one row per prospect in the project workspace (url, type A/B/C, date pitched, outcome, link live at 30 days).
- Bar: A done for all retired hosts with inbound links; B/C judged after 20 pitches (expect ~1-3 links at the rates above).

## Sources
- aboveapex.com (read)
- lagrowthmachine.com (read)
- contently.com (snippet, not checked)
- brandmentions.com (snippet, not checked)