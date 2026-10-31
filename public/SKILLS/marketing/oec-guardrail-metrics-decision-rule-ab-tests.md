# Skill: pick one OEC and set guardrails before any A/B test (2026)

Written 31 Oct 2026 (skills harvest). Topic: A/B testing / analytics. This file covers deciding what a test is judged on and what it must not damage, before it starts. It sits alongside `ab-testing-small-lists.md` (fixed stop size, no peeking), `sample-ratio-mismatch-srm-check-ab-tests.md` (did the split work), `twymans-law-too-good-ab-results-false-positive-risk.md` (is the win believable) and `email-holdout-incrementality-test-small-list-gate.md` (did the email cause the sale). Tool: `tools/decision_rule.py` (stdlib only, nothing installed).

## What the evidence shows
- **Bing, Kohavi et al., KDD 2012, "Trustworthy Online Controlled Experiments: Five Puzzling Outcomes Explained" (read in full).** A bug in one experiment showed users very poor search results. Bing's two top metrics both went up: distinct queries per user rose over 10% and revenue per user over 30%. The bad results made people search more and click more ads. Lesson: an OEC (Overall Evaluation Criterion) that "is easy to beat by doing something clearly wrong" is the first pitfall. Bing switched to sessions per user as the key metric, with revenue allowed to rise only "without negatively impacting engagement metrics".
- **Amazon email OEC (Kohavi, Tang and Xu, *Trustworthy Online Controlled Experiments*, as quoted by votito.com; the book itself was not opened).** Judging promo emails on revenue alone rewards spamming. The OEC they used was `(revenue - unsubscribes x lifetime value lost per unsubscribe) / users`, so an email that sells today but costs the list is scored as a loss.
- **Airbnb Engineering, "Designing Experimentation Guardrails", 2021 (read in full).** Three guardrails, each must pass or the test escalates to a discussion rather than being killed automatically:
  1. **Impact guardrail**: the change must not be worse than a preset margin (example: -0.5%), significant or not.
  2. **Power guardrail**: the test must have enough users that the impact check means something.
  3. **Stat-sig negative guardrail**: only for the top metric, where even a small significant drop matters.
  The system flags about 25 experiments a month. About 80% launch after discussion and 20% (about 5 a month) are stopped. Warning from the same post: 50 metrics each alerting at p<0.05 give at least one false alarm 92% of the time in an A/A test. So protect a **few** metrics.
- **Spotify Engineering / Schultzberg et al., arXiv 2402.11609, March 2024 (blog read).** One decision rule with four metric types:
  - success metrics, tested for superiority;
  - guardrail metrics, tested for non-inferiority within a margin;
  - deterioration metrics, tested for any significant drop;
  - quality checks such as SRM.
  Key result: **don't split alpha across guardrails**, because a guardrail only needs evidence of "not worse by more than m". **Do** correct power (beta) for the number of guardrails and quality tests, or the test will be underpowered for the ship decision.

## How to do it (any test, any size)
1. **Write the OEC first, as one number per unit of traffic.** It should move towards the long-term goal, which is paid readers, not clicks. If two things matter (for example, sales vs list damage), combine them like Amazon did. Never "reply rate + click rate" as two separate winners.
2. **Pick 1-3 guardrails, each with a margin.** For each one, ask: what could this change break that we would regret even if the OEC went up? Examples: free sign-ups, unsubscribe or complaint rate, buy-path errors, 390 px fit, load time. Write the margin as an absolute amount, for example "sign-ups may not fall by more than 2 points".
3. **Add breakers: counts where any amount stops the test.** For example: 1 spam complaint, 1 page error, 1 broken buy button. At our traffic these work better than statistics.
4. **Run the quality check first (SRM)**, then the guardrails, then the OEC. A test that fails SRM is invalid, whatever the OEC shows.
5. **Decide with one rule.** SHIP only if the quality check passes, no breaker fired, every guardrail is non-inferior and adequately powered, and the OEC beats control one-sided at the alpha set in advance. If a guardrail is harmed, ESCALATE (decide it in writing, don't auto-ship). If a guardrail is underpowered, keep running to the fixed stop size, then call it.
6. **Log the rule in the register before launch.** If the OEC is chosen after seeing the data, the test means nothing.

`python3 tools/decision_rule.py spec.json` returns INVALID / NO-SHIP / ESCALATE / UNDERPOWERED / SHIP with one line per check. `--example` prints a spec. Tested on this box on 31 Oct with 5 cases: SRM caught (1200 vs 1000 at a 50/50 split, p=0.00002), a breaker stops the test, a clear guardrail harm escalates even when underpowered, 40-per-arm is reported underpowered, and a flat OEC keeps A.

## How we apply it to Cedwyn
Live state (read 31 Oct from the project workspace and kpi.csv): 0 sales and 1 confirmed subscriber; /ebooks/ gets about 320-720 HTML hits a day including bots. The register has 5 rows, with these gaps:
- **No row names a guardrail or a decision rule.**
- **AB-01** (outreach subject lines) is judged on "reply rate + click rate", two metrics with no rule for when they disagree.
- **AB-03** (FB post format) is the same: "link clicks + shares".
- **The id AB-02 is used twice**, once for the outreach landing page and once for the /ebooks/ hero headline. Results will be filed against the wrong test.

Proposed (register edit only; no site or text change; nothing needs the project lead):
- Add three columns to `ab-register.csv`: `oec`, `guardrails (metric:margin)`, `breakers`. Rename the second AB-02 to AB-05.
- **/ebooks/ page tests (AB-02 hero, AB-04 last page):**
  - OEC: paid-intent clicks per unique human visitor (Stripe/Gumroad buy-button clicks).
  - Guardrail: free-read sign-ups per visitor, margin 2 points.
  - Breakers: any page error or horizontal scroll at 390 px; any buy button failing `buypath_watch.py`.
- **Outreach email tests (AB-01):** OEC = clicks to Cedwyn per send. Breakers: 1 spam complaint or 1 "remove me" reply stops the arm; also stop if a do-not-contact address gets through. Replies are logged as a guardrail, not as a second winner. Sending still needs the project lead's GO.
- **Social format tests (AB-03):** OEC = link clicks per 1,000 reach. Guardrail: hides/negative feedback, margin 0.5 points.
- **Honest scale note:** at about a 2% baseline, the power check on a 2-point guardrail margin alone needs about 840 visitors per arm (normal approximation, one-sided 5%, 80% power corrected for 1 guardrail + OEC). Until then the breakers do the real protecting, and most tests end UNDERPOWERED. Record that as the result rather than calling a winner.

## Sources
- ai.stanford.edu (Kohavi, Deng, Frasca, Longbotham, Walker, Xu, KDD 2012; read)
- medium.com (Xifara and Andersen, Airbnb, 2021; read via text mirror)
- engineering.atspotify.com (Spotify, 2024; read) and arxiv.org (abstract, snippet)
- votito.com (Amazon email OEC formula quoted from the Kohavi/Tang/Xu book; book not checked directly)