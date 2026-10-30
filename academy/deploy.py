#!/usr/bin/env python3
"""deploy.py - deploy work/cedwyn-academy/worker/index.js as the Cloudflare Worker cedwyn-academy at academy.bucklerfamily.estate
(connected Cloudflare account). Bindings: DB = D1 (state.json db_id), API = service binding to cedwyn-api (membership checks;
no secret shared). Every step logged with its undo in work/cf-rebalance/changes.json and state.json history.
Usage: TAB_TASK_ID=<task> timeout -k 5 600 python3 deploy.py "<message>" [--setup]   — Tab agent, task c1fca92e"""
import json, os, sys, base64, datetime as dt
sys.path.insert(0, '/home/user/tab/work/agent-ready')
import deploy as AR
HERE = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(HERE, 'worker')
ACCT, ZONE, CF = AR.ACCT, AR.ZONE, AR.CF
NAME = 'cedwyn-academy'; HOST = 'academy.bucklerfamily.estate'
SP = os.path.join(HERE, 'state.json'); ST = json.load(open(SP)) if os.path.exists(SP) else {}
def save(): json.dump(ST, open(SP, 'w'), indent=1)
def call(method, path, body=None):
    req = {"toolkit": "cloudflare", "method": method, "url": CF + path}
    if body is not None: req["body"] = body
    r = AR.ca(req); res = r.get('result') or {}; b = res.get('body')
    if b is None and res.get('body_head'):
        try: b = json.loads(res['body_head'])
        except Exception: b = {'raw': res['body_head'][:500]}
    if isinstance(b, str):
        try: b = json.loads(b)
        except Exception: b = {'raw': b[:500]}
    return int(res.get('status') or 0), (b or {'raw': json.dumps(r)[:500]})
def log(what, rollback):
    P = '/home/user/tab/work/cf-rebalance/changes.json'; ch = json.load(open(P))
    ch.append({"at_utc": dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'), "by": "cedwyn-academy (work/cedwyn-academy/deploy.py)", "what": what, "rollback": rollback})
    json.dump(ch, open(P, 'w'), ensure_ascii=False, indent=1)
def setup():
    if not ST.get('worker_id'):
        s, b = call('POST', f'/accounts/{ACCT}/workers/workers', {"name": NAME, "subdomain": {"enabled": False}, "observability": {"enabled": True}})
        print('worker', s, json.dumps(b)[:300]); ST['worker_id'] = b['result']['id']; save()
        log(f"Worker {NAME} created ({ST['worker_id']})", f"DELETE /accounts/{ACCT}/workers/scripts/{NAME} (removes it and its custom domain)")
def deploy(msg):
    code = open(os.path.join(W, 'index.js'), 'rb').read()
    b = {"compatibility_date": "2025-01-01", "main_module": "index.js",
         "modules": [{"name": "index.js", "content_type": "application/javascript+module", "content_base64": base64.b64encode(code).decode()}],
         "bindings": [{"type": "d1", "name": "DB", "id": ST['db_id']}, {"type": "service", "name": "API", "service": "cedwyn-api"}],
         "annotations": {"workers/message": msg[:80]}}
    s, up = call('POST', f"/accounts/{ACCT}/workers/workers/{ST['worker_id']}/versions", b)
    if s not in (200, 201): print('version failed', s, json.dumps(up)[:1500]); sys.exit(1)
    vid = up['result']['id']
    s, dep = call('POST', f"/accounts/{ACCT}/workers/scripts/{NAME}/deployments", {"strategy": "percentage", "versions": [{"version_id": vid, "percentage": 100}], "annotations": {"workers/message": msg[:80]}})
    if s not in (200, 201): print('deploy failed', s, json.dumps(dep)[:1500]); sys.exit(1)
    prev = ST.get('version'); ST['previous'] = prev; ST['version'] = vid
    ST.setdefault('history', []).append({"at": dt.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ'), "version": vid, "what": msg, "rollback_to": prev}); save()
    log(f"{NAME}: version {vid} deployed 100%: {msg}", f"POST /accounts/{ACCT}/workers/scripts/{NAME}/deployments with version {prev}" if prev else f"DELETE /accounts/{ACCT}/workers/scripts/{NAME}")
    print(json.dumps({"version": vid, "previous": prev}))
def domain():
    if not ST.get('domain_id'):
        s, b = call('PUT', f'/accounts/{ACCT}/workers/domains', {"hostname": HOST, "service": NAME, "zone_id": ZONE, "environment": "production"})
        print('domain', s, json.dumps(b)[:400])
        if s == 200: ST['domain_id'] = b['result']['id']; save(); log(f"{NAME}: custom domain {HOST} ({ST['domain_id']})", f"DELETE /accounts/{ACCT}/workers/domains/{ST['domain_id']} (also removes the DNS record)")
if __name__ == '__main__':
    if '--setup' in sys.argv: setup()
    deploy(sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith('--') else 'cedwyn-academy update')
    if '--setup' in sys.argv: domain()
