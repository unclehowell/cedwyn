# Topic clusters and place-name pages for a local-history archive (without doorway pages)
Harvested 2026-10-26 (skills harvest). Topic: SEO for the local-history long tail: hub + cluster pages, place-name pages that stay on the right side of Google's spam policies.

## What the practitioner evidence shows
- **Topical depth beats breadth (Dani Leitner, Moz, travel blog case study).** 30 of 125 posts (24%) were about one topic (Interrail); those 30 drew 1.8K of 2.6K average monthly clicks (~70%) and 73.8K of 117.7K impressions over 16 months. The other 95 posts got 800 clicks/month. Her first deep post (four months of research, five original routes nobody else offered) ranked on page one within a day of publishing on a site with Domain Authority ~2, and every later post in the same topic indexed fast and ranked; off-topic posts "never ranked on page one". She did no link building beyond two blog directories.
- **Hub + cluster structure (Minuttia agency case study).** One hub page (overview, table of contents linking every cluster page, H2 per subtopic, breadcrumbs, author info) plus cluster pages in sub-folders under it. With no link building at all, the cluster ranked for 1.1K+ keywords (Ahrefs) and brought ~100 organic clicks per weekday; the hub started to show for the head term. Their lessons: satisfy the search intent (long isn't enough); build a cluster page for every semantically related subtopic even when tools show zero volume; internal links with descriptive anchors matter more as the cluster grows.
- **The line not to cross (Google Search spam policies, "Doorway abuse").** Examples Google lists: "multiple domain names or pages targeted at specific regions or cities that funnel users to one page" and "substantially similar pages that are closer to search results than a clearly defined, browseable hierarchy". Place pages are fine only if each one carries its own records; a template with the place name swapped is a doorway.

## How-to (one cluster at a time)
1. **Pick one cluster per month.** One topic the archive can cover more deeply than anyone else (Leitner's test: would the top results be improved on by what only we hold?).
2. **Map it.** Hub = the topic overview. Cluster pages = one per distinct sub-question a searcher has (a place, a record series, a period, a named document type). Check volume in Search Console queries, but keep subtopics with zero tool volume when they are semantically part of the topic.
3. **URL architecture.** /<hub>/ and /<hub>/<cluster>/. Breadcrumbs on every cluster page. The hub links every cluster page from a table of contents; every cluster page links back to the hub and to 2-3 siblings with descriptive anchors (the place or record name, never "click here").
4. **Unique substance per page (the doorway test).** Each place or record page needs at least: its own primary source(s) with references, a dated fact or timeline unique to it, an image or map extract with alt text, and an answer to the page's question in the first paragraph. If two pages would share more than ~70% of their text, merge them into one page with sections.
5. **Language versions.** Welsh/Spanish versions are separate pages with hreflang, written natively, not one template with swapped words.
6. **Measure (after 4-8 weeks).** Search Console, filter by the /<hub>/ folder (Leitner's method: keep the topic in the URL so it filters): clicks, impressions, queries per page. Feed positions 5-20 into the striking-distance routine (gsc-striking-distance-quick-wins.md).
7. **Audit links.** Run `python3 tools/cluster_links.py <hub-url>`: lists cluster pages under the hub path in the sitemap and flags any the hub does not link to, and any that do not link back.

## How we apply it to Cedwyn
- **First cluster candidate: Llandough-juxta-Penarth place names** (Tŷ Mawr / Great House Farm and its neighbours): hub = the place and its names over time; cluster pages = each map edition or record series that names it, each with its own reference (e.g. County Series Glamorgan 47 NW, OS name books at TNA OS 35/2503), extract and date. This doubles as the unambiguous location page the archive keeps needing (the CF64 Llandough near Penarth, not the CF71 Llandough near Cowbridge), which is genuine search demand and real-world confusion.
- **Second: title chain** (one cluster page per conveyance or judgment, hub = /title-chain/), linking each page to the matching e-book anchor on /ebooks/ via the header upsell strip.
- **Patagonia/Wales pair** only where we hold distinct records for each place; no template pages for Chubut towns we hold nothing on.
- Keep the topic word in the URL folder so Search Console can filter it; internal links carry no UTMs.
- Rules: public text never names the project lead; banned words list applies; no insignia. Site changes go to the sole cedwyn committer as a patch.

## Sources
- Dani Leitner, "Topical authority case study", Moz blog: moz.com
- Minuttia, "A topic cluster that ranks for 1000s of keywords (case study)": minuttia.com
- Google Search Central, Spam policies (doorway abuse): developers.google.com