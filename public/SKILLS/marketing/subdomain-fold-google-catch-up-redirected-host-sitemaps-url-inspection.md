# After folding subdomains into one host: make Google catch up (old-host sitemaps, URL Inspection, 1-year redirects)

Written 31 Oct 2026 (skills harvest), the evening the apex fix went live (bucklerfamily.estate/<path> now 301s to the same Cedwyn path, the project lead 19:51). Before this run 'domain property' and 'change of address' had 0 index hits. The general migration method is in site-migration-redirect-map-internal-link-crawl.md and page-indexing-triage-duplicates-canonicals.md; this file is the post-consolidation clean-up for our 30+ redirected hosts.

## Primary rules (Google Search Central / Search Console Help, read 31 Oct 2026)
- Redirects doc: use permanent server-side redirects (301/308) to change the URL shown in results.
- Site move with URL changes: **don't redirect many old URLs to one irrelevant URL such as the home page; it may be treated as a soft 404** (exactly what the apex did until 19:52Z today). Keep redirects **at least 1 year**; verify all variants (www, apex, subdomains) in Search Console.
- Change of Address tool: for whole-domain/subdomain moves; NOT for www vs non-www, http->https, or path moves inside one site. Our subdomain->/path/ folds are covered by the Domain property and redirects; Change of Address is optional per subdomain and moves can't be chained (A->B then B->C), so don't use it on hosts that may change again.
- Sitemaps doc: list fully-qualified URLs you want shown in Search, max 50,000 URLs / 50 MB per file.
- Practitioner route (Go Fish Digital via Moz, already in page-indexing-triage): a **temporary** sitemap of the redirected URLs makes Google recrawl them sooner and see the 301; remove it once they show "Page with redirect".
- Practitioner outcome (Grow and Convert, Circuit case, read): blog moved subdomain -> /blog/ in June 2020; average tracked position went from >50 toward page 1 within ~3 months; sessions 920 -> 14,577 in 6 months. One client, other work ran in parallel, so it shows direction, not a clean effect size.

## Live state, 31 Oct 2026 ~19:58-20:00Z (read-only checks)
- Search Console property: sc-domain:bucklerfamily.estate (Domain property, siteOwner) already covers apex, www and every subdomain. Nothing to add.
- 33 sitemaps were submitted on 23 Oct (the project workspace). **30 of their 33 hosts now 301 into cedwyn.bucklerfamily.estate/<path>/**; only cedwyn, library and bucklervsbp still serve 200. Each redirected host's /sitemap.xml still answers 200 (served by the agent-ready Worker before the redirect) and lists its own old home, e.g. dartboard.../sitemap.xml -> 1 URL -> 301 to /dartboard/. Cedwyn's own sitemap (5,763 URLs) already lists every target path (/dartboard/, /research/, /wiki/, /story/, /watchtower/, /directory/, /nomenclature/ checked).
- URL Inspection API (same property):
  - bucklerfamily.estate -> PASS "Submitted and indexed", Google canonical = itself, last crawl 27 Oct 22:29Z. It still appears as its own result ("Cedwyn Estate · Wales and Patagonia").
  - nomlecture.bucklerfamily.estate -> PASS "Submitted and indexed", canonical itself, last crawl 26 Oct. nomenclature.bucklerfamily.estate also shows as a separate result with the same title. Both now 301 to /nomenclature/.
  - dartboard.bucklerfamily.estate -> NEUTRAL "Page with redirect", canonical cedwyn.bucklerfamily.estate This is the target state.
- Reading: the index lags the redirects by days; the two duplicate results will clear after a recrawl. Nothing is broken; the work is to speed it up and then tidy.

## How to do it (order matters)
1. **Keep** the redirected hosts' sitemaps for now (they are the temporary "redirected URLs" sitemap that prompts the recrawl). Do not delete or resubmit anything yet.
2. Make sure every redirected host's /sitemap.xml lists that host's old URLs that real people or links used (not only the home). For hosts that were single-page apps the home is enough.
3. In Search Console (UI only; the API cannot request indexing) run URL Inspection > Request indexing on: the apex home, nomlecture home, nomenclature home. Daily quota is small; these 3 are the ones Google still holds as their own canonical.
4. Re-inspect weekly with the API (GOOGLE_SEARCH_CONSOLE_INSPECT_URL; 1 call per 3-5 s). When an old host reads "Page with redirect" with Google canonical on cedwyn, it is done.
5. When all redirected hosts read "Page with redirect" (or after 8 weeks, whichever first): delete their 30 sitemaps from the Search Console Sitemaps report and stop the Worker serving them (make /sitemap.xml on those hosts 301 like every other path). Keep cedwyn's sitemap as the only one for those pages.
6. Keep every redirect for at least 1 year (Google) and in practice indefinitely: links in printed flyers, emails sent tonight and old posts point at the subdomains.
7. Don't use Change of Address unless a whole host is retired for good and will never move again.

## How we apply it to Cedwyn (PROPOSED, each change needs the project lead's GO; nothing changed in this run)
- PROPOSED A (the project lead, 2 minutes, his login): in Search Console request indexing for bucklerfamily.estate nomlecture.bucklerfamily.estate nomenclature.bucklerfamily.estate Only he can click it; the connected app cannot.
- PROPOSED B (agent, after GO): add a weekly "redirected hosts" check to the CEDWYN ONPAGE or visibility run: inspect the 30 old host homes, log verdict + googleCanonical to the project workspace; flag any host still "Submitted and indexed" after 4 weeks.
- Note for the morning brief: no action needed tonight beyond A; the apex fix itself is correct (path + query preserved, checked /documentary/, /ebooks/?x=1, /research/evidence/, www and http variants).

## Sources
- developers.google.com (read)
- developers.google.com (read: soft-404 home redirects; keep redirects >= 1 year)
- support.google.com Change of Address tool (read)
- developers.google.com (read)
- growandconvert.com (read; Circuit case)
- Go Fish Digital "temporary sitemap of redirected URLs" via page-indexing-triage-duplicates-canonicals.md (earlier run)
- Live: redirect sweep of 33 sitemap hosts and 3 URL Inspection API reads, 31 Oct 2026 ~19:58-20:00Z.