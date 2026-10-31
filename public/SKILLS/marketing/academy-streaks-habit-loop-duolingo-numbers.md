# Streaks and habit loops for the Academy (Duolingo's published numbers)
Harvested 30 Oct 2026. 'streak' and 'gamif' had 0 skill hits before (one passing mention of gamified pop-ups). Goal: retention of £49.99/month members between grade passes.

## Practitioner numbers (Duolingo's own blog, read 30 Oct 2026)
- Learners who reach a **7-day streak are 2.4× more likely to come back the next day** than learners with no streak ("Improving the streak"), and **3.6× more likely to complete their course** ("How the streak builds habit").
- **Separate the streak from the daily goal.** Learners with the highest ("intense") daily goal were the *least* likely to be on a streak: almost 40% of learners active two days running but with no streak had that goal. In an A/B test, decoupling the goal from the streak gave: **+3.3% Day-14 retention, +1% daily active learners, +10.5% share of daily learners on a streak within 20 days, and +19% for new learners**. All figures are relative. A year later, **learners on a 7+ day streak were up more than 40%**.
- **Celebrate early milestones.** Going from day 2 to day 3 is a 50% increase in streak length; 200 to 201 is 0.5%. New streak animations raised the chance a brand-new learner was still active on day 7 by **+1.7%**.
- **Build in slack.** Letting learners equip up to **2 Streak Freezes** raised daily active learners by **+0.38%**. They cite a UPenn/UCLA study finding that some slack motivates more than rigid rules.
- Leaderboards were first tested in 2018 (Duolingo Leagues post). We have no figures we can reuse at our size, and a league with a handful of members is empty.

## How to do it at small scale
1. **Make the minimum tiny.** Answering one question counts as a "study day". Don't require a whole grade quiz.
2. **Keep the streak separate from the grade goal.** A member aiming at Grade 4 still keeps the streak by answering one question.
3. **Weekly beats daily for a £49.99/month research course.** Members are adults reading primary sources. A **weekly streak** (any study day in a Mon–Sun week) is truer to how they work and is the same mechanism. Show "weeks in a row".
4. **Give one freeze per month automatically**, plus one when a grade is passed.
5. **Make the first milestones visible:** day or week 1, 3 and 7. A plain dark-theme toast with the count and the next grade's progress. No confetti spam.
6. **Reminder email only when a streak is at risk:** one Mailchimp or transactional email on the last day of the week if no study day yet, linking straight to one question. Members only, and opt-out respected.
7. **Measure:** the share of members with a 3+ week streak, churn by streak bucket (0 / 1–2 / 3+), and Day-14 and Day-30 activity. Those mirror Duolingo's measures.

## How we apply it to Cedwyn
- A PROPOSAL for the Academy grades build: a `study_days` table (member, date) in D1 and a derived weekly streak. That is about 1 KB per member per year.
- **Question of the day / week** on /learn/: one random question from the member's current grade pool (or a revision item from an earlier grade). It keeps the streak alive and reuses the existing questions.
- Pair this with academy-member-onboarding-first-week-activation.md: the first study day should come in week 1.
- No leaderboards until there are 30+ active members. Below that a league is empty and discouraging.
- Public text stays neutral. Streak copy states "weeks of study", never "don't lose your streak!" guilt wording. That is also safer under the UK subscription and consumer rules we already follow.

## Sources
- blog.duolingo.com (read)
- blog.duolingo.com (read)
- blog.duolingo.com (read; leagues tested in 2018, no figure we can reuse)