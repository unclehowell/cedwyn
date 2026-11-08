# Changelog — Wales 3D world

| Version | Date | Change |
|---|---|---|
| 0.4.0 | 8 Nov 2026 | The title line in the top bar (Llandough & Leckwith) is replaced by two show/hide toggles, 'Uber H3' and 'buildings' (● on, ○ off). H3 cells now start at resolution 14 (the default) and count up to 15; resolutions 10–12 are gone. The cells are computed in the browser with h3-js 4.1.0 (vendor/, Apache 2.0) and drawn as lines draped on the LiDAR ground round the view centre (about 200 m at res 14, 75 m at res 15), so no cell files are added. Lat/lon to the local frame uses a quadratic fit on the corners of the earlier res-11 cells (0.07 m max residual). Tapping a parcel gives its res-14 cell count. URL options ?h3=0, ?bld=0, ?h3res=15. |
| 0.3.3 | 8 Nov 2026 | three.js through an import map onto the vendored three r160 (/_ext/ on cedwyn.bucklerfamily.estate), Sky and BufferGeometryUtils vendored in vendor/. The +esm CDN paths are gone: the site build stored them with no file type, so browsers refused them as modules and the world could not start inside the main site. Now also served at /terrain/ and the Wales hub's 3D map tile (cedwyn#528). |
| 0.3.2 | 7 Nov 2026 | Site header: this page is webapp 31 of 59 (Virtual Tour · Wales, /wales/ opens it). One line before ghf-boot.js tells the shared header which webapp it is on, so it shows "31 of 59" with ‹ to 30 and › to 32 (cedwyn#497, cedwyn#351). Header only. |
| 0.3.1 | 6 Nov 2026 | Served at bucklerfamily.estate/wales-3d/ straight from this repo's main (Worker bfe-wales-3d, source worker/bfe-wales-3d.js). Record links without a page now open the catalogue at its path, bucklerfamily.estate/catalogue/, instead of the old subdomain. |
| 0.3.0 | 6 Nov 2026 | Own data store: data/central.json holds the catalogue fields (ID, title, date, status, page) of the records the 1841 layer rests on (EV-0211 Stewart survey plan 1824, EV-0215 tithe apportionment c.1841), listed in data/sources.json and pulled read-only from the central catalogue every 6 hours by tools/sync_central.py (.github/workflows/sync-central.yml). Tapping a parcel now lists those records with links to their catalogue pages. |
| 0.2.1 | 5 Nov 2026 | Parcels moved onto the ground: the layer now uses the re-aligned Tithe H3 geometry (v0.2.0 carried an older copy that sat 48–117 m off, RMS 86.5 m; now RMS 6.8 m on 7 fixed control points); tithe 209 Courtyard &c (the house and yard, under the modern Church View Close) added; church label on St Dochdwy's; house label Tŷ Mawr (Great House); ?cam= review cameras |
| 0.2.0 | 4 Nov 2026 | Always clear: weather menu, fog, haze and rain removed; camera far plane 12 km → 40 km, zoom-out 5.2 km → 9 km, so the whole 4 × 4 km area is crisp when zoomed out; H3 cell layer (res 10 / 11 / 12) and the Cedwyn estate plan parcels draped on the ground, each with its own show/hide box in Layers → Parcels (59), All / None, tap a parcel for its details; Whole estate view |
| 0.1.0 | 4 Nov 2026 | First real-terrain world (below) |

## 0.2.1 — 5 Nov 2026
- Cause of the misfit: the v0.2.0 parcel and H3 data were built from a copy of the Tithe H3 parcels saved before the 2 Nov ground re-alignment. That copy was shifted north-west, rotated about 5° and about 13 % too small, so parcels near the River Ely sat up to 117 m off and plan parcel 10 appeared to cross the river.
- Fix: parcels59.json, parcels1841.json and h3cells.json rebuilt from the re-aligned geometry (Tithe H3, data/stewart-parcels.geojson). Parcel shapes are unchanged; only placement moved (one affine, max difference from the Tithe H3 file 0.2 m).
- Control points (before → after, metres): St Dochdwy's Church 83.1 → 5.6; Cwm Cydfin stream mouth at the Ely 52.9 → 4.7; Ely loop apex round parcel 10 105.6 → 7.4; Ely north-west bend 75.9 → 11.2; Ely first bend 80.5 → 5.3; Cwm Cydfin north curve 75.4 → 6.1; field boundary at Penlan Road 116.7 → 5.3. RMS 86.5 → 6.8 m. Reference: OpenStreetMap and the OS six-inch 2nd edition.
- The modern Ely channel round parcel 10 is wider than the parcel's 1841 outline (the parcel's north tip stops about 70 m short of today's loop apex); whether the channel has moved since 1841 is not checked.
- Tithe 209, Courtyard &c (3R 13P; landowner the Marquess of Bute, occupier John Williams, as entered), added as its own parcel: re-traced from the tithe map (Tithe map, National Library of Wales, Places of Wales item 4622411), placed by 18 tithe numbers of parcels already on the layer (RMS 13 m), traced 0.79 ac against 0.83 ac entered. It lies under the modern Church View Close. Its plan (c.1824) number is not read.
- Church label and anchor: St Dochdwy's Church (OSM), not the Baptist chapel 0.9 km south. House label: Tŷ Mawr (Great House).
- Review cameras: ?cam=x,z,distance,elevation,azimuth.

## 0.2.0 — 4 Nov 2026
- Clear sky only. The weather choice is gone; no fog, haze or distance fade at any zoom. The sun still follows the real time at Llandough when it is more than 12° up; otherwise the view opens at midday (Now restores real time).
- Camera: far plane 40 km with a near plane that follows the camera height; zoom out to 9 km; new Whole estate view; estate and parcel views look north like a map.
- H3 layer (on by default, thin white lines): res 11 over the estate and 300 m round it, res 10 the same box, res 12 inside the parcels. Cells from h3 4.x on the same parcel geometry as the Tithe H3 section.
- Parcels (59): plan numbers 1–59 of the c.1824 estate plan as traced in Tithe H3 v0.5.0. 43 drawn polygons (1–4 as one homestead group, 5–17, 19–45, unread A and B), each its own colour and show/hide box; 18 and 46–59 are listed as not placed, since no outline exists for them. Tap a parcel on the ground for plan number, 1841 tithe plot, land use, areas, occupier and landowner as entered, H3 cell counts and grid reference.
- Data: data/parcels59.json, data/h3cells.json (tools/parcels_h3_build.py).

## 0.1.0 — 4 Nov 2026
- New real-terrain world of Llandough, Leckwith and the Cedwyn estate (4 × 4 km, OS grid ST 15–18 / 72–75), alongside the existing Terrain world (kept on the `legacy` branch of unclehowell/terrain; nothing deleted).
- Terrain: Welsh Government LiDAR 2020–22 1 m DTM, resampled to 4 m (1000 × 1000), as four PNG height tiles.
- Contours drawn on the terrain: every 2 m, bold every 10 m. Relief slider (×1 to ×3).
- 6,534 OpenStreetMap buildings extruded, heights from OSM tags or LiDAR (DSM − DTM); pitched roofs on small four-sided buildings.
- 18,651 trees and 15,675 hedge/scrub points from LiDAR canopy heights; roads, rivers (River Ely), woodland and water from OSM.
- Sun and sky from the real date and time at Llandough; time slider; clear / overcast / rain / fog; fog.
- 1841 layer: the 43 Tithe H3 parcels (Stewart plan via the 1841 tithe map) draped on the ground by land use, modern buildings faded.
- WorldBackend interface (ThreeBackend live, Genie4Backend stub, flag off); "steer the world" text box (local parser); procedural sound (wind, rain, River Ely, church bell on the hour).
