import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const astroFiles = ['**/*.astro'];
const typescriptFiles = ['**/*.ts'];

export default defineConfig([
  globalIgnores([
    '.astro/**',
    '.cache/**',
    'build/**',
    'coverage/**',
    'dist/**',
    'node_modules/**',
    'playwright-report/**',
    'test-results/**',
  ]),
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: globals.node,
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: astroFiles,
  })),
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: typescriptFiles,
  })),
  ...astro.configs.recommended,
  {
    files: typescriptFiles,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: [...typescriptFiles, ...astroFiles],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'inline-type-imports',
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "AssignmentExpression[left.type='MemberExpression'][left.property.name='innerHTML']",
          message: '使用 textContent、replaceChildren 或显式 DOM 节点，避免 HTML 字符串注入。',
        },
        {
          selector:
            "AssignmentExpression[left.type='MemberExpression'][left.property.name='outerHTML']",
          message: '使用安全的 DOM 更新方式，避免 HTML 字符串注入。',
        },
        {
          selector:
            "CallExpression[callee.type='MemberExpression'][callee.property.name='insertAdjacentHTML']",
          message: '使用安全的 DOM 更新方式，避免 HTML 字符串注入。',
        },
      ],
    },
  },
  {
    files: astroFiles,
    rules: {
      'astro/no-set-html-directive': 'error',
    },
  },
  {
    files: [
      'src/pages/**/*.{astro,ts}',
      'src/components/**/*.{astro,ts}',
      'src/layouts/**/*.{astro,ts}',
      'src/data/site-search-index.ts',
      'src/data/ticketing.ts',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/data/locations',
                '**/data/locations.ts',
                '**/data/performances',
                '**/data/performances.ts',
                '**/data/productions',
                '**/data/productions/**',
                '**/data/production-artworks',
                '**/data/production-artworks.ts',
                '**/data/production-artwork-manifest',
                '**/data/production-artwork-manifest.ts',
                '**/data/ticket-seating-plans',
                '**/data/ticket-seating-plans.ts',
                '**/data/localized/packages',
                '**/data/localized/packages.ts',
              ],
              allowTypeImports: true,
              message: '页面消费者必须通过当前 ContentSnapshot 或窄领域 API 读取构建内容。',
            },
          ],
        },
      ],
    },
  },
]);
