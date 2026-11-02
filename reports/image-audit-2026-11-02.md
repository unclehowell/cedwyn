# Estate image and adjoining-copy audit

**Audit date:** 2 November 2026  
**Source repository:** `unclehowell/cedwyn`  
**Baseline main revision:** `aea62a27c1360f56a42c0832e4e13d62fbdc4474`  
**Published-site baseline observed before the latest build:** `e04429caee5dfa531bdd02baadb8774953324fff`

## Status

This is a **partial, source-tree-based audit**, not a claim that every image placement has been visually reviewed. It records the estate-wide inventory baseline, the page families reviewed in this pass, confirmed corrections, and the material still to be inspected. The HubSpot work item must remain open until the remaining image placements have been assessed and the latest build has been verified in production.

## Inventory baseline

The published `site` branch snapshot contained:

- 29,010 files in total;
- 9,169 HTML files;
- 1,042 image assets.

The generated HTML includes substantial documentary and catalogue material, not simply designed pages. The largest groups included email references, evidence catalogue pages, research evidence pages, wiki evidence pages and Wayback captures. Those cannot safely be treated as ordinary editorial pages.

The main source tree contained 1,710 HTML files under `web/`, including 1,640 email pages, and 112 source-controlled image files under `web/`. There were 47 authored/presentation-page candidates outside the excluded email, evidence, archive and capture paths in the source-tree inventory. These counts describe the snapshot and are **not a count of individually verified image-to-caption relationships**.

Selected source-branch inventory (HTML and image-file counts are branch-tree counts; some branches contain generated or duplicated material):

| Theme / branch | HTML files | Image files | Treatment in this pass |
|---|---:|---:|---|
| Farmbook (`fb`) | 457 | 330 | Documentary album, maps, plans and record images protected; homepage/story placements sampled |
| Documentary story (`bpvsbuckler`) | 113 | 337 | Press, survey and archive images protected |
| Legal Wiki (`wiki`) | 41 | 0 | Whole branch tree; its configured `site/` subtree has 22 HTML files and no image files; evidence content is held separately |
| Wayback Vault (`wayback`) | 954 | 394 | Captured records and media protected |
| Map Room (`maps`) | 2 | 13 | Original maps, plans and family photographs; 60 video/audio media files in the theme tree |
| Project Office (`projects`) | 193 | 8 | Replica plan and illustration captions checked on the replica page |
| Research (`section/research`) | 1,394 | 153 | Evidence/library content is mixed with editorial pages; Media Gallery reviewed separately, primary assets protected |
| NFT art (`nft-art`) | 1 | 462 | Dynamic collection; not exhaustively checked item-by-item |
| E-books (`ebooks`) | 76 | 96 | Cover/illustration assets; not exhaustively checked page-by-page |
| Merchandise (`merch`) | 4 | 36 | Product and design-gallery copy sampled; no clear mismatch confirmed in the sampled cards |
| Nomenclature (`nomenclature`) | 28 | 0 | Topic pages and terminology; no local image assets in the public subtree |
| Infographic (`infographic`) | 2 | 0 | Two authored HTML pages with 24 video/media assets; not image-file based |
| Directories (`directory`) | 310 | 1 | Public directory pages; no broad per-record image review in this pass |
| WhatDoTheyKnow (`whatdotheyknow`) | 8 | 1 | FOI request pages; single local image, pages not exhaustively checked |
| Meeting archive (`2026-10-22`) | 2 | 3 | Meeting/record material; source content protected |


**Counting method:** these figures are whole-branch repository tree counts for the named branch (files ending in `.html`/`.htm` and common image extensions), not counts of unique visible placements. Where a theme manifest specifies a subdirectory, the report also notes that scope when it differs. A single image can occur on multiple pages or be referenced dynamically without appearing as a literal HTML `<img>` tag; static branch counts cannot prove complete coverage.

## Preservation boundary

