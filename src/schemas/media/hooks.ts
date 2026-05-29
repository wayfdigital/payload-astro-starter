import { z } from 'zod'
import type { Media as PayloadMedia } from '@/payload-types'
import {
  PaginatedResponseSchema,
  BaseQueryParamsSchema,
  type QueryParams,
} from '@/schemas/common/base'
import type { InferSchemas, Schemas } from '@/types/utils'

export const mediaSchema = z.object({
  id: z.string(),
  alt: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  url: z.string().optional().nullable(),
  thumbnailURL: z.string().optional().nullable(),
  filename: z.string().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  filesize: z.number().optional().nullable(),
  width: z.number().optional().nullable(),
  height: z.number().optional().nullable(),
})
export type Media = z.infer<typeof mediaSchema>

export const mediaQueryParamsSchema = BaseQueryParamsSchema
export type MediaQueryParams = QueryParams

export const paginatedMediaResponseSchema = PaginatedResponseSchema(mediaSchema)
export type PaginatedMediaResponse = z.infer<typeof paginatedMediaResponseSchema>

export type UploadSchemas = InferSchemas<typeof uploadSchemas>

export const uploadSchemas = {
  uploadMedia: {
    input: z.object({
      alt: z.string().min(1, 'Alt text is required'),
      file: z.instanceof(File),
    }),
    output: z
      .object({
        id: z.number(),
        alt: z.string(),
        url: z.string().url(),
        filename: z.string(),
        mimeType: z.string(),
        filesize: z.number(),
        width: z.number().optional(),
        height: z.number().optional(),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime(),
      })
      .passthrough(),
  },
} satisfies Schemas
