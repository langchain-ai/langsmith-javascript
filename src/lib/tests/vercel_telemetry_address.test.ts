import { describe, test, expect } from "@jest/globals";
import { LangSmithTelemetry } from "../experimental/vercel/telemetry.js";
import { AgentAddress } from "../address.js";
import { mockClient } from "./utils/mock_client.js";

describe("LangSmithTelemetry address", () => {
  const address = new AgentAddress("customer-support", "production");

  test("sends the root run to the address", async () => {
    const { client, callSpy } = mockClient();
    const telemetry = LangSmithTelemetry({
      client,
      address,
      tracingEnabled: true,
    });
    await telemetry.onStart({
      callId: "call-1",
      operationId: "ai.generateText",
      provider: "openai",
      modelId: "gpt-4.1-mini",
      prompt: "hi",
    });
    await client.awaitPendingTraceBatches();

    const bodies = callSpy.mock.calls
      .filter(([url]: [string]) => String(url).endsWith("/runs"))
      .map(([, init]: [string, any]) =>
        JSON.parse(
          typeof init.body === "string"
            ? init.body
            : new TextDecoder().decode(init.body),
        ),
      );
    expect(bodies).toHaveLength(1);
    expect(bodies[0].address).toBe(
      "lrn:agents/customer-support/environments/production",
    );
    expect(bodies[0]).not.toHaveProperty("session_name");
  });

  test("rejects an address together with projectName", () => {
    expect(() =>
      LangSmithTelemetry({ address, projectName: "p", tracingEnabled: true }),
    ).toThrow(/not both/);
  });
});
