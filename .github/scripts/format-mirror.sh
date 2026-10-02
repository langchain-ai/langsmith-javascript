#!/usr/bin/env bash
# Format changed mirror files with the destination config before committing.
set -euo pipefail
cd "$1"

# Preserve conflict markers for manual resolution.
if [ -n "$(git diff --name-only --diff-filter=U)" ]; then
  echo "Resolve mirror conflicts before formatting." >&2
  exit 1
fi

files=()
while IFS= read -r -d '' file; do
  case "$file" in
    src/lib/*) files+=("$file") ;;
  esac
done < <(git diff --name-only --diff-filter=ACM -z HEAD)

if ((${#files[@]})); then
  ./node_modules/.bin/prettier --write --ignore-unknown -- "${files[@]}"
fi
