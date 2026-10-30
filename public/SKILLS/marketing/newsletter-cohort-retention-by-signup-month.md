# Newsletter retention by signup month (cohort table) from free Mailchimp exports

Harvested 2026-10-30 02:15Z. Topic: email analytics; which signup channels bring readers who stay.

## Why it matters (primary facts)
- beehiiv shipped a cohort "waterfall" because "not every acquisition source is created equal": it shows, per signup month and source, how many are still active N months later. beehiiv defines active as opened or clicked at least one email AND stayed subscribed the whole month. It sits in 3D Analytics on paid Scale/Enterprise plans only (product.beehiiv.com). The same table can be built free from Mailchimp's export.
- Lists decay whatever you do: HubSpot's database-decay page puts it at about 22.5% a year (vendor figure; its footnoted source not checked); ZeroBounce's 2026 list-decay report found 23% of analysed addresses invalid within a year (vendor data). Total list size hides this; a cohort table shows it.
- Mailchimp's export (Audience > Export audience, CSV) carries per contact: MEMBER_RATING (1-5 activity stars), OPTIN_TIME (signup form, single opt-in), CONFIRM_TIME (clicked double opt-in link), LAST_CHANGED, and audience fields/tags; exports can include subscribed, unsubscribed and cleaned contacts (mailchimp.com). Unsubscribed/cleaned files add UNSUB_TIME / CLEAN_TIME (check the header on the first real export).
- No primary-source benchmark for "good" month-3 retention of a small heritage newsletter was found; set our own baseline from the first table rather than borrow one.

## How to do it
1. Tag every signup with its source at the form (hidden field or tag: SOURCE = fb, ig, shop, ebook-pdf, talk, blog, academy). Without this, you only get month cohorts.
2. Monthly: export subscribed + unsubscribed + cleaned CSVs; run
   `python3 the project workspace subscribed.csv unsubscribed.csv cleaned.csv --source-col SOURCE --csv cohorts.csv`
   It prints, per signup month (and source), n, % still subscribed at months 1/3/6 (with the eligible count in brackets) and % of current members with 3+ stars.
3. Read it three ways:
   - Down a column (m3 across months): did a content or welcome-email change move retention?
   - Across sources in one month: which channel brings people who stay. A channel with high signups but low m3 is a list-health cost (complaints, decay), not growth.
   - engaged_now: share of survivors still reading. Low stars with high retention = silent list; run the existing win-back/sunset flow.
4. Decide with small numbers honestly: under ~30 people in a cell, treat differences as anecdotes (use tools/ab_stats.py for any two-group comparison before acting).
5. Act on one lever a month: move effort to the best-retaining source, fix the welcome sequence for the worst cohort, or stop a channel.

## How we apply it to Cedwyn
- Add a SOURCE hidden field to every Cedwyn Mailchimp signup form (site strip, e-book thank-you page, academy, talks) so each subscriber records where they came from. This is a form setting, no new tool or spend.
- The Sunday GROWTH REPORT run exports the three CSVs through the connected Mailchimp (read-only), runs cohort_retention.py, and appends one line to the report notes. Example line: "Oct cohort m1 retention 92% (48); e-book buyers 3+ stars 70% vs Facebook 35%". Delete the CSVs after the run, since they hold personal data and disk is tight.
- Decision rule: after 3 monthly cohorts, the source with the best m3 retention × engaged_now gets next month's promo effort. Any source under 50% m3 with 30+ people gets reviewed (it may be the wrong audience, or the welcome email may be wrong).
- Never publish the table or any addresses; it goes in internal notes only. This sends nothing to subscribers.

## Sources
- beehiiv cohort analysis release (active definition, plan gate): product.beehiiv.com
- Mailchimp export columns: mailchimp.com
- HubSpot database decay (22.5%/yr, vendor): hubspot.com
- ZeroBounce 2026 list decay report (23%, vendor): zerobounce.net
- Tool: tools/cohort_retention.py (stdlib, --selftest passes)