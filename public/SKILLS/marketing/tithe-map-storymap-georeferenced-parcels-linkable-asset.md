# Tithe-map story map: a georeferenced 1840s map tour of the parcels (StoryMapJS + Map Warper, free)

Topic: turn the Llandough tithe map and our 1841 parcel register into an interactive, linkable "map that tells a story" on Cedwyn. It doubles as a search and backlink asset for family historians and local-history groups. Harvested 29 Oct 2026, 23:59Z.

New ground: before this skill the index had 0 hits for 'georef', 'map warper', 'historic map' and 'storymap'. It complements timelinejs-self-hosted-interactive-timeline-linkable-asset.md (time axis), historypin-tour-archive-pins.md (third-party pins) and komoot-highlights-public-route-heritage-walk.md (the walk). This skill covers the place axis on our own site.

## Evidence (read)
- **Archives Wales, Cynefin project page:**
  - 2014-17 project. Repaired and digitised 1,100+ Welsh tithe maps at NLW.
  - Volunteers transcribed about 27,000 apportionment entries, linked to field numbers.
  - 300,000+ entries are searchable on the Tithe Maps of Wales (Places of Wales) site.
  - Funded by HLF Wales and Welsh Government.
  - So family historians already search tithe field numbers. That is the demand we serve.
- **Collections Trust, "Sense of place – tithe maps":**
  - NLW stitched the map images and had volunteers geotag them into "an interactive historic and modern map".
  - Crowdsourced transcription made the maps searchable.
  - Takeaway: a historic map overlaid on a modern one is the format the sector itself chose.
- **Knight Lab StoryMapJS** (home + Advanced pages):
  - Free and open source, from Northwestern Knight Lab. One slide per place.
  - "Gigapixel" mode shows big images such as historic maps, but needs the image tiles on our own web server.
  - Self-hostable: JSON data plus storymap.css/js. The data must be same-origin or CORS-enabled.
  - Their guidance: no more than 20 slides; choose stories with a strong location narrative; "include events that build up to major occurrences".
  - StoryMapJS is still beta, so pin the version you host.
- **Programming Historian** (Hayes & Partlow, peer-reviewed, CC-BY 4.0): a step-by-step method:
  - Georeference the scan in Map Warper.
  - Export the Tiles (XYZ) URL.
  - Use it as StoryMapJS's map_type.
  - Add one slide per location, remove the route lines and set custom markers.
- **Map Warper** (mapwarper.net): free, open-source, donation-funded georeferencer. Exports WMS, tiles, GeoTIFF and KML.

## How to do it
1. **Rights first.** Use a tithe-map image we may reuse. Check the NLW reproduction and reuse terms for the Llandough and Leckwith tithe map before publishing (the NLW page returned 403 to the box; not checked). Fallback: a 19th-century OS map out of copyright. Credit the holder on every slide.
2. **Georeference** in Map Warper. Use at least 6-8 control points on features that still exist: church, road junctions, river bends. Check the error and export Tiles (XYZ).
3. **Self-host.** For durability, copy the tiles or a GeoTIFF-derived tile set to our own static host. Keep it small: only the zoom levels needed, as webp. Disk is tight, so build in /tmp and delete after upload. Map Warper's server is donation-run; hotlinking it is fragile.
4. **Story JSON**, max 20 slides:
   - Slide 1 is the overview.
   - Then one slide per parcel or field: tithe number, field name, 1841 occupier and use (from the apportionment), and what stands there now.
   - Link each slide to its evidence page on Cedwyn (our archived copy, never the external site).
   - Build-up events count as well as headline ones.
5. **Embed** at /research/tithe-map/. Give the page a descriptive title, an og:image of the map and plain text of every slide below the map, so search engines and AI crawlers can read it. The JS map alone is invisible to them.
6. **Promote:** let local-history groups and family historians embed or link it (the existing admin-partnership and Historypin skills cover outreach, rules-first). It is a resource, not an ad.

## Success measures
- Referring domains and backlinks to /research/tithe-map/ (Search Console Links).
- Search impressions for "Llandough tithe map" and field names.
- Clicks from slides to evidence pages and to the free documentary.

## How we apply it to Cedwyn
- **Data:** the project workspace (36 parcels from the 1841 register) is the slide list. Cap at 20: the farm parcels first, then the neighbours that explain the boundaries.
- **Neutral, dated wording** per the editorial rules:
  - Each slide states what the 1841 apportionment records.
  - Parcels we cannot place say "parcel not identified" (the standing parcel rule).
  - No accusations, no family holdings or addresses, never the project lead's name, no banned words.
- **Links:** to our own wayback/evidence copies, with the external and Internet Archive links beneath, per the 22:14 rule.
- **Cost and tools:** zero spend. No install needed: StoryMapJS loads from static files we host (~1-2 MB) and Map Warper is a website. This run installed nothing (1.8 GB free).
- **Approval:** a proposal for the site worker. Publishing a new public page follows the existing site flywheel and approval path.

## Sources
- archives.wales
- collectionstrust.org.uk
- storymap.knightlab.com and storymap.knightlab.com
- programminghistorian.org
- mapwarper.net