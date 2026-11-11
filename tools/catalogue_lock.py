#!/usr/bin/env python3
"""catalogue-lock: fail when an EXISTING evidence/artifact record is edited or deleted without the owner's approval.

Rules (config: .github/catalogue-lock.json):
  * A new record (new file, new keyed JSON item, new CSV row) is allowed and listed in the summary.
  * Editing, deleting or moving an existing record fails the check unless that change is approved:
      - pull request: label 'owner-approved', most recently applied by an approver account;
      - direct push / audited commit: the commit belongs to such a pull request, or carries the trailer
        'Catalogue-approved-by: <approver> (<reference>)'.
  * JSON registers are compared record by record (items keyed by id/ev/slug...; unkeyed items by exact value).
    Changes to top-level housekeeping keys (updated, version, ...) are ignored.
  * CSV/TSV registers: every existing row must survive unchanged; appended rows are additions.
  * Any other file (HTML page, image, PDF) under a locked path: modified/deleted/renamed = change to an existing record.

Modes: pull_request, push, schedule (audits audit_branches for recent commits). Standard library only.
Agents propose changes as pull requests labelled 'catalogue-change' and never apply 'owner-approved'. — Sion's Tab agent
"""
import fnmatch, json, os, subprocess, sys, time, urllib.request

CFG = json.load(open('.github/catalogue-lock.json'))
REPO = os.environ.get('GITHUB_REPOSITORY', '')
TOKEN = os.environ.get('GH_TOKEN', '')
EVENT = os.environ.get('GITHUB_EVENT_NAME', '')
SUMMARY = os.environ.get('GITHUB_STEP_SUMMARY', '/dev/null')
ZERO = '0' * 40

def git(*a, ok=False):
    r = subprocess.run(['git', *a], capture_output=True, text=True)
    if r.returncode and not ok:
        raise SystemExit('git %s failed: %s' % (' '.join(a), r.stderr[-400:]))
    return r.stdout

