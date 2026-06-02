import { Container, Heading, Text } from '@/theme'
import type { PageContentSectionProps } from '../index'

type PageContent3VariantProps = Extract<PageContentSectionProps, { blockType: 'page-content-3' }>

export const PageContent3Variant = ({
  title,
  subtitle,
  audience,
}: PageContent3VariantProps) => {
  return (
    <section className="py-16">
      <Container size="md">
        {title ? (
          <Heading level={2} className="mb-4">
            {title}
          </Heading>
        ) : null}
        {subtitle ? (
          <Text variant="lead" className="mb-8 max-w-3xl">
            {subtitle}
          </Text>
        ) : null}
        {audience && audience.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {audience.map((item) => (
              <span
                key={item.id ?? item.title}
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor: 'var(--template-color-muted)',
                  color: 'var(--template-color-foreground)',
                }}
              >
                {item.title}
              </span>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
