# Self-hosted analytics (Umami, Plausible CE, Matomo): what each needs, and a gate for Cedwyn

Skill date: 30 Oct 2026 (skills harvest ~23:30Z). Status: DOCUMENTATION ONLY. Nothing installed (disk ~1 GB free). Cedwyn already counts visits with Cloudflare Web Analytics, GoatCounter (cedwyn.goatcounter.com) and the first-party beacon / Workers Analytics Engine.

## What each tool requires (primary docs, read 30 Oct 2026)
| | Umami | Plausible Community Edition | Matomo On-Premise |
|---|---|---|---|
| Licence | MIT | AGPLv3 | GPL |
| Stack | Node.js 18.18+ and PostgreSQL 12.14+ | Docker Compose with ClickHouse; at least 2 GB RAM recommended | Web server, PHP 8.1+, MySQL 8.0+ / MariaDB 10.6+ (Matomo 6) |
| Cookies | None ("no cookies, no surveillance") | None, no personal data | Cookies by default; can be set cookieless |
| Gaps vs paid cloud | Self-host is the same code | No marketing funnels, user journeys, ecommerce revenue goals, SSO or sites API. Releases twice a year. Basic bot filtering only (the cloud also drops ~32K data-centre IP ranges). Community support only. | Full feature set; you run the upgrades |
| Signal | 39.8k GitHub stars, 6,868 commits; covers traffic, campaigns, conversions and revenue; optional MCP endpoint (off by default) | Vendor states plainly: "Self-hosting is a real commitment" (install, upgrades, uptime, backups, security) | Vendor FAQ: consent-free use only with a narrow setup |

- **Matomo on consent** (FAQ, read): it may run without a banner only if tracking is anonymised, uses no cookies, uses passive JavaScript only, and has browser feature detection fully off. In Germany, only server-side tracking (log analytics or the HTTP API) is clearly out of scope. For the UK, see uk-analytics-statistical-exception-duaa-ga4.md: the DUAA 2025 statistical exception, in force since 5 Feb 2026.
- **Not checked:** a third-party snippet states Umami Cloud has a free tier (3 sites, 100k pageviews a month, 6-month retention). Read umami.is/pricing before relying on it.

## The how-to (decision gate)
1. **Self-host only when all three are true:**
   - an always-on server with its own database already exists;
   - a question needs funnels or revenue in one place;
   - GoatCounter plus the beacon can't answer it.
2. **If the gate opens, pick Umami.** It has the lightest stack (Node and Postgres), an MIT licence, no cookies, and funnels and revenue in the free code. Plausible CE leaves funnels and revenue goals out of the free edition, which is exactly what a shop needs. Matomo needs PHP and MySQL plus a careful privacy setup.
3. **Bots.** Self-hosted builds filter bots more weakly than paid clouds, so keep cross-checking human counts as in bot-traffic-human-visitor-count-cloudflare-ga4.md.
4. **Never a second tracker by default.** Each extra script is page weight and another privacy-notice line. Add one only to answer a named question.

## How we apply it to Cedwyn
- **Decision now: don't self-host.** Cedwyn is a static site on Cloudflare. None of the three runs as a static or serverless deploy without a separate server and database. That's our reading of their stated requirements, not tested. The box has no room either.
- The Academy funnel (start, finish, paywall, click, paid) can live in GoatCounter events or Workers Analytics Engine points. See academy-hard-paywall-vs-freemium-free-sample.md.
- Look again only if a funnel question goes unanswered for 2 Sunday reports in a row. In that case, propose Umami on an existing server to the project lead; it would not cost money unless a server is bought.

## Sources
- github.com (README, read)
- plausible.io (CE vs Cloud table, read) · github.com (2 GB RAM note, snippet)
- matomo.org · matomo.org (both read)