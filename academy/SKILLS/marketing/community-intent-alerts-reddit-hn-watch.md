# Community intent alerts: free Reddit + Hacker News keyword watch, then answer by hand

Read 27 Oct 2026 (skills harvest 01:22). Type: community / listening / zero-spend. Complements press-requests-and-mention-monitoring.md (Google Alerts + Talkwalker cover the open web and news; neither covers Reddit comments well) and reddit-forum-participation-heritage.md (how to take part once a thread is found).

## Why
Reddit threads where someone asks about Llandough, a Vale of Glamorgan farm, a Welsh place name or Patagonian settler records are the moments a helpful, sourced answer earns trust and a profile click. The skill is finding those threads within hours, not weeks, without paying for a monitoring tool.

## Evidence (how solid each is)
- F5Bot own site (read 27 Oct 2026): monitors Reddit, Hacker News and Lobsters for keywords and emails alerts; "Since 2017", "430,000+ alerts delivered daily"; free tier exists; paid Silver is $12.99/month (20 keywords, "for individuals, non-commercial use").
- okara.ai F5Bot-alternatives review (6 Oct 2026, read; secondary, citing F5Bot's tiers page): free plan is "personal use only", 5 keywords, 20 alerts a day, alerts "within 2 hours", common words blocked, 7-day match history. Treat the free tier as not for a business's commercial use.
- Indie Hackers founder post (snippet, not read in full): "You can use a free tool like F5bot to get alerts when certain keywords appear on Reddit. It works, but you're stuck reviewing every single" match - i.e. alerts need human triage; the value is in the reply, not the alert.
- Box test 27 Oct 2026 01:26Z (our own run): Reddit's public search feed reddit.com returned 200 with results for "Llandough" (mostly University Hospital Llandough / Cardiff threads - noise to filter); a second query seconds later answered 429. HN Algolia API (hn.algolia.com) answered 200.

## How to do it
1. Pick 5-10 tight queries (quoted phrases, place + topic): "Llandough" history; "Great House Farm" Llandough; "Ty Mawr" Llandough; "Vale of Glamorgan" farm history; Welsh Patagonia settlers / "Gaiman" history; "Penarth" history. Exclude the obvious noise in triage (hospital, parking, jobs).
2. Run the watch every 1-2 hours at most: `python3 tools/mention_watch.py --terms tools/mention_terms.txt` (prints only new items; state in tools/mention_watch_seen.json; 8 s pause between requests; retries one 429 after Retry-After). Reddit unauthenticated feeds rate-limit quickly - keep queries few and runs spaced.
3. Triage each hit in under a minute: is someone asking a question we can answer from a primary record? Is the subreddit's self-promotion rule OK with a link (read the sidebar)? If not, answer without a link.
4. Reply by hand, human-reviewed, value first: the record, its date and holder, one sentence of context; a link to the matching Cedwyn evidence page only where the rules allow and it directly answers the question. Never paste the e-book shop link as the answer.
5. Log hit, reply URL and any profile/site clicks (UTM: utm_source=reddit&utm_medium=community&utm_campaign=answers via tools/utm.py) to the bizdev log.

## How we apply it to Cedwyn
- The watch is read-only and free; it can run inside the existing BIZDEV EXECUTE runs (no new schedule without the project lead).
- Posting on Reddit needs an account and is public speech for the project: drafts of any reply go into the run's HubSpot task for review unless a standing rule allows the run to post. No DMs to strangers. Never name the owner; banned public words apply; no accusations about named people.
- F5Bot: do not sign up the business on the free "personal use" tier; our own script does the same job within Reddit's public feed limits.
- Success = within 2 weeks, 3+ genuinely relevant threads found and answered with a sourced reply, and at least one referral visit logged.

## Tool
- tools/mention_watch.py (written here, standard library only, 0 installs). Terms in tools/mention_terms.txt.

## Sources
- f5bot.com (read 27 Oct 2026)
- okara.ai (read 27 Oct 2026; cites F5Bot tiers page)
- indiehackers.com (snippet)
- hn.algolia.com (public API, tested)