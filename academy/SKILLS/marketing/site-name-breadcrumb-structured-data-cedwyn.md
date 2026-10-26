# Site name + breadcrumb structured data for Cedwyn (Google result labels)

Skill harvest, 26 Oct 2026. Topic: what Google prints above each result (site name, then a breadcrumb trail instead of a raw URL), and the two small pieces of markup that steer it. Markup only; no body text or design change.

## What the primary sources state (read 26 Oct 2026)
- **Site names (Google Search Central, "Site names in Google Search").** Google generates the name automatically from the home page and references to it on the web. To state a preference, add `WebSite` structured data **to the home page** with `name` (and optionally `alternateName`, e.g. a shorter form or the bare domain as a fallback).
- **Only home pages count.** Supported: `example.com`, `www.`, `m.` and subdomain home pages such as `news.example.com`. **Not supported:** a subdirectory "home" like `example.com Markup on `/ebooks/` is not read for the site name.
- **Subdomain fallback.** If a subdomain home page has no `WebSite` data, Google may reuse the domain-level name. With many `*.bucklerfamily.estate` hosts, each subdomain home page needs its own name or it may inherit the apex name.
- **Consistency.** The page title, `og:site_name`, the home-page heading and the markup should all use the same name; duplicate home pages (http/https, www/non-www) must canonicalise to one.
- **Breadcrumbs (Google, "Breadcrumb (BreadcrumbList) structured data").** A `BreadcrumbList` needs **at least two** `ListItem`s, each with `position`, `name` and `item` (URL; the last item may omit it). Google may show the trail in place of the URL path in the result. It should reflect a real path a visitor would take, not every possible path.
- Agency case evidence that breadcrumbs on hub/cluster pages help topical structure is already in `topic-clusters-place-pages-local-history.md`; this file is the markup routine only.

## Live check of Cedwyn (read-only, 26 Oct 2026, cache-busted GET)
- **Home page** `cedwyn.bucklerfamily.estate/`: title "Cedwyn Estate · Wales and Patagonia"; JSON-LD types present: `Audience`, `WebPageElement` only. **No `WebSite` markup and no `og:site_name`.** So Google picks the site name on its own.
- **/ebooks/**: has `WebSite`, `Organization`, `ItemList`; `og:site_name` = "Great House Farm e-books". This `WebSite` block sits on a subdirectory, so it does not set the site name, and it names the site differently from the home title.
- **Breadcrumb markup:** none found on either page.
- How Google currently labels Cedwyn results: not checked (needs a live results read or Search Console).

## How to do it (30 minutes, markup only)
1. Pick ONE site name for the cedwyn host, e.g. `Cedwyn Estate`, with `alternateName` `["Cedwyn", "cedwyn.bucklerfamily.estate"]`. The choice of name is a PROPOSAL for the owner.
2. Put this on the home page only:
```json
{"@context":"schema.org","@type":"WebSite","name":"Cedwyn Estate",
 "alternateName":["Cedwyn","cedwyn.bucklerfamily.estate"],"url":"cedwyn.bucklerfamily.estate
```
3. Add `<meta property="og:site_name" content="Cedwyn Estate">` site-wide; on `/ebooks/` either drop the `WebSite` block or make its `name` match (keep `Organization` and `ItemList`).
4. Add a `BreadcrumbList` to every section page from the shared layout, built from the URL path, matching a visible breadcrumb line (visible trail first; markup should describe what is on the page):
```json
{"@context":"schema.org","@type":"BreadcrumbList","itemListElement":[
 {"@type":"ListItem","position":1,"name":"Cedwyn Estate","item":"cedwyn.bucklerfamily.estate
 {"@type":"ListItem","position":2,"name":"E-books","item":"cedwyn.bucklerfamily.estate
 {"@type":"ListItem","position":3,"name":"<page title>"}]}
```
5. Validate 3 URLs in Google's Rich Results Test, then request indexing of the home page in Search Console. Expect days to weeks before the label changes; Google may still choose another name.
6. Watch: Search Console > Enhancements > Breadcrumbs (valid items count) and the label on a `site:cedwyn.bucklerfamily.estate` search, weekly for 4 weeks.

## Pitfalls
- Do not mark up a breadcrumb trail that is not shown on the page.
- Do not put the same `WebSite` name on every subdomain if they are meant to be distinct sites; each subdomain home page states its own.
- A home page blocked from crawling gets no site name at all.

## How we apply it to Cedwyn
- This is a markup-only fix, the class the weekly CEDWYN ONPAGE run may apply itself (no body text or design change). It is still not done this run: no commit to the cedwyn repo. Hand to the ONPAGE run (Wed 13:30) as a ready patch: home `WebSite` block, site-wide `og:site_name`, `/ebooks/` name aligned, layout-level `BreadcrumbList` + a small visible trail (the visible trail is a design change, so PROPOSAL).
- The site name itself ("Cedwyn Estate" vs another form) is the owner's choice: PROPOSAL.
- Success measure: Breadcrumbs report shows valid items on 100+ pages within 4 weeks; results show the chosen name.

## Sources
- developers.google.com (read 26 Oct 2026)
- developers.google.com (read 26 Oct 2026)
- schema.org
- Live pages: cedwyn.bucklerfamily.estate and /ebooks/ (read 26 Oct 2026)