import { Client } from "../client.js";
import { HumanMessage } from "@langchain/core/messages";

/**
 * Regression tests for the shape-aware serialize gate in
 * `Client._serializeBody`: payloads that contain a large string are serialized
 * on a worker thread, and the worker path must produce the same JSON as the
 * inline path.
 *
 * The bug these cover: `postMessage` uses the structured clone algorithm,
 * which drops class prototypes, so `toJSON()` was never called on LangChain
 * messages that crossed the thread boundary.
 */
describe("Client._serializeBody worker/inline parity", () => {
  const client = new Client({
    apiKey: "test",
    apiUrl: "http://127.0.0.1:1",
  });

  // The serialize worker is unref'd so it never keeps the process alive; hold
  // the event loop open for the duration of the suite so a pending worker
  // reply can't be dropped when the test is idle.
  const keepAlive = setInterval(() => {}, 1000);

  afterAll(() => {
    clearInterval(keepAlive);
  });

  type SerializeBody = (
    payload: unknown,
    errorContext: string,
  ) => Promise<Uint8Array<ArrayBuffer>>;

  async function serializeBody(payload: unknown): Promise<string> {
    const bytes = await (
      client as unknown as { _serializeBody: SerializeBody }
    )._serializeBody(payload, "test");
    return Buffer.from(bytes).toString("utf8");
  }

  async function serializeMessage(content: string) {
    const payload = { inputs: { messages: [new HumanMessage(content)] } };
    const text = await serializeBody(payload);
    return { text, message: JSON.parse(text).inputs.messages[0] };
  }

  it("uses the compact toJSON form on both sides of the worker threshold", async () => {
    // 60k stays under the 64 KiB large-string threshold and is serialized
    // inline; 70k crosses it and is serialized on the worker thread.
    const inline = await serializeMessage("a".repeat(60_000));
    const worker = await serializeMessage("a".repeat(70_000));

    expect(Object.keys(worker.message)).toEqual(Object.keys(inline.message));
    // Raw serialization leaks the class internals and stores the content twice.
    expect(worker.message).not.toHaveProperty("lc_serializable");
    expect(worker.message).not.toHaveProperty("lc_kwargs");
    expect(worker.message.kwargs.content).toHaveLength(70_000);
    expect(worker.message.content).toBeUndefined();
  });

  it("does not duplicate the message content above the threshold", async () => {
    const inline = await serializeMessage("a".repeat(60_000));
    const worker = await serializeMessage("a".repeat(70_000));

    // Sizes should track the input length, not double it.
    const inlineRatio = inline.text.length / 60_000;
    const workerRatio = worker.text.length / 70_000;
    expect(workerRatio).toBeLessThan(inlineRatio * 1.1);
  });
});
