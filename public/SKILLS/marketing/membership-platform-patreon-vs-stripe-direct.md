# Membership platform: Patreon vs Stripe direct for the £49.99/mo academy (fees, iOS cut, retention)

Harvested 28 Oct 2026. Question: should the /learn/ academy (and any small supporter tier) run on Patreon instead of our own Stripe subscription? Short answer: **no, stay on Stripe direct**; Patreon costs about 5x more per payment and its main extra (hosting, app, community) we already have. Re-check only if we want Patreon's iOS app audience or its chats, and then only as a second door.

## The fee facts (read 28 Oct 2026)
**Patreon** (support article "A standard platform fee for new creators — effective after August 4, 2025", read in full via a text mirror because the page blocks scripts):
- Any creator page published after 4 Aug 2025 is on the **standard 10% platform fee**. Legacy plans are kept only by older pages; an unpublished-then-republished legacy page drops to 10%.
- Processing on a **GBP payout: 3.4% + £0.35** per payment over £3 (USD cards 2.9% + $0.30; non-US PayPal 3.9% + $0.30).
- **2.5% currency conversion** whenever the fan pays in a currency other than our payout currency (charged on the full payment incl. tax).
- One-time digital product sales: **5% to 12%** platform fee + processing.
- VAT/GST is added on platform fees where required (separate line). Payout fees are extra and not shown in the earnings dashboard.
- Legacy creators must move to subscription billing by **1 Nov 2026** (charged on join anniversary, like Stripe).
- **iOS app joins:** Apple takes 30% (15% after a year of continuous billing); Patreon drops its own processing fee there but the 10% still applies, and by default raises the iOS price by about 43% to compensate (Ruzuku fee breakdown, updated Sep 2026, read; Ruzuku sells a rival platform, so treat its framing with care, though its fee table matches Patreon's own article).
- Ruzuku's worked numbers: 10% + processing = **14.1% of gross on a $25 tier, 15.9% on a $10 tier**; $705/month lost on $5,000 of memberships.

**Stripe UK** (stripe.com, read 28 Oct): **1.5% + 20p** standard UK cards, **2.5% + 20p** EU cards; Stripe Billing pay-as-you-go **0.7%** of billing volume. No platform fee.

## Worked for Cedwyn (per payment, UK card)
| Price | Stripe direct (1.5%+20p + 0.7% Billing) | Patreon (10% + 3.4%+35p, before VAT on fee) |
|---|---|---|
| £49.99 academy | £1.30 (2.6%) -> we keep £48.69 | £7.05 (14.1%) -> we keep £42.94 |
| £4.99 supporter tier | £0.31 (6.2%) | £1.02 (20.4%) |
Per 20 academy members a month the gap is about **£115/month (~£1,380/year)**, before Patreon's VAT on its fee and before any iOS joins. Run `python3 tools/membership_fee_calc.py 49.99 20` to redo it.

## Retention: what actually keeps members (practitioner numbers)
- Benchmarks quoted from Patreon's own (older) guidance: a **good 3-month patron retention is 65%, a great one 78%** (via Bonjoro's case study, 2020; second-hand, not re-checked on Patreon).
- Case: performance artist Siobhan O'Loughlin lost **1 of 75 new patrons in 3 months** (~98% retention) by sending each new member a short personal thank-you video within a day of joining (Bonjoro case study; vendor blog, single creator, so a pattern to copy, not a guaranteed rate).
- Our existing academy notes: Recurly $50-100/mo plans churn ~3.15%/month (see uk-subscription-regime-dmcc skill); failed payments are ~25% of lapses (see stripe-dunning skill). The personal-welcome habit is the cheap lever that neither file covers.

## How we apply it to Cedwyn
1. **Keep the academy on Stripe** (member_sync.py path). Do not open a Patreon page: it would also need a public creator name, and the no-naming rule makes "Cedwyn" the only option, which Patreon allows but which adds a second public profile to police.
2. **Personal welcome within 24 h of every new academy member**: a short plain-text email (HubSpot draft for the project lead to send, or his own words) naming what to open first in /learn/. Not a video unless the project lead wants to record one; never AI-written words in his name.
3. **Measure 3-month retention per monthly cohort** once there are 10+ members; target the 65% "good" line and 78% "great" line above.
4. If a cheap "support the research" tier is ever wanted, it goes on Stripe or the existing Ko-fi tip jar (see ko-fi skill), not Patreon: at £4.99 Patreon keeps a fifth.
5. Revisit only if (a) the project lead asks for Patreon's app/chat community, or (b) Patreon publishes discovery numbers showing new fans found through Patreon itself. Neither exists today.

## Sources
- support.patreon.com (read via r.jina.ai mirror, 28 Oct 2026)
- ruzuku.com (read, updated Sep 2026; competitor of Patreon)
- stripe.com (read 28 Oct 2026)
- bonjoro.com (read; vendor case study, 2020)