# Constructed testimonials: the six-question ask and the UK rules (CAP 3.45-3.50, DMCC)

Written 2026-10-27 by the skills harvest. Distinct from `reviews-social-proof-direct-ebooks.md` (star reviews and the DMCC fake-review ban): this is how to *get* specific, story-shaped testimonials and use them lawfully on sales pages.

## What the evidence states
- **Placement before the call to action lifts sales (vendor case studies, single tests):** VWO's blog reports Michael Aagaard moved two testimonials above the fold on his **e-book landing page: +64.53% conversions**, and Underwater Audio moved a testimonial to be seen before the CTA: **+35.6% sales**. WikiJob added testimonials to its sales page: **+34% purchases** (Wingify success story title). These are vendor-published, one test each, no confidence intervals given; treat as direction, not a forecast.
- **Why generic praise fails:** Sean D'Souza (Psychotactics, *The Brain Audit*; read) — customers stall because they face a blank page, and asks made weeks later lose the detail. A "reverse testimonial" starts with the doubt the buyer had, then what happened, which reads like how people actually recommend things.

## The six questions (D'Souza, verbatim)
1. What was the obstacle or hesitation that would have prevented you from buying this product/service?
2. What did you find as a result of buying this product/service?
3. What specific feature did you like most about this product/service?
4. What would be three other benefits about this product/service?
5. Would you recommend this product/service? If so, why?
6. Is there anything you'd like to add?

Ask within days of the result, not months (D'Souza; practitioner guides put it at ~48 h after the "wow" moment). Send as a short form or reply-to email; never as a pop-up.

## How to turn answers into a testimonial
- Lead with answer 1 (the doubt), then answer 2 (the outcome), then one line from 3. 30-60 words.
- Edit only for length, **never for meaning** (ASA: testimonials "should not be taken out of context or edited in a way which is misleading").
- Send the edited version back for approval and keep that approval email.

## UK rules (CAP Code section 3 and ASA advice, read 2026-10-27)
- 3.47: hold **documentary evidence** the testimonial is genuine *and* contact details for the person.
- 3.50: no testimonial **without permission** (exceptions: accurate quotes from published sources).
- 3.48: it must relate to the advertised product (an academy quote cannot sell the documentary).
- 3.49: factual assertions inside a testimonial must not mislead; we must be able to stand behind them.
- 3.45-3.46: say when a review was incentivised; never hide negatives or give positives more prominence.
- 2.3: never write one ourselves posing as a customer. Commercial interests must be disclosed (ASA, Zoe Ltd and Huel Ltd, 14 Aug 2024: an investor/director quoted without disclosure was misleading).
- Initials or first name + place is fine if the person prefers; we still hold their contact details.

## How we apply it to Cedwyn
- **Who to ask:** e-book buyers (v0.0.2 and bundle), academy members after week one, walk/talk attendees, and partner businesses who reply warmly to outreach. Never the family, never private correspondents from the case work.
- **Where it goes:** Stripe receipt/thank-you page one-ask (see `stripe-receipt-thank-you-page-one-ask.md`) links to a 6-question form; the academy onboarding email on day 7 asks the same.
- **Store:** each testimonial as a row (text, approved version, approval email date, contact, product, consent to name) in the GHL contact custom fields or a private CSV, never on the public repo.
- **Use:** two short reverse testimonials directly above the /ebooks/ buy button and one above the academy join button; A/B only with a fixed stop size (see `ab-testing-small-lists.md`).
- **Editorial:** public text still follows the Cedwyn rules (no banned words such as "states", "assertions"; attribute as a quotation with first name/initial and town). Never name the project lead.
- **Gate:** no testimonial is published until the approval email exists. Zero incentives for now, so nothing to disclose; if we ever offer one (e.g. a free edition), label it "received a free copy".

## Sources
- psychotactics.com (read)
- vwo.com (read: Aagaard +64.53%, Underwater Audio +35.6%)
- wingify.com (title read: +34% purchases; body behind JavaScript)
- asa.org.uk (read: rules 3.45-3.50)
- asa.org.uk (read: evidence, permission, Zoe/Huel 2024)
- resources.rework.com (snippet: ask within 48 h; not opened)