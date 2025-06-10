import eslint from '@eslint/js';
import eslintFunctional from 'eslint-plugin-functional';
import eslintImport from 'eslint-plugin-import';
import {
  config as eslintTypescriptConfig,
  configs as eslintTypescriptConfigs,
  parser as eslintTypescriptParser,
} from 'typescript-eslint';
import eslintUnusedImports from 'eslint-plugin-unused-imports';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';

export default eslintTypescriptConfig({
  extends: [
    eslint.configs.recommended,
    eslintImport.flatConfigs.react,
    eslintImport.flatConfigs.recommended,
    eslintImport.flatConfigs.typescript,
    eslintReact.configs.flat.recommended,
    eslintReact.configs.flat['jsx-runtime'],
    eslintTypescriptConfigs.strict,
  ],
  plugins: {
    functional: eslintFunctional,
    'unused-imports': eslintUnusedImports,
    'react-hooks': eslintReactHooks,
  },
  languageOptions: {
    parser: eslintTypescriptParser,
    parserOptions: {
      project: './tsconfig.eslint.json',
    },
  },
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'linebreak-style': ['error', 'unix'],
    'no-constant-condition': ['error', { checkLoops: false }],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    '@typescript-eslint/consistent-type-imports': 'error',
    'functional/immutable-data': 'error',
    'functional/no-let': 'error',
    'functional/prefer-tacit': 'error',
    'import/order': 'error',
    'no-param-reassign': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'unused-imports/no-unused-imports': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: true,
      node: {
        extensions: ['.cjs', '.d.ts', '.js', '.jsx', '.mjs', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
});
