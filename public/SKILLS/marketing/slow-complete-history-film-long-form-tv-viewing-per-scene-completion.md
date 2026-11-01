# Slow, complete history film: how long, measured documentaries hold an audience, and how to measure ours

Topic: making the owner's 31 Oct rule work commercially. The rule: leisurely, explanatory scenes, one era per scene, every researched fact shown before moving on, several scenes per period if needed. This file covers why long, unhurried history video can hold viewers, and what to measure so we know. Written 31 Oct 2026 (skills harvest). Checked first: 0 hits in INDEX.md for "slow", "binge", "continuous play", "TV app", "living room", "completion per scene". Hook, retention-curve and Shorts basics are in video-intro-hook-first-30-seconds-retention.md and youtube-retention-key-moments-...; this file does not repeat them.

## Evidence
- **Long, slow history has a proven audience.** *Fall of Civilizations* (Paul M.M. Cooper) makes 2-4+ hour narrated episodes at a deliberately unhurried pace. In his Reddit AMA (r/IAmA, Apr 2024) he wrote "our most popular video has been viewed more than 30 million times". That line is from the search result snippet; reddit.com returned 403 to us, so the full thread was not read. In the same thread viewers asked for *more* 3-4 hour episodes on a single civilisation.
- **YouTube is watched on TVs, sitting down.** Neal Mohan's annual letter (Feb 2025, reported by Variety, read): TV has overtaken mobile and desktop as the primary device for YouTube viewing in the US by watch time; Nielsen has YouTube No. 1 in TV time spent for two years. His 2026 letter (blog.youtube, read): YouTube "#1 in streaming watchtime in the U.S. for nearly three years" (Nielsen); "YouTube is the new TV". Living-room viewers choose long, calm programmes, not 30-second cuts.
- **What "good" retention looks like at each length** (vidIQ, "What is a good AVD?", updated 21 Jul 2026, read): under 5 min aim for 50-70% viewed; 5-15 min 40-55%; 15-30 min 30-45%; over 30 min 25-35%. vidIQ's own long-form videos averaged 3 min 11 s, 30.3% viewed, across 16.5 M views (Jun 2025 onward). So a *lower percentage* on a longer film is normal. Judge each length against its own band, not against Shorts.
- **Average view duration is an average.** vidIQ's example: 5 of 10 viewers watch all 10 minutes and 5 leave at 2 minutes, giving AVD 6 min. Always read the retention *curve* (where people leave) before cutting anything.

## The how-to
1. **Slow is not the same as hidden.** In the first 10-15 seconds of each scene, show on screen *where and when* we are (caption: year/era, place) and what this scene will show. Then take the time. Viewers stay through slow material when they know what they are watching and why.
2. **One scene = one moment, and it finishes.** End each scene on a clear close (the fact delivered, a held shot), then play the next scene of the same period automatically ("continuous play"). Leisurely scenes add up to a programme, not a pile of clips.
3. **Package by period as well as by door.** Offer "Watch the whole Roman period" (all scenes for that period, back to back) beside the door-a-day view. On YouTube this is one playlist per period, with each long period also published as a single long compilation once all its scenes exist. TV viewers start a compilation and leave it running.
4. **Measure per scene, per language, per version** on our own player (first-party beacon, no new tool):
   - `play` and `ended` events with {scene, lang, version}, plus `progress` at 25/50/75%.
   - completion = ended / plays, with a confidence interval: `python3 tools/scene_completion.py events.csv` (own stdlib script, below).
   - Don't judge a scene under 30 plays. Compare scenes of similar length; use the vidIQ bands for YouTube uploads.
5. **What to change when a scene loses people.** Look at the curve. A cliff at 0-15 s means the scene opening lacks the where/when caption. A steady slide is normal. A drop at one shot means that shot (a still that sits too long, a line that's hard to follow); fix that shot, not the pace. Never fix retention by cutting researched facts: the rule states every fact stays. Move a fact to its own scene instead.
6. **Report it honestly.** In the weekly growth report: plays, completion per scene/lang, and which period compilations exist.

## How we apply it to Cedwyn
- The re-split SCENES.json (a worker) will make periods span several ~2-min scenes. Add a `period_id` to each scene so the player and YouTube upload script can build "whole period" playlists and compilations automatically.
- Player spec: where/when caption in the first 15 s of each scene (from the scene's period and date fields; no new render needed, it's an HTML/VTT overlay); auto-advance to the next scene of the same period; `play/progress/ended` beacon events with {scene, lang, version}.
- YouTube: when every scene of a period is live in a language, upload one long period compilation in that language (cy, en, es separately; never mixed) with chapters per scene. This works with the 6-hourly scene cadence: the doors stay the daily hook, the compilations serve sit-down TV viewers.
- Growth report: add scene completion per language to the project workspace once 30+ plays exist.

## Tool
- `tools/scene_completion.py`: own script, stdlib only, no install (disk 1.2-1.3 GB free on 31 Oct). Input is a CSV with columns event,scene,lang,version (event = play|ended). Output is plays, ends, completion and Wilson 95% CI per (scene, lang, version), with "too few" under 30 plays.

## Sources
- reddit.com (search snippet only; reddit returned 403, full thread not read)
- variety.com (read)
- blog.youtube (read)
- vidiq.com (read)