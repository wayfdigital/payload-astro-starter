import { z } from 'zod'

export const recaptchaResponseSchema = z.object({
  success: z.boolean(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
})

export const recaptchaValidationSchema = z.object({
  recaptcha: z.string().min(1, 'Please complete the reCAPTCHA'),
  form: z.string().optional(),
})

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.NEXT_PRIVATE_RECAPTCHA_SECRET_KEY || ''

  if (!secretKey) {
    throw new Error('reCAPTCHA secret key not configured')
  }

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: 'POST' }
  )

  const data = await response.json()
  const parsed = recaptchaResponseSchema.safeParse(data)

  return parsed.success && parsed.data.success
}

export type RecaptchaResponse = z.infer<typeof recaptchaResponseSchema>
export type RecaptchaValidation = z.infer<typeof recaptchaValidationSchema>
