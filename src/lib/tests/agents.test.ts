import { jest } from "@jest/globals";
import { Client } from "../client.js";

describe("registry agents", () => {
  it("creates an agent using the client's workspace and credentials", async () => {
    const fetch = jest
      .fn<typeof globalThis.fetch>()
      .mockResolvedValue(
        Response.json({ id: "example-agent", source_type: "EXTERNAL" }),
      );
    const client = new Client({
      apiUrl: "http://localhost:8080/api/v1",
      apiKey: "test-api-key",
      workspaceId: "test-workspace",
      fetchImplementation: fetch,
    });

    const agent = await client.agents.create({
      id: "example-agent",
      source_type: "EXTERNAL",
    });

    expect(agent.id).toBe("example-agent");
    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toBe("http://localhost:8080/api/v1/agents");
    expect(init?.method).toBe("POST");
    expect(JSON.parse(init?.body as string)).toEqual({
      id: "example-agent",
      source_type: "EXTERNAL",
    });
    const headers = new Headers(init?.headers);
    expect(headers.get("x-api-key")).toBe("test-api-key");
    expect(headers.get("x-tenant-id")).toBe("test-workspace");
  });

  it("follows agent-list cursors while retaining filters", async () => {
    const fetch = jest
      .fn<typeof globalThis.fetch>()
      .mockResolvedValueOnce(
        Response.json({ items: [{ id: "first" }], next_cursor: "next-page" }),
      )
      .mockResolvedValueOnce(
        Response.json({ items: [{ id: "second" }], next_cursor: null }),
      );
    const client = new Client({
      apiUrl: "http://localhost:8080",
      apiKey: "test-api-key",
      fetchImplementation: fetch,
    });
    const ids: string[] = [];
    for await (const agent of client.agents.list({
      source_type: "EXTERNAL",
      page_size: 1,
    })) {
      ids.push(agent.id);
    }
    expect(ids).toEqual(["first", "second"]);
    const url = new URL(fetch.mock.calls[1][0] as string);
    expect(url.searchParams.get("cursor")).toBe("next-page");
    expect(url.searchParams.get("source_type")).toBe("EXTERNAL");
  });
});
