import { CollectionConfig, PayloadRequest } from 'payload'

const adminOnly = ({ req }: { req: PayloadRequest }): boolean => {
  return req.user?.collection === 'admins'
}

export const AdminOnlyAccessGuard: CollectionConfig['access'] = {
  admin: adminOnly,
  create: adminOnly,
  read: adminOnly,
  readVersions: adminOnly,
  unlock: adminOnly,
  update: adminOnly,
}
