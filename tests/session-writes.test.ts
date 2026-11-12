import { Langsmith } from '../src/client';
import type { TracerSession } from '../src/resources/sessions';

describe('session writes', () => {
  test.each(['create', 'update'] as const)('%s calls v1 and returns the full session', async (operation) => {
    const resource = {
      id: '019a0000-0000-7000-8000-000000000001',
      tenant_id: '019a0000-0000-7000-8000-000000000002',
      name: 'test-project',
      last_run_start_time: '2026-10-26T00:00:00Z',
      run_count: null,
      total_cost: null,
      trace_tier: 'longlived',
    };
    const fetch = jest.fn(
      async () => new Response(JSON.stringify(resource), { headers: { 'content-type': 'application/json' } }),
    );
    const client = new Langsmith({ apiKey: 'test', baseURL: 'https://example.test', fetch });
    let result: TracerSession;
    if (operation === 'create') {
      result = await client.sessions.create({ name: 'test-project', upsert: true });
    } else {
      result = await client.sessions.update(resource.id, { name: 'test-project' });
    }
    const [url, options] = (fetch.mock.calls as unknown as [string, RequestInit][])[0]!;
    expect(new URL(url).pathname).toBe(
      operation === 'create' ? '/api/v1/sessions' : `/api/v1/sessions/${resource.id}`,
    );
    if (operation === 'create') {
      expect(new URL(url).searchParams.get('upsert')).toBe('true');
    }
    expect(options.method).toBe(operation === 'create' ? 'POST' : 'PATCH');
    expect(JSON.parse(options.body as string)).toEqual({ name: 'test-project' });
    expect(result).toEqual(resource);
    expect(result.last_run_start_time).toBe(resource.last_run_start_time);
    expect(result.run_count).toBeNull();
    expect(result.total_cost).toBeNull();
    expect(result.trace_tier).toBe('longlived');
  });

  describe.each(['LONG_LIVED', 'SHORT_LIVED'] as const)('%s', (traceTier) => {
    test.each(['createV2', 'updateV2'] as const)(
      '%s supports response-to-request reuse',
      async (operation) => {
        const resource = {
          id: '019a0000-0000-7000-8000-000000000001',
          tenant_id: '019a0000-0000-7000-8000-000000000002',
          name: 'test-project',
          type: 'PROJECT',
          trace_tier: traceTier,
        };
        const fetch = jest.fn(
          async () =>
            new Response(JSON.stringify(resource), { headers: { 'content-type': 'application/json' } }),
        );
        const client = new Langsmith({ apiKey: 'test', baseURL: 'https://example.test', fetch });
        const result =
          operation === 'createV2' ?
            await client.sessions.createV2({ type: 'PROJECT', name: resource.name, trace_tier: traceTier })
          : await client.sessions.updateV2(resource.id, { name: resource.name, trace_tier: traceTier });
        expect(result.trace_tier).toBe(traceTier);
        if (result.trace_tier == null) throw new Error('Expected a trace tier');
        await client.sessions.updateV2(result.id, { trace_tier: result.trace_tier });
        const calls = fetch.mock.calls as unknown as [string, RequestInit][];
        const [url, options] = calls[0]!;
        expect(new URL(url).pathname).toBe(
          operation === 'createV2' ? '/api/v2/sessions' : `/api/v2/sessions/${resource.id}`,
        );
        expect(options.method).toBe(operation === 'createV2' ? 'POST' : 'PATCH');
        expect(JSON.parse(options.body as string)).toEqual({
          name: resource.name,
          trace_tier: traceTier,
          ...(operation === 'createV2' ? { type: 'PROJECT' } : {}),
        });
        expect(new URL(calls[1]![0]).pathname).toBe(`/api/v2/sessions/${resource.id}`);
        expect(JSON.parse(calls[1]![1].body as string)).toEqual({ trace_tier: traceTier });
      },
    );
  });

  test.each(['PROJECT', 'AGENT', 'EXPERIMENT'] as const)('creates explicit %s sessions', async (type) => {
    const body = {
      type,
      name: 'typed-session',
      ...(type === 'EXPERIMENT' ? { reference_dataset_id: '019a0000-0000-7000-8000-000000000003' } : {}),
    };
    const fetch = jest.fn(
      async () =>
        new Response(JSON.stringify({ ...body, id: '019a0000-0000-7000-8000-000000000001' }), {
          status: 201,
          headers: { 'content-type': 'application/json' },
        }),
    );
    const client = new Langsmith({ apiKey: 'test', baseURL: 'https://example.test', fetch });
    const result = await client.sessions.createV2(body);
    const [url, options] = (fetch.mock.calls as unknown as [string, RequestInit][])[0]!;
    expect(new URL(url).pathname).toBe('/api/v2/sessions');
    expect(JSON.parse(options.body as string)).toEqual(body);
    expect(result.type).toBe(type);
  });
});
