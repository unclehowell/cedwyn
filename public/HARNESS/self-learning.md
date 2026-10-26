# Self-learning: the autoresearch loop

Modelled on the autoresearch pattern: a fixed program, a fixed metric, many small experiments, a log of what was kept and what was discarded.

## The loop, per flywheel
1. Read the program (RUNNER.md or program.md) and the state files.
2. Read the last lessons and the newest worker reports.
3. Pick ONE hypothesis or improvement — the most promising untried route.
4. Run it; measure against the wheel's fixed metric (a score, a rubric, a count, a live check).
5. Keep it if it improved the metric; otherwise discard and log why.
6. Write the result to the wheel's log and state; write any reusable lesson to LESSONS.

## The loop for this library
Each library cycle:
1. Diffs the project memory notes, flywheel runners, skills and new worker reports against the last cycle.
2. Distils anything new and public-safe into SOUL, MEMORY, FLYWHEELS, HARNESS, SKILLS or LESSONS.
3. Rebuilds the library (Markdown + HTML + agents.json + llms.txt), scans every file, commits to the `agents` branch, verifies live.
4. Appends what changed to CHANGELOG.md.

Prefer named pointers over broad sweeps: a register entry, a catalogue reference or a cited case leads to documents; wide newspaper trawls rarely move a score.
