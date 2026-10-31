# The P.S. line in Cedwyn emails: one job, one link, tested on clicks

Status: skill (internal). Written 31 Oct 2026 by the skills harvest. Nothing sent.

## What the evidence shows
- **Richard Hayes split test (his own blog, 6 Apr 2012, read):** 1,500 recipients got an email with no postscript; another 1,500 got the identical email with a P.S. in the footer reminding them of the offer. Click-through rose "almost 13%" (SmartrMail's 2026 guide repeats it as 12.79%). No confidence interval or base rate was published, so treat it as one small test, not a law.
- **MailerLite (metrics guide, read):** one of their own newsletters' P.S. sections drew "an additional 148 clicks" (screenshot only; list size not given).
- **Direct mail origin:** Siegfried Vögele's eye-tracking work (Handbook of Direct Mail, p. 202, quoted by Five Maples, read) found over 90% of letter readers read the P.S. before the body. That is paper, from the 1970s-80s; email is scanned the same way (bottom-jump), but no email eye-tracking number was found.
- **What practitioners agree on (SmartrMail, Five Maples):** the P.S. works when it has one clear job (restate the offer, deadline or single link), fits a conversational, letter-like email, and is not used on every send by habit.

## How to do it
1. **One job only.** Pick one: restate the single call to action, add the one fact that makes the click worth it, or ask for a reply. Never a second offer.
2. **One link, the same destination as the main button**, with its own UTM content tag (`utm_content=ps`) so its clicks are counted apart from the button.
3. **Short:** one or two sentences, under ~30 words, placed after the sign-off.
4. **Plain words:** it should read as written by a person, not a footer banner. No bold, no image.
5. **Test, don't assume:** Mailchimp A/B on the P.S. only (with vs without), winner by **clicks**, not opens (Apple Mail Privacy inflates opens). With a small list, run it over several sends and pool the counts before deciding; a single send of a few hundred will not separate a 13% lift from noise.
6. **Rotate:** if the same P.S. pattern runs for 4+ sends, check its share of clicks; if it falls, drop it for a send or two.

## Measured on our side (31 Oct 2026)
- `the project workspace` (5 unsent Mailchimp nurture emails, Day 0-10): **0 of 5 carry a P.S.** Nothing has been sent, so there is no baseline click rate yet.

## How we apply it to Cedwyn
- Add one P.S. to each nurture draft before it goes live, each with a single job:
  - Day 0 (free e-book): "P.S. If the download link misbehaves, reply to this email and we'll send the file directly." (reply ask; builds sender reputation).
  - Day 2 / Day 4 (story and method): the P.S. points to the one evidence page the email is about, `utm_content=ps`.
  - Day 7 / Day 10 (books, bundle): the P.S. restates the single /ebooks/ link and what it contains; no discount wording unless a real offer exists.
- Weekly digest: P.S. only when there is one thing worth a click (a new evidence page, a new episode).
- Measurement: count `utm_content=ps` sessions in the weekly report beside the main button; after ~1,000 delivered emails with the P.S. variant, compare click rate against the no-P.S. variant before making it standard.
- Editorial rules still apply to the P.S.: no banned words, no names of the family, Cedwyn internal links only, purchases via /ebooks/.
- Proposal only: editing the Mailchimp drafts is a change for the email owner/run to make; this file changes nothing in Mailchimp.

## Sources
- richardhayes.blogspot.com (primary test, read)
- smartrmail.com (2026 guide; restates the test, read)
- mailerlite.com (P.S. section, 148 clicks, read)
- fivemaples.com (Vögele quote, read)