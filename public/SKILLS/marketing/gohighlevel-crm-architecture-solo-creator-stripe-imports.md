# GoHighLevel CRM architecture for a one-person creator business (pipelines, tags vs fields, Stripe, imports)

Written 2026-10-27 by the skills harvest, the day the project lead asked for GHL for sales and marketing (HubSpot stays for FOI/projects). Sources are HighLevel's own help centre (primary docs, read today) plus practitioner threads; no controlled study of CRM structure exists, so the numbers here are prices and limits, not lift assertions.

## The rules that matter

1. **One pipeline per offer journey, stages = buyer actions, not your tasks.** HighLevel's Pipeline Stage Changed trigger fires when an opportunity "progresses, regresses, or is reassigned" (help article 155000002493, read). So each stage should be a state you want an automation for: `Signed up (free)` -> `Bought v0.0.2` -> `Bundle` -> `Academy trial/member` -> `Lapsed`. A stage nobody automates is clutter.
2. **Tags for events and segments, custom fields for attributes, stages for state.** Practitioner rule from a GHL builders' group (Facebook, 2026 snippet): "Using 300 GHL tags to represent every business state is not an automation architecture. Use custom fields for attributes, pipeline stages for..." Keep tags short and namespaced: `src:parcels`, `src:ebook-free`, `lang:cy`, `consent:marketing`, `buyer:documentary`. Put values (first purchase date, edition owned, Stripe customer id, language) in custom fields.
3. **Order Submitted is not Order Form Submission.** HighLevel (article 155000004303, modified 3 Dec 2024, read): Order Submitted fires on an actual payment; Order Form Submission fires on a form with order fields "but may not necessarily indicate a completed transaction". Thank-you mail hangs off payment triggers only.
4. **Payment Received only sees payments made through HighLevel.** Article 155000003534 (modified 15 Apr 2026, read): it fires on payments "through your HighLevel account" (funnels, invoices, calendars, memberships, forms, manual entries). Our sales run on **Stripe Payment Links outside GHL**, so they will NOT trigger it. Two honest routes:
   - Inbound Webhook trigger (a *premium* trigger): 100 free executions per sub-account once premium actions are enabled (article 48001237383, read); beyond that practitioners report $0.01 per execution or the Workflow Pro add-on, 10,000 executions for $10/month (r/gohighlevel 2024 thread, not checked against the current price page). A Stripe webhook -> small relay -> GHL inbound webhook costs real money past 100/month. **Zero-spend rule: needs the project lead's OK before switching on.**
   - Free route: our existing scheduled sync reads Stripe and upserts contacts/opportunities through the GHL API or a CSV import; latency of minutes, cost nil.
5. **Duplicate opportunities are one switch for the whole sub-account.** "Allow duplicate opportunities" lives in Business Profile settings and applies to every pipeline (ideas.gohighlevel.com thread; FAQ 155000002000, read: without it one contact cannot sit on two opportunities). A buyer who is both an e-book buyer and an academy member needs it ON, or use one "Customer journey" pipeline.
6. **Workflow settings before first publish:** Allow Re-entry (off for welcome/thank-you, on for repeat purchases), Stop on Response (on for anything human-sounding), Time Window and contact timezone (article 48001239875, read).
7. **CSV import gotchas (articles 155000003905 and 48001223155, read):** admin only; under 30 MB; one sheet; header row first; every row needs Name, Email or Phone; no duplicates inside the file; phones without spaces/dashes; dropdown values must match exactly; Owner must be a real user email; one note per contact, 5,000 characters. **A `DND` column sets Do Not Disturb on ALL channels** (SMS, email, calls, voicemail). That is exactly right for suppressed / opted-out parcels contacts; for channel-specific DND use tags + a workflow instead.

## Setup order (one afternoon once the account exists)
1. Sub-account "Cedwyn"; timezone Europe/London; sending domain authenticated (reuse our SPF/DKIM/DMARC skill).
2. Settings -> custom fields (contact): `edition_owned`, `first_purchase_at`, `stripe_customer_id`, `language`, `consent_basis` (consent / soft opt-in / corporate B2B), `source_campaign`. Opportunity: `offer`, `price_gbp`.
3. Pipelines with stages as in rule 1; decide the duplicate-opportunity switch first.
4. Tags list written down before any import (namespaced, ~20 max).
5. Run `tools/ghl_csv_check.py` on every CSV; import contacts first, then opportunities.
6. Workflows: new buyer -> thank-you (immediate) -> academy upsell (+3 days, stop if tag `academy:member`). Every marketing mail carries the opt-out line; suppression list imported with `DND=true`.
7. Test with one internal contact through every trigger before any real contact enters.

## How we apply it to Cedwyn
- Pipelines: E-book (free v0.0.1 -> £4.99 v0.0.2 -> £19.96 bundle), Academy (£49.99/month), Documentary (£4.99), Parcels campaign (Emailed -> Replied -> Interested -> Not interested/Opted out), Bizdev partners.
- Parcels contacts already opted out or suppressed go in with `DND=true`; companies only, never sole traders (PECR), as the parcels send already enforces.
- Stripe sales: keep the free scheduled sync; the inbound-webhook route is a PROPOSAL for the project lead because it can bill past 100 executions.
- HubSpot is untouched: FOI, case and research correspondents never enter GHL (check `src:` tags on every import).
- Check: after import, smart-list count per tag equals the CSV counts; 0 contacts in GHL whose email is in the HubSpot-only exclusion list.

## Sources
- help.gohighlevel.com (read 2026-10-27)
- help.gohighlevel.com (read)
- help.gohighlevel.com (read)
- help.gohighlevel.com (read)
- help.gohighlevel.com (read)
- help.gohighlevel.com (read)
- help.gohighlevel.com (read)
- help.gohighlevel.com (read)
- reddit.com (snippet: Workflow Pro $10/month, 10,000 premium executions, then $0.01; not checked)
- facebook.com (snippet: tags vs fields vs stages; not opened)