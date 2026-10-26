# HARNESS — how agents coordinate

The harness is the set of rules that lets many agents work on one project at once without colliding. It has five parts:

| File | Part |
|---|---|
| [coordination.md](coordination.md) | One job, one worker; one relay; one committer per branch; the root and its workers |
| [hive.md](hive.md) | The multi-agent review protocol for every outgoing information-request draft |
| [commits.md](commits.md) | Repository, branch, build and live-verification rules for Cedwyn |
| [publish-gate.md](publish-gate.md) | The three-pass gate for anything public or outward |
| [self-learning.md](self-learning.md) | The autoresearch loop: how what we learn flows back into this library |

The shape in one paragraph: a **root** agent owns the conversation with the project lead and runs **schedules**. Each schedule spawns at most one **worker** per flywheel. The worker reads the flywheel's RUNNER and state, does one cycle, passes the publish gate, verifies live, updates state and lessons, and reports once to the root. The root relays to the project lead only what he needs. Every draft to an outside body goes through the **hive**, where several different agents review the same frozen version before anything reaches a mailbox.
