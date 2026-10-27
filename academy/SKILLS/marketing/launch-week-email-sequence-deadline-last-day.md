# Launch-week email sequence: real deadline, 5-7 last-day emails, one row per send

Date: 2026-10-27 · For: Cedwyn e-books (0 sales so far) · Skill type: launch / first-sale conversion

## Why (practitioner numbers, all read 27 Oct 2026)
- Nathan Barry, App Design Handbook (Sep 2012): one launch email to 795 people who had asked to hear about the book -> $1,000+ in 10 minutes, $6,469.90 on day one; 3 packages $29/$59/$129. (nathanbarry.com)
- Barry + Jeremy Olson, iOS 7 edition (Nov 2013): 548 copies, $36,297 in 24 h. Hourly sales were flat until each email went out; every send made its own spike. The sequence: two value emails (case study, essay, 3-4 weeks out) -> "Sneak peek" sample interview (2 days out) -> "Slight change of plans" logistics (1 day out) -> "It's live" split into past buyers (upgrade price, 1,152) vs never-bought (20% off for 24 h, 5,315) -> "Just 4 hours left" (6,702, includes that day's sample-chapter opt-ins) -> "20 minutes left" only to the 843 who opted in for THIS book. Every reminder excluded people who had already bought. (nathanbarry.com)
- Same launch: $29 book = 48% of copies but 19% of revenue; $199 package = 31% of copies, 61% of revenue; book-only would have made ~$12,780 -> packages = 2.8x (2x-3x on his other books).
- Csaba Borzasi, 4 launches to lists of 2,900-4,800 (2024-2026): the LAST day brought 46-60% of sales (55% of 3,000-list launch; ~60% "all in the last 8 hours" on a price-rise; 22 of 40 sales; ~$4,900 of $10,342). 5-7 emails on the last day, 0 spam complaints where checked. The best-clicking last-day email was a story/science email, not "LAST CHANCE". A one-line email to clickers-who-didn't-buy ("Any questions about X?") got ~2x opens and ~4x clicks and surfaced the objections. (gameofconversions.com)
- Dee Willis (Aug 2026): you only learn how much the deadline earns if the final send has its own tracking row; worked example 3 of 9 sales after the last email. The deadline converts people the earlier emails already persuaded. (deewillis.com)
- Caveat: these are creator/marketing lists of 800-6,700; a small heritage list will see smaller absolute numbers, but the shape (spikes per send, last-day share) is the transferable part.

## How to do it
1. Build a "tell me when it's out" segment for the specific title (opt-in on the title page + sample chapter). This is the segment that buys; Barry's 795 and 843.
2. Pick a launch window of 4-7 days with ONE real end (a launch price that genuinely reverts, or a bonus that genuinely goes). Write the end time in the first email. Never extend it. (UK: honest urgency only - see uk-dmcc-act-urgency-reviews-price-copy.md.)
3. Run-up (2-4 weeks): 2 useful emails from the book's material (a story, a record, a map) + 1 "sneak peek" excerpt 2 days before. No ask beyond "it opens on <date>".
4. Open: "It's live" with the one link, the price, what's inside, the end time. Segment: anyone who bought anything before gets their own version.
5. Middle days: 1 email per day max, each answering one objection (what's in it, who it's for, format/device, refund).
6. Last day: 5-7 sends from morning to ~1-2 h before close. Most are useful (a story from the book, a reader question answered); the "hours left" lines go at the end. Exclude buyers from every send (Mailchimp: tag purchasers via Stripe/Gumroad webhook or a manual import before each send).
7. Clicked-not-bought: one plain-text line asking if they have a question. Read every reply; turn the objections into the next emails and the sales page FAQ.
8. Track each send separately: UTM utm_campaign=<title>-launch, utm_content=<email-slug> on every link (utm-discipline-ga4-funnel.md), and a sales-per-hour log against send times. After close: % of sales per email and in the final 24 h.
9. Offer packages, not one SKU: book / book + extras / complete (cross-link ebook-pricing-bundles-direct.md).

## How we apply it to Cedwyn
- Today Cedwyn has e-books on sale with no launch event: they went live quietly, so no deadline ever forced a decision. Treat the next title (or a new edition / version bump of an existing one) as a launch: 5-day window, launch price ending at a stated time, Europe/London.
- Segment first: Mailchimp tag "notify-<title>" from the title page form; count it before planning (if under ~50, spend the run-up growing it from the sample PDF - preview-pdf-sales-tool-paid-titles.md).
- Content is already there: evidence pages, the movie scenes, quote cards - each run-up/last-day email = one record or scene + one link to /ebooks/<title>/.
- Exclude buyers: pull Stripe + Gumroad purchaser emails before every send.
- Rules: drafts in Mailchimp only; nothing is sent to a list without the project lead's GO; public copy never names the project lead; banned words apply; no fake scarcity.
- Measure: per-send sales row in the project workspace; report last-day share in the Sunday growth report.

## Sources
- nathanbarry.com
- nathanbarry.com
- gameofconversions.com
- deewillis.com