# Literal (literal.club): free catalogue entry, shelves and a niche club, checked through its public API

Date: 2026-10-31. Status for Cedwyn: PROPOSAL (adding books, shelves or a club needs an account; nothing created or posted).

## What Literal is (read 31 Oct 2026)
- Berlin-based reading tracker + social network + book clubs, free, no ads (literal.club/about, archived Apr 2026). Its own milestone list: invite-only launch, 25,000 users, author profiles, public launch, 50,000 users, direct messaging. No newer user count published.
- Small next to Goodreads (150M+) or Fable (3M). The value is a clean, indexed book page and an open API, not reach.
- The site sits behind a bot check, but the public GraphQL API at literal.club answers read queries with no login (tested 31 Oct: bookByIsbn returned Sapiens).

## What the API showed (live queries, 31 Oct 2026)
- getFeaturedClubs: Thriller Time 2,446 members; Readers Society 915; Manga readers 530; Cookbooks 320. The biggest clubs are a few thousand at most.
- searchClubs "history": largest is "History galore!" 186 members; "Lit(erary) Historical Reads" 13; most others 1-6.
- searchClubs "Welsh", "Wales", "local history", "genealogy", "Patagonia", "British history": 0 clubs each. An open niche, and also a sign of little demand.
- searchBookV2 "Cedwyn", "Great House Farm", "Llandough": no Cedwyn titles (only unrelated books, e.g. a Walters English-Welsh dictionary by the rector of Llandough).

## Author-side mechanics (from the API docs, archived Aug 2026)
- createBook (needs login): title, description, authors, language, isbn13, cover URL, pageCount, publishedDate, publisher, physicalFormat (hardcover | paperback | ebook | audio). Returns the new book's URL. Whether isbn13 is required was not checked; try without it.
- createShelf / addBookToShelf: public reading lists ("shelves") anyone can follow; searchShelves finds them.
- Clubs exist (clubByHandle shows membershipCount, bookCount, languages); creating a club is done in the app.
- Reviews, highlights ("moments") and comments are available by API with a token. Do NOT post reviews of our own books (self-review = a trust problem); highlights of period records from other books are fine.

## Playbook (zero spend)
1. Check: searchBookV2 each title (no login) so you do not create a duplicate.
2. Add each Cedwyn e-book once with createBook or the in-app add (physicalFormat "ebook"; description = the /ebooks/ blurb; cover = the live cover URL; publisher = the Cedwyn imprint name).
3. One public shelf: "Welsh local history: Vale of Glamorgan" with 10-20 real, in-print books plus the Cedwyn titles. A curated list reads as service; a list of only our books reads as an ad.
4. Club (optional): "Welsh local history" is an empty niche on Literal. Only start it if the shelf gets followers; one book a month; kill if under 15 members after 8 weeks.
5. Measure with the free API, weekly: book page exists, shelf followers, club membershipCount; referral clicks with utm_source=literal. A one-line Python POST is enough; no install needed.

## How we apply it to Cedwyn
- Low priority, near-zero cost: about 20 minutes once an account exists. Main gain is one more indexed, structured book page (helps search/AI visibility alongside Goodreads/StoryGraph/Hardcover listings already covered in goodreads-storygraph-listings-ebooks.md and hardcover-app-ebook-listing-author-spotlight.md).
- Needs an account on the project lead's side (or his OK to open a Cedwyn imprint account) -> proposal. Public text rules: never name the project lead; no banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken); no insignia; Llandough Farm is not Great House Farm; only Cedwyn links.
- Reading the API is safe and free now: the weekly check can be added to the growth report with no login.

## Sources
- literal.club/developers (GraphQL docs; web.archive.org capture 20260807; queries searchBookV2, searchClubs(limit, offset required), getFeaturedClubs, createBook, createShelf)
- literal.club/about (web.archive.org capture 20260407: team, milestones 25,000 and 50,000 users)
- Live API queries to literal.club on 31 Oct 2026 (results above)
- literal.club/vs/fable (search snippet only: "Literal is broader... Free to use, no ads"; page bot-blocked)