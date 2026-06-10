import { Container } from '../../elements/container'
import { Heading } from '../../elements/heading'
import { Text } from '../../elements/text'

export interface PageContentTag {
  id?: string
  label: string
}

export interface PageContentTagsProps {
  title?: string
  subtitle?: string
  tags?: readonly PageContentTag[]
}

/** Heading + lead with a wrapping row of pill tags. (page-content-3 layout) */
export function PageContentTags({ title, subtitle, tags }: PageContentTagsProps) {
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
        {tags && tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {tags.map((tag) => (
              <span
                key={tag.id ?? tag.label}
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{ backgroundColor: 'var(--muted)', color: 'var(--foreground)' }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
