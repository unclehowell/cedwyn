# Card-testing attacks and disputes on a tiny Stripe shop: prevention, the 1-dispute maths, the morning check (2026)

Written 28 Oct 2026 (skills harvest). Gap: the index had 0 entries for "chargeback", "card testing" and "deception" (payments). Cedwyn sells through Stripe Payment Links (e-books £9.99/£31.99, the £49.99/mo academy) and has a Worker (cedwyn-api) that will hold a Stripe key.

## Why it matters at our size (numbers)
- **Disputes:** Stripe and the card schemes treat dispute activity above **0.75%** as excessive. Stripe's deception guide states that with fewer than 100 payments a month, "one or two deception disputes can have a very outsized impact". At 20 sales a month, **one dispute is 5%**. (dev.to "Under 100 payments a month", Oct 2026, quoting Stripe; the schemes judge over months, not one week.)
- **Cost per dispute (Stripe UK pricing, read 28 Oct 2026):**
  - £20 when a dispute is received.
  - Another £20 if we counter it by hand (refunded only if we win).
  - Smart Disputes takes 30% of a won amount.
  - So a lost £9.99 dispute costs **about £50** (the sale, £20 and £20), plus the e-book has already been downloaded.
- **Card testing at scale:**
  - Stripe Radar blocked more than 20 million card-testing attempts a day at the 2022 peak, and attempts are up more than 100x since 2019 (Stripe newsroom).
  - **Practitioner reports:**
    - PMPro (WordPress membership plugin team): "hundreds (sometimes thousands) of $1 charge attempts" overnight. Radar reviews at about $0.02 per blocked attempt mean 10,000 attempts cost about $200.
    - r/stripe: one seller reports a "€12k Stripe Radar bill overnight", another "thousands of dollars in fees… putting the bank account in red". Both are from search summaries; the threads weren't read in full and the figures haven't been checked.
  - **The pattern:** attacks hit integrations that call the API from a server endpoint anyone can reach. Hosted Checkout and Payment Links come with Stripe's own rate limits, AI models and CAPTCHA triggers, and those attempts show up as "Blocked by Stripe" (Stripe docs, card-testing page).

## Prevention playbook (in order of value for a small shop)
1. **Stay on hosted pages.** Payment Links and Checkout are the "Stripe-recommended integration". The failed attempts happen on checkout.stripe.com and never reach our site (PMPro confirms the same from the plugin side). Don't build a custom card form.
2. **Lock down any endpoint that creates a Checkout Session.** Rules for the cedwyn-api Worker:
   - It accepts only known price IDs.
   - Never let the client set an amount; no "pay what you want" on public links. The 24 Oct snapshot has no `custom_unit_amount` link, so keep it that way.
   - Put a Cloudflare rate-limit rule on it (for example 10 requests a minute per IP).
   - Add Turnstile (free) in front if it is ever public.
   - Keep the secret key only in the Worker's secret store. A restricted key is better, with write access only to Checkout Sessions.
3. **Prefer no minimum-value test product.** A live £0.50 or £1 price is what testers look for. Use test mode for checks, not a live cheap price.
4. **Pre-empt friendly deception** (buyers who don't recognise the charge):
   - Set the statement descriptor to something recognisable, like "CEDWYN EBOOKS", rather than the account name.
   - Have the receipt email name the book and the download link.
   - Put a support email on the receipt.
   - Offer a refund on the first complaint. That costs £9.99, against roughly £50 for a lost dispute, and it keeps the dispute rate at 0.
5. **Gather evidence by default, so a dispute is cheap to answer:**
   - Record download logs (time, IP, and the file token) for each order.
   - Keep the Reg 37 consent tick, from uk-digital-checkout-reg37-consent-vat.md. "Express consent + acknowledgement" is the strongest proof that a digital item was delivered.
6. **Radar:** use the default blocking only. Custom rules are generally part of the paid Radar for deception Teams add-on; that wasn't checked this run, and it's a spend, so skip it.

## The morning check (two minutes, read-only)
- Stripe payments, filtered to failed in the last 24 h. If there are more than 20 failed attempts with unfamiliar emails or the same small amount, treat it as an attack: deactivate that one Payment Link, make a new one, and update /ebooks/. Log it in the project workspace, not to the owner.
- Stripe disputes: any open dispute gets evidence (download log, consent, receipt) within 7 days. Respond by hand only if the evidence is strong; otherwise accept. Either way, refund future complaints early.

## How we apply it to Cedwyn (proposal; no change made)
- **Add to the sales-fix run's checklist:** the morning check above (read-only Stripe list calls) and a `disputes` and `failed_attempts_24h` column in the weekly funnel report.
- **Before the STRIPE_KEY secret goes into cedwyn-api:**
  - make it a restricted key
  - add the price-ID allowlist
  - add the Cloudflare rate-limit rule
  - We do this as a code change in the Worker repo through the usual commit route. The key itself is the owner's to set.
- Descriptor and receipt support line: one Stripe Dashboard setting each. This is the owner's account, so it goes on his list as a one-time five-minute job. We don't message him about it (it goes to the problems queue).
- If EU buyers move to a merchant of record (see eu-vat-ebook-sales-oss-vs-merchant-of-record-stripe-gumroad.md), the platform takes on deception and disputes for those sales.

## Sources
- stripe.com (read 28 Oct 2026: dispute received £20, countered £20, Smart Disputes 30%)
- docs.stripe.com (read: hosted Checkout/Payment Element controls, "Blocked by Stripe")
- stripe.com (read: 20m/day blocked at the 2022 peak, more than 100x since 2019)
- dev.to (read: the 0.75% maths and the Stripe quote)
- paidmembershipspro.com (read: $1 attempts, about $0.02/Radar review, hosted pages remove the attack surface)
- reddit.com and /164eg9z/ (search summaries only, figures not checked)
- Local: the project workspace (no custom_unit_amount; prices 999/3199)