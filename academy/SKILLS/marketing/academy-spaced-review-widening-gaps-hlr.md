# Academy spaced review: bring old questions back at widening gaps

Date: 2026-10-30. Status: PROPOSAL for the /learn/ grade ladder (£49.99/month). Nothing is built or changed by this note.
Pairs with: academy-graded-quiz-attempt-then-reveal-mastery-gate.md (answer, then reveal, 90% gate) and academy-streaks-habit-loop-duolingo-numbers.md (return habit). This note covers *when* a passed question comes back.

## Evidence (primary sources, read or abstract-checked)
- **Duolingo, half-life regression (Settles & Meeder, ACL 2016, read).** Duolingo models each item's "half-life" in a learner's memory and schedules practice before it decays. Their abstract: HLR cut prediction error "by 45%+" against baselines, and "was able to improve Duolingo daily student engagement by 12% in an operational user study". A spaced-review schedule made people come back more often, which is a retention metric for a paid membership as well as a learning one.
- **Lag effect (in the same paper).** Learning is better again when the gap between reviews grows: seconds, then minutes, hours, days, months.
- **Cepeda et al. 2008, Psychological Science (1,000+ learners, abstract via PubMed/ERIC).** The best gap between study sessions depends on how long you want people to remember it. As a share of the test delay, it fell "from about 20 to 40% of a 1-week test delay to about 5 to 10% of a 1-year test delay". ERIC's summary puts it at about 20% for delays of a few weeks and about 5% for one year.
- Code: Duolingo published the HLR model and data (github.com). We do not need a model at our size; the fixed schedule below is the hand-picked version the paper describes as the standard approach.

## The rule
1. Every question a member got right is put into a review queue with a due date. A wrong answer (even after Reveal) comes back sooner.
2. Fixed widening ladder (Leitner-style boxes): 1 day -> 3 days -> 7 days -> 16 days -> 35 days -> retired. Right on a review moves the question up one box. Wrong moves it back to box 1.
3. Reviews are short: 3-5 due questions at most per visit, shown before new material ("Warm-up: 4 questions from earlier grades").
4. Reviews never block a grade. They feed the 2-3 carry-forward items already proposed for each grade quiz, so the 90% gate still tests retention, not cramming.
5. The goal is a lasting grasp of the case over months. Cepeda's numbers say that for recall a year out, the later gaps should be weeks, not days. That is why the ladder runs out to about 5 weeks.

## What to measure (needs about 20+ members before it means anything)
- Share of members who open a review in a given week, against those who do not (retention proxy, the Duolingo metric).
- Accuracy on review items by box. Box 3+ accuracy under 70% means the gaps are too long for this material, so shorten them.
- Month-2 renewal for members with 3+ review visits in month 1, against those with none. This is correlation only; no holdout at our size.

## How we apply it to Cedwyn
- Data: one table, review_queue(member_id, question_id, box, due_at, last_result). It fits the per-member progress store the grades build is choosing (D1 cedwyn-apps or the member store). Rows are tiny, about 30 bytes each.
- The front end shows "Warm-up (4 due)" on /learn/ above the current grade, same dark theme, with an ⓘ modal that reads: "Questions you have passed come back after 1, 3, 7, 16 and 35 days. Remembering them later is what makes them stick."
- The questions stay exactly as in the grade bank (verbatim quotes, catalogue IDs, "our case, prospective, not a finding" labels). Final-grade open research prompts are excluded, because they have no fixed answer to review.
- Email: at most one "3 questions are due" nudge a week, only to members who opted in. It fits the existing onboarding note (academy-member-onboarding-first-week-activation.md) and never counts as a marketing email.
- Hand-off: a proposal for the ACADEMY GRADES BUILD lane, or the next one. It changes no prices and sends nothing.

## Sources
- Settles, B. & Meeder, B. (2016) A Trainable Spaced Repetition Model for Language Learning, ACL: research.duolingo.com (read, p.1-2)
- Duolingo HLR code and data: github.com (snippet)
- Cepeda, N.J. et al. (2008) Spacing effects in learning: a temporal ridgeline of optimal retention, Psychological Science: pubmed.ncbi.nlm.nih.gov and eric.ed.gov (abstract snippets; full text not read)