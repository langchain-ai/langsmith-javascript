# Contributing

This is the development and generation repository for the LangSmith JavaScript SDK. Changes are promoted to the production repository for releases.

## Taking over an external contributor's PR

Do not authorize GitHub Actions on external contributors' PRs.
Review the contribution, then cherry-pick reviewed commits onto an internal branch in `langchain-ai/langsmith-javascript-staging`.
Open a maintainer-owned replacement PR so CI can run there.

1. Review the original PR's complete diff and commit list before pushing.
   Include code, tests, dependencies, scripts and workflows that CI would execute.
   Moving code to an internal branch does not make it safe.
2. Start from the latest target branch in a clean checkout.
   Fetch the original PR's head and cherry-pick only reviewed commits, oldest first.
   Replace `123` with the original PR number and `main` with its target branch.
   Set the SHA variables to reviewed original commits; omit the second if unnecessary.

   ```bash
   git fetch origin
   git switch -c thibautlehmann/external-pr-123 origin/main
   git fetch origin pull/123/head
   git cherry-pick -x "$reviewed_commit_sha" "$next_reviewed_commit_sha"
   ```

   Use explicit commit SHAs, never a moving branch head.
   `-x` records the source commit; cherry-picking preserves the contributor's authorship.
   Resolve conflicts and review the resulting diff before continuing, or run `git cherry-pick --abort`.
3. Review the final diff against the target branch and run the relevant local checks.
   Push to this repository's `origin`, then open a replacement PR against the original target branch.
   Link the original PR, credit the contributor and explain changes made during the takeover.
   Agents should use their PR-creation tool when available.
4. Run CI and obtain the usual review on the replacement PR.
   Do not approve the original workflows or weaken CI security settings.
   Link the replacement from the original PR.
   Close the original as superseded once the replacement merges.

Review and cherry-pick any later contributor commits explicitly.
Do not automatically sync unreviewed updates.

## Set up the environment

This repository uses [pnpm](https://pnpm.io/). Other package managers are not officially supported. Install dependencies and build the SDK with:

```sh
pnpm install
pnpm build
```

## Make changes

Most of the SDK is generated from the LangSmith API definition by Stainless. Do not edit generated files directly. CI rejects changes to files marked `File generated from our OpenAPI spec by Stainless.`

Handwritten code belongs in `src/lib/` or `examples/`; generation does not overwrite those directories. Changes to generated API behavior should be made in the source API definition or Stainless configuration, with help from an SDK maintainer.

## Add or run an example

Add an example under `examples/`, for example `examples/my_example.ts`:

```ts
#!/usr/bin/env -S pnpm tsn -T

import { Client } from "langsmith";

const client = new Client();
```

Run it with:

```sh
chmod +x examples/my_example.ts
pnpm tsn -T examples/my_example.ts
```

Examples call the configured LangSmith API, so set the endpoint and credentials for the environment you want to use.

## Use a local build

Link this checkout globally:

```sh
pnpm link --global
```

Then link it in the project where you want to try the SDK:

```sh
pnpm link --global langsmith
```

To install directly from this repository, use:

```sh
pnpm add git+ssh://git@github.com/langchain-ai/langsmith-javascript-staging.git
```

## Run checks

Run tests, lint, and formatting with:

```sh
pnpm test
pnpm lint
pnpm fix
```

## Open a pull request

Open development changes against `langsmith-javascript-staging`. Include focused tests and update relevant examples or docs. Use conventional commit messages so release-please can prepare the changelog and version.

Production releases are promoted and published from `langsmith-javascript`. Do not change package versions or publish directly from staging.
