#!/bin/sh
# Rebuild the complete Cedwyn catalogue database (every table, blobs included) from its chunk files.
# Usage: sh fetch-full.sh [site]   -> ./cedwyn.sqlite3, then open it with any SQLite tool.
set -e
B="${1:-https://cedwyn.bucklerfamily.estate}"
N=2948
i=0
: > cedwyn.sqlite3
while [ "$i" -lt "$N" ]; do curl -sfL "$B/db/cedwyn.sqlite3.$(printf %03d "$i")" >> cedwyn.sqlite3; i=$((i+1)); done
echo "expected sha256 302998822e556ac48d3fc9668289c57fd582c8021b9d5d0ac04c3ce1a15deba4"
(sha256sum cedwyn.sqlite3 2>/dev/null || shasum -a 256 cedwyn.sqlite3)
