# Plain-text (letter-style) vs designed HTML email: what tests show, and how to test on a small list

Harvested 27 Oct 2026 (skills harvest, 22:58Z). Topic: HTML email design / A/B testing / welcome sequence.

## What the tests found (read in full unless marked)
- **HubSpot (Niti Shah; updated 13 Jun 2025; read).**
  - In a 2014 survey of 1,000+ professionals, nearly 2/3 said they preferred HTML/image emails.
  - In HubSpot's own A/B tests the simpler email won every time, with statistical significance. Opens fell as HTML richness rose.
  - Plain text vs a GIF email: the GIF version had a 2.3% lower clickthrough rate (clicks/opens), so plain text got 42% more clicks overall.
  - Plain text vs an HTML template with images: the HTML version had a 21% lower clickthrough rate. Overall it was "51% fewer clicks" (headline figure; the per-test open numbers are in images, not read).
  - Explanations they give: image-rich templates get read as commercial (Gmail Promotions), and email reads as a 1-to-1 channel.
  - Deliverability is equal if the HTML is valid and a plain-text part is included.
  - Their "plain text" still had links and a tracking pixel.
- **NextAfter experiment #170381 (Moody Radio, ended 23 Feb 2024; read).** Stripping a templated, marketing-style email down to plain-text style gave **+57.2% clicks** (all traffic).
- **Litmus webinar tests (read).** Same-day 50/50 random split, customers and non-customers.
  - Customers: plain text won (60% of conversions, then 63% in a re-test).
  - Non-customers: plain text had more opens but marginally lower CTR, and conversions were about even (49%).
  - Litmus noted its first test also changed the wording, so it re-ran with only the format changed.
  - Lesson: **people who know you respond to a letter; cold audiences are roughly neutral.**
- **Against (MarketingExperiments/MarketingSherpa; read).** On a sequential send (not a split test, "no level of confidence"), the graphic email beat the text email: clicks 0.70% vs 0.40%, opens 15.7% vs 11.0%. That was an events promo where the pictures carried the offer.
- **Opens are a weak measure now.** Apple Mail Privacy Protection (since iOS 15, Sept 2021; general knowledge, not re-read today) preloads pixels, so opens are inflated. Judge a format on **clicks and sales**, not opens.

## How to do it
1. **Default to a letter.** One column; greeting by first name only if we have it; 80–200 words. One clear text link, repeated once at the end. No hero image, no button grid, no multi-column footer, no GIF.
   - Keep the legal footer: unsubscribe and postal address (UK PECR / Mailchimp requirement).
   - Always send with a plain-text part. Mailchimp builds it from the HTML; check it reads cleanly.
2. **A product image is allowed only when it *is* the offer** (a book cover in a sales email). One image, under 100 KB, with alt text, and the link still in words.
3. **Valid HTML.** Broken tags hurt deliverability (HubSpot). Keep Mailchimp's own markup and don't paste raw HTML from elsewhere.
4. **Check how "designed" a draft is.** Run `python3 the project workspace draft.html`. It prints words, images, links, buttons, tables and HTML bytes per word, with a verdict: letter-like / light / designed.
5. **A/B on a tiny list.**
   - Under ~1,000 subscribers, a split test can't reach significance on clicks. Instead, alternate formats by send (letter on odd sends, designed on even) for 6–8 sends.
   - Compare **clicks per delivered** and **sales attributed by UTM** (utm_content=letter|designed).
   - Change only the format, never the words at the same time (Litmus's mistake).
   - Use tools/ab_stats.py once there are enough clicks.
6. **Measure in the funnel report:** Stripe sessions with utm_medium=email by utm_content.

## How we apply it to Cedwyn
- **State as read 27 Oct:**
  - The 5-email nurture (the project workspace) is saved as unsent Mailchimp drafts, campaign ids 10b76bac8b → 004b2419b7. Its copy is already short and letter-like ("Here is your free e-book… one tap away").
  - The funnel report shows 0 new confirmed subscribers and £0 revenue on 27 Oct.
  - So the format test has no audience yet. The first gain is in setting the template right before the first sends.
- **Actions within the rules (no sends):**
  - When the nurture drafts are next touched, run each one's HTML through email_plainness.py.
  - Aim for letter-like on Day 0, Day 2 and Day 4 (relationship emails). On Day 7 ("Five books") and Day 10 ("the bundle"), allow one cover image each, since the covers are the offer.
  - Tag every link with utm_source=mailchimp&utm_medium=email&utm_campaign=nurture&utm_content=<day>-<letter|designed>.
- **Personal sign-off.** The From name is "Great House Farm". A named sender in the signature reads more 1-to-1 (HubSpot's "1-to-1" reason), but the public text must never name the project lead. Use "The Cedwyn archive team", or leave it as is: the project lead's call, so it goes as a PROPOSAL to QUEUE-after-framing, not a change.
- **Sending is still the project lead's OK only**, as is verifying the sending domain (nurture.md). This skill changes drafts, not sending.
- The academy and launch emails later follow the same rule: letters to warm readers, one cover image when selling.

## Sources
- blog.hubspot.com (HubSpot, updated 13 Jun 2025; read)
- nextafter.com (NextAfter #170381, Feb 2024; read)
- litmus.com (Litmus; read)
- marketingexperiments.com (MarketingExperiments; read; counter-evidence, sequential sends)