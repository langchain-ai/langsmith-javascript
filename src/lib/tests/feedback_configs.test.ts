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

const CONFIG_ID = "0193a1b2-0000-7000-8000-000000000001";
const SOURCE_QUEUE_ID = "0193a1b2-0000-7000-8000-000000000002";
const TAGS = {
  type: "categorical" as const,
  categories: [
    { value: 0, label: "billing" },
    { value: 1, label: "shipping" },
  ],
  allows_multiple_categories: true,
};
const CONFIG_RESPONSE = {
  id: CONFIG_ID,
  feedback_key: "topics",
  feedback_config: TAGS,
  tenant_id: "00000000-0000-0000-0000-000000000002",
  modified_at: "2026-11-04T00:00:00Z",
  is_enforced: false,
  is_first: false,
  is_deleted: false,
};

function mockFetch(client: Client, payload: unknown) {
  return jest.spyOn(client as any, "_fetch").mockImplementation(
    async () =>
      new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
  );
}

function sentBody(fetchSpy: ReturnType<typeof mockFetch>, call: number) {
  return JSON.parse(
    (fetchSpy.mock.calls[call][1] as RequestInit).body as string,
  );
}

test("feedback config updates target a config id", async () => {
  const client = new Client({ apiUrl: "http://localhost:1984", apiKey: "123" });
  const fetchSpy = mockFetch(client, CONFIG_RESPONSE);

  const updated = await client.updateFeedbackConfig("topics", {
    feedbackConfig: TAGS,
    configId: CONFIG_ID,
  });
  await client.addFeedbackCategories(
    "topics",
    [{ value: 2, label: "returns" }],
    { configId: CONFIG_ID },
  );
  await client.removeFeedbackCategories("topics", [2]);

  expect(sentBody(fetchSpy, 0)).toEqual({
    feedback_key: "topics",
    id: CONFIG_ID,
    feedback_config: TAGS,
  });
  expect(sentBody(fetchSpy, 1)).toEqual({
    feedback_key: "topics",
    id: CONFIG_ID,
    add_categories: [{ value: 2, label: "returns" }],
  });
  // Without configId the server picks the key's config.
  expect(sentBody(fetchSpy, 2)).toEqual({
    feedback_key: "topics",
    remove_categories: [2],
  });
  expect(updated.id).toBe(CONFIG_ID);
  expect(updated.feedback_config.allows_multiple_categories).toBe(true);
});

test("listFeedbackConfigs can include every config of a key", async () => {
  const client = new Client({ apiUrl: "http://localhost:1984", apiKey: "123" });
  const fetchSpy = mockFetch(client, [CONFIG_RESPONSE]);

  const configs = [];
  for await (const config of client.listFeedbackConfigs({
    feedbackKeys: ["topics"],
    includeAllConfigs: true,
  })) {
    configs.push(config);
  }

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.searchParams.get("include_all_configs")).toBe("true");
  expect(url.searchParams.getAll("key")).toEqual(["topics"]);
  expect(configs.map((c) => c.id)).toEqual([CONFIG_ID]);
});

test("deleteFeedbackConfig deletes one config by id", async () => {
  const client = new Client({ apiUrl: "http://localhost:1984", apiKey: "123" });
  const fetchSpy = mockFetch(client, null);

  await client.deleteFeedbackConfig(undefined, { configId: CONFIG_ID });

  const url = new URL(fetchSpy.mock.calls[0][0] as string);
  expect(url.searchParams.get("id")).toBe(CONFIG_ID);
  expect(url.searchParams.has("feedback_key")).toBe(false);
  await expect(
    client.deleteFeedbackConfig("topics", { configId: CONFIG_ID }),
  ).rejects.toThrow();
});

test("a rubric read from one queue copies to another with its config ids", async () => {
  const client = new Client({ apiUrl: "http://localhost:1984", apiKey: "123" });
  const requiredIf = {
    join: "all" as const,
    rules: [{ key: "resolved", op: "is" as const, values: [0] }],
  };
  const fetchSpy = mockFetch(client, {
    id: SOURCE_QUEUE_ID,
    name: "source",
    tenant_id: "00000000-0000-0000-0000-000000000002",
    created_at: "2026-11-04T00:00:00Z",
    updated_at: "2026-11-04T00:00:00Z",
    rubric_items: [
      { feedback_key: "resolved", is_required: true, feedback_config_id: null },
      {
        feedback_key: "topics",
        required_if: requiredIf,
        visible_if: null,
        feedback_config_id: CONFIG_ID,
        feedback_config: CONFIG_RESPONSE,
      },
    ],
  });

  const source = await client.readAnnotationQueue(SOURCE_QUEUE_ID);
  await client.createAnnotationQueue({
    name: "copy",
    rubricItems: source.rubric_items,
  });

  const sent = sentBody(fetchSpy, 1).rubric_items[1];
  expect(sent.feedback_config_id).toBe(CONFIG_ID);
  expect(sent.required_if).toEqual(requiredIf);
});

test("updateFeedback clears null fields and keeps undefined ones", async () => {
  const client = new Client({ apiUrl: "http://localhost:1984", apiKey: "123" });
  const fetchSpy = mockFetch(client, null);

  await client.updateFeedback(CONFIG_ID, { score: 0.123456, comment: null });

  // comment is cleared; value and correction are left as they are.
  expect(sentBody(fetchSpy, 0)).toEqual({ score: 0.1235, comment: null });
});
