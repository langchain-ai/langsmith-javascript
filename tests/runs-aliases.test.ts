import { Langsmith } from '../src/client';

describe('run aliases', () => {
  test.each(['retrieve', 'query'] as const)('%s calls the V2 endpoint', async (method) => {
    const fetch = jest.fn(
      async () =>
        new Response(JSON.stringify(method === 'retrieve' ? { id: 'run' } : { runs: [{ id: 'run' }] }), {
          headers: { 'content-type': 'application/json' },
        }),
    );
    const client = new Langsmith({ apiKey: 'test', baseURL: 'https://example.test', fetch });
    const result =
      method === 'retrieve' ? client.runs.retrieve('run', { project_id: 'project' }) : client.runs.query({});
    const { response } = await result.withResponse();
    expect(response.status).toBe(200);
    const [url, options] = (fetch.mock.calls as unknown as [string, RequestInit][])[0]!;
    expect(new URL(url).pathname).toBe(method === 'retrieve' ? '/api/v2/runs/run' : '/api/v2/runs/query');
    expect(options.method).toBe(method === 'retrieve' ? 'GET' : 'POST');
  });
});
