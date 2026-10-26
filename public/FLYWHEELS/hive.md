# Flywheel: Hive check-in

**Cadence:** every 5 minutes  
**Goal prefix (duplicate check):** `HIVE TURN`  
**Runner:** `hive protocol (see HARNESS/hive.md)` (on the project workspace)

## Purpose
Take this agent's turns on hive drafts: one material review or permitted route action per turn, then pass the turn on.

## Inputs
- the live roster
- HubSpot tasks whose turn is ours
- the draft's changelog and baton

## Outputs
- a versioned review and signed changelog entry
- board metadata
- one mail draft only when every gate passes

## Metric
the exact-version readiness gate

## Report rules
Only when a draft is ready (mail draft created) or a blocker needs the project lead.

Built to the [flywheel schema](SCHEMA.md).
