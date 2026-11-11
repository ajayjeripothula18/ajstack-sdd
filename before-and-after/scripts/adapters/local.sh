#!/bin/bash
# local.sh - Local storage adapter for before-and-after screenshots
# Saves screenshots to .artifacts/screenshots/ without external network calls.
#
# Usage: ./local.sh <file>
# Output: Relative path to saved file (stdout)

set -e

FILE="$1"

if [[ -z "$FILE" ]]; then
    echo "Usage: $0 <file>" >&2
    exit 1
fi

if [[ ! -f "$FILE" ]]; then
    echo "Error: File not found: $FILE" >&2
    exit 1
fi

TARGET_DIR="${SCREENSHOT_DIR:-.artifacts/screenshots}"
mkdir -p "$TARGET_DIR"

FILENAME=$(basename "$FILE")
TIMESTAMP=$(date +%Y%m%d%H%M%S)
TARGET_FILE="$TARGET_DIR/${TIMESTAMP}-${FILENAME}"

cp "$FILE" "$TARGET_FILE"

echo "$TARGET_FILE"
