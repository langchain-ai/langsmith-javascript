// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../core/resource';
import { APIPromise } from '../core/api-promise';
import { RequestOptions } from '../internal/request-options';

export class Sql extends APIResource {
  /**
   * **Beta:** This endpoint is in active development and may change without notice.
   *
   * GET with body payload — no resources created. Returns the rows matching the
   * read-only SQL query passed as the request payload, limited to the given tracing
   * projects. Results are limited to a configured number of rows, 1000 by default.
   */
  query(body: SqlQueryParams, options?: RequestOptions): APIPromise<SqlQueryResponse> {
    return this._client.post('/v2/sql/query', { body, ...options });
  }
}

export interface SqlQueryResponse {
  columns?: Array<SqlQueryResponse.Column>;

  execution_time_ms?: number;

  /**
   * IsTruncated reports that the query matched rows not included in Rows.
   */
  is_truncated?: boolean;

  row_count?: number;

  /**
   * Rows holds at most the configured row limit (1000 by default), each ordered like
   * Columns.
   */
  rows?: Array<Array<unknown>>;

  /**
   * TruncationReason is "row_limit" when the query matched more rows than the row
   * limit, "size_limit" when the rows past about 10 MB were left out, or null.
   */
  truncation_reason?: 'row_limit' | 'size_limit' | null;

  /**
   * Warnings contains query planning warnings. Empty when there are no warnings.
   */
  warnings?: Array<string>;
}

export namespace SqlQueryResponse {
  export interface Column {
    /**
     * DataType is how the column's values are encoded in JSON: uuid, string, integer,
     * float, boolean, timestamp and date (RFC 3339 strings), binary (base64 strings),
     * list, object or null. Float values JSON cannot represent are the strings "NaN",
     * "Infinity" and "-Infinity".
     */
    data_type?:
      | 'uuid'
      | 'string'
      | 'integer'
      | 'float'
      | 'boolean'
      | 'timestamp'
      | 'date'
      | 'binary'
      | 'list'
      | 'object'
      | 'null';

    name?: string;
  }
}

export interface SqlQueryParams {
  /**
   * ProjectIDs are the tracing projects the query can read.
   */
  project_ids: Array<string>;

  /**
   * Query is a single read-only SQL statement. Queries over runs need a start_time
   * lower bound.
   */
  query: string;
}

export declare namespace Sql {
  export { type SqlQueryResponse as SqlQueryResponse, type SqlQueryParams as SqlQueryParams };
}
