# Household / group seats on the Academy subscription (Stripe quantity, Duolingo family-plan signal)

Skill date: 30 Oct 2026 (skills harvest ~23:30Z). Status: PROPOSAL only. The shop FAQ answer on "group orders" waits on the project lead's decision, and no price changes without him. School licences for e-books are covered separately in school-institution-multi-user-licence-tier-ebooks.md (Tes 3.5x). This file is about seats on the recurring £49.99/month membership.

## What practitioners report
- **Duolingo, Q3 2025 shareholder letter** (SEC filing, read): "We continue to see a mix shift toward our higher-priced subscription tiers, including Max and our family plan, which drove a 7% year-over-year increase in subscription revenue per average paid subscriber, or ARPU."
  - Q1 2025 letter: bookings beat guidance, "driven by continued subscriber growth and the strong performance of our higher-priced plans like Duolingo Max and the family plan."
  - Their paid-subscriber count leaves out "non-paying members of a family plan". A household plan is one payer with extra users, and it raises revenue per payer.
- **Stripe Payment Links docs** (read): "Let customers adjust quantity" in the product section, with optional minimum and maximum. The buyer picks the number of seats on our existing link flow. No code is needed.
- **Stripe Billing docs** (read): a quantity on a subscription is "per-seat licensing", priced linearly: 10 seats cost 10 times the base price. Tiered prices exist if a discount is ever wanted, but a discount is a price change.

## The how-to
1. **Seats as quantity, at the same unit price.** One payer buys N seats. This adds no new price, so it isn't a price change.
2. **One code per seat.** The member sync reads the paid quantity and issues N member codes. The payer hands them out. Store seats and codes on the member row in the Academy's own derived database.
3. **Cap it.** Set a Payment Link maximum, e.g. 6 for a household or society table. Bigger groups go to a manual quote, which needs the project lead's GO.
4. **Count payers and seats separately,** as Duolingo does, so the member numbers stay honest.
5. **A household discount (e.g. a 2–6 seat bundle) would be a price change.** List it only as an option for the project lead.

## How we apply it to Cedwyn
- **Options for the pending "group orders" FAQ, for the project lead to choose from:**
  - (a) "Each person needs their own membership."
  - (b) "Buy several seats in one checkout; each gets its own code." This is the linear-quantity route above.
  - (c) "Societies and schools: ask for a group quote." This is manual and needs his GO.
- Recommend (b) once the Academy webapp is live and the first members have joined. It reuses the £49.99 link with the quantity option switched on and needs one schema field in the member sync. Do nothing before the project lead picks.
- Related: school-institution-multi-user-licence-tier-ebooks.md, academy-plan-shape-trial-vs-paid-pass-vs-annual.md, academy-hard-paywall-vs-freemium-free-sample.md.

## Sources
- sec.gov (Q3 2025, read)
- sec.gov (Q1 2025, read)
- docs.stripe.com (adjustable quantity, read) · docs.stripe.com (per-seat, read)