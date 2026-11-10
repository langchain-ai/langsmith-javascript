// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource repos', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.repos.create({ is_public: true, repo_handle: 'repo_handle' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('create: required and optional params', async () => {
    const response = await client.repos.create({
      is_public: true,
      repo_handle: 'repo_handle',
      description: 'description',
      readme: 'readme',
      repo_type: 'prompt',
      restricted_mode: true,
      source: 'internal',
      tag_value_ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
      tags: ['string'],
    });
  });

  // Mock server tests are disabled
  test.skip('retrieve: only required params', async () => {
    const responsePromise = client.repos.retrieve('repo', { owner: 'owner' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieve: required and optional params', async () => {
    const response = await client.repos.retrieve('repo', { owner: 'owner' });
  });

  // Mock server tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.repos.update('repo', { owner: 'owner' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('update: required and optional params', async () => {
    const response = await client.repos.update('repo', {
      owner: 'owner',
      description: 'description',
      is_archived: true,
      is_public: true,
      readme: 'readme',
      restricted_mode: true,
      tags: ['string'],
    });
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.repos.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.repos.list(
        {
          has_commits: true,
          include_owners: true,
          is_archived: 'true',
          is_public: 'true',
          limit: 1,
          offset: 0,
          query: 'query',
          single_repo_type: 'prompt',
          repo_types: ['prompt', 'file'],
          sort_direction: 'asc',
          sort_field: 'num_likes',
          source: 'internal',
          tag_value_id: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
          tags: ['string', 'string'],
          tenant_handle: 'tenant_handle',
          tenant_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          upstream_repo_handle: 'upstream_repo_handle',
          upstream_repo_owner: 'upstream_repo_owner',
          with_latest_manifest: true,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.repos.delete('repo', { owner: 'owner' });
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
    const response = await client.repos.delete('repo', { owner: 'owner' });
  });
});
