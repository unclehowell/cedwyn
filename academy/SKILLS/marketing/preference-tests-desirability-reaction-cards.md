# Preference tests and desirability (reaction-card) studies: which look reads as trustworthy

Harvested 2026-10-31 by the skills harvest. Complements small-sample-usability-tests-buy-path-5-users.md (five-second test, think-aloud) and post-task-ease-seq-sus-ux-lite.md (scores after real use). This file is about **judging the look and feel of options before anyone uses them**, and reading the result honestly.

## What the practitioners found (with numbers)
- **Preference is not performance.** Jakob Nielsen (NN/g, 298 designs with both objective and satisfaction metrics, out of 1,733 tested): satisfaction and performance correlate at **r = .53**; users preferred the better-performing design about **70% of the time**, not 100%. He calls it "completely invalid" to show screens and ask how well people would like *using* them. So a preference test can judge look, trust and message, never ease of use.
- **Test it against chance, not against the runner-up.** Jeff Sauro (MeasuringU, 2015): 100 people, 4 designs, Design C picked by 39. Chance is 1/4 = 25%. Binomial test p = .0024; 95% CI 30-49%, lower bound above 25%, so C wins. Design B at 31% had a CI of 23-41%, which dips under 25%, so B cannot be told apart from random picking. Use the binomial test with a confidence interval (a chi-square goodness-of-fit only tells you the spread is not random, not which design wins).
- **Sample size**: vendor guides suggest 100-200 for a quantitative preference test (Lyssna) or 5-8 qualitative / 100 quantitative (UserTesting help centre). Vendor numbers, not checked against independent research. With 20-30 people only a landslide (about 70%+ of 2 options) clears chance.
- **Desirability / Microsoft Reaction Cards** (Benedek & Miner, Microsoft, UPA 2002; NN/g write-up): 118 product-reaction words; at the end of a session people pick the **5** that best describe the design. The controlled vocabulary makes answers countable. Original set was at least **40% negative** words.
- NN/g adaptation for online surveys and visual appeal: cut the list to **about 25 words or fewer**, drop words about function or speed ("slow", "controllable"), **randomise word order** (lazy respondents pick the first five), keep negative, neutral and positive words, a screenshot is enough. Report **% of participants who picked each word**, rank them, and compare groups or versions (their example: 83% called a redesign "professional" vs 20% for the old one). Decide the brand words in advance and count how many people chose at least one of them.

## How to run a preference test (step by step)
1. One question per test: "Which of these looks most trustworthy for a local-history record?" (or "...most clearly shows what you get"). Never "which do you like?"
2. 2-6 options, equal polish, same size, real copy and images, **only 1-2 elements different** so the reason is knowable.
3. Randomise option order per person. Ask "why?" after the choice (one free-text line).
4. Score: winner's count vs chance (1/k) with the binomial test and 95% CI. Win only if the CI lower bound is above 1/k. Otherwise report "no clear preference" and keep the cheaper option.
5. Follow with behaviour: an A/B test where traffic allows, or a 5-user task test of the chosen option.

## How to run a desirability (reaction-card) study
1. Pick 5 brand words before you start (example for a heritage archive: trustworthy, calm, scholarly, clear, local).
2. Build a list of 20-25 words: those 5, about 8 other positives, and at least 40% negatives or neutrals (biased, cheap, busy, confusing, old-fashioned, intimidating, amateur, angry, dull, ordinary).
3. Show one screenshot per person (or one per block, order randomised), and ask: "Pick the 5 words that best describe this page."
4. Tally: % picking each word, top 5 words, and % who picked at least one brand word. Compare two versions or two reader groups side by side.
5. Read the negatives first: one negative word chosen by 30%+ is the finding.

## Pitfalls
- Asking people who know the project (friends, agents, the team): they pick what they think you want.
- Testing unequal mock-ups: the polished one wins on polish.
- Treating a 55/45 split from 40 people as a result. Run the binomial test.
- Using a preference result to claim something is easier to use.

## How we apply it to Cedwyn
- **Trust read of the research pages** (most useful): the case and evidence pages need to read as calm and documentary, not as a campaign. Run a reaction-card study on two screenshots (an evidence page and the /ebooks/ shelf) with the 22-word list above; brand words: trustworthy, calm, scholarly, clear, local. Target: 50%+ pick at least one brand word, and no negative word (biased, angry, confusing) above 30%. Recruiting readers is a public-channel step, so this is a **PROPOSAL** for the queue, not something to launch.
- **Social card styles**: before changing the weekly quote-card look, show 2 styles (only the type treatment different) and ask "which looks most like a real record?"; score with the helper. Covers are out of scope (cover A/B already covered elsewhere); prices are fixed and never tested.
- **Run it on our own screenshots now, without people**: list which of the 22 words a stranger could fairly pick from the page today and fix anything that would earn "busy" or "biased" (copy and layout changes go to the queue as proposals).
- Helper: `python3 tools/ux_scores.py pref A=31 B=9` (binomial vs chance + Wilson 95% CI per option) and `python3 tools/ux_scores.py cards picks.csv --brand trustworthy,calm,scholarly,clear,local` (CSV: participant,word).

## Sources
- nngroup.com (Nielsen 2012: 298 designs, r = .53, 70%)
- measuringu.com (Sauro 2015: binomial test with CI, 39/100 worked example)
- nngroup.com (118 words, pick 5, 40% negative, 25 words online, randomise, report %)
- nngroup.com (the full 118-word list)
- lyssna.com (vendor: 2-6 options, randomise, 100-200 participants; number not checked)
- help.usertesting.com (vendor: 5-8 qualitative, 100 quantitative; not checked)