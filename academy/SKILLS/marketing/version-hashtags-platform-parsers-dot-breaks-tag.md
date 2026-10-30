# Version hashtags that survive social platforms (#_v0.0.2 breaks at the dot)

Written 30 Oct 2026, prompted by the project lead's 30 Oct rule: version hashtags take the form #_v0.0.2, #_v0.0.1, #_v-0.0.1, ...
Sibling files: heritage-anniversary-hashtag-calendar.md, instagram-search-seo-google-indexing.md, bilingual-welsh-english-layout-posts-cards-email.md (tools/bilingual_check.py checks hashtag parity).
What this file adds: which characters each platform's parser keeps, checked against the parsers' own source code. Our version tags lose their numbers everywhere except Bluesky.

## Evidence (read 30 Oct 2026)
- **X (twitter-text, open source, Apache-2.0).**
  - `validHashtag` = letters/marks/digits plus `hashtagSpecialChars` (`_`, ZWJ/ZWNJ, middle dot and a few CJK joiners), and it needs at least one letter.
  - A full stop and a hyphen are not in the set.
  - The conformance suite (extract.yml) expects "#hashtag." to give "hashtag" and "this is #hashtag1" to give "hashtag1". The parser stops at the first character not in the set.
- **Mastodon (app/models/tag.rb).**
  - HASHTAG_SEPARATORS = `_`, U+00B7, U+30FB, ZWNJ.
  - Names are word characters plus those separators, with at least one letter.
  - No dot, no hyphen.
- **Bluesky (atproto packages/api rich-text TAG_REGEX).**
  - A tag runs to the next whitespace and needs at least one character that is neither a digit nor punctuation.
  - Trailing punctuation is stripped; maximum 64 graphemes.
  - Inner dots and hyphens are kept, so `#_v0.0.2` stays whole.
- **Instagram / Facebook / Threads / LinkedIn / TikTok.**
  - The parsers are closed. Meta's own generated answers on facebook.com and several guides say only letters, numbers and underscores; punctuation ends the tag. That is search-snippet level only: Meta help pages are on our blocked list.
  - Instagram has capped tags at 5 per post or reel since Dec 2025 (Instagram's own post, plus Social Media Today). Mosseri states tags help search but do not raise reach.
  - LinkedIn hashtag feed pages were removed in 2024 (practitioner posts), so tags there are mostly decoration.
- **Box test** (tools/hashtag_check.py, emulating the three open parsers plus the letters/digits/_ rule):
  - `#_v0.0.2` links as `#_v0` on X, Mastodon and Meta-family, and whole on Bluesky.
  - `#_v0.0.1` is also `#_v0`, so it collides with v0.0.2.
  - `#_v-0.0.1` links as `#_v`, so every negative version collapses into one tag.
  - `#_v0_0_2` stays whole everywhere.

## What works (rules)
1. **The site and the social posts can use different spellings.** On our own pages a hashtag chip is just a label and can keep the exact form. On platforms, the tag is a search key and must survive the parser.
2. **Before posting, run every tag through the checker.** Any CUT or NONE on a platform we post to means rewrite it or drop it.
3. **Never use a tag that collides.** Several versions that all link as `#_v0` send readers to one stream, and that stream is full of other people's posts.
4. **Spend the hashtag slots on discovery** (place, era, topic, campaign: #Llandough, #ExploreYourArchive), not on internal version labels. Instagram allows only 5 now.
5. **Put the version in the text and the link**, e.g. "v0.0.2 edition", or the first comment with the /ebooks/ link. That reads correctly everywhere.

## How we apply it to Cedwyn
- **Site:** keep the project lead's #_v0.0.2 / #_v0.0.1 / #_v-0.0.1 chips exactly as he set them. Our own pages don't parse them, so nothing changes.
- **Social:**
  - The daily auto-social, quote pack and IG/FB posts should not post `#_v0.0.2` literally. On Instagram, Facebook and X it would link as `#_v0`, and every negative version would collapse into `#_v`.
  - PROPOSAL for the root: either (a) a social-safe spelling that keeps the project lead's underscore convention, `#_v0_0_2` / `#_v0_0_1` / `#_vminus0_0_1`, or (b) no version hashtag on social, with the version written in the caption ("the v0.0.2 edition").
  - This is a formatting choice the project lead cares about, so it is a decision for the root and not one this worker makes.
  - Bluesky alone can carry the site spelling unchanged.
- **Check:** `timeout -k 5 30 python3 the project workspace -f post.txt` (exit 1 means some tag would be cut). Wire it next to tools/bilingual_check.py in the pre-post step of the project workspace when its owner next touches it.
- **Kill rule:** if a live test post on Instagram shows `#_v0.0.2` linking whole, the Meta-family approximation is wrong. Update the tool and this file.

## Sources
- github.com · .../hashtagSpecialChars.js · .../conformance/extract.yml (read)
- github.com (read)
- github.com and detection.ts (read)
- instagram.com and socialmediatoday.com (snippets; page 403)
- facebook.com (snippet; Meta-generated answer, not a help page)