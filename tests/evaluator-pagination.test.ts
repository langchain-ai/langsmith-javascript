import Langsmith from 'langsmith';
import type { EvaluatorListParams, EvaluatorListResponse, Rule } from 'langsmith/resources/evaluators';

const ids = [1, 2, 3].map((value) => `00000000-0000-4000-8000-00000000000${value}`);
const tags = [4, 5].map((value) => `00000000-0000-4000-8000-00000000000${value}`);
const project = '00000000-0000-4000-8000-000000000006';
const cursor = 'opaque+/=cursor';

function rule(id: string): Rule {
  return {
    id,
    tenant_id: '00000000-0000-4000-8000-000000000007',
    project_id: project,
    created_at: '2026-01-01T12:00:00Z',
    updated_at: '2026-01-01T12:00:00Z',
    display_name: 'Synthetic rule',
    evaluator_version: 1,
    sampling_rate: 1,
    add_to_dataset_prefer_correction: false,
    extend_only: false,
    include_extended_stats: false,
    is_enabled: true,
    is_managed_evaluator: false,
    is_tracing_disabled: false,
    transient: false,
    use_corrections_dataset: false,
    evaluator_type: 'CODE',
    code_evaluators: [
      {
        code: 'return 1',
        require_attachments: false,
        code_evaluator_input: 'TRAJECTORY',
        advanced_features_enabled: true,
      },
    ],
  };
}

function client(fetch: typeof globalThis.fetch) {
  return new Langsmith({
    apiKey: 'test',
    tenantID: 'test',
    baseURL: 'https://rules.test.invalid',
    maxRetries: 0,
    fetch,
  });
}

test.each(['pages', 'empty', 'failure'])('listV2 handles %s and preserves filters', async (scenario) => {
  const filters = {
    id: [...ids],
    tag_value_id: [...tags],
    project_id: project,
    page_size: 2,
    type: 'PROJECT' as const,
    name_contains: 'Test % _',
    include_backfill_progress: true,
  };
  const originalFilters = structuredClone(filters);
  let requests = 0;
  const sdk = client(async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    requests++;
    expect(init?.method).toBe('GET');
    expect(url.pathname).toBe('/api/v2/runs/rules');
    expect(requests).toBeLessThanOrEqual(scenario === 'empty' ? 1 : 2);
    expect(url.searchParams.getAll('id')).toEqual(ids);
    expect(url.searchParams.getAll('tag_value_id')).toEqual(tags);
    expect(url.searchParams.get('project_id')).toBe(project);
    expect(url.searchParams.get('page_size')).toBe('2');
    expect(url.searchParams.get('type')).toBe('PROJECT');
    expect(url.searchParams.get('name_contains')).toBe(filters.name_contains);
    expect(url.searchParams.get('include_backfill_progress')).toBe('true');
    expect(url.searchParams.get('cursor')).toBe(requests === 1 ? null : cursor);
    const headers = { 'Content-Type': 'application/json' };
    if (scenario === 'empty') {
      return new Response(JSON.stringify({ items: [], next_cursor: null }), { status: 200, headers });
    }
    if (requests === 1) {
      return new Response(JSON.stringify({ items: [rule(ids[0]!), rule(ids[1]!)], next_cursor: cursor }), {
        status: 200,
        headers,
      });
    }
    if (scenario === 'failure') {
      return new Response(JSON.stringify({ detail: 'Please retry later' }), { status: 503, headers });
    }
    return new Response(JSON.stringify({ items: [rule(ids[2]!)], next_cursor: null }), {
      status: 200,
      headers,
    });
  });
  const items: Rule[] = [];
  const consume = async () => {
    for await (const item of sdk.evaluators.listV2(filters)) items.push(item);
  };
  if (scenario === 'failure') {
    await expect(consume()).rejects.toMatchObject({ status: 503 });
  } else {
    await consume();
  }
  expect(items.map((item) => item.id)).toEqual(
    scenario === 'empty' ? []
    : scenario === 'failure' ? ids.slice(0, 2)
    : ids,
  );
  expect(requests).toBe(scenario === 'empty' ? 1 : 2);
  expect(filters).toEqual(originalFilters);
  for (const item of items) {
    expect(item.project_id).toBe(project);
    expect(item.evaluator_type).toBe('CODE');
    expect(item.code_evaluators?.[0]?.code_evaluator_input).toBe('TRAJECTORY');
    expect(item.code_evaluators?.[0]?.advanced_features_enabled).toBe(true);
  }
});

test('list preserves the public V1 types and route', async () => {
  let requests = 0;
  const sdk = client(async (input, init) => {
    const url = new URL(input instanceof Request ? input.url : String(input));
    requests++;
    expect(init?.method).toBe('GET');
    expect(url.pathname).toBe('/api/v1/runs/rules');
    expect(url.searchParams.get('session_id')).toBe(project);
    expect(url.searchParams.getAll('id')).toEqual(ids);
    const { project_id, ...item } = rule(ids[0]!);
    // V1 returns enum values in snake_case.
    const code_evaluators = item.code_evaluators?.map((evaluator) => ({
      ...evaluator,
      code_evaluator_input: 'trajectory',
    }));
    const legacy = {
      ...item,
      code_evaluators,
      evaluator_type: 'code',
      session_id: project_id,
      webhooks: null,
    };
    return new Response(JSON.stringify([legacy]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });
  const params: EvaluatorListParams = { session_id: project, id: [...ids] };
  const response: EvaluatorListResponse = await sdk.evaluators.list(params);
  const publicResponse: Langsmith.EvaluatorListResponse = response;
  expect(Array.isArray(publicResponse)).toBe(true);
  expect(publicResponse[0]?.session_id).toBe(project);
  expect(requests).toBe(1);
});
