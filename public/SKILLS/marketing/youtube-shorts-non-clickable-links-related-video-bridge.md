# YouTube Shorts links: what can be clicked, and where the shop link has to go

Harvested 27 Oct 2026 (skills harvest, 22:55Z). Topic: YouTube growth / sales path from Shorts.

## The fact that changes the plan
- YouTube Help, "Sharing links with your audiences" (answer 13748639, read 27 Oct 2026): "To reduce spam and scam attempts, URLs placed in YouTube Shorts comments and Shorts descriptions are non-clickable."
- Its table, as read:
  - Clickable: channel profile links (up to 14); URLs in long-form video comments and descriptions (needs advanced features); the Related Video link in Shorts; Posts (advanced features); end screens; YouTube Shopping affiliate links; external brand-deal links.
  - Not clickable: URLs in Shorts comments and Shorts descriptions; Live chat links in the vertical live feed; @mentions and #hashtags in Shorts comments/descriptions.
- Background (TechCrunch, Sarah Perez, 10 Aug 2023, read): the change started 31 Aug 2023 and rolled out gradually. It came with prominent channel-profile links beside Subscribe (from 23 Aug 2023) and the Related Video link (Shorts to long-form). Desktop banner link icons were removed.
- A shortener or a different URL format does not help (Ferryman explainer, read; it rests on the same Help page). The placement decides, not the URL.
- Related Video (Help 14075157, read): YouTube Studio > Content > the Short > Related video > Save. It needs advanced feature access. The target must be public or unlisted. Viewers see a clickable link under the channel handle. It only goes to YouTube content, never to a website.
- Advanced features (Help 9891124, read): phone verification, then enough channel history or ID/video verification. Advanced features include pinned comments. Only the primary channel owner can verify their ID.

## How to do it (routine)
1. **Sort the targets.** In the video list, a Short is any upload that is vertical and 3 minutes or under. Titles with #Shorts are a strong hint but not proof. Check the Studio content tab (Shorts filter) or the Data API: no reliable flag exists, so use duration plus aspect ratio.
2. **For Shorts, never promise a tap.** Change the CTA from "link below" to the path that really exists: "Shop link on our channel page" (profile link) or the Related Video. A URL in a Short's comment or description is plain text. That is fine for recall, but count it as zero clicks.
3. **Pick a bridge video.** Choose one long-form video that pays off the Shorts topic, with the /ebooks/ link (UTM-tagged) in the first 2 description lines and a pinned comment carrying the same link. Set it as the Related Video on every Short. Shorts then send viewers to a page where links work.
4. **Channel profile links.** Put the /ebooks/ link first. Label it plainly ("E-books: the records"). The first link is the one shown beside Subscribe.
5. **Long-form videos keep text links.** Description line 1 or 2 plus a pinned comment, both with utm_source=youtube&utm_medium=description|pinned_comment and the video id in utm_content.
6. **Measure.** In Cloudflare/Stripe, count utm_source=youtube by utm_medium. If Shorts traffic exists, it comes via profile or related-video, so expect a channel-page referrer, not a Short.
7. **Recheck each quarter.** Read Help 13748639 again; YouTube changes this table without announcements.

## Evidence quality
- The non-clickable rule and the table come from YouTube's own Help pages (primary, read 27 Oct 2026).
- No source read today gave click-through numbers for Related Video or profile links, so expect no lift figure. Measure our own with step 6.
- Third-party "2026 guides" (u2l.ai) say Shorts description URLs are "clickable but behaviour varies". That contradicts YouTube Help, so follow the Help page.

## How we apply it to Cedwyn
- **Tonight's 07:00Z YouTube comment queue (the project workspace) targets 10 videos.** At least 5 are Shorts by title (#Shorts): hS4aN9dBr4I (205 views), 5wCBtClDkyQ (172), 6o07JL4ZoGY, aRRvkt3ryXg, p7xEURn9kb8. Their two highest-viewed targets are Shorts.
  - A comment carrying the /ebooks/ URL on these will show as plain text, not a link. It costs API quota and adds no clicks.
  - Recommended change for that run: post the URL comment only on the long-form targets (SNUY-XFAjyE, hzbCZg_3V9k, -c0UvjM-lwA, aazpNjlzRtQ, 05_Ei82HSeE), after checking each one's duration. On Shorts, use the text "E-books: link on our channel page" with no URL, or skip them.
  - The same applies to Shorts descriptions edited in earlier sales runs (backups exist in the project workspace*.json): those links are not clickable.
- **Bridge:** pick SNUY-XFAjyE ("BP Properties v Buckler (1987)…2026 update", 158 views, long-form by title; confirm the duration). Give it /ebooks/ in description lines 1–2 and a pinned comment. Set it as the Related Video on all Shorts in one Studio pass. Related Video has no Data API field we have confirmed, so it is a manual Studio step or a browser job; mark it not checked via API.
- **Channel profile link 1** = cedwyn.bucklerfamily.estate Check that it is first: the 26–27 Oct channel-branding backups exist, so read them before changing anything.
- **Rules unchanged:** no DMs, no new spend, and public text never names the project lead.

## Sources
- support.google.com (YouTube Help: Sharing links with your audiences; read 27 Oct 2026)
- support.google.com (YouTube Help: Add a related video to your Shorts; read)
- support.google.com (YouTube Help: intermediate and advanced features; read)
- techcrunch.com (TechCrunch, 10 Aug 2023; read)
- ferryman.io (explainer; read; secondary)