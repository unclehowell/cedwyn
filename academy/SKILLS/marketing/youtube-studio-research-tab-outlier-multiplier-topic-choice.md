# YouTube Studio "Insights" + "Research" (outlier multiplier) for documentary topic choice, after the Inspiration tab's retirement

Harvested 30 Oct 2026 ~12:02Z. Not in INDEX before this run ('research tab' 0, 'ask studio' 0, 'insight card' 0, 'inspiration tab' 0; 'outlier' appeared only as a vendor name in the Hype skill). Skipped as covered: Test & compare (titles/thumbnails), Shorts Series/serial shows, multi-language audio.

## What the sources say
- **Inspiration tab is being retired.** YouTube help 15575509 (Google's own page; search snippet read 30 Oct 2026, page not opened): "Starting August 2026, we are gradually deprecating the Inspiration tab. For brainstorming content ideas, use Ask Studio."
- **Analytics becomes "Insights" (test from 16 Jul 2026).** Source: a YouTube staff post on the Community forum, reported by Net Influencer, read 30 Oct.
  - Related metrics are grouped together, with a simpler date picker and an "Advanced Mode" for custom ranges.
  - Creators who can use **Ask Studio** (the conversational analytics assistant) get four AI cards: Channel Summary, Content Patterns, Audience Loyalty and Video Summary.
  - The Trends tab becomes **Research**. Desktop "saved keywords" are retired, with 3 months to download them as CSV.
- **Research tab** (Tubefilter, 5 Aug 2026, read; OutlierKit, updated 3 Oct 2026, read, vendor):
  - It lists other channels' videos with subscriber count, upload date, views and an **outlier multiplier**: how a video did against its own channel's other videos. Screenshots ran from **4x to 132x**.
  - Filters cover views, outlier score and video age, plus **"Watched by my viewers"**, which shows only what your own audience watches in volume.
  - Practitioner testimony: Mario Joos, a retention consultant for MrBeast-scale channels, calls that filter "where YouTube wins over any other tool". He states he and his creators "haven't found [the Inspiration tab] very useful".
  - Rollout: shown at Made on YouTube (23 Sep 2026), now with a topic box. In August YouTube said it was with "a small number of users", and **no wide rollout date** has been given.
  - The limit (OutlierKit): results come from what *your* viewers watch, so a tiny channel gets a thin list.
- **Made on YouTube 2026** (YouTube blog, Neal Mohan, 23 Sep 2026, read):
  - **video A/B testing of up to three cuts**. Coverage gives it as **from 2027**, so it isn't live; titles and thumbnails stay with Test & compare.
  - Studio guidance on early drafts and thumbnail generation.
  - Custom viewer feeds by prompt, e.g. "Evening wind down with long documentaries", which helps long-form documentaries be found.
  - Members-only spaces, and live auto-dubbing as a small test.
- **Numbers:** no lift figures for any of this from YouTube or practitioners. The multiplier range (4x–132x) comes from screenshots. OutlierKit's search-volume pull (e.g. "youtube outlier" 4,792/mo) is vendor data, **not checked**.

## How to do it
1. Monthly: check Studio for the **Research** tab (Insights > Research). If it's there, filter to the last 30–90 days, sort by outlier score and type topic words (Welsh history, lost farms, Patagonia Welsh, manorial houses, archives).
2. Without the tab, or while the channel is too small for "Watched by my viewers": build the same score by hand.
   - List 10–20 recent videos each from 5–8 heritage/local-history channels into a CSV (`channel,video_title,views,age_days,url`).
   - Run `timeout -k 5 120 python3 tools/yt_outlier.py list.csv --max-age 365 --min-mult 3`.
   - multiplier = views ÷ median of the same channel's other videos. Fewer than 5 videos on a channel is flagged as a thin baseline.
3. Read a 3x+ outlier for its **format and angle** (question title, place + year, "what happened to…", a reveal), never its words. Write 1–3 candidate angles per month. Copying titles or footage is out.
4. Once Ask Studio cards appear, read **Audience Loyalty** and **Content Patterns** after each upload. Note one line per door in the episode log, e.g. returning viewers, or a pattern such as "map-led openings hold better".
5. Download any saved keywords as CSV before the 3-month window closes.

## How we apply it to Cedwyn
- **Documentary (door-a-day):** use the monthly outlier list to choose the **title and thumbnail angle** and the order of the next doors' trailers and Shorts. The chronology stays fixed by SCENE-LIST; only the packaging changes, so no history is bent to chase a trend.
  - PROPOSAL: the CEDWYN MOVIE RUN reads `the project workspace<month>.md` before writing each door's YouTube title and description.
- **E-books:** a strong outlier angle (e.g. "the farm that vanished from the map") becomes the hook of the Short that points to /ebooks/. v0.0.1 stays free and v0.0.2 stays £4.99; no price tests.
- **Academy:** Content Patterns notes go into the /learn/ lesson ideas file (which formats hold attention). Nothing personal, no names.
- **Site:** the long-form documentary page keeps its description written so it can match "long documentaries" custom feeds: a plain genre line, place, period and runtime.
- **Channel size:** Cedwyn's channel is tiny (single-digit subscribers in the Hype skill note), so "Watched by my viewers" will be empty for now. The hand CSV route is the working one. Re-check the native tab at 100+ subscribers. Video-cut A/B waits for 2027.
- Read-only. Nothing was posted, uploaded or changed by this harvest.

## Sources
- support.google.com (Inspiration tab deprecation; snippet)
- netinfluencer.com
- tubefilter.com
- outlierkit.com (vendor)
- blog.youtube