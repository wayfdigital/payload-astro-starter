import { z } from 'zod'

export const PaginatedResponseSchema = <T extends z.ZodType>(schema: T) =>
  z.object({
    docs: z.array(schema),
    totalDocs: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    page: z.number(),
    pagingCounter: z.number(),
    hasPrevPage: z.boolean(),
    hasNextPage: z.boolean(),
    prevPage: z.number().nullable(),
    nextPage: z.number().nullable(),
  })

export const BaseQueryParamsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  sort: z.string().optional(),
  where: z.record(z.string(), z.unknown()).optional(),
  depth: z.number().optional(),
})

export const ErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
  errors: z.array(
    z.object({
      message: z.string(),
      field: z.string().optional(),
    })
  ),
})

export type QueryParams = z.infer<typeof BaseQueryParamsSchema>
export type PaginatedResponse<T> = z.infer<ReturnType<typeof PaginatedResponseSchema<z.ZodType<T>>>>
