# Prepare the SDK switch without publishing

1. Keep production release PRs unmerged. Do not dispatch publishers, create releases or tags, change registry tags, or change visibility.
2. Merge this staging PR with a merge commit. Squashing or rebasing discards the production ancestry needed by reverse sync.
3. Leave promotion disabled until staging checks pass. Promotion updates a private production branch/PR; it does not merge production main.
4. Verify registry trusted-publisher registration before switch day. The release doctor checks GitHub authentication, OIDC availability and registry reachability only.
5. At switch day, recheck the registry version and refresh `release-as`. Current proposal: 0.10.9; registry latest on October 5: 0.10.8. Remove `release-as` after the first release.

## Publishing handoff

Release-please calls `publish-npm.yml` only when it creates a release. This avoids relying on a release event created with GITHUB_TOKEN, which does not start another workflow.

The publisher accepts an existing stable release tag, checks the repository/ref and package version, builds from the tag, and uses OIDC. Its manual path is a retry for an existing release. Never run either path during readiness work.

Register `langchain-ai/langsmith-javascript` for the `langsmith` package. Verify the registry's workflow identity requirements for the `release-please.yml` caller and `publish-npm.yml` reusable workflow, including manual retries. Do not remove the old repository's publisher until the switch plan authorizes it. Registry registration/write permission is unverified in this audit.

## History and rollback

Production's entire initial tree matched staging's parent. The history join retained staging's tree, including its intentional removal of obsolete generated address fields. Production main is now an ancestor of this branch. Source mirror commits retain their authors.

Promotion and reverse sync use fast-forward pushes. A divergent bot branch fails for review instead of overwriting remote history.

Before switch day, rollback means leaving these preparation PRs unmerged or reverting their file changes. Do not rewrite history. Keep the joined ancestry if reverting after staging merge.

## Remaining live checks

Integration jobs reject provider requests through the production LLM Gateway with policy 402s. Use an approved test gateway or existing provider secrets; do not change customer gateway policy. Organization secret metadata was inaccessible with the current GitHub permissions. Recheck Claude tool/subagent assertions after provider access works.

Package publication is deliberately untested. A passing build, release doctor or simulated handoff does not prove registry write permission.
