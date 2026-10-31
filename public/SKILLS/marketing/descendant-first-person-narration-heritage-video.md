# Descendant first-person narration for heritage video ("I was born here")

Date: 2026-10-30. Trigger: the project lead's ask at 19:04 on 30 Oct. The Story Time narrator is his AI self. It must speak in the first person, as a man born at the farm in 1984 on his family's land. Never third person, and never about the farm as if it were someone else's.

## Why the first-person family voice works (numbers)
- **Trust in personal and family accounts.** Rosenzweig & Thelen, *The Presence of the Past* (1,500 Americans, mid-1990s), share of people rating each source highly trustworthy, as summarised by AASLH (read):

  | Source | Rated highly trustworthy |
  |---|---|
  | Museums | 80% |
  | Grandparents | 69% |
  | Eyewitnesses | 64% |
  | College professors | 54% |
  | School teachers | 36% |
  | Non-fiction books | 32% |
  | Film and TV | 11% |

  A family member who was there is the second most trusted voice. A faceless "the family" narrator borrows none of that trust. Museums stay top because they show the object, so the voice wins only when the document is on screen.
- **2018 re-run.** AASLH/Wilkening, 1,000 people (read): museums and historic sites 81% trustworthy, textbooks and non-fiction 74%, teachers 65%, the internet 64%. Online video starts in the lowest-trust bucket, so the on-screen source does the trust work.
- **First-person practice.** Plimoth's shift from a "life-sized diorama" to first-person interpreters "using personal pronouns", in Ress & Mazzoni 2020, *Information* 12(1):15 (read).
- **Older audience.** Ress & Mazzoni's New Harmony visitor survey: 73% aged 41+, 49% aged 56+; visitors liked learning from a guide and wanted to "experience the past". Our likely buyers are similar.
- **Lecturing backfires.** The Connecticut 2008 survey (4,500 respondents) found 48% used negative words for guided tours, such as "Trapped. Controlled." Cited in the same paper.
- **Rule.** Speak as a person with a stake, show the record, and do not lecture.

## The pattern (each Short or intro, 30-90 s)
1. **Ident (2 s):** "Great House Farm Story Time."
2. **Stake (one line, first person):** "I was born in this house in 1984. My family has farmed this land, we believe, since 1667."
3. **Record on screen, read verbatim:** name the document and its reference, e.g. "Glamorgan Archives DB/E/1, plan 19: 'Cedfin or Tŷ Mawr Farm', 139 acres 3 roods 8 perches, 59 fields." The camera holds on the document. No paraphrase of the numbers.
4. **What it means to us:** first person, framed as our view ("for us this shows...", "our case is..."). Never present it as a court finding.
5. **Invitation (you):** "Read the whole story at BucklerFamily.Estate" (end card, as approved in v2).

## Words: use / avoid
- **Use:** I, my, we, our, my great-grandfather, our fields, the house I was born in, we believe, our case, the record shows.
- **Avoid:**
  - "the family", "the farm" (as an outsider would say it), "the Bucklers", "Mr S B", "he / his" for the narrator.
  - Ownership as plain fact ("it is our land"). Say "it is, we believe, still our land".
  - The banned public words: states, assertions, per, second-hand report, not checked, reported, deception, taken. Use "the map records", "the deed reads", "not checked".
- **Never:**
  - Name the aunts.
  - Confuse Llandough Farm with Great House Farm.
  - Cite Llandough near Cowbridge for our parish.
- **AI likeness:** keep the existing AI-likeness disclosure label on YouTube, Meta and TikTok; see `ai-founder-digital-twin-intro-disclosure-youtube-meta-tiktok.md`. First person does not remove the label.

## Lint before voicing (free, our own script, nothing installed)
`python3 the project workspace the project workspace`

It flags third-person drift ("the family", "the farm", "Mr S B", "his family"), banned words, and ownership stated as fact without "believe / case / view" in the sentence. Exit code 1 means fix the script first.

Tested 30 Oct on a 4-line sample: 4 flags, and the "we believe ... our case" line was correctly passed. It is a word list, so a human read is still needed. For example, "the farm" is fine inside a quoted document title.

## How we apply it to Cedwyn
- **Story Time intro v3** (a worker is on it now). Run the lint on `script-v3.txt` before the cloned-voice render, so no paid OmniHuman re-render is wasted on a third-person line.
- **All future Story Time episodes and YouTube Shorts descriptions.** First person in the voice track. Public page text stays neutral third person and never names the project lead, because the narrator's video voice and the site's editorial voice are two different registers. Keep them apart.
- **Measure.** Compare 3-second hold and average view duration of v3 against v2-style third-person clips on the next growth report. Expect the stake line to lift the hold, but treat that as untested until the numbers are in.

## Sources
- aaslh.org (read; Rosenzweig & Thelen figures + AASLH 2018 n=1,000)
- cup.columbia.edu (book page, 1,500 Americans)
- mdpi.com (Ress & Mazzoni 2020, read: Plimoth first-person shift, New Harmony ages, Connecticut 2008 48% of 4,500)