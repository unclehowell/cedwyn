# Instagram covers: what the thumbnail must do, and how Cedwyn makes them

Written 29 Oct 2026 (Instagram thumbnails fix). Tool: `the project workspace` (wired into `pr-syndication/social.py` and `ebook-promo/ig_post.py`).

## What was wrong on @cedwynestate (audit, 29 Oct 2026, Graph API `me/media`)
- Only 3 posts exist, all IMAGE feed posts (every Reel attempt had fallen back to an image post).
- All 3 were the site's 1.91:1 share card (1080x567). The profile grid is 3:4, so the tile kept only a narrow middle slice; the record image read as a postage stamp.
- 2 of 3 were the SAME picture: a screenshot of the website's map app, UI chrome and small print, unreadable at tile size, no headline. The screenshot also carried the site footer line with the owner's agent signature.
- No post had a headline on the image. Reels had no `cover_url` and no `thumb_offset` (ig_post.py documented `--thumb-offset` but never sent it).

## What practitioners say (2026 and the grid change)
- Grid tile is 3:4 since Instagram's Jan 2025 change (Engadget, read for the 27 Oct note `instagram-reels-from-stills-api-cover-grid-safe-zone.md`). Reel covers upload at 9:16; the tile shows the centre 1080x1440 (y 240-1680). A feed share can show the centre 1:1 (y 420-1500). Keep headline + mark inside both.
- Mosseri (Jan 2025): watch time, likes and sends are the top ranking signals; for non-followers sends weigh more. The cover is what earns the tap from the grid and from Explore/Reels-tab browsing; frame 0 is what stops the scroll in the feed. So frame 0 = the cover.
- Graph API (Meta IG User Media reference; Postproxy 2026 guide): `cover_url` = public JPEG (ideally 1080x1920), centre-cropped if off-ratio, overrides `thumb_offset` (ms). Neither set = Instagram picks frame 0.
- Covers cannot be changed through the API after publishing (no update endpoint for media beyond `comment_enabled`); only the Instagram app's Edit > Cover does it, by hand. Plan covers before posting.
- Common practitioner rules (creator guides, not checked snippets, consistent across sources): one short headline of 3-7 words in a heavy font, high contrast plate, consistent template so the grid reads as a series, no small print, no screenshots of UIs.

## How we apply it
- `cover.py make(image, headline, kicker)` writes `-reel.jpg` (1080x1920) and `-feed.jpg` (1080x1350) plus .webp twins. Playfair Display Bold headline, auto-fit 124->80 px, max 3 lines; gold letter-spaced kicker (year or place); gold rule + CEDWYN wordmark; ink gradient behind the text; record image full-bleed or fitted over its own blurred fill. Website screenshots swap to the fallback record image; phone captures of records lose their app bars; banned public words and the owner's name are refused.
- `headline_for(item)` turns "1824: the first record..." into kicker 1824 / headline "The first record...", and a bare place-name title into the summary's first clause.
- social.py: the daily Reel is now rendered FROM the 9:16 cover (slow 4% push-in), so frame 0 is the cover, and the same JPEG goes as `cover_url` (fallback `thumb_offset=0`). The image-post fallback uploads the 4:5 cover instead of the 1.91:1 card. `--dry` renders the covers; `--only instagram` limits a run to one channel.
- ig_post.py: `--cover cover.jpg`, or `--headline ".." [--kicker ..] [--cover-image img]` renders one from a frame at `--thumb-offset` (default 1 s); if the cover cannot be made or hosted it sends `thumb_offset` in ms. `upload()` now stores the right Content-Type (image/jpeg for covers).
- Measure: compare reach/plays per Reel before and after 29 Oct in the Sunday growth report.

## Hosting gotcha (found 29 Oct 2026)
wayback.bucklerfamily.estate serves R2 objects only under /pdf/. Any other key answers the site's HTML page with HTTP 200, so a HEAD check passes and Instagram then fails the container ('container error' for video, 36001 'image format is not supported' for images). Keys now live under pdf/promo/...; ig_post.upload() rejects a text/html answer. First Reel posted with a designed cover after the fix: instagram.com