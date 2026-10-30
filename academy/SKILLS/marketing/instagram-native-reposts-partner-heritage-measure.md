# Instagram native Reposts: what they do for us, and how to measure them (2026)

Slug: instagram-native-reposts-partner-heritage-measure.md · written 2026-10-30 (skills harvest) · scope: Great House Farm / cedwyn only

## What the feature is (primary sources)
- Launched 6 Aug 2025 (Meta Newsroom). Anyone can repost a PUBLIC Reel or feed post with the repost icon, optionally with a short note (thought bubble).
- Reposts are "recommended to your friends' and followers' feeds" and sit in a separate Reposts tab on the reposter's profile.
- Reposts are "credited to the original poster". Meta's own words: if your content is reposted, "it may be recommended to that person's followers, even if those people don't follow you."
- Reels "Friends" tab (same launch) shows what friends liked, created, reposted or commented on: a repost is a social signal, not just a share.
- API (Meta for Developers blog, 22 Apr 2026, and the IG Media Insights reference read today): `reposts` = "number of reposts on the IG media minus the number of deleted reposts", for FEED, REELS and STORY. A Reposts Count field is also on the Media endpoint, alongside new saved/shares counts and aggregated total views/likes/comments across Instagram, crossposted Facebook and boosted media. `facebook_views` now covers Feed posts and Stories too. Collaborative media endpoints return the same fields for posts where we are an accepted collaborator.
- An owner can turn off reposting of their content (Profile > menu > How others can interact with you > Sharing). Source: Instagram's own "popular" help snippet; the help-centre page itself was not opened, so the exact path is not checked.

## What the ranking side states
- Mosseri's ranking series, Part 2 (9 Sep 2026), as transcribed by Yong Suk Choi (BAZZAAL, 3 Oct 2026): Instagram "gives more distribution to the original creator than to those who reposted", estimates originality from the account's posting history, and the share of impressions going to originals "has gone way up". Transcript is a third party's; the original videos were not watched here, so treat wording as not checked.
- Practical reading: reposting other accounts' posts does little for OUR reach and, done a lot, makes us look like a repost account. Being reposted by others is the valuable direction, because the credit and the recommendation flow back to the original.
- No published numbers yet on how much a repost lifts the original's reach. BAZZAAL's case (four creator-posted originals, 1.2M+ combined views, no ad spend) is about originals on creator accounts, not reposts; vendor-reported, not checked.

## The playbook
1. Make repostable originals: one clear dated record, map or photo per post, readable without our caption (the repost note is short and our caption is not shown prominently on the reposter's feed - not checked, so put the key line on the image/first frame).
2. Keep reposting ON for @cedwynestate (do not touch the Sharing toggle).
3. Repost sparingly ourselves: at most 1 repost per 5 originals, only posts that are on-scope (a public heritage account's photo of Leckwith/Llandough village life, an archive's post of a Glamorgan record) and always with a neutral note. Never repost anything about Llandough Farm as if it were Great House Farm.
4. Measure the right number: pull `reposts`, `shares`, `saved`, `views`, `reach` per media weekly. Reposts and shares are the "travel" signals; a post with reposts >= 1 is a candidate for a follow-up in the same style.
5. Read it as rates: reposts per 1,000 views, not raw counts (the series' advice is rates, not views).

## How we apply it to Cedwyn
- Measurement first (no outreach, outreach is on hold): add `reposts,shares,saved,views,reach` to whatever pulls Instagram media insights for the weekly growth report (the project workspace or the project workspace, which today pulls Facebook post insights only). The connected instagram toolkit's tool slug for media insights was not checked here; the Graph call is `GET /<IG_MEDIA_ID>/insights?metric=reposts,shares,saved,views,reach`.
- Baseline: record reposts for the last 20 @cedwynestate posts once; afterwards log reposts per 1,000 views per post in the project workspace
- Map-video style (15 pins, today's Reel) is the kind of single-idea original that gets reposted; if it earns reposts, the next two Reels copy its first-frame layout.
- Our own reposting is PROPOSED, not automatic: the auto-social runner posts originals only. Any repost of a partner heritage account goes through the same safety scan (banned words, never name the owner, no insignia, GHF/cedwyn scope) and is logged in the project workspace
- Do not ask partner accounts to repost us while outreach is on hold. If one reposts us anyway, note it (who, which post, reposts count) for the growth report; a thank-you comment is a public reply, allowed under the comment-reply rule.
- Kill rule: if after 8 weeks reposts stay at 0 on every post, drop the metric from the weekly line (keep the API field in the pull).

## Sources
- about.fb.com (Meta Newsroom, 6 Aug 2025; read)
- developers.facebook.com (Meta for Developers, 22 Apr 2026; read)
- developers.facebook.com (metric table incl. `reposts`; read 30 Oct 2026)
- bazzaal.com (transcript of Mosseri's Sep 2026 ranking videos; read; third-party)
- instagram.com (search snippet only; not opened)