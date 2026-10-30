# Search Console weekly and monthly views: reading a low-traffic site without weekday noise

Written 30 Oct 2026 (skills harvest). Pairs with `search-console-annotations-ranking-update-calendar.md` and `tools/gsc_archive.py`.

## What Google shipped (primary, read)
- Google Search Central blog, 9 Dec 2025 (Moshe Samet, Search Console PM lead): a granularity selector in the Performance report chart, **Daily (default) / Weekly / Monthly**. It works for Search results, Google News and Discover.
- Help 7576553 (read 30 Oct 2026): **Hourly** only in the 24-hour view. **Daily** for spotting issues and spikes (not in the 24-hour view). **Weekly/Monthly** for "longer-term trends by smoothing out daily fluctuations (like those caused by weekends or holidays)" (not in the 24-hour view).
- Google's stated use: comparing "Last 3 months" to "Previous 3 months", where misaligned weekends make daily comparison charts hard to read.
- **Exports change** with the selected granularity: file/tab names, some column headers and sort order. A script that parses exports must read headers, not column positions.
- Rolling out to all properties from 9 Dec 2025. No outside lift numbers exist; this is a reading aid, not a growth lever.
- The API doesn't offer weekly aggregation (dimension `date` is daily), so scripted reports must roll up themselves.

## How to use it
1. **Default to Weekly** for anything under about 100 impressions a day. Daily charts at that volume are mostly zeros and weekday swings.
2. **Compare whole periods only.** A partial current week or month always looks like a drop, so drop it or label it.
3. **Daily is for incidents:** a sudden fall after a deploy, robots or redirect change, or an annotation date. Use Hourly (24-hour view) for a release or launch day.
4. **Monthly for the story:** month-on-month impressions and clicks for a report; it hides single viral days.
5. **Position:** a period's average must be impression-weighted (sum(position x impressions) / sum(impressions)), not the mean of daily averages.
6. **Combine with annotations:** weekly view plus custom annotations (release, documentary door, update dates) shows cause and effect without day noise.

## Tool (ours, stdlib, nothing installed)
`timeout -k 5 120 python3 tools/gsc_weekly.py [--csv the project workspace] [--by week|month] [--min-impr 100]`
reads the daily archive written by `gsc_archive.py` and prints ISO-week (Mon-Sun) or calendar-month totals: clicks, impressions, CTR, and impression-weighted position. It flags PARTIAL periods and thin periods (<100 impressions), and gives the % change vs the previous whole period only when both are above the threshold. Box-tested 30 Oct 2026 on the real archive (22 days):
- W42: 1 impression.
- W43 (19-25 Oct): 5 clicks / 225 impressions / pos 14.1.
- W44: PARTIAL, 2 of 7 days.
- Oct: PARTIAL, 22 of 31 days.
The archive is property totals for the default (web) search type. For Discover or News, pull with `type` set first.

## How we apply it to Cedwyn
- **Reading rule for every Cedwyn report** (Sunday CEDWYN GROWTH REPORT, Monday VISIBILITY CHECK): use weekly totals from `gsc_weekly.py`, whole weeks only, never a partial week vs a whole one. At today's volume (about 32 impressions a day in W43), daily numbers are noise.
- **First real baseline:** W43 (19-25 Oct): 225 impressions, 5 clicks, average position 14.1. The Sunday report from 1 Nov compares each new whole week to it. A % change is quoted only once both weeks are over 100 impressions (W43 is).
- **Release days:** an e-book edition release, documentary door or /learn/ launch gets an annotation (existing skill). The weekly view then shows whether the week after rose. Use the hourly 24-hour view only on the day itself.
- **Exports:** any hand-made CSV export a person pastes into the project workspace must be read by header name, because Weekly/Monthly exports rename columns.
- **Monthly line** for the PRINCE2-style Projects pages and programme office: one row per whole month (October's first full month row is due 1 Nov).

## Sources
- developers.google.com (Google, 9 Dec 2025, read)
- support.google.com (Performance report help, time granularity, read 30 Oct 2026)
- seroundtable.com (snippet only: announced at Search Central Live Zurich)