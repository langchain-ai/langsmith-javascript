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
  });
});
