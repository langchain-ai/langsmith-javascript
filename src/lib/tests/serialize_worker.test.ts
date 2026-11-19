/* eslint-disable no-process-env */
import { SerializeWorker } from "../utils/serialize_worker.js";
import { serialize } from "../utils/fast-safe-stringify/index.js";
import { HumanMessage } from "@langchain/core/messages";

describe("SerializeWorker", () => {
  let worker: SerializeWorker;

  beforeEach(() => {
    worker = new SerializeWorker();
  });

  afterEach(async () => {
    await worker.terminate();
  });

  async function serializeToText(payload: unknown): Promise<string> {
    const bytes = await worker.serialize(payload);
    if (bytes === null) {
      throw new Error("worker returned null; expected bytes");
    }
    return Buffer.from(bytes).toString("utf8");
  }

  test("serializes a plain object to bytes matching JSON.stringify", async () => {
    const payload = { a: 1, b: "two", c: [true, false, null] };
    expect(JSON.parse(await serializeToText(payload))).toEqual(payload);
  });

  test("normalizes Date, RegExp, Map, Set, bigint consistently with main-thread serialize", async () => {
    const payload = {
      date: new Date("2024-01-01T00:00:00.000Z"),
      regex: /foo/gi,
      map: new Map([
        ["x", 1],
        ["y", 2],
      ]),
      set: new Set(["a", "b"]),
      big: BigInt("9007199254740999"),
    };
    const parsed = JSON.parse(await serializeToText(payload));
    expect(parsed.date).toBe("2024-01-01T00:00:00.000Z");
    expect(parsed.regex).toBe("/foo/gi");
    expect(parsed.map).toEqual({ x: 1, y: 2 });
    expect(parsed.set).toEqual(["a", "b"]);
    expect(parsed.big).toBe("9007199254740999");
  });

  test("rejects on DataCloneError for unclonable values (functions)", async () => {
    const payload = { fn: () => 42 };
    await expect(worker.serialize(payload)).rejects.toThrow();
  });

  test("handles large base64-heavy payloads (shape matches real images)", async () => {
    const img = "x".repeat(500 * 1024);
    const payload = {
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:image/png;base64,${img}` },
            },
          ],
        },
      ],
    };
    const parsed = JSON.parse(await serializeToText(payload));
    expect(parsed.messages[0].content[0].image_url.url).toHaveLength(
      "data:image/png;base64,".length + img.length,
    );
  });

  test("tolerates circular references by replacing with [Circular]", async () => {
    const payload: Record<string, unknown> = { a: 1 };
    payload.self = payload;
    expect(await serializeToText(payload)).toContain("[Circular]");
  });

  test("honours toJSON on objects that define it", async () => {
    class Money {
      constructor(private readonly cents: number) {}
      toJSON() {
        return { amount: this.cents / 100, currency: "USD" };
      }
    }
    const payload = { price: new Money(4200), note: "x".repeat(70_000) };
    const workerStr = await serializeToText(payload);
    expect(JSON.parse(workerStr).price).toEqual({
      amount: 42,
      currency: "USD",
    });
    expect(workerStr).toBe(Buffer.from(serialize(payload)).toString("utf8"));
  });

  test("honours toJSON on LangChain messages that trigger the worker path", async () => {
    const payload = {
      inputs: { messages: [new HumanMessage("a".repeat(70_000))] },
    };
    const workerStr = await serializeToText(payload);
    const message = JSON.parse(workerStr).inputs.messages[0];
    expect(message.lc_serializable).toBeUndefined();
    expect(message.lc_kwargs).toBeUndefined();
    expect(workerStr).toBe(Buffer.from(serialize(payload)).toString("utf8"));
  });

  test("produces byte-identical output to main-thread serialize for well-known types", async () => {
    // This test ensures the worker's inlined serialize logic stays in sync
    // with the main-thread implementation. If this fails, the worker source
    // in serialize_worker.ts needs to be updated to match.
    const payloads = [
      // Primitives and simple structures
      { a: 1, b: "two", c: [true, false, null] },
      // Well-known types
      {
        date: new Date("2024-01-01T00:00:00.000Z"),
        regex: /foo/gi,
        map: new Map([
          ["x", 1],
          ["y", 2],
        ]),
        set: new Set(["a", "b"]),
        big: BigInt("9007199254740999"),
      },
      // Error objects
      { err: new Error("test error") },
      // Nested structures
      {
        level1: {
          level2: {
            level3: { data: "deep" },
            arr: [1, 2, 3],
          },
        },
      },
      // Large string (triggers worker path in client)
      { big: "x".repeat(100_000) },
    ];

    for (const payload of payloads) {
      const workerBytes = await worker.serialize(payload);
      if (workerBytes === null) {
        // Worker unavailable in this environment; skip comparison
        continue;
      }
      const workerStr = Buffer.from(workerBytes).toString("utf8");
      const mainStr = Buffer.from(serialize(payload)).toString("utf8");
      expect(workerStr).toBe(mainStr);
    }
  });

  test("matches main-thread serialize on random payloads with toJSON objects", async () => {
    // Seeded, so a failure names the payload that reproduces it.
    const rng = (seed: number) => () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    class Compact {
      constructor(
        readonly inner: unknown,
        readonly dropped: unknown,
      ) {}
      toJSON() {
        return { kind: "compact", inner: this.inner };
      }
    }
    class Scalar {
      constructor(readonly value: unknown) {}
      toJSON() {
        return this.value;
      }
    }
    class Keyed {
      toJSON(key: string) {
        return { reachedThrough: key };
      }
    }
    class Failure extends Error {
      constructor(readonly detail: unknown) {
        super("failed");
      }
      toJSON() {
        return { failure: this.detail };
      }
    }
    const strings = [
      "",
      "plain",
      'quote " and \\ slash',
      "line\nbreak",
      "é 漢 😀",
    ];

    function generate(next: () => number): unknown {
      const pool: unknown[] = [];
      const pick = (n: number) => Math.floor(next() * n);
      const gen = (depth: number): unknown => {
        const kind = pick(depth > 3 ? 7 : 18);
        switch (kind) {
          case 0:
            return null;
          case 1:
            return next() < 0.5;
          case 2:
            return pick(2000) - 1000;
          case 3:
            return next() * 1e6;
          case 4:
            return strings[pick(strings.length)];
          case 5:
            return undefined;
          case 6:
            return new Date(1700000000000 + pick(1e9));
          case 7:
            return BigInt(pick(1e9));
          case 8: {
            const arr = Array.from({ length: pick(4) }, () => gen(depth + 1));
            pool.push(arr);
            return arr;
          }
          case 9: {
            const map = new Map<string, unknown>();
            for (let i = pick(4); i > 0; i--) map.set(`m${i}`, gen(depth + 1));
            return map;
          }
          case 10:
            return new Set(
              Array.from({ length: pick(4) }, () => gen(depth + 1)),
            );
          case 11: {
            const obj = new Compact(gen(depth + 1), gen(depth + 1));
            pool.push(obj);
            return obj;
          }
          case 12:
            return new Scalar(gen(depth + 1));
          case 13:
            return new Keyed();
          case 14:
            return new Failure(gen(depth + 1));
          case 15:
            return JSON.parse(`{"__proto__": ${pick(100)}, "k": ${pick(100)}}`);
          case 16:
            // The same object reached twice.
            if (pool.length > 0) return pool[pick(pool.length)];
          // falls through
          default: {
            const obj: Record<string, unknown> = {};
            for (let i = pick(5); i > 0; i--) obj[`k${i}`] = gen(depth + 1);
            pool.push(obj);
            return obj;
          }
        }
      };
      return { root: gen(0), list: [gen(0), gen(0)] };
    }

    const mismatches: { seed: number; worker: string; inline: string }[] = [];
    for (let seed = 1; seed <= 500; seed++) {
      const payload = generate(rng(seed));
      const inline = Buffer.from(serialize(payload)).toString("utf8");
      const fromWorker = await serializeToText(payload);
      if (fromWorker !== inline) {
        mismatches.push({ seed, worker: fromWorker, inline });
      }
    }
    expect(mismatches).toEqual([]);
  });
});
