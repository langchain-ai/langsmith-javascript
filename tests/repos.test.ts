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

describe('Prompt Hub repos', () => {
  test('directories.list reads a directory at a commit', async () => {
    const { client, calls } = clientReturning({
      commit_hash: 'abc123',
      commit_id: '0190f5e0-0000-7000-8000-000000000001',
      files: {
        'AGENTS.md': { type: 'file', content: '# Agent' },
        'skills/search': { type: 'skill', owner: '-', repo_handle: 'search', commit_hash: 'def456' },
      },
    });

    const listing = await client.repos.directories.list('my-agent', { owner: '-', commit: 'abc123' });

    const [url, options] = calls()[0]!;
    expect(options.method).toBe('GET');
    expect(new URL(url).pathname).toBe('/api/v1/platform/hub/repos/-/my-agent/directories');
    expect(new URL(url).searchParams.get('commit')).toBe('abc123');
    expect(listing.commit_hash).toBe('abc123');
    expect(listing.files['AGENTS.md']).toEqual({ type: 'file', content: '# Agent' });
  });

  test('directories.commit posts the changed paths', async () => {
    const { client, calls } = clientReturning({ commit: { commit_hash: 'fed321' } });
    const files = { 'AGENTS.md': { type: 'file' as const, content: '# Agent v2' }, 'old.md': null };

    const result = await client.repos.directories.commit('my-agent', {
      owner: '-',
      files,
      parent_commit: 'abc123',
    });

    const [url, options] = calls()[0]!;
    expect(options.method).toBe('POST');
    expect(new URL(url).pathname).toBe('/api/v1/platform/hub/repos/-/my-agent/directories/commits');
    expect(JSON.parse(options.body as string)).toEqual({ files, parent_commit: 'abc123' });
    expect(result.commit?.commit_hash).toBe('fed321');
  });

  test('list pages through repos by offset', async () => {
    const { client, calls } = clientReturning(
      { repos: [{ repo_handle: 'first' }, { repo_handle: 'second' }], total: 3 },
      { repos: [{ repo_handle: 'third' }], total: 3 },
      { repos: [], total: 3 },
    );

    const handles: string[] = [];
    for await (const repo of client.repos.list()) {
      handles.push(repo.repo_handle);
    }

    expect(handles).toEqual(['first', 'second', 'third']);
    expect(calls().map(([url]) => new URL(url).searchParams.get('offset'))).toEqual([null, '2', '3']);
  });
});
