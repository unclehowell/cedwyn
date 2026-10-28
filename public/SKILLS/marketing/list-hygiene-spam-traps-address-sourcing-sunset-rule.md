# List hygiene: spam traps, sourcing addresses, and a sunset rule for a small list

Topic: keeping both our lists clean so mail keeps landing: the Mailchimp reader list, and the institution addresses the contacts/correspondence flywheels collect for HubSpot drafts. `cold-email-deliverability-uk-pecr.md` already states "MX check, suppress hard bounces". This skill adds why (trap types), where addresses may come from, and when to stop mailing someone. Re-engaging the quiet ones is in `email-winback-reactivation-series-mailchimp.md`, and checking placement in `inbox-placement-checks-mailtester-seed-headers.md`.

## Evidence (read 28 Oct 2026)
- **Spamhaus**, "Spamtraps – fix the problem, not the symptom" (primary, read):
  - **Seeded traps** are scattered "in webpage source code, for example". Hitting one shows the sender is scraping addresses or buying scraped lists.
  - **Typo-domain traps** catch mistyped sign-ups. Spamhaus' fix is confirmed opt-in "at the data collection point".
  - **Dead-address traps** were once-valid addresses. They hard-bounce "for a period of time, often 12 months or more", then are "silently turned back on" as traps.
  - Spamhaus' line: traps flag poor permission and list management, so fix the source, not the symptom.
- **Gmail sender guidelines FAQ** (support.google.com, read): keep the spam rate below 0.1% and never let it reach 0.3%. Enforcement on non-compliant traffic has been ramping up since Nov 2025.
- **HubSpot**, "Create a Sunset Policy" (practitioner blog, read):
  - Their built-in "Unengaged contacts" list is people who never opened 10 or more emails, or didn't open the last 16 consecutive sends.
  - Method: split the list by last engagement (0–30, 31–60, 61–90 days…) and send the same email to every bucket.
  - Their example day (3 Mar): 8.2% opens in 0–30 against 1.1% in 31–60. That's one sender on one day, a single illustration.
- **Mailchimp:** Apple Mail Privacy Protection inflates opens. Mailchimp reports can exclude MPP opens (Mailchimp MPP FAQ, title and snippet only; a Mailchimp user on Reddit saw opens fall about 3% with it on). So "opened" is a weak signal. Use clicks, replies and purchases.

## The rules
1. **Sourcing (institutions, HubSpot).** Take an address only from the body's current official contact, FOI or press page, or from a reply they sent us. Record the page URL and the date read.
   - Never take addresses from page source, old PDFs or minutes more than 2 years old, staff lists, or guessed name patterns. Page source is exactly where seeded traps live, and an old staff address is the dead-trap pipeline.
   - Prefer role addresses: foi@, enquiries@, archives@.
2. **Bounces.** A hard bounce goes on the permanent suppression list the same day, with date and reason. It is never retried later, even months on: a year-old dead address can come back as a trap. Find the role address instead.
   - Soft bounces: 3 in a row means treat it as hard.
3. **Before each batch,** run `tools/addr_hygiene.py batch.txt --suppress suppression.txt`. It flags bad syntax, typo domains (gmial.com → gmail.com), domains with no MX or A record (via Cloudflare DNS-over-HTTPS, free), role vs personal, and already-suppressed addresses. Fix or drop every flagged address. Verified 28 Oct on a 6-address test: 4 caught.
4. **Reader list (Mailchimp).** Keep double opt-in (confirmed opt-in) on the form. It is Spamhaus' named fix for typo traps, and it's already how our one confirmed subscriber joined.
5. **Sunset rule.** Write it now; it applies once the list reaches 200 contacts or 6 months after the first newsletter, whichever comes first.
   - **Engaged** means a click, reply or purchase in the last 120 days. Opens don't count (MPP).
   - After 10–15 sends with no engagement, the subscriber gets the 3-email win-back series.
   - Still nothing: archive them in Mailchimp (the billing effect of archiving isn't checked), never delete. Their unsubscribe history stays.
   - Re-check after each send: the spam rate in Google Postmaster Tools should stay under 0.1%.
6. **Never buy, rent, swap or scrape a list.** That includes "free" heritage-society member lists. Newsletter swaps (`newsletter-cross-promotion-swaps.md`) mean the other editor mails their own list.

## How we apply it to Cedwyn
- **Contacts and correspondence flywheels:** their RUNNER.md files don't mention bounces (grep, 28 Oct: 0 hits in contacts-flywheel/RUNNER.md). Proposed for the root, not edited by this run:
  - add a `suppression` array to contacted.json (address, date, reason);
  - add an "address source URL + date read" field to each new HubSpot draft task;
  - run `addr_hygiene.py` before any draft is marked READY.
- **Email ingest** can append hard-bounce notices (mailer-daemon replies to the project lead's own sends) to that suppression list read-only.
- **Mailchimp:** confirm double opt-in stays on for the Cedwyn signup form. Turn on "exclude MPP" in reports, and judge sends on clicks to the UTM'd /ebooks/ link. The sunset rule is dormant until 200 contacts (today: 1 confirmed, growth report 25 Oct).
- Nothing here sends mail. Every send stays the project lead's, from HubSpot drafts.

## Sources
- spamhaus.org (read 28 Oct 2026)
- support.google.com (read 28 Oct 2026)
- blog.hubspot.com (read 28 Oct 2026)
- mailchimp.com (search snippet only) and reddit.com (snippet, one user)
- Tool: tools/addr_hygiene.py (own, stdlib + Cloudflare DoH JSON; read-only)