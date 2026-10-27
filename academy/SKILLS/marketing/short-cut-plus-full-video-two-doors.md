# Short cut + full-length link: one video, two doors

Trigger: the project lead, 12:33 GMT on 27 Oct 2026. He wanted a 30-second parcels video with a "watch full video" link to the 10-minute film. The same pattern fits each 2-minute documentary scene and the archive films.

## What the data shows
- **Wistia, 2026 State of Video (13M+ videos, read via the optimal-length page):** under 1 min averages **52% engagement**, roughly half watched; that holds for testimonials (46%) and product clips (50%). For 1–5 min, viewers typically watch over 50% of educational and tutorial videos, and most drop off around the halfway point. For 5–30 min, engagement declines, but those who stay are invested: a **9% average CTA click-through rate**.
- **Wistia 2025 report (PR Newswire, snippet, not opened):** under 1 min 50%, 1–3 min 46%, falling further for 3–5 min.
- Read together, the short cut wins *attention*, and the long film converts the few who self-select. Offering both lets each viewer choose, so neither audience is lost.
- **YouTube Help 9314415 (already in index, video-intro skill):** the first 30 s decide retention. The short cut is that first 30 s done properly.

## How to cut it (deterministic, no generation)
1. **Hook first (0–8 s).** Open on the single most striking line or image from the full film, whatever is the "36 parcels" moment. No logo sting or title card first.
2. **Proof (8–22 s).** One or two segments that show the evidence: a map moment, a document on screen. Cut on sentence boundaries so subtitles never break mid-line.
3. **Ask + door (22–30 s).** End on a card reading "Watch the full video (10 minutes)", in the same words as the link under the player.
4. **Technical targets:** 29.5–30.5 s, 720p VP9/Opus webm, under ~4 MB. Use short crossfades (0.3–0.5 s) and audio fades of at most 0.5 s. Check with `audio-proof.mjs inspect` that no silence hole sits inside the material. Check subtitles with `tools/subtitle_check.py --intro 30`.
5. **On the page:** the short cut is the main player (poster frame, `preload="metadata"`). Directly under it put a text link or button with the length in the label. The full film opens in place (swap `src`) or as the direct media URL, never a third-party page.
6. **Measure separately.** Use a different file path per cut (…-30s.webm vs full), so CDN hits and range requests count each one. Log plays of short, plays of full, and full ÷ short (the "door rate").

## How we apply it to Cedwyn
- **/parcels/:** parcels-1841-30s.webm is the main player, and the full parcels-1841.webm sits behind "Watch the full video (10 minutes)" (in build now, a worker). Log the door rate weekly in the growth report.
- **Documentary scenes (6-hourly):** each ~2-minute scene gets a 30 s cut for Reels/Shorts/Facebook. The caption's first line is the scene's question, and the link goes to /movie/ for the full scene (Meta one-link budget applies; see facebook-page-link-limit skill).
- **E-book pages:** the 30–60 s sales-page clip (see sales-page-short-video-ebooks) can reuse the same cut recipe from archive films, with the full film linked as a free extra.
- **Honesty rule:** the short cut never implies more than the full film shows. Every claim in the 30 s must appear in the long version, and any correction (Parcel A / the 1970 green) applies to both.

## Sources
- wistia.com (read; 52% / 46% / 50% / 9% / 11%)
- prnewswire.com (snippet: under 1 min 50%, 1–3 min 46%; not opened)
- support.google.com (read in an earlier run)