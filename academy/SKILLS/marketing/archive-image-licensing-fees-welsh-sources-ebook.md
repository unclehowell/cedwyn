# Archive-image licensing for a local-history e-book: what each Welsh source charges, and the free routes

Topic: costing and clearing archive photographs (RCAHMW/Coflein, Glamorgan Archives, NLW) before they go into a paid Cedwyn e-book or a paid documentary version. Harvested 29 Oct 2026.

## What the sources say (read live 29 Oct 2026 unless marked)

**RCAHMW / Coflein** (rcahmw.gov.uk guide + Licence Fees page, read)
- Coflein holds about 125,000 images, all free to view. Many are Crown copyright, administered by RCAHMW "sometimes for a fee"; many others belong to third-party donors, who must give permission themselves.
- Free, no permission needed: education, personal/family/local-history research, personal use, and "social media and non-commercial websites (e.g. Facebook history pages, local history websites)". Crown images are covered by the Non-Commercial Government Licence.
- Commercial use needs a licence before any reproduction. Per-image fees:
  - Books, e-books, commercial magazines, reports: run 1-500 = £10 UK / £25 world; 500-1,000 = £25 / £50; 1,001-3,000 = £35 / £70; 3,001-5,000 = £50 / £100.
  - Academic journal or charity publication: 1-500 = £5 / £15, up to £25 / £35 at 3,001-5,000.
  - RCAHMW generally asks for one copy of the publication to be deposited in its library.

**Glamorgan Archives** (glamarchives.gov.uk, read)
- Digital image from existing files: £15.60 for the first image, £4.80 for each further image from the same document. Multiple documents: £60 per hour. Turnaround target is 15 working days. Payment is by cheque or similar.
- Those are copying fees. Whether a separate publication permission or fee applies was **not checked**. Ask in the same order.

**National Library of Wales** (library.wales licensing page via Wayback 14 Oct 2026, read)
- Restricted uses need a licence from the Enquiries Team. The request must state: reference or title, format and resolution (e.g. 300 dpi), the product (pamphlet / poster / website / e-book), the run (e.g. 500), the term (e.g. 3 years) and the territory (Wales / UK / worldwide).
- Fees follow a "Rights fee schedule" (PDF not read). If the item is still in copyright, clearing the rights is the publisher's job.

**UK law baseline** (IPO Copyright Notice: digital images, photographs and the internet, read)
- Image copyright is generally life + 70 years, varying with creation date.
- Simply copying an image does not create a new copyright. However, there is "uncertainty" over whether retouched digitisations of out-of-copyright images carry one.
- A picture library can still restrict out-of-copyright images **by contract** through its terms of supply. Clearing copyright does not clear the contract you accepted when you downloaded.

## The playbook

1. **Inventory first.** For every image in a planned paid product, record: source, reference number, creator, date, copyright status (Crown / third party / expired / ours), and the terms it was supplied under. Put this in one CSV beside the e-book build.
2. **Use free routes before paying:**
   - images we made ourselves (photos, maps drawn from data, AI reconstructions clearly labelled);
   - our own archive copies of documents the family holds;
   - images whose copyright has clearly expired and that came with **no** restrictive contract, e.g. Wikimedia Commons public-domain files (see wikimedia-commons-public-domain-archive-images-glam.md);
   - non-commercial pages on Cedwyn, which keep Coflein images legal under the NCGL with the credit line.
3. **Licence only images that carry the story.** At Cedwyn's real volumes, an e-book licence is a small fixed cost: 1-500 copies with UK rights is £10 per image at RCAHMW. Five key images cost £50 (UK) or £125 (world). Glamorgan Archives copies of five images from one document cost £15.60 + 4 × £4.80 = £34.80 before any permission fee.
4. **Pick rights to match the real channel.** Stripe and Gumroad sell worldwide, so a "UK rights" licence does not fit a global download. Either licence world rights, or keep licensed images out of the paid file and show them on a free web page that the e-book links to.
5. **Write one licence request per source** with NLW's six fields (ref, format/dpi, product, run, term, territory). The same fields work for RCAHMW and Glamorgan Archives. Ask for the exact credit line and keep the reply.
6. **Credit every image** under it, in the source's own wording, and log the licence reference in the CSV.

## Kill rule

If one image's clearance costs more than one month's e-book revenue, swap it for a free-route image or a link to the free page.

## How we apply it to Cedwyn

- Build `the project workspace` at the next e-book build. Any row marked "Coflein, third party" or "unknown" blocks that image from the paid file until it is cleared.
- Default: paid e-books and paid documentary versions (v0.0.2+) use our own images and AI reconstructions. Archive images stay on the free Cedwyn pages and evidence catalogue under the NCGL/non-commercial terms, linked from the e-book.
- If an RCAHMW image is essential (e.g. a Coflein aerial of Llandough), the request is a HubSpot draft for the project lead's GO. Budget £25 per image for world rights at 1-500 copies, plus the deposit copy. It is never sent by us without his GO, and zero spend until he approves.
- Glamorgan Archives orders (cheque route) are the project lead's to place. Note the publication-permission question in the same draft.
- Public text on the site credits sources in their own wording. Nothing here changes the editorial rules: no banned words, no names of living private people.

## Sources

- rcahmw.gov.uk (read 29 Oct 2026)
- rcahmw.gov.uk (read 29 Oct 2026)
- nationalarchives.gov.uk
- glamarchives.gov.uk (read 29 Oct 2026)
- web.archive.org (read; fee schedule PDF not read)
- gov.uk (read 29 Oct 2026)