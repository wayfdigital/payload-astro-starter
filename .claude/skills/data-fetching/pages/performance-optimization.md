# Performance Optimization

## Practical Optimization Checklist

1. Narrow query payloads with `select`.
2. Push filtering/sorting to database with `where` and `sort`.
3. Add pagination (`limit`, `page`) for large datasets.
4. Parallelize independent fetches with `Promise.all`.
5. Use React `cache()` for server-side deduplication.
6. Choose ISR for highly cacheable pages.
7. Use proper cache headers for API responses used by client fetching.

## Examples

### Minimize payload size

```typescript
const products = await payload.find({
  collection: 'products',
  select: ['id', 'title', 'price', 'image'],
  limit: 20,
})
```

### Parallelize independent fetches

```typescript
const [hero, products, testimonials] = await Promise.all([
  getHero(),
  getProducts(),
  getTestimonials(),
])
```

### API cache headers

```typescript
return Response.json(data, {
  headers: {
    'cache-control': 'public, max-age=300',
  },
})
```

### ISR for dynamic route scaling

```typescript
export const revalidate = 3600
export const dynamicParams = true
```

## Verify Improvements

- Track LCP and TTFB before/after each change.
- Check DB query count and total query time in logs.
- Compare JS bundle size when introducing client-side fetching.
- Validate cache hit rates at edge/CDN layer where applicable.
