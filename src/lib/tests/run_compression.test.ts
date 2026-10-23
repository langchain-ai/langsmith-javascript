import { jest, describe, expect, afterEach, it } from "@jest/globals";
import * as zlib from "node:zlib";
import { v4 as uuidv4 } from "../utils/uuid/src/index.js";
import { Client, ClientConfig } from "../client.js";
import { convertToDottedOrderFormat } from "../run_trees.js";
import { compressChunks as browserCompressChunks } from "../utils/compression.browser.js";

const SERVER_INFO = {
  version: "foo",
  batch_ingest_config: { use_multipart_endpoint: true },
  instance_flags: { gzip_body_enabled: true, zstd_compression_enabled: true },
};
const GZIP_ONLY_SERVER_INFO = {
  ...SERVER_INFO,
  instance_flags: { gzip_body_enabled: true },
};

const DECOMPRESS = {
  zstd: (body: Uint8Array) => zlib.zstdDecompressSync(body).toString("utf8"),
  gzip: (body: Uint8Array) => zlib.gunzipSync(body).toString("utf8"),
};

/** Split a multipart body into `{ name: parsed JSON }`. */
function parseMultipart(raw: string): Record<string, any> {
  const boundary = raw.split("\r\n")[0].trim();
  const parsed: Record<string, any> = {};
  for (const part of raw.split(boundary).slice(1, -1)) {
    const [headers, ...content] = part.trim().split("\r\n\r\n");
    const name = headers.match(/name="([^"]+)"/)?.[1] ?? "";
    parsed[name] = JSON.parse(content.join("\r\n\r\n").trim());
  }
  return parsed;
}

