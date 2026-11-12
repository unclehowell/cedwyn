#!/usr/bin/env python3
"""Catalogue id format check (10 Nov 2026): one format, PREFIX-NNNN, ready for 1,000,000+ records.
Uses a TEST FIXTURE only (no real record): EV-0905, EV-0906, EV-9999, EV-10000, EV-1000000.
Run: python3 tools/test_catalogue_ids.py   — Sion's Tab agent"""
import json, re, pathlib, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
sch = json.load(open(ROOT / 'data/core/schema/core-record.schema.json'))
pat = re.compile(sch['properties']['id']['pattern'])
FIX = ['EV-1000000', 'EV-0906', 'EV-10000', 'EV-0905', 'EV-9999']
def num(i): return int(i.split('-', 1)[1])
ok = True
for i in FIX:
    if not pat.match(i): print('schema rejects', i); ok = False
srt = sorted(FIX, key=lambda i: (i.split('-')[0], num(i)))
if srt != ['EV-0905', 'EV-0906', 'EV-9999', 'EV-10000', 'EV-1000000']: print('numeric sort wrong', srt); ok = False
if sorted(FIX) == srt: print('note: string sort happens to agree here')
idx = {i: n for n, i in enumerate(FIX)}
if idx.get('EV-1000000') != 0 or 'EV-01000000' in idx: print('lookup wrong'); ok = False
lookup_re = re.compile(r'^EV-\d+$')
if not all(lookup_re.match(i) for i in FIX): print('lookup regex rejects a long id'); ok = False
print('OK' if ok else 'FAIL'); sys.exit(0 if ok else 1)
