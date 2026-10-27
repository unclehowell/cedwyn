# Cold email follow-ups: how many, when, and what each one states (UK B2B, small list)

Harvested 2026-10-27 (skills harvest). For the parcels campaign (30 emails from the connected Gmail, 27 Oct 2026) and any later company outreach.

## The numbers (read today)
- Belkins 2026 study (7,530,489 emails, 2025 managed outreach, read 27 Oct): step 1 has the best per-step reply rate (0.59%) but steps 2-6 together bring **58.6% of all replies**; step 3 books more meetings than steps 1+2 combined; **53%+ of email-sourced meetings come from step 3 or later**; per-step rate falls to 0.28% by step 6, with a small uptick at step 4 when the angle is new. Their rule: 3-5 steps, step 3 written "as if it's the first email", switch channel after that. (Vendor data from their own campaigns: high volume, US-heavy; treat as direction, not a forecast.)
- Woodpecker roundup 2026 (read): 42% of replies come from follow-ups and 48% of reps never send one; 3-5 step campaigns 8.3% reply vs 4.1% with no follow-up (Instantly data); lists under 50 contacts average 5.8% vs 2.1% for 1,000+ (Belkins 16.5M). Negative replies: "check your follow-up intervals first. Too frequent, too regular or too many reads as pressure."
- Instantly benchmark (read): 50-125 word emails, one CTA, 1-3 follow-ups over 7-14 days; "first follow-up adds 40-50% more replies"; keep bounces under 2% and complaints under 0.3%.

## How to do it
1. **Before any follow-up, rebuild the list.** Drop everyone who replied (any reply, including "no"), every opt-out, every hard bounce, and every auto-reply naming a leaver or a closed inbox (use tools/reply_triage.py). Drop anyone who now sits in suppression.csv. What's left are the true non-responders.
2. **Step 2, day 5-7 (working days), in the same thread.** Reply to your own sent message so the original sits under it. 40-70 words. One new reason, not "just bumping this". Same opt-out line.
3. **Step 3, day 12-16: a new angle, written as a fresh email** (Belkins: the step that books most meetings). Different proof point or use, one question that's easy to answer yes or no to. Can be a new subject line.
4. **Stop at 3 for a small, personal-Gmail send.** The 4-5 step figures come from warmed sending domains. From one personal Gmail with fewer than 50 recipients, the downside (a spam complaint on the project lead's own address) costs more than the extra replies are worth.
5. **Vary timing.** Spread sends 60-120 s apart, on different weekday mornings, never on a fixed clock.
6. **Then switch channel, don't extend.** Belkins finds channel switches beat email 4+. For UK companies the PECR-free switch is a role-addressed letter (see uk-b2b-postal-letters-local-businesses-mps-jicmail.md). A call needs a TPS **and** CTPS screen first (uk-b2b-cold-calling-tps-ctps-permission-opener.md).
7. **Measure per step** (replies, positive replies, opt-outs), not opens. Apple MPP makes opens meaningless.

## UK rules that still apply
- PECR reg.22 consent applies to individual subscribers (sole traders and some partnerships). Corporate addresses (companies, LLPs, charities) can be emailed, but every message must identify the sender and give a simple way to opt out (ICO B2B marketing guidance). UK GDPR still applies to a named person's work address: legitimate interest, and honour objections at once.
- The first email promised "reply and we won't write again". A follow-up to a non-responder keeps that promise, but **any** reply ends the sequence for that address.
- DMCC Act / CAP: no false urgency ("last chance") unless it's true.

## How we apply it to Cedwyn
- Parcels send went out 27 Oct 2026, around 11:00-11:25 GMT. **Step 2 window: Mon 2 - Wed 4 Nov**, in-thread, from the same Gmail, only to non-responders after triage. **Step 3 (new angle, e.g. the free /ebooks/ v0.0.1 edition or the /parcels/ map page): Wed 11 - Fri 13 Nov.** Then stop email. The 88 phone-only businesses and any step-3 non-responders get a role-addressed letter, not more email.
- **Follow-ups are a new outward batch.** The root confirms authority before step 2 goes out: the project lead said "Decide all. Yolo mode" for the first 30 emails, and whether that covers follow-ups is the root's call.
- Log step number and outcome per row in the project workspace Update HubSpot ticklist [record] per send.
- When GHL is live, don't move these follow-ups onto a new GHL sending domain. GHL's own guide states cold email during warm-up hurts deliverability (see gohighlevel-lc-email-dedicated-domain-warmup.md).

## Sources
- belkins.io (and the .md version; updated 2026-06-26; methodology section)
- woodpecker.co
- instantly.ai
- ico.org.uk (B2B rules; summarised from earlier harvest files, not re-read today)