/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, test, expect } from "@jest/globals";
import { wrapClaudeAgentSDK } from "../experimental/anthropic/index.js";
import { mockClient } from "./utils/mock_client.js";
import { getAssumedTreeFromCalls } from "./utils/tree.js";

// Mirrors the SDK's own abort error: a bare `extends Error`, name stays "Error".
class SdkAbortError extends Error {}

async function rootOf(
  query: (params: any) => AsyncGenerator<any, void, unknown>,
  run: (wrapped: any, controller: AbortController) => Promise<void>,
) {
  const { client, callSpy } = mockClient();
  const wrapped = wrapClaudeAgentSDK({ query } as any, {
    client,
    tracingEnabled: true,
  });
  await run(wrapped, new AbortController());
  const tree = await getAssumedTreeFromCalls(callSpy.mock.calls, client);
  return (tree.data as any)["claude.conversation:0"];
}

describe("Claude Agent SDK cancellation status", () => {
  test("abort with the SDK's own error shape is cancelled", async () => {
    const root = await rootOf(
      async function* () {
        yield { type: "system", session_id: "s" };
        throw new SdkAbortError("Operation aborted");
      },
      async (wrapped, controller) => {
        controller.abort();
        await expect(
          (async () => {
            for await (const _ of wrapped.query({
              prompt: "hi",
              options: { abortController: controller },
            })) {
              // drain
            }
          })(),
        ).rejects.toThrow("Operation aborted");
      },
    );
    expect(root.status).toBe("cancelled");
  });

  test("abort with a non-object thrown value rethrows it unchanged", async () => {
    await rootOf(
      async function* () {
        yield { type: "system", session_id: "s" };
        throw "aborted"; // eslint-disable-line no-throw-literal
      },
      async (wrapped, controller) => {
        controller.abort();
        await expect(
          (async () => {
            for await (const _ of wrapped.query({
              prompt: "hi",
              options: { abortController: controller },
            })) {
              // drain
            }
          })(),
        ).rejects.toBe("aborted");
      },
    );
  });

  test("an unrelated error after the signal fired stays an error", async () => {
    const root = await rootOf(
      async function* () {
        yield { type: "system", session_id: "s" };
        throw new Error("tool failed");
      },
      async (wrapped, controller) => {
        controller.abort();
        await expect(
          (async () => {
            for await (const _ of wrapped.query({
              prompt: "hi",
              options: { abortController: controller },
            })) {
              // drain
            }
          })(),
        ).rejects.toThrow("tool failed");
      },
    );
    expect(root.status).toBeUndefined();
    expect(root.error).toContain("tool failed");
  });

  test("an unrelated error mentioning abort after the signal fired stays an error", async () => {
    const root = await rootOf(
      async function* () {
        yield { type: "system", session_id: "s" };
        throw new Error("Failed to abort tool subprocess");
      },
      async (wrapped, controller) => {
        controller.abort();
        await expect(
          (async () => {
            for await (const _ of wrapped.query({
              prompt: "hi",
              options: { abortController: controller },
            })) {
              // drain
            }
          })(),
        ).rejects.toThrow("Failed to abort tool subprocess");
      },
    );
    expect(root.status).toBeUndefined();
    expect(root.error).toContain("Failed to abort tool subprocess");
  });

  test("a real error with no abort stays an error", async () => {
    const root = await rootOf(
      async function* () {
        yield { type: "system", session_id: "s" };
        throw new Error("boom");
      },
      async (wrapped) => {
        await expect(
          (async () => {
            for await (const _ of wrapped.query({ prompt: "hi" })) {
              // drain
            }
          })(),
        ).rejects.toThrow("boom");
      },
    );
    expect(root.status).toBeUndefined();
    expect(root.error).toContain("boom");
  });

  test("breaking out early is cancelled", async () => {
    const root = await rootOf(
      async function* () {
        yield { type: "system", session_id: "s" };
        yield { type: "system", session_id: "s" };
      },
      async (wrapped) => {
        for await (const _ of wrapped.query({ prompt: "hi" })) {
          break;
        }
      },
    );
    expect(root.status).toBe("cancelled");
  });
});
