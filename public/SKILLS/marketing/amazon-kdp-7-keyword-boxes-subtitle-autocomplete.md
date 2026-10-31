# Amazon KDP keywords: the 7 boxes, subtitle phrase, and free autocomplete mining

Date: 30 Oct 2026 · Area: e-book launch, SEO/marketplace search · Spend: £0 · Status for Cedwyn: **PROPOSAL**. It only applies if and when a title is listed on KDP (see amazon-kdp-2026-price-band-select-vs-direct.md for that decision).

## What it is
KDP gives each book 7 keyword boxes (50 characters each) next to the title, subtitle and categories. Amazon uses them, along with sales history and Best Sellers Rank, to decide which shopper searches the book appears for.

## Facts we have, and how well they are checked
- **Amazon's own rules (KDP Help G201298500, read 30 Oct 2026):** "Use up to seven keywords or short phrases." "Combine keywords in the most logical order." Search Amazon with each candidate first and "look at the suggestions that appear in the Search field drop down". Useful types: setting, character types or roles, plot themes, story tone. **Avoid:** anything already in the metadata (title, contributors); words already in your categories; quality assertions ("best"); time-sensitive words ("new", "on sale", "available now"); words common to the category ("book"); spelling errors; spacing and punctuation variants. Amazon also states relevant keywords "can boost your placement" alongside sales history and BSR.
- **Kindlepreneur experiment (Dave Chesson; page read; 120 volunteer books, 82 fiction / 38 non-fiction; crawler checked 100,000+ phrases, rank tracked to 300):**
  - Filling more of the 50 characters got a book **indexed for more searches**.
  - Amazon recombines the words in a box (e.g. "dragon war mage" also indexes "war dragon mage").
  - A **specific exact phrase ranks better** for that phrase than a stuffed box.
  - A phrase in the **title or subtitle ranked about 37% better** than the same phrase in a box only.
  - The author's own caveat: 120 books is not a statistically strong sample. The vendor sells a keyword tool (Publisher Rocket), so treat it as practitioner evidence, not proof.
- **Timing (search snippet from an unnamed 2026 guide, not checked):** wait 5–7 days after a change before judging, because rank moves weekly.
- **Free autocomplete (tested from this box, 30 Oct 2026):** Amazon's public suggestion endpoint answers without a key. UK Kindle-store prefixes returned, for example: "welsh history" → "welsh history", "welsh historical fiction"; "welsh farm" → "welsh farm book"; "welsh family history" → itself; "patagonia", "glamorgan" and "cardiff history" → themselves; "welsh patagonia", "welsh settlers" and "llandough" → nothing. Suggestions look store-wide (they included "penarth map" and "welsh landscape canvas"), so read them as hints of shopper wording, not search volume.

## How to do it (one hour per title)
1. **Seed list (20–40 phrases)** in reader words: place (county, town, country), period (decade, century), subject (farm, land, court case, emigration), reader intent (family history, local history), plus a Welsh/Spanish variant only if readers search that way.
2. **Mine suggestions:** run `python3 the project workspace suggest "<seed>" ... --market uk` (1 request/s). Keep phrases Amazon itself suggests. Drop phrases that return nothing, unless they are exact reader-intent phrases for a niche we own.
3. **Check the search page by hand** for the top 10. Are the results the same kind of book as ours? If they're irrelevant, drop the phrase (Amazon's own advice).
4. **Pick one primary phrase** that reads naturally and put it in the **subtitle**, not in a box (Kindlepreneur +37%). The subtitle must stay a true description of the book.
5. **Fill boxes 1–3 with specific exact phrases** we most want to rank for (one per box, in logical word order).
6. **Fill boxes 4–7 with broader phrases packed toward 50 characters** for reach: `amazon_kw.py pack phrases.txt` packs a ranked list into 7 boxes of 50 characters and strips banned words ("book", "new", "best", "free", "kindle", ...). Don't repeat title words, category words or spacing variants.
7. **Record** the 7 boxes and the date in the book's metadata file. Re-check after 7 days and after 30 days: which phrases the book appears for (manual search, logged-out, UK store) and its position up to page 3.
8. **Change at most 2 boxes per review**, so we can tell what worked.

## Rules
- No quality assertions, no "new/on sale", no competitor author or title names (Amazon's metadata guidelines; also our editorial rules).
- Public metadata never names private people. It also never uses banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken) and makes no accusations. "Land dispute" or "court case" is allowed only as a neutral subject term.
- No paid keyword tools. The autocomplete endpoint is free; keep to 1 request/s, by hand-sized batches only.

## How we apply it to Cedwyn (proposal, owner's KDP decision first)
- **Candidate subtitle phrase:** "Welsh family history" or "Glamorgan local history". Both are Amazon-suggested or exact reader phrases. Pick the one that truly describes each book.
- **Draft boxes (from the packer test, to be checked by hand before use):**
  1. "welsh family history"
  2. "glamorgan local history"
  3. "cardiff history"
  4. "vale of glamorgan farmhouse history wales"
  5. "welsh patagonia settlers chubut"
  6. "ancestors wales genealogy records"
  7. "welsh historical non fiction"
- **Spanish edition (if it ever happens):** repeat on amazon.com with Spanish seeds ("galeses en patagonia", "historia de chubut").
- **Same work, other stores:** the primary phrase also goes into the Google Play / Apple / Kobo subtitle and the /ebooks/ page title, so the wording is consistent everywhere.
- **Measure:** UK-store logged-out position for the 3 primary phrases on day 7 and day 30, plus KDP sales/KENP. Log to the project workspace
- **Owner steps:** KDP account and listing are the project lead's decision. Nothing is listed or changed by us.

## Tool
- tools/amazon_kw.py: our own stdlib script (~2.5 KB, no install). `suggest` mines Amazon UK/US autocomplete; `pack` packs ranked phrases into 7×50-character boxes and strips banned words. Tested 30 Oct 2026 (packed 9 phrases into 4 boxes; live suggest call answered).

## Sources
- kdp.amazon.com (Amazon KDP Help, read 30 Oct 2026)
- kdp.amazon.com (snippet: up to seven keywords at title level)
- kindlepreneur.com (Chesson experiment, 120 books; read)
- Amazon UK search-suggestion endpoint, live calls from this box 30 Oct 2026