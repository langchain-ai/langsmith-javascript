// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource threads', () => {
  // Mock server tests are disabled
  test.skip('aggregateStats: only required params', async () => {
    const responsePromise = client.threads.aggregateStats({
      project_id: '0190a1b2-c3d4-7ef0-a5b6-6ea3a82e9328',
      select: ['THREAD_COUNT', 'TRACE_COUNT', 'TOTAL_TOKENS', 'TOTAL_COST'],
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
  test.skip('aggregateStats: required and optional params', async () => {
    const response = await client.threads.aggregateStats({
      project_id: '0190a1b2-c3d4-7ef0-a5b6-6ea3a82e9328',
      select: ['THREAD_COUNT', 'TRACE_COUNT', 'TOTAL_TOKENS', 'TOTAL_COST'],
      filter: 'eq(status, "error")',
      max_start_time: '2019-12-27T18:11:19.117Z',
      min_start_time: '2019-12-27T18:11:19.117Z',
      thread_filter: 'gte(turn_count, 3)',
      trace_filter: 'eq(status, "error")',
      tree_filter: 'has(tags, "production")',
    });
  });

  // Mock server tests are disabled
  test.skip('listTraces: only required params', async () => {
    const responsePromise = client.threads.listTraces('thread_id', {
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
  test.skip('listTraces: required and optional params', async () => {
    const response = await client.threads.listTraces('thread_id', {
      project_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      cursor: 'cursor',
      filter: 'filter',
      page_size: 1,
      selects: ['THREAD_ID'],
    });
  });

  // Mock server tests are disabled
  test.skip('query', async () => {
    const responsePromise = client.threads.query({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('stats: only required params', async () => {
    const responsePromise = client.threads.stats('thread_id', {
      selects: ['TURNS'],
      session_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('stats: required and optional params', async () => {
    const response = await client.threads.stats('thread_id', {
      selects: ['TURNS'],
      session_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      filter: 'filter',
    });
  });
});
