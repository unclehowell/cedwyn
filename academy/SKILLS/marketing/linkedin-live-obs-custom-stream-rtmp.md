# LinkedIn Live from OBS through a custom stream (RTMP), done within LinkedIn's rules

Date: 31 Oct 2026. Harvest skill. Status: PROPOSAL (new public format; needs the owner's GO and an eligible Page/profile).
Related: linkedin-page-events-online-talk-registration-timing.md (the access gate: 150+ followers, 30 days, streaming tool; read that first), youtube-vertical-live-shorts-feed.md (ffmpeg -> RTMP from this box).

## What the primary sources say (read 31 Oct 2026 unless marked)
- **Custom stream works with any encoder.** LinkedIn Help a564446: broadcasters "who want to connect directly to any streaming software or encoder can use a custom stream (RTMP Ingest)... (For example OBS, Elemental, Zoom, etc.)". RTMP and RTMPS both supported. Access still needs the LinkedIn Live criteria.
- **Timing of the key.** a564446 / a567506: on Live Studio > Manage streams, "Prepare to go live" opens **1 hour** before the scheduled start for profiles and not checked Pages (**2 hours** for verified Pages). Pick a region > Get URL > copy Stream URL + Stream Key into OBS. You can go live from **15 min before** to **2 h after** the scheduled time.
- **Preview limit.** not checked: preview lasts **10 minutes**, then the stream expires and must be set up again. Verified Pages: up to 2 hours. Audience sees nothing until you click Go live. A test = start OBS, see preview, stop without clicking Go live.
- **Persistent stream key** exists (a10444063, search preview only, not read): toggle under Stream settings, so OBS need not be re-keyed per event.
- **Notifications.** a567506: nothing is sent when you schedule. On Go live, notifications go to the **event's attendees, not to Page/profile followers**. So registrations to the LinkedIn Event are the audience.
- **Recording.** Organisers can trim after the end and download the recording from the Event Details page.
- **Encoder settings** (a567498): 16:9, **720p recommended** (1080p max), 30 fps, keyframe every 2 s, video **3.5 Mbps recommended** (6 max), AAC 128 kbps 48 kHz, H.264. If ingest fails use the **Baseline** profile (Main/High add B-frames and timestamp problems). Need at least 10 Mbps upload.
- **Content rules** (a564450): **no pre-recorded content** (streams must be happening in real time), stream **at least 15 min**, avoid selling/promotional streams, no "starting soon" screen longer than 1-2 min, sponsor logos small.
- **The engagement figure, with its caveat.** LinkedIn Marketing Blog (Danielle Webb, 7 May 2026): Live videos average **7x more reactions and 24x more comments** than the same broadcasters' native video. Footnote: "Internal LinkedIn data from 05/01/23 to 06/18/24, based on performance from a **select group of pilot testers using paid promotion**." Treat 7x/24x as an **upper bound**, not a forecast for an unpaid small Page. Same post: paired with paid promotion, 131% higher CTR (also pilot data). Case: Automation Anywhere, 100,000+ audience, ~400 comments in minutes, 1,000 by the end of an hour (a large brand; not comparable to us).
- Practitioner report (search preview, not read): OBS streams to LinkedIn when the full stream URL incl. key is pasted; a Restreamer 2 user could not. Use OBS or plain ffmpeg.

## How to run one (checklist)
1. Confirm access (see the events skill). Create the **LinkedIn Event** first (Online, "LinkedIn Live", custom stream as the tool) 7-14 days ahead; share it so people register (only registrants get the go-live ping).
2. OBS profile: Settings > Stream > Custom; Output 720p30, x264, CBR 3500 kbps, keyframe 2, profile baseline; Audio 48 kHz, 128 kbps.
3. T-60 min: Live Studio > Prepare to go live > region > Get URL; paste URL + key. Start streaming in OBS; check preview and stream health inside the **10-minute** window; stop if not ready (or use the persistent key).
4. Go live on time; holding slate no more than 1-2 min. Run 20-40 min (rule: 15+). Pin a comment with the related page link after you start talking.
5. After: trim, download the recording, cut 2-3 clips for normal posts, reply to every comment within 24 h.
6. Measure: registrants, peak live viewers, comments, clicks to the linked page (UTM in the pinned comment), replay views at 7 days. Compare with our last 3 normal video posts, not with the 7x figure.

## How we apply it to Cedwyn
- **Format that fits the rules:** a real-time talk, e.g. "Reading one record live": a presenter on camera with one catalogue item on screen share (OBS window capture), explaining what the record is, where it is held and its date, then live Q&A. It is live and educational, not a sales stream; the /ebooks/ link goes in a pinned comment once, not on a banner.
- **Not allowed:** streaming documentary scenes or the YouTube Shorts from this box as a "live" (pre-recorded is against the guidelines). ffmpeg -> RTMP from this box is only for the 1-minute ingest test (preview, never click Go live).
- **Who:** needs a person on camera. Never name the owner publicly; the presenter is introduced by role. Same editorial rules as all public text: banned words list, no insignia, nothing about family holdings, Llandough Farm is not Great House Farm.
- **Kill rule:** two streams with fewer than 10 live viewers and under 5 comments -> stop and keep clips-only posting.
- Next step (owner's GO needed): one 25-minute pilot, logged to the project workspace

## Sources
- linkedin.com (read)
- linkedin.com (read)
- linkedin.com (read)
- linkedin.com (read)
- linkedin.com (search preview only)
- linkedin.com (read; 7x/24x = paid pilot data)