# Geograph modern photos (CC BY-SA 2.0) for then-and-now and place shots, the legal way (2026)

Topic: using Geograph Britain and Ireland's photos of Llandough, Leckwith and Penarth for "then and now" comparisons, maps, walk leaflets and e-book place shots, without breaking Geograph's 2026 access rules or the ShareAlike licence.

## What the sources show (read 30 Oct 2026)
- **Licence:** every Geograph photo is licensed by its photographer under Creative Commons Attribution-ShareAlike, **commercial use allowed** (Geograph "Freedom" manifesto, read). Older files are CC BY-SA 2.0. It is **not CC BY**: ShareAlike applies.
- **Geograph's own reuse conditions** (API help page, read): show the photographer's credit beside the image; state that it is Creative Commons licensed; if you *adapt* the image the new work must also be CC licensed (ShareAlike); ideally link to `geograph.org.uk`.
- **No scraping, in capitals.** The API page and robots.txt (both read) prohibit scraping web pages and tell AI agents to honour robots.txt and to ask their user to request an API key (`/get-api-key.php`) for live search. Bulk work goes through the free daily dumps at data.geograph.org.uk. `/search.php`, `/near/...` and `/map/` are disallowed in robots.txt.
- **Default size is screen resolution** (up to 640 px; larger only if the photographer opted in), per the manifesto. Fine for web and social, usually too small for print.
- **The no-key route already exists:** many Geograph photos are copied to Wikimedia Commons with the licence, author and Geograph id in the file name. A Commons API file search run today found **129 files** for "Llandough geograph" and **308** for "Leckwith geograph" (search hit counts, not de-duplicated). Example: *Church of St Dochdwy, Llandough (geograph 7023967)*, 1600x1200, CC BY-SA 2.0, Colin Cheesman, 4 Nov 2021; *Leckwith Woods (geograph 5822984)*, 640x401, Derek Harper, 15 Jun 2018 (Commons imageinfo, read).
- Openverse lists Geograph as a source with about 1.09M images (already in openverse-commons-discovery-and-view-metrics.md), so it's a second keyless search route.
- Practitioner numbers on engagement lift from then-and-now posts were not found this run; treat the format's value as **not checked**.

## How to do it
1. **Search Commons, not Geograph.** Use the Commons API: `action=query&list=search&srnamespace=6&srsearch=<place> geograph`, then `prop=imageinfo&iiprop=extmetadata|size|url` to read LicenseShortName, Artist, DateTimeOriginal and width. No key, no scraping. Throttle to 1 request/s with a User-Agent.
2. **Only if Commons lacks the shot**, a Geograph API key is needed. That's a free account request the owner would make. Never fetch Geograph HTML pages or search pages from the box.
3. **Check the place before use.** "Llandough" has two places in the Vale: Llandough near Penarth (ours) and Llandough near Cowbridge. Check the grid reference (around ST1673 for Penarth-side Llandough; not checked) or the coordinates in Commons metadata.
4. **Credit line, every time, next to the image:** `Photo: <Author>, CC BY-SA 2.0, geograph.org.uk On Instagram/Facebook put it in the caption *and* as small text on the image. In the e-book put it under the image and repeat it in the picture credits.
5. **ShareAlike decision per use:**
   - **Unaltered image placed in a page, post or e-book** (a "collective work" in CC 2.0 terms): our page/book stays under our own terms; only the photo carries CC BY-SA. This is our reading of the 2.0 legal code, not re-read today.
   - **Adapted image** (a then-and-now split, crop with text, colour grade, overlay): the composite must be released CC BY-SA 2.0 and labelled so. Keep our archive half (public-domain scan) and the Geograph half credited separately on the image.
6. **Date it.** Show the photo date ("2021") in the caption so the "now" half is honest; prefer the most recent shot of the same view.
7. **Log it** in the image register: Commons title, Geograph id, author, licence, date, size, where used, adapted yes/no.

## How we apply it to Cedwyn
- **Then-and-now pairs for the public areas only:** St Dochdwy church, the Llandough Hill track, Leckwith Woods and the old Leckwith Bridge, paired with public-domain archive views of the same spots. These fit the Wales tour project (Llandough church view close / woods, public areas) and the walk leaflet.
- **Never use a modern photo that shows a private house or garden, or one that could be read as Great House Farm / Cydfin Farm land, unless the archive record places it.** Llandough Farm is not the farm: any Geograph shot of it goes only into Kissed Frogs (KF-35), labelled that way.
- **No family holdings or addresses** in captions. Use place names at street or landmark level only.
- **Pilot:** 3 pairs (church, Leckwith bridge, woods), built as composites, each released CC BY-SA 2.0 with both credits. Post one per week as an Instagram carousel (archive slide, then today's slide) and add each pair to its evidence or place page.
- **Measure:** saves and shares per 1,000 views against our 4-week median for carousels. Keep the format if 2 of 3 beat the median; drop it if none do.
- **Print:** check pixel size first. Most Geograph copies are 640 px, too small for the A5 leaflet at 300 dpi; use only files 1600 px or larger, or ask nobody (outreach is on hold).
- Proposal only until the next BIZDEV plan picks it up; nothing posted by this run.

## Sources
- geograph.org.uk (licence, commercial use, 640 px default; read)
- geograph.org.uk (reuse conditions, no-scraping policy, API keys, dumps; read)
- geograph.org.uk (read)
- data.geograph.org.uk (bulk dumps; read)
- creativecommons.org (snippet)
- commons.wikimedia.org (search + imageinfo queries run 30 Oct 2026)