# Email benchmarks, second dataset: Mailchimp vs MailerLite, and the target band Cedwyn should use

Written 29 Oct 2026 by the skills harvest. Companion to `email-kpi-baseline-mailerlite-2025-benchmarks.md`; it checks that file's targets against Cedwyn's actual sending platform.

## The two datasets
Mailchimp's public benchmark page (read 29 Oct 2026; "based on available data as of December 2023"; opens affected by Apple Mail Privacy Protection, its own disclaimer):

| Industry | Open | Click | Unsub |
|---|---|---|---|
| All users | 35.63% | 2.62% | 0.22% |
| Non-profits | 40.04% | 3.27% | 0.18% |
| Education + Training | 35.64% | 3.02% | 0.18% |
| Business + Finance | 31.35% | 2.78% | 0.15% |
| Ecommerce | 29.81% | 1.74% | 0.19% |

The public page shows only these five rows; a fuller report sits behind a lead form (not downloaded). No publishing, hobbies or heritage row is public.

MailerLite 2025 (already in the index; 3.6M+ campaigns): all 43.46% open / 2.09% click; Europe 45.08% / 2.04%; Publishing 34.24% / 2.82% (unsub 0.20%); Hobbies 53.25% / 3.30%; Non-profit 52.38% / 2.90%.

## What the cross-check shows
- Opens disagree by ~8-12 points between the vendors (Mailchimp 2023 lower, MailerLite 2025 higher). Different years, different senders, and MPP inflation make opens a poor yardstick; this is the second dataset saying so.
- Clicks agree closely: the comparable rows sit between 2.6% and 3.3% (Mailchimp all 2.62, education 3.02, non-profit 3.27; MailerLite publishing 2.82, non-profit 2.90, hobbies 3.30). That band is the one to trust.
- Unsubscribes agree: 0.15-0.22% everywhere.

## Rules (any small list)
1. Target clicks, not opens. Use a band, not a point: below the low end is a problem, above the high end is good.
2. Use your own platform's benchmark for opens if you must report them, because each platform counts opens its own way. For Mailchimp senders that means the Mailchimp row, not MailerLite's.
3. With fewer than ~1,000 recipients, one or two clicks move the rate by a lot. Use a rolling median of the last 3 sends and never react to one send.
4. Replace vendor benchmarks with your own median after 5 sends.

## How we apply it to Cedwyn
Cedwyn sends through Mailchimp, so its in-app benchmarks will look like the Mailchimp rows. The revised yardstick for the Sunday growth report:
- Click rate: band 2.6%-3.3%. Below 2.6% on the 3-send median = rework the email (one link, one ask). Above 3.3% = keep the format.
- Unsubscribe: alarm above 0.25% (both datasets put normal at 0.15-0.22%).
- Open rate: report against Mailchimp's non-profit 40% / all-users 36% for information only; take no decision on opens. This replaces the MailerLite open target of 45% in the companion file.
- CTOR: keep the companion file's 8.5% target (MailerLite only; Mailchimp's public page gives no CTOR).
- Say in the report that both are vendor averages for other senders, not Cedwyn's own, until 5 Cedwyn sends exist.

## Sources
- mailchimp.com (read 29 Oct 2026; data as of Dec 2023)
- mailerlite.com (read in the previous harvest, via the companion file)