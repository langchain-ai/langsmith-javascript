// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as RunsAPI from './runs';
import { APIPromise } from '../../core/api-promise';
import { iterQueryStream } from '../../core/query-streaming';
import { Stream } from '../../core/streaming';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Streaming extends APIResource {
  /**
   * Returns a paginated list of runs for the given projects within min/max
   * start_time. Supports filters, cursor pagination, and `selects` to select fields
   * to return.
   *
   * When `ai_search` is set, `Accept: text/event-stream` is required; requests
   * without it return 406. AI search is unavailable on deployments that route
   * queries to the v1 backend and returns 501 there.
   *
   * Self-hosted deployments require LangSmith `v0.16` or later.
   *
   * @example
   * ```ts
   * const response = await client.runs.streaming.queryV2();
   * ```
   */
  queryV2(
    params: StreamingQueryV2Params,
    options?: RequestOptions,
  ): APIPromise<Stream<Shared.QueryPatchEvent>> {
    const { Accept, ...body } = params;
    return this._client.post('/api/v2/runs/query', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: Accept != null ? Accept : 'text/event-stream' }, options?.headers]),
      stream: true,
    }) as APIPromise<Stream<Shared.QueryPatchEvent>>;
  }

  /**
   * Yields the items of `queryV2` one at a time across pages, following the next page cursor.
   *
   * @example
   * ```ts
   * // Automatically fetches more pages as needed.
   * for await (const run of client.runs.streaming.queryV2Items(
   *   {},
   * )) {
   *   // ...
   * }
   * ```
   */
  queryV2Items(params: StreamingQueryV2Params, options?: RequestOptions): AsyncIterable<RunsAPI.Run> {
    return iterQueryStream<RunsAPI.Run>(
      (cursor) => this.queryV2(cursor ? { ...params, cursor } : params, options),
      { items: '/items', nextCursor: '/next_cursor' },
    );
  }
}

export interface StreamingQueryV2Response {
  /**
   * `items` is the page of runs, sorted by `start_time` descending.
   */
  items?: Array<RunsAPI.Run>;

  /**
   * `next_cursor` is the opaque cursor to pass as `cursor` on the next request. Null
   * on the final page.
   */
  next_cursor?: string;
}

export interface StreamingQueryV2Params {
  /**
   * Body param: `ai_search` is a plain-language criterion evaluated against the
   * messages from the agent trajectory scoped to the run. AND-ed with the ordinary
   * filters. Requires semantic filtering enabled for the deployment. Must contain
   * nonempty text of at most 2000 UTF-8 bytes. Not supported on public dataset
   * queries.
   */
  ai_search?: string;

  /**
   * Body param: `cursor` is the opaque string from a previous response's
   * `next_cursor`. Treat it as opaque and pass it back unmodified.
   */
  cursor?: string;

  /**
   * Body param: `filter` narrows results to runs matching this LangSmith filter
   * expression, evaluated against each individual run. For example: and(eq(run_type,
   * "llm"), gt(latency, 5)) or eq(status, "error"). See
   * https://docs.langchain.com/langsmith/trace-query-syntax#filter-query-language
   * for syntax.
   */
  filter?: string;

  /**
   * Body param: `has_error` filters to runs that errored (true) or completed without
   * error (false).
   */
  has_error?: boolean;

  /**
   * Body param: `ids` optionally limits the request to these run UUIDs.
   */
  ids?: Array<string>;

  /**
   * Body param: `include_subtree_usage` enriches selected token and cost fields on
   * root and intermediate runs with subtree totals, and selected `first_token_time`
   * with the earliest observed subtree timestamp. Descendants contribute regardless
   * of this request's filters or time bounds. Runs without observed descendants
   * retain their original values. Defaults to false.
   */
  include_subtree_usage?: boolean;

  /**
   * Body param: `is_root` returns only root runs (true) or only non-root runs
   * (false).
   */
  is_root?: boolean;

  /**
   * Body param: `max_feedback_modified_at` is the exclusive upper bound (RFC3339) on
   * feedback `modified_at`, applied to the feedback conditions in `filter`,
   * `trace_filter`, or `tree_filter` (for example eq(feedback_key, "correctness")).
   * Requires at least one feedback condition. Runs must still fall within the
   * `start_time` window.
   */
  max_feedback_modified_at?: string;

  /**
   * Body param: `max_start_time` is the upper bound for run `start_time` (RFC3339).
   * Defaults to now.
   */
  max_start_time?: string;

  /**
   * Body param: `min_feedback_modified_at` is the inclusive lower bound (RFC3339) on
   * feedback `modified_at`, applied to the feedback conditions in `filter`,
   * `trace_filter`, or `tree_filter` (for example eq(feedback_key, "correctness")).
   * Requires at least one feedback condition. Runs must still fall within the
   * `start_time` window.
   */
  min_feedback_modified_at?: string;

  /**
   * Body param: `min_start_time` is the lower bound for run `start_time` (RFC3339).
   * Defaults to 1 day ago.
   */
  min_start_time?: string;

  /**
   * Body param: `page_size` is the maximum number of runs to return in this
   * response. Defaults to 100 when omitted; must be between 1 and 1000 inclusive
   * when set.
   */
  page_size?: number;

  /**
   * Body param: `project_ids` lists tracing project UUIDs to query. Required unless
   * `reference_dataset_id` is set. Mutually exclusive with `reference_dataset_id` —
   * set exactly one of them.
   */
  project_ids?: Array<string>;

  /**
   * Body param: `reference_dataset_id` resolves session IDs server-side from the
   * dataset. Required unless `project_ids` is set. Mutually exclusive with
   * `project_ids` — set exactly one of them. When provided and `min_start_time` is
   * omitted, the server derives it from the earliest session creation date.
   */
  reference_dataset_id?: string;

  /**
   * Body param: `reference_examples` optionally limits to runs linked to these
   * dataset example UUIDs.
   */
  reference_examples?: Array<string>;

  /**
   * Body param: `run_type`, when set, restricts results to runs whose `run_type`
   * equals this value.
   */
  run_type?: RunsAPI.RunType;

  /**
   * Body param: `selects` lists which properties to include on each returned run. If
   * omitted, only `id` is returned. Properties not listed are omitted from each run
   * object.
   */
  selects?: Array<RunsAPI.RunSelectField>;

  /**
   * Body param: `trace_filter` narrows results to runs whose root trace matches this
   * LangSmith filter expression. Use this to filter by properties of the trace's
   * root run — for example eq(status, "success") to include only traces that
   * completed without error. See
   * https://docs.langchain.com/langsmith/trace-query-syntax#filter-query-language
   * for syntax.
   */
  trace_filter?: string;

  /**
   * Body param: `trace_id` optionally limits results to runs belonging to this trace
   * UUID.
   */
  trace_id?: string;

  /**
   * Body param: `tree_filter` narrows results to runs that belong to a trace
   * containing at least one run matching this LangSmith filter expression anywhere
   * in the run tree (not just the root). Use this to find runs inside traces that
   * involved a specific tool, tag, or model — for example has(tags, "production") or
   * eq(name, "my_tool"). See
   * https://docs.langchain.com/langsmith/trace-query-syntax#filter-query-language
   * for syntax.
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
    type StreamingQueryV2Response as StreamingQueryV2Response,
    type StreamingQueryV2Params as StreamingQueryV2Params,
  };
}
