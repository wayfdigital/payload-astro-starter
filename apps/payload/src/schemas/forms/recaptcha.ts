import { z } from 'zod'

/**
 * Minimum reCAPTCHA v3 score (0.0 = bot … 1.0 = human) to accept a submission.
 * v2 ("I'm not a robot") responses carry no score, so this only gates v3 tokens.
 */
const MIN_RECAPTCHA_SCORE = 0.5

export const recaptchaResponseSchema = z.object({
  success: z.boolean(),
  score: z.number().optional(),
  action: z.string().optional(),
  challenge_ts: z.string().optional(),
  hostname: z.string().optional(),
  'error-codes': z.array(z.string()).optional(),
})

export const recaptchaValidationSchema = z.object({
  recaptcha: z.string().min(1, 'Please complete the reCAPTCHA'),
  form: z.string().optional(),
})

export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.NEXT_PRIVATE_RECAPTCHA_SECRET_KEY ?? ''

  if (!secretKey) {
    throw new Error('reCAPTCHA secret key not configured')
  }

  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
    { method: 'POST' }
  )

  const data: unknown = await response.json()
  const parsed = recaptchaResponseSchema.safeParse(data)

  if (!parsed.success || !parsed.data.success) {
    return false
  }

  // v3 returns a score — reject low-confidence (likely-bot) tokens.
  // v2 has no score, so a valid token alone is enough.
  if (typeof parsed.data.score === 'number') {
    return parsed.data.score >= MIN_RECAPTCHA_SCORE
  }

  return true
}

export type RecaptchaResponse = z.infer<typeof recaptchaResponseSchema>
export type RecaptchaValidation = z.infer<typeof recaptchaValidationSchema>