No primary source photograph, documentary scan, archival capture, map, family album image, evidence catalogue entry, source transcript or catalogue assessment was replaced or rewritten in this pass.

In particular, the Farmbook, Legal Wiki, documentary-story, Wayback and Map Room branches contain original or source-derived materials. Their use as documentary evidence is not a licence to retouch or substitute the image. An inaccurate caption, alt description or surrounding explanation is corrected in the editorial layer instead.

Empty alt text on decorative avatars and interface graphics was not treated as an error automatically. When a nearby link already names the destination, an empty alt can be appropriate. The 1994 Farmbook ring thumbnail has an empty alt but sits within a clearly named “1994: the burial ground” story link; it was not changed as part of this pass.

## Confirmed corrections

The following fixes are in merged PRs:

- **PR #121 — Wales image descriptions:** six tour-scene alternative descriptions (Roman villa, Brynwell, Peerless Jim, Cardiff Bay wireless apparatus, Lavernock mast and courtroom) now identify the images as interpretive reconstructions or artist’s impressions in English, Welsh and Spanish. The descriptions distinguish the reconstruction from an original photograph and qualify the Cardiff Bay apparatus image.
- **PR #123 — reconstruction index:** the AR-REC-0001 and AR-REC-0002 thumbnail alt descriptions now identify them as re-rendered artist’s impressions based on the 29 July 1988 Cadw survey photographs, not the original photographs.
- **PR #123 — Patagonia bookshop card:** the unrelated china-cabinet image was replaced with the Great House Farm Wiki e-book cover, which matches the bookshop/goods card.
- **PR #123 — Argentina visitor cards:** the hero, B&B cottage and whole-house images were aligned to their respective subjects using the existing catalogue/art assets. The cottage uses the new GEN-0001 asset; the venue and hero selections use the checked NFA catalogue assets.

The preceding PR changes cover **12 identified image/description or image/slot mismatches**: six Wales image descriptions, two reconstruction-index descriptions, one Patagonia bookshop image and three Argentina visitor-card images. PR #81 was closed as superseded; its checked image changes were incorporated into PR #123.

## Further caption corrections opened in PR #125

The source review found that changing alt text alone had not fully corrected the visible overlay copy. PR #125 updates the English, Welsh and Spanish overlays for six Wales scenes:

- **Roman villa:** states that the scene is an artist’s reconstruction of excavated remains and that nothing is visible above ground today. This replaces wording that could imply a villa stands on the present-day estate.
- **Brynwell:** labels the through-wall roof/interior view as a possible interpretive reconstruction, not a photograph of the interior.
- **Peerless Jim:** identifies the barn/boxer scene as imagined, not documentary.
- **Cardiff Bay:** explains that the apparatus illustration is interpretive and does not establish that the apparatus stood on the Cardiff Bay waterfront.
- **Lavernock:** identifies the mast and wireless-signal scene as an artist’s reconstruction.
- **Courtroom:** identifies the scene as an imagined period courtroom, not a particular court or hearing.

PR #125 changes overlay text only. It does not change images, evidence, transcripts or catalogue records. Its initial `sections-ci` run started before the required `site-wide` label was present and failed the label gate; a fresh check is required after the label was added.

## Pages and image families reviewed in this pass

