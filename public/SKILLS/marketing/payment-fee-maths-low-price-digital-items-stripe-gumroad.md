# Payment fee maths for low-price digital items (£4.99 scenes and e-books, £19.96 bundle, £49.99/mo academy)

Harvested 30 Oct 2026 ~20:14Z. Before this run, "stripe fee", "micropayment" and "fee math" had 0 hits in INDEX.md. This is a read-only analysis. Prices are fixed (v0.0.2 £4.99, bundle £19.96, academy £49.99/mo), so nothing here changes a price. It tells us **which channel and which item shape keep the most of each sale**.

## Published fees (primary pricing pages, read 30 Oct 2026)
- **Stripe UK, pay-as-you-go** (stripe.com):
  - standard UK cards: 1.5% + 20p
  - EEA cards: 2.5% + 20p
  - international cards: 3.15% + 20p, **+2% if currency conversion is needed**
  - Bacs Direct Debit: 1%, minimum 20p, capped at £4
  - disputes: **£20 per dispute received**, plus £20 if you counter one manually (refunded if you win)
- **Stripe Billing** (stripe.com): **0.7% of Billing volume** on subscriptions, on top of the card fee.
- **Stripe Managed Payments** (merchant of record, which handles tax, deception and disputes): **+3.5% per transaction** on top of the standard fees.
- **Gumroad** (gumroad.com):
  - 10% + $0.50 on direct-link and profile sales
  - **30%** when the buyer comes through the Discover marketplace
  - merchant of record since 1 Jan 2025, so it handles VAT
  - Whether card processing is charged on top: not checked.
- **Vimeo On Demand / OTT:** a third-party write-up (castr.com, read via snippet only, not checked) states Vimeo On Demand closes on 20 Nov 2026, and OTT takes 10% + 50¢ per one-time sale, so "a $5 rental loses 20%". We don't use Vimeo, and this rules it out for per-scene sales.

## What the 20p fixed fee does at each price (Stripe, our arithmetic)
| price | UK card | EEA card | intl + FX |
|---|---|---|---|
| £0.99 | 22p = 21.7% | 22.7% | 25.4% |
| £2.99 | 25p = 8.2% | 9.2% | 11.8% |
| **£4.99** | **28p = 5.5%** | 6.5% | 9.2% |
| £9.99 | 35p = 3.5% | 4.5% | 7.2% |
| **£19.96** | **50p = 2.5%** | 3.5% | 6.2% |
| **£49.99/mo** | £1.30 = **2.6%** (with Billing 0.7%) | | |

- **Gumroad** on a £4.99 direct sale: about **£0.88 = ~18%**, assuming $0.50 ≈ £0.38 (exchange rate not checked). Through Discover, 30% = £1.50.
- **Managed Payments** on £4.99: about 45p = 9.0%.
- **One dispute (£20) wipes out the margin on about 4 scene sales.** The fee is about 4× the £4.99 price and roughly 4.3× what we keep from one sale.

## The rules this gives
1. **Below about £3, the fixed fee eats the margin.** Don't create sub-£3 per-item prices. Use free (v0.0.1) or ≥£4.99.
2. **Bundles keep more.** Four e-books bought one at a time pay 4 × 28p = £1.12. The £19.96 bundle pays 50p. Show the bundle first after one book is in view (pricing unchanged).
3. **Sell direct (Stripe Payment Link) by default.** Keep Gumroad as the backup and marketplace listing, because direct Gumroad sales cost about 3× the Stripe fee per £4.99 item.
4. **Disputes are the real risk at £4.99, not the percentage.** Reduce them by:
   - a clear statement descriptor (e.g. CEDWYN ESTATE)
   - an immediate receipt with the code or download
   - the UK digital-content consent tick (we already have it)
   - a fast, no-quibble refund in place of a chargeback
   A refund costs us 28p; a dispute costs £20.
5. **Recurring beats repeat one-offs on fees.** A £49.99/mo member costs 2.6% a month. Twelve separate £4.99 purchases would cost 5.5% each.
6. **Merchant of record is worth +3.5% only if VAT admin on cross-border digital sales becomes a real burden.** UK VAT registration and EU OSS thresholds: check with the accountant; not checked here.

## How we apply it to Cedwyn
- **Log the fee and net with each sale.** member_sync / the weekly Stripe report (the project workspace) should read `balance_transaction.fee` from Stripe (read-only) and record net per sale and per channel, so the Sunday growth report shows net £, not gross.
- **Scene access (P-098 lane):** keep £4.99 as a single Stripe Payment Link. **Don't** add a 99p "rent" option; the fixed fee would take about 22%.
- **E-books:** the /ebooks/ purchase path stays on Stripe direct. If Gumroad is the live checkout on any book page, list it as a patch in the project workspace (switching it to the Stripe link) for the lane that owns /ebooks/ (b9cf213b). Don't edit that page here.
- **Stripe settings:** check that the statement descriptor is recognisable and that receipts are switched on. Do this read-only via the connected Stripe, then queue any change as a problem in the project workspace No tool is needed; the table above is plain arithmetic: fee = price × % + 20p.
- **Gift passes** (see academy-gift-membership-prepaid-pass-handoff.md): sell as one-time charges, with no Billing 0.7% and no auto-renew dispute risk.

## Sources
- stripe.com (read 30 Oct 2026: card rates, FX, Bacs, dispute fees)
- stripe.com (read: 0.7% of Billing volume)
- stripe.com (read: +3.5%)
- gumroad.com (read: 10% + $0.50 direct, 30% Discover, MoR since 1 Jan 2025)
- castr.com (search snippet only, not checked)