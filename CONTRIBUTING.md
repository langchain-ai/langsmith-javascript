# Contributing

LangSmith SDK changes are developed in internal staging repositories and released from public production repositories.

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

import { Client } from 'langsmith';

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

To install directly from the public production repository, use:

```sh
pnpm add git+ssh://git@github.com/langchain-ai/langsmith-javascript.git
```

## Run checks

Run tests, lint, and formatting with:

```sh
pnpm test
pnpm lint
pnpm fix
```

## Open a pull request

External contributors should open issues and pull requests in the public `langsmith-javascript` repository. Staging is internal; maintainers review and port accepted changes while preserving contributor credit.

Internal development PRs target `langsmith-javascript-staging`. Production releases are promoted and published from `langsmith-javascript`; do not change package versions or publish directly from staging.
