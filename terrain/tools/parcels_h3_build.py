"""Wales 3D v0.2.0: build data/parcels59.json and data/h3cells.json from the Tithe H3 parcels.
Run: timeout -k 5 120 python3 tools/parcels_h3_build.py <stewart-parcels.geojson> <stewart-parcels.csv> <out data dir>
Needs pyproj and h3 (4.x). Frame: x = E - 317000, z = 174000 - N (EPSG:27700). — Sion's Tab agent"""
import sys, json, csv, h3
from pyproj import Transformer
gjp, csvp, outd = sys.argv[1:4]
tr = Transformer.from_crs(4326, 27700, always_xy=True); inv = Transformer.from_crs(27700, 4326, always_xy=True)
def loc(lon, lat): E, N = tr.transform(lon, lat); return [round(E - 317000, 1), round(174000 - N, 1)]
def ll(x, z): return inv.transform(x + 317000, 174000 - z)
gj = json.load(open(gjp)); rows = list(csv.DictReader(open(csvp)))
feat = {f['properties']['stewart_no']: f for f in gj['features']}
ALIAS = {'homestead group (numbers 1-4 not read)': '1–4', 'not read A (wooded strip between 8, 27 and 28)': 'A', 'not read B (field between 29 and 30)': 'B'}
def rings(g):
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    return [[loc(*c[:2]) for c in poly[0]] for poly in polys]
out = []
for r in rows:
    k = r['stewart_no']
    if k in ('1', '2', '3', '4'): continue
    e = {'id': ALIAS.get(k, k), 'label': k}; f = feat.get(k)
    if f:
        p = f['properties']
        e.update({'rings': rings(f['geometry']), 'use': p.get('tithe_land_use') or '', 'name': p.get('tithe_field_name') or '',
                  'plot': p.get('tithe_plots_1841') or '', 'area': p.get('traced_area_acres'), 'tarea': p.get('tithe_area_as_entered') or '',
                  'owner': p.get('tithe_landowner_as_entered') or '', 'occ': p.get('tithe_occupier_as_entered') or '',
                  'src': p.get('geometry_source') or '', 'grid': p.get('os_grid_ref') or '', 'read': p.get('number_read') or '',
                  'h11': len(p.get('h3_res11', [])), 'h12': len(p.get('h3_res12', []))})
    else: e['status'] = r['status']
    out.append(e)
out.sort(key=lambda e: (0, 0) if e['id'] == '1–4' else (1, int(e['id'])) if e['id'].isdigit() else (2, ord(e['id'][0])))
xy = [p for e in out if 'rings' in e for q in e['rings'] for p in q]; M = 300
x0, x1 = min(p[0] for p in xy) - M, max(p[0] for p in xy) + M; z0, z1 = min(p[1] for p in xy) - M, max(p[1] for p in xy) + M
poly = h3.LatLngPoly([(la, lo) for lo, la in [ll(x0, z0), ll(x1, z0), ll(x1, z1), ll(x0, z1)]])
def bnd(c): return sum([loc(lo, la) for la, lo in h3.cell_to_boundary(c)], [])
H = {}
for res in (10, 11):
    cells = sorted(h3.polygon_to_cells(poly, res)); H[str(res)] = {'ids': cells if res == 11 else [], 'b': [bnd(c) for c in cells]}
c12 = sorted({c for f in gj['features'] for c in f['properties'].get('h3_res12', [])}); H['12'] = {'ids': [], 'b': [bnd(c) for c in c12]}
meta = {'version': '0.2.0', 'source': 'Tithe H3 v0.5.0 (section/tithe-h3): David Stewart estate plan c.1824 parcels traced through the 1841 Llandough tithe map; H3 cells computed with h3 4.x from the same parcel geometry',
        'frame': 'x=E-317000, z=174000-N (OSGB36 / EPSG:27700)', 'box': [round(x0, 1), round(z0, 1), round(x1 - x0, 1), round(z1 - z0, 1)], 'counts': {k: len(v['b']) for k, v in H.items()}}
json.dump({'meta': {**meta, 'plan_numbers': 59, 'drawn': sum('rings' in e for e in out), 'note': 'Plan numbers 1-4 are mapped as one homestead group; 18 and 46-59 are not placed (not found or not read on the plan screenshot). A and B are unread parcels.'}, 'parcels': out},
          open(outd + '/parcels59.json', 'w'), separators=(',', ':'), ensure_ascii=False)
json.dump({'meta': meta, 'res': H}, open(outd + '/h3cells.json', 'w'), separators=(',', ':'))
print(meta['counts'], len(out))
