# Email read time: write for the 9 seconds people give an email

Date: 30 Oct 2026 · Skill harvest · Topic: HTML email design / institution letters / newsletter

## What the practitioner data states (read 30 Oct 2026)
- Litmus, "Trends in Email Engagement" (blog, read): average time with an email fell from 13.4 s (2018) to 11.8 s (2020), 10 s (2021) and **8.97 s (2022)**. Litmus footnote: read time comes from only 17% of the opens it processed. The data dates from 2022 and Litmus itself flags the page as 2+ years old.
- Litmus Trends in Email Engagement 2022 PDF (search snippet only, PDF not opened): of timed opens, **29.4% read (>8 s), 41.1% skimmed (2–8 s), 29.5% glanced (<2 s)**.
- Litmus, "Read Rates" blog (read): the industry bands are glance <2 s, skim 2–7 s, read 8 s+. Only 19% of marketers track read rate (Litmus's own State of Email Analytics survey). Read rate beats open rate for picking A/B winners and for judging emails that have no button: newsletters, notices, letters.
- Litmus also sells the analytics behind these numbers, and Apple Mail Privacy Protection preloads images, so timed opens lean towards non-Apple readers. Treat the 9 s as a rough guide, not a measurement of our list.
- Reading speed: Brysbaert 2019 meta-analysis (Journal of Memory and Language; abstract read). Adults read English silently at **238 words/min for non-fiction**. So **9 s ≈ 35 words** and 8 s ≈ 32 words. Welsh and bilingual copy wasn't measured, so expect it to be slower.

## The rules
1. **The first 35 words carry the whole email.** Put who you are, what you want and the one fact that makes it worth answering there. Background and history go after the ask.
2. **For skimmers (41%): one idea per short paragraph**, and the ask as a question that ends with a question mark. Put dates, catalogue refs and record IDs in a line of their own so they stand out.
3. **The first link or button should land within the 9-second budget** in sales and newsletter mail. Letters to institutions get no button. Their "link" is the ask itself, and a single evidence URL can go lower down.
4. **Glancers (30%) only see the subject, preheader and greeting line.** Those three must be enough to work out what the email is for.
5. **Don't build our own read-time tracking.** A timed pixel is a tracking pixel, and the ICO's storage-and-access guidance applies PECR regulation 6 to tracking pixels in email (see existing PECR skills). Mailchimp doesn't report read time. For us, the measure is the **reply** (institutions) or the **click to /ebooks/** (newsletter).
6. **For A/B tests on a tiny list, don't judge by opens** (MPP inflates them; see email-metrics-mpp-bot-clicks-what-to-trust.md). Compare replies or clicks, and apply Twyman's law to any big win.

## How we apply it to Cedwyn
- **Hive and correspondence drafts (HubSpot):** before a draft goes READY, run `python3 tools/read_budget.py draft.txt --ask "<the question>"` (exit code 2 means the ask is beyond 35 words). Add one line to the changelog: "read-budget: ask at word N". This only suggests where to put the ask and never changes facts or the project lead's sign-off. The tone and editorial rules still apply.
- **Newsletter (Mailchimp):** the first 35 words name the new door, record or e-book and link to it (tracked tag per existing UTM rules). Background goes after the link. Check with the tool on the exported HTML.
- **Sales emails:** the shop link sits inside the budget, with the "£4.99, PDF emailed instantly" line from the trust copy next to it. Prices never change.
- **What we'll learn from:** reply rate per institution letter (HubSpot) and clicks per newsletter (Mailchimp) before vs after. Log it in the Sunday growth notes. If after 6 letters and 2 newsletters nothing has moved, keep the rule as hygiene and stop measuring it.

## Tool
`tools/read_budget.py` is our own script, stdlib only (nothing installed). It reports word count, full read time, words and seconds before the first link, the text a 9-second reader gets through, and whether `--ask` falls inside that. Tested on the box 30 Oct 2026 with a sample archive letter: 62 words, the ask inside the budget, the link late (flagged).

## Sources
- litmus.com (read)
- litmus.com (read)
- litmus.com (search snippet only)
- litmus.com (snippet: 11.1 s 2016 → 13.4 s 2018)
- sciencedirect.com (Brysbaert 2019, abstract)
- ico.org.uk (read: tracking pixels in email fall under PECR reg 6)