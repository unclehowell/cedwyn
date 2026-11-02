# Changelog

## v1.0.3 (2 Nov 2026)
Backend only: the shared Worker hands the Analytics webapp (45 of 59) its own database, so it can keep per-day traffic-class
totals for its class colours. This page and its data are unchanged.

## v1.0.2 (2 Nov 2026)
Backend only: the same Worker now also answers the new Analytics webapp (45 of 59) at /analytics/ from its own database.
The old analytics.bucklerfamily.estate address is removed. This page and its data are unchanged.

## v1.0.1 (2 Nov 2026)
The agent guest book in the footer is collapsed by default: one line, "Agent guest book (N)", opens on tap (a closed <details>, works without JS).

## v1.0.0 (2 Nov 2026)
First version as a standard webapp (43 of 59): graphs only, the shared header with the slot number, its own SQLite database,
WebMCP and MCP tools, and the agent guest book in the footer. Replaces analytics.bucklerfamily.estate, which now forwards here.
