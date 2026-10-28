# Question mining from autocomplete: what people type before we rank for anything

**Topic:** finding the real questions people search around our subjects (adverse possession, Welsh longhouses, farm history, land registration), using Google's and YouTube's autocomplete. It's free and works with zero Search Console impressions.
**Harvested:** 2026-10-28 00:15Z. **Tool:** `tools/suggest_mine.py`, my own stdlib script (~3 KB, no install, no key).

## Why it fits the gap
`search-console-regex-question-longtail.md` mines the questions we already get impressions for, and Cedwyn has very few of those. Autocomplete shows demand we don't rank for yet. It's the "what to write next" input that the GSC skill can't give a small site.

## What autocomplete is (primary source)
- **Google, Danny Sullivan, "How Google autocomplete works in Search", 20 Apr 2018** (read): "We look at the real searches that happen on Google and show common and trending ones relevant to the characters that are entered and also related to your location and previous searches." Predictions that break policy (hateful, violent, sexual, dangerous) are removed.
  - So every suggestion is a query real people typed, even when keyword tools show "0 volume".
  - The results are filtered, and shaped by location.
- **LowFruits, Benjamin Rojas** (read; practitioner, sells a keyword tool): the alphabet-soup method (seed + a…z) and modifier words ("how", "can you", "vs", "best") pull out long-tail queries that volume tools hide. The intent is in the modifier: "how/can" means informational, "best/buy" means commercial.

## Measured on our own seeds (28 Oct 2026 00:14Z, this box)
- `"adverse possession uk" "welsh longhouse" --questions`: **41 unique suggestions, 16 question-shaped.** Examples:
  - "how to prove adverse possession uk"
  - "adverse possession uk unregistered land"
  - "does adverse possession exist in the uk"
  - "how long does adverse possession application take uk"
  - "what is a welsh longhouse"
  - "welsh longhouse history"
  - "welsh longhouse floor plan"
- **Location bias, observed:** the endpoint follows the box's IP, not `hl`/`gl`. "adverse possession w" returned US states ("washington state", "wisconsin"). Put "uk", "wales" or "welsh" in the seed itself.
- YouTube (`--yt`) is just as US-leaning ("adverse possession texas…"). Use it for video titles only with a UK seed.

## How to do it
1. **Pick 5–10 seeds**: our topics in searcher words, not our own titles ("adverse possession uk", "welsh farmhouse history", "land registry first registration", "welsh longhouse", "vale of glamorgan history").
2. **Run** `python3 tools/suggest_mine.py "<seed>" ... --questions --csv a temporary folder/q.csv`. Add `--soup` for depth; it makes 27 calls per seed. Wait at least 1 s between calls. This is an unofficial endpoint, so keep runs small (weekly, not hourly).
3. **Sort the output into three groups:**
   - (a) questions a record or e-book answers directly;
   - (b) questions a short blog post can answer;
   - (c) off-topic, legal advice or US-only. Drop group (c).
4. **One question, one page:** use the question as the H2 or title, answer it in the first 40–60 words, then give the dated evidence, then the in-text link to the e-book (`blog-inline-anchor-text-cta-vs-end-banner.md`). This also suits AI answers (`ai-answer-citations-geo-sources-quotes-stats.md`).
5. **Check after 4–8 weeks** with the GSC regex skill: did the page start getting impressions for that question? Keep what works, drop what doesn't.

## How we apply it to Cedwyn
- **Feed the cedwyn-blog Worker's daily topic queue:** a weekly run (5 seeds, `--questions`, about 1 minute) appends new question-shaped lines to a topics file. Each daily post answers one of them using our records.
- **Strong first picks from tonight's run:**
  - "what is a welsh longhouse" and "welsh longhouse history": an architecture post linking to the 1974 "ancient Welsh house" material.
  - "adverse possession uk unregistered land": an explainer of how the 1987 case's land sat before registration. Neutral wording, dated records, no advice.
- **Editorial guard:** "how to claim/stop adverse possession" is legal-advice intent. We may explain what the published judgment and records show; we never give advice and never name the project lead. The scan rules apply, including the banned words.
- **Output stays private:** suggestions are research notes, never published as lists.

## Sources
- blog.google (Sullivan, 20 Apr 2018; read)
- lowfruits.io (Rojas; read)
- Own measurement: `tools/suggest_mine.py` run 28 Oct 2026 00:14Z (41 suggestions, 16 questions; US-leaning location noted)