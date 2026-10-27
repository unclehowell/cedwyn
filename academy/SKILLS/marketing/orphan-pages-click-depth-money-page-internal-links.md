# Orphan pages and click depth: point internal links at the money page
Harvested 2026-10-27 07:44Z. Tool: `tools/orphan_depth_audit.py` (stdlib, written this run, nothing installed). Complements topic-clusters (hub <-> cluster links) and glossary (anchor text); this one is the whole-site reachability check.

## What the evidence states
- **Google (quoted by Ahrefs, "How to Find and Fix Orphan Pages"):** Google finds pages "by many different methods, but the main method is following links from pages that we already know about". A page that is not in the sitemap and has no links "Google will not find or index". Even when found via the sitemap, an orphan gets no PageRank from the site.
- **Ahrefs:** orphans usually come from migrations, navigation changes and redesigns. Method: compare the crawlable URL list (links from home) with the sitemap and with URLs that get visits. Pages in the sitemap but never linked are flagged "Orphan page (has no incoming internal links)" in its free Site Audit (Ahrefs Webmaster Tools, free for verified sites; signing up needs the site owner, so we use our own script).
- **Practitioner numbers (secondhand, not checked against the originals):** Ninja Outreach reported organic traffic growth of over 40% from an internal-linking project; InLinks moved a 400-word article from 18th to 8th with no new backlinks, by internal links alone (both via embarque.io's orphan-pages write-up).
- **Reddit r/TechSEO practitioners:** if an orphan page is not worth a link, take it out of the sitemap (or noindex it) rather than leave it orphaned. Every sitemap URL should be either linked or removed.

## How to do it
1. **Crawl from home:** `python3 tools/orphan_depth_audit.py site --limit 400 --workers 4` (about 1 minute per 300 pages, polite). It prints:
   - sitemap URLs not reached from home (orphan or too deep), grouped by section;
   - the click-depth histogram (target: money pages at depth 1, everything important <= 3);
   - depth and inbound internal-link count for the key pages;
   - pages reached by links but missing from the sitemap.
2. **Separate "orphan" from "deep":** rerun with a higher `--limit` or `--prefix /section/`. Anything still unreached is a true orphan.
3. **Fix in this order:**
   - Money page first: the shop/buy page should be linked from every template (header or footer nav) and from contextual "read the e-book" lines on the most-visited pages.
   - True orphans worth keeping: link from the section hub and one related page, with descriptive anchor text.
   - Orphans not worth keeping: drop from the sitemap or noindex. Do not delete evidence pages.
   - Reached-but-not-in-sitemap pages that should rank: add to the sitemap. Machine-facing pages that should not rank: leave out, keep noindex.
4. **Plain `<a href>` in the HTML.** The script does not run JavaScript; Google can render JS, but links that only appear after scripts run are the risky path.
5. **Re-run after every site-wide template change** (nav, header, read-more component) and log it with `tools/annotations_log.py`.

## How we apply it to Cedwyn (live crawl 27 Oct 2026 07:43Z, 300 pages from home)
- **Money page is under-linked:** /ebooks/ is 1 click from home but has only **6 inbound internal links** in the crawl sample, against **270 for /research/** and **269 for /academy/**. /shop/ has 4. /movie/ has 1. PROPOSED: a site-wide "E-books, first editions free" link in the shared header/footer, plus one contextual line at the foot of each research artifact page pointing to the matching e-book. This is the cheapest sales lever on the site: the research pages are where search visitors land.
- **64% of sitemap URLs (3,293 of 5,137) were not reached within 300 pages.** Biggest groups: /docs/ 2,045, /wiki/ 357, /directory/ 309, /wayback/ 215, /research/ 142, /projects/ 111, /ebooks/ 10. Most are likely deep, not orphaned. Next on-page run: rerun per section with `--prefix` and a higher limit to find true orphans.
- **537 URLs are linked but not in the sitemap**, mostly /academy/ pages. The academy is machine-facing; confirm they should stay out of the sitemap (and are noindex) rather than adding them.
- **Depth is fine overall:** discovered pages sit at depth 1 (16), 2 (483), 3 (1,881).
- **Nothing committed:** header/translator, read-more and player workers are using the cedwyn repo. The header link is a natural add-on for the header worker or the Wednesday on-page run. PROPOSED only.

## Sources
- ahrefs.com (quotes Google's "How Search works")
- ahrefs.com
- ahrefs.com (free for verified sites)
- reddit.com
- embarque.io (Ninja Outreach and InLinks figures, secondhand)
- developers.google.com