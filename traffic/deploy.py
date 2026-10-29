#!/usr/bin/env python3
"""deploy.py — package traffic.json + history.json (aggregates only) into the cedwyn-traffic Worker and deploy it 100%,
then make sure its routes exist. Usage: TAB_TASK_ID=<id> timeout -k 5 600 python3 deploy.py ["message"] [--routes]
Config set later in the dashboard (AUTH0_DOMAIN, AUTH0_AUDIENCE, AUTH_REQUIRED, GA4_PROPERTY_ID, secrets GA_SA_EMAIL/GA_SA_KEY) must be
listed in state.json "inherit" or a redeploy drops them. Undo rows go to work/cf-rebalance/changes.json. — Sion's Tab agent, 29 Oct 2026"""
import json, os, sys, base64, subprocess, tempfile, time, datetime as dt
HERE=os.path.dirname(os.path.abspath(__file__)); W=os.path.join(HERE,'worker')
ACCT='42a4a8d7bfb96321118ada213638d050'; ZONE='5307ac7d55a77d914b81d79c79532dde'; CF='https://api.cloudflare.com/client/v4'; NAME='cedwyn-traffic'
SP=os.path.join(HERE,'state.json'); ST=json.load(open(SP)) if os.path.exists(SP) else {}
# a route without a trailing * does not match the same path with a query string (?cb=...), so each has a * twin
ROUTES=['cedwyn.bucklerfamily.estate/traffic.json','cedwyn.bucklerfamily.estate/traffic.json*','cedwyn.bucklerfamily.estate/mcp','cedwyn.bucklerfamily.estate/mcp/','cedwyn.bucklerfamily.estate/mcp*',
        'cedwyn.bucklerfamily.estate/academy/traffic*']  # /.well-known/mcp.json on this host is owned by Worker agent-ready
_last=[0]
def ca(req,tries=4):
    for a in range(tries):
        gap=time.time()-_last[0]
        if gap<3.5: time.sleep(3.5-gap)
        td='/home/user/tab/tasks/%s/rq'%os.environ.get('TAB_TASK_ID','cedwyn-traffic'); os.makedirs(td,exist_ok=True)
        f=tempfile.NamedTemporaryFile('w',suffix='.json',delete=False,dir=td); json.dump(req,f); f.close()
        try: p=subprocess.run(['timeout','-k','5','170','node','/home/user/tab/connected-apps-cli.mjs','connected_apps.request',f.name],capture_output=True,text=True)
        finally: os.unlink(f.name)
        _last[0]=time.time()
        try: out=json.loads(p.stdout)
        except Exception: out={'ok':False,'raw':(p.stdout+p.stderr)[-500:]}
        st=(out.get('result') or {}).get('status')
        if out.get('ok') and st not in (502,503,504): return out
        time.sleep(6*(a+1))
    return out
def body(r):
    b=(r.get('result') or {}).get('body')
    if b is None:
        h=(r.get('result') or {}).get('body_head')
        try: b=json.loads(h)
        except Exception: b={'_head':(h or '')[:400]}
    return b or {}
def log(what,undo):
    P='/home/user/tab/work/cf-rebalance/changes.json'
    try: ch=json.load(open(P))
    except Exception: ch=[]
    ch.append({'at_utc':dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'),'by':'cedwyn-traffic (work/cedwyn-traffic/deploy.py)','what':what,'rollback':undo})
    json.dump(ch,open(P,'w'),ensure_ascii=False,indent=1)
def package():
    pub=json.load(open(os.path.join(HERE,'traffic.json'))); hist=json.load(open(os.path.join(HERE,'history.json')))['days']
    daily={k:{'complete':x['complete'],'ext':x['page_views_excl_own_tooling'],'human':x['split'].get('likely_human',0),
              'bots':x['split'].get('bots_crawlers',0),'susp':x['split'].get('suspected_automation',0),'visits':x['visits_likely_human'],
              'home':x['human_home_views'],'eb':x['human_ebooks_views'],'ebx':x['human_ebooks_index_views'],
              'paths':x['human_paths'],'secs':x['human_sections'],'cc':x['human_countries']} for k,x in hist.items()}
    open(os.path.join(W,'data.txt'),'w').write(json.dumps({'public':pub,'daily_detail':daily},separators=(',',':'),ensure_ascii=False))
def ensure_worker():
    if ST.get('worker_id'): return ST['worker_id']
    r=ca({'toolkit':'cloudflare','method':'POST','url':f'{CF}/accounts/{ACCT}/workers/workers','body':{'name':NAME,'logpush':False,'observability':{'enabled':False}}})
    b=body(r)
    try: wid=b['result']['id']
    except Exception: print('create failed',json.dumps(r)[:1500]); sys.exit(1)
    ST['worker_id']=wid; json.dump(ST,open(SP,'w'),indent=1); log(f'created Worker {NAME} ({wid})',f'DELETE /accounts/{ACCT}/workers/workers/{wid}')
    return wid
def deploy(msg):
    package(); wid=ensure_worker()
    def mod(n,ct): return {'name':n,'content_type':ct,'content_base64':base64.b64encode(open(os.path.join(W,n),'rb').read()).decode()}
    b={'compatibility_date':'2025-01-01','main_module':'index.js','modules':[mod('index.js','application/javascript+module'),mod('data.txt','text/plain')],
       'bindings':[{'type':'inherit','name':n} for n in ST.get('inherit',[])],'annotations':{'workers/message':msg[:80]}}
    up=ca({'toolkit':'cloudflare','method':'POST','url':f'{CF}/accounts/{ACCT}/workers/workers/{wid}/versions','body':b})
    try: vid=body(up)['result']['id']
    except Exception: print('version failed',json.dumps(up)[:1500]); sys.exit(1)
    dp=ca({'toolkit':'cloudflare','method':'POST','url':f'{CF}/accounts/{ACCT}/workers/scripts/{NAME}/deployments','body':{'strategy':'percentage','versions':[{'version_id':vid,'percentage':100}],'annotations':{'workers/message':msg[:80]}}})
    try: did=body(dp)['result']['id']
    except Exception: print('deployment failed',json.dumps(dp)[:1500]); sys.exit(1)
    prev=ST.get('version'); ST['previous']=prev; ST['version']=vid; json.dump(ST,open(SP,'w'),indent=1)
    log(f'{NAME}: version {vid} deployed 100% (deployment {did}): {msg}', f'POST /accounts/{ACCT}/workers/scripts/{NAME}/deployments with version {prev}' if prev else 'delete the cedwyn-traffic routes (work/cedwyn-traffic/state.json) to take it off')
    print(json.dumps({'version':vid,'deployment':did,'previous':prev}))
def routes():
    ST.setdefault('routes',{})
    for pat in ROUTES:
        if pat in ST['routes']: continue
        r=ca({'toolkit':'cloudflare','method':'POST','url':f'{CF}/zones/{ZONE}/workers/routes','body':{'pattern':pat,'script':NAME}})
        b=body(r)
        if b.get('success'): ST['routes'][pat]=b['result']['id']; print('route +',pat)
        else: print('route FAILED',pat,json.dumps(b)[:300])
        json.dump(ST,open(SP,'w'),indent=1)
    log(f'cedwyn-traffic routes ensured: {len(ST["routes"])}', 'DELETE /zones/%s/workers/routes/<id> for each id in work/cedwyn-traffic/state.json routes'%ZONE)
if __name__=='__main__':
    msg=[x for x in sys.argv[1:] if not x.startswith('--')]
    deploy(msg[0] if msg else 'cedwyn-traffic refresh')
    if '--routes' in sys.argv: routes()
