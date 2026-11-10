# cedwyn-coming-soon (Cloudflare Worker) 1.0.0

Owner request, 10 Nov 2026 21:35 GMT: a "coming soon" webapp of the N-of-59 loop says "Coming soon" once, shows a loading bar that
empties like a countdown, and after 2 seconds opens the next webapp in the sequence by itself.

What it does (index.js, deployed as Worker `cedwyn-coming-soon`, deploys on its own, no site build needed):
- Runs only on the placeholder addresses (routes below). It fetches the page as before (Pages; `/online/` pages through the
  `cedwyn-online` service binding) and changes it only if `<main>` is still the coming-soon template (`main.cs-w`,
  `data-coming-soon`, or an `<h1>` reading "coming soon"). A real webapp that takes the slot passes through untouched.
- "Coming soon" once: the header names the page "Coming soon", so the body heading becomes the page's own label
  ("Webapp 56 of 59", "Wayback Vault", ...); a client pass blanks any remaining repeat inside `<main>`.
- A full-width bar empties from full to zero (CSS `scaleX(1 -> 0)`, synced to 2 s from page start); with
  prefers-reduced-motion the bar does not move but the page still advances.
- After 2 s: `location.replace(<next webapp>)`, next = slot+1 from `/areas.json` "nav" (59 -> 1). A next placeholder chains on.
  Backward travel is followed: tapping ‹ on a placeholder, or coming back to a placeholder the countdown just sent you from,
  continues the chain backwards (sessionStorage `cw-cs-sent`). At most 59 hops in a row; no auto-advance if every slot is a placeholder.
- `<noscript>`: a link to the next webapp, plus a 2 s meta refresh.
- The ‹ › arrows and the stamped bar are not touched.

Routes (zone bucklerfamily.estate): `cedwyn.bucklerfamily.estate/coming-soon-*`, `bucklerfamily.estate/coming-soon-*`,
and exact `/wayback/`, `/online/authorities/`, `/online/chat/` on both hosts. Exact routes do not match a URL with a query string
(Cloudflare refuses query patterns), so `/wayback/?x=1` shows the old page; the arrows open plain addresses.

Rollback: delete the routes (ids in the agent's work notes, UNDO.md) — the pages are back as they were at once; then delete the Worker.
Live check: nav-loop check.py 1.1.0 (csnav.js) — "coming soon once + auto-advance" on every placeholder slot.
— Sion's Tab agent
