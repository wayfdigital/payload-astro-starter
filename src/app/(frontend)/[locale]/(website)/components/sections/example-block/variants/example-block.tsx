import { Container, Heading, Text, Button } from '@/theme'
import type { ExampleBlockSectionProps } from '../index'

export const ExampleBlockVariant = ({
  title,
  description,
  ctaText,
  ctaUrl,
}: ExampleBlockSectionProps) => {
  return (
    <section className="py-16">
      <Container size="md">
        <div
          className="rounded-2xl border p-8 md:p-10"
          style={{
            borderColor: 'var(--template-color-border)',
            backgroundColor: 'var(--template-color-surface)',
          }}
        >
          <Heading level={2} className="mb-3">
            {title}
          </Heading>
          {description ? (
            <Text className="mb-6">{description}</Text>
          ) : null}
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