- **Wales AR tour (`/wales/`):** nine tour stops, including restored-photograph scenes, interpretive reconstructions and a map/plan composite. The Tŷ Mawr and churchyard scenes already state that they are restored from old photographs as artist’s impressions; the six other reconstructed scenes received accessibility descriptions and are covered by PR #125 for visible copy.
- **Scene reconstructions (`/research/reconstructions/`):** both index thumbnails checked against their basis and page captions; the image descriptions now distinguish the reconstructions from the Cadw source photographs.
- **Patagonia (`/patagonia/`):** visitor feature-card imagery and the bookshop card sampled; the known bookshop mismatch was corrected in PR #123. Other sampled museum, learning, garden, virtual-Wales and event cards did not show a clear subject mismatch in the inspected copy.
- **Argentina (`/argentina/`):** the hero and the room/cottage/whole-house/wedding visitor slots were part of the image-alignment work included in PR #123.
- **Replica plans (`/replica/` in the Project Office):** the massing image, ground-floor plan, site plan and south elevation have captions and alt descriptions that identify what each drawing depicts and disclose measured, scaled and inferred content. No mismatch was found in the inspected page.
- **Merchandise (`/shop/`):** sampled product and design-gallery cards have image names/captions corresponding to the product or design described. No definite mismatch was confirmed in this sample.
- **Farmbook homepage:** sampled story-ring thumbnails match their stated subjects (early Llandough photograph, manor return, farmhouse front, farmyard, press cutting and December 1988 scene). Primary source images remain untouched.
- **Farmbook story rings (`fb/site/index.html` and `fb/site2/index.html`):** 9 and 14 story-preview cards were checked for the main preview image, visible card label and link name. The one blank alt on the original page belongs to the “1994: the burial ground” card; the one blank alt on the newer page belongs to the “Today” card. Both previews have explicit visible labels and link names, so the blank alt is deliberate for a decorative thumbnail. The other substantive preview images carry descriptions for the photograph, farmhouse, church, book page, Land Registry record or press cutting shown. Social-avatar SVGs also have empty alt because the avatar is decorative and the adjacent story label names the speaker/organisation.
- **Research Media Gallery (`/media-gallery/`):** the 13 May 1897 photograph is now captioned and described as Post Office engineers inspecting Marconi’s wireless apparatus on Flat Holm. The page itself records that its earlier “at Great House Farm” caption was corrected on 19 October 2026. The historical image remains unchanged and its archived filename retains the old wording; that filename was not renamed. The page also displays 60 video-frame stills whose alt labels identify only the part and frame number (for example, “Part 1 frame 1”). Those 60 descriptions are weak as accessible descriptions and remain open for a frame-by-frame review; no guessed visual descriptions have been inserted. The compiled video is explicitly identified as a secondary compilation, not a primary record.
- **Map Room (`maps`):** its single empty-source/empty-alt `<img>` is a placeholder for a selected portrait, not a permanently blank image: the app script sets its source and sets its alt to the named person when an image is shown. The 60-step story data uses the same Mary (Nancy) Williams family portrait on 10 steps; each image caption identifies it as a family photograph at Tŷ Mawr, and the script displays her name and lifespan alongside it. The remaining images are historic OS map layers, parcel outlines, plans and location photographs; the source references are attached to each story step. No text/image misidentification was confirmed in the reviewed Map Room data. The 60 steps were checked at the data/metadata level, not visually inspected image-by-image.

## Remaining work — do not mark complete

1. Build a complete asset-to-placement index for the live/generated site, including dynamic catalogue and gallery placements; then record each page, image, visible caption, alt text and source/evidence ID.
2. Visually verify the remaining Farmbook, Wiki, Wayback, e-book, NFT, Map Room, shop and other theme placements. The branch counts above are inventory counts, not a substitute for this review.
3. Resolve each candidate mismatch by checking the source asset and catalogue metadata first. Correct editorial copy when the image is the authentic source; change an image only in an editorial/promotional slot where the mismatch is established and an appropriate alternative exists.
4. Recheck the corrected build after PR #125 and the main build complete. The site branch observed at the start of this pass did not yet contain PR #123; no claim of live production verification is made here.
5. Keep the HubSpot To Do open until the asset-to-placement index, remaining visual checks and production verification are complete.

## Change references

- PR #121: https://github.com/unclehowell/cedwyn/pull/121
- PR #123: https://github.com/unclehowell/cedwyn/pull/123
- PR #125: https://github.com/unclehowell/cedwyn/pull/125
