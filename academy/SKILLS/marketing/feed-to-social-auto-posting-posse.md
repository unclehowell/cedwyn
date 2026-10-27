# Skill: auto-posting from the blog feed to owned social channels (POSSE done right)

Publish on Cedwyn first, then put a native-format copy on each owned channel that points home. Each platform handles links differently, so the auto-poster has to too.

## Why it matters (numbers)
- **Link posts under-perform native posts everywhere.** Buffer's *State of Social Media Engagement 2026* (52M+ posts, 10 platforms; read 27 Oct 2026) gives these median engagement rates:
  - Facebook: images 5.20%, video 4.84%, text 4.76%, link posts 4.43%. Facebook is the most format-neutral, so the cost of a link there is small.
  - Threads: video 5.55%, images 4.55%, text 2.79%, link posts 2.34%.
  - X: text 3.56%, images 3.40%, video 2.96%, link posts 2.25%.
  - LinkedIn: carousels (PDF) 21.77%, video 7.35%, images 6.52%, link posts 3.81%.
  - Buffer's own reading: platforms keep users on-platform.
- **A Bluesky link card is something the poster builds; it is not automatic.** The atproto "Posting via the Bluesky API" guide (read) states each client fetches the page's og:title, og:description and og:image itself. It uploads the image with `com.atproto.repo.uploadBlob` and attaches it as `app.bsky.embed.external` with `uri`, `title`, `description` and `thumb`. Links in the text also need `facets`, or they show as plain text. An RSS-to-Bluesky bot that skips this posts a bare, unclickable URL.
- **Mastodon link previews arrive as a stampede.** It's FOSS (read; 15k followers) reported 504s and minutes of downtime every time it shared its own link on mastodon.social, even behind Cloudflare. Google News and Reddit spikes did not cause this. NETSCOUT (Dec 2022, read) explains why: there is no shared preview cache, so every federated instance fetches the page for itself, almost at once. Mastodon issue #23662 describes hundreds to thousands of servers fetching each preview.

## How to do it (steps)
1. **Source = the feed.** Trigger on new feed item ids only. Keep a posted-log keyed by `item id + channel` and check it before every post, so a retry or a cron re-run can never post twice.
2. **Gate on live.** Post only after a cache-busted GET of the item URL returns 200 and its og:image returns 200. If the page isn't live yet, the card renders empty and most platforms never re-fetch.
3. **Native first, link second.** For each item, render a platform-native asset: an image (quote card or the item image) or a short clip, plus 1-2 lines of teaser.
   - Facebook page: the image post's caption carries the link, or the link goes in the first comment. Per our existing `facebook-group-community-and-link-limits.md`, the first comment is the safer route.
   - Instagram: an image or carousel with no clickable link. The caption states "full story on Cedwyn" and the bio or link page carries the URL.
   - Telegram channel: a full link with its preview is fine there, since it is a channel the reader opted into.
   - Bluesky: an image post, *or* a built external card (see the facts above). Count the text limit in graphemes and add link facets.
   - Mastodon: post the link (it's an owned account), but see step 5.
4. **Tag every outbound link per channel**, e.g. `?utm_source=bluesky&utm_medium=social&utm_campaign=blog`. Dark social hides the referrer otherwise (see `share-links-dark-social-web-share-utm.md`). Use one scheme only; Stripe reference tags stay separate (see `stripe-ga4-...`).
5. **Make the page stampede-proof before Mastodon.** Serve blog pages static from the edge cache, with a long `Cache-Control` max-age, no per-request Worker work on HTML, and a small og:image (under 300 KB).
6. **Pace it.** Send at most 1 auto-post per channel per item, and space items at least 3-4 h apart per channel. Keep well under each API's daily cap; for the Instagram publishing limit, see `instagram-reels-carousels-heritage.md`.
7. **Never auto-post to communities.** Reddit, Facebook groups and other people's spaces get manual, human-written posts only. Never DM anyone.
8. **Log** `channel, item id, post URL, time` and read engagement weekly. Drop any channel whose posts get 0 clicks for 4 weeks.

## Pitfalls
- Title-only robot posts ("New post: X <link>") are the format that does worst, and they read as spam.
- Posting a URL before the page is live gives an empty card, and the empty card is cached by the platform.
- Re-running the cron without the posted-log makes double posts, and that gets accounts restricted.
- Auto-posting the same text everywhere: write 1 teaser per platform tone (Threads/Bluesky conversational; Facebook plain).

## How we apply it to Cedwyn
- **Fit with the auto-blog worker** (CEDWYN BLOG + FEEDS worker, started 27 Oct 03:20Z):
  - The social step reads `/blog/feed.json`.
  - It keys its posted-log on JSON Feed `id`, which must be the permanent page URL.
  - It runs only after the live-check, and only on posts that passed the banned-word and privacy scan.
  - Drafts held by that scan are never posted.
- **Connected owned channels:**
  - Facebook page Great House Farm II: image + first-comment link.
  - Instagram @cedwynestate: image or carousel, link in bio.
  - Telegram: the link with its preview.
  - Bluesky and Mastodon only if the project lead supplies the accounts (HubSpot task); then use built cards and the stampede-proof check.
- **Reddit:** suggestions only, written to HubSpot for the project lead.
- **Live checks, 27 Oct 2026 03:24Z:**
  - `/feed.xml` is live: Atom, 14 entries, 13 thumbnails, hub link. It is the e-books feed.
  - `/blog/` and its feeds are 404 so far, because the worker is still building them.
  - Its responses carry `Cache-Control: public, max-age=3600` but no ETag or Last-Modified (see the feed-hygiene skill).
- **Fixed rules:** never name the project lead; no banned words in teasers; teaser text comes only from the page's own published summary.

## Sources
- buffer.com (read 27 Oct 2026; Buffer data, 52M+ posts)
- buffer.com (read; 45M+ posts, 19 Mar 2026)
- atproto.com (read; Bluesky external embeds, blobs, facets)
- itsfoss.com (read; practitioner testimony, 15k followers, 504s)
- netscout.com (read, Dec 2022)
- github.com (snippet)