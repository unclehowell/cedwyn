# MaxDiff (best–worst) survey to rank bundle contents and next-release priorities

Harvested 30 Oct 2026. Pairs with gabor-granger-price-ladder-survey-revenue-peak.md (that file sets the PRICE; this one decides WHAT goes in the bundle / which book to write next). Read-only research; nothing changed on Cedwyn.

## What it is (OpinionX hub, read 30 Oct 2026)
- Show 3–6 items at a time; the person picks the MOST and LEAST important/appealing. Repeat with new sets. Every item lands on one relative scale — something star ratings never give (everyone rates everything "4").
- It only ranks the list you gave it: "it'll name the strongest option on your list without ever telling you whether the list itself was worth ranking". Do qualitative work first (reader replies, review mining) so the list is right.
- Past ~6 options per set, switch to pairwise (two at a time).

## Sizing the study (the numbers)
- OpinionX formula: s = r·x / (n·p). x = items, n = items per set, p = expected completers (minimum), r = reliability (each item seen ≥ 200 times across the whole survey). Worked: 30 items, 4 per set, 80 people → 200·30/(4·80) = 18.75 → 19 sets each. If the formula gives < 10, show 10 anyway (sets take seconds). > 40 sets per person across a survey is too many without an incentive. If you will compare segments, put your SMALLEST segment's count in p.
- Sawtooth (40 years of choice research, calculator page read): show each item ~3 times per respondent; keep items per set under half the total list; balanced design (each item equally often, against each other item equally, in each position equally) beats random.
- Quali-Fi sample table (read): aggregate ranking min 100 / recommended 200; segment comparison 150 / 200–300 per segment; individual (HB) scores 200 / 300–500; latent-class 300 / 500+. 5 per set extracts slightly more than 4, small effect.

## Real case
- VEED (video editor), needs-based segmentation with a MaxDiff block on OpinionX: 205 users completed, median 13 min 12 s, $10 gift card each; the researcher did "90% or more of my analysis work within the survey tool"; the result reframed their ideal-customer profile by comparing two sub-segments (Full Stack Researcher write-up, read).
- Airbnb Services host-concerns worked example on the OpinionX blog: long concern list ranked then split by host type (URL below; listed, not read in full).

## How to run one (small-list version)
1. Build the list (8–15 items) from real words: reader replies, comments, review mining. One idea per item, same length, no "and".
2. Pick n = 4. Sets per person: s = max(10, ceil(200·x/(4·p))). Check each item appears ≥ 3 times per person (s·n/x ≥ 3).
3. Score simply: count score = (times picked best − times picked worst) / times shown, range −1..+1. Use our stdlib tools/maxdiff_plan.py (design check + balanced-ish sets + count scores). Under ~100 completers = direction only; say so.
4. Add one anchor question after ("Would you buy a bundle with your top 3?" yes/no) — MaxDiff is relative, the anchor tells you whether anything clears the bar.
5. Act on the top 3 and bottom 3; ignore the middle (noise at small n).

## How we apply it to Cedwyn (PROPOSAL, nothing sent)
- Use: decide (a) which 4 items go in the £19.96 bundle page's "what's inside" emphasis and (b) which chapter/book to write next (e.g. 1824 parish map, 1939 tenancy, Welsh-language edition, Patagonia link, school worksheets, audio narration, timeline poster, source scans).
- Audience: the opted-in Mailchimp list and Academy members only (consent; no cold sends). Realistic p is tens, not hundreds → 10 items, 4 per set, 10–12 sets each, read as direction; confirm with real clicks/sales (A/B on the /ebooks/ order of blocks).
- Tool: OpinionX free tier or a plain Google Form with fixed sets (Workspace is connected); tally with tools/maxdiff_plan.py. Zero spend; any incentive (gift voucher) is an owner decision.
- Public text rules apply to the item wording (neutral, no banned words, never name the owner).

## Sources
- opinionx.co (read 30 Oct 2026)
- sawtoothsoftware.com (read)
- quali-fi.com (read)
- fullstackresearcher.substack.com (VEED case, read)
- opinionx.co (listed, not read)