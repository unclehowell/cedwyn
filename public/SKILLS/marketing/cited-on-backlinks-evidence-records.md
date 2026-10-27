# "Cited on" back-links: two-way links between evidence records and the pages that cite them

Harvested 2026-10-27 10:55Z (skills harvest). Trigger: the project lead asked (WhatsApp 10:44 GMT 27 Oct) that every page citing a piece of evidence links to it AND every evidence page lists the pages that link to it. Complements orphan-pages-click-depth (reachability) and glossary-definition-pages (anchor text); this skill is the reverse link from record to citer. Tool: `tools/cited_on_audit.py` (stdlib, written this run).

## What the evidence shows
- **Google Search Central, "Link best practices" (read):** Google can only reliably crawl a link that is an `<a>` element with an `href`. Links in other forms, or `<a>` tags that work only via script events, "won't be parsed". Links JavaScript inserts are fine as long as the final markup is `<a href>`. Anchor text should be descriptive and concise and make sense out of context.
- **seoClarity, five internal-linking case studies (vendor's own clients, read; their numbers, not checked by us):**
  - A large retailer added internal links to under-linked pages and gained 9.5k organic visits a week within three weeks (about +150k a year) to the newly linked pages.
  - An e-commerce brand ran a split test: control categories vs test categories, with deep (level 3–4) pages getting new links. The test groups gained +24% organic traffic.
  - A retailer linked top sales pages and gained +23% traffic. A marketplace that added links straight away saw a 100% jump in discovered keywords.
  - Common thread: the gains landed on pages that were deep or weakly linked before. That describes most single evidence records.
- **Wikipedia's "What links here" (practice, not a study):** the reference model for a record that lists everything citing it. Wikipedia keeps it as a hidden tool page. On a small evidence site, the list belongs on the record page itself, where readers and crawlers can both see it.
- No published heritage-site case study with numbers was found for back-link lists. Treat the traffic effect as an expectation from the internal-linking evidence above, not a measured result.

## How to do it (smallest version that works)
1. **One source of truth.** The citer pages already contain links of the form `<a href="/research/evidence/ev-NNNN-.../">`. At build time, scan every built page for links to evidence records and build a reverse map, `{record: [citing pages]}`. Never maintain the lists by hand; they rot the first time another worker edits a page.
2. **Render a "Cited on" block on each record**, below the transcript, interpretation and holding place:
   - `<h2>Cited on</h2>`, then a `<ul>` of plain `<a href>` links. Use each citing page's own `<title>`/H1 as the anchor text, never "click here".
   - Group by section (Wales, Argentina, Research, Timeline) once a record has more than 6 citers.
   - Show the count ("Cited on 4 pages") so a reader can see at a glance which records the case rests on.
   - Sort by section, then title, so the order is stable between builds and diffs stay small.
3. **Forward links stay contextual:** keep the in-text link at the sentence that uses the record (catalogue ID as part of the anchor text, e.g. "EV-0412 (RCAHMW record, 1988)"). The preview pop-up is a bonus layer on top of a real `href`, never a replacement for it.
4. **Crawlability guard:** no `<span data-href>`, no `onclick`-only links, no links only inside the pop-up JSON. The audit flags these.
5. **Records cited nowhere** are orphans. Either link them from the right theme page, or list them on the catalogue index so they stay one click deep.
6. **Check after every build:** run the audit and fix any record whose "Cited on" list is missing a citer before calling the build done.
7. **Measure:** Search Console → Pages → filter `/research/evidence/`. Note indexed counts and clicks before the change and 4 and 8 weeks after. Add one line to the annotations log on the day it ships.

## Tool
`python3 tools/cited_on_audit.py --sitemap cedwyn.bucklerfamily.estate --max 6000 --json a temporary folder/cited.json`
- Reads every page and builds the reverse map for paths matching `--target` (default `/(evidence|artifact)s?/`).
- Prints the records whose page lacks a link back to a citer, the records cited nowhere, and the pages carrying uncrawlable links.
- `--dir <built_site> --base <url>` runs it offline on a local build, which takes seconds. Prefer this.
- Live crawl note: Cedwyn's sitemap lists 5,137 URLs, 2,765 of which mention evidence/catalogue (read 27 Oct). At 0.3 s per page a full live crawl takes about 25–30 minutes. Run it detached, or use `--dir` on a shallow clone of the built output.
- Tested on a 4-page fixture: it caught 1 missing back-link and 1 uncrawlable `data-href`.

## How we apply it to Cedwyn
- Scope today: the 24 archive-intake records (the 1988 press cuttings, RCAHMW NA/GL/88/49 and NA/GL/89/208, the 1974 H.J. Thomas plan) and then every existing EV- record. the project lead asked for "the cited on lists will work across all artifacts".
- The 1974 plan and the 1988 RCAHMW report cite each other (the project lead, 10:46). That needs record-to-record links both ways, as well as page-to-record links. A "Related records" block, separate from "Cited on", keeps the two lists distinct.
- Generate the block in the build step that already renders artifact pages (the halves.py / section build). Do not hand-edit 2,700 pages; one template change covers them all.
- The money link stays on every record as it is now (the /ebooks/ strip). "Cited on" adds reading depth; it is not a sales block.
- Sources: developers.google.com ; seoclarity.net ; en.wikipedia.org