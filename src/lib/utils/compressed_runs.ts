import { createZstdStream, ZSTD_AVAILABLE } from "./zstd.js";

const encoder = new TextEncoder();

const concat = (chunks: Uint8Array[]) => {
  const out = new Uint8Array(chunks.reduce((sum, c) => sum + c.byteLength, 0));
  let offset = 0;
  for (const chunk of chunks) {
    out.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return out;
};

export type SerializedPart = {
  name: string;
  contentType: string;
  data: Uint8Array;
};

export type RunEncoding = "zstd" | "gzip";

/**
 * A multipart body compressed as runs are written, so a batch waiting to
 * upload holds compressed bytes, not run objects.
 */
export class CompressedRunBuffer {
  readonly boundary =
    "----LangSmithFormBoundary" + Math.random().toString(36).slice(2);

  /** Uncompressed bytes written, for batch size limits. */
  uncompressedSize = 0;

  /** Number of operations written. */
  count = 0;

  readonly context: string[] = [];

  /** Called once this batch is sent. */
  readonly onSent: (() => void)[] = [];

  private writer: WritableStreamDefaultWriter<BufferSource>;

  private chunks: Uint8Array[] = [];

  private readDone: Promise<void>;

  constructor(readonly encoding: RunEncoding = "gzip") {
    const stream =
      encoding === "zstd" ? createZstdStream() : new CompressionStream("gzip");
    this.writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    this.readDone = (async () => {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) return;
        this.chunks.push(value);
      }
    })();
  }

  /** zstd if the server takes it and this runtime has it, else gzip. */
  static pickEncoding(serverAllowsZstd: boolean): RunEncoding | undefined {
    if (serverAllowsZstd && ZSTD_AVAILABLE) return "zstd";
    return typeof CompressionStream !== "undefined" ? "gzip" : undefined;
  }

  /** Resolves once the compressor has taken the bytes, so the caller can drop them. */
  async writeParts(
    parts: SerializedPart[],
    context: string,
    onSent: () => void,
  ) {
    this.count += 1;
    this.context.push(context);
    this.onSent.push(onSent);
    // One write per run: each write waits for a busy event loop.
    await this._write(
      concat(
        parts.flatMap((part) => [
          encoder.encode(
            `--${this.boundary}\r\n` +
              `Content-Disposition: form-data; name="${part.name}"\r\n` +
              `Content-Type: ${part.contentType}\r\n\r\n`,
          ),
          part.data,
          encoder.encode("\r\n"),
        ]),
      ),
    );
  }

  /** Close the multipart body and return the compressed bytes. */
  async close(): Promise<Uint8Array<ArrayBuffer>> {
    await this._write(encoder.encode(`--${this.boundary}--\r\n`));
    await this.writer.close();
    await this.readDone;
    const body = concat(this.chunks);
    this.chunks = [];
    return body;
  }

  private async _write(chunk: Uint8Array) {
    this.uncompressedSize += chunk.byteLength;
    await this.writer.write(chunk);
  }
}
