# Historic OS map "then and now" panels on heritage pages (NLS side-by-side format, self-hosted)

Topic: copying the format of the National Library of Scotland's georeferenced "side by side" and overlay viewers — the most-landed pages on the UK's biggest free historic-map site — as self-hosted then/now map panels on Cedwyn's internal pages, to raise time on page and give search engines and AI answers place-specific content. Harvested 31 Oct 2026, 18:1xZ. New ground: 'maps.nls', 'National Library of Scotland', 'side-by-side' (as a map viewer), 'old-maps' and 'maptiler' had 0 hits before this run. Distinct from tithe-map-storymap-georeferenced-parcels-linkable-asset.md (1840s tithe parcels as a StoryMapJS tour), google-earth-web-project-through-time-map-story.md and arcgis-storymaps-public-account-noncommercial-gate-view-benchmark.md (third-party hosted stories). This one is a small then/now panel on many existing pages, built from OS sheets of the 1870s-1940s.

## Evidence
- **Demand, with numbers (NLS case study in a Digital Preservation Coalition report, PDF read today):** the NLS maps website offers "over 250,000 historical maps", with "good coverage of Ordnance Survey maps of England and Wales". In 2022 it averaged "around 5,000 users, 10,000 user sessions, and 40,000 page views" a day.
- **The format is the draw (same report):** "The two most popular pages, for the Explore Georeferenced Maps viewer and Side-by-side viewer, are more frequently visited than the home page. Seven of the top twenty landing pages are for viewing georeferenced maps."
- **Who uses it (same report, user survey):** 75% of visitors are repeat users visiting more than 20 times a year; 78% visit for personal research; personal researchers want local history (80%), landscape history (53%), urban history (45%) and genealogy (42%). That is our reader.
- **Reuse terms (maps.nls.uk pages blocked our fetch with HTTP 405; from search previews only, not read):** the copyright page asks for the credit line "Reproduced with the permission of the National Library of Scotland" when map images are reused; the Historic Maps API page names a free tier for non-commercial subscribers up to 100,000 tile requests a month via MapTiler (an account and API key).
- **Deep links (NLS help, preview):** viewer URLs carry zoom=, lat= and lon= parameters, so a researcher can open the exact spot.
- **No case found** with before/after dwell-time numbers for a small heritage site adding map panels. The engagement claim rests on the NLS landing-page data above; our own test below is the proof.

## Rules that shape the build
- **No outbound links on Cedwyn**, so no links to the NLS viewer and no embedded third-party viewer. The panel is self-hosted.
- **Commercial site** (e-books are sold), so the non-commercial MapTiler tier does not fit, and it needs an account: skip it.
- **So use static images:** a crop of the relevant OS sheet (first edition 6-inch or 25-inch, 1870s-80s, plus a revision of c.1900-1920 and one of the 1940s if available) beside a modern view we are allowed to use (an OpenStreetMap render with "© OpenStreetMap contributors", or our own photograph). Old OS sheets more than 50 years old are generally out of Crown copyright (general rule; not checked against the NLS page). Carry the NLS credit line under every crop taken from their scans.

## How to do it
1. **Pick 6-10 pages** where place is the point: Great House / Tŷ Mawr, Llandough village, Leckwith, the River Ely crossing, Cogan, any page about field names or boundaries.
2. **For each, make one panel:** two images of the same extent and scale (about 800 x 600 px, WebP under 150 KB each), a CSS/JS swipe slider (no library, about 2 KB, keyboard accessible, works at 390 px), and a caption: sheet, edition, survey/revision year, scale, credit line.
3. **Text beside the panel, written from the map only:** what the map shows (buildings, field boundaries, tracks, names as printed) and what changed by the modern view. Say "shown on the 1880 sheet" rather than inferring tenure; a map is not a title record.
4. **Alt text and figure captions in plain words** so crawlers and AI answers can read the place facts (template: "<place> shown as <feature as printed> on the OS <scale> sheet surveyed <year>", filled only from the sheet itself).
5. **Link internally only:** each panel links to the chronology entry for that date and to the evidence page; the map pages link to each other as a "map trail".
6. **Measure (two weeks before vs four weeks after, same pages):** average engagement time and scroll depth (existing analytics / Clarity per clarity-heatmaps-recordings-uk-consent.md), slider interactions as an event, and Search Console impressions for place queries (Llandough map, Leckwith old map, Ty Mawr Llandough).

## How we apply it to Cedwyn
- **Now (no GO, no spend):** the next onpage or bizdev run lists the candidate pages and the OS sheets/editions that cover them (Glamorgan 6-inch sheets for Llandough-juxta-Penarth and Leckwith), and checks which scans exist and their stated reuse terms with a real browser (the plain fetch is blocked).
- **Build:** panels go in on a section branch or labelled PR (root merges); one page first as a pilot, then the rest if the pilot clears the test below.
- **Editorial:** neutral captions, no banned public words, no family holdings or addresses beyond the historic house already on the site, never name the project lead, Llandough Farm is not Great House Farm.
- **Kill test:** if the pilot page shows no gain in average engagement time (under +15%) and fewer than 10% of visitors touch the slider after four weeks, stop at one page.

## Sources
- dpconline.org (NLS maps usage, landing pages, survey; read)
- maps.nls.uk (the viewer; preview)
- maps.nls.uk (credit line; preview, page returned 405)
- maps.nls.uk (non-commercial free tier via MapTiler; preview, page returned 405)
- maps.nls.uk (zoom/lat/lon parameters; preview)
- data.nls.uk (about 30,000 maps scanned a year; preview)