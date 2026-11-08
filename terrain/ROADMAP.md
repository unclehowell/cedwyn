# Wales 3D world — roadmap (after v0.1.0, 4 Nov 2026)

Done in v0.1.0: real LiDAR terrain, contours, OSM buildings/roads/rivers/woodland, LiDAR trees and hedges, sun/sky/fog/weather, 1841 tithe layer, credits, WorldBackend + Genie4 stub, local steering box, procedural sound.

Next, in order:
1. Live on cedwyn.bucklerfamily.estate/wales-3d/ (theme PR merge + build).
2. Terrain detail: 1 m DTM tiles near Tŷ Mawr (quadtree LOD, streamed from R2), KTX2 ground textures, real hedgerow lines from OSM barrier=hedge and LiDAR.
3. Buildings: glTF (Draco) for Tŷ Mawr from the 1974 RCAHMW measured plan (geometry already in the /wales/ wireframe work), the church, and farm ranges from the OS 25-inch c.1900 map.
4. Era layers: OS c.1900 drape, 1841 tithe map raster drape, era-correct building sets (only those evidenced on each map).
5. Audio: CC0 recordings (rooks, sheep, A4232 traffic by distance), Opus loops; footsteps by surface from roads-N.json.
6. Steering via an LLM: Worker + Workers AI turns text into the same validated JSON patch `applyPatch` already takes; spawn (sheep), camera paths.
7. NPCs: persona JSON grounded only in site wiki pages (RAG), dialogue via Workers AI with the hybrid proxy fallback, KV cache, SpeechSynthesis cy/en voices, jaw flap from amplitude, subtitles always on.
8. Physics: Rapier (WASM) walking controller on the heightfield, gates/doors, water.
9. Nested child worlds (farmhouse interior, a memory scene), depth ≤ 3, state in localStorage, breadcrumb UI.
10. Genie 4: Worker proxy (key as secret, per-IP rate limit, cache), pre-rendered clips from R2 as cutscenes.
