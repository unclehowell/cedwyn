# Pay-what-you-want (PWYW) with a floor or a suggested price for a small e-book shop

Skill harvested 2026-10-26 (skills harvest 17:22). Scope: letting buyers name their price on Gumroad or a Stripe Payment Link, when it raises revenue and when it loses money. Fixed-price bundles and local-currency pricing are separate skills already in the index.

## What the evidence shows

1. **Pure PWYW (zero floor) sells many more units but at a tiny price.** Field experiment at an amusement park (Gneezy, Gneezy, Nelson & Brown, Science 2010), summarised by Stanford GSB (Frank Flynn, read in full): of 28,224 riders shown a ride photo at the fixed $12.95, about 0.5% bought (about 6 cents profit per visitor). Under pure PWYW 8.4% bought, but paid about 92 cents each, below production cost: a small loss. With PWYW plus "half goes to charity", 4.5% bought at an average $5.33, the most profitable condition. Lesson: an open price needs a reason to pay well (a cause, a visible fair price, or a floor).
2. **A low floor with a visible anchor can raise the average.** Gumroad's Ryan Delk, quoted by Tom Morkes (page read in full; the quote itself is secondhand, original not checked): e-books moved from a fixed $3 to "$1+" saw the average price paid rise to almost $5, about 60% more revenue, with more sales. Paste magazine's PWYW subscription drive: about 30,000 subscribers at about $9 each, about $275,000 (same page, secondhand, not checked).
3. **A suggested price matters.** Gumroad lets the creator set a minimum (including £0) and a suggested amount that pre-fills the field (Gumroad Help article 133 and a 2026 help snippet; the page body did not load for us, so not checked in full). A blogger's PWYW report put the average around $10, rising to just over $11 (snippet only, not checked).
4. **Stripe supports it natively.** Stripe Payment Links has a "Customers choose what to pay" pricing model (one-off only, no recurring), with an optional preset amount and min/max limits (Stripe docs, read).

## When PWYW helps and when it hurts

- Helps: a free or near-free entry product (lead magnet, sample edition) where you want contact details plus some revenue; a fan base that already values the work; a stated cause or a clear "normal price" anchor.
- Hurts: the main paid title with no anchor (buyers default low, as in the 92-cent result); tiny traffic where averages are noise; mixing PWYW and fixed prices for the same item in two places (confuses and undercuts).

## How to run a PWYW test (step by step)

1. Choose ONE item that is not the flagship: ideally the free edition or a single short title.
2. Set the floor: £0 (free with optional payment) for a lead product, or a low floor (for example £3) for a paid short title.
3. Set the suggested price at the normal fixed price, so the field pre-fills with it.
4. Write one line above the button that gives a reason to pay: what the money funds (for example "pays for archive copies and scanning"). Only state what is true.
5. Keep the email capture on (Gumroad collects email on £0 orders), so every name-your-price buyer joins the welcome sequence.
6. Track: units, average paid, % paying above £0, and conversion from page view, for 4 weeks or 50 orders, whichever is later. Compare with the previous 4 weeks.
7. Keep it if revenue per visitor rises; revert if not. Log the result in the project workspace

## How we apply it to Cedwyn

- **Do not change the listed prices without the owner's go-ahead.** Current prices stay: v0.02 £9.99, v0.01 free, bundle £31.99. This file is a proposal for the sales-fix run to put in its report, not a change to make.
- **Proposed test (owner GO needed):** turn the free v0.01 on Gumroad into "£0+" with a suggested £3 and the line "Free to read. If it helped, a few pounds pays for archive copies and scanning." Readers who would have downloaded free still do; the most engaged pay. The £9.99 v0.02 and the £31.99 bundle stay fixed and act as the visible anchor on /ebooks/.
- **Stripe alternative:** a "Customers choose what to pay" Payment Link with preset £3 and min £1 for the same edition, used only if Gumroad is not the primary path for it.
- **Measure:** with about 11 real visits a day, expect weeks before 50 orders; read % paying above £0 as the early signal. Tag the link utm_campaign=pwyw-test.
- **Copy rules:** no banned words; the owner is never named; state nothing about where money goes beyond what is true.

## Sources

- Stanford GSB, Frank Flynn, "Pay What You Want Pricing and Charitable Giving" (summary of Gneezy et al., Science 2010): gsb.stanford.edu - read in full.
- PubMed record of the study: pubmed.ncbi.nlm.nih.gov (abstract snippet only).
- Tom Morkes, "3 Ways Pay What You Want Leads To More Profit Than Fixed Pricing": tommorkes.com - read in full; quoted Gumroad and Paste figures are secondhand, not checked.
- Gumroad Help, "Pay what you want pricing": gumroad.com (body did not load; not checked in full).
- Stripe Docs, "Create a payment link": docs.stripe.com - read.
- justagirlandherblog.com (snippet only, not checked).