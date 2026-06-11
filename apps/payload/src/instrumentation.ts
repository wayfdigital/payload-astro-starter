/**
 * Next.js instrumentation hook (auto-loaded once at server startup).
 *
 * Dev-only: installs server-side console capture so Payload/Next logs stream to
 * the debug-mode ingest server. The NODE_ENV guard keeps it out of production,
 * and the dynamic import keeps the capture module off the prod hot path.
 */
export async function register(): Promise<void> {
  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./debug/server-capture')
  }
}
