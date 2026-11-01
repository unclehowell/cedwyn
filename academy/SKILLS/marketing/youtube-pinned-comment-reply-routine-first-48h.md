# YouTube pinned comment + comment-reply routine (first 48 hours)

Harvested 1 Nov 2026 (skills harvest ~01:00Z). Topic: YouTube growth / community. Companion: youtube-comment-moderation-channel-guidelines-contested-history.md (settings); pinned-comment *placement* for links is in youtube-shorts-non-clickable-links-related-video-bridge.md and youtube-end-screens-related-video-playlists.md (not repeated here).

## What the numbers say
- CommentShark, "The YouTube Comment Report 2026" (key-statistics CSV read, CC BY 4.0; vendor of AI comment tools, so read as a descriptive study, not a ranking proof). 9,877,019 public comments, 15,403 channels:
  - 68.1% of a channel's comments arrive within 48 h of publishing (median channel); their blog adds 55.4% on publication day and 81.7% within 7 days. The window is the first two days.
  - Median creator reply rate 1.1% (9,310 channels, comments at least 7 days old).
  - 10.2% of comments are real questions; 81.2% of mature questions got no creator reply; only 11.7% got a complete answer (18.8% got any reply; 15% of those replies did not answer).
  - Creators answer money comments (buying/partnership 26.8%) 5.5x more than debate (4.9%).
  - 83.4% of comments are supportive or neutral; hostile share 18% on news channels vs 3.4% music, no other group above 6.1%.
  - Education & How-To row: 13.5% questions, 16.2% creator reply rate, 77.3% questions unanswered, 4.2% hostile.
  - 30.1% of 1k-10k-subscriber channels replied to none of their mature comments (68.5% at 1M+).
- The same vendor's blog states YouTube has not confirmed comments as a ranking factor; the case for replying is that a reply notifies the commenter (brings them back) and visible answers make subscribing more likely. Treat any "algorithm boost" claim as not checked.
- Neil Mossey (creator, LinkedIn post read) tested answering 65 comments in one hour and reports a surprising view effect, but the numbers sit inside his video (not read) - anecdote only.

## Mechanics (YouTube Help, read 1 Nov 2026)
- Pin (answer 6000964): needs advanced features (can take 24 h to show). One pinned comment per video; pinning another replaces it; your own comment or a fan's. Desktop shows it on top with "Pinned by"; on mobile viewers must open the comment section; the mobile comment *preview* may not show it.
- Heart: commenter is notified that the channel owner "loves your comment"; hearted and pinned comments are candidates for the mobile comment preview.
- Heart suggestions (answer 16971153): Studio mobile app > Community > "Comments to <heart>" > review > Add hearts to all. Only appears when there are enough comments.
- Reply suggestions (answer 10357396): suggested replies under comments in Studio/Community; "upgraded" ones are AI in your recent tone; "Reply to similar comments" for repeats. Always edit before sending.
- Reply with a Short (answer 12816427): YouTube app > comment > Reply > Shorts camera with the comment as a sticker; the commenter is told and the Short shows under the original comment. Comments can be saved for later Short replies.
- Data API: comments can be listed (commentThreads.list) and replied to / held (comments.insert, comments.setModerationStatus at 50 quota units each, youtube.force-ssl scope, channel owner only). There is NO pin or heart endpoint - pin/heart are Studio or app steps (manual or browser).

## The routine (15 min per upload, then 10 min a week)
1. At publish (T0): post our own comment and pin it: one question that invites a record-based answer (e.g. "Which year on the deed surprised you?") + the onward path (long-form: /r/<campaign> link; Shorts: "link on our channel page" because Shorts links are not clickable).
2. T+2 h, T+24 h, T+48 h: Studio > Comments > filter "I haven't responded". Order: (a) real questions, (b) corrections/feedback, (c) personal stories/local memories, (d) thanks -> heart only (use heart suggestions).
3. Answer questions completely in one line with the source (record ref / page path). A reply that does not answer counts as a miss.
4. A correction or a new memory that improves a page: heart, reply thanks, log it as a research lead; if the commenter's own words beat ours, pin their comment instead of ours (only one pin).
5. Debate / hostile: no argument in public. One neutral reply max pointing to the record, or leave it; moderation rules in the companion file.
6. A question asked twice = a Short reply (comment sticker) or a FAQ line on the page.
7. Weekly: count questions, answered fully, reply rate; target > education median (16.2% reply, < 77% unanswered).

## How we apply it to Cedwyn
- yt-stats.csv (31 Oct 09:23): Shorts sit at 2-40 views with 0-1 comments each, so the backlog is tiny: the job is to answer every real question fully within 48 h, not to chase volume.
- Every upload from the Shorts daily worker gets a pinned owner comment: one record question + "the shop and the documentary are linked on our channel page" (Shorts) or the /r/<campaign> link (long-form, e.g. the 1988 Ty Mawr film). Use both name forms where natural (Tŷ Mawr / Tymawr / Great House Farm).
- Pin and heart are manual or browser steps (no API); replies can go by API if the connected YouTube grant carries force-ssl (not checked: test with one reply on our own video first).
- Public reply text follows the editorial rules: no living family members named, none of the banned words, no insignia, no family holdings or addresses, neutral record-based wording; never mention a closed lead.
- Local memories from commenters (people who knew the farm or Church View Close) go to the research queue as leads, never published as fact without a source.
- Weekly counts ride the Sunday growth report notes (one line: questions / fully answered / reply rate).

## Sources
- commentshark.com (key stats CSV read: /youtube-comment-report/data/youtube-comment-report-2026-key-statistics.csv)
- commentshark.com (read)
- commentshark.com (read)
- support.google.com (read)
- support.google.com (read)
- support.google.com (read)
- support.google.com (read)
- developers.google.com (read)
- Neil Mossey LinkedIn post on answering 65 comments (read; numbers not shown)