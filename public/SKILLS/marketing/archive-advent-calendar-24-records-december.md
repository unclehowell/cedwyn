# A December archive "advent calendar": 24 daily record reveals, content only, no discount doors

Harvested 2026-10-28's skills harvest. The index had nothing on this before ("advent": 1 unrelated hit, in the Visit Wales accreditation file).

## What the sources show
- **Archives already do this every year.**
  - Essex Record Office ran its "first ever online audio advent calendar" in Dec 2017: one recording a day from its Sound and Video Archive, with a "subscribe to receive daily notifications as we publish each new day's recording" link (blog, read).
  - The author's framing: it shows "the tremendous variety in the Archive" and "the gaps that are still evident". They used the series to invite people to contribute records.
  - Others in the snippets: Lancashire Archives ("Advent Calendar Day 19 (Record Offices and Archives)"), Leeds Libraries' "Heritage Advent Calendar" blog category, the Newberry Library ("now in its fifth year"), and UCL Open Access ("third year in a row… sharing a link each day on our Bluesky account").
  - That several institutions repeat it year after year (5th year, 3rd year) is the only success signal. **None published engagement numbers** that I could read.
- **Brand benchmark (not heritage; only a direction):** Cadbury's AR advent calendar reports 200,000 interactions, a 35.2% interaction rate, and **43% of customers engaging on multiple days** (Blippar's own case study, snippet only; vendor claim). The point is habit: a daily door brings people back.
- **Holiday email data:** Yes Lifecycle Marketing / Data Axle (read; 2018 study of ~8 bn emails sent in Q4 2017; US):
  - Holiday-themed emails had 16.8% lower opens but often converted better than ordinary emails.
  - "Christmas emails without an offer in the subject line generated a 15.5 percent open rate, the highest of all Christmas campaigns."
  - Read this as: a Christmas email with no offer can still be opened. It is old and US data.
- **Legal guard:** the UK DMCC Act bans false limited-time offers (see uk-dmcc-act-urgency-reviews-price-copy.md). Daily "door = discount" mechanics also break our price rules (prices as listed; no "was" or saving assertions). So **the doors hold content, never deals**.

## How to do it
1. **Pick 24 real items up front** (one per day, 1–24 Dec). Each needs a catalogue ID or a source line. Mix: maps, a drawing, a photo, a letter extract, a newspaper line, a "missing record" page. If an item can't be sourced, drop it; don't pad.
2. **One home page**, e.g. /calendar/2026/ or a section on an existing page: a 24-door grid. Unopened days are greyed out, opened days link to the evidence page. Build it as a static page with dates in the HTML (no JS needed): each door unlocks by a scheduled build or a scheduled commit.
3. **One post per day**, same time each day (e.g. 08:00), and the same format: "Day N/24" + image + 2 lines + source. Social only links internally. Day 1 announces the series. Days 6, 12 and 18 say "catch up: all opened doors" with a link to the grid.
4. **Email is weekly, not daily:** a Sunday roundup of the week's doors (4 emails: 6, 13, 20 Dec, plus a Christmas Eve "all 24" email). No offer in the subject line, per the Yes Lifecycle finding. The free v0.0.1 e-book can sit in the footer as a normal standing link, not as a "door prize".
5. **Ride the existing hashtags only if they fit:** #ExploreYourArchive on 10 Dec (see heritage-anniversary-hashtag-calendar.md).
6. **Ask once:** like Essex, end on Day 24 with an invitation: "Do you hold a photo or letter about the farm? Tell us." That collects research leads and replies.
7. **Measure:** visits to the grid per day (Cloudflare), repeat-visitor share across days (aim: 30% or more return on 3+ days, based on Cadbury's 43%), signups tagged `advent2026`, replies with leads. **Kill rule:** under 10 grid visits a day by 8 Dec means drop to every second day and stop the email roundups.

## How we apply it to Cedwyn (proposal, zero spend)
- **What:** "24 Records of Tŷ Mawr / 24 Cofnod", 1–24 Dec 2026, bilingual titles cy/en. Content comes from the evidence catalogue, 1000 Cuts and the e-books, the same sources as the quote-pack run. Each door links to its catalogue page.
- **Who prepares it:** a BIZDEV or quote-pack worker picks the 24 items and writes the copy by **20 Nov**. The images reuse existing assets (render budget $0). The editorial check runs the banned-words and never-name-the project lead scanner, with no insignia.
- **Where:** the daily auto-social (schedule 02234a03) carries Day N, so there is one item per channel per day and the 4-hour gap rule is kept. The grid page is a new page only, because existing Cedwyn pages are under the repair freeze: commit to a section branch or leave a patch in the project workspace per SCOPE.md.
- **Mailchimp:** 4 roundup emails to the existing list. Allowed under the sales-fix rules (campaigns to the existing list); no discounts.
- **Clashes to avoid:** Small Business Saturday (5 Dec; see small-business-saturday file) and Black Friday stance (27 Nov). The calendar starts 1 Dec and carries no shop CTA on those days beyond the standing footer.
- **the project lead GO?** Not needed for posts on existing channels within current rules. A new public page section follows the normal repair-freeze path.
- **utm:** utm_campaign=advent2026, utm_content=dayNN.

## Sources
- essexrecordofficeblog.co.uk (read; Essex Record Office audio advent calendar, Dec 2017)
- facebook.com (snippet)
- secretlibraryleeds.net (snippet; "Heritage Advent Calendar" category)
- bsky.app (snippet; Newberry, 5th year)
- blogs.ucl.ac.uk (snippet; timed out on fetch)
- blippar.com (snippet; vendor case study)
- data-axle.com (read)