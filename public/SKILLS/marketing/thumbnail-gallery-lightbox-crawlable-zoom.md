# Thumbnail gallery + lightbox that converts and still gets indexed

Harvested 2026-10-27 10:58Z (skills harvest). Trigger: today's /argentina/ and /wales/ change to thumbnails that open in a full-width swipe lightbox. google-images-lens-archive-photos already covers the image SEO basics (alt text, `<img>` not CSS, sitemaps). This skill covers the gallery pattern itself: what users do with thumbnails and zoom, and how to keep full-size images crawlable behind a lightbox.

## What the evidence shows
- **Baymard, image resolution & zoom (large-scale usability testing, read):** 56% of users' first action on a product page was to start exploring the images. 25% of benchmarked sites had images too low-resolution or too little zoom for users' needs, and poor images caused abandonments. Users "often need to zoom more" than a gallery overlay gives them.
- **Baymard, mobile gestures (benchmark of 50 top-grossing US mobile sites, 2016, read; dated but still Baymard's current article):** users repeatedly try pinch, double-tap and swipe on gallery images; 40% of sites failed to support these gestures.
- **Baymard, thumbnails (2020, read):** galleries that signal extra images only with dots or text made some users miss the images entirely, and others struggled to tap the dots. 100% of desktop benchmark sites used thumbnails; only 24% of mobile sites did.
- **Google Search Central (read):** Google finds images in the `src` of an `<img>` element and does not index CSS background images. Always give a `src` fallback when using `srcset`/`<picture>`. Links are crawled only as `<a href>`.
- **May-Fly (UK SEO practitioner), alt text tests (small data set, their numbers):**
  - A fashion e-commerce site: +230% daily clicks from image search and +33% overall clicks over 8 weeks vs the prior 8.
  - A marketplace: organic clicks +48% and impressions +500%. The writer notes up to 25% of searches in some sectors are image-based (Ahrefs/Semrush data).
  - These are uncontrolled before/after results; treat them as direction, not proof.

## How to do it
1. **Thumbnails are real links to the full image:** `<a href="/img/full/x.jpg" class="lb"><img src="/img/thumb/x.jpg" alt="..." width=.. height=.. loading="lazy"></a>`.
   - The JavaScript intercepts the click to open the lightbox.
   - Without JavaScript (and for crawlers) the `href` opens the full file, so Google can still discover the large version.
   - Never put the full-size URL only in `data-src` or JSON.
2. **Lazy-load only below the fold:** the first visible row uses `loading="eager"` (or no attribute). Always set `width`/`height` to avoid layout shift. Native `loading="lazy"` keeps the image in `src`, which Google reads.
3. **Show that more images exist:** use a visible thumbnail strip or grid, not dots alone (Baymard). On mobile, a horizontal strip that shows a part of the next thumbnail signals "swipe for more".
4. **Lightbox behaviour:**
   - Full viewport width, `object-fit: contain`.
   - Swipe left/right, arrow keys, looping; Escape, ✕ or swipe-down closes.
   - Pinch-zoom and double-tap zoom must work (Baymard's 40% failure). Don't block `touch-action` on the image, and don't set `user-scalable=no`.
   - Preload one image either side of the current one.
5. **Caption in the lightbox = the image title plus its source line.** Each image can also link to its own record or artifact page from the caption: "View record →" as a plain `<a href>`. That is where reading depth and the e-book link sit.
6. **Resolution:** full image ≥1600 px on the long side for scans of documents (readers zoom into text). Thumbnails around 400 px WebP. Keep each full file under the site's size limits; compress, don't downscale, document scans.
7. **Accessibility:** `role="dialog"`, `aria-modal="true"`, focus trap, focus returns to the thumbnail on close, and alt text carried into the lightbox `<img>`.
8. **Measure:** Search Console → Search type: Image, filtered to `/argentina/` and `/wales/`. Note image clicks/impressions the week before and 4 weeks after. GA4/Cloudflare: clicks from lightbox caption → record page and → /ebooks/ (UTM `utm_content=lightbox`).

## How we apply it to Cedwyn
- Check the lightbox worker's output (6e7fa5e9) against points 1, 4 and 6 once it is live:
  - Does each thumbnail sit inside an `<a href>` to the full file?
  - Does pinch-zoom work in the modal?
  - Do document scans (RCAHMW sheets, 1988 cuttings, when shown on /wales/) open large enough to read at 390 px?
  If not, file it as a PROPOSED fix for the onpage flywheel, not a new worker.
- NFT art on /argentina/ (81 images): caption = the existing title plus a "View record" link to its #/NFA-NNNN page, so a swipe session ends one tap from the gallery/shop.
- Evidence scans: link from the caption to the artifact page, whose "Cited on" list is the companion skill (cited-on-backlinks-evidence-records.md). This gives two-way paths: gallery → record → citing pages → /ebooks/.
- Editorial: the captions reuse existing titles only (no new wording, no banned words). No outbound links in captions. Wales images stay on /wales/ and restored NFTs stay on /argentina/.
- Sources: baymard.com ; baymard.com ; baymard.com ; developers.google.com ; developers.google.com ; may-fly.co.uk