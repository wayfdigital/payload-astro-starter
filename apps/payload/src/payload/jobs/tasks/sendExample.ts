import type { TaskConfig } from 'payload'
import { toLocale } from '@/i18n/const'
import { sendExampleEmail } from '@/email/utils/send'
import {
  buildExamplePlaceholderVars,
  substitutePlaceholders,
} from '@/email/utils/placeholders'
import {
  emailSettingsSchema,
  emailTemplateContentSchema,
  sendExampleInputSchema,
} from '@/schemas/email'

/**
 * Sends the `example` transactional email. Loads the editable copy + branding
 * from the CMS, substitutes `{placeholders}`, resolves one locale, and hands a
 * fully-resolved element to the send choke point. One job = one recipient.
 */
export const sendExampleTask: TaskConfig<'sendExample'> = {
  slug: 'sendExample',
  retries: 2,
  inputSchema: [
    { name: 'to', type: 'text', required: true },
    { name: 'templateKey', type: 'text' },
    { name: 'locale', type: 'text' },
    { name: 'recipientName', type: 'text' },
    { name: 'message', type: 'text' },
    { name: 'actionUrl', type: 'text' },
  ],
  outputSchema: [{ name: 'sent', type: 'checkbox' }],
  handler: async ({ input, req }) => {
    const { payload } = req
    const data = sendExampleInputSchema.parse(input)
    const key = data.templateKey ?? 'example'
    const locale = toLocale(data.locale ?? '')

    const settings = emailSettingsSchema.parse(
      await payload.findGlobal({ slug: 'email-settings', overrideAccess: true }),
    )

    const { docs } = await payload.find({
      collection: 'email-templates',
      where: { key: { equals: key } },
      locale,
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (docs.length === 0) {
      throw new Error(`No email-template found for key "${key}"`)
    }
    const tpl = emailTemplateContentSchema.parse(docs[0])

    const vars = buildExamplePlaceholderVars({
      recipientName: data.recipientName ?? undefined,
      siteName: settings.siteName,
      supportEmail: settings.supportEmail ?? undefined,
      message: data.message ?? undefined,
      actionUrl: data.actionUrl ?? undefined,
    })

    // Required copy (schema-guaranteed non-empty) vs. optional copy.
    const subReq = (text: string) => substitutePlaceholders(text, vars)
    const subOpt = (text: string | null | undefined) =>
      text ? substitutePlaceholders(text, vars) : undefined

    await sendExampleEmail(
      payload,
      {
        siteName: settings.siteName,
        logoUrl: settings.logoUrl ?? undefined,
        supportEmail: settings.supportEmail ?? undefined,
        previewText: subOpt(tpl.previewText),
        heading: subReq(tpl.heading),
        body: subReq(tpl.body),
        buttonText: subOpt(tpl.buttonText),
        buttonUrl: subOpt(tpl.buttonUrl),
      },
      {
        to: data.to,
        subject: subReq(tpl.subject),
        from: settings.fromAddress ?? undefined,
        fromName: settings.fromName ?? undefined,
      },
    )

    return { output: { sent: true } }
  },
}
