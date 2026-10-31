import * as fsUtils from "./fs.js";

const LOCK_POLL_INTERVAL_MS = 10;
// A lock older than this is treated as abandoned (its holder crashed) and taken
// over. Holders bound their whole refresh to the 10s refresh timeout, so a live
// holder is never evicted. Shared with the Python, Go and Java SDKs.
export const OAUTH_REFRESH_LOCK_STALE_AFTER_MS = 15_000;
const LOCK_STALE_AFTER_MS = OAUTH_REFRESH_LOCK_STALE_AFTER_MS;
const LOCK_METADATA_FILE = "created_at";

export interface OAuthRefreshLock {
  release(): Promise<void>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isEEXIST(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: string }).code === "EEXIST"
  );
}

function lockMetadataLines(lockDir: string): string[] | undefined {
  try {
    return fsUtils
      .readFileSync(fsUtils.path.join(lockDir, LOCK_METADATA_FILE))
      .split("\n");
  } catch {
    return undefined;
  }
}

// Falls back to the directory's mtime when the metadata is missing or
// malformed (e.g. the holder crashed between mkdir and writing it).
function lockCreatedAtMs(lockDir: string): number | undefined {
  const lines = lockMetadataLines(lockDir);
  if (lines && lines[0] && lines[0].trim()) {
    const parsed = Date.parse(lines[0].trim());
    if (!Number.isNaN(parsed)) {
      return parsed;
    }
  }
  return fsUtils.statMtimeMs(lockDir);
}

async function removeStaleLock(lockDir: string): Promise<boolean> {
  const createdAt = lockCreatedAtMs(lockDir);
  if (
    createdAt === undefined ||
    Date.now() - createdAt <= LOCK_STALE_AFTER_MS
  ) {
    return false;
  }
  await fsUtils.rmRecursive(lockDir);
  return true;
}

function lockOwner(lockDir: string): string | undefined {
  const lines = lockMetadataLines(lockDir);
  if (lines && lines.length >= 2 && lines[1].trim()) {
    return lines[1].trim();
  }
  return undefined;
}

/**
 * Acquire the cross-process lock for refreshing OAuth tokens, shared with the
 * Python, Go and Java SDKs: an atomic-`mkdir` directory at
 * `<resolved config>.oauth.lock.lock` with owner-checked release. A lock older
 * than LOCK_STALE_AFTER_MS is taken over. `deadline` is a `Date.now()`-based
 * timestamp; acquisition rejects once it passes.
 */
export async function acquireOAuthRefreshLock(
  configPath: string,
  deadline: number,
): Promise<OAuthRefreshLock> {
  const lockDir = `${fsUtils.resolveConfigPath(configPath)}.oauth.lock.lock`;
  const waitUntil = performance.now() + Math.max(0, deadline - Date.now());
  const parent = fsUtils.path.dirname(lockDir);
  if (parent) {
    await fsUtils.mkdir(parent);
  }
  const owner = globalThis.crypto.randomUUID();
  for (;;) {
    if (performance.now() >= waitUntil) {
      throw new Error("timed out acquiring OAuth refresh lock");
    }
    try {
      await fsUtils.mkdirExclusive(lockDir);
    } catch (err) {
      if (!isEEXIST(err)) {
        throw err;
      }
      if (!(await removeStaleLock(lockDir))) {
        await sleep(
          Math.min(
            LOCK_POLL_INTERVAL_MS,
            Math.max(0, waitUntil - performance.now()),
          ),
        );
      }
      continue;
    }
    try {
      await fsUtils.writeFileAtomic(
        fsUtils.path.join(lockDir, LOCK_METADATA_FILE),
        `${new Date().toISOString()}\n${owner}\n`,
      );
    } catch (err) {
      await fsUtils.rmRecursive(lockDir);
      throw err;
    }
    break;
  }
  return {
    async release() {
      if (lockOwner(lockDir) === owner) {
        await fsUtils.rmRecursive(lockDir);
      }
    },
  };
}

// Exposed for tests only.
export const _internal = {
  LOCK_METADATA_FILE,
  LOCK_STALE_AFTER_MS,
  lockOwner,
};
