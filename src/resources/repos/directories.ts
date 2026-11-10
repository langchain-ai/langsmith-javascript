// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as DirectoriesAPI from './directories';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Directories extends APIResource {
  /**
   * Resolves the flattened file tree for an agent or skill repository at a specific
   * commit, tag, or latest.
   *
   * @example
   * ```ts
   * const directories = await client.repos.directories.list(
   *   'repo',
   *   { owner: 'owner' },
   * );
   * ```
   */
  list(
    repo: string,
    params: DirectoryListParams,
    options?: RequestOptions,
  ): APIPromise<DirectoryListResponse> {
    const { owner, ...query } = params;
    return this._client.get(path`/api/v1/platform/hub/repos/${owner}/${repo}/directories`, {
      query,
      ...options,
    });
  }

  /**
   * Deletes an agent or skill repository and its owned child file repositories.
   *
   * @example
   * ```ts
   * await client.repos.directories.delete('repo', {
   *   owner: 'owner',
   * });
   * ```
   */
  delete(repo: string, params: DirectoryDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { owner, repo_type } = params;
    return this._client.delete(path`/api/v1/platform/hub/repos/${owner}/${repo}/directories`, {
      query: { repo_type },
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Creates a new directory commit for an agent or skill repository by applying
   * file/link create, update, and delete operations. Linked directories default to
   * the LATEST selector; use COMMIT to pin one commit. The legacy commit_id write
   * field is deprecated and resolves as LATEST.
   *
   * @example
   * ```ts
   * const response = await client.repos.directories.commit(
   *   'repo',
   *   { owner: 'owner' },
   * );
   * ```
   */
  commit(
    repo: string,
    params: DirectoryCommitParams,
    options?: RequestOptions,
  ): APIPromise<DirectoryCommitResponse> {
    const { owner, ...body } = params;
    return this._client.post(path`/api/v1/platform/hub/repos/${owner}/${repo}/directories/commits`, {
      body,
      ...options,
    });
  }
}

export type DirectorySelector =
  | DirectorySelector.DirectoryLatestSelector
  | DirectorySelector.DirectoryCommitSelector;

export namespace DirectorySelector {
  export interface DirectoryLatestSelector {
    type: 'LATEST';
  }

  export interface DirectoryCommitSelector {
    commit_id: string;

    type: 'COMMIT';
  }
}

export interface FileEntry {
  content: string;

  type: 'file';
}

export interface DirectoryListResponse {
  commit_hash: string;

  commit_id: string;

  files: {
    [key: string]:
      | FileEntry
      | DirectoryListResponse.DirectoryAgentEntryOutput
      | DirectoryListResponse.DirectorySkillEntryOutput;
  };
}

export namespace DirectoryListResponse {
  export interface DirectoryAgentEntryOutput {
    commit_hash: string;

    owner: string;

    repo_handle: string;

    type: 'agent';

    /**
     * The authored selection policy for this linked directory.
     */
    selector?: DirectoriesAPI.DirectorySelector;
  }

  export interface DirectorySkillEntryOutput {
    commit_hash: string;

    owner: string;

    repo_handle: string;

    type: 'skill';

    /**
     * The authored selection policy for this linked directory.
     */
    selector?: DirectoriesAPI.DirectorySelector;
  }
}

export interface DirectoryCommitResponse {
  commit?: DirectoryCommitResponse.Commit;
}

export namespace DirectoryCommitResponse {
  export interface Commit {
    id?: string;

    commit_hash?: string;

    created_at?: string;
  }
}

export interface DirectoryListParams {
  /**
   * Path param: Repository owner handle or '-' for current tenant
   */
  owner: string;

  /**
   * Query param: Commit hash/tag to resolve (defaults to latest)
   */
  commit?: string;
}

export interface DirectoryDeleteParams {
  /**
   * Path param: Repository owner handle or '-' for current tenant
   */
  owner: string;

  /**
   * Query param: Repository type to delete; a different type is treated as not found
   */
  repo_type?: 'agent' | 'skill';
}

export interface DirectoryCommitParams {
  /**
   * Path param: Repository owner handle or '-' for current tenant
   */
  owner: string;

  /**
   * Body param: Paths to create, update, link, delete, or unlink. Use null to delete
   * or unlink an existing path.
   */
  files?: {
    [key: string]:
      | FileEntry
      | DirectoryCommitParams.DirectoryAgentEntryInput
      | DirectoryCommitParams.DirectorySkillEntryInput
      | null;
  };

  /**
   * Body param
   */
  parent_commit?: string;

  /**
   * Body param: SkipWebhooks suppresses Context Hub commit webhooks for this commit.
   */
  skip_webhooks?: boolean;
}

export namespace DirectoryCommitParams {
  export interface DirectoryAgentEntryInput {
    repo_handle: string;

    type: 'agent';

    /**
     * @deprecated Deprecated write input. It is accepted for compatibility but ignored
     * for selection, so the link resolves as LATEST. Omit it for LATEST or replace it
     * with selector {"type": "COMMIT", "commit_id": "<uuid>"} to pin a commit.
     * commit_id and selector are mutually exclusive.
     */
    commit_id?: string;

    /**
     * How to select the linked commit. Omit this field to use LATEST.
     */
    selector?: DirectoriesAPI.DirectorySelector;
  }

  export interface DirectorySkillEntryInput {
    repo_handle: string;

    type: 'skill';

    /**
     * @deprecated Deprecated write input. It is accepted for compatibility but ignored
     * for selection, so the link resolves as LATEST. Omit it for LATEST or replace it
     * with selector {"type": "COMMIT", "commit_id": "<uuid>"} to pin a commit.
     * commit_id and selector are mutually exclusive.
     */
    commit_id?: string;

    /**
     * How to select the linked commit. Omit this field to use LATEST.
     */
    selector?: DirectoriesAPI.DirectorySelector;
  }
}

export declare namespace Directories {
  export {
    type DirectorySelector as DirectorySelector,
    type FileEntry as FileEntry,
    type DirectoryListResponse as DirectoryListResponse,
    type DirectoryCommitResponse as DirectoryCommitResponse,
    type DirectoryListParams as DirectoryListParams,
    type DirectoryDeleteParams as DirectoryDeleteParams,
    type DirectoryCommitParams as DirectoryCommitParams,
  };
}
