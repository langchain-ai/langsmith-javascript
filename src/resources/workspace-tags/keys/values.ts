// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Values extends APIResource {
  /**
   * Create Tag Value
   */
  create(tagKeyID: string, body: ValueCreateParams, options?: RequestOptions): APIPromise<TagValue> {
    return this._client.post(path`/api/v1/workspaces/current/tag-keys/${tagKeyID}/tag-values`, {
      body,
      ...options,
    });
  }

  /**
   * Get Tag Value
   */
  retrieve(tagValueID: string, params: ValueRetrieveParams, options?: RequestOptions): APIPromise<TagValue> {
    const { tag_key_id } = params;
    return this._client.get(
      path`/api/v1/workspaces/current/tag-keys/${tag_key_id}/tag-values/${tagValueID}`,
      options,
    );
  }

  /**
   * Update Tag Value
   */
  update(tagValueID: string, params: ValueUpdateParams, options?: RequestOptions): APIPromise<TagValue> {
    const { tag_key_id, ...body } = params;
    return this._client.patch(
      path`/api/v1/workspaces/current/tag-keys/${tag_key_id}/tag-values/${tagValueID}`,
      { body, ...options },
    );
  }

  /**
   * List Tag Values
   */
  list(tagKeyID: string, options?: RequestOptions): APIPromise<ValueListResponse> {
    return this._client.get(path`/api/v1/workspaces/current/tag-keys/${tagKeyID}/tag-values`, options);
  }

  /**
   * Delete Tag Value
   */
  delete(tagValueID: string, params: ValueDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { tag_key_id } = params;
    return this._client.delete(
      path`/api/v1/workspaces/current/tag-keys/${tag_key_id}/tag-values/${tagValueID}`,
      { ...options, headers: buildHeaders([{ Accept: '*/*' }, options?.headers]) },
    );
  }
}

export interface TagValue {
  id: string;

  created_at: string;

  tag_key_id: string;

  updated_at: string;

  value: string;

  description?: string | null;
}

export type ValueListResponse = Array<TagValue>;

export interface ValueCreateParams {
  value: string;

  description?: string | null;
}

export interface ValueRetrieveParams {
  tag_key_id: string;
}

export interface ValueUpdateParams {
  /**
   * Path param
   */
  tag_key_id: string;

  /**
   * Body param
   */
  description?: string | null;

  /**
   * Body param
   */
  value?: string | null;
}

export interface ValueDeleteParams {
  tag_key_id: string;
}

export declare namespace Values {
  export {
    type TagValue as TagValue,
    type ValueListResponse as ValueListResponse,
    type ValueCreateParams as ValueCreateParams,
    type ValueRetrieveParams as ValueRetrieveParams,
    type ValueUpdateParams as ValueUpdateParams,
    type ValueDeleteParams as ValueDeleteParams,
  };
}
