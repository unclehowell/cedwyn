# Welsh-language Wikimedia: Wicidestun (cy Wikisource) + Wicipedia (cy Wikipedia) scope and sizing

Harvested 2026-10-30 ~17:00Z. Zero budget. Sibling of wikisource-scan-backed-public-domain-records-cite-back.md (English Wikisource). Status for Cedwyn: PROPOSAL (any edit needs a Wikimedia account the owner makes himself, or a Welsh-speaking volunteer; same COI rules as wikipedia-ai-citations-coilegal-llm-rules-gate.md).

## Scope rule (primary: en.wikisource language policy, re-read in the sibling skill)
- **Welsh-language originals go to cy.wikisource.org (Wicidestun)**, English texts to en.wikisource. Same pre-1931 / scan-backed / whole-work / no second-hand-transcription rules. Proofreading happens in the `Tudalen:` (Page) namespace against a DjVu/PDF in the `Indecs:` (Index) namespace; text gets "Darllenwyd y proflenni" (proofread) status.
- Help and policy questions go to **Wicidestun:Y Sgriptoriwm**, which takes Welsh or English.

## What I measured (30 Oct 2026, MediaWiki API + Wikimedia pageviews API, user agents only)
**Wicidestun is tiny and run by two people.**
- siteinfo: 85,335 pages, 16,627 content pages, 4,244 accounts, **15 active users**, 2 admins.
- Last 500 non-bot edits (since 4 Oct 2026): Tylopous 422, AlwynapHuw 62, everyone else 16 (temporary accounts).
- Whole-site human views: about 45k-180k a month (Dec 2025 45,424; Aug 2026 118,286; Sep 2026 461,694 was a spike). en.wikisource got 34,977,834 in Aug 2026, roughly 300x more.
- Aug 2026 top-1000 list: front page (Hafan) 4,527; rank ~200 = **22 views/month**; floor of the list (rank 805) = 11. A typical transcribed chapter gets 10-50 views a month.

**What already exists for our area:**
- *Hanes Morganwg* (Dafydd Morganwg, Aberdâr: Jenkin Howell, 1874), the Welsh-language history of Glamorgan, has an `Indecs:` page: **588 scan pages, 37 proofread, 14 without text, 537 not yet created**. Page 38 (proofread) names "Pont Lecwydd (Leckwith)" on the Ely. The parish entries for Llandochau / Lecwydd / Penarth are most likely in the 537 unproofread pages (not checked page by page).
- A Cofiant John Jones Talsarn page (Tudalen .../301) names "Y Parchedig John Wallter ... Person Llandoch, yn Sir Forganwg, ac awdwr y Geiriadur Saesonaeg a Chymraeg" (the lexicographer John Walters as rector of Llandough).
- *Dinas Caerdydd a'i Methodistiaeth Galfinaidd* (to 1926) is transcribed: 48 views Aug 2026, 30 Sep 2026.
- Searches: "Llandochau" 0 hits, "Llandough" 0, "Lecwydd" 1, "Llandoch" 1.

**Wicipedia (cy Wikipedia) place articles get almost no traffic:**
- 12 months to Sep 2026: Llandochau Fach **54** user views, Lecwydd **34**. en Wikipedia "Llandough": 209.

## Honest read
Neither is a traffic channel: expect 0-2 clicks a year to anything we link. The value is **credibility and Welsh-language presence**. A neutral, scan-checked Welsh text of the 1874 county history's Llandough/Leckwith passages is a source that Welsh-speaking readers, archivists and AI answer engines can check without trusting an interested party. And because only two editors are active, **one careful contributor is a visible share of the whole project**, so the community will notice good work and also any self-promotion.

## How to do it
1. **Find the pages first (no account needed):** open the Hanes Morganwg Indecs, use the book's contents/index pages to locate the Llandochau, Lecwydd and Penarth parish entries, and note the scan page numbers. Read them from the scan image (OCR is a draft, never the final text).
2. **Proofread only those pages** (Tudalen namespace), from the image, keeping 1874 spelling. A Welsh speaker must do or check this; the Welsh-captions task (#33b) already needs one, so ask for both at once.
3. Leave pages at "proofread"; ask in Y Sgriptoriwm (one short Welsh/English note) for a validator. Don't transclude a part-work into the main namespace yourself; the index owners decide that.
4. **No link to cedwyn anywhere on Wicidestun or Wicipedia.** Links there are not a promotion channel, and two active editors will spot COI at once.
5. **Wicipedia:** don't edit the Llandochau Fach article (COI). If a scan-backed Wicidestun page now covers the farm or parish, an uninvolved editor may cite it; at most, leave a neutral talk-page note (Sgwrs) that a source exists, signed and disclosing the interest.
6. **Cite back from our side** only if the editorial no-outbound-links rule allows a source citation: "Welsh text: *Hanes Morganwg* (1874), p. N, scan-checked transcription on Wicidestun". Otherwise cite the printed book and page only.

## How we apply it to Cedwyn
- Proposal for the root/owner: "Proofread the Llandochau/Lecwydd/Penarth pages of *Hanes Morganwg* (1874) on Wicidestun (Welsh speaker, own account), then cite book + page on /wales/ and the timeline." Cost: zero. Time box: 3 hours.
- **Now, with no account:** the research lanes can read and quote the already-proofread pages (p. 38 Pont Lecwydd; the John Walters line) as printed sources, citing book and page, in neutral third-person wording.
- Feed the John Walters (rector of Llandough, lexicographer) line to the online gap finder: it is a public, dated, Welsh-language mention of the parish.
- **Stop rule:** if 90 days after proofreading the pages got under 10 views and no one cited them, do no further Wicidestun work. The credibility citation stays.

## Sources
- cy.wikisource.org (read 30 Oct 2026)
- cy.wikisource.org).djvu (page status counted 30 Oct 2026)
- cy.wikisource.org).djvu/38 ; cy.wikisource.org
- cy.wikisource.org
- cy.wikipedia.org ; cy.wikipedia.org
- Wikimedia pageviews REST API (aggregate, top, per-article; agent=user), read 30 Oct 2026