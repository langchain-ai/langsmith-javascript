const encoder = new TextEncoder();

export type SerializedPart = {
  name: string;
  contentType: string;
  data: Uint8Array;
};

/**
 * A multipart body gzipped as parts are written, so a batch waiting to upload
 * holds compressed bytes, not run objects.
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

  constructor() {
    const stream = new CompressionStream("gzip");
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

  static isSupported(): boolean {
    return typeof CompressionStream !== "undefined";
  }

  /** Resolves once gzip has taken the bytes, so the caller can drop them. */
  async writeParts(
    parts: SerializedPart[],
    context: string,
    onSent: () => void,
  ) {
    this.count += 1;
    this.context.push(context);
    this.onSent.push(onSent);
    for (const part of parts) {
      await this._write(
        encoder.encode(
          `--${this.boundary}\r\n` +
            `Content-Disposition: form-data; name="${part.name}"\r\n` +
            `Content-Type: ${part.contentType}\r\n\r\n`,
        ),
      );
      await this._write(part.data);
      await this._write(encoder.encode("\r\n"));
    }
  }

  /** Close the multipart body and return the gzipped bytes. */
  async close(): Promise<Uint8Array<ArrayBuffer>> {
    await this._write(encoder.encode(`--${this.boundary}--\r\n`));
    await this.writer.close();
    await this.readDone;
    const body = new Uint8Array(
      this.chunks.reduce((sum, c) => sum + c.byteLength, 0),
    );
    let offset = 0;
    for (const chunk of this.chunks) {
      body.set(chunk, offset);
      offset += chunk.byteLength;
    }
    this.chunks = [];
    return body;
  }

  private async _write(chunk: Uint8Array) {
    this.uncompressedSize += chunk.byteLength;
    await this.writer.write(chunk);
  }
}
