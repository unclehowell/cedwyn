# Title links and meta descriptions that Google keeps (and the ones it rewrites)

Read 27 Oct 2026. Google writes the blue "title link" and the snippet itself. Our `<title>` and meta description are only inputs, so the job is to give it inputs it has no reason to replace.

## The evidence (numbers)
- **Zyppy / Cyrus Shepard** studied 80,959 titles on 2,370 sites (Q1 2022, desktop, page updated 6 Oct 2026). Google rewrote **61.6%**.
  - Length: titles of 1–5 chars were rewritten 96.6% of the time. Titles of 20 chars or fewer had a >50% chance. Over 60 chars, >76%. Over 70 chars, **99.9%**. The sweet spot was **51–60 chars**, at 39–42% rewritten.
  - [Brackets]: 77.6% rewritten, and the bracketed text was dropped 32.9% of the time. (Parentheses): 61.9%, dropped 19.7%. Use parentheses.
  - Separators: pipes "|" were removed or replaced 41.0% of the time, dashes 19.7%. Use " - ".
  - **H1 match**: when the title had a number but the H1 didn't, the number was dropped 25.8% of the time. When both had it, Google kept it 97.3% of the time. Matching the H1 to the title is the strongest lever.
  - Other triggers: the same keyword used twice, boilerplate repeated across pages, a missing or superfluous brand.
- **Google, "Influencing your title links"** (developers.google.com). Google's sources, in order: `<title>`, the main visual title, `<h1>`, og:title, large styled text, anchor text and inbound link text, WebSite structured data. Named problems:
  - half-empty titles;
  - obsolete dates;
  - inaccurate titles;
  - micro-boilerplate (the same title on a series of pages);
  - no clear main title (several equal headings, where Google may take the first);
  - **a title in a different language or writing system from the page text**.
  Changes show after a recrawl, which takes "a few days to a few weeks".
- **Ahrefs / Michal Pecánek** compared 20,000 keywords (2020). Google rewrote meta descriptions **62.78%** of the time: 59.65% for head terms, 65.62% for long-tail. 25.02% of top-ranking pages had no description at all. A too-long description barely changed the odds (61.46% vs 63.69%). The written description shows only about **37%** of the time. Still write it for pages that already get traffic, pages built to rank, and pages likely to be shared (it is the social fallback when og:description is missing).
- **Google, snippet docs** (developers.google.com). There is no length limit; text is truncated to the device width. Descriptions should be **unique per page**. Snippets are built mainly from page content, so the first visible paragraph matters as much as the meta tag. `data-nosnippet` keeps a block (e.g. a cookie or translation notice) out of snippets.

## How to do it
1. Write each title as `Specific page topic - Cedwyn Estate`, aiming for **51–60 chars**. Use a dash, no pipe, no brackets, and the brand once.
2. Give each page exactly one H1 that repeats the title's core words (the title can add the brand).
3. Keep the title, H1 and body in the same language. A Welsh H1 goes with a Welsh `<title>` on the cy version, and an English title goes with an English H1. With per-language URLs, each version gets its own title.
4. Make every title and description unique. For a series (scenes, e-book volumes, artifact pages), put the distinguishing part (scene number, volume, catalogue ID) **first**.
5. Meta description: write 120–155 chars, unique, with the page's answer plus one reason to click. Make the first paragraph do the same job, since Google often uses it instead.
6. Check with `tools/serp_title_audit.py URL ...` (flags LEN, BRK, PIPE, H1, LANG, REP, DUP, DESC). After a change, request a recrawl, wait 2–4 weeks, and compare CTR in Search Console against a dated annotation (search-console-ga4-change-annotations-log.md).
7. Don't chase 100%. Google may still rewrite for long-tail queries, and that's fine. The goal is to remove the triggers.

## How we apply it to Cedwyn
`serp_title_audit.py` was run on 27 Oct 2026, 07:09Z, live and cache-busted. **7 of 8 pages were flagged.** All fixes below are PROPOSED markup only, for the CEDWYN ONPAGE run (Wednesday). There are no wording changes to body text, and nothing should be committed while the header/translator and player workers hold the repo.

| Page | Now | Issue | Proposed |
|---|---|---|---|
| /wales/ | title "Cedwyn Estate, Wales · augmented-reality guided tour" / H1 "Ystâd Cedwyn, Cymru" | language mismatch (English title, Welsh H1); description 161 chars | English title and H1 in the en view; keep the Welsh H1 only where the cy `<title>` is Welsh too, e.g. "Ystâd Cedwyn, Cymru - taith dywys realiti estynedig" |
| /ebooks/ | 71-char title / H1 "E-books" | >70 chars is rewritten 99.9% of the time; description 195 chars | "Great House Farm (Tŷ Mawr) e-books - Welsh history" (50) + H1 "Great House Farm e-books"; description ≤155 with "v0.0.1 free" |
| /research/ | "Great House Farm Wiki" | no H1 | add one H1 "Great House Farm research" (the title can stay) |
| /movie/ | "Cedwyn · the film" (17) | too short | "Cedwyn - the film, scene by scene" + H1 to match; scene pages lead with "Scene 2: Roundhouse on the hill - Cedwyn" |
| /patagonia/ | 62 chars | just over 60; description 172 | "Great House Farm II, Puerto Madryn - Cedwyn Estate" (50) |
| /research/timeline/ | brand twice ("Great House Farm Wiki — Research Mirror") | description 176 | "Master timeline - Great House Farm research" |
| /academy/ | "Cedwyn Academy · Cedwyn Academy" | repeated phrase | "Cedwyn Academy - agent library" (machine-facing; keep noindex if set) |

Also swap the site-wide "·" separator for " - " (the dash form was rewritten least).

Per-scene, per-volume and per-artifact templates should put the ID first ("MR-0042: ...", "Scene 3: ...") to avoid the micro-boilerplate trigger.

Wrap the translation notice in `data-nosnippet` if it ever comes back (it is being removed today).

## Sources
- zyppy.com (Cyrus Shepard; 80,959 titles; read 27 Oct 2026)
- developers.google.com (read 27 Oct 2026)
- ahrefs.com (20,000 keywords; read 27 Oct 2026)
- developers.google.com (read 27 Oct 2026)
- Our audit: tools/serp_title_audit.py on 8 live Cedwyn URLs, 27 Oct 2026 07:09Z