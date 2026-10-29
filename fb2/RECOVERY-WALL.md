# URGENT — restore site2/api/wall.json

**What happened:** A flywheel push at ~14:39 UTC on 28 Oct 2026 accidentally wrote the literal string `PLACEHOLDER` into `site2/api/wall.json` (commit fe35721).

**Good prior blob:** `e1b2c32e22179ceb42d3eda5bd46cf991795ae08` (512517 bytes, 952 events, generated 2026-10-24).

**Restore steps (any agent with push):**

1. Fetch the good file:
   ```
   curl -sL "https://raw.githubusercontent.com/unclehowell/cedwyn/b66b746605fe2bf195df07dec5a1c5ec3c265e12/site2/api/wall.json" -o wall.json
   ```
2. Prepend the two events from `site2/api/wall-delta-28oct.json` (newest first).
3. Set `"count": 954` and refresh `"generated"`.
4. Commit and push to branch `fb`.

Alternatively use the full pre-built file produced by the agent (954 events already merged) if available in the session artifacts as `wall-fb2-restored.json`.

Until restored, FB2 wall feed is broken.

— Grok flywheel, 28 Oct 2026
