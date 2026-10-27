# A short video on the e-book sales page (30-60 s, above the buy button)

Date: 2026-10-26 (skills harvest 23:24). Status for Cedwyn: PROPOSAL. Adding it changes the design of /ebooks/, and the onpage flywheel treats that as PROPOSED, never automatic. The home page stays as the two tiles only (owner's order, 26 Oct). This skill is for /ebooks/ and individual book pages only.

## What the evidence shows
- **Wistia, "How to use video on landing pages" (read 26 Oct 2026):**
  - Recommended length: about **30 s for an offer, 60 s for an explainer, no more than 90 s** for a testimonial or overview.
  - Wistia found videos **above the fold got "up to 50% more engagement"**.
  - It quotes average landing-page conversion at **3-5.5%** depending on industry (Wistia's figure, not checked).
  - The page must load fast: a slow player costs more than the video gains.
- **Wistia State of Video benchmarks (2026 page, read):**
  - Videos on home pages, galleries and product pages get the highest play rates, and viewers usually reach about halfway.
  - **Thank-you pages reach about a 10% play rate**, so the post-purchase page is a cheap second spot.
  - The 2025 report's table, seen only as a Scribd snippet (**not checked**): product pages 17%, promotional 12%.
- **Case figure (vendor, not checked):** the agency DemoDuck states its explainer video lifted Crazy Egg's conversions by **64%**, worth about **USD 21,000 a month**. That is the agency's own case study, not an independent test.
- **Our constraint (measured in our own logs):** about 4 real visitors reached /ebooks/ on 26 Oct (sales-check message, 22:14). That is far too few for an A/B test. Per ab-testing-small-lists.md, ship it as a reversible change and compare before and after over 4+ weeks on click-to-checkout rate, not on sales.

## How to do it (steps)
1. **Script: 45 seconds, one book or the bundle.**
   - 0-5 s: the hook, one striking record line on screen, e.g. a dated entry from the 1824 survey.
   - 5-35 s: three quick cuts showing what is inside: a page spread, a map, a document image.
   - 35-45 s: the offer. Price, format ("EPUB + PDF, instant download") and "Buy below".
   - Burned-in captions throughout, because most people watch muted.
2. **Make it from what exists:** movie-door clips, archive scans and e-book page renders. No new footage and no faces of real family members.
3. **Encode small:** 720p MP4 (H.264) plus WebM, under about 3 MB, with a poster frame. Self-host on Cedwyn so there is no third-party player and no outbound link.
4. **Place it** directly under the headline and above the buy button: `<video controls muted playsinline preload="none" poster=...>`. Do not autoplay with sound. `preload="none"` plus a poster keeps Largest Contentful Paint (LCP, how fast the main content appears) on the image, not the video (sales-page-speed-core-web-vitals-ebooks.md).
5. **Add a transcript** below in a "learn more" fold (headline-first-read-more-progressive-disclosure.md). It is accessible and gives search text.
6. **Measure:** fire an analytics event on play and on 75% watched. Compare the buy-click rate of players against non-players and against the 4 weeks before. Put a second copy of the clip on the thank-you page pointing to the bundle upgrade (post-purchase-cross-sell-bundle-upgrade.md).

## How we apply it to Cedwyn
- **Where:** /ebooks/ (the bundle) first, then the strongest single title's page. Never on the home page, never inside the signup form block, and never touching the TRIGGER EVENT meta that is held for the owner.
- **Words on screen:** short dated record lines with their source, and no banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken). Write "not checked" for anything unchecked. No insignia. The owner is not named.
- **Languages:** English captions by default. Welsh and Spanish caption tracks (.vtt) follow the site's language dropdown.
- **Owner:** the CEDWYN ONPAGE flywheel lists it as PROPOSED. A video worker can make the 45 s cut from the movie bible assets once approved. File size budget: under 3 MB, because the disk on the box is tight.
- **Success bar** (set in advance): play rate of 10% or more among /ebooks/ visitors, and players' buy-click rate at least twice non-players'. Below both after 4 weeks: remove it.

## Sources
- wistia.com
- wistia.com
- scribd.com (snippet only)
- demoduck.com (snippet only; vendor claim)