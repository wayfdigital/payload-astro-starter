/**
 * @repo/ui — extends the shared monorepo rules and resolves THIS package's
 * tsconfig. Edit shared rules in the root `.dependency-cruiser.cjs`.
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  extends: '../../.dependency-cruiser.cjs',
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
  },
}
