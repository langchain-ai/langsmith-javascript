/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-process-env */
import { jest, describe, expect, it, afterEach } from "@jest/globals";
import { gunzipSync } from "node:zlib";
import { v4 as uuidv4 } from "../utils/uuid/src/index.js";
import { Client } from "../client.js";
import { convertToDottedOrderFormat } from "../run_trees.js";
import { CompressedRunBuffer } from "../utils/compressed_runs.js";

const SERVER_INFO = {
  version: "foo",
  batch_ingest_config: { use_multipart_endpoint: true },
  instance_flags: { gzip_body_enabled: true },
};

type Call = { url: string; init: RequestInit };

const partNames = (body: Uint8Array) => {
  const text = gunzipSync(body).toString("utf8");
  const boundary = text.split("\r\n")[0];
  expect(text.endsWith(`${boundary}--\r\n`)).toBe(true);
  return [...text.matchAll(/name="([^"]+)"/g)].map((m) => m[1]);
};

const clients: Client[] = [];

const createClient = async (
  responses: number[] = [],
  config: Record<string, unknown> = {},
  onFetch?: (callIndex: number) => void,
) => {
  const calls: Call[] = [];
  const fetchImplementation = jest.fn(async (url: any, init: any) => {
    calls.push({ url, init });
    onFetch?.(calls.length - 1);
    const status = responses.shift() ?? 202;
    return {
      ok: status < 300,
      status,
      statusText: "",
      text: async () => "",
      json: async () => ({}),
    } as Response;
  });
  const client = new Client({
    apiKey: "test-api-key",
    autoBatchTracing: true,
    fetchImplementation: fetchImplementation as any,
    callerOptions: { maxRetries: 2 },
    ...config,
  });
  jest.spyOn(client as any, "_getServerInfo").mockResolvedValue(SERVER_INFO);
  clients.push(client);
  return { client, calls };
};

const createAndEndRun = async (
  client: Client,
  inputs: object,
  extra: { attachments?: Record<string, [string, Uint8Array]> } = {},
  updateExtra: { attachments?: Record<string, [string, Uint8Array]> } = {},
) => {
  const id = uuidv4();
  const { dottedOrder } = convertToDottedOrderFormat(Date.now() / 1000, id);
  await client.createRun({
    id,
    name: "test_run",
    run_type: "llm",
    inputs,
    trace_id: id,
    dotted_order: dottedOrder,
    ...extra,
  });
  await client.updateRun(id, {
    outputs: { text: "done" },
    trace_id: id,
    dotted_order: dottedOrder,
    end_time: Date.now(),
    ...updateExtra,
  } as any);
  return id;
};

afterEach(async () => {
  await Promise.all(clients.map((c) => c.awaitPendingTraceBatches()));
  clients.length = 0;
});

