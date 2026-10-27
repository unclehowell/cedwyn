# The 404 page as a sales path: near-miss redirects, a money link and an honest 404

Date: 2026-10-27 · Topic: CRO / technical SEO · Status: playbook + Cedwyn audit (fixes PROPOSED) · Tool: tools/notfound_audit.py (own, stdlib)

## The evidence (with its limits)
- **Google Merchandise Store (GA4 demo data, 10 Oct 2022 to 10 Oct 2023).** NotFoundBot analysed it:
  - 403,869 desktop visitors converted at 3.36%.
  - The 12,138 desktop visitors who hit a 404 (3%) converted at 1.86%, which is 57.5% lower.
  - Estimated lost sales: about $28,775, or 1.3% of desktop revenue.
  - Many of the broken URLs carried an old "google+redesign" path, so a redesign left old links dead.

  (Read 27 Oct 2026.) Limits: the analyst sells 404 monitoring, and this is a correlation. Visitors who wander onto broken links may differ anyway. Still, it's the clearest public number on 404 cost in a real shop.
- **Google Search Central (HTTP status codes doc, read):** a page that returns 200 with an error or empty message is reported as a **soft 404**. A missing page should return a real 404 or 410. A moved page should return a 301 or 308 to its new address.
- **Practitioner pattern** (Invesp, SEO Sherpa and similar guides, read as snippets only, not checked): a useful 404 page has a search box, links to the top sections and the main product, and a short human explanation. Their bounce figures, e.g. "94% vs 65%", come from vendor blogs and are not checked, so don't quote them.

## How to do it
1. **Return a true 404** for missing paths (check with notfound_audit.py). Cloudflare Pages serves /404.html with status 404 for unknown paths automatically. The file at /404 itself answers 200, so add `<meta name="robots" content="noindex">` to it.
2. **Redirect near-misses to the money page** with 301s in `_redirects` (budget: 2,100 rules max on Pages, so prefer a few splat rules over thousands of one-offs) (Cloudflare Pages: `/ebook/ /ebooks/ 301`). Cover the guesses people type or that old posts used: singular/plural, hyphenated, "books", "store", "buy", and old platform paths found in Search Console's "Not found (404)" report and Cloudflare analytics.
3. **Mine the real 404s monthly:**
   - Search Console > Pages > Not found (404). Export it, then sort by referring page (internal first).
   - Cloudflare > Analytics > status 404 by path.
   - Fix internal links at the source. Redirect anything that had a successor page. Leave genuinely gone pages as 404/410. Don't send every 404 to the home page: Google treats mass redirects to irrelevant pages as soft 404s.
4. **Make the 404 page sell, gently:** one sentence of apology, a search box, the 3–5 safest starting points, **and one line pointing to the shop**, e.g. "Looking for the books? The first editions are free →". No pop-ups.
5. **Count it:** a GA4 or Clarity event on the 404 page (page_title "Page not found"), plus clicks from it. Report the 404 sessions per week and the share that continue to /ebooks/.

## How we apply it to Cedwyn (live check 27 Oct 2026, 08:10Z; `python3 tools/notfound_audit.py cedwyn.bucklerfamily.estate`, 10 flags)
- Good: a random missing path returns a **real 404**, with a clear "Navigation help" page that has 6 links (home, directory, catalogue search, research, Wayback Vault, guestbook).
- **NO_MONEY_LINK:** the 404 page has no link to /ebooks/. The site has just moved about 5,000 pages ("may have moved during the migration"), so lost visitors are likely, and they never see the books. **PROPOSED:** one line + link "E-books: the records as books you can keep. First editions free →" /ebooks/.
- **NO_SEARCH:** the page links to /catalogue/ search but has no box of its own. **PROPOSED:** a GET form to /catalogue/?q=, pre-filled with the last path segment of the missing address (the page already shows the requested address with JS).
- **NEAR_MISS_404:** /ebook/, /e-books/, /books/, /book/, /store/ and /buy/ all 404. **PROPOSED** `_redirects` lines: `/ebook/* /ebooks/ 301`, `/e-books/* /ebooks/ 301`, `/books/ /ebooks/ 301`, `/book/ /ebooks/ 301`, `/buy/ /ebooks/ 301`. Leave /store/ alone if /shop/ is the store; map `/store/ /shop/ 301`.
- **INDEXABLE_404:** /404 and /404.html answer 200 with no robots meta. **PROPOSED:** add noindex to the 404 template.
- Then: put the Search Console 404 export into the monthly onpage run (cedwyn-onpage RUNNER) and fix internal links that point at missing pages before adding redirects.

Rules: these are markup and redirect changes, so the onpage worker can make them (commit via gh.py, re-fetch first, no force-push). The wording of the new line follows the editorial rules: no owner name, no banned words, internal links only.

## Sources
- notfoundbot.com (GA4 demo data analysis, vendor, read)
- developers.google.com (soft 404, status handling, read)
- developers.cloudflare.com (nearest 404.html up the tree, ending at /404.html; no top-level 404.html = SPA mode; read)
- developers.cloudflare.com (_redirects: top-most rule wins, static before dynamic, 2,000 static + 100 dynamic = 2,100 max, 1,000 chars per line; read)