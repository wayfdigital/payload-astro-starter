import type { FieldAccess } from 'payload'

export const isAdmin: FieldAccess = ({ req }) => {
  return req.user?.collection === 'admins'
}
