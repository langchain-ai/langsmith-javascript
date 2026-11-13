// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class AISearch extends APIResource {
  /**
   * Translates a natural-language search into the scope, filters, semantic criterion
   * and time bounds for the runs, traces or threads query API, without running the
   * search. No resources are created. Send the returned fields to the query API
   * named by scope, with the same projects. When scope is omitted, it is inferred
   * from the search and defaults to traces. A time period in the search sets
   * min_start_time or max_start_time; bounds the search does not mention are omitted
   * so you can keep your own time range. Requires AI search to be enabled for the
   * organization and read access to every project. Returns a single JSON response.
   *
   * @example
   * ```ts
   * const response = await client.aiSearch.parse({
   *   ai_search:
   *     'threads where the agent did not complete the task and spent more than $1',
   *   project_ids: ['018e4c7e-a9fb-7ef0-a5b6-6ea3a82e9327'],
   * });
   * ```
   */
  parse(body: AISearchParseParams, options?: RequestOptions): APIPromise<AISearchParseResponse> {
    return this._client.post('/api/v2/ai-search/parse', { body, ...options });
  }
}

export interface AISearchParseResponse {
  /**
   * Interpretations to choose from. Returned only when allow_clarification is true
   * and the search is ambiguous; no other fields are set.
   */
  clarification?: AISearchParseResponse.Clarification;

  /**
   * Filter expression for the query API's filter parameter. Omitted when there is
   * none.
   */
  filter?: string;

  /**
   * Upper bound on start time (RFC 3339, UTC) for the query API's max_start_time
   * parameter. Omitted when the search names no end; keep your own time range.
   */
  max_start_time?: string;

  /**
   * Lower bound on start time (RFC 3339, UTC) for the query API's min_start_time
   * parameter. Omitted when the search names no start; keep your own time range.
   */
  min_start_time?: string;

  /**
   * Query API to send the plan to: runs, traces or threads.
   */
  scope?: 'runs' | 'traces' | 'threads';

  /**
   * Plain-language criterion for the query API's sem_filter parameter, matched
   * against conversation messages. Null when the search has no conversational
   * criterion.
   */
  sem_filter?: string | null;

  /**
   * Filter expression for the threads query API's thread_filter parameter. Omitted
   * when there is none.
   */
  thread_filter?: string;

  /**
   * Filter expression for the query API's trace_filter parameter. Omitted when there
   * is none.
   */
  trace_filter?: string;

  /**
   * Filter expression for the query API's tree_filter parameter. Omitted when there
   * is none.
   */
  tree_filter?: string;
}

export namespace AISearchParseResponse {
  /**
   * Interpretations to choose from. Returned only when allow_clarification is true
   * and the search is ambiguous; no other fields are set.
   */
  export interface Clarification {
    /**
     * Two or three interpretations of the search.
     */
    options?: Array<Clarification.Option>;
  }

  export namespace Clarification {
    export interface Option {
      /**
       * Filter expression for the query API's filter parameter. Omitted when there is
       * none.
       */
      filter?: string;

      /**
       * Short description of this interpretation to show the user.
       */
      label?: string;

      /**
       * Upper bound on start time (RFC 3339, UTC) for the query API's max_start_time
       * parameter. Omitted when the search names no end; keep your own time range.
       */
      max_start_time?: string;

      /**
       * Lower bound on start time (RFC 3339, UTC) for the query API's min_start_time
       * parameter. Omitted when the search names no start; keep your own time range.
       */
      min_start_time?: string;

      /**
       * Query API this interpretation is planned for.
       */
      scope?: 'runs' | 'traces' | 'threads';

      /**
       * Plain-language criterion for the query API's sem_filter parameter, matched
       * against conversation messages. Null when the search has no conversational
       * criterion.
       */
      sem_filter?: string | null;

      /**
       * Filter expression for the threads query API's thread_filter parameter. Omitted
       * when there is none.
       */
      thread_filter?: string;

      /**
       * Filter expression for the query API's trace_filter parameter. Omitted when there
       * is none.
       */
      trace_filter?: string;

      /**
       * Filter expression for the query API's tree_filter parameter. Omitted when there
       * is none.
       */
      tree_filter?: string;
    }
  }
}

export interface AISearchParseParams {
  /**
   * Natural-language description of the runs, traces or threads to find, at most
   * 2000 UTF-8 bytes.
   */
  ai_search: string;

  /**
   * Tracing project UUIDs used to interpret the search. Send the same projects to
   * the query API.
   */
  project_ids: Array<string>;

  /**
   * When true, an ambiguous search returns clarification options instead of a single
   * plan. Defaults to false.
   */
  allow_clarification?: boolean;

  /**
   * Query API to plan for: runs, traces or threads. When omitted, it is inferred
   * from the search and defaults to traces.
   */
  scope?: 'runs' | 'traces' | 'threads';
}

export declare namespace AISearch {
  export {
    type AISearchParseResponse as AISearchParseResponse,
    type AISearchParseParams as AISearchParseParams,
  };
}
