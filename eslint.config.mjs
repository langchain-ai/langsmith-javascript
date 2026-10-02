// @ts-check
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default tseslint.config(
  {
    ignores: [
      'dist/',
      'internal/environment_tests/**',
      // vendored third-party code under the hand-written SDK
      'src/lib/utils/chalk/**',
      'src/lib/utils/console-table-printer/**',
      'src/lib/utils/simple-wcswidth/**',
    ],
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { sourceType: 'module' },
    },
    files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.js', '**/*.mjs', '**/*.cjs'],
    ignores: ['dist/'],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'unused-imports': unusedImports,
    },
    rules: {
      'no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: '^langsmith(/.*)?',
              message: 'Use a relative import, not a package import.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['tests/**', 'examples/**'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
);
