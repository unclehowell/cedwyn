# UK Parliament e-petitions: 10,000 = a written Government answer you can cite

Topic: petition.parliament.uk as a route to an on-record UK Government response on reserved matters (land registration, courts, national archives policy), and as a free JSON watch feed. Harvested 2026-10-30. Pairs with senedd-petitions-watch-gate-devolved-heritage.md (devolved matters).

## The rules (primary: petition.parliament.uk, read 2026-10-30)
- British citizens and UK residents can create and sign. 5 supporters needed before moderation (max 21 can sign before publication).
- Open for **6 months**.
- **10,000 signatures → a written response from the responsible Government department**, published on the petition page.
- **100,000 → considered for a Westminster Hall debate** by the Petitions Committee.
- Must ask a clear action of the UK Government or Parliament on something they are responsible for (not local councils, not devolved matters). Petitions started elsewhere get no response or debate.
- Same family of standards as the Senedd: no active court cases, no accusing identifiable people, no defamatory/false statements, no adverts, no duplicates.

## The numbers (live JSON, pulled 2026-10-30; counts from page totals × 25, so approximate)
- This Parliament's site (since July 2024): ~2,200 open, ~9,000 rejected, ~425 with a Government response, ~75 debated. Rejection is the normal outcome; a response is rare (well under 5% of submissions).
- Heritage case study: #732726 "Review protections for important trees: amend Forestry Act & list heritage trees" opened 4 Aug 2025, crossed 10,000 on 3 Dec 2025 (4 months), closed 4 Feb 2026 at 11,714 (11,636 UK), Defra response 5 Feb 2026. Lesson: a niche heritage ask can clear 10k, slowly, and the answer arrives near the close date.
- #716686 cask ale as Intangible Cultural Heritage: 41,026, response received. #771799 keep the Bayeux Tapestry: 38 signatures — topical is not enough without an organised audience.
- JSON per petition: signature_count, response_threshold_reached_at, government_response (summary + details), signatures_by_country / by_constituency / by_region.

## How to do it
1. **Watch**: `skills/tools/petitions_watch.py --terms "land registry,heritage,archive,national archives,public records"` (stdlib, read-only). UK site search uses the q= parameter; the tool pages up to 8 pages per term.
2. **Harvest responses as sources**: a department's published petition response is a citable, dated statement of policy (e.g. on public records access, land registration, heritage listing). Catalogue it like any other primary document and quote it verbatim with its date.
3. **Piggyback**: an open petition that aligns with a public-interest theme can be cited neutrally in a post; the moment it crosses 10k or gets its response is a fresh dated hook.
4. **Only consider starting one** with a broad, policy-level, forward-looking ask (e.g. "publish historic HM Land Registry first-registration files older than X years via The National Archives"), no case, no person, no party; an audience plan that can reach 10,000 inside 6 months; and the project lead's explicit GO.

## How we apply it to Cedwyn
- Reserved-matter questions in the project (HM Land Registry practice, public records release) belong here, not on the Senedd site.
- Never a petition about Great House Farm, BP Properties v Buckler, or any named body's conduct: it fails the standards and reads as an accusation. Policy-level asks only, and only on the project lead's GO; draft lives as a proposal in QUEUE-after-framing.md first.
- Weekly watch output → growth-report notes; any Government response on public records or land registration → catalogue candidate (CATALOGUE_CANDIDATES.json) and a neutral blog post linking the petition page.
- Realism: Cedwyn's current list sizes cannot reach 10,000 alone; the value now is the watch + citing responses, not originating.

## Sources
- petition.parliament.uk (rules, thresholds) — read 2026-10-30
- petition.parliament.uk (page counts) — pulled 2026-10-30
- petition.parliament.uk (heritage trees case, Defra response) — pulled 2026-10-30
- petition.parliament.uk and /771799 (contrast cases) — pulled 2026-10-30