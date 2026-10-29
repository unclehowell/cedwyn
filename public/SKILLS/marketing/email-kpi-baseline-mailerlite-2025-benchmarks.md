# Email KPI baseline: MailerLite 2025 benchmarks as Cedwyn's yardstick

Harvested 2026-10-29. Use when judging whether a Cedwyn Mailchimp send did well or badly, and when setting kill rules for email tests.

## The numbers (MailerLite, read 2026-10-29; 3.6M+ campaigns, MailerLite customers, 2025)
- All industries: open 43.46% (2024: 42.35%), click 2.09%, click-to-open (CTOR) 6.81% (2024: 5.63%).
- Europe: open 45.08%, click 2.04%, CTOR 6.46%.
- Closest sector peers (open / click / CTOR / unsub):
  - Publishing company: 34.24% / 2.82% / 9.12% / 0.20%
  - Hobbies: 53.25% / 3.30% / 8.45% / 0.23%
  - Non-profit: 52.38% / 2.90% / 8.24% / 0.19%
  - Media: 42.97% / 4.10% / 12.92% / 0.10%
  - Higher education: 43.98% / 2.15% / 9.15% / 0.10%
  - Government: 48.52% / 3.05% / (not copied) / 0.22%
- Lowest unsubscribe: Legal 0.09%; Media and Higher education 0.10%.
- Caveat: these are averages from one vendor's customer base, not checked against another dataset. Opens are inflated by Apple Mail Privacy Protection (see email-subject-lines-preview-text-mpp.md), so trust click and CTOR more than opens.

## How to use it (practice)
1. Judge each send on CLICK rate and CTOR first; opens only as a deliverability alarm.
2. Pick one peer row, not the all-industry average. A heritage/local-history list behaves like Hobbies/Non-profit for opens and Publishing/Media for clicks.
3. Small lists are noisy: under ~500 recipients one click moves click rate by 0.2+ points. Judge on a rolling 3-send median, not a single send.
4. Alarm thresholds: open < 25% (half the peer average) = check inbox placement before the next send (inbox-placement-checks-mailtester-seed-headers.md); unsubscribe > 0.5% on a send = content or frequency problem; spam complaints > 0.1% = stop and review.
5. Write the baseline down once, then compare to your own median after 5 sends; your own median replaces the vendor number.

## How we apply it to Cedwyn
- Baseline targets for the Mailchimp list (Great House Farm / Cedwyn readers): open >= 45% (Europe), click >= 2.8% (Publishing), CTOR >= 8.5% (Hobbies/Non-profit), unsub <= 0.25%.
- Kill rules in other skills that say "below benchmark" now mean these numbers: e.g. Records of the Year series e1 CTOR < 8.5% -> cut to 2 emails; welcome sequence E3 (offer) click < 2.8% -> rewrite offer before more sends.
- The Sunday growth report (growth-report/RUNNER.md) should show each week's sends against this row: open / click / CTOR / unsub vs target, plus the rolling 3-send median.
- After 5 Cedwyn sends, replace the targets with Cedwyn's own median and note the date here.
- No send, no spend: this is a measuring rule only.

## Sources
- mailerlite.com (read 2026-10-29; 2025 data, 3.6M+ campaigns)


Cross-check (29 Oct 2026): see email-benchmarks-mailchimp-cross-check-click-band.md. Mailchimp's public data agrees on clicks (2.6-3.3% band) and unsubscribes (0.15-0.22%) but puts opens ~8-12 points lower; for Cedwyn (a Mailchimp sender) take no decision on opens and use the click band.