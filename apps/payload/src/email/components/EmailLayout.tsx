import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

export interface EmailLayoutProps {
  /** Text shown in the inbox preview line (before the body is opened). */
  previewText?: string
  /** Optional brand logo, rendered at the top. */
  logoUrl?: string
  /** Brand / site name, used in the footer and as logo alt text. */
  siteName: string
  /** Support address shown in the footer. */
  supportEmail?: string
  children: React.ReactNode
}

/**
 * Outlook-safe shell shared by every email template. Spacing and backgrounds
 * use simple block layout with inline styles because most email clients strip
 * `<style>` blocks and ignore modern CSS.
 */
export function EmailLayout({
  previewText,
  logoUrl,
  siteName,
  supportEmail,
  children,
}: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Body style={body}>
        <Container style={container}>
          {logoUrl ? (
            <Section style={{ paddingBottom: 24 }}>
              <Img src={logoUrl} alt={siteName} height={40} style={{ height: 40, width: 'auto' }} />
            </Section>
          ) : null}

          {children}

          <Hr style={hr} />
          <Section>
            <Text style={footer}>
              © {siteName}
              {supportEmail ? (
                <>
                  {' · '}
                  <Link href={`mailto:${supportEmail}`} style={footerLink}>
                    {supportEmail}
                  </Link>
                </>
              ) : null}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const body: React.CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: '24px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  borderRadius: 8,
  margin: '0 auto',
  maxWidth: 560,
  padding: 32,
}

const hr: React.CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '32px 0 16px',
}

const footer: React.CSSProperties = {
  color: '#71717a',
  fontSize: 12,
  lineHeight: '18px',
  margin: 0,
}

const footerLink: React.CSSProperties = {
  color: '#71717a',
}
