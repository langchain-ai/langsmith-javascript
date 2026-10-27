// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { Stream } from './streaming';

type PatchOperation = { op?: string; path: string; value?: unknown };
type PatchEvent = ReadonlyArray<PatchOperation>;

/** Where the items and the next page cursor live in the streamed document. */
export type QueryStreamPaths = {
  /** JSON pointer to the items array, for example `/items`. */
  items: string;
  /** JSON pointer to the next page cursor, for example `/next_cursor`. */
  nextCursor: string;
};

/**
 * Yields the items of a streamed query one at a time and follows the next page cursor across pages.
 *
 * The stream is a sequence of JSON Patch operations on the page document. While a page only appends items
 * (the root document, `<items>/-`) each item is yielded as soon as it arrives. As soon as the page inserts
 * at an index (`add <items>/<n>`) or replaces or removes an item, the position of an item is only known once
 * the page's stream ends: from then on items are held back and yielded in their final order at the end of
 * the page. Items yielded before that cannot be reordered. Patches deeper than one item are ignored: the
 * item was already yielded.
 */
export async function* iterQueryStream<Item>(
  fetch: (cursor: string | undefined) => Promise<Stream<PatchEvent>>,
  paths: QueryStreamPaths,
): AsyncGenerator<Item, void, undefined> {
  const itemPath = new RegExp(`^${escapeRegExp(paths.items)}/(-|\\d+)$`);
  let cursor: string | undefined;
  do {
    let next: string | null = null;
    // The page's items in their current order, of which the first `yielded` were already yielded.
    const doc: Array<Item> = [];
    let yielded = 0;
    let buffered = false;
    for await (const event of await fetch(cursor)) {
      for (const op of event) {
        if (op.path === '') {
          const root = op.value as Record<string, unknown>;
          next = (getPointer(root, paths.nextCursor) as string | null | undefined) ?? null;
          const items = (getPointer(root, paths.items) as Array<Item> | undefined) ?? [];
          doc.splice(yielded, doc.length - yielded, ...items.slice(yielded));
        } else if (op.path === paths.nextCursor) {
          next = (op.value as string | null | undefined) ?? null;
        } else {
          const match = itemPath.exec(op.path);
          if (!match) continue;
          const index = match[1] === '-' ? doc.length : Number(match[1]);
          if (match[1] !== '-') buffered = true;
          if (op.op === 'remove') {
            if (index >= yielded && index < doc.length) doc.splice(index, 1);
          } else if (op.op === 'replace') {
            if (index >= yielded && index < doc.length) doc[index] = op.value as Item;
          } else {
            doc.splice(Math.min(index, doc.length), 0, op.value as Item);
          }
        }
        // Append-only pages keep their streaming latency.
        while (!buffered && yielded < doc.length) yield doc[yielded++]!;
      }
    }
    while (yielded < doc.length) yield doc[yielded++]!;
    cursor = next || undefined;
  } while (cursor);
}

function getPointer(doc: unknown, pointer: string): unknown {
  let value = doc;
  for (const segment of pointer.split('/').slice(1)) {
    if (value == null || typeof value !== 'object') return undefined;
    value = (value as Record<string, unknown>)[segment.replace(/~1/g, '/').replace(/~0/g, '~')];
  }
  return value;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
