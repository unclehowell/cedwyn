# Local-currency pricing for overseas readers (Stripe Adaptive Pricing + Gumroad PPP)

Skill harvested 26 Oct 2026. Zero spend: the merchant pays no extra fee. Stripe's conversion fee is paid by the buyer, and PPP is a discount we choose.

## Facts from the primary sources
- **Stripe Adaptive Pricing** shows the buyer the price in their local currency, using an exchange rate guaranteed for 24 hours. Stripe docs: "Adaptive Pricing is always enabled for Payment Links." For Checkout it is a Dashboard setting (Settings > Payments). The merchant pays 0%. The customer pays a **2–4% conversion fee** built into the rate. A customer can choose to pay in the merchant's currency instead.
- **Results:** Stripe's support page puts higher international revenue at **17.8% on average**, mainly for one-time payments. Stripe's 19 Mar 2026 study of 1.5M subscription checkout sessions found **+4.7% conversion**, **+1.9% authorisation** and **+5.4% value per session**. Local-currency charges are declined less often, because cross-border card payments fail more.
- **Limits:** not available with Elements plus PaymentIntents; prices must be in a settlement currency. The supported-country list is drawn by JavaScript and could not be read by our fetch. Check whether Argentina (ARS) is covered by opening one of our Payment Links with Stripe's test email trick: prefilled_email=[address kept in the project workspace], in test mode only.
- **Gumroad PPP** (help article 327): a store-wide toggle. It gives discounts of **20–60% by country**, sourced from the World Bank and refreshed weekly. A maximum discount can be capped, and products can be excluded. It is free to turn on.
- **Caution, from a 175-market PPP case study (bigmacindex.app, practitioner blog):** set a **price floor** before letting PPP discount deeply, because fixed per-sale fees can eat a small sale. Gumroad's fee is 10% + $0.50 per direct sale, and card processing adds about 2.9% + $0.30.

## How to do it
1. **Audit the checkout path.** Done 26 Oct: every Cedwyn buy button goes to buy.stripe.com, through /wayback/go/, which passes Stripe and Gumroad hosts straight through. So these are Payment Links, and Adaptive Pricing should already be on. Confirm in the Stripe Dashboard: Payment Links > a link > the currency preview.
2. **Test as a buyer** from Spain, Argentina and the US with the test-email trick in test mode. Record the local price shown and screenshot each.
3. **Check one live session**, read-only through the Stripe connection: on a non-GB payment, check presentment_currency against settlement. That gives proof the feature is working.
4. **Gumroad (hotspotbnb store):** turn on PPP with a cap of 50% and a floor that keeps the net above about $2 a sale. Owner step: the store settings are the project lead's (Gumroad > Settings > Payments/Discounts). Exclude any product priced under $3.
5. **Copy:** on /ebooks/ show "Prices in your currency at checkout". In the Spanish interface use "Precio en tu moneda al pagar", and in Welsh "Pris yn eich arian chi wrth y til". Only add these after step 2 proves the conversion works.
6. **Measure:** Stripe payments by card country and currency each week, compared before and after. A UK-only audience will see no effect. The lift shows in the Spanish/Argentine (Patagonia half) and US traffic.

## How we apply it to Cedwyn
- Cedwyn's Spanish-language Patagonia/Wales half is built for Welsh-Argentine readers. A price of £9.99 is a mental conversion plus a cross-border card decline risk. Local currency removes both at no cost to us.
- **Bundle maths:** at £31.99, a 2–4% buyer fee is about £0.64–£1.28. That is acceptable, and the buyer can still pay in GBP.
- **Don't** create separate cheaper Stripe prices for Argentina without the project lead's word. That is a pricing decision. Adaptive Pricing changes only the currency, not our price.
- **Owner-only steps:** the Stripe Dashboard check for Checkout sessions (if any), and the Gumroad PPP toggle.
- **Public copy rules apply:** no banned words, never name the project lead, Cedwyn links only.

## Sources
- docs.stripe.com (always on for Payment Links; 0% merchant, 2–4% customer; restrictions; testing Payment Links)
- support.stripe.com (+17.8% international revenue on average)
- stripe.com (1.5M sessions, +4.7% conversion, +1.9% authorisation; 19 Mar 2026)
- stripe.com (+5.4% LTV per session)
- gumroad.com (20–60%, World Bank, weekly, cap, exclusions)
- gumroad.com (10% + $0.50 direct; 30% Discover)
- bigmacindex.app (set a floor first; practitioner blog)