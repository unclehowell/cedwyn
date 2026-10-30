# Senedd petitions: watch, piggyback, and a strict gate before starting one

Topic: Welsh Parliament e-petitions (petitions.senedd.wales) as (a) a free, dated news hook and community-signal feed for Welsh heritage stories and (b) a possible campaign route, gated by the Senedd's own rejection rules. Harvested 2026-10-30.

## The rules (primary: petitions.senedd.wales, read 2026-10-30)
- Only people/organisations with a Wales address can create one; 2 supporters needed; published bilingually after checks. Online signers verify by email; one signature per person.
- 250 signatures: the Petitions Committee reviews it (can write to the Welsh Government, take evidence, invite the petitioner, refer to another committee, run an inquiry).
- 10,000 signatures: the Committee *considers* asking for a Chamber debate, weighing urgency and the **proportion of signatures from Wales**. Threshold was raised from 5,000 to 10,000 in July 2020 (BBC, 10 Jul 2020).
- Rejected if it: is about a council matter (**planning decisions included**), a UK Government/Parliament matter, or an independent body's act; refers to a case **active** in UK courts; accuses an identifiable person or organisation of a crime; contains potentially false/defamatory statements; names officials below senior management; promotes a product/service; duplicates an open petition (or one closed < 1 year ago).
- Petitions from other websites are not accepted.

## The numbers (live JSON, petitions.senedd.wales, pulled 2026-10-30)
- 260 petitions in the feed: 111 open, 89 rejected (34%), 31 closed, 29 completed.
- Rejection codes: irrelevant (not Senedd/WG responsibility) 34, insufficient 30, duplicate 14, withdrawn 4, appointments/resignations 3, already happening 3.
- Of 171 published, 104 (61%) passed 250; only 11 (6%) passed 10,000.
- Case study, heritage: #246088 "Increase, don't cut, funding for the National Library, Amgueddfa Cymru and the Royal Commission" opened 19 Feb 2024 09:33, passed 250 at 15:25 the same day (~6 h), passed 10,000 on 17 Apr 2024 (~2 months), closed 14 May 2024 at 12,075 signatures, 8,592 from Wales (71%), 2,102 from England. Shows the heritage audience (NLW, Amgueddfa, RCAHMW users) mobilises fast when institutions push it.
- Each petition's JSON carries signatures_by_country and signatures_by_constituency (Senedd 2026 constituencies) — free audience geography. Coverwales (2026) found the biggest open petition had more English (7,851) than Welsh (5,960) signatures of 15,585, which matters for the debate decision.
- Data licence: Open Government Licence v3.0 (stated on the list pages). JSON/CSV links on every list.

## How to do it
1. **Watch, weekly**: run `skills/tools/petitions_watch.py` (stdlib; covers Senedd + UK Parliament, keyword match, seen-state, alerts on 250/10,000 crossings). Default terms: heritage, archive, land registry, cadw, national library, listed building, welsh history, museum.
2. **Piggyback, not originate**: when an open petition aligns with the project's public-interest themes (archives funding, Welsh history in the curriculum — e.g. #246843 GCSE Welsh history closed at 2,744; #247101 Natural History GCSE open at 437), a neutral blog/social post can cite it as a dated development and link the petition page. That is commentary, not campaigning; no endorsement language needed.
3. **Use committee papers as sources**: petitions past 250 generate Welsh Government letters and committee evidence published on senedd.wales — primary documents for the research section's catalogue.
4. **Only then consider starting one**, and only if all of: a devolved, specific, forward-looking action (e.g. a Welsh Government policy on access to historic land/estate records held by devolved bodies); no reference to any individual, private party, court case or council decision; the project lead's explicit GO (it is an outward act in his name with his Wales address); a mobilisation plan to reach 250 in the first week (newsletter + Facebook group + partner societies).

## How we apply it to Cedwyn
- Add petitions_watch.py to a weekly read (e.g. inside the Monday visibility check); alerts go to the growth-report notes, never to the project lead directly.
- Do NOT start a petition about Great House Farm, BP Properties v Buckler, HMLR, or the council: HMLR is a UK body (reserved → "irrelevant"), council/planning matters are excluded, and anything implying wrongdoing by an identifiable party fails the crime/defamation rules. The 34% rejection rate is mostly exactly these errors.
- Good, safe uses: cite heritage-funding or Welsh-history petitions as dated hooks on the blog/Facebook (St David's Day, budget season Dec–Feb when cuts petitions open); mine signatures_by_constituency of heritage petitions to see where Welsh-history readers cluster for ad/geo targeting of the e-books.
- Any petition the project lead might want: draft the text in HubSpot as a proposal (QUEUE-after-framing.md), check it against the rejection list line by line, and wait for his GO.
- Public text: neutral, no banned words, never names the project lead.

## Sources
- petitions.senedd.wales (rules, thresholds, standards) — read 2026-10-30
- petitions.senedd.wales (live counts) — pulled 2026-10-30
- petitions.senedd.wales (NLW/Amgueddfa/RCAHMW case) — pulled 2026-10-30
- bbc.com (threshold 5,000 → 10,000, 2020) — snippet
- coverwales.com (England vs Wales signature share) — snippet, not checked
- Note: the Sixth Senedd's Petitions Committee ended with dissolution before the May 2026 election; new committees are being formed, so response times in late 2026 may lag (snippet from @SeneddPetitions, not checked).