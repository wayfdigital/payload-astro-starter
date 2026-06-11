import * as React from 'react'
import { Button, Section } from '@react-email/components'

export interface EmailButtonProps {
  href: string
  children: React.ReactNode
}

/** Centered call-to-action button used across templates. */
export function EmailButton({ href, children }: EmailButtonProps) {
  return (
    <Section style={{ padding: '8px 0 8px' }}>
      <Button href={href} style={button}>
        {children}
      </Button>
    </Section>
  )
}

const button: React.CSSProperties = {
  backgroundColor: '#18181b',
  borderRadius: 6,
  color: '#ffffff',
  display: 'inline-block',
  fontSize: 14,
  fontWeight: 600,
  padding: '12px 20px',
  textDecoration: 'none',
}
