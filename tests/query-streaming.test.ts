import Langsmith from 'langsmith';
import { APIError } from 'langsmith/core/error';

const data = (patches: string) => `event: data\ndata: ${patches}\n\n`;
const end = 'event: end\ndata: \n\n';

/** Serves /api/v2/{runs,threads}/query from `pages`, keyed by the request's cursor. */
function sseClient(pages: Record<string, string[]>) {
  const requests: Array<{ body: Record<string, unknown>; accept: string | null }> = [];
  const client = new Langsmith({
    baseURL: 'http://localhost:5000/',
    apiKey: 'My API Key',
    tenantID: 'My Tenant ID',
    maxRetries: 0,
    fetch: async (_url, init = {}) => {
      const body = JSON.parse(init.body as string) as Record<string, unknown>;
      requests.push({ body, accept: new Headers(init.headers).get('accept') });
      const events = pages[(body['cursor'] as string | undefined) ?? ''];
      if (!events) return new Response('no such page', { status: 400 });
      return new Response(events.join(''), { headers: { 'Content-Type': 'text/event-stream' } });
    },
  });
  return { client, requests };
}

const tick = () => new Promise((resolve) => setTimeout(resolve, 20));

/** One page whose events the test pushes by hand, to observe when items are yielded. */
function controlledClient() {
  const encoder = new TextEncoder();
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const body = new ReadableStream<Uint8Array>({ start: (c) => void (controller = c) });
  const client = new Langsmith({
    baseURL: 'http://localhost:5000/',
    apiKey: 'My API Key',
    tenantID: 'My Tenant ID',
    maxRetries: 0,
    fetch: async () => new Response(body, { headers: { 'Content-Type': 'text/event-stream' } }),
  });
  return {
    client,
    push: (chunk: string) => controller.enqueue(encoder.encode(chunk)),
    finish: () => {
      controller.enqueue(encoder.encode(end));
      controller.close();
    },
  };
}

