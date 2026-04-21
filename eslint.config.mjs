import { fileURLToPath } from 'node:url'

import tseslint from '@typescript-eslint/eslint-plugin'
import { defineConfig, globalIgnores } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettier,
  {
    plugins: {
      '@typescript-eslint': tseslint,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
      'react-hooks/preserve-manual-memoization': 'off',
      'react-hooks/incompatible-library': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
      'react-hooks/static-components': 'off',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['~/*'],
              message: 'Use @/ instead of ~/. The ~/ alias has been removed.'
            },
            {
              group: ['@/components/button'],
              message: 'Import Button from @/components/ui/button'
            },
            {
              group: ['@/components/card'],
              message: 'Import Card from @/components/ui/card'
            },
            {
              group: ['@/components/link'],
              message: 'Import Link from @/components/ui/link'
            },
            {
              group: ['@/components/nav-link'],
              message:
                'nav-link.tsx is deleted. Use Link from @/components/ui/link with variant="nav"'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir
      }
    },
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error'
    }
  },
  {
    files: ['**/*.test.*', '**/*.spec.*', '**/__tests__/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        jest: true
      }
    },
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off'
    }
  },
  globalIgnores([
    '.next/**',
    '.worktrees/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'public/wasm_exec.js'
  ])
])
