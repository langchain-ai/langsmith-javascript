import { jest } from "@jest/globals";
import { Client } from "../client.js";

test("createFeedbackConfig sends is_enforced", async () => {
  const client = new Client({ apiUrl: "http://localhost:1984", apiKey: "123" });
  const config = { type: "continuous" as const, min: 0, max: 1 };
  const fetchSpy = jest.spyOn(client as any, "_fetch").mockImplementation(
    async () =>
      new Response(
        JSON.stringify({
          feedback_key: "correctness",
          feedback_config: config,
          tenant_id: "00000000-0000-0000-0000-000000000002",
          modified_at: "2026-10-19T00:00:00Z",
          is_enforced: true,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
  );

  const created = await client.createFeedbackConfig({
    feedbackKey: "correctness",
    feedbackConfig: config,
    isEnforced: true,
  });

  const body = JSON.parse(
    (fetchSpy.mock.calls[0][1] as RequestInit).body as string,
  );
  expect(body.is_enforced).toBe(true);
  // Omitted, so the key keeps its existing score direction.
  expect(body).not.toHaveProperty("is_lower_score_better");
  expect(created.is_enforced).toBe(true);
});
