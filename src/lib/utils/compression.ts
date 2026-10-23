/**
 * Request body compression (Node.js version).
 *
 * This file is swapped with compression.browser.ts for browser / edge builds
 * via the package.json `browser` field. Node.js added zstd to `node:zlib` in
 * 22.15.0 and 23.8.0; on older versions ZSTD_AVAILABLE is false.
 */

import { once } from "node:events";
import * as zlib from "node:zlib";

export type CompressionCodec =
  | {
      encoding: "zstd";
      /** zstd compression level. */
      level: number;
      /**
       * Base-2 log of the match window. Omit to keep zstd's default for the
       * level.
       */
      windowLog?: number;
    }
  | {
      encoding: "gzip";
      /** zlib compression level, 0 to 9. */
      level: number;
    };

export const ZSTD_AVAILABLE = typeof zlib.createZstdCompress === "function";

/** Whether `CompressionCodec.level` applies to gzip in this runtime. */
export const GZIP_LEVEL_SUPPORTED = true;

/**
 * Compress `chunks` into one gzip or zstd stream.
 *
 * Chunks are written as the compressor accepts them, so the input is never
 * joined into one uncompressed buffer. The work runs on libuv's thread pool.
 */
export async function compressChunks(
  chunks: AsyncIterable<Uint8Array> | Iterable<Uint8Array>,
  codec: CompressionCodec,
): Promise<Uint8Array> {
  const compressor = createCompressor(codec);
  const output: Buffer[] = [];
  compressor.on("data", (chunk: Buffer) => output.push(chunk));
  try {
    for await (const chunk of chunks) {
      if (!compressor.write(chunk)) {
        await once(compressor, "drain");
      }
    }
    compressor.end();
    await once(compressor, "end");
  } catch (e) {
    compressor.destroy();
    throw e;
  }
  return Buffer.concat(output);
}

function createCompressor(codec: CompressionCodec) {
  switch (codec.encoding) {
    case "zstd": {
      const params: Record<number, number> = {
        [zlib.constants.ZSTD_c_compressionLevel]: codec.level,
      };
      if (codec.windowLog !== undefined) {
        params[zlib.constants.ZSTD_c_windowLog] = codec.windowLog;
      }
      return zlib.createZstdCompress({ params });
    }
    case "gzip":
      return zlib.createGzip({ level: codec.level });
    default: {
      const unknownCodec: never = codec;
      throw new Error(
        `Unknown compression encoding: ${JSON.stringify(unknownCodec)}`,
      );
    }
  }
}
