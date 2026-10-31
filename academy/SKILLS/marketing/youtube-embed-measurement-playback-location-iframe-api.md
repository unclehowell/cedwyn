# Measure the embedded YouTube videos on our own pages (plays, watch time, which page)

Date: 2026-10-30 (harvest ~23:45Z). Status: PROPOSAL / documentation. Nothing built, nothing installed. Complements muted-autoplay-youtube-embed-wcag-pause-no-views.md (how to embed) and video-landing-page-facade-poster-preload.md (speed); this file is only about MEASURING what the embeds do.

## Why
the project lead's 1988 Ty Mawr video (UKSApiJH4xk) is now the autoplaying headline on /research/, and more owner uploads will follow. Muted autoplay plays do not count as YouTube views (see the autoplay file), so we need our own numbers to know whether the headline is watched, and from which page the real (click-to-play) views come.

## The evidence
- YouTube Analytics API, Dimensions (read): `insightPlaybackLocationType` splits views and watch time into BROWSE, CHANNEL, EMBEDDED ("views that occurred on another website or application where the video was embedded using an <iframe>"), EXTERNAL_APP, SEARCH, WATCH, YT_OTHER. `insightPlaybackLocationDetail` is "only supported for views that occurred in embedded players" and "identifies the embedded players that generated the most views" (top-10 sites per video sample report). So YouTube itself tells us views + estimatedMinutesWatched from our embeds, per embedding site.
- IFrame Player API reference (read): add `enablejsapi=1&origin=<our origin>` to the embed; `onStateChange` gives -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued; `getCurrentTime` gives seconds elapsed. That is enough for our own play / 25-50-75-100% / unmute events.
- Wistia, "video time on page" (read): their top 100 pages, 1 Jan 2021 - 24 Apr 2022: average 6.0 min on pages with video vs 4.3 min without (about 1.4x). Their own site, correlation only (video pages may simply be better pages).

## How to do it (playbook)
1. YouTube side (no code on the site): monthly, query the channel's Analytics for each owner video with dimensions=insightPlaybackLocationType, metrics=views,estimatedMinutesWatched; then insightPlaybackLocationDetail filtered to EMBEDDED to see which of our domains the views came from. Whether the connected YouTube account carries the yt-analytics scope is NOT checked; try it once read-only before relying on it.
2. Site side: in the headline embed use `enablejsapi=1&origin=cedwyn.bucklerfamily.estate`; on `onStateChange`, send one beacon per event to our existing first-party beacon (Workers Analytics Engine, see campaign-tags-first-party-beacon-workers-analytics-engine.md): `video_id, page, event` where event is autoplay_start, unmute, play_click, q25, q50, q75, ended. Poll `getCurrentTime` every 5 s only while state = 1.
3. The two numbers that matter: unmute rate (unmutes / autoplay starts) and click-to-play views per 100 page visits. Muted seconds are not attention; do not report them as watch time.
4. Compare time on /research/ for 2 weeks before vs after the headline (our analytics), and say plainly it is a before/after, not a test.
5. Keep youtube-nocookie if used (enablejsapi works on it; not checked on our page) and no extra third-party scripts beyond the IFrame API.

## How we apply it to Cedwyn
- Proposal for the next /research/ change: add enablejsapi + origin to the UKSApiJH4xk headline iframe and 7 beacon events; no design change.
- Monthly line in the Sunday growth report: "headline video: N autoplay starts, unmute rate X%, Y click plays; YouTube states Z embedded views / M minutes from cedwyn".
- If unmute rate stays under ~5% after 2 weeks (our threshold, not a benchmark), replace autoplay with a poster + caption and play button, which also counts as a YouTube view.
- Nothing changed live.

## Sources
- developers.google.com (read)
- developers.google.com (read)
- wistia.com (read)