describe("runs are gzipped as they are queued", () => {
  it("sends post then patch parts in one gzipped body", async () => {
    const { client, calls } = await createClient();
    const id = await createAndEndRun(client, { text: "hello" });
    await client.awaitPendingTraceBatches();

    expect(calls).toHaveLength(1);
    const headers = calls[0].init.headers as Record<string, string>;
    expect(headers["Content-Encoding"]).toBe("gzip");
    expect(partNames(calls[0].init.body as Uint8Array)).toEqual([
      `post.${id}`,
      `post.${id}.inputs`,
      `post.${id}.extra`,
      `patch.${id}`,
      `patch.${id}.outputs`,
      `patch.${id}.extra`,
    ]);
  });

  it("retries send the same bytes", async () => {
    const { client, calls } = await createClient([500, 202]);
    await createAndEndRun(client, { text: "hello" });
    await client.awaitPendingTraceBatches();

    expect(calls).toHaveLength(2);
    expect(calls[1].init.body).toBe(calls[0].init.body);
  });

  it("splits batches at the size limit", async () => {
    const { client, calls } = await createClient([], {
      batchSizeBytesLimit: 1000,
    });
    for (let i = 0; i < 3; i++) {
      await createAndEndRun(client, { text: "x".repeat(2000) });
    }
    await client.awaitPendingTraceBatches();

    expect(calls.length).toBeGreaterThanOrEqual(3);
    const names = calls.flatMap((c) => partNames(c.init.body as Uint8Array));
    expect(names.filter((n) => /^post\.[^.]+$/.test(n))).toHaveLength(3);
    expect(names.filter((n) => /^patch\.[^.]+$/.test(n))).toHaveLength(3);
  });

  it("flush() sends open buffers in manual flush mode", async () => {
    const { client, calls } = await createClient([], {
      manualFlushMode: true,
    });
    await createAndEndRun(client, { text: "hello" });
    expect(calls).toHaveLength(0);
    await client.flush();
    expect(calls).toHaveLength(1);
  });

  it("sends attachments passed on the post and on the patch", async () => {
    const { client, calls } = await createClient();
    const file = (text: string): [string, Uint8Array] => [
      "text/plain",
      new TextEncoder().encode(text),
    ];
    const id = await createAndEndRun(
      client,
      { text: "hello" },
      { attachments: { file: file("contents") } },
      { attachments: { report: file("report") } },
    );
    await client.awaitPendingTraceBatches();

    const names = calls.flatMap((c) => partNames(c.init.body as Uint8Array));
    expect(names.filter((n) => n.startsWith("attachment.")).sort()).toEqual([
      `attachment.${id}.file`,
      `attachment.${id}.report`,
    ]);
  });

  it("sends the open buffer instead of dropping at maxIngestMemoryBytes", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => {});
    try {
      const { client, calls } = await createClient([], {
        maxIngestMemoryBytes: 1500,
      });
      const id = uuidv4();
      const { dottedOrder } = convertToDottedOrderFormat(Date.now() / 1000, id);
      const run = { trace_id: id, dotted_order: dottedOrder };
      await client.createRun({
        id,
        name: "test_run",
        run_type: "llm",
        inputs: { text: "x".repeat(1000) },
        ...run,
      });
      // Once the post is gzipped, the patch no longer fits next to it.
      while ((client as any).autoBatchQueue.sizeBytes > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1));
      }
      await client.updateRun(id, {
        outputs: { text: "y".repeat(1000) },
        end_time: Date.now(),
        ...run,
      });
      await client.awaitPendingTraceBatches();

      expect(calls).toHaveLength(2);

      const names = calls.flatMap((c) => partNames(c.init.body as Uint8Array));
      expect(names).toContain(`post.${id}`);
      expect(names).toContain(`patch.${id}`);
      expect(warn).not.toHaveBeenCalled();
    } finally {
      warn.mockRestore();
    }
  });

  it("awaitPendingTraceBatches sends runs queued during the last send", async () => {
    let client!: Client;
    let lateId: string | undefined;
    const created = await createClient([], {}, (callIndex) => {
      if (callIndex === 0) {
        lateId = uuidv4();
        const { dottedOrder } = convertToDottedOrderFormat(
          Date.now() / 1000,
          lateId,
        );
        void client.createRun({
          id: lateId,
          name: "late_run",
          run_type: "llm",
          inputs: {},
          trace_id: lateId,
          dotted_order: dottedOrder,
        });
      }
    });
    client = created.client;
    await createAndEndRun(client, { text: "hello" });
    await client.awaitPendingTraceBatches();

    const names = created.calls.flatMap((c) =>
      partNames(c.init.body as Uint8Array),
    );
    expect(names).toContain(`post.${lateId}`);
  });

  it("keeps the uncompressed queue when compression is disabled", async () => {
    process.env.LANGSMITH_DISABLE_RUN_COMPRESSION = "true";
    try {
      const { client, calls } = await createClient();
      await createAndEndRun(client, { text: "hello" });
      await client.awaitPendingTraceBatches();

      expect(calls).toHaveLength(1);
      const headers = calls[0].init.headers as Record<string, string>;
      expect(headers["Content-Encoding"]).toBeUndefined();
    } finally {
      delete process.env.LANGSMITH_DISABLE_RUN_COMPRESSION;
    }
  });
});

describe("CompressedRunBuffer", () => {
  it("returns a gzipped multipart body", async () => {
    const buffer = new CompressedRunBuffer();
    const data = new TextEncoder().encode('{"a":1}');
    await buffer.writeParts(
      [{ name: "post.1", contentType: "application/json", data }],
      "trace=1,id=1",
      () => undefined,
    );
    const body = await buffer.close();
    const text = gunzipSync(body).toString("utf8");

    expect(text).toBe(
      `--${buffer.boundary}\r\n` +
        `Content-Disposition: form-data; name="post.1"\r\n` +
        `Content-Type: application/json\r\n\r\n` +
        `{"a":1}\r\n` +
        `--${buffer.boundary}--\r\n`,
    );
    expect(buffer.count).toBe(1);
    expect(body.byteLength).toBeLessThan(buffer.uncompressedSize + 30);
  });
});
