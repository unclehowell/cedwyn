# UK subscription law by design for the £49.99/month academy (DMCC Part 4 Ch 2, live 1 Jan 2027)

Harvested 2026-10-27 09:12Z. Why now: the academy launches before the regime starts, and every member who joins today will still be subscribed on 1 Jan 2027. Building the journey compliant from day one costs nothing; retrofitting reminder notices and cancellation flows later costs a rebuild and risks refunds.

## The facts (with sources)
- **Go-live 1 January 2027.** The Consumer Subscription Contracts (Cancellation and Information) Regulations 2026 were laid before Parliament on 19 Oct 2026, with draft CMA guidance (TLT, Oct 2026 update, read). The PM brought the date forward from spring 2027 on 10 Aug 2026; DBT states the requirements are unchanged, only the timing. Whether there will be a grace period is unclear (TLT). Reed Smith (9 Apr 2026, read) covered the April consultation response.
- **Scope:** most auto-renewing consumer subscriptions for goods, services or digital content, including free or discounted trials. Free subscriptions are excluded (TLT).
- **Key pre-contract information**, given *together*, *separately* from the full CCR information, *as close as possible to the point of sign-up*, with no extra clicks to see it. It covers the recurring liability, payment frequency, monthly cost, minimum total payable, and when reminder notices will be sent. **The final sign-up step needs an express acknowledgement of the payment obligation** (TLT).
- **Reminder notices:** at least once in every 6-month period before a renewal payment, a "reasonable period" ahead, with the period stated up front. Extra notices are needed after a free or discounted trial and for renewals onto 12+ months (TLT).
- **Cooling-off:** the existing 14-day initial period stays. A **new 14-day renewal cooling-off period** applies after a trial converts or on a 12+ month renewal, and it **cannot be waived**. A consumer who cancels in it gets a proportionate refund (Reed Smith). A cooling-off notice must go out on day 1 of the period, separate from anything else (TLT).
- **Easy exit:** if the member signed up online, they must be able to cancel online, and the option must not be hidden. A "clear statement" by any means must also work. An end-of-contract notice must follow on a durable medium (TLT).
- **Durable medium:** email, letter, SMS or WhatsApp counts. In-app or toast messages that can't be kept do NOT count (TLT).
- **Breach remedy:** if a payment arose from a breach of an implied term, the consumer is presumed entitled to a refund of everything paid from the breach until cancellation (TLT).
- **Already law today (CCR 2013 reg 36/37):** for digital content, immediate access needs express consent plus an acknowledgement that the right to cancel is lost; otherwise the buyer can cancel and "bears no cost". See `uk-digital-checkout-reg37-consent-vat.md`. An academy that mixes live sessions with library access also counts partly as a service, so if the member asks to start straight away, a proportionate charge applies on cancellation within 14 days.

## Stripe controls that do most of this for free (docs.stripe.com, read)
- Settings > Billing > **"Send emails about upcoming renewals"** (`charge_automatically` subscriptions only; the timing is set in Prevent failed payments > Upcoming renewal events). For monthly billing this covers the 6-monthly reminder many times over. Memberstack's help notes that when it is first switched on, subscriptions renewing within the next 7 days get no email.
- **Customer portal with cancellation enabled:** cancellation online, collection of cancel reasons, and an optional retention coupon. Keep any retention offer to ONE screen with a clear "cancel anyway" option; extra hoops undermine "without unnecessary steps".
- Receipts and Stripe's subscription emails go by email, so they count as a durable medium. Stripe has no built-in renewal cooling-off notice, so that would be our own email. It isn't needed while the academy has no trials and no annual plan.

## How-to checklist (build once)
1. **No free trial, no annual plan at launch.** This avoids the renewal cooling-off notice and the extra reminders entirely. Monthly £49.99, cancel any time.
2. **A key-info box directly above the pay button**, on our page and repeated in Stripe's custom text: "£49.99 every month until you cancel · first payment today · minimum you pay: £49.99 · we email you 7 days before each renewal · cancel online any time at /learn/account/ (Stripe portal)."
3. **A required checkbox at the final step:** "I understand I'm starting a subscription of £49.99 a month, charged until I cancel." Add the reg 37 line too: "Give me access now; I understand I lose my 14-day right to cancel once I start using the academy content." Keep it a separate tick, not pre-ticked.
4. Turn on renewal reminder emails (7 days) and the portal's cancellation, then test both in test mode.
5. **End-of-contract email:** Stripe's cancellation confirmation, or our own via a webhook on `customer.subscription.deleted`. The cancellation date and last payment must be the most prominent lines.
6. Footer link "Cancel membership" on every /learn/ page, pointing to a portal session.
7. Keep a log (date, version of key-info wording) in the project workspace so a compliance check can be shown later.

## How we apply it to Cedwyn
- The academy worker (platform phase 1) is building /learn/ with a Stripe subscription. Hand it steps 2, 3, 4 and 6 as acceptance criteria; it uses the connected Stripe account, at zero extra cost.
- Wording must keep the editorial rules: no "was" price, no saving claim, no countdown unless a real deadline exists (`uk-dmcc-act-urgency-reviews-price-copy.md`).
- An annual plan, a trial or a founder rate is a **price decision for the owner**. Each one adds obligations: an annual plan means an extra reminder plus a renewal cooling-off notice; a trial means a trial-end reminder, a cooling-off notice and the proportionate refund risk. Propose, don't ship.
- Benchmark: Recurly (July 2026 network data, read) puts monthly churn for $50-100/month subscriptions at 3.15% total (2.41% voluntary, 0.74% involuntary). Education has the highest voluntary churn of any vertical (3.30%). Plan on losing about 1 in 30 members a month, and on Stripe Smart Retries for failed cards.

## Sources
- TLT, "DMCC Act subscription contracts regime brought forward by the PM" (Oct 2026 update; read): tlt.com
- Reed Smith, "DMCC subscription rules delayed to spring 2027" (9 Apr 2026; read, superseded on timing): reedsmith.com
- Stripe docs, Automate customer emails (read): docs.stripe.com ; Customer portal cancellation page: docs.stripe.com
- Memberstack help (snippet, not checked): first-enable 7-day gap.
- Recurly churn benchmarks (July 2026; read): recurly.com (the page calls some figures "annual"; the per-tier figures are labelled /month)