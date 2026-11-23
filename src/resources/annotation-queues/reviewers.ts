// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import {
  ItemsCursorGetPagination,
  type ItemsCursorGetPaginationParams,
  PagePromise,
} from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Reviewers extends APIResource {
  /**
   * List a queue's reviewers with how many reviews each has waiting, how many they
   * have completed, and when they last completed one. Includes everyone on the
   * queue's roster and anyone else who has reviewed on the queue, such as people
   * removed from the roster; is_on_roster tells them apart. name and email are left
   * out when a reviewer cannot be looked up. Only single queues are supported, and
   * the endpoint returns 501 unless multi-reviewer is on for the workspace.
   */
  list(
    queueID: string,
    query: ReviewerListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<ReviewerListResponsesItemsCursorGetPagination, ReviewerListResponse> {
    return this._client.getAPIList(
      path`/api/v1/platform/annotation-queues/${queueID}/reviewers`,
      ItemsCursorGetPagination<ReviewerListResponse>,
      { query, ...options },
    );
  }
}

export type ReviewerListResponsesItemsCursorGetPagination = ItemsCursorGetPagination<ReviewerListResponse>;

export interface ReviewerListResponse {
  completed_count?: number;

  email?: string;

  identity_id?: string;

  is_on_roster?: boolean;

  last_active_at?: string;

  name?: string;

  pending_count?: number;
}

export interface ReviewerListParams extends ItemsCursorGetPaginationParams {}

export declare namespace Reviewers {
  export {
    type ReviewerListResponse as ReviewerListResponse,
    type ReviewerListResponsesItemsCursorGetPagination as ReviewerListResponsesItemsCursorGetPagination,
    type ReviewerListParams as ReviewerListParams,
  };
}
