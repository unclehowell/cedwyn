# Line length and body type: keep reading text at 50–75 characters a line

Harvested 27 Oct 2026. Topic: CRO / readability / accessibility. Tool written: `tools/line_length_audit.js`.

## The evidence (read 27 Oct 2026)
- **Baymard (Edward Scott, May 2022, large-scale e-commerce usability testing):**
  - The best length for body text is **50–75 characters per line, spaces included.**
  - Long lines "are typically perceived by users as intimidating and overwhelming". In testing, users went straight **back to the previous page** when they landed on long-line text, or gave up partway and left without understanding the product.
  - Lines that are too short also hurt: the eye has to return too often, and readers skip words.
  - Tester quotes: "There's way too much here, I can't even suss out what would be helpful" (Mahalo); "I'm never a fan of having to read through all this material" (Vrbo "About" section).
- **Typographic basis:** Emil Ruder (Typographie) gives 50–60 characters per line, and other sources allow up to 75. These are cited in the Baymard article.
- **Accessibility:** WCAG 2.x SC 1.4.8 (AAA) sets **80 characters or fewer** (40 for CJK). Baymard's accessibility research backs this: users tire on 100+ character lines.
- There are no published conversion uplift figures. This is observational usability evidence, so treat it as hygiene, not a growth lever with a promised percentage.

## How to do it
1. **Measure first:** `node tools/line_length_audit.js <url> [390,1280]`. It uses the installed playwright-core and headless shell; nothing new is installed. For every visible paragraph or list item with 160+ characters it counts the real rendered lines (from the text's own line boxes, so collapsed read-more blocks are not inflated). It reports, per viewport:
   - the median and maximum characters per line, the number of blocks over 80, and the number under 40;
   - the smallest body font size.
2. **Fix wide text with a measure, not a narrower page:** `max-width: 68ch` (about 60–75 real characters) on the prose container, centred or left-aligned. Keep images and galleries full width if wanted. Only the text column narrows.
3. **Fix tiny or narrow text on phones:**
   - Body text at least 16 px. Captions and meta can go to 14 px, never below about 13 px for anything a buyer must read (price lines, what's included).
   - Anything you need read should not be in 2-column cards at 390 px; on a phone, sub-40 characters per line is choppy.
4. **Line height** about 1.4–1.6 for body text (Cedwyn already uses 1.55). Leave a clear space between paragraphs.
5. **Re-run the audit after every theme change.** Log any change in the GSC/GA4 annotation log (see `search-console-ga4-change-annotations-log.md`). Watch scroll and engagement on that page month on month, as directional only.

## How we apply it to Cedwyn
Live measurement, 27 Oct 2026 08:25Z (cache-busted, headless shell):

| page | 390 px median / max CPL | 1280 px median / max CPL | notes |
|---|---|---|---|
| /wales/ | 45 / 49 | **100** / 100 (1068 px column, 20.8 px font) | desktop body runs past WCAG's 80 |
| /patagonia/ | 42 / 46 | 70 / 80 | fine; one block at 80 is on the edge (layout changing today, re-check after a worker's build) |
| /ebooks/ | **29** / 43 (14 of 18 blocks under 40) | 35 / 70 | smallest text **13.6 px**; card descriptions in narrow columns on phone |

PROPOSED, markup/CSS only, for the onpage run. These are design changes, so they need the project lead's OK under the onpage rules:
- (a) /wales/ and other long-read theme pages: `max-width: 68ch` on the prose block at desktop widths. The read-more component (PR #30) is unaffected.
- (b) /ebooks/ at 390 px: card descriptions full width (one column) and edition and price lines at least 15–16 px. Pair with the button copy and trust-line proposals (`cta-button-copy-first-person-benefit.md`, `payment-trust-cues-checkout-uk-legal.md`).
- (c) add the audit to the weekly onpage run for /, /wales/, /patagonia/, /ebooks/, /research/ (the /research/ hub returned no long blocks, so it's a list page and there's nothing to fix).
- No wording changes.

## Sources
- baymard.com (read)
- w3.org (SC 1.4.8; cited via Baymard, standard text not re-read this run)