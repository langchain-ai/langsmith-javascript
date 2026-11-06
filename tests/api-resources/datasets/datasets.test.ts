// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource datasets', () => {
  // Mock server tests are disabled
  test.skip('listV2', async () => {
    const responsePromise = client.datasets.listV2();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('listV2: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.datasets.listV2(
        {
          id: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
          cursor: 'cursor',
          data_type: ['kv'],
          exclude: ['example_count'],
          exclude_corrections_datasets: true,
          metadata: 'metadata',
          name: 'name',
          name_contains: 'name_contains',
          page_size: 1,
          sort_by: 'name',
          sort_order: 'asc',
          tag_value_id: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });
});
