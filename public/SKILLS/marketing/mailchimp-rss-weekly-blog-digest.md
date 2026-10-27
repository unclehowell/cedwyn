# Weekly blog digest by email: a Mailchimp RSS automation fed by /blog/rss.xml

Checked 27 Oct 2026. Email + content. Owner: whoever runs Mailchimp (growth/funnel workers).

## Facts (sources read)
- **Mailchimp help, "Share Your Blog Posts with Mailchimp"** (read 27 Oct 2026):
  - Automations > Flow templates > Nurture leads > **Share blog updates via RSS**. Choose a feed URL, a schedule (**daily, weekly or monthly**) and a send time.
  - It **sends at most once per day**. Posts must be published **at least 3 hours before** the send time.
  - It **sends nothing if there is no new post**. The first send includes the last 24 h (daily), 7 days (weekly) or 30 days (monthly). After that, each send includes everything since the last one.
  - Content comes from RSS merge tags (`*|RSSITEMS:|*`, `*|RSSITEM:TITLE|*`, `*|RSSITEM:URL|*`, `*|RSSITEM:IMAGE|*`, `*|RSSITEM:CONTENT|*`). If the tags are missing, the email goes out empty. To change formatting, change the feed, not the email builder. `*|RSSITEM:TITLE|*` works in the subject line, but test it first.
  - Each send gets its own report under Analytics > Reports.
- Plan availability: one Reddit tester (r/rss, 2026, snippet) states RSS is on all plans. Our own Mailchimp free-plan skill states flows aren't on Free. **Not checked for this account.** Read it in the Automations screen before relying on it.
- **MailerLite e-commerce email stats (read):** across their customers' campaign types, **RSS-to-email had the highest engagement: 47.86% opens and 6.53% clicks**, against 40.83% / 5.28% for regular campaigns. Their case study: KC Tool's daily "Tool of the Day" RSS emails "regularly sell out" (testimony, no numbers). Caveats:
  - Opens are inflated by Apple Mail privacy since 2021. Judge on clicks.
  - People on an RSS list chose that stream, so they're a self-selected, keener group.

## How to run it well
1. **Weekly, not daily**, unless readers ask for daily. A daily blog plus a daily email means an email every day. Pick one fixed slot, e.g. **Sunday 09:00 Europe/London**. Mailchimp skips a week with no posts.
2. **Its own stream:** use a tag or group such as "Blog digest", ticked at signup or offered in the welcome email. Don't put every subscriber on it by default. Separate streams keep unsubscribes and complaints apart (Gmail's per-sender unsubscribe list).
3. **Template:** a short intro line that works as Gmail's AI summary, then for each item the title (linked), one sentence, and an image only if it isn't the generic site image. Add one fixed footer block: "E-books from the records" -> /ebooks/ with a UTM link. Subject: `This week at Cedwyn: *|RSSITEM:TITLE|*` (after a test send).
4. **UTM:** Mailchimp's own Google Analytics tracking box, or `?utm_source=mailchimp&utm_medium=email&utm_campaign=blog-digest` built into the feed's item links.
5. **Feed hygiene:** a real excerpt in `<description>`, a distinct image per item, absolute URLs, and no private or draft items. The feed must never carry anything the editorial rules ban, because Mailchimp sends it unseen.
6. **Measure per send:** unique clicks, clicks to /ebooks/, unique unsubscribes. If unsubscribes run higher than clicks for 3 sends in a row, go to monthly.

## How we apply it to Cedwyn
- Feed checked live 27 Oct 2026 05:00Z: `cedwyn.bucklerfamily.estate returns 200, RSS 2.0 with `content:encoded` and `media:content`, and has 10 items. Atom (`/blog/atom.xml`) and JSON Feed also return 200. **Use /blog/rss.xml for Mailchimp** (RSS 2.0, image tags present).
  - Gaps: several items use the generic `/maps/img/og.jpg` as their image, and "Cedwyn Film" has a 45-character description. Suppress the generic image in the template, or fix it in the blog worker (PROPOSED to the blog/feeds owner).
- The list has about 1 subscriber now (sales-fix run 14). The point is a **set-and-forget habit**: every new subscriber starts getting the week's posts plus the /ebooks/ footer with no work from us. The email-ingest/blog workers already publish daily.
- **PROPOSED, not done:** create the RSS automation in Mailchimp as a *draft*, weekly on Sundays at 09:00, audience = tag "Blog digest", footer = /ebooks/ UTM link. It needs one test send to an internal address before Start. **Starting it is an outward, recurring send to subscribers, so it waits for the project lead's GO.** The existing allowance covers one-off campaigns to the existing list, not a new recurring stream.
- Editorial rules apply to the template text. The weekly growth report adds a row: digest sends, unique clicks, /ebooks/ clicks, unsubscribes.

## Sources
- mailchimp.com (Mailchimp help, read 27 Oct 2026)
- mailerlite.com (MailerLite, read)
- reddit.com (snippet only, not checked)
- related skills: mailchimp-free-plan-2026-limits-gates.md, gmail-manage-subscriptions-gemini-summaries-metrics.md, feeds-json-feed-images-conditional-get.md