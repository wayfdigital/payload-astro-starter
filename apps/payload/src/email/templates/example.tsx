import * as React from 'react'
import { Heading, Text } from '@react-email/components'
import { EmailLayout } from '../components/EmailLayout'
import { EmailButton } from '../components/EmailButton'

/**
 * Example transactional template — pure presentation. Every string is already
 * resolved by the caller (the send task): CMS lookup, placeholder substitution
 * and locale selection all happen *before* this element is constructed. No
 * fetching, fallbacks or locale branches live in here.
 */
export interface ExampleEmailProps {
  /** Inbox preview line. */
  previewText?: string
  /** Branding for the shared layout. */
  siteName: string
  logoUrl?: string
  supportEmail?: string
  /** Resolved copy. */
  heading: string
  body: string
  /** Optional call-to-action. Both fields must be present to render the button. */
  buttonText?: string
  buttonUrl?: string
}

export function ExampleEmail({
  previewText,
  siteName,
  logoUrl,
  supportEmail,
  heading,
  body,
  buttonText,
  buttonUrl,
}: ExampleEmailProps) {
  return (
    <EmailLayout
      previewText={previewText}
      siteName={siteName}
      logoUrl={logoUrl}
      supportEmail={supportEmail}
    >
      <Heading style={headingStyle}>{heading}</Heading>
      {body.split('\n').map((line, i) => (
        <Text key={i} style={textStyle}>
          {line}
        </Text>
      ))}
      {buttonText && buttonUrl ? (
        <EmailButton href={buttonUrl}>{buttonText}</EmailButton>
      ) : null}
    </EmailLayout>
  )
}

const headingStyle: React.CSSProperties = {
  color: '#18181b',
  fontSize: 22,
  fontWeight: 700,
  margin: '0 0 16px',
}

const textStyle: React.CSSProperties = {
  color: '#3f3f46',
  fontSize: 15,
  lineHeight: '24px',
  margin: '0 0 12px',
}
