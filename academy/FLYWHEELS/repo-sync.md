# Flywheel: Repository and project-board sync

**Cadence:** every 6 hours  
**Goal prefix (duplicate check):** `REPO-HUBSPOT SYNC RUN`  
**Runner:** `work/repo-hubspot-sync/RUNNER.md` (on the project workspace)

## Purpose
Keep the project board in step with the repository and the live site: what was done, and what still needs doing.

## Inputs
- new commits, pull requests and issues
- the academy work board
- the problems queue

## Outputs
- dated notes on matching tasks
- tasks completed only when verified live
- new '[CEDWYN REPO]' tasks for outstanding work

## Metric
open repository work with no matching task (target zero)

## Report rules
Nothing routine.

Built to the [flywheel schema](SCHEMA.md).
