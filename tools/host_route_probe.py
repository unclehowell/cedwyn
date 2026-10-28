#!/usr/bin/env python3
"""Read-only HTTP audit for Cedwyn's legacy subdomain -> canonical path migration.

Run: python3 tools/host_route_probe.py
Requires only Python's standard library. The script never writes to the live site,
DNS, Cloudflare, or GitHub; it performs GET requests and writes a local JSON report.
"""
from __future__ import annotations

import argparse
import concurrent.futures
import json
import pathlib
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser

ROOT = pathlib.Path(__file__).resolve().parent.parent
CANONICAL_HOST = "cedwyn.bucklerfamily.estate"
USER_AGENT = "Cedwyn-Route-Audit/1.0 (+read-only; contact: repository maintainer)"
TIMEOUT_SECONDS = 12
MAX_BODY = 262144
REDIRECT_CODES = {301, 302, 303, 307, 308}
EXPECTED_OK = set(range(200, 300))


class _Title(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_title = False
        self.parts = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "title":
            self.in_title = True

    def handle_endtag(self, tag):
        if tag.lower() == "title":
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.parts.append(data.strip())


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def request(url: str, follow: bool = False) -> dict:
    """Perform a bounded GET and return status, Location, type, URL and body metadata."""
    handlers = [urllib.request.HTTPSHandler(context=ssl.create_default_context())]
    if not follow:
        handlers.append(_NoRedirect())
    opener = urllib.request.build_opener(*handlers)
    req = urllib.request.Request(
        url,
        method="GET",
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/json,text/plain,*/*",
            "Cache-Control": "no-cache",
        },
    )
    started = time.monotonic()
    try:
        with opener.open(req, timeout=TIMEOUT_SECONDS) as response:
            body = response.read(MAX_BODY)
            final_url = response.geturl()
            status = response.status
            headers = response.headers
    except urllib.error.HTTPError as err:
        body = err.read(MAX_BODY)
        final_url = err.geturl()
        status = err.code
        headers = err.headers
    except Exception as err:
        return {
            "url": url,
            "status": None,
            "location": None,
            "content_type": None,
            "final_url": None,
            "title": None,
            "elapsed_ms": round((time.monotonic() - started) * 1000),
            "error": f"{type(err).__name__}: {str(err)[:300]}",
        }
    title = None
    if "html" in str(headers.get("Content-Type", "")).lower():
        try:
            parser = _Title()
            parser.feed(body.decode("utf-8", "replace"))
            title = " ".join(x for x in parser.parts if x)[:200] or None
        except Exception:
            title = None
    return {
        "url": url,
        "status": status,
        "location": headers.get("Location"),
        "content_type": headers.get("Content-Type"),
        "final_url": final_url,
        "title": title,
        "elapsed_ms": round((time.monotonic() - started) * 1000),
        "error": None,
    }


def normalize_path(path: str) -> str:
    if not path:
        return "/"
    path = re.sub(r"/{2,}", "/", path)
    if path != "/" and path.endswith("/"):
        path = path[:-1]
    return path


def canonical_target_ok(location: str | None, theme_id: str, suffix: str) -> bool:
    if not location:
        return False
    target = urllib.parse.urljoin(f"https://{CANONICAL_HOST}/", location)
    parts = urllib.parse.urlsplit(target)
    expected_path = f"/{theme_id}/" + suffix.lstrip("/")
    return (
        (parts.hostname or "").lower() == CANONICAL_HOST
        and normalize_path(parts.path) == normalize_path(expected_path)
    )


def add_test(results: list, test: dict) -> None:
    results.append(test)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--themes", default=str(ROOT / "themes.json"))
    parser.add_argument("--inventory", default=str(ROOT / "work/cedwyn-arch/host-route-inventory.json"))
    parser.add_argument("--report", default=str(ROOT / "reports/host-route-audit.json"))
    parser.add_argument("--workers", type=int, default=10)
    args = parser.parse_args()

    themes_doc = json.loads(pathlib.Path(args.themes).read_text(encoding="utf-8"))
    inventory = json.loads(pathlib.Path(args.inventory).read_text(encoding="utf-8"))
    themes = themes_doc.get("themes", [])
    media_hosts = {str(h).lower() for h in themes_doc.get("media_hosts", [])}
    host_map: dict[str, str] = {}
    conflicting = {}
    for theme in themes:
        theme_id = str(theme.get("id", "")).strip()
        if not theme_id:
            continue
        sources = list(theme.get("hosts", []) or [])
        live = str(theme.get("live", "") or "")
        match = re.match(r"^https?://([^/]+)", live, re.I)
        if match:
            sources.append(match.group(1))
        for raw_host in sources:
            host = str(raw_host).strip().lower().rstrip(".")
            if not host.endswith(".bucklerfamily.estate"):
                continue
            if host in media_hosts or host in {"bucklerfamily.estate", "www.bucklerfamily.estate"}:
                continue
            previous = host_map.get(host)
            if previous and previous != theme_id:
                conflicting.setdefault(host, sorted({previous, theme_id}))
            else:
                host_map[host] = theme_id
    for raw_host, theme_id in (themes_doc.get("extra_hosts", {}) or {}).items():
        host = str(raw_host).strip().lower().rstrip(".")
        if not theme_id or host in media_hosts or host in {"bucklerfamily.estate", "www.bucklerfamily.estate"}:
            continue
        previous = host_map.get(host)
        if previous and previous != theme_id:
            conflicting.setdefault(host, sorted({previous, str(theme_id)}))
        else:
            host_map[host] = str(theme_id)

    results: list[dict] = []
    canonical_urls = [
        (theme["id"], f"https://{CANONICAL_HOST}/{theme['id']}/")
        for theme in themes
        if theme.get("id")
    ]

    # Canonical destination tests are separate from legacy-host redirect tests.
    def probe_canonical(item):
        theme_id, url = item
        resp = request(url, follow=True)
        ok = resp["status"] in EXPECTED_OK and (resp.get("content_type") or "").lower().startswith("text/html")
        return {
            "category": "canonical_route",
            "theme": theme_id,
            "expected_url": url,
            "passed": ok,
            **resp,
        }

    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        for item, result in zip(canonical_urls, pool.map(probe_canonical, canonical_urls)):
            add_test(results, result)

    # Check each app's old hostname both at / and at /index.html. The first response
    # must be a redirect to the canonical path; a followed GET then checks destination health.
    host_items = sorted(host_map.items())
    def probe_legacy(item):
        host, theme_id = item
        rows = []
        for suffix in ("", "index.html"):
            path = "/" + suffix
            source_url = f"https://{host}{path}?cedwyn_route_probe=20261028"
            first = request(source_url, follow=False)
            loc = first.get("location")
            first_ok = first.get("status") in REDIRECT_CODES and canonical_target_ok(loc, theme_id, suffix)
            follow_result = None
            if first_ok:
                target_url = urllib.parse.urljoin(source_url, loc)
                follow_result = request(target_url, follow=True)
            target_ok = bool(
                follow_result
                and follow_result.get("status") in EXPECTED_OK
                and (follow_result.get("content_type") or "").lower().startswith("text/html")
            )
            rows.append({
                "category": "legacy_redirect",
                "host": host,
                "theme": theme_id,
                "source_path": path or "/",
                "expected_path": f"/{theme_id}/" + suffix,
                "passed": first_ok and target_ok,
                "redirect_passed": first_ok,
                "destination_passed": target_ok,
                "query_preserved": bool(loc and "cedwyn_route_probe=" in urllib.parse.urlsplit(loc).query),
                "first_response": first,
                "destination_response": follow_result,
            })
        return rows

    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        for group in pool.map(probe_legacy, host_items):
            for row in group:
                add_test(results, row)

    # Probe the exact public machine-readable agent endpoints that Cloudflare declares.
    # Wildcard-only route patterns are skipped because they do not identify a concrete old host.
    special_routes = inventory.get("worker_routes", {}).get("special_mcp_agent_routes", [])
    service_tests = set()
    for row in special_routes:
        pattern = str(row.get("pattern", ""))
        host, sep, route_path = pattern.partition("/")
        host = host.lower()
        if not sep or "*" in host:
            continue
        if route_path.startswith(".well-known/mcp.json"):
            service_tests.add((host, "/.well-known/mcp.json", "json"))
        elif route_path.startswith(".well-known/webmcp.json"):
            service_tests.add((host, "/.well-known/webmcp.json", "json"))
        elif route_path.startswith("llms.txt"):
            service_tests.add((host, "/llms.txt", "text"))
        elif route_path.startswith("llms-full.txt"):
            service_tests.add((host, "/llms-full.txt", "text"))

    def probe_service(item):
        host, path, kind = item
        resp = request(f"https://{host}{path}", follow=False)
        is_ok = resp.get("status") in EXPECTED_OK
        type_value = (resp.get("content_type") or "").lower()
        if kind == "json":
            type_ok = "json" in type_value
        else:
            type_ok = any(x in type_value for x in ("text/", "json", "octet-stream"))
        return {
            "category": "agent_endpoint",
            "host": host,
            "path": path,
            "expected_content": kind,
            "passed": is_ok and not (resp.get("location") or "").startswith(f"https://{CANONICAL_HOST}/"),
            "content_type_passed": type_ok,
            **resp,
        }

    with concurrent.futures.ThreadPoolExecutor(max_workers=max(1, args.workers)) as pool:
        for result in pool.map(probe_service, sorted(service_tests)):
            add_test(results, result)

    canonical_tests = [r for r in results if r["category"] == "canonical_route"]
    redirect_tests = [r for r in results if r["category"] == "legacy_redirect"]
    service_results = [r for r in results if r["category"] == "agent_endpoint"]
    failures = [r for r in results if not r.get("passed")]
    missing_dns_from_inventory = []
    dns_names = {str(r.get("name", "")).lower() for r in inventory.get("all_dns_records", [])}
    for host, theme_id in host_items:
        if host not in dns_names:
            missing_dns_from_inventory.append({"host": host, "theme": theme_id, "note": "No explicit DNS record in the audited zone; probe result remains authoritative for routability."})

    report = {
        "generated_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "canonical_host": CANONICAL_HOST,
        "user_agent": USER_AGENT,
        "read_only": True,
        "source_theme_count": len(themes),
        "legacy_app_host_count": len(host_items),
        "mapping_conflicts": conflicting,
        "missing_explicit_dns_records": missing_dns_from_inventory,
        "summary": {
            "canonical_routes_tested": len(canonical_tests),
            "canonical_routes_passed": sum(bool(x["passed"]) for x in canonical_tests),
            "legacy_root_and_index_tests": len(redirect_tests),
            "legacy_redirect_tests_passed": sum(bool(x["passed"]) for x in redirect_tests),
            "agent_endpoints_tested": len(service_results),
            "agent_endpoints_passed": sum(bool(x["passed"]) for x in service_results),
            "query_preserved_count": sum(bool(x.get("query_preserved")) for x in redirect_tests),
            "failures": len(failures),
        },
        "tests": results,
    }
    report_path = pathlib.Path(args.report)
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = report["summary"]
    print(json.dumps({"report": str(report_path), "summary": summary, "mapping_conflicts": conflicting}, indent=2))
    for failure in failures[:80]:
        host = failure.get("host") or failure.get("theme") or failure.get("url")
        print(
            "FAIL",
            failure.get("category"),
            host,
            failure.get("source_path") or failure.get("path") or "",
            failure.get("status"),
            failure.get("location"),
            failure.get("error") or "",
        )
    if len(failures) > 80:
        print(f"... {len(failures)-80} additional failures are in the JSON report.")
    return 1 if failures or conflicting else 0


if __name__ == "__main__":
    sys.exit(main())