function ok(): Response {
  return new Response("{}", {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

function headersOf(call: [string, RequestInit]): Record<string, string> {
  return call[1].headers as Record<string, string>;
}

describe("run compression before queueing", () => {
  const clients: Client[] = [];
  const envBefore = { ...process.env };

  afterEach(async () => {
    for (const client of clients) {
      await client.awaitPendingTraceBatches().catch(() => undefined);
    }
    clients.length = 0;
    process.env = { ...envBefore };
    jest.restoreAllMocks();
  });

  function createClient(
    config: ClientConfig,
    serverInfo: Record<string, unknown> = SERVER_INFO,
    respond: (url: string) => Promise<Response> = () => Promise.resolve(ok()),
  ) {
    const calls: [string, RequestInit][] = [];
    const fetchImplementation = jest.fn((url: any, init: any) => {
      if (/\/runs\/|\/feedback$/.test(String(url))) {
        calls.push([String(url), init]);
      }
      return respond(String(url));
    }) as unknown as typeof fetch;
    const client = new Client({
      apiKey: "test-api-key",
      autoBatchTracing: true,
      fetchImplementation,
      ...config,
    });
    jest
      .spyOn(client as any, "_ensureServerInfo")
      .mockResolvedValue(serverInfo);
    clients.push(client);
    return { client, calls };
  }

  async function createRun(client: Client, inputs: Record<string, unknown>) {
    const runId = uuidv4();
    const { dottedOrder } = convertToDottedOrderFormat(
      Date.now() / 1000,
      runId,
    );
    await client.createRun({
      id: runId,
      project_name: "__test_run_compression",
      name: "test_run",
      run_type: "llm",
      inputs,
      trace_id: runId,
      dotted_order: dottedOrder,
    });
    return { runId, dottedOrder };
  }

  async function traceOneRun(client: Client, inputs: Record<string, unknown>) {
    const { runId, dottedOrder } = await createRun(client, inputs);
    await client.updateRun(runId, {
      outputs: { text: "done" },
      end_time: Date.now(),
      trace_id: runId,
      dotted_order: dottedOrder,
    });
    await client.awaitPendingTraceBatches();
    return runId;
  }

  it.each(["zstd", "gzip"] as const)(
    "sends one %s-compressed multipart request",
    async (encoding) => {
      const { client, calls } = createClient({ runCompression: encoding });

      const runId = await traceOneRun(client, { text: "hello world" });

      expect(calls).toHaveLength(1);
      expect(calls[0][0]).toBe(
        "https://api.smith.langchain.com/runs/multipart",
      );
      expect(headersOf(calls[0])["Content-Encoding"]).toBe(encoding);
      const body = calls[0][1].body as Uint8Array;
      const parts = parseMultipart(DECOMPRESS[encoding](body));
      expect(parts[`post.${runId}`]).toMatchObject({ id: runId });
      expect(parts[`post.${runId}.inputs`]).toEqual({ text: "hello world" });
      expect(parts[`post.${runId}.outputs`]).toEqual({ text: "done" });
    },
  );

  it("sends the size headers with zstd, as the Python SDK does", async () => {
    const { client, calls } = createClient({ runCompression: "zstd" });

    await traceOneRun(client, { text: "hello world" });

    const body = calls[0][1].body as Uint8Array;
    expect(headersOf(calls[0])["X-Pre-Compressed-Size"]).toBe(
      String(Buffer.byteLength(DECOMPRESS.zstd(body))),
    );
    expect(headersOf(calls[0])["X-Post-Compressed-Size"]).toBe(
      String(body.byteLength),
    );
  });

  it.each([
    ["zstd", true, SERVER_INFO],
    ["gzip", true, GZIP_ONLY_SERVER_INFO],
    ["zstd", "auto", SERVER_INFO],
  ] as const)(
    "picks %s for runCompression: %s when the server accepts it",
    async (encoding, runCompression, serverInfo) => {
      const { client, calls } = createClient({ runCompression }, serverInfo);

      await traceOneRun(client, { text: "hello" });

      expect(headersOf(calls[0])["Content-Encoding"]).toBe(encoding);
      expect(DECOMPRESS[encoding](calls[0][1].body as Uint8Array)).toContain(
        "hello",
      );
    },
  );

  it.each([
    ["auto", "zstd"],
    ["gzip", "gzip"],
  ] as const)(
    "is enabled by LANGSMITH_RUN_COMPRESSION=%s",
    async (env, encoding) => {
      process.env.LANGSMITH_RUN_COMPRESSION = env;
      const { client, calls } = createClient({});

      await traceOneRun(client, { text: "hello" });

      expect(headersOf(calls[0])["Content-Encoding"]).toBe(encoding);
    },
  );

  it.each([
    ["it is not configured", {}, SERVER_INFO, {}],
    [
      "the server does not accept the encoding",
      { runCompression: "zstd" },
      GZIP_ONLY_SERVER_INFO,
      {},
    ],
    [
      "LANGSMITH_DISABLE_RUN_COMPRESSION is set",
      { runCompression: true },
      SERVER_INFO,
      { LANGSMITH_DISABLE_RUN_COMPRESSION: "true" },
    ],
  ] as const)(
    "keeps the existing streamed upload when %s",
    async (_case, config, serverInfo, env) => {
      Object.assign(process.env, env);
      const { client, calls } = createClient(config, serverInfo);

      await traceOneRun(client, { text: "hello" });

      expect(calls).toHaveLength(1);
      expect(calls[0][1].body).toBeInstanceOf(ReadableStream);
      expect(headersOf(calls[0])["Content-Encoding"]).not.toBe("zstd");
    },
  );

  it.each(["zstd", "gzip"] as const)(
    "counts the %s-compressed size toward maxIngestMemoryBytes",
    async (encoding) => {
      // A 3 MB run that compresses to a few KB, against a 1 MB limit. The
      // batch queue still counts runs uncompressed before they are batched,
      // and lets one run through when it is empty, so this traces a single
      // create.
      const inputs = { text: "the same sentence again. ".repeat(120_000) };
      const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

      const compressed = createClient({
        runCompression: encoding,
        maxIngestMemoryBytes: 1024 * 1024,
      });
      const { runId } = await createRun(compressed.client, inputs);
      await compressed.client.awaitPendingTraceBatches();
      expect(compressed.calls).toHaveLength(1);
      const parts = parseMultipart(
        DECOMPRESS[encoding](compressed.calls[0][1].body as Uint8Array),
      );
      expect(parts[`post.${runId}.inputs`]).toEqual(inputs);
      expect(warn).not.toHaveBeenCalled();

      const uncompressed = createClient({ maxIngestMemoryBytes: 1024 * 1024 });
      await createRun(uncompressed.client, inputs);
      await uncompressed.client.awaitPendingTraceBatches();
      expect(uncompressed.calls).toHaveLength(0);
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining("Queue size limit"),
      );
    },
  );

  it("sends batched feedback in the compressed request", async () => {
    const { client, calls } = createClient({ runCompression: "zstd" });
    const { runId } = await createRun(client, { text: "hello" });

    const feedback = await client.createFeedback({
      runId,
      traceId: runId,
      sessionId: uuidv4(),
      key: "correctness",
      score: 1,
    });
    await client.awaitPendingTraceBatches();

    expect(calls).toHaveLength(1);
    expect(headersOf(calls[0])["Content-Encoding"]).toBe("zstd");
    const parts = parseMultipart(
      DECOMPRESS.zstd(calls[0][1].body as Uint8Array),
    );
    expect(parts[`post.${runId}`]).toMatchObject({ id: runId });
    expect(parts[`feedback.${feedback.id}`]).toMatchObject({
      id: feedback.id,
      key: "correctness",
    });
  });

  it("on a 404, drops the runs, posts the feedback, and switches to the batch endpoint", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    const { client, calls } = createClient(
      { runCompression: "zstd" },
      SERVER_INFO,
      (url) =>
        Promise.resolve(
          url.endsWith("/runs/multipart")
            ? new Response("not found", { status: 404 })
            : ok(),
        ),
    );

    const { runId } = await createRun(client, { text: "first" });
    await client.createFeedback({
      runId,
      traceId: runId,
      sessionId: uuidv4(),
      key: "correctness",
      score: 1,
    });
    await client.awaitPendingTraceBatches();
    await traceOneRun(client, { text: "second" });

    expect(calls.map(([url]) => url)).toEqual([
      "https://api.smith.langchain.com/runs/multipart",
      "https://api.smith.langchain.com/feedback",
      "https://api.smith.langchain.com/runs/batch",
    ]);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("zstd-compressed batch's runs were dropped"),
    );
  });

  it.each([
    [
      { algorithm: "zstd", windowLog: 31 },
      "zstd windowLog must be an integer from 10 to 27",
    ],
    [
      { algorithm: "zstd", level: 23 },
      "zstd compression level must be an integer of at most 22",
    ],
    [
      { algorithm: "gzip", level: 10 },
      "gzip compression level must be an integer from 0 to 9",
    ],
    [
      { algorithm: "gzip", windowLog: 20 },
      "windowLog applies only to zstd trace compression",
    ],
  ] as const)("rejects runCompression %j", (runCompression, message) => {
    expect(() => new Client({ apiKey: "k", runCompression })).toThrow(message);
  });

  it("rejects an unknown LANGSMITH_RUN_COMPRESSION", () => {
    process.env.LANGSMITH_RUN_COMPRESSION = "brotli";
    expect(() => new Client({ apiKey: "k" })).toThrow(
      'LANGSMITH_RUN_COMPRESSION must be "auto", "zstd" or "gzip"',
    );
  });

  it("compresses gzip with CompressionStream in browser builds", async () => {
    const encoder = new TextEncoder();

    const body = await browserCompressChunks(
      [encoder.encode("hello "), encoder.encode("world")],
      { encoding: "gzip", level: 1 },
    );

    expect(zlib.gunzipSync(body).toString("utf8")).toBe("hello world");
  });
});
