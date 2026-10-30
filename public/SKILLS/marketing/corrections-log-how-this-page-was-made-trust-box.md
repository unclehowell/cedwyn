# Corrections log + "how this page was made" box (trust signals for a records-led history site)
Harvested 2026-10-30 01:12Z (skills harvest). Index before: 'corrections policy' 0, 'editorial policy' 0, 'methodology' 0 (the /editors/ ProfilePage + bylines skill is separate: organisation-byline-editors-profilepage-how-made.md).

## What the evidence states (read = page fetched and read this run)
- **"Explain your process" box works when it sits in the story.** Center for Media Engagement + Trusting News (blog 27 Mar 2019, read): a box saying how and why the story was done, where the information came from and how fairness was handled lifted perceptions on 11 of 12 trust items (reputable, informative, trusted, credible, integrity, fair, transparent, reliable, accurate, unbiased, whole story). Only "does not have an agenda" did not move. A "demonstrating balance" box (link to the other side) had effects too small to matter. Peer-reviewed write-up: Masullo et al. 2022, three experiments n=753/599/321 (tandfonline abstract, snippet).
- **But a box people do not notice does nothing.** Same centre with three McClatchy papers (Nieman Lab 30 Jan 2020, read): n=321 real readers; only 33.7% remembered the box when it sat inside the story text, 21.2% when at the bottom (difference not significant), and trust ratings did not change. McClatchy UX lead: readers skip "elements outside the story body, especially non-text-based elements that can be confused with advertising". Shown on its own, most readers said such a card would raise trust. Also: only 6.7% of people surveyed think news sources explain enough about how and why they choose stories.
- **Trust Indicators raised trust in a UK title.** The Trust Project FAQ (read): Reach plc found trust in The Mirror rose 8% across two surveys after adding the 8 Trust Indicators (best practices/standards, expertise, type of work, citations and references, methods, locally sourced, diverse voices, actionable feedback); a CME experiment found higher reputation, trustworthiness and reliability ratings with the indicators present. (The Trust Project is the publisher of these numbers; treat as practitioner-reported.)
- **Corrections: you take the trust hit either way, so correct yourself.** Nyhan et al., "The Corrections Dilemma" (J. Experimental Political Science; Nieman Lab 27 Mar 2023, read): n=2,862. Corrections improved belief accuracy; corrections from the outlet itself beat third-party corrections on accuracy; either kind lowered trust in the outlet. Nyhan: "you're going to take the hit anyway, but the audience will be less well-informed if you don't admit error yourself." Gillmor's fix: explain what happened in detail, and give readers a tool to report errors.

## The playbook
1. **One methods line in the body, near the top**, plain text (not a grey sidebar card, not an image): "How this page was made: built from [N] catalogued records ([record IDs link to evidence pages]); dates checked against [catalogue]; open questions listed at the end." Use `<details>` for the long version, but keep the first sentence visible.
2. **A site-wide /corrections/ page**: dated log, newest first: date, page, what was wrong, what it states now, what record fixed it. Never silently edit a dated fact on a records page; add a one-line "Corrected [date]: ..." note under the changed line and a log row.
3. **"Spotted an error?" link on every evidence, timeline and e-book page** going to one short form or address. Each report becomes a HubSpot task; reply within 7 days with the outcome.
4. **Publish standards once**: what counts as a source, how records are catalogued, how AI-assisted reconstructions are labelled, how corrections work. Mark it up as the organisation's publishingPrinciples / correctionsPolicy (schema.org Organization properties; check the property list on schema.org before shipping).
5. **Measure what you can at small traffic**: count reports received, time to fix, and clicks on the methods `<details>` (GA4/GoatCounter event). No A/B test on trust at our volume; this is a standards practice, not a conversion test.

## How we apply it to Cedwyn
- Evidence pages already link to catalogued records (house rule: no inline citations). Add the one-line "How this page was made" sentence at the top of each /research/timeline/ entry, evidence page and /ebooks/ book page, generated from the record IDs the build already has (template change in the build tooling, so new pages inherit it).
- Create /corrections/ (cy + en headings) seeded with real past fixes we already made (e.g. the dartboard video address fix is not a content correction, so leave it out; use dated content changes from the research cycles and the Change Log). Link it from the footer and from /academy/ for agents.
- "Spotted an error?" goes to a Tab mail address ([address kept in the project workspace]) or a simple form; the email-ingest flywheel turns each report into a HubSpot "[CEDWYN CORRECTION]" task. Replies are drafts only; nothing sent without the normal rules.
- Wording rules apply to the box and log: never name the project lead or private people; none of the banned words (write "the record shows" / "not checked" instead); neutral, dated, record-led. For the documentary and reconstructions, the methods line states "reconstruction based on records [IDs]; dialogue imagined" so viewers can tell evidence from dramatisation.
- Why it matters for sales: a sceptical reader of a contested local history needs to see how the work is done before paying £4.99; e-book pages carry the same methods line plus a link to /corrections/.
- Status: PROPOSAL for the onpage / site flywheel (template edit on an existing page needs the normal commit rules and repair-freeze check). Zero spend.

## Sources
- mediaengagement.org (read)
- niemanlab.org (read)
- thetrustproject.org (read)
- niemanlab.org (read)
- tandfonline.com (abstract snippet, not read)
- trustingnews.org (403 from the box, not read)