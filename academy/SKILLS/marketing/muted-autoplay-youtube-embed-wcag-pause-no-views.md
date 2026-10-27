# Muted autoplay video at the top of a page (YouTube embed): policy, accessibility, views

Trigger: the project lead, 27 Oct 2026 14:26 GMT, on /wales/docs/ghf_legalwiki/: the 1987 video "needs to be the first thing ... (autoplay/ minimal controls)". Harvested 2026-10-27.

## What the evidence states
- **Chrome autoplay policy (developer.chrome.com, read):**
  - "Muted autoplay is always allowed."
  - Autoplay with sound is allowed only after the visitor has interacted with the site, has a high desktop Media Engagement Index, or has installed the site.
  - Cross-origin iframes need `allow="autoplay"` delegated from the page.
  - So the embed must start muted, with an unmute control.
- **YouTube player parameters (read):**
  - `modestbranding`, `showinfo` and `autohide` are **deprecated and no longer functional**. Drop them.
  - `playsinline=1` is needed for inline play on iOS; the default is fullscreen.
  - `rel=0` now only limits related videos to the same channel; it no longer hides them.
- **YouTube IFrame API reference (read):** "A playback only counts toward a video's official view count if it is initiated via a native play button in the player." This means autoplayed embeds add **no YouTube views**. If views on the channel matter, measure on-page watch time instead. Separately, keep a "Watch on YouTube" path that leads to a counted play.
- **WCAG 2.2.2 Pause, Stop, Hide (Level A, W3C Understanding doc, read):** moving content that starts automatically, lasts more than 5 seconds and sits beside other content must have a mechanism to pause, stop or hide it. `controls=0` with autoplay therefore **fails** unless we add our own pause button.
- **Sound-off viewing is the norm (Digiday 2016, read):**
  - LittleThings: 85% of its Facebook views (150 M a month) without sound.
  - Mic: 85% of its 30-second views without sound.
  - PopSugar: 50-80% without sound.
  - Lesson: a muted opener must make sense **without audio**, so turn captions on (`cc_load_policy=1`, `cc_lang_pref=en`) or use burned-in titles.
- **NN/g, Video Usability (read):** unexpected autoplay "can surprise, if not annoy, users". It is acceptable when the video is the page's main, expected content and the page tells the visitor what it is.

## Recipe
1. Use a responsive 16:9 wrapper: `aspect-ratio:16/9; width:100%`. Place it first in the content, after the H1, with a one-line caption under it (title, year, source) so the page reads correctly with the sound off.
2. Use `<iframe src="youtube-nocookie.com allow="autoplay; encrypted-media; picture-in-picture; fullscreen" title="...">` with a real `title`. Leave out modestbranding.
3. Add two of our own buttons over or under the player, at least 44 px each: **Unmute** (`player.unMute()`) and **Pause/Play** (`pauseVideo`/`playVideo`). Load the IFrame API locally if site rules forbid CDNs. Otherwise use postMessage commands: `{"event":"command","func":"unMute","args":[]}`. Pause/Play is what satisfies WCAG 2.2.2.
4. Respect `prefers-reduced-motion: reduce`. For those visitors, drop `autoplay=1` and show the poster with a play button. Also add a "Watch on YouTube" text link only if the outbound-link rules allow it (on Cedwyn they do not, so skip it).
5. Performance: an autoplaying iframe is real weight, so put only one such iframe on a page. Anything further down uses the facade pattern (`video-landing-page-facade-poster-preload.md`).
6. Check at 390 px in Safari or iOS emulation: it plays inline, muted, the buttons work, it works in dark mode, and the console shows no errors.

## How we apply it to Cedwyn
- On `/wales/docs/ghf_legalwiki/`, the worker's brief carries `modestbranding=1`. It is harmless but dead, so drop it on the next touch. Add the Pause/Play button next to the unmute button, because `controls=0` alone breaks WCAG 2.2.2.
- Add `cc_load_policy=1` if the 1987 clip has captions. If it has none, add a one-line text summary under the player (the sound-off majority).
- Do not report YouTube view counts as reach from this page, because autoplays are not counted. Log on-page plays through the page's own analytics event instead (`video_watch_check.py` exists).
- Use the same pattern for any future autoplay opener (the movie doors, the tour pages): one per page, muted, captioned, pausable.

## Sources
- developer.chrome.com (read 27 Oct 2026)
- developers.google.com (read)
- developers.google.com (read; view-count rule)
- w3.org (read)
- digiday.com (read)
- nngroup.com (snippet)