# Facebook Page reach triage: limited originality, recommendation eligibility, Page quality

Use when: a Facebook Page's posts suddenly reach only followers or almost nobody, or Meta shows a "limited originality" / "recommendations" notice. This is the Facebook companion to instagram-reach-collapse-account-status-originality-triage.md. Harvested 27 Oct 2026.

The Reels-making playbook is facebook-reels-originality-archive-clips.md (Meta, Mar 2026). This file adds the diagnosis: where the notice shows, the 90-day penalty, and the full minor-editorialization list. It also corrects one line there: on third-party material such as archive scans, burned-in subtitles or an on-screen caption alone do not make a post original.

## What Meta states (primary sources, read in full 27 Oct 2026)

**Combating unoriginal content** (Facebook Creators blog, July 2025):
- In H1 2025 Meta acted on ~500,000 spammy or fake-engagement accounts and removed ~10M profiles impersonating large creators.
- Accounts that repeatedly reuse others' videos, photos or text get two penalties:
  - they lose monetization "for a period of time";
  - they get "reduced distribution on everything they share" (the whole Page, not one post).
- Duplicate videos are detected, and the copies are demoted.
- Explicitly allowed: "You can share the same content across any of your Pages or profiles."
- Watermarks and stitched clips are "not meaningful enhancement".

**Limited Originality of Content help page** (Meta Business Help 3382366608650437):
- Unoriginal content "will not be recommended to audiences that do not follow your Page". Followers still see it, which matches the symptom of reach flat at follower level.
- The violation shows in Meta Business Suite, the Business/Creator Dashboard (formerly Professional dashboard) or the app, with the line "shared content that was unoriginal, or repurposed content from other sources with limited added value".
- Usual penalty: 90 days of demonetization, extended by any further unoriginal posts.
- Check under Meta Business Suite > Monetization > Policy Issues.
- Fix:
  - Appeal if flagged wrongly.
  - Otherwise, post "a significant number of reels that are original or meaningfully enhanced" before asking for review.
  - Do not bulk-delete old content to speed things up.

**Original Content Guidelines** (Meta Business Help 262834734651607). These changes count as **minor editorialization**, which means still unoriginal:
- superimposed borders;
- logos or watermarks;
- only an on-screen caption or title;
- background music;
- speed change;
- subtitle transcripts;
- voiceover that only describes what the image shows;
- watch-along reactions.

These count as **meaningful enhancement**:
- your own on-screen presence adding new information or storyline;
- third-party clips interspersed in footage you filmed, to give evidence for your own narrative, with original commentary as the focus;
- for photo memes, text on the image adding at least two new pieces of information or changing its interpretation. Text in the description alone does not count.

**About recommendations on Facebook** (Help 1257205004624246). Content that is "associated with low-quality publishing" is not recommended:
- unoriginal content repurposed without material value;
- "long captions unrelated to the underlying content";
- coordinated comment networks.

Pages are also not recommended if they recently broke Community Standards, repeatedly shared non-recommendable content, or bought likes.

## Triage, in order (stop at the first hit)
1. **Status first.** Look at the Business Dashboard and Meta Business Suite > Monetization > Policy Issues for a limited-originality or recommendations notice. Read it word for word. This is the only direct evidence; everything below is inference.
2. **Split followers from non-followers.** If Insights shows views or reach by followers vs non-followers, compare the last 6 posts with the 6 before the drop. Non-follower share falling to about zero points to recommendation ineligibility. Everything falling evenly points to content or timing.
3. **Audit the last 30 posts against the minor-editorialization list.** Mark each post as filmed/made by us, meaningfully enhanced, or third-party with minor changes. Anything in the third group is the likely cause.
4. **Check captions.** Long generic or promotional text that doesn't describe the image or clip is a named low-quality signal.
5. **Look for duplicates.** Is the same clip on the same Page twice (delete-and-repost counts)? Is it a copy of a clip already on Facebook from someone else?
6. **Only then** look at timing and format (social-posting-times-buffer-2026-own-data-test.md).

## Fix pattern
- **Next 10 posts:** only original or meaningfully enhanced work. Reels where the narrator or presenter is on screen and adds new information work best.
- **Archive images:** use them as evidence inside our own story, not as the post.
- **Quote/photo cards:** the on-image text adds at least two new facts (e.g. date and place and what it shows), not a caption plus a border.
- **Captions:** short and about the thing shown. Put the shop link in the first comment (see facebook-page-link-limit-meta-one-link-budget.md).
- **No bulk deletion and no delete-and-repost.** Appeal only if the notice names content that is ours.
- **Re-measure the non-follower share** 14 days after the change.

## How we apply it to Cedwyn (Facebook Page "Great House Farm II", 901925066346636)
- **Risk 1: raw archive scans** (newspaper clippings, maps, NLW documents) posted with a border, logo or caption. By Meta's list this is minor editorialization.
  - Make every card a designed card whose on-image text adds at least two facts from our catalogue (record ID, date, place, what it changes).
  - EV-0291/EV-0227/EV-0035 cards (20:15Z 27 Oct) carry verbatim line + source line. Make sure future cards also carry the date and place facts on the image.
- **Risk 2: "Lost Farms" reels built from still images with a narrator who only describes them.** This is the voiceover-only exception.
  - The talking archivist/presenter on camera adding new information (the OmniHuman route in the movie work) is what Meta counts as meaningful.
  - Prefer clips from /movie/ over slideshow reels.
- **Risk 3: delete-and-repost.** e01 was reposted and e02-e04 deleted on 27 Oct. Do no more of that.
  - Cross-posting the same reel to Instagram and our own FB Page is explicitly allowed.
- **Risk 4: long promotional captions** from auto-social.
  - The proposal for social.py is to keep FB captions to what the image shows, and put the e-book line in the first comment.
  - This is not applied: tonight's push worker owns social.py.
- **Unknowns:**
  - Whether GHF II has a Page-status notice. Not checked: needs the Business Dashboard, and the connected Facebook API route for policy issues was not tested this run.
  - Whether Insights shows a follower/non-follower split for this Page. Not checked.
- No problem is raised to the project lead. If a status check needs his login, it goes to the project workspace

## Sources
- creators.facebook.com (read 27 Oct 2026)
- facebook.com (read)
- facebook.com (read)
- facebook.com (read)