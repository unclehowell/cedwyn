# free growth dashboard in data studio (ex-looker studio): ga4 + search console + one sheet (2026)
harvested 2026-10-27. goal: one live page the owner can open on a phone and see traffic, search, signups and sales together, at zero cost, without hitting ga4 quota errors.

## facts that matter (with sources)
1. **the name changed back.** google renamed looker studio to **data studio** on ~10 apr 2026 ("looker studio is now called data studio" banner on every doc page; google cloud blog "looker studio is data studio"; google developer forum post "data studio is back"). the free tier is unchanged; "data studio pro" is the paid tier (~$9/user/month per kodalogic/mammoth, not needed here). old lookerstudio.google.com links still resolve (not checked on our account).
2. **search console connector: two tables, pick per data source.** "site impression" (query-level, matches gsc totals) vs "url impression" (page-level, also carries discover/googleNews search types). one data source holds one table; for queries and pages side by side, add two data sources to one report (data studio doc "connect to search console").
3. **ga4 quotas are per property, and the dashboard shares them.** current ga4 data api limits for a standard property: core tokens 200,000/day and 40,000/hour per property, **14,000/hour per project per property**, **10 concurrent requests per property** (developers.google.com, read 27 oct 2026). every chart, scorecard and even a drop-down control on a page is a separate request, so a page with 12 widgets opened by two people can trip the "quota exceeded" error (two octobers, nico brooks; piwik pro, 2023 write-up of the original rollout when limits were lower).
4. **fix: the extract data connector.** add data > extract data > pick the ga4 property and only the dimensions/metrics you need; remove "event name" (it skews totals); auto-update daily; date range advanced: end = today minus 1. pulls once a day, dashboard becomes fast and quota-proof; expect <5% variance vs the live ga4 ui, which is normal (two octobers).
5. **owner's credentials** on a data source let others view without their own ga4/gsc access; viewer's credentials make each viewer authorise. for a share-to-owner dashboard, use owner's credentials and share the report "view only".

## the 1-page layout (6-8 widgets max, keeps under the 10-concurrent cap even live)
- row 1 scorecards (vs previous 7 days): sessions (ga4 extract), gsc clicks (site table), newsletter signups (sheet), sales £ (sheet).
- row 2: time series 28 days: gsc clicks + ga4 sessions; table: top 10 gsc queries with clicks/impressions/ctr/position.
- row 3: table: ga4 session source/medium -> key events (uses our utm vocabulary); table: top landing pages -> /ebooks/ clicks.
- one date-range control only. no per-chart filters (each adds requests).

## steps (about 30 min, no install)
1. datastudio.google.com (same google account that owns ga4 + gsc) > create > data source > search console > property > site impression > web > connect. repeat with url impression.
2. add data > extract data > ga4 property > dims: date, session source/medium, landing page; metrics: sessions, key events (named) > auto update daily, end today-1 > save.
3. google sheet "cedwyn-weekly": one tab = date, signups, sales_gbp, orders, source (filled weekly by the growth report script from mailchimp/stripe/gumroad, or by hand). add as a google sheets source.
4. build the layout above; theme: plain, large type, readable at 390 px (data studio has a mobile viewer; check the page on a phone).
5. share > view only > owner's credentials. bookmark the url in the sunday report.

## what not to do
- don't blend ga4 with gsc by url in one chart (blends multiply requests and urls rarely match exactly: trailing slashes, query strings). show them side by side.
- don't use a paid third-party connector (windsor, supermetrics, coupler) — the native ga4, gsc and sheets connectors cover this at zero cost.
- don't read a week's gsc data before ~3 days have passed (gsc data lags ~2-3 days); end ranges at today-3 for gsc charts.

## how we apply it to cedwyn
- data sources we already have: ga4 (behind the en/cy/es consent banner, so it undercounts — see uk-analytics-statistical-exception-duaa-ga4.md), search console (connected; cedwyn property), and the weekly numbers growth-report already computes (cf_traffic.py, the project workspace). the sheet step is the bridge: append the same row growth-report writes to weekly.csv into a google sheet via the connected google workspace (sheets) account.
- add the cloudflare html-200 visitor proxy as a sheet column too, so the dashboard shows ga4 vs cloudflare side by side (the ratio tells us how much consent loss there is).
- build is a reporting change only: no public page change, no spend, no new tool on the box. it needs the owner's google account (the same one connected here). report url goes into growth-report notes for the sunday message; offer it, don't push it.
- not checked: whether a ga4 property id is recorded for cedwyn on this box (grep work/ for G- ids found none in cedwyn-growth/funnel); check before building.

## sources
- docs.cloud.google.com (banner "looker studio is now called data studio", read 27 oct 2026)
- docs.cloud.google.com ; cloud.google.com ; discuss.google.dev (snippets)
- support.google.com (connect to search console, read in full)
- developers.google.com (read 27 oct 2026)
- twooctobers.com (nico brooks, read)
- piwik.pro (2023, read; older lower limits)
- kodalogic.com ; mammoth.io (snippets: pro ~$9/user)