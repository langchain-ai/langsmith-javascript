// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ValuesAPI from './values';
import {
  TagValue,
  ValueCreateParams,
  ValueDeleteParams,
  ValueListResponse,
  ValueRetrieveParams,
  ValueUpdateParams,
  Values,
} from './values';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Keys extends APIResource {
  values: ValuesAPI.Values = new ValuesAPI.Values(this._client);

  /**
   * Create Tag Key
   */
  create(body: KeyCreateParams, options?: RequestOptions): APIPromise<TagKey> {
    return this._client.post('/api/v1/workspaces/current/tag-keys', { body, ...options });
  }

  /**
   * Get Tag Key
   */
  retrieve(tagKeyID: string, options?: RequestOptions): APIPromise<TagKey> {
    return this._client.get(path`/api/v1/workspaces/current/tag-keys/${tagKeyID}`, options);
  }

  /**
   * Update Tag Key
   */
  update(tagKeyID: string, body: KeyUpdateParams, options?: RequestOptions): APIPromise<TagKey> {
    return this._client.patch(path`/api/v1/workspaces/current/tag-keys/${tagKeyID}`, { body, ...options });
  }

  /**
   * List Tag Keys
   */
  list(options?: RequestOptions): APIPromise<KeyListResponse> {
    return this._client.get('/api/v1/workspaces/current/tag-keys', options);
  }

  /**
   * Delete Tag Key
   */
  delete(tagKeyID: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/workspaces/current/tag-keys/${tagKeyID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }
}

export interface TagKey {
  id: string;

  created_at: string;

  key: string;

  updated_at: string;

  description?: string | null;
}

export type KeyListResponse = Array<TagKey>;

export interface KeyCreateParams {
  key: string;

  description?: string | null;
}

export interface KeyUpdateParams {
  description?: string | null;

  key?: string | null;
}

Keys.Values = Values;

export declare namespace Keys {
  export {
    type TagKey as TagKey,
    type KeyListResponse as KeyListResponse,
    type KeyCreateParams as KeyCreateParams,
    type KeyUpdateParams as KeyUpdateParams,
  };

  export {
    Values as Values,
    type TagValue as TagValue,
    type ValueListResponse as ValueListResponse,
    type ValueCreateParams as ValueCreateParams,
    type ValueRetrieveParams as ValueRetrieveParams,
    type ValueUpdateParams as ValueUpdateParams,
    type ValueDeleteParams as ValueDeleteParams,
  };
}
