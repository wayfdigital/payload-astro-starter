'use client'

import { useEffect } from 'react'
import { Container, Heading, Text, Button } from '@/theme'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <section className="flex flex-1 items-center justify-center py-20">
      <Container size="sm">
        <div className="flex flex-col items-center gap-6 text-center">
          <Heading level={2}>Something went wrong</Heading>
          <Text variant="muted">
            An unexpected error occurred. Please try again.
          </Text>
          <Button onClick={reset}>Try again</Button>
        </div>
      </Container>
    </section>
  )
}
