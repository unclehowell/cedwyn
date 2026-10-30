# Newsletter archive on our own domain (Mailchimp's hosted archive is invisible to search and AI)

Written 30 Oct 2026. Checked first: 'campaign archive' / 'newsletter archive' had no skill file (one passing mention in a harvest note). Cedwyn has /blog/ and /feed.xml, but /newsletter/ returns 404 (curl, 30 Oct).

## What the evidence states
- **Mailchimp's hosted pages block crawlers.** robots.txt on us1.campaign-archive.com and mailchi.mp (fetched 30 Oct 2026) allows only Twitterbot, facebookexternalhit and LinkedInBot. Everything else gets `User-agent: * / Disallow: /`. Googlebot, Bingbot and AI crawlers can't read any Mailchimp-hosted campaign page or archive. Mailchimp's help implies the same: "If you choose to host your own archives, search engines will index your archived campaigns." Every newsletter we send there earns zero search or AI visibility.
- **What Mailchimp gives you** (help pages, read 30 Oct):
  - The hosted archive shows the 20 most recent campaigns, not automations or Flows.
  - An embeddable archive code per campaign folder, showing 10 by default (`show=10`, editable) and updating with each send; a new campaign can take up to 48 h to appear.
  - `*|IFNOT:ARCHIVE_PAGE|* ... *|END:IF|*` hides text from the web copy, e.g. subscriber-only lines.
  - The archive bar can be turned off.
  - Send dates and subject lines in the archive can't be edited.
  - The embed is client-side script on our page, so treat its SEO value as doubtful (not checked). Static copies are what get indexed.
- **Practitioner testimony that web copies of newsletter issues bring readers from search:** Karen Cherry (PubStack Success, 14 Feb 2025, read) had 3.5K Google clicks in December and 5.5K in January (+~60%) to her free newsletter's web posts. Her pattern was long posts with subheadings that answer specific questions, plus keyword URLs and headlines. Her caveat: search "probably won't bring you new subscribers if your posts don't answer specific questions." Her "convert half into subscribers" figure is a hypothetical, not a measured rate.

## How to do it
1. **Pick the issues worth publishing.** Only issues that answer a question someone would search for (a record explained, a date, a place) go on the site. Pure announcements ("Door 4 is open") stay email-only.
2. **Publish a static page on our domain**, e.g. /newsletter/<yyyy-mm>-<slug>/:
   - a rewritten H1 (the subject line is rarely a good title)
   - the body as HTML text, not the email layout
   - internal links to the evidence pages and /ebooks/
   - a signup box at the top and bottom ("Get the next one by email")
3. **Remove email-only bits:** merge tags, "View in browser", unsubscribe footer, personal greetings and any subscriber-only lines. Never publish a subscriber's name or a reply.
4. **Avoid duplicates.** If the issue is a digest of blog posts (the Mailchimp RSS automation), don't republish it. The blog post is already the canonical page. Archive only issues with original text.
5. **Index page /newsletter/:** a list of published issues (date, title, one line), plus the signup form. Add it to the sitemap and /feed.xml where the feed is curated.
6. **Leave Mailchimp's hosted archive alone:** keep the archive bar off or on as now. It doesn't hurt search, it just doesn't help. Don't link to it from the site; link to our pages instead.
7. **Measure in Search Console:** clicks and impressions on /newsletter/ pages, and signups tagged with signup source `newsletter-archive`. Review after 90 days.

## How we apply it to Cedwyn
- PROPOSAL for the onpage flywheel or a website worker: add a /newsletter/ section to the Cedwyn build that is static, uses the dark theme and carries the signup form. Start by back-filling sent Mailchimp campaigns that have original text, read through the connected Mailchimp (read-only list of sent campaigns plus HTML) and rewritten into page form.
- Each archived issue gets an editorial pass before publishing:
  - banned public words
  - no private names
  - the project lead never named
  - nothing about family holdings or addresses
  - evidence linked as catalogued pages, no inline citations
  - internal links only, purchases via /ebooks/
- Don't commit while a cedwyn build is running. The schedule spec stays with the existing flywheels, so no new schedule is needed.
- Kill rule: if /newsletter/ pages have fewer than 50 impressions in total after 90 days in Search Console, stop back-filling and keep just the index page.

## Sources
- us1.campaign-archive.com and mailchi.mp (fetched 30 Oct 2026)
- mailchimp.com (read)
- mailchimp.com (read)
- mailchimp.com (read)
- pubstacksuccess.substack.com (read; Karen Cherry, 14 Feb 2025)