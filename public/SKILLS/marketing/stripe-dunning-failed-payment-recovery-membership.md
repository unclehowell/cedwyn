# Failed-payment recovery (dunning) for a monthly membership on Stripe

Read 27 Oct 2026. For the £49.99/month academy, or any Stripe subscription. Set this up **before** the first renewal (one month after the first member joins).

## The numbers
- **About a quarter of churn is accidental.** Stripe engineering blog (Kiran Chandran, 23 Jan 2024): "Twenty-five percent of lapsed subscriptions are purely due to payment failures". Subscriptions Stripe recovers "continue on average for seven more months". Smart Retries recovers "$9 in revenue for every $1" spent on Billing (Stripe's own figure).
- **Cards change constantly.** Stripe newsroom: "approximately 40% of cardholders replaced their cards" in a year (expiry, loss, deception). One customer quoted there saw "+4%" subscription authorisation from network tokens plus card account updater.
- **Benchmarks by price.** Recurly network, July 2026 (page labels these "median annual churn"; at 3–4% they read like monthly figures, so not checked):
  - $50–$100/month (our £49.99 band): total 3.15%, voluntary 2.41%, **involuntary 0.74%**.
  - $25–$50/month: involuntary 1.11%.
  - $10–$25/month: involuntary 1.30%.
  Involuntary churn falls as price rises, but it's still roughly a quarter of the total.

## Setup (Stripe Dashboard, all free features of Billing)
1. **Retries:** Billing → Revenue recovery → Retries → **Smart Retries**. Stripe docs: "The recommended default setting is 8 tries within 2 weeks" (options run from 1 week to 2 months). Stripe doesn't retry when there's no payment method, on a hard decline, or on India-issued cards.
2. **What happens after the last retry:** choose "cancel subscription" or "mark unpaid". For a membership, **mark unpaid** and lock member content. Don't cancel straight away, so a card update restores access without a new signup.
3. **Customer emails** (Settings → Billing → Subscriptions and emails), per Stripe docs:
   - **Failed payment notifications** on, with a link to the Stripe-hosted Customer Portal (or our own page) to update the card.
   - **Expiring card notifications** on: "sends an email 1 month before your customer's card on file expires".
   - **Payment confirmation (3D Secure) emails** on: "Send a Stripe-hosted link for customers to confirm their payments", plus "Send reminders if payment confirmation isn't completed". This matters for UK cards (SCA): per Stripe support (search snippet, page not rendered), a renewal that fails on 3D Secure authentication is **not** retried on the retry schedule, so the email link is the only recovery path.
   - Brand the emails (Settings → Branding) and set the reply-to to a monitored address.
4. **Card updater / network tokens:** Stripe applies these automatically where available; nothing to switch on (Stripe support: card details are replaced when the bank reports them).
5. **Grace access:** keep access during the retry window (2 weeks). Show an in-site banner to members whose subscription is `past_due`: "Your last payment didn't go through. Update your card" → portal link. Read the `customer.subscription.updated` and `invoice.payment_failed` webhooks; when `invoice.paid` arrives, clear the banner.
6. **Measure monthly:** failed renewals, recovered (paid after a failure), recovery rate, involuntary cancellations. Stripe shows these in Billing → Revenue recovery analytics.

## Don'ts
- Don't send our own extra "pay now or lose access" emails on top of Stripe's. One sequence only, plain and kind, with no fake deadlines.
- Don't store card data or take a card by email or phone. Card changes happen only through the portal.
- UK subscription rules (DMCC, live 1 Jan 2027; see uk-subscription-regime-dmcc-academy-stripe-by-design.md): cancelling must stay as easy as joining. Dunning emails must never hide the cancel route; the portal link includes cancel.

## How we apply it to Cedwyn (academy, £49.99/month)
- The platform worker is building the academy on the existing Stripe account. Before launch, turn on: Smart Retries 8/2 weeks; mark unpaid after the final retry; failed-payment, expiring-card and 3DS-confirmation emails with the Customer Portal link; branding set to Cedwyn Estate (never the project lead's name).
- The member check (`member` flag) treats `active` and `past_due` as member, and `unpaid`/`canceled` as not. The documentary and e-book "latest version free" unlocks follow the same flag.
- Add the past-due banner to the /learn/ member pages only.
- At 0.74% involuntary churn, one member's monthly fee is roughly the whole recovery value until the membership passes about 50 members (our arithmetic on Recurly's median). So keep it to dashboard switches and the banner; don't build more.
- **Needs the project lead:** these are Stripe Dashboard settings; a worker with Stripe dashboard access, or the project lead, ticks them. Nothing is spent.

## Sources (read 27 Oct 2026)
- Stripe blog, How we built it: Smart Retries: stripe.com
- Stripe docs, Smart Retries: docs.stripe.com
- Stripe docs, Automate customer emails: docs.stripe.com
- Stripe support, 3DS retries (snippet only): support.stripe.com
- Stripe newsroom, network tokens + card account updater: stripe.com
- Recurly churn benchmarks (July 2026 data): recurly.com