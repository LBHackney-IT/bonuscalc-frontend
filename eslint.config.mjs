import coreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierFlat from 'eslint-config-prettier/flat'
import babelParser from '@babel/eslint-parser'
import globals from 'globals'
import pluginCypress from 'eslint-plugin-cypress'
import pluginJest from 'eslint-plugin-jest'
import pluginReact from 'eslint-plugin-react'

export default [
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/build/**',
      '**/public/**',
      '**/db/**',
    ],
  },
  ...coreWebVitals,
  prettierFlat,
  pluginCypress.configs.recommended,
  {
    files: ['**/*.test.{js,jsx}', '**/__tests__/**'],
    ...pluginJest.configs['flat/recommended'],
  },

  {
    plugins: { react: pluginReact },
  },

  {
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
        ...globals.jest,
      },
    },
    settings: {
      react: { version: '19.2.8' },
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-document-import-in-page': 'off',
      'linebreak-style': ['error', 'unix'],
      'require-atomic-updates': 'off',
      'react/jsx-uses-vars': 2,
      'react-hooks/component-hook-factories': 'off',
      'react-hooks/config': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/set-state-in-render': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/unsupported-syntax': 'off',
      'react-hooks/use-memo': 'off',
    },
  },
]
