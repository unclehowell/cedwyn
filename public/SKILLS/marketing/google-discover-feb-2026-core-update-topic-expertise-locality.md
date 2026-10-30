# Google's February 2026 Discover core update: topic-by-topic expertise, country locality, less clickbait

Written 30 Oct 2026 (skills harvest). Extends `google-discover-heritage-max-image-preview.md` (the image/robots basics); this file is only about what the first Discover-only core update changed.

## What Google said (primary, read in full)
- Google Search Central blog, 5 Feb 2026 (John Mueller): the first core update aimed only at Discover. Three goals:
  1. more locally relevant content "from websites based in their country";
  2. less sensational content and clickbait;
  3. more in-depth, original, timely content from sites with expertise in a given area.
- Expertise is judged **topic by topic**. Google's own example: a local news site with a dedicated gardening section can have gardening expertise, but a movie site with one gardening article probably does not. A narrow, deep site has "equal opportunity".
- Personalisation by followed creators and sources still applies.
- Scope: **English-language users in the US only**, "will expand it to all countries and languages in the months ahead".
- Status dashboard: began 5 Feb 2026 09:00 PT, complete 27 Feb 2026 02:00 PT, so about 22 days against the 2 weeks Google estimated.
- **As of 30 Oct 2026 no second Discover incident is on the dashboard** (incidents.json read today: after Feb, only the Mar and May core updates and the Mar/Jun/Aug/Sep spam updates). So the UK rollout has not been announced. Re-check with `tools/ranking_updates.py`.

## What the data showed (third party; US only; captured during the rollout, so directional)
NewzDash scorecard (top 1,000 domains and top 1,000 articles, US/California/New York, read):
- Country share: the US publishers' share of score-weighted visibility rose 88.86% -> 89.94%, and the international share fell 8.52% -> 7.04%. In US Discover, theguardian.com fell -11%, reuters.com -20%, independent.co.uk -57% and the-sun.com -67%.
- Local layer: California-local articles in the CA top 100 went from 10 to 16 (+60%). Priority Pixels (UK agency, read) sums it up as local publishers showing about 5x more often in their own state's feed.
- Topic mix (US): News 15.94% -> 19.16%, Sports 5.06% -> 8.52% (lifted by Super Bowl/Olympics), Arts & Entertainment 24.40% -> 17.90%.
- Concentration: more distinct topics but fewer publishers. Unique domains in the US top 1,000 articles fell 172 -> 158, and the top-10 share rose 75.31% -> 76.65%.
- Clickbait: templated curiosity-gap patterns lost ground. Yahoo went from 11 to 6 articles in the top 1,000 and from several to 0 in the top 100. Question-style titles fell 15 -> 13 (-13%). NewzDash states clickbait reduction "cannot be proven from headline markers alone".
- Not checked: nobody published lift numbers for a small specialist history site, and the Reddit write-up wasn't read (blocked list).

## How to act on it (any site)
1. **Be visibly one topic, deeply.** Cluster pages under a clear section, link them internally, and avoid one-off off-topic posts. Expertise is scored per topic, so a thin page in a new topic doesn't borrow the site's authority.
2. **Make the country signal clean.** Use a UK address/organisation in structured data, en-GB `lang`, UK spelling and UK place context. When the update goes global, a site based in the user's country is favoured in that country.
3. **Headline = what the page delivers.** No curiosity gaps ("You won't believe..."), no questions the page doesn't answer, and no image that promises more than the page has. Keep titles specific (place, date, record).
4. **Timely beats evergreen-only in Discover.** Publish dated, newsworthy items (a newly catalogued record, a release, an anniversary) on the same topic.
5. **Measure by Discover search type only**, comparing a whole week after an update ends with the week before it started (Google's core-update guidance). Low-traffic sites see nothing in Discover until they pass Google's impression threshold.

## How we apply it to Cedwyn
- **Today's status:** the UK Discover feed isn't on the new system yet. US Discover traffic to a UK site like Cedwyn is now structurally harder (Guardian -11%, Independent -57%), so **don't chase US Discover**. Build for the UK rollout instead.
- **One topic, deep:** Cedwyn's strength is a single topic: Great House Farm / Tŷ Mawr / Cydfin Farm, its records and its history. PROPOSAL for the architecture programme (Cedwyn is owned by that worker today, so these are not edits): make sure every evidence, documentary and e-book page links back to one topic hub. Keep **Llandough Farm material in Kissed Frogs only**, so the farm topic isn't diluted or conflated.
- **Locality:** PROPOSAL to add en-GB `lang` and an Organization/Place `addressCountry: GB` in JSON-LD on the hub and documentary pages. This needs a check that it names no private address, and nothing about family holdings.
- **Headlines:** door titles for the documentary, edition announcements and blog posts stay specific and dated ("1824 estate plan: parcel 19, Cydfin"), never curiosity-gap. This matches the editorial rules already in force.
- **Timeliness:** each new catalogued record or documentary door is a dated, newsworthy item on the same topic, and it feeds Discover once the UK rollout lands.
- **Images:** 30 Oct live check: `/`, `/documentary/` and `/ebooks/cedwyn/` now carry 1200 px og:image (fixed since 26 Oct). There is **still no `max-image-preview:large` robots meta, and no X-Robots-Tag header on `/`**. That is still an open PROPOSAL from the earlier Discover skill.
- **Measure:** the Monday VISIBILITY CHECK adds one line: "Discover update on dashboard? (y/n)". When a global Discover update appears, compare Discover impressions for the whole week after it ends against the week before it started (`tools/gsc_weekly.py` for weekly totals, from an archive pulled with type=discover).
- **Not for us:** news and sports gains, and personalisation by followed creators (the Search profiles follow gate is covered elsewhere: Canada/India/US only).

## Sources
- developers.google.com (Google, 5 Feb 2026, read)
- status.search.google.com (dashboard, read) and status.search.google.com (read 30 Oct 2026)
- newzdash.com (data, read)
- prioritypixels.co.uk (UK agency summary, read)
- developers.google.com (Get on Discover)