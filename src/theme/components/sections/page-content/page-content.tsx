import type { ReactNode } from 'react'
import { Container } from '../../elements/container'

export interface PageContentProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function PageContent({ children, size = 'md' }: PageContentProps) {
  return (
    <section className="py-[var(--template-spacing-2xl)]">
      <Container size={size}>
        <div className="prose max-w-none text-[var(--template-color-foreground)]">
          {children}
        </div>
      </Container>
    </section>
  )
}
