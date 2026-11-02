# Changelog

## v1.1.0 (2 Nov 2026)
Each traffic class has one fixed colour on every graph: humans green (#228833), bots and crawlers orange (#D55E00), automation
purple (#AA3377), own tools blue (#4477AA), from a colour-blind-safe set, with a legend under the title. The summary bars, the
edge breakdowns (hours, days, hostnames, devices, countries, status codes) and the browser-beacon graphs (visits, page views, top
pages, referrers, hostnames, countries, devices, browsers, operating systems) are now stacked by class. 18 of 19 graphs are split;
unique visitors per day stays one colour because Cloudflare counts unique visitors per day only, with no browser string. Grey marks
traffic that could not be classified (7-day breakdowns: browser strings seen only earlier in the week; days before the class history
in the webapp database was filled). New table cls_day keeps the per-day class totals. MCP tools carry class_colours.

## v1.0.0 (2 Nov 2026)
First version (webapp 45 of 59): website analytics for bucklerfamily.estate and its subdomains as graphs only. Visits, page views,
unique visitors and requests per day; page views per hour; top pages; referrers; hostnames; countries; devices; browsers;
operating systems; status codes; humans and bots. The shared header with the slot number, its own SQLite database, WebMCP and MCP
tools, and the agent guest book in the footer, collapsed by default. Address: bucklerfamily.estate/analytics.
