# PeerTube (and a note on Odysee) for the Shorts and documentary clips: measured reach, instance choice, and a gate

Skills harvest, 31 Oct 2026 ~11:00Z. Zero budget. Expands one line in bluesky-mastodon-fediverse-heritage.md ("PeerTube for movie clips") with numbers. Status: PROPOSAL, needs the owner's OK (new public account on someone else's server).

## How PeerTube works, in one paragraph
PeerTube is open-source federated video: thousands of independent servers ("instances"), each with its own rules, upload quota and moderators. A channel on one instance is followable from Mastodon and other fediverse apps, so a clip posted there can show up in Mastodon timelines of people who follow the channel. Search across instances runs through SepiaSearch (sepiasearch.org), the Framasoft-run global index.

## What reach to expect (our own count, SepiaSearch public API, 31 Oct 2026 ~10:58Z, top 100 by relevance)
| search | results | median views | p25 | p75 | max |
|---|---|---|---|---|---|
| welsh history | 242 | 7 | 1 | 32 | 166 |
| wales history | 2,054 | 1 | 0 | 8 | 9,601 |
| cardiff | 27 | 3 | 1 | 8 | 199 |
| local history | 2,844 | 5 | 1 | 25 | 1,578 |
| history documentary | 4,153 | 2 | 0 | 29 | 165,083 |
Read: **single-digit views per clip is typical**; lower than Dailymotion (median 21, "welsh history") and the Internet Archive (16.5). The best Welsh-heritage performers (73-79 views) were chapel-ruin explorations on one active instance, i.e. a channel with followers, not search.

## Choosing an instance (joinpeertube.org instances API, 31 Oct 2026, 500 healthy instances read of 1,685 listed)
- Only 80 of 500 allowed signups; 68 of those 80 need moderator approval. Median approval response time (32 instances that report it) about **28 hours**.
- 11 UK-based instances in the sample; only 2 open for signup (one had 0 videos, one is a music-focused instance). vod.communitybroadcasting.uk (385 videos) is closed to signups and states no terms.
- Practical rule: pick an instance whose rules allow organisations and history/educational content, that is open with approval, has an active moderator team, and enough quota for ~2 min 720p clips (~25 MB each). Read and log its rules before applying (same discipline as reddit-forum-participation-heritage.md).
- Alternative without a signup: none that is free and reliable; self-hosting is out (no spend, disk tight).

## Odysee, briefly
- Odysee (LBRY-based) search works without login (lighthouse.odysee.tv returned results for "welsh history", "glamorgan"), but view counts need an authenticated API call (api.odysee.com answered 401 "authentication required" on 31 Oct), so reach could not be measured. Its audience and moderation reputation skew away from heritage; we skip Odysee unless the owner asks for it.

## Why PeerTube might still be worth a pilot
1. Fediverse reach: each clip becomes a post Mastodon users can boost; the Mastodon skill already plans a Cedwyn presence, and a PeerTube channel feeds it native video without YouTube embeds.
2. No ads, no recommendations of other channels, captions supported (PeerTube accepts subtitle files per language).
3. A second public copy on quota days (P-032), as with the Internet Archive.

## Gate
- Pilot: one channel, 5 rights-clear clips already on YouTube, cy/en/es captions, each also posted from the Cedwyn Mastodon account.
- At 60 days keep going only if the median pilot clip passes **15 views** OR Mastodon boosts of the clips reach 10+ total. Otherwise stop new uploads (leave the pilot up) and put the effort into the Internet Archive copy, which keeps a permanent identifier.

## How we apply it to Cedwyn
- PROPOSAL for the owner: one PeerTube account on an approved instance whose rules allow organisations; channel name "Cedwyn", never a family name.
- Order of value for clip mirrors, from our three measurements: Internet Archive (permanent, median 16.5) > Dailymotion (median 21 but ads/low quality audience) > PeerTube (median 1-7, fediverse boosts only). Do the Internet Archive pilot first; PeerTube only together with an active Mastodon account.
- Description: 2-3 plain sentences, source line, one link to the free Cedwyn record page with `?utm_source=peertube&utm_medium=referral`. Editorial rules apply: none of the banned words, nothing about holdings or addresses; clips HELD from YouTube stay held.

## Sources
- sepiasearch.org (our counts, 31 Oct 2026)
- instances.joinpeertube.org (instance signup data, 31 Oct 2026)
- vod.communitybroadcasting.uk ; u2be.ovh (instance terms read 31 Oct 2026)
- lighthouse.odysee.tv ; api.odysee.com (401, 31 Oct 2026)
- joinpeertube.org (what PeerTube is)
- bluesky-mastodon-fediverse-heritage.md (existing fediverse plan)