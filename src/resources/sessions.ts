// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import {
  ItemsCursorGetPagination,
  type ItemsCursorGetPaginationParams,
  PagePromise,
} from '../core/pagination';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class Sessions extends APIResource {
  /**
   * Create a new project.
   */
  create(params: SessionCreateParams, options?: RequestOptions): APIPromise<TracerSession> {
    const { upsert, ...body } = params;
    return this._client.post('/api/v1/sessions', { query: { upsert }, body, ...options });
  }

  /**
   * Get a specific project.
   */
  retrieve(
    project_id: string,
    params: SessionRetrieveParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<TracerSession> {
    const { accept, ...query } = params ?? {};
    return this._client.get(path`/api/v1/sessions/${project_id}`, {
      query,
      ...options,
      headers: buildHeaders([{ ...(accept != null ? { accept: accept } : undefined) }, options?.headers]),
    });
  }

  /**
   * Update a project.
   */
  update(project_id: string, body: SessionUpdateParams, options?: RequestOptions): APIPromise<TracerSession> {
    return this._client.patch(path`/api/v1/sessions/${project_id}`, { body, ...options });
  }

  /**
   * Delete a specific project.
   *
   * Returns 202 when deletion is accepted. Cleanup runs asynchronously. Location
   * identifies the affected project, not a cleanup-status endpoint. For a caller
   * with read access, GET at that URL returns 200 with the project while it is still
   * available, or 404 after the project is removed. A 404 does not confirm that
   * background trace cleanup has finished. Polling for cleanup completion is not
   * supported.
   */
  delete(project_id: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/sessions/${project_id}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * GET with body payload — no resources created. Returns the prebuilt dashboard for
   * the tracing project matching the query passed as the request payload.
   */
  dashboard(
    sessionID: string,
    params: SessionDashboardParams,
    options?: RequestOptions,
  ): APIPromise<CustomChartsSection> {
    const { accept, ...body } = params;
    return this._client.post(path`/api/v1/sessions/${sessionID}/dashboard`, {
      body,
      ...options,
      headers: buildHeaders([{ ...(accept != null ? { accept: accept } : undefined) }, options?.headers]),
    });
  }

  /**
   * Returns a page of the workspace's tracing projects and experiments. Pass the
   * response's next_cursor as cursor to fetch the next page; next_cursor is null on
   * the last page. A cursor is valid only with the same query parameters as the
   * request that returned it.
   */
  listV2(
    query: SessionListV2Params | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<SessionsItemsCursorGetPagination, Session> {
    return this._client.getAPIList('/api/v2/sessions', ItemsCursorGetPagination<Session>, {
      query,
      ...options,
    });
  }

  /**
   * Returns the tracing project (session) an address names. An address is an AGENT
   * (`id` and `environment`), an EXPERIMENT (`id`), or an EVALUATOR (no `id`:
   * evaluator traces share one project per workspace). Send `kind` and `environment`
   * in upper case, as listed; they are matched case-insensitively, while the Agent
   * `id` is case-sensitive. An address that does not exist, or whose project you
   * cannot read, is a 404. Pass the returned `session_id` to any endpoint that takes
   * a project (session) ID. This is not supported on a BYOC data plane yet, and is a
   * 501 there. Self-hosted deployments need LangSmith v0.18 or later.
   */
  resolve(query: SessionResolveParams, options?: RequestOptions): APIPromise<SessionResolveResponse> {
    return this._client.get('/api/v1/sessions/resolutions', { query, ...options });
  }
}

export type SessionsItemsCursorGetPagination = ItemsCursorGetPagination<Session>;

export interface CustomChartsSection {
  id: string;

  charts: Array<
    CustomChartsSection.SingleCustomChartResponseSerialized | CustomChartsSection.CustomTextBlock
  >;

  title: string;

  description?: string | null;

  index?: number | null;

  layout?: CustomChartsSection.Layout | null;

  session_id?: string | null;

  sub_sections?: Array<CustomChartsSection.SubSection> | null;
}

export namespace CustomChartsSection {
  export interface SingleCustomChartResponseSerialized {
    id: string;

    chart_type: 'line' | 'bar' | 'table' | 'kpi' | 'top-k' | 'pie';

    data: Array<SingleCustomChartResponseSerialized.Data>;

    index: number;

    series: Array<SingleCustomChartResponseSerialized.Series>;

    title: string;

    common_filters?: SingleCustomChartResponseSerialized.CommonFilters | null;

    description?: string | null;

    metadata?: { [key: string]: unknown } | null;
  }

  export namespace SingleCustomChartResponseSerialized {
    export interface Data {
      series_id: string;

      timestamp: string;

      value: number | { [key: string]: unknown } | null;

      group?: string | null;
    }

    export interface Series {
      id: string;

      name: string;

      feedback_key?: string | null;

      filter_definition?: Series.CustomChartFilterByTracingProject | Series.CustomChartFilterByDataset | null;

      filters?: Series.Filters | null;

      /**
       * Include additional information about where the group_by param was set.
       */
      group_by?: Series.GroupBy | null;

      group_by_definitions?: Array<Series.CustomChartGroupByPlain | Series.CustomChartGroupByComplex> | null;

      metadata?: { [key: string]: unknown } | null;

      /**
       * Metrics you can chart. Feedback metrics are not available for
       * organization-scoped charts.
       */
      metric?:
        | 'run_count'
        | 'latency_p50'
        | 'latency_p99'
        | 'latency_avg'
        | 'first_token_p50'
        | 'first_token_p99'
        | 'total_tokens'
        | 'prompt_tokens'
        | 'completion_tokens'
        | 'median_tokens'
        | 'completion_tokens_p50'
        | 'prompt_tokens_p50'
        | 'tokens_p99'
        | 'completion_tokens_p99'
        | 'prompt_tokens_p99'
        | 'feedback'
        | 'feedback_score_avg'
        | 'feedback_values'
        | 'total_cost'
        | 'prompt_cost'
        | 'completion_cost'
        | 'error_rate'
        | 'streaming_rate'
        | 'cost_p50'
        | 'cost_p99'
        | null;

      metric_definition?:
        | Series.CustomChartFeedbackCountMetric
        | Series.CustomChartMetricCount
        | Series.CustomChartFeedbackScoreMetricScalar
        | Series.CustomChartMetricScalar
        | Series.CustomChartFeedbackScoreMetricPercentile
        | Series.CustomChartMetricPercentile
        | Series.CustomChartMetricRatioOutput
        | null;

      /**
       * LGP Metrics you can chart.
       */
      project_metric?:
        | 'memory_usage'
        | 'cpu_usage'
        | 'disk_usage'
        | 'restart_count'
        | 'replica_count'
        | 'worker_count'
        | 'lg_run_count'
        | 'responses_per_second'
        | 'error_responses_per_second'
        | 'p95_latency'
        | 'run_queue_wait_time'
        | null;

      workspace_id?: string | null;
    }

    export namespace Series {
      export interface CustomChartFilterByTracingProject {
        project_ids: Array<string>;

        source_type: 'tracing_project';

        run_filter?: string | null;

        trace_filter?: string | null;

        tree_filter?: string | null;
      }

      export interface CustomChartFilterByDataset {
        dataset_ids: Array<string>;

        source_type: 'dataset';
      }

      export interface Filters {
        filter?: string | null;

        session?: Array<string> | null;

        trace_filter?: string | null;

        tree_filter?: string | null;
      }

      /**
       * Include additional information about where the group_by param was set.
       */
      export interface GroupBy {
        attribute: 'name' | 'run_type' | 'tag' | 'metadata';

        max_groups?: number;

        path?: string | null;

        set_by?: 'section' | 'series' | null;
      }

      export interface CustomChartGroupByPlain {
        attribute: 'name' | 'run_type' | 'tag' | 'project' | 'status';
      }

      export interface CustomChartGroupByComplex {
        attribute: 'metadata' | 'feedback_label';

        path: string;
      }

      export interface CustomChartFeedbackCountMetric {
        entity: 'feedback';

        params: CustomChartFeedbackCountMetric.Params;

        filter?: string | null;

        type?: 'count';
      }

      export namespace CustomChartFeedbackCountMetric {
        export interface Params {
          feedback_key: string;
        }
      }

      export interface CustomChartMetricCount {
        filter?: string | null;

        type?: 'count';
      }

      export interface CustomChartFeedbackScoreMetricScalar {
        field: 'feedback_score';

        params: CustomChartFeedbackScoreMetricScalar.Params;

        type: 'sum' | 'max' | 'min' | 'avg';

        filter?: string | null;
      }

      export namespace CustomChartFeedbackScoreMetricScalar {
        export interface Params {
          feedback_key: string;
        }
      }

      export interface CustomChartMetricScalar {
        field:
          | 'latency_seconds'
          | 'first_token_seconds'
          | 'total_tokens'
          | 'prompt_tokens'
          | 'completion_tokens'
          | 'prompt_token_details.cache_creation'
          | 'prompt_token_details.cache_read'
          | 'prompt_token_details.ephemeral_1h_input_tokens'
          | 'prompt_token_details.ephemeral_5m_input_tokens'
          | 'prompt_token_details.audio'
          | 'prompt_token_details.image'
          | 'prompt_token_details.video'
          | 'completion_token_details.reasoning'
          | 'completion_token_details.audio'
          | 'completion_token_details.image'
          | 'completion_token_details.video'
          | 'total_cost'
          | 'prompt_cost'
          | 'completion_cost'
          | 'feedback_score';

        type: 'sum' | 'max' | 'min' | 'avg';

        filter?: string | null;
      }

      export interface CustomChartFeedbackScoreMetricPercentile {
        field: 'feedback_score';

        params: CustomChartFeedbackScoreMetricPercentile.Params;

        type: 'percentile';

        filter?: string | null;
      }

      export namespace CustomChartFeedbackScoreMetricPercentile {
        export interface Params {
          feedback_key: string;

          p: number;
        }
      }

      export interface CustomChartMetricPercentile {
        field:
          | 'latency_seconds'
          | 'first_token_seconds'
          | 'total_tokens'
          | 'prompt_tokens'
          | 'completion_tokens'
          | 'prompt_token_details.cache_creation'
          | 'prompt_token_details.cache_read'
          | 'prompt_token_details.ephemeral_1h_input_tokens'
          | 'prompt_token_details.ephemeral_5m_input_tokens'
          | 'prompt_token_details.audio'
          | 'prompt_token_details.image'
          | 'prompt_token_details.video'
          | 'completion_token_details.reasoning'
          | 'completion_token_details.audio'
          | 'completion_token_details.image'
          | 'completion_token_details.video'
          | 'total_cost'
          | 'prompt_cost'
          | 'completion_cost'
          | 'feedback_score';

        params: CustomChartMetricPercentile.Params;

        type: 'percentile';

        filter?: string | null;
      }

      export namespace CustomChartMetricPercentile {
        export interface Params {
          p: number;
        }
      }

      export interface CustomChartMetricRatioOutput {
        denominator:
          | CustomChartMetricRatioOutput.CustomChartFeedbackCountMetric
          | CustomChartMetricRatioOutput.CustomChartMetricCount
          | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricScalar
          | CustomChartMetricRatioOutput.CustomChartMetricScalar
          | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricPercentile
          | CustomChartMetricRatioOutput.CustomChartMetricPercentile;

        numerator:
          | CustomChartMetricRatioOutput.CustomChartFeedbackCountMetric
          | CustomChartMetricRatioOutput.CustomChartMetricCount
          | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricScalar
          | CustomChartMetricRatioOutput.CustomChartMetricScalar
          | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricPercentile
          | CustomChartMetricRatioOutput.CustomChartMetricPercentile;

        type: 'ratio';
      }

      export namespace CustomChartMetricRatioOutput {
        export interface CustomChartFeedbackCountMetric {
          entity: 'feedback';

          params: CustomChartFeedbackCountMetric.Params;

          filter?: string | null;

          type?: 'count';
        }

        export namespace CustomChartFeedbackCountMetric {
          export interface Params {
            feedback_key: string;
          }
        }

        export interface CustomChartMetricCount {
          filter?: string | null;

          type?: 'count';
        }

        export interface CustomChartFeedbackScoreMetricScalar {
          field: 'feedback_score';

          params: CustomChartFeedbackScoreMetricScalar.Params;

          type: 'sum' | 'max' | 'min' | 'avg';

          filter?: string | null;
        }

        export namespace CustomChartFeedbackScoreMetricScalar {
          export interface Params {
            feedback_key: string;
          }
        }

        export interface CustomChartMetricScalar {
          field:
            | 'latency_seconds'
            | 'first_token_seconds'
            | 'total_tokens'
            | 'prompt_tokens'
            | 'completion_tokens'
            | 'prompt_token_details.cache_creation'
            | 'prompt_token_details.cache_read'
            | 'prompt_token_details.ephemeral_1h_input_tokens'
            | 'prompt_token_details.ephemeral_5m_input_tokens'
            | 'prompt_token_details.audio'
            | 'prompt_token_details.image'
            | 'prompt_token_details.video'
            | 'completion_token_details.reasoning'
            | 'completion_token_details.audio'
            | 'completion_token_details.image'
            | 'completion_token_details.video'
            | 'total_cost'
            | 'prompt_cost'
            | 'completion_cost'
            | 'feedback_score';

          type: 'sum' | 'max' | 'min' | 'avg';

          filter?: string | null;
        }

        export interface CustomChartFeedbackScoreMetricPercentile {
          field: 'feedback_score';

          params: CustomChartFeedbackScoreMetricPercentile.Params;

          type: 'percentile';

          filter?: string | null;
        }

        export namespace CustomChartFeedbackScoreMetricPercentile {
          export interface Params {
            feedback_key: string;

            p: number;
          }
        }

        export interface CustomChartMetricPercentile {
          field:
            | 'latency_seconds'
            | 'first_token_seconds'
            | 'total_tokens'
            | 'prompt_tokens'
            | 'completion_tokens'
            | 'prompt_token_details.cache_creation'
            | 'prompt_token_details.cache_read'
            | 'prompt_token_details.ephemeral_1h_input_tokens'
            | 'prompt_token_details.ephemeral_5m_input_tokens'
            | 'prompt_token_details.audio'
            | 'prompt_token_details.image'
            | 'prompt_token_details.video'
            | 'completion_token_details.reasoning'
            | 'completion_token_details.audio'
            | 'completion_token_details.image'
            | 'completion_token_details.video'
            | 'total_cost'
            | 'prompt_cost'
            | 'completion_cost'
            | 'feedback_score';

          params: CustomChartMetricPercentile.Params;

          type: 'percentile';

          filter?: string | null;
        }

        export namespace CustomChartMetricPercentile {
          export interface Params {
            p: number;
          }
        }

        export interface CustomChartFeedbackCountMetric {
          entity: 'feedback';

          params: CustomChartFeedbackCountMetric.Params;

          filter?: string | null;

          type?: 'count';
        }

        export namespace CustomChartFeedbackCountMetric {
          export interface Params {
            feedback_key: string;
          }
        }

        export interface CustomChartMetricCount {
          filter?: string | null;

          type?: 'count';
        }

        export interface CustomChartFeedbackScoreMetricScalar {
          field: 'feedback_score';

          params: CustomChartFeedbackScoreMetricScalar.Params;

          type: 'sum' | 'max' | 'min' | 'avg';

          filter?: string | null;
        }

        export namespace CustomChartFeedbackScoreMetricScalar {
          export interface Params {
            feedback_key: string;
          }
        }

        export interface CustomChartMetricScalar {
          field:
            | 'latency_seconds'
            | 'first_token_seconds'
            | 'total_tokens'
            | 'prompt_tokens'
            | 'completion_tokens'
            | 'prompt_token_details.cache_creation'
            | 'prompt_token_details.cache_read'
            | 'prompt_token_details.ephemeral_1h_input_tokens'
            | 'prompt_token_details.ephemeral_5m_input_tokens'
            | 'prompt_token_details.audio'
            | 'prompt_token_details.image'
            | 'prompt_token_details.video'
            | 'completion_token_details.reasoning'
            | 'completion_token_details.audio'
            | 'completion_token_details.image'
            | 'completion_token_details.video'
            | 'total_cost'
            | 'prompt_cost'
            | 'completion_cost'
            | 'feedback_score';

          type: 'sum' | 'max' | 'min' | 'avg';

          filter?: string | null;
        }

        export interface CustomChartFeedbackScoreMetricPercentile {
          field: 'feedback_score';

          params: CustomChartFeedbackScoreMetricPercentile.Params;

          type: 'percentile';

          filter?: string | null;
        }

        export namespace CustomChartFeedbackScoreMetricPercentile {
          export interface Params {
            feedback_key: string;

            p: number;
          }
        }

        export interface CustomChartMetricPercentile {
          field:
            | 'latency_seconds'
            | 'first_token_seconds'
            | 'total_tokens'
            | 'prompt_tokens'
            | 'completion_tokens'
            | 'prompt_token_details.cache_creation'
            | 'prompt_token_details.cache_read'
            | 'prompt_token_details.ephemeral_1h_input_tokens'
            | 'prompt_token_details.ephemeral_5m_input_tokens'
            | 'prompt_token_details.audio'
            | 'prompt_token_details.image'
            | 'prompt_token_details.video'
            | 'completion_token_details.reasoning'
            | 'completion_token_details.audio'
            | 'completion_token_details.image'
            | 'completion_token_details.video'
            | 'total_cost'
            | 'prompt_cost'
            | 'completion_cost'
            | 'feedback_score';

          params: CustomChartMetricPercentile.Params;

          type: 'percentile';

          filter?: string | null;
        }

        export namespace CustomChartMetricPercentile {
          export interface Params {
            p: number;
          }
        }
      }
    }

    export interface CommonFilters {
      filter?: string | null;

      session?: Array<string> | null;

      trace_filter?: string | null;

      tree_filter?: string | null;
    }
  }

  export interface CustomTextBlock {
    id: string;

    chart_type: 'text';

    index: number;

    markdown: string;

    metadata?: { [key: string]: unknown } | null;
  }

  export interface Layout {
    breakpoints: Layout.Breakpoints;

    version: 1;
  }

  export namespace Layout {
    export interface Breakpoints {
      md: Breakpoints.Md;

      sm: Breakpoints.Sm;
    }

    export namespace Breakpoints {
      export interface Md {
        rows: Array<Md.Row>;
      }

      export namespace Md {
        export interface Row {
          height_units: number;

          items: Array<Row.Item>;
        }

        export namespace Row {
          export interface Item {
            chart_id: string;

            width_units: number;
          }
        }
      }

      export interface Sm {
        rows: Array<Sm.Row>;
      }

      export namespace Sm {
        export interface Row {
          height_units: number;

          items: Array<Row.Item>;
        }

        export namespace Row {
          export interface Item {
            chart_id: string;

            width_units: number;
          }
        }
      }
    }
  }

  export interface SubSection {
    id: string;

    charts: Array<SubSection.Chart>;

    index: number;

    title: string;

    description?: string | null;
  }

  export namespace SubSection {
    export interface Chart {
      id: string;

      chart_type: 'line' | 'bar' | 'table' | 'kpi' | 'top-k' | 'pie';

      data: Array<Chart.Data>;

      index: number;

      series: Array<Chart.Series>;

      title: string;

      common_filters?: Chart.CommonFilters | null;

      description?: string | null;

      metadata?: { [key: string]: unknown } | null;
    }

    export namespace Chart {
      export interface Data {
        series_id: string;

        timestamp: string;

        value: number | { [key: string]: unknown } | null;

        group?: string | null;
      }

      export interface Series {
        id: string;

        name: string;

        feedback_key?: string | null;

        filter_definition?:
          | Series.CustomChartFilterByTracingProject
          | Series.CustomChartFilterByDataset
          | null;

        filters?: Series.Filters | null;

        /**
         * Include additional information about where the group_by param was set.
         */
        group_by?: Series.GroupBy | null;

        group_by_definitions?: Array<
          Series.CustomChartGroupByPlain | Series.CustomChartGroupByComplex
        > | null;

        metadata?: { [key: string]: unknown } | null;

        /**
         * Metrics you can chart. Feedback metrics are not available for
         * organization-scoped charts.
         */
        metric?:
          | 'run_count'
          | 'latency_p50'
          | 'latency_p99'
          | 'latency_avg'
          | 'first_token_p50'
          | 'first_token_p99'
          | 'total_tokens'
          | 'prompt_tokens'
          | 'completion_tokens'
          | 'median_tokens'
          | 'completion_tokens_p50'
          | 'prompt_tokens_p50'
          | 'tokens_p99'
          | 'completion_tokens_p99'
          | 'prompt_tokens_p99'
          | 'feedback'
          | 'feedback_score_avg'
          | 'feedback_values'
          | 'total_cost'
          | 'prompt_cost'
          | 'completion_cost'
          | 'error_rate'
          | 'streaming_rate'
          | 'cost_p50'
          | 'cost_p99'
          | null;

        metric_definition?:
          | Series.CustomChartFeedbackCountMetric
          | Series.CustomChartMetricCount
          | Series.CustomChartFeedbackScoreMetricScalar
          | Series.CustomChartMetricScalar
          | Series.CustomChartFeedbackScoreMetricPercentile
          | Series.CustomChartMetricPercentile
          | Series.CustomChartMetricRatioOutput
          | null;

        /**
         * LGP Metrics you can chart.
         */
        project_metric?:
          | 'memory_usage'
          | 'cpu_usage'
          | 'disk_usage'
          | 'restart_count'
          | 'replica_count'
          | 'worker_count'
          | 'lg_run_count'
          | 'responses_per_second'
          | 'error_responses_per_second'
          | 'p95_latency'
          | 'run_queue_wait_time'
          | null;

        workspace_id?: string | null;
      }

      export namespace Series {
        export interface CustomChartFilterByTracingProject {
          project_ids: Array<string>;

          source_type: 'tracing_project';

          run_filter?: string | null;

          trace_filter?: string | null;

          tree_filter?: string | null;
        }

        export interface CustomChartFilterByDataset {
          dataset_ids: Array<string>;

          source_type: 'dataset';
        }

        export interface Filters {
          filter?: string | null;

          session?: Array<string> | null;

          trace_filter?: string | null;

          tree_filter?: string | null;
        }

        /**
         * Include additional information about where the group_by param was set.
         */
        export interface GroupBy {
          attribute: 'name' | 'run_type' | 'tag' | 'metadata';

          max_groups?: number;

          path?: string | null;

          set_by?: 'section' | 'series' | null;
        }

        export interface CustomChartGroupByPlain {
          attribute: 'name' | 'run_type' | 'tag' | 'project' | 'status';
        }

        export interface CustomChartGroupByComplex {
          attribute: 'metadata' | 'feedback_label';

          path: string;
        }

        export interface CustomChartFeedbackCountMetric {
          entity: 'feedback';

          params: CustomChartFeedbackCountMetric.Params;

          filter?: string | null;

          type?: 'count';
        }

        export namespace CustomChartFeedbackCountMetric {
          export interface Params {
            feedback_key: string;
          }
        }

        export interface CustomChartMetricCount {
          filter?: string | null;

          type?: 'count';
        }

        export interface CustomChartFeedbackScoreMetricScalar {
          field: 'feedback_score';

          params: CustomChartFeedbackScoreMetricScalar.Params;

          type: 'sum' | 'max' | 'min' | 'avg';

          filter?: string | null;
        }

        export namespace CustomChartFeedbackScoreMetricScalar {
          export interface Params {
            feedback_key: string;
          }
        }

        export interface CustomChartMetricScalar {
          field:
            | 'latency_seconds'
            | 'first_token_seconds'
            | 'total_tokens'
            | 'prompt_tokens'
            | 'completion_tokens'
            | 'prompt_token_details.cache_creation'
            | 'prompt_token_details.cache_read'
            | 'prompt_token_details.ephemeral_1h_input_tokens'
            | 'prompt_token_details.ephemeral_5m_input_tokens'
            | 'prompt_token_details.audio'
            | 'prompt_token_details.image'
            | 'prompt_token_details.video'
            | 'completion_token_details.reasoning'
            | 'completion_token_details.audio'
            | 'completion_token_details.image'
            | 'completion_token_details.video'
            | 'total_cost'
            | 'prompt_cost'
            | 'completion_cost'
            | 'feedback_score';

          type: 'sum' | 'max' | 'min' | 'avg';

          filter?: string | null;
        }

        export interface CustomChartFeedbackScoreMetricPercentile {
          field: 'feedback_score';

          params: CustomChartFeedbackScoreMetricPercentile.Params;

          type: 'percentile';

          filter?: string | null;
        }

        export namespace CustomChartFeedbackScoreMetricPercentile {
          export interface Params {
            feedback_key: string;

            p: number;
          }
        }

        export interface CustomChartMetricPercentile {
          field:
            | 'latency_seconds'
            | 'first_token_seconds'
            | 'total_tokens'
            | 'prompt_tokens'
            | 'completion_tokens'
            | 'prompt_token_details.cache_creation'
            | 'prompt_token_details.cache_read'
            | 'prompt_token_details.ephemeral_1h_input_tokens'
            | 'prompt_token_details.ephemeral_5m_input_tokens'
            | 'prompt_token_details.audio'
            | 'prompt_token_details.image'
            | 'prompt_token_details.video'
            | 'completion_token_details.reasoning'
            | 'completion_token_details.audio'
            | 'completion_token_details.image'
            | 'completion_token_details.video'
            | 'total_cost'
            | 'prompt_cost'
            | 'completion_cost'
            | 'feedback_score';

          params: CustomChartMetricPercentile.Params;

          type: 'percentile';

          filter?: string | null;
        }

        export namespace CustomChartMetricPercentile {
          export interface Params {
            p: number;
          }
        }

        export interface CustomChartMetricRatioOutput {
          denominator:
            | CustomChartMetricRatioOutput.CustomChartFeedbackCountMetric
            | CustomChartMetricRatioOutput.CustomChartMetricCount
            | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricScalar
            | CustomChartMetricRatioOutput.CustomChartMetricScalar
            | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricPercentile
            | CustomChartMetricRatioOutput.CustomChartMetricPercentile;

          numerator:
            | CustomChartMetricRatioOutput.CustomChartFeedbackCountMetric
            | CustomChartMetricRatioOutput.CustomChartMetricCount
            | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricScalar
            | CustomChartMetricRatioOutput.CustomChartMetricScalar
            | CustomChartMetricRatioOutput.CustomChartFeedbackScoreMetricPercentile
            | CustomChartMetricRatioOutput.CustomChartMetricPercentile;

          type: 'ratio';
        }

        export namespace CustomChartMetricRatioOutput {
          export interface CustomChartFeedbackCountMetric {
            entity: 'feedback';

            params: CustomChartFeedbackCountMetric.Params;

            filter?: string | null;

            type?: 'count';
          }

          export namespace CustomChartFeedbackCountMetric {
            export interface Params {
              feedback_key: string;
            }
          }

          export interface CustomChartMetricCount {
            filter?: string | null;

            type?: 'count';
          }

          export interface CustomChartFeedbackScoreMetricScalar {
            field: 'feedback_score';

            params: CustomChartFeedbackScoreMetricScalar.Params;

            type: 'sum' | 'max' | 'min' | 'avg';

            filter?: string | null;
          }

          export namespace CustomChartFeedbackScoreMetricScalar {
            export interface Params {
              feedback_key: string;
            }
          }

          export interface CustomChartMetricScalar {
            field:
              | 'latency_seconds'
              | 'first_token_seconds'
              | 'total_tokens'
              | 'prompt_tokens'
              | 'completion_tokens'
              | 'prompt_token_details.cache_creation'
              | 'prompt_token_details.cache_read'
              | 'prompt_token_details.ephemeral_1h_input_tokens'
              | 'prompt_token_details.ephemeral_5m_input_tokens'
              | 'prompt_token_details.audio'
              | 'prompt_token_details.image'
              | 'prompt_token_details.video'
              | 'completion_token_details.reasoning'
              | 'completion_token_details.audio'
              | 'completion_token_details.image'
              | 'completion_token_details.video'
              | 'total_cost'
              | 'prompt_cost'
              | 'completion_cost'
              | 'feedback_score';

            type: 'sum' | 'max' | 'min' | 'avg';

            filter?: string | null;
          }

          export interface CustomChartFeedbackScoreMetricPercentile {
            field: 'feedback_score';

            params: CustomChartFeedbackScoreMetricPercentile.Params;

            type: 'percentile';

            filter?: string | null;
          }

          export namespace CustomChartFeedbackScoreMetricPercentile {
            export interface Params {
              feedback_key: string;

              p: number;
            }
          }

          export interface CustomChartMetricPercentile {
            field:
              | 'latency_seconds'
              | 'first_token_seconds'
              | 'total_tokens'
              | 'prompt_tokens'
              | 'completion_tokens'
              | 'prompt_token_details.cache_creation'
              | 'prompt_token_details.cache_read'
              | 'prompt_token_details.ephemeral_1h_input_tokens'
              | 'prompt_token_details.ephemeral_5m_input_tokens'
              | 'prompt_token_details.audio'
              | 'prompt_token_details.image'
              | 'prompt_token_details.video'
              | 'completion_token_details.reasoning'
              | 'completion_token_details.audio'
              | 'completion_token_details.image'
              | 'completion_token_details.video'
              | 'total_cost'
              | 'prompt_cost'
              | 'completion_cost'
              | 'feedback_score';

            params: CustomChartMetricPercentile.Params;

            type: 'percentile';

            filter?: string | null;
          }

          export namespace CustomChartMetricPercentile {
            export interface Params {
              p: number;
            }
          }

          export interface CustomChartFeedbackCountMetric {
            entity: 'feedback';

            params: CustomChartFeedbackCountMetric.Params;

            filter?: string | null;

            type?: 'count';
          }

          export namespace CustomChartFeedbackCountMetric {
            export interface Params {
              feedback_key: string;
            }
          }

          export interface CustomChartMetricCount {
            filter?: string | null;

            type?: 'count';
          }

          export interface CustomChartFeedbackScoreMetricScalar {
            field: 'feedback_score';

            params: CustomChartFeedbackScoreMetricScalar.Params;

            type: 'sum' | 'max' | 'min' | 'avg';

            filter?: string | null;
          }

          export namespace CustomChartFeedbackScoreMetricScalar {
            export interface Params {
              feedback_key: string;
            }
          }

          export interface CustomChartMetricScalar {
            field:
              | 'latency_seconds'
              | 'first_token_seconds'
              | 'total_tokens'
              | 'prompt_tokens'
              | 'completion_tokens'
              | 'prompt_token_details.cache_creation'
              | 'prompt_token_details.cache_read'
              | 'prompt_token_details.ephemeral_1h_input_tokens'
              | 'prompt_token_details.ephemeral_5m_input_tokens'
              | 'prompt_token_details.audio'
              | 'prompt_token_details.image'
              | 'prompt_token_details.video'
              | 'completion_token_details.reasoning'
              | 'completion_token_details.audio'
              | 'completion_token_details.image'
              | 'completion_token_details.video'
              | 'total_cost'
              | 'prompt_cost'
              | 'completion_cost'
              | 'feedback_score';

            type: 'sum' | 'max' | 'min' | 'avg';

            filter?: string | null;
          }

          export interface CustomChartFeedbackScoreMetricPercentile {
            field: 'feedback_score';

            params: CustomChartFeedbackScoreMetricPercentile.Params;

            type: 'percentile';

            filter?: string | null;
          }

          export namespace CustomChartFeedbackScoreMetricPercentile {
            export interface Params {
              feedback_key: string;

              p: number;
            }
          }

          export interface CustomChartMetricPercentile {
            field:
              | 'latency_seconds'
              | 'first_token_seconds'
              | 'total_tokens'
              | 'prompt_tokens'
              | 'completion_tokens'
              | 'prompt_token_details.cache_creation'
              | 'prompt_token_details.cache_read'
              | 'prompt_token_details.ephemeral_1h_input_tokens'
              | 'prompt_token_details.ephemeral_5m_input_tokens'
              | 'prompt_token_details.audio'
              | 'prompt_token_details.image'
              | 'prompt_token_details.video'
              | 'completion_token_details.reasoning'
              | 'completion_token_details.audio'
              | 'completion_token_details.image'
              | 'completion_token_details.video'
              | 'total_cost'
              | 'prompt_cost'
              | 'completion_cost'
              | 'feedback_score';

            params: CustomChartMetricPercentile.Params;

            type: 'percentile';

            filter?: string | null;
          }

          export namespace CustomChartMetricPercentile {
            export interface Params {
              p: number;
            }
          }
        }
      }

      export interface CommonFilters {
        filter?: string | null;

        session?: Array<string> | null;

        trace_filter?: string | null;

        tree_filter?: string | null;
      }
    }
  }
}

export interface CustomChartsSectionRequest {
  end_time?: string | null;

  /**
   * Group by param for run stats.
   */
  group_by?: RunStatsGroupBy | null;

  omit_data?: boolean;

  start_time?: string | null;

  /**
   * Timedelta input.
   */
  stride?: TimedeltaInput;

  timezone?: string;
}

/**
 * Group by param for run stats.
 */
export interface RunStatsGroupBy {
  attribute: 'name' | 'run_type' | 'tag' | 'metadata';

  max_groups?: number;

  path?: string | null;
}

/**
 * TracerSession schema.
 */
export interface Session {
  id: string;

  name: string;

  start_time: string;

  tenant_id: string;

  /**
   * `PROJECT` for a tracing project, `AGENT` for an Agent's tracing project, or
   * `EXPERIMENT` for an evaluation run against a dataset.
   */
  type: 'PROJECT' | 'AGENT' | 'EXPERIMENT';

  completion_cost?: number | null;

  completion_tokens?: number | null;

  default_dataset_id?: string | null;

  description?: string | null;

  end_time?: string | null;

  error_rate?: number | null;

  experiment_progress?: Session.ExperimentProgress | null;

  extra?: { [key: string]: unknown } | null;

  /**
   * Feedback on the session's runs, by feedback key.
   */
  feedback_stats?: { [key: string]: SessionFeedbackStat } | null;

  first_token_p50?: number | null;

  first_token_p99?: number | null;

  last_run_start_time?: string | null;

  last_run_start_time_live?: string | null;

  latency_p50?: number | null;

  latency_p99?: number | null;

  /**
   * Retention in days for traces while trace_tier is longlived. One of the
   * deployment's allowed values (allowed_longlived_ttl_days in /info), up to the
   * maximum of the deployment. The value is kept while trace_tier is shortlived.
   * Null means the project uses the workspace retention.
   */
  longlived_ttl_days?: number | null;

  prompt_cost?: number | null;

  prompt_tokens?: number | null;

  reference_dataset_id?: string | null;

  run_count?: number | null;

  run_facets?: Array<{ [key: string]: unknown }> | null;

  /**
   * Feedback on the session itself, by feedback key.
   */
  session_feedback_stats?: { [key: string]: SessionFeedbackStat } | null;

  streaming_rate?: number | null;

  test_run_number?: number | null;

  total_cost?: number | null;

  total_tokens?: number | null;

  trace_tier?: 'LONG_LIVED' | 'SHORT_LIVED' | null;
}

export namespace Session {
  export interface ExperimentProgress {
    evaluator_progress: { [key: string]: number };

    expected_run_count: number;

    run_progress: number;
  }
}

/**
 * Aggregate feedback for one feedback key.
 */
export interface SessionFeedbackStat {
  /**
   * Mean numeric score.
   */
  avg: number | null;

  /**
   * Whether any feedback was left on a thread.
   */
  contains_thread_feedback: boolean;

  /**
   * Number of feedback entries recorded as errors.
   */
  errors: number;

  /**
   * Highest numeric score.
   */
  max: number | null;

  /**
   * Median numeric score.
   */
  median: number | null;

  /**
   * Lowest numeric score.
   */
  min: number | null;

  /**
   * Number of feedback scores for this key.
   */
  n: number;

  /**
   * Standard deviation of numeric scores.
   */
  stdev: number | null;

  /**
   * `PRIMARY` for recorded feedback, `COMPOSITE` for a score computed from other
   * feedback keys.
   */
  type: 'PRIMARY' | 'COMPOSITE';

  /**
   * Count of each categorical value.
   */
  values: { [key: string]: number };
}

export type SessionSortableColumns =
  | 'name'
  | 'start_time'
  | 'last_run_start_time'
  | 'latency_p50'
  | 'latency_p99'
  | 'error_rate'
  | 'feedback';

/**
 * Timedelta input.
 */
export interface TimedeltaInput {
  days?: number;

  hours?: number;

  minutes?: number;
}

/**
 * TracerSession schema.
 */
export interface TracerSession {
  id: string;

  tenant_id: string;

  completion_cost?: number | null;

  completion_tokens?: number | null;

  default_dataset_id?: string | null;

  description?: string | null;

  end_time?: string | null;

  error_rate?: number | null;

  experiment_progress?: TracerSession.ExperimentProgress | null;

  extra?: { [key: string]: unknown } | null;

  feedback_stats?: { [key: string]: unknown } | null;

  first_token_p50?: number | null;

  first_token_p99?: number | null;

  last_run_start_time?: string | null;

  last_run_start_time_live?: string | null;

  latency_p50?: number | null;

  latency_p99?: number | null;

  /**
   * Retention in days for traces while trace_tier is longlived. One of the
   * deployment's allowed values (allowed_longlived_ttl_days in /info), up to the
   * maximum of the deployment. The value is kept while trace_tier is shortlived.
   * Null means the project uses the workspace retention.
   */
  longlived_ttl_days?: number | null;

  name?: string;

  prompt_cost?: number | null;

  prompt_tokens?: number | null;

  reference_dataset_id?: string | null;

  run_count?: number | null;

  run_facets?: Array<{ [key: string]: unknown }> | null;

  session_feedback_stats?: { [key: string]: unknown } | null;

  start_time?: string;

  streaming_rate?: number | null;

  test_run_number?: number | null;

  total_cost?: number | null;

  total_tokens?: number | null;

  trace_tier?: 'longlived' | 'shortlived' | null;
}

export namespace TracerSession {
  export interface ExperimentProgress {
    evaluator_progress: { [key: string]: number };

    expected_run_count: number;

    run_progress: number;
  }
}

/**
 * @deprecated Legacy session response model. Use TracerSession for new
 * integrations.
 */
export interface TracerSessionWithoutVirtualFields {
  id: string;

  tenant_id: string;

  default_dataset_id?: string | null;

  description?: string | null;

  end_time?: string | null;

  extra?: { [key: string]: unknown } | null;

  last_run_start_time_live?: string | null;

  /**
   * Retention in days for traces while trace_tier is longlived. One of the
   * deployment's allowed values (allowed_longlived_ttl_days in /info), up to the
   * maximum of the deployment. The value is kept while trace_tier is shortlived.
   * Null means the project uses the workspace retention.
   */
  longlived_ttl_days?: number | null;

  name?: string;

  reference_dataset_id?: string | null;

  start_time?: string;

  trace_tier?: 'longlived' | 'shortlived' | null;
}

export interface SessionResolveResponse {
  /**
   * `session_id` is the tracing project (session) the address names.
   */
  session_id: string;
}

export interface SessionCreateParams {
  /**
   * Query param
   */
  upsert?: boolean;

  /**
   * Body param
   */
  id?: string | null;

  /**
   * Body param
   */
  default_dataset_id?: string | null;

  /**
   * Body param
   */
  description?: string | null;

  /**
   * Body param
   */
  end_time?: string | null;

  /**
   * Body param
   */
  evaluator_keys?: Array<string> | null;

  /**
   * Body param
   */
  extra?: { [key: string]: unknown } | null;

  /**
   * Body param
   */
  kicked_off_by?: string | null;

  /**
   * Body param: Retention in days for traces while trace_tier is longlived. One of
   * the deployment's allowed values (allowed_longlived_ttl_days in /info), up to the
   * maximum of the deployment. The value is kept while trace_tier is shortlived.
   * Null means the project uses the workspace retention.
   */
  longlived_ttl_days?: number | null;

  /**
   * Body param
   */
  name?: string;

  /**
   * Body param
   */
  num_examples?: number | null;

  /**
   * Body param
   */
  num_repetitions?: number | null;

  /**
   * Body param
   */
  reference_dataset_id?: string | null;

  /**
   * Body param
   */
  start_time?: string;

  /**
   * Body param
   */
  tag_value_ids?: Array<string> | null;

  /**
   * Body param
   */
  trace_tier?: 'longlived' | 'shortlived' | null;
}

export interface SessionRetrieveParams {
  /**
   * Query param
   */
  include_stats?: boolean;

  /**
   * Query param
   */
  stats_start_time?: string | null;

  /**
   * Header param
   */
  accept?: string;
}

export interface SessionUpdateParams {
  default_dataset_id?: string | null;

  description?: string | null;

  end_time?: string | null;

  extra?: { [key: string]: unknown } | null;

  /**
   * Retention in days for traces while trace_tier is longlived. One of the
   * deployment's allowed values (allowed_longlived_ttl_days in /info), up to the
   * maximum of the deployment. The value is kept while trace_tier is shortlived.
   * Null means the project uses the workspace retention. Omit the field to keep the
   * current value.
   */
  longlived_ttl_days?: number | null;

  name?: string | null;

  trace_tier?: 'longlived' | 'shortlived' | null;
}

export interface SessionDashboardParams {
  /**
   * Body param
   */
  end_time?: string | null;

  /**
   * Body param: Group by param for run stats.
   */
  group_by?: RunStatsGroupBy | null;

  /**
   * Body param
   */
  omit_data?: boolean;

  /**
   * Body param
   */
  start_time?: string | null;

  /**
   * Body param: Timedelta input.
   */
  stride?: TimedeltaInput;

  /**
   * Body param
   */
  timezone?: string;

  /**
   * Header param
   */
  accept?: string;
}

export interface SessionListV2Params extends ItemsCursorGetPaginationParams {
  /**
   * Only return projects with these IDs
   */
  id?: Array<string>;

  /**
   * Only return experiments run against this dataset version (RFC 3339 timestamp)
   */
  dataset_version?: string;

  /**
   * Filter expression, for example eq(name, 'my-project')
   */
  filter?: string;

  /**
   * Include run facets
   */
  include_facets?: boolean;

  /**
   * Include run statistics
   */
  include_stats?: boolean;

  /**
   * JSON object the project metadata must contain
   */
  metadata?: string;

  /**
   * Only return the project with this exact name
   */
  name?: string;

  /**
   * Only return projects whose name contains this substring
   */
  name_contains?: string;

  /**
   * Only return experiments run against these dataset IDs
   */
  reference_dataset_id?: Array<string>;

  /**
   * Sort column. FEEDBACK requires reference_dataset_id
   */
  sort_by?:
    | 'NAME'
    | 'START_TIME'
    | 'LAST_RUN_START_TIME'
    | 'ERROR_RATE'
    | 'LATENCY_P50'
    | 'LATENCY_P99'
    | 'FEEDBACK';

  /**
   * Feedback key to sort by; required when sort_by is FEEDBACK
   */
  sort_by_feedback_key?: string;

  /**
   * Where the sort feedback is recorded; defaults to RUN when sort_by is FEEDBACK
   */
  sort_by_feedback_source?: 'RUN' | 'SESSION';

  /**
   * Sort direction
   */
  sort_order?: 'asc' | 'desc';

  /**
   * Run filter expression that scopes the statistics
   */
  stats_filter?: string;

  /**
   * Statistics to include when include_stats is true; defaults to all
   */
  stats_select?: Array<string>;

  /**
   * Only aggregate statistics at or after this time, within the last 31 days
   */
  stats_start_time?: string;

  /**
   * Only return projects tagged with all of these tag value IDs
   */
  tag_value_id?: Array<string>;

  /**
   * Only return projects of these types
   */
  type?: Array<'PROJECT' | 'AGENT' | 'EXPERIMENT'>;

  /**
   * Compute statistics from pre-aggregated data, which is faster but up to an hour
   * stale
   */
  use_approx_stats?: boolean;
}

export interface SessionResolveParams {
  /**
   * The kind of address.
   */
  kind: 'AGENT' | 'EXPERIMENT' | 'EVALUATOR';

  /**
   * The Agent's user-assigned id for AGENT, or the experiment's id for EXPERIMENT.
   * Not set for EVALUATOR.
   */
  id?: string;

  /**
   * The Agent environment. Only set for AGENT.
   */
  environment?: 'LOCAL' | 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
}

export declare namespace Sessions {
  export {
    type CustomChartsSection as CustomChartsSection,
    type CustomChartsSectionRequest as CustomChartsSectionRequest,
    type RunStatsGroupBy as RunStatsGroupBy,
    type Session as Session,
    type SessionFeedbackStat as SessionFeedbackStat,
    type SessionSortableColumns as SessionSortableColumns,
    type TimedeltaInput as TimedeltaInput,
    type TracerSession as TracerSession,
    type TracerSessionWithoutVirtualFields as TracerSessionWithoutVirtualFields,
    type SessionResolveResponse as SessionResolveResponse,
    type SessionsItemsCursorGetPagination as SessionsItemsCursorGetPagination,
    type SessionCreateParams as SessionCreateParams,
    type SessionRetrieveParams as SessionRetrieveParams,
    type SessionUpdateParams as SessionUpdateParams,
    type SessionDashboardParams as SessionDashboardParams,
    type SessionListV2Params as SessionListV2Params,
    type SessionResolveParams as SessionResolveParams,
  };
}
