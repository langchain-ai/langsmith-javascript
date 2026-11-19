// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import {
  ItemsCursorGetPagination,
  type ItemsCursorGetPaginationParams,
  PagePromise,
} from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Items extends APIResource {
  /**
   * Add RUN or THREAD items to a single annotation queue. RUN items require run_id
   * unless they are created from a suggested example. THREAD items require thread_id
   * and project_id.
   */
  create(
    queueID: string,
    params: ItemCreateParams,
    options?: RequestOptions,
  ): APIPromise<ItemCreateResponse> {
    const { extend_trace_retention, ...body } = params;
    return this._client.post(path`/api/v1/platform/annotation-queues/${queueID}/items`, {
      query: { extend_trace_retention },
      body,
      ...options,
    });
  }

  /**
   * Partially update mutable timestamps (added_at, last_reviewed_time) for a RUN or
   * THREAD annotation queue item. Omit a field, or pass JSON null, to leave it
   * unchanged.
   */
  update(itemID: string, params: ItemUpdateParams, options?: RequestOptions): APIPromise<ItemUpdateResponse> {
    const { queue_id, ...body } = params;
    return this._client.patch(path`/api/v1/platform/annotation-queues/${queue_id}/items/${itemID}`, {
      body,
      ...options,
    });
  }

  /**
   * List RUN and THREAD items in a single annotation queue for one review status
   * section, with opaque cursor pagination. Optional item_type=RUN|THREAD filters
   * the page. Optional min_start_time/max_start_time bound the item's trace start
   * time; items with no start time are excluded when either bound is set.
   * direction=backward returns items before the supplied cursor. The response
   * contains item metadata only, not expanded run or thread payloads.
   * status=archived returns items whose queue review requirements have been
   * satisfied, not merely items the caller personally marked completed.
   */
  list(
    queueID: string,
    query: ItemListParams,
    options?: RequestOptions,
  ): PagePromise<ItemListResponsesItemsCursorGetPagination, ItemListResponse> {
    return this._client.getAPIList(
      path`/api/v1/platform/annotation-queues/${queueID}/items`,
      ItemsCursorGetPagination<ItemListResponse>,
      { query, ...options },
    );
  }

  /**
   * Remove the final for one rubric key. The key's answer goes back to the
   * reviewers' majority, or null when they disagreed. Clearing a key that has no
   * final succeeds.
   */
  clearFinal(key: string, params: ItemClearFinalParams, options?: RequestOptions): APIPromise<void> {
    const { queue_id, item_id } = params;
    return this._client.delete(
      path`/api/v1/platform/annotation-queues/${queue_id}/items/${item_id}/finals/${key}`,
      { ...options, headers: buildHeaders([{ Accept: '*/*' }, options?.headers]) },
    );
  }

  /**
   * Log the caller's reviewer status for a RUN or THREAD annotation queue item. A
   * null status re-shows the item for this reviewer.
   */
  createStatus(
    queueItemID: string,
    body: ItemCreateStatusParams,
    options?: RequestOptions,
  ): APIPromise<ItemCreateStatusResponse> {
    return this._client.post(path`/api/v1/platform/annotation-queues/items/${queueItemID}/status`, {
      body,
      ...options,
    });
  }

  /**
   * Remove RUN or THREAD items from a single annotation queue by item ID. Both
   * active and completed items can be removed.
   */
  deleteAll(
    queueID: string,
    body: ItemDeleteAllParams,
    options?: RequestOptions,
  ): APIPromise<ItemDeleteAllResponse> {
    return this._client.post(path`/api/v1/platform/annotation-queues/${queueID}/items/delete`, {
      body,
      ...options,
    });
  }

  /**
   * Returns the number of annotation queue items in one status bucket. The two time
   * windows are independent: start_time/end_time bound when an item was archived,
   * min_start_time/max_start_time bound when its trace ran. Items with no trace
   * start time are excluded when either of the latter is set.
   */
  retrieveCount(
    queueID: string,
    query: ItemRetrieveCountParams,
    options?: RequestOptions,
  ): APIPromise<ItemRetrieveCountResponse> {
    return this._client.get(path`/api/v1/platform/annotation-queues/${queueID}/items/count`, {
      query,
      ...options,
    });
  }

  /**
   * Resolve a RUN or THREAD item to its current review section and zero-based
   * position for deep linking. The returned cursor counts RUN and THREAD items
   * together, so it is only valid for a list request with no item_type or start-time
   * filter.
   */
  retrievePlacement(
    itemID: string,
    params: ItemRetrievePlacementParams,
    options?: RequestOptions,
  ): APIPromise<ItemRetrievePlacementResponse> {
    const { queue_id } = params;
    return this._client.get(
      path`/api/v1/platform/annotation-queues/${queue_id}/items/${itemID}/placement`,
      options,
    );
  }

  /**
   * Set the answer downstream uses for one rubric key when the item's reviewers
   * disagreed. A key that already has a final can be changed even after reviewers
   * come to agree. Multi-select keys take a list of category labels in values.
   * final_set_by is empty for API key callers.
   */
  setFinal(
    key: string,
    params: ItemSetFinalParams,
    options?: RequestOptions,
  ): APIPromise<ItemSetFinalResponse> {
    const { queue_id, item_id, ...body } = params;
    return this._client.put(
      path`/api/v1/platform/annotation-queues/${queue_id}/items/${item_id}/finals/${key}`,
      { body, ...options },
    );
  }
}

