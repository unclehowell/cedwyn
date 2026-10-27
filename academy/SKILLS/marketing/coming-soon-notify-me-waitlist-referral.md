# "Coming soon" with a notify-me list (turn a pre-launch gallery into a release audience)

Read 27 Oct 2026. Context: on 27 Oct all 158 Garden Gallery NFTs (NFA-0001 to NFA-0158) show "Coming soon" in place of a buy button, by the project lead's instruction. A "Coming soon" button with nothing behind it throws away buyer intent. A notify-me list keeps it.

## What practitioners report (primary sources, read)
- **Omnisend email benchmarks 2026 (2025 data, read):** "Product back in stock" is the best-performing automation of any type. It had a 58.80% open rate, 21.31% click rate, **6.72% conversion**, **$9.14 revenue per email** and 0.37% unsubscribes, against Welcome emails at 2.11% conversion and $6.16. "Only 0.6% of brands in the dataset used this automation." Omnisend's 2026 report gives back-in-stock as the highest conversion of any automation, at 6.46%. A notify-when-available email is the same mechanic: the reader asked for exactly this item.
- **Harry's pre-launch (Jeff Raider's write-up on tim.blog, 21 Jul 2014, read in full):**
  - A two-page site: email in, then a personal referral link.
  - Rewards were stepped and reachable: 5 referrals got shave cream, 10 a razor, 25 a shave set, 50 a year of blades.
  - **Over 85K valid emails (100K+ total) in 7 days. 77% came via referral:** about 20K people referred about 65K friends. More than 200 people referred 50+.
  - Before the page went live, the founders seeded it by personally emailing friends and asking them to share it as their own news.
  - They also ran deception checks to stop one person making many signups.
- **Waitlister (vendor's own analysis of "thousands of waitlists", method not published, marked not checked):** median waitlist page converts ~11% of visitors to signups. Only ~7% of waitlists run a referral programme. Use this as a rough yardstick, not a target.
- **UK rules, ICO guidance on PECR electronic mail marketing (read):** if you *encourage* people to send your marketing to friends, you are "instigating" it and need the friend's consent, which the ICO states "is unlikely to be possible in practice". The ICO's example is a retailer auto-writing a 10%-off email for customers to send, which needs that consent. **So:** give each subscriber a share link to post on their own channels in their own words. Never send or pre-write emails to friends. Referral prizes are a promotion, so CAP Code s8 applies (see uk-social-giveaway-prize-draw-cap-code-meta-rules.md).

## How to build one (checklist)
1. Replace the dead button with a live action: "Coming soon · Notify me". It opens a one-field form (email), with the consent wording visible ("Email me when this piece is released; unsubscribe any time").
2. Capture **which** item: tag the subscriber `nft-notify` plus `NFA-0042` (or a group). A per-item notice converts far better than a general "new stuff" blast, which is the back-in-stock effect.
3. Confirmation page: thank them, show 3 related pieces, and offer a share link (UTM-tagged) with suggested words the person can edit and post themselves. No auto-emails to friends.
4. On release day, send ONE email per item to that item's tag, with the piece, its version and price, and a single button. One reminder at most, 48 h later, to non-clickers only.
5. Report signups per piece weekly. The count is pricing evidence: pieces with many signups are the ones to release first.
6. Only promise a release date that's real (CMA207 banned practice 7 covers false limited-time assertions). "Coming soon" with no date is honest.

## How we apply it to Cedwyn
- **Where:** /nft-art/ cards and each piece's page, next to "Coming soon" and the new "Save as PNG". The saved PNG is the shareable asset, signed "Tŷ Mawr". A small cedwyn URL line in the image footer would make every save a backlink (PROPOSED, the project lead's call, because it changes the artwork).
- **Mechanism, zero spend:** the existing Mailchimp audience and its embedded form, as used by the site-wide signup. Use tag `nft-notify` plus a merge field or tag with the NFA ID. A Mailchimp "tag-added" automation can send the release notice. Plan feature availability not checked.
- **PROPOSED, needs the project lead's GO** (it changes a page he specified): add "Notify me" beside "Coming soon". Do not touch the e-book versioning build (a worker) mid-run. Raise this after it lands.
- **PROPOSED:** release order by signup count. The first release email goes only to that piece's tag, never as a blast to the whole list.
- **No referral prizes** until the project lead approves a CAP-compliant draw. A plain share link is fine now.

## Sources
- omnisend.com
- omnisend.com
- tim.blog
- waitlister.me
- ico.org.uk
- gov.uk