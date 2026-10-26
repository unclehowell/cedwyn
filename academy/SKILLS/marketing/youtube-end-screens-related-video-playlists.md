# YouTube: send viewers on (end screens, Shorts "Related video", playlists, pinned comment)

Date: 2026-10-26 (skills harvest 18:13). Status for Cedwyn: channel settings and metadata are ours to set within the existing YouTube flywheel; anything public-facing in wording stays under the editorial rules below.

## What the evidence shows
- **YouTube Help, "Add end screens to videos"** (read): end screens sit in the **last 5-20 seconds**; up to **4 elements** on 16:9 video; the video must be **at least 25 seconds**; not available on Made for Kids videos, mobile web or 360 video; viewers can hide them. Element types: video/playlist, subscribe, channel, and **Link (external website) only for channels in the YouTube Partner Programme**.
- **YouTube Official Blog, 14 Jul 2026** ("How to convert YouTube Shorts views into long-form channel growth", read in full): the main bridge from a Short is the **Related video** link (Studio > Content > the Short > Related video). Match intent (a quick clip links to the full story), add a verbal + visual call to action in the **last 5 seconds**, and make the first 5-10 seconds of the linked long video pay off the Short's promise (no logo intro). It also suggests vertical live streams, which surface in the Shorts feed.
- **TubeAnalytics blog** (vendor, Jul/Aug 2026, read): end screens bring **3-8% of channel views** when tuned; cards usually **under 1%** click rate; topic playlists lengthen sessions **40-70%**; single-element end screens with a spoken bridge beat 4-element layouts; under 2% end-screen click rate = a relevance problem. These are the vendor's own figures with no data set published: **not checked**.
- Reddit r/letsplay creator (2016, snippet only): 2.76% end-screen click rate: **not checked**, old.
- No numbers found for heritage/history channels specifically.

## How to do it
1. **Long videos (25 s+):** script a 10-15 s spoken bridge naming the one next video ("the 1824 survey map is in the next film"). End screen = **one** video element (the logical next film) + subscribe. Nothing important on screen in that window.
2. **Shorts:** set **Related video** on every Short to the long film it comes from, and say/point to it in the last 5 seconds. Long video must open straight on the Short's topic.
3. **Playlists by topic, not upload date** (e.g. "Tŷ Mawr records", "Llandough parish", "Welsh Patagonia / Gales en la Patagonia"). Each video's end screen points to the next in its playlist.
4. **Off-YouTube clicks without the Partner Programme:** the first line of the description and a **pinned comment** carry one link to the matching Cedwyn page with UTMs (utm_source=youtube&utm_medium=video&utm_campaign=<slug>; see utm-discipline-ga4-funnel.md). Cards and end-screen links to the site come only after the channel joins YPP.
5. **Measure monthly** in YouTube Analytics: end-screen element click rate, traffic source "Shorts feed > related video", playlist views; on the site, sessions with utm_source=youtube. Change one thing per video per fortnight (youtube-test-compare-titles-thumbnails.md).

## How we apply it to Cedwyn
- **State on 26 Oct:** 7 subscribers at the 24 Oct baseline, so no Partner Programme and no external-link end screens or cards. 18 Shorts uploaded, 17 queued (quota resets 07:00 UTC 27 Oct). The 13-minute map film is the channel trailer.
- **Proposed set-up for the upload queue (no wording change to the films themselves):**
  - Every Short: Related video = the 13-minute map film or the matching long film; pinned comment with one UTM link to the matching Cedwyn page or /ebooks/.
  - Long films: one-element end screen to the next film in its topic playlist + subscribe.
  - Three topic playlists, EN and ES titles.
- **Wording rules for descriptions and pinned comments:** "The first record mention found of the farm is the 1824 David Stewart survey of the Bute estate." / "The family acquired Tŷ Mawr in 1667 (1974 newspapers; ITV News 1988)." No Bute-era dates beyond the 1824 survey, no banned words, never name the owner, no accusations about named people.
- **Who does it:** the bizdev/YouTube upload runs, through the connected YouTube account (playlist and description edits use the same quota; spread over days). Related-video and end-screen settings are Studio-only and may need the browser; if so, log it as a manual step.

## Sources
- support.google.com (read, 26 Oct 2026)
- blog.youtube (read in full)
- tubeanalytics.net (read; vendor figures not checked)
- reddit.com (snippet; not checked)