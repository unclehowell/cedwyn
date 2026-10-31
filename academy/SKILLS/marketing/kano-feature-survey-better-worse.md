# Kano survey: sort proposed features into must-haves, performance, delighters and "nobody cares"

**Use it when:** you have a list of 8-20 possible additions (to an e-book, a membership, a shop page) and need to know which ones people would miss, which ones would delight, and which would change nothing, before spending build time.

## The method (Noriaki Kano, 1984; practitioner versions below)
1. **Write each feature as a concrete, testable sentence.** "Each e-book comes with a printable map of the places in it", not "better maps". One idea per item.
2. **Ask two questions per feature, same five answers each:**
   - Functional: "If [feature] were included, how would you feel?"
   - Dysfunctional: "If [feature] were NOT included, how would you feel?"
   - Answers: I like it / I expect it / I am neutral / I can tolerate it / I dislike it. (Folding Burritos lists clearer alternatives some teams use, e.g. "This would be very helpful to me / This is a basic requirement for me / This would not affect me / minor inconvenience / major problem".)
   - Optional third question: "How important is [feature] to you?" on a 1-9 scale (Folding Burritos), to separate big features from small ones.
3. **Classify each answer pair with the evaluation table** (functional row x dysfunctional column):
   - Like + Dislike = **Performance** (more is better, less is worse)
   - Like + Expect/Neutral/Tolerate = **Attractive** (delighter: not missed if absent)
   - Expect/Neutral/Tolerate + Dislike = **Must-be** (missed badly, never praised)
   - middle answers on both = **Indifferent**
   - Like + Like or Dislike + Dislike = **Questionable** (misread; drop)
   - functional worse than dysfunctional = **Reverse** (they would rather not have it)
4. **Score two ways.**
   - *Discrete:* the most frequent category per feature (fast, but hides splits).
   - *Better/Worse coefficients (Timko):* total = A+O+M+I; Better = (A+O)/total; Worse = -(O+M)/total. Plot Better (0..1) against |Worse| (0..1). High Worse = build first (must-be); high Better + low Worse = delighter; both low = skip. (kanosurveys.com shows the same arithmetic.)
   - *Continuous (DuMouchel weights, as shown by Folding Burritos and kanosurveys.com):* functional answers scored Like 4, Expect 2, Neutral 0, Tolerate -1, Dislike -2; dysfunctional answers mirrored (Like -2, Expect -1, Neutral 0, Tolerate 2, Dislike 4). Average each side per feature and plot dysfunctional (x) vs functional (y); quadrant = category, distance from origin = strength. Keeps the nuance a single label hides.
5. **Sample:** MeasuringU runs Kano studies with 50-300 participants, a margin of error of about 5-9%. With fewer than ~30 replies, read the result as direction only and report the counts, not percentages alone.
6. **Repeat yearly.** Kano's own observation: delighters decay into must-haves as people get used to them.

## Practical rules from practitioners
- Test the questionnaire on 2-3 people first; the "I like it" before "I expect it" order confuses some respondents (Folding Burritos).
- Randomise feature order; keep to 15-20 features so the survey stays under ~5 minutes (SurveyMonkey guide recommends 15-20).
- Never ask about price inside a Kano survey; price is a separate question with its own methods.
- Reverse items are signal: some readers may actively dislike, say, gamified badges.

## How we apply it to Cedwyn (PROPOSAL; any survey to readers or members is a proposal for the owner's approval)
- **Candidate features (12-15):** printable place map per e-book; scans of the original source documents; audio narration; a Welsh-language edition; a short glossary of Welsh place-names; a timeline card; a monthly live Q&A for academy members; a walking-route file for visiting; reading-group questions; footnoted citations with catalogue IDs; a "what changed" note when an e-book is revised; a members-only discussion board.
- **Who:** existing buyers and academy members first (they know the product), newsletter readers second. Keep the two groups' results separate.
- **Output:** one Better/Worse chart plus a table of counts per category; must-bes go to the build queue first, delighters become launch-email hooks, indifferent items are dropped.
- **Helper:** `tools/survey_scores.py kano` (stdlib, in this folder's tools/) classifies answer pairs and prints discrete category, Better/Worse and the continuous averages per feature.
- Prices stay fixed; nothing here tests price.

## Sources
- Folding Burritos, "The Complete Guide to the Kano Model" (questionnaire, evaluation table, DuMouchel continuous analysis, Timko Better/Worse, importance question): foldingburritos.com
- Kano Surveys, "Kano analysis techniques made simple" (Better/Worse formula, -2..4 weights, worked example): kanosurveys.com
- MeasuringU, Kano Modeling service page (50-300 participants, 5-9% margin of error): measuringu.com
- SurveyMonkey, "Using Kano analysis for product feature prioritization" (15-20 features): surveymonkey.com