# Video sitemap + watch pages for self-hosted documentary scenes

Harvested 2026-10-30 (skills harvest). Topic: getting self-hosted video into Google's video results. Builds on `webvtt-tracks-videoobject-clip-self-hosted-documentary-scenes.md` (markup and tracks); this file covers the sitemap and the indexing gates the markup can't fix on its own.

## What Google states (primary docs, read 30 Oct 2026)
- **Required tags** per `<url>`: `<video:video>`, `<video:thumbnail_loc>`, `<video:title>`, `<video:description>` (max 2,048 chars, must match the page's description in substance), plus EITHER `<video:content_loc>` (the media file) OR `<video:player_loc>`. Google recommends `content_loc` "if possible": it is "the most effective way for Google to fetch your video content files". `content_loc` and `player_loc` must not equal the page `<loc>`. Namespace `google.com
- **Useful optional tags:** `<video:duration>` (1-28,800 s), `<video:publication_date>`, `<video:expiration_date>` (omit if the video doesn't expire). Several `<video:video>` blocks can sit under one `<loc>`, one per video on that page.
- **Indexing gates (Video SEO best practices):** the watch page has to be indexed AND "performing well in Search" before its video is considered. The video has to be on a **watch page**, meaning a page whose main purpose is that one video. It can't be hidden behind other elements. The thumbnail needs a stable URL. Supported files include **WebM** and MP4. Data URLs and fast-expiring CDN URLs fail.
- **Video indexing report reasons (Search Console Help):**
  - "Video isn't on a watch page": the video supports the text rather than being the main content, as on a blog post.
  - **"Cannot determine video position and size"**: the page shows an image where the player will go, and the visitor has to click it to load the player. The fix is to load the player at its real size and position when the page loads.
  - "No thumbnail URL provided".
- A sitemap with indexed video pages links to the Video page indexing report from the Sitemaps report.

## Practitioner numbers
I found no first-hand case study with before/after numbers this run. What turned up was vendor and agency blogs saying things like "cuts discovery time from weeks to days" with no data behind them, so I haven't used them. So treat this as plumbing: measure the Video indexing report for 8 weeks before claiming any effect.

## How-to (one pass, build-time)
1. **One watch page per scene,** e.g. `/documentary/scene-03/`. Each has an H1 with the scene title, the `<video>` element in the static HTML at full size with a `poster` (not a JS-swapped image), a 2-3 sentence description, a transcript below, and the VideoObject from the WebVTT skill. The `/documentary/` hub stays a listing page; Google won't treat it as a watch page.
2. **Build `video-sitemap.xml`**, one `<url>` per watch page:
   - `content_loc`: the WebM's permanent URL.
   - `thumbnail_loc`: a JPEG/PNG at a permanent URL, at least 60x30 px; 1280x720 is better.
   - `title` and `description`: taken from the same source as the page, so they always match.
   - `duration`: from `ffprobe`.
   - `publication_date`: the date the scene was published.
3. **Add it to the sitemap index:** `sitemap.xml` is a sitemapindex today, so add one `<sitemap>` entry, and add a `Sitemap:` line to robots.txt. Submit it once in Search Console (the connected `google_search_console` app).
4. **Check:** URL Inspection on one watch page should show a "Video indexing" section. Then read the Video indexing report weekly and log the reasons it gives.
5. **Stable URLs:** never use commit-hash or `?t=` cache-buster URLs in the sitemap. Use branch paths or a release path that won't move.

## How we apply it to Cedwyn
Live check, 30 Oct 2026 03:56Z, cache-busted:
- `robots.txt` has no Sitemap line.
- `sitemap.xml` is an index of `sitemap-core.xml` + `blog/news-sitemap.xml`, with **no video sitemap**.
- `/documentary/` has one `<video id="cm-video" preload="metadata" muted>` and no VideoObject.
- `movie.js` (page v1.4.3) builds the clip URL at runtime as `raw.githubusercontent.com + the clip path, and shows the artwork first; the visitor taps to play.

That gives three concrete gaps:
- **(a) No watch pages.** One hub page for all scenes means "not a watch page". Generate a static `/documentary/scene-NN/` page per door from the manifest the player already reads.
- **(b) Tap-artwork-to-play.** This is exactly the "Cannot determine video position and size" pattern. On the watch pages, render the real `<video>` with `poster=` at its real size on load. The hub page can keep the artwork door; the watch pages are what get indexed.
- **(c) Raw-GitHub media host.** A `content_loc` on another host is allowed. But raw GitHub serves binaries as a generic type and its URLs depend on the branch, so the stable-URL and file-type acceptance there is **not checked**. Preferred: copy each final WebM + poster to a Cedwyn path (Pages/R2), or at minimum a fixed branch path.

Ownership: this is a hand-off for the documentary player worker lineage and the build. Don't edit the player from a skills run. Order of work:
1. watch pages + video sitemap in the build (one generator, about 40 lines of Python, stdlib only);
2. robots Sitemap line;
3. Search Console submit;
4. weekly reason log in `the project workspace`.

Public text rules still apply to the titles and descriptions: Welsh-first where the scene is Welsh, no banned words, never name the project lead. No install: the sitemap is plain XML and duration comes from ffprobe, which is already on the box.

## Sources
- developers.google.com (read)
- developers.google.com (read)
- support.google.com (Video indexing report, read)
- support.google.com (Sitemaps report, snippet)