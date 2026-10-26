# Accessibility quick wins as a sales lever for a long-form heritage site

Harvested 2026-10-26. Fixing the handful of errors that block disabled readers is cheap, helps every mobile reader, and removes a reason to leave the checkout.

## The numbers (primary sources)
- **WebAIM Million 2026** (automated scan of the top 1,000,000 home pages): low-contrast text on **83.9%** of pages, missing image alt text **53.1%**, missing form labels **51%**, empty links **46.3%**, empty buttons **30.6%**, missing document language **13.5%**. **96% of all detected errors fall in these six**, and the list has not changed in 7 years. 30.4% of pages had 10 or fewer errors, so a clean page is reachable.
- **Click-Away Pound 2019** (UK survey of disabled online shoppers, AbilityNet write-up): **69%** click away from sites that are hard to use; **83%** limit their shopping to sites they know are accessible; **86%** have paid more on an accessible site rather than buy the same thing cheaper on a harder one; only **8%** of those who hit barriers contact the business, so the owner never hears. Lost UK spend estimated at **£17.1bn** (up from £11.75bn in 2016). Survey is from 2019; treat the shares as direction, not a forecast for our list.
- Conversion-lift figures quoted in vendor roundups ("+35%" etc.) do not name a site or a test; not used here.

## The 30-minute fix list (in this order)
1. **`<html lang>` right on every page**: `en-GB` for English, `cy` for Welsh, `es` for Spanish pages; wrap Welsh or Spanish phrases inside an English page in `<span lang="cy">` (WCAG 3.1.2). Screen readers switch pronunciation on it; Welsh read with English rules is unintelligible.
2. **Alt text** on every content image: say what the record shows ("1824 survey sheet, Tŷ Mawr parcel outlined"), `alt=""` on decoration only.
3. **A label on every form field**, especially the email signup and checkout. Placeholder text is not a label.
4. **No empty links/buttons**: icon-only controls get `aria-label` ("Open menu", "Play film").
5. **Exactly one `<h1>`**, no empty headings, no skipped levels; headline-first pages depend on headings for screen-reader navigation.
6. **Contrast 4.5:1** for body text, 3:1 for large text and the buy button's edge; check the e-book strip and the small-italic `.unsub` text, which is the most likely to fail.
7. **Tap targets** at least 24x24 CSS px (WCAG 2.2, 2.5.8) for "Read more", language switch and buy buttons at 390 px.
8. **Focus visible** (2.4.7) and `<details>/<summary>` for "Read more" (keyboard and screen-reader friendly without script).
9. **Captions** on every film (see the YouTube captions skill) and a transcript in `<details>`.

## Measure
- `python3 tools/a11y_quick.py <url> ...` (free, no install) covers items 1-5. Contrast needs a browser (axe-core in the already-installed headless Chromium is the free route; not installed: disk under 2 GB).
- Before/after: buy-click rate and signup rate from the cookieless counter, per page, two weeks each side.

## How we apply it to Cedwyn
Run 26 Oct 2026 on four live pages:
- **Home page has no `<h1>`** in the HTML (fix: the site title or first headline as h1).
- **/movie/ has one empty heading** and its English pages declare `lang="en"` while the home page declares `en-GB` (make them consistent).
- /ebooks/ and /ebooks/dartboard/: images all have alt, signup email has a label, consent checkbox is wrapped in its label - clean on items 1-5.
- Not checked yet: contrast (needs a browser), the Welsh and Spanish themes' `lang` values (no /cy/ or /es/ path exists; the themes need listing first), tap-target sizes.
- These are markup fixes for the sole Cedwyn committer (a worker is rebuilding the headline layout now; items 5 and 8 belong in that change). Logged as PROPOSED here; nothing committed by this run.
- Alt text and captions follow the editorial rules: describe the record and its date from our catalogue (1824 David Stewart survey = first record mention found); never caption a Bute document as a Tŷ Mawr record before 1824; no banned words; never name the family member who runs the archive.

## Sources
- webaim.org (2026 report, six error types, 96%)
- abilitynet.org.uk (Click-Away Pound 2019 figures)
- clickawaypound.com and clickawaypound.com (survey home and report)
- w3.org (3.1.2 Language of Parts, 2.5.8 Target Size, 2.4.7 Focus Visible)
- w3.org (W3C business case)