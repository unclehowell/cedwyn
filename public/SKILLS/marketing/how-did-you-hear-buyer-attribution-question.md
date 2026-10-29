# "How did you hear about us?": one-question buyer attribution for Cedwyn e-books

Written 29 Oct 2026 by the skills harvest. Status: how-to; the checkout change is a proposal (see the last section).

## Why
Cedwyn's buyers mostly arrive by routes analytics cannot see: WhatsApp forwards, Facebook groups, a talk, a family-history society journal, word of mouth. Those visits land as "direct".
- SparkToro test (1,000+ visits, quoted by Recast): 100% of visits from TikTok, Slack, Discord, Mastodon and WhatsApp, and 75% from Facebook Messenger, were recorded as "direct". The study was not re-read here; it is quoted through Recast.
- Refine Labs 12-month study (quoted by Recast): a 90% gap between software attribution and what customers said, mostly for social, podcasts and word of mouth. Also second-hand.
- Fairing (post-purchase survey vendor; vendor numbers, not checked independently): a 50% average response rate across its database when the question sits on the order-confirmation step. In one anonymised client case, 35% of business was attributed to word of mouth, and word-of-mouth buyers had a 30% higher order value. Fairing states asking by email after the purchase gets far lower response.
- Recast, quoting Chris Walker (Refine Labs): an optional field goes blank for nearly 30% of people. Free text avoids order bias in drop-downs (people pick the first option or the nearest wrong one), at the cost of hand-coding.

Limits to state whenever the numbers are reported: people misremember, recency bias favours the last touch, and one answer hides the earlier touches. It is a direction-finder, not a ledger.

## How to do it (any checkout)
1. Ask exactly one question, at the moment of purchase: "How did you first hear about Cedwyn?" ("first" fights recency bias).
2. Free text, not a drop-down, while volume is small. Code the answers afterwards into a fixed channel list.
3. Optional while sales are under ~20; friction on a £4.99 first purchase costs more than a blank answer. Revisit "required" once there are 20+ sales and the blank rate is known.
4. Code answers weekly into: word of mouth / family; Facebook (page or group); Instagram; YouTube; search (Google/Bing); AI assistant (ChatGPT, Copilot, Grok etc.); email newsletter; talk / society / event; press / radio; library / archive; other; blank.
5. Compare against UTM and referrer data for the same week. Where they disagree, the survey usually wins for "direct" and the UTM wins for specific links.
6. Act only on a pattern of 3+ answers. One buyer naming a channel is a lead, not a strategy.

## Where the question can live (checked 29 Oct 2026)
- Gumroad: Checkout > Form ("custom fields"): Textbox, Checkbox or Terms; each mandatory or optional; apply to all products or a subset. Answers appear in the sales CSV export under Custom Fields (Gumroad Help articles 101 and 74).
- Stripe Checkout / Payment Links: `custom_fields`, up to 3 per session; types text (up to 255 chars), numeric, dropdown (up to 200 options); required by default, `optional=true` to relax; values visible on the payment in the Dashboard and in exports, and on the Checkout Session object (Stripe docs, "Collect additional information"). Do not collect sensitive data in these fields (Stripe's own caution).
- Mailchimp signup form (free samples, no purchase): an optional text merge field "How did you find us?" on the embedded form; same coding list. This catches the far larger sample audience.

## Coding helper
`skills/tools/hdyhau_code.py` (stdlib, written this run, nothing installed): reads a CSV (Gumroad or Stripe export, or any CSV with a named answer column) and prints counts per channel plus the uncoded answers for hand review.
`python3 hdyhau_code.py sales.csv --col "How did you first hear about Cedwyn?"`

## How we apply it to Cedwyn
- Proposal for the next BIZDEV run (needs no money; does change the live checkout, so record it as a proposed change and apply only within the existing sales-fix rules): add one optional Gumroad textbox, "How did you first hear about Cedwyn? / Sut glywsoch chi am Cedwyn?", to all e-book products; and the same optional text field on Stripe-hosted /ebooks/ checkouts if they are used.
- Add the same optional field to the Mailchimp free-sample signup, so answers come in before the first sale.
- The Sunday growth report gains one line: "Heard about us (week / all time): <channel counts>", from `hdyhau_code.py`, with the blank rate. Say plainly that these are buyers' own recollections.
- Kill rule: if after 15 purchases more than 70% of answers are blank, move the question to the thank-you page and the delivery email instead of the checkout.
- Never publish individual answers; they are customer data. Only channel counts go anywhere, and only in internal reports.

## Sources
- fairing.co) (read; vendor)
- getrecast.com (read; quotes SparkToro and Refine Labs second-hand)
- gumroad.com (read: custom fields)
- gumroad.com (snippet: custom fields in the sales CSV)
- docs.stripe.com (read)