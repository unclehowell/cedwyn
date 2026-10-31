# Skill: Wikidata "described at URL" (P973) and "described by source" (P1343) pointing at our pages, done honestly
Written 31 Oct 2026 (skills harvest). Wikidata edits are outward posts. Every edit below is a PROPOSAL until the owner gives a GO, and is made from a disclosed account.

## What the properties are (read 31 Oct 2026)
- P973 "described at URL": "item is described at the following URL". Property talk: use it "to provide links to reliable external resources that are not the item's official website, when no relevant 'authority control' property exists". Usage note: if an external-ID property gives the same URL, use that instead. Google search URLs are disallowed by a format constraint.
- Scale: 4,276,703 uses (3.92 M as main statements). It is a normal, heavily used property (Property talk:P973 usage table, read).
- P1343 "described by source": for a published *work* that describes the item. This fits an e-book that has its own Wikidata item; it does not fit a web page.
- P854 "reference URL": the way to cite a page as the *source of a specific statement* (Help:Sources, read). Sources should be reliable, e.g. textbooks, journals, newspapers.

## What it does and doesn't do (honest value)
- Not a backlink. Wikidata renders P973 values with rel="nofollow" (checked on the Mona Lisa item, Q12418, 31 Oct 2026), so it passes no link equity.
- It is entity linking. Wikidata is CC0 and is reused by search engines' knowledge graphs, AI training and retrieval sets, Reasonator/Scholia, and other projects. A P973 link tells those reusers "this page is about this entity", which is the AI-visibility goal. Downstream use is not checked per tool.
- Current state (live API read, 31 Oct 2026): Llandough near Penarth (Q6661223, 23 properties), Llandough Castle (Q17744300) and the parish Llandough juxta Penarth (Q110422570) carry ZERO P973 and ZERO P1343 statements. No Wikidata item anywhere links to bucklerfamily.estate (SPARQL: 0 results).

## The rules that bind us
- Wikidata has no stand-alone COI policy: its "Conflict of interest" page only points to the WMF Terms of Use paid-contribution disclosure and two RfCs (read). The WMF terms still apply. An agent editing for the owner's project is a disclosed-relationship edit: say so on the account's user page and in the edit summaries.
- Wikipedia's COI and SELFCITE norms (see wikimedia-commons-wikidata-heritage-coi.md) are the community's yardstick for self-links. One relevant link to a page that genuinely describes the item, in the third person, is acceptable. Many links to your own site is spam and gets reverted, and can get the domain blacklisted. The blacklist is the real risk because it is shared across Wikimedia.
- "Reliable" matters. A family/estate site is self-published. It suits P973 ("described at") for entities it documents in depth with primary-source scans. It never suits P854 references for contested statements. The case material must not go on Wikidata as statements at all.

## How to do it (when GO is given)
1. Pick 1 to 3 items where our page is the deepest public description, and whose page carries scans/catalogue IDs rather than argument. Examples: the parish item, or a demolished-house item if one exists (search by name and by Coflein NPRN, P1459, first).
2. Check nothing better exists. If the page is on a site with its own ID property (Coflein, Cadw, HER), that property beats P973.
3. Add ONE P973 per item, with qualifiers: language of work or name (P407) = English/Welsh and title (P1476) = the page title. Edit summary: "adding described-at link; editor discloses affiliation with the linked site".
4. Alternatively, as the cleaner option, post the suggested link on the item's Talk page and let a regular add it. This mirrors WP:SELFCITE's "when in doubt, propose on the talk page".
5. If an e-book gets its own Wikidata item (a published work with an ISBN), it can then be P1343 "described by source" on the parish/house items. That makes a book-to-place link that reusers understand.
6. Measure: re-run the SPARQL check monthly (query below). Note reverts. If any edit is reverted, stop and do not re-add it.

SPARQL (query.wikidata.org): `SELECT ?item ?u WHERE { ?item wdt:P973 ?u . FILTER(CONTAINS(STR(?u),"bucklerfamily")) }`

## How we apply it to Cedwyn
- Today: baseline recorded (0 Wikidata items link to any bucklerfamily.estate page; target items have no P973). No edit made: Wikidata editing is an outward post on a public account.
- PROPOSAL for the owner (add to QUEUE-after-framing): one disclosed P973 on Llandough juxta Penarth (Q110422570), pointing at the Cedwyn parish/place history page (wiki or /wales/), with no shop link. Talk-page route preferred.
- Never link /ebooks/ or any shop page from Wikidata. Never add case pages, missing-records pages or anything arguing BP Properties v Buckler. Never name the owner.
- Pair with the ISNI skill (isni-orcid-author-identifiers-free-route-first.md). If the imprint gets an ISNI and a Wikidata item, that item's official website (P856) is the right home for the domain, and P973 stays for third-party entities.

## Sources
- wikidata.org (read, usage 4,276,703)
- wikidata.org ; Property:P973 via wbgetentities API (read)
- wikidata.org (read)
- wikidata.org (read: disambiguation to WMF ToU paid-contribution disclosure)
- wikidata.org (rel="nofollow" on P973 value, checked)
- Wikidata API wbgetclaims Q6661223, Q17744300, Q110422570, and SPARQL at query.wikidata.org (live, 31 Oct 2026)