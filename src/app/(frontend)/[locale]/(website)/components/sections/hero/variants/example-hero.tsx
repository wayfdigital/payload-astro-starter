import { Container, Heading, Text, Button } from '@/theme'
import type { ExamplePageHero } from '../index'

type ExampleHeroProps = Omit<ExamplePageHero, 'type'>

const ExampleHero = ({ eyebrow, title, description, cta }: ExampleHeroProps) => {
  return (
    <section className="py-20">
      <Container size="md">
        {eyebrow ? (
          <Text className="mb-3 text-sm font-semibold uppercase tracking-wider">
            {eyebrow}
          </Text>
        ) : null}
        <Heading level={1} className="mb-4">
          {title ?? ''}
        </Heading>
        {description ? (
          <Text variant="lead" className="mb-8 max-w-2xl">
            {description}
          </Text>
        ) : null}
        {cta?.enabled && cta.text ? (
          <a href={cta.url ?? '/'}>
            <Button>{cta.text}</Button>
          </a>
        ) : null}
      </Container>
    </section>
  )
}

export default ExampleHero
