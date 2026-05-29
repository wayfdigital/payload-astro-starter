import { Container, Heading, Text } from '@/ui-template'
import type { PageContentSectionProps } from '../index'

type PageContent2VariantProps = Extract<PageContentSectionProps, { blockType: 'page-content-2' }>

export const PageContent2Variant = ({
  title,
  subtitle,
  items,
}: PageContent2VariantProps) => {
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
        {items && items.length > 0 ? (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id ?? item.title}
                className="rounded-lg border p-6"
                style={{
                  borderColor: 'var(--template-color-border)',
                  backgroundColor: 'var(--template-color-surface)',
                }}
              >
                {item.title ? (
                  <Heading level={3} className="mb-2">
                    {item.title}
                  </Heading>
                ) : null}
                {item.content ? <Text>{item.content}</Text> : null}
                {item.linkText && item.linkUrl ? (
                  <a
                    href={item.linkUrl}
                    className="mt-4 inline-block text-sm font-medium"
                    style={{ color: 'var(--template-color-primary)' }}
                  >
                    {item.linkText} &rarr;
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </Container>
    </section>
  )
}
