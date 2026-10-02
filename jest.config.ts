import type { Config } from 'jest';

const config: Config = {
  projects: [
    {
      displayName: 'stainless',
      testEnvironment: 'node',
      transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: 'inline' }],
      },
      moduleNameMapper: {
        '^langsmith$': '<rootDir>/src/index.ts',
        '^langsmith/(.*)$': '<rootDir>/src/$1',
        // src/lib (reached through src/index.ts) uses `.js`-suffixed relative imports
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      modulePathIgnorePatterns: [
        '<rootDir>/ecosystem-tests/',
        '<rootDir>/dist/',
        '<rootDir>/deno/',
        '<rootDir>/deno_tests/',
        '<rootDir>/packages/',
      ],
      testMatch: ['<rootDir>/tests/**/*.test.ts'],
      testPathIgnorePatterns: ['scripts'],
    },
    {
      // langsmith-sdk's jest.config.cjs, for the hand-written code under src/lib.
      // Runs as ESM: scripts/test sets NODE_OPTIONS=--experimental-vm-modules.
      displayName: 'lib',
      preset: 'ts-jest/presets/default-esm',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/src/lib/tests/**/*.test.ts'],
      modulePathIgnorePatterns: ['<rootDir>/dist/'],
      testPathIgnorePatterns: [
        '\\.int\\.test\\.[tj]s$',
        '\\.vitesttest\\.',
        '\\.vitesteval\\.',
        'cache.*\\.int\\.test\\.ts$',
        'rate_limit.*\\.int\\.test\\.ts$',
        'ai_sdk_evaluate\\.int\\.test\\.ts$',
      ],
      moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
      },
      transform: {
        '^.+\\.m?[tj]sx?$': [
          'ts-jest',
          {
            useESM: true,
            diagnostics: false,
            isolatedModules: true,
            tsconfig: '<rootDir>/tsconfig.esm.json',
          },
        ],
      },
      setupFiles: ['dotenv/config'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
    },
  ],
  // langsmith-sdk's `pnpm test` passes --testTimeout 30000
  testTimeout: 30_000,
  maxConcurrency: 2,
};

export default config;
