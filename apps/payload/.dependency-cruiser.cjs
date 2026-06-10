/**
 * Payload app — extends the shared monorepo rules and resolves THIS
 * package's TS path aliases (@/*, @payload-config, @repo/*) via its tsconfig.
 * Edit shared rules in the root `.dependency-cruiser.cjs`.
 *
 * @type {import('dependency-cruiser').IConfiguration}
 */
module.exports = {
  extends: '../../.dependency-cruiser.cjs',
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
  },
}
