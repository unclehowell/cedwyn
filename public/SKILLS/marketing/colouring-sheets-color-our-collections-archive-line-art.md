# Colouring sheets from the archive: #ColorOurCollections week and printable craft spin-offs

**Topic:** turn line-drawn records (plans, maps, engravings, letterheads) into free printable colouring sheets, launch them in the first full week of February alongside the libraries and museums that run #ColorOurCollections, and use the download page to collect sign-ups and point at the e-books. Craft spin-offs (knitting/cross-stitch charts) are the same play for a different crowd.
**Harvested:** 31 Oct 2026 (skills harvest).

## What the evidence states (primary sources, read)
- **The original campaign, measured (Garner, Goldberg & Pou, RBM journal, 2017; peer-reviewed case study, read in full).** The New York Academy of Medicine (NYAM) Library ran #ColorOurCollections on 1-5 Feb 2016 with about 6 weeks' preparation. They e-mailed ~130 organisations a month ahead; the only rule was to post colourable images with the hashtag that week. Results:
  - 5,230 contributors posted 9,573 tweets with the hashtag between 31 Jan and 3 Mar 2016, reaching about 20.6 million people (Hashtracking's reach figure, an estimate). About 83% of those tweets fell inside the 5 campaign days.
  - Participants shared 103 colouring books/pages plus 24 albums. NYAM made one 20-page PDF.
  - NYAM's own tweets got 73,900 impressions in the 5 days, against 41,200 the week after (about 1.8x).
  - Twitter followers: +99 in Dec, +170 in Jan (promotion month), +250 in Feb (their best month ever). Instagram had its two best months (+100, +176). Organically +141 followers during and after.
  - 30+ blog/press mentions, mostly unpitched; 450+ coloured-in images came back.
  - Lessons: low barrier, a running list of every link, and one stable URL (many people linked NYAM's 2014 book instead of the 2016 one).
- **The campaign today (NYAM hub, read 31 Oct 2026).** It runs in the first full week of February. Institutions per year: 2018 181, 2019 114, 2020 113, 2021 102, 2022 101, 2023 92, 2024 93, and 895 institutions in total. Amgueddfa Cymru (National Museum Wales) has 3 books there. NYAM supplies portrait and landscape templates and social graphics. **The hub shows nothing after 2024 and states "Registration is closed for 2024".** Institutions still posted the hashtag in Feb 2025 (University of Missouri page in search results; not opened). Whether NYAM runs a 2027 registration is **not checked**. Plan for the hashtag week either way, and treat a listing on the hub as a bonus.
- **Craft spin-off, measured (Sundberg, RBM 2024, "Crafting Connections", read).** McGill's rare books library turned manuscript decoration into knitting charts. The "Manuscript Cowl" pattern was downloaded more than 550 times in its first 24 hours (Feb 2021) and more than 500 times on Ravelry later. The launch event drew 1,115 RSVPs and 602 livestream attendees. A follow-up "Knitting 101" workshop had over 200 RSVPs for 40 places and 142 attendees at once. Their note: drafting the charts by hand worked better than auto-conversion tools.
- **Caveat:** 2016 Twitter numbers from a well-networked institution, not a forecast for a small site. What repeats: the timing, the low-friction format, one stable page.

## How to do it (steps)
1. **Pick 4-8 drawable items.** Use drawings with clear outlines (OS map extracts, estate plans, building elevations, engravings, printed letterheads, field-name maps). Avoid photos and mostly-text documents: they turn to black mush. Use only images you have the right to reuse, and put the source line on every sheet.
2. **Make the sheets.** Use `tools/colouring_sheet.py` (below), or NYAM's templates if you want their look. Use the full-resolution scan, crop to the drawn panel, check the ink figure, then check by eye. One sheet per page, title at the top, source line and site URL in the footer.
3. **Bundle them** as one small PDF (keep it under 5 MB). Put it at ONE permanent URL that never changes year to year (e.g. `/colour/`), with an optional sign-up box: "get next year's sheets". The sheets themselves are free with no gate. The NYAM authors stress a low barrier, and a hard gate kills the share.
4. **Time it.** Release in the first full week of February. For 2027 that is Mon 1 to Fri 5 Feb (check the date against NYAM if the hub reopens). Prepare from mid-December, as NYAM did.
5. **Post** once a day that week, one sheet per post with the hashtag (plus #ColourOurCollections, the UK spelling, which people also use). Ask for coloured-in versions back and reshare them with permission.
6. **Measure:** downloads of the PDF (count the redirect or file hits), sign-ups from `/colour/`, clicks from `/colour/` to `/ebooks/`, reshared colourings, followers gained in the week compared with the week before and after.

## Tool (written this run, no install)
`tools/colouring_sheet.py` uses PIL, which is already on the box (about 4 KB). It turns a scan into an A4 300-dpi sheet with a title and source footer.
Plan mode (default): adaptive threshold, so stained paper doesn't go black; photo mode: edges plus thickening; `--crop` fractions, `--no-rotate`. Prints ink coverage with a verdict (5-15% OK, <3% faint, >25% dark: my heuristic, not a standard).

Tested on `files/ghf_1939_plan_s.jpg`: a plain threshold gave 40% ink (too dark), the adaptive one 13%. But that source is a small, sideways photo of a mostly-text lease, so the sheet was blocky and a poor subject. Use full-resolution scans of drawn items and judge by eye.

## How we apply it to Cedwyn
- **Fit:** the records are full of line drawings: estate/OS plan extracts of Llandough and Leckwith, farm building outlines, field maps, period letterheads. Families, schools and local-history groups colour. This gives the site a free, shareable, non-contentious thing during the quietest sales month. Only neutral, dated content goes on the sheets: no case wording, no named living people, no addresses beyond the place name the site already uses, no insignia. The editorial rules apply to titles and footers.
- **Doable by us now (zero spend, no account):** pick 6 drawn items from the evidence catalogue, render them with the tool at full resolution, and build a draft PDF plus a `/colour/` page patch. Under the repair freeze, leave it as a patch in `the project workspace` or under the bizdev folder; don't change live pages. The footer reads "Source: <catalogue ID> - cedwyn.bucklerfamily.estate"; on the page, a soft link "the full story: /ebooks/".
- **Welsh/Spanish:** cy/en title per sheet; an es PDF for Patagonia is cheap once the art exists.
- **PROPOSAL (outward posts, needs GO under the posting rules):** post one sheet a day on Instagram @cedwynestate and the Great House Farm II Facebook page in 1-5 Feb 2027, with #ColorOurCollections and #ColourOurCollections. If the NYAM hub reopens registration in January 2027, submit the PDF there. That is a public listing, so it is also a proposal.
- **PROPOSAL (later, only if the colouring sheets get downloads):** one knitting or cross-stitch chart of a farm motif on Ravelry, which is free to list. McGill's 550 downloads in 24 hours shows craft people will take archive patterns. Needs an account, so it is a proposal.
- **Judge it:** compare with the week before. Count it a win if the `/colour/` page gets 100+ PDF downloads and 10+ sign-ups in Feb 2027. Under 20 downloads means drop it, and don't repeat it in 2028.

## Sources
- Garner, Goldberg & Pou, "Collaborative Social Media Campaigns and Special Collections: A Case Study on #ColorOurCollections", RBM 18(2), 2017: rbm.acrl.org (PDF, read)
- NYAM #ColorOurCollections hub, About / Tools & Resources / Registration pages (read 31 Oct 2026): library.nyam.org ; library.nyam.org ; library.nyam.org ; library.nyam.org
- Sundberg, "Crafting Connections: Bridging Collections and Communities...", RBM 2024: rbm.acrl.org (read)