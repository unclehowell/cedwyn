# Google Play Books Partner Center: a free retail shelf for the e-books (Android, Spanish-speaking readers)

Harvested 26 Oct 2026 (skills harvest). Free to list; Google pays a majority share on each sale. Relevant because Cedwyn's Patagonia/Argentina half reads mostly on Android phones.

## What the primary sources establish
- Google Play Books Partner Center Help, "How to sell books on Google Play" (support.google.com):
  - "There is no cost for you to sell books on Google Play." Revenue share is "always based on the list price you provide", even when Google discounts.
  - Files: **PDF or EPUB**; upload both and readers choose the original PDF layout or reflowable EPUB text.
  - Publisher chooses countries, DRM on/off, and list prices per currency. Except where Google acts as agent, Google may set the shop price but pays on the list price.
  - "A limited percentage of your book will be available for preview on Google Books" (a searchable preview that links to the store).
  - E-book sales only in certain countries; check the list for GB and AR before planning.
- Practitioner guide (publishing.co.uk, Robert Prime, self-published author, reviewed May 2026): Google Play pays **70%** on e-books; access to direct self-publishing has reopened; Android is "the majority of the world's smartphones", so it is strongest where Apple is weak, **including parts of Latin America**; Google's own discounts can trigger Amazon price-matching; for UK-only authors it is the lowest-priority wide store, worth direct attention when readers are Android-heavy or for an "also available on" retail link.
- Practitioner testimony (Medium, author account, title and preview only; the page refused our fetch): account approval took **18 days**; one live book showed **zero sales in 30 days**. A listing alone sells nothing; it is a shelf, not traffic.
- Draft2Digital also distributes to Google Play (same publishing.co.uk guide), bundled with library and other stores.

## The playbook
1. Decide the publisher name first (account, tax interview, payout details, the name shown on the listing). This is the owner's decision.
2. Partner Center > add book > metadata: title, subtitle, description (first 2 lines matter on phones), language (en / cy / es as separate editions), BISAC subject (History / Europe / Great Britain / Wales; History / Latin America / South America), contributor names.
3. Upload EPUB (reflowable, best on phones) plus the PDF; cover 1:1.6, at least 1,000 px wide. Run EPUBCheck before upload.
4. Prices: list in GBP and ARS/USD; keep the Google list price equal to the direct Cedwyn price so no shop undercuts the direct page. Preview: allow 10-20% so the Google Books preview is searchable.
5. Link the Play listing from /ebooks/ only as "also on Google Play" for Android readers who won't use a card on an unknown site; keep the direct checkout first.
6. Monthly: Partner Center sales and preview reports; log to the funnel weekly report.

## How we apply it to Cedwyn
- **Needs the project lead's call before anything is created** (same issue as Goodreads): the seller/publisher name and author field. Using the archive name "Cedwyn" or the company name avoids naming him; the merchant markup currently shows "DATRO CONSORTIUM LIMITED" as seller, and the Play publisher name should match whatever he picks. Account set-up involves tax and bank details only he can give.
- Fit: the Spanish editions for Patagonian readers are the strongest case (Android-heavy, card trust on a new site is low); the Welsh/English editions get the retail-backup link.
- Format gap: the build folders hold PDFs only (e.g. the names e-book draft); an EPUB build step would be needed for good phone reading. Pandoc can make EPUB from the same source, but nothing was installed this run (disk 1.8 GB free).
- Zero spend: listing is free; Google takes its share only on sales.
- Check first: bizdev task [record] (library e-lending via Draft2Digital) may already cover Google Play through D2D; don't list the same edition twice (direct and via D2D). Note 26 Oct 2026: D2D now charges $20 activation + $12/yr under $100 net (since 15 Apr 2026), so direct listing is the free route.

## Sources
- support.google.com
- play.google.com
- publishing.co.uk (May 2026)
- medium.com (search preview only)