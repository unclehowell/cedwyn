# Subtitles for sound-off viewing: Welsh-audio clips with readable en/es subtitles

Harvested 2026-10-27 12:00Z for the Cedwyn documentary (/documentary/, /movie/). Trigger: the project lead 11:50 GMT 27 Oct made Welsh (cy) the default spoken language before ~1970. From then on, most viewers can only follow a scene through its subtitles. That makes subtitle readability a sales and reach problem as well as an accessibility one.

## Evidence (what each source shows)
- **Facebook (Meta Business News, "Updated features for video ads", read 27 Oct 2026):** "Internal tests show that captioned video ads increase video view time by an average of 12%." In the same research, 80% of people reacted negatively when feed video played loudly without warning. The advice is to make stories that "don't require sound to communicate their message". This is Meta's own figure from ads, not organic posts.
- **Verizon Media + Publicis Media survey, April 2019:** 5,616 US adults aged 18–54. 69% watch video with sound off in public and 25% in private, and 80% are more likely to finish a video when captions are available. We read this through 3Play Media's write-up and the search snippets, not the original report (Forbes returned 403). Treat it as secondary.
- **BBC Subtitle Guidelines (bbc.co.uk, read in full 27 Oct):**
  - Speed: 160–180 words per minute, or 0.33–0.375 s per word.
  - Broadcast lines: at most 37 characters. Online the limit is a width instead: 68% of a 16:9 frame, and 90% of a 9:16 vertical frame. As a guide, 37 characters at 16:9 equals about 25 characters on vertical video.
  - Lines per subtitle: at most 2 on landscape or square video, and 3 on vertical.
  - When the rules conflict, well-edited text and good timing matter more than perfect line breaks.
- **Netflix English Timed Text Style Guide (read 27 Oct):**
  - At most 42 characters per line.
  - Reading speed up to 20 characters per second for adult programmes, 17 for children's.
  - When editing for reading speed, cut and condense the text. Never paraphrase.
  - For foreign dialogue that is translated, mark it with [in Welsh].
- **YouTube (multi-language audio + captions):** already covered in `youtube-chapters-captions-transcripts-archive.md`. Discovery Digital Networks got +7.32% views from captions. That figure is YouTube-only.

## The how-to
1. **Write subtitles as subtitles, not as script paragraphs.**
   - Split each spoken paragraph into cues of 1–2 lines, at most 42 characters per line (37 if the clip may go to broadcast), each lasting about 1–7 s.
   - Break lines at natural pauses: after punctuation, before a conjunction. Never split a name, such as "Tŷ / Mawr".
2. **Keep the reading speed under the limit.**
   - Aim for ≤17 characters per second on the English track. Many readers of a Welsh-audio scene are reading every word, with no audio to fall back on.
   - Never exceed 20 cps. When a line runs fast, condense it or hold the cue longer. Don't speed up the speech.
3. **Two products from one source file:**
   - **Sidecar track (VTT/SRT) on our own player and YouTube.** Viewers can switch it on and off, it is searchable, and the cy/en/es tracks sit side by side.
   - **Burned-in ("open") subtitles on every clip posted to Facebook, Instagram and Shorts.** In a muted feed the post must work without sound. Use the `ffmpeg subtitles=` filter with a large sans font and a semi-opaque box, and keep text inside the safe area.
   - For 9:16 cuts, keep lines to about 25 characters, use up to 3 lines, and place them above the bottom UI.
4. **First 30 seconds.** The first subtitles a viewer reads are the hook (see `video-intro-hook-first-30-seconds-retention.md`). Run `--intro 30` and read what a silent viewer actually sees.
5. **Measure.** Compare average view duration on a captioned versus an uncaptioned edit, one variable at a time. The 12% figure is Meta's, not ours.

## Tool
`tools/subtitle_check.py` is a standard-library script (nothing installed, about 3 KB). It flags these per cue: FAST (above `--max-cps`, default 20), FAST_WPM (above 180 words per minute), LONG_LINE (over 42 characters, 25 with `--vertical`, or a custom `--max-chars`), TOO_MANY_LINES (more than 2, or 3 on vertical), and SHORT or LONG_CUE (under 0.83 s or over 7 s). `--intro 30` prints the text shown in the first 30 s. It exits 1 if any cue is flagged.
`python3 tools/subtitle_check.py F002.en.vtt --max-cps 17 --intro 30`

## How we apply it to Cedwyn
- **Measured 27 Oct, 12:00Z, on the working source subtitles `the project workspace*.{cy,en,es}.vtt`:**
  - F001 and F003–F009 flag on almost every cue: for example, 14 of 15 cues in F001.en.vtt.
  - The cues are whole spoken paragraphs on one line: up to 195 characters, held for 9–14 s (F001.en at 14.04 s is 150 characters over 13.4 s). Viewers can't read these. Most players also won't wrap them neatly on a 390 px phone.
  - F002 is the closest to correct: 8 of 26 cues flagged on the English track.
  - These are the working source files. The live clip tracks were not separately checked.
- **Fix, for the script-review worker, the 6-hourly scene runner and the F002 v2 render at 19:15Z:**
  - Re-cue every track to ≤42 characters per line, ≤2 lines, ≤17 cps on en/es and ≤20 on cy.
  - Add `subtitle_check.py` to the movie RUNNER's pre-upload checks.
- **Social cuts:**
  - Burn the English subtitles into each Welsh-audio clip posted to Facebook (Great House Farm II) and Instagram @cedwynestate.
  - Use Spanish burned-in subtitles for the Patagonia audience posts.
  - Keep the sidecar tracks on /movie/ and on YouTube.
- **Mark Welsh speech as Welsh.** A small "[in Welsh]" tag on the first cue tells the non-Welsh-speaking majority that the language is deliberate, not a fault. It also shows the film's choice: Welsh as the spoken language until about 1970.
- This change costs nothing: it is text and ffmpeg only, with no generation spend.

## Sources
- facebook.com (read)
- bbc.co.uk (read)
- partnerhelp.netflixstudios.com (read)
- 3playmedia.com (search snippet; original report not read)