describe('queryItems', () => {
  test('yields items as they arrive and follows the cursor', async () => {
    const { client, requests } = sseClient({
      '': [
        data('[{"op":"add","path":"","value":{"items":[{"id":"run-1","name":"a"}],"next_cursor":null}}]'),
        data(
          '[{"op":"add","path":"/items/-","value":{"id":"run-2","name":"b"}},{"op":"add","path":"/items/0/extra","value":1}]',
        ),
        data(
          '[{"op":"add","path":"/items/-","value":{"id":"run-3","name":"c"}},{"op":"replace","path":"/next_cursor","value":"abc"}]',
        ),
        end,
      ],
      abc: [
        data('[{"op":"add","path":"","value":{"items":[{"id":"run-4","name":"d"}],"next_cursor":null}}]'),
        data('[{"op":"replace","path":"/next_cursor","value":null}]'),
        end,
      ],
    });

    const got: string[] = [];
    for await (const run of client.runs.streaming.queryV2Items({ ai_search: 'question about langchain' })) {
      got.push(`${run.id}:${run.name}`);
    }

    expect(got).toEqual(['run-1:a', 'run-2:b', 'run-3:c', 'run-4:d']);
    expect(requests).toHaveLength(2);
    expect(requests[0]!.accept).toBe('text/event-stream');
    expect(requests[0]!.body['cursor']).toBeUndefined();
    expect(requests[1]!.body).toMatchObject({ cursor: 'abc', ai_search: 'question about langchain' });
  });

  test('yields indexed inserts in their final order and ignores deeper paths', async () => {
    const { client, requests } = sseClient({
      '': [
        data('[{"op":"add","path":"","value":{"items":[],"next_cursor":null}}]'),
        data(
          '[{"op":"add","path":"/items/0","value":{"id":"run-1"}},{"op":"add","path":"/items/0","value":{"id":"run-2"}}]',
        ),
        data(
          '[{"op":"add","path":"/items/1/extra","value":{}},{"op":"replace","path":"/next_cursor","value":""}]',
        ),
        end,
      ],
    });
    const got: string[] = [];
    for await (const run of client.runs.streaming.queryV2Items({})) got.push(run.id!);
    // run-2 was inserted before run-1: nothing is yielded before the page's stream ends.
    expect(got).toEqual(['run-2', 'run-1']);
    expect(requests).toHaveLength(1);
  });

  test('threads-like page: batches inserted at index 0 come out in final order, only at the end of the page', async () => {
    const { client, push, finish } = controlledClient();
    const got: string[] = [];
    const done = (async () => {
      for await (const run of client.runs.streaming.queryV2Items({})) got.push(run.id!);
    })();
    push(data('[{"op":"add","path":"","value":{"items":[],"next_cursor":null}}]'));
    push(data('[{"op":"add","path":"/items/0","value":{"id":"B"}}]'));
    await tick();
    expect(got).toEqual([]);
    push(data('[{"op":"add","path":"/items/0","value":{"id":"A"}}]'));
    await tick();
    expect(got).toEqual([]);
    finish();
    await done;
    expect(got).toEqual(['A', 'B']);
  });

  test('runs-like page: appended items are yielded before the stream completes', async () => {
    const { client, push, finish } = controlledClient();
    const got: string[] = [];
    const done = (async () => {
      for await (const run of client.runs.streaming.queryV2Items({})) got.push(run.id!);
    })();
    push(data('[{"op":"add","path":"","value":{"items":[{"id":"run-1"}],"next_cursor":null}}]'));
    push(data('[{"op":"add","path":"/items/-","value":{"id":"run-2"}}]'));
    await tick();
    expect(got).toEqual(['run-1', 'run-2']);
    push(data('[{"op":"add","path":"/items/-","value":{"id":"run-3"}}]'));
    await tick();
    expect(got).toEqual(['run-1', 'run-2', 'run-3']);
    finish();
    await done;
    expect(got).toEqual(['run-1', 'run-2', 'run-3']);
  });

  test('replace and remove apply to items that were not yielded yet', async () => {
    const { client } = sseClient({
      '': [
        data('[{"op":"add","path":"","value":{"items":[],"next_cursor":null}}]'),
        data(
          '[{"op":"add","path":"/items/0","value":{"id":"a"}},{"op":"add","path":"/items/1","value":{"id":"b"}},{"op":"add","path":"/items/2","value":{"id":"c"}}]',
        ),
        data('[{"op":"replace","path":"/items/1","value":{"id":"b2"}},{"op":"remove","path":"/items/0"}]'),
        end,
      ],
    });
    const got: string[] = [];
    for await (const run of client.runs.streaming.queryV2Items({})) got.push(run.id!);
    expect(got).toEqual(['b2', 'c']);
  });

  test('replace and remove of already yielded items are ignored', async () => {
    const { client } = sseClient({
      '': [
        data('[{"op":"add","path":"","value":{"items":[{"id":"a"},{"id":"b"}],"next_cursor":null}}]'),
        data('[{"op":"replace","path":"/items/0","value":{"id":"x"}},{"op":"remove","path":"/items/1"}]'),
        end,
      ],
    });
    const got: string[] = [];
    for await (const run of client.runs.streaming.queryV2Items({})) got.push(run.id!);
    expect(got).toEqual(['a', 'b']);
  });

  test('buffered pages still follow the cursor, one page at a time', async () => {
    const { client, requests } = sseClient({
      '': [
        data('[{"op":"add","path":"","value":{"items":[],"next_cursor":null}}]'),
        data(
          '[{"op":"add","path":"/items/0","value":{"id":"p1b"}},{"op":"add","path":"/items/0","value":{"id":"p1a"}}]',
        ),
        data('[{"op":"replace","path":"/next_cursor","value":"abc"}]'),
        end,
      ],
      abc: [
        data('[{"op":"add","path":"","value":{"items":[],"next_cursor":null}}]'),
        data(
          '[{"op":"add","path":"/items/0","value":{"id":"p2b"}},{"op":"add","path":"/items/0","value":{"id":"p2a"}}]',
        ),
        end,
      ],
    });
    const got: string[] = [];
    for await (const run of client.runs.streaming.queryV2Items({})) {
      got.push(run.id!);
      if (got.length === 1) expect(requests).toHaveLength(1);
    }
    expect(got).toEqual(['p1a', 'p1b', 'p2a', 'p2b']);
    expect(requests).toHaveLength(2);
  });

  test('yields traces', async () => {
    const { client } = sseClient({
      '': [
        data('[{"op":"add","path":"","value":{"items":[{"root_run":{"id":"run-1"}}],"next_cursor":null}}]'),
        data(
          '[{"op":"add","path":"/items/-","value":{"root_run":{"id":"run-2"}}},{"op":"add","path":"/items/0/trace_aggregates","value":{"total_tokens":3}}]',
        ),
        end,
      ],
    });
    const got: string[] = [];
    for await (const trace of client.traces.streaming.queryItems({})) got.push(trace.root_run!.id!);
    expect(got).toEqual(['run-1', 'run-2']);
  });

  test('stops on an empty page', async () => {
    const { client, requests } = sseClient({
      '': [data('[{"op":"add","path":"","value":{"items":[],"next_cursor":null}}]'), end],
    });
    const got = [];
    for await (const thread of client.threads.streaming.queryItems({})) got.push(thread);
    expect(got).toEqual([]);
    expect(requests).toHaveLength(1);
  });

  test('stops requesting pages when the consumer breaks early', async () => {
    const { client, requests } = sseClient({
      '': [
        data(
          '[{"op":"add","path":"","value":{"items":[{"id":"run-1"},{"id":"run-2"}],"next_cursor":"abc"}}]',
        ),
        end,
      ],
      abc: [data('[{"op":"add","path":"","value":{"items":[{"id":"run-3"}],"next_cursor":null}}]'), end],
    });
    for await (const run of client.runs.streaming.queryV2Items({})) {
      if (run.id === 'run-1') break;
    }
    expect(requests).toHaveLength(1);
  });

  test('rejects on a stream error event after delivering earlier items', async () => {
    const { client } = sseClient({
      '': [
        data('[{"op":"add","path":"","value":{"items":[{"id":"run-1"}],"next_cursor":null}}]'),
        'event: error\ndata: {"detail":"boom"}\n\n',
      ],
    });
    const got: string[] = [];
    await expect(
      (async () => {
        for await (const run of client.runs.streaming.queryV2Items({})) got.push(run.id!);
      })(),
    ).rejects.toBeInstanceOf(APIError);
    expect(got).toEqual(['run-1']);
  });

  test('rejects on an HTTP error', async () => {
    const { client } = sseClient({});
    await expect(
      (async () => {
        for await (const _ of client.runs.streaming.queryV2Items({ cursor: 'missing' })) {
        }
      })(),
    ).rejects.toBeInstanceOf(APIError);
  });
});
