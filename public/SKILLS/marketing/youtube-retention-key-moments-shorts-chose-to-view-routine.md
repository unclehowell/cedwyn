# YouTube retention diagnostics: key moments for long videos, "chose to view" for Shorts

Harvested 30 Oct 2026, ~20:45Z. Before this, "audience retention" and "retention graph" had 0 hits in the index. Other files cover hooks (documentary-teaser-cutdowns..., story-time-series...), Test & compare, end screens and Studio Research. This file is the **read-the-numbers-then-fix** routine.

## What the platform measures (primary)
- **YouTube Help 9314415, "Measure key moments for audience retention" (read 30 Oct 2026).** Studio > Content > a video > Analytics > Engagement shows four key moments:
  - **Intro:** the % of viewers still watching after the first 30 seconds. YouTube states a high intro means the first 30 s matched the title and thumbnail. Its suggested fix for a low intro: change the title/thumbnail to match the video, or re-cut the first 30 s.
  - **Top moments:** stretches where almost no one dropped off. YouTube suggests that if they come late, move that material earlier.
  - **Spikes:** viewers watching, rewatching or sharing that part.
  - **Dips:** viewers leaving or skipping at that point.
  - **"Continuous segments":** flat stretches, where viewers stay.
  - Videos naturally taper off; YouTube's own wording is that "videos on YouTube generally taper off".
- **YouTube Help 12942217, "Content tab analytics tips – Shorts" (search snippet; page not opened this run).** The Shorts metrics are views, likes, subscribers, **shown in feed** and **"how many chose to view"**: the % of feed appearances where someone watched the Short instead of swiping away.
- **YouTube Analytics API (developers.google.com, snippet).** `audienceWatchRatio` and `relativeRetentionPerformance` by `elapsedVideoTimeRatio` give the same retention curve without Studio. **Not checked:** whether our connected YouTube toolkit exposes the Analytics API. One read-only call would settle it.

## Practitioner numbers (creator-reported, not YouTube's)
- **1of10, "YouTube Shorts Analytics: The Metrics That Matter (2026)", Kyle du Randt, 12 Sep 2026 (read).**
  - Read the metrics in this order: shown in feed (distribution), then viewed vs swiped away (hook), engaged views, average view duration / % viewed, and finally subscribers gained.
  - **Viewed vs swiped away:** 70-79% is "working" and 80%+ is "strong".
  - **Average % viewed for a Short under 35 s:** 80-90% is working; 90%+ is strong, and looping can push it past 100%.
  - The article states plainly that **YouTube publishes no official benchmarks** and these ranges come from creators. The rule is to beat your own channel average, which Studio shows next to every metric.
  - Since **31 Mar 2025** a Shorts view counts the moment playback starts, so raw views measure distribution, not quality. Compare quality using engaged views, and never compare before/after across March 2025. (That date comes from 1of10; YouTube's own announcement wasn't re-read this run.)
  - Diagnosis: low shown-in-feed means the problem comes before the content. High shown-in-feed with low views means the hook (the first ~2 s) is the problem.
- Creator Essentials and Gyre (search snippets) also call "chose to view" the Shorts hook rate and say a 70%+ target is an informal benchmark. Not checked further.

## The routine (about 10 minutes, weekly, read-only)
1. **Shorts:** for each Short older than 48 h, record shown in feed, % chose to view, average % viewed, engaged views and subs gained. Our first data point is the baseline; judge each new Short against the channel average, not the 70/80 bands.
2. **Fix by the first metric that fails:**
   - **Shown in feed low** (YouTube barely showed it): check the audio or a reused clip, check the title and first frame make the subject clear, and post more often. Don't re-cut.
   - **Chose to view under the channel average:** the first 1-2 s are the problem. Start on the most striking frame (an archive record, a map pin landing, a face speaking) and put the question on screen in frame 1. Never open on a logo or ident.
   - **% viewed low but chose-to-view fine:** the payoff is the problem. Cut the middle and end on the loop point.
3. **Long videos and documentary scenes:** read Intro (30 s), then the biggest dip.
   - If a dip sits on a caption card or slow pan, shorten or cut it in the next version.
   - If a spike lands late, move that moment into the first 30 s of the trailer/teaser cut.
4. **One change per upload,** logged against the metric it targets (see growth-experiment-loop-autoresearch-keep-discard.md). Keep it if it beats the channel average twice; otherwise go back to the old way.

## How we apply it to Cedwyn
- **Story-time intro (the project lead's recurring ident, v4 in progress 30 Oct):** the ident opens each Short, so it sets the swipe rate. Once three story-time Shorts have 48 h of data, compare their chose-to-view with the channel's non-ident Shorts. If the ident Shorts are lower, propose putting the record or map shot first and the ident after second 2. This is a format change, so it goes to the root to raise with the project lead; we don't change it on our own.
- **YOUTUBE SHORTS DAILY run (upload.py):** add one step after the upload: read the last 7 Shorts' metrics through the Analytics API if the toolkit allows (else Studio in the browser, read-only), and append them to the project workspace as `yt_metrics,<videoId>,shown,chose_pct,avg_pct,engaged,subs`.
- **Documentary scenes (/movie/ doors, ~2 min):** the scene is free v0.0.1 on YouTube and paid v0.0.2 on site. A dip at the same timestamp on several scenes, such as the caption-card side events, is a script note for the CEDWYN MOVIE RUN (RERENDER-QUEUE.md), not a re-render on its own.
- **Bots inflate site hits, but not YouTube's retention data,** which is the cleanest quality signal we have at 7 IG / 1 FB follower scale.
- No spend, no posting changes, nothing sent. Never quote the 70/80 bands as YouTube's.

## Sources
- support.google.com (read 30 Oct 2026)
- support.google.com (snippet)
- 1of10.com (read, 12 Sep 2026)
- developers.google.com (snippet)
- creatoressentials.com (snippet)