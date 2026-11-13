// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ExamplesAPI from './examples';
import {
  ExampleDeleteParams,
  ExampleUpdateMetadataParams,
  ExampleUpdateMetadataResponse,
  Examples,
} from './examples';
import * as ExperimentRunsAPI from './experiment-runs';
import {
  ExperimentRunQueryParams,
  ExperimentRunQueryResponse,
  ExperimentRunQueryResponsesItemsCursorPostPagination,
  ExperimentRuns,
} from './experiment-runs';
import {
  ItemsCursorGetPagination,
  type ItemsCursorGetPaginationParams,
  PagePromise,
} from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';

export class Datasets extends APIResource {
  examples: ExamplesAPI.Examples = new ExamplesAPI.Examples(this._client);
  experimentRuns: ExperimentRunsAPI.ExperimentRuns = new ExperimentRunsAPI.ExperimentRuns(this._client);

  /**
   * Returns one page of the datasets in the workspace, filtered and sorted by the
   * query parameters. Pass the next_cursor of a response as cursor, with the same
   * filters and sort, to get the next page. next_cursor is null on the last page.
   */
  listV2(
    query: DatasetListV2Params | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<DatasetsItemsCursorGetPagination, Dataset> {
    return this._client.getAPIList('/api/v2/datasets', ItemsCursorGetPagination<Dataset>, {
      query,
      ...options,
    });
  }
}

export type DatasetsItemsCursorGetPagination = ItemsCursorGetPagination<Dataset>;

/**
 * Enum for dataset data types.
 */
export type DataType = 'kv' | 'llm' | 'chat';

/**
 * Dataset schema.
 */
export interface Dataset {
  id: string;

  modified_at: string;

  name: string;

  session_count: number;

  tenant_id: string;

  baseline_experiment_id?: string | null;

  created_at?: string;

  /**
   * Enum for dataset data types.
   */
  data_type?: DataType | null;

  description?: string | null;

  example_count?: number | null;

  externally_managed?: boolean | null;

  inputs_schema_definition?: { [key: string]: unknown } | null;

  last_session_start_time?: string | null;

  metadata?: { [key: string]: unknown } | null;

  outputs_schema_definition?: { [key: string]: unknown } | null;

  transformations?: Array<DatasetTransformation> | null;
}

export interface DatasetTransformation {
  path: Array<string>;

  /**
   * Enum for dataset transformation types. Ordering determines the order in which
   * transformations are applied if there are multiple transformations on the same
   * path.
   */
  transformation_type:
    | 'convert_to_openai_message'
    | 'convert_to_openai_tool'
    | 'remove_system_messages'
    | 'remove_extra_fields'
    | 'extract_tools_from_run';
}

/**
 * Dataset version schema.
 */
export interface DatasetVersion {
  as_of: string;

  tags?: Array<string> | null;
}

/**
 * Schema used for creating feedback without run id or session id.
 */
export interface FeedbackCreateCoreSchema {
  key: string;

  id?: string;

  /**
   * A free-text comment explaining the feedback. Truncated at the feedback size
   * limit.
   */
  comment?: string | null;

  /**
   * The ID of the comparative (pairwise) experiment this feedback was written for.
   */
  comparative_experiment_id?: string | null;

  /**
   * The corrected output for the run, as a string or a JSON object. Dropped if it
   * exceeds the feedback size limit.
   */
  correction?: { [key: string]: unknown } | string | null;

  /**
   * When the feedback was created, as an ISO 8601 timestamp. Defaults to now.
   */
  created_at?: string;

  extra?: { [key: string]: unknown } | null;

  feedback_config?: FeedbackCreateCoreSchema.FeedbackConfig | null;

  /**
   * Groups feedback written together, such as one comparison in a pairwise
   * experiment.
   */
  feedback_group_id?: string | null;

  /**
   * Feedback from the LangChainPlus App.
   */
  feedback_source?:
    | FeedbackCreateCoreSchema.AppFeedbackSource
    | FeedbackCreateCoreSchema.APIFeedbackSource
    | FeedbackCreateCoreSchema.ModelFeedbackSource
    | FeedbackCreateCoreSchema.AutoEvalFeedbackSource
    | null;

  /**
   * When the feedback was last modified, as an ISO 8601 timestamp. Defaults to now.
   */
  modified_at?: string;

  /**
   * The numeric or boolean score. Numbers must be between -99999.9999 and 99999.9999
   * with at most 4 decimal places.
   */
  score?: number | boolean | null;

