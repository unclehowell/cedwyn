# Academy paywall shape: hard paywall vs freemium, and how much to give away free (2026)

Skill date: 30 Oct 2026 (skills harvest ~23:30Z). Status for Cedwyn: PROPOSAL only. the project lead has already set the shape (23:16, 30 Oct): questionnaire v0.0.1 free, everything else behind the £49.99/month subscription. This file covers where the free part should end and what to measure. No price tests, trials or outreach are planned.

## What the data states
- **RevenueCat, State of Subscription Apps 2026** (read; 115,000+ apps, $16B revenue, 1B+ transactions):
  - Hard-paywall apps convert **10.7%** of downloads to paid by day 35 (median). Freemium apps convert **2.1%**. The hard-paywall floor (4.2%) is double the freemium median.
  - "After one year, retention for both models is nearly identical." The hard paywall wins on conversion, not on keeping people.
  - **55%** of all 3-day-trial cancellations happen on Day 0. The first session decides most outcomes.
  - Education is the slow category: only **28.5%** of its conversions happen on Day 0 (the lowest of any category; overall 50.6%). 7-day trials are common there, and conversions bump at day 7. Education download-to-trial median is 6.5%. Education, Travel and Shopping lean to annual plans (59–66% on the report's plan-mix chart).
- **RevenueCat Sub Club, David Barnard, 29 Apr 2026** (read; growth advisor Phil Carter, two clients, same move):
  - Client A went from a hard paywall to freemium with a "multistep paywall": "This product is free and will always be free, but we want you to try the best version of it for seven days." LTV per user rose **75%**, together with other pricing and packaging changes.
  - Client B made the same switch and saw **more than a 50% drop** in subscriber conversion. They pulled it within a couple of weeks.
  - Carter's rule: stay hard-paywalled if you are bootstrapped, need cash now, solve an acute problem, or lack the analytics to test gating. Freemium needs strong retention, runway, and network effects or user-generated content.
- Caveat: all of this is mobile-app data. Cedwyn Academy is a small web product, so treat the figures as direction, not targets.

## The how-to
1. **A small free sample, then a hard gate.** Keep v0.0.1 to one questionnaire, e.g. Grade 1's 12–13 questions. A generous free tier is what sank Client B. The free set should show the format (answer, reveal, source) and stop at the point of highest curiosity.
2. **Put the paywall at the moment of intent.** In education, conversion happens late as well as on day 0, so show the gate twice: at the Grade 1 result screen ("v0.0.2 unlocks Grades 2–7: 72 more questions, each cited"), and again in the follow-up a member opts into.
3. **"Free and stays free" framing.** Carter's winning copy said the free version would always be free. Say the same: "v0.0.1 is free and stays free. v0.0.2 is the full set." This also fits the version dropdown.
4. **Lock on the server, not in the browser.** Locked questions never reach the page (already in the Academy brief). A CSS-hidden paywall gives away the paid set.
5. **Measure a funnel, not a rate.** Count free start, then Grade 1 finished, then paywall seen, then Stripe click, then paid. Read it as a 35-day cohort, RevenueCat's window. With a small audience, read counts, not percentages, until there are 100+ Grade 1 finishers.
6. **Change one thing at a time,** and only on evidence. If finishers rarely click Subscribe, fix the gate copy and placement first. Don't widen the free tier until the copy has been tried.

## How we apply it to Cedwyn
- This matches the project lead's v0.0.1-free rule. Recommend that v0.0.1 stays at Grade 1 only. Don't add a free trial: there are no price tests, and a trial is a price change in effect.
- For the Academy webapp worker (c1fca92e): put the subscribe card on the Grade 1 result screen with the "free and stays free" line, and log the 5 funnel steps as GoatCounter events or Workers Analytics Engine points (see goatcounter-api-campaign-and-path-counts.md, campaign-tags-first-party-beacon-workers-analytics-engine.md).
- Review the funnel in the Sunday growth report once the member sync shows any joins. It showed 0 at 22:55Z on 30 Oct.
- Related: academy-plan-shape-trial-vs-paid-pass-vs-annual.md (plan length), free-previous-edition-paid-latest-baen-pattern.md (versioned freemium for e-books), paid-version-pages-paywalled-markup-lead-in.md (search markup for gated pages).

## Sources
- revenuecat.com (SOSA 2026, read 30 Oct 2026)
- revenuecat.com (Barnard / Carter, 29 Apr 2026, read in full)