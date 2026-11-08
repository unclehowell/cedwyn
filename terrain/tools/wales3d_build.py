#!/usr/bin/env python3
"""Wales 3D world preprocessing (phase 1).
Inputs (open data, downloaded on first run):
  - Welsh Government LiDAR 2020-22 1 m DTM + DSM tiles (DataMapWales tile catalogue, Open Government Licence)
  - OpenStreetMap ways via Overpass (ODbL)
  - Tithe H3 parcels GeoJSON (Stewart plan via the 1841 tithe map), for the lat/lon -> OS grid fit and the 1841 layer
Outputs (web/data/):
  dtm4m.png      1000x1000 terrain-RGB style heightmap, 4 m cells, h = (R*256+G)/100 - 10 metres
  cover2m.png    2048x2048 RGB cover map: R woodland/scrub, G paved, B water
  world.json     buildings (footprint, base, height), roads, rivers, metadata
  trees.bin      Int16 triplets (x*2, z*2, height*10) of LiDAR canopy peaks (nDSM local maxima)
  shrubs.bin     Int16 triplets for low vegetation (hedges/scrub 1.2-4 m)
  parcels1841.json  tithe-era parcels in local metres with land use
Area: OS grid E 315000-319000, N 172000-176000 (ST1572-ST1875). Local frame: x = E-317000, z = 174000-N.
Run: timeout -k 10 900 python3 tools/wales3d_build.py <workdir> <parcels.geojson>   
"""
import sys, os, json, math, requests, numpy as np
from PIL import Image, ImageDraw
W=sys.argv[1]; PARC=sys.argv[2]; OUT=os.path.join(W,'web','data'); RAW=os.path.join(W,'raw')
os.makedirs(OUT,exist_ok=True); os.makedirs(RAW,exist_ok=True)
E0,N0,E1,N1=315000,172000,319000,176000; CE,CN=317000,174000
UA={'User-Agent':'cedwyn-wales3d/0.1 (heritage map preprocessing)'}
def tiles():
    u=("https://datamap.gov.wales/geoserver/ows?service=WFS&version=2.0.0&request=GetFeature"
       "&typeNames=geonode:welsh_government_lidar_tile_catalogue_2020_2023&outputFormat=application/json"
       f"&srsName=EPSG:27700&bbox={E0+500},{N0+300},{E1-500},{N1-700},EPSG:27700&count=40")
    return {f['properties']['british_gr']:f['properties'] for f in requests.get(u,timeout=90).json()['features']}
def mosaic(kind):
    M=np.zeros((N1-N0,E1-E0),np.float32); T=None
    for gr in [f"ST{e}{n}" for e in range(15,19) for n in range(72,76)]:
        p=os.path.join(RAW,f"{gr}{'' if kind=='dtm' else '_dsm'}.tif")
        if not os.path.exists(p):
            T=T or tiles(); open(p,'wb').write(requests.get('https://'+T[gr][kind+'_link'],timeout=120).content)
        im=Image.open(p); a=np.array(im).astype(np.float32); x0,y0=im.tag_v2.get(33922)[3:5]
        a[a<-100]=np.nan; r=int(N1-y0); c=int(x0-E0); M[r:r+1000,c:c+1000]=a
    return np.nan_to_num(M,nan=np.nanmin(M))
DTM=mosaic('dtm'); DSM=mosaic('dsm')
H=DTM.reshape(1000,4,1000,4).mean(axis=(1,3)); v=np.clip(np.round((H+10)*100),0,65535).astype(np.uint16)
rgb=np.zeros((1000,1000,3),np.uint8); rgb[...,0]=v>>8; rgb[...,1]=v&255
Image.fromarray(rgb,'RGB').save(os.path.join(OUT,'dtm4m.png'),optimize=True)
# lat/lon -> OS grid: least-squares affine on the parcel centroids (max residual ~0.7 m over the estate)
g=json.load(open(PARC))
P=np.array([[f['properties']['centroid_lon'],f['properties']['centroid_lat'],1] for f in g['features']])
EN=np.array([[f['properties']['os_easting'],f['properties']['os_northing']] for f in g['features']],float)
A=np.linalg.lstsq(P,EN,rcond=None)[0]
def ll2loc(lon,lat):
    e,n=np.array([lon,lat,1.0])@A; return float(e-CE), float(CN-n)
def ring(coords): return [ll2loc(c['lon'],c['lat']) if isinstance(c,dict) else ll2loc(*c[:2]) for c in coords]
osm_p=os.path.join(RAW,'osm.json')
if not os.path.exists(osm_p):
    s,w,n,e=51.4405,-3.2244,51.4772,-3.1677
    q=f"""[out:json][timeout:90];(way["building"]({s},{w},{n},{e});way["highway"]({s},{w},{n},{e});way["waterway"]({s},{w},{n},{e});
way["natural"~"wood|water|scrub|wetland"]({s},{w},{n},{e});way["landuse"]({s},{w},{n},{e});way["barrier"~"hedge|wall"]({s},{w},{n},{e});
way["leisure"~"park|golf_course|pitch|nature_reserve"]({s},{w},{n},{e});way["railway"]({s},{w},{n},{e});
relation["natural"~"wood|water"]({s},{w},{n},{e});relation["landuse"]({s},{w},{n},{e});node["amenity"="place_of_worship"]({s},{w},{n},{e}););out geom;"""
    for ep in ["https://overpass.private.coffee/api/interpreter","https://overpass-api.de/api/interpreter"]:
        r=requests.post(ep,data={'data':q},headers=UA,timeout=120)
        if r.status_code==200: open(osm_p,'wb').write(r.content); break
