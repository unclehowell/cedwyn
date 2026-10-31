#!/usr/bin/env python3
"""acd_code_sync.py - issue Cedwyn Academy access codes (ACD-XXXX-XXXX-XXXX) for PAID checkouts of the Academy's £49.99/month
Payment Link (plink_1UV6PpJRNz20guqBItjOb6Ey, buy.stripe.com/14AfZi5BNbiv5ecbEP6Zy0J), and keep each code's status in step with its
Stripe subscription. Reads Stripe through the connected Stripe app (read-only) and writes D1 cedwyn-apps.academy_codes, which the
cedwyn-academy Worker reads (POST /api/code redeems a code; a paying member sees their own code on the Academy pages).
Rules: a code only for a checkout Stripe reports status=complete, payment_status=paid, amount_total>0, mode=subscription, with a
subscription; a code unlocks only while that subscription is active or trialing (past_due/canceled/unpaid switch it off).
Stores no email or card data; the session id only as SHA-256("cs|"+id). Same design as the documentary's doc_code_sync.py (CDW- codes).
Once the Worker holds STRIPE_WHSEC, Stripe's signed webhook (POST https://academy.bucklerfamily.estate/api/stripe/webhook,
events checkout.session.completed + customer.subscription.updated/deleted) issues and refreshes codes the moment they happen; this
sync keeps running as the safety net (it never issues twice: one code per checkout session).
Usage: TAB_TASK_ID=<task> timeout -k 5 300 python3 acd_code_sync.py                    (sync; runs inside the 10-minute member_sync)
       ... acd_code_sync.py --issue-session <cs_live_...>   manual issue: checks that session in Stripe first (complete, paid, Academy link)
       ... acd_code_sync.py --test-code                      mint a code marked test=1 (status active) for checks; delete it after
       ... acd_code_sync.py --delete <CODE> | --revoke <CODE> | --list
- Tab agent, 31 Oct 2026 (task 320a574b)"""
import json, os, sys, time, hashlib, secrets, tempfile, subprocess, datetime
TID = os.environ.get('TAB_TASK_ID', 'acd-code-sync'); ACCT = '42a4a8d7bfb96321118ada213638d050'; DB = '6fb11d8e-5d14-41a4-a7a0-ebf3d3de410a'
PLINK = 'plink_1UV6PpJRNz20guqBItjOb6Ey'
ALPHA = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'
LIVE = ('active', 'trialing')
def ca(req):
    td = f'/home/user/tab/tasks/{TID}/rq'; os.makedirs(td, exist_ok=True)
    req = dict(req); req['headers'] = dict(req.get('headers') or {}, **{'X-Tab-Nonce': secrets.token_hex(8)})   # identical requests are answered from a cache otherwise
    f = tempfile.NamedTemporaryFile('w', suffix='.json', delete=False, dir=td); json.dump(req, f); f.close()
    try: p = subprocess.run(['timeout', '-k', '5', '120', 'node', '/home/user/tab/connected-apps-cli.mjs', 'connected_apps.request', f.name], capture_output=True, text=True)
    finally: os.unlink(f.name)
    time.sleep(1.5)
    try:
        r = json.loads(p.stdout).get('result') or {}; b = r.get('body')
        if b is None and r.get('body_head'): b = r['body_head']
        if isinstance(b, str):
            try: b = json.loads(b)
            except Exception: pass
        return r.get('status'), b
    except Exception: return None, None
def stripe(path, q=None):
    req = {'toolkit': 'stripe', 'method': 'GET', 'url': 'https://api.stripe.com/v1/' + path}
    if q: req['query'] = q
    return ca(req)
def d1(sql, params=()):
    st, b = ca({'toolkit': 'cloudflare', 'method': 'POST', 'url': f'https://api.cloudflare.com/client/v4/accounts/{ACCT}/d1/database/{DB}/query', 'body': {'sql': sql, 'params': list(params)}})
    if st != 200 or not isinstance(b, dict) or not b.get('success'): raise SystemExit(f'd1 failed {st} {str(b)[:300]}')
    return b['result'][0]['results']
