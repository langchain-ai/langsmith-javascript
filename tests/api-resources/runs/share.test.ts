// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource share', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.runs.share.create('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      session_id: '018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327',
      trace_id: '018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327',
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
  test.skip('create: required and optional params', async () => {
    const response = await client.runs.share.create('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      session_id: '018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327',
      trace_id: '018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327',
    });
  });

  // Mock server tests are disabled
  test.skip('delete: only required params', async () => {
    const responsePromise = client.runs.share.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      session_id: '018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327',
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
    const response = await client.runs.share.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      session_id: '018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327',
    });
  });
});
