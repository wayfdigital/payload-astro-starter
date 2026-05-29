import { EmailAdapter } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

export const mailOptions: EmailAdapter | Promise<EmailAdapter> = nodemailerAdapter({
  defaultFromAddress: 'example@example.com',
  defaultFromName: 'Example',
  transportOptions: {
    host: process.env.SMTP_HOST,
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
})
