# Steps only the owner can do

1. Say yes or no to making this the main 3D world. Until then the existing Terrain world stays as it is (also kept on branch `legacy` of unclehowell/terrain).
2. Merge the one PR that registers the `/wales-3d/` theme on the site (pin to `section/wales-3d`), then a site build puts it live on cedwyn.bucklerfamily.estate.
3. Optional, for larger areas or 1 m detail: create an R2 bucket (e.g. `wales-3d-tiles`) with public access or a Worker route, so height tiles can stream from Cloudflare instead of the repo.
4. Genie 4 (later): when access exists, add the API key as a Worker secret (never in the repo) and set `FLAGS.genie4 = true`.
5. Speaking characters (later): Workers AI binding on a Worker (`AI`), a KV namespace for cached answers, and the URL of the existing hybrid LLM proxy (financecheque branch) as the fallback.
No data downloads are needed by hand: the build script fetches the LiDAR tiles and OpenStreetMap itself.
