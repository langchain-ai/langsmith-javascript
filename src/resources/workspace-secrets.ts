// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { buildHeaders } from '../internal/headers';
import { RequestOptions } from '../internal/request-options';
import { path } from '../internal/utils/path';

export class WorkspaceSecrets extends APIResource {
  /**
   * List the current workspace's secret keys. Values are never returned.
   */
  list(
    query: WorkspaceSecretListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<WorkspaceSecretListResponse> {
    return this._client.get('/api/v1/workspaces/current/secrets', { query, ...options });
  }

  /**
   * Delete a workspace secret and its allowed hosts.
   *
   * Requires workspace admin. Missing keys succeed.
   */
  delete(key: string, options?: RequestOptions): APIPromise<void> {
    return this._client.delete(path`/api/v1/workspaces/current/secrets/${key}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Create or update a workspace secret and the hosts it may be sent to.
   *
   * Requires workspace admin. Omit value to keep the current one; it is required to
   * create a secret. configs replaces the secret's hosts; omitted or empty restores
   * the built-in defaults for known provider keys. The value is never returned.
   */
  upsert(
    key: string,
    body: WorkspaceSecretUpsertParams,
    options?: RequestOptions,
  ): APIPromise<WorkspaceSecret> {
    return this._client.put(path`/api/v1/workspaces/current/secrets/${key}`, { body, ...options });
  }
}

/**
 * A workspace secret's key and the hosts it may be sent to. Never the value.
 */
export interface WorkspaceSecret {
  /**
   * Secret name, e.g. OPENAI_API_KEY.
   */
  key: string;

  /**
   * Hosts the secret may be sent to, with built-in defaults applied. Listed secrets
   * include it only when include_configs is true.
   */
  configs?: Array<WorkspaceSecret.Config>;
}

export namespace WorkspaceSecret {
  export interface Config {
    /**
     * Exact host or a leading '\*.' wildcard, e.g. 'api.openai.com'.
     */
    host_pattern: string;

    /**
     * DEFAULT for a built-in provider host, CUSTOM for one an admin set.
     */
    source: 'DEFAULT' | 'CUSTOM';

    /**
     * Omitted for a built-in default.
     */
    id?: string | null;

    /**
     * Omitted for a built-in default.
     */
    created_at?: string | null;

    /**
     * HTTP header the secret is sent in. Null leaves it to the consumer.
     */
    header_name?: string | null;

    /**
     * Header value with '{value}' replaced by the secret, e.g. 'Bearer {value}'. Null
     * sends the raw secret.
     */
    header_value_template?: string | null;

    /**
     * Omitted for a built-in default.
     */
    updated_at?: string | null;
  }
}

export type WorkspaceSecretListResponse = Array<WorkspaceSecret>;

export interface WorkspaceSecretListParams {
  /**
   * If true, include the hosts each secret may be sent to.
   */
  include_configs?: boolean;
}

export interface WorkspaceSecretUpsertParams {
  /**
   * Full replacement of the allowed hosts. Omitted or empty removes custom hosts so
   * the built-in defaults, if any, apply.
   */
  configs?: Array<WorkspaceSecretUpsertParams.Config> | null;

  /**
   * Secret value. Required to create a secret; omit to keep the current value.
   */
  value?: string | null;
}

export namespace WorkspaceSecretUpsertParams {
  /**
   * A host a workspace secret may be sent to, and how it is sent.
   */
  export interface Config {
    /**
     * Exact host or a leading '\*.' wildcard, e.g. 'api.openai.com'.
     */
    host_pattern: string;

    /**
     * HTTP header the secret is sent in. Null leaves it to the consumer.
     */
    header_name?: string | null;

    /**
     * Header value with '{value}' replaced by the secret, e.g. 'Bearer {value}'. Null
     * sends the raw secret.
     */
    header_value_template?: string | null;
  }
}

export declare namespace WorkspaceSecrets {
  export {
    type WorkspaceSecret as WorkspaceSecret,
    type WorkspaceSecretListResponse as WorkspaceSecretListResponse,
    type WorkspaceSecretListParams as WorkspaceSecretListParams,
    type WorkspaceSecretUpsertParams as WorkspaceSecretUpsertParams,
  };
}
