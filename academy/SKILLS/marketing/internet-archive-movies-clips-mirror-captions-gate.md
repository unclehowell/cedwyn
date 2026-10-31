# Internet Archive "movies" items for the Shorts and documentary clips: a permanent public copy, sized honestly, and a gate

Skills harvest, 31 Oct 2026 ~10:58Z. Zero budget. Separate from internet-archive-texts-free-edition-discovery.md (that file covers the free e-book as a texts item; this one covers video items). Status: PROPOSAL, needs the owner's OK because it creates a new public account/item set.

## What the platform gives (primary, read 31 Oct 2026)
- Free account; you may upload movies you hold the copyright to or that are public domain (help.archive.org "Movies and Videos - A Basic Guide").
- Upload the highest-quality source you have; the Archive's deriver makes smaller streaming copies itself. Do not hand-tune the encoding: "the more the settings have been manipulated, the less likely" the deriver can process it. No zips/rars/password files (moderators may remove them).
- No HD derive today; the original file stays downloadable under DOWNLOAD OPTIONS.
- Captions: upload `IDENTIFIER.srt`; for more than one language add the language to the name, e.g. `IDENTIFIER_english.srt` (help.archive.org "Movies and Videos - Tips & Troubleshooting"). Our cy/en/es subtitle files map straight onto this.
- Embeds: Share icon gives an embed URL; `?start=SECONDS` deep-links into a clip (same Tips page). No end time.
- Licence is set per item (Creative Commons logo shows on the item page). Without your own collection, video goes into Community Video (archive.org).
- Only public stat is "views" (one per item per IP per day; see the texts skill). Description links render rel="ugc nofollow" (measured 30 Oct in the texts skill): a click-through route, not an SEO backlink.

## What views to expect (our own count, archive.org advancedsearch API, 31 Oct 2026 10:57Z, 100 newest items each, field = views)
| query (mediatype:movies) | items found | median | p25 | p75 | max |
|---|---|---|---|---|---|
| subject/title Wales or Welsh AND history | 284 | 16.5 | 10 | 60 | 8,840 |
| subject/title Glamorgan, Cardiff, Penarth | 2,935 | 13.5 | 1 | 42 | 314 |
| subject "local history" | 680 | 13 | 7 | 27 | 223 |
Read: plan for **tens of views per clip over its lifetime**, about the same as Dailymotion (see dailymotion-vimeo-mirror-shorts-measured-gate.md: median 21 for "welsh history"). Many Glamorgan/Cardiff hits are TV-news captures and football, so the niche is not crowded with similar archive films.

## Why it can still be worth doing
1. **Permanence and citation.** An archive.org item has a stable identifier, the original file and captions, and is the kind of link librarians, Wikipedia editors and Wikimedia Commons users already trust. YouTube clips can be held or removed; an IA copy is the fallback.
2. **Same-day public copy when the YouTube upload limit is spent** (P-032 in the problems queue): the clip is public on archive.org that day and the YouTube upload follows later.
3. **Embeddable on Cedwyn with captions**, no ads, no recommended-videos wall of other channels.
4. Search inside archive.org: titles, subjects and descriptions are indexed; multilingual captions add searchable text.

## How to do it well (checklist)
- One item per clip; identifier lower case with dashes, 5-80 chars, stable (`cedwyn-short-1907-tithe-map`), never renamed.
- Title = the clip's real title; Creator = "Cedwyn" (never a family name); Date = the date of the record shown, plus upload date in the description.
- Description: 2-3 plain sentences on what the record is, the archive reference/source line, then one link to the matching Cedwyn record page (free page, not /ebooks/).
- Subjects (up to 10): Llandough, Leckwith, Glamorgan, Vale of Glamorgan, Wales, local history, Welsh history, plus the record type (tithe map, census, estate map).
- Language set; licence chosen deliberately (CC BY-NC is the usual heritage choice; only for clips whose images we hold rights to — see archive-image-permission-terms-ai-animation-paid-versions.md).
- Upload `IDENTIFIER_welsh.srt`, `IDENTIFIER_english.srt`, `IDENTIFIER_spanish.srt`.
- Batch: the free `internetarchive` Python library / `ia` CLI (open source, a few MB) can upload with metadata from a CSV. Not installed (disk under 1 GB); install only after the owner gives a GO and disk is above 2 GB.

## Gate
- Pilot: 5 clips that are already public on YouTube and fully rights-clear.
- At 90 days keep going only if the median pilot item passes **25 views** OR archive.org sends **5+ tagged visits a month** to Cedwyn (link with `?utm_source=archive.org&utm_medium=referral`). Otherwise stop uploading new clips; leave the pilot items as the permanent copies.

## How we apply it to Cedwyn
- PROPOSAL for the owner (account creation = new public channel). Once approved: pilot 5 Shorts already cleared for YouTube, cy/en/es captions, Creator "Cedwyn", description link to the free record page only.
- Use the IA copy as the embed on record pages where a clip has no YouTube upload yet (quota days).
- Public text follows the editorial rules: no family names, none of the banned words, nothing about holdings or addresses, Llandough Farm is not Great House Farm. Clips HELD from YouTube stay held here too.
- Log uploads and views in the project workspace; the Sunday growth report reads them.

## Sources
- help.archive.org (read 31 Oct 2026)
- help.archive.org (read 31 Oct 2026)
- archive.org (Community Video collection)
- archive.org (our counts above, 31 Oct 2026 10:57Z)
- internet-archive-texts-free-edition-discovery.md (views definition, nofollow measurement, 30 Oct 2026)