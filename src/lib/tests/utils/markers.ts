import { describe, test } from "@jest/globals";

import { getLangSmithEnvironmentVariable } from "../../utils/env.js";

/**
 * Environment gating for the integration suite, mirroring the pytest markers on
 * the Python side.
 *
 * CI passes the markers the target deployment cannot serve through
 * LANGSMITH_TEST_EXCLUDE_MARKERS (a comma-separated list built per environment
 * in .github/workflows/ci.yml); the tests carrying those markers skip. With the
 * variable unset — local runs and beta — nothing is skipped.
 */
const excluded = new Set(
  (getLangSmithEnvironmentVariable("TEST_EXCLUDE_MARKERS") ?? "")
    .split(",")
    .map((marker) => marker.trim())
    .filter(Boolean),
);

/**
 * Returns `test` / `describe` for the given marker, swapped for their `.skip`
 * variants when the target environment excludes it.
 */
export function requires(...markers: string[]): {
  test: typeof test;
  it: typeof test;
  describe: typeof describe;
} {
  if (!markers.some((marker) => excluded.has(marker)))
    return { test, it: test, describe };
  const skippedTest = skipped(test);
  return { test: skippedTest, it: skippedTest, describe: skipped(describe) };
}

/**
 * A `test`/`describe` stand-in that skips everything but keeps the modifier
 * surface (`.skip`, `.only`, `.each`, ...) the test files already use.
 */
function skipped<T extends typeof test | typeof describe>(fn: T): T {
  const skip = fn.skip as unknown as (...args: unknown[]) => unknown;
  return Object.assign((...args: unknown[]) => skip(...args), fn, {
    only: fn.skip,
    each: fn.skip.each,
  }) as unknown as T;
}

/** Needs the v2 (SmithDB) endpoints, which V15 deployments don't serve. */
export const requiresV2 = requires("require_v2");

/** Needs a legacy ClickHouse-backed endpoint, absent on SmithDB-only backends. */
export const requiresClickhouse = requires("require_clickhouse");

/**
 * Needs a dataset that only exists on the beta tenant — a hardcoded share token
 * or a public dataset URL that no self-hosted deployment can resolve.
 */
export const requiresBetaDataset = requires("require_beta_dataset");

/**
 * Exercises an LLM provider wrapper against a mocked LangSmith client, so the
 * target deployment plays no part. Run once, on beta.
 */
export const requiresProvider = requires("require_provider");
