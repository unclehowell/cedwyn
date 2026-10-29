#!/usr/bin/env python3
"""build_traffic.py — aggregate-only Cedwyn traffic feed for agents, from the connected Cloudflare account (no Google Analytics).
Usage: TAB_TASK_ID=<id> timeout -k 5 600 python3 /home/user/tab/work/cedwyn-traffic/build_traffic.py [--days 8]
Writes work/cedwyn-traffic/traffic.json (published) and history.json (per-day aggregates kept across runs, so the daily
series grows to 30 days even though Cloudflare's per-host adaptive data on this plan only reaches back ~8 days).
Aggregates only: no IPs, no user agents, no individual visits. User agents are read in memory to classify, then discarded.
Classification (same rules as work/bizdev/skills/tools/human_traffic_split.py): own tooling / declared bots and crawlers /
suspected automation (outdated device strings, known scraper clusters) / likely human (an upper bound, not a verdict).
— Sion's Tab agent, 29 Oct 2026"""
import json, os, re, sys, time, subprocess, datetime as dt, collections
HERE=os.path.dirname(os.path.abspath(__file__))
CLI='/home/user/tab/connected-apps-cli.mjs'; ZONE='5307ac7d55a77d914b81d79c79532dde'; HOST='cedwyn.bucklerfamily.estate'
a=sys.argv; DAYS=int(a[a.index('--days')+1]) if '--days' in a else 8
TID=os.environ.get('TAB_TASK_ID') or 'cedwyn-traffic'; RQ=f'/home/user/tab/tasks/{TID}'; os.makedirs(RQ,exist_ok=True)
Q=('query($z:String!,$s:Time!,$e:Time!,$h:String!){viewer{zones(filter:{zoneTag:$z}){'
   'httpRequestsAdaptiveGroups(limit:10000,orderBy:[count_DESC],filter:{datetime_geq:$s,datetime_lt:$e,clientRequestHTTPHost:$h,'
   'requestSource:"eyeball",edgeResponseContentTypeName:"html",edgeResponseStatus:200})'
   '{count sum{visits} dimensions{clientRequestPath clientCountryName userAgent}}}}}')
OWN=re.compile(r"tab agent|cedwyn-|headless|orphan_depth|flywheel|workboard|linkcheck|python|curl/|node|axios|go-http|aiohttp|okhttp|wget|java/|libwww|scrapy|httpclient|^mozilla/5\.0$|^mozilla/5\.0 \((iphone|x11)\)$",re.I)
BOT=re.compile(r"bot\b|bot/|crawl|spider|slurp|externalagent|externalhit|gptbot|claude|perplexity|bytespider|ahrefs|semrush|petal|yandex|baidu|applebot|amazonbot|ccbot|dataforseo|barkrowler|preview|validator|monitor|uptime|feed|lighthouse|pagespeed|whatsapp|telegram|slack|discord|twitter|linkedin|embedly|iframely|archive\.org|google-|inspectiontool|mcp",re.I)
def suspect(u):
    if 'Nexus 5X Build/MMB29P' in u: return True
    m=re.search(r'iPhone OS (\d+)',u)
    if m and int(m.group(1))<17: return True
    m=re.search(r'Android (\d+)',u)
    if m and int(m.group(1))<10: return True
    m=re.search(r'Chrome/(\d+)',u)
    if m and int(m.group(1))<135: return True
    if 'Edg' in u and 'iPhone' in u and 'EdgiOS' not in u: return True
    return False
def cls(u):
    u=(u or '').strip()
    if not u or OWN.search(u): return 'own_tooling'
    if BOT.search(u): return 'bots_crawlers'
    if suspect(u): return 'suspected_automation'
    return 'likely_human'
