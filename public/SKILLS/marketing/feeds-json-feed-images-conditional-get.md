# Skill: feeds that readers and aggregators handle well (JSON Feed 1.1, images, conditional GET)

This builds on `rss-atom-feed-websub-static-site.md` (the Atom basics and WebSub). It adds what makes a feed look right in Feedly, Inoreader, NetNewsWire and similar readers, and what keeps polling cheap.

## Facts it rests on
- **JSON Feed 1.1 rules** (jsonfeed.org, read 27 Oct 2026):
  - Required fields: `version` (the spec URL), `title` and `items`.
  - Each item needs an `id`, and **content_html or content_text must be present**.
  - The `id` must stay unchanged when the item is updated, and must never be reused. Ideally it is the item's full URL.
  - `summary` is a plain-text sentence or two for timelines.
  - `image` marks the main image, which readers use as the thumbnail.
  - `date_published` and `date_modified` use RFC 3339.
  - `language` is RFC 5646.
  - Serve it as **`application/feed+json`**. Readers fall back to application/json.
  - Size: "under 100K is ideal, and 250K is fine"; 1 MB burdens readers.
  - `hubs` lists WebSub hubs.
- **What readers actually do** (Inoreader "RSS feed example, every element explained", read):
  - They strip scripts, frames and forms from item content.
  - The list-view picture comes from `media:thumbnail`, an image enclosure, or the first `<img>`.
  - Lazy-load markup (a placeholder in `src`, the real image in `data-src`) shows a blank, because readers don't run the swap JavaScript. All URLs must be absolute.
  - Readers show the full HTML when it is present, otherwise the description.
  - `guid`/`id` must be stable, or readers show duplicates.
- **Conditional GET is how readers poll cheaply.** Joshua Rogers (Jan 2025, read) and Rachel Kroll's long-running feed-reader tests explain the mechanism:
  - The server sends `ETag` and/or `Last-Modified`.
  - Well-behaved readers send `If-None-Match` / `If-Modified-Since` and get a `304 Not Modified` with no body.
  - Rogers shows Feedburner breaking this, so every poll re-downloads the whole feed.

## How to do it (steps)
1. **Build one item list, render three formats** from it: RSS 2.0, Atom and JSON Feed. Every format uses the same id, title, summary, dates and image.
2. **Per item:**
   - `id` = the canonical page URL, never changed.
   - Title of 70 characters or fewer.
   - A 1-2 sentence plain `summary`.
   - `content_html` with a short excerpt plus a "read on Cedwyn" link. Excerpt, not full text, so readers come to the site; this matches `syndication-canonical-noindex-medium.md`.
   - An absolute `image` (1200x630 og image), also as `media:thumbnail` in RSS/Atom.
   - `date_published`, and `date_modified` only when the content really changed.
3. **Keep feeds small:** the latest 20-30 items, and under 100 KB.
4. **Headers:**
   - Content types: `application/feed+json`, `application/rss+xml` and `application/atom+xml`, each with `charset=utf-8`.
   - `Cache-Control: public, max-age=900-3600`.
   - Send **ETag or Last-Modified**. Cloudflare Pages static assets send an ETag by default. If a Worker builds or rewrites the response, it must set the ETag itself (e.g. a hash of the body) and answer a matching `If-None-Match` with 304.
5. **Autodiscovery:** in every page `<head>`, add `<link rel="alternate" type="application/rss+xml|application/atom+xml|application/feed+json" title="…" href="…">`. Keep it to at most one link per format, plus per-section feeds only where they're real.
6. **Validate** each format: the W3C feed validator for RSS/Atom, and the JSON Feed validator or a schema check for JSON. Also check with curl:
   - `curl -sI` shows the right content-type and an ETag;
   - a repeat request with `If-None-Match: <etag>` returns 304;
   - every item image URL returns 200.
7. **On change only:** ping the WebSub hub and IndexNow after the deploy is live. Never ping on a no-op build.

## Pitfalls
- Item ids that change on each build (timestamps, build hashes) make readers show every post again as new.
- A `<updated>`/`date_modified` that moves on every build makes the feed look edited when nothing changed.
- Relative image or link URLs, or lazy-loaded images, give blank thumbnails.
- Edge code that drops ETag means every poll is a full download.

## How we apply it to Cedwyn
- **Live, 27 Oct 2026 03:24Z (curl, cache-busted):**
  - `/feed.xml` is Atom (e-books): 9.8 KB, 14 entries, 13 thumbnails, hub link.
  - It sends **no ETag or Last-Modified**: requests with `If-None-Match` or `If-Modified-Since` both return 200, not 304.
  - The response carries an `x-agent-ready` header, so edge code touches it; that is the likely place the ETag gets dropped.
  - The homepage has **no `rel=alternate` feed autodiscovery link**.
  - **robots.txt lists `/sitemap.xml`, which returns 404**. `/sitemap-core.xml` returns 200.
  - These are PROPOSED fixes for the blog worker and the onpage flywheel; this run edited nothing.
- **For the new /blog/ feeds** (the worker is building rss.xml, atom.xml and feed.json):
  - Use the item rules above, with the id = the Cedwyn page URL.
  - For trilingual posts, either one feed per language (`language` set) or the post language on each item. Never mix cy/en/es text inside one item.
  - Keep Wales and Argentina posts distinct by tag.
  - The social auto-poster (`feed-to-social-auto-posting-posse.md`) keys on the same JSON Feed `id`.

## Sources
- jsonfeed.org (read 27 Oct 2026; spec)
- inoreader.com (read; reader behaviour)
- joshua.hu (read; Jan 2025, conditional GET, citing Rachel Kroll's feed-reader tests)
- developer.mozilla.org (snippet)