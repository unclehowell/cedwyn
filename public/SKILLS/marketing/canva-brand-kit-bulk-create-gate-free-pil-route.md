# Canva Brand Kit + Bulk Create for social cards: gate, and the free route we already have
Harvested 2026-10-30 01:12Z (skills harvest). Index before: 'canva' 0, 'brand kit' 0, though Canva is a connected app on the project lead's account.

## What the sources say (read = page fetched and read this run)
- **Bulk Create is Canva's mail merge, and it is paid.** Bannerify guide (read; it states its Canva facts were checked against the Canva Help Center in Oct 2026; Bannerify sells a rival, so read its comparison as a vendor's): Bulk Create is on Pro, Teams, Business, Enterprise, Education and Nonprofits, desktop only; not on Canva Free or mobile. Up to 300 rows per uploaded CSV/XLSX or data app, up to 150 fields, one image or video per cell; image URLs in cells are treated as text (images must be embedded in the XLSX, in a Canva Sheet, or in the Canva library); data is read once (no live refresh). Output: one multi-page design or one design per row, pages named from a column. Canva Help Center snippet agrees on 300 rows / 150 columns (canva.com, 403 from the box).
- **Brand Kit**: Canva Pro page (snippet) lists up to 5 brands in one place with logo/image swaps across designs; the help page (snippet) mentions Brand Controls restricting designs to kit colours/fonts. What Canva Free includes for a brand kit was not checked this run.
- **Canva for Nonprofits** (canva.com eligibility page, snippet): must be officially registered as a charitable nonprofit in its country with a stated charitable mission. Cedwyn is a commercial heritage project selling e-books, so it is not eligible unless a registered charity is formed (owner decision, not a marketing trick).
- **Practitioner result** (vendor case study, snippet only): Wilderness Society used Brand Kit templates so local teams could post on-brand without designers, reaching almost 1.5M Facebook engagements in 2021. Canva's own number; the share due to Brand Kit is not separable.

## The decision rule
1. Canva Pro costs money, so under the zero-spend rule Bulk Create and multi-brand kits are **PROPOSAL only, on the project lead's GO**.
2. The free route already does the same job for us: one design template in code (PIL), one CSV row per card, one PNG/WebP per row, file named from a column. That is what the quote-pack and share-card workers already do, with no 300-row cap and no image-URL problem.
3. Use the connected Canva account for what Free gives: the project lead or a worker opening a finished card to tweak by hand, and storing logo/colours/fonts as the single source of truth if the free plan allows a kit.
4. Whichever tool: one written brand sheet (2 fonts, 3-5 hex colours, logo lockups, cy/en text order, safe margins for the platform crops) so every channel looks like one publisher. Consistency is the point; the tool is secondary.

## How we apply it to Cedwyn
- Write `the project workspace` (if not already present: check first) with the site's actual fonts and hex values read from the live CSS, the share-card text format ("Williams-Bucklers, Ty Mawr, Cedwyn - <webapp>"), Welsh-first order for bilingual cards, and crop sizes: 1080x1350 (IG portrait), 1080x1080, 1200x630 (OG/Facebook link), 1080x1920 (Stories/Reels cover).
- Make the PIL card generator read a CSV with columns: id, text_cy, text_en, source_line, record_id, image_path, size, utm_content. One run = a week of quote cards for the auto-social flywheel. Files under 300 KB.
- Only if the project lead GOes Canva Pro: build one Brand Template per card type, keep Brand Controls on, and run Bulk Create from the same CSV (split into 300-row parts, images embedded or from the Canva library). Measure: hours per weekly pack before vs after; kill if no time saving after 2 packs.
- Rules carry over to every card: never name the project lead or private people, none of the banned words, no insignia, verbatim record lines with their source line, only our own reconstructions animated (never archive scans).

## Sources
- bannerify.co (read)
- canva.com (403 from the box; snippet)
- canva.com (snippet)
- canva.com (snippet)
- canva.com (snippet)
- canva.com (403 from the box; snippet)