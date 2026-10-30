# YouTube info cards: mid-video pointers, and reading the channel's onward-path numbers first

Topic: when (and whether) to add info cards to Cedwyn's long-form documentary videos, and how to read card / end-screen / traffic-source numbers from the YouTube Analytics API before spending effort. Complements youtube-end-screens-related-video-playlists.md (end screens, Shorts related-video link, pinned comment, YPP gate), which this does not repeat. Written 30 Oct 2026.

## Mechanics (YouTube Help 6140493, read 30 Oct 2026)
- Up to **5 cards** per video; types: **Video, Playlist, Channel, Link**. **Link cards (external site) need the YouTube Partner Program**; Video/Playlist/Channel cards do not.
- Each card has a start time; viewers see a short **teaser** at that time, otherwise a card icon (on mobile the icon shows whenever player controls show). Cards also list below the description.
- Cards do **not** show on made-for-kids videos, or when a Content ID claimant runs a campaign on the video. Videos with cards show no call-to-action overlay.
- Shorts carry no cards (known YouTube behaviour; the Shorts help page was not re-read this run). Shorts onward path = the Related video link, covered in the end-screens skill.

## Practice (practitioner/vendor, numbers not checked)
- Humble&Brag (agency guide, 2026, read): never in the **first 30 s** (hook is fragile); **2-3 cards** not 5; card appears **at the exact moment the narration names the related thing**; none in the **last 20 s** (end-screen territory).
- TubeAnalytics (vendor, read): cards typically **under 1%** click rate; if near zero, move the card to the **40-60%** mark at a natural topic turn with copy that promises a specific benefit. Vendor figure, no data set: not checked.
- Increditors (agency, read): track **teaser click rate** and **card impressions** separately; high impressions + low clicks = weak teaser copy; low impressions = placed where few viewers still watch.

## Measure first (Analytics API metrics, definitions read 30 Oct 2026)
`cardImpressions`, `cardClicks`, `cardClickRate`, `cardTeaserImpressions`, `cardTeaserClicks`, `cardTeaserClickRate`; plus dimensions `deviceType` and `insightTrafficSourceType` (END_SCREEN, RELATED_VIDEO, SHORTS, EXT_URL ...). Script: `tools/yt_onward_read.py` (stdlib; uses the connected YouTube account read-only).

**Cedwyn channel, 1-29 Oct 2026 (read 07:11Z 30 Oct):**
- 785 views; **card impressions 0, teaser impressions 0** -> no cards on any video yet.
- Traffic sources: SHORTS 519 (66%), YT_CHANNEL 99, YT_SEARCH 80, EXT_URL 35, SUBSCRIBER 25, YT_OTHER_PAGE 16, NO_LINK_OTHER 5, **RELATED_VIDEO 3**, END_SCREEN not listed (0).
- Devices: MOBILE 568, DESKTOP 100, TABLET 93, TV 20.
- Reading: about two thirds of views are Shorts, where cards cannot appear, so cards touch at most ~260 long-form views a month. The cheap win is still the description/pinned-comment link (EXT_URL is only 35 inbound views) and a playlist card that keeps long-form viewers in the documentary series.

## How to do it
1. Pick long-form videos only (doors/scenes, map film). In each script, find 1-2 moments where narration or a caption names another scene, place or record ("the 1916 tenancy document", "the next door").
2. Add a **Video or Playlist card** at that second (not before 0:30, not in the last 20 s), teaser text 30 characters or less naming the payoff ("See the 1916 document scene").
3. One card per video points at the **documentary series playlist**, so a viewer on any scene can binge in order.
4. Pre-YPP there is no Link card: the site route is the description's first line + pinned comment with UTMs (utm_source=youtube&utm_medium=video&utm_campaign=<slug>).
5. Re-read with the script after 28 days; act only on videos with 100+ card teaser impressions; under 0.5% teaser click rate -> rewrite teaser or move to a topic turn.

## How we apply it to Cedwyn
- Next documentary scene upload: add one Playlist card (series) at the first topic turn after 0:30 and, if the scene references an earlier door, one Video card at that line. Editorial rules apply to teaser text (no banned public words, never name family members not already public, no "tenant farmers").
- Add the onward-path line (views by source, card teaser CTR, RELATED_VIDEO/END_SCREEN views) to the Sunday growth report.
- Revisit Link cards when YPP is reached (see youtube-partner-program-2027-thresholds-hype-readiness.md).

## Sources
- support.google.com (read 30 Oct 2026)
- developers.google.com (card metrics definitions, read 30 Oct 2026)
- humbleandbrag.com (agency, read)
- tubeanalytics.net (vendor, read; figures not checked)
- increditors.com (agency, read)
- Cedwyn channel YouTube Analytics API reads, 30 Oct 2026 07:10-07:11Z (connected account, read-only)