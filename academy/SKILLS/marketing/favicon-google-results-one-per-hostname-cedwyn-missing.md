# Favicon in Google results: Cedwyn has none (one icon per hostname, home-page <link rel=icon>)

Written 31 Oct 2026 (skills harvest). Not checked before this run: 'favicon' had no skill file, only an aside in google-news-2026-auto-publication-pages-news-sitemap.md.

## What the rule is (Google Search Central, "Define a favicon to show in search results", read in full, last updated 27 Oct 2026)
- Google shows ONE favicon per **hostname**. cedwyn.bucklerfamily.estate and library.bucklerfamily.estate can each have their own; /ebooks/ or /learn/ cannot have a different one (subdirectory = same site).
- Declared by a `<link>` in the **home page** head: `rel="icon"` (or `shortcut icon`, `apple-touch-icon`, `apple-touch-icon-precomposed`). href may be relative or on a CDN.
- Square (1:1), at least 8x8 px; Google recommends **larger than 48x48**. Formats: BMP, GIF, ICO, PNG, JPEG, PPM, TIFF (SVG is not on the list, so never ship SVG only).
- Googlebot must crawl the home page (and follow its redirects); **Googlebot-Image** must fetch the icon; neither may be robots-blocked.
- Keep the icon URL stable. Recrawl takes "several days to several weeks"; URL Inspection > Request indexing on the home page speeds it. Display is never guaranteed.
- Inappropriate imagery is replaced with a default icon.

## What the evidence states about effect (honest)
- No published controlled test ties a favicon to organic CTR. Digital Applied (2026, on Google Ads sitelink favicons) states plainly that no source has CTR data. So this is hygiene and brand recognition on a crowded results page, not a measured lift. Treat any "+x% CTR" claim as not checked.
- What is measurable: without a declared icon Google shows a generic globe. Every result for our site in Search, Discover and AI Mode source lists currently carries the globe, next to peers (Peoples Collection Wales, Coflein, NLW) who show their marks.

## Live audit, 31 Oct 2026 ~19:58Z (tools/favicon_check.py, Googlebot UA, cache-busted)
| host | declared icon | /favicon.ico | verdict |
|---|---|---|---|
| cedwyn.bucklerfamily.estate (all themes: /, /ebooks/, /learn/, /research/, /movie/, /wales/, /argentina/) | none | 404 (HTML) | FAIL - globe |
| bucklervsbp.bucklerfamily.estate | none | 200 but HTML, not an image | FAIL |
| library.bucklerfamily.estate | 13 sizes, 16-192 px PNG | - | PASS (eligible) |
| bucklerfamily.estate (apex, now a 301 to cedwyn) | - | serves a real 16/32/48 ICO (busy pixel-art farm roundel, not insignia) | n/a: Google reads the favicon of the host the apex redirects to |

## How to do it (the whole job is ~15 min)
1. Pick ONE simple mark that reads at 16 px: a single shape/letter on a solid square, high contrast. The apex roundel is too detailed at 16 px (figures blur); a plain glyph (e.g. a "C" or the Tŷ Mawr house outline) will read better. No insignia, no likeness of family members.
2. Export from one master PNG (Pillow is on the box):
   - `/favicon.ico` multi-size 16/32/48 (browsers and old bots request this path blindly; today it 404s on cedwyn, which also costs a log line per visit),
   - `/favicon-192.png` 192x192 (the one Google will scale; "larger than 48"),
   - `/apple-touch-icon.png` 180x180 (iOS home screen and share sheets).
   Example: `Image.open('mark.png').save('favicon.ico', sizes=[(16,16),(32,32),(48,48)])`.
3. Put in the **shared head** of every Cedwyn theme (one partial, so all themes match):
   ```html
   <link rel="icon" href="/favicon.ico" sizes="48x48">
   <link rel="icon" href="/favicon-192.png" type="image/png" sizes="192x192">
   <link rel="apple-touch-icon" href="/apple-touch-icon.png">
   ```
4. Serve the three files from the site root with a long cache; never rename them later (stable URL rule). If the icon must change, change the bytes, keep the path.
5. Verify: `timeout -k 5 120 python3 the project workspace cedwyn.bucklerfamily.estate` must print PASS. Then Search Console > URL Inspection > the home page > Request indexing (property sc-domain:bucklerfamily.estate already verified).
6. Re-check the real results page 2-3 weeks later (search `site:cedwyn.bucklerfamily.estate`); if still a globe, re-run the checker (robots, content-type, square) before anything else.
7. Same three steps for bucklervsbp if it stays a separate public host; its /favicon.ico currently returns an HTML page with 200, which is worse than a 404 (fix the route to return the icon or a real 404).

## How we apply it to Cedwyn (PROPOSED, needs the project lead's GO; nothing committed)
- PROPOSED patch: add the 3 icon files at the cedwyn root + the 3 `<link>` lines to the shared head partial of all themes, via a labelled site-wide PR (root merges; never cancel a running Cedwyn build). Markup only, no body text, no outbound links.
- Design choice is the project lead's: option A reuse the apex farm roundel (already his, but blurs at 16 px); option B a plain "C" / house-outline glyph in the site's accent colour (recommended for legibility). Without a reply, the agent-library/onpage runs should use B as a placeholder only after GO.
- Measurement: before/after screenshot of `site:cedwyn.bucklerfamily.estate` on mobile; Search Console branded-query CTR for the 28 days before vs the 28 days after (expect noise; report it as "not a controlled test").
- Add favicon_check.py to the weekly onpage audit list (CEDWYN ONPAGE RUN) so a theme that drops the partial is caught.

## Sources
- developers.google.com (read in full, upd 27 Oct 2026)
- digitalapplied.com (snippet: "No source provides any CTR data tied to sitelink favicons"; not opened)
- Live checks 31 Oct 2026 ~19:56-19:59Z with tools/favicon_check.py (own script, no install).