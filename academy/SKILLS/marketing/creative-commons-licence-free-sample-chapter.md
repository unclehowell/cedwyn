# Creative Commons licence line for free sample chapters (full e-book stays paid)
Harvested 2026-10-31 (skills harvest ~03:15Z). Topic: which CC licence to put on a free sample so people can pass it round, without giving away the paid book. Complements free-sample-chapter-read-before-buy.md (where the sample sits on the page) and free-previous-edition-paid-latest-baen-pattern.md (Baen, Hilton & Wiley 2010, automatetheboringstuff); this file is only the licence choice and the marking.

## What the sources show (read unless marked)
- **The deed (creativecommons.org, read):** BY-NC-ND lets anyone "copy and redistribute the material in any medium or format"; they must credit and link the licence; NonCommercial = "may not use the material for commercial purposes"; NoDerivatives = if they "remix, transform, or build upon the material, you may not distribute the modified material". "The licensor cannot revoke these freedoms as long as you follow the license terms."
- **Irrevocable, and scoped (CC licensing considerations v4, read):** "the license may not be revoked ... anyone who receives it may rely on that license for as long as the material is protected by copyright ... even if you later stop distributing it." Also: "Specify precisely what it is you are licensing ... text, images, music ... clearly mark ... which of those are covered", and do not CC-license material whose rights are held by others without permission to sublicense.
- **Doctorow (CC wiki case study, read; Locus "Free(konomic) E-books", Sept 2007, read):** every novel since *Down and Out in the Magic Kingdom* (2003) released free under BY-NC-SA or BY-NC-ND at the same time as print; *Little Brother* (BY-NC-SA) spent 4 weeks on the NYT list. His own framing is honest about the evidence: no controlled test is possible, so his case is "qualitative, anecdotal"; one peer whose debut had no free download sold "substantially" less, and Baen reported "a measurable uptick" after free releases. The question he poses: not "will free cost me sales?" but "will it win more sales than it costs?" Craphound (2005, snippet): over half a million free copies of the first novel given away.
- **Coelho (Fortune interview, reposted on paulocoelhoblog.com 3 Feb 2008, read):** Russia 1999 ~1,000 copies, publisher dropped him; he posted a free Russian *Alchemist* on his own site; "within a year he sold 10,000 copies; the next year around 100,000", over 1 million across titles by 2002, "over 10 million" in Russian by 2008. One author's account, no control, and he posted a whole book, not a sample: treat as the upper anecdote, not a forecast.
- **Peer-reviewed counterweight:** Hilton & Wiley 2010 (abstract read; detail already in the Baen file): 41 titles, 8 weeks before/after a free digital version, 3 of 4 categories sold more; one category (Tor, full text not read here) did not. Free helps obscure titles more than known ones.
- No public test found of a CC-licensed sample vs an all-rights-reserved sample. Any lift we claim is our own measurement.

## Which licence (decision rule)
| Want | Licence | Why |
|---|---|---|
| Sample shared freely, nobody may sell it or alter it | **CC BY-NC-ND 4.0** (default) | Share = yes; selling or chopping/re-captioning = no. Keeps the chapter intact with its buy link. |
| Also allow teachers/societies to translate or adapt (e.g. a Spanish class version) | CC BY-NC-SA 4.0 | Adaptations allowed, must stay NC and same licence. Choose only on owner go. |
| Wikipedia/Commons reuse | BY or BY-SA only | Wikipedia rejects NC/ND. Never put the sample text itself under BY: commercial reuse becomes legal forever. |
Never CC the full paid e-book. Never CC a sample that contains third-party images (NLW, Glamorgan Archives, newspapers, ITV stills): either remove them from the sample or mark them "not covered by this licence, (c) the holder". Remember NLW items may already carry NC/ND labels (archive-image licensing skill).

## How to do it (steps)
1. **Freeze the sample text** (the exact chapter, ~10%). The licence attaches to that version forever; later edits are a new version.
2. **Licence line**, at the top and bottom of the sample HTML/PDF/EPUB, plain words (TASL: title, author, source, licence):
   > "Chapter 1 of *<Title>* (Cedwyn, 2026) is shared under CC BY-NC-ND 4.0 — copy and pass it on unchanged, free, with this credit. Images are not covered. The full e-book: <shop URL>."
   Link "CC BY-NC-ND 4.0" to creativecommons.org . Copyright line stays: "(c) <rights holder> 2026. All other rights reserved." for the rest of the book.
3. **Machine-readable**: on the sample page add `<link rel="license" href="creativecommons.org`; in JSON-LD on the sample (CreativeWork/Chapter) set `"license"` to the same URL and `"isPartOf"` the Book with its buy URL. EPUB/PDF: put the URL in the copyright page and dc:rights / PDF metadata.
4. **Make sharing the point**: a "send this chapter to a friend" button (WhatsApp/email/copy link with utm_source=share&utm_campaign=cc-sample), and a downloadable PDF/EPUB of the sample (people can only pass on a file they can hold).
5. **Where CC opens doors**: Internet Archive texts (licence field), Zenodo/repository uploads, teacher packs, local-history society newsletters can reprint the chapter as-is without asking. Each reprint carries the buy link.
6. **Measure (4 weeks before/after)**: sample page views, sample downloads, share-button clicks, referrals from domains we never posted to (sign the chapter is travelling), and buy clicks from the sample's link (utm_content=cc-sample). Kill rule: if 4 weeks show 0 off-site referrals and 0 reprints, the licence line stays (it costs nothing) but stop promoting the "share it" angle.

## How we apply it to Cedwyn
- Default: **CC BY-NC-ND 4.0 on chapter 1 of each Cedwyn e-book only**; full books stay all-rights-reserved and sold via /ebooks/.
- Strip or mark every archive image, cutting and TV still in the sample as "not covered"; text-only sample is safest.
- Spanish sample (Patagonia readers): same licence; BY-NC-SA only if the owner wants schools to adapt it.
- Public wording must follow the editorial rules (no banned words, never name the owner, nothing about family holdings).
- PROPOSAL for the owner (licence choice is a rights decision, irrevocable): "CC BY-NC-ND on chapter 1 only, images excluded" — log in the project workspace; do not apply until GO.

## Sources
- creativecommons.org (read)
- creativecommons.org (read)
- wiki.creativecommons.org (read)
- locusmag.com (read)
- paulocoelhoblog.com (read; Fortune interview repost)
- craphound.com (snippet only)
- scholarsarchive.byu.edu (abstract read)