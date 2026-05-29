import { z } from 'zod'

export const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(
    /^\+\d{1,3}\s?\d{4,14}$/,
    'Phone number must start with + and country code (e.g., +48 123456789, +49 1234567890)'
  )

export const optionalPhoneNumberSchema = z
  .string()
  .optional()
  .refine(
    (val) => !val || /^\+\d{1,3}\s?\d{4,14}$/.test(val),
    'Phone number must start with + and country code (e.g., +48 123456789, +49 1234567890)'
  )
