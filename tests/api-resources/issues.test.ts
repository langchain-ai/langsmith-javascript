// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource issues', () => {
  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.issues.retrieve('id');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieve: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.issues.retrieve('id', { include_linear_context: true }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.issues.list();
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
      client.issues.list(
        {
          activity: ['fixing'],
          limit: 0,
          offset: 0,
          session_id: 'session_id',
          session_name: 'session_name',
          severity: 0,
          severity_exact: [0],
          sort_by: 'default',
          status: 'open',
          status_first: true,
          tag: 'tag',
          trace_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          updated_at: 'updated_at',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });
});
