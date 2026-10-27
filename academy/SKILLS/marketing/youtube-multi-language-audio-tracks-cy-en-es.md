# YouTube multi-language audio: one video with Welsh, English and Spanish audio tracks (plus localised thumbnails)

Date: 2026-10-26 (skills harvest 23:37). Status for Cedwyn: uploading to our own channel is routine posting work, with no new channel and no spend. It still sits behind whatever posting GO rules apply to YouTube in the project workspace, so read RULES.md first.

## What the evidence shows
- **YouTube Help 13338784, "Add multi-language features to your videos" (read 26 Oct 2026):**
  - You can upload extra audio tracks in other languages to one video or Short. Long-form videos can also have localised thumbnails.
  - Viewers get the track matching their preferred language (from watch history) automatically, and can switch in the player.
  - Translated titles and descriptions are used by search: the video "can be found when viewers search using a translated video title and description".
  - **Eligibility:** creators with access to Advanced features. **Desktop Studio only:** Languages > video > Add language > Dub > Add > audio-only file, roughly the same length as the video > Publish.
  - If an automatic dub exists for that language, delete it before uploading your own. A secondary track whose copyrighted content differs from the original may be removed.
  - YouTube's own advice: "Prioritize depth" (one or two languages across as much of the catalogue as possible), "dub your back catalog" (half or more of it), match the primary track closely, check Analytics broken down by audio language, and tell viewers the dubs exist.
  - Audio-description tracks can be uploaded the same way.
- **YouTube Blog, Ritz Campbell (Product Manager), 10 Sep 2025 (read):**
  - Expanded to "millions of creators".
  - On average, creators uploading multi-language tracks saw **over 25% of watch time from views in the non-primary language**.
  - **Jamie Oliver's channel: views up 3x.** Mark Rober averages 30+ languages per video.
  - Localised thumbnails were in pilot at that date.
  - These are YouTube's own figures, not independently checked.
- **YouTube Help 15569972, automatic dubbing (read):**
  - Auto-dubs from English cover Spanish (and about 20 other languages) but **not Welsh**; a Welsh-original video cannot be auto-dubbed at all.
  - Ineligible: over 120 min, little speech, music only, fast speech, copyright assertions.
  - So for Welsh, **only our own uploaded track** works.

## How to do it (steps)
1. **Check eligibility:** Studio > Settings > Channel > Feature eligibility > Advanced features. This needs phone verification plus ID, video verification or channel history (the exact route is not checked). Done once.
2. **Set the original language** of each video correctly (Studio > video > Language). Wrong settings break auto-dubs and the language analytics.
3. **Turn OFF automatic dubbing** for our videos (Advanced settings), or review each auto-dub before it publishes. A machine Spanish voice over archive narration may clash with our own track and must be deleted before ours can go up.
4. **Export one audio-only file per language** (AAC/M4A or WAV; MP3 not checked as accepted), matching the master's length to within a second. ffmpeg: `ffmpeg -i master.webm -map 0:a:1 -c:a aac -b:a 160k cy.m4a` (choose the right stream index per track).
5. **Add translated title and description** for cy and es (Languages > title & description), plus caption tracks in each language. The existing captions skill (youtube-chapters-captions-transcripts-archive) covers captions; this skill adds the audio.
6. **Localised thumbnail** (long-form): the same image with the title text in Welsh or Spanish.
7. **Say it in the video:** pin a comment and add a description line in each language: "Gwrandewch yn Gymraeg / Escuchá en español: gear icon > Audio track."
8. **Measure:** Analytics > Advanced mode > Audio language (views and watch time per track). Run this 28 days after the first dubbed upload, and compare the share of watch time from Argentina and Wales with earlier videos.

## How we apply it to Cedwyn
- **We already have the tracks.** The Cedwyn movie flywheel renders each daily ~2 min scene with cy/en/es audio (RUNNER.md). Today those live in a webm on the movie repo. Put the same scene on YouTube as **one video with three tracks**, not three uploads, so views, comments and Hype eligibility concentrate on one video.
- **Primary language:** English, for the largest search audience. Upload Welsh and Spanish as dubs. For Welsh-first pieces (e.g. a papur bro tie-in), set Welsh as primary, with English and Spanish as dubs.
- **Back catalogue:** add Spanish tracks first to the existing archive films with the most Argentine views. Spanish is the language with the clearer audience: the Welsh Patagonia societies and the Chubut press skills already map it.
- **E-book tie-in:** the description links only to the Cedwyn /ebooks/ page, with the Spanish description pointing at the Spanish hub (internal Cedwyn URLs only).
- **Gate:** if the channel lacks Advanced features, the fallback is a Spanish caption track plus translated title and description, which works without eligibility.
- **Not checked:** whether the Cedwyn YouTube channel has Advanced features today (read it through the connected YouTube account before first use), exact accepted audio formats, and whether multi-language audio works on Shorts for our channel.

## Sources
- support.google.com (read 26 Oct 2026)
- blog.youtube (read 26 Oct 2026; post dated 10 Sep 2025)
- support.google.com (read 26 Oct 2026; supported language table)