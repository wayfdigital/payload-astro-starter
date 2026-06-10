import { Config } from 'payload'

/**
 * Payload Jobs Queue.
 *
 * Initialized empty — no tasks or workflows yet. This wires up the
 * `payload-jobs` collection and the `/api/payload-jobs/run` endpoint so
 * background jobs can be added later without another infra change.
 *
 * To add work: push a task to `tasks` (or a workflow to `workflows`) and
 * enqueue it via `payload.jobs.queue(...)`.
 */
export const jobsConfig: Config['jobs'] = {
  tasks: [],
  workflows: [],
  // Only authenticated admins may trigger the run endpoint.
  access: {
    run: ({ req }) => Boolean(req.user),
  },
}