export type ItemListResponsesItemsCursorGetPagination = ItemsCursorGetPagination<ItemListResponse>;

export interface ItemCreateResponse {
  items?: Array<ItemCreateResponse.Item>;
}

export namespace ItemCreateResponse {
  export interface Item {
    id?: string;

    added_at?: string;

    item_type?: 'RUN' | 'THREAD';

    /**
     * LastReviewedTime is always present on the wire (null until reviewed).
     */
    last_reviewed_time?: string;

    project_id?: string;

    queue_id?: string;

    run_id?: string;

    source_proposed_example_id?: string;

    start_time?: string;

    thread_id?: string;
  }
}

export interface ItemUpdateResponse {
  id?: string;

  added_at?: string;

  item_type?: 'RUN' | 'THREAD';

  /**
   * LastReviewedTime is always present on the wire (null until reviewed).
   */
  last_reviewed_time?: string;

  project_id?: string;

  queue_id?: string;

  run_id?: string;

  source_proposed_example_id?: string;

  start_time?: string;

  thread_id?: string;
}

export interface ItemListResponse {
  id?: string;

  added_at?: string;

  /**
   * Whether the item's reviewers agreed across its rubric keys.
   */
  agreement_state?: 'agreed' | 'disagreed' | 'none';

  assigned_to?: Array<string>;

  completed_by?: Array<string>;

  effective_added_at?: string;

  /**
   * True while a key the reviewers disagreed on has no final answer.
   */
  has_unresolved_keys?: boolean;

  item_type?: 'RUN' | 'THREAD';

  /**
   * The reviewers' result for each rubric key.
   */
  key_agreements?: { [key: string]: ItemListResponse.KeyAgreements };

  /**
   * LastReviewedTime is always present on the wire (null until reviewed).
   */
  last_reviewed_time?: string;

  project_id?: string;

  queue_id?: string;

  reserved_by?: Array<string>;

  run_id?: string;

  source_proposed_example_id?: string;

  start_time?: string;

  thread_id?: string;
}

export namespace ItemListResponse {
  export interface KeyAgreements {
    answer?: KeyAgreements.Answer;

    has_final?: boolean;

    state?: 'agreed' | 'disagreed' | 'none';
  }

  export namespace KeyAgreements {
    export interface Answer {
      score?: number;

      scores?: Array<number>;

      value?: string;

      values?: Array<string>;
    }
  }
}

export interface ItemCreateStatusResponse {
  is_archived?: boolean;

  override_added_at?: string;

  queue_item_id?: string;

  status?: 'viewed' | 'completed';
}

export type ItemDeleteAllResponse = { [key: string]: string };

export interface ItemRetrieveCountResponse {
  count?: number;
}

export interface ItemRetrievePlacementResponse {
  cursor?: string;

  item_type?: 'RUN' | 'THREAD';

  position?: number;

  section?: 'needs_my_review' | 'needs_others_review' | 'archived';
}

export interface ItemSetFinalResponse {
  answer?: ItemSetFinalResponse.Answer;

  final?: ItemSetFinalResponse.Final;

  final_set_at?: string;

  final_set_by?: string;

  has_final?: boolean;

  key?: string;

  state?: 'agreed' | 'disagreed' | 'none';
}

export namespace ItemSetFinalResponse {
  export interface Answer {
    score?: number;

    scores?: Array<number>;

    value?: string;

    values?: Array<string>;
  }

  export interface Final {
    score?: number;

    scores?: Array<number>;

    value?: string;

    values?: Array<string>;
  }
}

export interface ItemCreateParams {
  /**
   * Query param: Defaults to false. When true, upgrade the traces of added runs from
   * base to extended retention. Thread items are not upgraded.
   */
  extend_trace_retention?: boolean;

  /**
   * Body param
   */
  items?: Array<ItemCreateParams.Item>;
}

export namespace ItemCreateParams {
  export interface Item {
    item_type?: 'RUN' | 'THREAD';

    project_id?: string;

    /**
     * RUN fields
     */
    run_id?: string;

    /**
     * SessionID is an alias for project_id.
     */
    session_id?: string;

