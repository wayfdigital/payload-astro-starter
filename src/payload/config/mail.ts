import { EmailAdapter } from 'payload'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

// Defaults target Mailpit from docker-compose (SMTP on localhost:1025, no auth).
// In production set SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS.
const host = process.env.SMTP_HOST ?? 'localhost'
const port = Number(process.env.SMTP_PORT) || 1025
const user = process.env.SMTP_USER
const pass = process.env.SMTP_PASS

export const mailOptions: EmailAdapter | Promise<EmailAdapter> = nodemailerAdapter({
  defaultFromAddress: process.env.SMTP_FROM_ADDRESS ?? 'example@example.com',
  defaultFromName: process.env.SMTP_FROM_NAME ?? 'Example',
  transportOptions: {
    host,
    port,
    secure: port === 465,
    // Mailpit accepts mail without credentials; only send auth when provided.
    auth: user && pass ? { user, pass } : undefined,
  },
})
