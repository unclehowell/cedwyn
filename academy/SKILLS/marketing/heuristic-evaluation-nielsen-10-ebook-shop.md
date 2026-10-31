# Heuristic evaluation (Nielsen's 10) for a low-traffic e-book shop

**Use when:** real readers are too few to test with (about 45 outside visits a day to /ebooks/) and you still need to find what stops a buyer. An expert inspection needs no users, so it can run today.

## What the practitioner evidence shows
- Jakob Nielsen, averaged over six of his projects: **one evaluator found only 35% of the usability problems**; NN/g and others cite **about 75% with five evaluators**, with diminishing returns after that. NN/g's guidance: **3 to 5 people evaluate independently**, then consolidate.
- Expert reviews and usability tests overlap only partly: MeasuringU puts it at **around 30% of the problems a usability test finds**. A heuristic pass is a cheap first sweep, not a replacement for watching a real reader.
- AI as evaluator (MeasuringU, 2026, ChatGPT and Gemini reviewing task videos): the models found about **40-47% of the problems the human researcher found**, with **35-60% false alarms** and some outright invented problems in one case study. Average agreement between two human raters is about 50% (any-2 agreement), so AI is in the human range on overlap but noisier.

## How to run one (NN/g steps)
1. **Prepare.** Choose the scope: one flow, for example /ebooks/ -> book page -> checkout -> download e-mail. Write the target user and two or three tasks. Everyone reads the 10 heuristics first.
2. **Evaluate independently** (1-2 hours each). Each evaluator walks the flow at least twice: once to get the feel, once to note problems. For each problem, record the screen, the heuristic it breaks, a short description and a screenshot. **Evaluators don't talk to each other until they're done.**
3. **Consolidate.** Merge everyone's lists, remove duplicates, and keep a count of how many evaluators found each problem.
4. **Rate severity** (Nielsen, 0-4). 0 = not a problem, 1 = cosmetic, 2 = minor, 3 = major, 4 = catastrophe (fix before release). Base the rating on frequency, impact and persistence. Collect ratings **after** consolidation, from each evaluator separately, and take the mean.
5. **Report** in severity order. Give each item a fix and the heuristic it breaks, and list what works well too.

## The 10 heuristics, as one-line checks for a shop page
1. Visibility of system status: after "Buy", is it clear what is happening (redirect, payment, e-mail)?
2. Match with the real world: is it "e-book", "PDF/EPUB", "£4.99" rather than internal names?
3. User control and freedom: can the reader go back from checkout without losing their place?
4. Consistency and standards: does the price, title and cover match on every page and on the checkout?
5. Error prevention: is the format/bundle choice clear before payment?
6. Recognition rather than recall: are the format, price and delivery visible at the button, not one page back?
7. Flexibility and efficiency: is there a direct buy link from articles and from the bundle?
8. Aesthetic and minimalist design: does anything compete with the buy button at 390 px?
9. Help users recognise and recover from errors: what does a failed payment or a missing download e-mail look like?
10. Help and documentation: is there one line on how delivery works and who to contact?

## Pitfalls
- One evaluator is not a heuristic evaluation: run at least 3 and keep them independent.
- A heuristic violation isn't always a real problem for users; severity 1-2 items wait.
- Don't let evaluators fix things during the pass. The goal is the list.

## How we apply it to Cedwyn
- **Evaluators:** 3-5 agents, each in a separate session with no shared notes (for example the hive seats). Brief each with the same scope, persona (a Welsh-history reader on a phone) and the 10 checks above. Then consolidate in one file.
- **Scope order:** (1) /ebooks/ buy path at 390 px, light and dark mode; (2) the bundle; (3) the /learn/ academy join path. Keep to one flow per pass.
- **Treat AI findings as hypotheses.** Given the 35-60% false-alarm rate, a human or a live check confirms each severity 3-4 item on the real page before anyone files it. Items found by two or more evaluators come first.
- **Output:** a severity-ordered list with a screenshot for each item. Copy, price, journey and channel changes go in as proposals on the after-framing queue. Markup-only fixes follow the repo freeze rules (labelled PR or section branch).
- **Pair it with** the 5-user think-aloud skill once there are readers to recruit; the heuristic pass clears the obvious problems first, so test sessions find deeper ones.

## Sources (read 31 Oct 2026)
- NN/g, How to Conduct a Heuristic Evaluation: nngroup.com
- Nielsen, The Theory Behind Heuristic Evaluations (35% single evaluator): nngroup.com
- NN/g, Severity Ratings for Usability Problems: nngroup.com
- IxDF, Heuristic Evaluation (2026 update, 5 evaluators ~75%): ixdf.org
- MeasuringU, Using AI To Find Usability Problems: Examining Task Failure (2026): measuringu.com
- MeasuringU, PURE (expert review vs test overlap ~30%): measuringu.com