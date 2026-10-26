# Google Images and Lens visibility for archive photos, maps and scans

Skill harvested 2026-10-26 (skills harvest 17:22). Scope: getting a heritage site's own photographs, map extracts and document scans found in Google Images and Google Lens, and turning that traffic into readers. Discover/max-image-preview and Commons uploads are separate skills already in the index.

## What the evidence shows

- **Google's own rules (Search Central, "Image SEO best practices", read in full):**
  - Images must be real `<img>` elements (also inside `<picture>`); Google does not index CSS background images.
  - Alt text is "the most important attribute" for image metadata; Google combines it with computer vision and the page's text. Keyword-stuffed alt text can make a site look spammy.
  - Place images near relevant text, on pages about the image's subject; captions and image titles are read.
  - Filenames give "very light clues": short and descriptive; translate filenames for localised pages.
  - Always give a `src` fallback when using `srcset`/`<picture>`.
  - An image sitemap can list images Google might not otherwise find, and its `<image:loc>` may point to another domain (a CDN) (image sitemap docs, read).
  - Structured data with an `image` property can earn badges in Google Images (Search Central, read).
- **Why it matters (dated figure):** SparkToro/Jumpshot 2018 data put Google Images as a large share of all web searches and noted its share shrank only because Google web search absorbed image results (Rand Fishkin, read in full). This is 2018 data; no 2026 share figure was found that we could read in full.
- **No case study with numbers** for a heritage site's image traffic was found this run; measure our own baseline instead (step 7).

## How to do it

1. **Inventory.** List every original photo, map extract and scan on the site with its page URL. Mark which are only in PDFs or CSS (invisible to Images).
2. **One page per important image.** The image sits on the page that discusses it, with a visible caption: what it shows, place, date as recorded, and source/archive reference.
3. **Alt text:** describe what is visible in one sentence (8-15 words), including the place name and date if shown. Not a list of keywords.
4. **Filenames:** lower-case, hyphenated, descriptive (`llandough-farmhouse-front-1970s.jpg` style, using only what the record states). Rename before publishing; set redirects if renaming live files.
5. **Size and format:** serve WebP/AVIF with a JPEG `src` fallback via `<picture>`; width at least 1200 px for the main image so it qualifies for large previews; lazy-load below the fold only.
6. **Image sitemap:** add `<image:image><image:loc>` entries under each page's `<url>` in the existing sitemap (or a separate sitemap-images.xml listed in robots.txt and Search Console).
7. **Measure:** Search Console > Performance > Search type: Image. Record image clicks/impressions per page weekly for 4 weeks before and after the changes.
8. **Turn image visitors into readers:** every image page carries a one-line caption link to the e-book that contains the full record ("The full survey extract is in the free edition") and the site's signup.
9. **Credit line on the image page and in IPTC metadata** (creator, copyright notice, source) so Lens and reuse carry the attribution back.

## Pitfalls

- Do not put the only copy of a key scan inside a PDF; extract a web image too.
- Do not upload third-party archive images without permission; link the archive catalogue entry instead.
- Do not caption a photo with a date or place the record does not state.

## How we apply it to Cedwyn

- **Targets:** the farmhouse photographs (Tŷ Mawr, demolished 1988), the 1824 David Stewart survey extract (the first record mention found), map extracts and the e-book covers.
- **Caption example:** "Extract from the 1824 David Stewart survey, the first record mention found of Tŷ Mawr. Source: [archive reference]." Linked to the evidence page and to /ebooks/.
- **1667 example:** where a page shows the 1974 newspaper cuttings or an ITV News 1988 still, caption it plainly: "The family acquired Tŷ Mawr in 1667 (1974 newspapers; ITV News 1988)", with the cutting's title and date. No hedge words.
- **Sitemap:** add image entries to cedwyn's sitemap in the weekly on-page run (markup only, within the repair freeze rules: leave a patch if existing pages are frozen).
- **Spanish pages:** translate captions, alt text and filenames on the es pages for Latin American visitors (Google's localisation note).
- **UTM:** caption links use utm_source=google-images&utm_medium=organic-image only where a link leaves the image page for the shop.

## Sources

- Google Search Central, "Image SEO best practices": developers.google.com - read in full.
- Google Search Central, "Image sitemaps": developers.google.com - read.
- SparkToro (Rand Fishkin), "New Jumpshot 2018 data: where searches happen on the web": sparktoro.com - read; 2018 data.