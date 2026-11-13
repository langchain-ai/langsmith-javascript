// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource aiSearch', () => {
  // Mock server tests are disabled
  test.skip('parse: only required params', async () => {
    const responsePromise = client.aiSearch.parse({
      ai_search: 'threads where the agent did not complete the task and spent more than $1',
      project_ids: ['018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327'],
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
  test.skip('parse: required and optional params', async () => {
    const response = await client.aiSearch.parse({
      ai_search: 'threads where the agent did not complete the task and spent more than $1',
      project_ids: ['018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327'],
      allow_clarification: true,
      scope: 'runs',
    });
  });
});
