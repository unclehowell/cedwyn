# whattheydontsay — What They Don't Say (Cedwyn section branch)

Served at /whattheydontsay/ on cedwyn.bucklerfamily.estate once themes.json on main lists it (id whattheydontsay, branch
whattheydontsay, dir public). The build copies public/ to /whattheydontsay/; the shared header selector and menu reach it.

- public/index.html, wtds.css, wtds.js: layout and behaviour only. No words or records live in them.
- public/_db/section.sqlite: this section's own database (records(kind, id, seq, data JSON) + meta). One 'words' row (all UI
  strings), one 'meta' row (record date, source counts) and one 'record' row per question round. tools/build_db.py on main merges
  it into the catalogue as section_records; wtds.js reads it from there (/_cedwyn/cat.js) and falls back to this file.
- db/section.sql: text dump of the same database.

Record fields: inst, regime, their_ref, asked, asks[] (date, kind, text, ref), acks[], reply (date, class, text, ref), status,
flags[], due, due_basis, due_max, next, next_from, next_by, tone, links[], silent_days, overdue_days, source, route.
Statuses: no_response (statutory due date passed, nothing received), no_reply_in_thread (no reply in the thread; the body wrote on
other threads), no_reply_recorded (no statutory clock; nothing received after 28 days), partial, not_held, redirected, declined,
reply_no_records, clarification, inaccessible, pending (not yet due), answered. A pending item is never shown as a silence before its
due date.
