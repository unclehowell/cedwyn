# Glossary pages + descriptive internal links (SEO and AI citations)
Harvested 26 Oct 2026 (skills harvest). Topic: turning a heritage wiki's hard words into crawlable, descriptive internal links and definition pages that search engines and AI answers cite. Distinct from topic-clusters-place-pages (place hubs) and headline-first-read-more (page layout).

## Evidence (opened and read 26 Oct 2026)
- Google, "Link best practices": Google can generally only crawl a link that is an `<a>` element with an `href`. Good anchor text is "descriptive, reasonably concise, and relevant"; "Click here", "Read more" and "website" are given as BAD anchors. Read only the anchor text out of context: if it does not tell you what the page is about, rewrite it. "Don't chain up links next to each other" (the words around a link matter). "Every page you care about should have a link from at least one other page on your site." Keyword stuffing in anchors is a spam-policy violation. [S1]
- SearchPilot (SEO split-testing firm, controlled tests): adding links from level-2 to level-3 category pages on a grocery site gave a 25% organic traffic uplift across both groups, about 9,200 extra organic sessions a month; the pages giving the links also rose 20%+. Their caution: the gain came from clearer information architecture, not "tons of links". [S2] Other SearchPilot tests: links to the 6 nearest regions on ~8,000 regional pages = +7% on pages receiving links; homepage-footer links = +5% on destination pages; changing only anchor text to more contextual words was tested (result unpublished at the time). [S3]
- Otterly.ai x Conversal GEO experiment (Sept 2026): 304 definition pages (33.2% of the indexable site) got 38x the AI citations per page of other pages (6.03 vs 0.16); 39.8% of all citations went to definition pages; the site was the most cited of 1,400 domains (3.0% of 64,453 citations); Bing/Copilot cited and ranked them more than Google did. Only 6.1% of AI-crawler visits were on-demand fetchers; 84.4% were training scrapers. One agency's site, one study: treat as direction, not a rule. [S4]
- schema.org has DefinedTermSet ("a glossary, dictionary or enumeration") and DefinedTerm. Google lists no rich result for them; they are machine-readable labelling only. [S5]

## The how-to
1. One canonical home per term. Hub `/glossary/` with an `id` anchor per term (Cedwyn's build already writes `/glossary/#slug`). For the 8-12 terms people actually search (check Search Console queries + the AI questions in the visibility check), PROPOSE a standalone page `/glossary/<term>/`: a URL fragment (#slug) is part of the same page, so a hub anchor cannot rank or be cited as its own page (Google's handling of fragments: not checked this run, but the Otterly effect was measured on separate definition pages).
2. Definition page shape (what AI answers lift): H1 = the term; first sentence = a 1-2 line plain definition; then "In the Cedwyn records" with dated, catalogued examples; then variants/spellings; then 3-6 links out to the evidence pages that use it. One term per page, no padding.
3. Links in body text must be real `<a href>` written at build time (not injected only by JS, not `<span onclick>`). Tooltips/modals may enhance the link but the `href` must go to the definition.
4. Anchor text = the term itself or a short descriptive phrase ("permissive occupancy", "the 1824 David Stewart survey"), never "learn more"/"read more"/"here". The accordion "Learn more" controls are buttons, not links, so they are fine; any link reading "Learn more" should be renamed to its destination.
5. Link the first mention per section only; never two links side by side; no links in headings or buttons. Density: a link should help a first-time reader; if a paragraph has more than ~1 link per 25 words, cut.
6. Reverse links: every definition page links back to the 3-6 strongest pages using the term, so link equity flows both ways (the SearchPilot "linking pages also rose" effect).
7. Variant spellings: put every attested spelling (with its source and date) as text on the canonical page, so a search for any spelling lands there; do not make a separate thin page per spelling.
8. Markup (optional, low cost): DefinedTermSet on /glossary/ listing each DefinedTerm with `name`, `description`, `url`, `inDefinedTermSet`; `alternateName` for variants.
9. Measure: Search Console Pages report filtered to `/glossary/` (impressions, queries), Bing Webmaster AI Performance cited pages, and the weekly Grok mentions check. Review after 28 days; ignore the first 14 days.

## How we apply it to Cedwyn
- The human front-end build (data/glossary.json + tools/wikilinks.py) links terms at build time as `<a class="cw-g" href="/glossary/#slug">`: correct shape. Check before merge: /glossary/ must exist (it returned 404 live on 26 Oct 2026 before that build), each anchor id must exist, and the nomenclature modal trigger must still be an `<a href>` to the variant's explanation.
- PROPOSAL (new public pages, held for the owner via the queue): standalone pages for permissive occupancy, adverse possession, Cedwyn (and its spellings), Tŷ Mawr / Great House, registered proprietor, title register, FOI internal review. Each: definition, dated Cedwyn examples with catalogue IDs, variants, links to evidence. Public text rules apply: no banned words, unchecked facts marked 'not checked', no outbound links, 1824 David Stewart survey as first record mention of Tŷ Mawr.
- Audit link text site-wide for "read more"/"click here"/"learn more" anchors and rename them to the destination.
- Add a glossary line to the Monday visibility check: glossary impressions + AI citations of /glossary/ URLs.

## Sources
- S1 developers.google.com
- S2 searchpilot.com
- S3 searchpilot.com
- S4 otterly.ai
- S5 schema.org ; schema.org