# Academy price changes later: grandfather existing members, write the variation clause now

Date: 2026-10-30 (harvest ~23:45Z). Status: PROPOSAL only. No price tests and no price change are planned; the project lead owns all pricing. This is about wording the terms and deciding a policy BEFORE the first member joins, so a later change is lawful and cheap.

## Why now
The Academy has 0 members (member-sync log, 30 Oct). Every member who joins at £49.99/month joins under whatever terms the checkout shows today. If the terms say nothing about price changes, the safest later route is to keep each existing member on their price (Stripe already does this by default: a subscription keeps the Price object it was created with, and a new Price for new joiners leaves old subscriptions untouched until someone edits each one).

## The evidence
- CMA37, Unfair contract terms guidance, 22 July 2026 (read in full at paras 4.34, 6.52-6.55, gov.uk PDF):
  - A term letting the trader vary the price "upon reasonable notice" may look simple but is not comprehensible, because the consumer cannot tell "how much the price may increase, how often, and why" (4.34).
  - Grey List: a term letting the trader raise the price of digital content or services "without giving the consumer the right to cancel the contract if the final price is too high" may be unfair (Schedule 2, quoted in 6.45).
  - More likely fair (6.55): the consumer clearly expects increases (more likely in a contract of indeterminate duration, which a monthly membership is); level and timing specified; an objective justification (an increase that "simply generates an income stream for the trader" is unlikely to be justified); price can also go down; consumers are "genuinely free to escape" the increase by ending the contract, with "sufficient and effective advance notice".
  - Price wording must also meet DMCC Part 4 Ch1 price transparency (CMA209), cited in footnote 251.
- Lewis Silkin, 29 Jul 2026 (read): the final CMA37 adds new worked examples on in-contract price increases.
- Patrick Campbell (ProfitWell founder), quoted by Userpilot 2026 (read, secondary): "grandfather discounting": tell existing customers the price is going to X but phase it in 6-12 months later, rather than either a hard switch or permanent grandfathering. Userpilot's own rule of thumb: monthly payers 30 days' notice, annual 60-90 days, plus a reminder about a week before the effective date (practitioner opinion, no data).
- Founder anecdotes (membership.io citing Stu McLaren, already in founding-cohort-academy-launch-honest-urgency.md): founding members "often keep the rate locked"; Jen Waldman $79 founding -> $99 after launch. Single-creator stories, no method.
- Netflix: a LinkedIn post (Jacco van der Kooij) states churn rose 1.8% -> 2.5% after the Jan 2025 rise and fell back to 2.0% by May, with half of cancellers returning within 6 months. NOT checked against the original (likely Antenna); do not quote publicly.

## How to do it (playbook)
1. Decide the policy in one line now: either (a) "your price is fixed for as long as you stay a member" (permanent grandfathering, simplest, strongest founding promise) or (b) "we may change the price for everyone with at least 30 days' email notice; you can cancel before it takes effect and will not pay the new price".
2. If (b): put it in the checkout terms and key-info box with the reason category (for example the cost of running the Academy), a cap if possible ("no more than once a year"), and the free exit. A bare "we may change prices" is the CMA's example of a term that fails.
3. If a rise ever happens: new price for new joiners first; existing members either stay (a) or get 30+ days' notice, a reminder 7 days before, and a one-click cancel link (b). Under the DMCC subscription regime (from Jan 2027, see uk-subscription-regime-dmcc-academy-stripe-by-design.md) the cancel route must be online and easy anyway.
4. Revenue check before any rise: a rise from P0 to P1 is revenue-neutral if at least P0/P1 of members stay. tools/price_rise_breakeven.py prints the break-even (e.g. £49.99 -> £59.99: keep 83.3%, i.e. up to 16.7% may leave).
5. Never present a founding price as "ending soon" unless there is a real date (DMCC; see founding-cohort file).

## How we apply it to Cedwyn
- Recommend to the project lead (via the queue, not a message): option (a), "your price stays the same for as long as you stay a member", shown on the Academy subscribe card under v0.0.2. It costs nothing at 0 members, makes the founding offer honest without fake urgency, and avoids ever writing a CMA-compliant variation clause.
- If he prefers (b), the exact clause to add to the Academy terms page: "We may change the monthly price, no more than once in any 12 months, to reflect the cost of running the Academy. We will email you at least 30 days before. If you do not want to pay the new price, cancel before the date in that email and you will not be charged it." (Draft; a solicitor should read it; not checked against a lawyer.)
- Stripe: never edit existing subscriptions' price in bulk; create a new Price for any new level.
- Nothing changed live; no price test.

## Sources
- assets.publishing.service.gov.uk (CMA37, 22 Jul 2026, read)
- lewissilkin.com (read)
- userpilot.com (read; Campbell quote is secondary)
- docs.stripe.com (read: replacing a price needs an explicit subscription update)
- Netflix churn figures: LinkedIn post via search snippet, not checked