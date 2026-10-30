# "Embed this graph": embeddable charts with attribution, without link-scheme risk

Harvested 2026-10-30 (skills harvest run). Topic check: "embed code" 0, "datawrapper" 0, "attribution link" 0 in INDEX.md. data-led-digital-pr-heritage-dataset-pitch.md covers pitching a dataset; this skill covers making each chart easy and safe for others to reuse.

## Evidence (primary and practitioner)
- **Google's link spam policy (read 2026-10-30)** lists among link schemes: "Keyword-rich, hidden, or low-quality links embedded in widgets that are distributed across various sites", and "Widely distributed links in the footers or templates of various sites".
- Matt Cutts, then Google's head of web spam (video, Aug 2013, reported by Search Engine Roundtable, read): "I would recommend putting a nofollow, especially on widgets", and the same for infographics. So an embed's credit link should carry `rel="nofollow"`, or at least be a plain brand/title link with no keyword stuffing. **An embed is for reach and citation, not link equity.**
- **Our World in Data (FAQ + 9 Jul 2025 post, read):** every chart has PNG, SVG and live embed options, and since July 2025 an *archived* embed that never changes. Reuse rule: CC BY, "cite the page that it's found on or that is linked to at the bottom of the chart". The credit line inside the chart *is* the attribution path. OWID reports about 14,000 interactive charts (About page snippet).
- **Datawrapper Academy (read):** three embed options. "Embed with script" (responsive, Web Components) is recommended; "responsive iframe" is for systems that block scripts; plain iframe is the last resort. Many iframes on one page slow it down. Datawrapper offers no per-chart view counts in its interface, which is a reason to self-host and count embeds ourselves.
- **What data-led PR yields (Digital Third Coast, 2025 report, read):** 67 campaigns earned 1,505 placements (1,386 earned links), an average of **23 placements per campaign**, average DA 56. That is an agency running many campaigns; a single small heritage site should expect far less. Use it as the ceiling, not the plan.

## How-to
1. Each chart gets a **stable URL** (`/graphs/<section>/`) that renders the chart alone, readable at 390 px, with the title, a one-line "what this shows", the data date, and a footer credit line: "Source: Cedwyn evidence catalogue · cedwyn.bucklerfamily.estate/<page>".
2. Below every chart, add a small **Share / Embed** row:
   - **PNG** download (1200×675) with the credit line burned into the image, so screenshots carry attribution too (the OWID pattern).
   - **Embed code:** a responsive iframe of the stable chart URL with `loading="lazy"`, a `title` attribute and a fixed aspect ratio, plus one plain credit link underneath:
     `<iframe src="cedwyn.bucklerfamily.estate title="Llandough farm records by date" loading="lazy" style="width:100%;aspect-ratio:16/10;border:0"></iframe>`
     `<p><a href="cedwyn.bucklerfamily.estate rel="nofollow">Cedwyn: records by date</a></p>`
     The anchor is the title, never keywords, and carries nofollow per Google's widget guidance.
   - **"Cite this":** a one-line citation with the access date.
3. **Live vs frozen:** offer a frozen version (`?v=2026-10-30`) as OWID does, so a journalist's article does not change under them when our data updates.
4. **Count embeds without third-party scripts:** the `?embed=1` page sends one beacon (referrer host only) to the existing Workers Analytics Engine beacon (first-party-campaign-beacon skill). The weekly report lists hosts embedding us.
5. **Accessibility:** a text summary under the SVG plus a "view as table" link. That also helps AI answer engines, which read text, not SVG points.

## How we apply it to Cedwyn
- **This rides on a worker's graph modal:** each section's scatter already has build-time JSON. Proposal for that worker or the next site run: add `/graphs/<section>/?embed=1` standalone pages and the Share/Embed row inside the modal. Do it in the shared template, and don't touch their files while they are running. Log it as a [CEDWYN] HubSpot task.
- **First 3 charts to make embeddable:** research timeline (records by date × category), /wales/qa/ (questions by date × institution, coloured by answered / not held / no answer), and the evidence catalogue (items by date × type). These are the most citable for local-history groups, students and Welsh-language media.
- **Rules:** the credit line and chart text are public text. Neutral, never name the project lead, none of the banned words (write "not checked"), no insignia, nothing on family holdings or addresses. Embeds link only to our own pages. Never put archive images inside an embeddable chart (permission terms); use points and labels only.
- **Outreach:** only on the project lead's press GO. The embed row is passive until then. Pair it with the data-led PR skill when a GO comes.
- **Measure:** embedding hosts (beacon), PNG downloads, referrals from embedding hosts. Success after 8 weeks = at least 1 outside site embedding or citing a chart. If none, keep the PNG and drop the effort on embeds.

## Sources
- developers.google.com (read)
- seroundtable.com (Cutts 2013, read)
- ourworldindata.org ; ourworldindata.org (read)
- datawrapper.de ; datawrapper.de (read / snippet)
- digitalthirdcoast.com (read)