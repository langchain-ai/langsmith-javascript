// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource examples', () => {
  // Mock server tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.datasets.examples.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      dataset_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
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
    const response = await client.datasets.examples.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      dataset_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });

  // Mock server tests are disabled
  test.skip('updateMetadata: only required params', async () => {
    const responsePromise = client.datasets.examples.updateMetadata('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      example_ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
      operations: [{ key: 'key', operation: 'SET' }],
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('updateMetadata: required and optional params', async () => {
    const response = await client.datasets.examples.updateMetadata('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      example_ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
      operations: [
        {
          key: 'key',
          operation: 'SET',
          value: {},
          values: ['string'],
        },
      ],
    });
  });
});
