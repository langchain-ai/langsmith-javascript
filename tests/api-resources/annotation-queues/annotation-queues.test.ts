// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource annotationQueues', () => {
  // Mock server tests are disabled
  test.skip('retrieve', async () => {
    const responsePromise = client.annotationQueues.retrieve('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('update', async () => {
    const responsePromise = client.annotationQueues.update('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('delete', async () => {
    const responsePromise = client.annotationQueues.delete('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('annotationQueues: only required params', async () => {
    const responsePromise = client.annotationQueues.annotationQueues({ name: 'name' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('annotationQueues: required and optional params', async () => {
    const response = await client.annotationQueues.annotationQueues({
      name: 'name',
      id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      created_at: '2019-12-27T18:11:19.117Z',
      default_dataset: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      description: 'description',
      enable_reservations: true,
      metadata: { foo: 'bar' },
      num_reviewers_per_item: 0,
      reservation_minutes: 0,
      reviewer_access_mode: 'reviewer_access_mode',
      rubric_instructions: 'rubric_instructions',
      rubric_items: [
        {
          feedback_key: 'feedback_key',
          description: 'description',
          is_assertion: true,
          is_required: true,
          regex_validator: 'string',
          score_descriptions: { foo: 'string' },
          value_descriptions: { foo: 'string' },
        },
      ],
      session_ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
      updated_at: '2019-12-27T18:11:19.117Z',
    });
  });

  // Mock server tests are disabled
  test.skip('createRunStatus', async () => {
    const responsePromise = client.annotationQueues.createRunStatus(
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
  test.skip('export', async () => {
    const responsePromise = client.annotationQueues.export('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('populate: only required params', async () => {
    const responsePromise = client.annotationQueues.populate({
      queue_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      session_ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
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
  test.skip('populate: required and optional params', async () => {
    const response = await client.annotationQueues.populate({
      queue_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      session_ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
      extend_trace_retention: true,
    });
  });

  // Mock server tests are disabled
  test.skip('retrieveAnnotationQueues', async () => {
    const responsePromise = client.annotationQueues.retrieveAnnotationQueues();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveAnnotationQueues: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.annotationQueues.retrieveAnnotationQueues(
        {
          assigned_to_me: true,
          dataset_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          ids: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
          limit: 1,
          name: 'name',
          name_contains: 'name_contains',
          offset: 0,
          queue_type: 'single',
          sort_by: 'sort_by',
          sort_by_desc: true,
          tag_value_id: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('retrieveQueues', async () => {
    const responsePromise = client.annotationQueues.retrieveQueues('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveRun: only required params', async () => {
    const responsePromise = client.annotationQueues.retrieveRun(0, {
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
  test.skip('retrieveRun: required and optional params', async () => {
    const response = await client.annotationQueues.retrieveRun(0, {
      queue_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      include_extra: true,
    });
  });

  // Mock server tests are disabled
  test.skip('retrieveSize', async () => {
    const responsePromise = client.annotationQueues.retrieveSize('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('retrieveSize: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.annotationQueues.retrieveSize(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { status: 'needs_my_review' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('retrieveTotalArchived', async () => {
    const responsePromise = client.annotationQueues.retrieveTotalArchived(
      '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
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
  test.skip('retrieveTotalArchived: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.annotationQueues.retrieveTotalArchived(
        '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
        { end_time: '2019-12-27T18:11:19.117Z', start_time: '2019-12-27T18:11:19.117Z' },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('retrieveTotalSize', async () => {
    const responsePromise = client.annotationQueues.retrieveTotalSize('182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
