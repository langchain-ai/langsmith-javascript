// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource sandboxes', () => {
  // Mock server tests are disabled
  test.skip('listUsageCosts: only required params', async () => {
    const responsePromise = client.sandboxes.listUsageCosts({
      end_time: '2019-12-27T18:11:19.117Z',
      start_time: '2019-12-27T18:11:19.117Z',
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
  test.skip('listUsageCosts: required and optional params', async () => {
    const response = await client.sandboxes.listUsageCosts({
      end_time: '2019-12-27T18:11:19.117Z',
      start_time: '2019-12-27T18:11:19.117Z',
      cursor: 'cursor',
      page_size: 1,
      resource_ids: ['string'],
      resource_type: 'SANDBOX',
    });
  });
});
