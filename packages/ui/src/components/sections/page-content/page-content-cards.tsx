import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Text } from '../../elements/text'

export interface PageContentCardItem {
  id?: string
  title?: string
  content?: string
  linkText?: string
  linkHref?: string
}

export interface PageContentCardsProps {
  title?: string
  subtitle?: string
  items?: readonly PageContentCardItem[]
}

/** Heading + lead with a responsive grid of bordered cards. (page-content-2 layout) */
export function PageContentCards({ title, subtitle, items }: PageContentCardsProps) {
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
        {items && items.length > 0 && (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <div
                key={item.id ?? item.title}
                className="rounded-lg border p-6"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
              >
                {item.title && (
                  <Heading level={3} className="mb-2">
                    {item.title}
                  </Heading>
                )}
                {item.content && <Text>{item.content}</Text>}
                {item.linkText && item.linkHref && (
                  <a
                    href={item.linkHref}
                    className="mt-4 inline-block text-sm font-medium"
                    style={{ color: 'var(--primary)' }}
                  >
                    {item.linkText} &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
