import { Container, Heading, Text } from '@repo/ui'
import type { PageContentSectionProps } from '../index'

type PageContent1VariantProps = Extract<PageContentSectionProps, { blockType: 'page-content-1' }>

export const PageContent1Variant = ({
  title,
  subtitle,
  content,
  buttonText,
  buttonLink,
}: PageContent1VariantProps) => {
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
        {content ? <Text className="mb-6">{content}</Text> : null}
        {buttonText && buttonLink ? (
          <a
            href={buttonLink}
            className="inline-flex items-center rounded-md px-6 py-3 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
            }}
          >
            {buttonText}
          </a>
        ) : null}
      </Container>
    </section>
  )
}

export default PageContent1Variant
