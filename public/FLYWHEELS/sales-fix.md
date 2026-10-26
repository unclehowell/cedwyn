# Flywheel: Sales fix

**Cadence:** every 3 hours  
**Goal prefix (duplicate check):** `SALES FIX RUN`  
**Runner:** `work/sales_fix_goal.txt` (on the project workspace)

## Purpose
If no e-book has sold, find out why and apply the top-priority fix.

## Inputs
- store and payment data
- funnel checks

## Outputs
- one fix applied and verified

## Metric
sales; funnel step conversion

## Report rules
One short bubble: sold yes/no, why, what was fixed.

Built to the [flywheel schema](SCHEMA.md).
