# GitHub Issues-first workflow

## Authority

GitHub Issues are the canonical work ledger for Cedwyn project work across the repositories. An issue carries the deliverable's scope, owner, priority, state, dependencies, decisions, blockers, acceptance criteria and links to implementation evidence.

Pull requests, commits, Actions checks, previews and deployment records substantiate the work. They do not silently replace the issue's acceptance criteria.

The Academy's work feed is a discovery index. It may identify useful jobs, but issue ownership, progress and completion are determined by GitHub.

## Start or claim work

1. Search the relevant repository and linked repositories for an existing issue that covers the deliverable.
2. If an issue exists, reuse it. Comment with agent identity/version, UTC timestamp, intended scope, planned branch and current next action. Assign the issue where appropriate. Do not create a second task just to claim it.
3. If no issue exists, create one with the Agent work item form. Include a meaningful title, purpose, scope/exclusions, owner, repository/branch, dependencies, measurable acceptance criteria and a verification plan. An Academy job ID may be included as a discovery reference only.
4. Keep one issue per independently completable deliverable. Use linked issues for work with separate owners or acceptance criteria; avoid one catch-all issue for unrelated projects.

## Keep the issue current

Use the GitHub issue's open/closed state honestly. Active, blocked, waiting and review work stays open. Add comments for material transitions, decisions and blockers using a short status line, for example:

- READY — no work has started; scope and acceptance are clear.
- IN_PROGRESS — work is actively being performed.
- BLOCKED — name the missing dependency or decision and the action needed to unblock it.
- WAITING — identify the person/system/event/date awaited without exposing private correspondence.
- REVIEW — link the PR and list the remaining review/verification gates.

Record the next action and the relevant commit, PR or check link. Do not use a HubSpot task status or a JSON work-feed value as a competing project state.

Close the issue only when the acceptance criteria are met. For code, link the PR and use a closing reference only when it fully resolves the issue. For deployments, distinguish source commit, successful build, production deployment and live visitor verification.

## Privacy boundary

The GitHub repositories are public. Never put the following in an issue, comment, branch, commit message, PR, workflow artifact or public report:

- Email or message body text.
- Private names, contact details, personal data or private message/thread/CRM identifiers.
- Confidential source material, private attachments, credentials or access tokens.
- Recipient-specific correspondence history, private legal strategy or case-specific factual narrative.

HubSpot is a private correspondence store for complete recipient-facing drafts and exact-version correspondence review records. It is not the general project board. Public GitHub may contain only a generic engineering or process summary where necessary. Do not include a private CRM record link or ID in a public issue.

## Reports and sync

Public highlights and dashboards are derived from GitHub's allowlisted issue fields. GitHub is the source; reports are outputs. Any future automation must be deterministic, privacy-filtered, idempotent and fail closed on ambiguous matches. It must not import private HubSpot content or let an Academy/report snapshot overwrite issue state.

## Completion evidence

Before closure, record the checks appropriate to the change: tests, lint, workflow run, preview, production version and live inspection. Report incomplete verification honestly. A green build is not proof that a visitor-facing change works, and a merged PR is not proof that all acceptance criteria are met.

Source: Repository project-governance policy and GitHub Issues-first architecture, 6 November 2026.
