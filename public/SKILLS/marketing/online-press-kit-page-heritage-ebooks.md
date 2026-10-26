# Online press kit page for a heritage e-book archive (HTML, not PDF)

Skill harvest, 26 Oct 2026. Topic: one plain page a hurried journalist, blogger, podcaster or society editor can copy from in two minutes. Complements `press-requests-and-mention-monitoring.md` (finding requests) and the Welsh/Chubut press files (who to pitch); this file is the page they land on.

## What the primary sources state
- **Cision, 2025 State of the Media** (survey of 3,000+ journalists; press release of 6 May 2025, read 26 Oct 2026): **72%** name press releases as the most useful thing PR can give them, and "when paired with multimedia, impact increases significantly"; **86%** reject a pitch off their beat or audience; **85%** say the best way to start a relationship is a short email introduction, even with no story to pitch; **72%** worry about factual errors in AI-written PR content.
- **Muck Rack, State of Journalism 2026** (already summarised in the Welsh-media and Chubut files): 62% prefer 1:1 email, 69% want pitches under 200 words, original data and access to a source rank high. A pitch stays short because the detail lives on the press page.
- **Practitioner advice (Camilla Monk on janefriedman.com, after an Authors Guild session by agent Sarah Fisk):** no PDF kits (text pastes as "mangled soup", images are compressed and hard to extract); use an **HTML page** with text that copies cleanly and images at several resolutions, plus an optional zip with a .docx and labelled image folders; keep the design plain; add a **recording of how to say the name** for unusual pronunciations; pick only items useful to media, not everything on a checklist.
- **Reedsy author media kit template** (updated 14 Oct 2025): bio, contact details, sample Q&A or tip sheet, press release, photographs, sell sheet, excerpt.

## Page contents (one URL, e.g. /press/)
1. **One-paragraph summary** of the archive and e-books (60-80 words), then a 25-word version. Plain, copyable text.
2. **Key facts list**: what the archive holds (counts of records, date range), languages (EN/CY/ES), where the place is (parish level only), what is free vs paid. Each number links to the page that shows it. Only facts already published on the site; anything not checked stays off.
3. **Story angles** (3-5 one-liners) mapped to beats: local history, Welsh language, Patagonia/Spanish, open records and archives, family history. Matches the "relevance to beat" finding.
4. **Images**: 6-10 items, each with a web size and a high-res download, a caption and a credit/licence line; e-book covers, archive document scans (public-domain or own photos only), place photos. No people's likenesses without consent.
5. **Pronunciation**: short audio clips for Tŷ Mawr, Llandough, Cedwyn and any Welsh terms used, plus a written guide.
6. **Sample Q&A**: 5 questions with short answers a writer can quote.
7. **Excerpt**: one free extract (400-800 words) with a link to the full e-book page.
8. **Latest news**: the newest press note as HTML text (dated), older ones listed below.
9. **Contact**: one role address for press (no personal phone, no home address), expected reply time, and "drafts and interviews on request".
10. **Download all**: a zip (.docx text + labelled image folders) under a few MB; plus the page itself prints cleanly.

## Craft rules
- Text in normal HTML, no text inside images; images with alt text.
- Keep it neutral and dated: no accusations about named people, nothing about family holdings or addresses.
- Add `noindex`? No: let it be indexed, it is a good page for the brand query; link it from the footer only.
- Measure: visits to /press/ and downloads (GA4 events per `utm-discipline-ga4-funnel.md`), and press mentions logged by the monitoring routine.

## How we apply it to Cedwyn
- Live check 26 Oct 2026: `cedwyn.bucklerfamily.estate/press/` returns 404, so there is no press page today.
- **PROPOSAL (new public page, owner GO needed):** build `/press/` in the Cedwyn shop theme from items 1-10, using only facts and images already on the site; footer link only; no outreach attached. Press contact remains on the owner's GO, as for all press work.
- Prep that needs no GO (folder only, no commit): draft the 80- and 25-word summaries, 5 angles, 5 Q&A, the image list with licences, and a pronunciation script for the owner or a Welsh speaker to record (no synthetic voice for names without approval).
- Success measure: first use is when a press-request reply or a society editor is pointed to it; track visits and downloads for 8 weeks; if under 10 visits, leave it as a quiet footer page.

## Sources
- prnewswire.com (read 26 Oct 2026)
- cision.com
- janefriedman.com (read 26 Oct 2026)
- reedsy.com (read 26 Oct 2026)
- umarcomm.umn.edu (Muck Rack 2026 figures, via existing index files)