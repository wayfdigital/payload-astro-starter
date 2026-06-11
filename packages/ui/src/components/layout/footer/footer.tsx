import type { ReactNode } from 'react'
import { Container } from '../../elements/container'

export interface FooterProps {
  copyright?: string
  children?: ReactNode
}

export function Footer({ copyright, children }: FooterProps) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--card)',
      }}
    >
      <Container>
        <div className="flex flex-col gap-6 py-12">
          {children}
          {copyright && (
            <>
              <hr className="ui-divider" />
              <p
                className="text-xs tracking-wide"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {copyright}
              </p>
            </>
          )}
        </div>
      </Container>
    </footer>
  )
}
