# Per-language WebVTT tracks + VideoObject/Clip markup for the self-hosted documentary scenes

Harvested 2026-10-30 03:42Z. Status: playbook. Nothing below is live yet.

## Why (numbers, with sources)
- Verizon Media + Publicis Media survey (2019, via Forbes 31 Jul 2019 and Streaming Media; snippets read, survey PDF not opened): 69% watch video with sound off in public places, 25% in private places; 80% more likely to finish a video when captions are available.
- Discovery Digital Networks (3Play Media case study, read): captioned YouTube videos got +7.32% views overall and +13.48% in the first 14 days after captions were added. No effect on shares. This is YouTube data from a captioning vendor, so treat it as a ceiling, not a forecast for self-hosted pages.
- Google Search Central, video structured data (read 30 Oct 2026): `Clip` (inside `VideoObject.hasPart`) needs `name`, `startOffset` (seconds) and `url` (a deep link to that second); `endOffset` is optional. It lets you set your own "key moments" labels instead of the ones Google picks. `SeekToAction` instead tells Google your timestamp URL pattern (`...?t={seek_to_second_number}`) so it can choose moments itself. Use one or the other per video.

## The how-to
1. **One WebVTT file per language per scene**: `scene-03.cy.vtt`, `.en.vtt`, `.es.vtt`. Generate them from the existing subtitle source (the render pipeline already writes cy/en/es subtitles). Validate: the header line is `WEBVTT`, cues are `00:00:01.000 --> 00:00:04.000`, UTF-8, served as `text/vtt`, same-origin or with CORS.
2. **Put the tracks in static HTML**, not only in JS: `<track kind="subtitles" srclang="cy" label="Cymraeg" src="..." default>` plus en and es. Mark the site-language track `default` (the project lead's rule: subtitles follow the site language). Crawlers and no-JS readers then see them too.
3. **Captions vs subtitles**: `kind="subtitles"` is a translation of the dialogue. `kind="captions"` also covers sounds ("[door creaks]"). For accessibility, the Welsh dialogue track should be `captions` with the sound cues included.
4. **A watch page per scene** (the existing Search Console video skill: one main video per page, `<video>` with `src` and `poster` in static HTML). Add JSON-LD `VideoObject` with `name`, `description`, `thumbnailUrl`, `uploadDate`, `duration`, `contentUrl`, `inLanguage` (the default audio, `cy`) and `hasPart` Clips for 3–6 dated moments, each with a URL like `/documentary/door-3/?t=42`.
5. **Make `?t=` actually seek**: on load, read `t` and set `video.currentTime`. Google only shows a Clip it can deep-link.
6. **Transcript block** under the player (inside the read-more clip): the en text of the VTT as plain HTML. This gives indexable words to a page that is otherwise only video.
7. **Check**: Rich Results Test on one scene URL, then the Search Console Video indexing report weekly (`tools/video_watch_check.py <url>` already checks the static player, poster and VideoObject props).

## Measure
- Search Console > Video pages: indexed count per scene and impressions with the "key moments" appearance, compared over 4 weeks.
- Player beacon: the share of plays with a text track showing, by language (`video.textTracks[i].mode === 'showing'`), plus completion rate with vs without tracks. Don't claim the +7%/80% numbers for Cedwyn until our own data shows something.

## How we apply it to Cedwyn
- Live check 30 Oct 03:41Z (cache-busted): /documentary/ static HTML has **0 `<track>`, 0 VideoObject**, 1 ld+json block. movie.js (page v1.4.3) refers to `.vtt` 5 times and textTracks 7 times, so tracks exist only after JS runs.
- The documentary player files belong to the player worker (abf04392 lineage / player_reapply.py). Hand this over as a **HubSpot task / RUNNER note for the next player pass**, not a direct edit: (a) static `<track>` tags per door, (b) per-scene watch pages with VideoObject + Clip markup, (c) `?t=` seek, (d) transcript under the clip.
- Clip names are public text: neutral and dated ("1855: tenancy passes to the son"), no banned words, never name the project lead, no likeness assertions.
- `inLanguage` = `cy` for scenes before ~1970 (Welsh default), with en/es as tracks.
- No install needed: VTT is plain text, and ffmpeg (already on the box) converts SRT to VTT: `ffmpeg -i in.srt out.vtt`.

## Sources
- developers.google.com (read)
- 3playmedia.com (read)
- forbes.com (snippet)
- streamingmedia.com (snippet)
- developer.mozilla.org (reference for track/kind/srclang; not re-read this run)