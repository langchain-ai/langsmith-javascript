import { describe, it, expect } from "vitest";
import { createGeminiUsageMetadata } from "../wrappers/gemini.utils.js";
import { wrapGemini } from "../wrappers/gemini.js";
import { mockClient } from "./utils/vitest_mock_client.js";
import { getAssumedTreeFromCalls } from "./utils/tree.js";
import type { GenerateContentParameters, UsageMetadata } from "@google/genai";

describe("wrapGemini inputs", () => {
  it("logs model turns with the assistant role", async () => {
    const { client, callSpy } = mockClient();
    const gemini = wrapGemini(
      {
        models: {
          generateContent: async (_params: GenerateContentParameters) => ({
            candidates: [
              {
                content: { role: "model", parts: [{ text: "Lyon." }] },
                finishReason: "STOP",
              },
            ],
          }),
          generateContentStream: async () => undefined,
        },
      },
      { client, tracingEnabled: true },
    );

    await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: "Capital of France?" }] },
        { role: "model", parts: [{ text: "Paris." }] },
        { role: "user", parts: [{ text: "And its second city?" }] },
      ],
    });

    const tree = await getAssumedTreeFromCalls(callSpy.mock.calls, client);
    expect(tree.data["ChatGoogleGenerativeAI:0"].inputs.messages).toEqual([
      { role: "user", content: "Capital of France?" },
      { role: "assistant", content: "Paris." },
      { role: "user", content: "And its second city?" },
    ]);
  });
});

describe("wrapGemini invocation params", () => {
  const runWithConfig = async (config?: Record<string, unknown>) => {
    const { client, callSpy } = mockClient();
    const gemini = wrapGemini(
      {
        models: {
          generateContent: async (_params: GenerateContentParameters) => ({
            candidates: [
              {
                content: { role: "model", parts: [{ text: "Lyon." }] },
                finishReason: "STOP",
              },
            ],
          }),
          generateContentStream: async () => undefined,
        },
      },
      { client, tracingEnabled: true },
    );

    await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Capital of France?",
      ...(config ? { config } : {}),
    });

    const tree = await getAssumedTreeFromCalls(callSpy.mock.calls, client);
    return tree.data["ChatGoogleGenerativeAI:0"].extra?.metadata as Record<
      string,
      unknown
    >;
  };

  it("records stop sequences as ls_stop", async () => {
    const metadata = await runWithConfig({
      temperature: 0.2,
      maxOutputTokens: 64,
      stopSequences: ["END"],
    });

    expect(metadata.ls_stop).toEqual(["END"]);
    expect(metadata.ls_temperature).toBe(0.2);
    expect(metadata.ls_max_tokens).toBe(64);
  });

  it("wraps a bare string stop sequence in a list", async () => {
    const metadata = await runWithConfig({ stopSequences: "END" });

    expect(metadata.ls_stop).toEqual(["END"]);
  });

  it("omits ls_stop when no stop sequences are set", async () => {
    const withoutConfig = await runWithConfig();
    const withEmptyConfig = await runWithConfig({ temperature: 0.2 });

    expect(withoutConfig.ls_provider).toBe("google");
    expect(withoutConfig).not.toHaveProperty("ls_stop");
    expect(withEmptyConfig).not.toHaveProperty("ls_stop");
  });
});

describe("create usage metadata", () => {
  it("basic usage", () => {
    const usage: UsageMetadata = {
      promptTokenCount: 10,
      responseTokenCount: 20,
      totalTokenCount: 30,
    };

    const result = createGeminiUsageMetadata(usage);

    expect(result).toEqual({
      input_tokens: 10,
      output_tokens: 20,
      total_tokens: 30,
      input_token_details: {
        cache_read: undefined,
        cache_read_over_200k: undefined,
        over_200k: 0,
      },
      output_token_details: {
        reasoning: undefined,
        over_200k: undefined,
      },
    });
  });

  it("includes cached tokens", () => {
    const usage: UsageMetadata = {
      promptTokenCount: 10,
      responseTokenCount: 20,
      cachedContentTokenCount: 5,
      totalTokenCount: 30,
    };

    const result = createGeminiUsageMetadata(usage);
    expect(result).toEqual({
      input_tokens: 10,
      output_tokens: 20,
      total_tokens: 30,
      input_token_details: {
        cache_read: 5,
        cache_read_over_200k: 0,
        over_200k: 0,
      },
      output_token_details: {
        reasoning: undefined,
        over_200k: undefined,
      },
    });
  });

  it("includes cached tokens over 200k", () => {
    const usage: UsageMetadata = {
      promptTokenCount: 1_000_000,
      responseTokenCount: 500_000,
      cachedContentTokenCount: 250_000,
      totalTokenCount: 1_500_000,
    };

    const result = createGeminiUsageMetadata(usage);
    expect(result).toEqual({
      input_tokens: 1_000_000,
      output_tokens: 500_000,
      total_tokens: 1_500_000,
      input_token_details: {
        cache_read: 200_000,
        cache_read_over_200k: 50_000,
        over_200k: 550_000,
      },
      output_token_details: {
        reasoning: undefined,
        over_200k: undefined,
      },
    });
  });

  it("includes reasoning tokens", () => {
    const usage: UsageMetadata = {
      promptTokenCount: 10,
      responseTokenCount: 20,
      thoughtsTokenCount: 15,
      totalTokenCount: 30,
    };

    const result = createGeminiUsageMetadata(usage);

    expect(result).toEqual({
      input_tokens: 10,
      output_tokens: 20,
      total_tokens: 30,
      input_token_details: {
        cache_read: undefined,
        cache_read_over_200k: undefined,
        over_200k: 0,
      },
      output_token_details: {
        reasoning: 15,
        over_200k: undefined,
      },
    });
  });
});
