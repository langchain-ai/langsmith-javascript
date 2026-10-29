// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Evaluators extends APIResource {
  /**
   * List all run rules.
   */
  list(
    query: EvaluatorListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<EvaluatorListResponse> {
    return this._client.get('/api/v1/runs/rules', { query, ...options });
  }

  /**
   * Create a decision-model evaluator (Jev, SemIf or OpenAI Decisions) from its
   * prompt and questions, and attach it to a project or dataset. Each question's key
   * becomes a feedback key.
   */
  createDecisionModel(
    body: EvaluatorCreateDecisionModelParams,
    options?: RequestOptions,
  ): APIPromise<Evaluator> {
    return this._client.post('/api/v1/runs/rules/decision-models', { body, ...options });
  }
}

export interface CodeEvaluatorTopLevel {
  code: string;

  advanced_features_enabled?: boolean;

  /**
   * Input provided to a code evaluator.
   */
  code_evaluator_input?:
    | 'thread'
    | 'all_messages'
    | 'human_ai_pairs'
    | 'first_human_last_ai'
    | 'trajectory'
    | null;

  language?: 'python' | 'javascript' | null;

  require_attachments?: boolean;
}

/**
 * Run rules schema.
 */
export interface Evaluator {
  id: string;

  created_at: string;

  display_name: string;

  evaluator_version: number;

  sampling_rate: number;

  tenant_id: string;

  updated_at: string;

  webhooks: Array<EvaluatorWebhook> | null;

  add_to_annotation_queue_id?: string | null;

  add_to_annotation_queue_name?: string | null;

  add_to_dataset_id?: string | null;

  add_to_dataset_name?: string | null;

  add_to_dataset_prefer_correction?: boolean;

  alerts?: Array<EvaluatorPagerdutyAlert> | null;

  alignment_annotation_queue_id?: string | null;

  backfill_completed_at?: string | null;

  backfill_error?: string | null;

  backfill_from?: string | null;

  backfill_id?: string | null;

  backfill_progress?: number | null;

  backfill_status?: string | null;

  code_evaluators?: Array<CodeEvaluatorTopLevel> | null;

  corrections_dataset_id?: string | null;

  dataset_id?: string | null;

  dataset_name?: string | null;

  evaluator_id?: string | null;

  evaluator_name?: string | null;

  evaluator_type?: string | null;

  evaluators?: Array<EvaluatorTopLevel> | null;

  extend_annotation_queue_trace_retention?: boolean | null;

  extend_dataset_trace_retention?: boolean | null;

  extend_evaluator_trace_retention?: boolean | null;

  extend_only?: boolean;

  extend_webhook_trace_retention?: boolean | null;

  filter?: string | null;

  group_by?: 'thread_id' | 'trajectory_id' | null;

  include_extended_stats?: boolean;

  is_enabled?: boolean;

  is_managed_evaluator?: boolean;

  is_tracing_disabled?: boolean;

  num_few_shot_examples?: number | null;

  session_id?: string | null;

  session_name?: string | null;

  spend_limit?: Evaluator.SpendLimit | null;

  spend_usd?: number | null;

  trace_count?: number | null;

  trace_filter?: string | null;

  transient?: boolean;

  tree_filter?: string | null;

  use_corrections_dataset?: boolean;
}

export namespace Evaluator {
  export interface SpendLimit {
    limit_usd: string;

    window: 'weekly';
  }
}

export interface EvaluatorPagerdutyAlert {
  routing_key: string;

  /**
   * Enum for severity.
   */
  severity?: 'critical' | 'warning' | 'error' | 'info' | null;

  summary?: string | null;

  /**
   * Enum for alert types.
   */
  type?: 'pagerduty' | null;
}

export interface EvaluatorTopLevel {
  /**
   * Evaluator structured output schema.
   */
  structured: EvaluatorTopLevel.Structured;
}

export namespace EvaluatorTopLevel {
  /**
   * Evaluator structured output schema.
   */
  export interface Structured {
    hub_ref?: string | null;

    model?: { [key: string]: unknown } | null;

    playground_settings_id?: string | null;

    prompt?: Array<Array<unknown>> | null;

