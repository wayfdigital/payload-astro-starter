import { Config } from 'payload'
import { sendExampleTask } from '@/payload/jobs/tasks/sendExample'

/**
 * Payload Jobs Queue.
 *
 * Wires up the `payload-jobs` collection and the `/api/payload-jobs/run`
 * endpoint. Email sends run here so HTTP requests return immediately and
 * transient transport failures retry automatically.
 *
 * To add work: push a task to `tasks` (or a workflow to `workflows`) and
 * enqueue it via `payload.jobs.queue(...)`.
 */
export const jobsConfig: Config['jobs'] = {
  // Keep completed/failed job rows so sends can be inspected in the admin.
  deleteJobOnComplete: false,
  tasks: [sendExampleTask],
  workflows: [],
  // Only authenticated admins may trigger the run endpoint.
  access: {
    run: ({ req }) => Boolean(req.user),
  },
}
