# Flywheel schema — the template every wheel copies

A flywheel is a self-running loop, not a task. It has five parts, kept in its own folder:

```
<wheel>/
  RUNNER.md          the fixed program: purpose, one cycle step by step, rules, report format
  tools/             scripts the cycle runs (each under a hard timeout)
  state/             what the last cycle saw and decided (JSON), so the next cycle resumes
  log.csv | log.md   one row per cycle: when, what changed, metric before/after
  SCHEDULE_PROPOSAL.md  the cadence and the exact spawn instruction for the scheduler
```

## RUNNER.md sections (in this order)
1. **Purpose** — one paragraph; who asked, when, in their words where possible.
2. **Inputs** — files, records and live pages the cycle reads first.
3. **The cycle** — numbered steps; the first step always re-reads live state; the last always writes state and log.
4. **Metric** — the fixed measure a change must improve to be kept.
5. **Rules** — the standing orders that apply, plus wheel-specific ones.
6. **Outputs** — exact paths and URLs written.
7. **Report** — the shape of the report to the root, and when the project lead hears anything at all.

## The schedule instruction (what the scheduler stores)
```
<WHEEL NAME> (<cadence>), for the project lead. <Who asked, when, in their words.>
Each occurrence:
1. List running work. If a worker whose goal starts "<PREFIX>" is running, do nothing.
2. Otherwise spawn ONE worker (kind <kind>, references [<RUNNER.md>, ...]) with goal:
   "<PREFIX> per <RUNNER.md>: <one-sentence cycle>. <rules>. Send the project lead nothing.
    Report: <fields>."
3. When it reports: <exactly when the project lead hears anything, and in how many bubbles>.
Never change the cadence without asking the project lead.
```

## Machine-readable form
Every wheel is also an entry in `flywheels.json` with the keys: `id, name, cadence, prefix, runner, purpose, inputs, outputs, metric, report`.
