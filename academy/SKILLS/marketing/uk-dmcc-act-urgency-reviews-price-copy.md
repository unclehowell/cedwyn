# UK DMCC Act marketing-copy compliance: urgency, reviews, prices (from 6 Apr 2025)

Skill for: every sales page, email, social post and checkout we write for the Cedwyn e-books. Read 27 Oct 2026.

## The rules (primary text, read)
- **DMCC Act 2024, Part 4 + Schedule 20** replaced the CPUTRs for practices from **6 April 2025** (in force by SI 2025/272). Schedule 20 lists practices banned outright, whatever their effect on buyers.
  - **Sch.20 para 7**: falsely stating a product, or its terms, is available only for a limited time "to elicit an immediate decision". (legislation.gov.uk, read)
  - **Sch.20 para 13**: submitting or commissioning a **fake consumer review**, or one that **hides that it was incentivised**. It also bans publishing reviews in a misleading way, and publishing them without "reasonable and proportionate steps" to stop fake or hidden-incentive reviews. (read)
- **CMA207 guidance** (gov.uk, read):
  - Countdown example: a clock that runs out and then restarts while the offer carries on is banned. A true end date is "unlikely to be problematic", unless a substantially similar offer comes back soon after.
  - Drip pricing (a headline price, then mandatory extras added later) is prohibited outright.
  - Penalties: civil fines up to the **higher of £300,000 or 10% of worldwide turnover**. Most Schedule 20 bans (not paras 12, 13 or 30) are also criminal offences.
- **Enforcement is real, numbers from the CMA itself:**
  - 18 Nov 2025: the CMA reviewed **400+ businesses in 19 sectors**, found concerns in 14 (drip pricing and misleading countdown timers named), sent **100 advisory letters** and opened 8 investigations (gov.uk press release, read).
  - CMA blog, 14 Oct 2026 (read): **7 of those 8 settled**. Gold's Gym, Wayfair and Buy It Direct paid **£6M+ in penalties** and **£440k+ in redress** between them. Across all cases: 20 investigations opened, **£11.8M+ fines**, **£2.3M+ redress**.
- Practitioner reading (Mayer Brown, Baker Botts, Nov 2025; snippets, not read in full): the first wave went after time-limited offers, timers and fees. Small traders are not exempt; the CMA states it targets the "most egregious" cases first.

## How to do it: a pre-publish checklist (any copy that sells)
1. **Deadlines are real or absent.** "Offer ends Sunday 23:59" only if the price really reverts then and stays reverted. Don't re-run the same offer within weeks.
   - A countdown timer has to be server-time to the real end date. Never a per-visitor evergreen timer.
2. **No fake scarcity.** E-books are unlimited, so never write "only 12 copies left". A numbered special edition can say so only if the edition is genuinely capped.
3. **One price, all-in.** The headline £9.99 is what the buyer pays: VAT included, no checkout "processing fee". Shown in a different currency (Stripe adaptive pricing)? Show the converted total, not a lower base.
4. **"Was/now" only with a genuine earlier price** that ran for a meaningful period (CMA209 price-transparency guidance covers reference prices; not read in full here, not checked).
   - The bundle can say "saves £X vs buying separately" only if the parts are really sold separately at those prices: £31.99 vs 8 × £9.99 = £79.92.
5. **Reviews:** only real buyers or readers, quoted verbatim, with a date.
   - A free ARC or gifted copy gets labelled ("reviewer received a free copy").
   - Never write or commission a review, and never cherry-pick in a way that misleads (e.g. hiding that there are only two).
   - Keep a simple log: who, when, how obtained, link or email id. That's the "reasonable steps" record.
6. **Free means free.** No email-gate surprise and no auto-enrol into anything paid.
7. **Material info near the buy button:** format (EPUB/PDF), language, page count, how delivery works, the reg 37 consent line (see uk-digital-checkout-reg37-consent-vat.md).

## How we apply it to Cedwyn
- Run this checklist as a gate in the SALES FIX and BIZDEV runs before any price or promo copy goes live. Add a lint to the funnel copy check: flag "only X left", "last chance", "ends tonight", "limited time" unless an `offer_end` date is set in the offer record and is in the future.
- Black Friday / Christmas promos (black-friday-cyber-weekend-small-ebook-shop-uk.md, new-release-launch-backlist-price-promo.md): fixed start and end dates in the offer record. The price reverts automatically at the end, and the same discount isn't repeated within 4 weeks (our own margin of safety, not a legal number).
- The bundle line "save £47.93" is true only while all 8 titles stay at £9.99 separately. Re-check on any price change.
- Reviews on /ebooks/: verbatim with date and source only. Mark ARC copies. Keep the log in the project workspace (create on first review).
- Price changes and promos stay PROPOSALS for the project lead (QUEUE-after-framing.md), as now.

## Sources
- legislation.gov.uk (read: paras 7, 13; commencement 6.4.2025)
- gov.uk (read: countdown example, drip pricing, penalties)
- gov.uk (read: 400+ businesses, 14 sectors, 100 letters)
- competitionandmarkets.blog.gov.uk (read: 7 of 8 settled, £6M+/£440k+, £11.8M+/£2.3M+)
- CMA209 price transparency guidance (named in CMA207; not read)