import { Langsmith } from '../src/client';

type Call = [string, RequestInit];

function clientReturning(...bodies: unknown[]) {
  const fetch = jest.fn(
    async () =>
      new Response(JSON.stringify(bodies.length > 1 ? bodies.shift() : bodies[0]), {
        headers: { 'content-type': 'application/json' },
      }),
  );
  const client = new Langsmith({ apiKey: 'test', baseURL: 'https://example.test', fetch });
  return { client, calls: () => fetch.mock.calls as unknown as Call[] };
}

describe('Prompt Hub commits', () => {
  test('create posts the manifest', async () => {
    const { client, calls } = clientReturning({ commit: { commit_hash: 'fed32100' } });
    const manifest = { lc: 1, type: 'constructor', id: ['langchain', 'prompts', 'PromptTemplate'] };

    const result = await client.commits.create('my-prompt', {
      owner: '-',
      manifest,
      parent_commit: 'abc12345',
    });

    const [url, options] = calls()[0]!;
    expect(options.method).toBe('POST');
    expect(new URL(url).pathname).toBe('/api/v1/commits/-/my-prompt');
    expect(JSON.parse(options.body as string)).toEqual({ manifest, parent_commit: 'abc12345' });
    expect(result.commit?.commit_hash).toBe('fed32100');
  });

  test('retrieve reads a commit', async () => {
    const { client, calls } = clientReturning({ commit_hash: 'fed32100', manifest: { lc: 1 } });

    const commit = await client.commits.retrieve('latest', {
      owner: '-',
      repo: 'my-prompt',
      include_model: true,
    });

    const [url, options] = calls()[0]!;
    expect(options.method).toBe('GET');
    expect(new URL(url).pathname).toBe('/api/v1/commits/-/my-prompt/latest');
    expect(new URL(url).searchParams.get('include_model')).toBe('true');
    expect(commit.commit_hash).toBe('fed32100');
  });

  test('list pages through commits by offset', async () => {
    const { client, calls } = clientReturning(
      { commits: [{ commit_hash: 'c3' }, { commit_hash: 'c2' }], total: 3 },
      { commits: [{ commit_hash: 'c1' }], total: 3 },
      { commits: [], total: 3 },
    );

    const hashes: Array<string | undefined> = [];
    for await (const commit of client.commits.list('my-prompt', { owner: '-' })) {
      hashes.push(commit.commit_hash);
    }

    expect(hashes).toEqual(['c3', 'c2', 'c1']);
    expect(calls().map(([url]) => new URL(url).searchParams.get('offset'))).toEqual([null, '2', '3']);
  });
});
