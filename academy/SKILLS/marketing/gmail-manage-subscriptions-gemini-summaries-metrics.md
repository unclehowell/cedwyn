# Gmail 2025-26 inbox changes: Manage Subscriptions, Gemini summaries and what to measure

Written 27 Oct 2026 for the Cedwyn newsletter (Mailchimp). Scope: how Gmail's subscription dashboard, engagement-sorted Promotions tab and AI summaries change unsubscribe and open figures, and what a small sender does about it.

## What changed (primary sources)
- **Manage Subscriptions** (Google blog, Chris Doan, 8 Jul 2025, read): one view listing a reader's subscriptions "sorted by the most frequent senders alongside the number of emails they've sent you in the past few weeks"; one-click unsubscribe sends the request for the reader. Gmail help 15621070 (read): unsubscribing there "unsubscribes you from all active mailing lists related to the sender".
- **Zeta, Chad S. White, 19 Mar 2026** (read; vendor practitioner): buckets are 20+, 10-20 and 10 or fewer emails "recently" (window looks like 3-4 months, undisclosed), alphabetical inside each bucket. Since launch "unsubscribe rates have jumped by 200% or even 300%", mostly because Gmail fires several unsubscribe requests per click, so **total** unsubscribes are inflated and **unique** unsubscribes rose "only modestly". He also reports that people who unsubscribe there and later re-subscribe see mail go to spam (his report, not checked by us).
- **Validity, "What's really behind Gmail's open rate drop"** (read; vendor data): some customers lost 30%+ of Gmail opens quarter on quarter; Gmail image loading (pixels) fell by about a third in late Nov 2025; Gmail inbox placement fell about 3 points after Gmail moved from soft enforcement to hard rejection of non-compliant bulk mail in late 2025; the Promotions tab is now sorted by engagement, not recency; from Jan 2026 Gmail shows 1-2 sentence AI summaries pulled "from the earliest readable text"; Gemini answers inbox questions ("what discount codes do I have…") without opening mail. Clicks and revenue did not fall the way opens did.
- **Omeda via a LinkedIn post** (snippet only, not checked): opens up to 45.6% while click-through fell 4.35% -> 3.93% after the Gemini rollout. Treat as one data point.

## How to do it
1. **Measure the right numbers.** Report unique clicks, replies, unique unsubscribes, spam complaints (Postmaster Tools v2) and sales per send. Use opens only as a health alarm (a sudden drop = check placement), never to suppress Gmail readers or to pick A/B winners.
2. **Stay out of the 20+ bucket.** Keep newsletter cadence modest; send fewer to the less engaged. If you ever run separate streams (weekly letter vs launch announcements), give each its own From address and its own List-Unsubscribe header so a reader can drop one stream, not all (Validity, Zeta).
3. **Write for the summary.** The first readable lines are what Gemini quotes. Put the one news item and the one action in the opening sentence: what is new, and the single link to tap. A summary that answers everything removes the click; name a next step that needs the page ("read the 1824 map in full").
4. **Make time-bound offers legible.** Plain dates and named actions in clean HTML ("Free chapter until Sunday 1 Nov") plus Promotions annotations (see gmail-promotions-annotations-image-deal.md) so Gmail surfaces your words, not its own extraction.
5. **Keep compliant or be rejected.** DMARC, one-click List-Unsubscribe, spam rate under 0.3% (see gmail-postmaster-tools-v2-compliance-spam-rate.md). Rejected mail generates no opens and no sales.
6. **Keep the HTML under Gmail's clip.** Gmail clips messages over about 102 KB of HTML (long-standing Gmail behaviour; Validity's page prints "1,024 bytes", which reads as a typo). Put the tracking pixel and the main link early; keep the footer unsubscribe reachable.
7. **Read unsubscribes as list cleaning.** A smaller list of readers who click is what lifts Promotions-tab ranking. A spike after a send is a cue to check unique numbers before changing anything.

## How we apply it to Cedwyn
- The list is tiny (1 subscriber at last count in email-send-time-frequency-tiny-list.md), so this is about building the right habits before it grows.
- In the weekly report (the project workspace and the Sunday growth report) show Mailchimp **unique** clicks and unique unsubscribes; drop opens from any decision line. Proposed, not changed.
- Welcome 1-3, weekly w44/w45 and re-engage 30d templates: make each first sentence a one-line summary plus the single link (for example the free chapter or the newest blog post). Proposed edit, no wording changed here.
- If launch announcements ever get their own stream, give them a separate From name/address and List-Unsubscribe in Mailchimp so the weekly letter survives a "stop launches" click.
- Never add personal names or case accusations to the first lines: summaries are shown out of context. Editorial rules apply (the project lead never named; banned words list).

## Sources
- blog.google/products-and-platforms/products/gmail/new-manage-subscriptions-unsubscribe/ (8 Jul 2025, read)
- support.google.com (read)
- zetaglobal.com (Chad S. White, 19 Mar 2026, read)
- validity.com (read)
- validity.com (fetched)
- linkedin.com (Omeda figures, snippet only, not checked)