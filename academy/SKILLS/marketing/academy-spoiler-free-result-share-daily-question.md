# Spoiler-free result sharing (the Wordle grid) for Academy grades and a daily question

Date: 2026-10-30 · Status: PROPOSAL (nothing built) · Topic: viral loops / social growth / course marketing for the /learn/ academy

## What the evidence states
- **Wordle (2021-22), the cleanest public case of a share feature driving growth.** Players in New Zealand began typing their results as coloured emoji squares; Josh Wardle built that format in as an automatic share. After it shipped (mid-December 2021) the game went from **90 players on 1 Nov 2021 to over 300,000 on 2 Jan 2022, and over 2 million a week later**; **1.2 million results were shared on Twitter between 1 and 13 Jan 2022**. (NYT, "Wordle Is a Love Story", 3 Jan 2022, paywalled here; figures as summarised on the English Wikipedia article, which cites NYT and Twitter. Not checked against Twitter's own post.)
- Why it worked (Wardle, as reported): **one puzzle per day for everyone** (scarcity, shared talking point) and a grid that shows *how* you did **without revealing the answer**, so the share is a teaser, not a spoiler.
- Mechanics: the native share sheet is `navigator.share({title, text, url})`. MDN: HTTPS only, must be fired from a user tap (transient activation), not Baseline (some major browsers lack it), so always fall back to `navigator.clipboard.writeText` with a "Copied" toast.

Caveat: Wordle was free and daily; a paid grade ladder is different. The transferable parts are the spoiler-free grid and the shared daily question; the growth numbers are Wordle's, not a forecast for Cedwyn.

## Playbook
1. **Result grid, never answers.** After a grade attempt: `Cedwyn Academy · Grade 2 · 12/13 ✅` then one row of squares (🟩 right, ⬛ wrong; 13 squares), then the link. No question text, no answers, no case points.
2. **Share button only on the results screen**, after the reveal (one tap → share sheet; fallback copy). Text short enough for WhatsApp/X/Bluesky previews.
3. **Link to a public landing, not the paywalled grade**: `/learn/grades/?utm_source=share&utm_medium=grid&utm_campaign=grade2` (the Grade 1 free taster is the natural landing). Check that URL's OG share card renders on WhatsApp before launch (not checked this run).
4. **A free "Question of the day"** (one per day, same for everyone, from Grade 1-2 material, catalogue-cited): answer, reveal, share `Cedwyn daily #14 ✅ 1/1`. This is the Wordle part: a reason to return daily and a shared talking point. It also feeds spaced review (see academy-spaced-review-widening-gaps-hlr.md).
5. **Measure:** share taps (count of `navigator.share` resolves + copies, a single counter row in D1), visits with `utm_medium=grid` in Cloudflare analytics, Grade 1 starts from those visits, and paid joins. Judge after 4 weeks; with low traffic, report raw counts.
6. Do not add leaderboards or public names; the share is opt-in and anonymous by default.

## Minimal code (vanilla JS, no library, no install)
```js
async function shareGrid(grade, marks, total, url){
  const row = marks.map(m => m ? "🟩" : "⬛").join("");
  const text = `Cedwyn Academy · Grade ${grade} · ${marks.filter(Boolean).length}/${total}\n${row}`;
  try { if (navigator.share) { await navigator.share({title:"Cedwyn Academy", text, url}); return "shared"; } }
  catch(e){ if (e.name === "AbortError") return "cancelled"; }
  await navigator.clipboard.writeText(text + "\n" + url); return "copied";
}
```
Call only from the button's click handler (transient activation).

## How we apply it to Cedwyn
- Results screen of each grade on /learn/grades/: add "Share result" beside "Next grade"; keep the dark theme, an ⓘ modal saying the share shows only the score pattern, and a page journal entry on release.
- Daily question as a small free panel on /learn/ and the /ebooks/ page footer strip, rotating from the Grade 1-2 pool (about 25 questions of the 85, so add new catalogue-cited items before it repeats).
- Public text: neutral third person, no family names, banned words avoided; the grid carries no case content at all, so it cannot leak a case point.
- Auto-social (daily 08:15) could post "Today's Cedwyn question" as a teaser with the daily link (proposal; one post a day at most, no DMs).
- First check: the existing UTM/analytics tooling in INDEX.md for the campaign naming, so share traffic lands in the same weekly report.

## Sources
- en.wikipedia.org (figures cited to NYT and Twitter; read 30 Oct 2026)
- nytimes.com (primary interview, paywalled from the box)
- developer.mozilla.org (secure context, transient activation, not Baseline)
- developer.mozilla.org