const fs = require('node:fs');
const path = require('node:path');

const file = path.resolve(__dirname, '../../dist/src/internal/headers.ts');
const source = fs.readFileSync(file, 'utf8');
const transformed = source.replace(
  /\/\*\*(?:(?!\*\/)[^])*\*\/\s*export type NullableHeaders\b/,
  (declaration) => declaration.replace(/\s*\* @internal\b/, ''),
);
if (!transformed.includes('export type NullableHeaders')) {
  throw new Error('NullableHeaders declaration not found');
}
fs.writeFileSync(file, transformed);
