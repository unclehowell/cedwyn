# Library e-lending direct: OverDrive/Libby through Kobo Writing Life (no aggregator)

Harvested 26 Oct 2026 (skills harvest 15:23). Zero spend. Never Draft2Digital.

## Why it matters (numbers)
- OverDrive's 2025 lending report (21 Jan 2026): 820.5M digital checkouts through Libby/Sora (+10% YoY); ebooks 379.4M (+3%); public-library checkouts 737.6M. More than 200 library systems passed 1M checkouts each.
- Indie data: the Big Indie Author Data Drop put library sales at 9.7% of indie unit sales in 2021 and 11.3% in 2022 (search snippet, not re-read in full). Daniel J. Tortora (nonfiction editor/historian) puts library income at about 10% of the earnings of the authors he interviewed.
- Libraries are a discovery channel: patrons borrow unfamiliar authors because a loan costs them nothing, and catalogues keep a title visible for years.
- Local fit, checked 26 Oct: the Vale of Glamorgan libraries offer BOTH BorrowBox and Libby (OverDrive) for ebooks. Penarth Library sits in that authority.

## The route (Kobo's own help page, Wayback copy 22 Jun 2025, updated 20 Dec 2024)
1. A KWL account must already exist (owner step; see free-epub-storefronts-kobo-itch-books2read.md). OverDrive opt-in is per title, on the title's **Rights and Distribution** tab.
2. Set a separate **USD library price**. Kobo's advice is a few dollars above retail. The floor is $0.99. You earn **50% of the library price** with no aggregator fee, and it is paid inside the normal monthly KWL payment.
3. **Zero EPUB validation errors.** OverDrive rejects any file with errors. Run our epub_lint/epubcheck routine first (epub-editions-sphinx-epubcheck.md).
4. **Public-domain content is rejected.** Present our volumes as original analysis and commentary, with transcribed record lines quoted inside it. Do not upload a bare transcription.
5. Allow up to a week to reach the marketplace. OverDrive's public catalogue does not show every title libraries can buy, so ask [address kept in the project workspace] if you are unsure (owner sends; HubSpot draft only from us).
6. Reports: library sales show in the regular KWL sales report with the library branch, state/province and county. Log them by authority.
7. Join the OverDrive Promotions mailing list (owner email) to see library-side promotions.

## Making libraries actually buy it (demand signals)
- **Libby Notify Me** (help.libbyapp.com): a reader searches the title, taps *deep search*, then **Notify Me**. Libby alerts the reader if any of their libraries buys it. In 2023 Notify Me replaced Recommend to Library, and OverDrive presents these tags to librarians as patron-interest data. Not every library has it switched on.
- So the call to action is "Search *<title>* in Libby with your library card and tap Notify Me", not "ask your library". One line in the newsletter and on /ebooks/ once the title is live in the marketplace.
- Local-studies angle: a short HubSpot DRAFT to the library authority's stock/local-studies team, giving the title, the OverDrive availability and why it is local (one parish's records). Owner GO before anything goes out. Never mass-mail.

## Pricing rule of thumb
- Library price = retail plus a few dollars. On a £9.99 (~$13) retail volume, a $14.99–19.99 library price earns about $7.50–10 per library copy. Each library pays once (licence models vary). That is a small number of copies, but each one sits on a shelf that keeps lending.
- Keep the library price clearly separate from the retail price. Never let it undercut /ebooks/ direct.

## BorrowBox (the other Welsh app)
BorrowBox (Bolinda) has no free direct self-publisher door that we found. The common routes are paid aggregators or Draft2Digital, and both are excluded. **Verdict: skip BorrowBox. Libby via KWL is the zero-cost library route.**

## How we apply it to Cedwyn
- **Eligible:** the paid £9.99 volumes once they are on KWL. Free editions stay free on our own /ebooks/ links. Opting a free title into libraries earns nothing and adds admin.
- **Prep (Tab, no commit while another worker holds the cedwyn repo):** a clean EPUB with zero errors, en/cy/es descriptions, and a library price field proposal ($14.99) in the project workspace Owner GO to opt in.
- **Description lines must follow current rules.** Tŷ Mawr's acquisition in 1667 is cited to the 1974 newspaper reports and ITV News 1988. The 1824 David Stewart survey is the first record mention found. No Bute catalogue dates presented as Tŷ Mawr dates. None of the banned words.
- **After the title is live:** add the "Notify Me in Libby" line to the newsletter and the /ebooks/ page, and track KWL library rows per authority in the project workspace
- **Pair with UK PLR** (uk-plr-ebook-library-loans.md). PLR pays per remote ebook loan only if the edition has a real ISBN.

## Sources
- kobowritinglife.zendesk.com (live page blocks our fetcher; Wayback 20250622080304 read in full)
- company.overdrive.com
- help.libbyapp.com; company.overdrive.com (Deep Search + Notify Me launch, snippet)
- valeofglamorgan.gov.uk (BorrowBox + Libby, read 26 Oct 2026)
- danieljtortora.com; Big Indie Author Data Drop (snippet; library 9.7% -> 11.3% of units)