/* eslint-disable no-process-env */
import { jest } from "@jest/globals";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { acquireOAuthRefreshLock, _internal } from "../utils/profile-lock.js";
import { loadProfileClientConfig } from "../utils/profiles.js";

function newConfigPath(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ls-lock-"));
  return path.join(dir, "config.json");
}

function writeMeta(lockDir: string, iso: string, owner: string): void {
  fs.mkdirSync(lockDir, { recursive: true });
  fs.writeFileSync(
    path.join(lockDir, _internal.LOCK_METADATA_FILE),
    `${iso}\n${owner}\n`,
  );
}

test("acquire creates the lock dir and release removes it", async () => {
  const configPath = newConfigPath();
  const lockDir = `${configPath}.oauth.lock.lock`;
  const lock = await acquireOAuthRefreshLock(configPath, Date.now() + 5000);
  expect(fs.existsSync(lockDir)).toBe(true);
  await lock.release();
  expect(fs.existsSync(lockDir)).toBe(false);
});

test("acquire times out when the lock is held", async () => {
  const configPath = newConfigPath();
  const held = await acquireOAuthRefreshLock(configPath, Date.now() + 5000);
  await expect(
    acquireOAuthRefreshLock(configPath, Date.now() + 50),
  ).rejects.toThrow(/timed out/);
  await held.release();
});

test("an abandoned lock (expired timestamp) is taken over", async () => {
  const configPath = newConfigPath();
  const lockDir = `${configPath}.oauth.lock.lock`;
  const stale = new Date(
    Date.now() - _internal.LOCK_STALE_AFTER_MS - 1000,
  ).toISOString();
  writeMeta(lockDir, stale, "crashed-owner");
  const lock = await acquireOAuthRefreshLock(configPath, Date.now() + 1000);
  expect(_internal.lockOwner(lockDir)).not.toBe("crashed-owner");
  await lock.release();
  expect(fs.existsSync(lockDir)).toBe(false);
});

test.each([undefined, "malformed"])(
  "an abandoned lock with %s metadata falls back to the directory mtime",
  async (metadata) => {
    const configPath = newConfigPath();
    const lockDir = `${configPath}.oauth.lock.lock`;
    if (metadata === undefined) {
      fs.mkdirSync(lockDir);
    } else {
      writeMeta(lockDir, metadata, "crashed-owner");
    }
    const stale = (Date.now() - _internal.LOCK_STALE_AFTER_MS - 1000) / 1000;
    fs.utimesSync(lockDir, stale, stale);
    const lock = await acquireOAuthRefreshLock(configPath, Date.now() + 1000);
    expect(_internal.lockOwner(lockDir)).not.toBe("crashed-owner");
    await lock.release();
  },
);

test("a live lock is not taken over", async () => {
  const configPath = newConfigPath();
  const lockDir = `${configPath}.oauth.lock.lock`;
  const fresh = new Date(
    Date.now() - _internal.LOCK_STALE_AFTER_MS + 1000,
  ).toISOString();
  writeMeta(lockDir, fresh, "live-owner");
  await expect(
    acquireOAuthRefreshLock(configPath, Date.now() + 50),
  ).rejects.toThrow(/timed out/);
  expect(_internal.lockOwner(lockDir)).toBe("live-owner");
  fs.rmSync(lockDir, { recursive: true });
});

test("release does not remove a lock owned by someone else", async () => {
  const configPath = newConfigPath();
  const lockDir = `${configPath}.oauth.lock.lock`;
  const lock = await acquireOAuthRefreshLock(configPath, Date.now() + 5000);
  // Simulate another owner reclaiming the dir.
  writeMeta(lockDir, new Date().toISOString(), "new-owner");
  await lock.release();
  expect(fs.existsSync(lockDir)).toBe(true);
  fs.rmSync(lockDir, { recursive: true, force: true });
});

