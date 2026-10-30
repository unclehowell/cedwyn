# Flywheel: Data-driven webapp migration

**Cadence:** one webapp at a time, per the programme plan  
**Goal prefix (duplicate check):** `CEDWYN ARCH`  
**Runner:** `the data architecture programme page in Projects` (on the project workspace)

## Purpose
Move each webapp to pages generated from its own view of the central catalogue, keeping the existing design (standing order 7s).

## Inputs
- the central catalogue
- the webapp's current pages
- the webapp's selection rule

## Outputs
- the webapp's view database
- near-A2UI page components rendered by the shared renderer
- parity screenshots at 390 px and desktop

## Metric
hard-coded records left (target zero) and visual parity at 390 px and desktop (difference at most 2%), with the build green and scanners clean

## Report rules
A milestone when a webapp switches over.

Built to the [flywheel schema](SCHEMA.md).
