# "On this day" posts generated from our own chronology (#OnThisDay / #OTD)

Date: 2026-10-31 · Harvest run · Status: how-to + PROPOSAL for Cedwyn (nothing posted)

## Why it works (evidence)
- **Sumikawa, Jatowt, Düring, JCDL 2018** (paper read in full). They collected a year of history tweets (8 Mar 2016 to 24 Feb 2017) seeded by #onthisday, #otd, #thisdayinhistory and #throwbackthursday.
  - #onthisday and #otd showed up in relatively many tweets and retweets but came from fewer accounts. They are specialists' hashtags (historians, archives) whose curated items then spread by retweet. #throwbackthursday, by contrast, is mass personal nostalgia.
  - Anniversaries work as "memory triggers", and round anniversaries amplify them: the 1916 centenary made 1916 the most-mentioned past year in the set.
  - Lesson: a small expert account posting dated, sourced items is the pattern that gets reshared.
- **Practitioner testimony** (search snippets only; the Facebook pages were behind a login wall, so not checked):
  - Arlington Historical Society posted a daily "On This Day" for several years before changing format.
  - A Preston history group member wrote 365 "On this day" posts in 2023.
  - Westbrook (Maine) Historical Society's page grew from about 1,200 to nearly 2,000 followers "in just a few months", with OTD posts in its feed. The growth isn't attributed to OTD alone.
  - The CIA's "Social Media Report: Our First 30 Days" (2014) lists an "on this day in history" Virginia Hall / D-Day post reaching nearly 98,000 users.
- **No controlled before/after test was found.** So we run our own (below).

## The rules that make it work
1. **Only exact-day records.** A month- or year-only record is never posted as "on this day". Weekly #OnThisWeek or monthly round-ups can carry those.
2. **One item, one source.**
   - Use the record's own words in quotation marks, with its catalogue ID and the institution that should hold the original.
   - Include one image (the document page or a restored photo) and one link to the evidence page or the calendar day view.
3. **Lead with the year and the human fact**, not the hashtag. Use at most 2 hashtags, #OnThisDay plus one place tag (#Llandough or #ValeOfGlamorgan). The study found #otd is a specialist tag, so the content has to carry the post.
4. **Skip dates with nothing.** Don't fill gaps with generic Welsh history; empty days are honest. The calendar's coverage view is the place to show gaps.
5. **Round anniversaries** (25/50/75/100/150 years) get a bigger post: a short carousel or a 20-40 s clip, scheduled a week ahead and shared to local-history groups only where they allow posts.
6. **Cadence:** only when a dated record exists, at most 1 a day per channel. This fits the existing auto-social rule of 4 h or more between posts per channel.

## Steps
1. Build a generator over the calendar webapp's derived events JSON. Keep exact-day rows and group them by MM-DD.
2. Output, for each of the next 30 days: date, year, catalogue ID, verbatim quote (≤200 chars), evidence URL, image candidate, and a round-anniversary flag.
3. Draft each post into the existing daily auto-social queue as content type "otd". It still goes through the same safety scan (banned words, never naming the project lead, no family holdings) and the same image-live check before anything goes out.
4. **Link** with UTM: `?utm_source=<platform>&utm_medium=social&utm_campaign=otd&utm_content=<EV-id>`, or via /r/otd-<platform>-<EV-id>.
5. **Test:** after 20 OTD posts, compare their median reach, shares and clicks against the median of the previous 20 non-OTD auto-posts on the same channel.
   - Keep OTD if it wins on shares or clicks.
   - Otherwise drop to round anniversaries only.

## How we apply it to Cedwyn (PROPOSAL)
- **Source:** the Cedwyn Calendar webapp's derived events (built from the master evidence catalogue). Every post links to the calendar's day view (which shows the gaps around it) or straight to the EV page.
  - Fit with the subscribable anniversaries feed: see subscribable-chronology-ics-feed-anniversaries.md. Same data, same yearly recurrence.
- **Example shape** (illustrative only; check the record before use):
  - "31 October 1974. Letters sent on this day were later held by the Court of Appeal (1987) to have made the occupier a licensee. Record: <EV-id> · <calendar day link>"
  - Wording must be checked against the catalogue's verbatim text and the editorial rules before it goes in the queue.
- **Channels:** Facebook (Great House Farm II) and Instagram @cedwynestate through social.py. Threads/X only if already automated.
  - Never post into communities or groups by code. Group shares are manual and only where the group allows them.
- **Editorial rules:**
  - neutral third person
  - banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken)
  - verbatim quotes with catalogue IDs
  - "our inference" labels
  - nothing about family holdings
  - Llandough Farm (KF) items excluded
  - no insignia
- **Commercial link:** the evidence page carries the /ebooks/ strip (£4.99 e-books) and the academy Grade 1 link. The post itself carries no price.
- **Cost and approval:** zero spend. Needs the root's OK to add "otd" as a content type in the auto-social run.

## Sources
- adammo12.github.io (Sumikawa et al., JCDL 2018, read in full; journal version link.springer.com page blocked)
- facebook.com (snippet; login wall)
- facebook.com (snippet; login wall)
- Westbrook Maine Historical Society Facebook post (snippet via search; URL not resolved)
- CIA "Social Media Report: Our First 30 Days", 15 Jul 2014 (snippet via search; not read)