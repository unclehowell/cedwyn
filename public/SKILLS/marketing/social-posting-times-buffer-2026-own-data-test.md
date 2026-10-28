# Social posting times: Buffer 2026 priors, then test on our own posts

Use when: choosing when Instagram / Facebook posts go out, or when reach dropped and timing is a suspect. Harvested 27 Oct 2026.

## What the evidence states (read in full, 27 Oct 2026)
**Instagram** (Buffer, "Best Time to Post on Instagram in 2026", 23 Sep 2026): 9.6M posts, 200,000+ accounts, Jan 2024-Dec 2025. Metric = median engagement rate ((likes + comments + shares + saves) / followers x 100). Times normalised to the poster's own local time zone.
- Top slots: Thu 09:00, Wed 12:00, Wed 18:00.
- Best days: Wed, then Thu, Tue. Worst: Fri and Sat (lower in every slot).
- Evenings (18:00-23:00) win every weekday except Thursday. On Thursday, 07:00-09:00 beats the evening.
- Mornings (06:00-11:00) are the weakest, except Thu 09:00.
- By day (top 3): Wed 12:00/18:00/08:00 · Thu 09:00/08:00/07:00 · Tue 19:00/15:00/17:00 · Mon 19:00/18:00/20:00 · Sun 21:00/22:00/20:00 · Fri 22:00/21:00/06:00 · Sat 21:00/22:00/20:00.
- Buffer's own caveat: reels may peak differently. Test early-morning and midday slots for reels.

**Facebook** (Buffer, "Best Time to Post on Facebook - New Data from 14M Posts", 19 Oct 2026): 14M posts, same method and local-time normalisation.
- Single best slot: Thu 09:00 (Thursday 08:00 and 10:00 also strong). Wed and Sun mornings are also strong.
- Best day: Wed, then Thu, Tue. Worst day: Sat. Sun is a little better but still trails weekdays.
- Facebook is the opposite of Instagram: mornings (06:00-11:00) peak on most weekdays, and afternoons (12:00-17:00) are lowest.
- Monday is the exception: best at 21:00, 22:00, 19:00. Tue: 08:00, 19:00, 07:00. Wed: 08:00, 09:00, 18:00.

**Limits of these numbers** (our read):
- The figures are engagement per follower, not reach, and come from Buffer's own customers.
- They are medians across niches. Buffer itself states retail/media skew to mornings and finance/hospitality to afternoons.
- They give you a starting slot. They don't predict how one account performs.
- Timing matters through early momentum: Buffer: "recency still dictates your initial reach". It is not the main ranking signal; content and originality come first (see instagram-reach-collapse-account-status-originality-triage.md and facebook-page-reach-limited-originality-triage.md).
- Hootsuite publishes different "best times" (e.g. IG 15:00-21:00 Mon). Sources disagree in detail. The two things they agree on are midweek beating Fri/Sat, and Instagram evenings beating Instagram mornings.

## How to do it
1. **Start from the prior, per channel.** Instagram goes in the evening (Thu 09:00 is the one morning exception). Facebook goes in the morning (Monday evening is the exception). Never post the same minute to both "because it is convenient": their peaks are opposite.
2. **Use the audience's clock, not the server's.** Buffer's times are local. For a UK-first audience, read them as Europe/London. Check the country split in Insights. If a second country is >25% of followers, test one slot that suits both.
3. **Keep it to one variable.** Same format, similar post quality, alternate only the slot. Run two slots for 4 weeks: at least 8 posts per slot, or the difference is noise.
4. **Measure reach from non-followers and saves/shares at 48 h.** Likes alone mostly measure followers who were already online.
5. **Decide on medians.** A slot wins if its median 48 h reach is at least 1.5x the other's across 8+ posts. Otherwise keep the prior.
6. **Don't do these:** bursts of 3-4 posts within 10 minutes (they compete with each other); Friday or Saturday mornings; deleting and reposting a post to "retime" it.

## Tool
`tools/post_time_slots.py` (own stdlib script, ~4 KB, no install). Give it a CSV with columns `timestamp,channel,reach` (UTC ISO times; optional `format`).
- It buckets each post by Europe/London weekday x hour and prints median reach per bucket with n.
- It flags buckets with n<8 as "too few".
- It marks where each post sat against the Buffer prior: IG evening/Thu-am, FB morning/Mon-pm.
- Run: `python3 tools/post_time_slots.py posts.csv`

## How we apply it to Cedwyn
- **What we post now** (social-log.md, ebook-promo/log.csv):
  - Daily auto-social at 08:15 London to both FB (Great House Farm II) and IG.
  - Tue 27 Oct had a 4-post burst at 09:14-09:22Z and a quote carousel at 20:15Z.
- **Instagram:**
  - 08:15 is inside Buffer's weakest IG window on every day except Thursday.
  - Use these slots instead: Mon/Tue 19:00, Wed 12:00 or 18:00, Thu 09:00, Sun 21:00, Fri/Sat only 21:00-22:00.
  - Tonight's 20:15 carousel slot already fits the prior.
- **Facebook:** 08:15 fits the prior (Tue-Thu 08:00-09:00). Keep it, apart from Monday, which should be 21:00.
- **Proposal, not applied:** split the 08:15 daily auto-social so Instagram fires in the evening slot above.
  - Changing a schedule's time is a cadence change, and the project lead's rule is "never change the cadence without asking". So this goes to `the project workspace` as a PROPOSAL.
  - Until then, manual or one-off IG posts (quote packs, bizdev runs) use the evening slots.
- **No more bursts:** one post per channel per slot, with ≥4 h between posts per channel (already in social.py's rule).
- **Measure:** export IG/FB post reach into a CSV and run post_time_slots.py in the Sunday growth report.
  - Reach collapsed on IG this week (1-36 accounts). Read timing after the account-status / originality checks, not instead of them.
- **Not checked:** our follower country split, and whether reels behave differently for @cedwynestate.

## Sources
- buffer.com (read 27 Oct 2026)
- buffer.com (read 27 Oct 2026)
- blog.hootsuite.com (search snippet only, not read)