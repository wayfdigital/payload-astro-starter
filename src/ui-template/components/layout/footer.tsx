import type { ReactNode } from 'react'
import { Container } from '../elements/container'

export interface FooterProps {
  copyright?: string
  children?: ReactNode
}

export function Footer({ copyright, children }: FooterProps) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--template-color-border)',
        backgroundColor: 'var(--template-color-surface)',
      }}
    >
      <Container>
        <div className="flex flex-col gap-6 py-12">
          {children}
          {copyright && (
            <>
              <hr className="template-divider" />
              <p
                className="text-xs tracking-wide"
                style={{ color: 'var(--template-color-muted-foreground)' }}
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
