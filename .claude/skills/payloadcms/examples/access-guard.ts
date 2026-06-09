// Reusable, typed access guards. Auth is split across `admins` and `users`, so
// always check `req.user?.collection`.
import type { Access, FieldAccess } from 'payload'

/** True only for authenticated admins. */
export const isAdmin: FieldAccess = ({ req }) => req.user?.collection === 'admins'

/** Collection-level: only admins may write. */
export const adminOnly: Access = ({ req }) => req.user?.collection === 'admins'

/**
 * Read/update/delete guard: admins see everything; a regular user only their own
 * rows. Returns a `Where` so Payload scopes the query at the DB level.
 */
export const adminOrOwner: Access = ({ req }) => {
  if (req.user?.collection === 'admins') return true
  if (!req.user) return false
  return { owner: { equals: req.user.id } }
}
