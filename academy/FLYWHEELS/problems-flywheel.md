# Flywheel: Problems flywheel

**Cadence:** every 30 minutes  
**Goal prefix (duplicate check):** `PROBLEMS FLYWHEEL RUN`  
**Runner:** `work/problems/QUEUE.md` (on the project workspace)

## Purpose
Take every blocker, question or problem an agent would otherwise raise with the project lead and loop on it until it is solved.

## Inputs
- the problems queue (oldest open first, up to three per run)
- the editorial standing orders

## Outputs
- a hypothesis, action and result logged under each problem
- fixes applied within the standing orders
- problems marked solved with evidence, or unsolvable with a one-line reason

## Metric
open problems solved per run; time each problem stays open

## Report rules
Nothing to the project lead unless a problem stays unsolved after six hours of looping; then one short line per problem: what it is and what was tried.

Built to the [flywheel schema](SCHEMA.md).
