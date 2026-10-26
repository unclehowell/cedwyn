# Email send time and frequency for a tiny list (under 100 subscribers)

Date: 26 Oct 2026 (skills harvest 20:22). The big-platform figures are averages over billions of sends. They are a starting guess, not a rule for a list of 1-50.

## What the data shows
- **Omnisend 2026 research (~26 billion emails):** Tuesday leads opens (31.27%) and click-to-sent (0.81%). Friday leads conversions (0.081%), and the best single slot is Friday 7 AM (0.138% conversion), then Monday 8 AM (0.114%). Clicks peak 7-8 AM and 4 PM; "evening sends don't come close". Saturday is weakest for clicks (0.68%) and conversions (0.058%).
- **MailerLite (UK/US/AU/CA data, Dec 2024-Nov 2025; post 16 Dec 2025):** opens peak 8-11 AM. Clicks peak 8-9 PM, and creator lists peak around 9 PM. Friday 6 PM is the one slot where best open and best click coincide (49.7% open). Open rates are flat across days (about 46.5-49.7%). Their advice: aim for the click hour, not the open hour.
- **The two big datasets disagree on evening.** Omnisend's ecommerce lists click in the morning; MailerLite's creator lists click at night. So timing depends on the audience, and we have to test it ourselves.
- **Frequency case (Only Influencers newsletter; Jeanne Jennings, Sep 2025):** they moved from 1 send a week (12-13 items) to 2 sends a week (6-8 items each). Q4 2023 vs Q4 2024: unique opens dipped a little, unique CTR "climbed dramatically", and total clicks rose 179%-577% by month. Reach rate (the share of the list clicking in a month) also rose. The lesson is fewer items per email, not just more emails.
- **Unsubscribe guardrail:** about 0.2-0.3% per campaign is normal and over 0.5% is a warning (several benchmark pages; Visionary's 2026 table puts media & publishing at 0.21%). The Visionary dataset's methods are not checked, so use it as a rough line only.
- **Apple MPP inflates opens.** Judge on clicks and sales, never opens (see email-subject-lines-preview-text-mpp.md).

## How to do it on a tiny list
1. **Pick one fixed slot for 6 sends:** Tuesday 8 AM UK. It is the best overlap of Omnisend's open/click day and the morning click window, and older heritage readers likely read in the morning (not checked).
2. **Cadence:** one short email a week, 3-6 items maximum, one main link. Add a second weekly email only when there's a real second story (Only Influencers lesson: split long issues instead of padding).
3. **One alternation test** (not an A/B split; the list is too small): sends 1-3 on Tuesday 8 AM, sends 4-6 on Thursday 8 PM (MailerLite's creator evening). Compare total unique clickers per send and sales. A sale beats a click. Under about 30 subscribers, call it "no difference" unless one slot gets twice the clickers (use tools/ab_stats.py `compare` if the numbers grow).
4. **Mailchimp:** "Send Time Optimization" and timewarp. Mailchimp's own help for these was not read today, and STO needs list history, so the feature may be unavailable on a tiny list (not checked). Schedule manually in UK time.
5. **Stop rules:** unsubscribes above 0.5% on 2 sends in a row means drop to fortnightly. Any spam complaint means pause and review (Postmaster skill).
6. **Log each send** in the growth log: slot, list size, clickers, sales, unsubscribes.

## How we apply it to Cedwyn
- **Reality check:** the Mailchimp list is 1 confirmed subscriber (weekly.csv, 25 Oct). A send-time test means nothing until the list is about 30 or more. Until then, set the habit only.
- **Prep now, no GO needed:** write the 6-send slot plan and the log columns into the project workspace notes. Decide that the one weekly email is Tuesday 08:00 UK, 3-6 items (one record story, one e-book link, one page link).
- **PROPOSAL (needs the owner's GO):** start the regular weekly email once the welcome sequence is live and the list has 10 or more subscribers. A new recurring campaign counts as an email journey.
- **Measure:** clickers per send and sales per send. The decision point is after 6 sends with 30 or more on the list.
- House rules for any public text: never name the owner, none of the banned words, no disputed early dates.

## Sources
- omnisend.com (2026 research, ~26B emails; read 26 Oct 2026)
- mailerlite.com (16 Dec 2025, 2026 edition; read)
- linkedin.com (Jeanne Jennings, Sep 2025; first published on Only Influencers 21 Jul 2025; read)
- visionary-marketing.co.uk (unsubscribe table; methods not checked)
- klaviyo.com ("at least two segmented campaigns per week": snippet only, not checked)