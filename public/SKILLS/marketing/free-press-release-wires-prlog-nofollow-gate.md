# Free press-release wires (PRLog, openPR, EIN, Pressat): what they do and don't do

Harvested 30 Oct 2026 for Cedwyn e-books. Status: gate + playbook. Nothing has been posted.

## The facts (sources read 30 Oct 2026)
- **Google treats wire links as not counting.** Google's spam policies (developers.google.com, read) list as a link scheme "links with optimized anchor text in articles, guest posts, or press releases distributed on other sites". Google's link guidance (links-crawlable, snippet) states paid or syndicated links should be `nofollow`/`sponsored`. Wires mark links nofollow by default: PRLab's 2026 test notes EIN allows "up to three nofollow anchor text links", and 24-7PressRelease's own help page explains why its links are nofollow. **SEO value from a wire link is about zero, and keyword-stuffed anchors are a risk.**
- **Free wires publish; they don't pitch.** PRLab (CEO Matias Rodsevich, "tested the top paid and free submission sites in 2026", read): PRLog is free and ad-supported, live at once, editable after publishing, one image + one video, indexed and fed by RSS by country/topic, basic visitor stats only; it "isn't built for pushing stories to journalists". openPR allows a free monthly release (PRLab list, snippet). EIN Presswire is the cheapest paid tier: "3,900 outlets" matched by industry/region, entry tier one country + one industry, report within hours, no click tracking.
- **"Distributed to Google News, AP, Yahoo Finance" means the wire's partner network, "not guaranteed placements"** (PRLab on the paid national tiers, read). In practice the pickups are auto-syndicated copies on low-traffic finance and news-aggregator subdomains. Journalists don't read them.
- **Pressat (UK) offers free distribution to "national, regional and local media outlets" for charities, non-profits and social enterprises** (pressat.co.uk free-news-distribution page, search snippet; the page returned 403 to a plain fetch, so the eligibility rules weren't checked). Cedwyn is not a registered charity, so this is only relevant if a constituted heritage group is ever formed (see the grant-route proposals already in the queue).
- **What journalists actually use** (from our existing PR skills): Cision 2025 found 72% call press releases the most useful asset, but 86% reject off-beat pitches and 85% prefer a plain intro email. The release works as a **document you send or link to**, not as a wire broadcast.

## When a free wire is worth it
1. **As a dated, indexed public record.** A PRLog page is a timestamped third-party copy of an announcement (e-book launch, new archive record published). That has some value for citations and AI answers, which read the web broadly. It is a weak signal, though, not a link.
2. **As a findable page for one-off searchers** typing the exact title. That's marginal.
3. **Never as the press strategy.** The press route is the tiered media list, an exclusive first, then local democracy reporters (skills: media-list-welsh-outlets…, pr-exclusive-first…, local-democracy-reporters…).

## How to do it right if used (15 minutes)
1. Write the release for the online press kit first (online-press-kit-page… skill). The wire copy is a shortened version.
2. Headline: news, not keywords ("New e-book publishes the 1897 Llandough farm records in Welsh, English and Spanish"). Under 700 words, since the entry tiers cap there.
3. **At most one link**, to the press-kit page or /ebooks/ as a bare URL or brand anchor. No keyword anchors (that is Google's named link-scheme pattern). Tag it `?utm_source=prlog&utm_medium=pr&utm_campaign=<slug>`, or better, use our own `/r/pr-prlog-<slug>` short link (own-short-redirect-links skill) so the visits are countable in Cloudflare.
4. One image you hold the rights to, with a credit line.
5. After 14 days, count the /r/ clicks. If under 5, don't repeat it. Write the number in the log.

## Paid wires: decision
EIN, PR Newswire and similar are spend, and they buy syndication, not coverage. That's a **the project lead decision**, and the evidence states no for a niche heritage book with a small budget.

## How we apply it to Cedwyn
- **Now (no spend, no sending):** nothing goes out. Press only goes out on the project lead's GO (standing rule). Record this gate in the PR plan so no worker spends time on "submit to 20 free PR sites" lists.
- **When the project lead states GO on an announcement:** draft one PRLog version beside the press-kit page, using the /r/pr-prlog-<slug> link. Posting it means creating an account in the project lead's name, so it's a proposal and his choice.
- **Editorial rules apply in full:** never name the project lead, use none of the banned words, no outbound links on Cedwyn pages. A wire release is public text.
- **Measure:** the /r/ path count after 14 days goes into growth-report notes.

## Sources
- developers.google.com (read 30 Oct 2026; press-release link-scheme example)
- developers.google.com (snippet: paid/syndicated links qualify with nofollow/sponsored)
- prlab.co (read; 2026 hands-on test, PRLog/EIN/national tiers)
- 24-7pressrelease.com (snippet)
- pressat.co.uk (snippet; 403 to a plain fetch, so terms not checked)