# Free first edition → paid update: what conversion to expect, how to count it, where the upgrade ask goes
Written 31 Oct 2026 (skills harvest, root priority: turning a free first-edition download into paid upgrades, with numbers). Mechanics of permafree/Baen are in free-first-edition-funnel.md and free-previous-edition-paid-latest-baen-pattern.md; this file is the benchmark + measurement + trigger layer they lack.

## The numbers (primary sources, read 31 Oct 2026)
- **Lenny Rachitsky, benchmark survey of 1,000+ products** (B2B/prosumer software, so an analogy, not a book number):
  - Freemium (free forever, pay for more): **3-5% GOOD, 6-8% GREAT**. Spread is wide: 20% of products convert below 2.5%; the biggest bucket (~33%) is 2.5-5%; "not uncommon" to be below 1%.
  - Free trial (everything, for a limited time): **8-12% GOOD, 15-25% GREAT**; most common bucket 7.5-10%; only 7% below 2.5%. Lenny's reading: trials attract people readier to buy, and time pressure helps. Trial sign-up rates are lower (5% vs 9% for freemium).
  - He measures per audience, not blended: "monitor conversion rates across different audiences and not only the blended rate."
- **Substack, Going paid guide:** "We tend to see 5-10% of free subscribers convert to paying subscriptions, with 10% being a rate to aim for." That is an *engaged email list* converting to recurring paid, after the writer asks. Practitioners on r/Substack report a ~3% median (forum testimony, not checked).
- **Authors Guild reader survey (news release 9 Jun 2026):** only **19%** of text-format books read in the prior month were bought new (print or ebook); 6% via subscriptions, 10% used, **29% from libraries**, 35% borrowed/own shelf/other. Library members read 16% more books. Reading free is the norm; paying is the exception even among readers.

## What that means in plain arithmetic
- At a freemium-style 3-5%, **one paid update needs ~20-33 free downloads**; at 1% (common for low-touch), ~100.
- Free downloads that are not counted cannot be converted or measured. Rate = paid buyers of edition N+1 who previously took edition N ÷ people who took edition N. Without an email or a download count you only have the numerator.
- Two levers move the rate the most in the data: **an engaged list that gets asked** (Substack 5-10%) and **a reason to pay now** (trial-like time pressure, 8-12%). A free edition that is complete forever and never followed up behaves like low-end freemium.

## The playbook
1. **Count the free takes.** Log every free-PDF fetch (edge logs / a download event) per book per day. Separate bots (non-200, no referrer, known crawlers) from people.
2. **Capture at the free take, opt-in.** Offer "Email me when this book is updated" beside the free download (not a wall; see stop-rate-free-registration-wall-ask-after-engagement.md). This is the highest-intent opt-in an archive book has, because the paid product *is* the update.
3. **Make the update the trigger.** When edition N+1 ships, send one email to that book's opt-ins: what changed (counted: "+14 records, 2 new maps, 3 corrections"), the price, one link. That is the "reason to pay now" moment; send it once, plus at most one reminder.
4. **Put the ask inside the free PDF.** Last page and table of contents: "This is the free first edition of [date]. The updated edition adds ..." with a link to the book's own page. Readers who finish are the warm audience.
5. **Show the diff on the book page.** A short "Changes since the free edition" list per book. Readers pay for what is visibly new, not for a version number.
6. **Measure per book and per audience** (Lenny's rule): opt-in list vs. direct visitors vs. referral. Targets: 1% = floor, 3-5% = good, 10% from the update email to the opt-in list = great.
7. **Review at 100 free takes per book**, not before; below that the rate is noise (at 3%, 100 takes give ~3 sales, and 0 sales is still about 5% likely).

## How we apply it to Cedwyn
- **Current state (checked live 31 Oct 22:42Z, cedwyn.bucklerfamily.estate/ebooks/):** every book's first edition (v0.0.1) is a free direct download, no email; updated editions (v0.0.2) are £4.99; four core books £19.96 together; "121 first editions released so far, each £0.00". The only email capture is "Free first chapter by email". So free takes are uncounted and no downloader can be told an update exists: the rate is not measurable today.
- **Smallest changes, in order (PROPOSED for the onpage/bizdev runs, not done by this harvest):**
  1. Count v0.0.1 PDF fetches per book from edge logs (cf_traffic.py already reads Cloudflare; add a PDF path filter). Report weekly in the growth report: free takes, paid v0.0.2, rate.
  2. Add an opt-in checkbox/field "Email me when this book is updated" beside each free download (Mailchimp tag per book; UK consent wording as for the chapter form). Download stays free with or without it.
  3. Last page of each v0.0.1 PDF: dated "free first edition" line + the counted list of what the update adds + internal link to the book's page.
  4. "Changes since the free edition" block on each book page (counts only, neutral wording).
  5. On each new edition: one update email per book tag, one reminder max, through Mailchimp; never to people who did not opt in.
- **Expectations to state honestly:** with today's traffic (181 search impressions, 0 clicks in October) the free takes are likely few dozen at most, so expect 0-1 upgrade sales per book until takes reach ~100. The update email to opt-ins is the one lever with a 5-10% precedent.
- **Rules:** price changes, new email journeys and the opt-in field are PROPOSALS (QUEUE-after-framing.md / bizdev BRIEF.md); the project lead's editorial rules apply to every public line; never name the project lead; no outbound links on the site.

## Sources
- lennysnewsletter.com (read 31 Oct 2026; freemium 3-5/6-8%, trial 8-12/15-25%, distribution buckets)
- substack.com (read; "5-10% ... 10% being a rate to aim for")
- reddit.com (search snippet only; ~3% median, not checked)
- authorsguild.org (read; 19% bought new, 29% library)
- cedwyn.bucklerfamily.estate (read live 31 Oct 2026)