_last=[0]
def query(s,e,i):
    for t in range(3):
        gap=time.time()-_last[0]
        if gap<3.5: time.sleep(3.5-gap)
        req={'toolkit':'cloudflare','tool_slug':'CLOUDFLARE_QUERY_GRAPHQL_ANALYTICS',
             'arguments':{'query':Q,'variables':{'z':ZONE,'s':s,'e':e,'h':HOST,'_r':str(time.time())}}}
        p=f'{RQ}/ctf-{os.getpid()}-{i}-{t}.json'; json.dump(req,open(p,'w'))
        r=subprocess.run(['timeout','-k','5','150','node',CLI,'connected_apps.execute',p],capture_output=True,text=True)
        _last[0]=time.time()
        try: os.remove(p)
        except OSError: pass
        try:
            j=json.loads(r.stdout)['result']
            if isinstance(j,dict) and 'result_path' in j:
                rp=j['result_path']; body=json.load(open(rp)); os.remove(rp)
                body=body.get('result',body) if 'data' not in body else body
            else: body=j.get('result',j)
            return body['data']['viewer']['zones'][0]['httpRequestsAdaptiveGroups']
        except Exception as ex:
            err=str(ex)[:120]; time.sleep(5)
    raise RuntimeError('cloudflare query failed: '+err)
def section(p):
    if p in ('/','/index.html'): return '/'
    seg=p.strip('/').split('/')[0]
    return '/'+seg+'/' if seg else '/'
now=dt.datetime.utcnow().replace(microsecond=0)
HP=os.path.join(HERE,'history.json')
hist=json.load(open(HP)) if os.path.exists(HP) else {'days':{}}
for d in range(DAYS-1,-1,-1):
    day=(now.date()-dt.timedelta(days=d)); s=dt.datetime.combine(day,dt.time()); e=min(s+dt.timedelta(days=1),now)
    try: rows=query(s.isoformat()+'Z',e.isoformat()+'Z',d)
    except Exception as ex: print('skip',day,ex,file=sys.stderr); continue
    if not rows: continue
    split=collections.Counter(); visits=collections.Counter(); paths=collections.Counter(); secs=collections.Counter()
    cc=collections.Counter(); cc_all=collections.Counter(); home=0; eb=0; ebx=0
    for r in rows:
        k=cls(r['dimensions']['userAgent']); n=r['count']; v=(r.get('sum') or {}).get('visits',0)
        p=r['dimensions']['clientRequestPath'] or '/'; c=r['dimensions']['clientCountryName'] or 'XX'
        split[k]+=n; visits[k]+=v
        if k=='own_tooling': continue
        cc_all[c]+=n
        if k!='likely_human': continue
        paths[p]+=n; secs[section(p)]+=n; cc[c]+=n
        if p in ('/','/index.html'): home+=n
        if p.startswith('/ebooks/'): eb+=n
        if p in ('/ebooks/','/ebooks/index.html'): ebx+=n
    hist['days'][day.isoformat()]={'complete':e-s>=dt.timedelta(days=1),'page_views_all':sum(split.values()),
        'page_views_excl_own_tooling':sum(split.values())-split['own_tooling'],'split':dict(split),
        'visits_likely_human':visits['likely_human'],'visits_excl_own_tooling':sum(visits.values())-visits['own_tooling'],
        'human_home_views':home,'human_ebooks_views':eb,'human_ebooks_index_views':ebx,
        'human_paths':dict(paths.most_common(60)),'human_sections':dict(secs.most_common(40)),
        'human_countries':dict(cc.most_common(25)),'countries_excl_own_tooling':dict(cc_all.most_common(25))}
