# instagram stories + highlights as the profile menu for a brand-new account (2026)
harvested 2026-10-27. goal: give @cedwynestate (created 27 oct 2026, 0 posts) a profile that converts visitors before it has a grid, and a stories habit that fits a tiny account.

## facts that matter (with sources)
1. **small accounts get the best stories reach.** socialinsider 2025 stories benchmarks (161,180 stories, published 26 jun 2025): reach rate (reach / followers) for 1-5k-follower accounts = **9.55% image, 10.40% video**, falling to 3.5-4.2% at 5-10k and 1.35-2.0% at 10-50k.
2. **sequence length: 6-13 frames is the sweet spot.** same study: reach rate climbs from 6.3% at 1 story to 20.5% by story 6 and peaks at 37.8% by story 13, then dips. **most exits happen after the first 3 stories** and exit rates rose vs 2024 -> the first 3 frames carry the hook.
3. **under 10k followers, video frames hold attention better** (lower tap-forward than images; socialinsider). image frames are fine for documents/maps; mix.
4. **cta frames get rewatched — put them in the middle or near the end, not last** (socialinsider: "tap the link", "reply" slides are impression magnets).
5. **role of each format** (metricool 2026 instagram study, 24.4m posts / 375k accounts): reels attract new audiences, carousels earn saves (9x more than single images), **stories nurture existing followers**; stories reach dipped slightly in 2025-26 but stay the connection format. single-image posts: reach -22% yoy.
6. **link stickers are available to every account** regardless of follower count (replaced swipe-up; socialinsider metrics guide). link-sticker taps are the stories conversion metric; insights keep story metrics ~14 days in-app.
7. **highlights are the only way a story outlives 24 h** and they sit directly under the bio, above the grid (instagram help: "add a story to your story highlights"; tap highlight on your own story). edit/remove via more > edit highlight.
8. **api limits:** the instagram graph api can create a **story** container for a business account (ig user media reference: "create an image, carousel, story or reel ig container"). stickers (incl. link stickers) and highlight creation are not offered through the api — **not checked against the full meta reference**; plan for highlights + link stickers to be added once in the app by the owner.

## the playbook
1. **5 highlights, fixed order, plain covers** (same colour, one word, no faces/insignia): start here · e-books · wales · patagonia · maps. covers are 1080x1920 images with the word centred; upload as the highlight cover (no need to post them as stories).
2. **seed each highlight with 3-6 frames** before following anyone: frame 1 = the hook (a period map or photo + one line), middle = 2-4 evidence/story frames, near the end = the cta frame (link sticker to the matching cedwyn page with utm), last frame = a calm closer.
3. **weekly story run, 6-10 frames, 2-3x a week**: first 3 frames do the work (strongest image/video first), one link-sticker frame around frame 5-7, one poll/question sticker (replies are a strong signal and give us questions for the qa page).
4. **after each run, pin the best frames into a highlight**; drop weak ones. highlights then become the evergreen menu while the grid is thin.
5. **measure**: per run note reach, exits after frame 3, link taps, replies (insights 14-day window: log within 2 weeks). target for a new account: reach rate near the 1-5k benchmark (~10%) once followers exist; link taps / reach rising run over run.

## how we apply it to cedwyn
- account: @cedwynestate (business, landmark & historical place), link field empty until the owner adds cedwyn.bucklerfamily.estate/ebooks in the app. until then **highlights + link stickers are the only tappable route to /ebooks/** — so this is the first thing to set up, before regular posting.
- links (utm, lowercase, our vocabulary in utm-discipline-ga4-funnel.md): utm_source=instagram&utm_medium=social&utm_campaign=story_<highlight>&utm_content=<yyyymmdd>. target pages: /ebooks/ (e-books), /patagonia/ (patagonia), the wales landing (wales), the maps/catalogue page (maps), the home page (start here).
- content comes from existing cleared material only: estate maps, the garden gallery pieces, record extracts already public on the site; no people, no insignia, never naming the owner, none of the banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken), no accusations about named people.
- division of labour: tab renders covers and frames and can publish plain story frames via the api (once ig_post.py is extended for the new account and a story container is tested); the owner adds link stickers and creates/names the 5 highlights in the app once (about 10 minutes). that ask rides the next message that already goes to him; it is not a separate ping.
- don't post anything until the owner approves going live on the new account (worker brief: "post nothing yet").

## sources
- socialinsider.io (elena cucu, 26 jun 2025, read)
- socialinsider.io ; socialinsider.io (snippets: link sticker for all accounts, 14-day insights)
- metricool.com (read) ; metricool.com (snippet: single-image reach -21.96%)
- help.instagram.com ; help.instagram.com (snippets: add/edit highlights)
- developers.facebook.com (snippet: story container)