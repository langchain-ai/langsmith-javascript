# Instructions for code modifications in the JS/TS SDK

The JavaScript SDK source in langchainplus is `sdks/javascript`. Edit it here. A merge to main that changes this directory is pushed to `langsmith-javascript` main.

This tree holds the hand-written client (tracing, run trees, evaluation, sandbox, wrappers, jest/vitest helpers) in `src/lib/`, on top of the Stainless-generated REST client in `src/`.

## External contributor PRs

Copybara pushes `sdks/javascript` to `langsmith-javascript` main. Other pull requests to that main have to be the release-please pull request. An SDK change is a pull request in langchainplus that edits `sdks/javascript`.

Do not authorize GitHub Actions on external contributors' pull requests. Review before pushing, cherry-pick reviewed commits onto an internal branch, preserve contributor authorship, and open the replacement pull request in langchainplus.

## Before opening a PR

Run from `sdks/javascript`:

```
pnpm format
pnpm lint
pnpm test
```

`pnpm test` runs two jest projects: `stainless` (generated SDK) and `lib` (hand-written SDK, ESM). To run one hand-written test file:

```bash
NODE_OPTIONS=--experimental-vm-modules npx jest --selectProjects lib src/lib/tests/context.test.ts
```

Integration tests (`pnpm test:integration`) and vitest suites (`pnpm test:vitest`, `pnpm test:eval:vitest`) need API keys and run in CI. Prefer CI over local runs when in doubt: shell or direnv `LANGSMITH_*` variables and `~/.langsmith` config leak in and cause spurious local failures.

## Generated files

Files whose first line carries `File generated from our OpenAPI spec by Stainless.` are generated. Do not edit them by hand. Change `smith-backend/static/openapi.json` or `sdks/tooling/stainless/stainless.yml`, then from the langchainplus root run `./langdev sdks gen javascript` and commit `sdks/javascript` with `sdks/tooling/stainless/patches/javascript.files` and `javascript.patch`. The `check sdk` job fails unless this directory is the generator output plus that patch.

Files that are not listed in `javascript.files` are hand-written. `langdev sdks gen` does not touch them. Hand-written client code lives in `src/lib/`.

Entry points such as `langsmith/traceable` or `langsmith/wrappers/openai` are one-line shims at `src/<entry>.ts` pointing into `src/lib/`. Add a shim and a `package.json` `exports` entry when adding a new public entry point. The export copies `package.json` and keeps the published version line. `check sdk` fails if that line changes.

## Releasing

Releases are cut by release-please from conventional commits on `langsmith-javascript` main, after Copybara pushes the export there. `README.md` edits are exported. Do not bump the version in `package.json`, `src/version.ts`, `CHANGELOG.md`, or `.release-please-manifest.json`. Dependency edits in `package.json` are exported. The version line is left as published on `langsmith-javascript`. Do not push tags.

## Conventions

### Constructing request URLs

Do not hardcode a leading `/v1` (or other `apiUrl`-dependent prefix) into request
paths. `LANGSMITH_ENDPOINT` may already include `/api/v1`, so a hardcoded `/v1/...`
produces a duplicated `/api/v1/v1/...` path and 404s.

For platform endpoints, build the path with the existing `_getPlatformEndpointPath`
helper, which only adds the `/v1` prefix when the configured `apiUrl` does not
already end in `/v1`:

```ts
`${this.apiUrl}${this._getPlatformEndpointPath(`hub/repos/${owner}/${name}/directories`)}`;
```

When adding a new platform endpoint, follow the same pattern instead of inlining
`/v1/platform/...`.