    schema?: { [key: string]: unknown } | null;

    template_format?: string | null;

    variable_mapping?: { [key: string]: string } | null;
  }
}

export interface EvaluatorWebhook {
  url: string;

  headers?: { [key: string]: string } | null;
}

export type EvaluatorListResponse = Array<Evaluator>;

export interface EvaluatorListParams {
  id?: Array<string> | null;

  dataset_id?: string | null;

  evaluator_id?: string | null;

  include_backfill_progress?: boolean;

  name_contains?: string | null;

  session_id?: string | null;

  tag_value_id?: Array<string> | null;

  type?: 'session' | 'dataset' | null;
}

export interface EvaluatorCreateDecisionModelParams {
  display_name: string;

  /**
   * The prompt the model reads, as (role, template) pairs.
   */
  prompt: Array<Array<unknown>>;

  /**
   * The questions, keyed by feedback key, in the order to ask them.
   */
  questions: { [key: string]: EvaluatorCreateDecisionModelParams.Questions };

  /**
   * Call this endpoint directly instead of through the LangSmith gateway, with the
   * workspace's TYPESAFE_API_KEY or OPENAI_API_KEY secret. Required for
   * typesafe_compatible.
   */
  base_url?: string | null;

  /**
   * The dataset whose experiments to evaluate.
   */
  dataset_id?: string | null;

  /**
   * Only evaluate runs that match this filter.
   */
  filter?: string | null;

  /**
   * How many times to retry a failed model call. openai_decisions only.
   */
  max_retries?: number | null;

  /**
   * Defaults to jev-latest for typesafe and gpt-6-luna for openai_decisions. Use
   * semif-qwen3.5-4b for SemIf.
   */
  model?: string | null;

  /**
   * Headers sent with each model call. They are saved in the evaluator's prompt as
   * given, so do not put API keys here.
   */
  model_headers?: { [key: string]: string } | null;

  /**
   * A saved model configuration to start from: its model, endpoint, key and settings
   * apply unless set here.
   */
  playground_settings_id?: string | null;

  /**
   * typesafe for Jev and SemIf, typesafe_compatible for a TypeSafe-compatible
   * endpoint, or openai_decisions.
   */
  provider?: 'typesafe' | 'typesafe_compatible' | 'openai_decisions';

  /**
   * The fraction of runs to evaluate.
   */
  sampling_rate?: number;

  /**
   * The tracing project to evaluate.
   */
  session_id?: string | null;

  template_format?: 'mustache' | 'f-string';

  /**
   * Seconds to wait for each model call. openai_decisions only.
   */
  timeout_seconds?: number | null;

  /**
   * Maps the prompt's variables to run fields.
   */
  variable_mapping?: { [key: string]: string } | null;
}

export namespace EvaluatorCreateDecisionModelParams {
  /**
   * A question a decision model answers about each run.
   */
  export interface Questions {
    instructions: string;

    /**
     * noul: a yes/no question scored 0 to 1. choice: one of the options. score: one of
     * the levels, scored by position.
     */
    type: 'noul' | 'choice' | 'score';

    /**
     * 2 to 10 level names, lowest first. score only.
     */
    levels?: Array<string> | null;

    /**
     * What a no answer means. noul only; set both yes and no, or neither.
     */
    no?: string | null;

    /**
     * 2 to 255 option names, or names mapped to descriptions. choice only.
     */
    options?: Array<string> | { [key: string]: string | null } | null;

    /**
     * What a yes answer means. noul only; set both yes and no, or neither.
     */
    yes?: string | null;
  }
}

export declare namespace Evaluators {
  export {
    type CodeEvaluatorTopLevel as CodeEvaluatorTopLevel,
    type Evaluator as Evaluator,
    type EvaluatorPagerdutyAlert as EvaluatorPagerdutyAlert,
    type EvaluatorTopLevel as EvaluatorTopLevel,
    type EvaluatorWebhook as EvaluatorWebhook,
    type EvaluatorListResponse as EvaluatorListResponse,
    type EvaluatorListParams as EvaluatorListParams,
    type EvaluatorCreateDecisionModelParams as EvaluatorCreateDecisionModelParams,
  };
}
