# /terms/ and /refunds/ pages for a small UK e-book + Academy shop: the wording itself

Written 31 Oct 2026 (skills harvest ~20:45Z). Area: funnel/CRO trust, checkout, UK consumer law. Before this run "terms and conditions" and "returns policy" had 0 skill-file hits. The checkout-consent mechanics are covered elsewhere (uk-digital-content-right-to-cancel-stripe-consent-checkbox.md, uk-digital-content-cancellation-waiver-stripe-consent.md, uk-digital-checkout-reg37-consent-vat.md). The money-back offer is covered in money-back-guarantee-sales-page-risk-reversal.md. This file covers the two pages those all link to, and live they are missing.

## Live state (checked 31 Oct 2026 ~20:43Z)
- cedwyn.bucklerfamily.estate returns **404**. So does /refunds/.
- /privacy/ returns 200 (v1.0.0, 30 Oct). It names the controller as DATRO Consortium Limited, company 13775817, [address kept in the project workspace] /dartboard/legal/ returns 200.
- /ebooks/ links only /privacy/ and /dartboard/legal/ (the footer's "Terms & privacy"). No dedicated sale terms or refund page exists, and /dartboard/legal/ is the case wiki's legal area, not terms of sale. Any receipt, Stripe setting or skill that points at /terms/ or /refunds/ hits a 404.

## What the law asks the pages to carry (primary sources, read)
**Consumer Contracts Regs 2013, Schedule 2** (the pre-contract information for distance sales):
- (a) the main characteristics of the product;
- (b) the trader's identity;
- (c) **the geographical address where the trader is established**, plus email;
- price including taxes;
- (j) payment and supply arrangements;
- (k) the **complaint handling policy**, where there is one;
- (l) cancellation conditions and how to cancel;
- (v) the **functionality of digital content, including technical protection measures** (DRM);
- (w) **compatibility** with hardware and software;
- (t) the minimum duration, which matters for the Academy.

**Consumer Rights Act 2015, digital content:**
- s.42: when content does not conform (s.34 satisfactory quality, s.35 fit for purpose, s.36 as described), the remedies are (a) **repair or replacement** (s.43) and then (b) a **price reduction** (s.44), which can be up to the full price.
- s.47: a term that excludes or restricts these duties "is not binding on the consumer". So never write "no refunds" or "all sales final" without qualification.
- s.33(1): this Chapter applies to content supplied "for a price". The £0.00 first editions sit outside the s.34–36 quality rights. Paid updates and the Academy are inside them.
- Our reading, not legal advice.

**Stripe Checkout policies** (docs.stripe.com, read): Checkout Settings can display:
- the return and refund policy (and highlights a free or generous one);
- support email, phone and website;
- links to the terms of service and privacy policy;
- optionally, a required consent to those terms.

Stripe's own line: "Presenting this information can increase customer confidence and minimize cart abandonment". That is Stripe's claim, with no number given; not checked.

## The playbook
1. **Two short pages, plain English, a version line at the bottom.** Terms is about 350 words and Refunds about 150. Short pages get read. GOV.UK-style headings that answer questions: "Who sells the books", "What you get", "Cancelling", "If something is wrong", "Complaints".
2. **Terms must carry the Schedule 2 facts.** Who sells (legal name, company number, geographic address, email). What you get (PDF, page count shown on each book, no DRM, opens in any PDF reader, so (v) and (w) are covered). Price in GBP including any VAT. Delivery (a download link on the thank-you page and by email, straight after payment). Cancelling (see below). If something is wrong. Complaints (reply within 5 working days). The governing law of England and Wales does not remove the protections of a Scottish or Northern Irish buyer's own law.
3. **Cancelling wording that matches the checkout tick box exactly.** "You have 14 days to cancel. If you ask us to start the download straight away and confirm you understand you lose that right, the right to cancel ends when the download starts (Consumer Contracts Regulations 2013, reg. 37)." Don't write that wording twice in different words.
4. **Refunds page: the statutory floor first, then the goodwill offer.**
   - "If a book won't open, has missing or garbled pages, or isn't what the description said, email us and we'll send a corrected copy. If we can't fix it within a reasonable time, we'll refund up to the full price."
   - Only then any money-back promise (money-back-guarantee-sales-page-risk-reversal.md): "Not what you expected? Email within 14 days for a full refund, no questions asked."
   - Say how: the address, what to include (order email), and the timing (refund to the original card within 14 days).
5. **Academy (subscription) lines:** what membership includes, the billing period, how to cancel (link to Stripe customer portal), and what happens at the end of a paid period. Price-change wording lives in academy-price-change-grandfathering-cma37-variation-clause.md; DMCC subscription duties in uk-subscription-regime-dmcc-academy-stripe-by-design.md. Link those; don't duplicate.
6. **Wire them in where people decide.** Footer on every page, under each buy button ("Terms · Refunds"), Stripe Checkout Settings (refund policy, support email, terms and privacy links), and the receipt email.
7. **Check the links on every build.** /terms/, /refunds/ and /privacy/ must return 200. The PDF-link check in the PDF-preview PR is the same pattern.

## Words to avoid
- "No refunds", "all sales final", "we accept no liability". These are not binding under s.47 and read as hostile.
- "Non-refundable digital product" without the faulty-content exception.
- Anything that repeats the banned public words list.

## How we apply it to Cedwyn (PROPOSALS, need the project lead's GO; nothing changed)
- **P1. Create /terms/ and /refunds/** in the shop theme from the outline above, versioned v1.0.0. Seller: DATRO Consortium Limited (13775817), same as /privacy/. Content: PDF, no DRM; GBP; download on payment; reg. 37 wording copied from the live checkout tick box; faulty-copy repair → replace → refund; complaints to [address kept in the project workspace] within 5 working days.
- **P2. Only the project lead can supply the geographical address.** Schedule 2(c) requires it. Family addresses must never go on the site (editorial rule). So use the company's registered office only if it is not a family home; otherwise a registered-office or virtual-office address. Until he decides, the page carries the company number and email, and the gap is logged.
- **P3. Stripe Checkout Settings:** turn on Contact information ([address kept in the project workspace]) and Legal policies (terms + privacy links), and add a refund-policy line. This is a dashboard change: proposal only.
- **P4. Add "Terms · Refunds" microcopy** under the buy buttons on /ebooks/ and /learn/. Add a build check that the three policy URLs return 200.
- **Measure:** buy-button click → paid conversion for 4 weeks before and after (tools/ab_stats.py). Expect a small effect at our volumes. The main win is removing a dead link and a legal gap.

## Sources
- legislation.gov.uk (read)
- legislation.gov.uk (read); /section/47 (read); s.33 (read via the same Act)
- docs.stripe.com (read)
- Related skills listed above (existing; not re-checked this run)