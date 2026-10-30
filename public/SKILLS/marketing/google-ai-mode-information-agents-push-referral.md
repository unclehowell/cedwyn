# Google AI Mode information agents: a push referral surface ("keep me updated on…")

Harvested 30 Oct 2026. Status for Cedwyn: watch + low-cost content habits; site changes PROPOSED only (the architecture programme owns cedwyn today).

## What it is (primary + first-hand reporting, read)
- Announced at Google I/O, 19 May 2026 (Google blog "A new era for AI Search", read): "Search agents"; the first type is **information agents** that run "in the background, 24/7", look across "blogs, news sites and social posts, plus our freshest data" (finance, shopping, sports) "to monitor for changes related to your specific question" and send "an intelligent, synthesized update, with the ability to take action".
- Live **12 Jun 2026 for Google AI Ultra subscribers in all AI Mode languages and markets** (Robby Stein, VP Product Search, on X; 9to5Google, Abner Li, read). Triggered in AI Mode with "keep me updated on…" or "alert me when…"; updates arrive as Google-app push notifications; agents managed from AI Mode history.
- Stein's words: agents "send detailed updates and links to the web the moment new info is available." That **link back** is what makes it a referral surface, unlike a zero-click AI Overview.
- Google said Pro subscribers would follow "this summer"; whether that happened is **not checked** (no primary confirmation found 30 Oct). Ultra price is reported as $199.99/mo (Digital Applied) and as "$99.99 or $199.99" (9to5Google) — tiers differ by source.
- Scale: AI Mode was said to pass 1 billion monthly users at I/O 2026 (as quoted by Digital Applied, not checked against Google).

## What nobody knows yet
- **Google has not disclosed how agents choose sources.** No publisher case study with referral numbers was found. Every "agent-ready" tip below is extrapolated from AI Overviews behaviour (Digital Applied flags this itself). Treat as hypotheses.
- Agent clicks arrive as ordinary Google traffic from a notification; there is no separate referrer or Search Console filter for them (none announced as of 30 Oct).

## Playbook (low-regret, ordered)
1. **Freshness that is real.** A monitor looks for change. Pages on standing topics should carry an honest visible "Updated <date>" line and matching `dateModified`, changed only when a fact actually moves. Never bump dates without a change.
2. **One canonical page per standing topic** that gets each new development appended at the top (dated entry, 1-2 sentence lead, link to the evidence). An agent synthesising "what changed" can lift a lead cleanly.
3. **Answer-first leads.** First sentence of each update states the new fact, date and who issued it.
4. **Entity clarity.** One clear organisation/topic identity per site; disambiguate look-alike names on the page (an agent merging two similar places mis-cites both).
5. **Corroboration.** Agents synthesise across sources; facts echoed by independent credible pages are easier to include.
6. **Measure without over-claiming:** in weekly analytics, flag Google-sourced landings on standing-update pages within 48 h of a new dated entry where Search Console shows no matching query/impression rise. Log as "possible agent referral", never as fact.
7. **Test as a reader if access exists:** set one agent ("keep me updated on <topic>") from an account that has Ultra/Pro and record whether, when and how your page is linked. Requires a paid Google AI plan — never buy one for this.

## How we apply it to Cedwyn
- Candidate standing topics on cedwyn.bucklerfamily.estate where a reader might plausibly set an agent: the Great House Farm / Cydfin Farm records and disclosure tracker (e.g. institution replies with target dates, such as the MOD request now due 26 Nov 2026), new documentary scenes ("doors"), and new e-book editions.
- PROPOSALS for the architecture programme (data-driven pages make this cheap): each webapp view emits a dated "latest changes" block from its own db with honest `dateModified`; one canonical updates page per area rather than scattered notes; first line of every entry = the new fact + date, neutral third person, house editorial rules.
- Entity clarity matters doubly here: Llandough Farm sits only in Kissed Frogs and is never merged with Great House Farm / Ty Mawr / Cydfin, so an agent tracking the farm does not cite the wrong place.
- Measurement: add one line to the Monday visibility check — "possible agent referrals" per rule 6, plus "Google AI Pro rollout of information agents confirmed? (yes/no, source)". No paid plan purchased; the project lead's own Google account only if he chooses to test.
- No change to prices, no outreach, nothing sent.

## Sources
- blog.google (Google, I/O 2026, read)
- 9to5google.com (9to5Google, 12 Jun 2026, read)
- x.com (Robby Stein, 12 Jun 2026; seen via search snippet and quoted by both articles)
- digitalapplied.com (practitioner guide, read; its signal list is labelled extrapolated)
- seroundtable.com (snippet only, not read)