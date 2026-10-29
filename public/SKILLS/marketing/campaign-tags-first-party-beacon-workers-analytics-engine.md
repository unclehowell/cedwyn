# Campaign tags you can actually read: first-party beacon to Workers Analytics Engine (when GA4 is off)

Date: 2026-10-29 · Harvest run b20ceb26 · Fixes the gap logged as P-038 (every utm_ link since 26 Oct reads as nothing).

## Why the usual routes fail for us
- **GA4 is off** on Cedwyn (GA_ID empty), and turning it on brings the consent question plus ad-blocker loss.
- **Cloudflare Web Analytics will not help:** its FAQ (read 29 Oct) answers "Does Cloudflare Web Analytics support UTM parameters? Not yet … do not log query strings to avoid collecting potentially sensitive data". The same FAQ states its beacon "is blocked by ad-blockers (including adblockplus, Brave, DuckDuckGo extension)".
- **Zone GraphQL on our plan refuses** `clientRequestQuery` and `clientRefererHost` (authz error, 29 Oct and 27 Oct).

## What practitioners measured about blocked third-party scripts
- Marko Saric (Plausible), his own site over 3 trending days: Plausible 50.9k unique visitors vs GA 21.1k, so 58% of a tech audience blocked GA. His earlier study: under 10% on foodie/lifestyle sites, over 25% on tech sites. This is the vendor's own data, via CSS-Tricks (read).
- Chris Coyier, CSS-Tricks, Oct 2021, one week (read): Plausible counted 973k uniques vs GA's 841k (+15%), but 5% fewer pageviews. His conclusion: any third-party JS "is just as easily blockable"; server-side or first-party counting is the different kind.
- **Lesson:** our heritage readers are a lifestyle audience, so expect a low-teens % blocked. Even so, a **same-origin** beacon (`/_a` on cedwyn itself) avoids blocklists aimed at analytics domains, and stores no cookie.

## The free tool: Workers Analytics Engine (Cloudflare docs, read 29 Oct)
- Free plan: **100,000 data points written per day and 10,000 SQL read queries per day**. Paid: 10M writes/month. Billing for this is not switched on yet, per the pricing page.
- Retention is **3 months**. Limits: up to 250 data points per invocation, blobs up to 16 KB per point, index up to 96 bytes, and **only one index per point** (a second index means the point is not recorded).
- `writeDataPoint()` is not awaited; the runtime writes in the background. Fields are positional (blob1..blobN), so keep the order fixed forever.
- Read it through the SQL API: `POST api.cloudflare.com, using a bearer token with **Account | Account Analytics | Read**. Rows can be sampled, so always sum `_sample_interval`, never `count()`.
- It is separate from D1, so the D1 daily read limit (P-037) does not touch it.

## How to do it (smallest version, about 40 lines)
1. **Dataset + binding:** `[[analytics_engine_datasets]] binding = "HITS"`, `dataset = "cedwyn_hits"`, in the Worker or Pages project that serves cedwyn. P-040 found no Worker route on cedwyn.*, so it is likely Pages; check before choosing.
2. **Endpoint:** a Pages Function `functions/_a.js` (only this path runs a Function, so static pages stay free). Code is in `skills/tools/wae_beacon/a.js`: it accepts POST `{p, q, r}`, drops bot user-agents, and writes blobs [path, utm_source, utm_medium, utm_campaign, utm_content, referrer host, country, lang]. No IP, no cookie, no ID.
3. **Client, one line in basecamp.js, on page load only if `location.search` contains `utm_` OR the referrer is external:** `navigator.sendBeacon('/_a', JSON.stringify({p:location.pathname,q:location.search,r:document.referrer}))`. Firing only on tagged or external arrivals keeps writes far under 100k/day.
4. **Read:** `CF_ACCOUNT_ID=… CF_API_TOKEN=… python3 skills/tools/wae_beacon/wae_report.py 7 bizdev`, or `--sql` to print the query. The output is campaign rows sorted by weighted hits.
5. **Check after deploy:** open `/?utm_source=test&utm_medium=check&utm_campaign=wae-smoke` twice, then read with `wae_beacon/wae_report.py 1 wae-smoke`. It should show 2. The Stripe links and /ebooks/ must still answer 200.

## Rules
- Our UTM vocabulary still applies (utm-discipline-ga4-funnel.md, tools/utm.py). Never tag internal links.
- UK PECR: aggregate site-improvement stats with no cookie and no identifier fall under the statistical-purposes exception (uk-analytics-statistical-exception-duaa-ga4.md). Say so in the privacy page in one line.
- Don't store full query strings; store only the five utm_ keys, because other params can carry emails.
- Purchases still come from Stripe and Gumroad exports. This beacon measures arrivals, not sales. Join the two by campaign only in the weekly report.

## How we apply it to Cedwyn
- P-038 hypothesis (1) is this file. The owner of the cedwyn build commits `functions/_a.js`, the binding and the one basecamp.js line in **one commit, when no build-cedwyn run is going** (a push starts build.yml and cancels a running build).
- The API token is a Cloudflare dashboard item. If the connected Cloudflare app can't mint an Analytics Read token, that is a job for the problems queue, not for the project lead.
- The first report answers the open BIZDEV task "15 visits with utm_campaign=bizdev-20261026". From then on the Sunday growth report gets a per-channel arrivals line (YouTube / IG / FB / email / PDF).
- Tag the free PDFs (Enwau, the supplement) `utm_source=pdf&utm_medium=<book>`. They get 21 and 31 downloads a week, and each one's back-page link should show up as its own row.

## Sources
- developers.cloudflare.com (read 2026-10-29)
- developers.cloudflare.com (read)
- developers.cloudflare.com (read)
- developers.cloudflare.com (read)
- developers.cloudflare.com (read)
- css-tricks.com (read; quotes Saric's 58% / <10% / >25%)
- plausible.io (vendor; figures via CSS-Tricks)
- Not run against a live dataset yet: the SQL in wae_report.py follows the docs' syntax but has not been checked end to end.