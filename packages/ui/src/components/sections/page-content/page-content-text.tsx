import type { ReactNode } from 'react'
import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Text } from '../../elements/text'

export interface PageContentTextProps {
  title?: string
  subtitle?: string
  content?: string
  /** CTA slot — the consumer builds the button/link. */
  action?: ReactNode
}

/** Heading + lead + body copy with an optional CTA. (page-content-1 layout) */
export function PageContentText({ title, subtitle, content, action }: PageContentTextProps) {
  return (
    <section className="py-16">
      <Container size="md">
        {title && (
          <Heading level={2} className="mb-4">
            {title}
          </Heading>
        )}
        {subtitle && (
          <Text variant="lead" className="mb-8 max-w-3xl">
            {subtitle}
          </Text>
        )}
        {content && <Text className="mb-6">{content}</Text>}
        {action}
      </Container>
    </section>
  )
}
