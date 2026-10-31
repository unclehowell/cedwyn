#!/bin/sh
# Rebuild the complete Cedwyn catalogue database (every table, blobs included) from its chunk files.
# Usage: sh fetch-full.sh [site]   -> ./cedwyn.sqlite3, then open it with any SQLite tool.
set -e
B="${1:-https://cedwyn.bucklerfamily.estate}"
N=3085
i=0
: > cedwyn.sqlite3
while [ "$i" -lt "$N" ]; do curl -sfL "$B/db/cedwyn.sqlite3.$(printf %03d "$i")" >> cedwyn.sqlite3; i=$((i+1)); done
echo "expected sha256 bc1e6d06051d615f48da56499e73519b8bba4c7b5c6a630cbcb795d19e71e478"
(sha256sum cedwyn.sqlite3 2>/dev/null || shasum -a 256 cedwyn.sqlite3)
