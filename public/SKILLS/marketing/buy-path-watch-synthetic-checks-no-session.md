# Buy-path watch: scheduled, session-free checks that the e-book shop can still sell

Harvested 2026-10-30 (skills harvest). Index check first: 'uptime' 0, 'health check' 0, 'broken buy' 0, 'synthetic' 0 skill hits. Companion to buybutton_check.py (one-off page lint) and payment-link session triage.

## Why it matters
- A shop that cannot take money earns nothing, and nobody notices: Cedwyn has very little traffic, so a broken /ebooks/ page or a deactivated Payment Link can sit unseen for days. Real examples from this project: /terms/ and /refunds/ returned 404 while /shop/terms/ worked (repo sync, 30 Oct); site builds wipe hot patches (the hologram tiles went back, 30 Oct); the project lead reported "That page did not open" (redirect skill). Every one was found by a person, not a monitor.
- Practitioner testimony (Paessler blog, synthetic monitoring): "I've seen it save companies thousands in lost revenue when it caught a broken payment form at 2am, hours before the morning rush." It is a vendor blog, so treat it as a story, not data.
- Uptime checks only answer "does the server reply". Synthetic checks run the steps a buyer takes on a timer and catch a page that loads but cannot sell (UptimeRobot knowledge hub, "what is synthetic monitoring").

## Free tools (facts checked 30 Oct 2026)
- **UptimeRobot Free:** $0, "Good for personal and commercial projects", 50 monitors, 5-minute interval, HTTP/keyword/ping/port monitors, email alerts, basic status page (uptimerobot.com, read). A keyword monitor fails when a string such as "£" or "Buy" vanishes from /ebooks/. Needs an account, which is the project lead's step or a proposal.
- **GitHub Actions schedule:** free on public repos, but best-effort. GitHub's docs (read): "can be delayed during periods of high loads… High load times include the start of every hour… some queued jobs may be dropped." Scheduled workflows are disabled on public repos after 60 days with no activity. Run at odd minutes (e.g. :17), never :00, and don't treat a missed run as an alert.
- **Own script:** tools/buypath_watch.py (stdlib, no install). It lives here and runs on a schedule or by hand.

## The one rule that's easy to get wrong
**Never let the monitor click the buy links.** A GET on a Stripe Payment Link (buy.stripe.com) can open a Checkout Session. Every probe then looks like an abandoned checkout and pollutes the numbers the payment-link session-triage skill relies on. Use two separate checks instead:
1. **Page side (public, cheap):** /ebooks/ answers 200, has a sensible size, shows the price text, and the set of buy links matches the saved baseline. A missing link is a FAIL, a new one is a NOTE.
2. **Stripe side (read-only API):** list payment_links (url, active) through the connected Stripe account. Any linked URL with active=false is a FAIL. No session is created.
Monitors for third-party monitoring products should point at the page, never at buy.stripe.com.

## How to run it
```
timeout -k 5 120 python3 tools/buypath_watch.py                       # first run writes the baseline
timeout -k 5 120 python3 tools/buypath_watch.py --must "£" --stripe-json a temporary folder/plinks.json
timeout -k 5 120 python3 tools/buypath_watch.py --update-baseline     # after a deliberate shop change
```
Exit code 1 means FAIL. Box-tested 30 Oct 08:29Z: /ebooks/ 200, 9 buy.stripe.com links, 0.2 s. A synthetic baseline with a removed link produced FAIL and exit 1.

## Alert design (what practitioners converge on)
- **Two consecutive fails before anyone hears.** Single blips (a deploy, a CDN hiccup) are noise.
- **One alert per incident, plus one "recovered" line.** Don't repeat every 5 minutes.
- **Check right after every site build.** This project's builds overwrite hot patches, so a post-build check matters more than a frequent one.
- **Log every result** (time, status, links, seconds) so a "since when?" question has an answer.

## How we apply it to Cedwyn
1. **Now (no change to anything live):** run buypath_watch.py once and keep the baseline at the project workspace Done in this harvest as a test, in /tmp only, so no baseline is written yet; the first real run writes it.
2. **Fold it into an existing run instead of adding a schedule.** Every extra schedule costs a model turn each time it fires. Add one line to the end of the daily site flywheel and to the P-054-style post-build reapply steps: `buypath_watch.py --must "£"`. A FAIL goes into the project workspace, never straight to the project lead, per his 27 Oct "problems flywheel" rule.
3. **Stripe side:** once a day the same run saves a read-only payment_links list to /tmp and passes it with --stripe-json. No writes to Stripe.
4. **Proposal for the project lead (QUEUE-after-framing):** a free UptimeRobot account with one keyword monitor on /ebooks/ ("£") and one HTTP monitor on the home page. It runs with no model calls and alerts by email. It needs his account or OK. Never a paid plan.
5. **Also check:** /shop/terms/ and /shop/refunds/ (the links the checkout pages show) and the e-book download page each buyer lands on. Pass them with --pages.

## Sources
- uptimerobot.com (read 30 Oct 2026: Free = personal and commercial, 50 monitors, 5-min, keyword monitor)
- uptimerobot.com
- blog.paessler.com (anecdote, vendor)
- docs.github.com (schedule section, read: delays, dropped jobs, 60-day disable)
- Project evidence: repo-hubspot sync report 30 Oct 07:57Z (/terms/ 404; hot patches wiped by builds); payment-link session triage skill (sessions from bots and checkers)