# Wales 3D world (section/wales-3d)

A browser 3D model of Llandough, Leckwith and the Cedwyn estate built only from open data, with Great House Farm (Tŷ Mawr) as the anchor.

- `index.html`, `wales-3d.js`, `wales-3d.css`: the page (three.js 0.170 from jsDelivr).
- `world-backend.js`: the `WorldBackend` interface — `init()`, `step(input)`, `steer(text)`, `getFrame()`, `getAudio()`. `ThreeBackend` is live; `Genie4Backend` is a stub behind `FLAGS.genie4 = false` that would call a Cloudflare Worker proxy (`/api/genie4`) holding the key server-side, seeded with a still from `getFrame()`.
- `data/`: preprocessed assets (every file under 400 KB): `dtm4m-XY.png` height tiles (h = (R·256 + G)/100 − 10 m), `cover2m.png` (R woodland, G paved, B water), `buildings-N.json`, `roads-N.json`, `rivers-N.json`, `trees.bin` / `shrubs.bin` (Int16 x·2, z·2, height·10), `parcels1841.json`, `world.json` (manifest).
- `tools/wales3d_build.py`: rebuilds every file in `data/` from the sources: `timeout -k 10 900 python3 tools/wales3d_build.py <workdir> <stewart-parcels.geojson>`.

Local frame: x = Easting − 317000, z = 174000 − Northing, y = metres above Ordnance Datum. Lat/lon to OS grid uses a least-squares fit on the 43 parcel centroids (max residual 0.7 m).

URL options: `?view=tymawr|church|ely|wide`, `?era=1841`, `?hour=16.5`, `?wx=rain|fog|overcast`.

Data: Welsh Government LiDAR 2020–22 (DataMapWales), Open Government Licence v3.0; © OpenStreetMap contributors, ODbL; Tithe H3 parcels.

Staging preview (Cloudflare Pages, rebuilt on every push to this branch): https://section-wales-3d.cedwyn-274.pages.dev/
