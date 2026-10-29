# Self-hosted interactive timeline (TimelineJS3) as a linkable, embeddable asset

Harvested 2026-10-29 19:45Z (skills harvest). Topic: SEO / link earning / content format.

## What the evidence states
- **TimelineJS is free and open source** (Northwestern Knight Lab, MPL-2.0; npm `@knight-lab/timelinejs` 3.9.13, 8.2 MB unpacked, read 29 Oct 2026). Feed it a Google Sheet *or* JSON. Newsrooms built their chronologies on it (Knight Lab's own example list includes "Mandela: A Life of Purpose" and "Chronology of the French Presidential Race").
- **Knight Lab's own craft advice** (timeline.knightlab.com, read): keep it **under 20 slides**. Pick a story with a strong chronological line, not one that jumps about. Write each event as part of one narrative, including the build-up events as well as the big ones.
- **Spreadsheet rules** (docs/using-spreadsheets, read): the year is required. Add end dates to get spans ("eras"). Use `display_date` when the exact date is unknown, so the slide still sorts. Use `group` to put rows into bands (e.g. Records / Archaeology). Never rename the header row.
- **Interactives earn links. These are agency figures, not checked independently** (Fractl, frac.tl/interactive-tools-link-building, read 29 Oct):
  - Fractl's Flourish map of Christmas lights earned **25 backlinks from 25 domains**, through regional local news and radio pick-up.
  - ADT's interactive crime map gets **~26,000 organic visits a month** and has **6,000+ backlinks from 560+ domains**, still growing years after launch.
  - The pattern: the local angle, plus easy embedding, is what gets the links.

## How to do it (30-60 min)
1. **Pick the short story.** Use 12-20 events max, from material already published, and give every event a catalogue ID or source line. Don't put the whole master chronology in.
2. **Write the CSV** with these columns: `year,month,day,end_year,display_date,headline,text,media_url,media_credit,group`.
   - Headlines: 3-6 words.
   - Text: 1-3 sentences, ending with the source line.
   - Media: same-site images only.
3. **Build it:** `python3 the project workspace events.csv OUTDIR --title "..." [--lang en-gb|es]`.
   - It writes `index.html`, `timeline.json` and a local `tl/` copy of the library: no CDN, no Google Sheet, no outbound requests.
   - It **fails** on Cedwyn's banned public words and on any non-Cedwyn host. It warns above 20 slides.
4. **Check it at 390 px** in a headless browser (tested 29 Oct: renders title slide, group bands and axis). The `noscript` line points readers to the JSON text version.
   - Gotcha (found in the test): `script_path` must be an absolute URL. The tool builds it with `new URL('tl/js/', location.href)`. A relative path throws "Invalid base URL" and the timeline stays on "Loading".
5. **Make it embeddable.** Publish under its own path. Under the timeline, offer a copy-paste `<iframe>` snippet ("Use this timeline on your site or in a class"), credited with a link back. That snippet is the link-earning mechanism.
6. **Tell the people it serves.** Local-history societies, schools and heritage groups get a short "free to embed" note, drafted as a **HubSpot draft only and sent on the project lead's GO**. Track it with a UTM-free ref param, e.g. `?ref=embed`.
7. **Measure.** Count referring domains (Search Console Links report) and `?ref=embed` visits per month. Kill it or rework the story if there are 0 embeds after 90 days.

## Limits and gotchas
- There is **no Welsh locale** in the 3.9.13 package (en, en-gb, es and others, but no cy). For a Welsh version, pass the UI strings in English and the content in Welsh, or add a `cy.json` locale. Test it first.
- Slide text is rendered by JavaScript. Keep the canonical text on the existing static page (/research/timeline/) for search and AI crawlers. The interactive is a companion to that page, not a replacement.
- Media from YouTube, Flickr and similar sites pulls third-party requests. Cedwyn's no-outbound-links rule means same-site media only.

## How we apply it to Cedwyn
- Cedwyn already has a long, text-only **Master Timeline** at /research/timeline/ (checked 29 Oct, 207 KB HTML, no TimelineJS). Build a **20-slide "Tŷ Mawr in 20 moments"** companion. Use only published, sourced events and the site's existing wording rules: "former manorial house"; Bute/Mountjoy as lord of the manor only; no accusations; nothing about family holdings.
- Use two groups, *Records* and *Archaeology*; the Llandough Roman villa (1977-79) gives an era span. End on a soft path to /ebooks/ ("the full story in the e-books"). The final slide sends readers through internal links only.
- **Proposal, not live work:** it adds a new public page, so it goes in `the project workspace` for the site/onpage worker. The build tool and library are ready on the box.
- Outreach to societies or schools to embed it is press-like, so it waits on the project lead's GO and goes out as HubSpot drafts only.

## Sources
- timeline.knightlab.com (tips: under 20 slides, narrative)
- timeline.knightlab.com (columns, display_date, eras, groups)
- timeline.knightlab.com (CSS overrides, groups)
- github.com and npm `@knight-lab/timelinejs` 3.9.13 (MPL-2.0, 8.2 MB)
- frac.tl (Flourish map 25 links/25 domains; ADT map 6,000+ links/560+ domains; agency's own figures)
- cedwyn.bucklerfamily.estate (current text timeline, read 29 Oct)