# Archive snapshot pages (/wayback/) without SEO or copyright trouble
Harvested 2026-10-27 13:40Z, tied to the project lead's 13:01 rule: every outside link opens our own snapshot, then the Internet Archive link, then the live site.

## Facts read today
- **Google, duplicate URLs** (developers.google.com): rel="canonical" is the preferred signal for duplicates; Google does "not recommend using noindex to prevent selection of a canonical page within a single site" - but our snapshot copies duplicate *other people's* pages, so we don't want them competing at all. Cross-domain rel=canonical pointing at the original is supported as a hint.
- **Google, outbound links** (developers.google.com): plain links need no rel; rel="nofollow" for links you don't want associated with your site; sponsored/ugc for paid/user links.
- **Crown copyright** (nationalarchives.gov.uk ... /crown-copyright/): CDPA s.163; covers legislation, codes of practice, government reports, press releases; the **default licence is the Open Government Licence** (reuse allowed with attribution: "Contains public sector information licensed under the Open Government Licence v3.0"). Court rules on justice.gov.uk (e.g. CPR Part 31) are Crown copyright -> OGL reuse is fine with attribution.
- **Non-Crown pages** (newspapers, companies, societies): UK has no "fair use". CDPA s.30 allows fair dealing for criticism/review, quotation and news reporting, with sufficient acknowledgement, and only the extent required. Copying a whole third-party page is beyond "quotation" (publishing.co.uk). Not checked: any case law on archival snapshots by private sites.

## Recipe per snapshot page
1. `<link rel="canonical" href="ORIGINAL_URL">` (cross-domain hint) **and** `<meta name="robots" content="noindex, follow">` on every /wayback/<slug>/ page. Keeps copies out of search so they can't be flagged as scraped/duplicate and can't outrank the source; links inside stay crawlable.
2. Exclude /wayback/ from sitemap.xml. Do **not** Disallow it in robots.txt (Google must crawl to see noindex).
3. Header line on each snapshot: "Copy captured <date> from <domain> for reference. Original: <url>." Then the two links the project lead asked for: Internet Archive capture, then the live site, each `rel="nofollow noopener"`.
4. OGL material (gov.uk, justice.gov.uk, legislation.gov.uk, nationalarchives.gov.uk): full page copy allowed; add the OGL v3.0 attribution line.
5. Non-OGL material: keep the snapshot to the **passage we cite** (heading + relevant section + our citation), not the whole page; add "Quoted for review and reference (CDPA s.30)". Images: omit unless OGL/public domain.
6. Takedown line in the footer of /wayback/: a contact for rights holders; remove on request within 7 days. Log requests.
7. Size: strip scripts/trackers, Bootstrap fallback CSS vendored once and shared (not per page).

## How we apply it to Cedwyn
- Hand this file to the wayback worker (279a517c) / the next site flywheel: add canonical+noindex,follow to the snapshot template, drop /wayback/ from the sitemap, add attribution/takedown lines.
- Our own evidence pages keep indexing; only the copies are noindexed - so ranking signals stay on Cedwyn's own analysis pages (topic-clusters, cited-on back-links skills).
- Audit: `grep -L 'noindex' site/wayback/*/index.html` must print nothing; `grep -c '/wayback/' sitemap.xml` must be 0.

## Sources
- developers.google.com (read 27 Oct 2026)
- developers.google.com (read)
- nationalarchives.gov.uk (read)
- legislation.gov.uk ; publishing.co.uk (snippets)