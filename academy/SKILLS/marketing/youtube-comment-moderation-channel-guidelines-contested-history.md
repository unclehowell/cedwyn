# YouTube comment moderation + channel guidelines for a contested-history channel

Harvested 1 Nov 2026 (skills harvest ~01:00Z). Topic: YouTube community / brand safety. Companion: youtube-pinned-comment-reply-routine-first-48h.md (the reply routine).

## Why it matters (numbers)
- CommentShark 2026 study (9.9M comments, 15,403 channels; vendor, CC BY 4.0; key stats CSV read): 83.4% of comments are supportive or neutral, but news-type channels carry 18% hostile comments vs <= 6.1% in every other group; 11% of a median channel's comments are repeated text (bots or copy-paste); creators reply to debate only 4.9% of the time. A land-dispute history channel sits between education (4.2% hostile) and news (18%), so settings should be set before a video travels, not after.

## The controls (YouTube Help 9483359 and 11895180, read 1 Nov 2026)
- Per-video comment state: On / Pause (keeps old comments, stops new ones - for a sudden spike) / Off (hides existing ones until turned back on).
- Moderation level: None / Basic (holds likely spam, self-promotion, gibberish, inappropriate) / Strict (holds a broader range) / Hold all. AI-based, can be wrong; held comments stay in Studio > Comments > Held for up to 60 days, then are gone.
- Who can comment (video level, not channel level): Subscribers and members, with a minimum subscription time of any / 1 hour / 1 day / 1 week (bulk-edit for many videos). A cheap brake against drive-by accounts.
- Channel-level, applies to every video and the channel page (cannot be set per video): Hidden users (their comments vanish everywhere and cannot be reviewed; they also cannot clip), Approved users (skip all filters), Blocked words (comments containing or closely matching are held up to 60 days; also blocks clips), Block links (holds comments with URLs, except from you, moderators, approved users).
- Default comment settings apply to NEW uploads only; existing videos keep their old setting.
- Channel guidelines (Settings > Community moderation > Channel guidelines): a welcome message + up to 3 rules, shown to viewers before they comment (mobile only for comments). Not enforced automatically - they set expectations for what you hold. Google's examples: Be civil and respectful; Stick to the topic; Questions welcome; No self-promotion or spam; Challenge the argument, not the person.
- Data API: comments.setModerationStatus (heldForReview / published / rejected, 50 units, owner only) can act on comments; settings themselves are Studio-only.

## Setup (20 minutes, once)
1. Default for new uploads: comments On, moderation Strict (start strict; relax to Basic if the Held tab is mostly fine comments after 2 weeks).
2. Block links: on (stops scam links; our own pinned links still post).
3. Blocked words: a private list of personal-data and abuse patterns (addresses, phone-number fragments, slurs, names of living private people who must not appear). Short and specific - close matches are held too.
4. Approved users: our own accounts and any trusted local-history partner channel once they comment well twice.
5. Channel guidelines: welcome line + 3 rules (below).
6. Review cadence: Held tab twice a week (inside the 60-day window); approve good ones, which also teaches you what Strict over-holds.
7. Spike plan: if a video gets an unusual burst, Pause that video's comments, review, then turn On; or set "Subscribers, 1 day" for that video.

## Suggested guideline text (EN; Welsh and Spanish versions to add)
- Welcome: "Croeso / Welcome. This channel shows records about one Glamorgan estate. Please read these before you comment."
- 1. Questions welcome - we answer with the record.
- 2. Challenge the record, not the person.
- 3. No personal details, links or self-promotion.

## How we apply it to Cedwyn
- The channel publishes records from a contested land history, so the risk is less spam than personal attacks and private data; Strict + link blocking + a blocked-words list for personal data fits the editorial rules (no living family members named, nothing about family holdings or addresses).
- Hidden users is irreversible in review terms (their comments cannot be seen in Studio) - use it only for repeat abuse; a single heated comment is held/left, never hidden.
- Comments that correct a date or add a memory are research leads (to the queue), and the reply rule from the companion file applies.
- Owner action: these are Studio settings on the owner's channel. Settings change nothing public and are reversible, but they sit in the owner's account - propose as one HubSpot [BIZDEV] task with the exact values above; apply after the owner's yes, or by browser if a standing yes exists.
- Measure: weekly count of held / approved / removed alongside the reply-rate line in the Sunday growth notes.

## Sources
- support.google.com (read)
- support.google.com (read)
- support.google.com (read: moderation settings apply to the mobile comment preview too)
- commentshark.com (key stats CSV read)
- developers.google.com (read)