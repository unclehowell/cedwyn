# security.txt (RFC 9116) for cedwyn.bucklerfamily.estate: a trust file UK institutions already publish

Date: 2026-10-31 · Harvest run (skills) · Status: how-to + PROPOSED file (no commit made)

## What it is
A plain-text file at `/.well-known/security.txt` that tells anyone who finds a problem on the site (a broken form, a leaked file, an injected script) where to report it. It is an IETF standard (RFC 9116, April 2022). It is free, needs no account, and takes 6 lines.

## Evidence (read today unless marked)
- RFC 9116 (rfc-editor.org, read): `Contact` and `Expires` are required, and `Expires` "MUST always be present and MUST NOT appear more than once". It is "RECOMMENDED that the value of this field be less than a year into the future". The file must be served over https with `Content-Type: text/plain; charset=utf-8`. Also: "Not having a security.txt file may be preferable to having stale information in this file". So the expiry date needs a renewal reminder.
- UK institutions publish one (fetched live today):
  - GOV.UK `/.well-known/security.txt` redirects to vdp.cabinetoffice.gov.uk: Contact (a reporting form and gov.uk), Policy, Acknowledgments, Last-Updated 2026-10-26, Expires 2027-01-26 (a 3-month rolling expiry).
  - NCSC: `Contact: mailto:[address kept in the project workspace]`, Encryption, `Expires: 2028-09-11`, Policy, `Preferred-Languages: en`, Canonical.
  - The National Archives (UK): Contact (a reporting form), Policy (disclosure-policy.txt), Canonical, `Expires: 28 Jan 2027`.
  - BBC: a commented file with a disclosure policy.
  - National Library of Wales (library.wales) answered 403 to a script, so not checked.
- Adoption numbers: Poteat & Li, IMC 2021 (via the Wikipedia citation, read) found over 10% of top-100 sites publish one, with the share falling as more sites are counted. CISA (search snippet; page 403 to scripts) puts it at "about a half of a percent" of the top one million sites. Hilbig et al., ACM DTRAP 2023, "security.txt Revisited" (abstract snippet) found "a slight but steady increase" after the RFC, except among the top 100.
- So a small heritage publisher with one is in the same company as the archives and agencies it writes to. That is a quiet credibility signal for institutional readers and security-minded crawlers. No study links it to traffic or sales, and none is claimed here.

## What we checked on cedwyn.bucklerfamily.estate today
- `/.well-known/security.txt`: 404. `/security.txt`: 404.
- The site already publishes a contact address on /privacy/: `[address kept in the project workspace]`. Use only that public address. Add no new personal address.
- No /contact/ page exists (404). /privacy/ exists (200) and can be the Policy link until a disclosure page exists.
- Responses come through Cloudflare. A Worker (agent-ready) already answers `/robots.txt`, `/llms.txt` and `/sitemap.xml` for this host. `/.well-known/mcp.json` is coded in that Worker but returns 404 on cedwyn today, so its routes do not cover `/.well-known/*` here. Side finding for the onpage run (llms.txt does not link mcp.json, so nothing visible is broken).

## Method (any site)
1. Pick a public contact that a person reads (mailto or a form URL). Never a private address.
2. Write the file: Contact, Expires (under 1 year; 3-6 months is the GOV.UK habit), Canonical, Preferred-Languages, Policy if one exists.
3. Serve it at `/.well-known/security.txt` as text/plain utf-8 over https. Optionally mirror or redirect `/security.txt`.
4. Validate: `curl -sI` shows 200 and text/plain; the fields parse; Expires is in the future. A free online checker such as securitytxt.org's form needs no account. Use a script check rather than any paid scanner.
5. Put a renewal date 30 days before Expires into an existing schedule's notes (for example the weekly onpage run), because a stale file is worse than none.

## PROPOSED file (repo path to confirm by the onpage run: the static web root's `.well-known/security.txt`, or one path-exact line in the agent-ready Worker)
```
Contact: mailto:[address kept in the project workspace]
Expires: 2027-04-30T23:59:59Z
Canonical: cedwyn.bucklerfamily.estate
Policy: cedwyn.bucklerfamily.estate
Preferred-Languages: en, cy
```
If the static build drops dot-folders (check whether `.well-known` survives into dist), use the Worker route instead (the same pattern as `/robots.txt`):
```js
if (host === "cedwyn.bucklerfamily.estate" && (p === "/.well-known/security.txt" || p === "/security.txt"))
  return T(SECURITY_TXT); // const SECURITY_TXT = the 5 lines above + "\n"; T already sends text/plain
```
The Worker route needs a Cloudflare route covering that exact path. Adding a route is a deploy, so the root decides. Cloudflare's dashboard also has a built-in security.txt setting. It is not checked whether that is on this plan, and the dashboard is account work, so it is not used here.

## How we apply it to Cedwyn
- Free, no account, no contact with anyone. It is a 5-line file. Deliver as a labelled PR (site-wide) or the Worker one-liner. The root merges or deploys. Never dispatch builds.
- Public text check: the file names no person, holds no banned words, no outbound links beyond its own host, and only the address already public on /privacy/.
- GO note: publishing `[address kept in the project workspace]` in a new place invites reports to that inbox. It is already public, so the root can treat this as a markup change. If unsure, add it to QUEUE-after-framing as a one-line proposal.
- Done when: `curl -sI cedwyn.bucklerfamily.estate returns 200 text/plain, the fields parse, and Expires is in the future. Record the check in the onpage audit, with renewal due 2027-03-31.