test("two ProfileAuth instances refresh the token endpoint only once", async () => {
  const configPath = newConfigPath();
  fs.writeFileSync(
    configPath,
    JSON.stringify({
      current_profile: "default",
      profiles: {
        default: {
          api_url: "https://api.smith.langchain.com",
          oauth: {
            access_token: "stale",
            refresh_token: "refresh-abc",
            expires_at: "2000-01-01T00:00:00Z",
          },
        },
      },
    }),
  );
  const prev = process.env.LANGSMITH_CONFIG_FILE;
  process.env.LANGSMITH_CONFIG_FILE = configPath;
  try {
    let calls = 0;
    const fakeFetch = jest.fn(async (url: unknown) => {
      // The deployment serves no discovery document, so refresh falls back to
      // the configured mount point. Only the token requests are counted.
      if (String(url).includes("/.well-known/oauth-authorization-server")) {
        return {
          ok: false,
          status: 404,
          json: async () => ({}),
        } as unknown as Response;
      }
      calls += 1;
      return {
        ok: true,
        json: async () => ({
          access_token: "network-token",
          refresh_token: "refresh-xyz",
          expires_in: 3600,
        }),
      } as unknown as Response;
    });

    const authA = loadProfileClientConfig().profileAuth;
    const authB = loadProfileClientConfig().profileAuth;
    if (!authA || !authB) {
      throw new Error("expected profileAuth to be defined");
    }
    const [headerA, headerB] = await Promise.all([
      authA.getAuthHeader(fakeFetch as unknown as typeof fetch),
      authB.getAuthHeader(fakeFetch as unknown as typeof fetch),
    ]);

    expect(calls).toBe(1);
    expect(headerA).toEqual({
      name: "Authorization",
      value: "Bearer network-token",
    });
    expect(headerB).toEqual({
      name: "Authorization",
      value: "Bearer network-token",
    });
    const onDisk = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    expect(onDisk.profiles.default.oauth.access_token).toBe("network-token");
  } finally {
    if (prev === undefined) {
      delete process.env.LANGSMITH_CONFIG_FILE;
    } else {
      process.env.LANGSMITH_CONFIG_FILE = prev;
    }
  }
});

test.each(["malformed", "removed", "deleted"])(
  "refresh fails closed when the locked config is %s",
  async (change) => {
    const configPath = newConfigPath();
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        current_profile: "default",
        profiles: {
          default: {
            oauth: {
              access_token: "stale",
              refresh_token: "already-rotated",
              expires_at: "2000-01-01T00:00:00Z",
            },
          },
        },
      }),
    );
    const auth = loadProfileClientConfig({ configPath }).profileAuth;
    expect(auth).toBeDefined();
    if (change === "deleted") {
      fs.unlinkSync(configPath);
    } else {
      fs.writeFileSync(
        configPath,
        change === "malformed" ? "{" : '{"profiles":{}}',
      );
    }
    const fetchMock = jest.fn<typeof fetch>();
    await auth?.getAuthHeader(fetchMock);
    expect(fetchMock).not.toHaveBeenCalled();
    if (change === "deleted") {
      expect(fs.existsSync(configPath)).toBe(false);
    } else {
      expect(fs.readFileSync(configPath, "utf8")).toBe(
        change === "malformed" ? "{" : '{"profiles":{}}',
      );
    }
  },
);

const posixNonRoot =
  process.platform !== "win32" && process.getuid?.() !== 0 ? test : test.skip;

posixNonRoot.each([
  ["within the refresh leeway", 30_000, true],
  ["expired", -60_000, false],
])(
  "read-only config dir with a token %s",
  async (_label, expiresInMs, usable) => {
    const configPath = newConfigPath();
    fs.writeFileSync(
      configPath,
      JSON.stringify({
        current_profile: "default",
        profiles: {
          default: {
            oauth: {
              access_token: "cached",
              refresh_token: "refresh-abc",
              expires_at: new Date(Date.now() + expiresInMs).toISOString(),
            },
          },
        },
      }),
    );
    const auth = loadProfileClientConfig({ configPath }).profileAuth;
    if (!auth) {
      throw new Error("expected profileAuth to be defined");
    }
    const fetchMock = jest.fn<typeof fetch>();
    const dir = path.dirname(configPath);
    fs.chmodSync(dir, 0o500);
    try {
      if (usable) {
        await expect(auth.getAuthHeader(fetchMock)).resolves.toEqual({
          name: "Authorization",
          value: "Bearer cached",
        });
      } else {
        await expect(auth.getAuthHeader(fetchMock)).rejects.toThrow(
          /not be writable/,
        );
      }
    } finally {
      fs.chmodSync(dir, 0o700);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  },
);

test("symlink aliases contend on the canonical config lock", async () => {
  const configPath = newConfigPath();
  fs.writeFileSync(configPath, "{}");
  const alias = `${configPath}.alias`;
  fs.symlinkSync(configPath, alias);
  const held = await acquireOAuthRefreshLock(configPath, Date.now() + 5000);
  try {
    await expect(
      acquireOAuthRefreshLock(alias, Date.now() + 50),
    ).rejects.toThrow(/timed out/);
  } finally {
    await held.release();
  }
});
