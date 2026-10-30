# Permission-to-publish terms for archive images in paid e-books and AI-animated documentary versions

Topic: what the licence terms (not just the fees) of NLW, Glamorgan Archives and RCAHMW (Aerofilms after 1953) allow, and what that means for animating an archive still in a paid Cedwyn documentary version. Harvested 30 Oct 2026. It adds to archive-image-licensing-fees-welsh-sources-ebook.md, which has the copying fees and the RCAHMW book fee table. Here: the Glamorgan **publication** fees (marked "not checked" there) and the NLW **licence conditions** (that file did not read them).

## What the sources say (read live 30 Oct 2026 unless marked)

**Glamorgan Archives: licensing for re-use** (glamarchives.gov.uk, read). These are per-image fees on top of copying (£15.60 for the first image, £4.80 for each further image from the same document):
- Printed and digital media, run under 1,000: £30 UK, £57.60 worldwide, £9.60 not-for-profit.
- Run 1,001–5,000: £57.60 UK, £132 worldwide, £16.80 not-for-profit.
- Run 5,001+: £78 UK, £156 worldwide, £24 not-for-profit.
- **Website, commercial: £78 per image per year.** Website, not-for-profit: £1.80 per image per year.
- **Stills in TV/film:** £132 per image (UK, in perpetuity), £390 (worldwide, in perpetuity).
- Exhibition with paid admission: £78. Advertising or other commercial use: £720 per image.
- Research for media use: £120 per hour. Filming at the archive: £180 per half day minimum. Orders need the order form and its copyright declaration, with a 15 working day target.

**National Library of Wales: standard licence** (the "Licence (DOCX)" linked from library.wales, read via Wayback 14 Oct 2026). The licence names the image, format, resolution, product, production run, term in days, territory and fee per image plus VAT. Conditions that bite:
- **Time-limited and run-limited.** The licence ends at the end of the term or when the run is used up, whichever comes first (1b). Within one month of expiry you must stop using the image and erase every copy (2g). No reprint or reuse without a new fee (2c). A permanent e-book or a perpetual stream therefore needs a long term negotiated up front.
- **No material alteration.** "No adaptation, alteration or manipulation which distorts or materially alters the Image(s) is permitted without the prior written consent of the Library, but manipulation which clarifies the Image(s) is permitted" (2h). Animating a still with image-to-video or lip-sync is material alteration, so it needs **written consent** asked for specifically.
- **Derogatory treatment** is not allowed (2i). The licence is personal and cannot be sub-licensed (2j). Designers and printers are bound by it (2k).
- **Credit line** in every copy: "By permission of Llyfrgell Genedlaethol Cymru / The National Library of Wales" (2e).
- **Complimentary copy.** NLW may claim a print copy; for an online product it wants free access from its own terminals (2f).
- Fees follow a "Rights fee schedule" that was **not read** (the live page is behind a bot wall). Reprographic fees are charged on top. Screen and Sound has its own price list.

**NLW rights labels** (library.wales, read via Wayback). Every digital item carries one of five labels: Copyright, Public Domain Mark, Unknown Copyright, CC BY-NC-SA, CC BY-NC-ND. Metadata and the Library's own text are CC0. Requests go through the Online Enquiries Form.
- **NC** rules out paid versions.
- **ND** rules out animation even on free pages.
- **Public Domain Mark** is the only label that is clean for a paid, animated use.

**RCAHMW: Aerofilms after 1953** (rcahmw.gov.uk, read).
- The collection is 1.26 million negatives plus 2,000+ albums dated 1919–**2006**. It includes AeroPictorial (1934–1960) and Airviews (1947–1991). RCAHMW, HES and Historic England bought it jointly in 2007.
- Britain from Above conserved and put online only about 95,000 of the 1919–1953 images. Post-1953 frames are not on Britain from Above; they have to be searched for and ordered through RCAHMW/Coflein.
- The fees are the RCAHMW licence table (see the fees skill). Which body licenses a given Welsh post-1953 frame was **not checked**, so ask before ordering.

## The playbook

1. **Label before you plan.** For each archive image in a paid or animated use, record source, ref, rights label (NLW) or owner (Crown/third party), licence term, run, territory, and "animation allowed: yes/no/asked". Add these as columns in `image-rights.csv`.
2. **Route by use:**
   - Free page, still image: the non-commercial routes are fine (Coflein NCGL, Glamorgan £1.80 per image per year for not-for-profit web, NLW PDM/CC per label).
   - Paid e-book, still image: per-image publication fee at the honest run size (under 1,000 is realistic) and territory. Online sales are worldwide.
   - **Animated in a paid documentary version:** treat it as film. Glamorgan quotes stills for TV/film at £132 UK / £390 worldwide **in perpetuity**, which is the only fee read here without a time limit. NLW needs written consent to alter, plus a term long enough for the product's life.
3. **Prefer substitutes for animation.** Generate a reconstruction from our own research and label it as a reconstruction. Show the real archive still unaltered on screen as evidence, linked to its catalogue page. Animating the archive image itself is the costly, consent-bound option.
4. **Ask once, completely.** One enquiry per archive listing every image, product, run, term ("life of product"), territory (worldwide) and the exact alteration ("image-to-video motion added"). Keep the reply in HubSpot. The licence is personal to the named licensee.
5. **Credit and deposit.** Use the exact credit line in the credits and on the scene description. Diarise the free copy or access each archive asks for.
6. **Expiry watch.** Any time-limited licence gets a dated reminder a month before expiry, because erasure is a contract term.

## How we apply it to Cedwyn

- **Rule for the documentary:** archive images are never animated in paid versions (v0.0.2 and later) without a written licence. Moving shots use our own reconstructions. Archive stills appear unaltered in the Evidence list under each scene, which links to our archived copies. This keeps the 30 Oct "animate every still" push safe: animate the reconstructions, not the archive scans.
- **Free v0.0.1 scenes** may show archive stills unaltered under non-commercial terms, with the label checked first (no ND images animated, even when free).
- Costing check before any licence: one Glamorgan still in a worldwide paid documentary costs £390, the price of about 78 version sales at £4.99. Only worth it for a decisive record. Any licence request is a HubSpot draft for the owner's GO. Zero spend.
- Add `rights_label`, `animation_ok` and `licence_term_end` columns to `image-rights.csv` when the next documentary or e-book worker touches it.

## Sources
- glamarchives.gov.uk (licensing for re-use table, read 30 Oct 2026)
- web.archive.org and the linked licence DOCX (fileadmin/.../amd_hc_licence_130829D.docx, read)
- web.archive.org (rights labels, read)
- rcahmw.gov.uk (collection dates, AeroPictorial/Airviews, Britain from Above scope, read)
- Not read: NLW Rights fee schedule PDF; TNA image library prices (bot wall; a search snippet gives £40 per image for open-access website use in perpetuity)