# Handling replies to a cold B2B email send (the first 72 hours)

Written 2026-10-27 for the parcels campaign (30 emails to Llandough/Leckwith companies from Gmail).
Sources read today unless marked.

## What the evidence states
- **Most replies come fast and from email 1.** Instantly Cold Email Benchmark Report 2026 (vendor, own platform data, read):
  average reply rate 3.43%, top senders >10%; **58% of all replies come from step 1**, follow-ups add the other 42%;
  Tuesday-Wednesday best, Wednesday highest; best first emails <80 words, one call to action;
  each follow-up must add a new angle, never "just checking in"; bounce rate should stay under 2% (pause and clean above it).
  For 30 sends: expect roughly 1 reply (3.4%), 3 if the copy lands well. A zero-reply day is normal, not a failure.
- **Speed of answer decides whether a reply becomes a conversation.** HBR, Oldroyd/McElheran/Elkington, "The Short Life of
  Online Sales Leads" (Mar 2011; 2,241 US firms audited; figures via snippets, HBR page paywalled, not read in full):
  firms answering within 1 hour were ~7x more likely to qualify the lead than those answering after an hour;
  average first response 42 hours; 37% answered within the hour. Old and US-centric, but the direction is consistent everywhere.
- **Opt-outs are law, not courtesy.** ICO direct marketing guidance, "Respect people's preferences" (read):
  stop marketing that a withdrawal covers "immediately or as soon as possible"; put the address on a **suppression /
  do-not-contact list instead of deleting it** so it is never mailed again by mistake; after an objection you **cannot contact them
  later to ask if they've changed their mind**; you must not swap lawful basis to keep marketing.

## The triage (do it within 1 hour of a reply landing, 08:00-20:00)
| Class | Signal words | Action |
|---|---|---|
| OPT_OUT | "remove", "unsubscribe", "not interested", "don't email", "stop" | Add to suppression.csv now; one short courteous ack only if they asked a question ("Done, you won't hear from us again"); mark HubSpot ticklist "opted out". Never mail again, never "one last thing". |
| HOSTILE / LEGAL | "solicitor", "harassment", "defamatory", "cease", "legal action" | Suppress at once. Do **not** reply from the box. Flag to the project lead the same hour with the verbatim text; any answer is his. |
| QUESTION / POSITIVE | "tell me more", "which parcels", "how do I", a question mark | Draft an answer under 120 words that answers only what was asked, links one page (/parcels/ or /ebooks/), and asks nothing back except an optional next step. the project lead's sign-off. |
| REFERRAL | "speak to", "forwarded to", "our landlord/agent" | Thank them; do not cold-mail the referred person unless they are a company role address that passes the PECR check; log the referral. |
| AUTO / OOO | "out of office", "automatic reply", "on leave" | No action; do not count as a reply; no follow-up before their return date. |
| BOUNCE | mailer-daemon, "address not found", 550 | Mark invalid; if bounces pass 2% of sends (1 of 30 already = 3.3%) pause the batch and re-verify the remaining addresses. |

Rules of tone: thank, answer, stop. No argument, no pressure, no repeating the concern louder. A reply is a person
giving you attention; the job is to make the next step easy, not to win.

## Follow-ups (only for non-repliers, never for opt-outs)
- At most 2 follow-ups to a company role address, 4-7 days apart, each with a *new* fact (e.g. a new record on /parcels/,
  a free chapter) and the same opt-out line. Stop at the first reply of any kind.
- Same thread (reply on the original), plain text, <60 words.

## Measure
reply rate = human replies / delivered (exclude OOO and bounces); positive rate; opt-out rate; median minutes to our first answer.
Log in the project workspace (class, received_at, answered_at).

## How we apply it to Cedwyn
1. Run `python3 the project workspace <file-or-stdin>` on each reply body; it prints the class and,
   for OPT_OUT/HOSTILE, appends the address to the project workspace (dedup). It is a first pass: read every reply.
2. The email ingest run (every 2 h) and the morning brief should surface any parcels reply; a QUESTION/POSITIVE reply
   is drafted as a HubSpot task the same hour, sent from the project lead's Gmail only within the parcels errand he approved.
3. HOSTILE/LEGAL replies go to the project lead verbatim, never answered.
4. Expect ~1 reply from 30; judge the campaign on /parcels/ visits with utm_campaign=parcels and e-book sales, not replies alone.
5. Follow-up 1 earliest Mon 2 Nov, only with a genuinely new item on /parcels/.

## Sources
- instantly.ai (read 27 Oct 2026)
- hbr.org (snippets only)
- ico.org.uk (read)