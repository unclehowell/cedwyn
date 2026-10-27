# Lawful society sourcing from the Charity Commission register (PECR class from legal form)

Harvested 2026-10-27 09:13Z. This answers "find history societies to contact without scraping personal emails". The Charity Commission for England & Wales publishes a **daily open-data extract** (Open Government Licence v3.0), and Welsh charities are on it. Each row carries the charity's **own published contact email and website** plus its **legal form**. Under PECR, the legal form decides whether unsolicited marketing email is allowed at all.

## The facts (with sources)
- **Register download page (read 09:10Z):** a daily extract in JSON and tab-delimited formats. The `charity` table zip was 44 MB, `charity_area_of_operation` 4.4 MB, and `charity_classification` 7.7 MB, all last modified 27 Oct 2026 01:09 GMT.
- **Fields used:** `charity_name`, `charity_activities`, `charity_registration_status`, `charity_contact_email`, `charity_contact_web`, `charity_contact_postcode`, `charity_company_registration_number`, `charity_is_cio`, `latest_income`, and from the area table `geographic_area_description` (e.g. "Vale Of Glamorgan", "Cardiff").
- **ICO B2B marketing guidance (read 09:11Z):** "corporate subscribers" are corporate bodies with separate legal status: companies, LLPs, Scottish partnerships and some government bodies. Marketing email to them is allowed with identification and an opt-out. "Sole traders; certain types of partnerships ...; and other **unincorporated bodies of individuals**" are individual subscribers, which means **no marketing email without consent or the soft opt-in**. The page is flagged as under review after the Data (Use and Access) Act.
- **Mapping:** CIO or charitable company (has a company number) = corporate subscriber. Unincorporated association or trust = treat as an individual subscriber. Most local history societies are unincorporated. Email them only if they have opted in.
- **Post is outside PECR**, though UK GDPR still applies if a letter is addressed to a named officer. Whether a website contact-form submission counts as "electronic mail" under PECR is not settled; I found no ICO statement on it. Treat it as consent-needed for marketing; a genuine talk *enquiry* that asks a question is a judgment call for the owner.

## Tool (written this run, stdlib only, no install)
`the project workspace`. It streams the two zips without unzipping, filters to registered, unlinked charities operating in the chosen areas whose name or activities match heritage keywords, and outputs CSV columns: charity_no, name, form (CIO / company / unincorporated or trust), pecr, public_email, web, postcode, income, activities. The zips are deleted afterwards (use `--keep` to retain them, `--areas "Vale Of Glamorgan,Cardiff"` to change the areas, and `--kw` to supply your own regex).
`timeout -k 5 120 python3 tools/charity_society_finder.py --out ../outreach/heritage-charities-vale-cardiff.csv`

**First run (09:12Z, Vale of Glamorgan + Cardiff):** 35 matches, 10 corporate, 33 with a published email. The keyword match on activities text pulls in some unrelated charities (choirs, community groups), so **a human relevance pass is required**.
- **Corporate (email allowed, with opt-out):** Penarth Civic Society (CIO 1182348), South Wales Aviation Museum (CIO 1203288), Aviation Heritage Foundation Ltd (1127909), Panavia Tornado Preservation Group (CIO 1163207), Ruperra Conservation Trust (company 1054796).
- **Unincorporated (no cold email; post, or wait for their opt-in):** Cardiff Archaeological Society (225579), Llantwit Major Local History Society (256883), Cardiff Civic Society (517544), Cowbridge & District Museum Trust (517702), Friends of the Glamorgan Heritage Coast (519187), Friends of Llancaiach Fawr (1010180), Glamorgan Family History Society (1059537), Cowbridge History Society (1094061), Friends of Cathays Cemetery (1138931), Cardiff Museum Development Trust (1135241).
- **Gap:** societies that aren't registered charities (income under £5,000 doesn't require registration) won't appear, and no Marconi group showed up in these two areas. Re-run with `--areas` widened to neighbouring authorities. A "Wales"-level area value is not checked.

## How-to
1. Run the tool weekly and diff against `outreach/` and HubSpot so nobody is contacted twice.
2. Do the relevance pass by hand: keep history, archaeology, civic, museum and family-history groups.
3. **Corporate rows:** a HubSpot draft to the published role address. Identify the sender, include one relevant hook (for example, Penarth Civic Society gets the Penarth/Llandough material) and a one-line opt-out. The owner sends it from his Gmail; drafts only.
4. **Unincorporated rows:** a short printed letter, or an offer to give a free talk, sent by post. Their programme secretary can then opt in, for example by booking. Never put them on an email list.
5. Never put personal-looking published addresses (a named person's gmail) on a marketing list, even for corporate rows. Use the website's role address or post instead.
6. Record the legal form and source date in the CSV so the lawful basis can be shown later.

## How we apply it to Cedwyn
- Today's marketing list for the "Welsh history / Penarth / Llandough / roundhouse" hooks: the 5 corporate rows go to HubSpot drafts for the owner to send; the 10 unincorporated ones get a letter or talk offer (see `civic-local-history-society-talks-penarth.md`, `cowbridge-history-society-talk-route.md`, `family-history-society-journals-forums.md`).
- Keep this list separate from the research/disclosure correspondence. These are sales and marketing contacts only.
- This replaces LinkedIn scraping entirely: the data is open, licensed and published by the organisations themselves.

## Sources
- Charity Commission, Full register download (read 27 Oct 2026): register-of-charities.charitycommission.gov.uk
- ICO, Business-to-business marketing (read 27 Oct 2026): ico.org.uk
- Related: `cold-email-deliverability-uk-pecr.md` (send volumes, deliverability)