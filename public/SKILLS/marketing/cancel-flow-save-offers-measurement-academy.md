# Cancel-flow saves for the £49.99/mo Academy: reason capture, one skippable offer, and measuring saves honestly

Harvested 2026-10-28 02:14Z. Complements uk-subscription-regime-dmcc-academy-stripe-by-design.md (which already states: portal cancellation on, ONE retention screen with a clear cancel button) and stripe-dunning-failed-payment-recovery-membership.md (involuntary churn). This file is about choosing the offer and measuring whether it really saved revenue.

## Benchmarks (with their caveats)
- Chargebee ecommerce guide, via ProsperStack (19 Oct 2026, read): **average 30-day save rate 17.4%** (food delivery 14.1%, health/wellness 21.1%, beauty/apparel 22.9%). A "save" = still uncancelled 30 days after first visiting the cancel page. No date, sample or weighting disclosed - a rough reference only.
- Vendor assertions (marketing, not audited): Churnkey "save rate 54%" for its cancel flows and "20-40% of revenue otherwise lost"; ProsperStack "10-39% of churn" prevented. Treat as ceilings from vendors selling the tool.
- **Pauses are slow money.** ProsperStack followed first-time pause accepters at one ecommerce merchant (Oct 2024-Oct 2025): share who made at least one more payment: **1.4% by 30 days, 8.0% by 90, 34.9% by 180, 45.8% by 365**. Every one counted as "saved" on day one. A pause is a save on paper long before it is revenue.

## Definitions that stop us fooling ourselves (ProsperStack)
- **Save** = accepted an offer. **Deflection** = left the flow without cancelling (may just cancel later). Report both separately.
- Session rate: (saved + deflected) / (saved + deflected + cancelled) sessions. Customer rate (better): customers still uncancelled 30 days after FIRST cancel visit / customers who visited.
- Repeat visits: two abandoned sessions then a cancel = 1 lost customer, not 2 saves.
- Stripe's own retention analytics count a save when an offer is accepted and **reverse it if the customer cancels within 7 days**.

## What Stripe gives us (docs read 28 Oct 2026)
- Customer portal > Settings > Cancellations: allow cancel (on by default), **collect a reason** from a fixed list (too expensive / need more features / found an alternative / no longer need it / customer service / ease of use / quality / other), and **one retention coupon** chosen from your coupons (can be built inline).
- **Retention rules** (Stripe Billing, *private preview*): targeted offers at cancellation by reason, tenure, lifetime value, subscription status or metadata (e.g. "offer a discount to customers who have spent more than 100 USD", exclude trialing). Not generally available - don't plan around it.
- Retention performance charts: save rate, cancellation reasons by product/price, MRR lost to voluntary churn.

## UK law shape (DMCC Act subscription rules, start January 2027 per government Aug 2026; ProsperStack summary 20 Oct 2026, read; not legal advice)
- Offers and "why are you leaving?" are allowed, but the customer must be able to **skip** them and finish cancelling; no offer after offer. Online sign-up => online cancel. How many offers is "too many" awaits official guidance. Keep it to one screen.

## Playbook (small business, few members)
1. Turn on reason collection now - it is free signal even with 5 members.
2. ONE offer, matched to the commonest reason once known. Defaults: "too expensive" -> one-off 50% off next month coupon (a coupon applies to future invoices; it is not a refund); "no longer need it/no time" -> nothing but a warm goodbye and an open door (a pause is slow money and adds admin).
3. Big, plain "Cancel membership" button on the same screen as the offer; never a second offer.
4. Track per member in a sheet: first cancel visit date, reason, offer shown, accepted?, paid an invoice 30 and 90 days later. Save rate = customer rate at 30 days; revenue save = paid at 90 days.
5. Below ~30 cancel visits, numbers are noise - read the reasons, don't A/B test.

## How we apply it to Cedwyn
- Academy (£49.99/mo, /learn/) is on the existing Stripe account. PROPOSAL for the platform/sales-fix worker: portal Cancellations -> reasons ON, retention coupon "one month half price" (one-off, duration once), offer shown once, cancel button equal weight. Changing Stripe settings is live config: do it only within that worker's remit, or leave as a proposal.
- Member sync confirmed 0 checkout sessions through 02:03Z on 28 Oct, so value is future-proofing: a reason list costs nothing and tells us why the first leavers go.
- Pair with the membership-platform skill's welcome-within-24h idea: reasons like "quality was less than expected" in month 1 point at onboarding, not price.
- Measure honestly: never report an accepted coupon as a win until the member has paid the next full invoice.

## Sources
- Stripe Docs, Add a cancellation page to the customer portal: docs.stripe.com (read)
- Stripe Docs, Retention rules (private preview): docs.stripe.com (read)
- Stripe Docs, Retention performance: docs.stripe.com (read)
- ProsperStack, What Is a Good Ecommerce Cancellation Save Rate? (T. Sternberg, 19 Oct 2026; Chargebee averages + one-merchant pause cohort): prosperstack.com (read)
- ProsperStack, The UK's New Subscription Rules Are Coming (updated 20 Oct 2026): prosperstack.com (read)
- Churnkey, Cancel Flows (vendor claim 54%): churnkey.co (snippet only, not read)