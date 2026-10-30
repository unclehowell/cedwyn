# Homepage-to-shop click-through: label, place and measure the one shop link

Harvested 2026-10-30 04:13Z for Cedwyn. Topic: getting more of the homepage's visitors to tap through to /ebooks/. Before this run the index had nothing on "banner blindness", "information scent" or homepage click-through.

## What the evidence states
- **Banner blindness is learned, and it is about position and look, not just ads.** NN/g eyetracking (Pernice, 22 Apr 2018, 26 participants per task, read) found people skip anything that has an ad's placement (the top strip or the right rail), an ad's look (animation, a coloured box against white, fancy formatting, text inside an image), or that sits next to ads or promotions. Real content styled like a promo gets skipped too. NN/g's fix is to make important links look like the site's own content and navigation, not like a banner.
- **Information scent decides the click.** NN/g's information-scent article (read) states people click when the link label, the words around it and its context predict that the page answers their need. Vague labels ("Explore", "Discover") and clever names carry little scent. Labels that say what is on the other side carry the most.
- **Product finding is where most sites fail.** Baymard's 2026 benchmark (article updated 13 Oct 2026, read): 61% of desktop and 65% of mobile sites score "mediocre" to "poor" on homepage and category navigation, from 17,000+ scored elements across 180+ sites. 22% of mobile sites don't make product categories the first level of the main navigation. Baymard test participants complained when there was no plain "products" entry, only "New Arrivals" and "Collections".
- **Numbers to treat with care:** vendor A/B blogs (Wingify/VWO, for example "removing navigation +100% signups, Yuppiechef") report single tests with no sample sizes. Use them for ideas, not as forecasts.

## The playbook (smallest changes first)
1. **One shop link, in the content's own style.** A full-width text button that looks like the site's navigation (same font, same border) beats a coloured strip at the very top. The top strip is the exact spot NN/g found people skip. Never animate it.
2. **A label with scent:** say what they get and what it costs, for example "E-books: the farm's records, from £4.99" or "Read the e-books". Avoid house names ("The E-book Shelf") as the only label.
3. **Repeat it where attention already is:** after the first section a reader actually reads (under the hero text), and at the foot of the page. One link, three positions, the same words.
4. **Don't let promos poison it.** Keep the shop link away from any closable banner, the graph promo strip or other cross-sell boxes. NN/g found items next to promotions get ignored along with them.
5. **Mobile first:** at 390 px the link must sit in the first screen without scrolling, and the hamburger menu's first item should be the shop, not item 9.
6. **Measure it as a ratio, not a feeling.** Click-through = shop visits arriving from the homepage ÷ homepage visits.

## Measuring at Cedwyn's traffic
- Live 30 Oct 04:12Z (cache-busted fetch): the homepage has 103 links. Link 0 is now `/ebooks/?utm_source=home&utm_medium=button&utm_campaign=sf27`, labelled "E-books · first editions free →". The other shop links are /wales/ebooks/ "The E-book Shelf" (link 36), /wales/shop/ (41), /argentina/ebooks/ (84) and /argentina/shop/ (89).
- The page carries no GA, Plausible, Clarity or Cloudflare beacon tag. So the internal UTM breaks nothing today. If GA4 is ever added, internal UTMs overwrite the visitor's original source (Google's URL-builder help states UTMs are for campaign links). Switch to `?from=home-top` then.
- **Baseline:** about 240 homepage visits and 18 shop visits a day, so at most about 7.5% if every shop visit came from the homepage. To see a move from 7.5% to 10% with the usual 95% confidence and 80% power you need about 2,000 homepage visits per period, roughly 8–9 days each at 240 a day. So compare 9 days before with 9 days after, and change nothing else on the homepage in that window.
- **Source:** cf_traffic.py (Cloudflare HTML 200, non-US proxy). Count `/ebooks/` requests whose query has `utm_source=home`, if the Cloudflare dataset exposes the query string (not checked). If it doesn't, give each position its own path parameter and count by path.

## How we apply it to Cedwyn
- The SALES FIX run just moved the e-books button to the top of the homepage (the project lead was told 04:10Z). Keep it, but **check that it doesn't look like a banner**: no coloured strip, no animation, not glued to the closable graph-promo banner that a worker is rebuilding. Hand that point to that worker and the sales-fix lineage. Don't edit their files from a harvest run.
- **Label test, one change per 9-day period:**
  - (A) the current "E-books · first editions free →";
  - (B) "Read the farm's records as e-books · first edition free".
  - Keep "free" only while first editions really are free (check /ebooks/ before each change).
- Add the same link under the first section people read and at the page foot, each with its own `from=` value, so we learn which position earns the clicks.
- The /wales/ and /argentina/ shelves: rename the visible label to include "E-books" first (for example "E-books: the shelf") so the scent survives on mobile.
- Success = homepage→shop ratio from ~13:1 toward 8:1 within two periods. Log the ratio in the project workspace for the Sunday report.
- Proposal only for design and text changes. Public text never names the project lead; banned words apply.

## Sources
- nngroup.com (read)
- nngroup.com (read)
- baymard.com (read)
- support.google.com (read, URL builder / UTM)
- wingify.com (snippet only, vendor claim, not relied on)