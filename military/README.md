# Military Involvement

Webapp 48 of 59 on [cedwyn.bucklerfamily.estate](https://cedwyn.bucklerfamily.estate/military/) (path `/military/`), in its own repository
(webapp migration 59+1; assignment issue unclehowell/cedwyn#466; companion Kissed Frogs segment unclehowell/cedwyn-kissed-frogs#1).

A dated timeline of military activity and presence around Tŷ Mawr (Great House), Llandough, Lavernock, Flat Holm and Penarth,
held as data (`data/timeline.json`). Every entry carries a label (record / testimony / hypothesis), a verbatim quote, its source,
what cuts against it, and the free request that would settle it. Military involvement is a hypothesis unless a record states it.
No family relationship is assumed.

## Slot
Slot 48 replaces the placeholder `unclehowell/coming-soon-48`. Registering it in the navigator (a `"slot": 48` themes.json entry and
removing slot 48 from `data/coming-soon.json`) depends on PR #458 on unclehowell/cedwyn, which waits on the owner; this repository
does not touch that PR or its files. The coming-soon-48 repository is deleted only once `/military/` is live reading "48 of 59".

## Preview
https://cedwyn-military-preview.righteous.workers.dev/ (static Cloudflare Worker built from `worker/preview.js`; checked at 390 px).

## Get the code
```
git clone --depth 1 https://github.com/unclehowell/cedwyn-military.git
```

Never force-push.
