import { randomUUID } from 'node:crypto'
import { sendExampleEmailBodySchema } from '@/schemas/email'
import { defineEndpoint } from './_lib/defineEndpoint'

/**
 * Admin-only trigger that demonstrates the full pipeline:
 *
 *   POST /api/send-example-email
 *   { "to": "you@example.com", "recipientName": "Ada", "message": "Hello!" }
 *
 * Mirrors the enqueue + drain pattern: a unique queue per request isolates the
 * batch, one job per recipient, drained sequentially so a large blast never
 * opens many concurrent SMTP connections. The HTTP request never sends directly.
 */
export const sendExampleEmailEndpoint = defineEndpoint({
  path: '/send-example-email',
  method: 'post',
  collection: 'admins',
  body: sendExampleEmailBodySchema,
  handler: async ({ req, body }) => {
    const { to, ...rest } = body
    const recipients = Array.isArray(to) ? to : [to]
    const queue = `send-example-${randomUUID()}`

    await Promise.all(
      recipients.map((recipient) =>
        req.payload.jobs.queue({
          task: 'sendExample',
          input: { to: recipient, ...rest },
          queue,
        }),
      ),
    )

    const runJobs = req.payload.jobs.run({
      queue,
      limit: recipients.length,
      sequential: true,
    })
    if (recipients.length === 1) {
      // Single recipient: await so transport errors surface synchronously.
      await runJobs
    } else {
      // Bulk: drain in the background and return 202 immediately.
      void runJobs.catch((err: unknown) => {
        req.payload.logger.error({ err, msg: 'send-example drain failed' })
      })
    }

    return Response.json({ success: true, queued: recipients.length }, { status: 202 })
  },
})
