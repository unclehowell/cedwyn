#!/usr/bin/env python3
# Mr Wolf area entry for data/site-areas.json (slot 40 of 59). That file was last edited by the owner's account
# (6fb7840, /hubspot/ slot 37), so this worker did not commit to it (P-131). The root applies this at merge time:
#   python3 apply_site_areas.py /path/to/cedwyn/data/site-areas.json
# Idempotent: appends the mr-wolf area once, keeps every other entry and its order untouched, and sets area_count to
# the number of areas (tools/site.py on #98/#mr-wolf-main reads area_count). Safe with #98 (forensic, 38) and
# #90 (chestnut) in any order. - Sion's Tab agent
import json, sys
p = sys.argv[1]
d = json.load(open(p))
areas = d['areas']
if not any(a.get('id') == 'mr-wolf' for a in areas):
    areas.append({
        "id": "mr-wolf",
        "title": "Mr Wolf",
        "source_themes": ["mr-wolf"],
        "path": "/mr-wolf/",
        "description": "What's the time, Mr Wolf? The leads closest to the threshold for reopening the 1987 judgment, each scored out of 200.",
        "serendipity_slot": 40,
        "parcel_record": "/research/evidence/ev-0215-tithe-apportionment-john-williams-c1841/",
        "tithe_parcel_number": None,
        "parcel_mapping_status": "historic_plot_number_pending_verification"
    })
d['area_count'] = len(areas)
json.dump(d, open(p, 'w'), indent=2, ensure_ascii=False)
open(p, 'a').write('\n')
print('areas', len(areas), 'slots', [(a['id'], a.get('serendipity_slot')) for a in areas[-4:]])
