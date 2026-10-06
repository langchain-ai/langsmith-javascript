# Reconcile files excluded from SDK mirroring

Audit `langchain-ai/langsmith-sdk` through `1322234d3b88497955cf66851500ebc6910ee85e` (2 October 2026).

Initial mirror baseline: `55d31d21d8417d55b705941cb0205fc1f6487858`.
Staging code watermark at this audit: `842d056d001e9bc7faf543da89278613dfebc284`.

This audit accounts for excluded metadata and configuration. It does not advance the code watermark or claim the remaining code queue is drained.

## Source changes

Inspect every source commit after the initial mirror baseline, including commits with only excluded files and shared `.github/` changes. Check prior `Mirror-Manual-Port` records. This avoids treating an advanced watermark as proof of metadata parity.

| Source commit                                                                                             | Excluded paths                                                                                                                                                                       | Status                 | Evidence or reason                                                                                                                                                               |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ad399f1d](https://github.com/langchain-ai/langsmith-sdk/commit/ad399f1da7a775119eda41e2644be1c050153445) | `js/package.json`                                                                                                                                                                    | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below.                                   |
| [1d3e54ae](https://github.com/langchain-ai/langsmith-sdk/commit/1d3e54ae6bcb28cdf959553378734a0add0a279a) | `.github/scripts/mirror-since.sh`<br>`.github/scripts/mirror-to-staging.sh`<br>`.github/workflows/mirror-to-staging.yml`                                                             | Already present        | Staging pulls through .github/workflows/mirror-from-langsmith-sdk.yml. The old push-based workflow is superseded.                                                                |
| [9207dfb6](https://github.com/langchain-ai/langsmith-sdk/commit/9207dfb6dfc7dea53b9574ce8ff37858e379dcea) | `.github/scripts/mirror-since.sh`<br>`.github/scripts/mirror-to-staging.sh`<br>`.github/workflows/mirror-to-staging.yml`                                                             | Already present        | No push-based mirror workflow exists in staging; the pull workflow remains authoritative.                                                                                        |
| [3e225e3a](https://github.com/langchain-ai/langsmith-sdk/commit/3e225e3a1aec4f0b0e2b0bd3a188dc79da56d320) | `js/pnpm-workspace.yaml`                                                                                                                                                             | Manually ported        | Set root minimumReleaseAge to 10080 minutes; preserve the existing package exceptions, including langsmith for local fixtures.                                                   |
| [b6273eb7](https://github.com/langchain-ai/langsmith-sdk/commit/b6273eb709f0b311d5daf8dfa0f4732fc30cec7e) | `js/internal/environment_tests/test-exports-webpack/package.json`<br>`js/internal/environment_tests/test-exports-webpack/pnpm-lock.yaml`<br>`js/package.json`<br>`js/pnpm-lock.yaml` | Manually ported        | Update root fast-uri 3.1.8, ip-address 10.7.1, undici 7.29.1/8.10.2 overrides and the webpack fast-uri override; regenerate both locks.                                          |
| [ca941215](https://github.com/langchain-ai/langsmith-sdk/commit/ca941215c61d94e6f394342fdf4c7dec9accff1d) | `js/internal/environment_tests/test-exports-cf/pnpm-lock.yaml`                                                                                                                       | Manually ported        | Pin Cloudflare fixture undici to 7.29.1 and regenerate its lock. Retain the tested Wrangler/workerd versions; source also refreshed unrelated fixture packages.                  |
| [51e9f233](https://github.com/langchain-ai/langsmith-sdk/commit/51e9f23353836a44a7fa53e60eaeed9ac85cc739) | `js/package.json`                                                                                                                                                                    | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below.                                   |
| [ff34d38d](https://github.com/langchain-ai/langsmith-sdk/commit/ff34d38d91cbd4041972e813ab1bd864ebe5b17f) | `js/package.json`                                                                                                                                                                    | Excluded intentionally | Keep source release history and version bumps out of staging. Release-please owns staging version files; see the first-publication gate below.                                   |
| [5077435f](https://github.com/langchain-ai/langsmith-sdk/commit/5077435f36aab3825840bdcc4548849b3fc8543a) | `AGENTS.md`<br>`CONTRIBUTING.md`                                                                                                                                                     | Manually ported        | Add the external contributor takeover policy and agent link. Adapt the internal repository and branch prefix to staging; preserve review-before-push and contributor authorship. |
| [1322234d](https://github.com/langchain-ai/langsmith-sdk/commit/1322234d3b88497955cf66851500ebc6910ee85e) | `.github/workflows/ci.yml`                                                                                                                                                           | Excluded intentionally | Adds an old-repo Slack recipient and Open SWE investigation prompt. Preserve staging notification routing; no SDK or test behavior changes.                                      |

Generated `_openapi_client` files are intentionally excluded. The staging REST client is generated from STLC/Stainless and sealed separately. Source generated blobs must not overwrite it.

## Manifest and packaging decisions

| Area                             | Decision                                                                                                                                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Published dependencies and peers | Runtime p-queue and peer dependencies match source. Preserve optional peer declarations.                                                                                                                      |
| Security overrides               | Copy the four source fixes. Retain stronger staging brace-expansion/minimatch overrides and all existing reviewed overrides.                                                                                  |
| Dev tooling                      | Keep Stainless TypeScript 5.8.3, SWC, ESLint/Prettier, tsc-multi, attw and publint. Do not replace them with source TypeScript 6/Babel/Oxlint tooling or downgrade newer OTel dependencies.                   |
| Package manager                  | Keep pnpm 10.30.1 with matching CI pins. A source pnpm 10.33.0 toolchain migration is intentionally excluded.                                                                                                 |
| Metadata                         | Keep package name langsmith and production repository URL. Match the source package description.                                                                                                              |
| Exports and packaging            | Preserve root shims, nested paths, conditional CJS/ESM exports, ESM-only vitest, browser replacements and dist publication. The source entrypoint generator/layout cannot be copied over Stainless packaging. |
| Export fixtures                  | Port webpack/Cloudflare security changes into their standalone projects. Preserve staging file:../../../dist links rather than copying source file:../../.. links.                                            |
| Dependency maintenance           | Target main because next does not exist. Keep the source p-queue ignore so update automation cannot replace the intentional CJS-compatible runtime dependency.                                                |

## CI and release decisions

Keep staging build, unit, integration, package-import/export and generation checks. Source root CI changes in this range only add old-repo notification routing; they do not add missing test behavior. Shared Makefile/workspace files had no additional changes in this range.

Keep staging promotion and publishing workflows separate from old-repo release workflows. This PR does not enable promotion, publish a package, change repository visibility, or modify generated files.

1. First publication must use release-please to select a version above the published source SDK version: 0.10.7 (staging is currently 0.10.4).
2. Reconcile the manifest, package.json and src/version.ts together through the release process. Do not copy skipped source version bumps manually.
3. Confirm the intended stable/prerelease channel and finish the production publishing pipeline under LIN-505/LIN-506 before publishing. Staging retains its current prerelease configuration.

## Validation

1. Fresh `pnpm install --frozen-lockfile --ignore-scripts`: passed. Only fast-uri, ip-address and the two undici versions change in the root lock; webpack/Cloudflare locks contain only their security changes.
2. Build, both TypeScript checks, Prettier, ESLint, attw and publint passed. ESLint has existing unused-disable warnings; publint retains two existing ESM-only vitest export warnings. The initial attw invocation could not write to the default npm cache; it passed with a temporary npm cache.
3. Client, sandbox and run-tree suites: 318 passed. Generated suite: 331 passed, 124 skipped. The broad handwritten run was stopped after it failed the existing 404 tracing test and stopped progressing. That failure also reproduces on unchanged staging with its original dependencies, and passes with an isolated LANGSMITH_CONFIG_FILE. Full handwritten coverage is a CI gate, not a claimed local pass.
4. Webpack production bundle and Cloudflare Wrangler dry run passed with fresh fixture installs. Both standalone lockfiles pass frozen-lockfile checks.
5. Dependency audit reports four unrelated advisories (two high, two moderate), with none for fast-uri, ip-address or undici. The source security patches are reconciled; this PR does not claim a clean audit for the entire development tree.

Logs are retained with the local reconciliation checkout. Live integrations, other export fixtures and CI remain required before release.
