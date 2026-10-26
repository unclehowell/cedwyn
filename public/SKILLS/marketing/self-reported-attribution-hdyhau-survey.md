# Self-reported attribution: the "How did you hear about us?" question

Topic: analytics for a low-traffic e-book shop. When there are only a handful of buyers and sign-ups, click-tracking (UTM, GA4, Cloudflare) cannot see word of mouth, forums, talks, radio, a printed flyer or a WhatsApp forward. One free-text question at the moment of purchase or sign-up fills that gap. Harvested 2026-10-26.

## What practitioners measured (read at source unless marked)
- Recast (getrecast.com, read): cites a 12-month study with a 90% gap between software attribution and self-reported answers for "dark social" (social, podcasts, word of mouth). Software tends to credit last-touch direct/organic search; buyers name the place they first heard. The underlying study itself: not checked.
- Ruler Analytics (B2B test on 350+ demo-form leads, read): 47% of leads who picked the FIRST option of a drop-down were wrongly attributed when matched to first-click data; ~14% of leads were referral/word of mouth; combining the form answer with click data gave 81% of leads a source they could prove. Lesson: drop-downs with a default order bias answers; pair the answer with click data.
- Fairing (post-purchase survey vendor, read): database average 50% response rate when asked on the order confirmation page; one towel brand traced ~35% of revenue to word of mouth; friend-referred buyers had ~30% higher order value in one example. Vendor figures, single cases: treat as direction, not benchmark. G2 snippet "up to 80%" response: not checked.
- Stripe Checkout docs (read): Checkout Sessions take up to three custom fields (text up to 255 chars, numeric, or dropdown up to 200 options); answers are stored with the payment. Do not collect sensitive data in them. Payment Links dashboard support for the same: not checked. Gumroad checkout custom fields: not checked.

## How to do it
1. Ask ONE question, worded "Where did you first hear about us?" (first-touch is what click data misses).
2. Format: free text, or a SHORT randomised list with "Other (tell us)". Never a fixed list with a default option (Ruler's 47% first-option error).
3. Place it where answer rates are highest: the thank-you/confirmation page or the purchase form, and the sign-up form. Make it optional so it never blocks a sale.
4. Code answers weekly into 6-8 buckets (search, Facebook, Instagram, YouTube, a named forum/group, a talk/event, friend/family, press/radio, other). Keep the raw words: they also tell you the language buyers use.
5. Read it beside click data, not instead of it: a sale with utm_source=facebook and answer "my cousin sent it" is word of mouth that landed via Facebook.
6. Decide only on patterns: with tiny volumes, wait for at least 10-20 answers before shifting effort; one answer is an anecdote.
7. Re-ask after big pushes (a talk, a radio spot, a seasonal email) to see the mix move.

## Pitfalls
- Long lists cause first-option and "Google" defaults ("Google" often means "searched the name after hearing it elsewhere"; add a follow-up "what did you search?" only if volume allows).
- Do not make it required; do not ask for anything personal beyond the answer.
- UK GDPR: the answer is personal data once tied to an order; mention it in the privacy notice purpose ("to understand how readers find us"), keep it with the order record, no extra marketing use without consent.

## How we apply it to Cedwyn (all PROPOSALS: changes to checkout/sign-up need the owner's GO)
- Stripe: if the e-book buy buttons are Checkout Sessions or Payment Links, add one optional text custom field "Where did you first hear about these e-books?" (key: hdyhau). Answers then appear on each payment, readable by the sales-fix run with no new tool.
- Mailchimp sign-up (/ebooks/ form, which first needs its 405 error fixed): add one optional text field HDYHAU. Free-chapter downloaders are the larger group, so this gives data sooner than sales.
- Weekly: the growth-report run codes answers into the buckets above and adds one line to the project workspace ("hdyhau: forum 2, friend 1, talk 1"). Compare with UTM sources from utm-discipline-ga4-funnel.md.
- Use buyers' own words in posts and the /ebooks/ headline test ("people found us through ... and the 1824 David Stewart estate survey, the first record mention found of the farm").
- Stop rule: if after 30 days fewer than 5 answers arrive, move the question to the thank-you email instead.

## Sources
- getrecast.com (read)
- ruleranalytics.com (read)
- fairing.co) (read; vendor)
- docs.stripe.com (read)
- g2.com (snippet, not checked)