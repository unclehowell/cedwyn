# Search Console platform properties: Google traffic to our YouTube, Instagram, X and TikTok
Harvested 2026-10-26 (skills harvest 19:52). Fits: analytics + SEO. New property type; not covered by search-console-video-indexing-watch-pages.md (our own site's video pages) or gsc-striking-distance-quick-wins.md (site queries).

## What it is (read on Google's own pages)
- Announced 7 Jul 2026; **globally available 29 Jul 2026** (Google Search Central Blog, Waisberg & Sassman, read). The Help page still describes a gradual rollout, so an account may not have it yet (Search Console Help 17148418, read).
- Supported: **Instagram, TikTok, X, YouTube**. Each account/channel is its own property.
- Shows how that content performs on **Google Search, Discover and News**: clicks, impressions, CTR, position, queries. It does **not** show in-app views.
- Reports: Performance, Insights (top / trending up / trending down query groups; 24-hour filter for sudden spikes), Achievements (Seo Kreativ, Oct 2026, read).
- Counting quirks (Help): an Instagram story shown in Google = an impression; a video played inside Google's viewer still counts as a click.
- Setup: Add property -> pick the platform -> sign in to that platform to prove ownership -> data in a few days (agency report: ~48 h, Visilay). Ownership is re-checked; if the platform login expires the property pauses until re-verified, with no data lost.
- Google's guide suggests: Insights query groups as topic/caption ideas; 24-h filter to spot a post Google suddenly favours and cross-promote it; export all platforms into one sheet; find older videos regaining traction (pin them / make a part two); **Search Console annotations** to mark a title or caption rewrite and see its effect; compare playlists or Shorts vs long-form with page filters.

## How to do it
1. In the Google account that already owns the cedwyn/domain properties: Add property -> YouTube (channel), then Instagram, X, TikTok, one by one.
2. Sign in to each platform when asked (the platform account owner must approve).
3. Wait 2-5 days. Then weekly (Sunday report): per property, clicks + impressions + top 5 queries; export CSV into the project workspace
4. Each time we rewrite a YouTube title/description or an Instagram bio, add a Search Console annotation with the date and change.
5. Monthly: Insights "trending up" queries -> feed the next post/episode topic list; any 24-h spike -> share that post on the other channels the same day (within caps).
6. Small numbers will read as zero for a while; record "0/0" rather than skipping, so the trend exists.

## How we apply it to Cedwyn
- Why it matters for us: cedwyn's own site shows ~0 Search Console clicks, but YouTube (41 videos, ~1,955 lifetime views) and Instagram reels can appear in Google's video carousels. This is the only way to see whether Google sends anyone to them, and on which searches (e.g. Welsh place names, Patagonia, farm history).
- **Do now (read-only analytics, no public change, no new channel):** add YouTube and Instagram platform properties in the Google account that owns the existing Search Console properties; X (@ account already logged in on the browser) and TikTok (login blocked) after. If the browser cannot reach that Google account's Search Console, list it as a held owner-only item; do not ask today.
- Check whether the connected Search Console app can read platform properties via the API (not checked this run); if not, the weekly numbers are a browser read.
- Add three columns to the weekly growth row: yt_google_clicks, ig_google_clicks, top_query.
- Use annotations for every title/caption rewrite made under youtube-test-compare-titles-thumbnails.md and instagram-search-seo-google-indexing.md, so the effect can be read 4 weeks later.
- Bar for "worth it": any property with 20+ Google clicks in 28 days gets its top query turned into a page or episode; nothing after 8 weeks -> keep as a monitor only.

## Sources
- developers.google.com (29 Jul 2026) - read
- support.google.com (About platform properties) - read
- seo-kreativ.de/en/blog/google-search-console-platform-properties/ (Christian Ott, upd 16 Oct 2026, practitioner) - read
- visilay.com (agency connecting client accounts since Aug 2026, ~48 h to first data) - read
- No small-account case study with numbers found yet; measure our own.