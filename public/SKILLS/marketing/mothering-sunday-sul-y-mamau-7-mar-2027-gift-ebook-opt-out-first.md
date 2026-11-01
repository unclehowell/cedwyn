# Mothering Sunday / Sul y Mamau, 7 Mar 2027: e-book as an instant gift, opt-out email first

Harvested 2026-10-31 ~19:30Z. This fills the Jan-Mar calendar slot after St David's Day. The gift-path mechanics are already covered in ebook-gifting-christmas-gift-path-guide-email.md and ebook-gifting-gumroad-gift-toggle-stripe-gift-field-christmas.md. This file covers the **occasion**: its date, its size and the sensitive-occasion opt-out.

## Facts (with sources)
- **Date: Sunday 7 March 2027.** UK Mothering Sunday is the fourth Sunday of Lent, 21 days before Easter. Easter 2027 is 28 March, which gives 7 March (computed with dateutil; check against a calendar in January). It falls **six days after St David's Day** (1 Mar), so the two campaigns overlap.
- **Market size (GlobalData, 17 Mar 2025, read):** UK Mother's Day 2025 spend was forecast at **GBP 2.4bn (+5% YoY)**. **56.4%** of UK consumers planned to buy at least one item (+2.9 points), with an average spend of **GBP 125.30** (+GBP 17.43). Gifting is the biggest category, and GlobalData advises retailers to offer "personalised gifting options".
- **The opt-out practice, with real numbers (Braze case study, read):** Bloom & Wild (a UK florist) emailed customers in March 2019 offering to opt out of Mother's Day emails. **Close to 18,000 customers opted out.** On launch day, Twitter interactions rose from an average of 4-5% to 20%. Phone and email feedback peaked at **1,500 responses, 5x the usual**. The opted-out customers went into one segment that was suppressed from the campaign. This led to the "Thoughtful Marketing Movement" (bloomandwild.com).
- **Practitioner caution (dotdigital blog, read):** opt-out emails are now "a near-standard fixture" in inboxes. When every brand sends one, the email itself becomes a reminder of the occasion the reader wants to avoid. Keep it to **one short, kind email, sent once**, or put the option in an existing newsletter rather than sending a standalone blast. Many brands now offer the same opt-out for Father's Day and Valentine's Day.

## The play
1. **Late Jan or early Feb: opt-out first.** Add a single line or button to the next newsletter: "Would you rather not hear from us about Mothering Sunday? Tap here." It writes a Mailchimp tag (no-mothering-sunday), and that tag is suppressed from every send about the occasion.
2. **About 10-14 days before (around 23-25 Feb), one gift email** with an instant-delivery angle: a digital gift that arrives on the day, with no postage cut-off. Send it only to the list minus the tag. It's honest timing, with no fake countdowns (DMCC Sch. 20 bans false urgency; see welcome-sequence-first-sale-small-ebook-list.md).
3. **On the day: no extra email.** The /ebooks/ page line carries it.
4. **Measure:** opt-out count, gift-email click rate against the newsletter's own baseline, and sales tagged utm_campaign=sulymamau2027.

## How we apply it to Cedwyn (PROPOSED, needs the project lead's GO for any email or setting change)
- **Site, a free action with no account needed. PROPOSED patch, not committed:** from 22 Feb to 7 Mar 2027 only, add a dated line under the shop strip on /ebooks/ and /wales/:
  - EN: "Mothering Sunday, 7 March: send a Cedwyn e-book as a gift - it arrives the moment you buy." Then link to the existing gift path.
  - CY: "Sul y Mamau, 7 Mawrth: rhowch e-lyfr Cedwyn yn anrheg - mae'n cyrraedd yn syth." (**Welsh needs a speaker's check.**)
  - Remove the line on 8 Mar. Build the start and end dates into the build step so the line can't stay up by mistake.
- **Email: PROPOSAL only (the project lead's GO).** The opt-out line goes in the February newsletter. The gift email is one Mailchimp campaign to the list minus the tag. Drafts only, sent by nobody until he states GO.
- **Pairs with St David's Day:** one combined "Dewi Sant + Sul y Mamau" week of content, with no double-mailing. At most one occasion email in that week.
- **Rules:** never name the project lead; no banned words; no invented discounts (house rule: listed prices only); Gumroad and Stripe settings are not changed without his GO.

## Sources
- globaldata.com (read 2026-10-31)
- braze.com (read 2026-10-31; 18,000 opt-outs, 4-5% to 20% interactions, 1,500 responses = 5x)
- bloomandwild.com (search snippet: March 2019 origin; page body did not render)
- econsultancy.com (search snippet, same figures)
- dotdigital.com (read 2026-10-31; overuse caution)