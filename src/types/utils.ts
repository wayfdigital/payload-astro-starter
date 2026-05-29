import type { z, ZodSchema } from 'zod'

export type Schemas = Record<string, { input: ZodSchema; output: ZodSchema }>

export type InferSchemas<T extends Schemas = Schemas> = {
  [Property in keyof T]: {
    input: z.infer<T[Property]['input']>
    output: z.infer<T[Property]['output']>
  }
}

export type QueryKeys<TSchemas extends InferSchemas> = {
  [Property in keyof TSchemas]: (
    params: TSchemas[Property]['input']
  ) => Array<string>
}

export type ServerService<TSchemas extends InferSchemas> = {
  [Property in keyof TSchemas]: (
    params: TSchemas[Property]['input']
  ) => Promise<TSchemas[Property]['output']>
}
