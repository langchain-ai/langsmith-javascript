# Prepare the SDK switch without publishing

1. Keep production release PRs unmerged. Do not dispatch publishers, create releases/tags, or change registry tags or visibility.
2. Merge this staging PR with a merge commit to preserve the production ancestry required by reverse sync.
3. Keep promotion disabled during review. The first promotion and reverse-sync workflow checks remain pending until staging merge.
4. Verify the registry registration below before switch day. Registry write permission is not proven by a passing build or release doctor.
5. Recheck the registry version on switch day. Current `release-as`: 0.10.9; registry latest on October 6: 0.10.8. Remove `release-as` after the first release.

## Publisher identity

Package: `langsmith`. Owner: `langchain-ai`. Repository: `langsmith-javascript`.
Register the workflow filename `publish-npm.yml` with npm; no GitHub environment is configured in this workflow.
Keep the old repository's publishing access until the switch plan authorizes removing it.

Release-please dispatches `publish-npm.yml` on `main` only after creating a release.
GitHub permits `workflow_dispatch` events made with `GITHUB_TOKEN` to start workflows.
This gives automatic publication and manual retries the same workflow identity, without a reusable-workflow caller mismatch.
The publisher rejects staging repositories, non-main dispatches, draft/prerelease releases, malformed tags and package-version mismatches.
It builds from the existing release tag and publishes through OIDC.

Registry-side registration remains unverified: browser access was unavailable for this audit.
The release doctor checks GitHub authentication, OIDC availability and registry reachability; it does not upload or prove publishing permission.

## History and rollback

The history join preserves the staging tree and makes production `main` an ancestor of this branch.
Promotion and reverse sync use fast-forward pushes. Divergent bot branches fail for review instead of being overwritten.
Before the switch, leave these drafts unmerged or revert their file changes. Preserve the joined ancestry after merging.

## Staging CI blocker

[Current main CI](https://github.com/langchain-ai/langsmith-javascript-staging/actions/runs/37409704130) fails provider integrations with HTTP 402 from the shared LLM Gateway policy.
An approved CI gateway/key or a gateway-owner fix is required. Do not weaken assertions, replace live tests with mocks, or modify production policy to hide this failure.
Existing unit/integration test files and SDK source are unchanged from staging `main` in this draft.

## Validation limits

Local guard tests and Git simulations can validate control flow and ancestry without external writes.
Live promotion/reverse sync and package publishing have not been executed during this preparation.
