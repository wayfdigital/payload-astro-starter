import { Container, Heading, Text, Button } from '@repo/ui'
import type { ExampleBlock } from '@repo/payload-types'

/**
 * Renders an `exampleBlock` layout section — a titled card with optional
 * description and CTA. Mirrors the block defined in
 * `apps/payload/src/payload/blocks/example-block.ts`.
 */
export const ExampleBlockSection = ({ title, description, ctaText, ctaUrl }: ExampleBlock) => {
  return (
    <section className="py-16">
      <Container size="md">
        <div
          className="rounded-2xl border p-8 md:p-10"
          style={{
            borderColor: 'var(--border)',
            backgroundColor: 'var(--card)',
          }}
        >
          <Heading level={2} className="mb-3">
            {title}
          </Heading>
          {description ? <Text className="mb-6">{description}</Text> : null}
          {ctaText ? (
            <a href={ctaUrl ?? '/'}>
              <Button>{ctaText}</Button>
            </a>
          ) : null}
        </div>
      </Container>
    </section>
  )
}

export default ExampleBlockSection
