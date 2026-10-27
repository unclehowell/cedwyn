# Site migration: redirect map + broken internal link crawl

Trigger: the project lead, 27 Oct 2026 14:27 GMT: "Fix all these bugs `That page did not open...`" (Cedwyn's migration fallback page). Harvested 2026-10-27.

## What the evidence states
- **Google Search Central, site moves with URL changes (read 27 Oct 2026):**
  - Use server-side permanent redirects (301 or 308).
  - Redirect each old URL straight to its final URL. Google follows up to 10 hops, but it advises keeping chains short: ideally no more than 3, and fewer than 5.
  - Do not send many old URLs to one irrelevant page such as the home page. That "might be treated as a soft 404".
  - Content that is truly gone should return 404 or 410.
  - Keep redirects "generally at least 1 year", and for users consider keeping them indefinitely. Redirects are slow, so update your own internal links to point at the new URLs rather than leaning on redirects.
  - Each new page needs a self-referencing canonical. hreflang annotations and the sitemap must list only new URLs.
- **Practitioner testimony:**
  - **Dana Hooshmand (hooshmand.net, read):** a niche reference site doing about 3,000 page views a day moved from .net to .com. It lost about 90% of its Google traffic "despite doing everything right" and took about 1.5 years to recover. Lesson: every avoidable loss (a broken link, a chain, a redirect to the home page) comes on top of a drop you cannot control.
  - **Reddit r/TechSEO (Oct 2025 B2B migration, snippet only):** a 98% traffic drop. Not checked.
- **Industry figure (secondary, not checked):** a study of 892 migrations with an average recovery of 523 days. It is quoted by agency blogs (whitehat-seo.co.uk, tabula.agency), and the original study was not read.

## How to do it (smallest safe sequence)
1. **Inventory old URLs.** Use the old sitemap(s), Search Console "Pages" plus the top linked pages, the Wayback CDX list for the old host, and every internal href in the current build.
2. **Map old to new in one CSV** (`old,new`), one row per URL.
   - Moved: the exact new page.
   - Merged: the consolidated page.
   - Gone: a 404 or 410, plus remove every internal link to it. Never redirect it to the home page.
3. **Implement as 301/308** in the host's redirect table (Cloudflare `_redirects` or Bulk Redirects; one line per row). No JS redirects and no meta refresh.
4. **Fix internal links at the source.** Rewrite the hrefs to the new URL so visitors and crawlers take no hop at all. Redirects are for outside links and bookmarks.
5. **Crawl and verify:**
   - `lychee` (installed, see below) over the sitemap or the built HTML for broken internal links.
   - `tools/redirect_map_check.py map.csv --base site` for every map row. It flags CHAIN, TEMP, WRONG, HOME, SOFT404 and DEAD.
   - Re-crawl until both report 0.
6. **After launch:**
   - Submit the new sitemap.
   - Watch Search Console "Not found (404)" and "Soft 404" weekly for 4 weeks.
   - Add map rows for any old URL that still gets hits.
   - Keep the table for at least a year.

## Tools
- **lychee 0.24.2** (Rust, MIT/Apache, free). Installed at `~/.local/bin/lychee` (19 MB binary).
  - Example: `timeout -k 5 110 ~/.local/bin/lychee --no-progress --max-concurrency 4 --include 'cedwyn\.bucklerfamily\.estate' --format compact <url or files>`
  - Box test 27 Oct: `/wales/docs/ghf_legalwiki/` gave 21 links, 21 OK, in 1.4 s.
  - Caveat: lychee only reads status codes. A fallback served as **200** passes. Cedwyn's fallback returns a real **404** (checked 27 Oct with a random path), so lychee does catch it today. If the router ever serves it as 200, use redirect_map_check's SOFT404 text check.
- **tools/redirect_map_check.py** (stdlib only, written this run). Box-tested against the live site.

## How we apply it to Cedwyn
- The broken-link worker (the project lead 14:27 ask) should build `the project workspace` from the old datro/theme paths and the crawl's 404 list, then:
  - write the rows into the site's redirect table (no chains: point old URLs at the final page, never at another redirect);
  - rewrite internal hrefs in the themes;
  - re-run lychee plus redirect_map_check until both are 0, logging the before and after counts.
- Never point dead evidence or record URLs at the home page. If the record moved, send it to its new artifact page. If it is truly gone, return a 404 and drop the links. The 404 page already carries the sales path (see `404-page-near-miss-redirects-money-link.md`).
- Outside links that pointed at old URLs: see `link-reclamation-unlinked-mentions-dead-urls.md` (part A).
- Add a lychee run to the DAILY SITE FLYWHEEL measure step, so a new break shows up within a day instead of when the project lead finds it.

## Sources
- developers.google.com (read 27 Oct 2026)
- hooshmand.net (read)
- reddit.com (snippet only)
- whitehat-seo.co.uk (892 migrations / 523 days; secondary, not checked)
- github.com (release v0.24.2)