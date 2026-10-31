# Cedwyn flow watch — anti-stagnation operating contract

**Parent:** [Cedwyn Snowball](snowball.md) · [Flywheel index](README.md) · [System architecture](../architecture/loops.md)  
**Machine status:** `/x78s8jej33i8f8rrj4is88/flow-health.json`  
**Event ledger:** `/x78s8jej33i8f8rrj4is88/flow-events.json`  
**Machine contract:** `/x78s8jej33i8f8rrj4is88/flow-contract.json`  
**HubSpot:** create/update the dedicated [Cedwyn anti-stagnation watchdog task](https://app.hubspot.com/tasks/149419802/view/all) when the authorised task writer is available.

## Purpose

Detect and remove avoidable waiting across Cedwyn itself: correspondence, HubSpot work, Git branches and pull requests, Actions queues, Cloudflare Workers and Pages, the Agent Library, Docs/Library, e-books, documentary scenes, semantic releases and public publication. This is an operating control plane, not another daily report and not a vanity dashboard.

**No silent stagnation.** Every live work item has a timestamp, accountable owner/agent, real state, last meaningful progress, evidence of the last transition, explicit blocker (if any), next action and next check. An item that is blocked is not simply left "in progress". Record who or what can unblock it, continue independent work, and hand off immediately.

## Mandatory agent behaviour

Every agent working on Cedwyn MUST:

1. Read this contract and query `flow-health.json` before claiming work. If the endpoint is unavailable, record that fact and continue with direct source checks; do not assume green.
2. Re-read the authoritative task/source record before changing it. Claim a single bounded task, preserve its owner and current work, and do not collide with another active writer.
3. Record the transition when meaningful work starts, when it becomes blocked, when it is handed over, and when it is complete. Use UTC timestamps and exact Git commit, workflow run, message/thread, version, artifact or live URL identifiers as appropriate.
4. After every material change, verify the next system in the chain. A source commit is not a build; a build is not a Pages production deployment; a deployment is not proof that the public route serves the expected revision; a generated scene/file is not a released product.
5. Before marking complete, re-query `flow-health.json`, perform the relevant source-to-live check, and add the verification reference and outcome to the authoritative HubSpot task.
6. If a dependency is waiting, do not idle. Work on independent ready items, prepare the unblock action, route the blocker to the responsible lane, and set the next check. Never create duplicate retries or parallel publishers for the same revision.
7. End each turn with one of: verified completion; a specific, owned next action; or a named blocker with an unblock condition. "Working on it", "queued" and "waiting" without evidence are not acceptable terminal states.

This instruction applies whether an agent entered through the Academy/Agent Library, llms.txt, WebMCP, the opaque API, Hive, a repo file, or a public task mirror.

## What is checked

### 1. GitHub and website release chain

Trace the same source revision through:

`main/source branch → Actions run and job → build stamp → site branch → Cloudflare production → live build stamp`

Use the exact SHA and run ID at every step. The live `/_cedwyn/reports/build.json` `commit` and `built_at` are the public served-revision proof. Report the missing transition, not simply "deploy failed".

The first operational monitor watches main push and build-job events (signed GitHub OIDC), reconciles every five minutes, and reads the production stamp. It must distinguish:
- source revision not queued;
- queued with no active publisher;
- active build within its measured baseline;
- build failed or running beyond threshold;
- build completed but production not serving the revision;
- live status unavailable (not the same as success or failure).

Only start a missing build/retry when the exact revision is not already queued or running. Do not cancel the only valid publisher, create duplicate full builds, force-push, or bypass repository protections.

### 2. Cloudflare Workers and Pages

Record Worker script version, schedule, route, bindings and observable health separately. Keep existing service bindings and databases intact. Pages API metadata may be private; if the watchdog only has public access, say so. A live build-stamp check is valid publication evidence; it is not proof of private deployment metadata.

Use existing D1 and Workers where appropriate. Do not make a second copy of Hive/Watch state, create another database without a demonstrated need, or deploy a competing publisher.

### 3. Gmail, correspondence and HubSpot

For every message task, distinguish:
- draft prepared;
- approval required;
- approved to send;
- send attempted;
- sent with provider message/thread ID;
- delivered, bounced or rejected when that provider exposes delivery state;
- reply received and case/task updated.

A draft is not a sent email. A send attempt is not delivery. A message may be marked complete only when the task's acceptance condition is met and its evidence is recorded. Use the acting agent's own Gmail and HubSpot permissions. Never claim that a Worker checks private Gmail until an authenticated Gmail integration is actually configured. Never send external correspondence unless that message and recipient are authorised by the task's approval state.

### 4. Docs, Library, e-books and documentary releases

Use the existing shared `/_cedwyn/versions.json` scheme; do not invent a second numbering convention. For each release record:
- source commit and semantic version;
- artifact path, checksum and build/export time;
- language/edition/scene or document identifier;
- changelog and what changed;
- rights, factual/editorial/technical review appropriate to the product;
- published URL and live checksum/version response;
- superseded version retained and discoverable.

For a documentary scene, follow the scene flywheel's MAJOR/MINOR/PATCH meaning. For e-books and Library documents, preserve the released file and version history. A version bump without a served artifact is not a release. A served file whose version metadata is stale is a publication defect.

### 5. Agents and API

WebMCP/API resources are discoverability and read surfaces, not authority to bypass access controls. Every agent must read the flow contract, check health, do its bounded work, verify the result, and report the transition. Unprivileged agents may report sourced blockers or handoffs; only an agent with the required connector permission can read/update a private task or mailbox.

## Status and thresholds

The first monitor is intentionally honest about what it can see:
- **Connected now:** GitHub Actions main/build state, live production build stamp, Agent Library version manifest, shared product-version registry, and e-book/documentary route availability.
- **Not yet connected to the Worker:** private Gmail delivery events and Cloudflare private Pages deployment metadata.
- **Partial:** individual e-book/documentary artifact hashes and scene-level semantic release records need a canonical target register.

Current build warning/critical thresholds are provisional and grounded in the existing recorded full-build baseline of approximately 59 minutes. Recalculate p50/p90/p95 from the run ledger and update thresholds with evidence. Never declare a build stalled merely because it is still inside its measured baseline. Queue wait is measured separately from execution time.

## Safe recovery rules

Auto-remediate only reversible, idempotent, low-risk technical failures with evidence: re-fetch status, repair stale task metadata, re-queue a missing build only when no run exists, retry a transient deploy after a completed successful build, restore a missing generated index from its canonical source, and reopen a failed verification step.

Escalate rather than auto-act on: external email, legal decisions or allegations, public claims, paid services, purchases, transfer of money, credential access, destructive changes, force-pushes, or any action that changes another person's access or rights.

## Metrics

Record separately:
- event-to-detection time;
- detection-to-owner/action time;
- source-to-live publication lag;
- queued duration and execution duration;
- retry count and successful recovery time;
- open blocker count and oldest blocker age;
- email drafts/sends/delivery states (only when authenticated);
- document/scene releases with source-to-live proof;
- failed and superseded releases, preserving prior versions.

The objective is not maximum automation events. It is minimum avoidable idle time, minimum rework, and truthful completion.

## First implementation boundary

The deployed bridge watchdog provides OIDC-verified GitHub push/build-job intake and a five-minute D1-backed reconciliation loop. It publishes only sanitised status and events. Email and private Pages metadata remain explicit integration gaps until the correct authenticated connectors are provisioned. The next build-out is a product target registry for per-document, e-book and scene artifact/version/checksum verification, followed by a permissioned Gmail delivery event integration.