osm=json.load(open(osm_p))
SZ=2048; PX=SZ/4000.0
def topx(pts): return [((x+2000)*PX,(z+2000)*PX) for x,z in pts]
cov=[Image.new('L',(SZ,SZ),0) for _ in range(3)]; dr=[ImageDraw.Draw(c) for c in cov]
bmask=Image.new('L',(2000,2000),0); bd=ImageDraw.Draw(bmask)
buildings=[]; roads=[]; rivers=[]; churches=[]
RW={'motorway':14,'trunk':12,'primary':10,'secondary':8,'tertiary':7,'unclassified':5,'residential':6,'service':4,'living_street':5,
    'track':3,'footway':1.6,'path':1.4,'bridleway':2,'cycleway':2,'steps':1.6,'pedestrian':4}
def polys(el):
    if el['type']=='way' and 'geometry' in el: return [ring(el['geometry'])]
    if el['type']=='relation': return [ring(m['geometry']) for m in el.get('members',[]) if m.get('role')=='outer' and 'geometry' in m]
    return []
for el in osm['elements']:
    t=el.get('tags',{})
    if el['type']=='node' and t.get('amenity')=='place_of_worship':
        churches.append([*map(lambda v:round(v,1),ll2loc(el['lon'],el['lat'])),t.get('name','')]); continue
    for pts in polys(el):
        if len(pts)<2: continue
        closed=len(pts)>3 and abs(pts[0][0]-pts[-1][0])<0.01 and abs(pts[0][1]-pts[-1][1])<0.01
        if 'building' in t and closed:
            xs=[p[0] for p in pts]; zs=[p[1] for p in pts]
            if max(xs)<-2000 or min(xs)>2000 or max(zs)<-2000 or min(zs)>2000: continue
            m=Image.new('L',(int(max(xs)-min(xs))+3,int(max(zs)-min(zs))+3),0)
            ImageDraw.Draw(m).polygon([(x-min(xs)+1,z-min(zs)+1) for x,z in pts],fill=1); m=np.array(m).astype(bool)
            c0=int(min(xs)+2000)-1; r0=int(min(zs)+2000)-1; r1=r0+m.shape[0]; c1=c0+m.shape[1]
            if r0<0 or c0<0 or r1>4000 or c1>4000: continue
            dt=DTM[r0:r1,c0:c1][m]; nd=(DSM-DTM)[r0:r1,c0:c1][m]
            if dt.size==0: continue
            hgt=None
            for k in ('height','building:height'):
                try: hgt=float(t[k].split()[0]); break
                except Exception: pass
            if hgt is None and 'building:levels' in t:
                try: hgt=float(t['building:levels'])*3+1
                except Exception: pass
            src='osm'
            if hgt is None: hgt=float(np.percentile(nd,80)); src='lidar'
            hgt=float(min(max(hgt,2.6),40))
            buildings.append({'p':[[round(x,1),round(z,1)] for x,z in pts[:-1]],'b':round(float(np.percentile(dt,10)),2),'h':round(hgt,1),
                              'k':t.get('building','yes'),'s':src,**({'n':t['name']} if 'name' in t else {})})
            bd.polygon([(x/2+1000,z/2+1000) for x,z in pts],fill=1)
            continue
        hw=t.get('highway'); ww=t.get('waterway'); nat=t.get('natural'); lu=t.get('landuse')
        if hw in RW:
            roads.append({'c':hw,'w':RW[hw],'p':[[round(x,1),round(z,1)] for x,z in pts],**({'n':t['name']} if 'name' in t else {})})
            if hw not in ('footway','path','steps','bridleway','cycleway','track'):
                dr[1].line(topx(pts),fill=255,width=max(1,int(RW[hw]*PX+0.5)),joint='curve')
            else: dr[1].line(topx(pts),fill=110,width=max(1,int(RW[hw]*PX+0.5)))
        elif ww in ('river','stream','canal','drain','ditch'):
            wd={'river':18,'canal':10,'stream':3,'drain':1.5,'ditch':1.2}[ww]
            rivers.append({'c':ww,'w':wd,'p':[[round(x,1),round(z,1)] for x,z in pts],**({'n':t['name']} if 'name' in t else {})})
            dr[2].line(topx(pts),fill=255,width=max(1,int(wd*PX+0.5)),joint='curve')
        elif closed and (nat in ('wood','scrub') or lu in ('forest',)):
            dr[0].polygon(topx(pts),fill=255 if nat!='scrub' else 150)
        elif closed and (nat in ('water','wetland') or lu in ('reservoir','basin') or t.get('water')):
            dr[2].polygon(topx(pts),fill=255 if nat!='wetland' else 90)
        elif closed and lu in ('residential','industrial','commercial','retail','railway','construction','brownfield'):
            dr[1].polygon(topx(pts),fill={'residential':40}.get(lu,120))
        elif t.get('railway') in ('rail','abandoned','disused') and not closed:
            dr[1].line(topx(pts),fill=150,width=max(1,int(5*PX)))
