# Patterns

## Pattern 1: Full SSR

### Use when

- SEO is critical.
- Content is mostly read-only per request.
- Best first-load experience matters most.

### Example

```typescript
import { getHeroContent, getTestimonials } from '@/lib/payload'

export default async function HomePage() {
  const [hero, testimonials] = await Promise.all([
    getHeroContent(),
    getTestimonials(),
  ])

  return (
    <main>
      <HeroSection {...hero} />
      <TestimonialsSection testimonials={testimonials} />
    </main>
  )
}
```

### Trade-offs

- Pros: SEO, complete first HTML, low client JS.
- Cons: updates require re-render/reload; slower if queries are sequential/unoptimized.

## Pattern 2: ISR + On-Demand Revalidation

### Use when

- Content changes occasionally via CMS.
- You want static speed and controlled freshness.

### Example

```typescript
export const revalidate = false

export default async function HomePage() {
  const [hero, testimonials] = await Promise.all([
    getHeroContent(),
    getTestimonials(),
  ])
  return <Homepage hero={hero} testimonials={testimonials} />
}
```

```typescript
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const secret = request.headers.get('x-webhook-secret')
  if (secret !== process.env.PAYLOAD_WEBHOOK_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  revalidatePath('/')
  return Response.json({ revalidated: true })
}
```

### Trade-offs

- Pros: instant cached responses and near-immediate freshness on webhook.
- Cons: requires robust webhook setup and auth.

## Pattern 3: Server Components + Server Actions

### Use when

- Server-trusted calculations/mutations are needed.
- You want dynamic UX without building separate API endpoints for each interaction.

### Example

```typescript
'use server'

import { redirect } from 'next/navigation'

export async function selectCountry(country: string) {
  redirect(`/checkout?country=${country}`)
}
```

```typescript
'use client'

import { selectCountry } from '@/app/actions/checkout'
import { useTransition } from 'react'

export function CountrySelector({ currentCountry }: { currentCountry: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      defaultValue={currentCountry}
      disabled={isPending}
      onChange={(e) => startTransition(async () => selectCountry(e.target.value))}
    >
      <option value="US">United States</option>
      <option value="DE">Germany</option>
    </select>
  )
}
```

### Trade-offs

- Pros: secure server logic, straightforward mental model.
- Cons: often requires server round-trip and re-render for each mutation.

## Pattern 4: Client-Side with TanStack Query

### Use when

- High-frequency interactions need immediate UI feedback.
- SEO is secondary (dashboards/internal tools).

### Example

```typescript
'use client'

import { useQuery } from '@tanstack/react-query'

export function ProductsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  })

  if (isLoading) return <p>Loading...</p>
  return <ProductGrid products={data.products} />
}
```

### Trade-offs

- Pros: responsive UX, cache reuse, background refetch.
- Cons: extra client JS and SEO limitations if critical content is client-only.
