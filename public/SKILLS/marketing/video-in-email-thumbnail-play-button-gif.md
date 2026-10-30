# Video in email: thumbnail + play button (and a small GIF) that links to the watch page

Written 30 Oct 2026 for Cedwyn's documentary "doors" (/movie/) and any future video. Checked against the existing index first: 'video in email', 'animated gif' and 'play button' (email) had 0 skill files.

## What the evidence states
- **Email clients don't play video.** Mailchimp help (read 30 Oct): "Most email clients can't display embedded video content, and will strip the code from your email." Litmus support chart (read): native `<video>` works in Apple Mail, iOS Mail (limited), Samsung Mail and Thunderbird only. It fails in Gmail (web/app), Outlook 2007-2019, Outlook.com, Office 365 and Yahoo. So a "video" in email is really an image that links out.
- **A play button on the image lifts clicks (Wistia's own A/B tests, 2017, read).** Seven 50/50 tests where only the image differed (a play button and timestamp vs. a plain image, same copy and subject):
  - Test 1: 11,290 people, 282 vs 200 clicks (+40.8%)
  - Test 2: 5,270 people, 709 vs 570 (+24.4%)
  - Test 4: 12,592 people, +25.2%; Test 5: +22.6%
  - Tests 6-7: +15% and +12.7%. Wistia's explanation is that the lists overlapped, so the novelty wore off.
  - Caveats: these count clicks on any link in the email, not just the image. Wistia is a video vendor. The B2B lists were thousands of people, ours is tens. Treat it as direction, not a number we'll match.
- **The "+65% CTR / +6% opens / -26% unsubscribes" figures** on Litmus's page have no source given. Don't quote them.
- **Animated GIFs** (Litmus GIF guide, read) work almost everywhere, except Outlook 2007-2019 on desktop, which shows the first frame only. So the first frame has to work as a complete still. Litmus recommends **1 MB at most**: their test loaded a 1 MB GIF in 1.18 s on 4G vs 0.37 s for 180 kB. GIFs flashing at 2-55 Hz can harm people with photosensitive epilepsy.
- **Mailchimp's own route** (help, read) is the Video content block or `*|YOUTUBE:[$vid=ID]|*` / `*|VIMEO:[$vid=ID]|*` merge tags. They generate a thumbnail with a play icon linking to the video, but only for long-form YouTube or Vimeo videos, not Shorts or self-hosted files. For anything else, "upload an image" and link it yourself.

## How to do it (checklist)
1. **Link to OUR watch page**, not the video host. Use cedwyn.bucklerfamily.estate with a UTM (utm_source=mailchimp&utm_medium=email&utm_campaign=door-N). The watch page carries the /ebooks/ strip and signup; a host page doesn't.
2. **Make the thumbnail** from a frame with a face or a clear scene, with the play button centred and a short label bar ("Watch: Door 3 · 2 min"):
   `timeout -k 5 120 python3 the project workspace CLIP.webm a temporary folder/door3 --start 12 --secs 3 --label "Watch: Door 3 (2 min)"`
   It writes door3.png (the still) and door3.gif (≤1 MB, 8 fps, play button on every frame, first frame = the still). It exits 1 if the GIF can't get under the limit.
3. **Choose one per email.** Use the PNG by default. The GIF is for the launch email of a new door only (Wistia: novelty fades with repeats). No fast flashing frames, so pick a calm 3 s stretch.
4. **Live text beside it.** Add a one-line description plus a text link "Watch Door 3 (2 min)" under the image. The image needs alt text like "Play: Door 3, the 1908 farm sale (2 min video)". This keeps images-off Outlook readers covered (see images-off-outlook-uk-institution-email.md and run tools/images_off_view.py before sending).
5. **Width 600 px, displayed at 100% on mobile.** Host the image in Mailchimp's Content Studio so it's served from their CDN.
6. **Measure clicks on the image link vs the text link** (Mailchimp click map), and watch-page sessions with that UTM. Don't measure opens.
7. **Test only if the list is big enough.** A PNG-vs-GIF A/B on a tiny list is noise. Use tools/fpr_check.py / ab_stats.py, and don't test below ~1,000 per arm.

## How we apply it to Cedwyn
- The next Mailchimp campaign that announces a movie door gets one thumbnail block (PNG made from that door's webm by the tool above) linking to /movie/?utm_...=door-N, plus a live-text link and alt text. This is a template change for the campaign drafter. Nothing is sent by this skill. Sends still follow the existing Mailchimp rules and the project lead's sign-off for anything new.
- The door webms are self-hosted, so Mailchimp's video block and merge tags don't apply. If a door is ever on the YouTube channel, the block can be used, but the link should still go to /movie/ (the watch page sells; YouTube doesn't).
- Institution letters (gov/nhs/ac/council) stay plain text with no thumbnail, per the images-off rule.
- Movie stills already follow the no-real-family-likeness rule; use the same frames.
- Kill rule: if after 3 door emails the image link gets less than a third of the clicks the text link gets, drop the image and keep the text link.

## Sources
- mailchimp.com (read 30 Oct 2026)
- wistia.com (read; Margot Mazur, 23 Feb 2017)
- litmus.com (read; support chart; unsourced 65% stat flagged)
- litmus.com (read; 1 MB, load times, Outlook first frame, 2-55 Hz)