cv=np.dstack([np.array(c) for c in cov]).astype(np.uint8)
Image.fromarray(cv,'RGB').save(os.path.join(OUT,'cover2m.png'),optimize=True)
# LiDAR vegetation: nDSM local maxima on a 2 m grid, outside building footprints
nd=(DSM-DTM).reshape(2000,2,2000,2).max(axis=(1,3)); bm=np.array(bmask).astype(bool)
from numpy.lib.stride_tricks import sliding_window_view as sw
bm=sw(np.pad(bm,1),(3,3)).max(axis=(2,3))
win=sw(np.pad(nd,3),(7,7)).max(axis=(2,3)); tr=(nd==win)&(nd>4)&(nd<35)&~bm
ys,xs=np.nonzero(tr)
def pack(ys,xs,h,name):
    arr=np.stack([np.round((xs*2+1-2000)*2),np.round((ys*2+1-2000)*2),np.round(h*10)],1).astype(np.int16)
    arr.tofile(os.path.join(OUT,name)); return len(arr)
nt=pack(ys,xs,nd[ys,xs],'trees.bin')
win2=sw(np.pad(nd,1),(3,3)).max(axis=(2,3)); sh=(nd==win2)&(nd>1.2)&(nd<=4)&~bm&((np.arange(2000)[:,None]+np.arange(2000)[None,:])%2==0)
ys2,xs2=np.nonzero(sh); ns=pack(ys2,xs2,nd[ys2,xs2],'shrubs.bin')
# 1841 parcels
parc=[]
for f in g['features']:
    pr=f['properties']; geo=f['geometry']; rs=geo['coordinates'] if geo['type']=='Polygon' else [c[0] for c in geo['coordinates']]
    for r in ([rs[0]] if geo['type']=='Polygon' else rs):
        parc.append({'no':pr.get('stewart_no'),'use':pr.get('tithe_land_use'),'name':pr.get('tithe_field_name'),
                     'plot':pr.get('tithe_plots_1841'),'grid':pr.get('os_grid_ref'),
                     'p':[[round(a,1),round(b,1)] for a,b in (ll2loc(*c[:2]) for c in r)]})
json.dump(parc,open(os.path.join(OUT,'parcels1841.json'),'w'),separators=(',',':'))
meta={'version':'0.1.0','frame':{'origin_os':[CE,CN],'x':'E-317000','z':'174000-N','extent_m':4000},
      'heightmap':{'file':'dtm4m.png','size':1000,'cell_m':4,'decode':'(R*256+G)/100-10','min':round(float(H.min()),2),'max':round(float(H.max()),2)},
      'anchor':{'name':'Great House Farm (Ty Mawr)','os':[316817,173315]},'trees':nt,'shrubs':ns,'churches':churches}
json.dump({'meta':meta,'buildings':buildings,'roads':roads,'rivers':rivers},open(os.path.join(OUT,'world.json'),'w'),separators=(',',':'))
print(json.dumps({'buildings':len(buildings),'roads':len(roads),'rivers':len(rivers),'trees':nt,'shrubs':ns,
  'files':{f:os.path.getsize(os.path.join(OUT,f)) for f in os.listdir(OUT)}}))

# ---- split for static hosting / small commits: every file under 400 KB ----
def chunks(items, prefix, limit=380000):
    out=[]; cur=[]; size=2
    for it in items:
        s=len(json.dumps(it,separators=(',',':')))+1
        if cur and size+s>limit: out.append(cur); cur=[]; size=2
        cur.append(it); size+=s
    if cur: out.append(cur)
    names=[]
    for i,c in enumerate(out):
        n=f'{prefix}-{i}.json'; json.dump(c,open(os.path.join(OUT,n),'w'),separators=(',',':')); names.append(n)
    return names
# heightmap as 2x2 tiles of 500x500 (same encoding)
full=Image.open(os.path.join(OUT,'dtm4m.png'))
for ty in range(2):
    for tx in range(2):
        full.crop((tx*500,ty*500,tx*500+500,ty*500+500)).save(os.path.join(OUT,f'dtm4m-{tx}{ty}.png'),optimize=True)
os.remove(os.path.join(OUT,'dtm4m.png'))
meta['heightmap']['tiles']={'grid':2,'size':500,'pattern':'dtm4m-{x}{y}.png'}
manifest={'meta':meta,'buildings':chunks(buildings,'buildings'),'roads':chunks(roads,'roads'),'rivers':chunks(rivers,'rivers')}
json.dump(manifest,open(os.path.join(OUT,'world.json'),'w'),separators=(',',':'),indent=0)
print(json.dumps({f:os.path.getsize(os.path.join(OUT,f)) for f in sorted(os.listdir(OUT))}))
