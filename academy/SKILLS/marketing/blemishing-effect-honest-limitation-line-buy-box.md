# The blemishing effect: an honest "what this book does not cover" note after the strengths

Date: 2026-10-31 · Harvest run · Topic was not covered before this run: 'blemish', 'pratfall', 'what this book doesn't', 'who it's not for' and 'negative review' had 0 hits across INDEX.md and 668 skill files. Star-rating evidence (Spiegel) sits in reviews-social-proof-direct-ebooks.md. This file is about the seller's own copy.

## Evidence
- **The original study.** Ein-Gar, Shiv & Tormala (2012, Journal of Consumer Research, "When Blemishing Leads to Blossoming") ran four studies: hiking boots (online, twice), chocolate bars (campus, a hot day) and champagne glasses.
  - Adding one mild negative after the positives raised favourability and purchase. Examples: the boots "only come in two colours"; the chocolate bars "are broken".
  - The boost appeared only when people were not concentrating hard ("low processing"): distracted people, or students about to sit an exam.
  - Source: gsb.stanford.edu
- **Three conditions, all required.** If any one fails, the effect reverses:
  1. **Order:** positive first, then the blemish. A negative read before the positives hurts.
  2. **Weak negative:** a minor or side issue, never the core promise.
  3. **Low effort:** skimmers, which is most mobile shop visitors. Careful readers who weigh everything preferred the all-positive version.
- **The same pattern in the field.** Spiegel Research Center (Northwestern) data across more than 40 categories shows purchase likelihood peaks at average ratings of 4.2–4.5 stars, not 5.0. Perfect scores read as too good to be true. Source: spiegel.medill.northwestern.edu
- **How strong this is:** lab and field-experiment evidence, plus one large observational dataset. No direct test on an e-book sales page has been found. Treat it as a strong hypothesis to test, not a proven lift.

## How to write the blemish
1. **Lead with 3–5 concrete strengths:** what's inside, the sources used, page counts, what the reader will be able to do.
2. **Then add one short, true, minor limitation:**
   - format: "PDF only, no print edition yet";
   - scope: "covers 1891–1989; the medieval period is in a separate book";
   - edition: "first edition, updated as records arrive".
3. **Never blemish the core promise.** Don't write "the evidence may be weak" on an evidence book. That is a strong negative, and the effect reverses.
4. **Keep it to one line** in the buy box, placed after the bullets and before the button. A second negative turns honesty into doubt.
5. **Pair it with a remedy where one exists:** "PDF only, reads on any phone or Kindle via Send to Kindle".
6. **Test it.** Run a sticky 50/50 with and without the line on one card, and read it with tools/ab_stats.py or tools/bandit.py (minimum 14 days). At about 1% conversion, a doubling needs about 2,319 visitors per arm, so expect a long read. A before/after with the 14-day ignore window is the fallback.
7. **Don't use it on careful-reader pages.** Long-form evidence pages are read closely, and there the plain all-positive summary plus full sourcing is the safer choice.

## How we apply it to Cedwyn
Cedwyn already has the perfect honest blemish: the public missing-records register (/research/missing-records/, MR-0001…MR-0057). Each case book can truthfully say which records are not yet found. That is a minor, side negative that also signals rigour, so it doesn't undercut the content.

Draft lines. They follow the editorial rules: no banned words, no names, no outbound links. They are for the ONPAGE or theme flywheel and are not published by this run.
- **Tŷ Mawr (history book):** after the bullets, "First edition: the 1983 fire destroyed some finds, so a few chapters rely on later copies. See the missing-records list."
  - Check MR-0056 wording before use.
- **Recorded Incidents:** "Covers 1891–1989. Records still being traced are listed openly on our missing-records page." (check which MR entries match this book before naming any).
- **Cedwyn: Names, Places, Legend:** "PDF only for now; reads on phones and e-readers."
- **Placement:** one line, grey, under the bullets and above "Buy v0.0.2 · £4.99". Never on the free-read link. Never more than one line.
- **Measure it** as a 50/50 on one card, together with the choice-overload "Start here" work (choice-overload-ebook-shelf-start-here.md) only if they are on different cards. Otherwise test one at a time.

Proposal for QUEUE-after-framing: add one blemish line to 2 book cards and read it with bandit.py for at least 14 days. Do not publish it until the wording has passed the editorial scan.

## Sources
- gsb.stanford.edu (Stanford GSB, study summary)
- ideas.repec.org (Ein-Gar, Shiv & Tormala 2012, JCR 38(5))
- spiegel.medill.northwestern.edu
- Live: cedwyn.bucklerfamily.estate ; cedwyn.bucklerfamily.estate