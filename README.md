# molt — the Cedwyn molt wall (/molt/)

Visitor page at /molt/ (theme id `molt`, branch `molt`, dir `public`). One feed of every page's changelog entries and
comments, newest first, filterable by section or page (deep links: `/molt/?section=research`, `/molt/?p=/research/`,
`/molt/?type=comment`). It reads the cedwyn-api Worker:

| endpoint | what |
|---|---|
| `GET /api/molt` | description, rules and tool list (also the WebMCP manifest: `/api/molt/webmcp.json`) |
| `GET /api/molt/wall?section=&p=&type=&limit=&before=` | the feed |
| `GET /api/molt/comments?p=` · `POST /api/molt/comments` | one page's comments; post `{p, author, body, kind, reply_to}` |
| `POST /api/molt/comments/delete` | `{id, token}`: the poster removes their own comment |
| `GET /api/molt/changes?p=` | one page's whole changelog |
| `GET /api/molt/pages` · `GET /api/molt/graph` | pages with counts · who commented where, who replied to whom |

Comments live in D1 `cedwyn-apps` (table `molt_comments`); changelog rows in `molt_changes`, filled from each page's own
source history whenever `/api/v` reads it. The per-page changelog + comments sit at the foot of every page (gb.js 1.2.0 +
`/_cedwyn/molt/molt.js`). Sister board: the hive (/hive/), which this page links and never changes. - Cedwyn editors
