# Records of the Year — a December year-in-review email series (Cedwyn)

Date: 2026-10-29 · Skill harvest · Topic: email marketing / seasonal retention

## What the evidence states
- **Marriott Rewards "Year in Review" (Data Axle case study, page read 2026-10-29).** A multi-email December series built on one storyline, with each member's own year (stays, points, places) as the content. December 2014 against earlier Decembers: click-to-open **+20% year over year**, **86.1% more revenue** than Dec 2012 or 2013, **+38.8% revenue**, **+30.9% bookings**, **+9.7% conversion rate** year over year. The **last email** in the series earned **3x the December average revenue per delivered message**. It was the programme's best Q4 in three years. The campaign manager put it down to "a cohesive storyline, personalized content". (Vendor case study, US hotel loyalty; numbers as published, not independently checked.)
- **Yes Lifecycle / Data Axle 2018 holiday study** (already in archive-advent-calendar-24-records-december.md): holiday emails get **16.8% lower opens** but often higher conversion. **Christmas emails with no offer in the subject line had the top open rate (15.5%).**
- The pattern that carries over: a **look-back** series with **one theme** across 3–4 emails. It works because the reader is the subject (Marriott) or the story is (us). The commercial ask goes in the **final** email only.

## How to do it (generic)
1. One theme and one name for the whole series, used in every subject line (e.g. "Records of the Year 1/3").
2. 3 emails, about a week apart, in the first three weeks of December. Content first, no offer in subject lines.
3. Each email: 3–5 items, one image each, one line of context, one internal link per item.
4. Personalise where the data allows (Mailchimp merge/segments: signup month, which e-book they bought or downloaded). If there's no per-person data, make the *year's story* the personal thread instead ("what we found this year").
5. The last email carries the single soft ask (gift path / e-book), plus a "what's coming next year" teaser.
6. Measure click-to-open (opens are inflated by Apple Mail Privacy Protection) and revenue per delivered email, against last December or against the November campaigns.

## How we apply it to Cedwyn
- **Series:** "Records of the Year 2026 / Cofnodion y Flwyddyn" — 3 Mailchimp emails, **Tue 1, Tue 8, Tue 15 Dec 2026, 09:00 London**, bilingual cy/en headers (Spanish line for the Chubut segment only if real translations exist; see the hreflang rule).
  - 1/3 "Found this year": the 5 most-visited new evidence/research pages of 2026 (pull them from Cloudflare/GA4 top pages, bot traffic excluded per bot-traffic-human-visitor-count-cloudflare-ga4.md).
  - 2/3 "Opened this year": movie doors opened and academy/archive milestones, each linking to its Cedwyn page.
  - 3/3 "Still missing": 3 records from /research/missing-records/ that should exist, plus the year's numbers (pages added, records catalogued). Then **one** soft ask: the /ebooks/ gift path (link ebook-gifting-christmas-gift-path-guide-email.md). This is the only email with a CTA.
- **Personalisation we can actually do:** segment by signup month ("you joined us in June, when we published…") and by e-book buyer vs not (buyers get "next volume" instead of the shop ask). No invented stats.
- **Clash rule:** the archive advent calendar's weekly roundups (if approved) and this series must not both go out. Either merge (advent roundups become Records of the Year 1–3) or drop one. **Default: merge.**
- **Editorial:** public text never names the project lead; banned words list applies; neutral dated wording; Cedwyn internal links only; no discounts (price rules + DMCC).
- **UTM:** utm_source=mailchimp&utm_medium=email&utm_campaign=recordsofyear2026&utm_content=e1|e2|e3.
- **Kill / keep rule:** if the click-to-open of email 1 is below the November median, cut to 2 emails (merge 2 and 3). Keep it as an annual series if email 3's revenue per delivered email beats the November average.
- **Status:** PROPOSAL. Sending to the list needs the project lead's GO under existing rules. Draft lives in Mailchimp as a draft only.

## Sources
- data-axle.com (read 2026-10-29)
- data-axle.com (read in an earlier harvest, 2026-10-28)