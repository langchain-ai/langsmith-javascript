#!/usr/bin/env bash
# Exercise the mirror formatter with the installed, locked formatter.
set -euo pipefail
repo=$(cd "$(dirname "$0")/../.." && pwd)
fixture=$(mktemp -d)
trap 'rm -rf "$fixture"' EXIT
cd "$fixture"
git init -q
git config user.name "Mirror formatter test"
git config user.email "mirror-test@example.invalid"
git config core.hooksPath /dev/null
ln -s "$repo/node_modules" "$fixture/node_modules"
cp "$repo/.prettierrc.json" "$repo/.prettierignore" "$fixture/"
mkdir -p src/lib
file="src/lib/format fixture.ts"
unrelated=unrelated.ts
bad='const value={answer:42}'
good='const value = { answer: 42 };'
printf '%s\n' "$good" > "$file"
printf '%s\n' "$good" > "$unrelated"
git add -- "$file" "$unrelated"
git commit -qm baseline

# Changed tracked files with spaces are formatted; unrelated and untracked files are not.
printf '%s\n' "$bad" > "$file"
printf '%s\n' "$bad" > "$unrelated"
printf '%s\n' "$bad" > untracked.py
git add -- "$file"
"$repo/.github/scripts/format-mirror.sh" "$fixture"
test "$(cat "$file")" = "$good"
test "$(cat "$unrelated")" = "$bad"
test "$(cat untracked.py)" = "$bad"

# Deleted files and an empty formatting selection must not invoke a formatter on the whole repo.
git add -- "$file"
git rm -q -- "$file"
"$repo/.github/scripts/format-mirror.sh" "$fixture"
test ! -f "$file"
test "$(cat "$unrelated")" = "$bad"

# Unmerged entries must fail without rewriting conflict markers.
mkdir -p "$(dirname "$file")"
printf '%s\n' '<<<<<<< HEAD' 'left' '=======' 'right' '>>>>>>> upstream' > "$file"
blob=$(printf '%s\n' "$good" | git hash-object -w --stdin)
printf '100644 %s 1\t%s\n100644 %s 2\t%s\n100644 %s 3\t%s\n' \
  "$blob" "$file" "$blob" "$file" "$blob" "$file" | git update-index --index-info
cp "$file" before-conflict
if "$repo/.github/scripts/format-mirror.sh" "$fixture"; then
  echo "Expected formatting to reject unresolved conflicts" >&2
  exit 1
fi
cmp "$file" before-conflict
echo "Mirror formatting regression checks passed."
