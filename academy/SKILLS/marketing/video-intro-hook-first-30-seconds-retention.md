# Video intros: the first 30 seconds and the first minute (retention)

Harvested 2026-10-27 12:00Z. From tonight the Cedwyn documentary publishes a scene every 6 hours (the project lead 11:50 GMT 27 Oct), each about 2 minutes long. On a 2-minute film, the opening 30 seconds are a quarter of the runtime. That is where most viewers leave.

## Evidence
- **YouTube Help, "Measure key moments for audience retention" (answer 9314415, read 27 Oct 2026):**
  - The **Intro** figure is "what percentage of your audience still watched your video after the first 30 seconds".
  - A high intro means the first 30 seconds "matched the viewer's expectation of the video's thumbnail and title".
  - YouTube's own fixes are to change the title or thumbnail so they match the content, or to rework the first 30 s.
  - The same report shows **Top moments** (where almost no one leaves), **Spikes** (rewatched or shared) and **Dips** (abandoned or skipped). If the top moments come late in a video, YouTube states to move the compelling content earlier.
- **"How to Succeed in MrBeast Production"** (internal production guide, leaked Sep 2024; read via Simon Willison's 15 Sep 2024 write-up; the PDF itself was not read):
  - "The first minute of each video is the most important minute."
  - The first minute has one job: capture attention and show that the thumbnail's promise will be met. Minutes 1–3, 3–6 and 6–end each have their own defined job.
  - Losing 21 million viewers in the first minute out of 60 million clicks counted as "a reasonably good result". So even at the top, about a third leave in minute one.
  - Viewers whose expectations aren't met click away, and that pulls down average view duration, which drives how widely the video is promoted.
- **Caution.** These are one company's rules for long entertainment videos, and YouTube's own advice, not a controlled study. The direction is consistent across both: pay off the promise early and cut the slow start.

## The how-to (for a 2-minute documentary scene)
1. **Seconds 0–5: the picture and line that the title and thumbnail promised.** No logos, no "welcome back", no slow establishing pan. Open on the most striking shot of the scene, with the narrator already speaking on camera.
2. **Seconds 5–30: the question the scene answers.** One sentence the viewer will stay to resolve, for example "Who lived on this hill before the farm had a name?" Every word has to be readable as a subtitle, because the audio may be Welsh (see `subtitles-sound-off-welsh-audio-clips.md`).
3. **Move the scene's top moment earlier.** Use a 2–3 second flash-forward of the payoff in the first 30 s, then tell the story.
4. **End with the next door.** The last 10 s point to the next scene or to /ebooks/. The end screen needs at least 25 s of video (see `youtube-end-screens-related-video-playlists.md`).
5. **Read the report and change one thing.** After 48–72 h on YouTube, write down the Intro %, the top moment's timestamp and any dips for each scene. Use them in the next scene's script. If Intro % falls below the channel's own median, first fix the title and thumbnail match (YouTube's first fix), then the opening.
6. **On our own player (/movie/)**, where YouTube's report doesn't exist: log play, 30 s and complete events, and count drop-off by second-bucket in our own analytics. Store no personal data.

## Tool
No install needed. `tools/subtitle_check.py --intro 30 <scene>.en.vtt` prints the words a silent viewer reads in the first 30 s. Paste that into the scene's script review and ask: does it deliver the title's promise, and does it ask a question?

## How we apply it to Cedwyn
- **Measured 27 Oct, from the working subtitles:**
  - F001's first 30 s is three long narrated paragraphs: "Bore da. Gloves on before you touch anything…", then a list of name variants, then "Six research leads, GHF-E174 to GHF-E179". These are catalogue IDs inside the hook.
  - F002's first 30 s is gentle Welsh-language everyday talk about smoke, thatch and the hill.
  - Neither one states the question the scene answers.
- **For the 6-hourly scene runner and the script-review rules:**
  - The opening shot is the narrator ON CAMERA (the project lead's 27 Oct rule) delivering the scene's question in the first 5 s.
  - No catalogue IDs before 0:30.
  - Put a 2–3 s flash-forward of the scene's strongest image in the first 15 s.
  - Each scene's title and thumbnail must name what the first 30 s shows.
- **Log** each scene's Intro %, top moment and dips in the project workspace once YouTube data exists. Fold one line into the Sunday growth report.
- **Re-cut proposal (PROPOSED, zero spend):** re-edit F001's opening by trimming and reordering existing footage, with no new renders.

## Sources
- support.google.com (read)
- simonwillison.net (read; quotes the leaked PDF)
- Related: youtube-end-screens-related-video-playlists.md, youtube-test-compare-titles-thumbnails.md