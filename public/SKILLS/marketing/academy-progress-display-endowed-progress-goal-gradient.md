# Academy progress display: endowed progress and the goal gradient

Date: 2026-10-30. Status: PROPOSAL for the /learn/ grade ladder. This note changes no price and sends nothing.
Pairs with: academy-graded-quiz-attempt-then-reveal-mastery-gate.md and academy-streaks-habit-loop-duolingo-numbers.md. This note covers *how progress is shown*, so members finish grades and stay subscribed.

## Evidence (primary sources)
- **Goal gradient (Kivetz, Urminsky & Zheng 2006, Journal of Marketing Research, read p.1).** These were field studies with a real café reward card and a song-rating site:
  - people bought coffee more often the closer they got to the free one;
  - raters "visit the rating Web site more often, rate more songs per visit, and persist longer" as they near the reward;
  - customers given a 12-stamp card with 2 "bonus" stamps already filled finished the 10 required purchases faster than those given a plain 10-stamp card;
  - "a stronger tendency to accelerate toward the goal predicts greater retention and faster reengagement in the program".

  Their model states effort depends on the *proportion* of the distance left.
- **Endowed progress (Nunes & Drèze 2006, Journal of Consumer Research; JSTOR abstract read).** Car-wash customers with a 10-stamp card that already had 2 stamps "were more likely to buy the required eight car washes and buy them sooner" than those with a blank 8-stamp card. The widely reported completion figures are 34% against 19%. The abstract gives the direction; the exact numbers were not checked in the full text.
- The limit both papers imply: the head start has to be real or framed honestly. A fake bonus on a paid product is a trust risk and, in the UK, a DMCC Act copy risk. See uk-dmcc-act-urgency-reviews-price-copy.md.

## The rules
1. **Show the proportion left, not a raw count.** "Grade 2: 13 of 15 questions passed" with a bar. Effort rises as the remaining share shrinks.
2. **Endow honestly.** Count real prior work toward the next goal:
   - Grade 1 results carry over (questions passed in the free preview count as done when the member subscribes);
   - spaced-review questions answered correctly fill part of the next grade's bar;
   - the ladder is drawn as "Grade 1 ✓ (done), Grade 2 …", so the member starts the paid ladder already 1 step in.

   Never a fake "bonus" step.
3. **Make the near goal small.** Inside a grade, show a section bar ("5 questions to the next checkpoint"). Proportion matters, so a short visible goal beats one 20-question bar.
4. **Re-engage at the steep part of the gradient.** The one "you are close" email goes when a member is 80% or more through a grade and has been away 5+ days. Opt-in only, at most one a week. This uses the paper's finding that members near a goal re-engage fastest.
5. **After a pass, show the next grade with progress already in it** (carry-forward items already passed). That avoids the post-reward slump the paper links to slower re-engagement.

## What to measure (meaningful at about 20+ members)
- Grade completion rate and median days per grade, before and after the progress display. A before/after only: no A/B test at our size.
- Share of members who return within 7 days of an "80%+" nudge.
- Month-2 renewal for members who passed a grade in month 1, against those who did not.

## How we apply it to Cedwyn
- On /learn/, the ladder is a vertical list in the dark theme. Each grade has a thin bar and an "n of N" count, and the current grade is expanded. An ⓘ modal reads: "Your bar counts questions you have answered correctly, including warm-up reviews."
- The data is the per-member progress already planned (answers and passes), so no new store is needed. The bar is computed client-side from it.
- Grade 1 as the free preview, with its answers carried into the paid account, is the honest version of the "two stamps already filled". Work it into the grades build's free-preview reasoning.
- Copy uses no urgency or scarcity words and makes no price assertions. Questions keep their catalogue IDs and their "our case, prospective, not a finding" labels.
- Hand-off: a proposal for the ACADEMY GRADES BUILD lane, or the next one.

## Sources
- Kivetz, R., Urminsky, O. & Zheng, Y. (2006) The Goal-Gradient Hypothesis Resurrected: Purchase Acceleration, Illusionary Goal Progress, and Customer Retention, JMR 43(1): home.uchicago.edu (read, abstract + p.1)
- Nunes, J.C. & Drèze, X. (2006) The Endowed Progress Effect: How Artificial Advancement Increases Effort, JCR 32(4): jstor.org (abstract snippet; the 34%/19% figures are as widely reported, full text not read)