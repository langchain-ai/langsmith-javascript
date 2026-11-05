// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

export class Examples extends APIResource {
  /**
   * Soft-delete an example, preserving prior versions and their attachments. If the
   * latest version is already deleted, the request succeeds without creating another
   * version. Deletion is recorded at the current time or just after the latest
   * version, whichever is later. For future-dated versions, latest reads reflect
   * deletion immediately; timestamp reads reflect deletion only at or after the
   * recorded deletion timestamp.
   */
  delete(exampleID: string, params: ExampleDeleteParams, options?: RequestOptions): APIPromise<void> {
    const { dataset_id } = params;
    return this._client.delete(path`/api/v1/platform/datasets/${dataset_id}/examples/${exampleID}`, {
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Applies the same metadata changes, in order, to every listed example in a
   * dataset. Examples that are not in the dataset or were deleted are skipped; the
   * rest are updated together, so if the update fails none of them change. Answers
   * 207 with one status per submitted example ID: UPDATED, or NOT_FOUND for a
   * skipped example. Metadata keys the operations do not name keep their values. To
   * add examples to a split or remove them from one, use ARRAY_ADD or ARRAY_REMOVE
   * on the dataset_split key. Requires permission to update datasets.
   */
  updateMetadata(
    datasetID: string,
    body: ExampleUpdateMetadataParams,
    options?: RequestOptions,
  ): APIPromise<ExampleUpdateMetadataResponse> {
    return this._client.patch(path`/api/v1/platform/datasets/${datasetID}/examples/metadata`, {
      body,
      ...options,
    });
  }
}

export interface ExampleUpdateMetadataResponse {
  /**
   * One entry per submitted example ID, in request order.
   */
  statuses: Array<ExampleUpdateMetadataResponse.Status>;
}

export namespace ExampleUpdateMetadataResponse {
  export interface Status {
    /**
     * The example ID, as submitted.
     */
    id: string;

    /**
     * UPDATED if the example's metadata was changed; NOT_FOUND if the example is not
     * in the dataset or was deleted.
     */
    status: 'UPDATED' | 'NOT_FOUND';

    /**
     * Why the example was not updated. Omitted when it was.
     */
    description?: string;
  }
}

export interface ExampleDeleteParams {
  /**
   * Dataset ID
   */
  dataset_id: string;
}

export interface ExampleUpdateMetadataParams {
  /**
   * The IDs of the examples to change; at most 10000. IDs of examples that are not
   * in the dataset, or were deleted, are skipped and reported as NOT_FOUND.
   */
  example_ids: Array<string>;

  /**
   * The metadata changes to apply, in order; at most 50, of which at most 10 are
   * array operations.
   */
  operations: Array<ExampleUpdateMetadataParams.Operation>;
}

export namespace ExampleUpdateMetadataParams {
  export interface Operation {
    /**
     * The top-level metadata key to change, at most 255 bytes. Use dataset_split with
     * ARRAY_ADD or ARRAY_REMOVE to change which splits the examples belong to.
     */
    key: string;

    /**
     * The change to make: SET replaces the value at key; ARRAY_ADD adds values to the
     * list at key; ARRAY_REMOVE removes values from it. For array operations, a
     * missing or non-list value starts as an empty list, except for dataset_split,
     * where it starts as the base split.
     */
    operation: 'SET' | 'ARRAY_ADD' | 'ARRAY_REMOVE';

    /**
     * The new value for a SET operation; any JSON value, at most 64 KB. Ignored by
     * array operations.
     */
    value?: unknown;

    /**
     * The values to add or remove for an array operation; at most 1000 values of at
     * most 255 bytes each. Ignored by SET.
     */
    values?: Array<string>;
  }
}

export declare namespace Examples {
  export {
    type ExampleUpdateMetadataResponse as ExampleUpdateMetadataResponse,
    type ExampleDeleteParams as ExampleDeleteParams,
    type ExampleUpdateMetadataParams as ExampleUpdateMetadataParams,
  };
}
