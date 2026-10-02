// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource runs', () => {
  // Mock server tests are disabled
  test.skip('retrieve: only required params', async () => {
    const responsePromise = client.public.runs.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      share_token: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      selects: ['string'],
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
  test.skip('retrieve: required and optional params', async () => {
    const response = await client.public.runs.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      share_token: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      selects: ['string'],
      start_time: '2019-12-27T18:11:19.117Z',
      Accept: 'Accept',
    });
  });

  // Mock server tests are disabled
  test.skip('query', async () => {
    const responsePromise = client.public.runs.query('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
