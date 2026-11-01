# Naming the free tier of a book: "preview" or "sample", never "free version"

Skills harvest 2026-11-01 ~01:30Z. Topic: offer framing and labels. Checked against free-vs-paid-edition-comparison-table-explicit-differences.md (states the difference in a table) and price-framing-aggregate-vs-per-page-low-price-ebooks.md (price wording). This file is only the word on the free item and the button.

## What the sources show (read 1 Nov 2026 unless marked)
- **Every big shelf calls the free excerpt a "sample" or "preview", and none calls it a "version".**
  - Amazon: "Read sample" / "Send a free sample" (KDP help G200644250; Amazon forum threads).
  - Apple Books: "Get sample" (AppleInsider guide, snippet).
  - Google Play Books: "Free Sample" button (DAISY Consortium app guide, snippet; Google blog "start reading a free sample").
  - Kobo: "Preview now", "Some books do not offer a free preview" (Kobo help article, snippet).
  - Leanpub: "Read Free Sample" (help centre, read).
  So readers have years of training: "sample" and "preview" mean part of the book.
- **"Free version" means something else to most people:** a complete product with limits. In software it is the freemium tier you can use for ever. RevenueCat's winning onboarding copy ("This product is free and will always be free, but ... try the best version of it") shows the word "version" promises a whole, working thing (Sub Club, read 1 Nov). Calling a 20-page excerpt "Free v0.0.1" therefore tells the reader they have the book, and the £4.99 one reads as an update. That is what sales-fix run 43 found (4 of 9 cards, 0 checkouts in 7 days).
- **Labels should use the user's words** (NN/g heuristic 2, "match between the system and the real world") and should state differences explicitly (NN/g, see the comparison-table file). A count makes it concrete: "20 of 404 pages" needs no glossary.

## The rule
- Free item: **"Free preview"**, always with the count: "Free preview: 20 of 404 pages". Button: "Read the free preview". "Sample" is equally clear. We keep "preview" because the copy rules and the shipped cards already use it, and switching words now costs consistency for no proven gain.
- Paid item: **"Full edition"** with the whole price and the page count: "Full edition, 404 pages, £4.99".
- Never: "free version", "free edition", "lite", "update", "upgrade" (upgrade implies they already own the book), or "v0.0.1" on its own.
- Version numbers are allowed as a secondary label, after the plain word: "v0.0.1, free preview (20 of 404 pages)". This satisfies the project lead's "select a version" dropdown (m:2c93759d) without the version number doing the explaining.
- Welsh and Spanish: use the plain store words, "rhagolwg am ddim" / "vista previa gratuita" (or "muestra gratuita"), and "argraffiad llawn" / "edición completa". Have a native speaker check these before they ship; these wordings have not been checked.

## Don't A/B this (yet)
At about 9 downloads a day and 0 checkouts, a preview-vs-sample test would need thousands of visitors per arm (check with `tools/ab_stats.py samplesize`). The ambiguous label is a clarity defect, not a hypothesis, so fix it everywhere at once and measure free-to-checkout before and after.

## How we apply it to Cedwyn
- Sweep every surface for "free version"/"Free v0.0.1": /ebooks/ cards (PR #94), book pages, the PDFs' own title pages and footers, the Gumroad/Stripe product names (Gumroad text only the project lead can edit, so list it for him), the YouTube/Instagram/Facebook descriptions and bios, Mailchimp signup success text, and the version-gate dropdown.
- Replace each with "Free preview: N of M pages" and "Full edition, M pages, £4.99". Leave patches in the project workspace where the repair freeze applies.
- Version gate (worker started 01:24Z): dropdown option labels exactly as above, preselect the free preview, and bar copy "Full edition, M pages, £4.99".

## Sources
- kdp.amazon.com ("Read sample"); uk.amazonforum.com ("Send a Free Sample", snippet)
- help.kobo.com (snippet)
- daisy.org (snippet); appleinsider.com (snippet)
- help.leanpub.com (read)
- revenuecat.com (read)
- nngroup.com (heuristic 2, known; not re-read this run)