def h(cs): return hashlib.sha256(('cs|' + cs).encode()).hexdigest()
def newcode(): s = ''.join(secrets.choice(ALPHA) for _ in range(12)); return f'ACD-{s[:4]}-{s[4:8]}-{s[8:]}'
def now(): return datetime.datetime.utcnow().strftime('%Y-%m-%dT%H:%M:%SZ')
def paid(s): return (s.get('payment_link') == PLINK and s.get('status') == 'complete' and s.get('payment_status') == 'paid'
                     and (s.get('amount_total') or 0) > 0 and s.get('mode') == 'subscription' and s.get('subscription'))
def sub_status(sid):
    st, sub = stripe('subscriptions/' + sid)
    return (sub or {}).get('status') or 'unknown', (sub or {}).get('current_period_end') or (((sub or {}).get('items') or {}).get('data') or [{}])[0].get('current_period_end')
def issue(s, source, test=0):
    if d1('SELECT code FROM academy_codes WHERE cs_hash = ?', [h(s['id'])]): return None
    status, pend = ('active', None) if test else sub_status(s['subscription'])
    for _ in range(5):
        code = newcode()
        try:
            d1('INSERT INTO academy_codes(code,cs_hash,sub,status,period_end,amount,currency,created,source,test,revoked,uses) VALUES (?,?,?,?,?,?,?,?,?,?,0,0)',
               [code, h(s['id']), s.get('subscription'), status, pend, s.get('amount_total'), s.get('currency'), now(), source, test]); return code, status
        except SystemExit as e:
            if 'UNIQUE' in str(e) and 'code' in str(e) and 'cs_hash' not in str(e): continue
            raise
def sync():
    n = 0; after = None; pages = 0
    while pages < 40:
        q = {'payment_link': PLINK, 'status': 'complete', 'limit': '1'}
        if after: q['starting_after'] = after
        st, b = stripe('checkout/sessions', q); pages += 1
        if st != 200 or not isinstance(b, dict): raise SystemExit(f'stripe list failed {st} {str(b)[:200]}')
        data = b.get('data') or []
        if not data or not data[0].get('id'): break
        s = data[0]; after = s['id']
        if paid(s):
            got = issue(s, 'sync')
            if got: n += 1; print('issued a code (subscription', got[1] + ')')
        if b.get('has_more') is False: break
    # keep every live paid code in step with its subscription (switch off when it lapses, back on when it renews)
    for r in d1("SELECT code, sub, status FROM academy_codes WHERE test = 0 AND revoked = 0 AND sub IS NOT NULL"):
        stt, pend = sub_status(r['sub'])
        if stt != r['status']: d1('UPDATE academy_codes SET status = ?, period_end = ? WHERE code = ?', [stt, pend, r['code']]); print('code status', r['status'], '->', stt)
    return n
if __name__ == '__main__':
    a = sys.argv[1:]
    if a[:1] == ['--issue-session']:
        st, s = stripe('checkout/sessions/' + a[1])
        if not isinstance(s, dict) or not paid(s): raise SystemExit('refused: that session is not a complete, paid Academy subscription checkout')
        print(issue(s, 'manual'))
    elif a[:1] == ['--test-code']: print(issue({'id': 'cs_test_box' + secrets.token_hex(16), 'subscription': None, 'amount_total': 0, 'currency': 'gbp'}, 'test', 1))
    elif a[:1] == ['--delete']: d1('DELETE FROM academy_codes WHERE code = ? AND test = 1', [a[1]]); print('deleted test code', a[1])
    elif a[:1] == ['--revoke']: d1('UPDATE academy_codes SET revoked = 1 WHERE code = ?', [a[1]]); print('revoked', a[1])
    elif a[:1] == ['--list']: print(json.dumps(d1('SELECT code,status,test,revoked,uses,source,created FROM academy_codes ORDER BY created DESC LIMIT 50'), indent=0))
    else: print('acd_code_sync:', sync(), 'new academy codes issued')
