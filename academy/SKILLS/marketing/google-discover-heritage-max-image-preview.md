# Google Discover for a heritage history site (zero spend)
Harvested 26 Oct 2026 (skills harvest). Discover is Google's personalised feed on Android/iOS Google app and Chrome's new-tab page. It sends traffic to pages nobody searched for, which suits story-led history.

## What the primary sources establish
- Eligibility: any indexed page that meets Discover's content policies can appear. No special tag or structured data is required, and eligibility is no guarantee (Google Search Central, "Get on Discover").
- Images drive clicks. Google recommends large images that are at least 1200 px wide, more than 300,000 pixels in total, 16:9, enabled by the robots meta setting `max-image-preview:large` (or AMP). Pick the thumbnail with `og:image` or schema.org image; avoid generic images such as a logo.
- Measured lift from that one tag (Google's own published case studies, reported by Search Engine Journal, 12 Aug 2021): a food blog raised Discover CTR by 79%; a Brazilian magazine raised CTR 30% and clicks 333% over six months.
- Practitioner note (clickrank.ai, 2026): a client's CMS was silently stripping the `max-image-preview:large` tag; Discover traffic returned once it was restored. Lesson: check the tag on the live HTML, not the template.
- Titles: Google asks for titles that capture the essence of the content and warns against clickbait, sensationalism and withholding key information in the preview. Discover manual actions exist for policy breaches (shown in Search Console under Security & Manual Actions).
- Older content can appear when it is helpful and relevant to a person's interests, so evergreen history pages qualify; topical hooks (anniversaries, Calan Gaeaf, On This Day) help.
- Measurement: Search Console > Performance > Discover appears only once a site passes a minimum impression threshold; it covers 16 months and includes Chrome traffic.

## How to do it (30 minutes of markup, then habit)
1. Add to every story/article page head: `<meta name="robots" content="max-image-preview:large">` (keep any existing directives in the same tag). Verify with `curl -s URL | grep max-image-preview` after deploy.
2. Give each story page its own `og:image` at 1200x675 (16:9) or larger, showing the subject (the house, a map extract, a newspaper headline crop), never the site logo or a portrait book cover. Keep the key detail centred so Google's crop keeps it.
3. Mirror the same image in JSON-LD (`Article.image` with an array: 16:9, 4:3, 1:1 crops if available).
4. Headline = the real point of the story, specific and dated ("Tŷ Mawr, 6 December 1988: the morning the listed farmhouse came down"), no teaser that hides the subject.
5. Publish on a rhythm tied to dates people care about; refresh an evergreen page with a genuine new source rather than re-dating it.
6. Each week, read the Discover report (once it appears) and the Search report side by side: Discover spikes are short (1-3 days); note which image/headline pairs earned them.

## How we apply it to Cedwyn
- Checked live today (13:55 GMT): `/ebooks/` and the home page carry no robots meta at all, so `max-image-preview:large` is absent site-wide; the `/ebooks/` `og:image` is a book cover at 480x678 px, well under the 1200 px minimum and portrait, not 16:9.
- Patch for the onpage/committer queue (do not commit from this run): add the robots meta in the shared head template for all 36 themes; generate a 1200x675 share image per story page (the existing headline-first headlines make good overlay text); keep covers for the shop grid only.
- Headline examples that follow the rules: "1667: the year the Williams family acquired Tŷ Mawr" (cited to the 1974 newspaper reports, Mary Williams' statement, and ITV News 1988); "1824: the David Stewart survey, the first record mention of Tŷ Mawr found". No Bute-held dates presented as Tŷ Mawr records, no hedges, none of the banned public words.
- Every Discover-bound page carries the e-book strip so the visit can turn into a sale or signup.
- Track: Search Console Discover report (connected) in the Sunday growth report once impressions pass the threshold.

## Sources
- developers.google.com (read 26 Oct 2026)
- searchenginejournal.com (Google case studies, 2021)
- clickrank.ai (practitioner anecdote, snippet only; page not read)