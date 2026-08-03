import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import astro from 'eslint-plugin-astro'
import reactHooks from 'eslint-plugin-react-hooks'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import globals from 'globals'

// Mirrors apps/payload/eslint.config.mjs (same house rules) with two differences:
// no Next.js plugin, and `.astro` files are linted by eslint-plugin-astro on
// syntax-only rules — type-aware linting inside frontmatter is not worth the
// tsconfig contortions, `astro check` already type-checks those files.
export default [
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'eslint.config.mjs',
      // Shipped to the browser verbatim via a `?raw` import: plain JS, no imports,
      // no TS. Linting it as part of the app program only produces noise.
      'src/lib/debug/browser-capture.ts',
    ],
  },

  js.configs.recommended,

  // Type-aware linting — .ts / .tsx only. `recommendedTypeChecked`, not the
  // `strict`/`stylistic` sets apps/payload uses: those add `prefer-nullish-coalescing`,
  // and the `||` fallbacks throughout lib/seo are deliberate (an empty string must
  // fall through to the site-wide default, which `??` would keep).
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, ...globals.browser },
    },
  },

  // Disallow eslint-disable of the rules below (see the house-rules block).
  comments.recommended,

  // React islands.
  {
    files: ['**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },

  // .astro components: parser + Astro-specific rules, no type-aware checks.
  ...astro.configs.recommended,

  // House rules — the non-negotiable ones. Scoped to .ts/.tsx: the rest need the
  // @typescript-eslint plugin, which only the TS configs above register.
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // Type assertions are forbidden. Only `as const` survives.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSTypeAssertion',
          message:
            'Type assertions (<T>x) are forbidden — use a type guard, proper types, or a Zod schema.',
        },
        {
          selector: "TSAsExpression:not(:has(> TSTypeReference[typeName.name='const']))",
          message:
            'Type assertions (`x as T`) are forbidden — use a type guard, proper types, or a Zod schema. Only `as const` is allowed.',
        },
      ],
      // Numbers in template literals are fine.
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Allow intentionally-unused identifiers prefixed with `_`.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // No bypassing the type system.
      '@typescript-eslint/ban-ts-comment': 'error',
      // …and the assertion ban itself cannot be turned off inline.
      '@eslint-community/eslint-comments/no-restricted-disable': [
        'error',
        'no-restricted-syntax',
        '@typescript-eslint/ban-ts-comment',
      ],
      '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
    },
  },

  // The assertion ban applies to new code. These five files predate it and cast at
  // the REST/global boundary (`res.json() as T`, `window.grecaptcha`); clearing them
  // means validating those payloads — a separate job, not a lint config's business.
  // Do not add to this list; add a type guard instead.
  {
    files: [
      'src/components/preview/live-preview-listener.tsx',
      'src/lib/link/resolve-link.ts',
      'src/lib/payload/client.ts',
      'src/lib/payload/forms.ts',
      'src/lib/recaptcha.ts',
    ],
    rules: { 'no-restricted-syntax': 'off' },
  },

  // Astro's generated ambient types are reached via triple-slash by design.
  {
    files: ['**/*.d.ts'],
    rules: { '@typescript-eslint/triple-slash-reference': 'off' },
  },

  // Config / plain-JS files: no type-aware linting (not part of the TS program).
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: { globals: globals.node },
  },
]
