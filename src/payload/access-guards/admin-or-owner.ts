import { AccessArgs, CollectionConfig, CollectionSlug } from 'payload'
import { z } from 'zod'

const routeParamsParser = z.object({
  collection: z.string(),
})

const ownerPropertyCheck = z.object({
  owner: z.string(),
})

const adminOrOwner = async ({
  req,
  id,
}: AccessArgs): Promise<boolean> => {
  if (req.user?.collection === 'admins') return true

  const parsedRouteParams = routeParamsParser.safeParse(req.routeParams)
  if (!parsedRouteParams.success) return false

  const collection = parsedRouteParams.data.collection as CollectionSlug

  if (id) {
    const collectionItem = await req.payload.findByID({
      collection,
      id,
    })

    const owner = ownerPropertyCheck.safeParse(collectionItem)
    return owner.data?.owner === req.user?.id
  }

  return false
}

export const AdminOrOwnerAccessGuard: CollectionConfig['access'] = {
  admin: adminOrOwner,
  create: adminOrOwner,
  read: () => true,
  readVersions: adminOrOwner,
  unlock: adminOrOwner,
  update: adminOrOwner,
}
