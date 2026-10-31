# Instagram Map: location-tagged posts as a local discovery surface (API location_id)

Harvested 30 Oct 2026. New angle: 'instagram map' had 0 hits in INDEX.md. Location tags were mentioned in passing in instagram-api-publishing-cadence-new-account.md and instagram-search-seo-google-indexing.md. This file adds the Map surface, the carousel limit, and the exact API failure mode.

## What changed (primary sources, read 30 Oct 2026)
- **Meta Newsroom, 6 Aug 2025** ("New Instagram Features to Help You Connect", read): Instagram Map launched. It does two things: (1) opt-in sharing of your last active location with friends you choose; (2) "open the map to see content your friends and favorite creators are posting from interesting or fun locations".
- **Meta Newsroom, 6 Oct 2025** (India rollout, read): "when you add a location tag to a story, reel, or post, it will populate on the Map". Instagram now shows a preview of how the post will look on the Map. Profile photos were removed from tagged content on the Map so a tag isn't mistaken for someone's live location.
- **UK:** Instagram's own post of 5 Oct 2025, "Instagram Maps has landed in the UK ... explore content from friends and creators who've tagged theirs" (search snippet of instagram.com; the post itself was not opened).
- **Help Center 717817284984139** (title read in search): tapping a location tag opens other posts taken at the same place, so a place page is a second, older discovery surface.
- **Graph API, IG User Media reference v26.0** (read):
  - `location_id` = "The ID of a Page associated with a location". It is accepted on image, reel and CAROUSEL containers.
  - It is **not supported on images or videos inside carousels**. Put it on the carousel container only.
  - Find the id with the Pages Search API and check that the Page has location data. A Page without location data fails with `INSTAGRAM_PLATFORM_API__INVALID_LOCATION_ID`.
  - Stories published through the API cannot carry location stickers (see the existing publishing-cadence skill).

## Evidence on whether it lifts reach (be honest)
- **The "79% more engagement" figure** is repeated by Hibu (25 Jul 2025, read) and others. It traces to an old Simply Measured study (around 2014) and has **not been checked** against 2026 data. Treat it as folklore, not a forecast.
- **Practitioner testimony:** a r/InstagramMarketing thread titled "Location tags doubled my reach for a local business" (title only; Reddit blocked the fetch). This is one anecdote, not checked.
- **Metricool 2026 study** (16 Jun 2026, 24.3M posts, read): posts with at least one hashtag got 31.7% fewer views than the platform average. Its advice is natural-language captions plus specific local signals, so the location tag is the cheap specificity signal that remains. Metricool doesn't report a location-tag number.
- **Mechanism (our inference):** a tag places the post on the Map for people browsing that area, and on the place page. A heritage post about Llandough can be found by people looking at Llandough, Penarth or Cardiff on the Map, whether or not they follow us.

## How to do it
1. **Build a small table of place ids**: `the project workspace`, with a name, Page id, the date it was verified, and the level (village / town / landmark / archive). Find ids through Pages Search with the connected Facebook account, read-only. Keep only Pages whose `location` field has coordinates.
2. **Tag public places only**: the village or parish (Llandough), the town (Penarth), Cardiff, and public institutions shown in the post (Glamorgan Archives, St Dochdwy's Church if it's in the image). Never tag a private house, a farm address, or a living person's home.
3. **Put one tag on each post or reel.** On a carousel, put the tag on the parent container only; tagging the children errors.
4. **Patagonia posts**: tag Trelew / Gaiman / Puerto Madryn, which puts them on the Map for Spanish-speaking audiences there. Keep Wales and Patagonia posts separate, as the publishing skill already advises.
5. **Before publishing, dry-run**: create the container and check for the error code above. If it fails, publish without a location rather than retrying blindly. Record the bad id.
6. **Measure**: Insights > Reach > "From non-followers" for tagged vs untagged posts over 4 weeks, at least 8 posts each. Use the same format each time (reel vs reel). Under 8 per arm the result is a direction only. Log it in the project workspace with a `loc` column.

## How we apply it to Cedwyn
- **Owned channel, no GO needed:** the next auto-social or quote-pack run adds `location_id` to @cedwynestate image, reel and carousel containers in `ig_post.py`/`social.py`, carousel parent only. `ig_post.py` has no `location_id` today (grep 30 Oct 2026, 0 hits), so this is a small code change plus the verified id table.
- **Start with 3 ids**: Llandough (Vale of Glamorgan), Penarth, Cardiff. Add Glamorgan Archives when a post shows an archive document.
- **Editorial rules hold:** tagging Great House Farm itself would read as an address and a family holding, so don't. Use the village level or above. Captions keep the neutral wording; the tag adds a place, not a claim.
- **Success test:** non-follower reach share on tagged posts vs the last 8 untagged posts. Report it in the Sunday growth notes. No promise of uplift.

## Sources
- about.fb.com (read)
- about.fb.com (read)
- instagram.com (snippet: UK launch, 5 Oct 2025)
- developers.facebook.com (read; location_id, carousel limit, error code)
- help.instagram.com (title/snippet)
- metricool.com (read)
- hibu.com (read; 79% claim, source old, not checked)