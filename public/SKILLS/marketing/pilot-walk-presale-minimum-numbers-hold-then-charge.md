# Pilot walk pre-sale with a minimum number ("runs at 8"): take money only when the walk is certain

Harvested 31 Oct 2026 (skills harvest run). Why: programme-office objective O1 has a **pilot walk with 8–12 guests by 12 Dec 2026** (O1-M7) and a free date-based booking path that also redeems vouchers (O1-M5). Gift-voucher pre-orders (£25/£45/£90) are already live and covered elsewhere (`tour-marketplaces-airbnb-viator-gyg-heritage-walk.md`, `coming-soon-notify-me-waitlist-referral.md`). This file covers selling **dated places** on a walk that might not reach its numbers, without leaving buyers out of pocket or the business holding money it may have to return.

## What the sources show (read 31 Oct 2026)
- **"Guaranteed to run" at a stated minimum is standard operator practice.** Walks Worldwide FAQ (read): "We need a minimum number of participants to run our group departures – this is usually four people. If we are not able to run a group tour, we will offer you an alternative or refund your deposit. Departures that are already guaranteed are shown as such." The status label itself is part of the sales page.
- **The other model: guarantee from guest one, with a surcharge if small.** Trek Travel FAQ (read): "once one guest is booked, your trip is guaranteed". With one or two guests near final payment, guests may keep the date by paying a small-trip fee ($750 pp for two, $2,000 for one), or move. That suits high prices. For a £-tens walk, a minimum-number line is the honest fit.
- **A cancelled event must be refunded, whatever the policy states.** Eventbrite help, "How to set a refund policy" (read): even under "Don't allow refunds", "if your event is cancelled, you're required to issue refunds". The policy can only be loosened after publishing. The default refund window is up to 7 days before the event.
- **No 14-day cooling-off for a dated leisure service.** Consumer Contracts Regulations 2013, reg 28(1)(h) (read on legislation.gov.uk): the cancellation-period rules do not apply to "services related to leisure activities, if the contract provides for a specific date or period of performance". A dated walk ticket therefore needs our own stated refund terms. An **undated** gift voucher is not covered by this exemption.
- **Card holds expire in about a week.** Stripe, "Place a hold on a payment method" (read): customer-initiated card-not-present authorisations are valid **7 days** (Visa 5 days for merchant-initiated). Payment Links and Checkout accept `payment_intent_data.capture_method=manual`. So "hold now, charge when the minimum is reached" only works inside a 7-day window before the decision date.
- **When tickets sell.** Eventbrite marketing-lifecycle data (read; festival-type events): **15% of tickets sell in the first week and 24% in the last week**, with 61% in between. Their suggested promotion spend is 10% announce, 30% first-tier on-sale and 40% close-out. That is the shape to expect: a burst at announcement, a quiet middle, a late rush. The decision date should not come before the last-week rush.

## How to do it
1. **Set the three numbers before announcing:** minimum (break-even plus guide cost; e.g. 8), maximum (group size the route and guide can handle; e.g. 12), and a **go/no-go date** 6–7 days before the walk.
2. **Say it plainly on the booking page:** "This walk runs when 8 places are booked (5 of 8 so far). If it doesn't reach 8 by [date], you get a full refund automatically, or can move to the next date." Show a live count and switch the label to **"Confirmed: this walk is going ahead"** once the minimum is reached. The count is honest urgency. Never fake scarcity (see `honest-launch-deadlines-uk-dmcc-banned-practice-7.md`).
3. **Pick the money route:**
   - **(a) Hold, then charge.** For bookings made within 7 days of the go/no-go date: manual capture. Capture all holds when the minimum is reached; let holds lapse (or cancel them) if it isn't. No refund handling, no fees on cancelled walks.
   - **(b) Charge, then refund.** For earlier bookings, take payment now and refund in full via Stripe if the walk is cancelled. Under the Eventbrite rule and basic fairness this is a must, not an option. Track refunds in the same sheet.
   - **(c) Free "reserve my place", then pay link at go.** For the pilot only: collect names and emails (the free booking path in O1-M5), then send a pay link to everyone the moment 8 are reserved. Expect some drop-off. Over-reserve to about 12 for 8 paid.
4. **Write the refund terms** (needed because reg 28 removes the statutory 14 days): full refund if we cancel or the minimum isn't reached; the guest's own cancellation refunded up to 7 days before; after that, free transfer to a friend or a later date. Put these terms in the order email.
5. **Vouchers redeem into places.** A voucher code books a place like a payment (no charge). If the walk is cancelled, the voucher stays valid. It is never turned into cash unless the buyer asks.
6. **Promote in the curve:** announce plus a first push (week 1), one mid reminder, then a "3 places to go" push in the final week before go/no-go (only when true).

## How we apply it to Cedwyn (PROPOSAL, needs the project lead's GO on price, date and guide)
- **Pilot (O1-M7):** proposed "runs at 8, max 12", go/no-go 7 days before a Saturday in early December. Route (c) for the pilot: the free reserve path already planned in O1-M5, plus a pay link at 8. That avoids holding anyone's money while the guide and insurance blocker (exec) is open.
- **Public dates from March 2027 (O1-M8):** route (a)/(b) via a Stripe Payment Link with manual capture for last-week bookings. The member-sync style job on our box can count paid places, because the Worker has no Stripe key yet.
- **Page copy (Wales section):** the "Confirmed / X of 8 booked" label and the refund line. Neutral wording only, no banned words, never names the project lead.
- **Tracking:** reservations → paid conversion and voucher redemptions go into the O1 KPIs (`tour_enquiries`, `vouchers_sold`).
- Nothing is published, priced or charged by this file.

## Sources
- walksworldwide.com
- trektravel.com
- eventbrite.com
- legislation.gov.uk
- docs.stripe.com
- eventbrite.com