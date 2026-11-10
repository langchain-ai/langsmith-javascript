// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource directories', () => {
  // Mock server tests are disabled
  test.skip('list: only required params', async () => {
    const responsePromise = client.repos.directories.list('repo', { owner: 'owner' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: required and optional params', async () => {
    const response = await client.repos.directories.list('repo', { owner: 'owner', commit: 'commit' });
  });

  // Mock server tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.repos.directories.delete('repo', { owner: 'owner' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('delete: required and optional params', async () => {
    const response = await client.repos.directories.delete('repo', { owner: 'owner', repo_type: 'agent' });
  });

  // Mock server tests are disabled
  test.skip('commit: only required params', async () => {
    const responsePromise = client.repos.directories.commit('repo', { owner: 'owner' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('commit: required and optional params', async () => {
    const response = await client.repos.directories.commit('repo', {
      owner: 'owner',
      files: {
        'agents/pinned': {
          repo_handle: 'review-agent',
          type: 'agent',
          commit_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          selector: { commit_id: '0198f3ab-7c2d-7def-8a91-23456789abcd', type: 'COMMIT' },
        },
        'skills/current': {
          repo_handle: 'shared-skill',
          type: 'skill',
          commit_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          selector: { type: 'LATEST' },
        },
      },
      parent_commit: 'parent_commit',
      skip_webhooks: true,
    });
  });
});
