import type { Endpoint, PayloadRequest } from 'payload'
import { z } from 'zod'

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete'

type HandlerCtx<B> = {
  req: PayloadRequest
  /** Parsed + validated body (`undefined` when no `body` schema is given). */
  body: B
}

type DefineEndpointOpts<S extends z.ZodTypeAny | undefined> = {
  path: string
  method: Method
  /**
   * Restrict to a logged-in user of this collection (e.g. `'admins'`).
   * Omit for a public endpoint.
   */
  collection?: string
  /** Zod schema for the JSON body; validated before the handler runs. */
  body?: S
  handler: (
    ctx: HandlerCtx<S extends z.ZodTypeAny ? z.infer<S> : undefined>,
  ) => Response | Promise<Response>
}

/**
 * Wraps a Payload custom endpoint so each handler only contains its unique
 * logic. Handles the three repeated chores: collection-based auth, JSON body
 * parsing + Zod validation, and the error-response envelope.
 */
export function defineEndpoint<S extends z.ZodTypeAny | undefined = undefined>(
  opts: DefineEndpointOpts<S>,
): Endpoint {
  return {
    path: opts.path,
    method: opts.method,
    handler: async (req: PayloadRequest) => {
      if (opts.collection && req.user?.collection !== opts.collection) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 })
      }

      let body: unknown = undefined
      if (opts.body) {
        const raw: unknown = typeof req.json === 'function' ? await req.json() : undefined
        const parsed = opts.body.safeParse(raw)
        if (!parsed.success) {
          return Response.json(
            { error: 'Invalid body', issues: z.treeifyError(parsed.error) },
            { status: 400 },
          )
        }
        body = parsed.data
      }

      return opts.handler({
        req,
        body: body as S extends z.ZodTypeAny ? z.infer<S> : undefined,
      })
    },
  }
}
