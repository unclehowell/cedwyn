# Welsh-language tags in e-books and listings: `cy` in EPUB, `wel` in ONIX, Welsh on KDP

**Why it matters.** Language metadata does two jobs. Stores and catalogues use it to file a book under Welsh (or not). Screen readers and read-aloud use it to pick a voice, so a Welsh place name that isn't tagged gets read in an English voice. One tag fixes both, it costs nothing, and it is checkable.

## The codes (read 31 Oct 2026)
- **EPUB / HTML (BCP 47): `cy`.** DAISY Accessible Publishing Knowledge Base, "Language" page (read in full):
  - set `xml:lang` on the `<package>` element of the OPF;
  - list each *primary* language of the book in its own `<dc:language>` element (their example lists `fr` and `en` for a two-language book);
  - set the default language on every content document (`<html lang="en" xml:lang="en">`);
  - mark every change of language inside the text (`<span lang="cy" xml:lang="cy">Tŷ Mawr</span>`) — this is WCAG 3.1.2, "Language of Parts".
- **ONIX (code list 74, ISO 639-2/B): `wel`**, not `cy` and not `cym` (EDItEUR list 74, read: "wel Welsh"). Distributors and library suppliers (Gardners, Books Council of Wales feeds) read ONIX, so a Welsh or bilingual edition needs `<LanguageRole>01</LanguageRole><LanguageCode>wel</LanguageCode>`. A second `<Language>` block with role 01 and `eng` marks a bilingual edition.
- **Amazon KDP:** "Welsh" is on KDP's supported-languages list with no format restriction (help page G200673300, read). PDF upload is only for English/French/German/Italian/Portuguese/Spanish/Catalan/Galician/Basque, so a Welsh edition goes up as EPUB or DOCX. KDP's language field is one value per book: an English book with Welsh passages stays **English**. Choose Welsh only when the text is mainly Welsh.
- **Gumroad / Stripe direct sales:** no language field. The language lives in the product title and description ("Welsh edition" / "Argraffiad Cymraeg") and inside the file.

## Evidence on discoverability
- There are no sales figures. Nobody publishes numbers for "added `cy`, sales rose". The case is mechanical: catalogues filter on the field, and read-aloud voices switch on the tag (DAISY KB; WCAG 3.1.1/3.1.2).
- Readers do look for Welsh e-books and find few ("free ebooks in the Welsh language … selection pretty limited", a Facebook group post, snippet only). A correctly tagged Welsh edition is easy to find because there are so few.

## How to do it (30 minutes per book)
1. **OPF:** `<package … xml:lang="en">`, `<dc:language>en</dc:language>`. Add `<dc:language>cy</dc:language>` **only** if Welsh is a primary language of the book (bilingual parallel text, or a Welsh edition). A few Welsh names in an English book are *not* a primary language.
2. **Every XHTML file** (cover, nav and title pages included): `<html xmlns="w3.org lang="en" xml:lang="en">`.
3. **Inline Welsh:** wrap Welsh phrases, quotations and place names whose pronunciation matters in `<span lang="cy" xml:lang="cy">…</span>`. Do it at build time from a word list (Tŷ Mawr, Llandochau, field names, quoted Welsh), not by hand.
4. **Check:** unzip the file and grep for `lang="cy"`. Optionally open it in Thorium Reader with read-aloud and listen to one tagged name.
5. **Listings:** for a Welsh or bilingual edition put the language word in the title line and the first line of the description, in both languages. Send ONIX `wel` through any distributor.
6. **Website:** the matching web pages already carry `lang`/hreflang (see `hreflang-trilingual-cy-en-es-real-translations-only.md`). This file covers the e-book itself.

## How we apply it to Cedwyn (PROPOSAL; nothing changed live)
**Measured 31 Oct 2026** (the three local EPUB builds, read-only):

| File | `dc:language` | Package `xml:lang` | `lang="cy"` spans | Welsh-name hits | Content docs with no `lang` |
|---|---|---|---|---|---|
| enwau sample (en) | en | en | 0 | 110 | some |
| Llandough tour companion v0.1.0 (en) | en | en | 0 | 59 | some |
| La visita de Llandough v0.1.0 (es) | es | es | 0 | 31 | some |

- The primary language is correct in all three. **No Welsh word is tagged**, so read-aloud reads "Tŷ Mawr" and the field names in an English or Spanish voice. That matters most for the *enwau* (field-names) book, where the names are the subject.
- At least one content document per book has no `lang` on `<html>` (probably cover or nav).

**Proposed changes (for the e-book build owner, next rebuild; no price, listing or store change):**
1. In the build script, add `lang`/`xml:lang` to every XHTML root, and a word-list pass that wraps known Welsh terms in `<span lang="cy" xml:lang="cy">`. Start with the enwau field-name list.
2. Keep `dc:language` as en/es. Add `cy` only for a future bilingual or Welsh edition. That edition is listed as Welsh on KDP (EPUB upload) and as ONIX `wel` through the Books Council route (`ffolio-cymru-books-council-wales-listing.md`). Any Welsh text comes from a real translator, per the hreflang rule, never machine-only.
3. Add a gate to the e-book QA checklist: `grep -c 'lang="cy"'` > 0 for any book containing Welsh names, and every XHTML has `lang`. The EAA accessibility-metadata file (`eaa-epub-accessibility-metadata-ebooks.md`) already asks for an accessibility summary; this is the language half of the same check.
4. Re-measure after the next build. Success = 0 untagged XHTML roots, and every name in the enwau word list tagged.

## Sources
- DAISY Knowledge Base, Language: kb.daisy.org (read 31 Oct 2026)
- EDItEUR ONIX code list 74 (Language code): ns.editeur.org (read; "wel Welsh")
- Amazon KDP supported languages: kdp.amazon.com (read; Welsh listed; PDF-language limit)
- Facebook group post on scarce Welsh e-books (snippet only, not read): facebook.com