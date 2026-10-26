# Getting archive videos indexed: the Search Console "Video indexing" report

Harvested 2026-10-26. For Cedwyn's own video pages (the movie doors, archive clips), not YouTube's copy (that is in youtube-chapters-captions-transcripts-archive.md).

## What Google requires (Google Search Central, primary)
- **The watch page must be indexed first**, and "performing well in Search" before its video is considered. An indexed page does not mean an indexed video.
- **One video per page is indexed.** The report shows one video per page even when several are found.
- **Watch page = the page's main purpose is one video.** Google lists these as NOT watch pages: a blog post where the video complements the text, a product page with a side video, a category page listing several videos of equal prominence.
- The player must be **in the rendered HTML at its real size on load**. A poster image that must be clicked to load the player gives "Cannot determine video position and size".
- A **valid thumbnail at a stable URL** (not robots-blocked, not mostly transparent: at least 80% of pixels with alpha above 250). Same title, thumbnail and video URL in every source (JSON-LD, sitemap, og: tags), or Google may reject the thumbnail.
- Supported files include **WebM, MP4, M3U8**; data: URLs are not. Short-lived CDN URLs break indexing.
- VideoObject structured data needs `name`, `thumbnailUrl`, `uploadDate`; Google's structured-data page also sets a 30-second minimum duration for some video features.

## The report's reasons and the fix for each
| Reason | Fix |
|---|---|
| Video isn't on a watch page | Give each clip its own page with the player first, above the text. |
| Cannot determine video position and size | Put a real `<video>`/`<iframe>` in the HTML on load; no click-to-load facade for the main clip. |
| No thumbnail URL provided | `poster=` on `<video>` + `thumbnailUrl` in JSON-LD (same URL). |
| Invalid / unsupported / blocked / unreachable thumbnail | JPEG or PNG, at least 60x30 px, public URL, allowed in robots.txt. |
| Video not found on host service | Check the file/ID still resolves; fix the URL. |
| Video not processed (yet) | Stable URLs; wait a few days; re-inspect. |

## How to work the report (weekly, 10 minutes)
1. Search Console > Indexing > Videos. "Video indexed" + "No video indexed" should roughly equal our number of video pages. A **low total** = the pages themselves aren't indexed (fix page indexing first). A **high "No video indexed"** = one of the reasons above.
2. Click a reason, open an example URL, run **URL Inspection > Test live URL**. No "Video indexing" section in the result = Google found no video in the rendered page.
3. Fix, then "Validate fix" in the report (one click per reason, not per URL).
4. Track the Performance report with the **Search appearance: Videos** filter.

## Evidence it matters (numbers)
- Google's December 2023 watch-page rule removed video results from pages where the video was secondary; video features across tracked results then fell (Vidico's 2026 roundup cites a drop from a 53.7% peak to 38.5% of tracked results showing video). Roundup figure, not checked against the tracker's own data.
- Pages whose video gets indexed can appear in the Videos tab, video carousels and Discover; the report's chart shows those impressions per page.

## How we apply it to Cedwyn
Checked live 26 Oct 2026 (`tools/video_watch_check.py`):
- **/movie/** has one `<video id="cm-video">` with **no `src` and no `poster` in the HTML** (filled by script) and **no VideoObject JSON-LD**. It also carries acts, prompt and change log, so it reads as a hub, not a watch page. Expected result in the report: "Cannot determine video position and size" or "No thumbnail URL provided".
- Proposal (for the sole Cedwyn committer, not done here): one watch page per door, e.g. `/movie/door-1/`: player first with `src` + `poster` in the static HTML, a one-line headline, then the script/transcript in `<details>` (headline-first skill), VideoObject with `name`, `description`, `thumbnailUrl`, `uploadDate`, `contentUrl`, `duration`, `inLanguage` (cy/en/es tracks). Keep /movie/ as the hub linking to each door.
- Add each door page to the sitemap (and optionally a `<video:video>` entry with the same thumbnail URL), then ask Google to index once via URL Inspection.
- Google has indexed only 2 Cedwyn pages so far, so step 1 (page indexing) comes before any video result.

## Sources
- developers.google.com (requirements, watch page, thumbnails, file types)
- support.google.com (Video indexing report: statuses, reasons, fixes)
- developers.google.com (VideoObject, 30 s minimum)
- vidico.com (2023 watch-page change, roundup numbers)