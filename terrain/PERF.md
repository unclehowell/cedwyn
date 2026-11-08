# Performance budget — v0.1.0

| | Phone (≤700 px) | Desktop |
|---|---|---|
| Download (first visit) | ~3.6 MB data + 0.7 MB three.js | same |
| Largest single file | 380 KB | 380 KB |
| Terrain mesh | 256² cells, 131k tris, dense in the centre (≈5 m), ≈30 m at the edge | 384², 295k tris |
| Trees (LiDAR) | 7,000 nearest the estate, 20 tris each | 18,651, 80 tris + trunk |
| Hedges / scrub | 3,500 | 15,675 |
| Buildings | 6,534 merged, ~258k tris | same |
| Triangles per frame | ~600k | ~2.5M |
| Draw calls | 7–8 | 9–10 |
| GPU textures | height 1000² half-float, cover 2048² | same |
| Pixel ratio | starts 1.5, steps down to 0.75 while fps < 28 | starts 2 |

Measured 4 Nov 2026 in headless Chromium with software WebGL (SwiftShader, no GPU) at 390 × 844: load-to-first-frame 0.24–1.4 s from a local server, 10–42 fps. A real phone GPU renders this load faster than software WebGL; the adaptive pixel ratio holds 30 fps on slower phones. Not yet measured on a physical phone.
