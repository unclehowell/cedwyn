# Great House II in 3D · Patagonia (section/argentina-3d)
A separate 3D world for the Patagonia half: flat steppe near Puerto Madryn (Chubut) with Tŷ Mawr and its outbuildings
reconstructed from the 1974 measured survey and the family album photographs shown on the Patagonia pages.
Served at /argentina-3d/ (and /argentina/argentina-3d/ once the halves mapping lists it). Separate from the Wales world (/terrain/).

Files: index.html, argentina-3d.js (scene + farm builder), argentina-3d.css, world-backend.js (WorldBackend / ThreeBackend:
init, step, steer, getFrame, getAudio), vendor/Sky.js (three r160 Preetham sky), tex/ (stone + lime-wash colour and normal
maps cut from album photograph 098, tone-corrected). Three.js r160 through the site's /_ext mirror.

Geometry is generated in code from survey dimensions (a few KB) rather than shipped as glTF; every texture is under 40 KB.
Budget: about 20 draw calls and 130-200k triangles; 1024 shadow map and fewer grass clumps on phones.
Query flags: ?view=front|quarter|yard|above, ?low (phone budget on desktop), ?debug (fps, draws, triangles).
What is evidence and what is a best guess: the Sources dialog in the page. Argentina scope: no money words. — Cedwyn editors

Staging preview (Cloudflare Pages, rebuilt on every push to this branch): https://section-argentina-3d.cedwyn-274.pages.dev/
