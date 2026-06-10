/**
 * Astro app — extends the shared monorepo rules and resolves THIS package's
 * TS path aliases (@repo/*) via its tsconfig. Edit shared rules in the root
 * `.dependency-cruiser.cjs`.
 *
 * Note: `.astro` files are not parsed by dependency-cruiser, so `.ts`/`.tsx`
 * modules imported only from `.astro` pages may surface as orphan warnings.
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  extends: '../../.dependency-cruiser.cjs',
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
  },
}
