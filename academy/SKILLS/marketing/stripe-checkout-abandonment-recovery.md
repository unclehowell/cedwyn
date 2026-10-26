# Abandoned-checkout recovery for direct e-book sales (Stripe)
Harvested 2026-10-26 (skills harvest). Internal how-to; nothing here is sent to anyone.

## What the evidence shows
- **Klaviyo 2026 Abandoned Cart Benchmark Report** (110,000+ Klaviyo customers): abandoned-cart flows earn the highest revenue per recipient of any automated flow: $6.77 by email on average, $13.70 for the top 10%. Average click rate 6% (email). Their suggested sequence: a plain reminder at 2-4 h, a follow-up at 24 h, a last message at 48 h.
- **Omnisend 2026 e-commerce report**: abandoned-cart and welcome messages together drove 76% of all automation-generated orders in 2025; automated emails converted at 1.49% vs 0.08% for campaigns (~19x).
- **Baymard** (already in ebook-sales-page-cro-checkout-friction.md): ~70% of carts are abandoned, so a recovery email works on the largest leak in the funnel.
- Caveat: these are store averages (physical goods, bigger baskets). For a £9.99 e-book, expect a few recoveries per hundred abandoned sessions, not a revenue line. It is still the cheapest sale available: the reader already chose the book.

## How Stripe does it (docs.stripe.com, read 26 Oct 2026)
1. A Checkout Session is "abandoned" when it reaches `expires_at` unpaid (default 24 h; can be set 30 min-24 h). Stripe fires `checkout.session.expired`.
2. Create the session with `after_expiration[recovery][enabled]=true` (optionally `allow_promotion_codes=true`). The expired-event payload then carries `after_expiration.recovery.url`, a link that recreates the same session. It works for **30 days**.
3. **Email is only in the payload if the buyer ticked promotional consent**: create the session with `consent_collection[promotions]=auto`, and only email when `consent.promotions == "opt_in"`.
4. Record every recovery email sent; one person can abandon several sessions. Send once, never a chain of nags.

## Our catch: Cedwyn uses Payment Links
- The live buy buttons are Stripe **Payment Links** (buy.stripe.com). Checked 26 Oct 2026: the Payment Link API object has `consent_collection` but no `after_expiration` field, so the one-click recovery URL is a **Checkout Session API** feature.
- Two zero-spend routes:
  - **A (no code change to checkout):** turn on promotional consent on each Payment Link (`consent_collection[promotions]=auto`, Dashboard: Payment Link > Options). Listen for `checkout.session.expired` (fired for Payment Link sessions too; check in test mode first) and email the **original Payment Link URL** to buyers who opted in.
  - **B (better):** replace the static links with a tiny Cloudflare Worker (free tier) that creates Checkout Sessions with recovery enabled. More moving parts: only worth it once traffic shows abandoned sessions in Stripe (Dashboard > Payments > Checkout sessions, status Expired).
- Either way the webhook needs an endpoint (a Cloudflare Worker, free tier) and a sending route already authenticated for the domain (see cold-email-deliverability-uk-pecr.md; check SPF/DKIM/DMARC with tools/dns_check.py before any send).

## UK law (PECR) in one paragraph
A recovery email is marketing. Use Stripe's consent checkbox. The ICO's soft opt-in covers details collected "in the course of a sale or negotiations for a sale", where the person "actively expressed an interest in buying" (ICO PECR email guidance), but UK practitioner guides disagree on whether an abandoned basket alone qualifies (greyturtle.co.uk, 2026: an abandoned cart is not enough). So: explicit consent only, one email, an unsubscribe line, our name and address in the footer.

## The email (template, plain and short)
- Subject: "Your copy of <title> is still waiting"
- Body, 3 lines: the book's one-line hook; the recovery link as a button; "Questions about the book? Just reply." No discount in the first message (Klaviyo's sequence holds discounts for later; at £9.99, a discount teaches waiting).
- Lint it with tools/email_lint.py; tag the link with tools/utm.py (`utm_source=stripe&utm_medium=email&utm_campaign=checkout_recovery`).

## How we apply it to Cedwyn
1. **Measure first (read-only, now):** count expired Checkout Sessions for the 9 Payment Links over the last 30 days via the connected Stripe app. If zero, this waits: there is nothing to recover yet (sales ledger: £0 on 26 Oct).
2. **Owner step for the project lead (Dashboard, 2 min per link):** tick "Collect consent to send promotional emails" on each Payment Link. Nothing else changes for buyers.
3. **Build route A** as a patch (Worker + webhook secret), test in Stripe test mode, leave it in the project workspace for review. No live email goes out without the project lead's go-ahead.
5. Fix the known no-JavaScript checkout redirect first (bizdev run 3, 26 Oct): a buyer who never reaches Stripe never becomes a recoverable session.

## Sources
- Stripe, Recover abandoned carts: docs.stripe.com
- Stripe API, Payment Links object: docs.stripe.com
- Klaviyo, 2026 Abandoned Cart Benchmark Report: klaviyo.com
- Omnisend, 2026 e-commerce marketing report: omnisend.com ; benchmarks: omnisend.com
- ICO, PECR electronic mail rules: ico.org.uk
- Grey Turtle, Email soft opt-in for e-commerce (UK, 2026): greyturtle.co.uk