def api(path):
    req = urllib.request.Request('https://api.github.com' + path, headers={
        'Authorization': 'Bearer ' + TOKEN, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28'})
    for i in range(3):
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.load(r)
        except Exception as e:
            err = e; time.sleep(3 * (i + 1))
    print('api error', path, err); return None

def branch_cfg(branch):
    for pat, c in CFG['branches'].items():
        if fnmatch.fnmatchcase(branch, pat):
            return c
    return None

def is_locked(path, c):
    if any(fnmatch.fnmatchcase(path, p) for p in c.get('exempt', [])):
        return False
    return any(fnmatch.fnmatchcase(path, p) for p in c.get('locked', []))

def show(sha, path):
    r = subprocess.run(['git', 'show', '%s:%s' % (sha, path)], capture_output=True)
    return r.stdout if r.returncode == 0 else None

IDK = CFG['record_id_keys']; META = set(CFG['metadata_keys'])

def rid(item):
    if isinstance(item, dict):
        for k in IDK:
            if k in item and isinstance(item[k], (str, int)):
                return '%s=%s' % (k, item[k])
    return None

def canon(v):
    return json.dumps(v, sort_keys=True, ensure_ascii=False)

def jdiff(a, b, where, out, top=True):
    """Collect changed/removed existing content of a into out['changed'], new records into out['added']."""
    if isinstance(a, dict) and isinstance(b, dict):
        for k, v in a.items():
            if top and k in META:
                continue
            if k not in b:
                out['changed'].append('%s.%s removed' % (where, k))
            else:
                jdiff(v, b[k], '%s.%s' % (where, k), out, False)
        if not top:
            for k in b:
                if k not in a:
                    out['changed'].append('%s.%s added to an existing record' % (where, k))
        else:
            for k in b:
                if k not in a and k not in META:
                    out['added'].append('%s.%s (new section)' % (where, k))
        return
    if isinstance(a, list) and isinstance(b, list):
        ka = [rid(x) for x in a]; kb = [rid(x) for x in b]
        if a and all(ka) and len(set(ka)) == len(ka):
            bm = {rid(x): x for x in b if rid(x)}
            for x in a:
                k = rid(x)
                if k not in bm:
                    out['changed'].append('%s[%s] deleted' % (where, k))
                elif canon(x) != canon(bm[k]):
                    sub = {'changed': [], 'added': []}
                    jdiff(x, bm[k], '%s[%s]' % (where, k), sub, False)
                    out['changed'].append('%s[%s] edited%s' % (where, k, (': ' + '; '.join(sub['changed'][:3])) if sub['changed'] else ''))
            for x in b:
                k = rid(x)
                if k and k not in set(ka):
                    out['added'].append('%s[%s]' % (where, k))
                elif not k:
                    out['added'].append('%s[unkeyed item]' % where)
            return
        pool = {}
        for x in b:
            pool[canon(x)] = pool.get(canon(x), 0) + 1
        for i, x in enumerate(a):
            c = canon(x)
            if pool.get(c):
                pool[c] -= 1
            else:
                out['changed'].append('%s[%d]%s changed or deleted' % (where, i, (' (' + rid(x) + ')') if rid(x) else ''))
        extra = sum(pool.values())
        if extra:
            out['added'].append('%s: %d new item(s)' % (where, extra))
        return
    if canon(a) != canon(b):
        out['changed'].append('%s value changed' % where)

def file_diff(base, head, status, path, newpath=None):
    """Return (changed_list, added_list) for one changed path."""
    if status.startswith('A'):
        return [], ['new file %s' % path]
    if status.startswith('D'):
        return ['%s deleted' % path], []
    if status.startswith('R'):
        return ['%s moved to %s' % (path, newpath)], []
    if status.startswith('C'):
        return [], ['new file %s (copied from %s)' % (newpath, path)]
    if not (path.endswith('.json') or path.endswith('.csv') or path.endswith('.tsv')):
        return ['%s edited (existing record file)' % path], []
    a, b = show(base, path), show(head, path)
    if a is None or b is None:
        return ['%s changed (unreadable)' % path], []
    if a == b:
        return [], []
    if path.endswith('.json'):
        try:
            ja, jb = json.loads(a), json.loads(b)
        except Exception:
            return ['%s changed (JSON did not parse)' % path], []
        out = {'changed': [], 'added': []}
        jdiff(ja, jb, path, out, True)
        return out['changed'], out['added']
    if path.endswith('.csv') or path.endswith('.tsv'):
        la = a.decode('utf-8', 'replace').splitlines(); lb = b.decode('utf-8', 'replace').splitlines()
        pool = {}
        for l in lb:
            pool[l] = pool.get(l, 0) + 1
        lost = []
        for n, l in enumerate(la, 1):
            if pool.get(l):
                pool[l] -= 1
            elif l.strip():
                lost.append(n)
        added = sum(pool.values())
        ch = ['%s: existing row(s) %s changed or deleted' % (path, ','.join(map(str, lost[:12])) + ('...' if len(lost) > 12 else ''))] if lost else []
        return ch, (['%s: %d new row(s)' % (path, added)] if added else [])
    return ['%s edited (existing record file)' % path], []

def diff_range(base, head, c):
    changed, added = [], []
    for line in git('diff', '--name-status', '-M', base, head).splitlines():
        parts = line.split('\t')
        st, p = parts[0], parts[1]
        np_ = parts[2] if len(parts) > 2 else None
        if not (is_locked(p, c) or (np_ and is_locked(np_, c))):
            continue
        ch, ad = file_diff(base, head, st, p, np_)
        changed += ch; added += ad
    return changed, added

def label_ok(pr_number):
    lab = CFG['approval_label']
    evs = api('/repos/%s/issues/%s/events?per_page=100' % (REPO, pr_number)) or []
    state, who = False, None
    for e in evs:
        if (e.get('label') or {}).get('name') != lab:
            continue
        if e.get('event') == 'labeled':
            state, who = True, (e.get('actor') or {}).get('login')
        elif e.get('event') == 'unlabeled':
            state, who = False, None
    return state and who in CFG['approvers'], who

def commit_ok(sha):
    msg = git('log', '-1', '--format=%B', sha)
    for l in msg.splitlines():
        if l.strip().lower().startswith(CFG['trailer'].lower()):
            name = l.split(':', 1)[1].strip().split(' ')[0]
            if name in CFG['approvers']:
                return True, 'trailer (%s)' % l.strip()
    prs = api('/repos/%s/commits/%s/pulls' % (REPO, sha)) or []
    for pr in prs:
        names = [x.get('name') for x in pr.get('labels', [])]
        if CFG['approval_label'] in names:
            ok, who = label_ok(pr['number'])
            if ok:
                return True, 'PR #%s labelled %s by %s' % (pr['number'], CFG['approval_label'], who)
    return False, ''

def check_commits(shas, c, branch):
    bad, adds = [], []
    for sha in shas:
        parents = git('log', '-1', '--format=%P', sha).split()
        if not parents:
            continue
        ch, ad = diff_range(parents[0], sha, c)
        adds += ['%s %s' % (sha[:7], x) for x in ad]
        if ch:
            ok, why = commit_ok(sha)
            subj = git('log', '-1', '--format=%s', sha).strip()[:90]
            if ok:
                adds.append('%s approved change on %s: %s (%s)' % (sha[:7], branch, '; '.join(ch[:3]), why))
            else:
                bad.append('%s on %s "%s": %s' % (sha[:7], branch, subj, '; '.join(ch[:8]) + (' (+%d more)' % (len(ch) - 8) if len(ch) > 8 else '')))
    return bad, adds

def report(title, bad, adds):
    with open(SUMMARY, 'a') as f:
        f.write('## catalogue-lock: %s\n\n' % title)
        if bad:
            f.write('**Blocked: existing catalogue records changed without the owner\'s approval (%d).**\n\n' % len(bad))
            for b in bad:
                f.write('- %s\n' % b)
            f.write('\nTo proceed: label the pull request `catalogue-change` with before/after and source; the owner approves with the `%s` label.\n\n' % CFG['approval_label'])
        else:
            f.write('No existing catalogue record was changed without approval.\n\n')
        if adds:
            f.write('**New records / approved changes (flagged for review, %d):**\n\n' % len(adds))
            for a in adds[:200]:
                f.write('- %s\n' % a)
    for b in bad:
        print('::error title=catalogue-lock::%s' % b[:900])
    for a in adds[:50]:
        print('::notice title=catalogue-lock new record::%s' % a[:900])
    print('blocked=%d flagged=%d' % (len(bad), len(adds)))
    return 1 if bad else 0

def main():
    ev = json.load(open(os.environ['GITHUB_EVENT_PATH'])) if os.environ.get('GITHUB_EVENT_PATH') else {}
    if EVENT == 'pull_request':
        pr = ev['pull_request']; base_ref = pr['base']['ref']
        c = branch_cfg(base_ref)
        if not c:
            return report('PR #%s into %s (no locked paths on this branch)' % (pr['number'], base_ref), [], [])
        git('fetch', '-q', '--filter=blob:none', 'origin', pr['base']['sha'], pr['head']['sha'], ok=True)
        mb = git('merge-base', pr['base']['sha'], pr['head']['sha']).strip()
        ch, ad = diff_range(mb, pr['head']['sha'], c)
        bad = []
        if ch:
            ok, who = label_ok(pr['number'])
            if ok:
                ad = ['approved by %s via label %s: %s' % (who, CFG['approval_label'], x) for x in ch] + ad
            else:
                bad = ['PR #%s: %s' % (pr['number'], x) for x in ch]
        return report('PR #%s into %s' % (pr['number'], base_ref), bad, ad)
    if EVENT == 'push':
        branch = os.environ.get('GITHUB_REF_NAME', ''); c = branch_cfg(branch)
        if not c:
            return report('push to %s (no locked paths)' % branch, [], [])
        before, after = ev.get('before', ZERO), ev.get('after')
        if before == ZERO or not git('cat-file', '-t', before, ok=True).strip():
            shas = [after]
        else:
            shas = git('rev-list', '--first-parent', '%s..%s' % (before, after)).split()
        return report('push to %s (%d commit(s))' % (branch, len(shas)), *check_commits(shas, c, branch))
    # schedule / manual: audit recent commits on audit_branches
    since = time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime(time.time() - 3600 * CFG.get('audit_lookback_hours', 7)))
    heads = git('ls-remote', '--heads', 'origin').split('\n')
    names = [l.split('refs/heads/', 1)[1] for l in heads if 'refs/heads/' in l]
    targets = [n for n in names if any(fnmatch.fnmatchcase(n, p) for p in CFG['audit_branches'])]
    bad, adds = [], []
    for b in targets:
        c = branch_cfg(b)
        if not c:
            continue
        git('fetch', '-q', '--filter=blob:none', '--shallow-since=%s' % since, 'origin', '+refs/heads/%s:refs/remotes/origin/%s' % (b, b), ok=True)
        git('fetch', '-q', '--filter=blob:none', '--deepen=1', 'origin', '+refs/heads/%s:refs/remotes/origin/%s' % (b, b), ok=True)
        shas = git('rev-list', '--first-parent', '--since=%s' % since, 'origin/%s' % b, ok=True).split()
        x, y = check_commits(shas, c, b); bad += x; adds += y
    return report('audit of %s since %s' % (', '.join(targets) or 'no branches', since), bad, adds)

if __name__ == '__main__':
    sys.exit(main())
