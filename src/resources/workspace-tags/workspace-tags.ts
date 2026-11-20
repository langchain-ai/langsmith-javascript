// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as KeysAPI from './keys/keys';
import { KeyCreateParams, KeyListResponse, KeyUpdateParams, Keys, TagKey } from './keys/keys';
import * as ValuesAPI from './keys/values';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class WorkspaceTags extends APIResource {
  keys: KeysAPI.Keys = new KeysAPI.Keys(this._client);

  /**
   * List the workspace's tag keys, each with its values.
   *
   * With resource_type, only values applied to at least one resource of that type
   * are returned, and keys with no such values are left out.
   */
  list(
    query: WorkspaceTagListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<WorkspaceTagListResponse> {
    return this._client.get('/api/v1/workspaces/current/tags', { query, ...options });
  }
}

export interface TagKeyWithValues {
  id: string;

  created_at: string;

  key: string;

  updated_at: string;

  values: Array<ValuesAPI.TagValue>;

  description?: string | null;
}

export type WorkspaceTagListResponse = Array<TagKeyWithValues>;

export interface WorkspaceTagListParams {
  resource_type?:
    | 'agent'
    | 'custom_app'
    | 'dashboard'
    | 'dataset'
    | 'deployment'
    | 'evaluator'
    | 'experiment'
    | 'fleet_integration'
    | 'mcp_server'
    | 'project'
    | 'prompt'
    | 'queue'
    | 'sandbox'
    | 'skill'
    | 'snapshot_name'
    | null;
}

WorkspaceTags.Keys = Keys;

export declare namespace WorkspaceTags {
  export {
    type TagKeyWithValues as TagKeyWithValues,
    type WorkspaceTagListResponse as WorkspaceTagListResponse,
    type WorkspaceTagListParams as WorkspaceTagListParams,
  };

  export {
    Keys as Keys,
    type TagKey as TagKey,
    type KeyListResponse as KeyListResponse,
    type KeyCreateParams as KeyCreateParams,
    type KeyUpdateParams as KeyUpdateParams,
  };
}
