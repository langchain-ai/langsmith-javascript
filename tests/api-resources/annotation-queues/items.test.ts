// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource items', () => {
  // Mock server tests are disabled
  test.skip('create', async () => {
    const responsePromise = client.annotationQueues.items.create('queue_id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('update: only required params', async () => {
    const responsePromise = client.annotationQueues.items.update('item_id', { queue_id: 'queue_id' });
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
    const response = await client.annotationQueues.items.update('item_id', {
      queue_id: 'queue_id',
      added_at: '2019-12-27T18:11:19.117Z',
      last_reviewed_time: '2019-12-27T18:11:19.117Z',
    });
  });

  // Mock server tests are disabled
  test.skip('list: only required params', async () => {
    const responsePromise = client.annotationQueues.items.list('queue_id', { status: 'needs_my_review' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: required and optional params', async () => {
    const response = await client.annotationQueues.items.list('queue_id', {
      status: 'needs_my_review',
      cursor: 'cursor',
      direction: 'forward',
      item_type: 'RUN',
      max_start_time: '2019-12-27T18:11:19.117Z',
      min_start_time: '2019-12-27T18:11:19.117Z',
      page_size: 0,
    });
  });

  // Mock server tests are disabled
  test.skip('createStatus', async () => {
    const responsePromise = client.annotationQueues.items.createStatus('queue_item_id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('deleteAll', async () => {
    const responsePromise = client.annotationQueues.items.deleteAll('queue_id', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveCount: only required params', async () => {
    const responsePromise = client.annotationQueues.items.retrieveCount('queue_id', { status: 'status' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveCount: required and optional params', async () => {
    const response = await client.annotationQueues.items.retrieveCount('queue_id', {
      status: 'status',
      end_time: 'end_time',
      max_start_time: '2019-12-27T18:11:19.117Z',
      min_start_time: '2019-12-27T18:11:19.117Z',
      start_time: 'start_time',
    });
  });

  // Mock server tests are disabled
  test.skip('retrievePlacement: only required params', async () => {
    const responsePromise = client.annotationQueues.items.retrievePlacement('item_id', {
      queue_id: 'queue_id',
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
  test.skip('retrievePlacement: required and optional params', async () => {
    const response = await client.annotationQueues.items.retrievePlacement('item_id', {
      queue_id: 'queue_id',
    });
  });
});
