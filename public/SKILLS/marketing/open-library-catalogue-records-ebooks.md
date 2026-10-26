# Open Library: free public catalogue records for our e-books
Harvested 26 Oct 2026 (skills harvest 15:52). Internal skill file.

## What it is
- Open Library is an open, wiki-style book catalogue run by the Internet Archive. Anyone with a free account can add or edit book and author records ("if you see an edit button on a page, you can edit it").
- Its own FAQ lists "Electronic resources regardless of device or media" as valid books, and each format is a separate edition. An ISBN is not required to add a book ("The presence of an ISBN does not indicate the item is a valid book").
- Records are split into a **work** (the book in its original language) and **editions** (each format or translation). A Welsh or Spanish translation is an edition under the same work. Series information sits on the work.
- Open Library links each edition to WorldCat ("find a book you can borrow from a library near you") whenever the edition carries an ISBN or an OCLC number. So an Open Library record is also a step towards library discovery (see worldcat-library-hub-discover-catalogue-visibility.md).
- Open Library's public search API (openlibrary.org) lets us check our records from the box with no login. Checked 26 Oct 2026: searches for "Cedwyn" and "Ty Mawr Llandough" return 0 records, so nothing of ours is there yet.

## How to do it (about 15 minutes per title)
1. Sign in with an Internet Archive account (the owner's account, or one he approves; no new account without his GO).
2. Search first. Never create a duplicate work or author.
3. More menu -> **Add a Book**: title, author (as printed on the title page), publisher (as printed), publication date (latest date on the copyright page), language.
4. On the edition, set the format to e-book, add page count, the description (factual, no sales language), subjects (place names: Llandough, Vale of Glamorgan, Wales, Chubut), and the cover image.
5. Add the other language editions under the same work; add the series name on the work.
6. If an edition later gets an ISBN, add it: that switches on the WorldCat link.
7. Every edit is logged in the account's editing history; record each record URL in the project workspace

## Rules and limits
- It is a catalogue, not a shop: no prices, no "buy now" text, no promotional wording in the description.
- Do not upload the e-book file. Open Library lends Internet Archive scans; our files stay on our own /ebooks/ links.
- Keep the author and publisher names exactly as on the title pages, so other catalogues and AI answers match them.

## Evidence (what was read)
- openlibrary.org (read in full, last edited 1 Jul 2026): add-a-book steps, valid formats incl. electronic resources, work vs edition, publication date rule.
- openlibrary.org (read in full): anyone can edit; WorldCat link needs ISBN or OCLC number; over 1.7 million public-domain books downloadable via the Internet Archive.
- openlibrary.org queries run 26 Oct 2026 15:56 GMT: 0 results for our titles.
- No practitioner case study with sales numbers was found for Open Library listings; treat it as a free discovery and metadata record, not a sales channel.

## How we apply it to Cedwyn
- **Fit: medium, cost zero.** One work per volume, editions for en/cy/es, the series name on each work. Free editions qualify too: Open Library has no price field.
- **Descriptions** follow the editorial rules: Tŷ Mawr's first record mention found is the 1824 David Stewart survey; 1667 is the family's acquisition of Tŷ Mawr, cited to the 1974 newspaper reports (Mary Williams' statement) and ITV News 1988. No Bute dates before 1824. None of the banned public words. The owner is never named unless his name is printed on the title page as author, and that is his call.
- **Owner steps:** approve the account and the author/publisher names to use. Tab then drafts all records in the project workspace for his GO before anything is entered.
- **Next:** once ISBNs exist (owner spend decision, see uk-plr-ebook-library-loans.md), add them so each record links to WorldCat.
- Never Draft2Digital.

## Sources
- openlibrary.org
- openlibrary.org
- openlibrary.org