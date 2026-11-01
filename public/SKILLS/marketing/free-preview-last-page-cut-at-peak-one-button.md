# The last page of a free preview: where to cut, what the end page states, one button

Skills harvest 2026-11-01 ~01:30Z. Topic: e-book free-preview → paid conversion. This is not ebook-back-matter-one-next-step.md, which covers the end of a complete free book with a next-book CTA and the 2-4% sell-through arithmetic. A preview is the front of the book being sold, so its last page has a different job: get the reader to finish the book they are already in. Also checked against free-sample-chapter-read-before-buy.md (whether to offer a sample) and stop-rate-free-registration-wall-ask-after-engagement.md (an email ask at the continuation point). This file is the cut and the end page.

## What the sources show (read 1 Nov 2026 unless marked)
- **Cut at the curiosity peak, not at a page count.** Andi Bitay, "How to Place Your Paywall So Readers Actually Subscribe" (Ditch The Templates, Substack, 2026). Her own tests, one hour each, so they are tiny and anecdotal:
  - An essay with the paywall near the start got **0** paid subscribers. With the paywall moved to "where the solution was about to begin" it got **4**.
  - A step-by-step guide with the paywall before step one got **2**. With step one given away and the paywall before step two it got **6**.
  - Her rule: give enough value to earn trust, then stop right before the payoff, and put "a brief summary of what's behind it" just before the wall. Small numbers, but every placement test went the same way.
- **Show the whole table of contents in the sample.** Leanpub's sample-book feature (help centre, Sep 2024): "All your chapter titles will appear in the sample book", but only the chapters chosen for the sample carry content. So the reader of the sample sees exactly what they have not read yet. The button on the book page is labelled "Read Free Sample".
- **Stores put the buy action at the sample's end.** Kindle, Apple Books, Google Play and Kobo all end their samples with a buy prompt for that same book (Kindle "Read sample"/"Send a free sample", Apple "Get sample", Play "Free sample", Kobo "Preview now"; store help pages and forum threads, read via search snippets). Readers are trained to expect a buy point when a sample ends, so a preview that just stops looks broken.
- **One call to action beats several.** Gaughran, in our back-matter file: 3 CTAs → 1 CTA = 1.4x clicks. The same logic applies here, even more strongly: the one action is "get the rest of this book".
- **Old front matter eats the sample.** This is the long-standing KDP habit of moving acknowledgements and similar pages to the back so the fixed sample percentage shows story, not prelims (KDP help G200644250: the sample is a fixed % by format). Our preview is hand-cut, but the same rule holds: no blank or admin pages inside the 20.

## The end page (page N+1 of the preview PDF/EPUB)
1. **A cut line inside the story or argument.** End the preview at the start of something the reader now wants: the 1987 hearing about to open, a document about to be read, a name about to be explained. Don't end at a chapter's natural rest.
2. **"You've read 20 of 404 pages."** One line that makes the scale plain. This is the same honesty fix as the shelf cards.
3. **What comes next, in 3 lines.** Name the next 3 chapters by their real titles and one concrete thing in each (a record, a map, a date). This is Bitay's "summary of what's behind it".
4. **One button:** "Get the full edition, £4.99", linking to the book's own /ebooks/ page with `?utm_source=preview&utm_medium=pdf&utm_content=<book>-endpage` (PDF links are tappable on phones). No review ask, no social links, no newsletter here.
5. **The full contents list after it,** with the chapters already read in the preview marked "in this preview" and the rest plain. That is Leanpub's pattern.
6. **Optional, for readers not ready to buy:** one small line, "Not now? We'll email you when the next chapter is free", linking to the signup with the sample-chapter tag. This is below the button and smaller, so it never competes with it.

## Measure
- UTM `utm_content=<book>-endpage` clicks in Cloudflare/GA per book, against preview downloads. Book page → checkout opens with that UTM, and sales.
- Baseline today is 0 checkouts from about 9 downloads a day. The first goal is any end-page clicks. If clicks come but checkouts don't, the problem is the book page or checkout, not the preview.

## How we apply it to Cedwyn
- For each of the 4 books whose ~20-page preview is labelled "free version": recut the preview to end at a curiosity peak (pick the point by reading the full edition's pages 18-30), and add the end page above, generated from the Sphinx source (one `preview_end.rst` include per book and language: en/cy/es, using the same "full edition" wording).
- Leave the patch in the project workspace for the next SALES FIX run if the repair freeze is still on. The preview files are build outputs, and the shelf copy fix (PR #94) and the version gate both point at them.
- Wording follows the copy rules: "preview", whole price, page count, nothing per page, no "was" price. Argentina-scope editions use the same end page with no price ("Get the full edition").

## Sources
- ditchthetemplates.substack.com (read 1 Nov 2026; n tiny, 1-hour windows)
- help.leanpub.com (read 1 Nov 2026)
- help.kobo.com (snippet), kdp.amazon.com (via free-sample-chapter file), Google Play Books DAISY guide (snippet: "Free Sample button")
- the project workspace (Gaughran 1-CTA 1.4x)