# EU buyers of our e-books: who owes the VAT, and the cheapest compliant route (2026)

Written 28 Oct 2026 (skills harvest). Gap: the checkout-compliance skill (uk-digital-checkout-reg37-consent-vat.md) flagged "EU B2C needs non-Union OSS from the first euro unless a merchant of record; Gumroad MoR not checked, Stripe Tax status not checked". This file closes those checks.

## The rule (primary sources)
- **HMRC (gov.uk, read 28 Oct 2026):** digital services sold to consumers outside the UK are not liable to UK VAT; "they may be liable to VAT in the country where the consumer is based". If you sell through a third-party platform or marketplace, the platform accounts for the VAT instead of you.
- **EU One Stop Shop (Quaderno support article, read):** Union OSS (and its EUR 10,000 small-seller threshold) is only for EU-established businesses. A UK seller uses **non-Union OSS**: register in one EU state, charge the buyer's country rate, file one quarterly return. There is no threshold for a non-EU seller, so the duty starts with the first EU sale. An e-book downloaded automatically counts as an electronically supplied service.
- **Rates differ by country,** and many states use reduced rates for e-books. The per-country e-book rate was not checked here; whatever tool collects the tax should work it out.

## The four routes, priced for a GBP 9.99 e-book

| Route | Who is liable | Cost on a GBP 9.99 EU sale | Admin |
|---|---|---|---|
| A. Stripe Payment Link, nothing changed (today) | **us** | 1.5-3.25% card fee, but VAT owed and not collected | non-Union OSS registration and quarterly nil/real returns |
| B. Stripe Tax Basic + our own OSS registration | us | +0.5% per taxed transaction on no-code Payment Links (stripe.com) ≈ 5p | we still register and file; Stripe calculates and collects |
| C. Stripe Tax Complete | us (Stripe files) | from $90/month | Stripe registers (non-Union OSS is offered) and files |
| D. **Merchant of record** (Gumroad, or Stripe Managed Payments) | **the platform** | Gumroad: 10% + 50c (MoR since 1 Jan 2025, gumroad.com blog). Stripe Managed Payments: **+3.5%** on top of normal Stripe fees (≈35p), Payment Links supported, e-books an eligible digital category; access after Stripe's eligibility review | none for VAT; the platform also handles deception screening and disputes on those sales |

Practitioner evidence (thin, stated as such):
- **Stripe's product page:** Managed Payments makes "Stripe (via Link) … the merchant of record … handling global indirect tax (sales, VAT, GST), deception prevention, dispute responses". It also assertions a "38% average reduction in deception". That is Stripe's own figure and has not been checked independently.
- **PlatformTaxHub case notes on Gumroad (search summary only, page not read):** "3 mistakes" sellers make by assuming the MoR also covers their *other* channels. The rule is that the platform covers only sales made through the platform.

## What we checked on Cedwyn (read-only, 28 Oct 2026)
- Saved snapshots of our Stripe Payment Links (24 Oct baseline, 17 links; parcels link 27 Oct) all show `automatic_tax.enabled: false`, `billing_address_collection: auto`. So EU buyers on Stripe pay no VAT and we would owe it.
- **There are no sales yet** (the sales-fix runs report 0), so nothing has been owed so far. Fixing this before the first EU sale avoids catching up on old returns.
- Gumroad listings are already covered by Gumroad as merchant of record.

## How we apply it to Cedwyn (proposal; the owner decides, no change made)
1. **Default recommendation: Route D for anyone outside the UK, without new registrations.** The cheapest set-up with zero admin is to keep UK buyers on Stripe (UK e-books are zero-rated, so nothing changes) and send non-UK buyers to the matching Gumroad listing. A short line on /ebooks/ does this: "Buying from outside the UK? Use this link" (Cedwyn internal page, purchase still via /ebooks/). Cost: Gumroad's 10% + 50c on those sales only.
2. **Option once EU sales reach about 5 a month: apply for Stripe Managed Payments** (Dashboard). At GBP 9.99 it costs about 35p against Gumroad's roughly £1.40. Requires Stripe's eligibility review and a digital tax code on each product (the e-books category). The academy subscription would also qualify (fully automated access), but check that before switching it.
3. **Do not choose Route B or C** unless EU sales become large. Registering for OSS means quarterly returns for every EU state, even nil ones, plus records kept for 10 years. That is too much for a handful of sales.
4. **Measure:** add `country` to the weekly funnel report (Stripe charge `billing_details.address.country`). If the share of non-UK buyers stays at 0 after 50 sales, record that and leave the setting alone.
5. Never collect VAT under a UK VAT number on EU sales. Never show "inc. VAT" prices on Stripe while `automatic_tax` is off.

## Sources
- gov.uk (read 28 Oct 2026)
- support.quaderno.io (read)
- stripe.com (read: 0.5% no-code; Tax Complete from $90/mo; registration incl. EU non-Union OSS)
- stripe.com (read: +3.5%, MoR, Payment Links) ; docs.stripe.com (read: Europe-based businesses, e-books eligible, direct sales only, review)
- gumroad.com (search snippet: from 1 Jan 2025 Gumroad handles all tax, 10% + 50c)
- platformtaxhub.com (search snippet only, not checked)
- Local evidence: the project workspace; the project workspace