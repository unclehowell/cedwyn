# Perlego (academic e-book subscription) via a distributor: reaching students who study the case

Harvested 30 Oct 2026 (skills harvest). 'perlego' had 0 hits in INDEX.md before this run. Everand, BorrowBox and the PublishDrive-vs-D2D decision are already covered; this skill covers the academic subscription shelf.

## What it is (primary pages read)
- **What Perlego is.** A London-founded subscription library for students and professionals with "over 1 million" titles (help centre, 12 Aug 2026; the homepage assertions 1.5M). It has two plans:
  - **Essential** is a limited selection, $12/month on the pricing page snippet.
  - **Complete** is the full catalogue.
  - Billing can be monthly, semesterly or annual, and 250+ institutions buy seats.
- **Who decides where a title goes.** The publisher decides which plan a title sits in and which regions it is sold in (help article "How does book access work").
- **How publishers are paid.** Perlego "pay[s] 65% of every subscription fee to the publisher". The pool is split by reading, and a book read across several months earns in each of them (help article "How Perlego works with publishers", 15 Oct 2025). Perlego handles its payouts to 10,000+ publishers through a vendor called Light (search snippet).
- **No self-serve portal.** Indies get in through aggregators, and Perlego vets each title for academic or professional relevance. Fiction is not accepted (ScribeCount, Randall Wood, 24 Jun 2026, read).
- **Routes in:**
  - **PublishDrive** lists Perlego on its stores page (snippet). Its partnership post (read) calls it "the Spotify of textbooks" with a percentage of the subscription "based on how much of the book is read". Perlego lists books under the "PublishDrive" imprint in 2026 (snippet).
  - **StreetLib** lists Perlego among its distribution partners (snippet). Its Basic plan is free forever, ebook only, 70% of net, non-exclusive per channel. Pro is $99/yr for 85% (StreetLib blog, read). StreetLib assigns a free ISBN within 12 hours (max 5/day, 100 total) (StreetLib help, read). **Not checked:** whether Perlego is switched on for the Basic plan; the blog notes Basic excludes Amazon and "major retailers".
  - **PublishDrive's free plan** reaches only Apple, B&N and Kobo (our own PublishDrive file). Perlego there means the Starter plan at $16.99/mo, which is spend and needs a GO.

## Numbers and testimony
- There are no per-read payout figures from indies in public sources. Perlego publishes the 65% pool share, not a per-page rate. Treat any income estimate as **not checked** until a statement exists.
- ScribeCount's practitioner guide (2026) lists the common indie mistakes:
  - never enabling Perlego because it's unfamiliar;
  - sending fiction;
  - loose BISAC categories, which hide the book from institutional search;
  - not tracking the channel separately.
  It frames academic distribution as "a distinct income stream that requires its own optimization".
- **Library-platform reach.** Tortora (library distributors, read, 2022, US-centric) maps which aggregators serve which library platform:
  - EBSCOhost (academic) only via IngramSpark;
  - OverDrive via D2D, IngramSpark, Kobo, PublishDrive and StreetLib.
  Use this as the map for the institutional side beyond Perlego.

## How to do it
1. **Check fit.** Non-fiction with a citable academic use: law, history, Welsh studies, archaeology. Perlego rejects entertainment titles.
2. **Pick the route.**
   - First, StreetLib Basic, which is free, *if* the Perlego toggle exists on Basic. Check in the dashboard before upload and record the answer here.
   - Otherwise PublishDrive Starter, which is paid and needs a GO.
   - Keep one aggregator per channel, so the same title never reaches Perlego twice.
3. **ISBN decision.** A StreetLib free ISBN names StreetLib as the registrant. Our BorrowBox/PLR file points at buying our own Nielsen ISBNs, which unlock several gates at once. Decide the ISBN once, before the first wide upload.
4. **Metadata for academic search:**
   - precise BISAC/Thema subjects;
   - a subtitle that names the legal topic and jurisdiction;
   - a table of contents with section headings students search for;
   - a references section;
   - a publisher name and publication date.
5. **Price/plan.** Choose Complete (full catalogue), unless the distributor offers no choice. Set regions to worldwide.
6. **Track.** Log the reads/revenue line monthly in the buyers ledger as a separate channel. Re-check after 90 days: if there have been zero reads, rewrite the subtitle and categories once before giving up.

## How we apply it to Cedwyn
- **The academic hook is real.** *BP Properties Ltd v Buckler* (1987) is a Court of Appeal adverse-possession authority that land law students meet in textbooks and casebooks. A well-sourced e-book on the case's background, dates and records fits Perlego's law/history shelf better than any retail store.
- **What to submit.** Only the e-book edition(s) already on sale at /ebooks/ (v0.0.2 £4.99; the bundle stays a Cedwyn exclusive). Our own site stays the primary buy path.
- **Gates (all PROPOSALS for the project lead's GO, logged in the project workspace):**
  1. Distribution beyond our own shop is a new public channel.
  2. Any paid plan is spend.
  3. The ISBN choice (free StreetLib vs own Nielsen).
  4. Rights: confirm no image or record in the e-book carries a licence limited to our own site.
- **Public text.** Description and metadata in neutral third person; never name the project lead; none of the banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken); nothing about family holdings or addresses; frame the case as the reported decision plus the records, not an argument.
- **Measure.** One `channel=perlego` line in buyers-ledger.csv per monthly statement. It rides the Sunday growth report.

## Sources
- help.perlego.com (read; 65% of subscription fee, 15 Oct 2025)
- help.perlego.com (read; plans, publisher sales rights, 12 Aug 2026)
- perlego.com (read; plan names; $12/mo Essential figure from snippet)
- scribecount.com (read; access via PublishDrive, vetting, mistakes, 24 Jun 2026)
- publishdrive.com (read; partnership, read-share model)
- publishdrive.com (snippet; page is script-rendered)
- streetlib.com (snippet lists Perlego) ; blog.streetlib.com (read) ; help.streetlib.com (read; free ISBN)
- danieljtortora.com (read; library platform -> aggregator map)