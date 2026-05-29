import { Container, Heading, Text, Button } from '@/ui-template'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Container size="sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <Heading level={1}>404</Heading>
          <Heading level={2}>Page not found</Heading>
          <Text variant="muted">
            The page you are looking for does not exist.
          </Text>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </Container>
    </div>
  )
}
