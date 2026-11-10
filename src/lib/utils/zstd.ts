/**
 * zstd abstraction (Node.js version).
 *
 * This file is swapped with zstd.browser.ts for browser builds via the
 * package.json browser field.
 */

import * as zlib from "node:zlib";
import { Duplex } from "node:stream";
import { getLangSmithEnvironmentVariable } from "./env.js";
import { warnOnce } from "./warn.js";

/** zlib has zstd from Node 22.15 / 23.8. */
export const ZSTD_AVAILABLE = typeof zlib.createZstdCompress === "function";

const DEFAULT_LEVEL = 1;

// zstd's windowLog range; zlib throws outside it. 0 keeps zstd's default.
const MIN_WINDOW_LOG = 10;
const MAX_WINDOW_LOG = 27;

function windowLogFromEnv(): number {
  const raw = getLangSmithEnvironmentVariable("RUN_COMPRESSION_WINDOW_LOG");
  if (!raw) return 0;
  const value = Math.round(Number(raw));
  if (!Number.isFinite(value)) {
    warnOnce(
      `LANGSMITH_RUN_COMPRESSION_WINDOW_LOG="${raw}" is not a number, using zstd's default window.`,
    );
    return 0;
  }
  if (value === 0) return 0;
  const clamped = Math.min(Math.max(value, MIN_WINDOW_LOG), MAX_WINDOW_LOG);
  if (clamped !== value) {
    warnOnce(
      `LANGSMITH_RUN_COMPRESSION_WINDOW_LOG=${raw} is outside ${MIN_WINDOW_LOG}-${MAX_WINDOW_LOG}, using ${clamped}.`,
    );
  }
  return clamped;
}

/**
 * Level 1 and the default window by default, like the Python SDK.
 * LANGSMITH_RUN_COMPRESSION_LEVEL overrides the level.
 * LANGSMITH_RUN_COMPRESSION_WINDOW_LOG (10-27) sets the window to 2^n bytes:
 * 23 (8 MB) catches message history repeated across runs, but the server
 * holds about that much per upload while decoding.
 */
export function createZstdStream(): ReadableWritablePair<
  Uint8Array,
  BufferSource
> {
  // zstd clamps the level itself; only the window needs checking.
  const level =
    Number(getLangSmithEnvironmentVariable("RUN_COMPRESSION_LEVEL")) ||
    DEFAULT_LEVEL;
  const compressor = zlib.createZstdCompress({
    params: {
      [zlib.constants.ZSTD_c_compressionLevel]: level,
      [zlib.constants.ZSTD_c_windowLog]: windowLogFromEnv(),
    },
  });
  return Duplex.toWeb(compressor) as unknown as ReadableWritablePair<
    Uint8Array,
    BufferSource
  >;
}
