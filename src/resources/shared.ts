// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

export type QueryPatchEvent = Array<QueryPatchOperation>;

export interface QueryPatchOperation {
  op: 'add' | 'replace';

  path: string;

  value?: unknown;
}
