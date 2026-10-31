# Choice overload on the e-book shelf: when fewer choices sell more, and a "start here" default

Date: 2026-10-31 · Harvest run · Topic was not covered before this run: 'choice overload', 'paradox of choice', 'fewer options', 'scheibehenne', 'iyengar' and 'which book first' had 0 hits across INDEX.md and 668 skill files. The decoy effect is a different topic: see pricing-page-decoy-replication-evidence-nudges.md.

## What the evidence actually states
- **The famous result.** Iyengar & Lepper (2000, JPSP 79(6)) put out a tasting table with either 24 or 6 jams. The 24-jam table stopped more shoppers (about 60% vs 40%), but only about 3% of them bought, against about 30% at the 6-jam table. This is one field study, and it gets quoted far beyond what it supports.
- **The average effect is roughly zero.** Scheibehenne, Greifeneder & Todd (2010, JCR) pooled 63 conditions from 50 experiments (N = 5,036). The mean effect of a bigger assortment was "virtually zero", but it varied a lot between studies. So "cut the range" is not a law.
- **When overload does happen.** Chernev, Böckenholt & Goodman (2015, J Consumer Psychology) pooled 99 observations (N = 7,202). Once four factors are allowed for, the effect is reliable. Overload grows with:
  1. choice-set complexity: options look alike, there is no obvious best one, and the information is dense;
  2. decision-task difficulty: little time, a lot to read, awkward presentation;
  3. preference uncertainty: the buyer has no settled preference or expertise in the category;
  4. decision goal: the buyer is browsing to buy one thing, rather than just looking.
- **Practitioner test libraries.** GoodUI has patterns for this: #36 "Fewer Or More Results" (9 tests, most recently on a tours site, 27–28 Oct 2026, about 150k visitors) and #113 "More Or Fewer Plans" (7 tests). Their effect sizes are behind a paywall, so we have not seen them and do not quote them. All we take from this is that serious testers treat assortment size as something to test, with mixed results.

**Rule we take from this:** cut or structure the choices when the options look alike, the buyer is new to the subject, and they are there to buy. That describes a cold visitor to our shop, who does not know Tŷ Mawr. A returning member who knows the case is the opposite case, and the full list serves them better.

## How to do it (smallest steps first)
1. **Count the decisions a cold visitor faces before the first click.** That means titles × version selectors × bundles × membership × library. Write the number down.
2. **Give one default.** Add a "Start here" block above the shelf: one recommended first book, one line on why, one buy button, and one free-read link. A default is the cheapest fix and needs no title removed.
3. **Group, don't list.** Put the titles under 2–3 plain headings ("The place and its history", "The case", "The records"), with at most 3–4 cards per group visible before a "See all" tap. Grouping cuts complexity without shrinking the range, which is the moderator Chernev found.
4. **Make options different, or merge them.** If two cards share a price, a cover style and a blurb pattern, the visitor can't tell them apart. Fix that with one sentence each on who the book is for.
5. **Hide expert controls from cold visitors.** A version dropdown on every card is a decision most first-time buyers can't make. Show the current paid edition, and put "Earlier free edition" behind a small link.
6. **Measure it.** Do a before/after with the purchase rate from /ebooks/ visits, ignoring the first 14 days after the change. Better: a sticky 50/50 test of "Start here + grouped" against the current shelf, read with tools/ab_stats.py or tools/bandit.py. Sizes from tools/ab_stats.py: 1.0% to 2.0% needs about 2,319 visitors per arm, and 1.0% to 1.5% needs about 7,750 per arm. At our traffic, only a large change will show up, so test bold layouts, not tweaks.

## How we apply it to Cedwyn (live check 31 Oct 2026 06:1xZ)
The live /ebooks/ page has high complexity and is aimed at buyers with uncertain preferences, which is exactly the overload case:
- **9 title cards.** 8 of them carry a version selector (v0.0.2 £4.99 / v0.0.1 free), plus a "Buy" and a "free version" link. Every paid title is the same price and uses the same card pattern.
- **More choices on top:** an "All four books · £19.96" bundle, the Academy at £49.99 a month, and a library link to 121 more free e-books.
- **About 30 visible choice points** before a stranger has learned what Tŷ Mawr is.
- **Bundle wording to check (not checked against the build):** there are 8 paid titles, but the bundle reads "All four books" at £19.96, which is exactly 4 × £4.99. The visitor can't tell which four, and gets no saving for buying the bundle. See ebook-pricing-bundles-direct.md (bundle anchor about 2–2.5×).

Proposals (markup or theme changes, so they go through the ONPAGE flywheel or the next planned main change; nothing published by this run):
1. A "Start here" block at the top of /ebooks/. Lead with Tŷ Mawr — the history and heritage of Great House Farm, the broadest entry book. Free read first, then buy v0.0.2.
2. Group the 9 cards into 3 headings, with "See all" on mobile (390 px).
3. Replace the per-card version dropdown with the current edition plus a small "earlier free edition" link.
4. Fix the bundle wording: name the four books, or make it "All 8" with a real saving. The price is the project lead's decision, so this is a proposal only.
5. Read the result with tools/ab_stats.py. Use the 14-day ignore window, and note the change date in the growth-report notes.

## Sources
- Iyengar & Lepper 2000, "When choice is demotivating", JPSP 79(6):995–1006
- scheibehenne.com (JCR 37(3):409)
- sciencedirect.com (Chernev et al. 2015)
- kellogg.northwestern.edu
- goodui.org ; goodui.org (test counts only; results paywalled, not seen)
- Live page: cedwyn.bucklerfamily.estate (fetched 31 Oct 2026)