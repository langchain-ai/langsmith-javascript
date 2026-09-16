// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource runs', () => {
  // Mock server tests are disabled
  test.skip('getURL: only required params', async () => {
    const responsePromise = client.runs.getURL('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      project_id: 'project_id',
      trace_id: 'trace_id',
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
  test.skip('getURL: required and optional params', async () => {
    const response = await client.runs.getURL('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      project_id: 'project_id',
      trace_id: 'trace_id',
      start_time: 'start_time',
    });
  });

  // Mock server tests are disabled
  test.skip('queryV2', async () => {
    const responsePromise = client.runs.queryV2({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveV2: only required params', async () => {
    const responsePromise = client.runs.retrieveV2('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      project_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('retrieveV2: required and optional params', async () => {
    const response = await client.runs.retrieveV2('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      project_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      selects: ['ID'],
      start_time: '2019-12-27T18:11:19.117Z',
      Accept: 'Accept',
    });
  });
});
