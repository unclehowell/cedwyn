# Pre-send hold: draft, cool off, re-read the thread, then send (regret-proof outreach)

Topic: a send discipline for case and institutional outreach from a personal Gmail, so a mistaken email never leaves in the first place. Written 31 Oct 2026 after 21 emails went out in one evening and a review rated 8 of them REGRET (payment offers, a chase that ignored an answer already given, accusatory wording, and one bounce).

## The evidence (read 31 Oct 2026)
- Regret is the norm, not the exception: 88% of workers say they have regretted the contents of a work email right after hitting send, and about 1 in 5 Gen Z office workers (18-24) "very often regret" what they send (CNBC Make It, 14 Apr 2024, reporting a Babbel survey; read). The two named causes: typos and unclear messaging.
- The practitioner fix in the same piece (Christina Gialleli, Epignosis; Esteban Touma, Babbel): do not reply under stress; save as a draft and revisit "with a fresh perspective after some time has passed"; check the email against GROW: Goal (what is this for?), Reality (does it match what has actually happened?), Options (does it give them a way forward?), What next (is the next step explicit?). Non-urgent replies inside 24 hours count as courteous, so a cooling-off hold costs nothing.
- Gmail's own brakes (Gmail Help, read): Undo Send has a cancellation period of 5, 10, 20 or 30 seconds (Settings > See all settings > General > Undo Send). Schedule Send holds a message until a chosen time, with up to 100 scheduled emails at once, all visible and editable under Scheduled.
- Not checked: whether Undo Send or Schedule Send apply to mail sent through an API or an automation rather than the Gmail web or app UI. Assume they do not. An automated send has no undo window, so the hold has to sit before the send step.

## The playbook
1. One writer, one sender. An email for a body goes out only from a reviewed draft, never from a script's template directly. Tonight's three unexplained 20:08 sends came from automation nobody meant to fire.
2. Thread first, every time. Before sending, re-read the whole thread, both directions. Then ask:
   - Has our question already been answered?
   - Is there an open deadline of theirs that we would be chasing before it falls due?
   - Did the last reply help, so that a sharp tone would now be wrong?
   - Is there a reference or case number we must quote?
3. Cooling-off hold. Draft today and send tomorrow morning (Schedule Send, or a dated send run). Never send case mail between about 19:00 and 07:00: late-evening batches are where tone slips.
4. Red-flag scan before every send. Hold the email if it has any of these:
   - any money words (pay, fee, charge, quote, invoice, cost, cheque);
   - accusatory words (deception, concealment, cover-up, threat, legal action, "further steps");
   - URGENT in a subject;
   - "not asking for X" followed by asking for X;
   - a deadline we impose;
   - private family details;
   - agent artefacts (changelogs, "Tab", placeholders, HubSpot headers);
   - the old footer URL.
5. GROW line. Each email states its goal in its first two sentences and its one next step at the end.
6. Undo window as a last net. Set Gmail Undo Send to 30 s on the account, for the cases where the project lead sends by hand.
7. One at a time. No batches: send about 60 s apart, and stop the run at the first bounce or the first auto-reply that changes the picture.
8. Log the send with the thread id, so any correction can quote it in-thread.

## How we apply it to Cedwyn (proposals only; nothing changed in Gmail)
- The Monday 2 Nov avoid-regret send run already follows steps 2, 7 and 8. Add the step 4 red-flag scan as a hard gate in its loop: any hit means skip and log, not send.
- Settings change in the project lead's Gmail (Undo Send 30 s) is a write in his account. PROPOSED only, for the project lead to do himself (Settings > General > Undo Send).
- The drafts engine, correspondence flywheel and contacts flywheel: add the send-window rule (no case sends 19:00-07:00 London) and the red-flag word list to their RUNNER.md send gates. PROPOSED.
- The three 20:08 automation sends: find which script or schedule fired them and remove any direct-send path that skips HubSpot review. This is a problems-queue item if it is not already one.
- Never-pay rule: the money-word scan is the guard that would have stopped the Companies House, Mount Stuart and Glamorgan Archives emails.

## Sources
- cnbc.com (read 31 Oct 2026)
- support.google.com (Undo Send 5/10/20/30 s; read)
- support.google.com (Schedule Send, up to 100 scheduled; search snippet of the help page)
- Internal: the project workspace (21 sends: 8 REGRET / 8 MINOR / 5 OK)