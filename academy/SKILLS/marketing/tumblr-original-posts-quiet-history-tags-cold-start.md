# Tumblr: original posts in quiet history tags (cold-start, zero budget)

Harvested 2026-10-30. Zero budget (Blaze is paid; never use it). Status for Cedwyn: PROPOSAL (a new public channel needs the owner's GO; no Tumblr login is saved, so he would make the account himself through the add-login link).

## What Tumblr itself states (help.tumblr.com "Getting More Traffic and Engagement", read 30 Oct 2026)
- Discovery happens in **For You** (algorithmic; ranks by post type original vs reblog, age, early engagement and "how many tags it has"), **Following**, and **followed tags** ("latest and best posts from tags a person follows").
- **Tags go in the tag field, not the body**; spaces allowed (#welsh history). "Only the first 30 tags on a post are indexed for tag search, and only the first 20 for in-blog search": put the most specific first.
- "**Only original posts appear in tag search results**." A reblog, even with commentary, does not.
- New blogs have **limited visibility until email is verified** and the account is used actively (following, liking, posting, customising). Check that the privacy settings do not hide the blog from logged-out visitors or exclude it from search.
- Growth is "slow and then sudden". Reblog, reply and send asks in the niche; follow generously.

## What the tags look like right now (own measurement, tumblr.com, first page, 30 Oct 2026)
| tag | newest -> oldest post on page 1 | notes on those posts |
|---|---|---|
| welsh history | 22 Oct -> 7 Sep (8 posts, ~1 a week) | 0,0,35,11,0,9,2,1 |
| penarth | 18 Oct -> 30 May (8 posts in 5 months) | 0,1,6,0,0,2,0,0 |
| llandough | newest 16 Oct **2020**, oldest 2012 (dormant) | 0-1 |
| cymru | 30 Oct -> 22 Oct | 0,16,1,9,26,4,0 |
| local history | 28 Oct -> 22 Oct | 0-4 |
| family history / genealogy | 30 Oct -> 27 Oct | 0-3 |
| history / wales / archives / cardiff | all within 1-2 days | 0-8 |
On "welsh history" Top, a 2025 post has 1,924 notes, so a well-made archival post can travel.

**Read:** the niche tags (welsh history, penarth, llandough) are so quiet that **one original post stays on page one of Latest for weeks** (welsh history) or months (penarth). Broad tags (history, wales) turn over daily. Typical notes are 0-10, so this is a slow, low-volume channel. Its value is that it costs nothing and puts our archive images in front of tag followers who reblog old photographs and maps. No primary case study with traffic numbers for a small heritage blog was found. Treat the size as unknown until our own /r/tumblr count states otherwise. Whether Tumblr link clicks pass a referrer, and the rel attributes on its outbound links, were **not checked**.

## How to do it
1. One blog, named for the place/project (not a person). Verify the email, fill in the description, set an avatar from our own archive image, check visibility settings.
2. **Week 1, before any linking:** follow ~30 blogs that post in #welsh history, #cymru and #local history. Like and reblog their archive posts **with useful added context**. Answer an ask or two. (Tumblr's own anti-spam ramp.)
3. **Original posts only**, 3-4 a week: one archival image (map, photo, document detail) + 2-4 lines of plain dated description + the record's reference + one link to the matching cedwyn evidence page via a /r/tumblr redirect. Tags in order: specific -> broad, about 8-12. For example: `tŷ mawr`, `great house farm`, `llandough`, `penarth`, `vale of glamorgan`, `welsh history`, `cymru`, `local history`, `old maps`, `archives`, `history`.
4. For a photo carousel, add alt text (Tumblr image descriptions are a community norm and help reblogs).
5. Reply to every reblog-with-comment. Reblog relevant posts from others between your own.
6. Never paste the same caption across platforms verbatim; Tumblr rewards posts that read native.

## Gate and stop rule
- Prerequisites: the owner's GO for a new channel, and a /r/tumblr redirect on cedwyn for counting clicks.
- Run 8 weeks / ~25 original posts. **Stop** if total notes < 50 AND /r/tumblr clicks < 10. **Keep** if any post passes 100 notes or clicks reach 25 or more.
- No Blaze, no DMs to strangers, no asks sent purely to promote.

## How we apply it to Cedwyn
- Content source: the evidence catalogue's public, already-published images (1824 map detail, period photographs, dated documents already on the site), one record per post, neutral third person.
- The dormant #llandough tag (last post 2020) means our posts would **be** the tag. That is the strongest local angle, but it is tiny.
- AI-generated images or clips need the AI-disclosure line per ai-digital-twin-intro-disclosure skill; prefer real archive scans here.
- Could reuse the social queue's image + caption with a Tumblr-specific rewrite; posting stays with the social queue's checks once approved.

## Sources
- help.tumblr.com (read 30 Oct 2026)
- help.tumblr.com (Communities: own handle, guidelines, tags; snippet only)
- Own measurement: tumblr.com and the same for penarth, llandough, cymru, local history, family history, genealogy, history, wales, archives, cardiff (30 Oct 2026, first page parsed for noteCount and timestamps)


## Addendum 2026-10-30 ~17:00Z: outbound link check (own measurement)
- I fetched a public post page (www.tumblr.com, HTTP 200, logged out). Links in the post body are server-rendered as **direct `<a href>` to the target, with `rel="noopener"` only**. There's no `nofollow`, no `ugc` and no t.umblr.com wrapper on that page (0 occurrences of t.umblr.com). There's also no referrer meta tag and no Referrer-Policy header, so browsers send their default (strict-origin-when-cross-origin), and our analytics should show **www.tumblr.com** as the referrer.
- The blog subdomain view (leominster1941.tumblr.com) returned 403 to our box.
- Not checked: whether the logged-in dashboard or apps still wrap links in t.umblr.com redirects (they did in 2015 link posts) or strip the referrer. **Still use a counted /r/tumblr link** (tools/r_links.py), so clicks are counted whatever the referrer shows.
- **SEO note:** a followed link from a post with almost no views has negligible ranking value. Treat it as a discovery route only, not a backlink plan.