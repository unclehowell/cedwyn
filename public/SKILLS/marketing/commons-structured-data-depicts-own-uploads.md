# Commons structured data: "depicts" (P180) and captions on our own uploads, so they are found in any language
Harvested 30 Oct 2026 (skills harvest ~15:45Z). Status for Cedwyn: PROPOSED (applies only to files we upload ourselves, on the project lead's GO for the Commons pilot already proposed in wikimedia-commons-public-domain-archive-images-glam.md). Zero spend.

## Why it matters (primary sources, read 30 Oct 2026)
- Commons' own modelling page: depicts (P180) is "used by more than 28.5 million files" (as of July 2026). Today's live count via the search API, `haswbstatement:P180`, was 29,671,512 files.
- MediaSearch (the default Commons search for logged-out readers since April 2021) first runs queries on statements and captions, then expands on Wikidata labels, then on categories and wikitext. A file whose depicts points at a Wikidata item is found by that item's label and aliases in every language, so Welsh, Spanish and English searchers all reach it without us writing three descriptions (Commons:Structured data/Modeling/Depiction; Commons:Media search).
- The same MediaSearch backend powers image search inside the Wikipedia visual editor. So depicts is how an editor illustrating an article on Llandough or Leckwith finds an image (Modeling/Depiction).
- Evidence of effect: the WMF A/B test (10–17 Sep 2020, team-draft interleaving, 14,251 vs 13,591 visited results) found "a strong preference" for the structured-data MediaSearch over legacy search. The preference statistic was about −0.118, 95% CI −0.125 to −0.111 (Structured Data Across Wikimedia/MediaSearch test, M. Warncke-Wang). This is a measure of search quality, not of views for any one file. I found no published per-file "views before vs after depicts" numbers (not checked).
- MediaSearch boosts entities by how similar they are to the search term and by the entity's importance (Help:MediaSearch). It also warns that one specific item already implies the general ones, so tagging "Golden Gate Bridge" beats piling on "bridge, suspension bridge, tourist attraction".

## The rules (Commons:Depicts, read today)
1. Use the file page's "Structured data" tab → depicts → pick the Wikidata item. Captions go on the "File information" tab: one line per language, max 250 characters.
2. Be as specific as possible. Tag only what is clearly and deliberately shown. For crowded images, list only the most prominent things.
3. Mark the main subject as "prominent". It ranks higher.
4. Add depicts "conservatively". Don't tag generic concepts already implied by a specific item.
5. If no Wikidata item exists, check Wikidata notability. That bar is lower than Wikipedia's, but it still needs a serious public source plus at least one statement and one reference, or the item may be deleted. Otherwise use a more general item.
6. Batch tools: the ISA tool (campaign-style tagging), AC/DC, and Pattypan/OpenRefine at upload time. All of them make edits as a logged-in person, so the same disclosed single account and the COI rules in wikimedia-commons-wikidata-heritage-coi.md apply.

## Live baseline for our area (Commons API, 30 Oct 2026)
- St Dochdwy's Church, Llandough (Q97403861, Cadw 13432): **8** files carry depicts=Q97403861. A full-text search for "St Dochdwy" finds 26 files and "Llandough church" 76 (the text hits include unrelated files; not checked one by one).
- Old Leckwith Bridge (Q17741052, Grade II*): **4** files depict it, against 7 text hits for "Old Leckwith Bridge".
- Category:Leckwith Bridge (4 files, run through tools/commons_depicts_audit.py today): all 4 have depicts=Q17741052, but **every caption is English only**. There are no cy or es captions.
- So the work is twofold: tag the files that only text search finds (7 text hits for the bridge, 4 depicts; 26 text hits for St Dochdwy, 8 depicts), and add cy/es captions to our own files.

## How we apply it to Cedwyn
- **Our own uploads only.** That means public-domain archive images and maps we upload, and photos the uploader took themselves of public places: the church, the old Leckwith bridge, the woods' public paths. Never private houses, family holdings or addresses. Don't tag other people's files to steer traffic; that's promotional editing.
- **Per file:**
  - Depicts: the most specific item, marked prominent. For example Q97403861 for the church or Q17741052 for the bridge.
  - Captions in en, cy and es, neutral and dated, e.g. "St Dochdwy's Church, Llandough, from the south, 2026".
  - P571/P170/P1071 as relevant.
  - Llandough means the one near Penarth. Check the item before tagging; never the Cowbridge Llandough.
  - **Llandough Farm is not Great House Farm**; never tag a Llandough Farm image as the farm.
  - **No Wikidata item for the farm will be created by us.** COI, and notability not checked; owner decision.
- **Workflow:** run `tools/commons_depicts_audit.py --category "<our upload category>"` before and after. Aim for 0 files without depicts and 0 without en/cy captions.
- **Measure:** BaGLAMa2/GLAMorous views for our category at 3 and 12 months (see commons_views.py). Also the `--count` totals for Q97403861 and Q17741052 against the baseline above (8 and 4).
- **Public text rules:** neutral third person; never name the project lead; banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken); no shop links on Commons (they're nofollow and promotional; reach only).

## Sources
- commons.wikimedia.org
- commons.wikimedia.org
- commons.wikimedia.org
- mediawiki.org
- mediawiki.org
- Commons API counts run 30 Oct 2026 (haswbstatement:P180=Q97403861 → 8; =Q17741052 → 4; haswbstatement:P180 → 29,671,512)