import { Langsmith } from '../src/client';

test('sessions.dashboard reads a dashboard using a POST body', async () => {
  const sessionID = '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e';
  const payload = { start_time: '2026-10-01T00:00:00Z', omit_data: true };
  const dashboard = { id: sessionID, session_id: sessionID, title: 'Project', charts: [], sub_sections: [] };
  const fetch = jest.fn(
    async () =>
      new Response(JSON.stringify(dashboard), {
        headers: { 'content-type': 'application/json' },
      }),
  );
  const client = new Langsmith({ apiKey: 'test', baseURL: 'https://example.test', fetch });

  const { data, response } = await client.sessions.dashboard(sessionID, payload).withResponse();

  expect(response.status).toBe(200);
  expect(data).toEqual(dashboard);
  const [url, options] = (fetch.mock.calls as unknown as [string, RequestInit][])[0]!;
  expect(new URL(url).pathname).toBe(`/api/v1/sessions/${sessionID}/dashboard`);
  expect(options.method).toBe('POST');
  expect(JSON.parse(options.body as string)).toEqual(payload);
});
