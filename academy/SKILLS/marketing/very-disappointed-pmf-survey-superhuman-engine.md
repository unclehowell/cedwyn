# The "very disappointed" survey (Sean Ellis 40% test + Superhuman's PMF engine)

**What it is:** one question to people who have actually used the thing: "How would you feel if you could no longer use X?" (Very disappointed / Somewhat disappointed / Not disappointed). The share answering *very disappointed* is the score. Sean Ellis benchmarked it across nearly 100 startups: those that struggled to grow almost always scored under 40%; those with strong traction almost always scored over 40%.

## Practitioner evidence (with numbers)
- **Superhuman (Rahul Vohra, First Round Review):** first score in summer 2017 was **22%**. Segmenting to the personas inside the very-disappointed group lifted it to **33%** with no product change. After three quarters of roadmap work driven by the survey it reached **58%**.
- **Who to ask:** people who have experienced the core of the product. Ellis's rule, which Superhuman followed: used it at least twice in the last two weeks. Superhuman had 100-200 such users. Vohra states results become "directionally correct" at **around 40 respondents**.
- **Survey each person once.** Superhuman never re-surveyed anyone, so repeat answers could not skew the benchmark. It tracked the score weekly, monthly and quarterly as its most visible number.
- **The four questions:** (1) the disappointment question; (2) "What type of people do you think would most benefit from X?"; (3) "What is the main benefit you receive from X?"; (4) "How can we improve X for you?"
- **How to read the answers (Superhuman):**
  - Ignore *not disappointed* answers. Their requests lead you astray.
  - Split *somewhat disappointed* by Q3. If someone in that group values a different benefit from your fans, politely disregard them. If they value the **same** main benefit as your fans, something small is holding them back. Their Q4 answers are your fix list.
- **Roadmap rule:** spend **half** the roadmap doubling down on what the very-disappointed group loves (Q3) and **half** fixing what holds back same-benefit somewhat-disappointed users (Q4). Stack-rank each half with a simple low/medium/high cost vs impact grid. "If you only double down on what users love, your score won't increase. If you only fix what holds users back, competitors overtake you."
- **Statistical honesty:** at n=40, a 40% score (16 of 40) has a 95% interval of roughly **26-55%**. Treat a small-sample score as a direction, not a pass or fail. `tools/pmf_score.py` prints the Wilson interval.

## How to run it (small audience)
1. **Define the eligible reader:** someone who has had the core experience, for example opened 2 or more issues in the last 14 days, read a whole e-book, or used a web app twice. Never survey cold traffic.
2. **Send the 4 questions once per person.** Use a plain form and keep the answer order fixed. Record a segment field (how they found us, role or interest) for each response.
3. **Collect 30-40 or more answers before you read the score.** Below 30, read only the open text.
4. **Score it and segment it.** Find which segment has the most very-disappointed answers. That segment is the high-expectation customer. Write a one-paragraph profile of them in their own words from Q2 and Q3.
5. **Code the open text.** Tag Q3 benefits and Q4 asks. Build the half-and-half list from those tags.
6. **Re-survey new eligible people each quarter** and compare segment-for-segment, never the overall mix against an older mix.

## How we apply it to Cedwyn
- **Product = the free research reading experience plus the e-books.** Sales are near zero, so the eligible pool is engaged newsletter readers and repeat research/wiki visitors who signed up. Ask "How would you feel if you could no longer read the Cedwyn research and e-books?"
- **Expect n to be small.** Run it as a qualitative tool until about 40 answers are in. Q2 tells us *who* to market the e-books to, which is the real prize: local history readers, Welsh diaspora, genealogists, teachers or legal-history readers. Q3 gives the words to put in the buy blurb.
- **Half-and-half roadmap** maps onto the weekly growth priority. Half the work deepens the benefit the fans name. Half fixes the top Q4 ask from same-benefit readers.
- **PROPOSAL only:** adding the 4-question form to an email (a one-time send to engaged subscribers) or to the e-book thank-you page changes an email journey or public channel, so it needs the project lead's go. Prices stay fixed, and the survey must never ask about price.
- **Public-safe:** the form must not collect addresses. Report results only as counts and anonymised quotes.

## Tool
`tools/pmf_score.py` (stdlib only): reads a CSV with an `answer` column (very/somewhat/not) and an optional `segment` column. It prints the very-disappointed % with a Wilson 95% CI, a per-segment score (n shown), and a warning under n=30. Nothing installed.

## Sources
- review.firstround.com (Vohra: 22% -> 33% -> 58%, 4 questions, 40-respondent note, half/half roadmap, survey once; read 2026-10-31)
- businessofsoftware.org (Vohra talk; snippet, 22% figure)
- pmfsurvey.com (Sean Ellis + GoPractice survey; ~100 startups benchmark; snippet)
- fitsignal.com (16 of 40 = 40%, ~26-55% 95% interval; snippet, checked by our own Wilson calc: 26-55%)