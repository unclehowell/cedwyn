# Academy discussion: seeded prompts per grade, posted by us (not just replies)

Date: 2026-10-30 · Status: PROPOSAL (nothing built) · Topic: community building / course retention for the paid /learn/ academy (£49.99/month, 7 grades, 90% gate)

## What the evidence states (primary sources, with numbers where they exist)
1. **Posting beats replying, and the gap widens with class size.** Du et al., HICSS 2022 ("Posting versus Replying: The Effects of Instructor Participation in MOOC Discussion Forums", doi 10.24251/hicss.2022.006): instructors mostly *reply*, but instructor *posting* (starting a thread) raises student participation more than replying; class size weakens the effect of replying but not of posting. (From the abstract; effect sizes not read in full text.)
2. **Reading the forum is the strongest predictor, not writing in it.** Chiu & Hew, AJET 2017 (doi 10.14742/ajet.3240), a humanities/art MOOC, two samples, stepwise regression: peer learning and quiz scores were predicted mainly by *viewing* forum messages, less by commenting, and voting least. Implication: most members will lurk; the thread must be worth reading.
3. **Forum engagement raises the odds of finishing.** Bonafini et al., Online Learning 2017 (doi 10.24059/olj.v21i4.1270): binomial logistic regression, forum posts and videos watched both increase probability of course achievement; most posts were information-seeking, not critical thinking, so the authors recommend prompts about deep meaning or applying concepts.
4. **Weaker learners gain from reading peers and from quick feedback.** Wei et al., PLOS ONE 2023 (n = 335, doi 10.1371/journal.pone.0293668): low scorers who made significant progress interacted *less*, learned from peer-made material, and wanted quick feedback on their own posts.

Caveat: all four are MOOC studies (thousands of free learners). A paid academy with a handful of members is a different setting; the direction (seed threads, make them readable, answer fast) is our inference for Cedwyn.

## How to do it (playbook)
1. One thread per grade, opened by us, not empty: a 3-line seed post with one *application* question ("Which record would you request first to settle X, and why?") rather than a recall question the quiz already asks.
2. Post a new seed on a fixed day each week (one per active grade). Posting is the lever; replies are the follow-up.
3. Make threads readable for lurkers: pin a "best of the thread" summary each month with catalogue IDs; that serves the 80-90% who only read.
4. Reply within 24 h to every first post by a member (quick feedback matters most to struggling learners).
5. Spoiler rule: discussion sits *after* the reveal of a grade, or answers are hidden behind a spoiler fold, so the 90% gate stays honest.
6. Measure: members who view a thread vs pass rate at next attempt; 30-day retention of members who viewed or posted vs those who did neither (small numbers: report counts, not percentages, under 30 members).

## Free tooling options (no install on the box)
- **Own D1 table** (cheapest, keeps the dark theme and the member gate): `thread(id, grade, seed_md, created)`, `post(id, thread_id, member_id, body, created, hidden)`; served by the existing cedwyn-api Worker behind the membership check.
- **giscus** (free, open source, MIT; giscus.app) embeds GitHub Discussions as comments with no tracking or ads. Downsides for Cedwyn: members need a GitHub login, the content is public on GitHub (breaks the paywall and the no-outbound-links rule), not real time. Only for a public, free Grade 1 thread, if at all.
- Nothing installed.

## How we apply it to Cedwyn
- Add a "Reading room" panel under each grade's results screen (dark theme, ⓘ modal explaining the spoiler rule, page journal entry when a seed is posted).
- Seed prompts drawn from the evidence catalogue with IDs, in neutral third person; case points labelled "our case, prospective, not a finding"; banned public words avoided; never name family members; moderation queue (hidden=1 until reviewed) because public-facing text has strict editorial rules.
- Weekly seed: a scheduled worker can draft the next seed per active grade from the catalogue; a human-style check against the editorial rules before it shows.
- Grade 1 (free taster) gets one public read-only "best of" thread as a conversion surface: visitors see the quality of discussion, posting needs membership.
- Not yet: no live member community exists yet (the 10-minute member sync log reads 0 joins as of 22:55Z on 30 Oct), so build the D1 tables only after the first members join; until then, a single seeded thread is enough.

## Sources
- doi.org (Du et al. 2022, abstract via OpenAlex)
- doi.org (Chiu & Hew 2017, abstract)
- doi.org (Bonafini et al. 2017, abstract)
- doi.org (Wei et al. 2023, abstract)
- giscus.app