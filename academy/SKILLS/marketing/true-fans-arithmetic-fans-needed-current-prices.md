# True-fans arithmetic: how many paying fans Cedwyn needs at TODAY's prices

Topic: e-book/membership business model and funnel targets. Harvested 2026-10-30. Checked first: 0 skill files mention "1,000 true fans", "value ladder" or "fan ladder". "Superfan" appears only in the IG broadcast and per-episode sales files.

## What the sources say (read 30 Oct 2026)
- **Kevin Kelly, "1,000 True Fans"** (kk.org, 2008 essay, rewritten for *Tools of Titans*; read):
  - There are two conditions. (1) Make enough each year to earn on average **$100 profit per true fan**. (2) Have a **direct relationship**: fans pay you directly, so you keep it all. 1,000 x $100 = $100k a year.
  - An alternative measure is "one day's wages per year" from each fan.
  - For every true fan there are "two or three regular fans".
  - "It is always easier and better to give your existing customers more, than it is to find new fans."
  - A helper or team raises the number of fans needed in proportion.
  - The average successful Kickstarter had **241 funders**. This is Kelly's figure from the time and is not checked against today's numbers.
- **Li Jin, "1000 True Fans? Try 100"** (a16z, 2020; read):
  - The new model is 100 fans x $1,000 a year.
  - Platform data she quotes: the average initial Patreon pledge rose 22% in two years, and new patrons paying over $100/month grew 21% since 2017. On Podia, creators earning over $1k/month grew 20% a month. On Teachable, average prices rose about 20% a year, and in 2019 nearly 500 creators made over $100k, 25 of whom averaged over $1,000 a sale.
  - The $1,000 tier needs a "step-function increase in value": differentiated content, community, accountability and access. Donation-style perks such as ad-free or back-catalogue access only support the low tier.
  - Caveats: these are platform-reported figures from 2020, from a VC firm invested in the space.

## How to do it
1. Use only **current live prices**, read-only from /ebooks/ HTML or Stripe. This skill never proposes a price change.
2. Measure three rates from our own data, never guessed:
   - visitor -> subscriber (Cloudflare/GA4 + Mailchimp)
   - subscriber -> buyer within 12 months (Mailchimp + Stripe/Gumroad)
   - buyer -> member (Stripe)
3. Run the tool (standard library only):
   `python3 tools/true_fans.py --target 12000 --offer "ebook:4.99:0.8" --offer "academy:599.88:0.05" --fan-from-sub 0.03 --sub-from-visit 0.01 --have-subs 1`
   It prints net £ per average fan per year after card fees, the fans needed, and the subscribers and visitors that implies. The default fees are Stripe UK standard cards, 1.5% + 20p; check the live Stripe pricing page.
4. Read the result the Kelly/Jin way:
   - If net £/fan is far below Kelly's ~$100 (about £80), the gap is the **offer ladder**, not traffic.
   - Kelly: give existing buyers more, for example the next e-book or a bundle that already exists.
   - Jin: the high tier must be a result (community, access, accountability), not a perk.
5. Use the visitor number as the yardstick for every traffic plan. If a channel can't move it, it isn't a priority.

## How we apply it to Cedwyn
Box run on 30 Oct with **assumed** share-buying figures:
- £4.99 e-book bought by 80% of fans: £3.77 net each.
- Academy (£49.99/mo = £599.88/yr) taken by 5% of fans: £29.42 net per average fan.
- Total: **£33.20 per fan per year**, so **362 fans** for £12k/yr.
- We have 0 buyers and 1 Mailchimp subscriber. The bottleneck is the audience and the first buyers, not prices.
- Each Academy member is worth about £580/yr net, which is already Jin's "$1,000-ish" tier. Its offer page must sell community, access and accountability (Q&A, records help, member-only scans), not "more content". Copy changes are PROPOSALS for the bizdev or onpage worker.

Rules:
- Re-run monthly in the growth report with measured rates, and put the "fans needed / gap" line in the Sunday notes.
- Never publish the arithmetic, and never quote the project lead's revenue goals publicly.
- Don't propose price changes or bandit tests on prices.
- "Direct relationship" means our own email list and our own Stripe. That is a reason to keep pushing signup over platform followers.

## Sources
- kk.org
- a16z.com