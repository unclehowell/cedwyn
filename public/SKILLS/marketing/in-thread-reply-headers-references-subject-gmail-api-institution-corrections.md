# In-thread replies that actually land in the thread (automated Gmail sends to institutions)

Skill harvested 2026-10-31 ~21:12Z. Topic: email outreach mechanics for UK institutions; reply threading for correction/follow-up emails sent by automation.

## Why it matters
A correction or follow-up that arrives as a NEW conversation reads as a fresh, unconnected email: the recipient (often a shared FOI/records inbox with a case-management system) may log it as a new request, a new ticket number, a new 20-working-day clock, or miss that it withdraws an earlier message. The whole point of an "avoid-regret" correction is that it sits directly under the email it corrects.

## The rule (primary source: Gmail API docs, "Manage threads", last updated 2026-09-10, read 31 Oct 2026)
For a sent message to join an existing Gmail thread, ALL three must hold:
1. The request carries the target `threadId` (in the message resource you send).
2. `References` and `In-Reply-To` headers are set per RFC 2822 (now RFC 5322 s3.6.4):
   - `In-Reply-To:` = the `Message-ID` header of the message you are replying to (the last message in the thread you are answering - usually their reply, or your own sent message if they never replied).
   - `References:` = the parent's own `References` value (if any) followed by the parent's `Message-ID`, space-separated, angle brackets kept.
3. The `Subject` matches: same subject text, optionally prefixed `Re: ` (do NOT edit the subject to "Correction: ..." - change of subject is the commonest reason a reply splits off; put "Correction" in the first line of the body instead).
Docs quote: "The References and In-Reply-To headers must be set in compliance with the RFC 2822 standard. The Subject headers must match."

Practitioner testimony (r/emaildeliverability, 2026 thread "Gmail threads on References plus a matching subject, not..."; snippet read via search, page not fetched): a sender found replies split until both the References chain and subject were right - the threadId alone was not enough.

Note: threadId only controls YOUR Gmail view. The RECIPIENT's client (Outlook/Exchange, Microsoft 365 at most UK public bodies; ticketing tools like Freshdesk/Zendesk/iCasework) threads on In-Reply-To/References and subject (and some ticket systems on a [ref:...] or case number in the subject). So the headers + unchanged subject are what keep it on their case. (Exchange/ticket behaviour: general knowledge, not checked against vendor docs this run.)

## How-to checklist (per email)
1. Fetch the thread (read-only) and pick the parent = the newest message in the thread you are responding to.
2. Read the parent's `Message-ID`, `References`, `Subject`, `From`, `Reply-To`.
3. Build: To = parent's Reply-To if present, else the address the thread is with (never a new guessed address); Subject = `Re: ` + original subject (no double `Re: Re:`; keep any case/ticket reference such as `[CAS-356384]` or `COH2382411X` exactly); In-Reply-To = parent Message-ID; References = parent References + parent Message-ID.
4. Send with the thread's `threadId`.
5. VERIFY after send: re-read the sent message - its `threadId` must equal the target thread, and its headers must show In-Reply-To. If it came back with a new threadId, log it as "split" (do not resend - a second copy is worse; note it for a human).
6. If using a wrapper tool (e.g. a connected-apps "reply to thread" action) rather than raw messages.send, read its parameter list first and confirm it sets In-Reply-To/References; if it only takes thread_id + body, test once on a thread to the project lead's own address before the batch.
7. Bounced thread (5.1.1): don't reply into the dead thread; new email to the published address with a one-line "resend of my email of 31 Oct which bounced" (see hard-bounce-5-1-1-institution-published-address-recovery-resend-once.md).

## Red flags
- Subject edited ("URGENT", "Correction", "Follow-up") -> splits on many clients and reads as escalation.
- Replying to the ORIGINAL first message when the institution has since replied -> answers out of order and ignores their reply.
- Quoting the whole earlier thread including agent artefacts or old footer -> keep the quote to the message being corrected, or none.
- Ticket number missing from the subject -> may open a new case.

## How we apply it to Cedwyn (PROPOSED - no runner, schedule or send route changed)
- Mon 2 Nov avoid-regret run (schedule 2aac2c06): for each correction, set parent = newest message in the thread (e.g. Companies House: their 20:11Z auto-ack is in the thread; the parent to answer is our 20:08 email or their 30 Oct substantive reply - choose the message being corrected, and keep subject unchanged with "Re: ").
- Put "Correction to my email of 31 October" as the body's first line, not in the subject.
- Post-send verify step (threadId equal + In-Reply-To present) logged per task in HubSpot as one line: "threaded: yes/no".
- Before the first live send, one test reply on a thread with the project lead's own address to prove the tool threads (send-to-self is not outreach; still only if the run's own rules allow it - otherwise read-back verification only).
- Correspondence flywheel drafts: store the parent Message-ID and exact subject in each HubSpot draft body ("REPLY-TO PARENT: <Message-ID> | SUBJECT: Re: ...") so whoever sends Monday has them.

## Sources
- developers.google.com (read 2026-10-31; criteria quoted above)
- RFC 5322 s3.6.4 Identification fields (In-Reply-To / References) - rfc-editor.org (standard, not fetched this run)
- reddit.com (search snippet only; page not fetched)
- stackoverflow.com (search snippet; practitioner Q&A)