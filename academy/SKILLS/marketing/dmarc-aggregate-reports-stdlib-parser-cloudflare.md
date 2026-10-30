# DMARC aggregate (rua) reports: get them free, read them with a stdlib parser, act on them

Harvested 30 Oct 2026. Builds on mailchimp-sending-domain-auth-dmarc-free-from.md (which covers the p=none→quarantine→reject rollout); this file covers **receiving and reading the reports**.

## Facts (primary sources, read today)
- **What a rua report is:** mailbox providers (Google, Yahoo, Microsoft, BT, and others) send a daily XML file, usually .zip or .gz, for every domain whose DMARC record names a `rua=` address. It lists each source IP that sent mail as your domain, the message count, the DMARC/SPF/DKIM results and the disposition. The reports carry **no personal data** (Cloudflare blog, DMARC Management launch). They arrive "fast and furious", so don't point rua at a human inbox.
- **Yahoo** strongly recommends a working rua for bulk senders "to allow monitoring during initial setup" (senders.yahooinc.com).
- **Cloudflare DMARC Management (free, beta; docs updated 5 May 2026):** Dashboard → Email → DMARC Management → Enable. It works on **apex domains only** and needs Cloudflare DNS. If a DMARC record exists, Cloudflare **adds a second rua** (a Cloudflare address built on Email Routing) and keeps the existing tags. The first data can take **24 h**. The dashboard shows DMARC pass/fail over time, each sending source with its SPF/DKIM stats, and per-IP detail, so you can tell a forgotten ESP from a spoofer. It also warns: if an SPF record depends on a CNAME to an external domain, Cloudflare cannot edit it.
- **Free alternatives:** dmarcian's XML-to-Human converter (paste one file). For a self-hosted dashboard, parsedmarc (open source, Python ≥3.10; the full stack wants Elasticsearch/OpenSearch, so it's too heavy for this box).
- **Reading rules of thumb** (Cloudflare blog; RFC 7489 semantics):
  - DMARC passes if *either* the aligned DKIM or the aligned SPF passes.
  - A source where DKIM passes for `mcsv.net` but `policy_evaluated/dkim=fail` is your ESP signing with **its** domain. That's legitimate mail that will be junked or rejected once p=quarantine. Fix it with your own DKIM, not with SPF.
  - A source with nothing passing and a domain you don't recognise is spoofing. Leave it to fail.
  - Only move to `p=quarantine` once 2–4 weeks of reports show every legitimate source aligned.

## Tool (free, written today, nothing installed)
`the project workspace`: Python stdlib only, read-only, no network.
- `python3 dmarc_agg_report.py <file|dir> [--domain bucklerfamily.estate] [--json]`
- Reads .xml, .xml.gz and .zip, strips namespaces, and **dedupes on org+report_id** (providers resend).
- Prints the overall pass % and, per reporter, each source IP with count, disposition, aligned DKIM/SPF, auth domains, a sender label (Mailchimp / Google / Cloudflare routing / HubSpot / Stripe / unknown) and a verdict: `OK`, `FAIL-LEGIT?` (known ESP but unaligned, so fix its DKIM), or `FAIL` (unknown, likely spoof).
- Tested on a synthetic Google-format report: gz + xml duplicates collapsed to 1 report, 20 msgs, 25% pass; Mailchimp row flagged FAIL-LEGIT?, spoof row FAIL.

## How-to
1. Pick the route. **Cloudflare DMARC Management** gives zero files to handle; the dashboard is the readout. Or a **dedicated mailbox** (e.g. a Cloudflare Email Routing address or a Tab mail address) whose attachments are saved and fed to the parser weekly.
2. Publish `rua=mailto:<addr>` in `_dmarc`. If the report address is on another domain, that domain needs the RFC 7489 authorisation record `<yourdomain>._report._dmarc.<otherdomain> TXT "v=DMARC1"`. Cloudflare's own address handles this itself.
3. After 24–72 h: run the parser and list every source by volume. Each `FAIL-LEGIT?` gets its DKIM fixed. Each `FAIL` gets noted (spoof count week on week).
4. After 2–4 clean weeks: p=quarantine pct=25 → 100 → reject (see the Mailchimp skill).

## How we apply it to Cedwyn
- **Live 30 Oct (DoH):** `_dmarc.bucklerfamily.estate` = `"v=DMARC1; p=none;"`, with **no rua**, so today nobody sees who sends as the domain. Mailchimp DKIM CNAMEs are absent (problem P-029).
- **PROPOSAL (DNS change = the project lead's GO; nothing changed today):** enable Cloudflare DMARC Management on bucklerfamily.estate. It's one click in the dashboard; Cloudflare appends its rua and keeps p=none. This is the cheapest route: free, no mailbox, no parsing. bucklerfamily.estate is an apex zone on Cloudflare, so it qualifies. Check the SPF/CNAME caveat first (SPF is currently Cloudflare Email Routing only).
- If the project lead prefers a mailbox route instead: rua to a dedicated Cloudflare Email Routing address, then a weekly run of dmarc_agg_report.py, with one line in the Sunday growth report ("DMARC: N msgs, X% pass, sources: Mailchimp ✓/✗, spoof IPs: K").
- Order of work: rua first (2–4 weeks of data), then Mailchimp DKIM (P-029), then quarantine. Never tighten the policy before the reports show Mailchimp aligned, or the free-chapter mails will be junked at Yahoo/Sky/BT, which all run strict DMARC.
- Problems flywheel: P-029 can cite this file as the measurement route.

## Sources
- developers.cloudflare.com (read, updated 5 May 2026)
- blog.cloudflare.com (read)
- senders.yahooinc.com (read)
- dmarcian.com (snippet)
- domainaware.github.io (snippet, not installed)
- RFC 7489 §7.1 external report authorisation (from standard knowledge, not re-read today)
- Live DNS: cloudflare-dns.com DoH, _dmarc.bucklerfamily.estate, 30 Oct 2026 ~13:26Z