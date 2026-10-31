# Stop rate and the free-registration wall: ask for the email where the reader is already hooked

**Date:** 31 Oct 2026 · **Topic:** funnel/CRO, list growth, measurement · **Status for Cedwyn:** measure now; any gate is a PROPOSAL

## The idea in one line
A sign-up box people can scroll past rarely gets used. Asking for a free account or email at the moment a reader wants the next part ("register free to keep reading") gets far more sign-ups. Measure how often you ask with one number, the **stop rate**.

## The evidence (primary practitioner sources)
- **Salem Reporter (small local Oregon news site), 30-day head-to-head test.** It ran an in-content newsletter form and a free registration wall side by side. The wall got **16× more sign-ups**, even though it asked for more (email plus password, against email only). The setup: first visit gets 1 free article, the second article brings up the wall, and upgrade messages appear after registering. About **1 in 5 free registrants later paid**. Free and paid sign-ups peaked on the same strong local stories. (Founder testimony on the Leaky Paywall podcast. Leaky Paywall is the vendor, so treat the 16× as one site's result.)
- **Readers rarely reach a generous meter.** The same source puts the average visit at **1.7–1.8 articles**. A meter set at 3+ free articles is never seen by most visitors.
- **Shorenstein Center (Harvard) Digital Pay-Meter Playbook, 500+ news organisations.** Stop rate = users stopped by a prompt, wall or meter in a month ÷ unique visitors that month. The median publisher stops **1.8%**. "Sustainable" businesses stop **4.2% or more** (80th–90th percentile). Those stopping **over 6%** had "thriving" subscription businesses. Large metro dailies have a median of 3.64%. Its conclusion: "Most publishers are too generous and need to stop more readers."
- **Google's no-code route (Reader Revenue Manager, free).** It offers registration walls, one-tap newsletter sign-up with the reader's Google account, surveys and contributions, set up in Publisher Center with one JS snippet. It works on non-news sites and does not work on AMP pages. Google's own case pages: TV9 gained **8,000+ newsletter subscribers in 3 months** "by reducing sign-up friction". Brasil 247 gained **9,000+ subscribers** and **+20% contributions**. Kronen Zeitung reported a **7× faster sign-up**. (These are vendor case studies: directional, not proof.)
- **SEO rule if gated text should still rank.** Google's paywalled-content structured data marks the gated block: `"isAccessibleForFree": false` plus `hasPart` → `WebPageElement` with a `.class` `cssSelector`. Without it, serving Googlebot the full text while readers see a wall can be treated as **cloaking**. Only `.class` selectors are allowed, and sections must not be nested.

## How to do it (small site)
1. **Measure first: stop rate.** Count unique visitors who were *shown* any sign-up ask (inline form in view, pop-up, end-of-chapter box, wall) ÷ monthly unique visitors. Under ~2% means you are barely asking. Fix visibility before adding pressure.
2. **Put the ask after engagement, not on arrival.** Good spots: the end of chapter 1 of a sample, the second long-read in a session, the "next lesson" click. Offer something concrete now ("read chapter 2 free"), not "updates someday".
3. **Gate depth, never the front door.** Keep the first piece, every landing page and anything you want cited or shared fully open. Gate only the *continuation*.
4. **Keep consent clean (UK GDPR/PECR).** ICO: consent is not "freely given" if the person "is unable to refuse … without detriment". Make registration for access one step and **marketing email a separate, unticked opt-in**, or rely on the soft opt-in only where its conditions apply. Use double opt-in on the list.
5. **Mark the gated block** with the paywalled-content JSON-LD if it should stay indexed. Test it in the Rich Results Test.
6. **Run it as a test, not a switch.** Two weeks of wall vs inline form on the same pages, the same traffic split, then compare sign-ups per 1,000 visitors *and* sales per 1,000 visitors (guardrail: page exits and organic clicks).
7. **Follow up the registrant.** The wall only pays if the welcome emails bring readers back to the next chapter and the shop.

## Pitfalls
- A wall on thin traffic shrinks reach before it grows the list. Start with one content type.
- A meter of 3+ free items does nothing at 1.7 pages per visit.
- Pop-ups on arrival on mobile can break Google's intrusive-interstitial guidance. End-of-content or inline walls are safer.
- Do not copy news-paywall advice wholesale. The aim here is list growth, not a subscription paywall.

## How we apply it to Cedwyn
- **Now (no site change):** add a stop-rate line to the Sunday growth report: unique visitors shown a sign-up ask ÷ unique visitors (Cloudflare visitor proxy plus the existing `/_cedwyn/ev/` events). `tools/stop_rate.py` turns the counts into the rate and the Shorenstein band.
- **Evidence, research and timeline pages stay fully open.** They are the public record and the pages we want cited. No wall there, ever.
- **PROPOSAL (needs the owner's GO, as it changes an email journey):** on e-book sample chapters and academy lessons only, keep chapter/lesson 1 open and put a free email step before part 2, with a separate unticked "send me new releases" box. Mark the gated block with the paywalled JSON-LD so it stays indexed. A/B it for 2 weeks against the current inline Mailchimp form. Success = more sign-ups per 1,000 visitors with sales per 1,000 not falling.
- **Google RRM** is an option only if the site has a Publisher Center publication. Its one-tap Google sign-up could replace a typed email on mobile. Decide after the stop-rate baseline.

## Sources
- leakypaywall.com (Salem Reporter test, updated 3 Feb 2026)
- shorensteincenter.org (stop-rate benchmarks; PDF: shorensteincenter.org)
- readerrevenue.withgoogle.com (TV9, Brasil 247, Kronen Zeitung)
- support.google.com (RRM setup and features)
- playwire.com (RRM on non-news sites, no AMP; ad-tech vendor)
- developers.google.com (cloaking-safe markup)
- ico.org.uk