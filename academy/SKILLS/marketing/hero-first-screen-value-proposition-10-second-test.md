# Hero / first-screen value proposition: the 10-second test
Harvested 2026-10-27 11:20Z by the skills harvest. Complements small-sample-usability-tests-buy-path-5-users.md (five-second tests) and cta-button-copy-first-person-benefit.md (the button itself). This file is about the H1 + one line + one action a visitor sees before scrolling.

## The evidence (primary sources, read 27 Oct 2026)
- NN/g eye-tracking (Pernice, "Scrolling and Attention", 2018 study): users spent about **57% of page-viewing time above the fold**, **74% in the first two screenfuls**; the second screenful got ~17%; in 2010 the above-fold share was 80%. Within the first screen, more than 65% of viewing time sat in its top half. (nngroup.com)
- NN/g / Nielsen 2011, on Microsoft Research's Weibull dwell-time analysis (Liu, White, Dumais, SIGIR 2010): users often leave pages in **10-20 seconds**; pages that survive that window hold people much longer, so "you must clearly communicate your value proposition within 10 seconds". (nngroup.com)
- Copyhackers (Joanna Wiebe), SweatBlock home page: rewriting the hero with messaging hierarchy + specificity produced a statistically significant **paid lift of 108%**; a follow-up PAS (problem-agitate-solve) test added **+49% (women) and +46% (men), 99% confidence**. Single client, copy agency's own report. (copyhackers.com)
- Copyhackers' "clear vs clever" scoring: a value-prop headline is judged on Unique, Desirable, Specific, Succinct, Memorable; clear beat clever in their tests. (copyhackers.com - 403 to our fetch; criteria from the search snippet)
- Read honestly: these are big-traffic sites. With ~4 real visitors a day we cannot A/B a hero; we use the 10-second rule + 5-user tests and judge by buy-tap clicks over weeks.

## The how-to
1. **Measure the first screen as it really renders** at 390x844 and 1280x800: which H1, which words, which actions, where the first buy/free link sits. Tool: `node tools/first_screen.js <url> [w] [h]` (below).
2. **H1 = what it is + for whom + why now**, in plain words, not a place name or a section label. Pattern: "[Thing] that [outcome] for [reader]". Keep under ~12 words.
3. **One sub-line with the most specific, checkable fact** (a number, a date, a record count, "first edition free").
4. **One primary action in the first screen**, matching the H1 promise (free read first, paid second). Everything else (nav chips, carousels, layer switches) is secondary styling.
5. **Proof inside the fold**: one concrete artifact image or a one-line record citation beats a generic banner.
6. **Test without traffic**: 5-person five-second test - show the first screen for 5 s, ask "what is this page offering, and what would you tap?". 3 of 5 must answer both correctly. Re-test after each change.
7. **Judge after a change** by buy-tap/free-tap clicks per real visitor over >=14 days (see ebook-pricing-bundles-direct.md for the 14-day rule), annotated in search-console-ga4-change-annotations-log.md.

## How we apply it to Cedwyn (measured live 27 Oct 2026 ~11:15Z, 390x844)
- **Home (/)**: H1 is "CEDWYN ESTATE, WALES · CEDWYN ESTATE II, PATAGONIA" - two names, no offer. The free-book link ("Read free: Cedwyn: names, legend, title") is in the fold at y=103 but competes with 13 tappables (Wales/Patagonia/Cyberspace, language, Full screen, carousel arrows, Menu, layers...). 70 words in the fold.
- **/ebooks/**: H1 is "E-BOOKS" (a section label). The lead line is good and specific ("The digital estate's records as books you can keep... Every book starts at £0.00 - v0.0.1"), and the bundle strip "All four e-books, one checkout · £19.96" sits at y=103, so the fold leads with the paid bundle before the free offer.
- **PROPOSED (body/design change, needs the owner's OK; no edit made by this harvest)**:
  - /ebooks/ H1 -> something like "Great House Farm's records, as e-books you can keep - first editions free" (bilingual cy/es via the existing pattern, real translations only).
  - First action on /ebooks/ = "Read the first edition free" (the £0.00 book), bundle second.
  - Home: add one sub-line under the H1 naming what the estate offers (records, e-books, guided tour), and keep the free-read link as the single highlighted action.
  - Re-run first_screen.js and a 5-person five-second test before/after; log in the annotations log.
- Editorial: no banned words, never name the owner, no outbound links in hero copy.

## Sources
- nngroup.com
- nngroup.com
- copyhackers.com
- copyhackers.com (snippet only)