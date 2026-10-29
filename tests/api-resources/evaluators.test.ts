// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Langsmith from 'langsmith';

const client = new Langsmith({
  apiKey: 'My API Key',
  tenantID: 'My Tenant ID',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource evaluators', () => {
  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.evaluators.list();
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
      client.evaluators.list(
        {
          id: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
          dataset_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          evaluator_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          include_backfill_progress: true,
          name_contains: 'name_contains',
          session_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
          tag_value_id: ['182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e', '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e'],
          type: 'session',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Langsmith.NotFoundError);
  });

  // Mock server tests are disabled
  test.skip('createDecisionModel: only required params', async () => {
    const responsePromise = client.evaluators.createDecisionModel({
      display_name: 'display_name',
      prompt: [[{}, {}]],
      questions: { foo: { instructions: 'instructions', type: 'noul' } },
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
  test.skip('createDecisionModel: required and optional params', async () => {
    const response = await client.evaluators.createDecisionModel({
      display_name: 'display_name',
      prompt: [[{}, {}]],
      questions: {
        foo: {
          instructions: 'instructions',
          type: 'noul',
          levels: ['string'],
          no: 'no',
          options: ['string'],
          yes: 'yes',
        },
      },
      base_url: 'base_url',
      dataset_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      filter: 'filter',
      max_retries: 0,
      model: 'model',
      model_headers: { foo: 'string' },
      playground_settings_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      provider: 'typesafe',
      sampling_rate: 0,
      session_id: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
      template_format: 'mustache',
      timeout_seconds: 0,
      variable_mapping: { foo: 'string' },
    });
  });
});
