import { z } from 'zod'

/**
 * Strict shape of a CMS `email-templates` doc, in a single resolved locale.
 * Missing required copy throws at parse time so a send job fails visibly in the
 * Jobs view rather than dispatching a half-empty email.
 */
export const emailTemplateContentSchema = z.object({
  subject: z.string().min(1),
  previewText: z.string().nullish(),
  heading: z.string().min(1),
  body: z.string().min(1),
  buttonText: z.string().nullish(),
  buttonUrl: z.string().nullish(),
})
export type EmailTemplateContent = z.infer<typeof emailTemplateContentSchema>

/** Strict shape of the `email-settings` global (branding + sender identity). */
export const emailSettingsSchema = z.object({
  siteName: z.string().min(1),
  fromName: z.string().nullish(),
  fromAddress: z.string().nullish(),
  supportEmail: z.string().nullish(),
  logoUrl: z.string().nullish(),
})
export type EmailSettingsContent = z.infer<typeof emailSettingsSchema>

/** Input accepted by the `sendExample` job. */
export const sendExampleInputSchema = z.object({
  to: z.string().min(1),
  templateKey: z.string().nullish(),
  locale: z.string().nullish(),
  recipientName: z.string().nullish(),
  message: z.string().nullish(),
  actionUrl: z.string().nullish(),
})
export type SendExampleInput = z.infer<typeof sendExampleInputSchema>

/**
 * Body accepted by the `POST /api/send-example-email` trigger. Unlike the job
 * input, `to` accepts one address or a non-empty array (the endpoint fans out
 * one job per recipient).
 */
export const sendExampleEmailBodySchema = z.object({
  to: z.union([z.email(), z.array(z.email()).min(1)]),
  templateKey: z.string().optional(),
  locale: z.string().optional(),
  recipientName: z.string().optional(),
  message: z.string().optional(),
  actionUrl: z.string().optional(),
})
export type SendExampleEmailBody = z.infer<typeof sendExampleEmailBodySchema>
