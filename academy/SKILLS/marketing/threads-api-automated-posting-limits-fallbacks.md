# Threads automated posting: official API route, free fallbacks, and what the data states to post
Harvested 2026-10-30 02:47Z. Builds on threads-heritage-profile-communities.md (profile/communities) and feed-to-social-auto-posting-posse.md (POSSE); this file is the mechanics and limits of posting to Threads by code.

## The official route (Meta docs, read 30 Oct 2026; Posts doc updated 13 Oct 2026)
- Permissions: `threads_basic` + `threads_content_publish`. Until the app passes **App Review** it can post only for users with a role on the app (tester); after review, for any user who grants it. For one owned profile, tester role is enough: **no review needed**.
- Two steps: `POST graph.threads.com (media_type TEXT/IMAGE/VIDEO, `text`, `image_url` on a public server) returns a container id; wait **~30 s** (Meta's recommendation; check container status), then `POST /{user-id}/threads_publish` with `creation_id`.
- Limits: text **500 characters** (emoji count as UTF-8 bytes); **250 published posts / 24 h** per profile (carousel = 1), 1,000 replies, 100 deletions (blotato.com summary of Meta quotas); carousels 2-20 items; **max 5 links** per post (since 22 Dec 2025 more fail with `THREADS_API__LINK_LIMIT_EXCEEDED`).
- Links: `link_attachment` gives a preview card, **text-only posts only**; with no link_attachment, the first link in a text post becomes the card.
- Topic tag: `topic_tag` param (1-50 chars, no `.` or `&`); one topic per post is how Threads routes to communities/feeds.
- New Apr 2026 (Meta dev blog, 14 Apr): text attachments up to 10,000 chars with formatting, cross-share to Instagram Stories, reply approvals, spoilers, publish/delete webhooks, **tokenless oEmbed** (embed a public Threads post on a site, no token, no review), web intent params (`threads.com with pre-set topic tag and reply control), profile discovery threshold cut from 1,000 to 100 followers.
- Cost: free; no paid tier.

## What to post (practitioner data)
- Buffer, State of Social Media Engagement 2026 (52M+ posts; read): on Threads **carousels median engagement 21.77%, about 3x video or images**; "Threads rewards visuals more than its text-first positioning suggests".
- Same report: posts where the account **replies to comments: +42% engagement on Threads**, the largest lift of six platforms; about two-thirds of accounts did better on posts where they replied. Correlation, compared within each account.
- Threads median engagement fell ~4.4% -> ~3.6% year on year (Buffer): reach is earned by conversation, not volume.
- Practical read: automate the *publishing*, never the replying. A bot that posts and goes silent forfeits the biggest measured lever.

## How to do it (checklist)
1. Profile: Threads profile comes from the Instagram account; the owner creates it once in the app (an agent cannot).
2. Meta app (free, developers.facebook.com): add the Threads use case, add the profile as Threads tester, owner accepts the tester invite in Threads settings, run the OAuth once to get a long-lived token (60 days; refresh before expiry). Store the token in the vault, never in a repo or chat.
3. Poster script: read the site feed; for each new item build (a) a text post <=500 chars with one topic tag and the page as `link_attachment`, or (b) a 3-6 image carousel of our own images with the link in a first self-reply (cards only work on text posts). Wait 30 s, check status, publish; log ids; never re-post the same URL; >=4 h between posts.
4. Reply loop (human-in-the-loop): pull replies daily (`threads_manage_replies` scope if used); draft answers; a person approves; answer within 24 h.
5. No-token fallbacks today: "Share on Threads" web-intent button on evidence/e-book pages; tokenless oEmbed to show our best Threads posts on the site.

## How we apply it to Cedwyn
- Status: Threads is **not connected** (no toolkit in the connected apps list; earlier skill confirmed). Blocker only the owner can clear: create the Threads profile from @cedwynestate and accept the app tester invite. Until then, do steps 5 (share intent button + embeds) which need no login.
- Once live, extend the project workspace with a Threads channel: same safety scan, same "page+image live first" rule, same >=4 h spacing; carousels of our own catalogued images (no likeness of real family members, no insignia), link via first reply; topic tags such as "Welsh History" / "Local History" (check which exist in Threads communities).
- Measure: per-post views, replies, link clicks (UTM `utm_source=threads&utm_medium=social`), weekly into the growth report; judge after 20 posts.
- Never DM, never auto-reply, never post in others' threads by bot. Zero spend.

## Sources
- developers.facebook.com (read: permissions, 2-step flow, 30 s wait, 500 chars, 5-link limit, link_attachment, topic_tag, carousel 2-20)
- developers.facebook.com (read: Apr 2026 features, tokenless oEmbed, web intents, 100-follower discovery)
- blotato.com (read: free; 250 posts/1,000 replies/100 deletions per 24 h; 4,800 x impressions call budget)
- buffer.com (read: carousels 21.77%, replies +42%, Threads ER ~4.4% -> ~3.6%)