keep=sorted(hist['days'])[-30:]; hist['days']={k:hist['days'][k] for k in keep}
json.dump(hist,open(HP,'w'),separators=(',',':'))
D=hist['days']; ks=sorted(D)
def window(n):
    sel=ks[-n:]; tp=collections.Counter(); tc=collections.Counter(); ts=collections.Counter(); sp=collections.Counter()
    hv=eb=ebx=vh=0
    for k in sel:
        x=D[k]; tp.update(x['human_paths']); tc.update(x['human_countries']); ts.update(x['human_sections']); sp.update(x['split'])
        hv+=x['human_home_views']; eb+=x['human_ebooks_views']; ebx+=x['human_ebooks_index_views']; vh+=x['visits_likely_human']
    ext=sum(sp.values())-sp['own_tooling']; hum=sp['likely_human']
    return {'days':len(sel),'from':sel[0] if sel else None,'to':sel[-1] if sel else None,
        'page_views_excl_own_tooling':ext,'page_views_likely_human':hum,'visits_likely_human':vh,
        'share':{'likely_human':round(hum/ext,3) if ext else None,'bots_crawlers':round(sp['bots_crawlers']/ext,3) if ext else None,
                 'suspected_automation':round(sp['suspected_automation']/ext,3) if ext else None},
        'uk_page_views_likely_human':tc.get('GB',0),
        'top_paths_likely_human':[{'path':p,'views':n} for p,n in tp.most_common(20)],
        'top_sections_likely_human':[{'section':p,'views':n} for p,n in ts.most_common(15)],
        'top_countries_likely_human':[{'country':c,'views':n} for c,n in tc.most_common(10)],
        'home_to_ebooks':{'home_views':hv,'ebooks_views':eb,'ebooks_index_views':ebx,
            'ebooks_index_per_home_view':round(ebx/hv,3) if hv else None,
            'method':'likely-human views of /ebooks/ divided by likely-human views of /. Referrer paths are not available on this Cloudflare plan, so this is a ratio of page views, not a tracked click path.'}}
out={'schema':'cedwyn_traffic/v1','site':'https://'+HOST+'/','generated_at':now.isoformat()+'Z',
 'source':'Cloudflare edge analytics for this host (HTML pages answered 200 to real browsers and agents). No Google Analytics, no cookies, no client-side tracking.',
 'privacy':'Aggregates only. No IP addresses, user agents, individual visits or personal data are published.',
 'definitions':{'page_views':'HTML responses with status 200 for this host.',
   'likely_human':'Page views whose browser string is current and not a declared bot, crawler, scraper or our own tooling. An upper bound of real people.',
   'bots_crawlers':'Declared bots, crawlers, link previewers and AI agents.',
   'suspected_automation':'Outdated or mismatched device strings typical of scraper clusters.',
   'own_tooling':'Requests from the project\'s own checkers and agents; excluded from every share and total below.',
   'visits':'Cloudflare visits (a page view whose referrer is not this site).'},
 'coverage':{'days_held':len(ks),'first_day':ks[0] if ks else None,'last_day':ks[-1] if ks else None,
   'note':'Cloudflare keeps per-host detail for about 8 days on this plan; each refresh adds its days to a rolling 30-day history.'},
 'last_7_days':window(7),'last_30_days':window(30),
 'daily':[{'date':k,'complete':D[k]['complete'],'page_views_excl_own_tooling':D[k]['page_views_excl_own_tooling'],
   'page_views_likely_human':D[k]['split'].get('likely_human',0),'visits_likely_human':D[k]['visits_likely_human'],
   'bots_crawlers':D[k]['split'].get('bots_crawlers',0),'suspected_automation':D[k]['split'].get('suspected_automation',0),
   'uk_likely_human':D[k]['human_countries'].get('GB',0),'home_views':D[k]['human_home_views'],'ebooks_views':D[k]['human_ebooks_views']} for k in ks],
 'query':{'mcp':'https://'+HOST+'/mcp','tools':['get_traffic_summary(days)','get_top_pages(days)'],'json':'https://'+HOST+'/traffic.json','page':'https://'+HOST+'/academy/traffic/'}}
json.dump(out,open(os.path.join(HERE,'traffic.json'),'w'),indent=1,ensure_ascii=False)
w=out['last_7_days']; print(json.dumps({'generated_at':out['generated_at'],'days_held':len(ks),'v7_ext':w['page_views_excl_own_tooling'],'v7_human':w['page_views_likely_human'],'human_share':w['share']['likely_human'],'uk':w['uk_page_views_likely_human'],'home_ebooks':w['home_to_ebooks']}))
