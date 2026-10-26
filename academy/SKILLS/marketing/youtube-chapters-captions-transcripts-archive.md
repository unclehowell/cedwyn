# YouTube chapters, captions and transcripts for archive videos (and Google "key moments")
Harvested 2026-10-26 (skills harvest). Topic: YouTube search/discovery and accessibility for long-form history videos; Welsh/Spanish subtitles.

## What the evidence shows
- **Chapters - YouTube Help (official).** In the description: first timestamp `00:00`, at least **three** timestamps, ascending, each chapter at least **10 seconds**. Manual chapters override automatic ones; automatic chapters can be switched off in Studio. Chapters can appear in the transcript panel.
- **Google Search key moments (Google Search Central, video structured data doc).** Google auto-detects segments, but "will prioritize key moments set by you, either through structured data or **the YouTube description**". So YouTube chapters double as Google Search key-moment links. For a video embedded on our own page: `Clip` markup (exact start/end + name per segment) or `SeekToAction` (tell Google the URL pattern for a timestamp; Google picks moments). Opt out with `nosnippet`.
- **Captions lift views - Discovery Digital Networks study (published by 3Play Media).** Across their YouTube channels, captioned videos got **7.32% more views overall**, **13.48% more in the first 14 days** after captions were added; no significant change in shares/engagement. They also checked that caption files were indexed for search. Vendor-published, 2014-era and one network: treat as direction, not a promise.
- **Subtitle files (YouTube Help).** Upload an .srt/.vtt (text + timings) per language in Studio > Subtitles > Add language; a plain transcript can be uploaded and YouTube auto-syncs timings. Auto-captions exist for some languages only - check in Studio whether Welsh is offered (not verified here); if not, our own Welsh file is the only route.

## How to do it
1. **Pick 4-8 chapters per long video**, each titled as a claim or place + date ("1824: David Stewart's survey", "Sheet Glamorgan 47 NW, 1950s"), not "Part 2". Searchers see these titles in Google results.
2. **Transcript first**: correct the auto-captions (names, Welsh place names: Llandochau, Tŷ Mawr, Penarth) - mis-heard proper nouns are the common failure. Export as .srt.
3. **Add translations** as separate caption tracks (cy, es) plus translated title/description (Studio > Subtitles > title & description) - widens search for Welsh and Patagonian Spanish audiences.
4. **Put the transcript on our site** under the embedded video inside `<details><summary>Transcript</summary>` (crawlable, see headline-first skill) plus `VideoObject` JSON-LD with `Clip` entries matching the chapters.
5. **Shorts**: chapters don't apply; captions do (burned-in text + a caption track).
6. Re-check 14 and 28 days later in YouTube Analytics (views, search traffic source, "Subtitles/CC" usage) vs the same window before.

## How we apply it to Cedwyn
- Start with the 13-minute map film (channel trailer) and the other long-form Great House Farm videos in the playlists listed in the project workspace (which covers thumbnails/titles but not chapters or captions - this is new).
- Draft chapters + corrected .srt in en, cy, es; editing descriptions and uploading caption tracks on our own channel is in the YouTube errand's scope; nothing is published elsewhere.
- Transcription can run on this box with faster-whisper (already in the kernel venv) once disk allows the ~75 MB small model; skipped today (2.0 GB free).
- Pages that embed videos on cedwyn get `Clip` markup matching the YouTube chapters (onpage flywheel / sole cedwyn committer).

## Sources
- support.google.com (video chapters)
- support.google.com (add subtitles and captions)
- developers.google.com (key moments, Clip, SeekToAction)
- developers.google.com
- 3playmedia.com