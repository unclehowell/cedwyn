# Accessible HTML email: fix the machine-checkable failures first (EMC 2026)

Skill harvested 27 Oct 2026. Topic: HTML email design / deliverability hygiene.

## The evidence (read in full)
- **Email Markup Consortium, Accessibility Report 2026** (last modified 21 May 2026; data May 2025 to May 2026, tested with Parcel's open accessibility checker):
  - 376,348 emails analysed; **99.88% had a Serious or Critical defect**. Only **8 emails from 3 brands** passed (Customer.io, NaomiWest.ca, Noble Panacea). 2025 was 99.89% of 443,585.
  - **10,566 emails from Substack, Shopify Email and Beehiiv: 0 passed.** Substack: 100% missing the inner lang/dir wrapper. So a hosted builder does not make you compliant.
  - The report's own words: "The majority of the issues are not edge cases. These are basic, machine-checkable accessibility failures."
- **Top 10 failures, share of all emails tested (2026):**
  1. body content not wrapped in a `dir` attribute: 97.41% (Serious)
  2. body content not wrapped in a `lang` attribute: 95.66% (Serious). Several clients strip `lang` from `<html>`, so repeat it on the first child of `<body>`.
  3. layout tables with no `role="presentation"`: 83.78% (Serious)
  4. no `<h1>`: 74.23% (Mild; fine for SMS-like notes)
  5. links with no discernible text: 71.23% (Serious). The usual cause is a linked image with no alt. A linked image is functional, so it is never decorative.
  6. `<html>` has no `lang`: 62.16% (Serious)
  7. colour contrast under 4.5:1: 58.48% (Serious)
  8. `<img>` with no `alt` at all: 47.88% (Critical). Decorative images get `alt=""`.
  9. no `<title>`: 45.21% (Serious)
  10. generic link text ("click here"): 15.83% (Moderate; English-only check, so under-counted)
- **Clients:** of 37 feature benchmarks, Apple Mail on macOS supports 34, Samsung Email 31 and Proton Mail 29. None supports all of them.
- **Litmus** (2026 accessibility guide and dark-mode guide, snippets): about 35% of opens are in dark mode. Live HTML text survives zoom, dark mode and screen readers; text baked into images does not.

## Playbook (in order of payoff)
1. **Wrapper:** `<html lang="en-GB" dir="ltr">`, then make the first child of body `<div lang="en-GB" dir="ltr">`. Welsh editions use `lang="cy"`; a bilingual block gets its own `lang` on its own element. If the language is unknown, `lang="und"` / `dir="auto"` beats nothing.
2. **Every layout `<table>` gets `role="presentation"`.** Better still, use no layout tables.
3. **Add a `<title>` that matches the subject line** (it shows in web view and in some clients), and one `<h1>` with the email's main line.
4. **Images:** content images get descriptive alt text. Decorative images get `alt=""`. Linked images get alt text naming the destination, e.g. "Read the 1938 press reports". Never put the offer or price only in an image.
5. **Links:** write the destination as the link text, e.g. "Read the 1824 map story", never "here".
6. **Contrast:** check at least 4.5:1 for body text, including on dark-mode inversions. Avoid pure #000 on #fff panels, which invert badly; use near-black on off-white.
7. **Run a checker on every template change, not every send.** Build accessibility into the master template once, and every campaign inherits it. That is how the 3 passing brands do it.

## Free tool
- `tools/email_a11y_lint.py`: our own stdlib script (about 5 KB, nothing installed). It checks the EMC top-10 rules that can be tested statically: lang/dir wrapper, `<html lang>`, table roles, `<h1>`, `<title>`, img alt, empty or generic links, and inline colour pairs under 4.5:1. It exits 1 on any Serious or Critical issue.
  `python3 skills/tools/email_a11y_lint.py assets/email/*.html`
- Parcel's accessibility checker (the tool used for the EMC report) is free in the browser at parcel.io. Use it as the second opinion before a template goes live.

## How we apply it to Cedwyn
- **First run, 27 Oct 2026 03:55Z, on our 6 email templates** (`the project workspace` welcome-1/2/3, weekly-2026-w44/w45, reengage-30d): all have `<html lang="en-GB">`, a `<title>`, an `<h1>`, presentation tables and no images. **Every one fails EMC rules 1 and 2:** the 2 direct children of `<body>` (the hidden preheader span and the main wrapper) have no `lang`/`dir`.
  - **PROPOSED one-line fix per template:** add `lang="en-GB" dir="ltr"` to the preheader `<span>` and the outer wrapper. No copy changes.
- **Welsh/Spanish editions:** the weekly email template should set `lang` per edition (`cy`, `es`). That is the same field the news sitemap needs (see google-news skill), so drive both from one value.
- **Mailchimp:** its drag-and-drop builder sits in the "tooling gap" the report describes. Paste our linted custom HTML rather than rebuilding in the editor, and re-lint after any edit made in the Mailchimp editor.
- **Archive photos:** when a weekly email shows a document scan, give it alt text that describes the document and date, e.g. "1824 estate map of Tŷ Mawr, field names visible". No accusations or names in alt text; the editorial rules apply there too.
- Add the lint to the email worker's checklist ahead of the test send. It complements the deliverability skills already in the index, which it doesn't repeat.

## Sources
- emailmarkup.org (read in full, 27 Oct 2026)
- emailmarkup.org (fetched; 99.89% of 443,585)
- litmus.com ; litmus.com (35% dark-mode opens; snippet only)