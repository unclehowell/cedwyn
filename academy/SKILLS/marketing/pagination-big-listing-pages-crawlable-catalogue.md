# Pagination and big listing pages: keep every catalogue item crawlable

Date: 30 Oct 2026. Topic: SEO / indexing for large archive listings (evidence catalogue, missing-records register, blog index).
Distinct from: page-indexing-triage-duplicates-canonicals.md (duplicates), scaled-content-thin-pages-sitewide-quality-audit.md (quality), orphan_depth_audit.py (click depth), topic-clusters-place-pages-local-history.md (linking strategy). This one is about HOW a list of hundreds of items is served so a crawler can reach all of them.

## What the sources say
- Google Search Central, "Pagination, incremental page loading, and their impact on Google Search" (read; last updated 2025-12-10):
  - Google mainly follows links in `<a href>`; it does not click "load more" buttons or trigger infinite scroll. Content that appears only after a JS action may never be found.
  - Link pages in order with plain `<a href>` to the next page; optionally link every page back to page 1.
  - Give each page its own URL (e.g. `?page=2`), not a `#fragment` (Google ignores fragments and may not follow the link).
  - **Do not canonicalise page 2+ to page 1.** Each page gets its own self-canonical.
  - Paginated pages may share the same title and description.
  - `rel=next/prev` is no longer used by Google (other engines may still read it).
  - Sorted/filtered versions of the same list (`?order=`, `?filter=`): noindex or block in robots.txt.
  - Also: use a sitemap so Google can find every item.
- Glenn Gabe (GSQI), case study, 7 Oct 2021 (read via a reader service; gsqi.com blocks this machine): a client site where **67% of indexed URLs were pagination** kept growing in search. Fresh content was still crawled quickly, and crawl stats were not swamped. His advice:
  - Keep pagination indexable with self-referencing canonicals.
  - `noindex` on pagination means Google may drop the links on those pages over time, so items found only through them can be lost.
  - Canonicalising to page 1 is a hint Google often ignores.
  - Check the Crawl Stats report, not just the indexing counts.
- Googlebot reads the first 15 MB of an HTML file. A long single-page list is fine until the page gets heavy for phones (see sales-page-speed-core-web-vitals-ebooks.md).

## Recipe (decision tree)
1. **Under ~1,000 items and HTML under ~1 MB:** keep ONE page with every item as a plain `<a href>`. Client-side search or filters may hide items visually, but the links must be in the HTML. Add a self-canonical.
2. **Bigger than that, or slow on a 390 px phone:** paginate with `?page=n`. Use plain numbered and Next links, a self-canonical on each page, and the same title is OK. Put the newest or most important items on page 1.
3. **"Load more" or infinite scroll:** acceptable for users only if each chunk also exists at a real `?page=n` URL linked with `<a href>`. Optionally update the URL with history.pushState as the user scrolls.
4. **Sort/filter/tag views:** `noindex,follow`, or block them in robots.txt. Never make them the only path to an item.
5. **Sitemap:** list every item URL on the canonical host. Reference the sitemap index in robots.txt and submit it in Search Console.
6. **Check:** Search Console Pages report, plus Crawl Stats once a month. Use URL Inspection on 3 random deep items to confirm "Discovered via" shows the listing or the sitemap.

## Tool
`the project workspace` (own script, standard library only, about 4 KB, nothing installed):
`python3 listing_audit.py <listing_url> --prefix /research/evidence/ --sitemap <site>/sitemap.xml`
It reports:
- HTML size;
- item links found as plain `<a href>`;
- JS-only pagination (load-more buttons, `#page` fragments, `javascript:` links);
- numbered page links and sort/filter links;
- the canonical and robots meta;
- how many linked items are missing from the sitemap (it follows a sitemap index two levels deep).

## How we apply it to Cedwyn
Measured today (30 Oct 2026, ~06:28Z, cache-busted) with listing_audit.py:
- `/research/evidence/`: one page, 0.33 MB, **765 item links**, all plain `<a href>`, no JS pagination, robots `index,follow`. **No canonical tag.** That is good as a single page, so don't paginate yet.
- The **sitemap index lists 48 URLs. 763 of the 765 evidence pages are missing from it.** `/research/missing-records/` (73 links) has no canonical tag and no sitemap entries either.
- `/research/sitemap.xml` exists (94 URLs) but lists `research.bucklerfamily.estate` addresses, only 90 evidence pages. It is not referenced in robots.txt or the sitemap index. Robots.txt has no `Sitemap:` line.
- So discovery of the whole catalogue currently depends on one listing page.

Proposed fixes (markup and sitemap only; for the CEDWYN ONPAGE flywheel or a [CEDWYN REPO] task; no body-text change):
1. Add a self-canonical to `/research/evidence/`, `/research/missing-records/` and each item page. Use the cedwyn host, or whichever host the existing canonical policy names. That choice was not checked here; follow page-indexing-triage first.
2. Generate `sitemap-research.xml` with every evidence and MR item URL on the canonical host. Today `/sitemap-research.xml` returns an HTML page, so the slot is free. Add it to `sitemap.xml` (the index), add `Sitemap: cedwyn.bucklerfamily.estate to robots.txt, and resubmit in Search Console.
3. If the evidence list passes ~1,000 items or 1 MB, switch to `?page=n` pages per the recipe, never with page-1 canonicals.
4. Re-run listing_audit.py after each research publish. Target: missing-from-sitemap 0.

Editorial: markup only. No public wording changes, so the banned-word and naming rules are untouched.

## Sources
- developers.google.com (read, updated 2025-12-10)
- gsqi.com (read via r.jina.ai, 2021-10-07)
- Live checks of cedwyn.bucklerfamily.estate /research/evidence/, /research/missing-records/, /sitemap.xml, /sitemap-core.xml, /research/sitemap.xml, /robots.txt (30 Oct 2026)