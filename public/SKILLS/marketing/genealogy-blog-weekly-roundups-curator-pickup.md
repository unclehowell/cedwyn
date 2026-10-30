# Genealogy blog weekly roundups: getting a story post picked (Best of the Genea-Blogs and peers)

Harvested 30 Oct 2026 (skills harvest, a worker). Topic: free referral traffic and backlinks from weekly curated link-lists that family historians read. 'geneablog', 'genea-musings', 'roundup curator' had 0 skill hits before.

## What exists (read 30 Oct 2026)
- **Best of the Genea-Blogs** by Randy Seaver (Genea-Musings, weekly since about 2008, still running: editions dated 4-10 Oct and 18-24 Oct 2026). His stated criteria, verbatim: "I pick posts that advance knowledge about genealogy and family history, address current genealogy issues, provide personal family history, are funny or are poignant. I don't list posts destined for most daily blog prompts or meme submissions ... or my own posts." He reads "posts from over 900 genealogy bloggers using Feedly, but I still miss quite a few", and asks readers: "Did I miss a great genealogy blog post? Tell me!" The 4-10 Oct edition listed 15 posts plus 4 other roundups.
- **The other weekly roundups** named in that edition: The Chiddicks Observer (Paul Chiddicks, UK, Family Tree Magazine columnist; Substack, edition 75 at the time of reading, also posted to Bluesky), Friday's Family History Finds (Linda Stufflebean), Crème de la crème (Gail Dever, Genealogy à la carte, Montreal), GenStack (Robin Stewart, Genealogy Matters).
- What got picked that week: concrete method posts ("Record Every Clue"), a single-ancestor story ("Introducing Susanna"), a record-type explainer (pension full-text search), "Genealogy without a Subscription". Titles name the person, place or record.

## The mechanics that decide inclusion
1. **The curator must be able to find the feed.** Seaver works from Feedly. A site whose homepage has no RSS autodiscovery tag and that Feedly's search does not know is invisible to him.
2. **The post must be a story or method, not a product page.** Shop and price posts are excluded by the criteria above.
3. **The title must say what it is.** In a list of 15 titles, "Great House Farm" tells a reader nothing; "The 1939 tenancy form a bank cashier witnessed" does.
4. **Being picked once tends to repeat:** the same blogs recur across editions because curators keep good feeds in their readers (observed across the Oct editions; not a measured rate).

## Checks we ran on Cedwyn today
- cedwyn.bucklerfamily.estate and /blog/atom.xml: live, 14 items, daily posts.
- **But the titles are generic:** 30 Oct "Tŷ Mawr", 30 Oct "Great House Farm", 29 Oct "Great House Farm", 28 Oct "Great House Farm". No curator can pick these from a list.
- **The homepage has no feed autodiscovery `<link rel="alternate">`.** /ebooks/ does (RSS, Atom, JSON Feed for the blog).
- **Feedly feed search for "cedwyn.bucklerfamily.estate" and "bucklerfamily.estate" returned 0 results** (feedly.com).
- /feed.xml (the site-wide Atom) is mostly shop items (bundle £31.99, £0.00 Legal Wiki edition), which the criteria exclude.

## Playbook
1. Add the blog's RSS/Atom autodiscovery `<link>` tags to every page head, homepage first (markup only, zero risk).
2. Give every blog post a specific, human title: person + place + year or record. Pattern: "<who/what> in <place>, <year>: <the finding>". Never just the farm's name.
3. Once a week, one post shaped for these curators: a single record read closely (what it states, how to find a similar one at Glamorgan Archives or TNA), or a single ancestor's story told from the documents. 600-1,200 words, one image of the record, sources at the foot, no price in the body, one quiet e-book line at the end.
4. Tag posts genealogy / family history / Wales / Glamorgan so feed readers' topic search can see them.
5. Telling a curator about a post ("Did I miss a great post? Tell me!") is contacting a person: the project lead's GO only, from his own address, at most one tip per curator per month and only for a post that clearly meets the stated criteria.
6. Measure with a per-roundup redirect where we control the link, otherwise Cloudflare referrer counts for geneamusings.com, substack.com and genealogyalacarte.ca.

## How we apply it to Cedwyn
- **ONPAGE task (for the Wednesday on-page flywheel or the architecture worker; markup only):** feed autodiscovery tags in the homepage and all theme heads.
- **Blog task (cedwyn-blog Worker owner):** title template change from the place name to a specific finding, and a weekly "one record, read closely" post. Good first candidates we already hold: the 18 May 1939 printed tenancy form and its witness; the names of Tŷ Mawr (Enwau); the Nov 1925 quarry-plant auction record (Glamorgan Archives DSA/12/4888). Each must pass the editorial rules (neutral, no banned words, never name the project lead, "not checked" where unchecked, Llandough Farm is not Great House Farm, no family holdings or addresses).
- **Proposal for the project lead (one line, only after two good posts exist):** "Want me to draft a one-line tip to the weekly genealogy-blog roundups about our 1939 tenancy-form post? You'd send it yourself."
- Why this fits the visitor problem: these roundups go to thousands of active family historians every week, cost nothing, and leave a permanent backlink; the barrier is our titles and feed discoverability, both of which we can fix without spending or contacting anyone. Readership size per roundup: not checked.

## Sources
- geneamusings.com (read in full, 30 Oct 2026: criteria, 900 Feedly blogs, list of picks and other roundups)
- geneamusings.com (snippet: about 950 blogs in Feedly)
- chiddickstree.substack.com (snippet: The Chiddicks Observer, edition 75)
- genealogyalacarte.ca (snippet: weekly Crème de la crème)
- Cedwyn checks: cedwyn.bucklerfamily.estate /blog/atom.xml, /feed.xml, homepage and /ebooks/ head tags; feedly.com (all fetched 30 Oct 2026 ~16:12Z)