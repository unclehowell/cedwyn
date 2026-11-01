# Estate maps: Tiles | 2D map | 3D, the 59 parcels and H3 (v1.0.0, 1 Nov 2026)

## What visitors see
On the landing page, the Wales and Patagonia modals open with a switch at the top: **Tiles** (the webapp grid, as before),
**2D map** (an illustrated, theme-park style map of the estate: every webapp is a numbered "ride" on its parcel; pinch or
scroll to zoom; zoomed in, each ride shows "NN of 59", its name and its H3 cell; tap to see it and open it) and **3D**
(the same estate in true metres: drag to turn, pinch to zoom out until the whole outline shows; **Walk** to go on foot,
drag to look, WASD/arrows or the on-screen stick; walking up to a parcel post shows its card). Patagonia shows the same estate
as the planned replica, labelled "planned". Parcels without a webapp yet show as "coming". The choice is remembered
(`localStorage cedwyn_map_view`); `?view=map|3d|tile` opens a view directly.

## Files
- `web/_cedwyn/parcels.json` - the one data file (schema `cedwyn_parcels/v1`): 59 parcels (no, "NN of 59", webapp area, path,
  status, centroid lat/lon, H3 cell at resolution 11 with parents r10/r9/r7, the cell's hexagon, placement `plan` or `schematic`,
  source and tolerance), the georeferencing record (control points, transform, RMS), the estate outline, the River Ely,
  the house and church, and the Parcel A/B outlines traced from the OS 25-inch sheet of 1900.
- `web/_cedwyn/parcels.geojson` - the same in GeoJSON (WGS84).
- `web/_cedwyn/estate-maps.js` - the switch and the 2D map (plain JS, no build step).
- `web/_cedwyn/estate-3d.js` - the 3D view (ES module; three.js 0.160 from the site's own `/_ext/` mirror, loaded only when 3D is chosen).
- `tools/halves.py` 1.4.0 - adds the one script tag to the landing page.

## Geometry and honesty
- Plan: the numbered estate plan of the parish of Llandough (parcels 1-59), identified as probably the 1824 Bute estate survey
  (Glamorgan Archives DB/E/1, plan 19). Georeferenced by a similarity transform on 6 control points (St Dochdwy's Church and
  five River Ely points from OpenStreetMap); RMS 25 m. The river has moved since, so the river points carry most of the error.
- Outline: the outer edge of the numbered parcels traced by eye from the plan; tolerance about ±50 m.
- Parcels: 30 positions read from the plan's number labels (±50 m, ±80 m where the reading is uncertain); 29 schematic
  (placed evenly inside the outline) until the plan is read at full resolution. No parcel shape is drawn until it is traced
  from a source; the maps show each parcel's H3 cell instead.
- Webapp N sits on plan parcel N. The webapp numbers come from `data/site-areas.json` (`serendipity_slot`); slots 38-59 are "coming".

## H3
Resolution 11 (about 25 m edge, 0.2 ha): the coarsest at which all 59 positions fall in 59 different cells. The whole estate is
one resolution-7 cell (`8719586b0ffffff`). Cells are precomputed offline (h3-js 4.1.0); no H3 library ships with the site.
To re-anchor (for the Patagonia replica or an on-the-ground view at Llandough) keep the shapes in metres from the church and
translate them; see the GEOPIN design note.

## Rules for agents
Update `parcels.json` only from a source; every coordinate keeps its `source` and `tolerance`. Argentina is always "planned":
no booking or money words in either map. Internal links only. Mobile first: check at 390 px, no horizontal scroll. - Sion's Tab agent
