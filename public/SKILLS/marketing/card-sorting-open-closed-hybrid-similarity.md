# Card sorting (open, closed, hybrid): let readers group the content before we name the menu

**What it is:** each content item goes on a card (title plus a one-line description). Participants group the cards in whatever way makes sense to them and, in an open sort, name each group. Card sorting is the *generative* partner to tree testing (see top-tasks-survey-tree-test-navigation.md). The card sort proposes a structure, and the tree test then checks that people can find things in it.

## Practitioner evidence (with numbers)
- **How many participants (NN/g, Jakob Nielsen, on Tullis & Wood's data):**

| Participants | Correlation with the final result |
|---|---|
| 5 | 0.75 (not enough) |
| 15 | 0.90 (recommended stop) |
| 20 | 0.93 |
| 30 | 0.95 |
| 60 | 0.98 (wasteful) |

  Tullis & Wood themselves recommend 20-30.
- **Cards and sample (NN/g 2024 guide):** use 30-50 cards and at least 15 participants for a qualitative sort. Use 30-50 participants for a quantitative sort, where you read how often pairs were grouped together.
- **Which type (NN/g):**
  - **Open:** no predefined groups. This is the most common type and best for learning how people think.
  - **Closed:** categories are fixed. It is used to validate, but NN/g states tree testing is usually better for that job.
  - **Hybrid:** some categories are given and participants may add their own.
- **Don't take labels literally (NN/g):** in an open sort, participants' group names are clues, not final labels. A card sort also ignores the page context that shapes how labels get read.
- **Analysis (Optimal Workshop 101 guides):**
  - The **similarity matrix** shows the % of participants who put each pair of cards together. Dark clusters along the edge mean strong agreement.
  - The **dendrogram** (hierarchical clustering) shows where natural groups split.
  - For closed sorts, the **placement matrix** shows how often each card went into each category. A card split across categories is a labelling problem.

## How to run it (free, small audience)
1. **Pick 30-50 cards** from real content, ideally the top tasks plus the pages that draw the most traffic. Write titles in plain words with no jargon and no menu names, so the cards don't hint at the current structure.
2. **Choose open** (we are designing the structure) or **hybrid** (when a few sections, such as "E-books", are fixed).
3. **Recruit 15 people** from the real audience. Remote and unmoderated is fine: a shared spreadsheet with a "group name" column per card works, as do paper cards at a talk.
4. **Ask 2 follow-ups:** "Which cards were hard to place?" and "Any group you'd look for first?"
5. **Analyse:** run `tools/card_sort.py` to get pair-agreement %, the top pairs, and average-linkage clusters at a cut you choose. Groups with 60% or more pair agreement are strong. Cards under 30% agreement with everything are orphans: rewrite the card or let it live in several places.
6. **Draft 5-8 sections** from the clusters. Name them in the words participants used most often, then **tree-test** the draft before changing the live menu.

## How we apply it to Cedwyn
- **The problem it fits:** the site has many web apps (research, evidence, wiki, e-books, shop, movie, academy, calendar) whose content overlaps. A reader looking for "the 1987 case" or "the farm's history" may not know which app holds it.
- **Cards:** the 40 most-visited pages and documents across the apps, plus each e-book title. Card text is page titles only, never anything private.
- **Participants:** 15 engaged readers. Keep "E-books" as a fixed group (hybrid) so we learn which research topics readers expect to sit next to each e-book. Those pairings become in-page links to /ebooks/.
- **Output:** a proposed section map and a list of orphan cards. Hand the map to the tree-test step (top-tasks skill).
- **PROPOSAL only:** recruiting readers by email or social, and any menu change, need the project lead's go. The analysis itself can run now on an internal sort by agents (label it as a weak proxy for readers).

## Tool
`tools/card_sort.py` (stdlib only) reads a CSV with `participant,card,group` columns. It prints:
- the pairwise co-occurrence % matrix (top pairs);
- per-card best partner;
- orphan cards (max agreement under 30%);
- average-linkage clusters at a `--cut` threshold (default 0.5);
- for closed sorts, a card x category placement % table (`--closed`).

Nothing installed.

## Sources
- nngroup.com (Nielsen on Tullis & Wood: 5=0.75, 15=0.90, 20=0.93, 30=0.95, 60=0.98; read 2026-10-31)
- nngroup.com (30-50 cards, 15+ qualitative, 30-50 quantitative; open/closed/hybrid; tree testing preferred over closed sort for validation; read 2026-10-31)
- optimalworkshop.com (pair %, cluster edge; read 2026-10-31)
- optimalworkshop.com (AAM/BMM clustering; snippet)