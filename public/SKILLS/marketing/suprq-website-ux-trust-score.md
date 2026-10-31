# SUPR-Q: an 8-question website score for ease, trust, looks and loyalty

**Use it when:** you want one repeatable number for how a website is experienced, and in particular whether visitors find it trustworthy, measured the same way before and after a change. It complements task-level scores (SEQ) and the SUS/UX-Lite family, which measure ease only; SUPR-Q adds trust/credibility, appearance and loyalty.

## The instrument (Jeff Sauro, MeasuringU)
Eight items. Seven on a 5-point scale (Strongly disagree 1 .. Strongly agree 5), one on 0-10:
- **Usability:** "The website is easy to use." / "It is easy to navigate within the website."
- **Trust/credibility:** "The information on the website is credible." / "The information on the website is trustworthy." (Shop variant: "I feel comfortable purchasing from the website." / "I feel confident conducting business on the website.")
- **Appearance:** "I find the website to be attractive." / "The website has a clean and simple presentation."
- **Loyalty:** "I will likely return to the website in the future." / "How likely are you to recommend the website to a friend or colleague?" (0-10)

## The evidence behind it (MeasuringU)
- Built from 33 candidate items drawn from 17 existing questionnaires, refined over 4,000+ responses, three studies and 100+ website experiences.
- Overall reliability Cronbach alpha = .86; the four 2-item factors range .64 to .88 (loyalty lowest, partly because of the 0-10 item).
- Correlates with SUS (convergent validity) and separates good from poor sites.
- Re-validated in 2024 on 2,761 responses about 57 websites across eight sector surveys; the four-factor model held.
- Scores are usually reported as **percentile ranks**: 50 = average, 35 = 35th percentile (below average). The norms hold 10,000+ participants and about 150 websites, refreshed quarterly.

## Scoring
- **Raw (free to compute, as Fuzzy Math describes):** average the two items in each factor; for loyalty, halve the 0-10 answer before averaging with the return item. The overall raw SUPR-Q is the mean of the four factor scores (about 1-5).
- **Percentile (needs MeasuringU's paid licence and norms):** converts raw scores to a rank against other sites. We do not buy this. Without it, compare only against our own earlier runs, never against "industry average".
- Report each factor separately; the overall number hides where the problem is. Report n and a 95% confidence interval with every score; if two runs' intervals overlap heavily, call it no change.

## When to ask
- At the end of a usability session (after the task-level questions), or
- As a short retrospective survey to people who already use the site (newsletter readers, members), once per quarter, same wording, same channel, so runs compare.
- Ask before a redesign ships and again 4-8 weeks after; keep the sample source the same.

## Practitioner use
- Fuzzy Math (design agency) uses SUPR-Q as its standing design KPI with clients, capturing feelings while people use the product, to show change over time and the return on design work.

## How we apply it to Cedwyn (PROPOSAL; any survey to readers or members is a proposal for the owner's approval)
- **Use the credibility pair, not the shop pair, on the research and evidence pages** (trust in the information is the point); use the shop pair on /ebooks/ and checkout.
- **Baseline now, re-measure after big template changes** (the footer and theme work), so a change in trust is visible rather than guessed.
- **Read factors against each other:** high appearance + low trust = the look is fine but sourcing is not landing (more visible catalogue IDs and source lines); low navigation = pair with the tree-test and top-tasks files.
- **Run it after the next 5-user buy-path round** alongside SEQ (see post-task-ease-seq-sus-ux-lite.md), and as a quarterly 8-question form to academy members.
- **Helper:** `tools/survey_scores.py suprq` (stdlib) turns answer rows into raw factor scores, overall raw score and a 95% interval. No percentile (licensed).
- Credit the instrument by name in any write-up; do not present raw scores as percentiles.

## Sources
- MeasuringU, "10 Things to Know About the SUPR-Q" (items origin, 4,000+ responses, alpha .86/.64-.88, percentile meaning): measuringu.com
- MeasuringU, "Validating the Basic SUPR-Q Measurement Model" (2024; 2,761 responses, 57 sites; norms 10,000+ participants, ~150 sites): measuringu.com
- Fuzzy Math, "Using the SUPR-Q as a Design Metric" (item wording incl. shop variants, raw scoring, loyalty halving): fuzzymath.com
- Sauro, "SUPR-Q: a comprehensive measure of the quality of the website user experience", Journal of Usability Studies (2015): dl.acm.org