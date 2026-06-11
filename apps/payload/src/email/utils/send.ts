import * as React from 'react'
import type { BasePayload } from 'payload'
import { renderToEmailFormats } from './render'
import { ExampleEmail, type ExampleEmailProps } from '../templates/example'

export interface SendOptions {
  to: string | string[]
  cc?: string | string[]
  subject: string
  /** Optional From overrides; otherwise the adapter's defaults apply. */
  from?: string
  fromName?: string
}

/**
 * The single choke point for outgoing email. Renders an element to
 * `{ html, text }` and hands it to `payload.sendEmail`. The adapter
 * (`config/mail.ts`) decides the transport — Mailpit in dev. Nothing else in
 * the app should call `payload.sendEmail` for these templates.
 */
async function send(
  payload: BasePayload,
  element: React.ReactElement,
  options: SendOptions,
): Promise<void> {
  const { html, text } = await renderToEmailFormats(element)
  const from =
    options.from && options.fromName
      ? `${options.fromName} <${options.from}>`
      : options.from
  await payload.sendEmail({
    to: options.to,
    cc: options.cc,
    subject: options.subject,
    html,
    text,
    ...(from ? { from } : {}),
  })
}

/** Renders + sends the example template. One typed function per template. */
export async function sendExampleEmail(
  payload: BasePayload,
  props: ExampleEmailProps,
  options: SendOptions,
): Promise<void> {
  await send(payload, React.createElement(ExampleEmail, props), options)
}
