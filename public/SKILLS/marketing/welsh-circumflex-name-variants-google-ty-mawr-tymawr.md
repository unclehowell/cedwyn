# Welsh circumflex and name variants in Google: Tŷ Mawr, Ty Mawr, Tymawr

Harvested 31 Oct 2026, 22:16Z (skills harvest). Priority from the root: Google ranking for a niche heritage page with zero search clicks. Tonight Tymawr (one word) was added as a recorded variant (CVG/EC/3/1/3/13). The question is which spelling people type, and whether Google treats them as the same word.

## What the primary sources establish
- **Google matches accented and plain forms, but not uniformly.** From Google Search Central Blog, "How search results may differ based on accented characters and interface languages" (1 Sep 2006; still published, read 31 Oct 2026):
  - for a query with or without an accent, "our algorithms consider web pages that contain versions of that word both with and without the accent";
  - **but** "the set of accented characters that are treated as equivalent to non-accented characters varies based on the searcher's interface language", and "documents in the chosen interface language tend to be considered more relevant".

  Most searchers for Llandough use an English interface, so whether ŷ is folded to y for them is **not documented**. Treat it as unknown and cover both forms on the page.
- **Mueller's answer (Google), 25 Jun 2021 hangout,** transcript on seroundtable.com (read):
  - Google matches the exact form and also detects "alternate spellings ... and treat[s] them as synonyms as much as possible". That is "not ... binary", so results are "very similar but ... not necessarily exactly the same".
  - Advice: "focus on the correct version ... but if the correct version is not really the commonly used version then it's not problematic to also include the commonly used version as well".
  - Don't rename to the popular form: "if you just include the alternate version of that name in your information for the website then it's a lot easier for us to say, well these kind of belong together".
- **One word versus two** (Tymawr / Ty Mawr) is a separate case from the accent. It relies on the same synonym and spelling systems, which Mueller describes as a "rough guess". So the one-word form needs to appear in text too.
- **Typing reality:** on a UK English phone keyboard, ŷ needs a long-press. The Welsh learners' threads (reddit r/learnwelsh, read in snippet) explain the hirnod to learners, which states the plain form is what most English-keyboard users type. This is our inference, not a measured share.

## What I measured on Cedwyn (31 Oct, 22:12Z, live)
- **Homepage**, title "Cedwyn Estate", no H1, 1,261 words: contains "Tŷ"; contains **neither "Ty Mawr" nor "Tymawr"**. sales-fix PR #86, not merged, retitles it "Tŷ Mawr (Great House Farm), Llandough · Cedwyn Estate", still circumflex only.
- **The case page** /research/bp-properties-v-buckler/ also has "Tŷ" but not "Ty Mawr".
- **Search Console**, 3–30 Oct, domain-wide: 181 impressions, 0 clicks, 0 impressions on any Tŷ Mawr / Great House Farm / Llandough query (sales-fix log). Either form may be the one we're missing.

## How to do it
1. **Keep Tŷ Mawr as the main form** (it is the correct one, per Mueller) in titles and H1s.
2. **Add the plain and one-word forms once, in visible text near the top of each key page**, as a natural gloss rather than a keyword list. For example: "Tŷ Mawr (also written Ty Mawr, and Tymawr in a 1975 county survey), known in English as Great House Farm, Llandough". Key pages: the homepage, /ebooks/, the case page, /nomenclature/, /wales/, the tour page.
3. **Meta description:** use the plain form "Ty Mawr" once. Descriptions show bold on matching terms, and the plain form is what most people type.
4. **Structured data:** on the Place/LandmarksOrHistoricalBuildings or WebPage entity, set `name` "Tŷ Mawr (Great House Farm)" and `alternateName` ["Ty Mawr","Tymawr","Great House Farm","Cedwyn"]. The pattern is already in site-name-breadcrumb-structured-data-cedwyn.md.
5. **URLs stay ASCII** (ty-mawr, not t%C5%B7-mawr). Links are copied and typed; the anchor text can carry the accent.
6. **Don't stuff.** One gloss per page. Google's title doc warns against "Foobar, foo bars" lists.
7. **Measure** (day 28 after the build): in the Search Console Performance query filter, use a "Custom (regex)" filter `(?i)t(y|ŷ) ?mawr|tymawr|great house farm`. Split impressions by form to learn which one people actually type. Then adjust which form leads the description; the title keeps the correct form.

## How we apply it to Cedwyn
- **PROPOSED, nothing committed here.** Hand this to whoever owns each branch:
  - PR #86 (homepage title): add "Ty Mawr" to the description, e.g. "Tŷ Mawr (Ty Mawr / Great House Farm), Llandough…", and add an H1.
  - the nomenclature worker: the new full table should show Tymawr / Ty Mawr / Tŷ Mawr as text, which it will.
  - section/research: add the one-line gloss on the case page.
- **Public text rules:** the gloss names a place and a record, not a family holding. No banned words. Llandough Farm is a different place, and the gloss must not merge them.
- **Same rule for other Welsh names on the site:** Cwm Cedwyn / Cedwyn, Llandochau / Llandough. Correct form first, the common English-keyboard form once.

## Sources
- developers.google.com (read 31 Oct 2026)
- seroundtable.com (Mueller transcript, 28 Jun 2021; read)
- developers.google.com (read)
- reddit.com (snippet only)
- Live fetches of cedwyn pages 31 Oct 22:12Z; the project workspace (GSC numbers)