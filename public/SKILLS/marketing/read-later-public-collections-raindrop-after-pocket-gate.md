# Read-later and public bookmark collections (Raindrop.io, Readwise Reader) after Pocket and Omnivore closed — GATE

Date: 2026-10-31 · Status: GATE (new account needed = PROPOSAL; on-site part is free and ours)

## The landscape in 2026 (facts with sources)
- **Pocket is gone.** Mozilla shut Pocket on 8 Jul 2025; exports ran to 8 Oct 2025, later extended to 12 Nov 2025, after which data was deleted (Reddit r/firefox announcement thread and web-highlights.com, search previews). Pocket's public "Collections" and its Firefox new-tab recommendations, once a real traffic source for long reads, no longer exist.
- **Omnivore is gone** (team joined ElevenLabs; data deleted 15 Nov 2024; several sources, previews).
- **Raindrop.io** (free tier) turns any collection into a **public page** at username.raindrop.page/collection, nested collections included; visible tags; and Raindrop's own help page states public pages **are accessible to search crawlers and may appear in search results** (read 31 Oct 2026). Public pages need a verified email. Collections can be **embedded** as a live widget on any site (free tier, help page read).
- **Readwise Reader** (paid app) can make a public link to one saved document with the saver's highlights and notes (Readwise docs, preview).
- A sample raindrop.page fetch from this box returned a 403 bot page carrying noindex,nofollow, so whether outbound links on real public pages are followed was **not checked**.

## What this means for a small heritage site
1. **No big read-later feed is left to pitch.** Pocket's curated recommendations were the only read-later surface with editorial reach. Don't spend time looking for a replacement "submission" route; none exists in Raindrop or Readwise.
2. **What remains is reader-made.** Readers who save a page to Raindrop/Readwise/Instapaper/GoodLinks get the article through a "reader view" parser. A page that parses cleanly (one H1, real <article>, byline, date, og:title/og:description/og:image, no text locked in images or scripts) is saved, highlighted and shared as a public link with our title on it. A page that parses badly is saved as an empty shell and never shared.
3. **An owned public collection is a small backlink/discovery page, not a channel.** A "Cedwyn: sources on Llandough, Leckwith and Great House" Raindrop collection pointing to our own pages is indexed (per Raindrop) but carries low authority. Its value is as a tidy, shareable reading list for local-history groups, not traffic.

## How to do it
- **On-site (free, now):** test the six most-read Cedwyn pages in a reader-view parser (Firefox Reader View or Safari Reader by hand, or a Readability script if one is ever installed under the disk rule). Fix: the title and the first paragraph must come through; dates and source lines must survive; images need alt text so a reader view shows captions.
- **Do not embed** a Raindrop widget on Cedwyn: Cedwyn's rule is internal links only, and an embed is a third-party script plus outbound links.
- **Person-owned PROPOSAL:** if the owner wants a public reading list, he opens a free Raindrop account (Tab opens no new accounts), creates one collection of 10–20 Cedwyn pages with plain-language notes and place-name tags (Llandough, Leckwith, Cogan, Penarth, Glamorgan), and links to it from his own social profiles. Kill after 8 weeks if Search Console shows no referral from raindrop.page.

## How we apply it to Cedwyn
- Add a "reader-view check" line to the next CEDWYN ONPAGE run: the six most-read pages (the ones getting the new shop link) must keep the shop line and the source line inside a reader view, so a saved copy still shows where to buy.
- Log Pocket as closed in the growth notes so no later run proposes Pocket Collections.
- No account, no spend, no outreach in this skill.

## Sources
- help.raindrop.io (read 31 Oct 2026: crawlable public pages, verified email, tags visible)
- help.raindrop.io (read: live widget, free, Hide field only)
- reddit.com (Pocket shutdown, preview)
- web-highlights.com (extension to 12 Nov 2025, preview)
- web-highlights.com (Omnivore 15 Nov 2024, preview)
- docs.readwise.io (Reader public links, preview)