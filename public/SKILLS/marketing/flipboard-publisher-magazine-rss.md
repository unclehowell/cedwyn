# Flipboard: publisher profile, RSS-fed Magazine, measure before investing

What it is: Flipboard is a "social magazine" app; a publisher gets in by making a profile and a Magazine, adding stories by bookmarklet or, better, feeding the Magazine from the site's RSS feed. Since 2024 Flipboard Magazines and publisher accounts are also followable from the fediverse (Mastodon etc.). Free; paid native ads exist and are out of scope.

## What the sources show (read 26 Oct 2026)
- **Publisher in a Box, "Flipboard for Publishers in 2026"** (read, syndication agency). Route: account at flipboard.com, profile image + short bio, create a Magazine, add stories with the bookmarklet; the scalable route is the RSS feed, which Flipboard uses "to discover articles and generate article summaries". A clean feed (full title, description, one good image per item) does most of the work. Flipboard's timeline as they quote it: follow the fediverse Aug 2024, 250 publishers federated Sep 2024, Surf beta Dec 2024, 11,000 Magazines + 400 creators federated, publisher federation in France/Italy/Spain Mar 2026, Surf "social websites" 2 Apr 2026. Their honest line: no independent 2026 data sizes Flipboard referral traffic for independent publishers - measure it in your own analytics for a few months; if the line stays flat after a steady feed, drop it.
- **Flipboard Publisher FAQ** (search snippet; page content did not render for our fetcher): when you sign up for a Publisher Account you submit an RSS feed for review; publishers must own and operate the feeds they submit.
- **Digiday** (snippet, older article, date not checked): for one publisher group Flipboard was the 4th-biggest referrer, 1-2% of total traffic. Big-publisher figure; not a small-site benchmark.
- No small heritage-site case study found. Expect modest, slow traffic; the low effort is the reason to try.

## How to do it
1. Prerequisite: a valid feed. Cedwyn has none (/feed.xml returned 404 on 26 Oct 2026, re-checked this run). Build it first with the rss-atom-feed-websub-static-site skill (tools/make_feed.py), each entry with title, summary and a cover/lead image.
2. Create a Flipboard account for the brand (name + image + bio matching the site; no personal name). One Magazine per real topic cluster, e.g. "Great House Farm records", "Welsh Patagonia", not one per post.
3. Add the RSS feed to each Magazine (or submit it via the Publisher Account route). Until the feed exists, the bookmarklet adds pages by hand - 1-2 a week, only pages with a strong lead image.
4. Tag links: feed item links carry `utm_source=flipboard&utm_medium=referral` if the feed generator allows; otherwise filter referrers flipboard.com / flip.it in Cloudflare/GA4.
5. Weekly row in the project workspace: Flipboard followers, Magazine views (Flipboard stats), sessions from flipboard. Review at 8 weeks; stop if under ~10 sessions/week with a steady feed.
6. Fediverse bonus: the federated profile can be followed from Mastodon - link it from the existing Bluesky/Mastodon skill notes rather than running a second Mastodon routine.

## How we apply it to Cedwyn
- Order: feed first (already a PROPOSAL in the RSS skill), Flipboard second. Without the feed this is manual and low value.
- PROPOSAL (needs the owner's GO - it is a new channel/account): a brand Flipboard profile with 2 Magazines fed by the Cedwyn feed, measured 8 weeks with the stop rule above. Zero spend; ignore Flipboard's paid "content program" and ads.
- Public text rules apply to profile and Magazine descriptions: never name the owner, no banned words, Cedwyn internal links only, the Bute-date rule in the Cedwyn editorial rules file applies.
- No repo change now (migration worker owns cedwyn); anything for the site goes in a patch folder.

## Sources
- publisherinabox.com (read)
- about.flipboard.com (snippet; page did not render)
- about.flipboard.com (snippet)
- digiday.com (snippet; older, date not checked)