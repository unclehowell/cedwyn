# Member onboarding for the £49.99/month academy: first-week activation

Researched 27 Oct 2026. This deepens step 5 of founding-cohort-academy-launch-honest-urgency.md ("Onboard to fight early churn") into a measured plan. Failed card payments are handled separately in stripe-dunning-failed-payment-recovery-membership.md, which covers involuntary churn; this skill covers voluntary churn.

## What the sources say (with their limits)
- **Circle (community platform, own product data, blog read 27 Oct 2026):**
  - Members who complete an onboarding checklist **return about 5x more often**, and are **2–3x more likely to stay past 90 days**.
  - This is vendor data and correlational: keen members both finish checklists and stay.
  - Circle's advice: track one number, the **activation rate**, meaning the share of new members who reach a first win within their first week or two. A low rate "almost always means a clearer first step, not more content."
  - Circle's other advice: keep the checklist to the **one or two highest-impact tasks**.
  - Community strategist Carrie Melissa Jones (quoted by Circle) recommends ordering tasks **from lowest to highest effort**.
- **Marketing General Inc., 2026 Membership Marketing Benchmarking Report (via i4a, read 27 Oct 2026):**
  - First-year members renew at a median **72%**, against **82%** overall.
  - **89%** of associations send welcome emails, 35% send welcome kits, and **25% make personal welcome calls**.
  - These are associations on annual renewals, not monthly courses, but the first-year gap is the same idea.
- **i4a's own assertions (not checked against a primary study):**
  - members who don't engage in the first 3 months are "60–70% more likely to churn";
  - formal onboarding brings "25–40% higher first-year retention";
  - its targets: 80% logged in by day 7, and 40%+ attending an event within 90 days.
  - Use these only as rough targets, never as facts in public copy.
- **Recurly (already in the index):** voluntary churn for Education is 3.30% a month. A monthly product loses members every billing cycle, so the first 30 days (before the second charge) are the critical window.

## How to do it
1. **Define the first win: one concrete thing a new member gets in 10 minutes.**
   - For a records course: "open the 1667 record, and see where it sits on the timeline and the parcel map."
   - Activation = a member completes Module 1, lesson 1 **and** opens one evidence item within 7 days.
2. **Two-task checklist on the member home, lowest effort first:**
   - (1) watch the 3-minute "start here" video;
   - (2) open your first record, with a direct link.
   - It disappears once both are done. No profile-photo or app-download busywork.
3. **Emails, triggered from the member flag (not a fixed calendar):**
   - **Day 0:** welcome. One link, to the first win, plus how to cancel. Keep it honest; it's a UK subscription-regime requirement (see uk-subscription-regime-dmcc-academy-stripe-by-design.md).
   - **Day 2:** only if they're not yet activated. "The one record to start with", with the direct link.
   - **Day 5:** the date of the next live session.
   - **Day 14:** what's new in the evidence this fortnight. Send it to everyone.
   - **Day 25:** a "what you've used so far" recap before the second charge. It shows value; never pressure.
4. **A live touch within 7 days:** a monthly 30-minute members' Q&A, held as a group call, with the recording posted. At founding-cohort size (under 25), a short personal welcome note from the project team is feasible, as 25% of associations do with personal welcome calls.
5. **Measure weekly, using our own analytics beacon:**
   - activation rate (cohort by join week);
   - day-30 retention (paid the second invoice);
   - the cancellation reason: one optional question in the Stripe portal cancel flow.
   - If activation is under 50%, fix the first step before adding content.

## How we apply it to Cedwyn
- **Where it lives:** the academy is being built at /learn/ by the platform worker (Stripe £49.99/mo plus a member flag).
- **Hand the platform worker three hooks:**
  - a `joined_at` timestamp on the member record;
  - beacon events `learn_lesson_complete` and `evidence_open` carrying the member's hashed id, so activation can be counted with no personal data in the analytics;
  - a member home with the two-task checklist.
- **Onboarding emails:** a Mailchimp "academy members" audience tag, with a 4-email customer journey.
  - Check the Mailchimp free-plan limits first (mailchimp-free-plan-2026-limits-gates.md). If journeys aren't on the free plan, send them as Stripe-triggered emails from the site worker instead.
  - Emails never name the project lead. Signed "the Cedwyn Estate team". Banned-words list applies.
- **First win content:**
  - the 1667 record page plus its timeline and parcel-map positions, already published in the evidence catalogue;
  - only "raising a concern" wording; no assertions about anyone's title.
- **Report line** for the Sunday growth report: members, activated %, day-30 retained %.
  - With fewer than 20 members, report counts, not percentages.
- **Needs the project lead:** whether he appears in the start-here video or the monthly Q&A. Otherwise it's a narrated version with no name.

## Sources
- circle.so/blog/community-onboarding (Circle product data: 5x return, 2–3x 90-day retention; activation-rate advice; Carrie Melissa Jones task ordering)
- i4a.com (cites MGI 2026 Membership Marketing Benchmarking Report: first-year renewal 72% vs 82%; welcome email 89%, welcome calls 25%; i4a's 25–40% and 60–70% figures not checked against a primary source)
- recurly.com (Education voluntary churn 3.30%/mo, via existing index entry)