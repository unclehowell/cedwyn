# Academy plan shape: free trial vs paid week pass vs annual plan (2026 data)

Skill for: deciding whether the £49.99/month Cedwyn Academy (/learn/) should add a free trial, a paid short pass, or an annual plan. Written 2026-10-27 for the project lead's Cedwyn work. Today: monthly only, no trial, no annual plan (the project workspace), zero members.

## What the numbers say (sources read today unless marked)
- **Free trials are getting weaker.** Recurly (76 million subscribers; vendor data, read): traditional trial-to-paid conversion fell from 47% in 2021 to 34% in 2025. Recurly's Jan 2025 press release (67 million subscribers, read): free-trial conversion fell from 46% to 33%.
- **Trials without card details convert far worse.** Recurly acquisition chapter (2022 data, read): trials that did not require billing information converted at 12.0% on average, with an average trial length of 39 days; 44% of its customers' subscribers came in through trials. SaaS roundups (Userpilot, Baremetrics, snippets only, not checked) put opt-in (no card) trials around 18-25% and opt-out (card up front) at 49-60%.
- **Paid micro-passes are the new trial.** Recurly (read): short paid passes (day, week, weekend) are "filling the gap" and convert 13% of buyers into recurring plans. Its reasoning: someone who pays $5 for a week has higher intent than someone who types a fake email for a free week.
- **Non-use is the main reason people cancel.** Recurly (read): 51% of consumers who cancelled said they "weren't using it enough". Their prescription: a re-engagement flow after 14 days with no login.
- **Annual plans keep people far longer.** RevenueCat State of Subscription Apps 2025 (app data, read): after 12 months yearly plans retain 44.1% (down from 47.1%), monthly 17.0% (down from 18.8%). Upper-quartile apps keep 60-75% of yearly subscribers. First renewal is the big cliff: 15-40% churn on monthly plans. Nearly 30% of annual subscriptions are cancelled (auto-renew off) in the first month. Yearly plans are 67% of sales in Health & Fitness and 65% in Travel, and a contributor names Education among the annual-dominant categories. Monthly plans reactivate best; yearly plans reactivate at only 4.58%.
- **Caveat:** RevenueCat is app data and Recurly mixes media, software and boxes. None of it is heritage-education membership. Treat as direction, not forecast.

## The UK legal cost of each option (from our own skill uk-subscription-regime-dmcc-academy-stripe-by-design.md)
- **Free or discounted trial:** a trial-end reminder, a separate cooling-off notice on day 1 after conversion, and a 14-day renewal cooling-off with a proportionate refund that cannot be waived.
- **Annual plan:** an extra reminder before each 12-month renewal and the same renewal cooling-off notice.
- **One-off paid pass that does NOT auto-renew:** not a subscription, so none of the above. It is an ordinary digital-content sale (the Reg 37 consent tick on checkout still applies; see uk-digital-checkout-reg37-consent-vat.md).

## How to do it
1. **Do not add a free trial at zero members.** With almost no traffic (about 4 real e-book viewers a day this week), a trial mainly adds legal admin and abusers. Conversion trend is down and no-card trials sit near 12%.
2. **Offer a paid week pass instead, as a one-off payment.** Example: "Academy week pass, £7.99, 7 days, no renewal". Build it as a Stripe one-time Payment Link whose success page grants 7 days of access (same /api/member check with an expiry). On day 5 email the pass holder: "your pass ends Thursday; continue monthly at £49.99". Never auto-convert it, because that would turn it into a trial under the DMCC regime.
3. **Add an annual plan only when the monthly plan has its first 10 paying members.** Price it at 10 months for 12 (about £499, a ~17% saving). Show it beside the monthly price, monthly first. Before launch, write the extra renewal reminder and cooling-off email.
4. **Anchor the usage habit from day one.** Since non-use drives half of cancellations: track last lesson or evidence open; at 14 days idle send one "pick up where you left off" email naming the next lesson (ties into academy-member-onboarding-first-week-activation.md).
5. **Measure:** pass buyers to monthly (%), monthly first-renewal churn, annual share of new members. Compare with Recurly 13% (pass to recurring) and RevenueCat monthly first renewal 15-40% churn.

## How we apply it to Cedwyn
- Proposal for the queue (price decisions are the owner's; the project lead said "decide all" on 27 Oct, so the root may choose to ship): a £7.99 one-off 7-day Academy pass on /learn/, no renewal, success page sets a 7-day member flag. This adds a low-cost door without trial obligations.
- Keep monthly £49.99 as the main plan. Revisit annual at 10 paying members.
- The member check in the cedwyn-api Worker needs an `expires_at` for pass holders; the platform worker owns that code.
- Never word the pass as "free trial". Wording: "Try a week of the Academy for £7.99. No subscription."

## Sources
- recurly.com (read 2026-10-27)
- recurly.com (read 2026-10-27)
- recurly.com (read 2026-10-27)
- revenuecat.com (read 2026-10-27)
- userpilot.com and baremetrics.com (snippets only, not checked)
- Internal: the project workspace; the project workspace