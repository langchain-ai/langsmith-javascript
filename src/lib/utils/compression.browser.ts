/**
 * Request body compression (browser / edge version).
 *
 * Selected in browser / edge builds via the package.json `browser` field.
 * gzip uses the standard CompressionStream, which has no level setting. zstd
 * is unavailable.
 *
 * Intentionally does not import `node:zlib` -- bundlers that honor the
 * browser field will never traverse the Node variant.
 */

export type CompressionCodec =
  | { encoding: "zstd"; level: number; windowLog?: number }
  | { encoding: "gzip"; level: number };

export const ZSTD_AVAILABLE = false;

/** Whether `CompressionCodec.level` applies to gzip in this runtime. */
export const GZIP_LEVEL_SUPPORTED = false;

/**
 * Compress `chunks` into one gzip stream. `codec.level` is ignored:
 * CompressionStream always uses zlib's default level.
 */
export async function compressChunks(
  chunks: AsyncIterable<Uint8Array> | Iterable<Uint8Array>,
  codec: CompressionCodec,
): Promise<Uint8Array> {
  if (codec.encoding !== "gzip") {
    throw new Error(
      `${codec.encoding} compression is not available in this environment.`,
    );
  }
  const stream = new CompressionStream("gzip");
  const writer = stream.writable.getWriter();
  const output = new Response(stream.readable).arrayBuffer();
  try {
    for await (const chunk of chunks) {
      await writer.write(chunk as BufferSource);
    }
    await writer.close();
  } catch (e) {
    await writer.abort(e).catch(() => undefined);
    await output.catch(() => undefined);
    throw e;
  }
  return new Uint8Array(await output);
}
