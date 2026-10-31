# Telegram channel for an archive's readers: set-up, bot posting, and the view-rate benchmark (2026)

Harvested 2026-10-31 (skills harvest). Index check first: "telegram" had only 3 passing mentions and no skill file. `whatsapp-channel-readers-uk-patagonia.md` has the FT comparison. `feed-to-social-auto-posting-posse.md` lists Telegram as one feed target, and `the project workspace` marks it "Low-Med, create channel in the app + a bot via BotFather". This file covers the channel itself: whether to open one, how to run it, and how to judge it.

**Status for Cedwyn: PROPOSAL.** A new public channel needs an owner decision. The channel is created in the Telegram phone app by the project lead, or by a phone holder he names.

## Facts (primary sources, read 31 Oct 2026)
- **Channels** broadcast to an unlimited number of subscribers. Posts are signed with the channel's name, not a person's, and new subscribers see the whole history.
  - A *public* channel has a t.me link and turns up in Telegram search. A *private* channel is invite-link only.
  - An eye icon shows the view count on each post. (Telegram Channels FAQ)
- **Bot posting:** a bot that is an admin of the channel can post through the Bot API. Telegram's Bots FAQ limits:
  - about 1 message a second to a single chat, and **20 messages a minute in a group**;
  - One post a day is far under these limits.
- **The benchmark: views divided by subscribers.** Telegram shows real view counts, so this is the metric to watch.
  - The Mendeley dataset (E. Güven, DOI 10.17632/2z2vtj7x36.1, 22 Sep 2026, read) covers **3,205,346 public channels**. Median reach is **31.4% for channels of 1k–5k subscribers** (7,179 measured), 15.8% at 5k–20k and 9.1% at 20k–100k.
  - In the same dataset, **85.7% of channels have under 1,000 subscribers**. Only 12.1% of channels are in English; 27% are Russian.
  - The dataset's own caveat: views also count forwards and web previews, so reach can be overstated.
  - GrowVib (vendor blog, 8 Oct 2026, read) gives 20–40% as good under 10k subscribers, and 60–80% for exceptional small channels.
- **Growth speed, one publisher's account:** Rachel Banning-Lover, the FT's head of social, told Nieman Lab (7 Nov 2023): "it took a year for us to grow an audience of 35,000 on Telegram ... a similar-sized following around markets on WhatsApp in two weeks". Telegram grows slowly for a UK-facing brand even with a large audience behind it.
- **Not checked:** how many subscribers a channel needs before its in-app statistics panel appears. One search snippet states 50 for channels and 500 for groups; Telegram's own page wasn't read. Read it in-app.

## How to run it (zero spend, about 10 minutes a day once set up)
1. **Gate first:** open the channel only if at least one of these is true:
   - 10 or more readers have asked for Telegram;
   - Patagonia or Spanish-speaking readers show Telegram use in reply data;
   - the WhatsApp channel route is blocked.
   Otherwise WhatsApp Channels win (the FT figure above).
2. **Set-up (phone, 10 minutes):**
   - public channel, @username matching the brand (check it's free);
   - name, a one-line bio with one link (the shop or library page), and the logo;
   - turn "Sign messages" off and reactions on;
   - link a *discussion group* only once someone will moderate it.
3. **Bot (box side):** create a bot in @BotFather, add it to the channel as an admin with "post messages" permission only, and store the token as a secret (never in chat or files).
   - It should post **at most 1 item a day** from the existing feed: a record image, two lines, the source line, and one link with its preview.
   - Leave 4 hours or more between posts, the same rule as the auto-social queue, and never duplicate.
4. **Content mix:** 4 record posts to every 1 product mention. Pin a "start here" post linking the free edition and the library.
5. **Promotion (free):**
   - add the t.me link to the site footer or follow page, the newsletter footer and the e-book back matter, each with UTM `utm_source=telegram&utm_medium=channel`;
   - no paid Telegram Ads;
   - no adding people without consent, since Telegram channels can only invite contacts and that would mean DMs to strangers.
6. **Measure weekly:** subscribers, average views per post divided by subscribers (target 30% or more, matching the 1k–5k median), forwards, and clicks to the site from `utm_source=telegram`. Log to the project workspace
   - **Kill rule:** under 50 subscribers after 12 weeks, or a view rate under 15% for 4 weeks running, means stop posting and pin a "we've moved to the newsletter" note.

## How we apply it to Cedwyn
- Proposal line for the BIZDEV queue: "Telegram channel: open only if the gate in step 1 passes; bot posts 1 item a day from the cedwyn-blog feed; 12-week trial with the kill rule above."
  - Open question: does the connected Telegram toolkit (bot token per platforms.md) work for channel posts? Read the toolkit's actions before any build. Don't post anything to test it.
- **Bilingual:** Telegram reaches further in Spanish than in English (12.1% English channels vs 27% Russian; no Spanish-specific number was read). If Patagonia reader data supports it, a Spanish-first channel for the Chubut audience is the better variant to test.
- Editorial rules apply to every post: never name the project lead; none of the banned words (states, assertions, per, second-hand report, not checked, reported, deception, taken); no insignia; no accusations about named people; nothing about family holdings; Llandough Farm is not Great House Farm; links go to Cedwyn pages only.
- Never post into other people's Telegram groups or send DMs. Grow only from our own surfaces.

## Sources
- Telegram Channels FAQ: telegram.org (read 31 Oct 2026)
- Telegram Bots FAQ (rate limits): core.telegram.org (read)
- Mendeley Data, "Telegram Channel Reach 2026", E. Güven, DOI 10.17632/2z2vtj7x36.1: data.mendeley.com (read)
- GrowVib, "What's a Good Telegram View Rate?", 8 Oct 2026 (vendor): growvib.com (read)
- Nieman Lab, "How 13 news publishers are using WhatsApp Channels", 7 Nov 2023 (FT quote): niemanlab.org (quote via search snippet and the existing WhatsApp skill)