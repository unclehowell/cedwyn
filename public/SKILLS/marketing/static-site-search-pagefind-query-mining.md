# Static site search (Pagefind) + search-term mining for Cedwyn
Harvested 27 Oct 2026. Free, open source (MIT per a lobste.rs user report; licence not checked on the repo), no server, no install needed on this box (runs in the site build via npx or pip).

## Why it matters (numbers, with sources)
- Site searchers convert at 4.63% vs 2.77% for non-searchers (Econsultancy figure, quoted by Hello Retail, 24 Feb 2026; Econsultancy original not checked). Algolia (a search vendor, so biased) quotes "up to 50% higher". Treat as direction, not a forecast for a heritage archive.
- Searches are free voice-of-customer data: every query a visitor types is a page or record they expected to find. A query with zero results is a content gap or a missing glossary/alias entry.
- Pagefind (CloudCannon, Liam Bigelow, 15 Jul 2022, read): full-text search of all of MDN in under 300 KB transferred including the library; "for most sites closer to 100 KB". Index is built from the finished HTML after the site generator runs, so it needs no database or API.
- Pagefind docs v1.5.2 (read 27 Oct 2026) example run: 2,496 pages / 22,852 words indexed in 2.357 s.

## How to do it (step by step)
1. Add the UI to one page (a /search/ page plus a header icon that opens the modal):
   `<link href="/pagefind/pagefind-component-ui.css" rel="stylesheet">`
   `<script src="/pagefind/pagefind-component-ui.js" type="module"></script>`
   `<pagefind-modal-trigger></pagefind-modal-trigger><pagefind-modal></pagefind-modal>`
2. In the build (GitHub Actions, after the static build, before deploy): `npx -y pagefind --site <output_dir>` (or `python3 -m pip install 'pagefind[extended]' && python3 -m pagefind --site <output_dir>`). It writes `/pagefind/` into the output. Nothing to host.
3. Scope the index: add `data-pagefind-body` to the main content element on each template so headers, footers, nav and the agent smallprint are not indexed; `data-pagefind-ignore` on boilerplate blocks.
4. Multilingual: Pagefind makes one index per `<html lang>` automatically. Spanish (es) and English (en) get stemming + translated UI. Welsh (cy) is NOT in the supported table (read 27 Oct): search still works, but with no stemming (treigladau/mutations will not match, e.g. "Tŷ" vs "Dŷ") and the UI shows in English. Fix: add mutated forms and English equivalents as hidden `data-pagefind-meta`/keywords on Welsh pages, or the glossary aliases.
5. Filters: `data-pagefind-filter="section"` on each theme (research, wayback, ebooks, glossary...) so results can be narrowed by section.
6. Make results deep-linkable: the search page reads `?q=` from the URL and runs it. That gives shareable search links AND lets analytics capture queries.
7. Capture the queries:
   - GA4 enhanced measurement fires `view_search_results` automatically when the URL carries q, s, search, query or keyword (Google Analytics help 9216061, read 27 Oct). Search term dimension = the query. Only if GA4 is on the page (not found on the home page 27 Oct; see the UK analytics exception skill before adding).
   - No GA4: log `?q=` requests from Cloudflare (the request path/query in Cloudflare analytics; whether the query string is exposed in the dataset we use is not checked) or a tiny privacy-safe beacon to a Worker that stores the term only (no IP, no ID).
8. Monthly review (15 min): top 20 queries, zero-result queries, queries that end in an exit. Each zero-result query becomes one of: a glossary alias, a redirect, a new record page, or a missing-record (MR) candidate.

## How we apply it to Cedwyn
- Checked 27 Oct 2026: no Pagefind on cedwyn.bucklerfamily.estate/ (cache-busted fetch); whether any other search exists on section pages was not checked. 37+ themes on separate branches make navigation hard; one search box across the deployed output is the cheapest way to let a visitor find "Parcel A", "1824 survey" or a catalogue ID.
- Fits the architecture the project lead asked for (front ends layout-only, data from the DB): Pagefind indexes whatever the DB-fed pages render, so nothing is duplicated. Run it in the main deploy job over the merged output so all branches are searchable together. Put the how-it-works text in /docs/, not on the human page.
- Index only human content: `data-pagefind-body` on the article element; exclude the agent smallprint, footer and nav. Never index private or unpublished pages.
- Add `data-pagefind-filter="section"` per theme, and a "Books" filter so a search for a topic surfaces the matching e-book (e.g. a query for "concealment" shows the fcg title and its free preview). That is the sales link: search -> record -> related e-book -> /ebooks/.
- Welsh: add mutated and English forms of key names (Tŷ Mawr / Dŷ Mawr / Great House Farm; Llandough / Llandochau) as hidden keywords so cy queries match.
- Ownership: this is a site-wide change (one PR on main labelled site-wide per SCOPE.md). PROPOSED for the next permitted main committer; queue it, do not commit while the docs-library/nft-art/privacy workers are on main.
- Measure: queries per week, zero-result rate (target under 20%; our own target, not a benchmark), searches that lead to an /ebooks/ click.

## Sources
- pagefind.app (Getting started, v1.5.2, read 27 Oct 2026)
- pagefind.app (language table; Welsh absent, read 27 Oct 2026)
- cloudcannon.com (Liam Bigelow, 15 Jul 2022, updated 6 Dec 2024; MDN under 300 KB)
- support.google.com (GA4 enhanced measurement, site search parameters, read 27 Oct 2026)
- helloretail.com (Econsultancy 4.63% vs 2.77%, original not checked)
- lobste.rs (small-site practitioner choice, MIT, client-side only)