    /**
     * SourceProposedExampleID links the queue item to the suggested example it was
     * created from, when applicable.
     */
    source_proposed_example_id?: string;

    start_time?: string;

    thread_id?: string;
  }
}

export interface ItemUpdateParams {
  /**
   * Path param: Annotation queue ID
   */
  queue_id: string;

  /**
   * Body param
   */
  added_at?: string;

  /**
   * Body param
   */
  last_reviewed_time?: string;
}

export interface ItemListParams extends ItemsCursorGetPaginationParams {
  /**
   * Review section: needs_my_review, needs_others_review, or archived
   */
  status: 'needs_my_review' | 'needs_others_review' | 'archived';

  /**
   * Only completed items whose reviewers disagreed on at least one rubric key.
   * Returns 501 unless multi-reviewer queues are on for the workspace. Requires
   * status=archived
   */
  agreement?: 'disagreed';

  /**
   * Pagination direction. backward requires cursor
   */
  direction?: 'forward' | 'backward';

  /**
   * Only completed items that do (true) or do not (false) still have a disagreed
   * rubric key with no final answer. Items with no agreement result match neither
   * value. Returns 501 unless multi-reviewer queues are on for the workspace.
   * Requires status=archived
   */
  has_unresolved_keys?: boolean;

  /**
   * Filter to RUN or THREAD
   */
  item_type?: 'RUN' | 'THREAD';

  /**
   * Only items whose trace start time is at or before this timestamp. Omit or send
   * the zero time for no bound
   */
  max_start_time?: string;

  /**
   * Only items whose trace start time is at or after this timestamp. Omit or send
   * the zero time for no bound
   */
  min_start_time?: string;
}

export interface ItemClearFinalParams {
  /**
   * Annotation queue ID
   */
  queue_id: string;

  /**
   * Annotation queue item ID
   */
  item_id: string;
}

export interface ItemCreateStatusParams {
  override_added_at?: string;

  status?: 'viewed' | 'completed';
}

export interface ItemDeleteAllParams {
  item_ids?: Array<string>;
}

export interface ItemRetrieveCountParams {
  /**
   * Count bucket: all, needs_my_review, needs_others_review, or archived.
   */
  status: string;

  /**
   * Count only completed items whose reviewers disagreed on at least one rubric key.
   * Returns 501 unless multi-reviewer queues are on for the workspace. Requires
   * status=archived
   */
  agreement?: 'disagreed';

  /**
   * Archived strictly before this time. Only used when status=archived
   */
  end_time?: string;

  /**
   * Count only completed items that do (true) or do not (false) still have a
   * disagreed rubric key with no final answer. Items with no agreement result match
   * neither value. Returns 501 unless multi-reviewer queues are on for the
   * workspace. Requires status=archived
   */
  has_unresolved_keys?: boolean;

  /**
   * Trace started at or before this time
   */
  max_start_time?: string;

  /**
   * Trace started at or after this time
   */
  min_start_time?: string;

  /**
   * Archived strictly after this time. Only used when status=archived
   */
  start_time?: string;
}

export interface ItemRetrievePlacementParams {
  /**
   * Annotation queue ID
   */
  queue_id: string;
}

export interface ItemSetFinalParams {
  /**
   * Path param: Annotation queue ID
   */
  queue_id: string;

  /**
   * Path param: Annotation queue item ID
   */
  item_id: string;

  /**
   * Body param
   */
  score?: number;

  /**
   * Body param
   */
  value?: string;

  /**
   * Body param
   */
  values?: Array<string>;
}

export declare namespace Items {
  export {
    type ItemCreateResponse as ItemCreateResponse,
    type ItemUpdateResponse as ItemUpdateResponse,
    type ItemListResponse as ItemListResponse,
    type ItemCreateStatusResponse as ItemCreateStatusResponse,
    type ItemDeleteAllResponse as ItemDeleteAllResponse,
    type ItemRetrieveCountResponse as ItemRetrieveCountResponse,
    type ItemRetrievePlacementResponse as ItemRetrievePlacementResponse,
    type ItemSetFinalResponse as ItemSetFinalResponse,
    type ItemListResponsesItemsCursorGetPagination as ItemListResponsesItemsCursorGetPagination,
    type ItemCreateParams as ItemCreateParams,
    type ItemUpdateParams as ItemUpdateParams,
    type ItemListParams as ItemListParams,
    type ItemClearFinalParams as ItemClearFinalParams,
    type ItemCreateStatusParams as ItemCreateStatusParams,
    type ItemDeleteAllParams as ItemDeleteAllParams,
    type ItemRetrieveCountParams as ItemRetrieveCountParams,
    type ItemRetrievePlacementParams as ItemRetrievePlacementParams,
    type ItemSetFinalParams as ItemSetFinalParams,
  };
}
