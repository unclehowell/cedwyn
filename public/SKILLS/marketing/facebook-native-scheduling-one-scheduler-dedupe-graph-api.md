# Facebook Page native scheduling: one scheduler of record, no duplicates

Added 2026-10-30 (skills harvest). Why now: the queue only posts when a run starts, so Saturday's Calan Gaeaf Facebook post (due 09:30Z) is expected to go out around 10:00Z (BIZDEV run, 30 Oct). And P-043: two copies of the same Calan Gaeaf post are already sitting in the Page's scheduled list for 31 Oct 17:00Z, and every delete attempt through the gateway has returned 502. Before this run the index had 0 hits for 'scheduled_publish_time' and 'native scheduling'.

## What Meta's own docs say (read 30 Oct 2026, Graph API v26.0)
- **Create a scheduled Page post:** POST /{page-id}/feed with `published=false` and `scheduled_publish_time` (UNIX seconds, ISO 8601, or a strtotime string). Pages API "Posts" guide: the time must be **10 minutes to 30 days** from the request; read the created post back to confirm the time when you use relative strings. The Page Feed reference gives **10 minutes to 75 days** for the same field. The docs disagree: plan for 30 days, the stricter one.
- **Videos:** POST /{page-id}/videos also takes `scheduled_publish_time`: "between 10 mins and 6 months". `unpublished_content_type` values include SCHEDULED and DRAFT.
- **See what is already queued:** GET /{page-id}/scheduled_posts (New Page Experience supported). Each post has `is_published` (false while scheduled) and `scheduled_publish_time`.
- **Edit a scheduled post:** POST /{page_post_id} accepts `message`, `scheduled_publish_time`, `is_published`, `is_hidden` and more (PagePost reference, Updating).
- **Delete:** the PagePost reference states, verbatim: "Only select developers can perform this operation using the API. You can use the Business Manager to delete posts." So an API delete failing on a scheduled post (P-043) may be Meta's own limit, not our gateway. This is our reading of the doc and has not been tested.
- **Instagram has no native schedule field.** Content Publishing guide: a media container that isn't published within **24 hours** turns EXPIRED. The limit is **100 API-published posts per rolling 24 h**, a carousel counting as one, and GET /{ig-id}/content_publishing_limit shows usage. Meta states apps that let users schedule should enforce the limit themselves. Instagram timing therefore stays with our own queue: create the container close to the slot and publish on time.

## The playbook
1. **Pick ONE scheduler of record per network.** For Facebook, prefer native scheduling: the post goes out to the minute even when no run is awake. Our queue then only *creates* the scheduled post (any time from 30 days to 10 minutes before the slot) and never publishes the same item itself.
2. **Dedupe before creating.** GET /scheduled_posts and compare against the item: normalised first 80 characters of `message`, plus the link, plus a slot within ±2 h. If it matches, skip. Write the returned post id into the queue item (`fb_scheduled_id`). An item that has an id is never scheduled or posted again.
3. **Read after write.** Re-read the post's `scheduled_publish_time` and `is_published=false`, then log both.
4. **Reschedule or fix a scheduled post by editing it, not deleting it.** Use POST /{page_post_id} with a new `scheduled_publish_time` or `message`.
5. **Last-resort duplicate fallback when DELETE is refused.** These are hypotheses to test once each, in this order, logging every result:
   - (a) POST `is_hidden=true` on the duplicate.
   - (b) Move its `scheduled_publish_time` out to about +29 days, which buys time to delete it by hand in Business Suite.
   - (c) If both fail, the owner deletes it in Meta Business Suite > Content > Scheduled.
   Never edit the copy we are keeping.
6. **Instagram:** keep our queue, but build the container less than 1 h before the slot and publish at the slot. Never leave a container waiting overnight, because it expires after 24 h. Check content_publishing_limit before each publish.
7. **Timezone:** always send UTC epoch seconds, not strtotime strings, so a BST/GMT change can't shift the slot.

## How we apply it to Cedwyn
- **P-043 (problems flywheel owns it):** two new routes to test before the Sat 31 Oct 16:45Z deadline.
  - Edit the untagged duplicate 901925066346636_122141002311239234 with `is_hidden=true`. If that is refused, move its `scheduled_publish_time` to +29 days.
  - Then re-read /scheduled_posts.
  - The doc's "select developers" line explains why every delete has failed, so further delete retries are unlikely to work.
  - This skill only records the idea and changes nothing.
- **Facebook posts in the project workspace and the bizdev queue:** schedule them natively, by the morning run or at queueing time, so 09:30Z means 09:30Z. Store `fb_scheduled_id` in the item and run the step 2 dedupe so a re-run can't double-post. Same Page: Great House Farm II (901925066346636).
- **Instagram (@cedwynestate) stays run-driven.** To land closer to the due time, the root can add a run near each due slot. A run starts late by however long it waits in the queue, so it is late by tens of minutes, not hours.
- **Cap:** the existing limit of 6 posts per network per day still applies. Meta's 100/24 h is a ceiling, not a target.
- **No change to cadence, prices or text.** Public wording rules are unchanged.

## Sources
- Meta, Pages API, Posts guide (read 30 Oct 2026): developers.facebook.com (published=false, scheduled_publish_time, 10 min to 30 days, read-after-write)
- Meta, Graph API, Page Feed reference (read): developers.facebook.com (10 min to 75 days; is_published)
- Meta, Page scheduled_posts edge (read): developers.facebook.com
- Meta, Page videos reference (read): developers.facebook.com (10 min to 6 months; SCHEDULED/DRAFT)
- Meta, PagePost reference (read): developers.facebook.com (Updating params incl. scheduled_publish_time, is_hidden; Deleting "Only select developers ... Business Manager")
- Meta, Instagram Content Publishing (read): developers.facebook.com (100 posts/24 h; containers EXPIRED after 24 h)
- Not checked: whether the gateway's FACEBOOK_* tools pass `is_hidden` or `scheduled_publish_time` on an update. Test with one call before relying on it.