# Change annotations in Search Console (and GA4): a dated log of every site change

Written 27 Oct 2026. Scope: recording site changes on the Search Console Performance chart (and GA4 if used) so a traffic rise or drop can be traced to what we did, plus a local log as the source of truth.

## What the feature is (primary sources)
- **Google Search Central blog, 17 Nov 2025** (Daniel Waisberg and Tsahi Edri, read): custom annotations on the Performance reports. Right-click the chart, choose "Add annotation", write a note of **up to 120 characters** with a date. Google's own examples: template updates or site migrations, new plugins, content refocused on a different intent, outside events like holidays. Everyone with access to the property sees the notes, so no sensitive personal information.
- **SEOTesting, Ryan Jones, updated 4 Mar 2026** (read; practitioner tool vendor): **200** annotations per GSC property. Owners and full users can add or delete; restricted users can only view. No editing (delete and re-add). Notes are **deleted after 500 days**. They show whatever filters are applied, but **not in comparison mode or the 24-hour view**. They are site-level only: there are no page- or query-level notes. GSC also adds its own system annotations for data issues.
- **GA4 annotations** (same SEOTesting page): 1,000 per property, title up to 60 characters plus description up to 150, a single date or a range, Analyst role or higher. They can also be created through the Admin API (the page's statement; we have not checked the API).
- Nobody gave a traffic number for this feature. Its value is attribution: on a site changing dozens of times a day, without dates you cannot tell which change helped.

## How to do it
1. **Keep one local log first** (CSV: date, property, note, source). GSC notes vanish after 500 days, cannot be edited and cap at 200, so the local file is the record and GSC is a view of it.
2. **Annotate only changes that can move search**: launches of new sections or feeds, redirects and migrations, sitemap or robots changes, title/meta template changes, big content additions or withdrawals, indexing requests, and outside events (press coverage, a big social post, bank holidays).
3. **Write the note so it makes sense in a year**: `<host/path>: <what changed>`, for example `cedwyn /blog/: blog live, RSS+Atom+news sitemap submitted`. Use the date the change went **live**, not the commit date, because builds lag about 30-90 minutes.
4. **One property, many hosts.** A Domain property (sc-domain:) covers every subdomain on one chart, so start each note with the host.
5. **Read it properly.** Compare the 28 days before a note with the 28 days after, using date ranges rather than comparison mode (comparison mode hides notes). Filter by page (for example `/blog/`) and check that the change shows on that page, not just site-wide. Notes appear on the clicks and impressions lines, but they are not a test: a holiday or a Google update on the same week is a confounder, so log those too.
6. **Budget the 200.** At most a few notes a week. Group a day's small fixes into one note.
7. **Never put names, emails or case details** in a note. Every user of the property sees it.

## How we apply it to Cedwyn
- Property: sc-domain:bucklerfamily.estate (connected Search Console; see search-console-branded-filter-query-groups.md). There is no API for GSC annotations, so a person (the project lead or a browser session on his login) pastes the notes. Tab keeps the log.
- Seed log written to `the project workspace` with the two changes confirmed live on 27 Oct: the blog/feeds launch, and the hive moving to /hive/ with a 301 from hive.bucklerfamily.estate. Pending changes (privacy scrub PR #24, wayback titles) are added only once each is verified live.
- `skills/tools/annotations_log.py` (stdlib, no install) checks each note: 120 characters or fewer, a valid date, no duplicates, and no personal data (name, email, phone). It also prints the paste list. Future site workers append one row per live change.
- Sunday growth report: read GSC clicks and impressions 28 days before and after each logged change for the affected path, and report only changes with a visible move, marked as association, not proof.
- GA4: only if a property is actually in use (settings not checked; see uk-analytics-statistical-exception-duaa-ga4.md). Mirror the same rows there with a title of 60 characters or fewer.

## Sources
- developers.google.com (17 Nov 2025, read)
- seotesting.com (Ryan Jones, upd 4 Mar 2026, read)
- reddit.com (200-note cap repeated; snippet only)