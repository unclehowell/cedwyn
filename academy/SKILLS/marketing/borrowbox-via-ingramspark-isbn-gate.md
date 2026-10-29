# BorrowBox re-check: the free IngramSpark door, gated on an ISBN

Harvested 29 Oct 2026 (skills harvest 22:39Z). Zero spend. Updates the BorrowBox verdict in library-elending-overdrive-libby-via-kobo.md ("skip BorrowBox"): a no-fee route exists, and the only cost is an ISBN, which is the owner's spending decision.

## Why BorrowBox matters in Wales
- Libraries Wales names BorrowBox as the e-book and e-audiobook service for Welsh public libraries (libraries.wales, search snippet; the page needs JavaScript). Vale of Glamorgan libraries, which include Penarth, offer BorrowBox and Libby (read 26 Oct, existing skill).
- Bolinda, which owns BorrowBox, supplies "more than 3000 public and school libraries" (bolinda.com, read 29 Oct).
- Libby through Kobo Writing Life (KWL) covers OverDrive only, so a Welsh reader who uses BorrowBox can't borrow a Cedwyn title today.

## Routes to BorrowBox for a self-publisher (Oct 2026)
| Route | Reaches BorrowBox? | Cost | What we earn | Status for us |
|---|---|---|---|---|
| Bolinda direct | No self-publisher door found (contact addresses only) | - | - | n/a |
| Draft2Digital (D2D) | Yes, since 22 Jun 2021 (D2D blog, read) | US$20 activation fee plus $12/yr maintenance from Apr 2026 (publishing.co.uk, checked 2 Sep 2026, read; D2D FAQ confirms the activation fee, read) | 46% of a library purchase, 3.8-4.6% per loan (Inkfluence AI guide checked 28 Oct 2026, read; vendor page) | **Excluded**: standing "never D2D" rule plus zero spend |
| PublishDrive | Library channels on the paid plan | US$13.99/month (pricing page, snippet) | 0% revenue share | Excluded: monthly fee |
| **IngramSpark** | **Bolinda is on IngramSpark's ebook partner list** (plan-your-book/ebooks, read 29 Oct; it appears in the list of partners that take fixed-layout files, so reflowable EPUBs go there too) | **Free to sign up and upload an ebook** (pricing page, read) | 85% of net revenue IngramSpark receives, any retailer (pricing page, read) | **GATE: needs our own ISBN** |

## The ISBN gate
- IngramSpark's free ISBNs are for US publishers only. In the UK an ISBN comes from Nielsen (ingramspark.com, snippet).
- Price quoted on IngramSpark's own video: £89 for one ISBN, £164 for ten (snippet, not checked on Nielsen's page). Each format needs its own ISBN.
- The same ten-pack would also unlock UK PLR registration for e-books (uk-plr-ebook-library-loans.md), Books Council of Wales print distribution (ffolio-cymru-books-council-wales-listing.md) and award entries needing an ISBN. So one owner decision opens four doors. Put that sentence in the proposal.

## How to do it (once the project lead states GO on the ISBN)
1. Buy a 10-pack of ISBNs from Nielsen in the project lead's chosen publisher name (the imprint name, never his personal name in public metadata). Assign one ISBN to each e-book edition.
2. Open an IngramSpark account (owner step: identity and tax details). Add each title as an ebook: EPUB 2 or 3, max 100 MB, no image over 5.6 MP. IngramSpark shows validation errors as soon as you upload, so run our epub_lint/epubcheck routine first (see epub-editions-sphinx-epubcheck.md).
3. Channels: Cedwyn already sells direct on Kobo/OverDrive (KWL), Apple and Google Play. Leave those off in IngramSpark if the dashboard allows per-channel opt-out (not checked), so the same edition isn't listed twice. Keep Bolinda and the other library partners on.
4. AI rule: IngramSpark requires "significant human review and contribution, credited" for AI-assisted books (Inkfluence AI guide, snippet). Check each volume's credits page before uploading.
5. Library price: set it a few units above retail, as for OverDrive (see the Kobo skill). Libraries pay per copy, so price for a library's budget, not a reader's.
6. Demand: after the title shows on BorrowBox, ask readers in the Vale and Cardiff to request it through their library. Who chooses BorrowBox titles for Welsh libraries, the shared consortium or each authority, is not checked. The question to Vale Libraries is a HubSpot draft, sent only on the project lead's GO.
7. Log library sales by authority from IngramSpark reports, plus `?ref=borrowbox` on the back-matter link.

## How we apply it to Cedwyn
- **PROPOSAL for QUEUE-after-framing (the project lead's decision):** "Buy a 10-pack of ISBNs (about £164, Nielsen, price not checked) to unlock BorrowBox via IngramSpark (free upload, 85% of net), UK PLR on e-book loans, Books Council of Wales print distribution, and ISBN-gated awards. Without it, Welsh BorrowBox readers can't borrow Cedwyn." Log it once, with no repeats.
- Until then, the Kobo to OverDrive route stays the free library route, and BorrowBox stays parked rather than skipped.
- Kill rule: if fewer than 3 library copies are sold across BorrowBox and OverDrive within 6 months of listing, stop library pricing work and keep the listing passive.
- Rules: zero spend without the project lead's GO; never D2D; public metadata never names the project lead; editorial banned words apply to blurbs.

## Sources
- ingramspark.com (read 29 Oct 2026; Bolinda in ebook partner list, EPUB specs)
- ingramspark.com (read; free signup/upload, 85% of net)
- ingramspark.com (snippet; US-only free ISBNs, Nielsen for UK)
- draft2digital.com (read; 22 Jun 2021)
- draft2digital.com (read; activation fee)
- publishing.co.uk (read; checked 2 Sep 2026, D2D fees Apr 2026)
- inkfluenceai.com (read; vendor; checked 28 Oct 2026; D2D 46% / 3.8-4.6%)
- bolinda.com (read; 3000+ libraries)
- libraries.wales (snippet; BorrowBox for Welsh libraries)