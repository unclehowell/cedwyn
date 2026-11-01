# Mercado Pago / dLocal Go for Argentine buyers: can a UK seller use them? (route gate, Oct 2026)

Topic: whether Cedwyn, as a UK seller, can add Mercado Pago (or a local-payments aggregator) to the /argentina/ e-book path. Also what a small seller can do instead. Read 31 Oct 2026. Not legal or tax advice; check with an adviser.

## What the primary sources show
- **Mercado Pago Argentina opens accounts only against an Argentine DNI or CUIT.** The sign-up page reads: "Para empezar, ingresá un DNI o un CUIT. El documento determinará quién será titular de la cuenta" (mercadopago.com.ar, read via search snippet). A UK business has neither. Checkout Pro and the Link de pago both sit on that account (Mercado Pago Developers, Checkout Pro docs: "you need to access Mercado Pago and create a seller account").
- **Stripe has no public Mercado Pago payment method.** docs.stripe.com returns 404 ("early access ... sign in", read 31 Oct). Stripe's own guide only advises *integrating* local wallets like Mercado Pago and Ualá (stripe.com). In Argentina, Stripe still means cards only.
- **dLocal Go (dLocal's self-serve product) excludes UK-based businesses.** Its help centre lists the foreign bases allowed to take international payments: US, Canada, UAE, Singapore, India, South Africa, Turkey and others. The UK is not on it, and "You cannot receive payments from these countries or from Europe". Help article 7846587, "updated over 4 weeks ago", read 31 Oct. dLocal's UK payment-institution licence is for its enterprise product, not Go (dlocal.com press release).
- **What a local seller pays, for scale.** Official list price for link de pago / Checkout with the money available at once: 6.29% + IVA, or 6.60% in Buenos Aires and Chubut. Waiting 35 days for the money cuts it to 1.49% + IVA. These are SODI's reading of Mercado Pago's cost page, valid from 19 Oct 2026, read 21 Oct 2026. The official page itself rendered only navigation for us, so the figures are not checked at source.
- **Why buyers want it.** Mercado Pago lets them pay from a peso balance and in installments, up to 12 "cuotas sin tarjeta" (Checkout Pro WooCommerce docs, read). Cards from abroad carry the 30% perception (see argentina-card-surcharges-30pct-ebook-checkout-es.md, not repeated here).

## Verdict
**SKIP direct Mercado Pago and dLocal Go: they are closed to a UK seller.** The only lawful routes are:
1. **A partner in Argentina with a CUIT who sells on our behalf** (reseller or consignment). That is contacting a third party, so it is a **PROPOSAL needing the project lead's GO**, and it carries Argentine tax and invoicing duties for them.
2. **An Argentine marketplace or store that already takes Mercado Pago**, e.g. the Bajalibros / Publica.la routes already in the index (bajalibros-runs-on-publica-la-...md). Listings are out of scope this run.
3. **Keep Stripe cards, and say plainly how to pay cheapest.** This is free, needs no account, and is the only action open now.

## Proof the gate is real (re-check quarterly)
- Re-read the dLocal Go country article. If "United Kingdom" appears among the allowed bases, re-open this skill.
- Re-check docs.stripe.com for "Mercado Pago". A public page means Stripe Checkout could switch it on as a payment method (a setting change, so a PROPOSAL).

## How we apply it to Cedwyn
- **No account, no setting change.** Don't attempt a Mercado Pago or dLocal Go sign-up. Both need documents we do not have, and any new account needs the project lead's GO anyway.
- **PROPOSED patch, not committed:** one Spanish line under the /argentina/ shop strip and on /ebooks/?lang=es:
  > "Pagos con tarjeta (Visa, Mastercard, Amex) por Stripe. Todavía no aceptamos Mercado Pago. Las primeras ediciones son gratis."
  - The second sentence answers the question before checkout. The third points to the free route, so the Mercado Pago gap costs nothing for first editions.
  - Pair it with the existing 30% explainer link if that page is live.
  - Spanish copy needs a native check before publishing.
- **Measure:** count /argentina/ → /ebooks/ clicks and es-locale Stripe sessions before and after (Cloudflare non-US HTML 200 proxy, as in the sales-fix runs). A rise in started sessions with no Mercado Pago means the line removed doubt rather than adding it.
- **Log** the partner/reseller idea in the project workspace as a proposal for the project lead, not an action.

## Sources (read 31 Oct 2026 unless noted)
- mercadopago.com.ar (DNI or CUIT gate, search snippet)
- mercadopago.com.ar; .../woocommerce/payments-configuration/checkout-pro
- docs.stripe.com (404); stripe.com
- helpcenter.dlocalgo.com and /7229161
- sodi.com.ar (fee table, consulted 21/10/2026, not checked against the official page)