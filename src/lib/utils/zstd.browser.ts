/**
 * zstd abstraction (browser / edge stub). Browsers have no zstd
 * CompressionStream, so runs use gzip.
 */

export const ZSTD_AVAILABLE = false;

export function createZstdStream(): ReadableWritablePair<
  Uint8Array,
  BufferSource
> {
  throw new Error("zstd is not available in this runtime");
}
