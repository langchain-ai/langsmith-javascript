import { jest } from "@jest/globals";
import { RunTree } from "../run_trees.js";
import { getRunStatusFromError } from "../utils/error.js";

function makeTree() {
  const updateRun = jest.fn<(...args: unknown[]) => Promise<void>>();
  const createRun = jest.fn<(...args: unknown[]) => Promise<void>>();
  const client = { updateRun, createRun } as never;
  const tree = new RunTree({ name: "r", client, tracingEnabled: true });
  return { tree, updateRun };
}

test("end(status) is forwarded by patchRun", async () => {
  const { tree, updateRun } = makeTree();
  await tree.end(undefined, "Cancelled", undefined, undefined, "cancelled");
  await tree.patchRun();
  const payload = updateRun.mock.calls[0][1] as Record<string, unknown>;
  expect(payload.status).toBe("cancelled");
  expect(payload.error).toBe("Cancelled");
});

test("status is omitted by default", async () => {
  const { tree, updateRun } = makeTree();
  await tree.end(undefined, "boom");
  await tree.patchRun();
  const payload = updateRun.mock.calls[0][1] as Record<string, unknown>;
  expect(payload.status).toBeUndefined();
});

test("a cancel after a real error does not relabel it", async () => {
  const { tree, updateRun } = makeTree();
  await tree.end(undefined, "real error");
  await tree.end(undefined, "Cancelled", undefined, undefined, "cancelled");
  await tree.patchRun();
  const payload = updateRun.mock.calls[0][1] as Record<string, unknown>;
  expect(payload.error).toBe("real error");
  expect(payload.status).toBeUndefined();
});

test("getRunStatusFromError only honors marked errors", () => {
  expect(getRunStatusFromError(new Error("x"))).toBeUndefined();
  const marked = Object.assign(new Error("x"), { ls_run_status: "cancelled" });
  expect(getRunStatusFromError(marked)).toBe("cancelled");
  const bogus = Object.assign(new Error("x"), { ls_run_status: "success" });
  expect(getRunStatusFromError(bogus)).toBeUndefined();
});

describe("ls_run_status marker on the error", () => {
  // Mirrors a library tagging its interrupt class with the marker.
  class Interrupt extends Error {
    static ls_run_status = "interrupted";
    get ls_run_status() {
      return (this.constructor as typeof Interrupt).ls_run_status;
    }
  }
  // Named like LangGraph's but without the marker: not recognized by name.
  class GraphInterrupt extends Error {}

  test("a class-level marker is interrupted", () => {
    expect(getRunStatusFromError(new Interrupt("x"))).toBe("interrupted");
  });

  test("an own-property marker is honored", () => {
    const err = Object.assign(new Error("x"), { ls_run_status: "interrupted" });
    expect(getRunStatusFromError(err)).toBe("interrupted");
  });

  test("a GraphInterrupt-named class without the marker has no status", () => {
    expect(getRunStatusFromError(new GraphInterrupt("x"))).toBeUndefined();
    const named = Object.assign(new Error("x"), { name: "GraphInterrupt" });
    expect(getRunStatusFromError(named)).toBeUndefined();
  });

  test("an unknown marker value is ignored", () => {
    const err = Object.assign(new Error("x"), { ls_run_status: "other" });
    expect(getRunStatusFromError(err)).toBeUndefined();
  });
});
