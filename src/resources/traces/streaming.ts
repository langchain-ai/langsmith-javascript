// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as RunsAPI from '../runs/runs';
import * as TracesAPI from './traces';
import { APIPromise } from '../../core/api-promise';
import { iterQueryStream } from '../../core/query-streaming';
import { Stream } from '../../core/streaming';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Streaming extends APIResource {
  /**
   * Returns a paginated list of traces (root runs) for a single tracing project.
   * Each item carries the trace's root run plus optional trace-wide aggregates
   * (`total_tokens`, `total_cost`, `first_token_time`) under `trace_aggregates`, so
   * clients never have to merge by `trace_id`.
   *
   * Traces are scanned within a `start_time` window: `min_start_time` defaults to 24
   * hours before the request, `max_start_time` defaults to the request time. Set
   * either explicitly to widen or narrow the window.
   *
   * Supports filters (`trace_filter`, `tree_filter`), cursor pagination (`cursor`),
   * and field projection (`selects`).
   *
   * When `ai_search` is set, `Accept: text/event-stream` is required; requests
   * without it return 406. AI search is unavailable on deployments that route
   * queries to the v1 backend and returns 501 there.
   *
   * Self-hosted deployments require LangSmith `v0.16` or later.
   *
   * @example
   * ```ts
   * const response = await client.traces.streaming.query();
   * ```
   */
  query(params: StreamingQueryParams, options?: RequestOptions): APIPromise<Stream<Shared.QueryPatchEvent>> {
    const { Accept, ...body } = params;
    return this._client.post('/api/v2/traces/query', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: Accept != null ? Accept : 'text/event-stream' }, options?.headers]),
      stream: true,
    }) as APIPromise<Stream<Shared.QueryPatchEvent>>;
  }

  /**
   * Yields the items of `query` one at a time across pages, following the next page cursor.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const trace of client.traces.streaming.queryItems(
   *   {},
   * )) {
   *   // ...
   * }
   * ```
   */
  queryItems(params: StreamingQueryParams, options?: RequestOptions): AsyncIterable<TracesAPI.Trace> {
    return iterQueryStream<TracesAPI.Trace>(
      (cursor) => this.query(cursor ? { ...params, cursor } : params, options),
      { items: '/items', nextCursor: '/next_cursor' },
    );
  }
}

export interface StreamingQueryResponse {
  /**
   * `items` is the page of traces.
   */
  items?: Array<TracesAPI.Trace>;

  /**
   * `next_cursor` is the opaque cursor for the next page. Null on the final page.
   */
  next_cursor?: string;
}

export interface StreamingQueryParams {
  /**
   * Body param: `ai_search` is a plain-language criterion evaluated against the
   * messages from the agent trajectory scoped to the trace. AND-ed with the ordinary
   * filters. Requires semantic filtering enabled for the deployment. Must contain
   * nonempty text of at most 2000 UTF-8 bytes.
   */
  ai_search?: string;

  /**
   * Body param: `cursor` is the opaque string returned in a previous response's
   * `next_cursor`.
   */
  cursor?: string;

  /**
   * Body param: `max_feedback_modified_at` is the exclusive upper bound (RFC3339) on
   * feedback `modified_at`, applied to the feedback conditions in `trace_filter` or
   * `tree_filter` (for example eq(feedback_key, "correctness")). Requires at least
   * one feedback condition. Root runs must still fall within the `start_time`
   * window.
   */
  max_feedback_modified_at?: string;

  /**
   * Body param: `max_start_time` is the exclusive upper bound for the root-run start
   * time scan (RFC3339). Defaults to the request time when omitted.
   */
  max_start_time?: string;

  /**
   * Body param: `min_feedback_modified_at` is the inclusive lower bound (RFC3339) on
   * feedback `modified_at`, applied to the feedback conditions in `trace_filter` or
   * `tree_filter` (for example eq(feedback_key, "correctness")). Requires at least
   * one feedback condition. Root runs must still fall within the `start_time`
   * window.
   */
  min_feedback_modified_at?: string;

  /**
   * Body param: `min_start_time` is the inclusive lower bound for the root-run start
   * time scan (RFC3339). Defaults to 24 hours before the request when omitted.
   */
  min_start_time?: string;

  /**
   * Body param: `page_size` is the maximum number of traces to return per page.
   * Defaults to 20; must be between 1 and 100 when set.
   */
  page_size?: number;

  /**
   * Body param: `project_id` is the UUID of the tracing project that owns the
   * traces. Required.
   */
  project_id?: string;

  /**
   * Body param: `selects` lists which properties to include on each returned trace.
   * Properties listed here are routed to the appropriate sub-object on each item:
   * `total_tokens`, `total_cost`, and `first_token_time` appear under
   * `trace_aggregates`; everything else appears under `root_run`. If omitted, only
   * `id` is returned on `root_run`.
   */
  selects?: Array<RunsAPI.RunSelectField>;

  /**
   * Body param: `trace_filter` narrows results to traces whose root run matches this
   * LangSmith filter expression. This filter targets root runs only —
   * `is_root = true` is implied. See
   * https://docs.langchain.com/langsmith/trace-query-syntax#filter-query-language
   * for syntax.
   */
  trace_filter?: string;

  /**
   * Body param: `trace_ids` is an optional fast-path restriction to a known set of
   * trace UUIDs. Equivalent in result to including each UUID in a `trace_filter`,
   * but more efficient at scale.
   */
  trace_ids?: Array<string>;

  /**
   * Body param: `tree_filter` narrows results to traces containing at least one run
   * anywhere in the run tree (root or descendant) that matches this LangSmith filter
   * expression.
   */
  tree_filter?: string;

  /**
   * Header param: application/json, or text/event-stream (required when ai_search is
   * set)
   */
  Accept?: string;
}

export declare namespace Streaming {
  export {
    type StreamingQueryResponse as StreamingQueryResponse,
    type StreamingQueryParams as StreamingQueryParams,
  };
}
