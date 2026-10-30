#!/bin/sh
# Rebuild the complete Cedwyn catalogue database (every table, blobs included) from its chunk files.
# Usage: sh fetch-full.sh [site]   -> ./cedwyn.sqlite3, then open it with any SQLite tool.
set -e
B="${1:-https://cedwyn.bucklerfamily.estate}"
N=3002
i=0
: > cedwyn.sqlite3
while [ "$i" -lt "$N" ]; do curl -sfL "$B/db/cedwyn.sqlite3.$(printf %03d "$i")" >> cedwyn.sqlite3; i=$((i+1)); done
echo "expected sha256 a99438ee05a1b22795a6744f9334f1c4030c011a0534e600e1fb2b5efd0fa6ee"
(sha256sum cedwyn.sqlite3 2>/dev/null || shasum -a 256 cedwyn.sqlite3)
