# PURE: a repeatable ease-of-use score for the buy path without users

**Use when:** you need a **number** you can track week to week for "how hard is it to buy" (or join), and there are too few readers to benchmark with surveys. PURE = Pragmatic (or Practical) Usability Rating by Experts.

## What the practitioner evidence shows
- MeasuringU / CHI 2016 case study (Rohrer, Sauro and colleagues): after **one hour of training**, four evaluators' scores correlated at **r = 0.5** with each other; more experienced teams reached **r = 0.6-0.9**.
- PURE scores correlated with real user metrics at **r = 0.5 with SEQ task ease, r = 0.5 with SUS and r = 0.6 with SUPR-Q**. That explains about 25-36% of the variation in what users perceive. They did **not** correlate with task time or completion rate.
- NN/g: PURE gives a single number stakeholders understand ("like golf: lower is better, green is good"). The **decided score is agreed by three expert reviewers after discussion**, not averaged, to capture their collective judgement.

## How to run one
1. **Pick the target user type** (one persona).
2. **Pick the fundamental tasks** that persona must be able to do (2-4 tasks).
3. **Write each task's happy path** as steps (one step = one screen or decision). Agree the path; where it is disputed, use data or note the judgement.
4. **Each evaluator scores every step independently** on a 3-point scale: **1 green** = easy, low effort; **2 yellow** = some effort or friction; **3 red** = hard, likely failure point.
5. **Reconcile.** Discuss and agree a decided score per step (NN/g), or use MeasuringU's alternatives: the mode, or the mean (for example 2, 2, 3 -> 2.33). Keep one method for every run so scores stay comparable.
6. **Sum.** Step scores add up to a task score, and task scores add up to a product score. A task's colour is its worst step: one red step makes the task red.
7. **Keep the notes.** For every yellow or red step, write why and what would fix it. Present annotated screens with the problems and what works.
8. **Re-score after changes** with the same tasks and steps. A falling total is progress. Fewer steps also lower the score, which is intended.

## Pitfalls
- Comparing totals across different task lists: the score isn't normalised, so compare only the same tasks with the same steps.
- A green 1 doesn't mean perfect; it means minor friction at most.
- Two evaluators can't produce a mode. Use three.

## How we apply it to Cedwyn
- **Persona:** a first-time reader on a phone who arrives on an article.
- **Tasks (frozen list, v1):** T1 buy one e-book from an article; T2 buy the bundle from /ebooks/; T3 join the /learn/ academy; T4 get the free sample/sign-up (if live). Write the steps once and keep them in a file beside the scores, with the date.
- **Raters:** three independent agent sessions score, then one reconcile pass using the **mean** (it's reproducible without a meeting), plus the colour by worst step. Given 2026 MeasuringU evidence that AI reviewers flag false alarms, a human or a live check confirms every red step on the page at 390 px before it counts.
- **Cadence:** score before and after each buy-path change. Record the totals in the growth notes so the weekly report can show "PURE T1 9 -> 7".
- **Tool:** `tools/pure_score.py` (stdlib, written 31 Oct 2026) takes a CSV of `task,step,rater,score` and prints per-step mean/mode, task totals, task colour (worst step) and the product total.
- **Boundaries:** findings about copy, journey or channel go in as proposals on the after-framing queue; prices are fixed and aren't a PURE lever.

## Sources (read 31 Oct 2026)
- MeasuringU, Practical Usability Rating by Experts (PURE): measuringu.com
- Rohrer et al., PURE: A Pragmatic Usability Rating by Experts, CHI 2016 case study: measuringu.com
- MeasuringU, Practical Tips for Running a PURE Evaluation (mode vs mean): measuringu.com
- NN/g, Quantifying and Comparing Ease of Use Without Breaking the Bank (PURE method): nngroup.com
- MeasuringU, Using AI To Find Usability Problems (2026): measuringu.com