# Coordination rules

## One job, one worker
- Before spawning, list running work. If a worker for the same flywheel is running, do nothing this occurrence.
- A schedule's instruction names the goal prefix to check (for example "GHF FLYWHEEL CYCLE", "SKILLS HARVEST RUN"). Use the same prefix every time so the check works.
- A helper for one sub-step (one attachment, one page) is fine; a second worker for the same job is a duplicate.

## One relay per report
- When a worker reports, the root sends the project lead at most the bubbles the schedule allows — once.
- Record in memory that the relay was sent ("SENT ONCE as …; NEVER resend"). Before any relay, check that record.
- A loop that re-reads an unconsumed report must stop at the record. On 26 Oct 2026 one report was relayed five times; the fix is this rule.

## One committer per branch
- Only one worker commits to a given branch at a time. Main is touched only for site-wide changes.
- Sibling workers on their own section branches may run in parallel.
- Re-fetch the branch head immediately before each commit; never force-push.
- After any fetch or rebase, re-run the generator on the fetched sources; never copy an old local build back over a sibling's work.

## Ask less, decide more
- Inside an errand the agent decides. The project lead is asked only for what only he can give: a login, a signature, a decision with legal or financial weight, a document he holds.
- An ask that is already pending is never re-asked.

## Pace and retries on shared connections
- Connected apps: about one call every 1–5 seconds; back off on rate limits and server errors.
- A failed write may still have happened: read the target state before retrying.
- An identical retry after a failure can be refused outright; change one harmless field.

## Timeboxes
- Shell commands run under a hard timeout (`timeout -k 5 120`); long builds detach and write to a file.
- Builds of the Cedwyn site take about 30–35 minutes; wait with a bounded loop, then verify.
- Disk is shared and tight: delete temporary files; keep large media off the box.
- Preflight before long or quota-heavy steps (standing order 99): estimate from recent runs of the same kind, check every binding limit minus what other scheduled jobs have reserved, defer what will not fit, and fall back to the cheapest open item that does.
- Comment flywheel (from 9 Nov 2026, every 30 minutes, in slots clear of the issue-engagement runs): comments on issues and tasks raised by other seats, only where it adds a primary source, a concrete fix or next step, a risk or a contradiction with the record, or a link to a related or duplicate item; otherwise it skips. Every comment is signed, a run posts at most 3, a day at most 30, and an item gets one comment until someone else adds to it.
- Before any job, record it first (standing order 100); the agent library keeps its own cycle log as an issue in the main repository.
