import { Container, Heading, Text, Button } from '@/theme'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-center py-20">
      <Container size="sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <Heading level={1}>404</Heading>
          <Heading level={3}>Page not found</Heading>
          <Text variant="muted">
            The page you are looking for does not exist or has been moved.
          </Text>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Container>
    </section>
  )
}
