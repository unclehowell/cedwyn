# Flywheel: Reopen-the-case autoresearch loop

**Cadence:** every 4 hours  
**Goal prefix (duplicate check):** `REOPEN-LOOP RUN`  
**Runner:** `work/reopen-loop/program.md` (on the project workspace)

## Purpose
Run small one-hypothesis experiments against a fixed metric (the three Takhar limbs) to rank grounds for reopening the 1987 judgment.

## Inputs
- grounds register
- results log
- the newest research cycle

## Outputs
- 3–6 experiments kept or discarded
- score changes
- the PRINCE2 highlight report section on prospective triggers (only when the top three change)

## Metric
Takhar limb scores; court-ready when every limb is 4 or more

## Report rules
Silent unless a ground meets the court-readiness bar; score changes ride the 6-hourly research update.

Built to the [flywheel schema](SCHEMA.md).
