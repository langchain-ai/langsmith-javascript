# Mirror maintenance

Pulls new `langsmith-sdk/js` commits hourly into one rolling PR.
To run manually, dispatch **Mirror from langsmith-sdk** from `main`.
Manual fixes on the mirror branch survive later runs. Slack notifies Thibaut of updates and failures.

## Resolve conflicts

1. Fix conflicts directly on the mirror branch. Check the PR and run artifacts for unapplied patches.
2. Push the fixes and remove `needs-manual-merge`.
3. Dispatch from `main` to resume.

## Review and merge

1. Port files listed as manual; check new public modules for entrypoint shims and exports.
2. Wait for CI to pass, then **rebase-merge** the mirror PR.
3. Rebase-merge the production promotion PR too. Check the release changelog before publishing.

Enable **Allow rebase merging** in repository settings if needed.
Closing an unmerged mirror PR discards its fixes; the next run replays from `main`.

## Formatting policy

Prettier formats handwritten and generated code. `.prettierrc.json` retains the
80-column, double-quote override for `src/lib/`; the version comes from `pnpm-lock.yaml`.

1. Run `scripts/format` locally. `scripts/lint` checks formatting without changing files.
2. Mirroring formats changed files after clean patch application, before committing.
3. Conflicted patches keep their markers. Run `scripts/format` after resolving them.
4. Keep formatter configuration in staging; upstream tooling files remain manual ports.

STLC seals custom changes from `main` and runs `scripts/lint` after regeneration.
Formatting-only changes can still conflict with later upstream edits; review them normally.
