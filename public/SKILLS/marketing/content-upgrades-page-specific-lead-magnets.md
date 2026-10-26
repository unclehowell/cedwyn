# Content upgrades: a page-specific free extra in exchange for an email

Skill: instead of one generic "join the list" box, offer a small free extra that belongs to the page the reader is on (a checklist, a transcription, a PDF of the page), with the link at the TOP and bottom of that page. Skills harvest, 26 Oct 2026.

## The evidence
- **Brian Dean, Backlinko (read in full; his own blog, an older post):** one post ("Google's 200 Ranking Factors") converted 0.54% of visitors to email. He made a checklist for that post and added two links (top and bottom). Conversion went to **4.82%** (+785% on the previous month), **370 sign-ups from 4,700+ unique visitors**. Those two links brought **30% of all new subscribers**, more than 16 of his 54 site-wide forms. He chose the resource by reading comments on the post ("too much information, how do I put it into practice?"). His 5 steps: pick a high-traffic page; find the resource that would make it better; make it; add it to the page; collect the sign-ups.
- **Devesh Khanal, Grow and Convert (read; post last updated 13 Apr 2018):** he does professional A/B testing and notes you never see several-hundred-percent lifts from normal tests; topic-specific offers are the exception. His agency audit of Backlinko posts with upgrades: posts that offered the upgrade **at the top converted 315% better** than those that offered it only at the end, because most visitors never scroll down. A reader of his found the **plain PDF of the post** beat a "true" upgrade (a checklist) by almost double on one post, and beat a full data spreadsheet on another (his screenshots; exact rates not stated in text, so **not checked**). Alternatives he recommends for consumer blogs: a short, very specific Q&A (the 5 real questions readers ask on that topic).
- Leadpages "18% average landing page" figure seen in a search snippet (designrr.io), source not opened: **not checked**, not used.
- Caveat: both cases are marketing blogs with big traffic. At our volume the point is the *rate*: a page that converts 0.5% gives us nothing a month; one that converts 4-5% starts a list.

## How to do it
1. **Pick the pages.** Search Console / Cloudflare: the 3 Cedwyn pages with the most real visits (not /ebooks/ itself).
2. **Choose the extra per page.** What would a reader of THAT page want to keep? Options that work: (a) a one-page PDF of the page with its source list; (b) a transcription or clean scan of the record the page is about; (c) "5 questions readers ask about this, answered". Never something that gives away a paid e-book chapter in full.
3. **Make it** (one page, branded, with the free edition link and the /ebooks/ link inside; utm_source=upgrade&utm_campaign=<page-slug> on links that leave the PDF).
4. **Place it at the top** (one line under the first paragraph: "Get the 1824 survey extract as a printable page") **and at the bottom**. One link each, same offer.
5. **Capture**: Mailchimp embedded form or hosted form with a hidden tag per upgrade (e.g. `upgrade-1824-survey`); the confirmation / welcome email delivers the file. Readers then flow into the existing welcome sequence (welcome-sequence-first-sale-small-ebook-list.md).
6. **Measure** per page: sign-ups / unique visitors over 4 weeks; keep the winners, swap the losers' offer for a PDF of the page (the cheap fallback).

## How we apply it to Cedwyn (PROPOSAL; public-facing, owner GO first)
- Page: the 1824 record page -> upgrade "The 1824 David Stewart survey: extract and plain-text transcription (one printable page)". Wording on page: "The 1824 David Stewart survey is the first record mention found." Tag `upgrade-1824-survey`.
- Page: the farm timeline / family page -> upgrade "Timeline of the records, one page". Wording: "The family acquired Tŷ Mawr in 1667 (1974 newspapers; ITV News 1988)." No Bute-era dates.
- Spanish version for the Patagonia pages: same extra in Spanish, tag `upgrade-es-<slug>`.
- Fallback for any other popular page: "Download this page as a PDF" (cheapest to make; Grow and Convert's reader found it often wins).
- Build: PDFs made locally from the page HTML (no new install; reuse the existing EPUB/PDF tooling), stored on Cedwyn, linked only from the form's thank-you/welcome email. Page edits go through the sole cedwyn committer or the project workspace Mailchimp form/tag changes drafted in a HubSpot [BIZDEV] task first.
- Rules: banned-words check on every PDF and line; nothing names the owner; Cedwyn internal links only on the pages; zero spend.

## Sources
- backlinko.com (read in full)
- growandconvert.com (read)
- designrr.io (snippet only, not checked)