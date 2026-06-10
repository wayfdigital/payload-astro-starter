import type { ReactNode } from 'react'
import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Text } from '../../elements/text'

export interface ExampleProps {
  title: string
  description?: string
  /** CTA slot — the consumer builds the button/link. */
  action?: ReactNode
}

/** A titled card with optional description and CTA. (exampleBlock layout) */
export function Example({ title, description, action }: ExampleProps) {
  return (
    <section className="py-16">
      <Container size="md">
        <div
          className="rounded-2xl border p-8 md:p-10"
          style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
        >
          <Heading level={2} className="mb-3">
            {title}
          </Heading>
          {description && <Text className="mb-6">{description}</Text>}
          {action}
        </div>
      </Container>
    </section>
  )
}
