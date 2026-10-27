# Skill: Pinterest and YouTube Shorts for history content
Written 26 Oct 2026 (skills harvest). Complements the project workspace (long-form) and instagram-reels-carousels-heritage.md; this file covers Pinterest search traffic and the Shorts -> long-form bridge only.

## Pinterest: what practitioners report works
- Case study (Pinterest manager Sarah, caffeineandconquer.com, May-Dec 2025): an established blog went from ~1,000 to 7,653 outbound clicks a month (October 2025, +433% year on year). What changed:
  1. Boards rebuilt around search intent (what people type into Pinterest), not narrow, underfilled boards.
  2. Video pins stopped entirely; search-optimised IMAGE pins only (the animated pins "were not driving traffic").
  3. Bigger, well-cropped vertical images with high-contrast text and a clear font hierarchy; descriptions written for search.
  4. Seasonal content published months ahead; new seasonal pins ranked at the top of Pinterest search within their season.
  - Her stated fit: sites with an existing library (typically 50+ posts). Cedwyn has hundreds of evidence pages, so it fits.
- Article rich pins (Pinterest Help): add Open Graph / schema.org markup and pins saved from the site show the headline, description and author, and update when the page changes. Cedwyn already ships OG tags; validate one URL in Pinterest's rich pin validator after the business account exists.
- Treat Pinterest as a search engine with a long tail: a pin keeps getting impressions for months, unlike a feed post.

## Pinterest: how to do it
1. Business account (free) on a Tab-controlled or team@ email if Pinterest allows it; otherwise it goes to the project lead's connect queue. Claim the website (meta tag or DNS TXT) so pins carry attribution.
2. 6-10 boards named as searches: "Welsh history", "Vale of Glamorgan history", "Old maps of Wales", "Welsh Patagonia history / Historia galesa en Patagonia", "Welsh land records", "Victorian Wales".
3. Pins: 1000x1500 (2:3) images: a crop of the real document or map + a 5-8-word title in large type + small "cedwyn.bucklerfamily.estate". One pin per evidence page; 2-3 design variants per important page spread over weeks.
4. Title and description: the search phrase first, then a plain sentence about the record and its date. No banned words, no assertions about people.
5. Cadence: a few fresh pins a day, steady, rather than bursts. Stay far below Pinterest's API limits (check developers.pinterest.com rate limits before automating).
6. Pin links are off-site traffic sources, so they may carry UTMs: `?utm_source=pinterest&utm_medium=social&utm_campaign=evidence-pins`. Link to evidence pages, not straight to /ebooks/; the header e-book strip does the cross-sell.
7. Read Pinterest Analytics monthly: outbound clicks and saves per pin; make more of the pins that win.

## YouTube Shorts: the official bridge to long-form (YouTube blog, 14 Jul 2026)
- Many Shorts viewers never click into a 10-minute video on their own, so build the bridge deliberately:
  1. Related Video link: YouTube Studio -> Content -> the Short -> Related video -> pick a long video, live stream or another Short. Match intent: the Short's hook must be exactly what the linked video answers.
  2. Explicit call to action in the last 5 seconds: say "the full story is in the link right here" and point at the link or flash the long video's thumbnail.
  3. Reward the click: the long video's first 5-10 seconds go straight to the promised moment; no logos or slow intros.
  4. Optional: vertical live streams feed into the Shorts player.
- Shorts cut from long videos must stand alone without outside context.

## How we apply it to Cedwyn
- YouTube (connected; baseline 1,067 views): each daily Cedwyn movie scene gets 1-2 Shorts (a 30-50 s vertical cut with a single question as the hook, e.g. "Why does an 1824 map show a field that's gone today?"), each with the full scene set as its Related Video, a spoken CTA in the last 5 s, and the scene's first seconds starting on that exact moment. The full video's description carries the evidence-page link (off-site, so UTMs are allowed: utm_source=youtube&utm_medium=video).
- Pinterest: not connected yet. Put it in the project workspace (business account sign-up + website claim). Prepare the first 20 pins (images + titles + descriptions + target URLs) in the project workspace while waiting, so posting can start the day it is connected.
- Seasonal plan: St David's Day (1 March), 28 July (Welsh landing in Patagonia), Eisteddfod del Chubut; pin each season's content 6-8 weeks ahead.
- Spanish boards and pins for the Patagonia audience in Rioplatense Spanish (see spanish-patagonia-audience.md).
- Measure: Pinterest outbound clicks/month, YouTube "Related video" clicks (Studio -> Shorts analytics), and Cloudflare visits from pinterest.com / youtube.com.

## Sources
- caffeineandconquer.com (updated 23 May 2026; 1,000 -> 7,653 outbound clicks/month)
- help.pinterest.com (article rich pins via Open Graph / schema.org)
- blog.youtube (14 Jul 2026: Related Video link, CTA, reward the click, vertical live)