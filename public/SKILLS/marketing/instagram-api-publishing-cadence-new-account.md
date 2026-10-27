# Instagram API publishing for a new account: what it can post, what it can't, and how often (@cedwynestate)

Harvested 27 Oct 2026 (skills harvest run). Purpose: @cedwynestate went live 27 Oct 02:00 GMT as a Business account connected for API posting, with no posts yet. This file is the posting playbook for it: which formats the API takes, which jobs stay manual in the app, and the cadence that the largest frequency study supports.

## 1. What the API can publish (Meta's own docs, read 27 Oct 2026, API v26.0)
- **Single image**: JPEG only. MPO/JPS, shopping tags and filters are not supported.
- **Carousel**: `media_type=CAROUSEL` with `children` = "up to 20" container ids. The same page's diagram still states 10, and older guides say 10. Use 10 until one 11+ test carousel succeeds. Every slide is cropped to the first image's ratio (default 1:1), so make the first slide 4:5 if you want 4:5.
- **Reels**: `media_type=REELS`. Optional: `cover_url` or `thumb_offset`, `audio_name` (original audio only), `share_to_feed`, `collaborators`, `user_tags`, `location_id`.
- **Trial reels** (shown to non-followers first): add `trial_params` with `graduation_strategy` = `MANUAL` (you graduate it in the app) or `SS_PERFORMANCE` (it goes to followers automatically if it performs). See instagram-new-account-90-days-trial-reels-gate.md for when trials make sense.
- **Stories**: `media_type=STORIES`. **Link, poll and location stickers cannot be published**; @-mentions without a sticker can. Stories expire after 24 h.
- **Alt text**: `alt_text` on image posts (added 24 Mar 2025). Reels and stories don't take it.
- **Location**: `location_id` = the Facebook Page id of a place.
- **AI disclosure**: `is_ai_generated=true` self-labels AI-made media.
- **Rate limit**: "100 API-published posts within a 24-hour moving period; carousels count as a single post". The carousel section of the same page still states 50. Either way it is far above our cadence. `GET /<IG_ID>/content_publishing_limit` returns current usage.

## 2. What stays manual in the Instagram app (no API route)
- The profile **link field** (the account-setup run on 27 Oct confirmed this too).
- **Highlights** and story **link stickers**. This settles the open question in instagram-stories-highlights-profile-menu-new-account.md: the API can post the story frames, but the owner adds the link stickers and pins the Highlights, once, in the app.
- Product/shopping tags and filters.

## 3. How often to post (practitioner data)
- Buffer, Aug 2025 (Julian Winternheimer's analysis, read): **2.1 million posts from 102K accounts**, split into 0 / 1–2 / 3–5 / 6–9 / 10+ feed posts a week (reels, photos and carousels; stories excluded).
  - **3–5 posts a week more than doubled follower growth** compared with 1–2 a week.
  - It lifted **reach per post by about 12%** over the account's own baseline.
  - 6–9 and 10+ a week grow faster still, with diminishing returns. Buffer's own conclusion: "the best posting schedule is one you can stick to consistently."
- Stories reach existing followers, not new people (same study), so for growth the feed posts come first.

## 4. Recipe: a weekly batch for a small heritage account
1. Plan **4 feed posts a week**, made in one sitting and published by API on fixed days, for example:
   - Tue: carousel, a record + map + place-name slide, with alt text on every image slide.
   - Thu: reel, 15–40 s from existing footage. Make it a trial reel (`MANUAL`) while the follower count is under ~100.
   - Sat: single image, an archive photo or map detail, with alt text.
   - Sun: second carousel or reel.
2. **Alt text on every image**: describe what is visible (map sheet, field names, building outline) in plain words, under ~125 characters. It helps screen readers and gives Instagram search/indexing a text signal. instagram-search-seo-google-indexing.md covers keywords.
3. **Location** on place posts (Llandough, Penarth, Trelew/Gaiman for the Patagonia half) once the place's Facebook Page id is found. Keep Wales and Patagonia posts separate.
4. **Captions**: the first line carries the hook (it is all that shows before "more"). End with the typed address cedwyn.bucklerfamily.estate/ebooks, because links in captions aren't clickable.
5. **Disclose AI**: anything generated or restyled (e.g. Garden Gallery pieces) gets `is_ai_generated=true`. Plain archive scans and photos don't.
6. Check `content_publishing_limit` before a backfill, and log every permalink.
7. **After 4 weeks** read follows per week and reach per post for each format. Shift the mix toward the format with the best follows per post; keep the total at 3–5.

## 5. How we apply it to Cedwyn
- **Tooling gap:** the project workspace is hard-wired to @shbuckler's IG id and posts **Reels only**. Before @cedwynestate can post, someone has to:
  - add an `--account` switch that reads @cedwynestate's IG user id from the instagram connection added 27 Oct;
  - add image/carousel containers with `alt_text`, plus `location_id`, `is_ai_generated`, `trial_params` and `collaborators`.
  Keep its existing caption guard (no name, banned words, prices). Proposed, not done in this run.
- **First month:** 4 posts a week from material already on the site (estate maps, record cards, Patagonia house). Keep all of it non-human and non-heraldic, never name people, and use none of the banned words. Quote cards from the Tuesday quote-pack can feed the Tue carousel.
- **One manual job for the owner** (fold into a message already going to the project lead, never a separate ping): add link stickers to the five Highlight covers and pin them (~10 min). It joins the link-field item he was already asked about at 02:02 GMT.
- **Measure:** add @cedwynestate followers and reach to the Sunday growth report row.

## Sources
- Meta for Developers, Content Publishing (read 27 Oct 2026): developers.facebook.com
- Meta for Developers, IG User Media reference (stickers line, parameters; read 27 Oct 2026): developers.facebook.com
- Buffer, "How Often Should You Post on Instagram in 2026? What Data From 2 Million Posts Tells Us", 13 Aug 2025 (read): buffer.com
- Social Media Today summary of the same study: socialmediatoday.com