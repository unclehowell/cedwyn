# UK B2B cold calling: TPS/CTPS screening, honest openers, call log (2026)

For calling local businesses (e.g. the parcels campaign's 88 phone-only businesses). Law first, then the opener data.

## The law (ICO, PECR reg. 21) — read 27 Oct 2026
ICO "Business-to-business marketing" page: before live B2B marketing calls you
- cannot call numbers on the **CTPS or TPS** unless that business consented to your calls;
- cannot call a business that previously objected to your calls;
- must say who is calling (organisation name), show your number (no withheld CLI), and give contact details if asked.
- "Some businesses (eg sole traders and some partnerships) register with the TPS, and others with the CTPS" -> **screen every number against BOTH registers plus your own do-not-call list**.
- A registration can take up to **28 days** to take effect (widely repeated practitioner/legal note, e.g. Navigator Law; not checked on an ICO page today) -> re-screen any list older than 28 days before calling.
- Register sizes on 26 Oct 2026 (tpschecker.co.uk counter): TPS 13,479,742 numbers; CTPS 1,076,946.

Enforcement with numbers: ICO, 20 May 2026 — Energy Prices Direct Ltd fined **£160,000** for 700,000+ calls to TPS/CTPS numbers (Jan 2024–Jan 2025, 30+ complaints). Aggravating facts named by the ICO: bought data never screened, data source unknown, callers not identifying the company, and denying it was a sales call. So: know your source, screen, name yourself, never pretend it isn't marketing.

## Free screening routes (no paid tools)
- tpschecker.co.uk: free registration, then single-number checks against TPS+CTPS (states "for FREE"; limits not read).
- Marketscan TPS/CTPS checker: first 100 checks free (vendor page).
- Record date + result for every number (tools/call_screen_log.py checks the log).

## Opener data (Gong Labs, practitioner dataset; US-heavy B2B sales calls)
- 90,380 cold calls (gong.io): baseline meeting rate 1.5%.
  - "Did I catch you at a bad time?" 0.9% (-40%). Don't.
  - "How are you?" 5.2% (3.4x).
  - "How have you been?" 10.01% (6.6x) — on first-ever calls. (Pattern interrupt; can sound presumptuous in a UK village context — our call.)
  - Stating "The reason for my call is…" early: 2.1x.
- 300M+ calls (Armand Farrokh, Gong, updated 27 May 2026): "bad time?" 2.15%; "How's your day going?" 7.6%; **permission-based opener ("this is a cold call — can I take 30 seconds to say why I rang, then you can tell me if it's relevant?") 11.18%**; "heard the name tossed around?" (peer context) 11.24%.
- Takeaway that survives culture/translation: own that it's a cold call, give the reason in one line, ask permission, keep it under 60 s.

## How to run a call block
1. Source list documented (where each number came from + date).
2. Screen all numbers vs TPS + CTPS + own do-not-call; drop hits; log date. Re-screen if >28 days.
3. Script: name + organisation -> permission opener -> reason in one sentence -> one offer (a link by email to someone who asks for it) -> "would you prefer we don't call again?" -> log outcome.
4. Any objection -> add to do-not-call immediately; never call again.
5. CLI shown; a call-back number that reaches us.
6. Calls 9:30–17:00 weekdays; one attempt + at most one retry.

## How we apply it to Cedwyn
- The parcels campaign's phone-only businesses: no call until every number is screened (TPS+CTPS) and logged, and the project lead approves the script. A calling number must be presented (no withheld number).
- Content risk is bigger than opener choice: a call raising a "title chain concern" with a landowner is NOT marketing small talk. Script wording stays "the family is raising a concern… the research is on the website, have a look if it's of interest" — never "your title is defective" (slander-of-title risk was flagged to the project lead 27 Oct).
- Use the permission opener: "Hello, it's [name] calling on behalf of the Cedwyn Estate family archive. This is an unexpected call — can I take 30 seconds to say why I've rung, and you tell me if it's of any interest?"
- Offer: "Can I email you the link?" — getting a yes also gives consent for that one email (good for sole traders, who otherwise get no cold email).
- Any "don't call" -> do-not-call list + HubSpot ticklist status "objected".

## Sources
- ico.org.uk (read 2026-10-27)
- ico.org.uk (20 May 2026)
- navigatorlaw.co.uk (28-day note; secondary)
- tpschecker.co.uk (free checks, register counts 26/10/2026)
- secure.marketscan.co.uk (first 100 free; vendor)
- gong.io (90,380 calls)
- gong.io (Farrokh, mod. 27 May 2026)
- gong.io (reason-for-call 2.1x)