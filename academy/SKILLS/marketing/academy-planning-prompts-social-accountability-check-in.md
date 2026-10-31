# Academy planning prompts and a "check-in buddy": when they help, when they fade

Date: 30 Oct 2026 · Status: PROPOSAL only (nothing built; 0 Academy members per the member-sync log)
Topic: completion of a self-paced paid course (Cedwyn Academy: 7 graded quizzes, 90% pass mark, Grade 1 free, £49.99/month)

## What the evidence states (numbers with sources)

1. **Planning prompts work at small scale.** Yeomans & Reich (LAK 2017, HarvardX/MITx MOOCs): asking learners at sign-up to write a concrete plan for how and when they will do the course "increased course completion by 29%, and payment for certificates by 40%". Read in the abstract only (ACM/MIT pages), not the full paper.
2. **At big scale the effect mostly fades.** Kizilcec et al., PNAS 2020 (open access, full text read): about 250,000 learners, 247 Harvard/MIT/Stanford courses, 2.5 years.
   - The authors expected medium-to-large effects; "this is not supported by our results". Scaling "can reduce their average effectiveness by an order-of-magnitude".
   - Plan-making prompts raised activity in week 1 (long plans, year 2: about +0.11 on the activity measure, P<0.001), but the effect had mostly gone by the end of the course, with no rise in completion.
   - **The one sustained effect came from "social accountability"**: a prompt to plan asking named people to check in regularly on progress. Its effect on week-2 activity held (β=0.094, P<0.001) where the plain plans faded. It still did not raise completion overall.
   - "Value-relevance" writing (why the course matters to you) raised completion only where a global achievement gap existed.
3. **Takeaway:** a planning prompt is cheap and gives a real first-fortnight lift. For a monthly subscription the first fortnight matters most: the first renewal comes at day 30. Don't expect it to rescue completion by itself.

## How to do it (generic)

- **One screen after payment, before Grade 2 opens.** Three short fields, all optional:
  1. "Which day and time will you do your next grade?" (day picker plus time; offer an add-to-calendar .ics, see online-talk-add-to-calendar-ics-show-up-rate.md);
  2. "What might stop you, and what will you do if it does?" (the if-then of MCII);
  3. "Who will you tell you're doing this?" (social accountability; a name only, never stored as contact data).
- **Use the answer once.** Send a single reminder at the time they chose ("You planned Grade 2 for Tuesday 8pm"). No streams of nudges.
- **Short beats long.** In the PNAS data, short and long plans behaved similarly in year 1. Keep it to under a minute.
- **Measure only what we can see:** the share of new members who open their next grade within 14 days, plus first-renewal rate. Compare against members who skipped the screen (honest, not randomised; label it that way).

## How we apply it to Cedwyn (proposal)

- Add the three-field "Plan your next grade" card to /learn/grades/ at the moment a free Grade 1 taster passes and the member upgrades, and again when each grade is passed ("When will you try Grade N+1?").
- Field 3 wording for the case material: "Who else is following the Great House Farm story? Tell them you've started." A share button can reuse the spoiler-free result share (academy-spoiler-free-result-share-daily-question.md). Nothing is sent by us to the named person.
- Store the chosen day and time in the member row (the existing D1/Worker member store). The reminder rides the existing member email route only once a member has opted in. Outreach is on hold, so no new email journey goes live without the project lead's GO.
- Don't promise completion gains on public pages. The 29% figure is from one study and did not hold at scale.
- Review after the first 20 members: if 14-day next-grade starts are under 50%, try the social-accountability field on its own as the default.

## Sources

- Yeomans, M. & Reich, J. (2017), "Planning prompts increase and forecast course completion in massive open online courses", LAK '17. dl.acm.org · tsl.mit.edu (abstract only)
- Kizilcec, R.F. et al. (2020), "Scaling up behavioral science interventions in online education", PNAS 117(26). pnas.org · full text via Europe PMC PMC7334459