  /**
   * A non-numeric value, such as a category label or a JSON object. Dropped if it
   * exceeds the feedback size limit.
   */
  value?: number | boolean | string | { [key: string]: unknown } | null;
}

export namespace FeedbackCreateCoreSchema {
  export interface FeedbackConfig {
    /**
     * Enum for feedback types.
     */
    type: 'continuous' | 'categorical' | 'freeform';

    /**
     * Whether a reviewer can pick several categories. Categorical feedback only.
     */
    allows_multiple_categories?: boolean;

    categories?: Array<FeedbackConfig.Category> | null;

    max?: number | null;

    min?: number | null;
  }

  export namespace FeedbackConfig {
    /**
     * Specific value and label pair for feedback
     */
    export interface Category {
      value: number;

      label?: string | null;
    }
  }

  /**
   * Feedback from the LangChainPlus App.
   */
  export interface AppFeedbackSource {
    metadata?: { [key: string]: unknown } | null;

    type?: 'app';
  }

  /**
   * API feedback source.
   */
  export interface APIFeedbackSource {
    metadata?: { [key: string]: unknown } | null;

    type?: 'api';
  }

  /**
   * Model feedback source.
   */
  export interface ModelFeedbackSource {
    metadata?: { [key: string]: unknown } | null;

    type?: 'model';
  }

  /**
   * Auto eval feedback source.
   */
  export interface AutoEvalFeedbackSource {
    metadata?: { [key: string]: unknown } | null;

    type?: 'auto_eval';
  }
}

/**
 * Enum for available dataset columns to sort by.
 */
export type SortByDatasetColumn =
  | 'name'
  | 'created_at'
  | 'last_session_start_time'
  | 'example_count'
  | 'session_count'
  | 'modified_at';

export interface DatasetListV2Params extends ItemsCursorGetPaginationParams {
  /**
   * Return only the datasets with these IDs. Repeat the parameter for several IDs.
   */
  id?: Array<string>;

  /**
   * Return only datasets of these data types. Repeat the parameter for several
   * types.
   */
  data_type?: Array<DataType>;

  /**
   * Fields to leave out of each dataset. An excluded example_count is returned as
   * null and makes the response faster.
   */
  exclude?: Array<'example_count'>;

  /**
   * Leave out datasets that store corrections for an evaluator.
   */
  exclude_corrections_datasets?: boolean;

  /**
   * A JSON object. Return only datasets whose metadata contains every key and value
   * in it.
   */
  metadata?: string;

  /**
   * Return only the dataset with exactly this name.
   */
  name?: string;

  /**
   * Return only datasets whose name contains this text, ignoring case.
   */
  name_contains?: string;

  /**
   * Field to sort by. last_session_start_time is the start time of the most recent
   * experiment on the dataset. Datasets without a value come last in both orders.
   * While a sort value changes, for example when an experiment starts, a dataset can
   * be skipped or listed twice across pages. Sort by created_at for a stable walk.
   */
  sort_by?: SortByDatasetColumn;

  /**
   * Sort direction.
   */
  sort_order?: 'asc' | 'desc';

  /**
   * Return only datasets tagged with all of these tag value IDs.
   */
  tag_value_id?: Array<string>;
}

Datasets.Examples = Examples;
Datasets.ExperimentRuns = ExperimentRuns;

export declare namespace Datasets {
  export {
    type DataType as DataType,
    type Dataset as Dataset,
    type DatasetTransformation as DatasetTransformation,
    type DatasetVersion as DatasetVersion,
    type FeedbackCreateCoreSchema as FeedbackCreateCoreSchema,
    type SortByDatasetColumn as SortByDatasetColumn,
    type DatasetsItemsCursorGetPagination as DatasetsItemsCursorGetPagination,
    type DatasetListV2Params as DatasetListV2Params,
  };

  export {
    Examples as Examples,
    type ExampleUpdateMetadataResponse as ExampleUpdateMetadataResponse,
    type ExampleDeleteParams as ExampleDeleteParams,
    type ExampleUpdateMetadataParams as ExampleUpdateMetadataParams,
  };

  export {
    ExperimentRuns as ExperimentRuns,
    type ExperimentRunQueryResponse as ExperimentRunQueryResponse,
    type ExperimentRunQueryResponsesItemsCursorPostPagination as ExperimentRunQueryResponsesItemsCursorPostPagination,
    type ExperimentRunQueryParams as ExperimentRunQueryParams,
  };
}
