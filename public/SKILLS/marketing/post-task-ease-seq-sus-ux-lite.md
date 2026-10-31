# Post-task ease scores: SEQ after each task, SUS or UX-Lite after the session

Harvested 2026-10-31 by the skills harvest. Adds numbers to small-sample-usability-tests-buy-path-5-users.md (which finds problems) so the same sessions also give a score you can compare round to round. Not covered elsewhere in the index.

## What the practitioners found (with numbers)
- **SEQ (Single Ease Question)**, Jeff Sauro, MeasuringU: asked right after each task, "Overall, how difficult or easy was the task to complete?" 1 = very difficult, 7 = very easy, end points labelled. Across **400+ tasks and 10,000 users the average is about 5.5 (5.3-5.6)**, not the midpoint 4. It performed as well as or better than longer task-difficulty measures (SMEQ, magnitude estimation).
- SEQ correlates with task time and completion at about **r = .5**: related, not a substitute. Users who fail yet rate the task "very easy" happen about **14% of the time**, so always record success/fail beside the score.
- MeasuringU's practice: **when a rating is below 5, ask "why?"** straight away; that line is the diagnosis.
- **SUS (System Usability Scale)**, 10 items, 1-5 agree scale: average **68 = 50th percentile**; **75 = 73rd percentile**; **52 = 15th percentile** (MeasuringU, 10,000+ responses, hundreds of products). Bangor et al. adjectives: about **85+ "Excellent"**, **71 "Good"**, **51 "OK"** (MeasuringU suggests "Fair"). Acceptability: above about **70 acceptable**, **50-70 marginal**, under **50 unacceptable** (curved grade F below 51.6).
- **UMUX-Lite** (Lewis et al.), 2 items: "[This site]'s capabilities meet my requirements" and "[This site] is easy to use". Reliability alpha **.86** (SUS .91), correlation with SUS **r = .83**. SUS estimate: **SUS = 0.65 x ((item1 + item2 - 2) x 100/12) + 22.9** (7-point items); about 1% error against the real SUS in two data sets.
- **UX-Lite** (MeasuringU's 5-point version). Ease item alone also tracks SUS: Sauro 2018, r = **.95** across means for 148 products. In the worked examples (Amazon, Norton) the three ways of estimating SUS from it all landed **within 2 points** of the SUS collected at the same time. For a 5-point ease item: SUS estimate = -2.279 + 19.2 x ease.

## The routine
1. **Every task in a test** (5-user round, or an unmoderated test): record success yes/no, time, SEQ 1-7, and "why?" when SEQ < 5.
2. **Per task**: mean SEQ vs 5.5. A task averaging under 5 (or under 4.5 with only 5 people) is the one to fix first, together with its failure count. Report n beside every mean; 5 people give a wide range, so read it as a flag, not a measurement.
3. **End of session** (or end of a short survey): UX-Lite / UMUX-Lite, 2 items, converted to a SUS-equivalent. Use full SUS (10 items) only when you need to compare with a published SUS number.
4. **Round to round**: same tasks, same wording, same scale. Plot mean SEQ per task and the SUS-equivalent per round. A real fix shows as success up and SEQ up together.
5. Never ask these about a page people only looked at; scores come after a real attempt (looking-only questions belong in a preference or five-second test).

## Pitfalls
- Changing the scale (5 vs 7 points) between rounds: the benchmarks differ.
- Reporting "top box %" from 5 people. Use the mean and the raw scores.
- Reading a high score with a failed task as success (the 14% case).
- Long questionnaires after a short test: 2 items get answered; 10 get skipped on a phone.

## How we apply it to Cedwyn
- **Buy-path tasks** (for the next 5-user round in the small-sample skill): T1 "Find an e-book about the farm's history and get to the point of paying", T2 "Find the free sample and open it on your phone", T3 "From an evidence page, find which e-book covers it", T4 "Join the reading list". Record success, time, SEQ, and "why?" under 5. Targets: every task SEQ at or above 5.5 and at least 4 of 5 succeed.
- **After a purchase or download**: a two-question UX-Lite on the thank-you page or in the delivery email would give a running score with no extra traffic. Changing an email journey or a public page is a **PROPOSAL** for the queue; nothing is added live from this file.
- **Academy members**: the same two items once a month inside the member area gives a SUS-equivalent to watch as lessons are added (also a proposal).
- Helper: `python3 tools/ux_scores.py seq 6 5 3 7 4` (mean, vs 5.5, how many under 5), `python3 tools/ux_scores.py sus 4 2 5 1 4 2 5 1 4 2` (one respondent's 10 SUS answers -> score, percentile anchors, adjective), `python3 tools/ux_scores.py uxlite 6 5` (7-point UMUX-Lite: capabilities item first, ease item second -> SUS estimates; add `--points 5` for UX-Lite; checked against MeasuringU's Amazon example: 86.6 UMUX-Lite, 82.8 from ease).

## Sources
- measuringu.com (Sauro: SEQ wording, average ~5.5 over 400+ tasks / 10,000 users, r ~ .5, 14% easy-but-failed, ask why under 5)
- measuringu.com (average moved from ~5 to ~5.5 with more data)
- measuringu.com (68 = 50th pct, 75 = 73rd, 52 = 15th; Bangor adjectives; acceptability bands)
- measuringu.com (UMUX-Lite items, alpha .86, r = .83 with SUS, regression formula)
- measuringu.com (ease-only estimates within 2 points; r = .95 over 148 products; formulas)