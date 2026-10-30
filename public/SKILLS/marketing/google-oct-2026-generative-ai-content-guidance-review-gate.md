# Google's Oct 2026 generative-AI content guidance: the human review gate and the four main-content attributes

Harvested 30 Oct 2026 ~11:45Z. Index had 0 hits for "generative ai content" / "ai content" before this run.
Neighbours already covered (don't repeat): scaled-content-thin-pages-sitewide-quality-audit.md (the spam policy itself), ai-image-labels-disclosure-engagement-meta-youtube.md (labels on social).
New here: Google's own page was rewritten on 1 Oct 2026, the helpful-content page gained four rater attributes, and the September 2026 spam update has outside data.

## What changed (primary sources, read in full)
- **1 Oct 2026, Search Central changelog:** "Updated guidance on using generative AI content ... with information from the Search Quality Raters guidelines."
- **The guidance page, last updated 2026-10-01:**
  - Generative AI is fine for research and for adding structure. Many pages made "without adding value for users may violate ... scaled content abuse".
  - Quote: "It is critical to manually factcheck and review all AI-generated content for accuracy and trustworthiness before publishing. This review also applies to metadata like <title> elements, meta description elements, structured data, and alternate texts for images."
  - "Give users context": consider saying how content was made and adding image metadata.
  - Merchant Center: AI images must carry IPTC DigitalSourceType TrainedAlgorithmicMedia.
  - It points to rater guideline sections 4.6.5 (scaled abuse) and 4.6.6 (little effort, originality or added value).
- **The helpful-content page** now lists four attributes raters judge main content on:
  - **Effort:** human work, e.g. "building a custom interactive map". Pages generated from feeds, or "large amounts of text without manual oversight or curation", are low effort. "Attribution ... doesn't replace the need for original effort."
  - **Originality:** information that isn't already on other sites.
  - **Talent or skill:** clear writing, well-made video, working page tools.
  - **Accuracy:** checked facts; very high accuracy for topics that affect people's lives.
- **September 2026 spam update, 24 Sep–8 Oct (13 days 16 hours):**
  - Google named no new target.
  - Diib looked at 32,569 sites with GA. The median share of unpaid Google visits fell from 34% to 31%. 10% of sites lost half or more of that share, against 5% the week before. Diib called this "an early read, not a verdict" (SEJ, read).
  - SEOmonitor found that rank trackers showed false swings from 26 Sep. Check Search Console clicks and impressions before believing a tracker.
- **Practitioner reading** (Delante, 6 Oct, read): the safe pipeline is AI -> human review -> fact-check -> quality/value check -> publish. That includes auto-written titles, meta descriptions, JSON-LD and alt text.
- **No numbers** link the new guidance itself to traffic. Treat it as a rule and a gate, not a lever.

## How to do it (any site)
1. **Inventory machine-made surfaces:** body text, titles, meta descriptions, JSON-LD descriptions, alt text, captions, subtitles and translations.
2. **Human review gate before publish.** One named reviewer pass that:
   - checks every date, name and quote against its source;
   - rejects text that only restates other sites;
   - logs the date and the reviewer (not a public name if privacy rules say so).
3. **Metadata review.** Run `tools/ai_meta_review.py` over the changed pages. It prints title, description, JSON-LD descriptions and alt counts, and flags missing or duplicate titles and descriptions, missing or generic alts, and pages with no how-made note.
4. **How-made note** where AI or automation made something people see: one plain line ("Scenes are dramatised reconstructions rendered with AI tools from the documentary record; dialogue is our best reconstruction"). For images, add IPTC DigitalSourceType when files are exported.
5. **Effort and originality evidence on the page:** primary-record scans, transcriptions, maps and timelines nobody else has. These are the "high effort" examples Google gives.
6. **After any update window,** compare Search Console 24 Sep–8 Oct against the weeks before. Act only on drops that last several days and show in clicks and impressions.

## How we apply it to Cedwyn
Live check, 30 Oct ~11:45Z, with `tools/ai_meta_review.py` on /, /documentary/, /ebooks/cedwyn/, /learn/ and /ebooks/:
- Titles and descriptions are unique on all 5 pages.
- 0 images are missing alt text and 0 alts are generic.
- The e-book page's Book/Product JSON-LD description reads as hand-written.
- None of the 5 pages has a how-made note. The tool's first pass counted "reconstruction" in the agent-instruction text and the e-book contents as notes; they aren't, and the pattern was fixed.

Proposals (owners: documentary/movie worker, onpage worker, academy cycle; no price changes):
- **Documentary (/documentary/, /movie/):** the scenes are AI-rendered dramatisations, with talking shots from OmniHuman. Add one how-made line under the player in cy/en/es: dramatised reconstruction, rendered with AI tools, based on the dated records linked from each door. This is honest context. Google suggests it, and it matches the AI labels we already use on Meta and YouTube.
- **Scene stills and covers:** when exporting AI images for the site or shop, write IPTC DigitalSourceType = trainedAlgorithmicMedia (exiftool or PIL; nothing to install if PIL writes XMP, otherwise wait for disk).
- **E-books (v0.0.1 free, v0.0.2 £4.99):**
  - Keep the "Sources and Credits" chapter.
  - Add a one-line method note: the drafting tools used, and that a human checked the dates against the records. The 1824 rule and the P-067 dated-record fix are exactly the "accuracy" attribute.
  - Never publish agent-written descriptions without that check.
- **Academy (/learn/, /academy/):** pages built by the agent-library cycle are automated. Each cycle must keep its human-review line, and the tool should run on changed pages before publish. Thin auto-generated glossary or nomenclature pages are the scaled-content risk. Merge, don't multiply.
- **Effort signals we already have:** the title-chain infographic, the interactive map, transcribed records and the door-a-day film. Make sure they sit in the main content of the pages that sell (e.g. a record scan and a map on /ebooks/cedwyn/), not only on deep pages.
- **Weekly ONPAGE audit:** add one line, `ai_meta_review.py` over the pages changed that week, with flags logged.
- **Visibility check:** note the 24 Sep–8 Oct window in Search Console. Don't react to tracker swings.

## Sources
- developers.google.com (read in full; updated 2026-10-01)
- developers.google.com (read: four attributes)
- developers.google.com (changelog: 1 Oct 2026 entry)
- searchenginejournal.com (read; Diib 32,569 sites; SEOmonitor tracker caveat)
- delante.co (practitioner reading, 6 Oct 2026)