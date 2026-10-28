# Instagram Reels from stills via the API: covers, the 3:4 grid, safe zones, length

Written 27 Oct 2026 (skills harvest). Why now: from the 28 Oct 08:15 run, `social.py` (`reel_from_image`) posts the daily @cedwynestate item as a 9 s silent Reel. It slow-zooms the post image over a blurred fill at 1080x1920, sends `media_type=REELS` with `share_to_feed=true`, and sets **no `cover_url` or `thumb_offset`**. Feed images reached 1-2 accounts; Reels reached 3-108.

## What the sources say

**1. Who sees it.** Mosseri (Instagram head, Jan 2025 video, quoted widely): "The top three signals that matter most for ranking are watch time, likes and sends", with sends weighing a bit more for people who don't follow you. He also states to track average watch time for Reels and likes and sends per reach. *Source: instagram.com (search snippet; the video itself wasn't watched).*

A 9 s loop that is watched to the end gives a high completion rate. That is our edge, but it works only if the first frame stops the scroll.

**2. Length.** Reels can be up to 3 minutes since Jan 2025, when Mosseri announced it on Instagram. *Source: Engadget, read.*

Creators keep reporting that Reels over 3 minutes aren't shown to non-followers. That's on Reddit and in Mosseri Q&As (snippets); no help page was read.

Our plan:
- Stills Reels stay at 7-15 s.
- Talking or documentary clips stay under 90 s.
- Postproxy (Mar 2026, read) states 5-90 s is the API Reels-tab window.

**3. Grid.** On the same weekend the profile grid changed from square to a **rectangular 3:4** tile (Engadget, read). Grid guides give 1080x1440 (yoursocial.team, oktopost; snippets).

The cover is uploaded at 9:16, but the grid shows only the middle 3:4. Keep the title and the face or key detail inside the middle 1080x1440 band, roughly y = 240 to 1680.

Postproxy still states the grid crop is a "1080x1080 square". That predates Jan 2025: trust 3:4. A feed share may also show the middle 1:1 square (Meta's IG User Media reference, snippet). **Safest: keep everything that matters in the centre 1080x1080.**

**4. Cover options in the API.** Postproxy (read) and Meta's reference (snippet):
- `cover_url`: a public JPEG, ideally 1080x1920. Off-ratio images get centre-cropped. It overrides `thumb_offset`.
- `thumb_offset`: a frame offset in milliseconds. Default 0, the first frame.
- Neither set: Instagram picks a frame itself.

The API can't add music from Instagram's library. Any audio has to be in the file before upload.

**5. Safe zones on a 1080x1920 frame.** Lucid Media, 10 May 2026, read; this is ad guidance, and organic Reels carry the same UI:

| Zone | Size | What covers it |
|---|---|---|
| Top | 270 px (14%) | profile, name, time |
| Bottom | 670 px (35%) | like, comment, share, save, audio, caption, follow |
| Each side | 65 px | edge strip |

- That leaves a **safe box of 950 x 980 px in the centre**.
- Meta merged the Stories and Reels safe zones in March 2026, so one file fits both.
- Meta's own help page (980593475366490) blocks a plain fetch, so its numbers were not checked.

**6. Caption bug, checked against our own posts.** A Meta developer thread (snippet) states that from 16 Sep 2026, Reels posted through the Content Publishing API came out with no caption.

I read back two API Reels from 27 Oct on @shbuckler (media 18115564624850957 and 18151467448559019): **both kept their full captions.** The bug doesn't affect us as of 27 Oct. Re-check after the first @cedwynestate Reel.

## How to do it (checklist per stills Reel)
1. **Frame 0 is the hook.** The first frame is the default cover and the scroll-stopper, so it shouldn't be the blurred fill fading in. Start fully zoomed on the strongest detail, or set `thumb_offset` to the sharpest frame (e.g. 1500 ms).
2. **Cover.** Better still, render a cover JPEG (1080x1920): the image plus a 3-6 word title. Keep it inside the centre 1080x1080. Pass it as `cover_url` from the same R2 bucket as the video.
3. **Text on video** goes inside the 950x980 centre box only. Nothing goes in the bottom 670 px, where the caption and buttons sit.
4. **Loop.** 7-12 s; ending on the opening framing makes a seamless loop, which lifts average watch time.
5. **Sound.** Silent is allowed. If audio is added, it must be baked in and our own, such as the folk bed from `music_bed.py`. Never library music via the API.
6. **Originality.** A Reel made from a still with only a zoom is the "limited originality" risk pattern. See `facebook-page-reach-limited-originality-triage.md` and `instagram-reach-collapse-account-status-originality-triage.md`. Add at least two new facts on screen, such as a date or what the record shows, and use our own photos and maps rather than raw third-party scans.
7. **Measure** at 48 h with `tools/post_time_slots.py`: reach, average watch time and sends per reach, against the image posts' 1-2 reach baseline.

## How we apply it to Cedwyn
- **For the root:** this is a patch suggestion for `the project workspace`, which I didn't touch because the tonight-push worker owns it.
  - Render `cover.jpg`, a 1080x1920 frame of the un-zoomed image with the post title in the centre square.
  - Upload it beside the mp4 and add `'cover_url': <url>` to the REELS container body.
  - Or, as a minimum, add `'thumb_offset': '1000'`.
  - Then check the first frame isn't mostly blur.
- Keep the caption's first line as the hook and the "Link: cedwyn.bucklerfamily.estate/ebooks" line, as now. Links in captions can't be clicked, so the bio link the project lead sets carries the click.
- After 4 Reels, compare reach and watch time with and without on-screen facts; keep the better one (growth-experiment-loop).
- Public-text rules apply to on-screen text: never name the project lead, no banned words, no insignia.

## Sources
- Engadget, Jan 2025, "Instagram swoops in with 3-minute Reels and rectangular profile grids" (read).
- Postproxy, "Instagram Reels API Publishing Guide (2026)", 13 Mar 2026 (read): cover_url, thumb_offset, audio limits.
- Lucid Media, "Instagram & Facebook Ad Safe Zones 2026", 10 May 2026 (read): pixel table and the Mar 2026 unification.
- Meta for Developers, IG User Media reference and community thread 2154026428872590 (search snippets; plain fetch blocked).
- Mosseri ranking video DFFyRp-pINJ, and the 3:4 size guides on yoursocial.team and oktopost (snippets).
- Own read-back via the connected Instagram account, 27 Oct 2026 23:3xZ (captions present on two API Reels).