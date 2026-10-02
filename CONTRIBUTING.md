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

## Setting up the environment

This repository uses [`pnpm`](https://pnpm.io/).
Other package managers may work but are not officially supported for development.

To set up the repository, run:

```sh
$ pnpm install
$ pnpm build
```

This will install all the required dependencies and build output files to `dist/`.

## Modifying/Adding code

Most of the SDK is generated code. Modifications to code will be persisted between generations, but may
result in merge conflicts between manual patches and changes from the generator. The generator will never
modify the contents of the `src/lib/` and `examples/` directories.

## Adding and running examples

All files in the `examples/` directory are not modified by the generator and can be freely edited or added to.

```ts
// add an example to examples/<your-example>.ts

#!/usr/bin/env -S npm run tsn -T
…
```

```sh
$ chmod +x examples/<your-example>.ts
# run the example against your api
$ pnpm tsn -T examples/<your-example>.ts
```

## Using the repository from source

If you’d like to use the repository from source, you can either install from git or link to a cloned repository:

To install via git:

```sh
$ npm install git+ssh://git@github.com:langchain-ai/langsmith-javascript.git
```

Alternatively, to link a local copy of the repo:

```sh
# Clone
$ git clone https://www.github.com/langchain-ai/langsmith-javascript
$ cd langsmith-javascript

# With yarn
$ yarn link
$ cd ../my-package
$ yarn link langsmith

# With pnpm
$ pnpm link --global
$ cd ../my-package
$ pnpm link --global langsmith
```

## Running tests

```sh
$ pnpm run test
```

## Linting and formatting

This repository uses [prettier](https://www.npmjs.com/package/prettier) and
[eslint](https://www.npmjs.com/package/eslint) to format the code in the repository.

To lint:

```sh
$ pnpm lint
```

To format and fix all lint issues automatically:

```sh
$ pnpm fix
```
