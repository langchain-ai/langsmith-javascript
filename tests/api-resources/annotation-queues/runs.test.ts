// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource runs', () => {
  // Mock server tests are disabled
  test.skip('create: only required params', async () => {
    const responsePromise = client.annotationQueues.runs.create('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      body: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
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
    const response = await client.annotationQueues.runs.create('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      body: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
      extend_trace_retention: true,
    });
  });

  // Mock server tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.annotationQueues.runs.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      queue_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('update: required and optional params', async () => {
    const response = await client.annotationQueues.runs.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      queue_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      added_at: '2019-12-27T18:11:19.117Z',
      last_reviewed_time: '2019-12-27T18:11:19.117Z',
    });
  });

  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.annotationQueues.runs.list('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
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
      client.annotationQueues.runs.list(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        {
          archived: true,
          include_stats: true,
          limit: 1,
          offset: 0,
          status: 'needs_my_review',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('createByKey: only required params', async () => {
    const responsePromise = client.annotationQueues.runs.createByKey('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      body: [
        {
          run_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          session_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          start_time: '2019-12-27T18:11:19.117Z',
        },
      ],
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
  test.skip('createByKey: required and optional params', async () => {
    const response = await client.annotationQueues.runs.createByKey('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      body: [
        {
          run_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          session_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          start_time: '2019-12-27T18:11:19.117Z',
          source_proposed_example_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        },
      ],
      extend_trace_retention: true,
    });
  });

  // Mock server tests are disabled
  test.skip('deleteAll', async () => {
    const responsePromise = client.annotationQueues.runs.deleteAll(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      {},
    );
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('deleteQueue: only required params', async () => {
    const responsePromise = client.annotationQueues.runs.deleteQueue('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      queue_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('deleteQueue: required and optional params', async () => {
    const response = await client.annotationQueues.runs.deleteQueue('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {
      queue_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
    });
  });
});
