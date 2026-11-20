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

export class Volumes extends APIResource {
  /**
   * **Beta:** This API is in active development and may change without notice.
   * Requires sandbox volumes to be enabled for your workspace. Create an empty
   * volume that can be attached to sandboxes at a mount path. The size is rounded up
   * to a whole GiB.
   */
  create(body: VolumeCreateParams, options?: RequestOptions): APIPromise<VolumeResponse> {
    return this._client.post('/api/v2/sandboxes/volumes', { body, ...options });
  }

  /**
   * **Beta:** This API is in active development and may change without notice.
   * Requires sandbox volumes to be enabled for your workspace. Get a sandbox volume
   * by ID or name, with its current attachments.
   */
  retrieve(volume: string, options?: RequestOptions): APIPromise<VolumeResponse> {
    return this._client.get(path`/api/v2/sandboxes/volumes/${volume}`, options);
  }

  /**
   * **Beta:** This API is in active development and may change without notice.
   * Requires sandbox volumes to be enabled for your workspace. Update a volume's
   * description or labels. Each field sent replaces the stored value; omitted fields
   * are unchanged. Null, an empty description, or an empty labels object clears it.
   * Only the volume's creator, or a role with sandboxes:exec, may update it.
   */
  update(volume: string, body: VolumeUpdateParams, options?: RequestOptions): APIPromise<VolumeResponse> {
    return this._client.patch(path`/api/v2/sandboxes/volumes/${volume}`, { body, ...options });
  }

  /**
   * **Beta:** This API is in active development and may change without notice.
   * Requires sandbox volumes to be enabled for your workspace. List the workspace's
   * sandbox volumes with their current attachments.
   */
  list(
    query: VolumeListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<VolumeResponsesItemsCursorGetPagination, VolumeResponse> {
    return this._client.getAPIList('/api/v2/sandboxes/volumes', ItemsCursorGetPagination<VolumeResponse>, {
      query,
      ...options,
    });
  }

  /**
   * **Beta:** This API is in active development and may change without notice.
   * Requires sandbox volumes to be enabled for your workspace. Delete a volume and
   * its data. A volume attached to any sandbox cannot be deleted. Storage is
   * reclaimed asynchronously. Only the volume's creator, or a role with
   * sandboxes:exec, may delete it.
   */
  delete(volume: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v2/sandboxes/volumes/${volume}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * **Beta:** This API is in active development and may change without notice.
   * Requires sandbox volumes to be enabled for your workspace. Create a new volume
   * holding a copy-on-write copy of an existing one. A volume attached read-write to
   * a sandbox that is not stopped cannot be cloned. Only the volume's creator, or a
   * role with sandboxes:exec, may clone it.
   */
  clone(volume: string, body: VolumeCloneParams, options?: RequestOptions): APIPromise<VolumeResponse> {
    return this._client.post(path`/api/v2/sandboxes/volumes/${volume}/clone`, { body, ...options });
  }
}

export type VolumeResponsesItemsCursorGetPagination = ItemsCursorGetPagination<VolumeResponse>;

export interface VolumeResponse {
  id?: string;

  attachments?: Array<VolumeResponse.Attachment>;

  created_at?: string;

  created_by?: string;

  description?: string;

  labels?: { [key: string]: string };

  name?: string;

  size_bytes?: number;

  source_volume_id?: string;

  status?: string;

  status_message?: string;

  updated_at?: string;

  updated_by?: string;
}

export namespace VolumeResponse {
  export interface Attachment {
    mount_path?: string;

    read_only?: boolean;

    sandbox_id?: string;

    sandbox_name?: string;
  }
}

export interface VolumeCreateParams {
  /**
   * Name is unique within the workspace.
   */
  name: string;

  /**
   * SizeBytes is the volume's capacity, rounded up to a whole GiB.
   */
  size_bytes: number;

  description?: string;

  labels?: { [key: string]: string };
}

export interface VolumeUpdateParams {
  /**
   * Description replaces the description; null or an empty string clears it.
   */
  description?: string | null;

  /**
   * Labels replaces every label; null or an empty object clears them.
   */
  labels?: { [key: string]: string } | null;
}

export interface VolumeListParams extends ItemsCursorGetPaginationParams {
  /**
   * Filter by name substring
   */
  name_contains?: string;
}

export interface VolumeCloneParams {
  /**
   * Name of the new volume, unique within the workspace.
   */
  name: string;

  description?: string;

  labels?: { [key: string]: string };
}

export declare namespace Volumes {
  export {
    type VolumeResponse as VolumeResponse,
    type VolumeResponsesItemsCursorGetPagination as VolumeResponsesItemsCursorGetPagination,
    type VolumeCreateParams as VolumeCreateParams,
    type VolumeUpdateParams as VolumeUpdateParams,
    type VolumeListParams as VolumeListParams,
    type VolumeCloneParams as VolumeCloneParams,
  };
}
