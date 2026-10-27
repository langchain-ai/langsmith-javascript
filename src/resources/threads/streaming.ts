// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as Shared from '../shared';
import * as ThreadsAPI from './threads';
import { APIPromise } from '../../core/api-promise';
import { iterQueryStream } from '../../core/query-streaming';
import { Stream } from '../../core/streaming';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

export class Streaming extends APIResource {
  /**
   * GET with body payload — no resources created. Returns the threads in a tracing
   * project matching the query passed as the request payload. Results are filtered
   * by the given time range and optional filters, with cursor-based pagination.
   *
   * When `ai_search` is set, `Accept: text/event-stream` is required; requests
   * without it return 406. AI search is unavailable on deployments that route
   * queries to the v1 backend and returns 501 there.
   *
   * Self-hosted deployments require LangSmith `v0.16` or later.
   *
   * @example
   * ```ts
   * const response = await client.threads.streaming.query();
   * ```
   */
  query(params: StreamingQueryParams, options?: RequestOptions): APIPromise<Stream<Shared.QueryPatchEvent>> {
    const { Accept, ...body } = params;
    return this._client.post('/api/v2/threads/query', {
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
   * for await (const thread of client.threads.streaming.queryItems(
   *   {},
   * )) {
   *   // ...
   * }
   * ```
   */
  queryItems(params: StreamingQueryParams, options?: RequestOptions): AsyncIterable<ThreadsAPI.Thread> {
    return iterQueryStream<ThreadsAPI.Thread>(
      (cursor) => this.query(cursor ? { ...params, cursor } : params, options),
      { items: '/items', nextCursor: '/next_cursor' },
    );
  }
}

export interface StreamingQueryResponse {
  /**
   * `items` is the page of thread summaries, sorted by the thread's most recent
   * activity.
   */
  items?: Array<ThreadsAPI.Thread>;

  /**
   * `next_cursor` is the opaque cursor to pass as `cursor` on the next request. Null
   * on the final page.
   */
  next_cursor?: string;
}

export interface StreamingQueryParams {
  /**
   * Body param: `ai_search` is a plain-language criterion evaluated against the
   * messages from the agent trajectory scoped to the thread. AND-ed with the
   * ordinary filters. Requires semantic filtering enabled for the deployment. Must
   * contain nonempty text of at most 2000 UTF-8 bytes.
   */
  ai_search?: string;

  /**
   * Body param: `cursor` is the opaque string from a previous response's
   * `next_cursor`. Omit on the first request; pass the returned cursor to fetch the
   * next page.
   */
  cursor?: string;

  /**
   * Body param: `filter` narrows which threads are returned, using a LangSmith
   * filter expression evaluated against each thread's root run. For example:
   * has(tags, "production") or eq(status, "error"). See
   * https://docs.langchain.com/langsmith/trace-query-syntax#filter-query-language
   * for syntax.
   */
  filter?: string;

  /**
   * Body param: `max_start_time` is the exclusive upper bound on thread activity
   * (RFC3339 date-time). Defaults to now (UTC) when omitted.
   */
  max_start_time?: string;

  /**
   * Body param: `min_start_time` is the inclusive lower bound on thread activity
   * (RFC3339 date-time). Defaults to 1 day before now (UTC) when omitted.
   */
  min_start_time?: string;

  /**
   * Body param: `page_size` is the maximum number of threads to return in this
   * response. Defaults to 20 when omitted; must be between 1 and 100 inclusive when
   * set. The response may contain fewer threads than `page_size` even when
   * `next_cursor` is non-null.
   */
  page_size?: number;

  /**
   * Body param: `project_id` is the tracing project UUID.
   */
  project_id?: string;

  /**
   * Body param: `thread_filter` narrows results using a LangSmith filter expression
   * evaluated against each complete thread summary. Self-hosted deployments require
   * LangSmith v0.17 or later; unsupported deployments return 501. See
   * https://docs.langchain.com/langsmith/trace-query-syntax#filter-query-language
   * for syntax.
   */
  thread_filter?: string;

  /**
   * Body param: `trace_filter` narrows results to threads containing at least one
   * trace whose root run matches this LangSmith filter expression. Trace-level
   * aggregate fields are evaluated using the complete trace summary. Self-hosted
   * deployments require LangSmith v0.17 or later; unsupported deployments
   * return 501. See
   * https://docs.langchain.com/langsmith/trace-query-syntax#filter-query-language
   * for syntax.
   */
  trace_filter?: string;

  /**
   * Body param: `tree_filter` narrows results to threads containing at least one
   * trace with a matching run anywhere in its run tree. Self-hosted deployments
   * require LangSmith v0.17 or later; unsupported deployments return 501. See
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
    type StreamingQueryResponse as StreamingQueryResponse,
    type StreamingQueryParams as StreamingQueryParams,
  };
}
