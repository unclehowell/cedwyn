#!/usr/bin/env python3
"""check_qa_built.py - build-time Q&A completeness guard (CI, fail-closed).

Runs in CI after tools/site.py (which calls qa_questions.run). qa_questions writes
dist/qa/questions.json - the exact built truth: every question ID with its asked/answered
hashtag chips. This check proves every expected Q&A alias page exists, still carries the
id="qx" app marker, and serves all of it.

Layer honesty: static check over build output (stdlib HTMLParser, no browser). Runtime/browser
behaviour is covered by check_qa_served.py (post-deploy static) plus the manual/agent
rendered-layer runbook.

Fails closed (exit 1): dist/qa/questions.json missing/unparseable/empty; any EXPECTED alias
missing from dist or lacking the id="qx" marker (a vanished Argentina alias or a swapped
template can never silently pass); any ID/chip multiset mismatch; wrong class="tg" total.
Uniform truncation of every alias fails because pages are compared to questions.json; a build
that truncates questions.json itself is caught post-deploy by check_qa_served.py, whose
expectation comes from the pinned git source data instead.

Usage: python3 tools/check_qa_built.py [dist]"""
import argparse, json, pathlib, sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
from check_qa_served import page_problems, expected_totals

EXPECTED_ALIASES = ['qa', 'wales/qa', 'argentina/qa']   # site structure inventory, 30 Oct 2026

def main():
    ap = argparse.ArgumentParser(description='Build-time Q&A completeness guard.')
    ap.add_argument('dist', nargs='?', default='dist')
    a = ap.parse_args()
    dist = pathlib.Path(a.dist)
    failures, checked = [], []

    qj = dist / 'qa' / 'questions.json'
    if not qj.is_file():
        print('FAIL: %s missing - qa_questions did not run or wrote nothing; refusing to pass' % qj)
        return 1
    try:
        data = json.loads(qj.read_text(errors='ignore'))
        qs = data['questions']
        assert qs, 'empty questions list'
    except Exception as e:
        print('FAIL: %s unparseable or empty: %s' % (qj, e))
        return 1

    pages = {}
    for alias in EXPECTED_ALIASES:
        p = dist / alias / 'index.html'
        if not p.is_file():
            failures.append('expected alias %s/index.html missing from dist' % alias)
            print('FAIL %-28s alias missing' % (alias + '/index.html'))
            continue
        txt = p.read_text(errors='ignore')
        if 'id="qx"' not in txt:
            failures.append('%s/index.html: expected Q&A app marker id="qx" absent (template replaced?)' % alias)
            print('FAIL %-28s marker id="qx" absent' % (alias + '/index.html'))
            continue
        pages[alias + '/index.html'] = txt
    for p in sorted(dist.glob('*/qa/index.html')) + sorted(dist.glob('*/*/qa/index.html')):
        rel = p.relative_to(dist).as_posix()
        if rel not in pages and p.is_file():
            txt = p.read_text(errors='ignore')
            if 'id="qx"' in txt:
                pages[rel] = txt
    if not pages:
        print('FAIL: no dist Q&A page with id="qx" found - nothing was checked')
        return 1

    for rel, txt in sorted(pages.items()):
        problems = page_problems(rel, txt, qs)
        if problems:
            failures.extend(problems)
            print('FAIL %-28s %d problem(s)' % (rel, len(problems)))
        else:
            checked.append(rel)
            print('PASS %-28s %d questions, chips complete' % (rel, len(qs)))

    if failures:
        print('\ncheck_qa_built: FAIL')
        for f in failures[:40]:
            print(' -', f)
        return 1
    print('\ncheck_qa_built: OK (%d pages, %d questions, %d chips+legend expected)'
          % (len(checked), len(qs), expected_totals(qs)))
    return 0

if __name__ == '__main__':
    sys.exit(main())
