# Link-in-bio page: our own short page, 3-5 links, the buy link first

Harvest 2026-10-31 ~00:15Z. Internal working note. 'linktree' had 0 hits in INDEX.md before; 'link in bio' appeared only in a harvest note. Builds on own-short-redirect-links-r-campaign-path-counting.md (the /r/<slug> rule) and instagram-new-account-90-days-trial-reels-gate.md.

## What the sources show (all read 31 Oct 2026)
- **Instagram allows up to 5 bio links on every account type** (TechCrunch, 18 Apr 2023, Sarah Perez): Edit profile > Links > Add external link, drag to order, plus a separate Facebook-profile link. TikTok clickable bio links are limited (business accounts; personal accounts need a follower threshold). So a single page still matters on TikTok and keeps one URL across all platforms.
- **Linktree's own 12-month data** ("Not All Clicks Are Equal", Linktree blog, 13 May 2026; vendor data on its own pages): visitors arriving from Instagram, TikTok and Google search clicked one of the page's links ~80-95% of the time; Facebook visitors only 30-45% (~41% vs ~83%). Instagram drove ~11B views, ~4x the next social source. Read: the bio page is a high-intent step; Facebook traffic is worth about half per view.
- **Linktree: pages with a profile description get 2x more clicks on average** (Linktree "What is a link in bio", footnote: Linktrees created since Oct 2024; vendor figure). A one-line "who we are / what this is" above the links pays.
- **Typical bio-click rate** (Linke.ro analytics guide, vendor, figures not checked): Instagram bio clicks ~1-3% of profile views, TikTok 0.5-2%, X 2-5%, LinkedIn 3-7% B2B; any link under 0.5% of page visits is dead weight: move it up, relabel it specifically, or remove it.
- **Own page vs Linktree, practitioner split** (Shana Bull, digital marketing educator, blog; Brie Anderson at Social Media Marketing World 2022): Bull recommends a page on your own site; Anderson prefers Linktree because a site page where people land and leave in seconds sends weak engagement and the vendor gives click analytics free. Our answer to that objection: an own page that is short, fast and points mostly to our own pages (/ebooks/, /movie/, academy), so the click stays on our domain, and counting comes from /r/<slug> paths (Cloudflare can't see query strings on our zone; see the /r/ skill).

## The finding on our side (checked 31 Oct 00:13Z)
- bucklerfamily.estate answers 200 but is the **whole site directory**: 60+ entries (Wales, Patagonia, Chessboard, Grammar House, Counting House, Watchtower...) with the e-books link one of many. That is a directory, not a bio page. cedwyn.bucklerfamily.estate is 404.
- Which URL each social bio currently points to: not checked this run.

## How to do it (rules)
1. **One page, one URL for every bio**: e.g. `bucklerfamily.estate/start/` (or reuse /links/ only if the directory moves elsewhere; changing /links/ breaks anyone using it as a directory, so prefer a new path).
2. **3-5 buttons, no more**, ordered by money then attention:
   1. Free first edition / e-books shelf (/ebooks/) - the buy path
   2. The documentary (/movie/) - current headline content
   3. Academy free Grade 1 (academy.bucklerfamily.estate) - the subscription door
   4. Email signup (one field, inline)
   5. Optional: this week's item (newest Story Time video or blog post), swapped weekly
3. **Every button goes through `/r/<slug>`**: `/r/bio-ig-ebooks`, `/r/bio-tt-ebooks`, `/r/bio-yt-movie`... Different slug per platform so the per-source split (IG vs FB vs TikTok) is countable. Split by slug, never by utm (query strings are invisible on our zone).
4. **One-line description at top** ("Records and story of a Welsh farm, 1824-today. E-books, documentary, free quiz."), dark theme, buttons 48 px tall, loads under 1 s at 390 px, no outbound links except the platforms themselves at the bottom as small icons.
5. **Instagram: use the native 5 links too**: link 1 = the /start/ page (so the profile preview shows our domain), links 2-3 = /r/bio-ig-ebooks and /r/bio-ig-movie direct.
6. **Review monthly**: per-slug counts from the edge; drop any button under 0.5% of page visits; rotate slot 5.
7. Facebook gets roughly half the click-through of IG/TikTok per Linktree's data: don't judge the page by Facebook-sourced visits.

## How we apply it to Cedwyn
- PROPOSAL (needs a commit on the site; markup-only page, no prices changed): build `/start/` in the shared Cedwyn header/dark standard with the 5 buttons above, each through /r/; leave /links/ as the directory.
- Point the IG (@cedwynestate), TikTok, YouTube channel links and Facebook Page (Great House Farm II) website field at /start/ - each a profile edit, done through existing logins/connected apps, or by the owner where an app can't edit profile fields.
- Add `bio-*` slugs to the /r/ slug register and the weekly growth report (clicks per platform per button).
- Honest limits: Linktree numbers are vendor data from their own platform; our own counts replace them after 4 weeks. Public text rules apply (never name the owner; banned words; no outbound links on the page beyond platform icons).

## Sources
- techcrunch.com
- linktr.ee
- linktr.ee
- linke.ro
- shanabull.com
- bucklerfamily.estate (own site, checked 31 Oct 2026)