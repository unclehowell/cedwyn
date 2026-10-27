# Release notes for versioned e-books and art (what changed, why it is worth the next price)
Harvested 2026-10-27. Companion to versioned-release-rising-price-ladder.md: the project lead set whole-release semver today (v0.0.1 free, each release +£4.99). A rising price per version only sells if each version visibly states what it added.

## Practitioner practice
- **Leanpub** (help centre, 2022-2023; blog 22 Apr 2026): on each publish an author can tick "Notify your readers" and write Release Notes; readers opt in and can opt out. Leanpub's own guidance: "Most readers love this feature, especially for in-progress books", but use it ONLY for significant new content - not typos, never product offers. Its new Release History page (Apr 2026) keeps every version's date, release notes, reader count at the time and stated completeness.
- **Keep a Changelog 1.1.0** (the convention most software projects follow): for humans, not machines; an entry for every version; latest first; date on each; linkable versions; say you follow Semantic Versioning; group changes as Added / Changed / Deprecated / Removed / Fixed / Security; keep an "Unreleased" section on top so the next release's notes build up as you work.
- **Steam (Valve's Steamworks docs)**: a "Major Update" event shows on the store page, community hub and Library, and Update Visibility Rounds show the update to people who own OR wishlist the game - i.e. the update itself is the marketing moment for both buyers and waiters. Patches use a quieter "Small update" type. Same split works for us: major = email; patch = page only.
- Numbers: no measured uplift figure for release notes found this run; the case rests on the Leanpub/Steam mechanics. Don't quote a percentage.

## How to write one (template)
```
v0.0.3 - 14 Nov 2026 - £9.98            (latest first, date, price)
Added:   Ch. 7 "The 1955 order" (12 pages, 9 new record images)
Changed: Timeline corrected for 19 Sep 1974 (leave to enforce)
Fixed:   34 typos; broken figure links in Ch. 3
Why it matters: one sentence on what a reader now knows that v0.0.2 did not.
Free version (v0.0.1 2026) remains available.
```
Rules: concrete counts (pages, records, images); one "why it matters" line; no hype words; patch-level fixes roll into the next minor note, not their own email.

## Semver meaning for books/art (pick and publish it)
- PATCH (0.0.x): corrections, typos, image fixes - no email.
- MINOR (0.x.0): new chapter / new record set / restored image set - email to the version list.
- MAJOR (x.0.0): restructure or new edition.
(the project lead's current ladder bumps PATCH per release; if each release adds a chapter, the publicly stated meaning should say so. Flag for the project lead, not changed here.)

## How we apply it to Cedwyn
1. Each e-book page: a "What's new in each version" block under the version drop-down, newest first, built from one `releases.json` per book (version, date, price, added/changed/fixed, why). Same file can drive the drop-down, so price and notes never disagree.
2. Keep an "Unreleased" list per book in the repo; the bizdev/programme-office runs append to it as chapters land; publishing moves it under the new version.
3. Email only on MINOR-or-bigger releases, to the Mailchimp tag for that book (buyers and notify-me signups), with the release note as the body and the free v0.0.1 link kept in the footer; never for typos.
4. NFTs: each piece's version history (v0.0.1 original, v0.0.2 restored without flowers on buildings) shown as a two-line note under the "Coming soon" button; good "before/after" content for social.
5. Atom feed (rss-atom-feed skill): one entry per release, so feed readers and WebSub carry each version.
6. Wording passes the editorial rules (no banned words, never name the project lead).

## Sources
- help.leanpub.com (read 27 Oct 2026)
- help.leanpub.com (in-progress book release notes; read 27 Oct 2026)
- leanpub.com (22 Apr 2026)
- keepachangelog.com (read 27 Oct 2026)
- partner.steamgames.com ; partner.steamgames.com (search snippets; pages need sign-in, not read in full)