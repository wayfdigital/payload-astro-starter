import { PayloadRequest, Plugin } from 'payload'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { revalidateTag } from 'next/cache'
import { z } from 'zod'
import { verifyRecaptcha } from '@/schemas/forms'

const recaptchaSiblingSchema = z.object({ form: z.string() })
const formRecaptchaSchema = z.object({ requireRecaptcha: z.boolean() }).partial()

export const formBuilderPluginConfig: Plugin = formBuilderPlugin({
  fields: {
    payment: false,
  },
  formOverrides: {
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'customID',
        type: 'text',
        admin: {
          description: 'Attached to submission button to track clicks',
          position: 'sidebar',
        },
        label: 'Custom ID',
      },
      {
        name: 'requireRecaptcha',
        type: 'checkbox',
        defaultValue: true,
        admin: { position: 'sidebar' },
        label: 'Require reCAPTCHA',
      },
    ],
    hooks: {
      afterChange: [
        ({ doc }) => {
          const formDoc: unknown = doc
          const parsed = z.object({ title: z.string() }).safeParse(formDoc)
          if (parsed.success) {
            revalidateTag(`form-${parsed.data.title}`)
          }
        },
      ],
    },
  },
  formSubmissionOverrides: {
    fields: ({ defaultFields }) => [
      ...defaultFields,
      {
        name: 'recaptcha',
        type: 'text',
        validate: async (
          value: unknown,
          {
            req,
            siblingData,
          }: { req: PayloadRequest; siblingData: Record<string, unknown> }
        ) => {
          const sibling = recaptchaSiblingSchema.safeParse(siblingData)
          if (!sibling.success) return true

          const form = await req.payload.findByID({
            id: sibling.data.form,
            collection: 'forms',
          })
          const formConfig = formRecaptchaSchema.safeParse(form)
          if (!formConfig.success || !formConfig.data.requireRecaptcha) return true

          if (!value || typeof value !== 'string')
            return 'Please complete the reCAPTCHA'

          try {
            const isValid = await verifyRecaptcha(value)
            return isValid || 'Invalid captcha'
          } catch {
            return 'Captcha verification failed'
          }
        },
      },
    ],
  },
})
