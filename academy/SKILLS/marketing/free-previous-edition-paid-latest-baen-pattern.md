# Free previous edition, paid latest edition (versioned freemium)

> Update 30 Oct 2026 (21:50 rule): the minus series now starts at **-v0.0.2** — there is no -v0.0.1. Old -v0.0.1 → -v0.0.2, old -v0.0.2 → -v0.0.3, and so on; hashtags #_v0.0.2, #_v0.0.3 …. v0.0.2 and v0.0.1 are unchanged. Examples below that show -v0.0.1 / #_v0.0.1 as an older label predate this rule.

Written 30 Oct 2026 for Cedwyn's site-wide version rule (latest v0.0.2 at £4.99; v0.0.1 and older v-0.0.1, v-0.0.2 ... free).
Sibling files, not repeated here: free-first-edition-funnel.md (permafree first book + reader magnet), versioned-release-rising-price-ladder.md (Leanpub price ladder), new-release-launch-backlist-price-promo.md (BookBub backlist promo), release-notes-changelog-versioned-ebooks-art.md.
What this file adds: the evidence that giving away the OLDER edition does not eat sales of the newer one, and the page pattern that sends free readers to the paid edition.

## Evidence (read 30 Oct 2026)
- **Baen Free Library, Eric Flint, "Prime Palaver #6" (15 Apr 2002). Primary, author's own royalty statements.**
  - *Mother of Demons* went free in autumn 2000 at 9,694 copies sold and 54% sell-through. Eighteen months later it stood at about 18,500 copies and 65% sell-through. Flint credits most of that to his own rising profile, not the library.
  - *An Oblique Approach*, a 1998 paperback, had sold 835 and then 795 copies in successive half-years. It went free in autumn 2000, and the next comparable period sold 1,904, which is +239%.
  - *In the Heart of Darkness*: 1,704 copies before going free, 1,886 a year later. That is a rise instead of the usual decline.
  - *1632* was put in the library when its cheaper paperback came out, a year after the hardcover. It reached about 34,000 net and 88% sell-through. Flint gives the industry paperback average as 40-50% sell-through.
  - Traffic: more than 130,000 visits to the free library in Q4 2001, about 1,500 a day.
  - His stated mechanism: "By far the main enemy any author faces ... is simply obscurity." Readers won't pay to try an unknown author, but a free older book lets them try first.
- **Hilton & Wiley 2010, Journal of Electronic Publishing 13(1). Peer-reviewed; abstract read.**
  - BookScan sales for 41 books, 8 weeks before and 8 weeks after a free digital version appeared.
  - Three of the four categories sold more afterwards.
  - The search snippet of the full text states only 4 of 24 Tor titles rose. That is the contrary case: a free giveaway of the current book in a single burst did not lift sales.
  - The full text was not read (403), so treat the Tor figure as not checked.
- **Live practitioner pages (read 30 Oct 2026):**
  - automatetheboringstuff.com: "Over 500,000 copies sold. Free to read under a Creative Commons license." The 2nd and 3rd editions each stay online at /2e/ and /3e/, with buy links on every page.
  - eloquentjavascript.net: old editions are still free at /3rd_edition/ and /2nd_edition/. Each carries a top banner, "A 4th edition is available. Read it here!"
  - The pattern: old versions stay up, stay free, and every page points one step forward.

## What works (rules)
1. **Free the older edition, never the newest.** Flint freed a title when its cheaper or later format appeared. Old editions stay as discovery doors.
2. **Every old-edition page gets one forward banner** at the top, Eloquent JS style: "A newer edition (v0.0.2) is available — what changed ->". It links to the paid version's page, not to checkout.
3. **Keep old editions online at stable URLs.** Never 404 or redirect them away. They are the pages that collect links and search traffic. Use a canonical tag only where the content is a true duplicate.
4. **Say what is new in v0.0.2** in one or two concrete lines (new records, new chapters). "Free vs paid" is weaker than "what you'd be missing". The release-notes file covers the format.
5. **Don't judge it from an 8-week burst.** Tor's 1-in-6 result came from a short giveaway of the current title. Baen's gains showed up over 12-18 months of continuous free availability. Measure free downloads → v0.0.2 page views → sales monthly, for at least 3 months.
6. **No "was £x" / saving assertions.** The free edition is a different edition, not a discount. This also keeps clear of CMA/DMCC price-comparison rules (see versioned-release-rising-price-ladder.md).

## How we apply it to Cedwyn
- The rule the project lead set on 30 Oct 2026 already matches the Baen pattern: latest is paid, older is free.
- **To do:**
  - Every free version page (v0.0.1, v-0.0.1 ...) on /ebooks/ and the documentary gets the forward banner: "Newer edition: #_v0.0.2 — what's new ->". It links to that book's v0.0.2 page and is never a buy.stripe.com link fired by a script.
  - Give each paid v0.0.2 card a two-line "new in this edition" note.
  - Keep every old version's URL alive.
- **Measure** in the sales-fix log: free-version downloads, banner clicks (signup-source/UTM tag `src=oldedition-banner`), v0.0.2 page views and sales, monthly. After 3 months with 0 banner clicks, rewrite the banner. Never change price because of it.
- **Owners and boundaries:** the sales-fix and documentary workers own the page edits, so this file is a proposal for them. No price changes and no bandit tests on prices.

## Sources
- web.archive.org (Flint, Prime Palaver #6, 15 Apr 2002, read)
- en.wikipedia.org (read; context)
- scholarsarchive.byu.edu (Hilton & Wiley 2010 abstract, read) · doi.org (full text, snippet only)
- automatetheboringstuff.com , /2e/ , /3e/ (read)
- eloquentjavascript.net , /2nd_edition/ (read; forward banner)