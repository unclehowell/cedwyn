# Argentine buyers: what our GBP price really costs them on an Argentine card (2026)

Topic: the card surcharges an Argentine reader pays when buying a Cedwyn e-book or bundle from a UK seller, and how to explain it in Spanish without changing our fixed prices.

## What the sources show
- **The 30% "dólar tarjeta" perception is still in force in Oct 2026.** Argentine card purchases from foreign providers carry a 30% perception on account of income tax (Ganancias) and wealth tax (Bienes Personales) under ARCA Resolución General 5617/2024.
  - Rua Lareu accountants, 5 Oct 2026, read: talk of it ending on 2 Jan 2026 did not happen.
  - Monarca guide, updated 21 Jun 2026, read: same rule.
- **Impuesto PAIS ended on 23 Dec 2024** and isn't recoverable (Monarca, read). So today the only standard surcharge is the 30%.
- **The 30% is an advance, not a final tax:**
  - Buyers not registered for Ganancias or Bienes Personales (most monotributistas and low earners) can ask ARCA to refund it from 1 Jan of the next year.
  - Employees offset it through SIRADIG (both guides, read).
- **The legal way to avoid it:** pay the card statement's dollar balance with your own dollars. Since Apr 2025, individuals can buy dollars at the official rate with no perception (Rua Lareu, read).
- **ARCA counted ARS 919,866 million in Ganancias perceptions in Jan–Jul 2026.** That's ARCA's figure as quoted by Rua Lareu; we didn't check it at ARCA.
- **IVA on digital services:**
  - ARCA's page (read) taxes all digital services consumed in Argentina and supplied from abroad. Argentine use is presumed from the buyer's IP address, SIM, billing address or card issuer.
  - The card issuer collects 21% IVA under RG 4240/18, but only for providers on ARCA's lists.
  - **Whether a small UK seller using Stripe is on those lists is not checked.** Assume 0–21% extra.
- **Stripe Adaptive Pricing** (Stripe docs, read):
  - Shows the price in the buyer's local currency in 150+ countries, with the rate guaranteed for 24 hours.
  - The buyer pays a 2–4% conversion fee and the seller pays 0%. It's always on for Payment Links.
  - **Whether ARS is a supported presentment currency is not checked.** Its currency list didn't render from the box.
  - Charging in pesos does not by itself remove the 30%: that applies to foreign providers' charges. This is our reading of how streaming services have been treated, not checked for Stripe charges.

## Worked example (illustrative; arithmetic only, rates not checked today)
£4.99 v0.0.2 e-book:
- **No IVA:** £4.99 × 1.03 (mid FX fee) × 1.30 = **about £6.68**, of which about £1.54 is recoverable.
- **With 21% IVA:** about **£7.76–£8.08**, depending on whether the 30% is calculated before or after IVA (not checked).

The free v0.0.1 costs them nothing.

## How to do it
1. **Don't change prices.** Prices are fixed (v0.0.1 free, v0.0.2 £4.99), and there are no price tests. This skill only explains what the buyer pays.
2. **Add a Spanish FAQ line** on the /ebooks/ page and in the Spanish checkout-help text. Draft:
   > "Si pagás con tarjeta argentina, tu banco suma la percepción del 30% (RG 5617), que es un adelanto de impuestos y se puede recuperar. Si cancelás el resumen con dólares propios, no se aplica."
   Neutral, factual, no advice beyond that, and **link to no outside site**.
3. **Lead Spanish-speaking audiences with the free v0.0.1.** It carries no surcharge. The paid step is the second purchase, after the reader trusts us.
4. **Bundle rather than many small buys.** Each foreign card charge shows up on the statement with its own 30% line. One bundle means one line, and the buyer understands it once.
5. **Check the Stripe dashboard once:**
   - Whether Adaptive Pricing is on for our Payment Links, and whether Argentine buyers saw ARS.
   - Card country on any Argentine attempt (completed vs expired).
   - Record it; change nothing without the BIZDEV plan.
6. **Don't promise a refund timeline** or give tax advice. Point to "ARCA, Devolución de percepciones" by name only.

## How we apply it to Cedwyn
- **Audience:** Chubut and Puerto Madryn readers, the Argentina replica project's natural market. Spanish posts already exist (Meta AI dubbing, Chubut press, WhatsApp channel skills); this closes the checkout gap.
- **Proposal for the next BIZDEV run:** one FAQ sentence in Spanish on /ebooks/ (above), plus a "gratis" first CTA in Spanish posts linking to the free v0.0.1. It's a patch in the project workspace, since the architecture worker owns main.
- **Measure:**
  - Stripe checkouts by card country AR: started, completed, expired.
  - Over 8 weeks, compare AR completion rate with UK.
  - If AR expiries run at 2× or more UK's, review the FAQ wording, not the price.
- **Editorial:** the Spanish copy avoids the Spanish equivalents of our banned words (según, afirma, presunto, fraude, robado). Never mention family holdings. Llandough Farm is not Great House Farm.

## Sources
- rualareu.com (5 Oct 2026; read)
- askmonarca.com (updated 21 Jun 2026; read)
- afip.gob.ar (ARCA, IVA on digital services; read)
- docs.stripe.com (read; ARS list not seen)