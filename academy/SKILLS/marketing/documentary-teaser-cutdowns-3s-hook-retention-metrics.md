# Documentary teaser cutdowns for TikTok / Reels: hook in 3 seconds, read retention per platform

Topic: how to cut short teasers (6 s, 15 s, 30-45 s) from finished Cedwyn documentary scenes so they hold viewers and send them to the free v0.0.1 scenes. Harvested 29 Oct 2026, 23:58Z.

Builds on (does not repeat): instagram-reels-carousels-heritage.md, facebook-reels-originality-archive-clips.md, youtube-shorts-non-clickable-links-related-video-bridge.md, short-cut-plus-full-video-two-doors.md, per-episode-documentary-sales-own-site-free-clips.md. Those skills cover where to post. This one covers how to cut the teaser and how to read whether it worked.

## Evidence (what was read)
- **TikTok for Business, "9 creative tips to drive auction ad performance"** (read in full):
  - "over 63% of all videos with the highest click-through rate (CTR) highlight their key message or product within the first 3 seconds".
  - Vertical 9:16 videos have "an average 25% higher 6-second watch-through rate".
  - Fast tracks above 120 BPM "often drive higher view-through rate".
  - Story still matters: "embed your message into a narrative".
  - Note: these are ads data, used here as a guide for organic posts.
- **TikTok Marketing Science, movie marketing research (3 Sep 2024, read):**
  - 62% of TikTok moviegoers said a trailer influenced their decision to see a film; 58% said sneak peeks did.
  - 47% discovered a new film coming to cinemas on TikTok.
  - 67% say genre is the most important factor in choosing a film, so a teaser should show its genre (here: period drama, not lecture).
- **Instagram Skip Rate** (Babbleboxx, Aug 2025, updated 2026, read):
  - Skip Rate = the share of viewers who scroll past a Reel in its first 3 seconds. It was added to Reels Insights in Aug 2025, replacing View Rate.
  - Meta publishes no benchmark. Trackers call under ~30-40% healthy, and over ~50% a sign the hook is failing.
  - Where to find it: Reel -> View insights -> Retention card.
  - This is an industry tracker figure, not Meta's.
- **YouTube Help 9314415, key moments for audience retention** (read):
  - "Intro" = the % still watching after 30 s. A high Intro means the first 30 s matched the title and thumbnail.
  - Dips = viewers leaving or skipping. Spikes = rewatching or sharing.
- **MuseumNext, museums on TikTok** (read):
  - Art-history creator videos (~3 min) work when viewers are "engaged within the first few seconds".
  - One case study's top video got 79,000+ views. MuseumNext's caution: reach is "not a count of gallery visits". Judge clips by clicks to the scene, not views.

## How to cut (recipe)
1. **Pick the strongest 3 seconds first, not the opening shot.** Use a face mid-line, an action (a hand on a quern, a sheaf landing) or a striking image. The first frame must say "period drama in this place".
2. **First 3 s:** use an on-screen caption with place and date (e.g. "Llandough hill · c. 200 BC") plus the moment. No logo, title card or black lead-in.
3. **Make three lengths from each scene:**
   - **6 s:** one moment and the caption.
   - **15 s:** two beats: setup, then an unresolved line.
   - **30-45 s:** the scene's turn, stopping before it resolves.
   End every length on an open question, never a summary.
4. **Format:** 9:16, 1080x1920. Burn in captions inside the safe zone (keep the bottom ~20% and right ~15% clear of the platform UI). Make cy and en versions. Characters keep speaking to each other, never to camera (the project lead's fourth-wall rule applies to teasers too).
5. **Sound:** keep the scene's own audio and dialogue. Add licensed or platform-library music only where the scene is quiet. Never add voice-over narration.
6. **Last 1-2 s:** a caption naming the place to watch: "Scene 2 · free · cedwyn.bucklerfamily.estate/documentary". The link goes in the bio or link sticker, because links in Shorts are not clickable.
7. **Cutting** (ffmpeg, already on the box):
   `ffmpeg -ss <start> -t 15 -i F002.webm -vf "crop=ih*9/16:ih,scale=1080:1920,subtitles=cy.srt" -c:v libx264 -crf 23 -c:a aac out_15s_cy.mp4`
   Delete working files afterwards (disk is tight).

## How to read it (after 48 h and after 7 days)
| Platform | Metric | Keep the hook if | Recut if |
|---|---|---|---|
| Instagram Reels | Skip Rate (Retention card) | under ~40% | over ~50% |
| TikTok | 6-second hold / average watch time | most viewers pass 6 s | most drop before 3 s |
| YouTube | Intro (30 s) on the full scene | Intro in line with your other videos | Dip in the first 10 s |

- Only the first 3 seconds change between versions. Keep the rest identical so the test is fair (see the existing A/B skills for stopping rules).
- The success metric is visits to /documentary/ tagged with UTM (utm_source=tiktok|instagram, utm_content=s2-15s-cy) and Scene 2 plays. Views alone don't count.

## How we apply it to Cedwyn
- **Source material:** the merged free Scene 2 ("the hill before the records", Iron Age + Romano-British). It is v0.0.1 and free, so every teaser points to something people can watch at once. Never tease the paid v0.0.2 scene alone. Name the price only on the site.
- **Per scene:** 3 lengths x 2 languages = 6 files. Post these through the existing auto-social and Reels skills. Never post teasers to Reddit or communities, and never DM anyone (standing rules).
- **Captions and text:** follow the editorial rules (no banned words, never name the project lead, no insignia).
- **First test:**
  - A = caption with place and date over a face mid-line.
  - B = caption with a question ("Who farmed this hill 2,000 years ago?") over an action shot.
  - Record Skip Rate and UTM clicks in the project workspace
- **Cost:** zero. Use the existing renders and ffmpeg; no new generation is needed.

## Sources
- ads.tiktok.com
- ads.tiktok.com
- babbleboxx.com
- support.google.com
- museumnext.com