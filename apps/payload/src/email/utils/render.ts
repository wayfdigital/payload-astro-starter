import * as React from 'react'
import { render } from '@react-email/render'

export interface EmailFormats {
  html: string
  text: string
}

/**
 * Renders a React Email element to both an HTML string (CSS auto-inlined for
 * clients that strip `<style>`) and a plain-text fallback, in parallel. Every
 * `send*Email` helper goes through here so both parts are always produced.
 */
export async function renderToEmailFormats(
  element: React.ReactElement,
): Promise<EmailFormats> {
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ])
  return { html, text }
}
