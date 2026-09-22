# Instructions for code modifications in the JS/TS SDK

This repo holds the LangSmith JavaScript/TypeScript SDK: the hand-written client (tracing, run trees, evaluation, sandbox, wrappers, jest/vitest helpers) in `src/lib/`, on top of the Stainless-generated REST client in `src/`.

## Before opening a PR

Run from the repo root:

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

Files whose first line carries `File generated from our OpenAPI spec by Stainless.` are regenerated on every sync. Do not edit them. Change the OpenAPI spec or `stainless.yml` in `langchain-ai/langchainplus` instead. CI blocks PRs that touch them unless the PR has the `skip-stainless-generated-file-modification-check` label.

Hand-written code is sealed as custom code by the `stlc-seal-custom-code` workflow on every push to `main`, so it survives regeneration.

Entry points such as `langsmith/traceable` or `langsmith/wrappers/openai` are one-line shims at `src/<entry>.ts` pointing into `src/lib/`. Add a shim and a `package.json` `exports` entry when adding a new public entry point.

## Releasing

Releases are cut by release-please from conventional commits on `main`. Do not hand-edit the version in `package.json`, `src/version.ts` or `.release-please-manifest.json`, and do not push tags.

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
