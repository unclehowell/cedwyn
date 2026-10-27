# Selling a documentary direct: free cut, paid latest version, own the buyer list (2026 practitioner evidence)

Skill for: turning /documentary/ (v1.0.0 free, latest version £4.99 with licence tick, academy members included) into sales and an audience. Written 2026-10-27 for the project lead's Cedwyn work.

## What practitioners report (sources read today unless marked)
- **Stephen Follows, "Nine lessons from almost 100 film distribution case studies" (Apr 2026; synthesis of Ted Hope's FilmStack case-study list; free part read, rest paywalled):**
  - Strongest predictor of success: an audience built before release.
  - *1946* (documentary, Netflix passed): Zoom focus groups, regular newsletter, super-fans as volunteer ambassadors; 500+ watch parties in 25 countries; $118,000 net virtual-screening revenue; kept all rights and viewer data.
  - *The Wisdom of Trauma*: sold only through its own website (Vimeo player); email list grew 60,000 to 900,000 during the campaign; first-week revenue beat the whole budget; 50-60% of views came from word of mouth, not ads.
  - *Cryptopia*: 70% of crowdfunding money came via email.
  - *Mama Bears* director regretted not collecting emails systematically.
  - *Union*: a five-day Black Friday rental window ("This Black Friday, don't order from Amazon. Watch UNION") drew 2,000 rentals and netted as much as its entire cinema run.
  - "Eventize every screening": a screening plus a talk, meal or Q&A outsells a bare showing (*Sabbath Queen* $110,000+ box office from packaged events).
- **Peter Gerard (ex-VP Vimeo On Demand) on Jon Reiss's Substack, 30 Jan 2025 (read):**
  - Vimeo's marketplace brings almost no discovery; search and Staff Picks are disabled in the UK/EU. Every buyer comes from your own efforts, so keep their email address.
  - Hosting a feature costs about $0.30/month and streaming about $0.10 per view; a simple self-built paywall costs only hosting, bandwidth and card fees.
  - Most filmmakers do not sell enough for platform fees to matter; pick the tool that keeps the buyer's email.
  - Reiss: transactional (rent/buy) numbers for indies have "cratered" on conventional platforms in recent years, with notable exceptions.
- **Reddit r/documentaryfilmmaking (snippet, not checked):** one filmmaker found direct sales "very soft" because "people do not like joining new services"; sales improved on Amazon.

## The playbook
1. **The free cut is the lead magnet.** Every play of v1.0.0 should end on one ask: get notified when the next scene lands (email signup), with the paid latest version second.
2. **Own the buyer list.** Stripe checkout already collects the email; tag documentary buyers in Mailchimp (documentary-buyer) so each new version is an email to people who already paid once.
3. **Each new version is a release event.** Short changelog ("v1.1.0 adds scene 3: ...") on the page, one email, one social post, one 30-60 s clip. Same pattern as release-notes-changelog-versioned-ebooks-art.md.
4. **Time-boxed windows sell.** A 3-5 day window around a date ("watch scenes 1-3 this St David's Day weekend") gives a reason to act now, if the price and dates are real (UK DMCC: no fake urgency; see uk-dmcc-act-urgency-reviews-price-copy.md).
5. **Eventize.** Offer the film to local history societies, libraries and Welsh-Patagonian groups as a screening plus a talk; we already hold talk-route skills (u3a, WI, Rotary, libraries). One free online watch-and-Q&A per new version.
6. **Watch parties.** A "host a screening" kit (licence for a group showing, 5-question discussion sheet, a link) turns fans into ambassadors, the *1946* model.
7. **Measure:** free plays, play-to-signup %, signup-to-purchase %, buyers per version email. Use UTMs on every link (utm-discipline-ga4-funnel.md).

## How we apply it to Cedwyn
- Add one end-card on /documentary/ after v1.0.0: "Scene 3 is in production. Get an email when it lands" (Mailchimp form) and "Watch the latest version, £4.99".
- Make sure the £4.99 checkout's buyer email reaches Mailchimp with a documentary-buyer tag (needs the Stripe-to-Mailchimp sync the platform worker owns; propose, don't build here).
- Each daily movie scene (schedule 46f0e0fe) = a minor version bump + one email to the documentary list + one short clip. Never daily emails: batch to one email per new paid version.
- Group-screening licence: extend /documentary/licence/ with a "community screening" line (free for non-profit groups who register). This feeds the talks circuit. Proposal only; licence wording is the owner's call.
- Keep it on our own site; no Vimeo On Demand or other marketplace (no discovery, and UK/EU trader rules would put contact details on a public listing).

## Sources
- stephenfollows.com (Apr 2026, free section read 2026-10-27)
- jonreiss.substack.com (30 Jan 2025, read 2026-10-27)
- reddit.com (snippet only, not checked)