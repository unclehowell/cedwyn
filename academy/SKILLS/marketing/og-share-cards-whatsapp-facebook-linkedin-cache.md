# Share-preview cards (Open Graph) that actually render on WhatsApp, Facebook, LinkedIn, X
Harvested 2026-10-27 (skills harvest). Timely: the project lead reported bare links when sharing cedwyn.bucklerfamily.estate (05:29 GMT 27 Oct); a worker is adding tags site-wide.

## The rules, from the platforms' own docs
- **Facebook** (Meta "Images in Link Shares", updated 30 Jun 2026): min 200x200, max 8 MB; use >=1200x630 for hi-res; >=600x315 for the large card (smaller renders as a small thumbnail); keep ~1.91:1 or it is cropped. Crawler accepts only gzip/deflate encoding.
  - **First share shows no image** unless the image is pre-cached: run the Sharing Debugger, force-scrape via Graph API, or give `og:image:width` + `og:image:height` so the crawler renders at once.
  - **Images are cached by image URL**: a replaced image needs a NEW URL (e.g. `card-v2.jpg` or `?v=2`); do not delete old images (old posts still point at them); old shares do not refresh by themselves.
- **WhatsApp** (Meta Business Platform "Link Previews", updated 21 May 2026): `<head>` must be within the first 300 KB of HTML; og:title, og:description, og:url must be in `<head>` and non-empty; title has no branding, shown bold in at most 2 lines; description 1-2 lines, ~80 characters suffice; og:url canonical, no tracking params; og:image absolute, **under 600 KB**, >=300 px wide, aspect <=4:1. Crawler UA `WhatsApp/2.x.x.x A|I|N`, sends Accept-Language (can serve cy/es titles).
  - Field report (andrewbaker.ninja, 5 Mar 2026; not checked against Meta): thumbnails silently dropped above ~300 KB, the failure gets cached, and one WhatsApp share hits three UAs (WhatsApp/2.x, facebookexternalhit/1.1, Facebot); a WAF/bot rule blocking any one breaks the card. So target **<300 KB**.
- **LinkedIn** (Help a521928): og:title, og:image, og:description, og:url required; image max 5 MB, min **1200x627**, ratio 1.91:1. Post Inspector (linkedin.com) re-fetches and clears its cache.
- **X**: `twitter:card=summary_large_image` + twitter:title/description/image (falls back to og: tags if absent).
- **Numbers on uplift**: opengraph.xyz assertions +47% social CTR from systematic OG image testing for a news publisher (vendor blog, no method; not checked). Treat the gain as "card vs bare URL", not a measured percentage.

## How to do it (30-minute checklist)
1. One template in the shared build emits: og:title (page title, no site name), og:description (<=155 chars, first ~80 carry the point), og:type (website/article/book), og:url (canonical, no UTM), og:site_name, og:image (absolute https), og:image:width=1200, og:image:height=630, og:image:alt, twitter:card summary_large_image + twitter:title/description/image.
2. Card images: 1200x630 JPEG, quality ~80, **<300 KB**; keep text/signature inside the centre safe area (WhatsApp/iMessage crop to near-square on small previews).
3. Version the card URL whenever the picture changes.
4. Allow the crawlers in Cloudflare (WAF/Bot Fight Mode): facebookexternalhit, Facebot, WhatsApp, LinkedInBot, Twitterbot; serve gzip, not brotli-only, to Facebook.
5. Verify per crawler: `python3 tools/og_check.py <url>...` (fetches as each UA, checks tags, head-in-300 KB, image 200 image/*, KB, dimensions).
6. Purge platform caches after deploy: Facebook Sharing Debugger "Scrape Again" or `POST graph.facebook.com or page token>`; LinkedIn Post Inspector; WhatsApp has no tool - change og:image URL (and, for a stubborn chat cache, share once with a harmless `?v=2` query).

## How we apply it to Cedwyn
- Homepage + every theme: NFT "Tŷ Mawr" pieces cropped/padded to 1200x630, <300 KB, signature in the safe area (c89baf22's brief matches this).
- **Found today with og_check.py (05:40 GMT 27 Oct):** `/` has no og/twitter tags at all (FAIL on all four crawlers); `/ebooks/` has tags but its og:image is a portrait cover **480x678** (Facebook/LinkedIn crop it hard and show the small card), no og:image:width/height, description >160 chars. Fix: a 1200x630 landscape card of the cover on a Tŷ Mawr background; keep the cover JPG for the page itself.
- NFT detail pages: each piece's own card; when the flower-rework re-renders a piece, its card gets a new URL (`-v0.0.2.jpg`) so Facebook/WhatsApp pick up the new art.
- After each deploy that changes cards: one Graph API scrape for /, /ebooks/, /nft-art/ (page token from the project workspace), then check one real WhatsApp share.
- Spanish/Welsh: WhatsApp sends Accept-Language, but serve language-specific titles only from real translated pages (see hreflang skill), never machine-swapped on the fly.

## Sources
- developers.facebook.com (read 27 Oct 2026)
- developers.facebook.com (read 27 Oct 2026)
- linkedin.com (read 27 Oct 2026)
- developers.facebook.com
- andrewbaker.ninja (practitioner; ~300 KB limit not checked against Meta)
- opengraph.xyz (vendor claim, not checked)